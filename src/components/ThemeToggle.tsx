'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={[
        'relative flex h-8 w-8 items-center justify-center rounded-lg',
        'text-muted-foreground hover:text-foreground hover:bg-accent',
        // Specific props only — cheaper than transition-all
        'transition-[background-color,color,transform] duration-150 ease-smooth',
        'hover:scale-105 active:scale-95',
      ].join(' ')}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {/* Icons cross-fade on toggle */}
      <Sun
        className={[
          'absolute h-4 w-4 transition-[opacity,transform] duration-200 ease-smooth',
          theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90 scale-50',
        ].join(' ')}
      />
      <Moon
        className={[
          'absolute h-4 w-4 transition-[opacity,transform] duration-200 ease-smooth',
          theme === 'light' ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90 scale-50',
        ].join(' ')}
      />
    </button>
  );
}
