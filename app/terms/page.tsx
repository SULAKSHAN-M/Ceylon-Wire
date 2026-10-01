import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of service' };

export default function TermsPage() {
  return (
    <main id="main-content" className="mx-auto max-w-read px-5 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Terms of service</h1>
      <p className="mt-2 text-sm text-muted">Last updated 23 September 2026.</p>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-ink">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">1. What Ceylon Wire is</h2>
          <p className="mt-2">
            Ceylon Wire is an independent reading interface for the Esana news feed. It is not
            affiliated with, endorsed by, or operated by Helakuru, Esana, or any publisher whose
            stories appear here. It connects to a third-party, unofficial API and displays the
            content that API returns.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">2. Content ownership</h2>
          <p className="mt-2">
            Every headline, photograph, and article body shown on this site belongs to its
            original publisher. Ceylon Wire claims no ownership over any of it and displays it
            for reading convenience only. If you want to republish, quote at length, or otherwise
            reuse a story, go to the original source linked from each article.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">3. No accuracy guarantee</h2>
          <p className="mt-2">
            Stories, translations, reaction counts, and comment counts are pulled from the
            upstream API as-is and may be delayed, incomplete, or occasionally wrong. Do not rely
            on this site as your sole source for time-sensitive or safety-related information.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">4. Availability</h2>
          <p className="mt-2">
            Because Ceylon Wire depends on an unofficial, community-run API, the feed can go
            offline or change shape without notice. We make no promise that the site, or any
            particular story, will be available at any given time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">5. Acceptable use</h2>
          <p className="mt-2">
            Don&rsquo;t use automated tools to scrape or overload this site or the upstream API,
            and don&rsquo;t use Ceylon Wire to republish content in a way that misrepresents its
            source. Reasonable personal, non-commercial reading and sharing of article links is
            always fine.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">6. Liability</h2>
          <p className="mt-2">
            Ceylon Wire is provided as-is, without warranties of any kind. To the extent
            permitted by law, its operator is not liable for decisions made based on content
            displayed here, or for losses arising from the site or feed being unavailable.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">7. Changes</h2>
          <p className="mt-2">
            These terms may change as the site evolves. Continuing to use Ceylon Wire after an
            update means you accept the revised terms.
          </p>
        </section>

        <p className="text-sm text-muted">
          This page is a plain-language template for a demonstration project, not legal advice.
          If you are deploying this site for real use, have it reviewed by a lawyer.
        </p>
      </div>
    </main>
  );
}
