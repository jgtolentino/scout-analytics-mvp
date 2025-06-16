import { GlobalFilterBar } from './components/filters/GlobalFilterBar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Scout Analytics MVP</h1>
        <GlobalFilterBar />
        <div className="mt-8">
          <p className="text-gray-600">Dashboard content will be displayed here.</p>
        </div>
      </div>
    </div>
  )
}

export default App
