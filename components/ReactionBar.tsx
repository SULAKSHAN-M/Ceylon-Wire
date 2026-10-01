'use client';

import type { Language, ReactionItem } from '@/lib/types';
import { reactionLabel } from '@/lib/format';

export function ReactionBar({
  reactions,
  language,
}: {
  reactions: ReactionItem[];
  language: Language;
}) {
  const active = reactions.filter((r) => r.count > 0);

  if (active.length === 0) {
    return null;
  }

  const top = active.reduce((a, b) => (b.count > a.count ? b : a));

  return (
    <ul className="flex flex-wrap gap-2">
      {active.map((reaction) => (
        <li
          key={reaction.id}
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
            reaction.id === top.id
              ? 'border-saffron/40 bg-saffron/10 text-saffron'
              : 'border-line text-muted'
          }`}
        >
          {reactionLabel(reaction.text, language)}{' '}
          <span className="tabular-nums font-semibold">{reaction.count}</span>
        </li>
      ))}
    </ul>
  );
}
