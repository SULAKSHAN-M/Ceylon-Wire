import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-wire px-5 py-8 text-sm text-muted">
        <p className="max-w-read">
          Ceylon Wire republishes summaries and full stories pulled from the Esana feed for
          reading convenience. Headlines, photographs and article text remain the property of
          their original publishers. Tap &ldquo;Read the full story&rdquo; on any article to
          visit the source.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-ink">
            Latest
          </Link>
          <Link href="/coverage" className="hover:text-ink">Coverage &amp; timelines</Link>
          <Link href="/alerts" className="hover:text-ink">News alerts</Link>
          <Link href="/digest" className="hover:text-ink">Daily digest</Link>
          <Link href="/saved" className="hover:text-ink">
            Saved
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy policy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms of service
          </Link>
          <a href="/feed.xml" className="hover:text-ink">
            RSS
          </a>
          <Link href="/status" className="hover:text-ink">
            Status
          </Link>
          <a
            href="https://esana-api.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink"
          >
            Esana API
          </a>
          <Link href="/about" className="hover:text-ink">
            About the developer
          </Link>
        </div>
        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            Built on the unofficial Esana API. Not affiliated with Helakuru.
          </p>
          <p className="text-xs text-muted">
            Designed and developed by{' '}
            <Link href="/about" className="font-display font-semibold tracking-wide text-ink hover:underline">
              SULAKSHAN M
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
