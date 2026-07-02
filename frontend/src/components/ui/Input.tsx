import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';

export type InputProps = MuiTextFieldProps;

/**
 * Base Input — wrapper của MuiTextField, mặc định variant outlined.
 * Theme đã set: borderRadius 8px, border màu sage khi focus.
 *
 * @example
 * <Input label="Email" type="email" fullWidth />
 * <Input label="Tìm kiếm" placeholder="Nhập tên sản phẩm..." />
 * <Input label="Mật khẩu" type="password" error helperText="Sai mật khẩu" />
 */
export default function Input({ variant = 'outlined', ...props }: InputProps) {
  return <MuiTextField variant={variant} {...props} />;
}
