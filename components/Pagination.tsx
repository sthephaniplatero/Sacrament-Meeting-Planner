'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // Si no hay resultados, no mostramos la paginación
  if (totalPages === 0) return null;

  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams); // conserva ?query=
    params.set('page', String(page));
    return `${pathname}?${params.toString()}`;
  }

  const linkClasses =
    'rounded-md border border-blue-700 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700';
  const disabledClasses =
    'cursor-not-allowed rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-500';

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex items-center justify-between gap-4"
    >
      {currentPage > 1 ? (
        <Link href={createPageURL(currentPage - 1)} className={linkClasses}>
          ← Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClasses}>
          ← Previous
        </span>
      )}

      <span className="text-sm font-semibold text-gray-900">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={createPageURL(currentPage + 1)} className={linkClasses}>
          Next →
        </Link>
      ) : (
        <span aria-disabled="true" className={disabledClasses}>
          Next →
        </span>
      )}
    </nav>
  );
}