// Azure SQL Database Service for Scout Analytics
import { apiConfig } from '../config/azure-sql'

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  total?: number
}

interface TransactionData {
  id: string
  created_at: string
  total_amount: number
  customer_age?: number
  customer_gender?: string
  store_location?: string
  payment_method?: string
  store_id?: string
}

interface DashboardMetrics {
  revenue: number
  transactions: number
  avgBasketSize: number
  activeCustomers: number
  revenueTrend: number
  transactionsTrend: number
  basketTrend: number
  customersTrend: number
  revenueTrendData: Array<{ date: string; value: number }>
  topProducts: Array<{ name: string; value: number }>
}

class AzureSqlService {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = apiConfig.baseUrl
  }

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        timeout: apiConfig.timeout,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error)
      throw error
    }
  }

  // Get dashboard metrics from Azure SQL
  async getDashboardMetrics(filters?: any): Promise<DashboardMetrics> {
    const params = new URLSearchParams()
    
    if (filters?.dateRange?.from) {
      params.append('startDate', filters.dateRange.from.toISOString())
    }
    if (filters?.dateRange?.to) {
      params.append('endDate', filters.dateRange.to.toISOString())
    }
    if (filters?.selectedRegions?.length > 0) {
      params.append('regions', filters.selectedRegions.join(','))
    }
    if (filters?.selectedBrands?.length > 0) {
      params.append('brands', filters.selectedBrands.join(','))
    }

    const response = await this.fetchApi<DashboardMetrics>(`/dashboard/metrics?${params}`)
    return response.data
  }

  // Get transaction analysis data
  async getTransactionAnalysis(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    
    if (filters?.dateRange?.from) {
      params.append('startDate', filters.dateRange.from.toISOString())
    }
    if (filters?.dateRange?.to) {
      params.append('endDate', filters.dateRange.to.toISOString())
    }

    const response = await this.fetchApi(`/transactions/analysis?${params}`)
    return response.data
  }

  // Get product intelligence data
  async getProductIntelligence(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    
    if (filters?.selectedCategories?.length > 0) {
      params.append('categories', filters.selectedCategories.join(','))
    }
    if (filters?.selectedBrands?.length > 0) {
      params.append('brands', filters.selectedBrands.join(','))
    }

    const response = await this.fetchApi(`/products/intelligence?${params}`)
    return response.data
  }

  // Get regional insights data
  async getRegionalInsights(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    
    if (filters?.selectedRegions?.length > 0) {
      params.append('regions', filters.selectedRegions.join(','))
    }

    const response = await this.fetchApi(`/regions/insights?${params}`)
    return response.data
  }

  // Get consumer segments data
  async getConsumerSegments(filters?: any): Promise<any> {
    const params = new URLSearchParams()
    
    if (filters?.selectedAgeGroups?.length > 0) {
      params.append('ageGroups', filters.selectedAgeGroups.join(','))
    }
    if (filters?.selectedGenders?.length > 0) {
      params.append('genders', filters.selectedGenders.join(','))
    }

    const response = await this.fetchApi(`/consumers/segments?${params}`)
    return response.data
  }

  // Test database connection
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await this.fetchApi<{ status: string; timestamp: string }>('/health')
      return {
        connected: true,
        message: `Connected to Azure SQL - ${response.data.status}`
      }
    } catch (error) {
      return {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Get filter options (regions, brands, categories, etc.)
  async getFilterOptions(): Promise<{
    regions: string[]
    brands: string[]
    categories: string[]
    ageGroups: string[]
    genders: string[]
  }> {
    const response = await this.fetchApi<any>('/filters/options')
    return response.data
  }
}

// Export singleton instance
export const azureSqlService = new AzureSqlService()
export default azureSqlService