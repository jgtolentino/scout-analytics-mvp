import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercentage, getTrendColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  format?: 'currency' | 'number' | 'percentage';
  trend?: number;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  format = 'number', 
  trend, 
  subtitle,
  className 
}: MetricCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      default:
        return formatNumber(val);
    }
  };

  const getTrendIndicator = () => {
    if (trend === undefined) return null;
    
    const isPositive = trend > 0;
    const isNegative = trend < 0;
    
    return (
      <div className={`flex items-center text-sm ${getTrendColor(trend)}`}>
        {isPositive && <TrendingUp className="h-4 w-4 mr-1" />}
        {isNegative && <TrendingDown className="h-4 w-4 mr-1" />}
        {!isPositive && !isNegative && <Minus className="h-4 w-4 mr-1" />}
        {Math.abs(trend).toFixed(1)}%
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {getTrendIndicator()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}