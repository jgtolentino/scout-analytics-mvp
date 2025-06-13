import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Overview } from '@/pages/Overview';
import { TransactionTrends } from '@/pages/TransactionTrends';
import { ProductMix } from '@/pages/ProductMix';
import { ConsumerInsights } from '@/pages/ConsumerInsights';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="trends" element={<TransactionTrends />} />
            <Route path="products" element={<ProductMix />} />
            <Route path="insights" element={<ConsumerInsights />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;