import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
export const ADMIN_COOKIE='ceylon-wire-admin';
const equal=(a:string,b:string)=>timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest());
export const adminConfigured=()=>!!(process.env.ADMIN_PASSWORD&&process.env.ADMIN_PASSWORD.length>=16&&process.env.ADMIN_SESSION_SECRET&&process.env.ADMIN_SESSION_SECRET.length>=32);
function sign(value:string){return createHmac('sha256',`${process.env.ADMIN_SESSION_SECRET}:${process.env.ADMIN_PASSWORD}`).update(value).digest('base64url');}
export function passwordMatches(value:string){return adminConfigured()&&equal(value,process.env.ADMIN_PASSWORD!);}
export function newSession(){const value=String(Date.now()+8*3600000);return `${value}.${sign(value)}`;}
export function validSession(token:string|undefined){if(!adminConfigured()||!token)return false;const parts=token.split('.');return parts.length===2&&Number(parts[0])>Date.now()&&Number(parts[0])<=Date.now()+8*3600000&&equal(parts[1],sign(parts[0]));}
export function requestIsAdmin(request:Request){const token=request.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(`${ADMIN_COOKIE}=`))?.slice(ADMIN_COOKIE.length+1);return validSession(token);}
export function sameOrigin(request:Request){
  try {
    const origin = new URL(request.headers.get('origin') || '');
    const expected = new URL(request.url);
    // Next may normalize its internal hostname; Host retains the browser-facing host.
    const host = request.headers.get('host');
    if (host) expected.host = host;
    if (origin.origin === expected.origin) return true;
    // Explicit canonical origin supports HTTPS termination at a trusted reverse proxy.
    const canonical = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : null;
    return !!canonical && origin.origin === canonical.origin && origin.host === expected.host;
  } catch { return false; }
}
const attempts=new Map<string,{count:number;until:number}>();
export function rateLimit(request:Request,scope:string,max=10):boolean{
  const ip=request.headers.get('x-forwarded-for')?.split(',')[0].trim()||'local';
  const key=createHash('sha256').update(scope+ip).digest('hex');const now=Date.now();
  if(attempts.size>5000)for(const [k,v]of attempts)if(v.until<now)attempts.delete(k);
  const state=attempts.get(key);if(!state||state.until<now){attempts.set(key,{count:1,until:now+600000});return true;}state.count++;return state.count<=max;
}
export async function readJSON(request:Request,max=65536):Promise<any>{
  const reader=request.body?.getReader();if(!reader)throw new Error('Missing body');let bytes=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>max){await reader.cancel();throw new Error('Too large');}chunks.push(value);}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
