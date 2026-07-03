'use client';

import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import * as React from 'react';

import { gray, green, red, orange } from '@/constants/colors';

export type AvatarSize = 'small' | 'medium' | 'large' | number;
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps extends Omit<MuiAvatarProps, 'children'> {
  src?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
}

const SIZE_MAP: Record<Exclude<AvatarSize, number>, number> = {
  small: 32,
  medium: 40,
  large: 56,
};

const STATUS_COLOR_MAP: Record<AvatarStatus, string> = {
  online: green[500],
  offline: gray[500],
  busy: red[500],
  away: orange[500],
};

function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const StatusBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'statusColor',
})<{ statusColor?: string }>(({ theme, statusColor }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: statusColor,
    color: statusColor,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 10,
    height: 10,
    borderRadius: '50%',
    minWidth: 10,
  },
}));

/**
 * Avatar dùng chung cho toàn app.
 * - Có ảnh -> hiển thị ảnh
 * - Không có ảnh -> hiển thị chữ viết tắt từ `name`, nền theo màu primary
 */
export default function Avatar({
  src,
  name,
  size = 'medium',
  status,
  sx,
  ...rest
}: AvatarProps) {
  const dimension = typeof size === 'number' ? size : SIZE_MAP[size];

  const avatarEl = (
    <MuiAvatar
      src={src}
      alt={name}
      sx={{
        width: dimension,
        height: dimension,
        fontSize: dimension * 0.4,
        fontWeight: 600,
        bgcolor: (theme) => theme.palette.primary.main,
        color: (theme) => theme.palette.primary.contrastText,
        ...sx,
      }}
      {...rest}
    >
      {!src && getInitials(name)}
    </MuiAvatar>
  );

  if (!status) return avatarEl;

  return (
    <StatusBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      statusColor={STATUS_COLOR_MAP[status]}
    >
      {avatarEl}
    </StatusBadge>
  );
}
