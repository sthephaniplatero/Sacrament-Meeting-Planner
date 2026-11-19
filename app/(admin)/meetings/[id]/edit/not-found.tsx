import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <section
      aria-labelledby="meeting-not-found-heading"
      className="mx-auto max-w-xl rounded-lg border border-border bg-surface p-6 text-center shadow-sm"
    >
      <h2 id="meeting-not-found-heading" className="text-xl font-bold text-foreground">
        Meeting not found
      </h2>
      <p className="mt-2 text-sm text-muted">
        We couldn’t find the meeting you’re trying to edit. It may have been
        deleted, or the link may be incorrect.
      </p>
      <Link
        href="/meetings"
        className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
      >
        Back to meetings
      </Link>
    </section>
  );
}
