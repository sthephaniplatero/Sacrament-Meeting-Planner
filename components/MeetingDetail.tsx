import Image from 'next/image';
import type {
  Hymn,
  MeetingType,
  SacramentMeeting,
  SpeakerItem,
  WardBusinessItem,
} from '@/lib/types';

export interface MeetingDetailProps {
  readonly meeting: SacramentMeeting;
  readonly wardName?: string;
  readonly printMode?: boolean;
}

const MEETING_TYPE_TITLES: Record<MeetingType, string> = {
  regular: 'Sacrament Meeting Order of Service',
  testimony: 'Fast & Testimony Sacrament Meeting',
  stake: 'Stake Conference Session',
  general: 'General Conference Broadcast',
};

function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

interface AgendaRowProps {
  readonly label: string;
  readonly value: string;
  readonly subvalue?: string;
}

function AgendaRow({ label, value, subvalue }: Readonly<AgendaRowProps>) {
  return (
    <div className="flex flex-col justify-between gap-1 border-b border-dotted border-border py-3 sm:flex-row sm:items-baseline">
      <dt className="text-sm font-medium text-muted">{label}</dt>
      <dd className="text-left sm:text-right">
        <span className="font-semibold text-foreground">{value}</span>
        {subvalue && (
          <span className="block text-xs italic text-muted">{subvalue}</span>
        )}
      </dd>
    </div>
  );
}

function formatHymn(hymn: Hymn): string {
  return `Hymn #${hymn.number} — "${hymn.title}"`;
}

export default function MeetingDetail({
  meeting,
  wardName = 'Pioneer 1st Ward',
  printMode = false,
}: Readonly<MeetingDetailProps>) {
  return (
    <article
      className={`mx-auto max-w-3xl overflow-hidden rounded-lg border border-border bg-surface ${
        printMode ? 'shadow-none border-black/30' : 'shadow-sm'
      } print:border-0 print:p-0 print:shadow-none`}
    >
      {/* Decorative Church Top Border */}
      <div className="church-accent-bar h-2 w-full print:hidden" />

      <div className="p-6 sm:p-10 print:p-0">
        {/* Program Header */}
        <header className="border-b-2 border-primary pb-6 text-center print:border-black">
          <div className="mb-3 flex justify-center">
            <Image
              src="/church-symbol.png"
              alt="Symbol of The Church of Jesus Christ of Latter-day Saints"
              width={48}
              height={68}
              className="h-14 w-auto"
            />
          </div>
          <p className="font-editorial text-xs font-semibold uppercase tracking-church text-accent print:text-black">
            The Church of Jesus Christ of Latter-day Saints
          </p>
          <h1 className="mt-1.5 text-2xl font-bold text-foreground sm:text-3xl">
            {wardName}
          </h1>
          <p className="mt-1 text-base font-semibold text-primary print:text-black">
            {MEETING_TYPE_TITLES[meeting.meetingType]}
          </p>
          <time
            dateTime={meeting.date}
            className="mt-2 block text-sm font-medium text-muted print:text-black"
          >
            {formatLongDate(meeting.date)}
          </time>
        </header>

        {/* Presiding & Conducting */}
        <section aria-label="Meeting Leadership" className="mt-6">
          <dl>
            <AgendaRow label="Presiding" value={meeting.presiding} />
            <AgendaRow label="Conducting" value={meeting.conducting} />
          </dl>
        </section>

        {/* Announcements */}
        {meeting.announcements && meeting.announcements.length > 0 && (
          <section
            aria-labelledby="announcements-heading"
            className="mt-6 rounded-md border border-border bg-accent-light/70 p-4 print:bg-transparent"
          >
            <h2
              id="announcements-heading"
              className="text-xs font-bold uppercase tracking-wider text-accent print:text-black"
            >
              Ward Announcements
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
              {meeting.announcements.map((announcement: string) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Opening Exercises */}
        <section aria-labelledby="opening-heading" className="mt-6">
          <h2
            id="opening-heading"
            className="text-xs font-bold uppercase tracking-wider text-primary print:text-black"
          >
            Opening Exercises
          </h2>
          <dl className="mt-2">
            <AgendaRow
              label="Opening Hymn"
              value={formatHymn(meeting.openingHymn)}
            />
            <AgendaRow
              label="Invocation (Opening Prayer)"
              value={meeting.openingPrayer}
            />
          </dl>
        </section>

        {/* Ward & Stake Business */}
        <section aria-labelledby="business-heading" className="mt-6">
          <h2
            id="business-heading"
            className="text-xs font-bold uppercase tracking-wider text-primary print:text-black"
          >
            Ward &amp; Stake Business
          </h2>
          <div className="mt-2 rounded-md border border-border/70 bg-surface-muted/60 p-4 text-sm print:border print:border-border print:bg-transparent">
            {meeting.stakeBusiness && (
              <p className="mb-2 font-semibold text-accent print:text-black">
                • Stake Business Included
              </p>
            )}
            {meeting.wardBusiness.length > 0 ? (
              <ul className="list-disc space-y-1 pl-5 text-foreground">
                {meeting.wardBusiness.map((item: WardBusinessItem) => (
                  <li key={item.description}>{item.description}</li>
                ))}
              </ul>
            ) : (
              <p className="italic text-muted">
                No scheduled ward business items.
              </p>
            )}
          </div>
        </section>

        {/* Sacrament Ordinance */}
        <section aria-labelledby="sacrament-heading" className="mt-6">
          <h2
            id="sacrament-heading"
            className="text-xs font-bold uppercase tracking-wider text-primary print:text-black"
          >
            Ordinance of the Sacrament
          </h2>
          <dl className="mt-2">
            <AgendaRow
              label="Sacrament Hymn"
              value={formatHymn(meeting.sacramentHymn)}
            />
          </dl>
          <p className="mt-2.5 text-center font-editorial text-xs italic text-muted">
            Administration of the Sacrament by the Priesthood
          </p>
        </section>

        {/* Program: Speakers & Musical Numbers */}
        <section aria-labelledby="program-heading" className="mt-6">
          <h2
            id="program-heading"
            className="text-xs font-bold uppercase tracking-wider text-primary print:text-black"
          >
            Gospel Messages &amp; Music
          </h2>

          {meeting.speakers.length > 0 ? (
            <dl className="mt-2">
              {meeting.speakers.map((item: SpeakerItem) => {
                const isMusical: boolean = item.type === 'musical-number';
                return (
                  <AgendaRow
                    key={`${item.type}-${item.name}-${item.topic}`}
                    label={isMusical ? 'Musical Number' : 'Speaker'}
                    value={item.name}
                    subvalue={
                      item.topic
                        ? isMusical
                          ? `Selection: "${item.topic}"`
                          : `Topic: ${item.topic}`
                        : undefined
                    }
                  />
                );
              })}
            </dl>
          ) : (
            <div className="mt-2 rounded-md border border-border/70 bg-surface-muted/60 p-4 text-center text-sm italic text-muted print:border print:border-border print:bg-transparent">
              {meeting.meetingType === 'testimony'
                ? 'Bearing of testimonies by members of the congregation.'
                : meeting.meetingType === 'general'
                ? 'Messages by General Authorities and General Officers of the Church.'
                : 'No individual speakers listed for this session.'}
            </div>
          )}
        </section>

        {/* Closing Exercises */}
        <section aria-labelledby="closing-heading" className="mt-6">
          <h2
            id="closing-heading"
            className="text-xs font-bold uppercase tracking-wider text-primary print:text-black"
          >
            Closing Exercises
          </h2>
          <dl className="mt-2">
            <AgendaRow
              label="Closing Hymn"
              value={formatHymn(meeting.closingHymn)}
            />
            <AgendaRow
              label="Benediction (Closing Prayer)"
              value={meeting.closingPrayer}
            />
          </dl>
        </section>
      </div>
    </article>
  );
}
