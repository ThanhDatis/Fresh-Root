import MoreVertIcon from '@mui/icons-material/MoreVert';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import type { ChipProps } from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import type { OrderStatus, RecentOrder } from '@/types/dashboard.types';
import { formatVND } from '@/utils/currency';
import { formatDate } from '@/utils/dateTime';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: ChipProps['color'] }
> = {
  cancelled: { label: 'Cancelled', color: 'error' },
  processing: { label: 'Processing', color: 'info' },
  pending: { label: 'Pending', color: 'warning' },
  success: { label: 'Success', color: 'success' },
};

interface OrderTableProps {
  orders: RecentOrder[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  selectedIds: Set<string>;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
}

export default function OrderTable({
  orders,
  totalCount,
  page,
  rowsPerPage,
  selectedIds,
  onPageChange,
  onRowsPerPageChange,
  onToggleRow,
  onToggleAll,
}: OrderTableProps) {
  const allOnPageSelected =
    orders.length > 0 && orders.every((o) => selectedIds.has(o.id));
  const someOnPageSelected = orders.some((o) => selectedIds.has(o.id));

  return (
    <Card disablePadding>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={allOnPageSelected}
                indeterminate={someOnPageSelected && !allOnPageSelected}
                onChange={onToggleAll}
              />
            </TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => {
            const status = STATUS_CONFIG[order.status];
            return (
              <TableRow key={order.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.has(order.id)}
                    onChange={() => onToggleRow(order.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {order.orderCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Avatar name={order.customerName} size="small" />
                    <Stack>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customerEmail}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{formatVND(order.total)}</TableCell>
                <TableCell>{formatDate(order.date, 'MMM D, YYYY')}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={status.label}
                    color={status.color}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
      />
    </Card>
  );
}
