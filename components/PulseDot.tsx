export function PulseDot({ colorClass = 'bg-teal' }: { colorClass?: string }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${colorClass}`}
      />
      <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${colorClass}`} />
    </span>
  );
}
