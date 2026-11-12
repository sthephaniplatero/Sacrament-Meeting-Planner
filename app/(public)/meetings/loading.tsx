export default function MeetingsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-4 py-6"
    >
      <div className="h-7 w-56 animate-pulse rounded-md bg-surface-muted" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((placeholder: number) => (
          <div
            key={placeholder}
            className="h-52 animate-pulse rounded-xl border border-border bg-surface p-5"
          >
            <div className="flex justify-between">
              <div className="h-5 w-40 rounded bg-surface-muted" />
              <div className="h-5 w-24 rounded-full bg-surface-muted" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="h-12 rounded bg-surface-muted" />
              <div className="h-12 rounded bg-surface-muted" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface-muted" />
              <div className="h-4 w-2/3 rounded bg-surface-muted" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading sacrament meetings...</span>
    </div>
  );
}
