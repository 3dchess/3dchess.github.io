import * as THREE from 'three';
import type { PieceSymbol } from 'chess.js';

export interface PieceGeometryCache {
  parts: Record<PieceSymbol, THREE.BufferGeometry[]>;
  dispose: () => void;
}

function lathe(points: [number, number][], segments = 32): THREE.LatheGeometry {
  const vecs = points.map(([r, y]) => new THREE.Vector2(r, y));
  const geo = new THREE.LatheGeometry(vecs, segments);
  geo.computeVertexNormals();
  return geo;
}

function buildPawnParts(): THREE.BufferGeometry[] {
  const body = lathe([
    [0.0, 0.0],
    [0.29, 0.0],
    [0.29, 0.055],
    [0.26, 0.08],
    [0.24, 0.14],
    [0.19, 0.21],
    [0.145, 0.34],
    [0.115, 0.50],
    [0.165, 0.545],
    [0.165, 0.58],
    [0.11, 0.61],
    [0.145, 0.66],
    [0.18, 0.75],
    [0.165, 0.85],
    [0.10, 0.92],
    [0.0, 0.945],
  ]);
  return [body];
}

function buildRookParts(): THREE.BufferGeometry[] {
  const body = lathe([
    [0.0, 0.0],
    [0.33, 0.0],
    [0.33, 0.06],
    [0.30, 0.095],
    [0.28, 0.17],
    [0.22, 0.25],
    [0.18, 0.54],
    [0.17, 0.72],
    [0.23, 0.78],
    [0.245, 0.85],
    [0.245, 0.97],
    [0.175, 0.97],
    [0.16, 0.91],
    [0.0, 0.91],
  ]);

  const parts: THREE.BufferGeometry[] = [body];
  // 6 sculpted parapet crenellations around the turret crown
  const merlonCount = 6;
  const radius = 0.21;
  for (let i = 0; i < merlonCount; i++) {
    const angle = (i / merlonCount) * Math.PI * 2;
    const merlon = new THREE.BoxGeometry(0.11, 0.14, 0.075);
    merlon.rotateY(-angle + Math.PI / 2);
    merlon.translate(Math.cos(angle) * radius, 1.03, Math.sin(angle) * radius);
    parts.push(merlon);
  }
  return parts;
}

function buildKnightParts(): THREE.BufferGeometry[] {
  // Turned Staunton pedestal base
  const pedestal = lathe([
    [0.0, 0.0],
    [0.33, 0.0],
    [0.33, 0.06],
    [0.30, 0.095],
    [0.28, 0.17],
    [0.22, 0.25],
    [0.20, 0.34],
    [0.225, 0.38],
    [0.19, 0.42],
    [0.0, 0.42],
  ]);

  // Iconic sculpted Staunton Knight horse-head silhouette (ExtrudeGeometry)
  // Designed facing +X in 2D shape space, then rotated to face -Z (White forward)
  const shape = new THREE.Shape();
  shape.moveTo(-0.15, 0.39);
  shape.bezierCurveTo(-0.22, 0.56, -0.24, 0.80, -0.17, 1.02); // arched mane back
  shape.bezierCurveTo(-0.12, 1.14, -0.05, 1.22, 0.01, 1.27); // crest / poll
  shape.lineTo(0.05, 1.33); // pointed ear tip
  shape.lineTo(0.085, 1.22); // forehead dip
  shape.bezierCurveTo(0.16, 1.18, 0.24, 1.08, 0.29, 0.96); // bridge of nose
  shape.bezierCurveTo(0.32, 0.90, 0.29, 0.84, 0.23, 0.84); // muzzle tip
  shape.lineTo(0.15, 0.87); // mouth notch
  shape.bezierCurveTo(0.11, 0.85, 0.08, 0.80, 0.11, 0.72); // jaw underside
  shape.bezierCurveTo(0.16, 0.62, 0.18, 0.50, 0.15, 0.39); // chest curve
  shape.closePath();

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.17,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.038,
    bevelThickness: 0.042,
    curveSegments: 18,
  };

  const head = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  // Center along Z extrusion thickness, then rotate +90deg around Y so +X faces -Z (White toward rank 8)
  head.translate(0, 0, -0.085);
  head.rotateY(Math.PI / 2);
  head.computeVertexNormals();

  // Subtle mane spine ridge for extra 3D depth
  const maneShape = new THREE.Shape();
  maneShape.moveTo(-0.18, 0.48);
  maneShape.bezierCurveTo(-0.25, 0.68, -0.25, 0.92, -0.15, 1.12);
  maneShape.lineTo(-0.08, 1.08);
  maneShape.bezierCurveTo(-0.16, 0.90, -0.17, 0.68, -0.11, 0.48);
  maneShape.closePath();

  const mane = new THREE.ExtrudeGeometry(maneShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.015,
    bevelThickness: 0.015,
    curveSegments: 12,
  });
  mane.translate(0, 0, -0.03);
  mane.rotateY(Math.PI / 2);
  mane.computeVertexNormals();

  return [pedestal, head, mane];
}

function buildBishopParts(): THREE.BufferGeometry[] {
  const body = lathe([
    [0.0, 0.0],
    [0.33, 0.0],
    [0.33, 0.06],
    [0.30, 0.095],
    [0.275, 0.17],
    [0.21, 0.26],
    [0.16, 0.56],
    [0.135, 0.78],
    [0.20, 0.835],
    [0.20, 0.875],
    [0.145, 0.91],
    [0.20, 1.00],
    [0.215, 1.11],
    [0.18, 1.24],
    [0.09, 1.35],
    [0.045, 1.38],
    [0.075, 1.425],
    [0.068, 1.475],
    [0.0, 1.50],
  ]);

  // Classic mitre collar ring accent
  const band = new THREE.TorusGeometry(0.16, 0.022, 10, 24);
  band.rotateX(Math.PI / 2);
  band.translate(0, 0.90, 0);

  return [body, band];
}

function buildQueenParts(): THREE.BufferGeometry[] {
  const body = lathe([
    [0.0, 0.0],
    [0.36, 0.0],
    [0.36, 0.065],
    [0.33, 0.105],
    [0.30, 0.19],
    [0.23, 0.30],
    [0.18, 0.68],
    [0.155, 0.96],
    [0.235, 1.03],
    [0.235, 1.075],
    [0.17, 1.12],
    [0.20, 1.25],
    [0.265, 1.43],
    [0.235, 1.46],
    [0.175, 1.44],
    [0.14, 1.54],
    [0.085, 1.60],
    [0.045, 1.63],
    [0.075, 1.68],
    [0.06, 1.73],
    [0.0, 1.755],
  ]);

  const parts: THREE.BufferGeometry[] = [body];
  // 8 royal coronet pearls ringing the Queen's crown
  const pearlCount = 8;
  const crownRadius = 0.24;
  for (let i = 0; i < pearlCount; i++) {
    const angle = (i / pearlCount) * Math.PI * 2;
    const pearl = new THREE.SphereGeometry(0.042, 10, 10);
    pearl.translate(Math.cos(angle) * crownRadius, 1.48, Math.sin(angle) * crownRadius);
    parts.push(pearl);
  }
  return parts;
}

function buildKingParts(): THREE.BufferGeometry[] {
  const body = lathe([
    [0.0, 0.0],
    [0.38, 0.0],
    [0.38, 0.07],
    [0.35, 0.115],
    [0.32, 0.21],
    [0.25, 0.33],
    [0.195, 0.78],
    [0.165, 1.08],
    [0.255, 1.15],
    [0.255, 1.20],
    [0.19, 1.25],
    [0.215, 1.38],
    [0.27, 1.55],
    [0.245, 1.61],
    [0.14, 1.67],
    [0.06, 1.69],
    [0.0, 1.70],
  ]);

  // Sculpted Staunton imperial cross finial
  const crossVertical = new THREE.BoxGeometry(0.07, 0.27, 0.07);
  crossVertical.translate(0, 1.82, 0);

  const crossHorizontal = new THREE.BoxGeometry(0.21, 0.068, 0.068);
  crossHorizontal.translate(0, 1.855, 0);

  return [body, crossVertical, crossHorizontal];
}

export function createPieceGeometryCache(): PieceGeometryCache {
  const parts: Record<PieceSymbol, THREE.BufferGeometry[]> = {
    p: buildPawnParts(),
    r: buildRookParts(),
    n: buildKnightParts(),
    b: buildBishopParts(),
    q: buildQueenParts(),
    k: buildKingParts(),
  };

  return {
    parts,
    dispose() {
      Object.values(parts).forEach((list) => {
        list.forEach((geo) => geo.dispose());
      });
    },
  };
}

export function buildPieceMesh(
  type: PieceSymbol,
  color: 'w' | 'b',
  cache: PieceGeometryCache,
  material: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  const geos = cache.parts[type];
  for (const geo of geos) {
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  // Rotate Black knights 180° so they face toward White (+Z)
  if (type === 'n' && color === 'b') {
    group.rotation.y = Math.PI;
  }
  return group;
}
