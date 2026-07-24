import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { AUTH_COOKIE_KEY } from '@/constants/auth';

interface AuthRouteLayoutProps {
  children: ReactNode;
}

export default async function AuthRouteLayout({
  children,
}: AuthRouteLayoutProps) {
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get(AUTH_COOKIE_KEY)?.value);

  if (isAuthenticated) {
    redirect('/');
  }

  return <>{children}</>;
}
