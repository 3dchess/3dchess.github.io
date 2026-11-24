import { Chess, type Move, type PieceSymbol } from 'chess.js';

export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface AIRequest {
  id: number;
  type: 'move' | 'hint';
  fen: string;
  difficulty: AIDifficulty;
}

export interface AIResponse {
  id: number;
  type: 'move' | 'hint';
  move: {
    from: string;
    to: string;
    promotion?: string;
    san: string;
  } | null;
}

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-Square Tables oriented from White's perspective:
// Row 0 = rank 8 (promotion side), Row 7 = rank 1 (White's back rank)
const PST_PAWN = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 27, 27, 10, 5, 5],
  [0, 0, 0, 24, 24, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const PST_KNIGHT = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const PST_BISHOP = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const PST_ROOK = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const PST_QUEEN = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const PST_KING_MID = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const PST_KING_END = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50],
];

const PST_MAP: Record<Exclude<PieceSymbol, 'k'>, number[][]> = {
  p: PST_PAWN,
  n: PST_KNIGHT,
  b: PST_BISHOP,
  r: PST_ROOK,
  q: PST_QUEEN,
};

function evaluateBoard(chess: Chess): number {
  const board = chess.board();
  let score = 0;
  let whiteBishops = 0;
  let blackBishops = 0;
  let nonPawnMaterial = 0;

  // First pass: estimate endgame phase
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece.type === 'p' || piece.type === 'k') continue;
      nonPawnMaterial += PIECE_VALUES[piece.type];
    }
  }
  const isEndgame = nonPawnMaterial <= 2600;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const row = piece.color === 'w' ? r : 7 - r;
      let val = PIECE_VALUES[piece.type];

      if (piece.type === 'k') {
        val += isEndgame ? PST_KING_END[row][c] : PST_KING_MID[row][c];
      } else {
        val += PST_MAP[piece.type][row][c];
      }

      if (piece.type === 'b') {
        if (piece.color === 'w') whiteBishops++;
        else blackBishops++;
      }

      score += piece.color === 'w' ? val : -val;
    }
  }

  if (whiteBishops >= 2) score += 30;
  if (blackBishops >= 2) score -= 30;

  // Return score from side-to-move's perspective (Negamax convention)
  return chess.turn() === 'w' ? score : -score;
}

function scoreMove(move: Move): number {
  let score = 0;
  if (move.captured) {
    // MVV-LVA: prioritize high-value victims captured by low-value attackers
    score += 10 * PIECE_VALUES[move.captured] - PIECE_VALUES[move.piece];
  }
  if (move.promotion) {
    score += PIECE_VALUES[move.promotion] * 8;
  }
  if (move.san.includes('+')) {
    score += 60;
  }
  if (move.san === 'O-O' || move.san === 'O-O-O') {
    score += 45;
  }
  return score;
}

function orderMoves(moves: Move[]): Move[] {
  return moves.sort((a, b) => scoreMove(b) - scoreMove(a));
}

interface SearchContext {
  deadline: number;
  aborted: boolean;
  nodes: number;
  useQuiescence: boolean;
}

const MATE_SCORE = 100000;

function quiescence(chess: Chess, alpha: number, beta: number, qDepth: number, ctx: SearchContext): number {
  ctx.nodes++;
  if ((ctx.nodes & 1023) === 0 && performance.now() > ctx.deadline) {
    ctx.aborted = true;
    return 0;
  }

  const standPat = evaluateBoard(chess);
  if (standPat >= beta) return beta;
  if (standPat > alpha) alpha = standPat;
  if (qDepth <= 0) return alpha;

  const tacticalMoves = orderMoves(
    chess.moves({ verbose: true }).filter((m) => m.captured !== undefined || m.promotion !== undefined),
  );

  for (const move of tacticalMoves) {
    chess.move(move);
    const score = -quiescence(chess, -beta, -alpha, qDepth - 1, ctx);
    chess.undo();
    if (ctx.aborted) return 0;
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }

  return alpha;
}

function negamax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  ply: number,
  ctx: SearchContext,
): number {
  ctx.nodes++;
  if ((ctx.nodes & 1023) === 0 && performance.now() > ctx.deadline) {
    ctx.aborted = true;
    return 0;
  }

  if (chess.isCheckmate()) {
    return -MATE_SCORE + ply;
  }
  if (chess.isDraw()) {
    return 0;
  }

  if (depth <= 0) {
    return ctx.useQuiescence ? quiescence(chess, alpha, beta, 4, ctx) : evaluateBoard(chess);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));
  if (moves.length === 0) {
    return chess.inCheck() ? -MATE_SCORE + ply : 0;
  }

  let best = -Infinity;
  for (const move of moves) {
    chess.move(move);
    const score = -negamax(chess, depth - 1, -beta, -alpha, ply + 1, ctx);
    chess.undo();

    if (ctx.aborted) return 0;

    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }

  return best;
}

function findBestMove(fen: string, difficulty: AIDifficulty, isHint: boolean): Move | null {
  const chess = new Chess(fen);
  const legalMoves = orderMoves(chess.moves({ verbose: true }));
  if (legalMoves.length === 0) return null;
  if (legalMoves.length === 1) return legalMoves[0];

  const effectiveDiff: AIDifficulty = isHint ? 'hard' : difficulty;

  // Easy mode: quick evaluation with gentle beginner-friendly inaccuracy
  if (effectiveDiff === 'easy') {
    const scored: { move: Move; score: number }[] = [];
    const ctx: SearchContext = {
      deadline: performance.now() + 250,
      aborted: false,
      nodes: 0,
      useQuiescence: false,
    };
    for (const move of legalMoves) {
      chess.move(move);
      const val = -negamax(chess, 1, -Infinity, Infinity, 1, ctx);
      chess.undo();
      // Add controlled positional noise so Easy feels approachable
      scored.push({ move, score: val + (Math.random() - 0.5) * 180 });
    }
    scored.sort((a, b) => b.score - a.score);
    const poolSize = Math.min(3, scored.length);
    return scored[Math.floor(Math.random() * poolSize)].move;
  }

  const config: Record<Exclude<AIDifficulty, 'easy'>, { maxDepth: number; timeMs: number; qSearch: boolean; noise: number }> = {
    medium: { maxDepth: 2, timeMs: 450, qSearch: false, noise: 22 },
    hard: { maxDepth: 3, timeMs: 900, qSearch: true, noise: 6 },
    expert: { maxDepth: 4, timeMs: 1450, qSearch: true, noise: 0 },
  };

  const { maxDepth, timeMs, qSearch, noise } = config[effectiveDiff];
  const deadline = performance.now() + timeMs;
  let bestMoveOverall: Move = legalMoves[0];

  // Iterative deepening so Expert always finishes smoothly within time budget
  for (let depth = 1; depth <= maxDepth; depth++) {
    const ctx: SearchContext = {
      deadline,
      aborted: false,
      nodes: 0,
      useQuiescence: qSearch && depth >= 2,
    };

    // Search previous iteration's best move first for maximum Alpha-Beta pruning
    const ordered = [...legalMoves];
    const bestIdx = ordered.findIndex(
      (m) => m.from === bestMoveOverall.from && m.to === bestMoveOverall.to && m.promotion === bestMoveOverall.promotion,
    );
    if (bestIdx > 0) {
      const [prevBest] = ordered.splice(bestIdx, 1);
      ordered.unshift(prevBest);
    }

    let bestMoveAtDepth: Move = ordered[0];
    let bestScoreAtDepth = -Infinity;
    let alpha = -Infinity;
    const beta = Infinity;

    for (const move of ordered) {
      chess.move(move);
      let score = -negamax(chess, depth - 1, -beta, -alpha, 1, ctx);
      chess.undo();

      if (ctx.aborted) break;

      if (noise > 0 && depth === maxDepth) {
        score += (Math.random() - 0.5) * noise;
      }

      if (score > bestScoreAtDepth) {
        bestScoreAtDepth = score;
        bestMoveAtDepth = move;
      }
      if (score > alpha) {
        alpha = score;
      }
    }

    if (!ctx.aborted) {
      bestMoveOverall = bestMoveAtDepth;
      // Forced mate found — stop early
      if (Math.abs(bestScoreAtDepth) > MATE_SCORE - 100) {
        break;
      }
    } else {
      break;
    }
  }

  return bestMoveOverall;
}

self.onmessage = (event: MessageEvent<AIRequest>) => {
  const { id, type, fen, difficulty } = event.data;
  try {
    const move = findBestMove(fen, difficulty, type === 'hint');
    const response: AIResponse = {
      id,
      type,
      move: move
        ? {
            from: move.from,
            to: move.to,
            promotion: move.promotion,
            san: move.san,
          }
        : null,
    };
    self.postMessage(response);
  } catch {
    self.postMessage({ id, type, move: null } satisfies AIResponse);
  }
};
