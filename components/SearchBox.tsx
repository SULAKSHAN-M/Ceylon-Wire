'use client';

import { SearchIcon } from './Icons';

export function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-line pb-2">
      <SearchIcon className="h-4 w-4 flex-none text-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search today's stories"
        aria-label="Search today's stories"
        className="w-full bg-transparent font-body text-sm text-ink placeholder:text-muted focus:outline-none"
      />
    </div>
  );
}
