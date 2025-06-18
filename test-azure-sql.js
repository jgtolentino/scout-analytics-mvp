import sql from 'mssql';

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
  }
};

async function testAzureSqlConnection() {
  console.log('🔍 Testing Azure SQL Connection...\n');
  
  console.log('Configuration:');
  console.log(`Server: ${sqlConfig.server}`);
  console.log(`Database: ${sqlConfig.database}`);
  console.log(`User: ${sqlConfig.user}`);
  console.log('');
  
  try {
    console.log('🔗 Connecting to Azure SQL...');
    const pool = await new sql.ConnectionPool(sqlConfig).connect();
    console.log('✅ Connected successfully');
    
    // Test basic query
    console.log('📊 Testing basic query...');
    const result = await pool.request().query('SELECT @@VERSION as version, GETDATE() as current_time');
    console.log('✅ Query successful');
    console.log(`Version: ${result.recordset[0].version.substring(0, 50)}...`);
    console.log(`Current time: ${result.recordset[0].current_time}`);
    
    // Test transactions table
    console.log('\n📋 Testing transactions table...');
    const countResult = await pool.request().query('SELECT COUNT(*) as total_transactions FROM transactions');
    console.log(`✅ Total transactions: ${countResult.recordset[0].total_transactions}`);
    
    // Test sample data
    console.log('\n📋 Sample transaction data...');
    const sampleResult = await pool.request().query(`
      SELECT TOP 5 
        id, 
        total_amount, 
        created_at, 
        store_location,
        customer_age,
        customer_gender
      FROM transactions 
      ORDER BY created_at DESC
    `);
    
    console.log('✅ Sample records:');
    sampleResult.recordset.forEach((record, i) => {
      console.log(`  ${i+1}. ${record.created_at} | ₱${record.total_amount} | ${record.store_location} | Age: ${record.customer_age} | Gender: ${record.customer_gender}`);
    });
    
    // Test dashboard metrics
    console.log('\n📊 Testing dashboard metrics...');
    const metricsResult = await pool.request().query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_basket,
        COUNT(DISTINCT store_location) as unique_locations
      FROM transactions
      WHERE created_at >= DATEADD(day, -30, GETDATE())
    `);
    
    const metrics = metricsResult.recordset[0];
    console.log('✅ Last 30 days metrics:');
    console.log(`  Transactions: ${metrics.total_transactions}`);
    console.log(`  Revenue: ₱${metrics.total_revenue?.toLocaleString()}`);
    console.log(`  Avg Basket: ₱${metrics.avg_basket?.toFixed(2)}`);
    console.log(`  Locations: ${metrics.unique_locations}`);
    
    await pool.close();
    console.log('\n🎉 Azure SQL connection test completed successfully!');
    console.log('🚀 Ready for Scout Analytics dashboard deployment');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testAzureSqlConnection();