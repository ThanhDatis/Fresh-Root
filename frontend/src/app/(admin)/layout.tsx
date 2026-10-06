import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import AdminShell from '@/components/layout/AdminShell';
import { AUTH_COOKIE_KEY } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { decodeJwtPayload } from '@/utils/jwt';

interface AdminRouteLayoutProps {
  children: ReactNode;
}

export default async function AdminRouteLayout({
  children,
}: AdminRouteLayoutProps) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_KEY)?.value;

  if (!token) {
    redirect(ROUTES.LOGIN);
  }

  const payload = decodeJwtPayload<{ role: 'admin' | 'cashier' }>(token);
  if (payload?.role !== 'admin') {
    redirect(ROUTES.HOME);
  }

  return <AdminShell>{children}</AdminShell>;
}
