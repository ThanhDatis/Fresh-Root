'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import Card from '@/components/ui/Card';
import { borderLine, gray, sage } from '@/constants/colors';
import type { RevenuePoint, RevenueRange } from '@/types/dashboard.types';
import { formatVND } from '@/utils/currency';

const RANGE_TABS: { value: RevenueRange; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
];

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        bgcolor: gray[900],
        color: '#fff',
        px: 1.5,
        py: 0.75,
        borderRadius: 1.5,
        fontSize: '0.8125rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label} • {formatVND(payload[0]?.value as number)}
    </Box>
  );
}

interface RevenueChartProps {
  series: RevenuePoint[];
  range: RevenueRange;
  onRangeChange: (range: RevenueRange) => void;
}

export default function RevenueChart({
  series,
  range,
  onRangeChange,
}: RevenueChartProps) {
  return (
    <Card>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Revenue Overview
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ bgcolor: gray[100], borderRadius: 999, p: 0.5 }}
        >
          {RANGE_TABS.map((tab) => {
            const isActive = tab.value === range;
            return (
              <Box
                key={tab.value}
                component="button"
                onClick={() => onRangeChange(tab.value)}
                sx={{
                  border: 'none',
                  cursor: 'pointer',
                  px: 2,
                  py: 0.75,
                  borderRadius: 999,
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  bgcolor: isActive ? sage[900] : 'transparent',
                  color: isActive ? '#fff' : 'text.secondary',
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Stack>
      </Stack>

      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={series}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={sage[400]} stopOpacity={0.35} />
                <stop offset="95%" stopColor={sage[400]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={borderLine}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: gray[600] }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: gray[600] }}
              tickFormatter={(v: number) => `${v / 1_000_000}M`}
            />
            <Tooltip content={ChartTooltip} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#revenueFill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={sage[600]}
              strokeWidth={2.5}
              dot={{ r: 4, fill: sage[600], strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
