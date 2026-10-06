import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import Card from '@/components/ui/Card';
import { blue, green, orange, red } from '@/constants/colors';
import type { ActivityItem, ActivityType } from '@/types/dashboard.types';

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: ReactNode; bg: string; color: string }
> = {
  invoice: {
    icon: <DescriptionOutlinedIcon fontSize="small" />,
    bg: green[50],
    color: green[700],
  },
  return: {
    icon: <ReplayOutlinedIcon fontSize="small" />,
    bg: red[50],
    color: red[700],
  },
  import: {
    icon: <LocalShippingOutlinedIcon fontSize="small" />,
    bg: green[50],
    color: green[700],
  },
  login: {
    icon: <LoginOutlinedIcon fontSize="small" />,
    bg: blue[50],
    color: blue[700],
  },
  'out-of-stock': {
    icon: <WarningAmberOutlinedIcon fontSize="small" />,
    bg: orange[50],
    color: orange[700],
  },
};

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export default function RecentActivityCard({
  activities,
}: RecentActivityCardProps) {
  return (
    <Card>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recent activity
      </Typography>

      <Stack spacing={2.25}>
        {activities.map((activity) => {
          const config = ACTIVITY_CONFIG[activity.type];
          return (
            <Stack
              key={activity.id}
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'flex-start' }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  flexShrink: 0,
                  borderRadius: '50%',
                  bgcolor: config.bg,
                  color: config.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {config.icon}
              </Box>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2">{activity.message}</Typography>
              </Stack>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {activity.timeAgo}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Card>
  );
}
