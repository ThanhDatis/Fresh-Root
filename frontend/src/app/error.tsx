'use client';

import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useEffect } from 'react';

import EmptyState from '@/components/shared/EmptyState';
import Button from '@/components/ui/Button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // TODO: thay bằng error reporting service (Sentry, LogRocket,...) khi có
    console.error(error);
  }, [error]);

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <EmptyState
        icon={<ErrorOutlineRoundedIcon fontSize="inherit" />}
        size="default"
        title="An error occurred"
        description={
          isDev
            ? error.message || 'Unknown error'
            : 'Sorry, an error occurred. Please try again later.'
        }
        action={
          <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
            <Button variant="outlined" onClick={() => reset()}>
              Try again
            </Button>
            <Button component={Link} href="/" variant="contained">
              Back to Home
            </Button>
          </Stack>
        }
      />
    </Box>
  );
}
