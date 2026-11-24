import Link from 'next/link';
import { connection } from 'next/server';
import { auth } from '@/auth';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';

// Edit/Delete solo para el obispado con sesión iniciada.
// Lee la sesión (dato de runtime): siempre se usa dentro de <Suspense>.
export default async function MeetingAdminActions({
  id,
  label,
}: {
  id: number;
  label: string;
}) {
  // Marca este componente como "por petición" antes de que auth() use crypto
  await connection();
  const session = await auth();
  if (!session?.user) return null;

  return (
    <>
      <Link
        href={`/meetings/${id}/edit`}
        className="font-semibold text-primary hover:underline"
      >
        Edit<span className="sr-only"> meeting on {label}</span>
      </Link>
      <DeleteMeetingButton id={id} label={label} />
    </>
  );
}
