'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main-content" className="mx-auto max-w-wire px-5 py-16 text-center">
      <p className="font-display text-xl font-semibold text-ink">The feed didn&rsquo;t load.</p>
      <p className="mt-2 text-muted">
        {error.message || 'The Esana API may be temporarily unreachable. Try again in a moment.'}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-sm border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
      >
        Try again
      </button>
    </main>
  );
}
