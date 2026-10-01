'use client';

import { categoryLabel } from '@/lib/format';

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: {
  categories: number[];
  selected: number | 'all';
  onSelect: (value: number | 'all') => void;
}) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="mb-4 flex flex-wrap gap-2 border-b border-line pb-4"
    >
      <button
        type="button"
        onClick={() => onSelect('all')}
        aria-pressed={selected === 'all'}
        className={`rounded-full border px-3 py-1 text-sm font-medium ${
          selected === 'all'
            ? 'border-ink bg-ink text-paper'
            : 'border-line text-muted hover:border-ink hover:text-ink'
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          aria-pressed={selected === category}
          className={`rounded-full border px-3 py-1 text-sm font-medium ${
            selected === category
              ? 'border-ink bg-ink text-paper'
              : 'border-line text-muted hover:border-ink hover:text-ink'
          }`}
        >
          {categoryLabel(category)}
        </button>
      ))}
    </div>
  );
}
