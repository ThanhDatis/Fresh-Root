import MuiChip, { ChipProps as MuiChipProps } from '@mui/material/Chip';

type BadgeVariant = 'new' | 'sale' | 'bestseller' | 'outofstock' | 'custom';

export interface BadgeProps extends Omit<
  MuiChipProps,
  'color' | 'variant' | 'label'
> {
  /** Preset cho các badge thường dùng trong FreshRoot */
  variant?: BadgeVariant;
  /** Dùng khi variant="custom" — truyền label tùy ý */
  label?: string;
}

const BADGE_CONFIG: Record<
  BadgeVariant,
  { label: string; color: MuiChipProps['color'] }
> = {
  new: { label: 'Mới', color: 'success' },
  sale: { label: 'Giảm giá', color: 'error' },
  bestseller: { label: 'Bán chạy', color: 'primary' },
  outofstock: { label: 'Hết hàng', color: 'default' },
  custom: { label: '', color: 'default' },
};

/**
 * Badge — dùng để gắn nhãn sản phẩm (Mới, Giảm giá, Bán chạy, Hết hàng).
 * Wrapper của MuiChip với preset variants sẵn cho FreshRoot.
 * Theme đã set: fontWeight 600, borderRadius 8px, text căn giữa.
 *
 * @example
 * <Badge variant="new" />
 * <Badge variant="sale" size="small" />
 * <Badge variant="bestseller" />
 * <Badge variant="outofstock" />
 * <Badge variant="custom" label="Quà tặng" />
 */
export default function Badge({
  variant = 'custom',
  label,
  size = 'small',
  ...props
}: BadgeProps) {
  const config = BADGE_CONFIG[variant];

  return (
    <MuiChip
      label={label ?? config.label}
      color={config.color}
      size={size}
      {...props}
    />
  );
}
