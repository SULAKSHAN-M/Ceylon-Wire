# Ceylon Wire: editorial features

Keep your existing `.env.local`. Add the settings below as needed, run `npm install`,
and restart with `npm run dev`. All earlier features remain available.

## Features

- News cards and article pages identify the Esana / Helakuru feed. Independent NewsData
  items retain their supplied publisher labels; the app does not invent the original publisher.
- The district selector matches district names in article text. It is a mention filter, not
  verified geolocation; stories may mention several places. Unknown locations remain accessible.
- `/coverage` combines similar reports into expandable groups with their source links.
  Switch to timelines for a broader, chronological view of possible related reports.
  Similarity uses headline words and a 72-hour window, with no extra Gemini calls.
  It does not prove two reports describe the same event. Full feed stories remain available.
- Readers can report a Tamil translation problem from the article page.
- `/admin` reviews feedback, edits categories and Tamil article text, and lists recent AI failures.
  Corrections take precedence over AI, invalidate the relevant page cache, and only apply while
  the source headline/content fingerprint still matches. Updated reporting needs a fresh review.
- Articles offer downloadable 1200×630 and 1200×1200 English headline cards.
- `/alerts` allows voluntary browser notifications and topic preferences. Nothing is sent on
  subscription. The editor explicitly selects a story and confirms sending from `/admin`.

## Admin access

Set a unique `ADMIN_PASSWORD` of at least 16 characters and an independent random
`ADMIN_SESSION_SECRET` of at least 32 characters. There is no default password.
Generate a session secret locally with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then set these in `.env.local` or your host's secret settings:

```env
ADMIN_PASSWORD=your-long-unique-password
ADMIN_SESSION_SECRET=your-generated-secret
EDITORIAL_DATA_DIR=.data/editorial
```

Open `/admin`, sign in, and load a story by its numeric ID or from the latest list.
Choose a category. To correct Tamil, load the current translation, edit the headline and
paragraphs, keeping one blank line between paragraphs. Save the correction. Removing
corrections restores the normal AI/source results. Refresh an already-open reader page.

The eight-hour session uses an HttpOnly, SameSite=Strict cookie and Secure in production.
Use HTTPS for deployment. Mutating routes require the same origin; authentication is checked
on each admin API call. Login and reader feedback have in-process request limits. Configure
trusted proxy handling and edge rate limits for public production traffic.

## Persistence and deployment

`EDITORIAL_DATA_DIR` stores private feedback, corrections, AI failure records, subscriptions
and delivery IDs. Never put it inside `public/` or commit it to Git. Back it up and mount it
on durable storage. Writes are serialized and atomic within **one Node server process**.
This file-based implementation is not suitable for multiple replicas or stateless/serverless
instances without a shared transactional database. Keep `AI_CACHE_DIR` durable too.

The dashboard retains the last 500 feedback entries and 100 failed AI batches. It does not
store keys, prompts, or full provider error bodies in the failure list.

## Push notifications

1. Run `npm run push:keys` once on your computer.
2. Set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and your `VAPID_SUBJECT` contact URI
   (for example `mailto:you@your-domain.com`). Keep the private key server-side.
3. Restart the server and visit `/alerts` on HTTPS or localhost.
4. Readers explicitly enable alerts and select topics. No topics selected means all topics.
5. Sign in at `/admin`, load a story, tick the confirmation, and send the alert.

No automatic scheduler or external mailing service is configured. Browser/platform support
varies; iOS/iPadOS requires an installed Home Screen web app. The current release caps
subscriptions at 100 and sends in groups of ten, with four-second provider timeouts.
Topics use the editor/AI category, or the source category when available.
Successful deliveries are recorded per subscription; retry skips recorded successes.
As with other push systems, a crash between delivery and recording can cause a repeat.
Expired subscriptions (404/410) are removed. Users unsubscribe on `/alerts`.

Supported push endpoints are restricted to Google FCM, Mozilla, Apple and Windows providers.
The app does not send requests to arbitrary subscription URLs. Push delivery and subscriber
permissions require real browser/provider testing with your VAPID setup.

## Validation

See README for build and test results. No live alerts have been sent by this update.
