'use client';

import { useState, useEffect } from 'react';

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
}

export function useTheme(): ThemeContextValue {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setIsDark(true);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return { isDark, toggleTheme };
}
