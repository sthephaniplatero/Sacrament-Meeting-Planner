'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      role="alert"
      aria-labelledby="meetings-error-heading"
      className="mx-auto max-w-xl rounded-lg border border-red-300 bg-surface p-6 text-center shadow-sm"
    >
      <h1 id="meetings-error-heading" className="text-xl font-bold text-foreground">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-muted">
        We couldn’t complete that request for the meeting schedule. Please try
        again. If the problem continues, go back to the meetings list.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted"
        >
          Back to meetings
        </Link>
      </div>
    </section>
  );
}
