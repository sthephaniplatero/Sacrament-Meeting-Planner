import { cacheLife } from 'next/cache';
import Image from 'next/image';
import Link from 'next/link';

export interface FooterProps {
  readonly wardName?: string;
}

async function getCurrentYear(): Promise<number> {
  'use cache';
  cacheLife('days');

  return new Date().getFullYear();
}

export default async function Footer({
  wardName = 'Pioneer 1st Ward',
}: Readonly<FooterProps>) {
  const currentYear: number = await getCurrentYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface text-muted print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center sm:px-6">
        <Image
          src="/church-symbol.png"
          alt="Symbol of The Church of Jesus Christ of Latter-day Saints"
          width={36}
          height={50}
          className="h-11 w-auto opacity-95"
        />
        <div>
          <p className="font-editorial text-xs font-semibold uppercase tracking-church text-primary">
            The Church of Jesus Christ of Latter-day Saints
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {wardName} — Sacrament Meeting Planner
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted">
          <Link href="/" className="hover:text-primary hover:underline">
            Home
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/meetings" className="hover:text-primary hover:underline">
            All Meetings
          </Link>
          <span aria-hidden="true">•</span>
          <Link
            href="/meetings/current"
            className="hover:text-primary hover:underline"
          >
            Current Sunday Program
          </Link>
        </div>
        <p className="text-xs text-muted">
          &copy; {currentYear} {wardName}. Visitors welcome every Sunday.
        </p>
      </div>
    </footer>
  );
}
