import type { ReactNode } from 'react';
import NavLinks, { type NavItem } from '@/components/NavLinks';

export interface MeetingsLayoutProps {
  readonly children: ReactNode;
}

const MEETINGS_SECTION_ITEMS: NavItem[] = [
  { label: 'All Meetings Archive', href: '/meetings', exact: true },
  { label: 'This Sunday’s Program', href: '/meetings/current', exact: true },
];

export default function MeetingsLayout({
  children,
}: Readonly<MeetingsLayoutProps>) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Meetings Directory
          </p>
          <p className="text-sm text-muted">
            Browse sacrament meeting programs, speakers, and printable agendas.
          </p>
        </div>
        <NavLinks
          items={MEETINGS_SECTION_ITEMS}
          variant="section"
          ariaLabel="Meetings section navigation"
        />
      </div>

      {children}
    </div>
  );
}
