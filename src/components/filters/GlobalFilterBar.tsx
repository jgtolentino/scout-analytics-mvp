import React, { useState } from 'react';
import { Calendar, Search, Filter, X, ChevronDown, MapPin, Tag, Store } from 'lucide-react';
import { useFilterStore } from '@/state/useFilterStore';
// import { DateRange } from 'react-day-picker';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface GlobalFilterBarProps {
  availableOptions?: {
    barangays?: FilterOption[];
    categories?: FilterOption[];
    brands?: FilterOption[];
    stores?: FilterOption[];
  };
}

export const GlobalFilterBar: React.FC<GlobalFilterBarProps> = ({ 
  availableOptions = {
    barangays: [],
    categories: [],
    brands: [],
    stores: []
  }
}) => {
  const {
    dateRange,
    barangays,
    categories,
    brands,
    stores,
    searchTerm,
    quickFilters,
    setFilter,
    addFilter,
    removeFilter,
    reset,
    resetCategory,
    getActiveFiltersCount
  } = useFilterStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState({
    barangays: false,
    categories: false,
    brands: false,
    stores: false
  });

  const activeCount = getActiveFiltersCount();

  const FilterDropdown = ({ 
    type, 
    icon: Icon, 
    label, 
    selectedValues, 
    options 
  }: {
    type: keyof typeof showFilters;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    selectedValues: string[];
    options: FilterOption[];
  }) => (
    <div className="relative">
      <button
        onClick={() => setShowFilters(prev => ({ ...prev, [type]: !prev[type] }))}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
          selectedValues.length > 0
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        {selectedValues.length > 0 && (
          <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters[type] ? 'rotate-180' : ''}`} />
      </button>

      {showFilters[type] && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{label}</span>
              {selectedValues.length > 0 && (
                <button
                  onClick={() => resetCategory(type)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="p-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addFilter(type, option.value);
                    } else {
                      removeFilter(type, option.value);
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex-1">{option.label}</span>
                {option.count && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                    {option.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const QuickFilterButton = ({ 
    key, 
    label, 
    active 
  }: { 
    key: keyof typeof quickFilters; 
    label: string; 
    active: boolean; 
  }) => (
    <button
      onClick={() => setFilter('quickFilters', { ...quickFilters, [key]: !active })}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-green-100 text-green-700 border border-green-200'
          : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-white border-b border-gray-200 p-4 space-y-4">
      {/* Main Filter Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products, brands, or stores..."
            value={searchTerm}
            onChange={(e) => setFilter('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setFilter('searchTerm', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Date Range */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
              dateRange.from && dateRange.to
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {dateRange.from && dateRange.to && dateRange.from instanceof Date && dateRange.to instanceof Date
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : 'Date Range'
              }
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
          </button>
          
          {showDatePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
                    setFilter('dateRange', { from: start, to: end });
                    setShowDatePicker(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
                    setFilter('dateRange', { from: start, to: end });
                    setShowDatePicker(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => {
                    const end = new Date();
                    const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
                    setFilter('dateRange', { from: start, to: end });
                    setShowDatePicker(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded"
                >
                  Last 90 days
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Dropdowns */}
        <FilterDropdown
          type="barangays"
          icon={MapPin}
          label="Locations"
          selectedValues={barangays}
          options={availableOptions.barangays || []}
        />

        <FilterDropdown
          type="categories"
          icon={Tag}
          label="Categories"
          selectedValues={categories}
          options={availableOptions.categories || []}
        />

        <FilterDropdown
          type="brands"
          icon={Filter}
          label="Brands"
          selectedValues={brands}
          options={availableOptions.brands || []}
        />

        <FilterDropdown
          type="stores"
          icon={Store}
          label="Stores"
          selectedValues={stores}
          options={availableOptions.stores || []}
        />

        {/* Clear All */}
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All ({activeCount})
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
        <QuickFilterButton
          key="topPerformers"
          label="Top Performers"
          active={quickFilters.topPerformers}
        />
        <QuickFilterButton
          key="newProducts"
          label="New Products"
          active={quickFilters.newProducts}
        />
        <QuickFilterButton
          key="trending"
          label="Trending"
          active={quickFilters.trending}
        />
      </div>

      {/* Active Filters Display */}
      {(barangays.length > 0 || categories.length > 0 || brands.length > 0 || stores.length > 0) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Active Filters:</span>
          
          {barangays.map(item => (
            <span
              key={`barangay-${item}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              <MapPin className="w-3 h-3" />
              {item}
              <button
                onClick={() => removeFilter('barangays', item)}
                className="hover:text-blue-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {categories.map(item => (
            <span
              key={`category-${item}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
            >
              <Tag className="w-3 h-3" />
              {item}
              <button
                onClick={() => removeFilter('categories', item)}
                className="hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {brands.map(item => (
            <span
              key={`brand-${item}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
            >
              <Filter className="w-3 h-3" />
              {item}
              <button
                onClick={() => removeFilter('brands', item)}
                className="hover:text-purple-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {stores.map(item => (
            <span
              key={`store-${item}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
            >
              <Store className="w-3 h-3" />
              {item}
              <button
                onClick={() => removeFilter('stores', item)}
                className="hover:text-orange-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};