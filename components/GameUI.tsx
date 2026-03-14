'use client';

import { motion } from 'framer-motion';

interface GameUIProps {
  score: number;
  highScore: number;
  onPause: () => void;
}

export default function GameUI({ score, highScore, onPause }: GameUIProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Score */}
      <motion.div
        key={score}
        initial={{ scale: 1.4, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute top-5 left-1/2 -translate-x-1/2 text-white text-5xl font-bold tabular-nums select-none"
        style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}
      >
        {score}
      </motion.div>

      {/* High score */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium select-none">
        BEST {highScore}
      </div>

      {/* Pause button */}
      <button
        onClick={onPause}
        className="absolute top-4 right-4 pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Pause"
      >
        {/* Two vertical bars */}
        <div className="flex gap-1">
          <div className="w-1 h-4 bg-white rounded-sm" />
          <div className="w-1 h-4 bg-white rounded-sm" />
        </div>
      </button>
    </div>
  );
}
