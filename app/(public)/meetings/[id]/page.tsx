import { Suspense } from 'react';
import { headers } from 'next/headers';
import Link from 'next/link';
import MeetingDetail from '@/components/MeetingDetail';
import { getMeetingById } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';
import MeetingsLoading from '../loading';

export interface MeetingDetailPageProps {
  readonly params: Promise<{ id: string }>;
  readonly searchParams: Promise<{ print?: string }>;
}

interface FetchMeetingResult {
  readonly status: number;
  readonly meeting: SacramentMeeting | null;
  readonly errorMessage?: string;
}

async function fetchMeetingByIdFromApi(
  id: string
): Promise<FetchMeetingResult> {
  try {
    const headerList = await headers();
    const host: string = headerList.get('host') ?? 'localhost:3000';
    const protocol: string =
      headerList.get('x-forwarded-proto') ??
      (host.startsWith('localhost') ? 'http' : 'https');

    const url = new URL(
      `/api/meetings/${encodeURIComponent(id)}`,
      `${protocol}://${host}`
    );

    const response: Response = await fetch(url.toString(), {
      cache: 'no-store',
    });

    if (response.status === 200) {
      const meeting: SacramentMeeting =
        (await response.json()) as SacramentMeeting;
      return { status: 200, meeting };
    }

    const errorBody = (await response.json()) as { error?: string };
    return {
      status: response.status,
      meeting: null,
      errorMessage: errorBody.error,
    };
  } catch {
    if (!/^\d+$/.test(id)) {
      return {
        status: 400,
        meeting: null,
        errorMessage: `Invalid meeting ID "${id}". Expected a positive integer.`,
      };
    }

    const numericId: number = Number.parseInt(id, 10);
    const meeting: SacramentMeeting | null = getMeetingById(numericId);
    if (!meeting) {
      return {
        status: 404,
        meeting: null,
        errorMessage: `No sacrament meeting found with ID ${numericId}.`,
      };
    }

    return { status: 200, meeting };
  }
}

async function MeetingDetailContent({
  params,
  searchParams,
}: Readonly<MeetingDetailPageProps>) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const isPrintMode: boolean = resolvedSearchParams.print === 'true';

  const result: FetchMeetingResult = await fetchMeetingByIdFromApi(id);

  if (result.status !== 200 || !result.meeting) {
    return (
      <section
        aria-labelledby="meeting-error-heading"
        className="mx-auto max-w-xl rounded-xl border border-border bg-surface p-8 text-center"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-accent">
          Error {result.status}
        </p>
        <h1
          id="meeting-error-heading"
          className="mt-1 text-2xl font-bold text-foreground"
        >
          {result.status === 400
            ? 'Invalid Meeting ID'
            : 'Sacrament Meeting Not Found'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {result.errorMessage ??
            'The requested sacrament meeting could not be loaded.'}
        </p>
        <div className="mt-6">
          <Link
            href="/meetings"
            className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            &larr; Back to All Meetings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          &larr; Back to All Meetings
        </Link>

        <div className="flex items-center gap-2">
          {isPrintMode ? (
            <Link
              href={`/meetings/${result.meeting.id}`}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors"
            >
              Exit Print Preview
            </Link>
          ) : (
            <Link
              href={`/meetings/${result.meeting.id}?print=true`}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Print-Friendly View
            </Link>
          )}
        </div>
      </div>

      {isPrintMode && (
        <div
          role="region"
          aria-label="Print mode instructions"
          className="mx-auto max-w-3xl rounded-lg border border-border bg-accent-light px-4 py-3 text-xs text-foreground print:hidden"
        >
          <span className="font-semibold">Print Preview Enabled:</span> Press{' '}
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
            Ctrl+P
          </kbd>{' '}
          (or{' '}
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">
            Cmd+P
          </kbd>
          ) in your browser to print or save this program as a PDF. Navigation
          bars are automatically hidden on paper.
        </div>
      )}

      <MeetingDetail meeting={result.meeting} printMode={isPrintMode} />
    </div>
  );
}

export default function MeetingDetailPage(
  props: Readonly<MeetingDetailPageProps>
) {
  return (
    <Suspense fallback={<MeetingsLoading />}>
      <MeetingDetailContent
        params={props.params}
        searchParams={props.searchParams}
      />
    </Suspense>
  );
}
