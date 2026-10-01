'use client';
import { categoryLabel } from '@/lib/format';
export function TopicPreferences({ selected, onChange, active, onActive }: { selected: number[]; onChange: (topics: number[]) => void; active: boolean; onActive: (active: boolean) => void }) {
  return <details className="mb-5 border-b border-line pb-4">
    <summary className="cursor-pointer text-sm font-medium text-ink">Your topics{selected.length ? ` (${selected.length})` : ''}</summary>
    <p className="mt-3 text-xs text-muted">Choose topics for this device. You can always return to all news.</p>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
      {Array.from({ length: 10 }, (_, i) => 101 + i).map(topic => <label key={topic} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.includes(topic)} onChange={event => onChange(event.target.checked ? [...selected, topic] : selected.filter(t => t !== topic))} />{categoryLabel(topic)}</label>)}
    </div>
    <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={active} disabled={!selected.length} onChange={e => onActive(e.target.checked)} />Show only my topics</label>
  </details>;
}
