'use client';

import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import type { ReactNode } from 'react';

import { gray } from '@/constants/colors';

interface AuthLayoutProps {
  children: ReactNode;
  imagePosition?: 'left' | 'right';
}

export default function AuthLayout({
  children,
  imagePosition = 'left',
}: AuthLayoutProps) {
  const slideDirection = imagePosition === 'right' ? 'right' : 'left';

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          backgroundColor: gray[50],
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
        }}
      >
        <Slide direction={slideDirection} in timeout={500}>
          <Box sx={{ width: '100%', maxWidth: 420 }}>{children}</Box>
        </Slide>
      </Box>
    </Box>
  );
}
