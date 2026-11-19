'use client';

import { useFormStatus } from 'react-dom';
import { deleteMeeting } from '@/lib/actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-red-300 bg-surface px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
      <span className="sr-only"> meeting on {label}</span>
    </button>
  );
}

export default function DeleteMeetingButton({ id, label }: { id: number; label: string }) {
  return (
    <form
      action={deleteMeeting}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting on ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton label={label} />
    </form>
  );
}
