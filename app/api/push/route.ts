import { NextResponse } from 'next/server';
import { sameOrigin,rateLimit,readJSON } from '@/lib/admin-auth';
import { validSubscription,pushConfigured } from '@/lib/push';
import { editEditorial } from '@/lib/editorial-store';
export async function GET(){return NextResponse.json({configured:pushConfigured(),publicKey:pushConfigured()?process.env.VAPID_PUBLIC_KEY:null});}
export async function POST(request:Request){
 if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin'},{status:403});
 if(!rateLimit(request,'push',20))return NextResponse.json({error:'Please try later'},{status:429});
 try{const {subscription,topics,remove}=await readJSON(request,8192);if(!validSubscription(subscription))throw new Error('Unsupported push subscription');
   if(remove){await editEditorial(data=>{data.subscribers=data.subscribers.filter(s=>s.endpoint!==subscription.endpoint);});return NextResponse.json({ok:true});}
   if(!pushConfigured())throw new Error('Notifications are not configured yet');
   if(!Array.isArray(topics)||topics.length>10||!topics.every(t=>Number.isInteger(t)&&t>=101&&t<=110))throw new Error('Invalid topics');
   await editEditorial(data=>{const existing=data.subscribers.find(s=>s.endpoint===subscription.endpoint);if(!existing&&data.subscribers.length>=100)throw new Error('Subscription capacity reached');data.subscribers=data.subscribers.filter(s=>s.endpoint!==subscription.endpoint);data.subscribers.push({...subscription,topics:[...new Set<number>(topics)],created:existing?.created||Date.now(),delivered:existing?.delivered||[]});});return NextResponse.json({ok:true});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Subscription failed'},{status:400});}
}
