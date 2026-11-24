import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Meeting',
  description: 'Create a new sacrament meeting agenda.',
};

export default function NewMeetingPage() {
  return (
    <section aria-labelledby="new-meeting-heading" className="space-y-6">
      <div>
        <h1 id="new-meeting-heading" className="text-2xl font-bold text-foreground">
          Create Meeting
        </h1>
        <p className="mt-1 text-sm text-muted">
          Fill in the agenda for a new sacrament meeting.
        </p>
      </div>
      <MeetingForm action={createMeeting} submitLabel="Create Meeting" />
    </section>
  );
}
