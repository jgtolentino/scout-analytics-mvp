import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface FilterState {
  // Filters
  dateRange: [Date, Date];
  brands: string[];
  locations: string[];
  categories: string[];
  
  // Actions
  setDateRange: (range: [Date, Date]) => void;
  setBrands: (brands: string[]) => void;
  setLocations: (locations: string[]) => void;
  setCategories: (categories: string[]) => void;
  resetFilters: () => void;
  
  // URL Sync
  syncWithURL: () => void;
  updateURL: () => void;
}

const getDefaultDateRange = (): [Date, Date] => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return [start, end];
};

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        dateRange: getDefaultDateRange(),
        brands: [],
        locations: [],
        categories: [],
        
        // Actions
        setDateRange: (range) => {
          set({ dateRange: range });
          get().updateURL();
        },
        
        setBrands: (brands) => {
          set({ brands });
          get().updateURL();
        },
        
        setLocations: (locations) => {
          set({ locations });
          get().updateURL();
        },
        
        setCategories: (categories) => {
          set({ categories });
          get().updateURL();
        },
        
        resetFilters: () => {
          set({
            dateRange: getDefaultDateRange(),
            brands: [],
            locations: [],
            categories: []
          });
          get().updateURL();
        },
        
        // URL Synchronization
        syncWithURL: () => {
          if (typeof window === 'undefined') return;
          
          const params = new URLSearchParams(window.location.search);
          const updates: Partial<FilterState> = {};
          
          // Date range
          const startDate = params.get('startDate');
          const endDate = params.get('endDate');
          if (startDate && endDate) {
            updates.dateRange = [new Date(startDate), new Date(endDate)];
          }
          
          // Brands
          const brands = params.get('brands');
          if (brands) {
            updates.brands = brands.split(',').filter(Boolean);
          }
          
          // Locations
          const locations = params.get('locations');
          if (locations) {
            updates.locations = locations.split(',').filter(Boolean);
          }
          
          // Categories
          const categories = params.get('categories');
          if (categories) {
            updates.categories = categories.split(',').filter(Boolean);
          }
          
          if (Object.keys(updates).length > 0) {
            set(updates);
          }
        },
        
        updateURL: () => {
          if (typeof window === 'undefined') return;
          
          const state = get();
          const params = new URLSearchParams();
          
          // Add parameters
          params.set('startDate', state.dateRange[0].toISOString().split('T')[0]);
          params.set('endDate', state.dateRange[1].toISOString().split('T')[0]);
          
          if (state.brands.length > 0) {
            params.set('brands', state.brands.join(','));
          }
          
          if (state.locations.length > 0) {
            params.set('locations', state.locations.join(','));
          }
          
          if (state.categories.length > 0) {
            params.set('categories', state.categories.join(','));
          }
          
          // Update URL without reload
          const newURL = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newURL);
        },
      }),
      {
        name: 'filter-storage',
        partialize: (state) => ({
          dateRange: state.dateRange,
          brands: state.brands,
          locations: state.locations,
          categories: state.categories,
        }),
      }
    ),
    { name: 'filter-store' }
  )
);