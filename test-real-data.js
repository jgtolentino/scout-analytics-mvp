#!/usr/bin/env node

/**
 * Test script to verify real data connection
 * Tests the Supabase connection with real Philippine FMCG data
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables from .env file
let SUPABASE_URL, SUPABASE_ANON_KEY;

try {
  const envContent = readFileSync('.env', 'utf8');
  const envLines = envContent.split('\n');
  
  envLines.forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      SUPABASE_URL = line.split('=')[1];
    }
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      SUPABASE_ANON_KEY = line.split('=')[1];
    }
  });
} catch (error) {
  console.log('❌ Could not load .env file:', error.message);
}

console.log('🔍 Testing Scout v0 Real Data Connection...\n');

console.log('Environment Check:');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_KEY:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.log('❌ Environment variables not properly set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...');
    
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('transactions')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.log('❌ Connection failed:', healthError.message);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test transaction count
    const { count: transactionCount, error: countError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Transaction count failed:', countError.message);
    } else {
      console.log(`📊 Total transactions: ${transactionCount?.toLocaleString() || 'Unknown'}`);
    }
    
    // Test recent transactions (simplified query)
    const { data: recentTransactions, error: recentError } = await supabase
      .from('transactions')
      .select(`
        transaction_amount,
        quantity,
        transaction_date
      `)
      .order('transaction_date', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.log('❌ Recent transactions failed:', recentError.message);
    } else {
      console.log(`\n📋 Recent transactions (${recentTransactions?.length || 0} found):`);
      recentTransactions?.forEach((tx, i) => {
        console.log(`  ${i+1}. ₱${tx.transaction_amount} - Qty: ${tx.quantity} (${tx.transaction_date})`);
      });
    }
    
    // Test table structure
    const { data: tableColumns, error: schemaError } = await supabase
      .from('transactions')
      .select('*')
      .limit(1);
    
    if (!schemaError && tableColumns?.length > 0) {
      console.log('\n🔍 Transaction table columns:');
      console.log(Object.keys(tableColumns[0]).join(', '));
    }
    
    console.log('\n✅ Real data connection test completed successfully!');
    console.log('🚀 Scout v0 is ready with Philippine FMCG data');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testConnection();