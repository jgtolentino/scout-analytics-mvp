import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  ChartBarIcon, 
  CubeIcon, 
  MapIcon, 
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Overview', href: '/', icon: HomeIcon },
  { name: 'Transaction Analysis', href: '/transactions', icon: ChartBarIcon },
  { name: 'Product Intelligence', href: '/products', icon: CubeIcon },
  { name: 'Regional Insights', href: '/regions', icon: MapIcon },
  { name: 'Consumer Segments', href: '/consumers', icon: UsersIcon },
]

interface NavigationProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Navigation({ sidebarOpen, setSidebarOpen }: NavigationProps) {
  const location = useLocation()

  return (
    <div className={clsx(
      'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    )}>
      {/* Logo and close button */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">Scout Analytics</h1>
            <p className="text-xs text-gray-500">Philippine FMCG Insights</p>
          </div>
        </div>
        <button
          type="button"
          className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
          onClick={() => setSidebarOpen(false)}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-400 group-hover:text-gray-600'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Data source indicator */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Real-time Data</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">18,000+ transactions</p>
      </div>
    </div>
  )
}