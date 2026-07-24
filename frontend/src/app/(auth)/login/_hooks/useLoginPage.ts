'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { LoginFormValues } from '@/lib/validators/auth';
import { loginApi } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { ApiResponse } from '@/types/api.types';

export function useLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const showToast = useUIStore((state) => state.showToast);

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await loginApi(values);
      login(response.data.user, response.data.token);
      showToast('Đăng nhập thành công', 'success');
      router.push('/');
    } catch (error) {
      const message = axios.isAxiosError<ApiResponse<unknown>>(error)
        ? (error.response?.data?.message ?? 'Đăng nhập thất bại')
        : 'Đã có lỗi xảy ra';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
}
