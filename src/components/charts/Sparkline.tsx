import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartData } from '@/types';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface SparklineProps {
  data: ChartData[];
  title: string;
  value: string;
  trend: number;
  onClick?: () => void;
}

export function Sparkline({ data, title, value, trend, onClick }: SparklineProps) {
  const isPositiveTrend = trend > 0;
  
  return (
    <Card 
      className={`transition-all duration-200 ${
        onClick 
          ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 hover:bg-blue-50/50' 
          : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <div className={`flex items-center space-x-1 ${
                isPositiveTrend ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 ${isPositiveTrend ? '' : 'rotate-180'}`} />
                <span className="text-sm font-medium">{Math.abs(trend).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          {onClick && (
            <ArrowRight className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 3, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}