'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { sage } from '@/constants/colors';
import { ROUTES } from '@/constants/routes';
import { registerSchema, type RegisterFormValues } from '@/lib/validators/auth';

import GoogleOAuthButton from './GoogleOAuthButton';

interface RegisterFormProps {
  loading?: boolean;
  onSubmit: (values: RegisterFormValues) => void;
}

export default function RegisterForm({
  loading = false,
  onSubmit,
}: RegisterFormProps) {
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}
      >
        Sign up
      </Typography>

      <Stack spacing={2.5}>
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Full Name"
              isError={!!fieldState.error}
              errorText={fieldState.error?.message}
            />
          )}
        />

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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Confirm Password"
              typeInput="password"
              isError={!!fieldState.error}
              errorText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="agreeTerms"
          control={control}
          render={({ field, fieldState }) => (
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the Terms of Service and Privacy Policy
                  </Typography>
                }
              />
              {fieldState.error && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ display: 'block' }}
                >
                  {fieldState.error.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Button type="submit" variant="contained" fullWidth loading={loading}>
          Sign up
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }}>or</Divider>

      <GoogleOAuthButton />

      <Typography
        variant="body2"
        sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}
      >
        Already have an account?{' '}
        <Link
          component={NextLink}
          href={ROUTES.LOGIN}
          underline="hover"
          sx={{
            fontWeight: 600,
            color: sage[700],
            transition: 'color 0.2s ease',
            '&:hover': { color: sage[900] },
          }}
        >
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
