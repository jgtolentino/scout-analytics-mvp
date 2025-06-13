import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { SUPABASE_LIMITS } from '@/config/supabase-limits';

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface FilterOptionsResult {
  barangays: FilterOption[];
  categories: FilterOption[];
  brands: FilterOption[];
  stores: FilterOption[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch all available filter options with counts
 * Used to populate the GlobalFilterBar dropdowns
 */
export const useFilterOptions = (): FilterOptionsResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['filter-options'],
    queryFn: async () => {
      console.log('🔍 Fetching filter options...');

      // Fetch unique locations from transactions
      const { data: locationData, error: locationError } = await supabase
        .from('transactions')
        .select('store_location')
        .limit(SUPABASE_LIMITS.transactions);

      if (locationError) throw locationError;

      // Fetch categories from products
      const { data: categoryData, error: categoryError } = await supabase
        .from('products')
        .select('category')
        .limit(SUPABASE_LIMITS.products);

      if (categoryError) throw categoryError;

      // Fetch brands
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('name')
        .limit(SUPABASE_LIMITS.brands);

      if (brandError) throw brandError;

      // Process locations (barangays)
      const locationCounts = new Map<string, number>();
      locationData?.forEach(item => {
        if (item.store_location) {
          locationCounts.set(
            item.store_location, 
            (locationCounts.get(item.store_location) || 0) + 1
          );
        }
      });

      const barangays: FilterOption[] = Array.from(locationCounts.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count
        }))
        .sort((a, b) => b.count - a.count);

      // Process categories
      const categoryCounts = new Map<string, number>();
      categoryData?.forEach(item => {
        if (item.category) {
          categoryCounts.set(
            item.category, 
            (categoryCounts.get(item.category) || 0) + 1
          );
        }
      });

      const categories: FilterOption[] = Array.from(categoryCounts.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count
        }))
        .sort((a, b) => b.count - a.count);

      // Process brands
      const brands: FilterOption[] = (brandData || [])
        .filter(item => item.name)
        .map(item => ({
          value: item.name,
          label: item.name,
          count: 1 // Would need join to get actual transaction counts
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      // For stores, we'll use unique locations as well
      const stores: FilterOption[] = barangays.map(location => ({
        value: location.value,
        label: `Store in ${location.label}`,
        count: location.count
      }));

      console.log(`✅ Filter options loaded:`, {
        barangays: barangays.length,
        categories: categories.length,
        brands: brands.length,
        stores: stores.length
      });

      return {
        barangays,
        categories,
        brands,
        stores
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - filter options don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  return {
    barangays: data?.barangays ?? [],
    categories: data?.categories ?? [],
    brands: data?.brands ?? [],
    stores: data?.stores ?? [],
    isLoading,
    error: error as Error | null
  };
};