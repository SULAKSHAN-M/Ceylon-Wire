import type { Language } from './types';

const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  en: 'en-GB',
  si: 'si-LK',
  ta: 'ta-LK',
};

/**
 * The API returns "published" as "YYYY-MM-DD HH:mm:ss" with no timezone
 * marker. Treat it as Asia/Colombo local time and format it for reading.
 */
export function formatPublished(published: string, language: Language): string {
  const isoLike = published.replace(' ', 'T');
  const date = new Date(`${isoLike}+05:30`);

  if (Number.isNaN(date.getTime())) {
    return published;
  }

  return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Colombo',
  }).format(date);
}

/**
 * Picks which of the Esana feed's two text fields to show. The feed only
 * ever provides Sinhala and English — there's no Tamil field — so Tamil
 * mode falls back to English, the closer of the two available options.
 */
export function getBilingualText(sinhala: string, english: string, language: Language): string {
  if (language === 'si') return sinhala || english;
  return english || sinhala;
}

const REACTION_LABELS_SI: Record<string, string> = {
  like: 'හොඳයි',
  love: 'ආදරෙයි',
  haha: 'හහා',
  wow: 'වාව්',
  sad: 'දුකයි',
  angry: 'තරහයි',
};

const REACTION_LABELS_TA: Record<string, string> = {
  like: 'பிடித்துள்ளது',
  love: 'அன்பு',
  haha: 'ஹஹா',
  wow: 'அடேங்கப்பா',
  sad: 'வருத்தம்',
  angry: 'கோபம்',
};

export function reactionLabel(text: string, language: Language): string {
  const key = text.toLowerCase();
  if (language === 'si') return REACTION_LABELS_SI[key] ?? text;
  if (language === 'ta') return REACTION_LABELS_TA[key] ?? text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Whether a story published within the last `withinMinutes` (default 2 hours). */
export function isRecent(published: string, withinMinutes = 120): boolean {
  const isoLike = published.replace(' ', 'T');
  const date = new Date(`${isoLike}+05:30`);
  if (Number.isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() <= withinMinutes * 60 * 1000;
}

/**
 * NewsData.io returns pubDate as "YYYY-MM-DD HH:mm:ss" in UTC (unlike the
 * Esana feed, which is already local time) — treat it accordingly.
 */
export function formatWireDate(pubDate: string): string {
  const isoLike = `${pubDate.replace(' ', 'T')}Z`;
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return pubDate;

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Colombo',
  }).format(date);
}

/** "3 minutes ago" / "2 hours ago" / "yesterday" style — no Language dependency. */
export function formatRelativeTime(ms: number): string {
  const diffMinutes = Math.round((Date.now() - ms) / 60000);
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes === 1) return '1 minute ago';
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.round(diffHours / 24);
  return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
}

/**
 * Category id → name. Only 2 (Politics) is confirmed from real data so
 * far (an observed protest/parliament story) — the rest follow the
 * category set most Sri Lankan outlets use, as a best-effort mapping
 * until more ids are confirmed. Update freely as real examples turn up;
 * anything not listed here just falls back to "Category N".
 */
const CATEGORY_NAMES: Record<number, string> = {
  1: 'Sri Lanka',
  2: 'Politics',
  3: 'Business',
  4: 'Sports',
  5: 'Entertainment',
  6: 'World',
  7: 'Crime & Courts',
  8: 'Education',
  9: 'Health',
  10: 'Technology',
  101: 'Sri Lanka',
  102: 'Politics',
  103: 'Business',
  104: 'Sports',
  105: 'Entertainment',
  106: 'World',
  107: 'Crime & Courts',
  108: 'Education',
  109: 'Health',
  110: 'Technology',
};

export function categoryLabel(category: number): string {
  return CATEGORY_NAMES[category] ?? `Category ${category}`;
}

/** Absolute "24 Sept, 14:30" — used on the status page and the stale-data notice. */
export function formatAbsoluteTime(ms: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Colombo',
  }).format(new Date(ms));
}
