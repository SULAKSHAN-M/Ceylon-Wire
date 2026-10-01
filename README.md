# Ceylon Wire

A bilingual (English / Sinhala) news reader built with Next.js 16 (App Router) on top of the
unofficial **Esana API** (`https://esana-api.vercel.app`).

## Stack

- Next.js 16, App Router, TypeScript, React Server Components
- Tailwind CSS for styling (no component/icon libraries)
- Self-hosted Google Fonts via `next/font/google`
- Server-side data fetching with the built-in `fetch` cache (`revalidate`)
- Two thin API route handlers (`/api/news`, `/api/news/[id]`) that proxy the upstream API

## Getting started

Requires **Node.js 20 or newer**.

```bash
npm install
npm run dev            # http://localhost:3000
npm run dev -- -p 3001 # or on a different port
```

```bash
npm run build
npm run start   # production server
```

Optional: copy `.env.example` to `.env.local` and fill in what you want:

- `NEXT_PUBLIC_SITE_URL` — your real domain, used to build absolute URLs in the sitemap,
  robots.txt, RSS feed, and Open Graph metadata. Without it, everything falls back to
  `http://localhost:3000`.
- `NEWSDATA_API_KEY` — a free key from [newsdata.io/register](https://newsdata.io/register)
  that turns on the "Sri Lanka, right now" headlines panel (see below). The app works fine
  without it; the panel simply won't render.

## Features

**Resilience**
- **Stale-data fallback** — if a live Esana fetch fails, the last successful feed is served
  instead of an empty page, with an honest on-page notice ("showing the last stories we could
  reach") rather than pretending it's current
- **`/status` page** — shows each source's health (Esana, NewsData.io) from data the app already
  gathered during normal use. Deliberately passive: it never pings either API just to check on
  it, since both already rate-limit aggressively

**Visual/UX**
- **Dark mode** — a real light/dark toggle in the header, defaulting to system preference,
  persisted per-visitor, with no flash of the wrong theme on load
- **Installable (PWA)** — a web app manifest and icon set, so it can be added to a phone's home
  screen and opens standalone
- **Accessibility** — a skip-to-content link, landmark roles, ARIA live regions on
  banners/notices, a labeled progress bar, and visible focus outlines throughout

**Content**
- **Colombo weather** in the header, via Open-Meteo (no API key, generous free limits, so it
  carries none of the fragility the two news sources do)
- **Category filter** — pill filters above the feed, using real category names (Politics,
  Sports, Business, etc.). Only category `2` (Politics) is confirmed from actual observed data;
  the rest follow the category set most Sri Lankan outlets use as a best-effort mapping until
  more ids are confirmed — see the `CATEGORY_NAMES` map in `lib/format.ts` to correct any as
  real examples turn up

**Reading**
- Trilingual EN / සිං / த toggle. Esana content (titles, article text, reaction words) is only
  ever available in Sinhala and English, so Tamil mode falls back to English for that content —
  with a small on-page note saying so, rather than pretending a translation exists
- **"Sri Lanka, right now" panel** — a second, independent set of live headlines from
  NewsData.io, sitting beside the Esana feed, fetched in **both English and Tamil**. Since it's a
  different provider entirely, it stays up even if Esana is rate-limited or down (requires a free
  `NEWSDATA_API_KEY`, see above)
- Reading list — bookmark any story with the icon on its thumbnail or article header; saved
  stories live in `localStorage` under **Saved** and work offline of any account
- Native share sheet on mobile (`navigator.share`), clipboard-copy fallback on desktop
- A reading-progress bar on article pages
- "More from the wire" related stories at the bottom of each article
- Client-side search over the currently loaded stories
- A "Most talked about" rail ranked by combined reactions and comments
- A quiet "new stories have come in" banner that appears when the feed moves on without a reload
- A **Breaking** tag on stories published within the last two hours
- "Load older stories" — the Esana API has no history endpoint, so this walks backward by id,
  one request at a time, to surface earlier posts on demand

**Technical**
- Skeleton loading states (`loading.tsx`) matching the shape of the content they replace
- Graceful `error.tsx` and `not-found.tsx` states for when the unofficial upstream API hiccups
- `sitemap.xml` and `robots.txt` via Next's metadata route conventions
- An RSS 2.0 feed at `/feed.xml`
- Dynamic Open Graph images per article (`next/og`), plus a static one for the home page
- Blur-up placeholders on every remote image

## How it's organised

```
app/
  layout.tsx                 Root shell: fonts, header, footer, theme + language providers
  page.tsx                    Home feed (server component)
  loading.tsx / error.tsx      Feed skeleton + failure state
  saved/page.tsx                Saved-stories page (client-only, reads localStorage)
  status/page.tsx                Passive health dashboard for both data sources
  manifest.ts                     PWA web app manifest
  news/[id]/page.tsx            Article detail page
  news/[id]/loading.tsx           Article skeleton
  news/[id]/not-found.tsx          Missing-story state
  news/[id]/opengraph-image.tsx     Per-article OG image
  terms/, privacy/                Legal pages
  sitemap.ts, robots.ts             SEO metadata routes
  feed.xml/route.ts                 RSS feed
  opengraph-image.tsx                Home OG image
  api/news/, api/news/[id]/           Proxy routes for the upstream API
  api/news/older/route.ts               Walks backward by id for "older stories"
components/            Presentational pieces
context/LanguageProvider.tsx   EN/SI/TA toggle, persisted client state
context/ThemeProvider.tsx        Light/dark toggle, persisted client state
lib/api.ts               Server-side Esana fetchers + stale-data fallback
lib/newsdata.ts            Server-side NewsData.io fetcher (optional second source)
lib/weather.ts              Server-side Open-Meteo fetcher (no key needed)
lib/status.ts                Passive in-memory health tracking for the /status page
lib/bookmarks.ts               localStorage reading list + hook
lib/format.ts                    Dates, reaction labels, "is this recent" check
lib/blur.ts / lib/site.ts          Small shared constants
```

## Design notes

- **Type**: "Yaldevi" for headlines (built for Sinhala, Tamil and Latin together), "Noto Sans
  Sinhala" for body copy, and "Noto Sans Tamil" as a silent fallback so Tamil text (from the
  NewsData headlines panel and reaction labels) renders correctly wherever it appears — all
  self-hosted via `next/font/google`.
- **Colour**: warm parchment paper with ink, saffron, teal and brick accents — an editorial wire
  service look rather than a generic SaaS or AI-product palette.
- **Layout**: an asymmetric lead story, a two-column row list, and a ranked sidebar rail on wide
  screens — not a repeated card grid.
- **Motion**: kept to a few deliberate moments — a small live-pulse dot, the breaking-tag pulse,
  and the new-stories banner's entrance — rather than animating everything.

## About the data source

This project talks to an **unofficial**, third-party API that mirrors Helakuru's Esana news
feed. It can change shape, rate-limit, or go offline without notice; the app is written to fail
gracefully when that happens (see `app/error.tsx`, `app/news/[id]/not-found.tsx`, and the try/catch
guards in the sitemap and RSS routes). Ceylon Wire is a demonstration project and is not
affiliated with Helakuru or Esana.

**A note on rate limits.** The upstream API's limit is quite low — it has returned
`429 Rate limit exceeded. Try again in 10 minutes.` during testing. Two things in this codebase
exist specifically to respect that:

- Story links (`<Link prefetch={false}>`) don't prefetch in the background. By default Next.js
  prefetches every link as soon as it scrolls into view, which meant a single page load of a
  dozen story rows fired a dozen background requests — that's almost certainly what will trip
  the limit fastest.
- Fetches are cached for 5 minutes (feed) and 10 minutes (individual articles) via
  `next: { revalidate }`, and `getLatestNews`/`getNewsById` throw the upstream's own error
  description (surfaced in `app/error.tsx`) instead of silently returning an empty list when the
  API pushes back.

If you hit the limit again, it will clear on its own after the window the API reports — there's
nothing to fix locally, just wait it out.


## Gemini AI news categories

The main Esana feed and story detail fetches now support server-side Gemini categorization.
The existing category buttons use AI topics when available. The original upstream category
is preserved; if AI is disabled, unavailable, blocked, or rate-limited, stories still load.
The independent NewsData sidebar remains unchanged.

### Setup

1. Copy `.env.example` to `.env.local` if you do not already have that file.
2. Create an API key at https://aistudio.google.com/apikey using a **free-tier project with billing disabled**.
3. Set `GEMINI_API_KEY=your_key_here` in `.env.local`. Never use a `NEXT_PUBLIC_` prefix.
4. Run `npm install`, then `npm run dev`. Restart after changing environment variables.
   On your host, add the same server environment variables and redeploy.

No additional Gemini SDK dependency is needed. The server uses Google's REST API.

### Five model fallback order

| Order | Model |
| --- | --- |
| 1 | `gemini-3.5-flash-lite` |
| 2 | `gemini-3.8-flash` |
| 3 | `gemini-3.7-flash` |
| 4 | `gemini-3.6-flash` |
| 5 | `gemini-3.5-flash` |

These models were listed with free standard input/output tiers in Google's pricing documentation
on 26 September 2026: https://ai.google.dev/gemini-api/docs/pricing . Availability and quotas
can change and differ by project. A billing-enabled project can incur charges; model selection
does not enforce a zero-cost account. Check your project in AI Studio. The app does not rotate keys
or bypass provider quotas. `GEMINI_MODELS` accepts up to five comma-separated model IDs.
Set `GEMINI_CATEGORIZATION=false` to disable AI.

### Behavior and limits

- Topics: Sri Lanka, Politics, Business, Sports, Entertainment, World, Crime & Courts,
  Education, Health, and Technology.
- One successful model handles each batch, with up to 8 uncached stories per request (configurable from 1 to 20).
  Later refreshes can classify remaining stories. AI labels can be wrong.
- Titles and short article excerpts are sent to Google, without visitor searches or bookmarks.
- Outputs are validated against requested article IDs and allowed categories; malformed output
  is rejected. Safety-blocked content is not retried across other models.
- Results are cached by article content for 24 hours, up to 2,000 entries per server process.
  Same-batch concurrent requests share work; other requests can use the source categories while busy.
- Requests have a 15-second per-model timeout and a 30-second overall batch budget.
  Missing models, network errors, invalid outputs, and rate limits trigger model cooldowns.
  A 429 respects Retry-After with a minimum five-minute cooldown. Authentication failures
  pause all models for five minutes. The server logs short errors without API keys or article bodies.
- Cache and cooldown state reset after restarts and are not shared across serverless instances.
  A shared cache is recommended if traffic grows. No unlimited free usage is promised.

### Validation

Mocked API checks covered successful classification, missing keys, cache reuse, content changes,
concurrent requests, unavailable-model fallback, invalid output IDs, quota cooldowns,
permission failures, and safety blocks. Live Gemini classification requires your API key;
a production Next.js build was not run in the editing environment.


### Gemini 503 / timeout troubleshooting

HTTP 503 means the provider is temporarily unable to handle the request. It is not proof of
an invalid API key. This version uses smaller batches, model-appropriate reduced thinking,
and a larger output allowance to reduce avoidable timeouts and truncated JSON. Logs now
separate network errors, timeouts, invalid JSON, validation failures, and truncated output.
Repeated failures increase each model's cooldown from one minute to a maximum of 15 minutes;
Retry-After can extend it. After an unsuccessful batch, further attempts pause for at least
one minute. A later incoming news request retries eligible models; there is no background timer.

Existing `.env.local` files are not overwritten. Optional settings (also in `.env.example`):

```env
GEMINI_BATCH_SIZE=8
GEMINI_REQUEST_TIMEOUT_MS=15000
GEMINI_BATCH_TIMEOUT_MS=30000
```

Restart the development server after replacing the files or changing environment variables.
A first uncached news fetch can still wait up to the batch timeout; lower it if your hosting
request deadline is shorter. Source categories remain available if AI fails. Provider outages
cannot be repaired by application code. To temporarily turn AI off, set
`GEMINI_CATEGORIZATION=false`. Never send your API key in a screenshot or issue report.

References: https://ai.google.dev/gemini-api/docs/troubleshooting and
https://ai.google.dev/gemini-api/docs/generate-content/thinking .


## Tamil article translation

Selecting Tamil on a story page now translates its English headline and complete paragraph
list with Gemini, using the existing server-side `GEMINI_API_KEY` and `GEMINI_MODELS`.
If an English field is missing, its available original text is supplied for translation.
The old message saying Esana has no Tamil has been removed. Tamil content uses the site's
Tamil-capable body font and does not use Latin-style drop caps.

The browser requests `/api/news/[id]/tamil`. The server fetches the source article itself;
visitors cannot submit arbitrary translation prompts. Only the news text is sent to Google.
Translations preserve paragraph count, require Tamil script, and are cached by source content
for 24 hours (500 entries per process). Concurrent requests for the same article share work;
at most two distinct translations run per process. Individual model requests time out after
20 seconds, with a 45-second total model budget. This route declares a 60-second hosting budget;
check that your hosting plan permits it. Articles over 30,000 source JSON characters return
an unavailable state rather than silently truncating the story. Source fetch time is additional.

A Tamil loading message appears during translation. If the key is missing or Gemini fails,
readers can retry or explicitly choose English. English is never silently shown as the Tamil
article body. Existing homepage/related-story headline previews are unchanged; this feature
translates the opened article. Cached translations are machine-generated and may contain errors.

No new environment variables are required. Keep your `.env.local` and restart the server.
Mocked checks cover title/body translation, paragraph validation, content-based caching,
concurrent requests, unavailable-model fallback, cooldowns and missing keys. Live Gemini and
production browser/build verification were not available in the editing environment.


## Reader features update

- **Tamil headline previews:** the homepage, story rows, related stories and popularity list
  batch headline translation requests when Tamil is selected. Failed translations offer retry.
  NewsData's independent Tamil headlines already come from its Tamil feed.
- **In brief:** each opened story can generate three AI summary points in the selected
  English, Sinhala or Tamil language. Click the summary button to request it; it is optional.
- **Your topics:** choose preferred subjects and enable “Show only my topics”. Choices stay
  on this device, with normal category/search filters available alongside them.
- **Reading controls:** 16–24px text, estimated reading time, and a reading view that hides
  the header, footer and related stories. Exit with the button or Escape.
- **Daily digest:** `/digest` collects available feed items by Sri Lanka date. A date picker
  opens prior collected editions. This is a collection, not AI editorial ranking. Archives
  are captured on digest visits, kept for 30 days, and can be incomplete; no scheduler is installed.
- **Offline library:** bookmarking fetches the complete story and stores it on this device.
  Saved shows whether an offline copy is ready and provides a retry for older bookmarks.
  `/offline.html` opens saved article text without Next.js or a network connection. Tamil is
  available offline only after opening the saved article in Tamil while online. Images are
  not downloaded. Browser site-data deletion removes offline copies. Service workers require
  HTTPS or localhost and one successful online visit for installation.
- **Persistent AI cache:** translations, headline batches and summaries are cached on disk by
  source content for 30 days. Set `AI_CACHE_DIR` to a writable persistent directory. The default
  `.data/ai-cache` works across local restarts. On ephemeral/serverless deployments, mount
  persistent storage or this feature cannot survive redeploys. Existing category cache remains
  in memory. Disk write failures fall back to memory and produce one server warning.
- **Developer links:** GitHub is configured for SULAKSHAN-M. Set `DEVELOPER_LINKEDIN_URL`
  and `DEVELOPER_PORTFOLIO_URL` to your exact HTTPS URLs to show the remaining links.
  They are hidden while unset; no profile URLs have been guessed.

All previous footer, clock, About page and Gemini reliability changes are retained. Keep your
existing `.env.local`, add the optional settings from `.env.example`, run `npm install`, then
restart. A lockfile is included for reproducible installs. Gemini quotas still apply and public
AI endpoints should be protected with hosting-level rate limits before high-traffic deployment.

### Validation for this update

`npm run build` and `tsc --noEmit` passed with the included lockfile. Mocked API checks
covered summaries, Tamil titles/bodies, invalid outputs, and disk-cache reuse after module
restarts. DOM/service-worker tests covered offline article text, safe rendering, saved Tamil,
the offline library, and navigation fallback. Full browser visual testing was unavailable
because the environment could not download a browser. Live Gemini still requires your key.

## Editorial and discovery update

New pages: `/coverage` for grouped reporting and chronological timelines, `/alerts` for
opt-in breaking-news preferences, and `/admin` for the protected editorial dashboard.
Article pages now include publisher/feed labels, Tamil translation feedback, and downloadable
square or landscape news cards. The homepage adds a district-name mention filter.

The dashboard reviews reader feedback, corrects article categories and Tamil text, monitors
recent AI failures, and sends explicitly confirmed breaking-news alerts. Categories and
translations edited by the owner take precedence while the source article remains unchanged.

Read **EDITORIAL-SETUP.md** before enabling admin access or notifications. Admin login needs
`ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`; push needs VAPID credentials. These are intentionally
blank in `.env.example`. No password is preconfigured and no notifications have been sent.
Use a single Node server with persistent private storage for this file-backed release.

### Editorial update validation

Production build and TypeScript checks passed. Core tests covered authentication, forged
sessions, origin checks, request-size bounds, district matching, headline grouping, serialized
storage, stale-correction rejection, push endpoint restrictions, topic targeting and duplicate
alert suppression. Production HTTP tests verified admin login, cross-origin rejection, feedback,
category/Tamil corrections, public translation overrides, new pages, and both PNG downloads.
Share-card rendering was visually inspected. Provider-facing checks used mocks; live Gemini
quality and real browser push delivery require your credentials and deployment. No live alerts
were sent.
