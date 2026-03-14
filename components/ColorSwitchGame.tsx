'use client';

/**
 * ColorSwitchGame — top-level React component.
 *
 * Architecture:
 *  • Game state lives in a `ref` (mutated each frame) to avoid React re-renders
 *    inside the hot 60fps loop.
 *  • A stable RAF loop reads from `gameLoopFnRef` (updated every render) so
 *    it always sees fresh closures without being recreated.
 *  • React state is only updated for UI overlay purposes (screen/score changes).
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { GameState, GameStatus, DifficultyLevel } from '@/types/game';
import { createInitialState, updateGame, jumpBall } from '@/lib/gameEngine';
import { renderFrame, renderIdleBackground } from '@/lib/renderer';
import { useHighScore } from '@/hooks/useHighScore';
import { useSound } from '@/hooks/useSound';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import PauseMenu from './PauseMenu';
import GameUI from './GameUI';

export default function ColorSwitchGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const frameCountRef = useRef(0); // for idle animation

  // ── UI state (minimal React state) ─────────────────────────────────────────
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [displayScore, setDisplayScore] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');

  const { highScore, setHighScore } = useHighScore();
  const {
    soundEnabled, setSoundEnabled,
    musicEnabled, setMusicEnabled,
    playSound, startMusic, stopMusic,
  } = useSound();

  // Stable refs for use inside the RAF loop
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const highScoreRef = useRef(highScore);
  highScoreRef.current = highScore;

  // ── Canvas resize ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // ── Per-frame game-loop function (updated via ref, not recreated) ───────────
  const gameLoopFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    gameLoopFnRef.current = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const state = gameStateRef.current;
      frameCountRef.current++;

      if (!state || state.status === 'idle') {
        // Animated background only
        renderIdleBackground(ctx, frameCountRef.current, canvas.width, canvas.height);
        return;
      }

      if (state.status === 'paused' || state.status === 'gameover') {
        // Static last frame
        renderFrame(ctx, state, canvas.width, canvas.height);
        return;
      }

      // ── Playing ────────────────────────────────────────────────────────────
      const events = updateGame(state, canvas.width, canvas.height);
      renderFrame(ctx, state, canvas.width, canvas.height);

      if (events.died) {
        const finalScore = state.score;
        if (soundEnabledRef.current) playSound('death');
        stopMusic();
        if (finalScore > highScoreRef.current) setHighScore(finalScore);
        setDisplayScore(finalScore);
        setGameStatus('gameover');
      } else {
        if (events.scored) {
          if (soundEnabledRef.current) playSound('score');
          setDisplayScore(state.score);
        }
        if (events.colorChanged && soundEnabledRef.current) {
          playSound('colorChange');
        }
      }
    };
  });

  // ── Stable RAF loop (mounts once, never recreated) ─────────────────────────
  useEffect(() => {
    let rafId: number;
    function loop() {
      gameLoopFnRef.current();
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // ── Input: jump ─────────────────────────────────────────────────────────────
  const jump = useCallback(() => {
    const state = gameStateRef.current;
    if (state?.status === 'playing') {
      jumpBall(state);
      if (soundEnabledRef.current) playSound('jump');
    }
  }, [playSound]);

  // ── Input: pause / resume ───────────────────────────────────────────────────
  const pauseGame = useCallback(() => {
    const state = gameStateRef.current;
    // Don't allow pausing before the first tap — there's nothing to pause yet.
    if (state?.status === 'playing' && !state.waitingFirstTap) {
      state.status = 'paused';
      setGameStatus('paused');
      stopMusic();
    }
  }, [stopMusic]);

  const resumeGame = useCallback(() => {
    const state = gameStateRef.current;
    if (state?.status === 'paused') {
      state.status = 'playing';
      setGameStatus('playing');
      if (musicEnabled) startMusic();
    }
  }, [musicEnabled, startMusic]);

  // ── Start / restart ─────────────────────────────────────────────────────────
  const startGame = useCallback((diff: DifficultyLevel) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use window dimensions as a reliable fallback in case the canvas hasn't
    // been measured yet by the ResizeObserver (can happen on first load).
    const w = canvas.width  > 0 ? canvas.width  : window.innerWidth;
    const h = canvas.height > 0 ? canvas.height : window.innerHeight;

    // Ensure the canvas rendering buffer matches the display size.
    if (canvas.width === 0)  canvas.width  = w;
    if (canvas.height === 0) canvas.height = h;

    setDifficulty(diff);
    setDisplayScore(0);
    gameStateRef.current = createInitialState(w, h, diff);
    setGameStatus('playing');
    if (musicEnabled) startMusic();
  }, [musicEnabled, startMusic]);

  const restartGame = useCallback(() => {
    startGame(difficulty);
  }, [startGame, difficulty]);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
      if (e.code === 'Escape') {
        if (gameStatus === 'playing') pauseGame();
        else if (gameStatus === 'paused') resumeGame();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jump, pauseGame, resumeGame, gameStatus]);

  // ── Touch / click on canvas ─────────────────────────────────────────────────
  const handleInteract = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    jump();
  }, [jump]);

  // Derived: is this a new high score?
  const isNewHighScore = displayScore > 0 && displayScore >= highScore;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#08080F' }}>
      {/* Game canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onClick={handleInteract}
        onTouchStart={handleInteract}
        style={{ touchAction: 'none', cursor: gameStatus === 'playing' ? 'none' : 'default' }}
      />

      {/* Overlay screens */}
      <AnimatePresence mode="wait">
        {gameStatus === 'idle' && (
          <StartScreen
            key="start"
            highScore={highScore}
            soundEnabled={soundEnabled}
            musicEnabled={musicEnabled}
            onSoundToggle={() => setSoundEnabled(v => !v)}
            onMusicToggle={() => setMusicEnabled(v => !v)}
            onStart={startGame}
          />
        )}

        {gameStatus === 'playing' && (
          <GameUI
            key="hud"
            score={displayScore}
            highScore={highScore}
            onPause={pauseGame}
          />
        )}

        {gameStatus === 'paused' && (
          <PauseMenu
            key="pause"
            score={displayScore}
            onResume={resumeGame}
            onRestart={restartGame}
            onQuit={() => { stopMusic(); setGameStatus('idle'); }}
          />
        )}

        {gameStatus === 'gameover' && (
          <GameOverScreen
            key="gameover"
            score={displayScore}
            highScore={Math.max(displayScore, highScore)}
            isNewHighScore={isNewHighScore}
            difficulty={difficulty}
            onRestart={restartGame}
            onHome={() => setGameStatus('idle')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
