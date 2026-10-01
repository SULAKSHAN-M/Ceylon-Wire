'use client';

import { useEffect, useState } from 'react';

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Colombo',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function SriLankaClock({ compact = false, showLabel = true }: { compact?: boolean; showLabel?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={compact ? 'flex flex-wrap items-baseline gap-x-4 gap-y-2' : 'shrink-0 sm:text-right'}>
      {showLabel ? (
        <p className="text-[10px] uppercase tracking-[0.14em] text-muted" title="Sri Lanka Standard Time">
          SLST
        </p>
      ) : null}
      <div className={`flex items-baseline gap-3 ${compact ? '' : 'mt-2 sm:justify-end'}`}>
        <time
          dateTime={now?.toISOString()}
          className={`inline-block w-[8ch] shrink-0 whitespace-nowrap text-left font-mono font-semibold leading-none tabular-nums text-ink ${compact ? 'text-base' : 'text-xl'}`}
        >
          {now ? timeFormatter.format(now) : '--:--:--'}
        </time>
        <span className="text-[10px] tracking-wide text-muted">UTC+05:30</span>
      </div>
    </div>
  );
}
