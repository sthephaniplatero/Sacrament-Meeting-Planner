import Link from 'next/link';
import { connection } from 'next/server';
import { auth } from '@/auth';
import { signOutAction } from '@/lib/actions';

// Lee la sesión (dato de runtime): siempre se usa dentro de <Suspense>
export default async function AuthStatus() {
  // Marca este componente como "por petición" antes de que auth() use crypto
  await connection();
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-md border border-white/40 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Leader sign in
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xs text-slate-200">
        Signed in as{' '}
        <span className="font-semibold text-white">
          {session.user.name ?? session.user.email}
        </span>
      </p>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-md border border-white/40 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
