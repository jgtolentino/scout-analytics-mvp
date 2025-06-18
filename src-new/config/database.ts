// Database Configuration for Scout Analytics - Azure SQL
export const azureSqlConfig = {
  // Connection string from existing Azure SQL setup
  connectionString: process.env.SQL_CONN_STR || 
    "Driver=/opt/homebrew/lib/libmsodbcsql.17.dylib;" +
    "Server=sqltbwaprojectscoutserver.database.windows.net;" +
    "Database=SQL-TBWA-ProjectScout-Reporting-Prod;" +
    "Uid=TBWA;" +
    "Pwd=R@nd0mPA$$2025!;" +
    "Encrypt=yes;" +
    "TrustServerCertificate=no;" +
    "Connection Timeout=30;",
  
  // Parsed connection details
  server: 'sqltbwaprojectscoutserver.database.windows.net',
  database: 'SQL-TBWA-ProjectScout-Reporting-Prod',
  user: 'TBWA',
  password: 'R@nd0mPA$$2025!',
  
  // Connection options
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
    requestTimeout: 30000,
    enableArithAbort: true
  },
  
  // Pool configuration
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 60000
  }
}

// Environment variables for Azure App Service
export const environmentConfig = {
  // Database
  SQL_CONN_STR: azureSqlConfig.connectionString,
  AZURE_SQL_SERVER: azureSqlConfig.server,
  AZURE_SQL_DATABASE: azureSqlConfig.database,
  AZURE_SQL_USER: azureSqlConfig.user,
  AZURE_SQL_PASSWORD: azureSqlConfig.password,
  
  // Application
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || '8080',
  
  // API Configuration
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://scout-analytics-dashboard.azurewebsites.net/api'
}

// Table schema mapping
export const dbSchema = {
  tables: {
    transactions: '[dbo].[transactions]',
    products: '[dbo].[products]',
    customers: '[dbo].[customers]', 
    stores: '[dbo].[stores]',
    brands: '[dbo].[brands]',
    categories: '[dbo].[categories]',
    transaction_items: '[dbo].[transaction_items]'
  },
  
  views: {
    dashboard_metrics: '[dbo].[vw_dashboard_metrics]',
    regional_summary: '[dbo].[vw_regional_summary]',
    product_performance: '[dbo].[vw_product_performance]',
    customer_segments: '[dbo].[vw_customer_segments]'
  }
}

// SQL Queries for Scout Analytics
export const queries = {
  // Dashboard metrics
  getDashboardMetrics: `
    SELECT 
      SUM(total_amount) as revenue,
      COUNT(*) as transactions,
      AVG(total_amount) as avgBasketSize,
      COUNT(DISTINCT customer_id) as activeCustomers,
      CAST(GETDATE() as date) as report_date
    FROM ${dbSchema.tables.transactions}
    WHERE created_at >= @startDate AND created_at <= @endDate
  `,
  
  // Revenue trend
  getRevenueTrend: `
    SELECT 
      CAST(created_at as date) as date,
      SUM(total_amount) as value
    FROM ${dbSchema.tables.transactions}
    WHERE created_at >= @startDate AND created_at <= @endDate
    GROUP BY CAST(created_at as date)
    ORDER BY date
  `,
  
  // Regional insights
  getRegionalInsights: `
    SELECT 
      store_location as region,
      COUNT(*) as transactions,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avgBasket
    FROM ${dbSchema.tables.transactions}
    WHERE created_at >= @startDate AND created_at <= @endDate
    GROUP BY store_location
    ORDER BY revenue DESC
  `,
  
  // Product performance
  getProductPerformance: `
    SELECT TOP 10
      p.name as product_name,
      b.name as brand_name,
      c.name as category_name,
      SUM(ti.quantity) as units_sold,
      SUM(ti.quantity * ti.price) as revenue
    FROM ${dbSchema.tables.transaction_items} ti
    INNER JOIN ${dbSchema.tables.products} p ON ti.product_id = p.id
    INNER JOIN ${dbSchema.tables.brands} b ON p.brand_id = b.id
    INNER JOIN ${dbSchema.tables.categories} c ON p.category_id = c.id
    INNER JOIN ${dbSchema.tables.transactions} t ON ti.transaction_id = t.id
    WHERE t.created_at >= @startDate AND t.created_at <= @endDate
    GROUP BY p.name, b.name, c.name
    ORDER BY revenue DESC
  `,
  
  // Customer segments
  getCustomerSegments: `
    SELECT 
      customer_gender as gender,
      CASE 
        WHEN customer_age BETWEEN 18 AND 24 THEN '18-24'
        WHEN customer_age BETWEEN 25 AND 34 THEN '25-34'
        WHEN customer_age BETWEEN 35 AND 44 THEN '35-44'
        WHEN customer_age BETWEEN 45 AND 54 THEN '45-54'
        ELSE '55+'
      END as age_group,
      COUNT(*) as transaction_count,
      SUM(total_amount) as revenue,
      AVG(total_amount) as avg_basket
    FROM ${dbSchema.tables.transactions}
    WHERE created_at >= @startDate AND created_at <= @endDate
      AND customer_age IS NOT NULL 
      AND customer_gender IS NOT NULL
    GROUP BY customer_gender, 
      CASE 
        WHEN customer_age BETWEEN 18 AND 24 THEN '18-24'
        WHEN customer_age BETWEEN 25 AND 34 THEN '25-34'
        WHEN customer_age BETWEEN 35 AND 44 THEN '35-44'
        WHEN customer_age BETWEEN 45 AND 54 THEN '45-54'
        ELSE '55+'
      END
    ORDER BY revenue DESC
  `
}

export default azureSqlConfig