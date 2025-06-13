import { useEffect } from 'react';
import { useFilterStore } from '../stores/filterStore';

/**
 * Hook to ensure filter state synchronization with URL across page navigation
 * This fixes the issue where filters don't persist when navigating between pages
 */
export const useSyncFilters = () => {
  const syncWithURL = useFilterStore((state) => state.syncWithURL);
  
  useEffect(() => {
    // Sync filters with URL on component mount
    syncWithURL();
    
    // Listen for popstate events (browser back/forward)
    const handlePopState = () => {
      syncWithURL();
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncWithURL]);
  
  // Also sync when the URL changes programmatically
  useEffect(() => {
    const handleLocationChange = () => {
      syncWithURL();
    };
    
    // Create a custom event listener for programmatic navigation
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };
    
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [syncWithURL]);
};