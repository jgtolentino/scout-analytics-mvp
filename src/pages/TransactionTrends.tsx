import { GlobalFilters } from '@/components/filters/GlobalFilters';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactionTrends } from '@/hooks/useMockData';
import { Loader2, TrendingUp, Clock, DollarSign } from 'lucide-react';

export function TransactionTrends() {
  const { data, isLoading } = useTransactionTrends();
  
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
        <h1 className="text-3xl font-bold tracking-tight">Transaction Trends</h1>
        <div className="text-sm text-muted-foreground">
          Detailed transaction analytics and patterns
        </div>
      </div>
      
      <GlobalFilters />
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {data.dailyVolume.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">
                {Math.round(data.dailyVolume.reduce((sum, d) => sum + d.value, 0) / data.dailyVolume.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Daily Volume</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold">₱847</div>
              <div className="text-sm text-muted-foreground">Avg Transaction Value</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart 
              data={data.dailyVolume}
              dataKey="value"
              color="#3b82f6"
              height={300}
              formatValue="number"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart 
              data={data.valueDistribution.map(item => ({ 
                name: item.date, 
                value: item.value 
              }))}
              dataKey="value"
              color="#10b981"
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
            <CardTitle>Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Morning (6-12)</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Afternoon (12-18)</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Evening (18-24)</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                    <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">30%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                const percentage = [85, 78, 82, 88, 95, 100, 72][index];
                return (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-sm">{day}</span>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium">Busiest Day</div>
              <div className="text-sm text-muted-foreground">Saturday (avg 285 transactions)</div>
            </div>
            <div>
              <div className="text-sm font-medium">Peak Hour</div>
              <div className="text-sm text-muted-foreground">2:00 PM - 3:00 PM</div>
            </div>
            <div>
              <div className="text-sm font-medium">Growth Trend</div>
              <div className="text-sm text-green-600">+12.5% vs last month</div>
            </div>
            <div>
              <div className="text-sm font-medium">Seasonal Pattern</div>
              <div className="text-sm text-muted-foreground">Higher on weekends</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Volume Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            Transaction intensity by day of week and hour of day
          </div>
          <div className="grid grid-cols-24 gap-1">
            {data.hourlyHeatmap.slice(0, 168).map((item, index) => {
              const intensity = Math.min(item.value / 100, 1);
              return (
                <div
                  key={index}
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                  }}
                  title={`${item.day} ${item.hour}:00 - ${item.value} transactions`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>12 AM</span>
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>11 PM</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}