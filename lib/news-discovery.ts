import type { NewsPost, WireHeadline } from './types';
export const DISTRICTS = ['Ampara','Anuradhapura','Badulla','Batticaloa','Colombo','Galle','Gampaha','Hambantota','Jaffna','Kalutara','Kandy','Kegalle','Kilinochchi','Kurunegala','Mannar','Matale','Matara','Monaragala','Mullaitivu','Nuwara Eliya','Polonnaruwa','Puttalam','Ratnapura','Trincomalee','Vavuniya'];
const aliases: Record<string,string[]> = { Colombo:['කොළඹ','கொழும்பு'], Kandy:['මහනුවර','கண்டி'], Galle:['ගාල්ල','காலி'], Jaffna:['යාපනය','யாழ்ப்பாணம்'], Gampaha:['ගම්පහ','கம்பஹா'], 'Nuwara Eliya':['නුවරඑළිය','நுவரெலியா'] };
export function districtsFor(post: NewsPost): string[] {
  const text = [post.title_en,post.title,...post.content.map(b=>`${b.data_en} ${b.data}`)].join(' ').toLowerCase();
  return DISTRICTS.filter(name=>new RegExp(`\\b${name.toLowerCase()}\\b`).test(text) || (aliases[name] || []).some(s=>text.includes(s)));
}
export function sourceName(post: NewsPost): string { return post.sourceName || 'Esana / Helakuru'; }
export interface CoverageItem { key: string; title: string; href: string; source: string; published: number }
export function coverageItems(posts: NewsPost[], wire: WireHeadline[] = []): CoverageItem[] {
  return [...posts.map(p=>({key:`esana-${p.id}`,title:p.title_en||p.title,href:/^https?:\/\//.test(p.link)?p.link:`/news/${p.id}`,source:sourceName(p),published:Date.parse(`${p.published.replace(' ','T')}+05:30`)})),
    ...wire.filter(p=>/^https?:\/\//.test(p.link)).map(p=>({key:`wire-${p.id}`,title:p.title,href:p.link,source:p.sourceName||'NewsData feed',published:Date.parse(`${p.publishedAt.replace(' ','T')}Z`)}))];
}
const stop = new Set('a an the and or for from to of in on at by with as is are was were has have had this that sri lanka sri-lanka news says said new after over today update latest'.split(' '));
function words(title: string): Set<string> { return new Set(title.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter(w=>w.length>2&&!stop.has(w))||[]); }
export function groupCoverage(items: CoverageItem[], threshold = 0.72): CoverageItem[][] {
  const groups: CoverageItem[][]=[];
  for(const item of [...items].sort((a,b)=>(b.published||0)-(a.published||0))) {
    const tokens=words(item.title);
    const group=groups.find(g=>{
      const anchor=g[0];if(!Number.isFinite(item.published)||!Number.isFinite(anchor.published)||Math.abs(anchor.published-item.published)>72*3600000)return false;
      const other=words(anchor.title);const common=[...tokens].filter(w=>other.has(w)).length;
      return common>=3 && 2*common/(tokens.size+other.size)>=threshold;
    });
    if(group)group.push(item);else groups.push([item]);
  }
  return groups;
}
