import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// En Next 16, "middleware" se llama "proxy".
// Next exige un export llamado "proxy" (no sirve desestructurarlo).
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ['/meetings/new', '/meetings/:id/edit', '/login'],
};
