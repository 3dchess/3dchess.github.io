import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type Color, type Move, type PieceSymbol, type Square } from 'chess.js';
import type { GameTranslations } from '../i18n/translations';
import type { AIDifficulty, AIRequest, AIResponse } from '../workers/chessAI.worker';
import {
  ChessScene,
  type BoardPieceData,
  type CameraPreset,
  type MoveAnimationSpec,
} from './chess/ChessScene';
import { soundEngine } from './chess/soundEngine';

interface Chess3DIslandProps {
  t: GameTranslations;
}

type GameMode = 'ai' | 'local';

interface PendingPromotion {
  from: Square;
  to: Square;
  color: Color;
}

const PIECE_UNICODE: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
};

const PIECE_ORDER: Record<PieceSymbol, number> = {
  q: 1,
  r: 2,
  b: 3,
  n: 4,
  p: 5,
  k: 6,
};

const PIECE_MAT_VALUE: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

function extractPieces(chess: Chess): BoardPieceData[] {
  const result: BoardPieceData[] = [];
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (cell) {
        result.push({
          square: cell.square,
          type: cell.type,
          color: cell.color,
        });
      }
    }
  }
  return result;
}

function findKingSquare(chess: Chess, color: Color): Square | null {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = board[r][c];
      if (cell && cell.type === 'k' && cell.color === color) {
        return cell.square;
      }
    }
  }
  return null;
}

function computeCapturedPieces(history: Move[]): {
  byWhite: PieceSymbol[];
  byBlack: PieceSymbol[];
  whiteAdvantage: number;
} {
  const byWhite: PieceSymbol[] = [];
  const byBlack: PieceSymbol[] = [];
  let whitePts = 0;
  let blackPts = 0;

  for (const move of history) {
    if (move.captured) {
      if (move.color === 'w') {
        byWhite.push(move.captured);
        whitePts += PIECE_MAT_VALUE[move.captured];
      } else {
        byBlack.push(move.captured);
        blackPts += PIECE_MAT_VALUE[move.captured];
      }
    }
  }

  byWhite.sort((a, b) => PIECE_ORDER[a] - PIECE_ORDER[b]);
  byBlack.sort((a, b) => PIECE_ORDER[a] - PIECE_ORDER[b]);

  return {
    byWhite,
    byBlack,
    whiteAdvantage: whitePts - blackPts,
  };
}

function getPieceName(type: PieceSymbol, t: GameTranslations): string {
  switch (type) {
    case 'p':
      return t.pawn;
    case 'r':
      return t.rook;
    case 'n':
      return t.knight;
    case 'b':
      return t.bishop;
    case 'q':
      return t.queen;
    case 'k':
      return t.king;
  }
}

function buildAnimationSpec(move: Move): MoveAnimationSpec {
  let capturedSquare: Square | undefined;
  if (move.captured) {
    if (move.isEnPassant()) {
      // En passant: captured pawn sits on mover's starting rank and target file
      capturedSquare = `${move.to[0]}${move.from[1]}` as Square;
    } else {
      capturedSquare = move.to;
    }
  }

  let castlingRook: { from: Square; to: Square } | undefined;
  if (move.isKingsideCastle()) {
    castlingRook = move.color === 'w' ? { from: 'h1', to: 'f1' } : { from: 'h8', to: 'f8' };
  } else if (move.isQueensideCastle()) {
    castlingRook = move.color === 'w' ? { from: 'a1', to: 'd1' } : { from: 'a8', to: 'd8' };
  }

  return {
    from: move.from,
    to: move.to,
    pieceType: move.piece,
    pieceColor: move.color,
    promotion: move.promotion,
    capturedSquare,
    castlingRook,
  };
}

export default function Chess3DIsland({ t }: Chess3DIslandProps) {
  const chessRef = useRef<Chess>(new Chess());
  const sceneRef = useRef<ChessScene | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef<number>(0);
  const aiTimerRef = useRef<number | null>(null);

  const [fen, setFen] = useState<string>(() => chessRef.current.fen());
  const [mode, setMode] = useState<GameMode>('ai');
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('white');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState<boolean>(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState<boolean>(false);
  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [hintMove, setHintMove] = useState<{ from: Square; to: Square; san: string } | null>(null);
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [hintLoading, setHintLoading] = useState<boolean>(false);
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [announcement, setAnnouncement] = useState<string>('');
  const [overlayDismissed, setOverlayDismissed] = useState<boolean>(false);
  const [webglError, setWebglError] = useState<boolean>(false);
  const [sceneReady, setSceneReady] = useState<boolean>(false);

  // Keyboard accessible move input
  const [keyboardInput, setKeyboardInput] = useState<string>('');
  const [keyboardError, setKeyboardError] = useState<string>('');

  // Refs synced with latest state for Three.js pointer callback & worker callbacks
  const modeRef = useRef(mode);
  const playerColorRef = useRef(playerColor);
  const difficultyRef = useRef(difficulty);
  const selectedRef = useRef(selectedSquare);
  const aiThinkingRef = useRef(aiThinking);
  const pendingPromoRef = useRef(pendingPromotion);

  modeRef.current = mode;
  playerColorRef.current = playerColor;
  difficultyRef.current = difficulty;
  selectedRef.current = selectedSquare;
  aiThinkingRef.current = aiThinking;
  pendingPromoRef.current = pendingPromotion;

  const history = useMemo(() => {
    void fen;
    return chessRef.current.history({ verbose: true });
  }, [fen]);

  const captured = useMemo(() => computeCapturedPieces(history), [history]);

  const gameState = useMemo(() => {
    void fen;
    const c = chessRef.current;
    const turn = c.turn();
    const inCheck = c.inCheck();
    const isCheckmate = c.isCheckmate();
    const isStalemate = c.isStalemate();
    const isRepetition = c.isThreefoldRepetition();
    const isInsufficient = c.isInsufficientMaterial();
    const isDraw = c.isDraw();
    const isOver = c.isGameOver();
    const checkSquare = inCheck ? findKingSquare(c, turn) : null;
    const lastMoveObj = history.length > 0 ? history[history.length - 1] : null;
    const lastMove = lastMoveObj ? { from: lastMoveObj.from, to: lastMoveObj.to } : null;

    let statusText = turn === 'w' ? t.turnWhite : t.turnBlack;
    if (isCheckmate) {
      statusText = turn === 'w' ? t.checkmateBlackWins : t.checkmateWhiteWins;
    } else if (isStalemate) {
      statusText = t.stalemate;
    } else if (isRepetition) {
      statusText = t.drawRepetition;
    } else if (isInsufficient) {
      statusText = t.drawInsufficient;
    } else if (isDraw) {
      statusText = t.drawGeneral;
    } else if (inCheck) {
      statusText = `${statusText} · ${t.inCheck}`;
    }

    return {
      turn,
      inCheck,
      isCheckmate,
      isDraw,
      isOver,
      checkSquare,
      lastMove,
      statusText,
    };
  }, [fen, history, t]);

  const announceMove = useCallback(
    (move: Move) => {
      const c = chessRef.current;
      const sideName = move.color === 'w' ? t.white : t.black;
      const pieceName = getPieceName(move.piece, t);
      let msg = `${sideName} ${pieceName} ${move.from} → ${move.to} (${move.san}).`;
      if (move.promotion) {
        msg += ` ${t.promotionTitle}: ${getPieceName(move.promotion, t)}.`;
      }
      if (c.isCheckmate()) {
        msg += ` ${c.turn() === 'w' ? t.checkmateBlackWins : t.checkmateWhiteWins}`;
      } else if (c.isStalemate()) {
        msg += ` ${t.stalemate}`;
      } else if (c.isThreefoldRepetition()) {
        msg += ` ${t.drawRepetition}`;
      } else if (c.isInsufficientMaterial()) {
        msg += ` ${t.drawInsufficient}`;
      } else if (c.isDraw()) {
        msg += ` ${t.drawGeneral}`;
      } else if (c.inCheck()) {
        msg += ` ${t.inCheck}`;
      }
      setAnnouncement(msg);
    },
    [t],
  );

  const playMoveAudio = useCallback((move: Move) => {
    const c = chessRef.current;
    if (c.isGameOver()) {
      soundEngine.playGameOver(c.isDraw());
    } else if (c.inCheck()) {
      soundEngine.playCheck();
    } else if (move.isKingsideCastle() || move.isQueensideCastle()) {
      soundEngine.playCastle();
    } else if (move.captured) {
      soundEngine.playCapture();
    } else {
      soundEngine.playMove();
    }
  }, []);

  const requestAIMove = useCallback(() => {
    const c = chessRef.current;
    if (c.isGameOver() || modeRef.current !== 'ai') return;
    if (c.turn() === playerColorRef.current) return;
    if (!workerRef.current) return;

    const reqId = ++requestIdRef.current;
    setAiThinking(true);

    const payload: AIRequest = {
      id: reqId,
      type: 'move',
      fen: c.fen(),
      difficulty: difficultyRef.current,
    };
    workerRef.current.postMessage(payload);
  }, []);

  const commitMove = useCallback(
    (from: Square, to: Square, promotion?: PieceSymbol): boolean => {
      const c = chessRef.current;
      let move: Move | null = null;
      try {
        move = c.move({ from, to, promotion });
      } catch {
        return false;
      }
      if (!move) return false;

      const animSpec = buildAnimationSpec(move);
      sceneRef.current?.syncBoard(extractPieces(c), animSpec);

      setSelectedSquare(null);
      setHintMove(null);
      setKeyboardError('');
      setOverlayDismissed(false);
      setFen(c.fen());
      playMoveAudio(move);
      announceMove(move);

      // Schedule AI reply if vs AI and it's now AI's turn
      if (!c.isGameOver() && modeRef.current === 'ai' && c.turn() !== playerColorRef.current) {
        if (aiTimerRef.current !== null) window.clearTimeout(aiTimerRef.current);
        aiTimerRef.current = window.setTimeout(() => {
          aiTimerRef.current = null;
          requestAIMove();
        }, 280);
      }

      return true;
    },
    [announceMove, playMoveAudio, requestAIMove],
  );

  // Ref for commitMove so worker callback never goes stale
  const commitMoveRef = useRef(commitMove);
  commitMoveRef.current = commitMove;

  const handleSquareClick = useCallback((square: Square) => {
    const c = chessRef.current;
    if (c.isGameOver() || aiThinkingRef.current || pendingPromoRef.current) return;
    if (modeRef.current === 'ai' && c.turn() !== playerColorRef.current) return;

    const currentSelected = selectedRef.current;
    const clickedPiece = c.get(square);

    if (currentSelected) {
      if (currentSelected === square) {
        setSelectedSquare(null);
        return;
      }

      // Check if clicking a legal destination from currentSelected
      const legalFromSelected = c.moves({ square: currentSelected, verbose: true });
      const matchingMoves = legalFromSelected.filter((m) => m.to === square);

      if (matchingMoves.length > 0) {
        const isPromotion = matchingMoves.some((m) => m.promotion !== undefined);
        if (isPromotion) {
          setPendingPromotion({
            from: currentSelected,
            to: square,
            color: c.turn(),
          });
          return;
        }
        commitMoveRef.current(currentSelected, square);
        return;
      }
    }

    // Select a piece of the active turn's color
    if (clickedPiece && clickedPiece.color === c.turn()) {
      setSelectedSquare(square);
    } else {
      setSelectedSquare(null);
    }
  }, []);

  // Initialize Three.js WebGL scene
  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host) return;

    const initialDark = document.documentElement.classList.contains('dark');
    let scene: ChessScene | null = null;
    try {
      scene = new ChessScene(host, initialDark, handleSquareClick);
      sceneRef.current = scene;
      scene.syncBoard(extractPieces(chessRef.current));
      setSceneReady(true);
    } catch {
      setWebglError(true);
      return;
    }

    const onThemeChange = (e: Event) => {
      const custom = e as CustomEvent<{ dark: boolean }>;
      scene?.applyTheme(Boolean(custom.detail?.dark));
    };
    window.addEventListener('themechange', onThemeChange);

    return () => {
      window.removeEventListener('themechange', onThemeChange);
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [handleSquareClick]);

  // Initialize dedicated Web Worker AI
  useEffect(() => {
    const worker = new Worker(new URL('../workers/chessAI.worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<AIResponse>) => {
      const data = event.data;
      if (data.id !== requestIdRef.current) return;

      if (data.type === 'move') {
        setAiThinking(false);
        if (data.move) {
          commitMoveRef.current(
            data.move.from as Square,
            data.move.to as Square,
            data.move.promotion as PieceSymbol | undefined,
          );
        }
      } else if (data.type === 'hint') {
        setHintLoading(false);
        if (data.move) {
          const hint = {
            from: data.move.from as Square,
            to: data.move.to as Square,
            san: data.move.san,
          };
          setHintMove(hint);
          setAnnouncement(`${t.hintSuggested}: ${hint.san} (${hint.from} → ${hint.to}).`);
        }
      }
    };

    return () => {
      if (aiTimerRef.current !== null) {
        window.clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
      worker.terminate();
      workerRef.current = null;
    };
  }, [t.hintSuggested]);

  // Sync visual highlights to Three.js whenever selection, FEN, or hint changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const c = chessRef.current;

    const legalTargets: { square: Square; isCapture: boolean }[] = [];
    if (selectedSquare && !c.isGameOver()) {
      const moves = c.moves({ square: selectedSquare, verbose: true });
      const seen = new Set<Square>();
      for (const m of moves) {
        if (!seen.has(m.to)) {
          seen.add(m.to);
          legalTargets.push({
            square: m.to,
            isCapture: Boolean(m.captured),
          });
        }
      }
    }

    scene.setHighlights({
      selected: selectedSquare,
      legalTargets,
      lastMove: gameState.lastMove,
      hint: hintMove ? { from: hintMove.from, to: hintMove.to } : null,
      checkSquare: gameState.checkSquare,
    });
  }, [selectedSquare, fen, hintMove, gameState.lastMove, gameState.checkSquare]);

  // Sync audio enabled preference
  useEffect(() => {
    soundEngine.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const startNewGame = useCallback(
    (nextMode = mode, nextColor = playerColor) => {
      if (aiTimerRef.current !== null) {
        window.clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
      requestIdRef.current++;
      setAiThinking(false);
      setHintLoading(false);
      setPendingPromotion(null);
      setSelectedSquare(null);
      setHintMove(null);
      setKeyboardError('');
      setOverlayDismissed(false);

      chessRef.current.reset();
      sceneRef.current?.syncBoard(extractPieces(chessRef.current));
      setFen(chessRef.current.fen());

      const targetCam: CameraPreset = nextMode === 'ai' && nextColor === 'b' ? 'black' : 'white';
      setCameraPreset(targetCam);
      sceneRef.current?.setCameraPreset(targetCam);

      setAnnouncement(nextColor === 'w' || nextMode === 'local' ? t.turnWhite : t.aiThinking);

      // Update refs immediately for AI kick-off when user plays Black
      modeRef.current = nextMode;
      playerColorRef.current = nextColor;

      if (nextMode === 'ai' && nextColor === 'b') {
        aiTimerRef.current = window.setTimeout(() => {
          aiTimerRef.current = null;
          requestAIMove();
        }, 420);
      }
    },
    [mode, playerColor, requestAIMove, t.aiThinking, t.turnWhite],
  );

  const handleModeChange = (nextMode: GameMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    startNewGame(nextMode, playerColor);
  };

  const handleColorChange = (nextColor: Color) => {
    if (nextColor === playerColor) return;
    setPlayerColor(nextColor);
    startNewGame(mode, nextColor);
  };

  const handleCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    sceneRef.current?.setCameraPreset(preset);
  }, []);

  const handleUndo = useCallback(() => {
    const c = chessRef.current;
    if (history.length === 0) return;

    if (aiTimerRef.current !== null) {
      window.clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    requestIdRef.current++;
    setAiThinking(false);
    setHintLoading(false);
    setPendingPromotion(null);
    setSelectedSquare(null);
    setHintMove(null);
    setOverlayDismissed(false);

    if (modeRef.current === 'ai') {
      // Undo both AI reply and player move if it's currently player's turn
      if (c.turn() === playerColorRef.current && history.length >= 2) {
        c.undo();
        c.undo();
      } else {
        c.undo();
      }
      // If playing Black and we undid back to move 0 (White's turn), trigger AI first move
      sceneRef.current?.syncBoard(extractPieces(c));
      setFen(c.fen());
      if (c.turn() !== playerColorRef.current && !c.isGameOver()) {
        aiTimerRef.current = window.setTimeout(() => {
          aiTimerRef.current = null;
          requestAIMove();
        }, 300);
      }
    } else {
      c.undo();
      sceneRef.current?.syncBoard(extractPieces(c));
      setFen(c.fen());
    }
  }, [history.length, requestAIMove]);

  const handleHint = useCallback(() => {
    const c = chessRef.current;
    if (c.isGameOver() || aiThinking || hintLoading || !workerRef.current) return;
    if (mode === 'ai' && c.turn() !== playerColor) return;

    const reqId = ++requestIdRef.current;
    setHintLoading(true);
    const payload: AIRequest = {
      id: reqId,
      type: 'hint',
      fen: c.fen(),
      difficulty: 'hard',
    };
    workerRef.current.postMessage(payload);
  }, [aiThinking, hintLoading, mode, playerColor]);

  const handlePromotionChoice = (piece: PieceSymbol) => {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    setPendingPromotion(null);
    commitMove(from, to, piece);
  };

  const handleKeyboardMoveSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = keyboardInput.trim();
    if (!raw) return;

    const c = chessRef.current;
    if (c.isGameOver() || aiThinking) return;
    if (mode === 'ai' && c.turn() !== playerColor) return;

    // Support UCI coordinate format like "e2e4" or "e7e8q" AND SAN like "Nf3", "O-O"
    const uciMatch = raw.toLowerCase().match(/^([a-h][1-8])[-\s]?([a-h][1-8])([qrbn])?$/);
    if (uciMatch) {
      const from = uciMatch[1] as Square;
      const to = uciMatch[2] as Square;
      const promo = (uciMatch[3] as PieceSymbol | undefined) ?? undefined;
      const ok = commitMove(from, to, promo ?? 'q');
      if (ok) {
        setKeyboardInput('');
        setKeyboardError('');
        return;
      }
    }

    // Try Standard Algebraic Notation (e.g. "Nf3", "e4", "O-O", "Qxd5")
    try {
      const probe = new Chess(c.fen());
      const parsed = probe.move(raw);
      if (parsed) {
        const ok = commitMove(parsed.from, parsed.to, parsed.promotion);
        if (ok) {
          setKeyboardInput('');
          setKeyboardError('');
          return;
        }
      }
    } catch {
      // Fall through to error feedback
    }

    setKeyboardError(t.keyboardMoveInvalid);
  };

  const toggleFullscreen = useCallback(async () => {
    const el = workspaceRef.current as
      | (HTMLDivElement & { webkitRequestFullscreen?: () => Promise<void> | void })
      | null;
    const doc = document as Document & {
      webkitFullscreenElement?: Element | null;
      webkitExitFullscreen?: () => Promise<void> | void;
    };

    if (isFullscreen) {
      setIsPseudoFullscreen(false);
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        try {
          if (doc.exitFullscreen) {
            await doc.exitFullscreen();
          } else if (doc.webkitExitFullscreen) {
            await doc.webkitExitFullscreen();
          }
        } catch {
          // Already exited or unsupported
        }
      }
      return;
    }

    if (!el) return;
    // Immediately engage edge-to-edge viewport fullscreen so there is zero latency or no-op stall
    setIsPseudoFullscreen(true);
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        setIsNativeFullscreen(true);
        setIsPseudoFullscreen(false);
      }
    } catch {
      // Keep seamless viewport fullscreen active when native Fullscreen API is unavailable or blocked
    }
  }, [isFullscreen]);

  // Keep native fullscreen state synced with browser fullscreen events
  useEffect(() => {
    const doc = document as Document & { webkitFullscreenElement?: Element | null };
    const onFullscreenChange = () => {
      const active = Boolean(doc.fullscreenElement || doc.webkitFullscreenElement);
      setIsNativeFullscreen(active);
      if (active) {
        setIsPseudoFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  // Lock page scrolling during CSS fallback fullscreen
  useEffect(() => {
    if (!isPseudoFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isPseudoFullscreen]);

  // Global keyboard shortcuts (when not typing in an input)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === '1') {
        handleCameraPreset('white');
      } else if (e.key === '2') {
        handleCameraPreset('black');
      } else if (e.key === '3') {
        handleCameraPreset('top');
      } else if (e.key === '4') {
        handleCameraPreset('side');
      } else if (e.key.toLowerCase() === 'h') {
        handleHint();
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        void toggleFullscreen();
      } else if (e.key === 'Escape') {
        setSelectedSquare(null);
        setPendingPromotion(null);
        setIsPseudoFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleCameraPreset, handleHint, handleUndo, toggleFullscreen]);

  // Pair moves into full-move rows for the compact move strip
  const movePairs = useMemo(() => {
    const pairs: { num: number; white: string; black?: string }[] = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({
        num: Math.floor(i / 2) + 1,
        white: history[i].san,
        black: history[i + 1]?.san,
      });
    }
    return pairs;
  }, [history]);

  const difficulties: { key: AIDifficulty; label: string }[] = [
    { key: 'easy', label: t.diffEasy },
    { key: 'medium', label: t.diffMedium },
    { key: 'hard', label: t.diffHard },
    { key: 'expert', label: t.diffExpert },
  ];

  const cameraButtons: { key: CameraPreset; label: string; aria: string }[] = [
    { key: 'white', label: t.camWhite, aria: t.camWhiteAria },
    { key: 'black', label: t.camBlack, aria: t.camBlackAria },
    { key: 'top', label: t.camTop, aria: t.camTopAria },
    { key: 'side', label: t.camSide, aria: t.camSideAria },
  ];

  return (
    <div
      ref={workspaceRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 flex h-[100dvh] w-screen max-w-none flex-col overflow-hidden bg-card'
          : 'surface-card mx-auto w-full max-w-5xl overflow-hidden rounded-2xl'
      }
    >
      {/* Screen Reader Live Region for Moves, Checks, Promotions & Outcomes */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Top Status & Captured Pieces Strip */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle/40 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full border border-ink-primary/30 shadow-sm ${
              gameState.turn === 'w' ? 'bg-[#F6F4F0]' : 'bg-[#1F242D]'
            }`}
            aria-hidden="true"
          />
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              gameState.isCheckmate
                ? 'bg-[var(--status-win-bg)] text-[var(--status-win-text)]'
                : gameState.inCheck
                  ? 'bg-[var(--status-check-bg)] text-[var(--status-check-text)]'
                  : 'bg-card text-ink-primary border border-line'
            }`}
          >
            {aiThinking ? t.aiThinking : gameState.statusText}
          </span>
          {hintMove && (
            <span className="rounded-full bg-[var(--badge-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--badge-text)]">
              {t.hintSuggested}: <span className="font-mono">{hintMove.san}</span>
            </span>
          )}
        </div>

        {/* Compact Captured Piece Trays */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-secondary">
          <div className="flex items-center gap-1" aria-label={t.capturedByWhite}>
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink-primary/30 bg-[#F6F4F0]" aria-hidden="true" />
            <span className="min-w-[1.25rem] font-serif text-base leading-none tracking-tight text-ink-primary">
              {captured.byWhite.length > 0
                ? captured.byWhite.map((p, idx) => <span key={`w-${idx}`}>{PIECE_UNICODE.b[p]}</span>)
                : '—'}
            </span>
            {captured.whiteAdvantage > 0 && (
              <span className="font-mono font-semibold text-accent-text">+{captured.whiteAdvantage}</span>
            )}
          </div>
          <div className="flex items-center gap-1" aria-label={t.capturedByBlack}>
            <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink-primary/30 bg-[#1F242D]" aria-hidden="true" />
            <span className="min-w-[1.25rem] font-serif text-base leading-none tracking-tight text-ink-primary">
              {captured.byBlack.length > 0
                ? captured.byBlack.map((p, idx) => <span key={`b-${idx}`}>{PIECE_UNICODE.w[p]}</span>)
                : '—'}
            </span>
            {captured.whiteAdvantage < 0 && (
              <span className="font-mono font-semibold text-accent-text">+{Math.abs(captured.whiteAdvantage)}</span>
            )}
          </div>
          {isFullscreen && (
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              aria-label={t.fullscreenExit}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-ink-primary transition-colors hover:bg-subtle"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </svg>
              <span>{t.fullscreenExit}</span>
            </button>
          )}
        </div>
      </div>

      {/* Fixed Aspect-Ratio (or Edge-to-Edge Full Screen) 3D Chessboard Canvas Container (CLS = 0) */}
      <div
        className={
          isFullscreen
            ? 'relative flex-1 min-h-0 w-full bg-[var(--canvas-bg)]'
            : 'relative aspect-[4/3] w-full min-h-[340px] max-h-[580px] bg-[var(--canvas-bg)] sm:aspect-[16/10]'
        }
      >
        <div
          ref={canvasHostRef}
          role="application"
          aria-label={t.canvasAriaLabel}
          className="h-full w-full select-none"
        />

        {!sceneReady && !webglError && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[var(--canvas-bg)]/90">
            <p className="rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-medium text-ink-primary shadow-sm">
              {t.loading3D}
            </p>
          </div>
        )}

        {webglError && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div className="surface-card max-w-md rounded-2xl p-6">
              <h2 className="text-lg font-bold text-ink-primary">{t.webglFallbackTitle}</h2>
              <p className="mt-2 text-sm text-ink-secondary">{t.webglFallbackBody}</p>
            </div>
          </div>
        )}

        {/* Subtle Bottom-Center Camera & Gesture Hint Pill */}
        {sceneReady && !gameState.isOver && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full border border-line bg-card px-3.5 py-1 text-xs font-medium text-ink-secondary shadow-sm sm:block">
            {t.boardControlsTip}
          </div>
        )}

        {/* Game Over Floating Banner */}
        {gameState.isOver && !overlayDismissed && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
            <div className="surface-card w-full max-w-sm rounded-2xl p-6 text-center">
              <p className="text-xl font-bold text-ink-primary">{gameState.statusText}</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => startNewGame()}
                  className="btn-primary min-h-[44px] rounded-xl px-5 py-2.5 text-sm font-semibold"
                >
                  {t.playAgain}
                </button>
                <button
                  type="button"
                  onClick={() => setOverlayDismissed(true)}
                  className="min-h-[44px] rounded-xl border border-line bg-card px-4 py-2.5 text-sm font-semibold text-ink-primary transition-colors hover:bg-subtle"
                >
                  {t.dismissOverlay}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Accessible Pawn Promotion Picker Modal */}
        {pendingPromotion && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="promotion-dialog-title"
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          >
            <div className="surface-card w-full max-w-sm rounded-2xl p-5 text-center">
              <h2 id="promotion-dialog-title" className="text-lg font-bold text-ink-primary">
                {t.promotionTitle}
              </h2>
              <p className="mt-1 text-sm text-ink-secondary">{t.promotionSubtitle}</p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {(['q', 'r', 'b', 'n'] as const).map((piece) => (
                  <button
                    key={piece}
                    type="button"
                    onClick={() => handlePromotionChoice(piece)}
                    className="flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl border border-line bg-subtle/40 p-2 text-ink-primary transition-colors hover:border-accent hover:bg-subtle"
                  >
                    <span className="font-serif text-3xl leading-none" aria-hidden="true">
                      {PIECE_UNICODE[pendingPromotion.color][piece]}
                    </span>
                    <span className="text-xs font-semibold">{getPieceName(piece, t)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Big, Clear, Minimal Controls Bar */}
      <div
        className={`shrink-0 space-y-3 border-t border-line bg-card p-4 sm:p-5 ${
          isFullscreen ? 'max-h-[36vh] overflow-y-auto' : ''
        }`}
      >
        {/* Primary Row: New Game, Mode, Side, Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => startNewGame()}
              className="btn-primary inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>{t.newGame}</span>
            </button>

            {/* Mode Toggle: vs AI / 2-Player Pass & Play */}
            <div className="inline-flex rounded-xl border border-line bg-subtle/50 p-1" role="group" aria-label={t.modeLabel}>
              <button
                type="button"
                aria-pressed={mode === 'ai'}
                onClick={() => handleModeChange('ai')}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  mode === 'ai'
                    ? 'bg-accent-slate text-page shadow-sm dark:bg-accent dark:text-[#11151C]'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {t.modeAi}
              </button>
              <button
                type="button"
                aria-pressed={mode === 'local'}
                onClick={() => handleModeChange('local')}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                  mode === 'local'
                    ? 'bg-accent-slate text-page shadow-sm dark:bg-accent dark:text-[#11151C]'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {t.modeLocal}
              </button>
            </div>

            {/* Play as White / Black (visible in vs AI mode) */}
            {mode === 'ai' && (
              <div className="inline-flex rounded-xl border border-line bg-subtle/50 p-1" role="group" aria-label={t.playAsLabel}>
                <button
                  type="button"
                  aria-pressed={playerColor === 'w'}
                  onClick={() => handleColorChange('w')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                    playerColor === 'w'
                      ? 'bg-accent-slate text-page shadow-sm dark:bg-accent dark:text-[#11151C]'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {t.white}
                </button>
                <button
                  type="button"
                  aria-pressed={playerColor === 'b'}
                  onClick={() => handleColorChange('b')}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
                    playerColor === 'b'
                      ? 'bg-accent-slate text-page shadow-sm dark:bg-accent dark:text-[#11151C]'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {t.black}
                </button>
              </div>
            )}
          </div>

          {/* Action Utilities: Hint, Undo, Sound */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleHint}
              disabled={gameState.isOver || aiThinking || hintLoading}
              aria-label={t.hintAria}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink-primary transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4 text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                <path d="M9 18h6" />
                <path d="M10 22h4" />
              </svg>
              <span>{t.hint}</span>
            </button>

            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length === 0}
              aria-label={t.undoAria}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink-primary transition-colors hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 14 4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
              <span>{t.undo}</span>
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-pressed={soundEnabled}
              aria-label={t.soundToggleAria}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink-primary transition-colors hover:bg-subtle"
            >
              {soundEnabled ? (
                <svg className="h-4 w-4 text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-ink-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="22" y1="9" x2="16" y2="15" />
                  <line x1="16" y1="9" x2="22" y2="15" />
                </svg>
              )}
              <span className="hidden sm:inline">{soundEnabled ? t.soundOn : t.soundOff}</span>
            </button>

            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              aria-pressed={isFullscreen}
              aria-label={t.fullscreenToggleAria}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-line bg-card px-3.5 py-2 text-sm font-semibold text-ink-primary transition-colors hover:bg-subtle"
            >
              {isFullscreen ? (
                <svg className="h-4 w-4 text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                  <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                  <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                  <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                  <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                  <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                  <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {isFullscreen ? t.fullscreenExit : t.fullscreenEnter}
              </span>
            </button>
          </div>
        </div>

        {/* Secondary Row: AI Difficulty & 3D Camera Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-3">
          {mode === 'ai' && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                {t.difficultyLabel}:
              </span>
              <div className="inline-flex flex-wrap rounded-xl border border-line bg-subtle/50 p-1" role="group" aria-label={t.difficultyLabel}>
                {difficulties.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    aria-pressed={difficulty === d.key}
                    onClick={() => setDifficulty(d.key)}
                    className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                      difficulty === d.key
                        ? 'bg-accent-slate text-page shadow-sm dark:bg-accent dark:text-[#11151C]'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              {t.cameraLabel}:
            </span>
            <div className="inline-flex flex-wrap rounded-xl border border-line bg-subtle/50 p-1" role="group" aria-label={t.cameraLabel}>
              {cameraButtons.map((cam) => (
                <button
                  key={cam.key}
                  type="button"
                  aria-label={cam.aria}
                  aria-pressed={cameraPreset === cam.key}
                  onClick={() => handleCameraPreset(cam.key)}
                  className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                    cameraPreset === cam.key
                      ? 'bg-accent-slate text-page shadow-sm dark:bg-accent dark:text-[#11151C]'
                      : 'text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Move History & Accessible Keyboard Move Input */}
        <div className="flex flex-col gap-3 border-t border-line/70 pt-3 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto text-xs text-ink-secondary">
            <span className="shrink-0 font-semibold uppercase tracking-wider text-ink-secondary">
              {t.movesLabel}:
            </span>
            {movePairs.length === 0 ? (
              <span className="italic">{t.noMovesYet}</span>
            ) : (
              <div className="flex items-center gap-2 font-mono text-ink-primary">
                {movePairs.map((pair) => (
                  <span key={pair.num} className="shrink-0 rounded-md bg-subtle/60 px-2 py-1">
                    <span className="text-ink-secondary">{pair.num}.</span> {pair.white}
                    {pair.black ? ` ${pair.black}` : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleKeyboardMoveSubmit} className="flex shrink-0 items-center gap-1.5">
            <label htmlFor="keyboard-move-input" className="sr-only">
              {t.keyboardMoveLabel}
            </label>
            <input
              id="keyboard-move-input"
              type="text"
              value={keyboardInput}
              onChange={(e) => {
                setKeyboardInput(e.target.value);
                if (keyboardError) setKeyboardError('');
              }}
              placeholder={t.keyboardMovePlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-36 rounded-lg border border-line bg-page px-3 font-mono text-xs text-ink-primary placeholder:text-ink-secondary/75 sm:w-40"
            />
            <button
              type="submit"
              disabled={gameState.isOver || aiThinking}
              className="h-10 rounded-lg border border-line bg-subtle px-3 text-xs font-semibold text-ink-primary transition-colors hover:bg-subtle/80 disabled:opacity-50"
            >
              {t.keyboardMoveSubmit}
            </button>
          </form>
        </div>

        {keyboardError && (
          <p role="alert" className="text-xs font-medium text-[var(--status-check-text)]">
            {keyboardError}
          </p>
        )}
      </div>
    </div>
  );
}
