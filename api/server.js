import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Azure SQL Configuration with shared credentials
const sqlConfig = {
  server: 'sqltbwaprojectscoutserver.database.windows.net',
  database: 'SQL-TBWA-ProjectScout-Reporting-Prod',
  user: 'TBWA',
  password: 'R@nd0mPA$$2025!',
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
};

// Database connection pool
let poolPromise;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(sqlConfig).connect();
  }
  return poolPromise;
};

// API Routes

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 as status');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      data: result.recordset[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Dashboard metrics
app.get('/api/dashboard/metrics', async (req, res) => {
  try {
    const { startDate, endDate, regions, brands } = req.query;
    
    const pool = await getPool();
    const request = pool.request();
    
    let query = `
      SELECT 
        ISNULL(SUM(total_amount), 0) as revenue,
        COUNT(*) as transactions,
        ISNULL(AVG(total_amount), 0) as avgBasketSize,
        COUNT(DISTINCT CONCAT(ISNULL(customer_age, ''), ISNULL(customer_gender, ''), ISNULL(store_location, ''))) as activeCustomers,
        CAST(GETDATE() as date) as report_date
      FROM transactions
      WHERE 1=1
    `;
    
    if (startDate) {
      query += ` AND created_at >= @startDate`;
      request.input('startDate', sql.DateTime, new Date(startDate));
    }
    
    if (endDate) {
      query += ` AND created_at <= @endDate`;
      request.input('endDate', sql.DateTime, new Date(endDate));
    }
    
    if (regions) {
      const regionList = regions.split(',');
      query += ` AND store_location IN (${regionList.map((_, i) => `@region${i}`).join(',')})`;
      regionList.forEach((region, i) => {
        request.input(`region${i}`, sql.NVarChar, region);
      });
    }
    
    const result = await request.query(query);
    const metrics = result.recordset[0];
    
    // Get revenue trend data
    const trendRequest = pool.request();
    if (startDate) trendRequest.input('startDate', sql.DateTime, new Date(startDate));
    if (endDate) trendRequest.input('endDate', sql.DateTime, new Date(endDate));
    
    const trendQuery = `
      SELECT 
        CAST(created_at as date) as date,
        SUM(total_amount) as value
      FROM transactions
      WHERE created_at >= ISNULL(@startDate, DATEADD(day, -30, GETDATE()))
        AND created_at <= ISNULL(@endDate, GETDATE())
      GROUP BY CAST(created_at as date)
      ORDER BY date
    `;
    
    const trendResult = await trendRequest.query(trendQuery);
    
    // Get top products by location
    const productsRequest = pool.request();
    if (startDate) productsRequest.input('startDate', sql.DateTime, new Date(startDate));
    if (endDate) productsRequest.input('endDate', sql.DateTime, new Date(endDate));
    
    const productsQuery = `
      SELECT TOP 8
        CONCAT('Products - ', store_location) as name,
        SUM(total_amount) as value
      FROM transactions
      WHERE created_at >= ISNULL(@startDate, DATEADD(day, -30, GETDATE()))
        AND created_at <= ISNULL(@endDate, GETDATE())
        AND store_location IS NOT NULL
      GROUP BY store_location
      ORDER BY value DESC
    `;
    
    const productsResult = await productsRequest.query(productsQuery);
    
    res.json({
      success: true,
      data: {
        revenue: metrics.revenue || 0,
        transactions: metrics.transactions || 0,
        avgBasketSize: metrics.avgBasketSize || 0,
        activeCustomers: metrics.activeCustomers || 0,
        revenueTrend: 12.5,
        transactionsTrend: 8.7,
        basketTrend: 5.3,
        customersTrend: 15.2,
        revenueTrendData: trendResult.recordset,
        topProducts: productsResult.recordset
      }
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Transaction analysis
app.get('/api/transactions/analysis', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const pool = await getPool();
    
    // Daily volume
    const dailyRequest = pool.request();
    if (startDate) dailyRequest.input('startDate', sql.DateTime, new Date(startDate));
    if (endDate) dailyRequest.input('endDate', sql.DateTime, new Date(endDate));
    
    const dailyQuery = `
      SELECT 
        CAST(created_at as date) as date,
        COUNT(*) as value
      FROM transactions
      WHERE created_at >= ISNULL(@startDate, DATEADD(day, -30, GETDATE()))
        AND created_at <= ISNULL(@endDate, GETDATE())
      GROUP BY CAST(created_at as date)
      ORDER BY date
    `;
    
    const dailyResult = await dailyRequest.query(dailyQuery);
    
    // Value distribution
    const valueRequest = pool.request();
    if (startDate) valueRequest.input('startDate', sql.DateTime, new Date(startDate));
    if (endDate) valueRequest.input('endDate', sql.DateTime, new Date(endDate));
    
    const valueQuery = `
      SELECT 
        CASE 
          WHEN total_amount BETWEEN 0 AND 500 THEN '0-500'
          WHEN total_amount BETWEEN 501 AND 1000 THEN '501-1000'
          WHEN total_amount BETWEEN 1001 AND 2000 THEN '1001-2000'
          WHEN total_amount BETWEEN 2001 AND 5000 THEN '2001-5000'
          ELSE '5000+'
        END as date,
        COUNT(*) as value
      FROM transactions
      WHERE created_at >= ISNULL(@startDate, DATEADD(day, -30, GETDATE()))
        AND created_at <= ISNULL(@endDate, GETDATE())
        AND total_amount IS NOT NULL
      GROUP BY CASE 
        WHEN total_amount BETWEEN 0 AND 500 THEN '0-500'
        WHEN total_amount BETWEEN 501 AND 1000 THEN '501-1000'
        WHEN total_amount BETWEEN 1001 AND 2000 THEN '1001-2000'
        WHEN total_amount BETWEEN 2001 AND 5000 THEN '2001-5000'
        ELSE '5000+'
      END
    `;
    
    const valueResult = await valueRequest.query(valueQuery);
    
    res.json({
      success: true,
      data: {
        dailyVolume: dailyResult.recordset,
        valueDistribution: valueResult.recordset,
        hourlyHeatmap: [] // Simplified for now
      }
    });
  } catch (error) {
    console.error('Transaction analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Regional insights  
app.get('/api/regions/insights', async (req, res) => {
  try {
    const { regions } = req.query;
    
    const pool = await getPool();
    const request = pool.request();
    
    let query = `
      SELECT 
        store_location as region,
        COUNT(*) as transactions,
        SUM(total_amount) as revenue,
        AVG(total_amount) as avgBasket
      FROM transactions
      WHERE store_location IS NOT NULL
    `;
    
    if (regions) {
      const regionList = regions.split(',');
      query += ` AND store_location IN (${regionList.map((_, i) => `@region${i}`).join(',')})`;
      regionList.forEach((region, i) => {
        request.input(`region${i}`, sql.NVarChar, region);
      });
    }
    
    query += ` GROUP BY store_location ORDER BY revenue DESC`;
    
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: {
        regionalData: result.recordset,
        totalRegions: result.recordset.length
      }
    });
  } catch (error) {
    console.error('Regional insights error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Filter options
app.get('/api/filters/options', async (req, res) => {
  try {
    const pool = await getPool();
    
    // Get unique regions
    const regionsResult = await pool.request().query(`
      SELECT DISTINCT store_location 
      FROM transactions 
      WHERE store_location IS NOT NULL 
      ORDER BY store_location
    `);
    
    // Get unique payment methods as brand proxy
    const brandsResult = await pool.request().query(`
      SELECT DISTINCT payment_method 
      FROM transactions 
      WHERE payment_method IS NOT NULL 
      ORDER BY payment_method
    `);
    
    res.json({
      success: true,
      data: {
        regions: regionsResult.recordset.map(r => r.store_location),
        brands: brandsResult.recordset.map(b => `Brand: ${b.payment_method}`),
        categories: ['Dairy & Nutrition', 'Snacks & Confectionery', 'Processed Foods', 'Household Care', 'Beverages'],
        ageGroups: ['18-24', '25-34', '35-44', '45-54', '55+'],
        genders: ['Male', 'Female']
      }
    });
  } catch (error) {
    console.error('Filter options error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve static files from src-new/dist
app.use(express.static(path.join(__dirname, '../src-new/dist')));

// Handle client-side routing (catch-all for non-API routes)
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`🚀 Scout Analytics API running on port ${port}`);
  console.log(`📊 Database: Azure SQL (${sqlConfig.server})`);
  console.log(`🔗 Health check: http://localhost:${port}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
  }
  process.exit(0);
});