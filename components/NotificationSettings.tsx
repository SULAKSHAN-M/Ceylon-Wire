'use client';
import { useEffect,useState } from 'react';
import { categoryLabel } from '@/lib/format';
export function NotificationSettings(){
 const [config,setConfig]=useState<{configured:boolean;publicKey:string|null}|null>(null),[active,setActive]=useState(false),[topics,setTopics]=useState<number[]>([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[supported,setSupported]=useState(false);
 useEffect(()=>{setSupported('serviceWorker'in navigator&&'PushManager'in window&&'Notification'in window);fetch('/api/push').then(r=>r.json()).then(setConfig).catch(()=>setMessage('Settings unavailable.'));try{const saved=JSON.parse(localStorage.getItem('wire-alert-topics')||'[]');if(Array.isArray(saved))setTopics(saved.filter(n=>Number.isInteger(n)&&n>=101&&n<=110));}catch{}if('serviceWorker'in navigator)navigator.serviceWorker.getRegistration().then(r=>r?.pushManager.getSubscription()).then(s=>setActive(!!s)).catch(()=>{});},[]);
 async function save(remove=false){setBusy(true);setMessage('');try{
   if(!supported)throw new Error('This browser does not support push notifications.');
   const registration=await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;
   let subscription=await registration.pushManager.getSubscription();
   if(!remove){if(!config?.publicKey)throw new Error('Notifications are not configured.');const permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('Notification permission was not granted. You can change it in browser settings.');subscription=subscription||await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:config.publicKey});}
   if(subscription){const response=await fetch('/api/push',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({subscription:subscription.toJSON(),topics,remove})});const result=await response.json();if(!response.ok){if(!active&&!remove)await subscription.unsubscribe();throw new Error(result.error);}if(remove)await subscription.unsubscribe();}
   setActive(!remove);try{localStorage.setItem('wire-alert-topics',JSON.stringify(topics));}catch{}setMessage(remove?'News alerts turned off.':'Your alert preferences are saved.');
 }catch(e){setMessage(e instanceof Error?e.message:'Unable to update alerts');}finally{setBusy(false);}}
 return <section className="mt-6"><p className="text-sm text-muted">Opt in to editor-selected breaking news. Select topics, or leave them all unchecked for every alert. You can turn alerts off here at any time.</p>
 {!supported?<p className="mt-4 text-sm">Push notifications require a supported browser on HTTPS or localhost. On iPhone or iPad, install the site on the Home Screen first.</p>:null}
 {config&&!config.configured?<p className="mt-4 text-sm">News alerts are not enabled by the site administrator yet.</p>:null}
 <div className="my-6 flex flex-wrap gap-4">{Array.from({length:10},(_,i)=>101+i).map(c=><label key={c} className="flex gap-2 text-sm"><input type="checkbox" checked={topics.includes(c)} onChange={e=>setTopics(e.target.checked?[...topics,c]:topics.filter(t=>t!==c))}/>{categoryLabel(c)}</label>)}</div>
 <div className="flex flex-wrap gap-4"><button disabled={busy||!supported||!config?.configured} onClick={()=>save()} className="border border-ink px-4 py-2 disabled:opacity-40">{active?'Save alert preferences':'Enable news alerts'}</button>{active?<button disabled={busy} onClick={()=>save(true)} className="underline">Turn off alerts</button>:null}</div><p className="mt-4 text-sm" role="status">{message}</p></section>;
}
