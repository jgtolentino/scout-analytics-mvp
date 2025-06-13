export interface FilterState {
  dateRange: [Date, Date];
  brands: string[];
  locations: string[];
  categories: string[];
}

export interface Metric {
  label: string;
  value: number | string;
  trend?: number;
  format?: 'currency' | 'number' | 'percentage';
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  store_id: string;
  transaction_date: string;
  total_amount: number;
  payment_method: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location: string;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  region: string;
  type?: string;
}

export interface DashboardMetrics {
  revenue: number;
  transactions: number;
  avgBasketSize: number;
  activeCustomers: number;
  revenueTrend: number;
  transactionsTrend: number;
  basketTrend: number;
  customersTrend: number;
  revenueTrendData: ChartData[];
  topProducts: Array<{ name: string; value: number }>;
}