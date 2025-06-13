import { createClient } from '@supabase/supabase-js';
import './env';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lcoxtanyckjzyxxcsjzz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxjb3h0YW55Y2tqenl4eGNzanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDUzMjcsImV4cCI6MjA2MzkyMTMyN30.W2JgvZdXubvWpKCNZ7TfjLiKANZO1Hlb164fBEKH2dA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          location: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          location: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          location?: string;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          brand: string;
          category: string;
          subcategory: string | null;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          brand: string;
          category: string;
          subcategory?: string | null;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          brand?: string;
          category?: string;
          subcategory?: string | null;
          price?: number;
          created_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          name: string;
          location: string;
          region: string;
          type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          region: string;
          type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          region?: string;
          type?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          customer_id: string;
          store_id: string;
          transaction_date: string;
          total_amount: number;
          payment_method: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          store_id: string;
          transaction_date: string;
          total_amount: number;
          payment_method: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          store_id?: string;
          transaction_date?: string;
          total_amount?: number;
          payment_method?: string;
          created_at?: string;
        };
      };
      transaction_items: {
        Row: {
          id: string;
          transaction_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          discount: number;
          total: number;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          discount?: number;
          total: number;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          discount?: number;
          total?: number;
        };
      };
    };
    Views: {
      daily_metrics: {
        Row: {
          date: string;
          transaction_count: number;
          unique_customers: number;
          revenue: number;
          avg_transaction_value: number;
        };
      };
    };
  };
}