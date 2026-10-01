import { getLatestNews } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      default:
        return '&quot;';
    }
  });
}

export async function GET() {
  let posts: Awaited<ReturnType<typeof getLatestNews>> = [];
  try {
    posts = await getLatestNews();
  } catch {
    // upstream unreachable — return an empty feed rather than fail
  }

  const items = posts
    .map((post) => {
      const pubDate = new Date(`${post.published.replace(' ', 'T')}+05:30`).toUTCString();
      const description = post.content[0]?.data_en ?? post.content[0]?.data ?? '';
      return `
    <item>
      <title>${escapeXml(post.title_en || post.title)}</title>
      <link>${SITE_URL}/news/${post.id}</link>
      <guid>${SITE_URL}/news/${post.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Ceylon Wire</title>
    <link>${SITE_URL}</link>
    <description>Sri Lankan news, as it breaks.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
