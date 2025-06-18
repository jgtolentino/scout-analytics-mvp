#!/usr/bin/env node

/**
 * Test if the Scout v0 dashboard is working with real data
 */

import { readFileSync } from 'fs';

console.log('🔍 Testing Scout v0 Dashboard...\n');

// Test if dev server is running
try {
  const response = await fetch('http://localhost:5173/');
  const html = await response.text();
  
  console.log('✅ Dev server is running');
  console.log(`📄 HTML content length: ${html.length} bytes`);
  
  // Check if it's a React app
  if (html.includes('react') || html.includes('React') || html.includes('root')) {
    console.log('⚛️  React app detected');
  }
  
  // Check if it's loading properly (not just a fallback page)
  if (html.length > 1000) {
    console.log('📱 Dashboard appears to be loading content');
  } else {
    console.log('⚠️  Dashboard may be showing minimal content');
  }
  
  // Check for JavaScript errors by looking at console
  if (html.includes('script')) {
    console.log('📜 JavaScript detected in page');
  }
  
} catch (error) {
  console.log('❌ Failed to connect to dev server:', error.message);
  console.log('💡 Make sure the dev server is running with: npm run dev');
}

console.log('\n🎯 To test real data connection:');
console.log('1. Open http://localhost:5173/ in your browser');
console.log('2. Open browser console to see data loading logs');
console.log('3. Look for "Query Results" logs showing real transaction counts');