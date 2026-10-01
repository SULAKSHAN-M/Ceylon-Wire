import type { Language } from '@/lib/types';
import { PulseDot } from './PulseDot';

export function BreakingTag({ language }: { language: Language }) {
  const label = language === 'si' ? 'නවතම' : language === 'ta' ? 'உடனடி' : 'Breaking';
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brick px-2 py-0.5 text-xs font-semibold text-paper">
      <PulseDot colorClass="bg-paper" />
      {label}
    </span>
  );
}
