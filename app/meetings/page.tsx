import { Suspense } from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';
import MeetingsLoading from './loading';

export interface MeetingsPageProps {
  readonly searchParams: Promise<{ date?: string }>;
}

async function fetchMeetingsFromApi(
  dateFilter?: string
): Promise<SacramentMeeting[]> {
  try {
    const headerList = await headers();
    const host: string = headerList.get('host') ?? 'localhost:3000';
    const protocol: string =
      headerList.get('x-forwarded-proto') ??
      (host.startsWith('localhost') ? 'http' : 'https');

    const url = new URL('/api/meetings', `${protocol}://${host}`);
    if (dateFilter) {
      url.searchParams.set('date', dateFilter);
    }

    const response: Response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (response.ok) {
      const data: SacramentMeeting[] =
        (await response.json()) as SacramentMeeting[];
      return data;
    }
  } catch {

  }

  return getMeetings(dateFilter ?? null);
}

async function MeetingsListContent({
  searchParams,
}: Readonly<MeetingsPageProps>) {
  const resolvedSearchParams = await searchParams;
  const dateFilter: string | undefined = resolvedSearchParams.date?.trim()
    ? resolvedSearchParams.date.trim()
    : undefined;

  const meetings: SacramentMeeting[] = await fetchMeetingsFromApi(dateFilter);

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

        <form
          method="GET"
          action="/meetings"
          className="flex flex-wrap items-end gap-2"
        >
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
          {dateFilter && (
            <Link
              href="/meetings"
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              Clear
            </Link>
          )}
        </form>
      </div>

      {meetings.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {meetings.map((meeting: SacramentMeeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            No Sacrament Meetings Found
          </h2>
          <p className="mt-1 text-sm text-muted">
            {dateFilter
              ? `No meeting is scheduled for ${dateFilter}.`
              : 'There are currently no meetings in the schedule.'}
          </p>
          {dateFilter && (
            <Link
              href="/meetings"
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Show All Meetings
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

export default function MeetingsPage(props: Readonly<MeetingsPageProps>) {
  return (
    <Suspense fallback={<MeetingsLoading />}>
      <MeetingsListContent searchParams={props.searchParams} />
    </Suspense>
  );
}
