import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy policy' };

export default function PrivacyPage() {
  return (
    <main id="main-content" className="mx-auto max-w-read px-5 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated 27 September 2026.</p>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-ink">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">What we collect</h2>
          <p className="mt-2">
            Ceylon Wire has no accounts or sign-up. Your language, theme, reading font size,
            topic preferences, and saved stories are stored on this device. Saving a story also
            downloads its article text for offline reading. Tamil translations of saved articles
            are stored locally after you open them. You can remove saved stories individually or
            clear your browser&rsquo;s site data to remove local preferences and offline files.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">
            What the hosting provider sees
          </h2>
          <p className="mt-2">
            Like any website, the server that hosts Ceylon Wire and the upstream Esana API may
            log standard technical details, such as IP address, browser type, and request
            timestamps, for security and reliability purposes. Ceylon Wire itself does not add
            any analytics, advertising, or tracking scripts on top of that.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Third-party content</h2>
          <p className="mt-2">
            Article text, images, and reaction data are fetched live from the unofficial Esana
            API, which in turn sources them from Helakuru. Ceylon Wire has no visibility into,
            and no control over, how that upstream service or the original publishers handle
            data. Following a &ldquo;Read the full story&rdquo; link takes you to a third-party
            site with its own privacy practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">AI-assisted topics</h2>
          <p className="mt-2">
            When enabled, the server sends public news titles and short excerpts to Google&rsquo;s
            Gemini API to assign topics. When a reader selects Tamil on a story, its title and
            article text are also sent for translation. Requesting an In brief summary sends the
            article text for summarization. Public news translations and summaries may be cached
            on the server for up to 30 days. Visitor searches, bookmarks, and browser preferences
            are not included in these requests. Google processes this content under its API
            terms; free-tier content may be used to improve Google products. Topic labels are
            automated and may be inaccurate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Feedback and news alerts</h2>
          <p className="mt-2">
            Translation feedback stores the story number, your message, submission time and review
            status for the editor. Please avoid including personal information. If you enable news
            alerts, we store your browser push subscription and selected topics to deliver
            editor-selected stories. Your browser&rsquo;s push provider processes notification
            delivery. Turn alerts off on the News alerts page to remove your subscription.
            Recent delivery identifiers are retained with active subscriptions to avoid repeat alerts.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Cookies</h2>
          <p className="mt-2">
            The editorial dashboard uses an HttpOnly session cookie for signed-in administrators,
            expiring after eight hours. Ordinary reader preferences and saved stories use browser local storage. A service worker caches the
            offline reading page so it can open without a connection. Clear site data in your
            browser settings to remove both local storage and offline caches.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Children&rsquo;s privacy</h2>
          <p className="mt-2">
            The site is intended for general news reading. Readers should avoid sending personal
            information through translation feedback. Browser notification subscriptions are
            collected only when a reader opts in.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">Changes to this policy</h2>
          <p className="mt-2">
            If this policy changes, for example because analytics or accounts are added later,
            this page will be updated with a new date at the top.
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
