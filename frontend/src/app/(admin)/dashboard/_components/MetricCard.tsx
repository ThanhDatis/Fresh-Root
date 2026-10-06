import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

import Card from '@/components/ui/Card';
import type { TrendDirection } from '@/types/dashboard.types';

interface MetricCardProps {
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string;
  changePercent: number;
  trend: TrendDirection;
}

export default function MetricCard({
  icon,
  iconBgColor,
  iconColor,
  label,
  value,
  changePercent,
  trend,
}: MetricCardProps) {
  const isUp = trend === 'up';

  return (
    <Card>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: iconBgColor,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Stack
          direction="row"
          spacing={0.25}
          sx={{
            alignItems: 'center',
            px: 1,
            py: 0.25,
            borderRadius: 999,
            bgcolor: isUp ? 'success.light' : 'error.light',
            color: isUp ? 'success.dark' : 'error.dark',
          }}
        >
          {isUp ? (
            <ArrowUpwardIcon sx={{ fontSize: 14 }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: 14 }} />
          )}
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {changePercent}%
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
        {value}
      </Typography>
    </Card>
  );
}
