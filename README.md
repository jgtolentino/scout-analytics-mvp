# Scout Analytics v3.3 - Clean v2.0 Baseline

A production-ready analytics dashboard targeting v3.3.0 features built on a clean v2.0 baseline with hash-locked agents and hardened CI/CD.

## 🎯 Overview

This repository implements Scout Analytics v3.3 specification with dual-DB analytics, AI insights, and CES chat features. Built on a clean v2.0 baseline (last stable before 3.x experiments) to avoid complexity while delivering advanced functionality including BrandBot AI panel, real-time filters, and 10-stage CI/CD pipeline.

## 🚀 Quick Start

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
scout-analytics-mvp/
├── docs/
│   └── end_state_v3.3.yaml           # v3.3 specification
├── packages/
│   └── agents/                        # Hash-locked agents
│       ├── repo/                      # Cross-repo operations
│       ├── keykey/                    # API key management
│       ├── basher/                    # Bash script execution
│       ├── caca/                      # QA and testing
│       └── claude/                    # AI development assistance
├── scripts/
│   ├── lock-agent.sh                  # Agent hash locking
│   └── performance-test.cjs           # Performance testing
├── src/
│   ├── components/
│   │   └── filters/
│   │       └── GlobalFilterBar.tsx    # Advanced filtering interface
│   ├── state/
│   │   └── useFilterStore.ts          # Zustand state management
│   ├── App.tsx                        # Main application
│   ├── main.tsx                       # React entry point
│   └── index.css                      # Tailwind CSS styles
├── .pulserrc                          # Agent hash locks
├── index.html                         # HTML entry point
├── vite.config.ts                     # Vite configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies and scripts
```

## 🔧 Features

### v3.3 Dashboard Pages
- **Overview** (`/`) - KPI cards, trend lines, category performance, AI insight panel
- **Trends** (`/trends`) - Temporal patterns, peak hour charts, region breakdown
- **Product Mix** (`/products`) - Brand charts, SKU tables, sankey flow diagrams
- **Consumers** (`/consumers`) - Demographics heatmap, repeat rate cards
- **CES Chat** (`/ces`) - AI-powered chat panel for creative analysis

### AI Services
- **BrandBot** - GPT-4o powered insights via `/api/brandbot`
- **CES Chat** - OpenAI streaming chat via `/api/ces/chat`

### Dual Database Support
- **Supabase** (Primary) - PostgreSQL for real-time analytics
- **Azure SQL** (Replica) - SQL Server for enterprise data

### Hash-Locked Agents
- **RepoAgent** - Cross-repository operations and git management
- **KeyKeyAgent** - API key and secret management
- **BasherAgent** - Secure bash script execution
- **CacaAgent** - QA automation with 85% coverage threshold
- **ClaudeAgent** - AI development assistance with CWD lock

### Technical Stack
- **React 18** with TypeScript strict mode
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Zustand** for state management
- **Lucide React** for icons
- **ESLint + Prettier** for code quality
- **Lighthouse ≥90** performance threshold

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Configuration

The project uses:
- **TypeScript** with strict mode enabled
- **Path aliases** (`@/` maps to `src/`)
- **Vite** with React plugin and path resolution
- **Tailwind CSS** for utility-first styling

## 🔒 Safety Features

### Why This Approach is Safe

1. **Fork once, never track v3.x chaos** - Cherry-picked a single stable commit, not the whole history
2. **No submodules** - Everything lives inside the main repo, avoiding submodule drift
3. **Clean baseline** - Built on v2.1 foundation with minimal dependencies
4. **Production-ready** - Includes proper TypeScript configuration and build optimization

### Build Verification

The repository includes:
- ✅ TypeScript compilation without errors
- ✅ Vite build process completing successfully
- ✅ All imports and dependencies resolved
- ✅ Development server running on http://localhost:5173/

## 📊 Performance

Performance testing results are stored in `performance-results/` directory, including:
- Performance reports with detailed metrics
- Summary markdown files for easy review

## 🚀 Deployment

### Preview Deployment

```bash
# Deploy to preview URL (requires Vercel CLI)
vercel deploy --prebuilt --scope ai-agency
```

### Production Deployment

```bash
# Build and deploy to production
npm run build
vercel --prod --confirm
```

## 🔄 Git History

The repository maintains a clean git history:

1. **Initial commit**: Clean v2.1 baseline initialization
2. **Cherry-pick commit**: MVP dashboard code integration (commit `527c924`)
3. **Configuration commit**: TypeScript, Vite, and React setup

## 🐛 Known Issues

- Minor React warning about `key` prop in QuickFilterButton component (non-breaking)
- Tailwind CSS content configuration warning (styling still works correctly)

## 📝 Next Steps

1. **Add tests** - Implement unit and integration tests
2. **Enhance styling** - Configure Tailwind content sources
3. **Add data integration** - Connect to real data sources
4. **Performance optimization** - Implement code splitting and lazy loading

## 🤝 Contributing

This repository follows the clean v2.1 architecture principles. When making changes:

1. Maintain the clean baseline approach
2. Avoid introducing v3.x complexity
3. Ensure all builds pass before committing
4. Update documentation for significant changes

## 📄 License

This project is part of the AI Agency Scout Analytics platform.
