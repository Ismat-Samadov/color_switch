'use client';

import { motion } from 'framer-motion';
import type { DifficultyLevel } from '@/types/game';
import { DIFFICULTY } from '@/lib/constants';

interface GameOverScreenProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  difficulty: DifficultyLevel;
  onRestart: () => void;
  onHome: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  isNewHighScore,
  difficulty,
  onRestart,
  onHome,
}: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.7, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
        className="flex flex-col items-center gap-6 w-72"
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/80 text-2xl font-bold tracking-[0.25em] uppercase"
        >
          Game Over
        </motion.h2>

        {/* New high score badge */}
        {isNewHighScore && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.35, stiffness: 260, damping: 18 }}
            className="text-yellow-300 text-sm font-bold tracking-widest uppercase px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-full"
          >
            ★ New High Score!
          </motion.div>
        )}

        {/* Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.25, stiffness: 220, damping: 16 }}
          className="flex flex-col items-center"
        >
          <span
            className="text-8xl font-black text-white tabular-nums"
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.4)' }}
          >
            {score}
          </span>
          <span className="text-white/40 text-sm mt-1 tracking-widest">SCORE</span>
        </motion.div>

        {/* Best */}
        <div className="flex items-center gap-3 text-white/50 text-sm">
          <div className="h-px w-12 bg-white/20" />
          <span>Best: <span className="text-white font-semibold">{highScore}</span></span>
          <div className="h-px w-12 bg-white/20" />
        </div>

        {/* Difficulty */}
        <div className="text-white/30 text-xs tracking-widest uppercase">
          {DIFFICULTY[difficulty].label} Mode
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3 w-full mt-2"
        >
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm tracking-wider hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-white/20"
          >
            Play Again
          </button>
          <button
            onClick={onHome}
            className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold text-sm tracking-wider hover:bg-white/20 active:scale-95 transition-all border border-white/10"
          >
            Main Menu
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
