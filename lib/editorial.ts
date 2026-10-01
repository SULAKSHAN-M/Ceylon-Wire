import { createHash } from 'node:crypto';
import type { NewsPost } from './types';
import { readEditorial } from './editorial-store';
export function storyHash(post:NewsPost){return createHash('sha256').update(JSON.stringify([post.title,post.title_en,post.content])).digest('hex');}
export async function applyCorrections(posts:NewsPost[]):Promise<NewsPost[]>{
  try{const {corrections}=await readEditorial();return posts.map(p=>{const c=corrections[p.id];return c?.category&&c.sourceHash===storyHash(p)?{...p,aiCategory:c.category,categorySource:'editor' as const}:p;});}catch{return posts;}
}
export async function correctedTamil(post:NewsPost){try{const c=(await readEditorial()).corrections[post.id];return c?.sourceHash===storyHash(post)?c.tamil:null;}catch{return null;}}
