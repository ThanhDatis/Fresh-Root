'use client';

import { Box, SvgIconProps, Typography } from '@mui/material';
import { cloneElement, ReactElement, ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactElement<SvgIconProps>;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: 'compact' | 'default';
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'default',
}: EmptyStateProps) {
  const isCompact = size === 'compact';

  return (
    <Box
      sx={{
        textAlign: 'center',
        py: isCompact ? 2 : 4,
        px: 2,
      }}
    >
      {icon &&
        cloneElement(icon, {
          sx: {
            fontSize: isCompact ? 40 : 60,
            color: 'text.disabled',
            mb: 2,
          },
        })}
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ mt: 1, maxWidth: 400, mx: 'auto' }}
      >
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
