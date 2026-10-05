import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE_KEY } from '@/constants/auth';
import { ROUTES } from '@/constants/routes';
import { decodeJwtPayload } from '@/utils/jwt';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_KEY)?.value;

  if (!token) {
    redirect(ROUTES.LOGIN);
  }

  const payload = decodeJwtPayload<{ role: 'admin' | 'cashier' }>(token);
  if (payload?.role === 'admin') {
    redirect(ROUTES.DASHBOARD);
  }

  redirect(ROUTES.SALE);
}
