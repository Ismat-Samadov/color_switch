'use client';

import { useState, useCallback } from 'react';

const LS_KEY = 'color-switch-high-score';

export function useHighScore() {
  const [highScore, setHighScoreState] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(LS_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  const setHighScore = useCallback((score: number) => {
    setHighScoreState(prev => {
      const next = Math.max(prev, score);
      if (typeof window !== 'undefined') localStorage.setItem(LS_KEY, String(next));
      return next;
    });
  }, []);

  return { highScore, setHighScore };
}
