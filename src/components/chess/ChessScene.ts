import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Color, PieceSymbol, Square } from 'chess.js';
import {
  buildPieceMesh,
  createPieceGeometryCache,
  type PieceGeometryCache,
} from './stauntonGeometry';

export type CameraPreset = 'white' | 'black' | 'top' | 'side';

export interface BoardPieceData {
  square: Square;
  type: PieceSymbol;
  color: Color;
}

export interface MoveAnimationSpec {
  from: Square;
  to: Square;
  pieceType: PieceSymbol;
  pieceColor: Color;
  promotion?: PieceSymbol;
  capturedSquare?: Square;
  castlingRook?: { from: Square; to: Square };
}

export interface HighlightState {
  selected: Square | null;
  legalTargets: { square: Square; isCapture: boolean }[];
  lastMove: { from: Square; to: Square } | null;
  hint: { from: Square; to: Square } | null;
  checkSquare: Square | null;
}

interface ActiveMoveAnim {
  mesh: THREE.Group;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  liftHeight: number;
  startTime: number;
  duration: number;
  onComplete?: () => void;
}

interface ActiveFadeAnim {
  mesh: THREE.Group;
  startTime: number;
  duration: number;
}

interface CameraTransition {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endTarget: THREE.Vector3;
  startTime: number;
  duration: number;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;
const BOARD_TOP_Y = 0.0;

export function squareToWorld(square: Square): THREE.Vector3 {
  const fileIdx = square.charCodeAt(0) - 97; // 0..7 (a..h)
  const rankIdx = parseInt(square[1], 10) - 1; // 0..7 (1..8)
  return new THREE.Vector3(fileIdx - 3.5, BOARD_TOP_Y, 3.5 - rankIdx);
}

function createWoodGrainTexture(baseHex: string, grainHex: string, seed: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = grainHex;
    ctx.globalAlpha = 0.14;
    for (let i = 0; i < 42; i++) {
      const y = ((i * 6.3 + seed * 17) % 256);
      ctx.lineWidth = 1 + (i % 3);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 32) {
        const wave = Math.sin((x + seed * 31 + i * 19) * 0.035) * 3.2;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createCoordinateStripTexture(
  labels: readonly string[],
  textColor: string,
  reverse = false,
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = textColor;
    ctx.font = '600 44px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const list = reverse ? [...labels].reverse() : [...labels];
    const step = canvas.width / list.length;
    list.forEach((label, idx) => {
      ctx.fillText(label, step * idx + step / 2, canvas.height / 2);
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export class ChessScene {
  private container: HTMLElement;
  private onSquareClick: (square: Square) => void;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();

  private geometryCache: PieceGeometryCache;
  private piecesGroup = new THREE.Group();
  private squareMeshes: THREE.Mesh[] = [];
  private squareMeshMap = new Map<Square, THREE.Mesh>();
  private pieceEntries = new Map<Square, { mesh: THREE.Group; type: PieceSymbol; color: Color }>();

  // Materials & disposable textures
  private lightSquareMat: THREE.MeshStandardMaterial;
  private darkSquareMat: THREE.MeshStandardMaterial;
  private frameMat: THREE.MeshStandardMaterial;
  private trimMat: THREE.MeshStandardMaterial;
  private whitePieceMat: THREE.MeshStandardMaterial;
  private blackPieceMat: THREE.MeshStandardMaterial;
  private coordMeshes: THREE.Mesh[] = [];
  private disposableGeos: THREE.BufferGeometry[] = [];
  private disposableMats: THREE.Material[] = [];
  private disposableTextures: THREE.Texture[] = [];

  // Highlight meshes
  private highlightGroup = new THREE.Group();
  private selectedMesh: THREE.Mesh;
  private hoverMesh: THREE.Mesh;
  private checkMesh: THREE.Mesh;
  private legalGroup = new THREE.Group();
  private lastMoveGroup = new THREE.Group();
  private hintGroup = new THREE.Group();

  // Shared highlight geometries & materials
  private ringGeo: THREE.RingGeometry;
  private dotGeo: THREE.CircleGeometry;
  private squareOverlayGeo: THREE.PlaneGeometry;
  private legalRingMat: THREE.MeshBasicMaterial;
  private legalDotMat: THREE.MeshBasicMaterial;
  private captureRingMat: THREE.MeshBasicMaterial;
  private lastMoveMat: THREE.MeshBasicMaterial;
  private hintRingMat: THREE.MeshBasicMaterial;

  // Animations & camera
  private moveAnims: ActiveMoveAnim[] = [];
  private fadeAnims: ActiveFadeAnim[] = [];
  private cameraTransition: CameraTransition | null = null;
  private rafId = 0;
  private resizeObserver: ResizeObserver;
  private currentPreset: CameraPreset = 'white';
  private disposed = false;

  // Pointer drag vs tap tracking
  private pointerDownPos: { x: number; y: number } | null = null;
  private pointerDownButton = -1;

  constructor(
    container: HTMLElement,
    initialDark: boolean,
    onSquareClick: (square: Square) => void,
  ) {
    this.container = container;
    this.onSquareClick = onSquareClick;

    this.scene = new THREE.Scene();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 7.6, 8.2);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;

    const canvas = this.renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.touchAction = 'none';
    container.appendChild(canvas);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = false;
    this.controls.minDistance = 6.2;
    this.controls.maxDistance = 24;
    this.controls.minPolarAngle = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2.22;
    this.controls.target.set(0, 0.1, 0);
    this.setCameraPreset('white', true);

    this.controls.addEventListener('start', () => {
      // Cancel preset animation if user manually interacts with camera
      this.cameraTransition = null;
    });

    // Studio 3-point lighting
    const hemi = new THREE.HemisphereLight(0xfffaf0, 0x3b332b, 0.85);
    this.scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfff6e8, 1.55);
    keyLight.position.set(6.5, 13.5, 7.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 2;
    keyLight.shadow.camera.far = 32;
    keyLight.shadow.camera.left = -6.2;
    keyLight.shadow.camera.right = 6.2;
    keyLight.shadow.camera.top = 6.2;
    keyLight.shadow.camera.bottom = -6.2;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.025;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce8ff, 0.55);
    fillLight.position.set(-7.5, 8.0, -5.0);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe7c4, 0.42);
    rimLight.position.set(0, 5.5, -10.0);
    this.scene.add(rimLight);

    // Materials
    this.lightSquareMat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.03 });
    this.darkSquareMat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05 });
    this.frameMat = new THREE.MeshStandardMaterial({ roughness: 0.48, metalness: 0.06 });
    this.trimMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.35 });
    this.whitePieceMat = new THREE.MeshStandardMaterial({ roughness: 0.24, metalness: 0.05 });
    this.blackPieceMat = new THREE.MeshStandardMaterial({ roughness: 0.24, metalness: 0.14 });
    this.disposableMats.push(
      this.lightSquareMat,
      this.darkSquareMat,
      this.frameMat,
      this.trimMat,
      this.whitePieceMat,
      this.blackPieceMat,
    );

    this.geometryCache = createPieceGeometryCache();

    // Shared highlight geometries & materials
    this.ringGeo = new THREE.RingGeometry(0.31, 0.43, 36);
    this.ringGeo.rotateX(-Math.PI / 2);
    this.dotGeo = new THREE.CircleGeometry(0.14, 24);
    this.dotGeo.rotateX(-Math.PI / 2);
    this.squareOverlayGeo = new THREE.PlaneGeometry(0.96, 0.96);
    this.squareOverlayGeo.rotateX(-Math.PI / 2);
    this.disposableGeos.push(this.ringGeo, this.dotGeo, this.squareOverlayGeo);

    const selectedMat = new THREE.MeshBasicMaterial({
      color: 0xeab308,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const hoverMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const checkMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    this.legalRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    this.legalDotMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    this.captureRingMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    });
    this.lastMoveMat = new THREE.MeshBasicMaterial({
      color: 0xd9a441,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });
    this.hintRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    this.disposableMats.push(
      selectedMat,
      hoverMat,
      checkMat,
      this.legalRingMat,
      this.legalDotMat,
      this.captureRingMat,
      this.lastMoveMat,
      this.hintRingMat,
    );

    this.selectedMesh = new THREE.Mesh(this.squareOverlayGeo, selectedMat);
    this.selectedMesh.visible = false;
    this.selectedMesh.position.y = 0.012;

    this.hoverMesh = new THREE.Mesh(this.squareOverlayGeo, hoverMat);
    this.hoverMesh.visible = false;
    this.hoverMesh.position.y = 0.008;

    this.checkMesh = new THREE.Mesh(this.ringGeo, checkMat);
    this.checkMesh.visible = false;
    this.checkMesh.position.y = 0.018;
    this.checkMesh.scale.setScalar(1.06);

    this.highlightGroup.add(
      this.lastMoveGroup,
      this.hoverMesh,
      this.selectedMesh,
      this.legalGroup,
      this.hintGroup,
      this.checkMesh,
    );

    this.buildBoard();
    this.scene.add(this.highlightGroup);
    this.scene.add(this.piecesGroup);

    this.applyTheme(initialDark);

    // Input listeners
    canvas.addEventListener('pointerdown', this.handlePointerDown);
    canvas.addEventListener('pointerup', this.handlePointerUp);
    canvas.addEventListener('pointermove', this.handlePointerMove);
    canvas.addEventListener('pointerleave', this.handlePointerLeave);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(container);

    this.animate();
  }

  private buildBoard(): void {
    const boardGroup = new THREE.Group();

    // Handcrafted beveled outer plinth / walnut base
    const baseGeo = new THREE.BoxGeometry(9.35, 0.42, 9.35);
    const baseMesh = new THREE.Mesh(baseGeo, this.frameMat);
    baseMesh.position.set(0, -0.24, 0);
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    boardGroup.add(baseMesh);
    this.disposableGeos.push(baseGeo);

    // Subtle brass/walnut inlay trim around the 8x8 playing grid
    const trimGeo = new THREE.BoxGeometry(8.16, 0.08, 8.16);
    const trimMesh = new THREE.Mesh(trimGeo, this.trimMat);
    trimMesh.position.set(0, -0.055, 0);
    trimMesh.receiveShadow = true;
    boardGroup.add(trimMesh);
    this.disposableGeos.push(trimGeo);

    // 64 individual playing tiles (exact FIDE coloring: a1 is dark, h1 is light)
    const tileGeo = new THREE.BoxGeometry(1.0, 0.08, 1.0);
    this.disposableGeos.push(tileGeo);

    for (let rank = 0; rank < 8; rank++) {
      for (let file = 0; file < 8; file++) {
        const isLight = (file + rank) % 2 === 1;
        const square = `${FILES[file]}${RANKS[rank]}` as Square;
        const tile = new THREE.Mesh(tileGeo, isLight ? this.lightSquareMat : this.darkSquareMat);
        tile.position.set(file - 3.5, -0.04, 3.5 - rank);
        tile.receiveShadow = true;
        tile.userData.square = square;
        boardGroup.add(tile);
        this.squareMeshes.push(tile);
        this.squareMeshMap.set(square, tile);
      }
    }

    // Algebraic coordinate decals along all 4 frame borders
    const stripGeo = new THREE.PlaneGeometry(8.0, 0.56);
    this.disposableGeos.push(stripGeo);

    const railConfigs: {
      pos: [number, number, number];
      rotZ: number;
      labels: readonly string[];
      reverse: boolean;
    }[] = [
      // South rail (rank 1 edge, facing White)
      { pos: [0, -0.025, 4.38], rotZ: 0, labels: FILES, reverse: false },
      // North rail (rank 8 edge, facing Black)
      { pos: [0, -0.025, -4.38], rotZ: Math.PI, labels: FILES, reverse: true },
      // West rail (file a edge, 1..8)
      { pos: [-4.38, -0.025, 0], rotZ: Math.PI / 2, labels: RANKS, reverse: false },
      // East rail (file h edge, 1..8)
      { pos: [4.38, -0.025, 0], rotZ: -Math.PI / 2, labels: RANKS, reverse: true },
    ];

    for (const cfg of railConfigs) {
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      this.disposableMats.push(mat);

      const mesh = new THREE.Mesh(stripGeo, mat);
      mesh.rotation.order = 'YXZ';
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.y = cfg.rotZ;
      mesh.position.set(...cfg.pos);
      mesh.userData = { labels: cfg.labels, reverse: cfg.reverse };
      boardGroup.add(mesh);
      this.coordMeshes.push(mesh);
    }

    this.scene.add(boardGroup);
  }

  public applyTheme(dark: boolean): void {
    // Dispose old dynamic textures
    this.disposableTextures.forEach((t) => t.dispose());
    this.disposableTextures = [];

    if (dark) {
      this.scene.background = new THREE.Color('#141923');
      const lightTex = createWoodGrainTexture('#CBD5E0', '#94A3B8', 3);
      const darkTex = createWoodGrainTexture('#3B4A5E', '#1E293B', 7);
      this.disposableTextures.push(lightTex, darkTex);

      this.lightSquareMat.map = lightTex;
      this.lightSquareMat.color.set('#FFFFFF');
      this.lightSquareMat.needsUpdate = true;

      this.darkSquareMat.map = darkTex;
      this.darkSquareMat.color.set('#FFFFFF');
      this.darkSquareMat.needsUpdate = true;

      this.frameMat.color.set('#1C2432');
      this.trimMat.color.set('#A88E68');
      this.whitePieceMat.color.set('#F4F0E8');
      this.whitePieceMat.emissive.set('#15130F');
      this.blackPieceMat.color.set('#27303F');
      this.blackPieceMat.emissive.set('#0A0F18');
      this.blackPieceMat.roughness = 0.22;
      this.blackPieceMat.metalness = 0.18;
    } else {
      this.scene.background = new THREE.Color('#EAE4DA');
      const lightTex = createWoodGrainTexture('#F0E6D2', '#CBB692', 2);
      const darkTex = createWoodGrainTexture('#8C6D4F', '#5C432B', 9);
      this.disposableTextures.push(lightTex, darkTex);

      this.lightSquareMat.map = lightTex;
      this.lightSquareMat.color.set('#FFFFFF');
      this.lightSquareMat.needsUpdate = true;

      this.darkSquareMat.map = darkTex;
      this.darkSquareMat.color.set('#FFFFFF');
      this.darkSquareMat.needsUpdate = true;

      this.frameMat.color.set('#58412C');
      this.trimMat.color.set('#C5AA83');
      this.whitePieceMat.color.set('#F7F2E7');
      this.whitePieceMat.emissive.set('#120E09');
      this.blackPieceMat.color.set('#2B241E');
      this.blackPieceMat.emissive.set('#080604');
      this.blackPieceMat.roughness = 0.26;
      this.blackPieceMat.metalness = 0.08;
    }

    const coordColor = dark ? '#CBD5E0' : '#EFE7D8';
    for (const mesh of this.coordMeshes) {
      const mat = mesh.material as THREE.MeshBasicMaterial;
      const tex = createCoordinateStripTexture(
        mesh.userData.labels as readonly string[],
        coordColor,
        Boolean(mesh.userData.reverse),
      );
      this.disposableTextures.push(tex);
      mat.map = tex;
      mat.needsUpdate = true;
    }
  }

  public syncBoard(pieces: BoardPieceData[], animation?: MoveAnimationSpec): void {
    // Finish any in-progress animations cleanly before syncing
    if (this.moveAnims.length > 0) {
      this.moveAnims.forEach((a) => {
        a.mesh.position.copy(a.endPos);
        a.onComplete?.();
      });
      this.moveAnims = [];
    }

    const now = performance.now();

    if (animation && this.pieceEntries.has(animation.from)) {
      const movingEntry = this.pieceEntries.get(animation.from)!;
      this.pieceEntries.delete(animation.from);

      // Animate captured piece out if present
      const capSquare = animation.capturedSquare ?? animation.to;
      if (this.pieceEntries.has(capSquare)) {
        const captured = this.pieceEntries.get(capSquare)!;
        this.pieceEntries.delete(capSquare);
        this.fadeAnims.push({
          mesh: captured.mesh,
          startTime: now,
          duration: 210,
        });
      }

      const endPos = squareToWorld(animation.to);
      const startPos = movingEntry.mesh.position.clone();
      const liftHeight = animation.pieceType === 'n' ? 0.92 : 0.36;

      this.pieceEntries.set(animation.to, movingEntry);
      this.setSquareTag(movingEntry.mesh, animation.to);

      this.moveAnims.push({
        mesh: movingEntry.mesh,
        startPos,
        endPos,
        liftHeight,
        startTime: now,
        duration: 260,
        onComplete: animation.promotion
          ? () => {
              // Swap pawn mesh with promoted piece cleanly on arrival
              const current = this.pieceEntries.get(animation.to);
              if (!current) return;
              this.piecesGroup.remove(current.mesh);
              const mat = animation.pieceColor === 'w' ? this.whitePieceMat : this.blackPieceMat;
              const promotedMesh = buildPieceMesh(
                animation.promotion!,
                animation.pieceColor,
                this.geometryCache,
                mat,
              );
              promotedMesh.position.copy(endPos);
              this.setSquareTag(promotedMesh, animation.to);
              this.piecesGroup.add(promotedMesh);
              this.pieceEntries.set(animation.to, {
                mesh: promotedMesh,
                type: animation.promotion!,
                color: animation.pieceColor,
              });
            }
          : undefined,
      });

      // Animate castling rook simultaneously
      if (animation.castlingRook && this.pieceEntries.has(animation.castlingRook.from)) {
        const rookEntry = this.pieceEntries.get(animation.castlingRook.from)!;
        this.pieceEntries.delete(animation.castlingRook.from);
        this.pieceEntries.set(animation.castlingRook.to, rookEntry);
        this.setSquareTag(rookEntry.mesh, animation.castlingRook.to);

        this.moveAnims.push({
          mesh: rookEntry.mesh,
          startPos: rookEntry.mesh.position.clone(),
          endPos: squareToWorld(animation.castlingRook.to),
          liftHeight: 0.42,
          startTime: now + 35,
          duration: 260,
        });
      }

      return;
    }

    // Full snap rebuild (initial load, New Game, or Undo)
    this.fadeAnims.forEach((f) => this.piecesGroup.remove(f.mesh));
    this.fadeAnims = [];
    this.pieceEntries.forEach((entry) => this.piecesGroup.remove(entry.mesh));
    this.pieceEntries.clear();

    for (const piece of pieces) {
      const mat = piece.color === 'w' ? this.whitePieceMat : this.blackPieceMat;
      const mesh = buildPieceMesh(piece.type, piece.color, this.geometryCache, mat);
      mesh.position.copy(squareToWorld(piece.square));
      this.setSquareTag(mesh, piece.square);
      this.piecesGroup.add(mesh);
      this.pieceEntries.set(piece.square, { mesh, type: piece.type, color: piece.color });
    }
  }

  private setSquareTag(group: THREE.Group, square: Square): void {
    group.userData.square = square;
    group.traverse((obj) => {
      obj.userData.square = square;
    });
  }

  public setHighlights(state: HighlightState): void {
    // Selected square
    if (state.selected) {
      const pos = squareToWorld(state.selected);
      this.selectedMesh.position.set(pos.x, 0.012, pos.z);
      this.selectedMesh.visible = true;
    } else {
      this.selectedMesh.visible = false;
    }

    // Check king glow
    if (state.checkSquare) {
      const pos = squareToWorld(state.checkSquare);
      this.checkMesh.position.set(pos.x, 0.02, pos.z);
      this.checkMesh.visible = true;
    } else {
      this.checkMesh.visible = false;
    }

    // Legal moves
    this.legalGroup.clear();
    for (const target of state.legalTargets) {
      const pos = squareToWorld(target.square);
      if (target.isCapture) {
        const ring = new THREE.Mesh(this.ringGeo, this.captureRingMat);
        ring.position.set(pos.x, 0.016, pos.z);
        ring.scale.setScalar(1.04);
        this.legalGroup.add(ring);
      } else {
        const ring = new THREE.Mesh(this.ringGeo, this.legalRingMat);
        ring.position.set(pos.x, 0.015, pos.z);
        ring.scale.setScalar(0.62);
        const dot = new THREE.Mesh(this.dotGeo, this.legalDotMat);
        dot.position.set(pos.x, 0.016, pos.z);
        this.legalGroup.add(ring, dot);
      }
    }

    // Last move trail
    this.lastMoveGroup.clear();
    if (state.lastMove) {
      for (const sq of [state.lastMove.from, state.lastMove.to]) {
        const pos = squareToWorld(sq);
        const plate = new THREE.Mesh(this.squareOverlayGeo, this.lastMoveMat);
        plate.position.set(pos.x, 0.006, pos.z);
        this.lastMoveGroup.add(plate);
      }
    }

    // Hint indicator
    this.hintGroup.clear();
    if (state.hint) {
      for (const sq of [state.hint.from, state.hint.to]) {
        const pos = squareToWorld(sq);
        const ring = new THREE.Mesh(this.ringGeo, this.hintRingMat);
        ring.position.set(pos.x, 0.022, pos.z);
        ring.scale.setScalar(1.08);
        this.hintGroup.add(ring);
      }
    }
  }

  public setCameraPreset(preset: CameraPreset, instant = false): void {
    this.currentPreset = preset;
    const target = new THREE.Vector3(0, 0.1, 0);
    const endPos = new THREE.Vector3();

    // Scale camera distance gracefully on narrow mobile/portrait viewports so the full 8x8 board stays framed
    const aspect = Math.max(this.camera.aspect || 1, 0.65);
    const fitScale = aspect < 1.38 ? 1.38 / aspect : 1;

    switch (preset) {
      case 'white':
        endPos.set(0, 8.8 * fitScale, 9.9 * fitScale);
        break;
      case 'black':
        endPos.set(0, 8.8 * fitScale, -9.9 * fitScale);
        break;
      case 'top':
        endPos.set(0, 14.2 * fitScale, 0.06);
        target.set(0, 0, 0);
        break;
      case 'side':
        endPos.set(10.2 * fitScale, 7.4 * fitScale, 5.4 * fitScale);
        break;
    }

    if (instant) {
      this.cameraTransition = null;
      this.camera.position.copy(endPos);
      this.controls.target.copy(target);
      this.controls.update();
      return;
    }

    this.cameraTransition = {
      startPos: this.camera.position.clone(),
      endPos,
      startTarget: this.controls.target.clone(),
      endTarget: target,
      startTime: performance.now(),
      duration: 520,
    };
  }

  private getSquareFromEvent(event: PointerEvent): Square | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;

    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);

    // Check pieces first (easier to click tall 3D pieces), then board tiles
    const pieceHits = this.raycaster.intersectObjects(this.piecesGroup.children, true);
    if (pieceHits.length > 0 && pieceHits[0].object.userData.square) {
      return pieceHits[0].object.userData.square as Square;
    }

    const tileHits = this.raycaster.intersectObjects(this.squareMeshes, false);
    if (tileHits.length > 0 && tileHits[0].object.userData.square) {
      return tileHits[0].object.userData.square as Square;
    }

    return null;
  }

  private handlePointerDown = (event: PointerEvent): void => {
    this.pointerDownPos = { x: event.clientX, y: event.clientY };
    this.pointerDownButton = event.button;
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (!this.pointerDownPos || this.pointerDownButton !== 0) {
      this.pointerDownPos = null;
      return;
    }
    const dx = event.clientX - this.pointerDownPos.x;
    const dy = event.clientY - this.pointerDownPos.y;
    const distance = Math.hypot(dx, dy);
    this.pointerDownPos = null;

    // Distinguish crisp click/tap (< 8px movement) from camera orbit drag
    if (distance < 8) {
      const sq = this.getSquareFromEvent(event);
      if (sq) {
        this.onSquareClick(sq);
      }
    }
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (event.pointerType === 'touch') return;
    const sq = this.getSquareFromEvent(event);
    if (sq) {
      const pos = squareToWorld(sq);
      this.hoverMesh.position.set(pos.x, 0.008, pos.z);
      this.hoverMesh.visible = true;
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      this.hoverMesh.visible = false;
      this.renderer.domElement.style.cursor = 'grab';
    }
  };

  private handlePointerLeave = (): void => {
    this.hoverMesh.visible = false;
  };

  private handleResize(): void {
    if (this.disposed) return;
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    const prevAspect = this.camera.aspect;
    const nextAspect = width / height;
    this.camera.aspect = nextAspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (Math.abs(prevAspect - nextAspect) > 0.08 && (prevAspect < 1.38 || nextAspect < 1.38)) {
      this.setCameraPreset(this.currentPreset, true);
    }
  }

  private animate = (): void => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);

    const now = performance.now();

    // Update camera preset transition
    if (this.cameraTransition) {
      const { startPos, endPos, startTarget, endTarget, startTime, duration } =
        this.cameraTransition;
      const rawT = Math.min(1, (now - startTime) / duration);
      const t = easeInOutCubic(rawT);
      this.camera.position.lerpVectors(startPos, endPos, t);
      this.controls.target.lerpVectors(startTarget, endTarget, t);
      if (rawT >= 1) {
        this.cameraTransition = null;
      }
    }

    // Update active piece glide/lift animations
    for (let i = this.moveAnims.length - 1; i >= 0; i--) {
      const anim = this.moveAnims[i];
      if (now < anim.startTime) continue;
      const rawT = Math.min(1, (now - anim.startTime) / anim.duration);
      const t = easeOutCubic(rawT);
      anim.mesh.position.lerpVectors(anim.startPos, anim.endPos, t);
      anim.mesh.position.y = BOARD_TOP_Y + Math.sin(rawT * Math.PI) * anim.liftHeight;
      if (rawT >= 1) {
        anim.mesh.position.copy(anim.endPos);
        anim.onComplete?.();
        this.moveAnims.splice(i, 1);
      }
    }

    // Update captured piece fade/shrink animations
    for (let i = this.fadeAnims.length - 1; i >= 0; i--) {
      const fade = this.fadeAnims[i];
      const rawT = Math.min(1, (now - fade.startTime) / fade.duration);
      const scale = Math.max(0.01, 1 - easeOutCubic(rawT));
      fade.mesh.scale.setScalar(scale);
      fade.mesh.position.y = rawT * 0.45;
      if (rawT >= 1) {
        this.piecesGroup.remove(fade.mesh);
        this.fadeAnims.splice(i, 1);
      }
    }

    // Gentle pulse on check king glow and hint indicators
    if (this.checkMesh.visible) {
      const pulse = 1.0 + Math.sin(now * 0.008) * 0.08;
      this.checkMesh.scale.setScalar(pulse);
    }
    if (this.hintGroup.children.length > 0) {
      const pulse = 1.02 + Math.sin(now * 0.007) * 0.09;
      this.hintGroup.children.forEach((child) => child.scale.setScalar(pulse));
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.rafId);
    this.resizeObserver.disconnect();

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('pointerup', this.handlePointerUp);
    canvas.removeEventListener('pointermove', this.handlePointerMove);
    canvas.removeEventListener('pointerleave', this.handlePointerLeave);

    this.controls.dispose();
    this.geometryCache.dispose();
    this.disposableGeos.forEach((g) => g.dispose());
    this.disposableMats.forEach((m) => m.dispose());
    this.disposableTextures.forEach((t) => t.dispose());
    this.renderer.dispose();

    if (canvas.parentElement === this.container) {
      this.container.removeChild(canvas);
    }
  }
}
