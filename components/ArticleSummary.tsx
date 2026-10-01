'use client';
import { useEffect, useState } from 'react';
import type { Language } from '@/lib/types';
export function ArticleSummary({ id, language }: { id: number; language: Language }) {
  const [points, setPoints] = useState<string[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [requested, setRequested] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    setPoints([]); setState('idle');
    if (!requested) return;
    const controller = new AbortController(); setState('loading');
    fetch(`/api/news/${id}/summary?language=${language}`, { signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error(); return response.json(); })
      .then(data => { if (!Array.isArray(data.points) || data.points.length !== 3 || !data.points.every((s: unknown) => typeof s === 'string')) throw new Error(); if (!controller.signal.aborted) { setPoints(data.points); setState('done'); } })
      .catch(() => { if (!controller.signal.aborted) setState('error'); });
    return () => controller.abort();
  }, [id, language, requested, retry]);
  return <section className="my-6 border-y border-line py-5" aria-label="Article summary">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-display text-xl font-semibold">{language === 'ta' ? 'சுருக்கமாக' : language === 'si' ? 'කෙටියෙන්' : 'In brief'}</h2>
      {state !== 'done' ? <button type="button" disabled={state === 'loading'} onClick={() => { setRequested(true); setRetry(v => v + 1); }} className="text-sm underline underline-offset-4 disabled:opacity-50">{state === 'loading' ? 'Preparing summary…' : state === 'error' ? 'Try again' : 'Show 3 key points'}</button> : null}
    </div>
    {state === 'error' ? <p className="mt-3 text-sm text-muted" role="status">The summary is unavailable right now. The full story remains below.</p> : null}
    {points.length ? <><ul className="mt-4 list-disc space-y-2 pl-5">{points.map((p, i) => <li key={i}>{p}</li>)}</ul><p className="mt-3 text-xs text-muted">AI-generated summary. Read the full report for context.</p></> : null}
  </section>;
}
