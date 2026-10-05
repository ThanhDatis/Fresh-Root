import type {
  DashboardStats,
  OrderStatus,
  RecentOrder,
} from '@/types/dashboard.types';

// TODO: thay bằng gọi productApi/orderApi thật khi product-service & order-service sẵn sàng.
// Signature giữ nguyên — chỉ cần đổi phần implementation bên trong hàm này.

const ORDER_STATUSES: OrderStatus[] = [
  'cancelled',
  'processing',
  'pending',
  'success',
];

function buildRecentOrders(count: number): RecentOrder[] {
  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    return {
      id: `order-${index}`,
      orderCode: `HD-${String(index).padStart(4, '0')}`,
      customerName: 'Nguyen Van Hang',
      customerEmail: 'nguyenvanhang@gmail.com',
      total: 400000,
      date: '2026-05-12',
      status: ORDER_STATUSES[i % ORDER_STATUSES.length],
    };
  });
}

const MOCK_STATS: DashboardStats = {
  metrics: {
    revenue: {
      label: 'Revenue',
      value: '10,000,000 đ',
      changePercent: 12.4,
      trend: 'up',
    },
    invoices: {
      label: 'Number of Invoices',
      value: '1,240',
      changePercent: 8.2,
      trend: 'up',
    },
    returns: {
      label: 'Returns',
      value: '12',
      changePercent: 1.1,
      trend: 'down',
    },
    newCustomers: {
      label: 'New Customers',
      value: '1,240',
      changePercent: 6.8,
      trend: 'up',
    },
  },
  revenueSeries: {
    day: [
      { label: 'Mon', value: 4_000_000 },
      { label: 'Tue', value: 5_500_000 },
      { label: 'Wed', value: 5_200_000 },
      { label: 'Thu', value: 8_500_000 },
      { label: 'Fri', value: 8_000_000 },
      { label: 'Sat', value: 9_500_000 },
      { label: 'Sun', value: 12_000_000 },
    ],
    week: [
      { label: 'Week 1', value: 32_000_000 },
      { label: 'Week 2', value: 41_000_000 },
      { label: 'Week 3', value: 38_500_000 },
      { label: 'Week 4', value: 52_000_000 },
    ],
    month: [
      { label: 'Jan', value: 120_000_000 },
      { label: 'Feb', value: 98_000_000 },
      { label: 'Mar', value: 145_000_000 },
      { label: 'Apr', value: 132_000_000 },
      { label: 'May', value: 168_000_000 },
      { label: 'Jun', value: 155_000_000 },
    ],
  },
  topProducts: [
    { id: 'p1', name: 'Wireless Mouse', sold: 1240 },
    { id: 'p2', name: 'USB-C Hub', sold: 980 },
    { id: 'p3', name: 'Mechanical Keyboard', sold: 870 },
    { id: 'p4', name: 'Webcam HD Pro', sold: 650 },
    { id: 'p5', name: 'Monitor Stand', sold: 430 },
  ],
  topEmployees: [
    { id: 'e1', name: 'Nguyen Van A', orderCount: 30, timeAgo: '10m' },
    { id: 'e2', name: 'Nguyen Van A', orderCount: 30, timeAgo: '10m' },
    { id: 'e3', name: 'Nguyen Van A', orderCount: 30, timeAgo: '10m' },
    { id: 'e4', name: 'Nguyen Van A', orderCount: 30, timeAgo: '10m' },
  ],
  lowStockItems: Array.from({ length: 6 }, (_, i) => ({
    id: `stock-${i + 1}`,
    name: 'Wireless Mouse',
    remaining: 3,
  })),
  activities: [
    {
      id: 'a1',
      type: 'invoice',
      message: 'Nguyen Van A just created invoice - HD0001',
      timeAgo: '2 hours ago',
    },
    {
      id: 'a2',
      type: 'return',
      message: 'Return goods to Invoice - HD0001',
      timeAgo: '1 hours ago',
    },
    {
      id: 'a3',
      type: 'import',
      message: 'Import goods from Vinamilk supplier',
      timeAgo: '30 minutes ago',
    },
    {
      id: 'a4',
      type: 'invoice',
      message: 'Nguyen Van A just created invoice - HD0001',
      timeAgo: '2 hours ago',
    },
    {
      id: 'a5',
      type: 'invoice',
      message: 'Nguyen Van A just created invoice - HD0001',
      timeAgo: '2 hours ago',
    },
  ],
  recentOrders: buildRecentOrders(50),
};

export async function getDashboardStats(): Promise<DashboardStats> {
  return Promise.resolve(MOCK_STATS);
}
