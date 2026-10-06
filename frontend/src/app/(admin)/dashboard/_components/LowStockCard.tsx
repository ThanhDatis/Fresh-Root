import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import Card from '@/components/ui/Card';
import { red } from '@/constants/colors';
import { ROUTES } from '@/constants/routes';
import type { LowStockItem } from '@/types/dashboard.types';

interface LowStockCardProps {
  items: LowStockItem[];
}

export default function LowStockCard({ items }: LowStockCardProps) {
  return (
    <Card>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Low Stock Alert
      </Typography>

      <Stack spacing={1.25}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.25,
              borderRadius: 2,
              bgcolor: red[50],
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {item.name}
            </Typography>
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                borderRadius: 999,
                bgcolor: red[400],
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {item.remaining} left
            </Box>
          </Stack>
        ))}
      </Stack>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography
          component={Link}
          href={`${ROUTES.PRODUCTS}?filter=low-stock`}
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            textDecoration: 'underline',
          }}
        >
          View all
        </Typography>
      </Box>
    </Card>
  );
}
