import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';
import MeetingsLoading from '../loading';
import type { Metadata } from 'next';
import { defaultOgImage } from '@/lib/site-metadata';

export const metadata: Metadata = {
  title: 'This Sunday’s Program',
  description:
    'The sacrament meeting program for this Sunday in the Pioneer 1st Ward: hymns, prayers, speakers, and ward business.',
  openGraph: {
    title: 'This Sunday’s Program | Pioneer 1st Ward',
    description: 'Hymns, prayers, and speakers for this Sunday’s sacrament meeting.',
    url: '/meetings/current',
    images: [defaultOgImage],
  },
};

function formatIsoDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const day: string = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function CurrentSundayRedirect(): Promise<never> {
  await connection();

  const today: Date = new Date();
  const dayOfWeek: number = today.getDay();
  const sunday: Date = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);

  const sundayIso: string = formatIsoDate(sunday);
  const matchingMeetings: SacramentMeeting[] = await getMeetings({
    date: sundayIso,
  });

  if (matchingMeetings.length > 0) {
    redirect(`/meetings/${matchingMeetings[0].id}`);
  }

  redirect('/meetings');
}

export default function CurrentMeetingPage() {
  return (
    <Suspense fallback={<MeetingsLoading />}>
      <CurrentSundayRedirect />
    </Suspense>
  );
}
