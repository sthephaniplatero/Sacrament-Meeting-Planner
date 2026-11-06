import { cacheLife } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';
import NavLinks from './NavLinks';

export interface HeaderProps {
  readonly wardName?: string;
}

interface CurrentDateInfo {
  readonly formatted: string;
  readonly iso: string;
}

async function getCurrentDateInfo(): Promise<CurrentDateInfo> {
  'use cache';
  cacheLife('hours');

  const now = new Date();
  return {
    formatted: new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(now),
    iso: now.toISOString().split('T')[0],
  };
}

export default async function Header({
  wardName = 'Pioneer 1st Ward',
}: Readonly<HeaderProps>) {
  const { formatted, iso }: CurrentDateInfo = await getCurrentDateInfo();

  return (
    <header className="border-b border-border bg-primary text-primary-foreground shadow-sm print:hidden">
      {/* Top Church Identifier Bar */}
      <div className="border-b border-white/15 bg-black/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs tracking-church uppercase text-slate-200 sm:px-6">
          <span className="font-editorial font-semibold">
            The Church of Jesus Christ of Latter-day Saints
          </span>
          <time dateTime={iso} className="hidden sm:inline text-slate-300">
            {formatted}
          </time>
        </div>
      </div>

      {/* Main Ward Navigation Bar */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3.5">
          <Link href="/" className="shrink-0">
            <Image
              src="/church-symbol.png"
              alt="Symbol of The Church of Jesus Christ of Latter-day Saints showing the resurrected Christus beneath an arch"
              width={40}
              height={56}
              className="h-12 w-auto rounded-sm shadow-sm"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href="/"
              className="font-editorial text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity sm:text-2xl"
            >
              {wardName}
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200 mt-0.5">
              <span>Sacrament Meeting Planner &amp; Weekly Bulletin</span>
              <span aria-hidden="true" className="sm:hidden">
                •
              </span>
              <time dateTime={iso} className="sm:hidden">
                {formatted}
              </time>
            </div>
          </div>
        </div>

        <NavLinks />
      </div>
    </header>
  );
}
