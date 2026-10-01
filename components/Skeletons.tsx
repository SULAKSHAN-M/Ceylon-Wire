export function FeedSkeleton() {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading stories">
      <div className="grid gap-5 border-b border-line pb-8 md:grid-cols-5">
        <div className="aspect-[16/10] rounded-sm bg-paper-dim md:col-span-3" />
        <div className="flex flex-col justify-center gap-3 md:col-span-2">
          <div className="h-3 w-24 rounded bg-paper-dim" />
          <div className="h-8 w-full rounded bg-paper-dim" />
          <div className="h-8 w-3/4 rounded bg-paper-dim" />
          <div className="h-4 w-full rounded bg-paper-dim" />
          <div className="h-4 w-2/3 rounded bg-paper-dim" />
        </div>
      </div>
      <div className="mt-2 grid gap-x-10 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-line py-5 first:pt-0">
            <div className="aspect-[4/3] w-24 flex-none rounded-sm bg-paper-dim sm:w-32" />
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
              <div className="h-3 w-16 rounded bg-paper-dim" />
              <div className="h-5 w-full rounded bg-paper-dim" />
              <div className="h-5 w-2/3 rounded bg-paper-dim" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div
      id="main-content"
      role="status"
      aria-label="Loading story"
      className="mx-auto max-w-read animate-pulse px-5 py-10"
    >
      <div className="h-4 w-16 rounded bg-paper-dim" />
      <div className="mt-6 h-9 w-full rounded bg-paper-dim" />
      <div className="mt-3 h-9 w-2/3 rounded bg-paper-dim" />
      <div className="mt-5 h-4 w-40 rounded bg-paper-dim" />
      <div className="mt-6 aspect-[16/10] rounded-sm bg-paper-dim" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-paper-dim" />
        ))}
      </div>
    </div>
  );
}
