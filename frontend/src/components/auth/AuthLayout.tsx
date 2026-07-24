'use client';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { sage, withAlpha } from '@/constants/colors';

interface AuthLayoutProps {
  children: ReactNode;
  imagePosition?: 'left' | 'right';
}

export default function AuthLayout({
  children,
  imagePosition = 'left',
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          position: 'relative',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${sage[500]} 0%, ${sage[900]} 100%)`,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            backgroundColor: withAlpha('#ffffff', 0.08),
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: withAlpha('#ffffff', 0.08),
          }}
        />

        <Typography
          variant="h3"
          sx={{
            position: 'relative',
            color: '#ffffff',
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          FreshRoot
        </Typography>
        <Typography
          variant="body1"
          sx={{
            position: 'relative',
            mt: 2,
            maxWidth: 320,
            color: withAlpha('#ffffff', 0.85),
            textAlign: 'center',
          }}
        >
          Rau củ quả &amp; quà tặng hữu cơ tươi sạch mỗi ngày
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Fade in timeout={500}>
          <Box sx={{ width: '100%', maxWidth: 420 }}>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
}
