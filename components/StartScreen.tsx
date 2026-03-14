'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { DifficultyLevel } from '@/types/game';
import { DIFFICULTY, GAME_COLORS } from '@/lib/constants';

interface StartScreenProps {
  highScore: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onSoundToggle: () => void;
  onMusicToggle: () => void;
  onStart: (difficulty: DifficultyLevel) => void;
}

const DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];

const NEON_COLORS = Object.values(GAME_COLORS);

export default function StartScreen({
  highScore,
  soundEnabled,
  musicEnabled,
  onSoundToggle,
  onMusicToggle,
  onStart,
}: StartScreenProps) {
  const [selected, setSelected] = useState<DifficultyLevel>('medium');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm select-none"
    >
      {/* Logo */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="flex flex-col items-center mb-8"
      >
        {/* Spinning icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="mb-6"
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            {NEON_COLORS.map((color, i) => {
              const angle = (i * Math.PI) / 2;
              const gap = 0.12;
              const r1 = 22, r2 = 35;
              const startA = angle + gap;
              const endA = angle + Math.PI / 2 - gap;
              const x1 = 36 + Math.cos(startA) * r2, y1 = 36 + Math.sin(startA) * r2;
              const x2 = 36 + Math.cos(endA) * r2, y2 = 36 + Math.sin(endA) * r2;
              const x3 = 36 + Math.cos(endA) * r1, y3 = 36 + Math.sin(endA) * r1;
              const x4 = 36 + Math.cos(startA) * r1, y4 = 36 + Math.sin(startA) * r1;
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`}
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                />
              );
            })}
            <circle cx="36" cy="36" r="8" fill="white" style={{ filter: 'drop-shadow(0 0 8px white)' }} />
          </svg>
        </motion.div>

        <h1 className="text-white text-4xl font-black tracking-tight leading-none">
          COLOR
        </h1>
        <h1
          className="text-5xl font-black tracking-tight"
          style={{
            background: `linear-gradient(90deg, ${NEON_COLORS.join(',')})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          SWITCH
        </h1>
      </motion.div>

      {/* How to play */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/40 text-sm text-center mb-6 max-w-xs"
      >
        Tap / click to jump. Pass the ball through the <strong className="text-white/60">matching color</strong> segment.
      </motion.p>

      {/* Difficulty picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex gap-2 mb-8"
      >
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setSelected(d)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold tracking-wider transition-all
              ${selected === d
                ? 'bg-white text-black scale-105 shadow-lg shadow-white/20'
                : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
          >
            {DIFFICULTY[d].label}
          </button>
        ))}
      </motion.div>

      {/* Play button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 240, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(selected)}
        className="relative px-14 py-4 rounded-2xl text-black font-black text-lg tracking-wider mb-8 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${NEON_COLORS[0]}, ${NEON_COLORS[1]})`,
          boxShadow: `0 0 30px ${NEON_COLORS[0]}88`,
        }}
      >
        PLAY
      </motion.button>

      {/* High score */}
      {highScore > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/40 text-sm mb-6"
        >
          Best: <span className="text-white/70 font-semibold">{highScore}</span>
        </motion.div>
      )}

      {/* Controls row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex gap-4 items-center"
      >
        {/* Sound toggle */}
        <ToggleBtn label={soundEnabled ? '🔊 Sound' : '🔇 Sound'} active={soundEnabled} onClick={onSoundToggle} />
        {/* Music toggle */}
        <ToggleBtn label={musicEnabled ? '🎵 Music' : '🎵 Music'} active={musicEnabled} onClick={onMusicToggle} />
      </motion.div>

      {/* Controls hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/20 text-xs mt-5 tracking-widest"
      >
        SPACE / CLICK / TAP &nbsp;·&nbsp; ESC to pause
      </motion.p>
    </motion.div>
  );
}

function ToggleBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
        ${active
          ? 'bg-white/15 text-white border border-white/20'
          : 'bg-transparent text-white/30 border border-white/10 line-through'
        }`}
    >
      {label}
    </button>
  );
}
