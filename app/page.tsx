import Image from 'next/image';
import Link from 'next/link';
import MeetingCard from '@/components/MeetingCard';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

export default function HomePage() {
  const allMeetings: SacramentMeeting[] = getMeetings();
  const featuredMeetings: SacramentMeeting[] = allMeetings.slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 sm:px-6 sm:py-12">
      {/* Editorial Hero Banner inspired by churchofjesuschrist.org */}
      <section
        aria-labelledby="hero-heading"
        className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
      >
        <div className="grid grid-cols-1 items-center lg:grid-cols-12">
          <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <p className="font-editorial text-xs font-bold uppercase tracking-church text-accent">
              Sabbath Day Worship • Pioneer 1st Ward
            </p>
            <h1
              id="hero-heading"
              className="mt-3 text-3xl font-bold leading-tight text-foreground sm:text-4xl"
            >
              “Look unto Me in Every Thought; Doubt Not, Fear Not”
            </h1>
            <p className="mt-4 text-base text-muted">
              Welcome to the Pioneer 1st Ward Sacrament Meeting Planner. Prepare
              and review Sunday worship agendas, hymns, prayers, ward business,
              and gospel messages centered on the Savior Jesus Christ.
            </p>
            <blockquote className="mt-4 border-l-2 border-accent pl-4 font-editorial text-sm italic text-foreground">
              “Thou shalt go to the house of prayer and offer up thy sacraments
              upon my holy day.” — Doctrine &amp; Covenants 59:9
            </blockquote>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/meetings/current"
                className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
              >
                This Sunday’s Program
              </Link>
              <Link
                href="/meetings"
                className="inline-flex items-center rounded-md border border-border bg-surface-muted px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-border/40 transition-colors"
              >
                Browse All Meetings ({allMeetings.length})
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-primary p-8 sm:p-12 lg:col-span-5 lg:h-full">
            <div className="rounded-lg border border-white/20 bg-black/25 p-6 shadow-md">
              <Image
                src="/church-symbol.png"
                alt="Symbol of The Church of Jesus Christ of Latter-day Saints featuring the resurrected Jesus Christ beneath an arch"
                width={180}
                height={254}
                priority
                className="mx-auto h-48 w-auto object-contain sm:h-56"
              />
            </div>
            <p className="mt-4 text-center font-editorial text-xs uppercase tracking-church text-slate-200">
              Jesus Christ Is the Center of Our Worship
            </p>
          </div>
        </div>
      </section>

      {/* Worship Pillars Section with Meaningful Imagery */}
      <section aria-labelledby="pillars-heading" className="space-y-6">
        <div className="text-center">
          <p className="font-editorial text-xs font-semibold uppercase tracking-church text-accent">
            Sacred Order of Worship
          </p>
          <h2
            id="pillars-heading"
            className="mt-1 text-2xl font-bold text-foreground"
          >
            Centered on the Savior &amp; Sacred Ordinances
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm sm:flex-row">
            <Image
              src="/sacrament-emblem.svg"
              alt="Emblem depicting a sacrament tray and bread in remembrance of Jesus Christ"
              width={200}
              height={160}
              className="h-44 w-full object-cover sm:h-auto sm:w-48"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground">
                The Ordinance of the Sacrament
              </h3>
              <p className="mt-1.5 text-sm text-muted">
                Each Sunday service centers on partaking of the sacrament in
                remembrance of the atoning sacrifice of Jesus Christ and
                renewing sacred covenants.
              </p>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm sm:flex-row">
            <Image
              src="/hymnal-emblem.svg"
              alt="Illustration of an open Latter-day Saint hymnal with musical notes"
              width={200}
              height={160}
              className="h-44 w-full object-cover sm:h-auto sm:w-48"
            />
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground">
                Sacred Music &amp; Gospel Messages
              </h3>
              <p className="mt-1.5 text-sm text-muted">
                Congregational hymns, choir selections, and speaker topics invite
                the Spirit of the Lord and edify the ward family each week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Upcoming Meetings */}
      <section aria-labelledby="featured-meetings-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-border pb-3">
          <div>
            <p className="font-editorial text-xs font-semibold uppercase tracking-church text-accent">
              Weekly Programs
            </p>
            <h2
              id="featured-meetings-heading"
              className="text-2xl font-bold text-foreground"
            >
              Featured Sunday Agendas
            </h2>
          </div>
          <Link
            href="/meetings"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View Complete Directory ({allMeetings.length}) &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featuredMeetings.map((meeting: SacramentMeeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </section>
    </div>
  );
}
