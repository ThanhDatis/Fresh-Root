import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';

/**
 * Style riêng cho dòng caption báo lỗi bên dưới input.
 * Tách hẳn khỏi style của TextField — bug ở bản gốc là dùng chung 1 object
 * `errorStyleInput` cho cả TextField (khi isError) lẫn Typography, khiến
 * `display: flex` vô tình áp vào root của TextField và làm lệch layout.
 */
export const errorTextSx: SystemStyleObject<Theme> = {
  fontSize: '12px',
  lineHeight: 1.4,
  display: 'block',
  marginTop: '4px',
};
