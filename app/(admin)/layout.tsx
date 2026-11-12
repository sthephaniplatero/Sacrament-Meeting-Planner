import Link from 'next/link';

// TODO Week 05: proteger esta sección con autenticación
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <header className="mb-6 border-b border-gray-300 pb-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Leader tools
        </p>
        <nav aria-label="Admin navigation" className="mt-2">
          <ul className="flex gap-4 text-sm font-medium">
            <li>
              <Link href="/meetings" className="text-blue-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">
                Back to meetings
              </Link>
            </li>
            <li>
              <Link href="/meetings/new" className="text-blue-700 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">
                New meeting
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {children}
    </div>
  );
}
