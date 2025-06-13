import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/stores/filterStore';
import { supabase } from '@/lib/supabase';
import { DashboardMetrics, ChartData } from '@/types';

// Helper function to format dates for SQL
const formatDateForSQL = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Hook for dashboard metrics - matches DashboardMetrics type from mock data
export const useMetrics = () => {
  const filters = useFilterStore();

  return useQuery({
    queryKey: ['metrics', filters],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Get transactions with related data using correct schema
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          total_amount,
          created_at,
          customer_age,
          customer_gender,
          store_location,
          transaction_items!inner(
            quantity,
            price,
            products!inner(
              name,
              category,
              brands!inner(name)
            )
          )
        `)
        .gte('created_at', formatDateForSQL(filters.dateRange[0]))
        .lte('created_at', formatDateForSQL(filters.dateRange[1]));

      if (error) throw error;

      // Apply filters
      let filteredTransactions = transactions || [];
      
      if (filters.brands?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.brands.includes(item.products.brands.name)
          )
        );
      }

      if (filters.locations?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          filters.locations.includes(t.store_location)
        );
      }

      if (filters.categories?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.categories.includes(item.products.category)
          )
        );
      }

      // Calculate basic metrics
      const revenue = filteredTransactions.reduce((sum, t) => sum + t.total_amount, 0);
      const transactions_count = filteredTransactions.length;
      const activeCustomers = filteredTransactions.length; // Simplified - using transaction count
      const avgBasketSize = transactions_count > 0 ? revenue / transactions_count : 0;

      // Generate revenue trend data
      const dateMap = new Map<string, number>();
      filteredTransactions.forEach(t => {
        const date = t.created_at.split('T')[0]; // Get date part only
        dateMap.set(date, (dateMap.get(date) || 0) + t.total_amount);
      });

      const revenueTrendData: ChartData[] = [];
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = formatDateForSQL(currentDate);
        revenueTrendData.push({
          date: dateStr,
          value: dateMap.get(dateStr) || 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Get top products
      const productRevenue = new Map<string, number>();
      filteredTransactions.forEach(t => {
        t.transaction_items.forEach((item: any) => {
          const productName = item.products.name;
          const itemTotal = item.quantity * item.price;
          productRevenue.set(productName, (productRevenue.get(productName) || 0) + itemTotal);
        });
      });

      const topProducts = Array.from(productRevenue.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 8);

      // Calculate growth (simplified - using 15% as default for now)
      const revenueTrend = 15.2;
      const transactionsTrend = 8.7;
      const basketTrend = 5.3;
      const customersTrend = 12.1;

      // Return data matching DashboardMetrics interface
      return {
        revenue,
        transactions: transactions_count,
        avgBasketSize,
        activeCustomers,
        revenueTrend,
        transactionsTrend,
        basketTrend,
        customersTrend,
        revenueTrendData,
        topProducts
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Hook for transaction trends data - matches expected structure
export const useTransactionTrends = () => {
  const filters = useFilterStore();
  
  return useQuery({
    queryKey: ['transaction-trends', filters],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          created_at,
          total_amount,
          payment_method,
          store_location,
          transaction_items!inner(
            quantity,
            price,
            products!inner(
              category,
              brands!inner(name)
            )
          )
        `)
        .gte('created_at', formatDateForSQL(filters.dateRange[0]))
        .lte('created_at', formatDateForSQL(filters.dateRange[1]))
        .order('created_at');

      if (error) throw error;

      // Apply filters
      let filteredTransactions = transactions || [];
      
      if (filters.brands?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.brands.includes(item.products.brands.name)
          )
        );
      }

      if (filters.locations?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          filters.locations.includes(t.store_location)
        );
      }

      if (filters.categories?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.categories.includes(item.products.category)
          )
        );
      }

      // Create daily volume data
      const dateVolumeMap = new Map<string, number>();
      filteredTransactions.forEach(t => {
        const date = t.created_at.split('T')[0];
        dateVolumeMap.set(date, (dateVolumeMap.get(date) || 0) + 1);
      });

      const dailyVolume: ChartData[] = [];
      const startDate = new Date(filters.dateRange[0]);
      const endDate = new Date(filters.dateRange[1]);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = formatDateForSQL(currentDate);
        dailyVolume.push({
          date: dateStr,
          value: dateVolumeMap.get(dateStr) || 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Create value distribution
      const valueRanges = [
        { min: 0, max: 500, label: '0-500' },
        { min: 501, max: 1000, label: '501-1000' },
        { min: 1001, max: 2000, label: '1001-2000' },
        { min: 2001, max: 5000, label: '2001-5000' },
        { min: 5001, max: Infinity, label: '5000+' }
      ];

      const valueDistribution = valueRanges.map(range => ({
        date: range.label,
        value: filteredTransactions.filter(t => 
          t.total_amount >= range.min && t.total_amount <= range.max
        ).length
      }));

      // Create hourly heatmap data
      const hourlyHeatmap = Array.from({ length: 7 }, (_, day) =>
        Array.from({ length: 24 }, (_, hour) => {
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
          
          // Count transactions for this day/hour combination
          const count = filteredTransactions.filter(t => {
            const date = new Date(t.created_at);
            return date.getDay() === day && date.getHours() === hour;
          }).length;

          return {
            day: dayName,
            hour,
            value: count
          };
        })
      ).flat();

      return {
        dailyVolume,
        valueDistribution,
        hourlyHeatmap
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for product mix data - matches expected structure
export const useProductMix = () => {
  const filters = useFilterStore();
  
  return useQuery({
    queryKey: ['product-mix', filters],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          created_at,
          total_amount,
          store_location,
          transaction_items!inner(
            quantity,
            price,
            products!inner(
              name,
              category,
              brands!inner(name)
            )
          )
        `)
        .gte('created_at', formatDateForSQL(filters.dateRange[0]))
        .lte('created_at', formatDateForSQL(filters.dateRange[1]));

      if (error) throw error;

      // Apply filters
      let filteredTransactions = transactions || [];
      
      if (filters.brands?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.brands.includes(item.products.brands.name)
          )
        );
      }

      if (filters.locations?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          filters.locations.includes(t.store_location)
        );
      }

      if (filters.categories?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.categories.includes(item.products.category)
          )
        );
      }

      // Category performance
      const categoryRevenue = new Map<string, { value: number, growth: number }>();
      filteredTransactions.forEach(t => {
        t.transaction_items.forEach((item: any) => {
          const category = item.products.category;
          const itemTotal = item.quantity * item.price;
          const existing = categoryRevenue.get(category) || { value: 0, growth: 0 };
          categoryRevenue.set(category, {
            value: existing.value + itemTotal,
            growth: Math.random() * 20 - 5 // Random growth between -5% to 15%
          });
        });
      });

      const categoryPerformance = Array.from(categoryRevenue.entries())
        .map(([name, data]) => ({ name, value: data.value, growth: data.growth }))
        .sort((a, b) => b.value - a.value);

      // Brand performance
      const brandRevenue = new Map<string, { value: number, marketShare: number }>();
      const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total_amount, 0);
      
      filteredTransactions.forEach(t => {
        t.transaction_items.forEach((item: any) => {
          const brand = item.products.brands.name;
          const itemTotal = item.quantity * item.price;
          const existing = brandRevenue.get(brand) || { value: 0, marketShare: 0 };
          brandRevenue.set(brand, {
            value: existing.value + itemTotal,
            marketShare: 0 // Will calculate after
          });
        });
      });

      const brandPerformance = Array.from(brandRevenue.entries())
        .map(([name, data]) => ({
          name,
          value: data.value,
          marketShare: totalRevenue > 0 ? (data.value / totalRevenue) * 100 : 0
        }))
        .sort((a, b) => b.value - a.value);

      // Product lifecycle (simplified)
      const productLifecycle = [
        { stage: 'Growth', products: Math.floor(categoryPerformance.length * 0.2), revenue: categoryPerformance.slice(0, 2).reduce((sum, c) => sum + c.value, 0) },
        { stage: 'Maturity', products: Math.floor(categoryPerformance.length * 0.5), revenue: categoryPerformance.slice(2, 5).reduce((sum, c) => sum + c.value, 0) },
        { stage: 'Decline', products: Math.floor(categoryPerformance.length * 0.2), revenue: categoryPerformance.slice(-2).reduce((sum, c) => sum + c.value, 0) },
        { stage: 'Introduction', products: Math.floor(categoryPerformance.length * 0.1), revenue: totalRevenue * 0.05 }
      ];

      return {
        categoryPerformance,
        brandPerformance,
        productLifecycle
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook for consumer insights data - matches expected structure
export const useConsumerInsights = () => {
  const filters = useFilterStore();
  
  return useQuery({
    queryKey: ['consumer-insights', filters],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          created_at,
          total_amount,
          customer_age,
          customer_gender,
          payment_method,
          store_location,
          transaction_items!inner(
            quantity,
            price,
            products!inner(
              category,
              brands!inner(name)
            )
          )
        `)
        .gte('created_at', formatDateForSQL(filters.dateRange[0]))
        .lte('created_at', formatDateForSQL(filters.dateRange[1]));

      if (error) throw error;

      // Apply filters
      let filteredTransactions = transactions || [];
      
      if (filters.brands?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.brands.includes(item.products.brands.name)
          )
        );
      }

      if (filters.locations?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          filters.locations.includes(t.store_location)
        );
      }

      if (filters.categories?.length > 0) {
        filteredTransactions = filteredTransactions.filter(t => 
          t.transaction_items.some((item: any) => 
            filters.categories.includes(item.products.category)
          )
        );
      }

      // Age distribution
      const ageGroups = new Map<string, { count: number, value: number }>();
      filteredTransactions.forEach(t => {
        if (t.customer_age) {
          let ageGroup = '55+';
          if (t.customer_age >= 18 && t.customer_age <= 24) ageGroup = '18-24';
          else if (t.customer_age >= 25 && t.customer_age <= 34) ageGroup = '25-34';
          else if (t.customer_age >= 35 && t.customer_age <= 44) ageGroup = '35-44';
          else if (t.customer_age >= 45 && t.customer_age <= 54) ageGroup = '45-54';

          const existing = ageGroups.get(ageGroup) || { count: 0, value: 0 };
          ageGroups.set(ageGroup, {
            count: existing.count + 1,
            value: existing.value + t.total_amount
          });
        }
      });

      const totalCustomers = filteredTransactions.length;
      const ageDistribution = Array.from(ageGroups.entries()).map(([name, data]) => ({
        name,
        value: totalCustomers > 0 ? Math.round((data.count / totalCustomers) * 100) : 0,
        count: data.count
      }));

      // Gender distribution
      const genderGroups = new Map<string, { count: number, value: number }>();
      filteredTransactions.forEach(t => {
        if (t.customer_gender) {
          const gender = t.customer_gender === 'M' ? 'Male' : 'Female';
          const existing = genderGroups.get(gender) || { count: 0, value: 0 };
          genderGroups.set(gender, {
            count: existing.count + 1,
            value: existing.value + t.total_amount
          });
        }
      });

      const genderDistribution = Array.from(genderGroups.entries()).map(([name, data]) => ({
        name,
        value: totalCustomers > 0 ? Math.round((data.count / totalCustomers) * 100) : 0,
        count: data.count
      }));

      // Shopping times (simplified - using hour from created_at)
      const timeGroups = new Map<string, number>();
      filteredTransactions.forEach(t => {
        const hour = new Date(t.created_at).getHours();
        let timeSlot = '9-12 AM';
        if (hour >= 6 && hour < 9) timeSlot = '6-9 AM';
        else if (hour >= 9 && hour < 12) timeSlot = '9-12 PM';
        else if (hour >= 12 && hour < 15) timeSlot = '12-3 PM';
        else if (hour >= 15 && hour < 18) timeSlot = '3-6 PM';
        else if (hour >= 18 && hour < 21) timeSlot = '6-9 PM';
        else timeSlot = '9-12 AM';

        timeGroups.set(timeSlot, (timeGroups.get(timeSlot) || 0) + 1);
      });

      const shoppingTimes = Array.from(timeGroups.entries()).map(([hour, count]) => ({
        hour,
        value: totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0
      }));

      // Payment methods
      const paymentGroups = new Map<string, { count: number, amount: number }>();
      filteredTransactions.forEach(t => {
        if (t.payment_method) {
          const existing = paymentGroups.get(t.payment_method) || { count: 0, amount: 0 };
          paymentGroups.set(t.payment_method, {
            count: existing.count + 1,
            amount: existing.amount + t.total_amount
          });
        }
      });

      const paymentMethods = Array.from(paymentGroups.entries()).map(([name, data]) => ({
        name,
        value: totalCustomers > 0 ? Math.round((data.count / totalCustomers) * 100) : 0,
        amount: data.amount
      }));

      // Basket analysis
      const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total_amount, 0);
      const totalItems = filteredTransactions.reduce((sum, t) => 
        sum + t.transaction_items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0), 0);

      const basketAnalysis = {
        avgItemsPerBasket: totalCustomers > 0 ? +(totalItems / totalCustomers).toFixed(1) : 0,
        avgBasketValue: totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0,
        repeatCustomerRate: 67, // Simplified - would need customer ID analysis
        customerLifetimeValue: 12400 // Simplified - would need historical analysis
      };

      return {
        ageDistribution,
        genderDistribution,
        shoppingTimes,
        paymentMethods,
        basketAnalysis
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};