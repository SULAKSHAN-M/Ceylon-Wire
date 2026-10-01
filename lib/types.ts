export interface ReactionItem {
  count: number;
  id: number;
  text: string;
}

export interface ContentBlock {
  data: string;
  data_en: string;
}

export interface NewsPost {
  comments: number;
  content: ContentBlock[];
  id: number;
  link: string;
  published: string;
  reactionList: ReactionItem[];
  thumb: string;
  title: string;
  title_en: string;
  /**
   * Raw numeric category id from the API — the name mapping (Politics,
   * Sports, etc.) isn't confirmed yet, so the UI currently just labels
   * these "Category N". Update lib/format.ts's CATEGORY_NAMES once real
   * values are observed.
   */
  category: number | null;
  /** AI category uses a separate namespace; upstream ids are preserved. */
  aiCategory?: number;
  categorySource?: 'gemini' | 'editor';
  categoryModel?: string;
  sourceName?: string;
}

export interface StatusObj {
  code: number;
  description: string;
  success: boolean;
}

export interface NewsListResponse {
  Posts: NewsPost[];
  Status: StatusObj;
}

export interface NewsDetailResponse extends NewsListResponse {
  refresh?: number;
}

export type Language = 'en' | 'si' | 'ta';

export interface WireHeadline {
  id: string;
  title: string;
  link: string;
  description: string | null;
  sourceName: string | null;
  publishedAt: string;
  language: 'en' | 'ta';
}
