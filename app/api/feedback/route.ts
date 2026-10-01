import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { readJSON, sameOrigin, rateLimit } from '@/lib/admin-auth';
import { editEditorial } from '@/lib/editorial-store';
export async function POST(request:Request){
  if(!sameOrigin(request))return NextResponse.json({error:'Invalid origin'},{status:403});
  if(!rateLimit(request,'feedback',5))return NextResponse.json({error:'Please wait before submitting again.'},{status:429});
  try{const {storyId,message}=await readJSON(request,4096);if(!Number.isSafeInteger(storyId)||storyId<=0||typeof message!=='string'||message.trim().length<10||message.length>1000)throw new Error();
    await editEditorial(data=>{data.feedback.unshift({id:randomUUID(),storyId,message:message.trim(),created:Date.now(),resolved:false});data.feedback=data.feedback.slice(0,500);});return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:'Feedback could not be saved. Use 10–1,000 characters and try again.'},{status:400});}
}
