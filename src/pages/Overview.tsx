import { GlobalFilters } from '@/components/filters/GlobalFilters';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMetrics } from '@/hooks/useMockData';
import { Loader2 } from 'lucide-react';

export function Overview() {
  const { data: metrics, isLoading } = useMetrics();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Real-time retail analytics
        </div>
      </div>
      
      <GlobalFilters />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue}
          format="currency"
          trend={metrics.revenueTrend}
          subtitle="Last 30 days"
        />
        <MetricCard
          title="Total Transactions"
          value={metrics.transactions}
          format="number"
          trend={metrics.transactionsTrend}
          subtitle="Completed orders"
        />
        <MetricCard
          title="Avg Basket Size"
          value={metrics.avgBasketSize}
          format="currency"
          trend={metrics.basketTrend}
          subtitle="Per transaction"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers}
          format="number"
          trend={metrics.customersTrend}
          subtitle="Unique buyers"
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={metrics.revenueTrendData} 
              formatValue="currency"
              color="#3b82f6"
              height={300}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={metrics.topProducts} 
              formatValue="currency"
              color="#10b981"
              height={300}
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue Growth</span>
              <span className={`text-sm font-medium ${metrics.revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.revenueTrend >= 0 ? '+' : ''}{metrics.revenueTrend.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction Growth</span>
              <span className={`text-sm font-medium ${metrics.transactionsTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.transactionsTrend >= 0 ? '+' : ''}{metrics.transactionsTrend.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Customer Growth</span>
              <span className={`text-sm font-medium ${metrics.customersTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metrics.customersTrend >= 0 ? '+' : ''}{metrics.customersTrend.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Avg. Order Value</span>
              <span className="text-sm font-medium">₱{metrics.avgBasketSize.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Orders per Customer</span>
              <span className="text-sm font-medium">{(metrics.transactions / metrics.activeCustomers).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Revenue per Customer</span>
              <span className="text-sm font-medium">₱{(metrics.revenue / metrics.activeCustomers).toFixed(0)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div className="font-medium text-green-600">Top Performing Product</div>
              <div className="text-muted-foreground">{metrics.topProducts[0]?.name}</div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Daily Revenue Target</div>
              <div className="text-muted-foreground">
                {Math.round((metrics.revenue / metrics.revenueTrendData.length) / (metrics.revenue / metrics.revenueTrendData.length) * 100)}% achieved
              </div>
            </div>
            <div className="text-sm">
              <div className="font-medium">Active Promotions</div>
              <div className="text-muted-foreground">3 campaigns running</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}