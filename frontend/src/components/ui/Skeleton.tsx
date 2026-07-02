'use client';

import Box from '@mui/material/Box';
import MuiSkeleton, {
  SkeletonProps as MuiSkeletonProps,
} from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SkeletonProps extends MuiSkeletonProps {}

/**
 * Skeleton cơ bản — wrapper mỏng quanh MUI Skeleton, mặc định dùng animation "wave"
 * để đồng nhất cảm giác loading trên toàn app.
 */
export default function Skeleton({
  animation = 'wave',
  ...rest
}: SkeletonProps) {
  return <MuiSkeleton animation={animation} {...rest} />;
}

/* ---------------------------------------------------------------------- */
/* Presets — các pattern loading dùng lặp lại nhiều nơi trong app          */
/* ---------------------------------------------------------------------- */

export interface SkeletonTextProps {
  /** Số dòng text */
  lines?: number;
  /** Width tuỳ chỉnh cho từng dòng (mặc định dòng cuối ngắn hơn) */
  width?: (string | number)[];
}

/** Nhiều dòng text đang load — dùng cho mô tả sản phẩm, bài blog,... */
export function SkeletonText({ lines = 3, width }: SkeletonTextProps) {
  return (
    <Stack spacing={0.75}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={width?.[i] ?? (i === lines - 1 ? '60%' : '100%')}
        />
      ))}
    </Stack>
  );
}

/** Avatar tròn đang load — dùng cho review, comment, customer table */
export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return <Skeleton variant="circular" width={size} height={size} />;
}

/** Skeleton cho ProductCard: ảnh + tên + giá — dùng khi đang fetch danh sách sản phẩm */
export function SkeletonProductCard() {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton variant="rounded" width="100%" height={200} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </Box>
  );
}

/** Một hàng skeleton cho table (Admin: Product/Order/Customer table) */
export function SkeletonTableRow({ columns = 5 }: { columns?: number }) {
  return (
    <Stack direction="row" spacing={2} sx={{ py: 1.5, width: '100%' }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" sx={{ flex: 1 }} />
      ))}
    </Stack>
  );
}
