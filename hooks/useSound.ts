'use client';

/**
 * useSound — Web Audio API sound system.
 * All sounds are synthesized; no audio files required.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { SoundType } from '@/types/game';

// ─── Sound Synthesis Helpers ─────────────────────────────────────────────────

function playTone(
  ctx: AudioContext,
  type: OscillatorType,
  freqStart: number,
  freqEnd: number,
  duration: number,
  gain: number,
): void {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
  }

  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration + 0.01);
}

function synthesize(ctx: AudioContext, type: SoundType): void {
  switch (type) {
    case 'jump':
      playTone(ctx, 'sine', 400, 800, 0.10, 0.25);
      break;
    case 'score':
      playTone(ctx, 'sine', 660, 1320, 0.18, 0.35);
      setTimeout(() => playTone(ctx, 'sine', 880, 1760, 0.12, 0.20), 80);
      break;
    case 'colorChange':
      playTone(ctx, 'square', 880, 880, 0.07, 0.18);
      setTimeout(() => playTone(ctx, 'square', 1100, 1100, 0.07, 0.14), 60);
      break;
    case 'death':
      playTone(ctx, 'sawtooth', 440, 110, 0.45, 0.30);
      setTimeout(() => playTone(ctx, 'sine', 220, 55, 0.35, 0.25), 100);
      break;
  }
}

// ─── Background Music ─────────────────────────────────────────────────────────

function createAmbientMusic(ctx: AudioContext): { stop: () => void } {
  let stopped = false;
  // Ascending minor arpeggio in C (C3, Eb3, G3, C4, Eb4)
  const notes = [130.81, 155.56, 196.00, 261.63, 311.13, 261.63, 196.00, 155.56];
  let idx = 0;

  function scheduleNext(): void {
    if (stopped) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.value = notes[idx % notes.length];
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.40);

    idx++;
    setTimeout(scheduleNext, 280);
  }

  scheduleNext();
  return { stop: () => { stopped = true; } };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false); // off by default

  const ctxRef = useRef<AudioContext | null>(null);
  const musicRef = useRef<{ stop: () => void } | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    // Resume suspended context (required after user gesture on some browsers)
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playSound = useCallback((type: SoundType): void => {
    if (!soundEnabled) return;
    try { synthesize(getCtx(), type); } catch { /* ignore audio errors */ }
  }, [soundEnabled, getCtx]);

  const startMusic = useCallback((): void => {
    if (musicRef.current) return;
    try { musicRef.current = createAmbientMusic(getCtx()); } catch { /* ignore */ }
  }, [getCtx]);

  const stopMusic = useCallback((): void => {
    musicRef.current?.stop();
    musicRef.current = null;
  }, []);

  // Keep music in sync with toggle
  useEffect(() => {
    if (musicEnabled) startMusic();
    else stopMusic();
  }, [musicEnabled, startMusic, stopMusic]);

  // Cleanup on unmount
  useEffect(() => () => { stopMusic(); ctxRef.current?.close(); }, [stopMusic]);

  return {
    soundEnabled, setSoundEnabled,
    musicEnabled, setMusicEnabled,
    playSound,
    startMusic, stopMusic,
  };
}
