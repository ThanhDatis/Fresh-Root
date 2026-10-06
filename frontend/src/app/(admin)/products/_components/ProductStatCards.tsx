'use client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import Card from '@/components/ui/Card';
import { gray, green, orange, red } from '@/constants/colors';

export interface ProductStatCounts {
  total: number;
  active: number;
  lowStock: number;
}

interface ProductStatCardsProps {
  counts: ProductStatCounts | null;
  loading: boolean;
}

interface StatCardConfig {
  label: string;
  value: string;
  accentColor: string;
  tooltip?: string;
}

export default function ProductStatCards({
  counts,
  loading,
}: ProductStatCardsProps) {
  const cards: StatCardConfig[] = [
    {
      label: 'Total products',
      value: String(counts?.total ?? 0),
      accentColor: gray[600],
    },
    {
      label: 'Active',
      value: String(counts?.active ?? 0),
      accentColor: green[600],
    },
    {
      label: 'Low stock',
      value: String(counts?.lowStock ?? 0),
      accentColor: orange[600],
    },
    {
      label: 'Out of stock',
      value: '—',
      accentColor: red[600],
      tooltip:
        'Chưa có API đếm chính xác số sản phẩm hết hàng trên toàn bộ dữ liệu — cần backend bổ sung filter riêng.',
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600 }}
              color="text.secondary"
            >
              {card.label}
            </Typography>

            {loading ? (
              <Skeleton width={48} height={36} />
            ) : (
              <Tooltip
                title={card.tooltip ?? ''}
                disableHoverListener={!card.tooltip}
              >
                <Box sx={{ display: 'inline-block' }}>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, mt: 1, color: card.accentColor }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
