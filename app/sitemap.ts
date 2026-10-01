import type { MetadataRoute } from 'next';
import { getLatestNews } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getLatestNews>> = [];
  try {
    posts = await getLatestNews();
  } catch {
    // upstream unreachable — ship the sitemap without article entries
  }

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/news/${post.id}`,
    lastModified: new Date(`${post.published.replace(' ', 'T')}+05:30`),
  }));

  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/terms`, lastModified: new Date() },
    { url: `${SITE_URL}/privacy`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/digest`, lastModified: new Date() },
    { url: `${SITE_URL}/coverage`, lastModified: new Date() },
    { url: `${SITE_URL}/alerts`, lastModified: new Date() },
    ...articleEntries,
  ];
}
