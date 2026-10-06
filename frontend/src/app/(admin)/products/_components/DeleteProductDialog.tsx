'use client';

import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { orange } from '@/constants/colors';
import { useUIStore } from '@/stores/uiStore';
import { getApiErrorMessage } from '@/utils/apiError';

interface DeleteProductDialogProps {
  productIds: string[];
  singleProductName?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteProductDialog({
  productIds,
  singleProductName,
  onClose,
  onConfirm,
}: DeleteProductDialogProps) {
  const showToast = useUIStore((state) => state.showToast);
  const [submitting, setSubmitting] = useState(false);

  const count = productIds.length;
  const isSingle = count === 1;

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Thao tác thất bại'), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
      title={
        isSingle
          ? `Deactivate "${singleProductName ?? 'this product'}"?`
          : `Deactivate ${count} products?`
      }
      actions={
        <>
          <Button variant="outlined" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            loading={submitting}
            onClick={handleConfirm}
            sx={{
              bgcolor: orange[600],
              '&:hover': { bgcolor: orange[700] },
            }}
          >
            {isSingle ? 'Deactivate' : `Deactivate ${count} products`}
          </Button>
        </>
      }
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: orange[50],
            color: orange[700],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WarningAmberOutlinedIcon fontSize="small" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Sản phẩm sẽ chuyển sang trạng thái Inactive, không hiển thị ở POS. Dữ
          liệu và lịch sử vẫn được giữ lại, có thể kích hoạt lại bất cứ lúc nào.
        </Typography>
      </Stack>
    </Dialog>
  );
}
