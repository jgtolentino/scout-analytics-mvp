import { useMemo } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import { DashboardMetrics, ChartData } from '@/types';

// Mock data generator
const generateMockData = (filters: any): DashboardMetrics => {
  const { dateRange, brands, locations } = filters;
  
  // Generate date range data
  const startDate = new Date(dateRange[0]);
  const endDate = new Date(dateRange[1]);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const revenueTrendData: ChartData[] = [];
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Simulate varying revenue with some randomness
    const baseRevenue = 150000 + Math.sin(i / 7) * 50000; // Weekly pattern
    const variation = (Math.random() - 0.5) * 40000;
    const filterMultiplier = 1 + (brands.length * 0.1) + (locations.length * 0.05);
    
    revenueTrendData.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, Math.round((baseRevenue + variation) * filterMultiplier))
    });
  }
  
  const totalRevenue = revenueTrendData.reduce((sum, d) => sum + d.value, 0);
  
  // Calculate metrics based on filters
  const brandMultiplier = brands.length > 0 ? brands.length * 0.8 : 1;
  const locationMultiplier = locations.length > 0 ? locations.length * 0.6 : 1;
  
  const baseTransactions = Math.round(days * 250 * brandMultiplier * locationMultiplier);
  const baseCustomers = Math.round(baseTransactions * 0.7);
  
  // Top products based on selected filters
  const allProducts = [
    'Nestle Milo', 'Coca-Cola', 'Lucky Me Instant Noodles', 'Unilever Dove Soap',
    'San Miguel Beer', 'Jollibee Burger', 'URC Jack n Jill', 'P&G Head & Shoulders',
    'Pepsi Cola', 'Nestle Maggi', 'Alaska Milk', 'Monde Nissin SkyFlakes'
  ];
  
  const topProducts = allProducts.slice(0, 8).map((name, index) => ({
    name,
    value: Math.round((totalRevenue * (0.15 - index * 0.015)) * Math.random())
  })).sort((a, b) => b.value - a.value);
  
  return {
    revenue: totalRevenue,
    transactions: baseTransactions,
    avgBasketSize: totalRevenue / baseTransactions,
    activeCustomers: baseCustomers,
    
    // Simulate trends (% change from previous period)
    revenueTrend: (Math.random() - 0.4) * 20, // Bias towards positive
    transactionsTrend: (Math.random() - 0.5) * 15,
    basketTrend: (Math.random() - 0.3) * 10,
    customersTrend: (Math.random() - 0.5) * 12,
    
    revenueTrendData,
    topProducts
  };
};

export function useMetrics() {
  const filters = useFilterStore();
  
  const data = useMemo(() => {
    return generateMockData(filters);
  }, [filters.dateRange, filters.brands, filters.locations, filters.categories]);
  
  return {
    data,
    isLoading: false,
    error: null
  };
}

export function useTransactionTrends() {
  const filters = useFilterStore();
  
  const data = useMemo(() => {
    const { dateRange } = filters;
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Daily volume data
    const dailyVolume: ChartData[] = [];
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const baseVolume = 200 + Math.sin(i / 7) * 50; // Weekly pattern
      const variation = (Math.random() - 0.5) * 60;
      
      dailyVolume.push({
        date: date.toISOString().split('T')[0],
        value: Math.max(0, Math.round(baseVolume + variation))
      });
    }
    
    // Value distribution
    const valueDistribution = [
      { date: '0-500', value: 35 },
      { date: '501-1000', value: 28 },
      { date: '1001-2000', value: 22 },
      { date: '2001-5000', value: 12 },
      { date: '5000+', value: 3 }
    ];
    
    // Hourly heatmap data
    const hourlyHeatmap = Array.from({ length: 7 }, (_, day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
        hour,
        value: Math.round(Math.random() * 100 + 20)
      }))
    ).flat();
    
    return {
      dailyVolume,
      valueDistribution,
      hourlyHeatmap
    };
  }, [filters.dateRange, filters.brands, filters.locations, filters.categories]);
  
  return {
    data,
    isLoading: false,
    error: null
  };
}

export function useProductMix() {
  const filters = useFilterStore();
  
  const data = useMemo(() => {
    // Category performance
    const categoryPerformance = [
      { name: 'Beverages', value: 2850000, growth: 12.5 },
      { name: 'Snacks', value: 2100000, growth: 8.3 },
      { name: 'Personal Care', value: 1750000, growth: -2.1 },
      { name: 'Household', value: 1650000, growth: 15.7 },
      { name: 'Dairy', value: 1200000, growth: 6.4 },
      { name: 'Frozen', value: 950000, growth: -5.2 }
    ];
    
    // Brand performance
    const brandPerformance = [
      { name: 'Nestle', value: 1850000, marketShare: 18.5 },
      { name: 'Unilever', value: 1620000, marketShare: 16.2 },
      { name: 'Coca-Cola', value: 1450000, marketShare: 14.5 },
      { name: 'P&G', value: 1200000, marketShare: 12.0 },
      { name: 'San Miguel', value: 980000, marketShare: 9.8 },
      { name: 'URC', value: 850000, marketShare: 8.5 }
    ];
    
    // Product lifecycle
    const productLifecycle = [
      { stage: 'Growth', products: 45, revenue: 3200000 },
      { stage: 'Maturity', products: 120, revenue: 5800000 },
      { stage: 'Decline', products: 32, revenue: 1200000 },
      { stage: 'Introduction', products: 18, revenue: 800000 }
    ];
    
    return {
      categoryPerformance,
      brandPerformance,
      productLifecycle
    };
  }, [filters.dateRange, filters.brands, filters.locations, filters.categories]);
  
  return {
    data,
    isLoading: false,
    error: null
  };
}

export function useConsumerInsights() {
  const filters = useFilterStore();
  
  const data = useMemo(() => {
    // Demographics
    const ageDistribution = [
      { name: '18-24', value: 18, count: 2340 },
      { name: '25-34', value: 32, count: 4160 },
      { name: '35-44', value: 25, count: 3250 },
      { name: '45-54', value: 15, count: 1950 },
      { name: '55+', value: 10, count: 1300 }
    ];
    
    const genderDistribution = [
      { name: 'Female', value: 58, count: 7540 },
      { name: 'Male', value: 42, count: 5460 }
    ];
    
    // Shopping patterns
    const shoppingTimes = [
      { hour: '6-9 AM', value: 8 },
      { hour: '9-12 PM', value: 22 },
      { hour: '12-3 PM', value: 35 },
      { hour: '3-6 PM', value: 20 },
      { hour: '6-9 PM', value: 12 },
      { hour: '9-12 AM', value: 3 }
    ];
    
    const paymentMethods = [
      { name: 'Cash', value: 45, amount: 5850000 },
      { name: 'Credit Card', value: 28, amount: 3640000 },
      { name: 'Debit Card', value: 18, amount: 2340000 },
      { name: 'Digital Wallet', value: 9, amount: 1170000 }
    ];
    
    // Purchase behavior
    const basketAnalysis = {
      avgItemsPerBasket: 4.8,
      avgBasketValue: 847,
      repeatCustomerRate: 67,
      customerLifetimeValue: 12400
    };
    
    return {
      ageDistribution,
      genderDistribution,
      shoppingTimes,
      paymentMethods,
      basketAnalysis
    };
  }, [filters.dateRange, filters.brands, filters.locations, filters.categories]);
  
  return {
    data,
    isLoading: false,
    error: null
  };
}