'use client';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import PageTitle from '@/components/shared/PageTitle';
import { blue, purple, red, teal } from '@/constants/colors';

import { useDashboardPage } from '../_hooks/useDashboardPage';

import LowStockCard from './LowStockCard';
import MetricCard from './MetricCard';
import OrderTable from './OrderTable';
import RecentActivityCard from './RecentActivityCard';
import RevenueChart from './RevenueChart';
import TopEmployeesCard from './TopEmployeesCard';
import TopProductsCard from './TopProductsCard';

export default function DashboardView() {
  const {
    stats,
    loading,
    revenueRange,
    setRevenueRange,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    selectedIds,
    paginatedOrders,
    toggleRow,
    toggleAllOnPage,
  } = useDashboardPage();

  if (loading || !stats) {
    return null;
  }

  return (
    <Stack spacing={3}>
      <PageTitle title="Dashboard Overview" />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<AccountBalanceOutlinedIcon />}
            iconBgColor={teal[50]}
            iconColor={teal[700]}
            {...stats.metrics.revenue}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<ShoppingBagOutlinedIcon />}
            iconBgColor={blue[50]}
            iconColor={blue[700]}
            {...stats.metrics.invoices}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<WarningAmberOutlinedIcon />}
            iconBgColor={red[50]}
            iconColor={red[700]}
            {...stats.metrics.returns}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            icon={<GroupsOutlinedIcon />}
            iconBgColor={purple[50]}
            iconColor={purple[700]}
            {...stats.metrics.newCustomers}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueChart
            series={stats.revenueSeries[revenueRange]}
            range={revenueRange}
            onRangeChange={setRevenueRange}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <LowStockCard items={stats.lowStockItems} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TopProductsCard products={stats.topProducts} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TopEmployeesCard employees={stats.topEmployees} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentActivityCard activities={stats.activities} />
        </Grid>
      </Grid>

      <OrderTable
        orders={paginatedOrders}
        totalCount={stats.recentOrders.length}
        page={page}
        rowsPerPage={rowsPerPage}
        selectedIds={selectedIds}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        onToggleRow={toggleRow}
        onToggleAll={toggleAllOnPage}
      />
    </Stack>
  );
}
