'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import theme from '@/app/lib/theme/theme';

import ToastMessage from '../shared/ToastMessage';

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
      <ToastMessage />
    </ThemeProvider>
  );
}
