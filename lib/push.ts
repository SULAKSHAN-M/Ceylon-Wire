import webpush from 'web-push';
import type { NewsPost } from './types';
import { editEditorial, readEditorial, type Subscriber } from './editorial-store';
export const pushConfigured=()=>!!(process.env.VAPID_PUBLIC_KEY&&process.env.VAPID_PRIVATE_KEY&&process.env.VAPID_SUBJECT);
export function validSubscription(value:unknown):value is {endpoint:string;keys:{p256dh:string;auth:string}}{
  if(!value||typeof value!=='object')return false;const v=value as Subscriber;
  try{const url=new URL(v.endpoint);const host=url.hostname;
    const allowed=host==='fcm.googleapis.com'||host==='web.push.apple.com'||host==='updates.push.services.mozilla.com'||host.endsWith('.push.services.mozilla.com')||host.endsWith('.notify.windows.com');
    return allowed&&url.protocol==='https:'&&!url.username&&!url.password&&(!url.port||url.port==='443')&&v.endpoint.length<2048&&typeof v.keys?.p256dh==='string'&&typeof v.keys?.auth==='string'&&/^[\w-]+$/.test(v.keys.p256dh)&&/^[\w-]+$/.test(v.keys.auth)&&Buffer.from(v.keys.p256dh,'base64url').length===65&&Buffer.from(v.keys.auth,'base64url').length===16;
  }catch{return false;}
}
const sending=new Set<number>();
export async function sendStoryAlert(post:NewsPost){
  if(!pushConfigured())throw new Error('Configure VAPID settings before sending alerts.');
  if(sending.has(post.id))throw new Error('This story is already being sent.');sending.add(post.id);
  let delivered=0,failed=0;
  try{
    const topic=post.aiCategory||(post.category&&post.category>=1&&post.category<=10?post.category+100:101);
    const subscribers=(await readEditorial()).subscribers.filter(s=>(!s.topics.length||s.topics.includes(topic))&&!(s.delivered||[]).includes(post.id));
    for(let i=0;i<subscribers.length;i+=10){
      await Promise.all(subscribers.slice(i,i+10).map(async subscription=>{
        try{
          await webpush.sendNotification(subscription,JSON.stringify({title:'Ceylon Wire · Breaking news',body:(post.title_en||post.title).slice(0,180),url:`/news/${post.id}`,tag:`story-${post.id}`}),{TTL:3600,timeout:4000,vapidDetails:{subject:process.env.VAPID_SUBJECT!,publicKey:process.env.VAPID_PUBLIC_KEY!,privateKey:process.env.VAPID_PRIVATE_KEY!}});
          await editEditorial(data=>{const row=data.subscribers.find(s=>s.endpoint===subscription.endpoint);if(row)row.delivered=[...(row.delivered||[]),post.id].slice(-100);});delivered++;
        }catch(error){failed++;if([404,410].includes((error as {statusCode?:number}).statusCode||0))await editEditorial(data=>{data.subscribers=data.subscribers.filter(s=>s.endpoint!==subscription.endpoint);});}
      }));
    }
    if(delivered)await editEditorial(data=>{data.sent=[...new Set([...data.sent,post.id])].slice(-200);});
    return {delivered,failed};
  }finally{sending.delete(post.id);}
}
