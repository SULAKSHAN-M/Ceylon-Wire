'use client';
import { useEffect, useState } from 'react';
export function ReadingControls({ words }: { words: number }) {
  const [size, setSize] = useState(18);
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    try { const stored = Number(localStorage.getItem('wire-reading-size')); if ([16, 18, 20, 22, 24].includes(stored)) setSize(stored); } catch {}
    return () => { document.documentElement.classList.remove('reading-focus'); document.documentElement.style.removeProperty('--reading-size'); };
  }, []);
  useEffect(() => {
    document.documentElement.style.setProperty('--reading-size', `${size}px`);
    try { localStorage.setItem('wire-reading-size', String(size)); } catch {}
  }, [size]);
  useEffect(() => { document.documentElement.classList.toggle('reading-focus', focus); }, [focus]);
  useEffect(() => { const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setFocus(false); }; window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape); }, []);
  return <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-line py-3 text-sm text-muted">
    <span>{Math.max(1, Math.ceil(words / 200))} min read</span>
    <div className="flex items-center gap-2" role="group" aria-label="Article font size">
      <button type="button" disabled={size <= 16} onClick={() => setSize(v => v - 2)} aria-label="Decrease article font size" className="border border-line px-3 py-1 disabled:opacity-40">A−</button>
      <span className="tabular-nums">{size}px</span>
      <button type="button" disabled={size >= 24} onClick={() => setSize(v => v + 2)} aria-label="Increase article font size" className="border border-line px-3 py-1 disabled:opacity-40">A+</button>
    </div>
    <button type="button" aria-pressed={focus} onClick={() => setFocus(v => !v)} className="underline underline-offset-4">{focus ? 'Exit reading view' : 'Reading view'}</button>
  </div>;
}
