import { createClient } from '@supabase/supabase-js';
import { SUPABASE_LIMITS } from '../config/supabase-limits';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lcoxtanyckjzyxxcsjzz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const withLimit = (table: keyof typeof SUPABASE_LIMITS, query: any) => {
  const limit = SUPABASE_LIMITS[table] || 1000;
  return query.limit(limit);
};