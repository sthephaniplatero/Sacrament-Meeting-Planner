import { Suspense } from 'react';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import { MeetingSearch } from '@/components/MeetingSearch';
import { Pagination } from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';
import MeetingsLoading from './loading';

type MeetingsSearchParams = {
  query?: string;
  page?: string;
  date?: string;
};

export interface MeetingsPageProps {
  readonly searchParams?: Promise<MeetingsSearchParams>;
}

interface Filters {
  readonly query: string;
  readonly currentPage: number;
  readonly dateFilter: string | undefined;
  readonly hasFilters: boolean;
}

function parseFilters(searchParams: MeetingsSearchParams | undefined): Filters {
  const query: string = searchParams?.query?.trim() ?? '';
  const currentPage: number = Number(searchParams?.page) || 1;
  const dateFilter: string | undefined = searchParams?.date?.trim()
    ? searchParams.date.trim()
    : undefined;
  return {
    query,
    currentPage,
    dateFilter,
    hasFilters: Boolean(query || dateFilter),
  };
}

// Solo lee la URL (no la base de datos), así que aparece casi de inmediato.
async function DateFilterForm({
  searchParams,
}: Readonly<MeetingsPageProps>) {
  const { query, dateFilter, hasFilters } = parseFilters(await searchParams);

  return (
    <form
      method="GET"
      action="/meetings"
      className="flex flex-wrap items-end gap-2"
    >
      {query && <input type="hidden" name="query" value={query} />}
      <div>
        <label
          htmlFor="date-filter"
          className="block text-xs font-medium text-foreground"
        >
          Filter by Sunday Date
        </label>
        <input
          id="date-filter"
          name="date"
          type="date"
          defaultValue={dateFilter ?? ''}
          className="mt-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
      >
        Filter
      </button>
      {hasFilters && (
        <Link
          href="/meetings"
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
        >
          Clear
        </Link>
      )}
    </form>
  );
}

async function MeetingsListContent({
  searchParams,
}: Readonly<MeetingsPageProps>) {
  const { query, currentPage, dateFilter, hasFilters } = parseFilters(
    await searchParams
  );

  const [meetings, totalPages]: [SacramentMeeting[], number] =
    await Promise.all([
      getMeetings({ query, date: dateFilter, page: currentPage }),
      getMeetingsTotalPages(query, dateFilter),
    ]);

  return (
    <>
      <MeetingSearch />

      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {meetings.map((meeting: SacramentMeeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No Sacrament Meetings Found
          </h2>
          <p className="mt-1 text-sm text-muted">
            {query
              ? `No meetings match “${query}”${dateFilter ? ` on ${dateFilter}` : ''}.`
              : dateFilter
                ? `No meeting is scheduled for ${dateFilter}.`
                : 'There are currently no meetings in the schedule.'}
          </p>
          {hasFilters && (
            <Link
              href="/meetings"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Show All Meetings
            </Link>
          )}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </>
  );
}

// El título y la descripción quedan fuera de <Suspense> para que formen parte
// del HTML estático y se pinten sin esperar la consulta a la base de datos (LCP).
export default function MeetingsPage(props: Readonly<MeetingsPageProps>) {
  return (
    <section aria-labelledby="meetings-page-heading" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            id="meetings-page-heading"
            className="text-2xl font-bold text-foreground sm:text-3xl"
          >
            Sacrament Meetings
          </h1>
          <p className="mt-1 text-sm text-muted">
            Select a Sunday meeting below to view its full agenda or open a
            print-ready program.
          </p>
        </div>

        <Suspense fallback={null}>
          <DateFilterForm searchParams={props.searchParams} />
        </Suspense>
      </div>

      <Suspense fallback={<MeetingsLoading />}>
        <MeetingsListContent searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
