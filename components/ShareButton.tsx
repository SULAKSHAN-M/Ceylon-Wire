'use client';

import { useState } from 'react';
import { ShareIcon, CheckIcon } from './Icons';

export function ShareButton({ title, className }: { title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — no action needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share this story"
      className={
        className ??
        'inline-flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-sm text-ink hover:border-ink'
      }
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <ShareIcon className="h-4 w-4" />}
      {copied ? 'Copied' : 'Share'}
    </button>
  );
}
