'use client';

import GoogleIcon from '@mui/icons-material/Google';

import Button from '@/components/ui/Button';

export default function GoogleOAuthButton() {
  return (
    <Button
      variant="outlined"
      color="secondary"
      fullWidth
      startIcon={<GoogleIcon />}
      onClick={() => {
        // TODO: tích hợp Google OAuth khi auth-service hỗ trợ
      }}
    >
      Continue with Google
    </Button>
  );
}
