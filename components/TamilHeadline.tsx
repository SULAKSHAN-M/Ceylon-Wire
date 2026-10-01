'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageProvider';
import { getBilingualText } from '@/lib/format';

const results = new Map<number, string>();
const queue = new Map<number, ((text: string | null) => void)[]>();
let timer: ReturnType<typeof setTimeout> | undefined;
let busy = false;
async function flush() {
  if (busy) return;
  const batch = [...queue.entries()].slice(0, 10);
  if (!batch.length) return;
  busy = true;
  batch.forEach(([id]) => queue.delete(id));
  try {
    const response = await fetch('/api/headlines/tamil', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: batch.map(([id]) => id) }) });
    if (!response.ok) throw new Error('Unavailable');
    const data = await response.json();
    for (const row of data.headlines || []) if (typeof row.title === 'string') results.set(row.id, row.title);
    batch.forEach(([id, callbacks]) => callbacks.forEach(cb => cb(results.get(id) || null)));
  } catch { batch.forEach(([, callbacks]) => callbacks.forEach(cb => cb(null))); }
  finally { busy = false; if (queue.size) timer = setTimeout(flush, 100); }
}
export function TamilHeadline({ id, title, title_en }: { id: number; title: string; title_en: string }) {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState<string | null>(results.get(id) || null);
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (language !== 'ta') return;
    setTranslated(results.get(id) || null); setFailed(false);
    if (results.has(id)) return;
    let alive = true;
    const callback = (text: string | null) => { if (alive) { setTranslated(text); setFailed(!text); } };
    queue.set(id, [...(queue.get(id) || []), callback]);
    clearTimeout(timer); timer = setTimeout(flush, 100);
    return () => { alive = false; };
  }, [language, id, retry]);
  if (language !== 'ta') return <>{getBilingualText(title, title_en, language)}</>;
  if (translated) return <span lang="ta" className="font-body">{translated}</span>;
  return <span lang="ta" className="font-body text-sm text-muted">
    {failed ? 'மொழிபெயர்ப்பு கிடைக்கவில்லை.' : 'தமிழில் மொழிபெயர்க்கப்படுகிறது…'}
    {failed ? <button type="button" className="ml-2 underline" onClick={event => { event.preventDefault(); event.stopPropagation(); setRetry(v => v + 1); }}>மீண்டும் முயற்சிக்கவும்</button> : null}
  </span>;
}
