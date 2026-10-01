'use client';

import { useLanguage } from '@/context/LanguageProvider';
import type { Language } from '@/lib/types';

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'si', label: 'සිං' },
  { value: 'ta', label: 'த' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Reading language"
      className="inline-flex items-center rounded-full border border-line bg-paper-dim p-0.5 text-sm"
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          aria-pressed={language === option.value}
          className={`rounded-full px-3 py-1 font-body font-medium transition-colors ${
            language === option.value ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
