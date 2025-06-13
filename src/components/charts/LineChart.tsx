import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ChartData {
  date: string;
  value: number;
  [key: string]: any;
}

interface LineChartProps {
  data: ChartData[];
  dataKey?: string;
  color?: string;
  height?: number;
  formatValue?: 'currency' | 'number';
}

export function LineChart({ 
  data, 
  dataKey = 'value', 
  color = '#3b82f6', 
  height = 300,
  formatValue = 'number'
}: LineChartProps) {
  const formatTooltipValue = (value: any) => {
    if (typeof value !== 'number') return value;
    return formatValue === 'currency' ? formatCurrency(value) : formatNumber(value);
  };

  const formatAxisValue = (value: any) => {
    if (typeof value !== 'number') return value;
    
    if (formatValue === 'currency') {
      return value >= 1000000 ? `₱${(value / 1000000).toFixed(1)}M` : 
             value >= 1000 ? `₱${(value / 1000).toFixed(1)}K` : 
             `₱${value}`;
    }
    
    return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : 
           value >= 1000 ? `${(value / 1000).toFixed(1)}K` : 
           value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="date" 
          className="text-xs"
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }}
        />
        <YAxis 
          className="text-xs"
          tickFormatter={formatAxisValue}
        />
        <Tooltip 
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-US', { 
              weekday: 'short',
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            });
          }}
          formatter={(value) => [formatTooltipValue(value), dataKey]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}