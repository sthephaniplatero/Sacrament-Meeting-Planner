import Link from 'next/link';
import type { MeetingType, SacramentMeeting, SpeakerItem } from '@/lib/types';

export interface MeetingCardProps {
  readonly meeting: SacramentMeeting;
}

const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  regular: 'Regular Service',
  testimony: 'Fast & Testimony',
  stake: 'Stake Conference',
  general: 'General Conference',
};

const MEETING_TYPE_BADGE_STYLES: Record<MeetingType, string> = {
  regular: 'bg-sky-50 text-sky-900 ring-sky-200',
  testimony: 'bg-amber-50 text-amber-900 ring-amber-200',
  stake: 'bg-indigo-50 text-indigo-900 ring-indigo-200',
  general: 'bg-emerald-50 text-emerald-900 ring-emerald-200',
};

function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export default function MeetingCard({ meeting }: Readonly<MeetingCardProps>) {
  const speakerCount: number = meeting.speakers.filter(
    (item: SpeakerItem) => item.type === 'speaker'
  ).length;
  const musicalCount: number = meeting.speakers.filter(
    (item: SpeakerItem) => item.type === 'musical-number'
  ).length;

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
      {/* Top Church Navy & Gold Accent Bar */}
      <div className="church-accent-bar h-1.5 w-full" />

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Sunday Worship Service
            </p>
            <h3 className="mt-0.5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              <time dateTime={meeting.date}>
                {formatMeetingDate(meeting.date)}
              </time>
            </h3>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
              MEETING_TYPE_BADGE_STYLES[meeting.meetingType]
            }`}
          >
            {MEETING_TYPE_LABELS[meeting.meetingType]}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-border/60 bg-surface-muted/60 px-3 py-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Presiding
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {meeting.presiding}
            </dd>
          </div>
          <div className="rounded-md border border-border/60 bg-surface-muted/60 px-3 py-2">
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
              Conducting
            </dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {meeting.conducting}
            </dd>
          </div>
        </dl>

        <div className="mt-4 space-y-1.5 border-l-2 border-primary/25 pl-3 text-sm text-muted">
          <p>
            <span className="font-semibold text-foreground">Opening Hymn:</span>{' '}
            #{meeting.openingHymn.number} —{' '}
            <span className="italic">{meeting.openingHymn.title}</span>
          </p>
          <p>
            <span className="font-semibold text-foreground">
              Sacrament Hymn:
            </span>{' '}
            #{meeting.sacramentHymn.number} —{' '}
            <span className="italic">{meeting.sacramentHymn.title}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-muted/40 px-6 py-3.5 text-xs text-muted">
        <div className="flex items-center gap-2.5 font-medium">
          <span>
            {speakerCount} {speakerCount === 1 ? 'Speaker' : 'Speakers'}
          </span>
          {musicalCount > 0 && (
            <>
              <span aria-hidden="true">•</span>
              <span>
                {musicalCount}{' '}
                {musicalCount === 1 ? 'Musical Number' : 'Musical Numbers'}
              </span>
            </>
          )}
          {meeting.stakeBusiness && (
            <>
              <span aria-hidden="true">•</span>
              <span className="font-semibold text-accent">Stake Business</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/meetings/${meeting.id}?print=true`}
            className="font-semibold text-primary hover:underline"
          >
            Print Bulletin
          </Link>
          <Link
            href={`/meetings/${meeting.id}`}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Open Agenda &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
