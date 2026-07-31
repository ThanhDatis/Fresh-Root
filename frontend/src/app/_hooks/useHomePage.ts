'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { logoutApi } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';

export function useHomePage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutApi();
    } catch {
      // Bỏ qua lỗi gọi API — vẫn xoá state/cookie phía client bên dưới
    } finally {
      logout();
      setLoading(false);
      router.push('/login');
    }
  };

  return { loading, handleLogout };
}
