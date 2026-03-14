import type { GameColor, DifficultyLevel } from '@/types/game';

// ─── Color Palette ────────────────────────────────────────────────────────────

/** Hex values for the four neon game colors. */
export const GAME_COLORS: Record<GameColor, string> = {
  pink:   '#FF2D6B',
  cyan:   '#00E5FF',
  yellow: '#FFE100',
  green:  '#00FF7F',
};

/** Canonical ordering used when shuffling / cycling colors. */
export const COLOR_ORDER: GameColor[] = ['pink', 'cyan', 'yellow', 'green'];

// ─── Physics ──────────────────────────────────────────────────────────────────

export const PHYSICS = {
  gravity:       0.45,   // px per frame²
  jumpVelocity: -11,     // px per frame (negative = upward)
  maxFallSpeed:  16,     // clamp vy to avoid tunnelling
  ballRadius:    13,
  trailLength:   9,
} as const;

// ─── Obstacle Geometry ────────────────────────────────────────────────────────

export const RING = {
  innerRadius: 48,
  outerRadius: 76,
  /** Fraction of each segment arc that acts as a gap (no collision). */
  gapFraction: 0.07,
} as const;

export const STAR = {
  innerRadius: 48,
  outerRadius: 80,
  /** Larger gap on star arms — passing is trickier visually but not physically. */
  gapFraction: 0.38,
} as const;

// ─── Camera ───────────────────────────────────────────────────────────────────

/** Ball stays at this fraction from the top of the canvas when rising. */
export const CAMERA_FOLLOW_Y = 0.40;

/** Ball's initial screen position (fraction from top). */
export const BALL_START_SCREEN_Y = 0.68;

// ─── Level / World ────────────────────────────────────────────────────────────

export const LEVEL = {
  /** World-unit gap between consecutive obstacles (negative = upward). */
  obstacleSpacing:    290,
  /** Generate more obstacles when fewer than this many world units are ahead. */
  generateAhead:     1400,
  /** Remove obstacles that fall more than this many px below the screen. */
  cleanupBelow:       400,
  /** Initial batch of obstacles to generate at startup. */
  initialCount:         8,
} as const;

// ─── Difficulty Presets ───────────────────────────────────────────────────────

export const DIFFICULTY: Record<DifficultyLevel, {
  label: string;
  baseRotationSpeed: number;
  /** Multiplied onto rotation speed every 5 points scored. */
  progressionRate: number;
}> = {
  easy:   { label: 'Easy',   baseRotationSpeed: 0.012, progressionRate: 0.015 },
  medium: { label: 'Medium', baseRotationSpeed: 0.022, progressionRate: 0.022 },
  hard:   { label: 'Hard',   baseRotationSpeed: 0.036, progressionRate: 0.030 },
};

// ─── Color Changer ────────────────────────────────────────────────────────────

export const CHANGER_RADIUS = 16;
