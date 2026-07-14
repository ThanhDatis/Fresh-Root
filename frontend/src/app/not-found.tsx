'use client';

import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useRouter } from 'next/dist/client/components/navigation';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import { gray } from '@/constants/colors';

export default function NotFound() {
  const router = useRouter();
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
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Box
          sx={{
            position: 'relative',
            width: { xs: 200, sm: 300 },
            height: { xs: 200, sm: 300 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: { xs: 120, sm: 160 },
              fontWeight: 700,
              lineHeight: 1,
              color: gray[500],
              opacity: 0.35,
              userSelect: 'none',
            }}
          >
            404
          </Typography>
          <SearchOffRoundedIcon
            sx={{
              position: 'absolute',
              fontSize: { xs: 120, sm: 160 },
              color: gray[500],
            }}
          />
        </Box>

        <Stack spacing={1}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
            }}
          >
            Not Found Page
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: gray[600],
            }}
          >
            The page you are looking for does not exist.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button variant="outlined" component={Link} href="/">
            Back to Home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
