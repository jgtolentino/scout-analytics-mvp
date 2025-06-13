import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface BarChartProps {
  data: ChartData[];
  dataKey?: string;
  color?: string;
  height?: number;
  formatValue?: 'currency' | 'number';
  layout?: 'horizontal' | 'vertical';
}

export function BarChart({ 
  data, 
  dataKey = 'value', 
  color = '#10b981', 
  height = 300,
  formatValue = 'number',
  layout = 'vertical'
}: BarChartProps) {
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
      <RechartsBarChart 
        data={data} 
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        {layout === 'vertical' ? (
          <>
            <XAxis 
              type="number" 
              className="text-xs"
              tickFormatter={formatAxisValue}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              className="text-xs"
              width={100}
            />
          </>
        ) : (
          <>
            <XAxis 
              type="category" 
              dataKey="name" 
              className="text-xs"
            />
            <YAxis 
              type="number" 
              className="text-xs"
              tickFormatter={formatAxisValue}
            />
          </>
        )}
        <Tooltip 
          formatter={(value) => [formatTooltipValue(value), dataKey]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar 
          dataKey={dataKey} 
          fill={color}
          radius={layout === 'vertical' ? [0, 4, 4, 0] : [4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}