import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface FilterState {
  dateRange: DateRange;
  barangays: string[];
  categories: string[];
  brands: string[];
  stores: string[];
  searchTerm: string;
  quickFilters: {
    topPerformers: boolean;
    newProducts: boolean;
    trending: boolean;
  };
}

interface FilterActions {
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  addFilter: (category: keyof Pick<FilterState, 'barangays' | 'categories' | 'brands' | 'stores'>, value: string) => void;
  removeFilter: (category: keyof Pick<FilterState, 'barangays' | 'categories' | 'brands' | 'stores'>, value: string) => void;
  reset: () => void;
  resetCategory: (category: keyof Pick<FilterState, 'barangays' | 'categories' | 'brands' | 'stores'>) => void;
  getActiveFiltersCount: () => number;
  syncWithURL: () => void;
  updateURL: () => void;
}

const defaultState: FilterState = {
  dateRange: {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  },
  barangays: [],
  categories: [],
  brands: [],
  stores: [],
  searchTerm: '',
  quickFilters: {
    topPerformers: false,
    newProducts: false,
    trending: false
  }
};

export const useFilterStore = create<FilterState & FilterActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,
        
        setFilter: (key, value) => {
          set({ [key]: value });
          get().updateURL();
        },
        
        addFilter: (category, value) => {
          const current = get()[category] as string[];
          if (!current.includes(value)) {
            set({ [category]: [...current, value] });
            get().updateURL();
          }
        },
        
        removeFilter: (category, value) => {
          const current = get()[category] as string[];
          set({ [category]: current.filter(item => item !== value) });
          get().updateURL();
        },
        
        reset: () => {
          set(defaultState);
          get().updateURL();
        },
        
        resetCategory: (category) => {
          set({ [category]: [] });
          get().updateURL();
        },
        
        getActiveFiltersCount: () => {
          const state = get();
          return state.barangays.length + state.categories.length + 
                 state.brands.length + state.stores.length +
                 (state.dateRange.from && state.dateRange.to ? 1 : 0) +
                 (state.searchTerm ? 1 : 0) +
                 Object.values(state.quickFilters).filter(Boolean).length;
        },

        syncWithURL: () => {
          if (typeof window === 'undefined') return;
          
          const params = new URLSearchParams(window.location.search);
          const updates: Partial<FilterState> = {};
          
          // Date range
          const startDate = params.get('startDate');
          const endDate = params.get('endDate');
          if (startDate && endDate) {
            updates.dateRange = { from: new Date(startDate), to: new Date(endDate) };
          }
          
          // Array filters
          ['barangays', 'categories', 'brands', 'stores'].forEach(key => {
            const value = params.get(key);
            if (value) {
              updates[key as keyof FilterState] = value.split(',').filter(Boolean) as any;
            }
          });
          
          // Search term
          const searchTerm = params.get('search');
          if (searchTerm) {
            updates.searchTerm = searchTerm;
          }
          
          if (Object.keys(updates).length > 0) {
            set(updates);
          }
        },
        
        updateURL: () => {
          if (typeof window === 'undefined') return;
          
          const state = get();
          const params = new URLSearchParams();
          
          // Add date range
          if (state.dateRange.from && state.dateRange.to) {
            params.set('startDate', state.dateRange.from.toISOString().split('T')[0]);
            params.set('endDate', state.dateRange.to.toISOString().split('T')[0]);
          }
          
          // Add array filters
          ['barangays', 'categories', 'brands', 'stores'].forEach(key => {
            const values = state[key as keyof FilterState] as string[];
            if (values.length > 0) {
              params.set(key, values.join(','));
            }
          });
          
          // Add search term
          if (state.searchTerm) {
            params.set('search', state.searchTerm);
          }
          
          // Update URL without reload
          const newURL = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newURL);
        }
      }),
      { 
        name: 'scout-filters',
        partialize: (state) => ({
          dateRange: state.dateRange,
          barangays: state.barangays,
          categories: state.categories,
          brands: state.brands,
          stores: state.stores,
          searchTerm: state.searchTerm,
          quickFilters: state.quickFilters
        }),
        // Convert date strings back to Date objects on rehydration
        onRehydrateStorage: () => (state) => {
          if (state && state.dateRange) {
            if (state.dateRange.from && typeof state.dateRange.from === 'string') {
              state.dateRange.from = new Date(state.dateRange.from);
            }
            if (state.dateRange.to && typeof state.dateRange.to === 'string') {
              state.dateRange.to = new Date(state.dateRange.to);
            }
          }
        }
      }
    ),
    { name: 'filter-store' }
  )
);