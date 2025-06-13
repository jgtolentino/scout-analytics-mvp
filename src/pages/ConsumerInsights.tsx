import { GlobalFilters } from '@/components/filters/GlobalFilters';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConsumerInsights } from '@/hooks/useMockData';
import { Loader2, Users, Clock, CreditCard, ShoppingCart } from 'lucide-react';

export function ConsumerInsights() {
  const { data, isLoading } = useConsumerInsights();
  
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
        <h1 className="text-3xl font-bold tracking-tight">Consumer Insights</h1>
        <div className="text-sm text-muted-foreground">
          Customer behavior and demographic analysis
        </div>
      </div>
      
      <GlobalFilters />
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {data.ageDistribution.reduce((sum, age) => sum + age.count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Customers</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{data.basketAnalysis.avgItemsPerBasket}</div>
              <div className="text-sm text-muted-foreground">Avg Items/Basket</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">₱{data.basketAnalysis.avgBasketValue}</div>
              <div className="text-sm text-muted-foreground">Avg Basket Value</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">{data.basketAnalysis.repeatCustomerRate}%</div>
              <div className="text-sm text-muted-foreground">Repeat Customers</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={data.ageDistribution}
              height={300}
              showLegend={true}
              colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart 
              data={data.genderDistribution}
              height={300}
              showLegend={true}
              colors={['#ec4899', '#06b6d4']}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Shopping Behavior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shopping Time Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={data.shoppingTimes.map(time => ({
                name: time.hour,
                value: time.value
              }))}
              dataKey="value"
              color="#10b981"
              height={300}
              formatValue="number"
              layout="horizontal"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Method Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={data.paymentMethods.map(method => ({
                name: method.name,
                value: method.value
              }))}
              dataKey="value"
              color="#3b82f6"
              height={300}
              formatValue="number"
              layout="vertical"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Premium Shoppers</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="w-5/12 bg-purple-500 h-2 rounded-full"></div>
                </div>
                <div className="text-xs text-muted-foreground">High value, frequent purchases</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Regular Customers</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="w-9/12 bg-blue-500 h-2 rounded-full"></div>
                </div>
                <div className="text-xs text-muted-foreground">Consistent purchasing behavior</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Occasional Buyers</span>
                  <span className="text-sm font-medium">33%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="w-8/12 bg-green-500 h-2 rounded-full"></div>
                </div>
                <div className="text-xs text-muted-foreground">Sporadic purchase patterns</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase Patterns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">Peak Shopping Day</div>
              <div className="text-sm text-muted-foreground">Saturday (28% of weekly sales)</div>
            </div>
            <div>
              <div className="text-sm font-medium">Most Popular Time</div>
              <div className="text-sm text-muted-foreground">12-3 PM (35% of daily sales)</div>
            </div>
            <div>
              <div className="text-sm font-medium">Preferred Payment</div>
              <div className="text-sm text-muted-foreground">Cash (45% of transactions)</div>
            </div>
            <div>
              <div className="text-sm font-medium">Avg Visit Duration</div>
              <div className="text-sm text-muted-foreground">23 minutes</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">Average CLV</div>
              <div className="text-2xl font-bold text-green-600">₱{data.basketAnalysis.customerLifetimeValue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Customer Retention</div>
              <div className="text-sm text-muted-foreground">{data.basketAnalysis.repeatCustomerRate}% return within 30 days</div>
            </div>
            <div>
              <div className="text-sm font-medium">Purchase Frequency</div>
              <div className="text-sm text-muted-foreground">2.3 visits per month</div>
            </div>
            <div>
              <div className="text-sm font-medium">Churn Rate</div>
              <div className="text-sm text-red-600">8.5% monthly</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Demographics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-3">Age Groups</h4>
              <div className="space-y-2">
                {data.ageDistribution.map((age) => (
                  <div key={age.name} className="flex justify-between items-center">
                    <span className="text-sm">{age.name} years</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{age.count.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">({age.value}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Payment Methods by Amount</h4>
              <div className="space-y-2">
                {data.paymentMethods.map((method) => (
                  <div key={method.name} className="flex justify-between items-center">
                    <span className="text-sm">{method.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">₱{(method.amount / 1000000).toFixed(1)}M</span>
                      <span className="text-sm text-muted-foreground">({method.value}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}