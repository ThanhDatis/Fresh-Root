import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export interface ButtonProps extends MuiButtonProps {
  /** Hiển thị loading spinner, disable tương tác */
  loading?: boolean;
}

/**
 * Base Button — wrapper của MuiButton với loading state.
 * Theme đã set: textTransform none, fontWeight 600, disableElevation, padding theo size.
 *
 * @example
 * <Button variant="contained">Mua ngay</Button>
 * <Button variant="outlined" loading>Đang xử lý...</Button>
 */
export default function Button({
  loading = false,
  disabled,
  children,
  startIcon,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" thickness={3} />
        ) : (
          startIcon
        )
      }
      {...props}
    >
      {children}
    </MuiButton>
  );
}
