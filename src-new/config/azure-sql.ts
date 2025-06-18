// Azure SQL Database Configuration for Scout Analytics
export const azureSqlConfig = {
  server: 'sqltbwaprojectscoutserver.database.windows.net',
  database: 'SQL-TBWA-ProjectScout-Reporting-Prod',
  authentication: {
    type: 'azure-active-directory-msi-app-service'
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
}

// Connection string template for Azure App Service
export const getConnectionString = () => {
  const server = process.env.AZURE_SQL_SERVER || azureSqlConfig.server
  const database = process.env.AZURE_SQL_DATABASE || azureSqlConfig.database
  const user = process.env.AZURE_SQL_USER
  const password = process.env.AZURE_SQL_PASSWORD
  
  if (user && password) {
    // Username/password authentication
    return `Server=${server};Database=${database};User Id=${user};Password=${password};Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;`
  } else {
    // Managed Identity authentication (preferred for Azure App Service)
    return `Server=${server};Database=${database};Authentication=Active Directory Managed Identity;Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;`
  }
}

// Database schema information
export const tables = {
  transactions: 'dbo.transactions',
  products: 'dbo.products', 
  customers: 'dbo.customers',
  stores: 'dbo.stores',
  brands: 'dbo.brands',
  categories: 'dbo.categories'
}

// Environment configuration
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// API endpoints
export const apiConfig = {
  baseUrl: process.env.VITE_API_BASE_URL || 'https://scout-analytics-dashboard.azurewebsites.net/api',
  timeout: 30000,
  retryAttempts: 3
}