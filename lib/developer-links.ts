function safeURL(value: string | undefined): string | null {
  try { const url = new URL(value || ''); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
}
export const developerLinks = [
  { label: 'GitHub', href: 'https://github.com/SULAKSHAN-M' },
  { label: 'LinkedIn', href: safeURL(process.env.DEVELOPER_LINKEDIN_URL) },
  { label: 'Portfolio', href: safeURL(process.env.DEVELOPER_PORTFOLIO_URL) },
].filter((link): link is { label: string; href: string } => !!link.href);
