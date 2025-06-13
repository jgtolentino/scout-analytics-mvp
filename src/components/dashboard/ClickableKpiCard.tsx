import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface ClickableKpiCardProps {
  title: string;
  value: number;
  format?: 'currency' | 'number' | 'percentage';
  trend?: number;
  onClick?: () => void;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function ClickableKpiCard({ 
  title, 
  value, 
  format = 'number', 
  trend, 
  onClick,
  subtitle,
  icon 
}: ClickableKpiCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      default:
        return formatNumber(val);
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-600';
    return trend > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card 
      className={`transition-all duration-200 ${
        onClick 
          ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 hover:bg-blue-50/50' 
          : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon && <div className="text-blue-600">{icon}</div>}
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {onClick && (
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {trend && (
              <div className="flex items-center mt-1 space-x-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {Math.abs(trend).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}