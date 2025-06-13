import { GlobalFilters } from '@/components/filters/GlobalFilters';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductMix } from '@/hooks/useRealData';
import { Loader2, Package, TrendingUp, Star, Target } from 'lucide-react';

export function ProductMix() {
  const { data, isLoading, error } = useProductMix();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600">Error loading data</p>
          <p className="text-sm text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Mix Analysis</h1>
        <div className="text-sm text-muted-foreground">
          Product performance and category insights
        </div>
      </div>
      
      <GlobalFilters />
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {data.productLifecycle.reduce((sum, p) => sum + p.products, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {data.productLifecycle.find(p => p.stage === 'Growth')?.products || 0}
              </div>
              <div className="text-sm text-muted-foreground">Growth Stage</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {data.brandPerformance[0]?.marketShare.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Top Brand Share</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Target className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={data.categoryPerformance}
              dataKey="value"
              color="#3b82f6"
              height={300}
              formatValue="currency"
              layout="vertical"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Brand Market Share</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={data.brandPerformance.map(brand => ({
                name: brand.name,
                value: brand.marketShare
              }))}
              height={300}
              showLegend={true}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Growth Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.categoryPerformance.map((category) => (
                <div key={category.name} className="flex justify-between items-center">
                  <span className="text-sm">{category.name}</span>
                  <span className={`text-sm font-medium ${
                    category.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {category.growth >= 0 ? '+' : ''}{category.growth.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Product Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.productLifecycle.map((stage) => (
                <div key={stage.stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{stage.stage}</span>
                    <span className="font-medium">{stage.products} products</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${(stage.products / data.productLifecycle.reduce((sum, p) => sum + p.products, 0)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Revenue: {(stage.revenue / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">Highest Revenue Category</div>
              <div className="text-sm text-muted-foreground">
                {data.categoryPerformance[0]?.name} - ₱{(data.categoryPerformance[0]?.value / 1000000).toFixed(1)}M
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Fastest Growing</div>
              <div className="text-sm text-green-600">
                {data.categoryPerformance.reduce((max, cat) => 
                  cat.growth > max.growth ? cat : max
                ).name} (+{data.categoryPerformance.reduce((max, cat) => 
                  cat.growth > max.growth ? cat : max
                ).growth.toFixed(1)}%)
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Market Leader</div>
              <div className="text-sm text-muted-foreground">
                {data.brandPerformance[0]?.name} ({data.brandPerformance[0]?.marketShare.toFixed(1)}% share)
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Total SKUs</div>
              <div className="text-sm text-muted-foreground">
                {data.productLifecycle.reduce((sum, p) => sum + p.products, 0)} active products
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Brand Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Brand Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Brand</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Market Share</th>
                  <th className="text-right p-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {data.brandPerformance.map((brand, index) => (
                  <tr key={brand.name} className="border-b">
                    <td className="p-2 font-medium">{brand.name}</td>
                    <td className="p-2 text-right">₱{(brand.value / 1000000).toFixed(1)}M</td>
                    <td className="p-2 text-right">{brand.marketShare.toFixed(1)}%</td>
                    <td className="p-2 text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${brand.marketShare * 5}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">#{index + 1}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}