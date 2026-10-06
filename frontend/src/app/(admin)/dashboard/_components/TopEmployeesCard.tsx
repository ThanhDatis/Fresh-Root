import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import type { TopEmployee } from '@/types/dashboard.types';

interface TopEmployeesCardProps {
  employees: TopEmployee[];
}

export default function TopEmployeesCard({ employees }: TopEmployeesCardProps) {
  return (
    <Card>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Top sales employee
      </Typography>

      <Stack spacing={2.25}>
        {employees.map((employee) => (
          <Stack
            key={employee.id}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <Avatar name={employee.name} src={employee.avatar} size="medium" />
            <Stack sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {employee.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {employee.orderCount} orders
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {employee.timeAgo}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
