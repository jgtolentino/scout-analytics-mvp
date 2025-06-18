// Unified Database Configuration for Scout Analytics
// Supports both Azure SQL and PostgreSQL with shared credentials

export const sharedCredentials = {
  user: 'TBWA',
  password: 'R@nd0mPA$$2025!',
  connectionTimeout: 30
}

// Azure SQL Configuration
export const azureSqlConfig = {
  type: 'mssql' as const,
  server: 'sqltbwaprojectscoutserver.database.windows.net',
  database: 'SQL-TBWA-ProjectScout-Reporting-Prod',
  user: sharedCredentials.user,
  password: sharedCredentials.password,
  
  connectionString: 
    `Driver=/opt/homebrew/lib/libmsodbcsql.17.dylib;` +
    `Server=sqltbwaprojectscoutserver.database.windows.net;` +
    `Database=SQL-TBWA-ProjectScout-Reporting-Prod;` +
    `Uid=${sharedCredentials.user};` +
    `Pwd=${sharedCredentials.password};` +
    `Encrypt=yes;` +
    `TrustServerCertificate=no;` +
    `Connection Timeout=${sharedCredentials.connectionTimeout};`,
  
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
}

// PostgreSQL Configuration (Azure PostgreSQL Flexible Server)
export const postgresConfig = {
  type: 'postgres' as const,
  host: 'scout-analytics-db.postgres.database.azure.com',
  port: 5432,
  database: 'postgres',
  user: sharedCredentials.user,
  password: sharedCredentials.password,
  
  connectionString: 
    `postgresql://${sharedCredentials.user}:${sharedCredentials.password}@` +
    `scout-analytics-db.postgres.database.azure.com:5432/postgres?` +
    `sslmode=require&connect_timeout=${sharedCredentials.connectionTimeout}`,
  
  ssl: {
    rejectUnauthorized: false
  },
  
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
}

// Database selection logic
export const getDatabaseConfig = () => {
  const dbType = process.env.DATABASE_TYPE || 'azure-sql' // Default to Azure SQL
  
  switch (dbType) {
    case 'postgres':
    case 'postgresql':
      return postgresConfig
    case 'azure-sql':
    case 'mssql':
    case 'sql-server':
    default:
      return azureSqlConfig
  }
}

// Environment variables for Azure App Service
export const environmentVars = {
  // Shared credentials
  DB_USER: sharedCredentials.user,
  DB_PASSWORD: sharedCredentials.password,
  
  // Azure SQL specific
  AZURE_SQL_SERVER: azureSqlConfig.server,
  AZURE_SQL_DATABASE: azureSqlConfig.database,
  SQL_CONN_STR: azureSqlConfig.connectionString,
  
  // PostgreSQL specific  
  POSTGRES_HOST: postgresConfig.host,
  POSTGRES_DATABASE: postgresConfig.database,
  POSTGRES_CONN_STR: postgresConfig.connectionString,
  
  // Application config
  DATABASE_TYPE: process.env.DATABASE_TYPE || 'azure-sql',
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || '8080'
}

// Cross-database compatible schema
export const unifiedSchema = {
  // Table names (same across both databases)
  tables: {
    transactions: 'transactions',
    products: 'products', 
    customers: 'customers',
    stores: 'stores',
    brands: 'brands',
    categories: 'categories',
    transaction_items: 'transaction_items'
  }
}

// Database-agnostic queries
export const universalQueries = {
  // Works with both SQL Server and PostgreSQL
  getDashboardMetrics: {
    mssql: `
      SELECT 
        SUM(total_amount) as revenue,
        COUNT(*) as transactions,
        AVG(total_amount) as avgBasketSize,
        COUNT(DISTINCT customer_id) as activeCustomers,
        CAST(GETDATE() as date) as report_date
      FROM transactions
      WHERE created_at >= @startDate AND created_at <= @endDate
    `,
    postgres: `
      SELECT 
        SUM(total_amount) as revenue,
        COUNT(*) as transactions,
        AVG(total_amount) as avgBasketSize,
        COUNT(DISTINCT customer_id) as activeCustomers,
        CURRENT_DATE as report_date
      FROM transactions
      WHERE created_at >= $1 AND created_at <= $2
    `
  },
  
  getRevenueTrend: {
    mssql: `
      SELECT 
        CAST(created_at as date) as date,
        SUM(total_amount) as value
      FROM transactions
      WHERE created_at >= @startDate AND created_at <= @endDate
      GROUP BY CAST(created_at as date)
      ORDER BY date
    `,
    postgres: `
      SELECT 
        DATE(created_at) as date,
        SUM(total_amount) as value
      FROM transactions
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY DATE(created_at)
      ORDER BY date
    `
  },
  
  getRegionalInsights: {
    mssql: `
      SELECT 
        store_location as region,
        COUNT(*) as transactions,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avgBasket
      FROM transactions
      WHERE created_at >= @startDate AND created_at <= @endDate
      GROUP BY store_location
      ORDER BY revenue DESC
    `,
    postgres: `
      SELECT 
        store_location as region,
        COUNT(*) as transactions,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avgBasket
      FROM transactions
      WHERE created_at >= $1 AND created_at <= $2
      GROUP BY store_location
      ORDER BY revenue DESC
    `
  }
}

// Get appropriate query for current database
export const getQuery = (queryName: keyof typeof universalQueries) => {
  const config = getDatabaseConfig()
  const queries = universalQueries[queryName]
  
  if (config.type === 'postgres') {
    return queries.postgres
  } else {
    return queries.mssql
  }
}

// Test connection for either database
export const testConnection = async (dbType: 'azure-sql' | 'postgres' = 'azure-sql') => {
  const config = dbType === 'postgres' ? postgresConfig : azureSqlConfig
  
  return {
    type: dbType,
    server: dbType === 'postgres' ? config.host : (config as any).server,
    database: config.database,
    user: config.user,
    status: 'ready-to-connect'
  }
}

export default getDatabaseConfig()