import { useNavigate } from 'react-router-dom';
import { GlobalFilters } from '@/components/filters/GlobalFilters';
import { ClickableKpiCard } from '@/components/dashboard/ClickableKpiCard';
import { Sparkline } from '@/components/charts/Sparkline';
import { TopMovers } from '@/components/charts/TopMovers';
import { useMetrics } from '@/hooks/useRealData';
import { Loader2, DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function Overview() {
  const { data: metrics, isLoading, error } = useMetrics();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading data</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  // Mock top movers data (would come from real data in production)
  const topMovers = [
    { name: "Nestle Milo", value: 2850000, change: 12.5, category: "Beverages" },
    { name: "Coca-Cola Classic", value: 2100000, change: 8.3, category: "Beverages" },
    { name: "Lucky Me Instant", value: 1750000, change: -2.1, category: "Food" },
    { name: "Unilever Dove", value: 1650000, change: 15.7, category: "Personal Care" },
    { name: "San Miguel Beer", value: 1200000, change: 6.4, category: "Beverages" }
  ];
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Executive Overview</h1>
          <p className="text-sm text-gray-600 mt-1">Real-time retail analytics dashboard</p>
        </div>
      </div>
      
      <GlobalFilters />
      
      {/* L0: Core KPIs - Maximum 4 for clean overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClickableKpiCard
          title="Total Revenue"
          value={metrics.revenue}
          format="currency"
          trend={metrics.revenueTrend}
          subtitle="Last 30 days"
          icon={<DollarSign className="h-5 w-5" />}
          onClick={() => navigate('/transaction-trends')}
        />
        <ClickableKpiCard
          title="Transactions"
          value={metrics.transactions}
          format="number"
          trend={metrics.transactionsTrend}
          subtitle="Total count"
          icon={<ShoppingCart className="h-5 w-5" />}
          onClick={() => navigate('/transaction-trends')}
        />
        <ClickableKpiCard
          title="Avg Basket"
          value={metrics.avgBasketSize}
          format="currency"
          trend={metrics.basketTrend}
          subtitle="Per transaction"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <ClickableKpiCard
          title="Active Customers"
          value={metrics.activeCustomers}
          format="number"
          trend={metrics.customersTrend}
          subtitle="Unique buyers"
          icon={<Users className="h-5 w-5" />}
          onClick={() => navigate('/consumer-insights')}
        />
      </div>

      {/* L0: Essential Charts - Only sparkline + top movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Sparkline
          data={metrics.revenueTrendData}
          title="Revenue Trend"
          value={formatCurrency(metrics.revenue)}
          trend={metrics.revenueTrend}
          onClick={() => navigate('/transaction-trends')}
        />
        <TopMovers
          data={topMovers}
          title="Top Performing Products"
          onItemClick={(item) => navigate(`/product-mix?category=${encodeURIComponent(item.category)}`)}
        />
      </div>

      {/* Quick Action Hint */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          💡 Click any metric or chart above to dive deeper into the data
        </p>
      </div>
    </div>
  );
}