import type { NextAuthConfig } from 'next-auth';

// Rutas de administración del obispado (grupo (admin))
function isProtectedPath(pathname: string): boolean {
  return pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit\/?$/.test(pathname);
}

export const authConfig = {
  pages: {
    signIn: '/login', // a dónde manda Auth.js a quien no tiene sesión
  },
  callbacks: {
    // Se ejecuta en proxy.ts en cada petición que coincide con el matcher
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);

      if (isProtectedPath(nextUrl.pathname)) {
        return isLoggedIn; // false → redirige a /login?callbackUrl=...
      }

      // Si ya inició sesión, no tiene sentido mostrarle /login
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // se agregan en auth.ts
} satisfies NextAuthConfig;
