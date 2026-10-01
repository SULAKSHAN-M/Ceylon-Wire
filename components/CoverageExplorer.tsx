'use client';
import { useState } from 'react';
import { coverageItems, groupCoverage } from '@/lib/news-discovery';
import type { NewsPost, WireHeadline } from '@/lib/types';
export function CoverageExplorer({ posts, wire }: { posts: NewsPost[]; wire: WireHeadline[] }) {
  const [timeline,setTimeline]=useState(false);
  const groups=groupCoverage(coverageItems(posts,wire),timeline?0.45:0.72).filter(g=>g.length>1);
  return <section className="mt-8 border-t border-line pt-6">
    <div className="flex flex-wrap items-center gap-4"><h2 className="font-display text-2xl font-semibold">{timeline?'Story timelines':'Grouped coverage'}</h2><button type="button" onClick={()=>setTimeline(v=>!v)} className="text-sm underline">{timeline?'View similar headlines':'View timelines'}</button></div>
    <p className="mt-3 text-sm text-muted">Possible related reports grouped by headline similarity within 72 hours. Matching is automatic and may be imperfect; all original links remain available.</p>
    {groups.length?groups.map(group=><details key={group[0].key} className="mt-5 border-b border-line pb-5"><summary className="cursor-pointer font-display text-lg font-medium">{group[0].title} <span className="text-xs text-muted">({group.length} reports)</span></summary><ol className="mt-4 space-y-4 border-l border-line pl-5">{[...group].sort((a,b)=>timeline?a.published-b.published:b.published-a.published).map(item=><li key={item.key}><p className="text-xs text-muted">{item.source} · {new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Colombo'}).format(new Date(item.published))}</p><a href={item.href} className="underline underline-offset-4" {...(item.href.startsWith('http')?{target:'_blank',rel:'noopener noreferrer'}:{})}>{item.title}</a></li>)}</ol></details>):<p className="py-8 text-muted">No closely related reports were found in the available feed.</p>}
  </section>;
}
