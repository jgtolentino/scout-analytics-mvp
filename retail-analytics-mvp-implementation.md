# 🚀 Retail Analytics MVP - Complete Implementation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Initial Setup](#initial-setup)
4. [Cherry-Picking Strategy](#cherry-picking-strategy)
5. [Core Implementation](#core-implementation)
6. [Global Filter System](#global-filter-system)
7. [Dashboard Pages](#dashboard-pages)
8. [Supabase Integration](#supabase-integration)
9. [Deployment](#deployment)
10. [Performance Optimization](#performance-optimization)

## 🎯 Project Overview

### What We're Building
- **ONE** clean repository combining the best of both existing repos
- **4-page** Scout Dashboard with global filters
- **Zustand** state management with URL synchronization
- **Production-ready** for Vercel + Supabase deployment

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Recharts
- **State**: Zustand + URL sync
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics

## 📁 Repository Structure

```
retail-analytics-mvp/
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── filters/          # Global filter components
│   │   ├── charts/           # Reusable chart components
│   │   └── dashboard/        # Dashboard-specific components
│   ├── pages/
│   │   ├── Overview.tsx
│   │   ├── TransactionTrends.tsx
│   │   ├── ProductMix.tsx
│   │   └── ConsumerInsights.tsx
│   ├── hooks/
│   │   ├── useFilters.ts
│   │   ├── useSupabase.ts
│   │   └── useMetrics.ts
│   ├── stores/
│   │   └── filterStore.ts    # Zustand store
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── scripts/
│   ├── cherry-pick.js        # Smart component extraction
│   └── setup-supabase.sql
├── public/
├── .env.example
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🏗️ Initial Setup

### 1. Create Repository & Install Dependencies

```bash
# Create new repository
mkdir retail-analytics-mvp
cd retail-analytics-mvp
git init

# Create package.json
cat > package.json << 'EOF'
{
  "name": "retail-analytics-mvp",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "cherry-pick": "node scripts/cherry-pick.js"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.39.0",
    "zustand": "^4.4.7",
    "recharts": "^2.9.3",
    "@tanstack/react-query": "^5.12.2",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
EOF

# Install dependencies
npm install

# Install shadcn/ui CLI
npx shadcn-ui@latest init -y
```

### 2. Configuration Files

```bash
# Vite config
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        },
      },
    },
  },
})
EOF

# TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# Tailwind config
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
EOF
```

## 🍒 Cherry-Picking Strategy

### Smart Component Extraction Script

```javascript
// scripts/cherry-pick.js
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const SOURCES = {
  'retail-insights-dashboard-ph': '../retail-insights-dashboard-ph/src',
  'ai-powered-retail-analytics': '../ai-powered-retail-analytics/src'
};

const COMPONENT_MAP = {
  // UI Components
  'components/ui/card.tsx': 'retail-insights-dashboard-ph',
  'components/ui/button.tsx': 'retail-insights-dashboard-ph',
  'components/ui/select.tsx': 'retail-insights-dashboard-ph',
  'components/ui/dialog.tsx': 'retail-insights-dashboard-ph',
  
  // Chart Components
  'components/charts/LineChart.tsx': 'ai-powered-retail-analytics',
  'components/charts/BarChart.tsx': 'ai-powered-retail-analytics',
  'components/charts/PieChart.tsx': 'retail-insights-dashboard-ph',
  
  // Dashboard Components
  'components/dashboard/MetricCard.tsx': 'retail-insights-dashboard-ph',
  'components/dashboard/TrendIndicator.tsx': 'ai-powered-retail-analytics',
};

async function cherryPick() {
  for (const [targetPath, source] of Object.entries(COMPONENT_MAP)) {
    const sourcePath = path.join(SOURCES[source], targetPath);
    const destPath = path.join('./src', targetPath);
    
    try {
      // Create directory if needed
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      
      // Copy file
      const content = await fs.readFile(sourcePath, 'utf-8');
      
      // Clean imports
      const cleanedContent = content
        .replace(/from ['"]@\/retail-insights/g, 'from \'@')
        .replace(/from ['"]@\/ai-powered/g, 'from \'@');
      
      await fs.writeFile(destPath, cleanedContent);
      console.log(`✅ Copied: ${targetPath}`);
    } catch (error) {
      console.log(`⚠️  Skipped: ${targetPath} (not found)`);
    }
  }
}

cherryPick();
```

## 🏗️ Core Implementation

### 1. Global Filter System (Zustand + URL Sync)

```typescript
// src/stores/filterStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface FilterState {
  // Filters
  dateRange: [Date, Date];
  brands: string[];
  locations: string[];
  categories: string[];
  
  // Actions
  setDateRange: (range: [Date, Date]) => void;
  setBrands: (brands: string[]) => void;
  setLocations: (locations: string[]) => void;
  setCategories: (categories: string[]) => void;
  resetFilters: () => void;
  
  // URL Sync
  syncWithURL: () => void;
  updateURL: () => void;
}

const getDefaultDateRange = (): [Date, Date] => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return [start, end];
};

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        dateRange: getDefaultDateRange(),
        brands: [],
        locations: [],
        categories: [],
        
        // Actions
        setDateRange: (range) => set((state) => {
          state.dateRange = range;
          get().updateURL();
        }),
        
        setBrands: (brands) => set((state) => {
          state.brands = brands;
          get().updateURL();
        }),
        
        setLocations: (locations) => set((state) => {
          state.locations = locations;
          get().updateURL();
        }),
        
        setCategories: (categories) => set((state) => {
          state.categories = categories;
          get().updateURL();
        }),
        
        resetFilters: () => set((state) => {
          state.dateRange = getDefaultDateRange();
          state.brands = [];
          state.locations = [];
          state.categories = [];
          get().updateURL();
        }),
        
        // URL Synchronization
        syncWithURL: () => {
          const params = new URLSearchParams(window.location.search);
          
          set((state) => {
            // Date range
            const startDate = params.get('startDate');
            const endDate = params.get('endDate');
            if (startDate && endDate) {
              state.dateRange = [new Date(startDate), new Date(endDate)];
            }
            
            // Brands
            const brands = params.get('brands');
            if (brands) {
              state.brands = brands.split(',');
            }
            
            // Locations
            const locations = params.get('locations');
            if (locations) {
              state.locations = locations.split(',');
            }
            
            // Categories
            const categories = params.get('categories');
            if (categories) {
              state.categories = categories.split(',');
            }
          });
        },
        
        updateURL: () => {
          const state = get();
          const params = new URLSearchParams();
          
          // Add parameters
          params.set('startDate', state.dateRange[0].toISOString());
          params.set('endDate', state.dateRange[1].toISOString());
          
          if (state.brands.length > 0) {
            params.set('brands', state.brands.join(','));
          }
          
          if (state.locations.length > 0) {
            params.set('locations', state.locations.join(','));
          }
          
          if (state.categories.length > 0) {
            params.set('categories', state.categories.join(','));
          }
          
          // Update URL without reload
          const newURL = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState({}, '', newURL);
        },
      })),
      {
        name: 'filter-storage',
        partialize: (state) => ({
          dateRange: state.dateRange,
          brands: state.brands,
          locations: state.locations,
          categories: state.categories,
        }),
      }
    )
  )
);
```

### 2. Global Filter Component

```typescript
// src/components/filters/GlobalFilters.tsx
import { useEffect } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function GlobalFilters() {
  const {
    dateRange,
    brands,
    locations,
    categories,
    setDateRange,
    setBrands,
    setLocations,
    setCategories,
    resetFilters,
    syncWithURL,
  } = useFilterStore();
  
  // Sync with URL on mount
  useEffect(() => {
    syncWithURL();
  }, []);
  
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          className="w-full"
        />
        
        <MultiSelect
          value={brands}
          onChange={setBrands}
          options={[
            { value: 'nestle', label: 'Nestle' },
            { value: 'unilever', label: 'Unilever' },
            { value: 'pg', label: 'P&G' },
            // Add more brands
          ]}
          placeholder="Select brands..."
        />
        
        <MultiSelect
          value={locations}
          onChange={setLocations}
          options={[
            { value: 'ncr', label: 'NCR' },
            { value: 'region-3', label: 'Region 3' },
            { value: 'region-4a', label: 'Region 4A' },
            // Add more locations
          ]}
          placeholder="Select locations..."
        />
        
        <MultiSelect
          value={categories}
          onChange={setCategories}
          options={[
            { value: 'beverages', label: 'Beverages' },
            { value: 'snacks', label: 'Snacks' },
            { value: 'personal-care', label: 'Personal Care' },
            // Add more categories
          ]}
          placeholder="Select categories..."
        />
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}
```

## 📊 Dashboard Pages

### 1. Overview Page

```typescript
// src/pages/Overview.tsx
import { useFilterStore } from '@/stores/filterStore';
import { useMetrics } from '@/hooks/useMetrics';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';

export function Overview() {
  const filters = useFilterStore();
  const { data: metrics, isLoading } = useMetrics(filters);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Overview Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue}
          format="currency"
          trend={metrics.revenueTrend}
        />
        <MetricCard
          title="Transactions"
          value={metrics.transactions}
          format="number"
          trend={metrics.transactionsTrend}
        />
        <MetricCard
          title="Avg Basket Size"
          value={metrics.avgBasketSize}
          format="currency"
          trend={metrics.basketTrend}
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers}
          format="number"
          trend={metrics.customersTrend}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <LineChart data={metrics.revenueTrendData} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <BarChart data={metrics.topProducts} />
        </Card>
      </div>
    </div>
  );
}
```

### 2. Transaction Trends Page

```typescript
// src/pages/TransactionTrends.tsx
import { useFilterStore } from '@/stores/filterStore';
import { useTransactionTrends } from '@/hooks/useTransactionTrends';
import { LineChart } from '@/components/charts/LineChart';
import { HeatMap } from '@/components/charts/HeatMap';
import { Card } from '@/components/ui/card';

export function TransactionTrends() {
  const filters = useFilterStore();
  const { data, isLoading } = useTransactionTrends(filters);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction Trends</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Transaction Volume</h3>
          <LineChart 
            data={data.dailyVolume}
            dataKey="transactions"
            color="#8884d8"
          />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Value Distribution</h3>
          <LineChart 
            data={data.valueDistribution}
            dataKey="value"
            color="#82ca9d"
          />
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Hourly Transaction Heatmap</h3>
        <HeatMap data={data.hourlyHeatmap} />
      </Card>
    </div>
  );
}
```

## 🗄️ Supabase Integration

### 1. Database Schema

```sql
-- scripts/setup-supabase.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Products table  
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    region TEXT NOT NULL,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    store_id UUID REFERENCES stores(id),
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Transaction items table
CREATE TABLE transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_store ON transactions(store_id);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);

-- Create views for common queries
CREATE VIEW daily_metrics AS
SELECT 
    DATE(transaction_date) as date,
    COUNT(DISTINCT id) as transaction_count,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_transaction_value
FROM transactions
GROUP BY DATE(transaction_date);

-- RLS Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Public read access (adjust based on your needs)
CREATE POLICY "Public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON stores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transaction_items FOR SELECT USING (true);
```

### 2. Supabase Client & Hooks

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// src/hooks/useSupabase.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useFilterStore } from '@/stores/filterStore';

export function useMetrics() {
  const filters = useFilterStore();
  
  return useQuery({
    queryKey: ['metrics', filters],
    queryFn: async () => {
      let query = supabase
        .from('daily_metrics')
        .select('*')
        .gte('date', filters.dateRange[0].toISOString())
        .lte('date', filters.dateRange[1].toISOString());
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate aggregated metrics
      return {
        revenue: data.reduce((sum, d) => sum + d.revenue, 0),
        transactions: data.reduce((sum, d) => sum + d.transaction_count, 0),
        avgBasketSize: data.reduce((sum, d) => sum + d.avg_transaction_value, 0) / data.length,
        activeCustomers: new Set(data.flatMap(d => d.unique_customers)).size,
        revenueTrendData: data.map(d => ({
          date: d.date,
          value: d.revenue
        }))
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## 🚀 Deployment

### 1. Environment Variables

```bash
# .env.example
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### 3. GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## ⚡ Performance Optimization

### 1. Code Splitting

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load pages
const Overview = lazy(() => import('./pages/Overview'));
const TransactionTrends = lazy(() => import('./pages/TransactionTrends'));
const ProductMix = lazy(() => import('./pages/ProductMix'));
const ConsumerInsights = lazy(() => import('./pages/ConsumerInsights'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/trends" element={<TransactionTrends />} />
        <Route path="/products" element={<ProductMix />} />
        <Route path="/insights" element={<ConsumerInsights />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. Query Optimization

```typescript
// src/hooks/useOptimizedQuery.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useOptimizedMetrics(filters) {
  return useQuery({
    queryKey: ['optimized-metrics', filters],
    queryFn: async () => {
      // Use RPC for complex queries
      const { data, error } = await supabase.rpc('get_dashboard_metrics', {
        start_date: filters.dateRange[0],
        end_date: filters.dateRange[1],
        brands: filters.brands,
        locations: filters.locations
      });
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
```

## 🎯 Implementation Checklist

- [ ] Initialize repository and install dependencies
- [ ] Set up configuration files (vite, typescript, tailwind)
- [ ] Run cherry-pick script to extract components
- [ ] Implement Zustand filter store with URL sync
- [ ] Create global filter component
- [ ] Build 4 dashboard pages
- [ ] Set up Supabase database and schema
- [ ] Implement data hooks with React Query
- [ ] Add loading states and error handling
- [ ] Optimize performance with code splitting
- [ ] Deploy to Vercel
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and analytics

## 🚦 Success Criteria

1. **Performance**: < 200ms data load time
2. **User Experience**: Smooth filter interactions
3. **Code Quality**: TypeScript strict mode, 0 ESLint errors
4. **Deployment**: Automated CI/CD with < 5 min build time
5. **Monitoring**: Real user metrics tracking

---

This implementation guide provides a complete roadmap for building your retail analytics MVP in a single, clean repository. The approach cherry-picks the best components from your existing repos while implementing your exact specifications for the global filter system and 4-page dashboard.