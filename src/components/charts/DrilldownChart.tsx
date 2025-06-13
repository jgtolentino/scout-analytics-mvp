import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useFilterStore } from '@/state/useFilterStore';

interface DrilldownLevel {
  title: string;
  data: any[];
  type: 'bar' | 'pie';
  dataKey: string;
  nameKey: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DrilldownChartProps {
  title: string;
  levels: DrilldownLevel[];
  onDrillDown?: (level: number, item: any) => void;
  className?: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

export const DrilldownChart: React.FC<DrilldownChartProps> = ({
  title,
  levels,
  onDrillDown,
  className = ''
}) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState<string[]>([title]);
  const { addFilter } = useFilterStore();

  const currentData = levels[currentLevel];

  const handleItemClick = (item: any) => {
    // If we can drill down further
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setBreadcrumb([...breadcrumb, item[currentData.nameKey]]);
      
      // Apply filter based on clicked item
      if (currentLevel === 0 && currentData.title.toLowerCase().includes('category')) {
        addFilter('categories', item[currentData.nameKey]);
      } else if (currentData.title.toLowerCase().includes('brand')) {
        addFilter('brands', item[currentData.nameKey]);
      } else if (currentData.title.toLowerCase().includes('location')) {
        addFilter('barangays', item[currentData.nameKey]);
      }
    }

    // Call optional callback
    onDrillDown?.(currentLevel, item);
  };

  const handleBackClick = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
      setBreadcrumb(breadcrumb.slice(0, -1));
    }
  };

  const formatValue = (value: number) => {
    if (currentData.dataKey === 'revenue' || currentData.dataKey === 'value') {
      return `₱${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            {formatValue(payload[0].value)}
          </p>
          {currentLevel < levels.length - 1 && (
            <p className="text-xs text-gray-500 mt-1">
              Click to drill down
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomBarLabel = ({ x, y, width, height }: any) => {
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {currentLevel < levels.length - 1 && '👆'}
      </text>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header with Breadcrumb */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentData.icon && <currentData.icon className="w-5 h-5 text-gray-600" />}
            <h3 className="text-lg font-semibold text-gray-900">{currentData.title}</h3>
          </div>
          
          {currentLevel > 0 && (
            <button
              onClick={handleBackClick}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
          {breadcrumb.map((crumb, index) => (
            <React.Fragment key={index}>
              <span 
                className={index === breadcrumb.length - 1 ? 'font-medium text-gray-900' : 'hover:text-gray-900 cursor-pointer'}
                onClick={() => {
                  if (index < breadcrumb.length - 1) {
                    setCurrentLevel(index);
                    setBreadcrumb(breadcrumb.slice(0, index + 1));
                  }
                }}
              >
                {crumb}
              </span>
              {index < breadcrumb.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Level Indicator */}
        <div className="flex items-center gap-2 mt-2">
          {levels.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentLevel ? 'bg-blue-600' : 
                index < currentLevel ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-2">
            Level {currentLevel + 1} of {levels.length}
          </span>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-4" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {currentData.type === 'bar' ? (
            <BarChart data={currentData.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={currentData.nameKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey={currentData.dataKey}
                fill={currentData.color || '#3B82F6'}
                cursor={currentLevel < levels.length - 1 ? 'pointer' : 'default'}
                onClick={handleItemClick}
                radius={[4, 4, 0, 0]}
              >
                {currentLevel < levels.length - 1 && (
                  <CustomBarLabel />
                )}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={currentData.data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                dataKey={currentData.dataKey}
                nameKey={currentData.nameKey}
                onClick={handleItemClick}
                cursor={currentLevel < levels.length - 1 ? 'pointer' : 'default'}
              >
                {currentData.data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Data Table for Current Level */}
      <div className="border-t border-gray-100 max-h-48 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-900">
                {currentData.nameKey === 'name' ? 'Name' : 'Category'}
              </th>
              <th className="px-4 py-2 text-right font-medium text-gray-900">
                {currentData.dataKey === 'revenue' || currentData.dataKey === 'value' ? 'Revenue' : 'Count'}
              </th>
              {currentLevel < levels.length - 1 && (
                <th className="px-4 py-2 text-center font-medium text-gray-900 w-16">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.data.map((item, index) => (
              <tr 
                key={index}
                className={`border-t border-gray-100 ${
                  currentLevel < levels.length - 1 ? 'hover:bg-gray-50 cursor-pointer' : ''
                }`}
                onClick={() => currentLevel < levels.length - 1 && handleItemClick(item)}
              >
                <td className="px-4 py-2 text-gray-900">{item[currentData.nameKey]}</td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {formatValue(item[currentData.dataKey])}
                </td>
                {currentLevel < levels.length - 1 && (
                  <td className="px-4 py-2 text-center">
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Insights */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900">{currentData.data.length}</div>
            <div className="text-gray-600">Items</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {formatValue(currentData.data.reduce((sum, item) => sum + item[currentData.dataKey], 0))}
            </div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {formatValue(Math.max(...currentData.data.map(item => item[currentData.dataKey])))}
            </div>
            <div className="text-gray-600">Top Value</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">
              {formatValue(currentData.data.reduce((sum, item) => sum + item[currentData.dataKey], 0) / currentData.data.length)}
            </div>
            <div className="text-gray-600">Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};