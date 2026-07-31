import Cookies from 'js-cookie';

import { AUTH_COOKIE_KEY, AUTH_TOKEN_EXPIRY_DAYS } from '@/constants/auth';

export function setAuthCookie(token: string): void {
  Cookies.set(AUTH_COOKIE_KEY, token, {
    expires: AUTH_TOKEN_EXPIRY_DAYS,
    sameSite: 'lax',
    path: '/',
  });
}

export function getAuthCookie(): string | undefined {
  return Cookies.get(AUTH_COOKIE_KEY);
}

export function removeAuthCookie(): void {
  Cookies.remove(AUTH_COOKIE_KEY, { path: '/' });
}
