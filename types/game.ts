// ─── Core Game Types ──────────────────────────────────────────────────────────

/** The four neon colors used in every shape and on the ball. */
export type GameColor = 'pink' | 'cyan' | 'yellow' | 'green';

/** Top-level game screen / status. */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover';

/** Preset difficulty modes. */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Shape varieties rendered on screen. */
export type ShapeType = 'ring' | 'star';

/** Whether the ball has reached / passed through an obstacle. */
export type TransitState = 'waiting' | 'transiting' | 'passed';

/** Sound event identifiers. */
export type SoundType = 'jump' | 'score' | 'colorChange' | 'death';

// ─── Entity Definitions ───────────────────────────────────────────────────────

export interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
  color: string;
}

export interface Ball {
  x: number;
  /** World Y coordinate (canvas coords — positive = downward). */
  y: number;
  vy: number;
  color: GameColor;
  trail: TrailPoint[];
  pulsePhase: number;
}

export interface Obstacle {
  id: number;
  x: number;
  /** World Y coordinate of the shape center. */
  y: number;
  type: ShapeType;
  rotation: number;
  rotationSpeed: number;
  /** Exactly 4 color segments, in clockwise order starting from the top. */
  colors: [GameColor, GameColor, GameColor, GameColor];
  innerRadius: number;
  outerRadius: number;
  /** True once the ball has successfully cleared this obstacle (upward). */
  scored: boolean;
  transitState: TransitState;
}

export interface ColorChanger {
  id: number;
  x: number;
  /** World Y coordinate. */
  y: number;
  color: GameColor;
  collected: boolean;
  radius: number;
  pulsePhase: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  radius: number;
  maxLife: number;
  life: number;
}

// ─── Top-Level Game State ─────────────────────────────────────────────────────

export interface GameState {
  status: GameStatus;
  score: number;
  ball: Ball;
  obstacles: Obstacle[];
  colorChangers: ColorChanger[];
  particles: Particle[];
  /** World Y of the canvas top-left corner (negative = camera has scrolled up). */
  cameraOffset: number;
  difficulty: DifficultyLevel;
  nextId: number;
  frameCount: number;
  /**
   * True until the player taps/clicks for the first time after PLAY.
   * While true, physics are frozen — the ball hovers and rings spin
   * so the player can see the mechanic before committing.
   */
  waitingFirstTap: boolean;
}

/** Events emitted by a single update tick, consumed by the game component. */
export interface FrameEvents {
  died: boolean;
  scored: boolean;
  colorChanged: boolean;
}
