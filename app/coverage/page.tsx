import { getLatestNews } from '@/lib/api';
import { getSriLankaHeadlines } from '@/lib/newsdata';
import { CoverageExplorer } from '@/components/CoverageExplorer';
export const metadata={title:'Coverage & timelines'};
export const dynamic='force-dynamic';
export default async function CoveragePage(){
  const [posts,wire]=await Promise.all([getLatestNews(false).catch(()=>[]),getSriLankaHeadlines().catch(()=>[])]);
  return <main id="main-content" className="mx-auto max-w-read px-5 py-12"><p className="text-xs uppercase tracking-widest text-muted">Follow the developing story</p><h1 className="mt-3 font-display text-3xl font-semibold">Coverage &amp; timelines</h1><CoverageExplorer posts={posts} wire={wire}/></main>;
}
