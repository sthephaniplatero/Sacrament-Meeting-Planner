import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { getMeetingById } from '@/lib/meetings-db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Meeting',
  description: 'Update a sacrament meeting agenda.',
};

// cacheComponents está activo: `params` es dato de runtime, así que se lee
// dentro de <Suspense> para que la ruta pueda prerenderizarse.
async function EditMeetingContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingId = Number(id);

  // "abc", "-1", "1.5" o un número gigante → 404 (y no un error de SQL)
  if (!Number.isInteger(meetingId) || meetingId <= 0 || meetingId > 2147483647) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);
  if (!meeting) {
    notFound();
  }

  // El id va "pegado" a la action; el form solo envía los campos
  const updateMeetingWithId = updateMeeting.bind(null, meeting.id);

  return (
    <MeetingForm
      action={updateMeetingWithId}
      meeting={meeting}
      submitLabel="Save Changes"
    />
  );
}

export default function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <section aria-labelledby="edit-meeting-heading" className="space-y-6">
      <div>
        <h1 id="edit-meeting-heading" className="text-2xl font-bold text-foreground">
          Edit Meeting
        </h1>
        <p className="mt-1 text-sm text-muted">
          Update the agenda and save your changes.
        </p>
      </div>
      <Suspense fallback={<p className="text-muted">Loading meeting…</p>}>
        <EditMeetingContent params={params} />
      </Suspense>
    </section>
  );
}
