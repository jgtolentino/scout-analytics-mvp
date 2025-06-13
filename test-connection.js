import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lcoxtanyckjzyxxcsjzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  try {
    // Try to get sample data from potential transaction tables
    const possibleTables = ['transactions', 'transaction', 'sales', 'orders', 'customers', 'products', 'stores', 'brands', 'transaction_items', 'daily_metrics'];
    
    for (const tableName of possibleTables) {
      try {
        const { data: sampleData, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(3);
        
        if (!sampleError && sampleData?.length > 0) {
          console.log(`\n📊 Sample data from '${tableName}' table:`);
          console.log('Column names:', Object.keys(sampleData[0]));
          console.log('Sample record:', sampleData[0]);
          console.log(`Total records: checking...`);
          
          // Get count
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          console.log(`Total records in ${tableName}: ${count}`);
        }
      } catch (e) {
        // Table doesn't exist or no access
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();