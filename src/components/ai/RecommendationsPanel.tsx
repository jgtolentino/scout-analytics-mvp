import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap, 
  ChevronRight,
  Lightbulb,
  BarChart3,
  Users,
  Package,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useFilterStore } from '@/state/useFilterStore';

interface Recommendation {
  id: string;
  type: 'opportunity' | 'warning' | 'insight' | 'action';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  category: 'revenue' | 'products' | 'customers' | 'operations';
  actionItems: string[];
  metrics?: {
    current: number;
    potential: number;
    unit: string;
  };
}

interface RecommendationsPanelProps {
  className?: string;
}

// Mock AI recommendations - in production, this would call OpenAI/Claude API
const generateMockRecommendations = (filters: any): Recommendation[] => {
  const baseRecommendations: Recommendation[] = [
    {
      id: 'rev-001',
      type: 'opportunity',
      priority: 'high',
      title: 'Expand Popular Categories in High-Traffic Locations',
      description: 'Beverages show 45% higher sales in Metro Manila stores but are understocked compared to demand patterns.',
      impact: 'Potential ₱2.3M monthly revenue increase',
      confidence: 87,
      category: 'revenue',
      actionItems: [
        'Increase beverage inventory by 30% in Metro Manila stores',
        'Introduce premium beverage lines',
        'Optimize shelf placement for beverages'
      ],
      metrics: {
        current: 12500000,
        potential: 14800000,
        unit: '₱'
      }
    },
    {
      id: 'cust-001',
      type: 'insight',
      priority: 'medium',
      title: 'Peak Shopping Hours Optimization',
      description: '68% of transactions occur between 6-9 PM, but staffing is optimized for daytime hours.',
      impact: 'Reduce wait times by 40%',
      confidence: 92,
      category: 'operations',
      actionItems: [
        'Adjust staff schedules for evening peak',
        'Implement express checkout lanes 6-9 PM',
        'Optimize product restocking schedule'
      ]
    },
    {
      id: 'prod-001',
      type: 'warning',
      priority: 'high',
      title: 'Declining Category Performance',
      description: 'Personal Care products show -15% trend over the last 30 days across all locations.',
      impact: 'Risk of ₱800K revenue loss',
      confidence: 78,
      category: 'products',
      actionItems: [
        'Investigate personal care supplier issues',
        'Launch promotional campaigns',
        'Review competitor pricing'
      ],
      metrics: {
        current: 2800000,
        potential: 2000000,
        unit: '₱'
      }
    },
    {
      id: 'mark-001',
      type: 'action',
      priority: 'medium',
      title: 'Cross-Selling Opportunity',
      description: 'Customers buying household items have 73% likelihood to purchase cleaning products when offered.',
      impact: 'Increase basket size by ₱150',
      confidence: 85,
      category: 'revenue',
      actionItems: [
        'Set up bundled displays',
        'Train staff on cross-selling techniques',
        'Implement recommendation system at checkout'
      ]
    },
    {
      id: 'inv-001',
      type: 'insight',
      priority: 'low',
      title: 'Seasonal Demand Pattern',
      description: 'Ice cream sales spike 200% during hot weather days (>32°C). Current inventory planning doesn\'t account for weather.',
      impact: 'Reduce stockouts by 60%',
      confidence: 91,
      category: 'operations',
      actionItems: [
        'Integrate weather data into inventory planning',
        'Set up automated reorder triggers',
        'Coordinate with suppliers for rapid restocking'
      ]
    }
  ];

  // Filter recommendations based on current filter state
  return baseRecommendations.filter(rec => {
    if (filters.categories?.length > 0) {
      return rec.description.toLowerCase().includes(filters.categories[0].toLowerCase());
    }
    if (filters.barangays?.length > 0) {
      return rec.description.toLowerCase().includes('location') || rec.description.toLowerCase().includes('store');
    }
    return true;
  });
};

const getTypeIcon = (type: Recommendation['type']) => {
  switch (type) {
    case 'opportunity': return TrendingUp;
    case 'warning': return AlertTriangle;
    case 'insight': return Lightbulb;
    case 'action': return Target;
    default: return Brain;
  }
};

const getTypeColor = (type: Recommendation['type']) => {
  switch (type) {
    case 'opportunity': return 'text-green-600 bg-green-100';
    case 'warning': return 'text-red-600 bg-red-100';
    case 'insight': return 'text-blue-600 bg-blue-100';
    case 'action': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getPriorityColor = (priority: Recommendation['priority']) => {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryIcon = (category: Recommendation['category']) => {
  switch (category) {
    case 'revenue': return BarChart3;
    case 'products': return Package;
    case 'customers': return Users;
    case 'operations': return Zap;
    default: return Brain;
  }
};

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({ className = '' }) => {
  // const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [expandedRec, setExpandedRec] = useState<string | null>(null);
  const filters = useFilterStore();

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['ai-recommendations', filters.dateRange, filters.brands, filters.categories, filters.barangays],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateMockRecommendations(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center space-y-4">
          <div className="animate-spin">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">AI Analyzing Data...</h3>
            <p className="text-gray-600">Generating personalized recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
              <p className="text-sm text-gray-600">
                {recommendations?.length || 0} insights based on your data
              </p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh recommendations"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="max-h-96 overflow-y-auto">
        {recommendations?.map((rec) => {
          const TypeIcon = getTypeIcon(rec.type);
          const CategoryIcon = getCategoryIcon(rec.category);
          const isExpanded = expandedRec === rec.id;
          
          return (
            <div
              key={rec.id}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Main Recommendation Row */}
              <div className="flex items-start gap-3">
                {/* Type Icon */}
                <div className={`p-2 rounded-lg ${getTypeColor(rec.type)}`}>
                  <TypeIcon className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{rec.title}</h4>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)}`} />
                        <CategoryIcon className="w-3 h-3 text-gray-500" />
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-medium text-green-600">{rec.impact}</span>
                        <span className="text-gray-500">Confidence: {rec.confidence}%</span>
                      </div>

                      {/* Metrics */}
                      {rec.metrics && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <div className="flex justify-between">
                            <span>Current: {rec.metrics.unit}{rec.metrics.current.toLocaleString()}</span>
                            <span className="font-medium text-green-600">
                              Target: {rec.metrics.unit}{rec.metrics.potential.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedRec(isExpanded ? null : rec.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Action Items */}
                  {isExpanded && (
                    <div className="mt-3 pl-4 border-l-2 border-blue-200">
                      <h5 className="text-xs font-medium text-gray-900 mb-2">Recommended Actions:</h5>
                      <ul className="space-y-1">
                        {rec.actionItems.map((action, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex gap-2 mt-3">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                          Implement
                        </button>
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Last updated: {new Date().toLocaleString()}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>AI Confidence: 85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};