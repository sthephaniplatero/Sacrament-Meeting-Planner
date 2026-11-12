import { Suspense } from 'react';

// cacheComponents está activo: `params` es dato de runtime, así que se lee
// dentro de <Suspense> para que la ruta pueda prerenderizarse.
async function EditMeetingContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section>
      <h1 className="text-2xl font-bold">Edit Meeting #{id} — Coming in Week 04</h1>
      <p className="mt-2 text-gray-700">
        The form to edit this meeting will be added here.
      </p>
    </section>
  );
}

export default function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-gray-700">Loading…</p>}>
      <EditMeetingContent params={params} />
    </Suspense>
  );
}
