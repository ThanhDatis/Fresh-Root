'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { RegisterFormValues } from '@/lib/validators/auth';
import { registerApi } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import type { ApiResponse } from '@/types/api.types';

export function useRegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const showToast = useUIStore((state) => state.showToast);

  const handleSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const { agreeTerms: _agreeTerms, ...payload } = values;
      const response = await registerApi(payload);
      login(response.data.user, response.data.token);
      showToast('Đăng ký thành công', 'success');
      router.push('/');
    } catch (error) {
      const message = axios.isAxiosError<ApiResponse<unknown>>(error)
        ? (error.response?.data?.message ?? 'Đăng ký thất bại')
        : 'Đã có lỗi xảy ra';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
}
