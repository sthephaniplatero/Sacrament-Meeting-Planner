import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Leader Sign In — Sacrament Meeting Planner',
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <section
        aria-labelledby="login-heading"
        className="rounded-lg border border-border bg-surface p-6 shadow-sm"
      >
        <h1 id="login-heading" className="text-2xl font-bold text-foreground">
          Leader Sign In
        </h1>
        <p className="mt-1 text-sm text-muted">
          For bishopric members who manage the sacrament meeting schedule.
        </p>

        <div className="mt-6">
          {/* useSearchParams (callbackUrl) es dato de runtime: va dentro de Suspense */}
          <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
