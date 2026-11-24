import Link from 'next/link';
import { connection } from 'next/server';
import { auth } from '@/auth';

// Botón para crear una reunión: solo para el obispado con sesión iniciada.
// Lee la sesión (dato de runtime): siempre se usa dentro de <Suspense>.
export default async function NewMeetingButton() {
  await connection();
  const session = await auth();
  if (!session?.user) return null;

  return (
    <Link
      href="/meetings/new"
      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span aria-hidden="true">+</span> New meeting
    </Link>
  );
}
