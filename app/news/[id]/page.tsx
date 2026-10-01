import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLatestNews, getPost } from '@/lib/api';
import { ArticleView } from '@/components/ArticleView';

export const revalidate = 600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: 'Story not found' };
  }

  const title = post.title_en || post.title;
  const description = post.content[0]?.data_en ?? post.content[0]?.data;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const [post, latest] = await Promise.all([getPost(id), getLatestNews().catch(() => [])]);

  if (!post) {
    notFound();
  }

  const related = latest.filter((item) => item.id !== post.id).slice(0, 4);

  return <ArticleView post={post} related={related} />;
}
