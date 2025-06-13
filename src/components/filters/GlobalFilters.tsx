import { useFilterStore } from '@/stores/filterStore';
import { useSyncFilters } from '@/hooks/useSyncFilters';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';

const BRAND_OPTIONS = [
  { value: 'nestle', label: 'Nestle' },
  { value: 'unilever', label: 'Unilever' },
  { value: 'pg', label: 'Procter & Gamble' },
  { value: 'coca-cola', label: 'Coca-Cola' },
  { value: 'pepsi', label: 'PepsiCo' },
  { value: 'jollibee', label: 'Jollibee' },
  { value: 'san-miguel', label: 'San Miguel' },
  { value: 'urc', label: 'Universal Robina' },
];

const LOCATION_OPTIONS = [
  { value: 'ncr', label: 'National Capital Region' },
  { value: 'region-1', label: 'Region 1 (Ilocos)' },
  { value: 'region-2', label: 'Region 2 (Cagayan Valley)' },
  { value: 'region-3', label: 'Region 3 (Central Luzon)' },
  { value: 'region-4a', label: 'Region 4A (CALABARZON)' },
  { value: 'region-4b', label: 'Region 4B (MIMAROPA)' },
  { value: 'region-5', label: 'Region 5 (Bicol)' },
  { value: 'region-6', label: 'Region 6 (Western Visayas)' },
  { value: 'region-7', label: 'Region 7 (Central Visayas)' },
  { value: 'region-8', label: 'Region 8 (Eastern Visayas)' },
  { value: 'region-9', label: 'Region 9 (Zamboanga Peninsula)' },
  { value: 'region-10', label: 'Region 10 (Northern Mindanao)' },
  { value: 'region-11', label: 'Region 11 (Davao)' },
  { value: 'region-12', label: 'Region 12 (SOCCSKSARGEN)' },
];

const CATEGORY_OPTIONS = [
  { value: 'beverages', label: 'Beverages' },
  { value: 'snacks', label: 'Snacks & Confectionery' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'household', label: 'Household Products' },
  { value: 'dairy', label: 'Dairy Products' },
  { value: 'frozen', label: 'Frozen Foods' },
  { value: 'bakery', label: 'Bakery & Bread' },
  { value: 'condiments', label: 'Condiments & Sauces' },
  { value: 'instant', label: 'Instant Foods' },
  { value: 'health', label: 'Health & Wellness' },
];

export function GlobalFilters() {
  const {
    dateRange,
    brands,
    locations,
    categories,
    setDateRange,
    setBrands,
    setLocations,
    setCategories,
    resetFilters,
  } = useFilterStore();
  
  // Use the enhanced sync hook for proper filter persistence
  useSyncFilters();
  
  return (
    <Card className="p-4 mb-6 bg-white shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Brands</label>
          <MultiSelect
            value={brands}
            onChange={setBrands}
            options={BRAND_OPTIONS}
            placeholder="Select brands..."
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Locations</label>
          <MultiSelect
            value={locations}
            onChange={setLocations}
            options={LOCATION_OPTIONS}
            placeholder="Select locations..."
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Categories</label>
          <MultiSelect
            value={categories}
            onChange={setCategories}
            options={CATEGORY_OPTIONS}
            placeholder="Select categories..."
            className="w-full"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Active filters: {[
            brands.length > 0 && `${brands.length} brand${brands.length > 1 ? 's' : ''}`,
            locations.length > 0 && `${locations.length} location${locations.length > 1 ? 's' : ''}`,
            categories.length > 0 && `${categories.length} categor${categories.length > 1 ? 'ies' : 'y'}`,
          ].filter(Boolean).join(', ') || 'None'}
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetFilters}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}