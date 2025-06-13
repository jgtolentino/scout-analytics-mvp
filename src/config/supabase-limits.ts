/**
 * PERMANENT FIX FOR SUPABASE 1000 ROW LIMITS
 * Configure your table limits here once and never worry about them again!
 */
export const SUPABASE_LIMITS = {
  transactions: 25000,        // Your main 18K+ transaction table
  transaction_items: 50000,   // Line items (higher volume)
  products: 5000,             // Product catalog
  customers: 10000,           // Customer records
  stores: 100,                // Store locations
  brands: 1000                // Brand directory
};

export const BATCH_SIZE = 1000; // Process in 1k chunks for optimal performance