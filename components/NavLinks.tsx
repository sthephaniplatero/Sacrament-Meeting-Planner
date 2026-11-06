'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly exact?: boolean;
}

export interface NavLinksProps {
  readonly items?: NavItem[];
  readonly variant?: 'header' | 'section';
  readonly ariaLabel?: string;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', exact: true },
  { label: 'All Meetings', href: '/meetings', exact: false },
  { label: 'Current Sunday', href: '/meetings/current', exact: true },
];

function NavLinksActive({
  items,
  variant,
  ariaLabel,
}: Readonly<Required<NavLinksProps>>) {
  const pathname: string = usePathname();

  const isActive = (item: NavItem): boolean => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-1 sm:gap-2"
    >
      {items.map((item: NavItem) => {
        const active: boolean = isActive(item);

        const styles: string =
          variant === 'header'
            ? active
              ? 'bg-white/15 text-white shadow-sm ring-1 ring-white/25'
              : 'text-slate-200 hover:bg-white/10 hover:text-white'
            : active
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'bg-surface text-foreground ring-1 ring-border hover:bg-surface-muted';

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${styles}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function NavLinksFallback({
  items,
  variant,
  ariaLabel,
}: Readonly<Required<NavLinksProps>>) {
  const styles: string =
    variant === 'header'
      ? 'text-slate-200 hover:bg-white/10 hover:text-white'
      : 'bg-surface text-foreground ring-1 ring-border hover:bg-surface-muted';

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap items-center gap-1 sm:gap-2"
    >
      {items.map((item: NavItem) => (
        <Link
          key={item.href}
          href={item.href}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${styles}`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default function NavLinks({
  items = DEFAULT_NAV_ITEMS,
  variant = 'header',
  ariaLabel = 'Main navigation',
}: Readonly<NavLinksProps>) {
  return (
    <Suspense
      fallback={
        <NavLinksFallback
          items={items}
          variant={variant}
          ariaLabel={ariaLabel}
        />
      }
    >
      <NavLinksActive items={items} variant={variant} ariaLabel={ariaLabel} />
    </Suspense>
  );
}
