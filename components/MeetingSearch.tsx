'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // cada búsqueda nueva vuelve a la página 1

    const value = term.trim();
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }

    // push (no replace) para que el botón "atrás" regrese a la búsqueda anterior
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="mb-6">
      <label
        htmlFor="meeting-search"
        className="mb-1 block text-sm font-medium text-gray-800"
      >
        Search meetings
      </label>
      <input
        id="meeting-search"
        type="search"
        aria-label="Search meetings"
        placeholder="Search by speaker, leader, or meeting type…"
        defaultValue={searchParams.get('query') ?? ''}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full rounded-md border border-gray-400 px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
      />
    </div>
  );
}