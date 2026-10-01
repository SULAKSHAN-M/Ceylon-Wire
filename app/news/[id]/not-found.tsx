import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main-content" className="mx-auto max-w-wire px-5 py-16 text-center">
      <p className="font-display text-xl font-semibold text-ink">Story not found.</p>
      <p className="mt-2 text-muted">It may have been removed, or the link is out of date.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-sm border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
      >
        Back to the latest
      </Link>
    </main>
  );
}
