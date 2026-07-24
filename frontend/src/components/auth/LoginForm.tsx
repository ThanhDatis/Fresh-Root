'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { sage } from '@/constants/colors';
import { ROUTES } from '@/constants/routes';
import { loginSchema, type LoginFormValues } from '@/lib/validators/auth';

import GoogleOAuthButton from './GoogleOAuthButton';

interface LoginFormProps {
  loading?: boolean;
  onSubmit: (values: LoginFormValues) => void;
}

export default function LoginForm({
  loading = false,
  onSubmit,
}: LoginFormProps) {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
      >
        Sign in
      </Typography>

      <Stack spacing={2.5}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Email"
              typeInput="email"
              isError={!!fieldState.error}
              errorText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Password"
              typeInput="password"
              isError={!!fieldState.error}
              errorText={fieldState.error?.message}
            />
          )}
        />

        <Box sx={{ textAlign: 'right' }}>
          <Link
            href="#"
            underline="hover"
            variant="body2"
            sx={{
              transition: 'color 0.2s ease',
              '&:hover': { color: sage[800] },
            }}
          >
            Forgot your password?
          </Link>
        </Box>

        <Button type="submit" variant="contained" fullWidth loading={loading}>
          Sign in
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>or</Divider>

      <GoogleOAuthButton />

      <Typography
        variant="body2"
        sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
      >
        Don&apos;t have an account?{' '}
        <Link
          component={NextLink}
          href={ROUTES.REGISTER}
          underline="hover"
          sx={{
            fontWeight: 600,
            color: sage[700],
            transition: 'color 0.2s ease',
            '&:hover': { color: sage[900] },
          }}
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
