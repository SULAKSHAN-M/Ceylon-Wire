import Link from 'next/link';
import { LanguageToggle } from './LanguageToggle';
import { SavedNavLink } from './SavedNavLink';
import { ThemeToggle } from './ThemeToggle';
import { PulseDot } from './PulseDot';
import { SriLankaClock } from './SriLankaClock';
import { getColomboWeather } from '@/lib/weather';

export async function Header() {
  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Asia/Colombo',
  }).format(new Date());

  const weather = await getColomboWeather();

  return (
    <header className="site-header border-b border-line">
      <div className="mx-auto flex max-w-wire flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-ink">
            Ceylon Wire
          </span>
        </Link>
        <nav aria-label="Site" className="flex flex-wrap items-center gap-4">
          <Link href="/digest" className="text-sm text-muted hover:text-ink">Digest</Link>
          <SavedNavLink />
          <ThemeToggle />
          <LanguageToggle />
        </nav>
      </div>
      <div className="mx-auto max-w-wire px-5">
        <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3 border-t border-line py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <PulseDot />
              {today}
            </span>
            {weather ? (
              <span>{weather.temperatureC}°C, {weather.description}</span>
            ) : null}
          </div>
          <SriLankaClock compact showLabel={false} />
          <abbr title="Sri Lanka Standard Time" className="ml-auto shrink-0 text-[10px] tracking-[0.14em] text-muted no-underline">
            SLST
          </abbr>
        </div>
      </div>
    </header>
  );
}
