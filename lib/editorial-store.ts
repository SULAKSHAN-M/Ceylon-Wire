import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomUUID } from 'node:crypto';
export interface Correction { category?: number; tamil?: { title: string; paragraphs: string[] }; sourceHash: string; updated: number }
export interface Feedback { id: string; storyId: number; message: string; created: number; resolved: boolean }
export interface Subscriber { endpoint: string; keys: { p256dh: string; auth: string }; topics: number[]; delivered?: number[]; created: number }
export interface EditorialData { corrections: Record<string,Correction>; feedback: Feedback[]; failures: { task:string; reason:string; at:number }[]; subscribers: Subscriber[]; sent: number[] }
const empty = ():EditorialData=>({corrections:{},feedback:[],failures:[],subscribers:[],sent:[]});
const directory=()=>resolve(/* turbopackIgnore: true */ process.env.EDITORIAL_DATA_DIR||'.data/editorial');
let chain:Promise<unknown>=Promise.resolve();
export async function readEditorial():Promise<EditorialData>{
  try { return {...empty(),...JSON.parse(await readFile(join(directory(),'store.json'),'utf8'))}; }
  catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return empty();throw error;}
}
export function editEditorial<T>(fn:(data:EditorialData)=>T|Promise<T>):Promise<T>{
  const task=chain.then(async()=>{
    const data=await readEditorial();const result=await fn(data);
    await mkdir(directory(),{recursive:true});
    const temp=join(directory(),`${randomUUID()}.tmp`);
    await writeFile(temp,JSON.stringify(data),{mode:0o600});await rename(temp,join(directory(),'store.json'));return result;
  });
  chain=task.catch(()=>{});return task;
}
export function recordAIFailure(task:string,reason:string){
  void editEditorial(data=>{data.failures.unshift({task,reason:reason.slice(0,180),at:Date.now()});data.failures=data.failures.slice(0,100);}).catch(()=>{});
}
