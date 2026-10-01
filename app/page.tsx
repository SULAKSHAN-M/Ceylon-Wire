import { getLatestNewsResilient } from '@/lib/api';
import { getSriLankaHeadlines } from '@/lib/newsdata';
import { NewsFeed } from '@/components/NewsFeed';

export const revalidate = 300;

export default async function HomePage() {
  const [feed, wireHeadlines] = await Promise.all([
    getLatestNewsResilient(),
    getSriLankaHeadlines(),
  ]);

  return (
    <main id="main-content" className="mx-auto max-w-wire px-5 py-8">
      <NewsFeed
        posts={feed.posts}
        wireHeadlines={wireHeadlines}
        stale={feed.stale}
        staleSince={feed.staleSince}
      />
    </main>
  );
}
