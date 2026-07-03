import CloseIcon from '@mui/icons-material/Close';
import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
  /** Tiêu đề dialog */
  title?: React.ReactNode;
  /** Nội dung footer, thường là các nút Hủy / Xác nhận */
  actions?: React.ReactNode;
  /** Ẩn nút X ở góc trên phải (mặc định hiện) */
  hideCloseButton?: boolean;
  /** Tự động chuyển fullScreen trên mobile (mặc định true) */
  responsiveFullScreen?: boolean;
}

/**
 * Dialog dùng chung cho toàn app — dựa trên MUI Dialog (đã có override trong theme.ts).
 * Không chứa business logic, chỉ nhận props và render, đúng quy ước của components/ui/.
 *
 * Ví dụ:
 * <Dialog
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Xác nhận xoá sản phẩm"
 *   actions={
 *     <>
 *       <Button variant="outlined" onClick={() => setOpen(false)}>Huỷ</Button>
 *       <Button variant="contained" color="error" onClick={handleDelete}>Xoá</Button>
 *     </>
 *   }
 * >
 *   Bạn có chắc chắn muốn xoá sản phẩm này không?
 * </Dialog>
 */
export default function Dialog({
  title,
  actions,
  hideCloseButton = false,
  responsiveFullScreen = true,
  children,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  ...rest
}: DialogProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseButtonClick = (event: React.MouseEvent) => {
    onClose?.(event, 'escapeKeyDown');
  };

  return (
    <MuiDialog
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={responsiveFullScreen && isMobile}
      {...rest}
    >
      {(title || !hideCloseButton) && (
        <DialogTitle sx={{ p: 0 }}>
          <Stack
            direction="row"
            sx={{
              pl: 3,
              pr: 1.5,
              py: 1.5,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            {!hideCloseButton && (
              <IconButton
                aria-label="Đóng"
                onClick={handleCloseButtonClick}
                size="small"
                sx={{ color: (t) => t.palette.text.secondary }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        </DialogTitle>
      )}

      <DialogContent dividers sx={{ px: 3, py: 2.5 }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ px: 3, py: 2 }}>{actions}</DialogActions>
      )}
    </MuiDialog>
  );
}
