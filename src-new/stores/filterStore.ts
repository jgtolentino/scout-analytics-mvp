import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface FilterState {
  // Date range
  dateRange: {
    from: Date | null
    to: Date | null
  }
  
  // Geographic filters
  selectedRegions: string[]
  selectedProvinces: string[]
  selectedCities: string[]
  
  // Product filters
  selectedBrands: string[]
  selectedCategories: string[]
  selectedProducts: string[]
  
  // Customer filters
  selectedAgeGroups: string[]
  selectedGenders: string[]
  
  // Drill-down path for hierarchical navigation
  drilldownPath: Array<{
    level: string
    value: string
    label: string
  }>
  
  // Actions
  setDateRange: (from: Date | null, to: Date | null) => void
  toggleRegion: (region: string) => void
  toggleProvince: (province: string) => void
  toggleCity: (city: string) => void
  toggleBrand: (brand: string) => void
  toggleCategory: (category: string) => void
  toggleProduct: (product: string) => void
  toggleAgeGroup: (ageGroup: string) => void
  toggleGender: (gender: string) => void
  
  // Drill-down actions
  drillDown: (level: string, value: string, label: string) => void
  drillUp: (targetLevel: string) => void
  clearDrilldown: () => void
  
  // Utility actions
  clearAllFilters: () => void
  getActiveFiltersCount: () => number
}

export const useFilterStore = create<FilterState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      dateRange: {
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        to: new Date()
      },
      selectedRegions: [],
      selectedProvinces: [],
      selectedCities: [],
      selectedBrands: [],
      selectedCategories: [],
      selectedProducts: [],
      selectedAgeGroups: [],
      selectedGenders: [],
      drilldownPath: [],

      // Date range actions
      setDateRange: (from, to) => set(state => {
        state.dateRange.from = from
        state.dateRange.to = to
      }),

      // Geographic filter actions
      toggleRegion: (region) => set(state => {
        const index = state.selectedRegions.indexOf(region)
        if (index > -1) {
          state.selectedRegions.splice(index, 1)
        } else {
          state.selectedRegions.push(region)
        }
      }),

      toggleProvince: (province) => set(state => {
        const index = state.selectedProvinces.indexOf(province)
        if (index > -1) {
          state.selectedProvinces.splice(index, 1)
        } else {
          state.selectedProvinces.push(province)
        }
      }),

      toggleCity: (city) => set(state => {
        const index = state.selectedCities.indexOf(city)
        if (index > -1) {
          state.selectedCities.splice(index, 1)
        } else {
          state.selectedCities.push(city)
        }
      }),

      // Product filter actions
      toggleBrand: (brand) => set(state => {
        const index = state.selectedBrands.indexOf(brand)
        if (index > -1) {
          state.selectedBrands.splice(index, 1)
        } else {
          state.selectedBrands.push(brand)
        }
      }),

      toggleCategory: (category) => set(state => {
        const index = state.selectedCategories.indexOf(category)
        if (index > -1) {
          state.selectedCategories.splice(index, 1)
        } else {
          state.selectedCategories.push(category)
        }
      }),

      toggleProduct: (product) => set(state => {
        const index = state.selectedProducts.indexOf(product)
        if (index > -1) {
          state.selectedProducts.splice(index, 1)
        } else {
          state.selectedProducts.push(product)
        }
      }),

      // Customer filter actions
      toggleAgeGroup: (ageGroup) => set(state => {
        const index = state.selectedAgeGroups.indexOf(ageGroup)
        if (index > -1) {
          state.selectedAgeGroups.splice(index, 1)
        } else {
          state.selectedAgeGroups.push(ageGroup)
        }
      }),

      toggleGender: (gender) => set(state => {
        const index = state.selectedGenders.indexOf(gender)
        if (index > -1) {
          state.selectedGenders.splice(index, 1)
        } else {
          state.selectedGenders.push(gender)
        }
      }),

      // Drill-down actions
      drillDown: (level, value, label) => set(state => {
        state.drilldownPath.push({ level, value, label })
      }),

      drillUp: (targetLevel) => set(state => {
        const targetIndex = state.drilldownPath.findIndex(item => item.level === targetLevel)
        if (targetIndex > -1) {
          state.drilldownPath.splice(targetIndex + 1)
        }
      }),

      clearDrilldown: () => set(state => {
        state.drilldownPath = []
      }),

      // Utility actions
      clearAllFilters: () => set(state => {
        state.selectedRegions = []
        state.selectedProvinces = []
        state.selectedCities = []
        state.selectedBrands = []
        state.selectedCategories = []
        state.selectedProducts = []
        state.selectedAgeGroups = []
        state.selectedGenders = []
        state.drilldownPath = []
      }),

      getActiveFiltersCount: () => {
        const state = get()
        return (
          state.selectedRegions.length +
          state.selectedProvinces.length +
          state.selectedCities.length +
          state.selectedBrands.length +
          state.selectedCategories.length +
          state.selectedProducts.length +
          state.selectedAgeGroups.length +
          state.selectedGenders.length
        )
      }
    })),
    {
      name: 'scout-filters',
      // Persist only essential filter state
      partialize: (state) => ({
        dateRange: state.dateRange,
        selectedRegions: state.selectedRegions,
        selectedBrands: state.selectedBrands,
        selectedCategories: state.selectedCategories,
      }),
    }
  )
)