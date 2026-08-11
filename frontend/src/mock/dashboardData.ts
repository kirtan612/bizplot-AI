export interface KPIMetric {
  id: string;
  label: string;
  value: string;
  rawNumber: number;
  prefix?: string;
  suffix?: string;
  change: number; // percentage change
  periodComparison: string;
  status: 'positive' | 'negative' | 'neutral';
  requiredPermission?: string;
}

export interface TrendDataPoint {
  date: string;
  revenue: number;
  profit: number;
  targetRevenue: number;
  cashIn: number;
  cashOut: number;
  netCash: number;
  actualSales: number;
  targetSales: number;
  retentionRate: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface ReceivablesAgingItem {
  bucket: string;
  amount: number;
  count: number;
  percentage: number;
  color: string;
}

export const MOCK_KPI_METRICS: KPIMetric[] = [
  {
    id: 'revenue',
    label: 'Revenue',
    value: '24.8L',
    prefix: '₹',
    rawNumber: 2480000,
    change: 12.4,
    periodComparison: 'vs previous month',
    status: 'positive',
    requiredPermission: 'dashboard.view',
  },
  {
    id: 'gross-profit',
    label: 'Gross Profit',
    value: '6.4L',
    prefix: '₹',
    rawNumber: 640000,
    change: 8.7,
    periodComparison: 'vs previous month',
    status: 'positive',
    requiredPermission: 'finance.view',
  },
  {
    id: 'cash-position',
    label: 'Cash Position',
    value: '9.2L',
    prefix: '₹',
    rawNumber: 920000,
    change: -3.2,
    periodComparison: 'vs previous month',
    status: 'negative',
    requiredPermission: 'cashflow.view',
  },
  {
    id: 'receivables',
    label: 'Receivables',
    value: '4.1L',
    prefix: '₹',
    rawNumber: 410000,
    change: -5.8,
    periodComparison: 'vs previous month',
    status: 'positive',
    requiredPermission: 'invoices.view',
  },
  {
    id: 'customers',
    label: 'Active Customers',
    value: '1,420',
    rawNumber: 1420,
    change: 4.2,
    periodComparison: 'vs previous month',
    status: 'positive',
    requiredPermission: 'customers.view',
  },
];

export const MOCK_TREND_DATA: Record<string, TrendDataPoint[]> = {
  '30d': [
    { date: 'Jan 05', revenue: 3.2, profit: 0.8, targetRevenue: 3.0, cashIn: 3.4, cashOut: 2.6, netCash: 0.8, actualSales: 42, targetSales: 40, retentionRate: 84 },
    { date: 'Jan 10', revenue: 3.8, profit: 0.9, targetRevenue: 3.5, cashIn: 4.0, cashOut: 3.1, netCash: 0.9, actualSales: 48, targetSales: 45, retentionRate: 85 },
    { date: 'Jan 15', revenue: 4.1, profit: 1.1, targetRevenue: 3.8, cashIn: 4.2, cashOut: 3.0, netCash: 1.2, actualSales: 52, targetSales: 48, retentionRate: 86 },
    { date: 'Jan 20', revenue: 4.4, profit: 1.2, targetRevenue: 4.0, cashIn: 4.5, cashOut: 3.4, netCash: 1.1, actualSales: 56, targetSales: 50, retentionRate: 87 },
    { date: 'Jan 25', revenue: 4.6, profit: 1.1, targetRevenue: 4.2, cashIn: 4.3, cashOut: 3.5, netCash: 0.8, actualSales: 58, targetSales: 52, retentionRate: 87 },
    { date: 'Jan 30', revenue: 4.7, profit: 1.3, targetRevenue: 4.5, cashIn: 4.9, cashOut: 3.6, netCash: 1.3, actualSales: 62, targetSales: 55, retentionRate: 88 },
  ],
  '6m': [
    { date: 'Mar 2026', revenue: 19.8, profit: 4.8, targetRevenue: 18.5, cashIn: 21.0, cashOut: 16.2, netCash: 4.8, actualSales: 240, targetSales: 230, retentionRate: 83 },
    { date: 'Apr 2026', revenue: 21.2, profit: 5.2, targetRevenue: 20.0, cashIn: 22.4, cashOut: 17.1, netCash: 5.3, actualSales: 265, targetSales: 250, retentionRate: 85 },
    { date: 'May 2026', revenue: 22.4, profit: 5.5, targetRevenue: 21.5, cashIn: 23.8, cashOut: 18.0, netCash: 5.8, actualSales: 280, targetSales: 270, retentionRate: 86 },
    { date: 'Jun 2026', revenue: 23.1, profit: 5.7, targetRevenue: 22.5, cashIn: 24.2, cashOut: 18.9, netCash: 5.3, actualSales: 295, targetSales: 285, retentionRate: 86 },
    { date: 'Jul 2026', revenue: 24.0, profit: 6.1, targetRevenue: 23.5, cashIn: 25.1, cashOut: 19.5, netCash: 5.6, actualSales: 310, targetSales: 300, retentionRate: 87 },
    { date: 'Aug 2026', revenue: 24.8, profit: 6.4, targetRevenue: 24.0, cashIn: 26.2, cashOut: 19.8, netCash: 6.4, actualSales: 324, targetSales: 310, retentionRate: 88 },
  ],
  '1y': [
    { date: 'Q3 2025', revenue: 54.2, profit: 13.5, targetRevenue: 50.0, cashIn: 58.0, cashOut: 44.5, netCash: 13.5, actualSales: 720, targetSales: 700, retentionRate: 82 },
    { date: 'Q4 2025', revenue: 61.8, profit: 15.2, targetRevenue: 58.0, cashIn: 64.2, cashOut: 49.0, netCash: 15.2, actualSales: 810, targetSales: 780, retentionRate: 84 },
    { date: 'Q1 2026', revenue: 63.4, profit: 15.5, targetRevenue: 62.0, cashIn: 67.0, cashOut: 51.5, netCash: 15.5, actualSales: 840, targetSales: 820, retentionRate: 86 },
    { date: 'Q2 2026', revenue: 71.9, profit: 18.2, targetRevenue: 70.0, cashIn: 75.5, cashOut: 57.3, netCash: 18.2, actualSales: 929, targetSales: 895, retentionRate: 88 },
  ]
};

export const MOCK_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { category: 'Raw Materials & Inventory', amount: 8.4, percentage: 42.4, color: '#3B82F6' }, // Blue
  { category: 'Logistics & Distribution', amount: 3.8, percentage: 19.2, color: '#10B981' }, // Green
  { category: 'Payroll & Sales Incentives', amount: 3.5, percentage: 17.7, color: '#8B5CF6' }, // Purple
  { category: 'Warehouse Operations', amount: 2.3, percentage: 11.6, color: '#F59E0B' }, // Amber
  { category: 'Software & Technology', amount: 1.8, percentage: 9.1, color: '#EC4899' }, // Pink
];

export const MOCK_RECEIVABLES_AGING: ReceivablesAgingItem[] = [
  { bucket: 'Current', amount: 2.1, count: 48, percentage: 51.2, color: '#10B981' },
  { bucket: '1-30 days', amount: 1.1, count: 22, percentage: 26.8, color: '#3B82F6' },
  { bucket: '31-60 days', amount: 0.5, count: 12, percentage: 12.2, color: '#F59E0B' },
  { bucket: '61-90 days', amount: 0.25, count: 6, percentage: 6.1, color: '#F97316' },
  { bucket: '90+ days', amount: 0.15, count: 4, percentage: 3.7, color: '#EF4444' },
];
