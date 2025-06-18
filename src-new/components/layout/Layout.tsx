import { useState } from 'react'
import { Navigation } from './Navigation'
import { Header } from './Header'
import { GlobalFilterPanel } from '../filters/GlobalFilterPanel'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Navigation 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header 
          setSidebarOpen={setSidebarOpen}
          setFiltersOpen={setFiltersOpen}
        />

        {/* Global Filters Panel */}
        <GlobalFilterPanel 
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        {/* Page content */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}