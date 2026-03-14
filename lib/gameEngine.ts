/**
 * gameEngine.ts
 * ─────────────
 * Pure game-logic functions: state creation, per-frame update,
 * level generation, collision detection, and particle spawning.
 * All functions mutate `GameState` in place for performance.
 */

import type {
  GameState, GameColor, DifficultyLevel, Obstacle,
  ColorChanger, Particle, FrameEvents, ShapeType,
} from '@/types/game';
import {
  PHYSICS, RING, STAR, GAME_COLORS, COLOR_ORDER,
  CAMERA_FOLLOW_Y, BALL_START_SCREEN_Y,
  LEVEL, DIFFICULTY, CHANGER_RADIUS,
} from './constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomColor(): GameColor {
  return COLOR_ORDER[Math.floor(Math.random() * COLOR_ORDER.length)];
}

function shuffleColors(): [GameColor, GameColor, GameColor, GameColor] {
  const c = [...COLOR_ORDER] as GameColor[];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c as [GameColor, GameColor, GameColor, GameColor];
}

function normalizeAngle(a: number): number {
  return ((a % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

// ─── Level Generation ─────────────────────────────────────────────────────────

/**
 * Appends `count` new obstacles + color-changers to the state.
 * `fromWorldY` is the worldY of the highest existing obstacle (most negative).
 */
export function generateObstacles(
  state: GameState,
  fromWorldY: number,
  count: number,
  canvasWidth: number,
): void {
  const diff = DIFFICULTY[state.difficulty];
  const cx = canvasWidth / 2;
  const score = state.score;

  for (let i = 0; i < count; i++) {
    const obsY = fromWorldY - (i + 1) * LEVEL.obstacleSpacing;
    // Color changer sits halfway between previous obstacle and this one
    const changerY = obsY + LEVEL.obstacleSpacing * 0.5;

    // ── Color changer ──
    state.colorChangers.push({
      id: state.nextId++,
      x: cx,
      y: changerY,
      color: randomColor(),
      collected: false,
      radius: CHANGER_RADIUS,
      pulsePhase: rand(0, Math.PI * 2),
    } satisfies ColorChanger);

    // ── Obstacle ──
    const direction = Math.random() < 0.25 ? -1 : 1; // 25% reverse spin
    const type: ShapeType = Math.random() < 0.72 ? 'ring' : 'star';
    const speedProgress = 1 + score * diff.progressionRate * 0.04;
    const rotSpeed = direction * (diff.baseRotationSpeed + rand(0, diff.baseRotationSpeed * 0.5)) * speedProgress;

    const geo = type === 'ring' ? RING : STAR;
    state.obstacles.push({
      id: state.nextId++,
      x: cx,
      y: obsY,
      type,
      rotation: rand(0, Math.PI * 2),
      rotationSpeed: rotSpeed,
      colors: shuffleColors(),
      innerRadius: geo.innerRadius,
      outerRadius: geo.outerRadius,
      scored: false,
      transitState: 'waiting',
    } satisfies Obstacle);
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

export function createInitialState(
  canvasWidth: number,
  canvasHeight: number,
  difficulty: DifficultyLevel,
): GameState {
  const ballScreenY = canvasHeight * BALL_START_SCREEN_Y;
  // cameraOffset: worldY at the top of the canvas
  // ball worldY = 0, screenY = 0 - cameraOffset, so cameraOffset = -ballScreenY
  const cameraOffset = -ballScreenY;

  const state: GameState = {
    status: 'playing',
    score: 0,
    ball: {
      x: canvasWidth / 2,
      y: 0,       // world Y
      vy: 0,
      color: randomColor(),
      trail: [],
      pulsePhase: 0,
    },
    obstacles: [],
    colorChangers: [],
    particles: [],
    cameraOffset,
    difficulty,
    nextId: 1,
    frameCount: 0,
    // Physics are frozen until the player taps for the first time.
    // This gives them unlimited time to read the screen and orient.
    waitingFirstTap: true,
  };

  // First obstacle is placed above ball start, with no changer before it
  // so player immediately sees the first ring.
  const firstObsY = -LEVEL.obstacleSpacing * 0.7; // ~200px above ball
  generateObstacles(state, firstObsY + LEVEL.obstacleSpacing, LEVEL.initialCount, canvasWidth);

  return state;
}

// ─── Jump ─────────────────────────────────────────────────────────────────────

export function jumpBall(state: GameState): void {
  // First tap unfreezes physics; subsequent taps also apply the jump force.
  state.waitingFirstTap = false;
  state.ball.vy = PHYSICS.jumpVelocity;
}

// ─── Particle Helpers ─────────────────────────────────────────────────────────

function spawnParticles(
  state: GameState,
  x: number,
  y: number,
  color: string,
  count: number,
  speedScale = 1,
): void {
  for (let i = 0; i < count; i++) {
    const angle = rand(0, Math.PI * 2);
    const speed = rand(1.5, 5) * speedScale;
    state.particles.push({
      id: state.nextId++,
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      color,
      alpha: 1,
      radius: rand(3, 7),
      maxLife: 35 + Math.floor(rand(0, 20)),
      life: 35 + Math.floor(rand(0, 20)),
    } satisfies Particle);
  }
}

// ─── Main Update ──────────────────────────────────────────────────────────────

export function updateGame(
  state: GameState,
  canvasWidth: number,
  canvasHeight: number,
): FrameEvents {
  const events: FrameEvents = { died: false, scored: false, colorChanged: false };
  const { ball } = state;
  state.frameCount++;

  // ── Waiting for first tap — only spin obstacles, no physics ──────────────
  if (state.waitingFirstTap) {
    ball.pulsePhase += 0.08;
    for (const obs of state.obstacles) obs.rotation += obs.rotationSpeed;
    for (const ch of state.colorChangers) ch.pulsePhase += 0.08;
    return events;
  }

  // ── Physics ──────────────────────────────────────────────────────────────
  ball.vy = Math.min(ball.vy + PHYSICS.gravity, PHYSICS.maxFallSpeed);
  ball.y += ball.vy;

  // Trail
  ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 1, color: GAME_COLORS[ball.color] });
  if (ball.trail.length > PHYSICS.trailLength) ball.trail.pop();
  ball.trail.forEach((p, i) => { p.alpha = 1 - (i + 1) / (PHYSICS.trailLength + 1); });
  ball.pulsePhase += 0.12;

  // ── Camera ───────────────────────────────────────────────────────────────
  // Camera target keeps ball at CAMERA_FOLLOW_Y from top
  const targetOffset = ball.y - canvasHeight * CAMERA_FOLLOW_Y;
  if (targetOffset < state.cameraOffset) state.cameraOffset = targetOffset;

  const ballScreenY = ball.y - state.cameraOffset;

  // ── Death — fell off bottom ───────────────────────────────────────────────
  if (ballScreenY > canvasHeight + 60) {
    state.status = 'gameover';
    spawnParticles(state, ball.x, ball.y, GAME_COLORS[ball.color], 24, 1.5);
    events.died = true;
    return events;
  }

  // ── Obstacle update & collision ───────────────────────────────────────────
  for (const obs of state.obstacles) {
    obs.rotation += obs.rotationSpeed;

    if (obs.transitState !== 'waiting') {
      // Check exit from ring zone
      if (obs.transitState === 'transiting') {
        const dist = Math.abs(ball.y - obs.y); // ball.x === obs.x
        if (dist > obs.outerRadius + PHYSICS.ballRadius + 4) {
          obs.transitState = 'passed';
          // Score: ball exited from above
          if (!obs.scored && ball.y < obs.y) {
            obs.scored = true;
            state.score++;
            events.scored = true;
          }
        }
      }
      continue;
    }

    // ── Waiting: check entry ──────────────────────────────────────────────
    const dist = Math.abs(ball.y - obs.y);
    if (dist > obs.outerRadius + PHYSICS.ballRadius) continue;

    // Ball is close enough to the ring zone
    if (dist > obs.innerRadius - PHYSICS.ballRadius) {
      // Determine angle: since ball.x = obs.x always, angle is ±PI/2
      const angle = ball.y > obs.y ? Math.PI / 2 : -Math.PI / 2;
      const relAngle = normalizeAngle(angle - obs.rotation);
      const segSize = (Math.PI * 2) / 4;
      const segIdx = Math.floor(relAngle / segSize);
      const posInSeg = (relAngle % segSize) / segSize;

      const gap = obs.type === 'star' ? STAR.gapFraction : RING.gapFraction;

      if (posInSeg > gap && posInSeg < 1 - gap) {
        // Ball is in a colored segment — check match
        if (obs.colors[segIdx] !== ball.color) {
          // ── COLLISION / DEATH ──
          state.status = 'gameover';
          spawnParticles(state, ball.x, ball.y, GAME_COLORS[ball.color], 30, 1.8);
          // Also burst the obstacle color
          spawnParticles(state, obs.x, obs.y, GAME_COLORS[obs.colors[segIdx]], 12, 1.2);
          events.died = true;
          return events;
        }
      }
      obs.transitState = 'transiting';
    }
  }

  // ── Color changers ────────────────────────────────────────────────────────
  for (const ch of state.colorChangers) {
    if (ch.collected) continue;
    ch.pulsePhase += 0.08;

    const dx = ball.x - ch.x;
    const dy = ball.y - ch.y;
    if (Math.sqrt(dx * dx + dy * dy) < PHYSICS.ballRadius + ch.radius) {
      ch.collected = true;
      ball.color = ch.color;
      spawnParticles(state, ch.x, ch.y, GAME_COLORS[ch.color], 14);
      events.colorChanged = true;
    }
  }

  // ── Particles ─────────────────────────────────────────────────────────────
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25; // gravity on particles
    p.life--;
    p.alpha = p.life / p.maxLife;
    if (p.life <= 0) state.particles.splice(i, 1);
  }

  // ── Generate ahead ────────────────────────────────────────────────────────
  if (state.obstacles.length === 0) {
    generateObstacles(state, ball.y - LEVEL.obstacleSpacing, LEVEL.initialCount, canvasWidth);
  } else {
    const highestObsY = Math.min(...state.obstacles.map(o => o.y));
    // If highest obstacle is less than generateAhead units above camera top, add more
    if (highestObsY > state.cameraOffset - LEVEL.generateAhead) {
      generateObstacles(state, highestObsY, 5, canvasWidth);
    }
  }

  // ── Cleanup off-screen below ──────────────────────────────────────────────
  const bottomBound = state.cameraOffset + canvasHeight + LEVEL.cleanupBelow;
  state.obstacles = state.obstacles.filter(o => o.y < bottomBound);
  state.colorChangers = state.colorChangers.filter(c => !c.collected || c.y < bottomBound);

  return events;
}
