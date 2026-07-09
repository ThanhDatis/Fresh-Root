'use client';

import { Alert, Snackbar } from '@mui/material';

import { useUIStore } from '@/stores/uiStore';

export default function ToastMessage() {
  const { toast, hideToast } = useUIStore();

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={3000}
      onClose={hideToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={hideToast}
        severity={toast.type}
        variant="outlined"
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
