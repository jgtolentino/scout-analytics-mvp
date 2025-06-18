import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, CalendarIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline'
import { useFilterStore } from '../../stores/filterStore'

interface GlobalFilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalFilterPanel({ isOpen, onClose }: GlobalFilterPanelProps) {
  const { 
    dateRange, 
    selectedRegions, 
    selectedBrands, 
    selectedCategories,
    setDateRange,
    toggleRegion,
    toggleBrand,
    toggleCategory,
    clearAllFilters
  } = useFilterStore()

  const regions = [
    'National Capital Region (NCR)',
    'CALABARZON',
    'Central Luzon',
    'Western Visayas',
    'Northern Mindanao',
    'Central Visayas'
  ]

  const brands = [
    'Alaska Milk',
    'Oishi',
    'Del Monte',
    'Champion',
    'Winston',
    'Nestle',
    'Coca-Cola',
    'Lucky Me'
  ]

  const categories = [
    'Dairy & Nutrition',
    'Snacks & Confectionery', 
    'Processed Foods',
    'Household Care',
    'Beverages',
    'Personal Care'
  ]

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-blue-600 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          Global Filters
                        </Dialog.Title>
                        <button
                          type="button"
                          className="text-blue-200 hover:text-white"
                          onClick={onClose}
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-blue-100">
                        Filter data across all dashboard views
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                      {/* Date Range */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-900 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="date"
                            value={dateRange.from?.toISOString().split('T')[0] || ''}
                            onChange={(e) => setDateRange(new Date(e.target.value), dateRange.to)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="date"
                            value={dateRange.to?.toISOString().split('T')[0] || ''}
                            onChange={(e) => setDateRange(dateRange.from, new Date(e.target.value))}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      {/* Regions */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-900 mb-3">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          Regions ({selectedRegions.length} selected)
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {regions.map((region) => (
                            <label key={region} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRegions.includes(region)}
                                onChange={() => toggleRegion(region)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{region}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Brands */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-900 mb-3">
                          <TagIcon className="h-4 w-4 mr-2" />
                          Brands ({selectedBrands.length} selected)
                        </label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {brands.map((brand) => (
                            <label key={brand} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-900 mb-3">
                          <TagIcon className="h-4 w-4 mr-2" />
                          Categories ({selectedCategories.length} selected)
                        </label>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <label key={category} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Clear All
                        </button>
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}