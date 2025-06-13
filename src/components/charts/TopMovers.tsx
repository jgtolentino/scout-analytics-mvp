import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TopMover {
  name: string;
  value: number;
  change: number;
  category: string;
}

interface TopMoversProps {
  data: TopMover[];
  title: string;
  onItemClick?: (item: TopMover) => void;
}

export function TopMovers({ data, title, onItemClick }: TopMoversProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div
              key={item.name}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                onItemClick 
                  ? 'cursor-pointer hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50' 
                  : ''
              }`}
              onClick={() => onItemClick?.(item)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-8 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    'bg-gray-300'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.value)}
                  </p>
                  <div className={`flex items-center space-x-1 ${
                    item.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.change > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(item.change).toFixed(1)}%
                    </span>
                  </div>
                </div>
                {onItemClick && (
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}