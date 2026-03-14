/**
 * renderer.ts
 * ───────────
 * All canvas drawing for Color Switch.
 * Coordinate convention: screenY = worldY − cameraOffset.
 */

import type { GameState, Obstacle, ColorChanger, Ball, Particle } from '@/types/game';
import { GAME_COLORS, RING, STAR } from './constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toScreen(worldY: number, cameraOffset: number): number {
  return worldY - cameraOffset;
}

function setGlow(ctx: CanvasRenderingContext2D, color: string, blur = 18): void {
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
}

function clearGlow(ctx: CanvasRenderingContext2D): void {
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

// ─── Background ───────────────────────────────────────────────────────────────

/** Draws a neon grid scrolling with the camera to give depth. */
function drawBackground(
  ctx: CanvasRenderingContext2D,
  cameraOffset: number,
  width: number,
  height: number,
): void {
  // Solid dark fill
  ctx.fillStyle = '#08080F';
  ctx.fillRect(0, 0, width, height);

  // Faint grid that scrolls with the world
  const gridSize = 80;
  const offsetX = 0;
  const offsetY = (-cameraOffset) % gridSize;

  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;

  for (let x = offsetX; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = offsetY - gridSize; y <= height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

// ─── Ring Obstacle ────────────────────────────────────────────────────────────

function drawRing(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  screenY: number,
): void {
  const { x, rotation, colors, innerRadius, outerRadius } = obs;
  const numSeg = 4;
  const segAngle = (Math.PI * 2) / numSeg;
  const geo = obs.type === 'star' ? STAR : RING;
  const halfGap = (segAngle * geo.gapFraction) / 2;

  ctx.save();

  for (let i = 0; i < numSeg; i++) {
    const color = GAME_COLORS[colors[i]];
    const startAngle = rotation + i * segAngle + halfGap;
    const endAngle = rotation + (i + 1) * segAngle - halfGap;

    ctx.beginPath();
    ctx.arc(x, screenY, outerRadius, startAngle, endAngle);
    ctx.arc(x, screenY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();

    setGlow(ctx, color, 20);
    ctx.fillStyle = color;
    ctx.fill();
  }

  clearGlow(ctx);
  ctx.restore();
}

// ─── Star / Windmill Obstacle ─────────────────────────────────────────────────

function drawStar(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  screenY: number,
): void {
  // Stars use the same arc-based rendering as rings, just with wider gaps.
  drawRing(ctx, obs, screenY);
}

// ─── Color Changer ────────────────────────────────────────────────────────────

function drawColorChanger(
  ctx: CanvasRenderingContext2D,
  ch: ColorChanger,
  screenY: number,
): void {
  if (ch.collected) return;
  const color = GAME_COLORS[ch.color];
  const pulse = 1 + Math.sin(ch.pulsePhase) * 0.3;
  const r = ch.radius * pulse;

  ctx.save();

  // Outer glow ring
  setGlow(ctx, color, 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(ch.x, screenY, r + 5, 0, Math.PI * 2);
  ctx.stroke();

  // Filled core
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(ch.x, screenY, r, 0, Math.PI * 2);
  ctx.fill();

  clearGlow(ctx);
  ctx.restore();
}

// ─── Ball ─────────────────────────────────────────────────────────────────────

function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: Ball,
  screenY: number,
  cameraOffset: number,
): void {
  const color = GAME_COLORS[ball.color];
  const r = 13;

  ctx.save();

  // Trail
  for (const pt of ball.trail) {
    const ptScreenY = toScreen(pt.y, cameraOffset);
    ctx.globalAlpha = pt.alpha * 0.55;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, ptScreenY, r * pt.alpha * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Outer glow
  setGlow(ctx, color, 30);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(ball.x, screenY, r, 0, Math.PI * 2);
  ctx.fill();

  // White highlight
  clearGlow(ctx);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.beginPath();
  ctx.arc(ball.x - r * 0.28, screenY - r * 0.28, r * 0.30, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Particles ────────────────────────────────────────────────────────────────

function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  cameraOffset: number,
): void {
  ctx.save();
  for (const p of particles) {
    const screenY = toScreen(p.y, cameraOffset);
    ctx.globalAlpha = p.alpha;
    setGlow(ctx, p.color, 10);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, screenY, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  clearGlow(ctx);
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── Score Display (in-canvas) ────────────────────────────────────────────────

function drawScoreLabel(
  ctx: CanvasRenderingContext2D,
  score: number,
  width: number,
): void {
  ctx.save();
  ctx.font = 'bold 44px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillText(String(score), width / 2, 70);
  ctx.restore();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
): void {
  const { ball, obstacles, colorChangers, particles, cameraOffset, score } = state;

  // ── Background ──
  drawBackground(ctx, cameraOffset, width, height);

  // ── Particles (behind everything) ──
  drawParticles(ctx, particles, cameraOffset);

  // ── Obstacles ──
  for (const obs of obstacles) {
    const sy = toScreen(obs.y, cameraOffset);
    if (sy < -obs.outerRadius - 20 || sy > height + obs.outerRadius + 20) continue;
    if (obs.type === 'star') drawStar(ctx, obs, sy);
    else drawRing(ctx, obs, sy);
  }

  // ── Color changers ──
  for (const ch of colorChangers) {
    const sy = toScreen(ch.y, cameraOffset);
    if (sy < -40 || sy > height + 40) continue;
    drawColorChanger(ctx, ch, sy);
  }

  // ── Ball ──
  const ballSY = toScreen(ball.y, cameraOffset);
  drawBall(ctx, ball, ballSY, cameraOffset);

  // ── Ghosted score watermark ──
  drawScoreLabel(ctx, score, width);
}

/** Render an animated idle background (no ball, just rotating shapes). */
export function renderIdleBackground(
  ctx: CanvasRenderingContext2D,
  frame: number,
  width: number,
  height: number,
): void {
  ctx.fillStyle = '#08080F';
  ctx.fillRect(0, 0, width, height);

  const colors = Object.values(GAME_COLORS);
  const shapes = [
    { x: width * 0.5, y: height * 0.35, r: 0.4 },
    { x: width * 0.25, y: height * 0.7,  r: -0.2 },
    { x: width * 0.75, y: height * 0.65, r: 0.15 },
  ];

  ctx.save();
  for (let s = 0; s < shapes.length; s++) {
    const sh = shapes[s];
    const rot = (frame * 0.008 * sh.r * 2 * Math.PI);
    const numSeg = 4;
    const segAngle = (Math.PI * 2) / numSeg;

    for (let i = 0; i < numSeg; i++) {
      const color = colors[(s * 2 + i) % colors.length];
      const startAngle = rot + i * segAngle + 0.06;
      const endAngle = rot + (i + 1) * segAngle - 0.06;

      ctx.beginPath();
      ctx.arc(sh.x, sh.y, 70, startAngle, endAngle);
      ctx.arc(sh.x, sh.y, 46, endAngle, startAngle, true);
      ctx.closePath();

      ctx.shadowBlur = 18;
      ctx.shadowColor = color;
      ctx.fillStyle = color + '88';
      ctx.fill();
    }
  }
  ctx.shadowBlur = 0;
  ctx.restore();
}
