'use client';

import type { WireHeadline } from '@/lib/types';
import { useLanguage } from '@/context/LanguageProvider';
import { formatWireDate } from '@/lib/format';
import { ExternalLinkIcon } from './Icons';

export function WireHeadlines({ headlines }: { headlines: WireHeadline[] }) {
  const { language } = useLanguage();
  // NewsData has no Sinhala coverage for Sri Lanka, so Sinhala mode shows
  // the English set too, same fallback logic as the Esana content itself.
  const wanted = language === 'ta' ? 'ta' : 'en';
  const filtered = headlines.filter((item) => item.language === wanted);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <aside aria-label="Sri Lanka headlines">
      <h2 className="font-display text-lg font-semibold text-ink">Sri Lanka, right now</h2>
      <p className="mt-1 text-xs text-muted">Headlines from national outlets, via NewsData.io.</p>
      <ul className="mt-3 divide-y divide-line">
        {filtered.map((item) => (
          <li key={item.id} className="py-3">
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-2"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink group-hover:text-teal">
                  {item.title}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                  {item.sourceName ? <span>{item.sourceName}</span> : null}
                  <span>{formatWireDate(item.publishedAt)}</span>
                </span>
              </span>
              <ExternalLinkIcon className="mt-0.5 h-3.5 w-3.5 flex-none text-muted group-hover:text-teal" />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
