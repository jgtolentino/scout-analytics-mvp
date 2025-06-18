import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Overview } from './pages/Overview'
import { TransactionAnalysis } from './pages/TransactionAnalysis'
import { ProductIntelligence } from './pages/ProductIntelligence'
import { RegionalInsights } from './pages/RegionalInsights'
import { ConsumerSegments } from './pages/ConsumerSegments'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/transactions" element={<TransactionAnalysis />} />
        <Route path="/products" element={<ProductIntelligence />} />
        <Route path="/regions" element={<RegionalInsights />} />
        <Route path="/consumers" element={<ConsumerSegments />} />
      </Routes>
    </Layout>
  )
}

export default App