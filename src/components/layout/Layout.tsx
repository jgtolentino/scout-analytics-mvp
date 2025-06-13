import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';
import { GlobalFilterBar } from '../filters/GlobalFilterBar';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { useSyncFilters } from '@/hooks/useSyncFilters';

export function Layout() {
  // Initialize filter sync on mount
  useSyncFilters();
  
  // Get available filter options
  const filterOptions = useFilterOptions();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Global Filter Bar */}
        <GlobalFilterBar availableOptions={filterOptions} />
        
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}