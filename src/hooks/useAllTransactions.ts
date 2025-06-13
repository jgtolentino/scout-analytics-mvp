import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useFilterStore } from '@/state/useFilterStore';
import { BATCH_SIZE } from '@/config/supabase-limits';

export const useAllTransactions = () => {
  const filters = useFilterStore();

  return useQuery({
    queryKey: ['all-transactions', filters.dateRange, filters.brands, filters.barangays, filters.categories],
    queryFn: async () => {
      const startDate = filters.dateRange.from!;
      const endDate = filters.dateRange.to!;
      
      // 1. Get total count first
      const { count } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (!count) {
        console.log('📊 No transactions found in date range');
        return [];
      }

      console.log(`🎯 Total transactions in range: ${count}`);

      // 2. Batch fetch in 1k chunks for optimal performance
      let allData: any[] = [];
      const totalBatches = Math.ceil(count / BATCH_SIZE);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const offset = batchIndex * BATCH_SIZE;
        
        console.log(`📦 Fetching batch ${batchIndex + 1}/${totalBatches} (offset: ${offset})`);
        
        const { data, error } = await supabase
          .from('transactions')
          .select(`
            id,
            total_amount,
            created_at,
            customer_age,
            customer_gender,
            store_location,
            payment_method,
            transaction_items!inner(
              quantity,
              price,
              products!inner(
                name,
                category,
                brands!inner(name)
              )
            )
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
          .range(offset, offset + BATCH_SIZE - 1)
          .order('created_at', { ascending: false });

        if (error) {
          console.error(`❌ Batch ${batchIndex + 1} failed:`, error);
          throw error;
        }

        allData = [...allData, ...(data || [])];
        console.log(`✅ Batch ${batchIndex + 1} complete: ${data?.length || 0} records`);
      }

      console.log(`🎉 Successfully fetched ${allData.length} total transactions!`);
      return allData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};