'use client';

import { motion } from 'framer-motion';

interface PauseMenuProps {
  score: number;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export default function PauseMenu({ score, onResume, onRestart, onQuit }: PauseMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="flex flex-col items-center gap-6 bg-white/5 border border-white/10 rounded-3xl px-10 py-10"
      >
        <h2 className="text-white text-4xl font-bold tracking-widest">PAUSED</h2>
        <p className="text-white/50 text-lg">Score: <span className="text-white font-semibold">{score}</span></p>

        <div className="flex flex-col gap-3 w-48">
          <PauseBtn onClick={onResume} primary>Resume</PauseBtn>
          <PauseBtn onClick={onRestart}>Restart</PauseBtn>
          <PauseBtn onClick={onQuit}>Main Menu</PauseBtn>
        </div>

        <p className="text-white/30 text-xs mt-2">Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/50">Esc</kbd> to resume</p>
      </motion.div>
    </motion.div>
  );
}

function PauseBtn({
  children,
  onClick,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl text-sm font-semibold tracking-wider transition-all
        ${primary
          ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/20'
          : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
        }`}
    >
      {children}
    </button>
  );
}
