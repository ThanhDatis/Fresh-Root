'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';

import { useRegisterPage } from './_hooks/useRegisterPage';

export default function RegisterPage() {
  const { loading, handleSubmit } = useRegisterPage();

  return (
    <AuthLayout imagePosition="right">
      <RegisterForm loading={loading} onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
