'use client';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import PageTitle from '@/components/shared/PageTitle';
import Avatar from '@/components/ui/Avatar';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack spacing={3}>
      <PageTitle title="Profile" />

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            <Avatar name={user?.fullName ?? 'Admin'} size="large" />
            <Stack spacing={0.5}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {user?.fullName ?? 'Name Admin'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email ?? '—'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.employeeCode
                  ? `Employee code: ${user.employeeCode}`
                  : null}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
