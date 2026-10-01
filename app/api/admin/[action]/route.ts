import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, newSession, passwordMatches, requestIsAdmin, sameOrigin, rateLimit, readJSON } from '@/lib/admin-auth';
import { editEditorial, readEditorial } from '@/lib/editorial-store';
import { getLatestNews, getNewsById } from '@/lib/api';
import { storyHash } from '@/lib/editorial';
import { sendStoryAlert } from '@/lib/push';
export const maxDuration=60;
export async function GET(request:Request,{params}:{params:Promise<{action:string}>}){
  if(!requestIsAdmin(request))return NextResponse.json({error:'Unauthorized'},{status:401});
  const {action}=await params;if(action!=='data')return NextResponse.json({error:'Not found'},{status:404});
  try{const store=await readEditorial();const posts=await getLatestNews(false).catch(()=>[]);return NextResponse.json({posts,corrections:store.corrections,feedback:store.feedback,failures:store.failures,subscriberCount:store.subscribers.length,sent:store.sent},{headers:{'Cache-Control':'no-store'}});}catch{return NextResponse.json({error:'Editorial storage is unavailable.'},{status:503});}
}
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
  if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin'},{status:403});
  const {action}=await params;
  if(action==='login'){
    if(!rateLimit(request,'admin-login',10))return NextResponse.json({error:'Too many attempts. Wait ten minutes.'},{status:429});
    try{const {password}=await readJSON(request,2048);if(typeof password!=='string'||!passwordMatches(password))return NextResponse.json({error:'Invalid credentials or admin is not configured.'},{status:401});
      const response=NextResponse.json({ok:true});response.cookies.set(ADMIN_COOKIE,newSession(),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:28800});return response;
    }catch{return NextResponse.json({error:'Invalid request'},{status:400});}
  }
  if(!requestIsAdmin(request))return NextResponse.json({error:'Unauthorized'},{status:401});
  if(action==='logout'){const response=NextResponse.json({ok:true});response.cookies.set(ADMIN_COOKIE,'',{httpOnly:true,path:'/',maxAge:0});return response;}
  try{
    const body=await readJSON(request);
    if(action==='feedback'){
      if(typeof body.id!=='string')throw new Error('Invalid feedback id');
      await editEditorial(data=>{const item=data.feedback.find(f=>f.id===body.id);if(item)item.resolved=true;});return NextResponse.json({ok:true});
    }
    if(!Number.isSafeInteger(body.id)||body.id<=0)throw new Error('Invalid story id');
    const post=await getNewsById(String(body.id),false);if(!post)return NextResponse.json({error:'Story not found'},{status:404});
    if(action==='alert'){
      if(body.confirm!==true)throw new Error('Confirm sending first');
      return NextResponse.json(await sendStoryAlert(post));
    }
    if(action==='reset'){await editEditorial(data=>{delete data.corrections[post.id];});revalidatePath('/');revalidatePath(`/news/${post.id}`);return NextResponse.json({ok:true});}
    if(action!=='story')return NextResponse.json({error:'Not found'},{status:404});
    const category=body.category;
    if(!Number.isInteger(category)||category<101||category>110)throw new Error('Choose a category');
    let tamil: {title:string;paragraphs:string[]}|undefined;
    if(body.tamil){
      const expected=post.content.filter(b=>b.data_en||b.data).length;
      if(typeof body.tamil.title!=='string'||!/[\u0B80-\u0BFF]/.test(body.tamil.title)||body.tamil.title.length>2000||!Array.isArray(body.tamil.paragraphs)||body.tamil.paragraphs.length!==expected||!body.tamil.paragraphs.every((p:unknown)=>typeof p==='string'&&p.trim().length>0&&p.length<15000))throw new Error(`Provide a Tamil title and exactly ${expected} paragraphs`);
      tamil={title:body.tamil.title,paragraphs:body.tamil.paragraphs};
    }
    await editEditorial(data=>{const old=data.corrections[post.id];data.corrections[post.id]={category,tamil:tamil||(old?.sourceHash===storyHash(post)?old.tamil:undefined),sourceHash:storyHash(post),updated:Date.now()};});
    revalidatePath('/');revalidatePath(`/news/${post.id}`);
    return NextResponse.json({ok:true});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Action failed'},{status:400});}
}
