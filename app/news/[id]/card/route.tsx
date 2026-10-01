import { ImageResponse } from 'next/og';
import { getNewsById } from '@/lib/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!/^\d{1,12}$/.test(id))return new Response('Invalid story',{status:400});
 const post=await getNewsById(id,false).catch(()=>null);if(!post)return new Response('Story unavailable',{status:404});
 const square=new URL(request.url).searchParams.get('format')==='square';
 const raw=post.title_en||post.title;const title=raw.length>240?raw.slice(0,237)+'…':raw;
 return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'space-between',width:'100%',height:'100%',background:'#F3EEE1',color:'#221E19',padding:70,fontFamily:'serif'}}><div style={{display:'flex',flexDirection:'column',borderBottom:'2px solid #221E19',paddingBottom:24}}><div style={{fontSize:48}}>Ceylon Wire</div><div style={{fontSize:20,color:'#79705F',marginTop:12}}>SRI LANKAN NEWS</div></div><div style={{fontSize:square?64:title.length>180?36:title.length>100?42:48,lineHeight:1.2,marginTop:28,marginBottom:28}}>{title}</div><div style={{display:'flex',justifyContent:'space-between',fontSize:20,borderTop:'1px solid #BDB39D',paddingTop:20}}><span>{post.published.slice(0,10)}</span><span>Source: Esana / Helakuru</span></div></div>,{width:1200,height:square?1200:630,headers:{'Content-Disposition':`attachment; filename="ceylon-wire-${id}-${square?'square':'landscape'}.png"`}});
}
