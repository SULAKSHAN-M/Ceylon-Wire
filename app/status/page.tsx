import type { Metadata } from 'next';
import { getStatusSnapshot, type HealthState } from '@/lib/status';
import { formatAbsoluteTime, formatRelativeTime } from '@/lib/format';

// Always reflect the current in-memory state, never a cached render.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Status' };

const LABELS: Record<HealthState, { text: string; dotClass: string }> = {
  ok: { text: 'Operational', dotClass: 'bg-teal' },
  down: { text: 'Not responding', dotClass: 'bg-brick' },
  unconfigured: { text: 'Not configured', dotClass: 'bg-muted' },
  unknown: { text: 'Not yet checked', dotClass: 'bg-muted' },
};

const SOURCES: { key: 'esana' | 'newsdata'; name: string; description: string }[] = [
  { key: 'esana', name: 'Esana feed', description: 'Story list, articles, reactions and comments.' },
  { key: 'newsdata', name: 'NewsData.io', description: 'The "Sri Lanka, right now" headlines panel.' },
];

export default function StatusPage() {
  const snapshot = getStatusSnapshot();

  return (
    <main id="main-content" className="mx-auto max-w-wire px-5 py-12">
      <h1 className="font-display text-2xl font-semibold text-ink">System status</h1>
      <p className="mt-2 max-w-read text-sm text-muted">
        Reflects the most recent time each source was actually used by this app, not a live ping
        run just now. Both upstream APIs rate-limit aggressively, so this page deliberately avoids
        adding its own requests just to check on them — reload a few pages first if everything
        here still says &ldquo;not yet checked.&rdquo;
      </p>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {SOURCES.map(({ key, name, description }) => {
          const status = snapshot[key];
          const label = LABELS[status.state];
          return (
            <div key={key} className="flex flex-wrap items-start justify-between gap-4 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${label.dotClass}`} aria-hidden="true" />
                  <span className="font-display text-lg font-medium text-ink">{name}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{description}</p>
                {status.message ? <p className="mt-1 text-sm text-brick">{status.message}</p> : null}
              </div>
              <div className="text-right text-sm text-muted">
                <p>{label.text}</p>
                {status.lastCheckedAt ? <p>Last checked {formatRelativeTime(status.lastCheckedAt)}</p> : null}
                {status.lastSuccessAt ? <p>Last success {formatAbsoluteTime(status.lastSuccessAt)}</p> : null}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
