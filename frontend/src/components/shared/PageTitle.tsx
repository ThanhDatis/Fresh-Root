'use client';

import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  count?: number;
  countLabel?: string;
  action?: ReactNode;
}

export default function PageTitle({
  title,
  description,
  count,
  countLabel = 'results',
  action,
}: PageTitleProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{
        mb: 3,
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
      }}
    >
      <Box>
        <Stack direction="row" sx={{ alignContent: 'center' }} spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {count !== undefined && (
            <Typography variant="body2" color="text.secondary">
              ({count} {countLabel})
            </Typography>
          )}
        </Stack>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Stack>
  );
}
