import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface PieChartProps {
  data: ChartData[];
  dataKey?: string;
  height?: number;
  formatValue?: 'currency' | 'number' | 'percentage';
  showLegend?: boolean;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export function PieChart({ 
  data, 
  dataKey = 'value', 
  height = 300,
  formatValue = 'number',
  showLegend = true,
  colors = DEFAULT_COLORS
}: PieChartProps) {
  const formatTooltipValue = (value: any) => {
    if (typeof value !== 'number') return value;
    
    switch (formatValue) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return formatNumber(value);
    }
  };

  const total = data.reduce((sum, item) => sum + item[dataKey], 0);

  const formatLabelValue = (entry: any) => {
    const percentage = ((entry[dataKey] / total) * 100).toFixed(1);
    return `${entry.name}: ${percentage}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={formatLabelValue}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value, name) => [formatTooltipValue(value), name]}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        {showLegend && (
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => `${value}`}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}