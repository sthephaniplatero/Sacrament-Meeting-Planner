import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';
import MeetingsLoading from '../loading';

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
  const matchingMeetings: SacramentMeeting[] = getMeetings(sundayIso);

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
