'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authenticate, type LoginState } from '@/lib/actions';

const inputClass =
  'mt-1 block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-[invalid=true]:border-red-700';

const initialState: LoginState = { message: null, errors: {}, email: '' };

// Contenedor de errores: siempre presente para que aria-live funcione
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error) => (
        <p key={error} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      ))}
    </div>
  );
}

export default function LoginForm() {
  // El proxy agrega ?callbackUrl=... cuando manda aquí desde una ruta protegida
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/meetings';

  const [state, formAction, isPending] = useActionState(authenticate, initialState);

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          aria-required
          aria-invalid={state.errors.email ? true : undefined}
          aria-describedby="email-error"
          className={inputClass}
        />
        <FieldError id="email-error" errors={state.errors.email} />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-required
          aria-invalid={state.errors.password ? true : undefined}
          aria-describedby="password-error"
          className={inputClass}
        />
        <FieldError id="password-error" errors={state.errors.password} />
      </div>

      {/* Mensaje general (por ejemplo, credenciales incorrectas) */}
      <div aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {state.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
