import { 
  Bars3Icon, 
  AdjustmentsHorizontalIcon,
  BellIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
  setFiltersOpen: (open: boolean) => void
}

const pageNames: Record<string, string> = {
  '/': 'Executive Overview',
  '/transactions': 'Transaction Analysis',
  '/products': 'Product Intelligence',
  '/regions': 'Regional Insights',
  '/consumers': 'Consumer Segments',
}

export function Header({ setSidebarOpen, setFiltersOpen }: HeaderProps) {
  const location = useLocation()
  const currentPageName = pageNames[location.pathname] || 'Scout Analytics'

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Page title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentPageName}
            </h1>
            <p className="text-sm text-gray-500">
              Philippine retail analytics powered by real-time data
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search insights..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters button */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setFiltersOpen(true)}
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User avatar */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">JT</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">John Tolentino</p>
              <p className="text-xs text-gray-500">Analytics Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}