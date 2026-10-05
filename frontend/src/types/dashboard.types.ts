export type TrendDirection = 'up' | 'down';

export interface DashboardMetric {
  label: string;
  value: string;
  changePercent: number;
  trend: TrendDirection;
}

export type RevenueRange = 'day' | 'week' | 'month';

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sold: number;
}

export interface TopEmployee {
  id: string;
  name: string;
  avatar?: string;
  orderCount: number;
  timeAgo: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  remaining: number;
}

export type ActivityType =
  | 'invoice'
  | 'return'
  | 'import'
  | 'login'
  | 'out-of-stock';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  timeAgo: string;
}

export type OrderStatus = 'cancelled' | 'processing' | 'pending' | 'success';

export interface RecentOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  total: number;
  date: string;
  status: OrderStatus;
}

export interface DashboardStats {
  metrics: {
    revenue: DashboardMetric;
    invoices: DashboardMetric;
    returns: DashboardMetric;
    newCustomers: DashboardMetric;
  };
  revenueSeries: Record<RevenueRange, RevenuePoint[]>;
  topProducts: TopProduct[];
  topEmployees: TopEmployee[];
  lowStockItems: LowStockItem[];
  activities: ActivityItem[];
  recentOrders: RecentOrder[];
}
