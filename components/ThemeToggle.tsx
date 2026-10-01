'use client';

import { useTheme } from '@/context/ThemeProvider';
import { SunIcon, MoonIcon } from './Icons';

export function ThemeToggle() {
  const { theme, setPreference } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setPreference(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="rounded-full border border-line p-2 text-ink hover:border-ink"
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
