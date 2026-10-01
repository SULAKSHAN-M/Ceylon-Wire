import { formatAbsoluteTime, formatRelativeTime } from '@/lib/format';

export function StaleNotice({ staleSince }: { staleSince: number | null }) {
  return (
    <div
      role="status"
      className="mb-6 rounded-sm border border-brick/30 bg-brick/5 px-4 py-3 text-sm text-ink"
    >
      Showing the last stories we could reach
      {staleSince ? (
        <>
          {' '}
          (from {formatAbsoluteTime(staleSince)}, {formatRelativeTime(staleSince)})
        </>
      ) : null}
      . The live feed is temporarily unavailable.
    </div>
  );
}
