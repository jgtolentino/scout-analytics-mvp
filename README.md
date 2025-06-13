# 🎯 Scout Analytics - Retail Analytics MVP

A comprehensive retail analytics dashboard built for the Philippine market with real-time insights and advanced filtering capabilities.

## ✨ Features

- **📊 4 Comprehensive Dashboard Pages**
  - Overview - KPIs and revenue trends
  - Transaction Trends - Detailed transaction analytics
  - Product Mix - Category and brand performance
  - Consumer Insights - Customer behavior and demographics

- **🔍 Global Filter System**
  - Date range filtering
  - Multi-select brand filtering
  - Location and region filtering
  - Category filtering
  - URL synchronization for shareable states

- **⚡ Performance Optimized**
  - Code splitting and lazy loading
  - Optimized chart rendering
  - Responsive design for all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd retail-analytics-mvp

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup (Optional)

If you want to use real data instead of mock data:

1. Create a new Supabase project
2. Run the SQL setup script:
```bash
# Copy the contents of scripts/setup-supabase.sql
# and run it in your Supabase SQL editor
```

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand with URL persistence
- **Data Fetching**: TanStack Query
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel

### Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── filters/         # Global filter components
│   ├── charts/          # Chart components
│   ├── dashboard/       # Dashboard-specific components
│   └── layout/          # Layout components
├── pages/               # Dashboard pages
├── hooks/               # Custom hooks and data fetching
├── stores/              # Zustand stores
├── lib/                 # Utilities and configurations
└── types/               # TypeScript type definitions
```

## 📊 Dashboard Pages

### 1. Overview
- Total revenue, transactions, basket size, and customer metrics
- Revenue trend visualization
- Top products performance
- Key performance indicators

### 2. Transaction Trends
- Daily transaction volume analysis
- Transaction value distribution
- Peak hours and time-based patterns
- Heatmap visualization

### 3. Product Mix
- Category performance analysis
- Brand market share
- Product lifecycle tracking
- Growth rate comparisons

### 4. Consumer Insights
- Customer demographics (age, gender)
- Shopping behavior patterns
- Payment method preferences
- Customer lifetime value analysis

## 🎨 Features in Detail

### Global Filters
The application features a sophisticated filtering system that:
- Persists across page navigation
- Synchronizes with URL parameters for shareable states
- Updates all dashboard components reactively
- Supports multiple selection types

### Data Visualization
- **Interactive Charts**: Built with Recharts for smooth interactions
- **Responsive Design**: Charts adapt to different screen sizes
- **Multiple Chart Types**: Line charts, bar charts, pie charts, heatmaps
- **Custom Formatting**: Currency, numbers, and percentages

### Performance
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components load on demand
- **Optimized Builds**: Vite optimization with manual chunks
- **Caching**: React Query for intelligent data caching

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
# Build for production
npm run build

# Serve the dist folder
npm run preview
```

### Environment Variables for Production

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React rules
- **Prettier**: Code formatting (configure as needed)

## 📝 Customization

### Adding New Dashboard Pages

1. Create a new page component in `src/pages/`
2. Add route to `src/App.tsx`
3. Update navigation in `src/components/layout/Navigation.tsx`

### Custom Filters

1. Update the `FilterState` interface in `src/stores/filterStore.ts`
2. Add new filter components in `src/components/filters/`
3. Update URL synchronization logic

### Data Integration

1. Replace mock data hooks in `src/hooks/useMockData.ts`
2. Implement real Supabase queries
3. Update type definitions in `src/types/`

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.ts` with:
- Custom color palette
- shadcn/ui integration
- Responsive breakpoints

### Vite
Optimized configuration with:
- Path aliases (@/)
- Code splitting strategy
- Build optimizations

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Run `npm run typecheck` to identify TypeScript issues
2. **Styling Issues**: Ensure Tailwind classes are properly imported
3. **Data Issues**: Check Supabase connection and RLS policies

### Development Tips

- Use React DevTools for debugging component state
- Check browser console for any runtime errors
- Verify environment variables are properly set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for Philippine retail analytics**