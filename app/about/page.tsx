import type { Metadata } from 'next';
import Link from 'next/link';
import { developerLinks } from '@/lib/developer-links';

export const metadata: Metadata = {
  title: 'About the developer',
  description: 'Meet SULAKSHAN M, the developer behind Ceylon Wire, and read the story and ideas behind the project.',
};

export default function AboutPage() {
  return (
    <main id="main-content" className="mx-auto max-w-read px-5 py-12 sm:py-16">
      <article>
        <header className="border-b border-line pb-8">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">The person behind Ceylon Wire</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            About the developer
          </h1>
          <p className="mt-5 font-display text-xl font-semibold tracking-[0.08em] text-ink">
            SULAKSHAN M
          </p>
          <p className="mt-2 text-sm text-muted">Software engineering undergraduate &amp; web developer</p>
        </header>

        <div className="mt-8 space-y-9 text-base leading-relaxed text-ink">
          <section aria-labelledby="about-beginning">
            <h2 id="about-beginning" className="font-display text-2xl font-semibold tracking-tight">
              A place to follow the news
            </h2>
            <p className="mt-4">
              I&rsquo;m Sulakshan, the developer behind Ceylon Wire. This project brings together
              my interest in building web applications and a practical idea: giving readers a
              straightforward place to follow Sri Lankan news. The aim is to make it easy to
              scan the latest headlines, open a story, and return to something worth reading
              later, all within a consistent and familiar layout.
            </p>
            <p className="mt-4">
              Ceylon Wire is also a way for me to put software engineering into practice.
              A news reader has to do more than display a list of titles. It needs to handle
              changing information, different languages, interrupted connections, and the
              small choices that shape how comfortable a page feels to use. Those are the
              kinds of everyday problems I want to get better at solving.
            </p>
          </section>

          <section aria-labelledby="about-reading">
            <h2 id="about-reading" className="font-display text-2xl font-semibold tracking-tight">
              Making room for reading
            </h2>
            <p className="mt-4">
              The visual direction takes its cues from a classic editorial page: warm paper
              tones, clear typography, fine dividing lines, and space around the stories.
              Each element has a purpose. Headlines should be easy to find, navigation should
              be understandable, and the design should let the reader settle into the content.
              The same approach carries through to the darker theme.
            </p>
            <p className="mt-4">
              Features such as search, saved stories, language controls, and topic filters
              support different reading habits. Some visitors want a quick update; others want
              to spend time with an individual article. I want the experience to accommodate
              both, on a phone as well as on a larger screen. The Sri Lanka time display in
              the header adds a small local reference alongside the news.
            </p>
          </section>

          <section aria-labelledby="about-responsibility">
            <h2 id="about-responsibility" className="font-display text-2xl font-semibold tracking-tight">
              Respecting the source
            </h2>
            <p className="mt-4">
              Ceylon Wire is a reading interface for content from external news feeds.
              The reporting, photographs, and article text belong to their original publishers.
              Keeping a route back to those sources is part of the project, so readers can
              follow the original coverage and understand where a story comes from.
            </p>
            <p className="mt-4">
              Gemini-assisted categorization helps organize stories by topic when the service
              is enabled. These labels are a reading aid and can be mistaken; they do not
              verify a report or establish whether its claims are true. The application is
              designed to keep serving news when that optional service is unavailable.
            </p>
          </section>

          <section aria-labelledby="about-next">
            <h2 id="about-next" className="font-display text-2xl font-semibold tracking-tight">
              A project to keep improving
            </h2>
            <p className="mt-4">
              As a software engineering undergraduate, I see projects like this as an opportunity
              to connect technical learning with something people can actually use. Working
              across the interface and server logic encourages me to think about the whole
              experience: how information arrives, how it is presented, and what happens when
              a service does not respond as expected.
            </p>
            <p className="mt-4">
              My direction for Ceylon Wire is to keep refining its clarity, accessibility,
              and reliability as the project develops. Thank you for taking the time to
              explore it and read the story behind it. I hope it becomes a useful part of
              the way you catch up with Sri Lankan news.
            </p>
          </section>
        </div>

        <section className="mt-10 border-t border-line pt-6" aria-labelledby="developer-connect">
          <h2 id="developer-connect" className="font-display text-xl font-semibold">Connect with me</h2>
          <div className="mt-4 flex flex-wrap gap-6">
            {developerLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 hover:text-teal">{link.label}</a>)}
          </div>
        </section>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-line pt-6">
          <p className="font-display text-lg font-semibold tracking-[0.08em] text-ink">SULAKSHAN M</p>
          <Link href="/" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            Back to the latest news
          </Link>
        </div>
      </article>
    </main>
  );
}
