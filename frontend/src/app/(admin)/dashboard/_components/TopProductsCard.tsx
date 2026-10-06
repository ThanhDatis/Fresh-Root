'use client';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import Card from '@/components/ui/Card';
import { gray } from '@/constants/colors';
import type { TopProduct } from '@/types/dashboard.types';

interface TopProductsCardProps {
  products: TopProduct[];
}

export default function TopProductsCard({ products }: TopProductsCardProps) {
  const [period, setPeriod] = useState('Month');
  const maxSold = Math.max(...products.map((p) => p.sold), 1);

  return (
    <Card>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Top-selling products
        </Typography>
        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="Week">Week</MenuItem>
          <MenuItem value="Month">Month</MenuItem>
          <MenuItem value="Year">Year</MenuItem>
        </Select>
      </Stack>

      <Stack spacing={2}>
        {products.map((product) => (
          <Box key={product.id}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', mb: 0.75 }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.sold.toLocaleString('en-US')} sold
              </Typography>
            </Stack>
            <Box
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: gray[200],
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${(product.sold / maxSold) * 100}%`,
                  bgcolor: gray[900],
                  borderRadius: 999,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
