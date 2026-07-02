import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

export interface CardProps extends MuiCardProps {
  /** Nội dung bên trong card */
  children: React.ReactNode;
  /** Khi truyền vào, toàn bộ card sẽ clickable (dùng cho ProductCard, BlogCard) */
  onClick?: () => void;
  /** Bỏ padding mặc định của CardContent — dùng khi cần layout custom (ảnh full-bleed) */
  disablePadding?: boolean;
}

/**
 * Base Card — wrapper của MuiCard.
 * Theme đã set: boxShadow sage tint, borderRadius 14px, border xám nhạt.
 *
 * @example
 * // Card tĩnh
 * <Card><Typography>Nội dung</Typography></Card>
 *
 * // Card clickable (ProductCard, BlogCard)
 * <Card onClick={() => router.push('/products/slug')}>...</Card>
 *
 * // Card không padding (ảnh full-bleed)
 * <Card disablePadding>
 *   <Image src="..." />
 *   <Box sx={{ p: 2 }}>...</Box>
 * </Card>
 */
export default function Card({
  children,
  onClick,
  disablePadding = false,
  ...props
}: CardProps) {
  const content = disablePadding ? (
    children
  ) : (
    <CardContent>{children}</CardContent>
  );

  if (onClick) {
    return (
      <MuiCard {...props}>
        <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
          {content}
        </CardActionArea>
      </MuiCard>
    );
  }

  return <MuiCard {...props}>{content}</MuiCard>;
}
