'use client';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

import { useLoginPage } from './_hooks/useLoginPage';

export default function LoginPage() {
  const { loading, handleSubmit } = useLoginPage();

  return (
    <AuthLayout>
      <LoginForm loading={loading} onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
