-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    location TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Products table  
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    region TEXT NOT NULL,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    store_id UUID REFERENCES stores(id),
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Transaction items table
CREATE TABLE IF NOT EXISTS transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_store ON transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_product ON transaction_items(product_id);

-- Create views for common queries
CREATE OR REPLACE VIEW daily_metrics AS
SELECT 
    DATE(transaction_date) as date,
    COUNT(DISTINCT t.id) as transaction_count,
    COUNT(DISTINCT t.customer_id) as unique_customers,
    SUM(t.total_amount) as revenue,
    AVG(t.total_amount) as avg_transaction_value
FROM transactions t
GROUP BY DATE(transaction_date)
ORDER BY date DESC;

-- Create a view for product performance
CREATE OR REPLACE VIEW product_performance AS
SELECT 
    p.id,
    p.name,
    p.brand,
    p.category,
    COUNT(ti.id) as total_sales,
    SUM(ti.quantity) as total_quantity,
    SUM(ti.total) as total_revenue,
    AVG(ti.unit_price) as avg_price
FROM products p
LEFT JOIN transaction_items ti ON p.id = ti.product_id
GROUP BY p.id, p.name, p.brand, p.category;

-- Create a view for customer insights
CREATE OR REPLACE VIEW customer_insights AS
SELECT 
    c.id,
    c.name,
    c.location,
    COUNT(t.id) as total_transactions,
    SUM(t.total_amount) as total_spent,
    AVG(t.total_amount) as avg_transaction_value,
    MAX(t.transaction_date) as last_purchase_date,
    MIN(t.transaction_date) as first_purchase_date
FROM customers c
LEFT JOIN transactions t ON c.id = t.customer_id
GROUP BY c.id, c.name, c.location;

-- RLS Policies (Enable Row Level Security)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Public read access policies (adjust based on your security needs)
CREATE POLICY "Public read access" ON customers FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON stores FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transactions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON transaction_items FOR SELECT USING (true);

-- Insert sample data for testing
INSERT INTO customers (name, email, location) VALUES
('Juan Dela Cruz', 'juan@email.com', 'Manila'),
('Maria Santos', 'maria@email.com', 'Quezon City'),
('Pedro Garcia', 'pedro@email.com', 'Makati'),
('Ana Reyes', 'ana@email.com', 'Pasig'),
('Carlos Mendoza', 'carlos@email.com', 'Taguig')
ON CONFLICT (email) DO NOTHING;

INSERT INTO stores (name, location, region) VALUES
('SM Megamall', 'Ortigas', 'NCR'),
('Ayala Malls Manila Bay', 'Pasay', 'NCR'),
('Robinson\'s Galleria', 'Ortigas', 'NCR'),
('SM Mall of Asia', 'Pasay', 'NCR'),
('Trinoma', 'Quezon City', 'NCR')
ON CONFLICT DO NOTHING;

INSERT INTO products (sku, name, brand, category, price) VALUES
('NEST001', 'Nestle Milo 1kg', 'Nestle', 'Beverages', 299.00),
('COCA001', 'Coca-Cola 1.5L', 'Coca-Cola', 'Beverages', 89.00),
('LUCK001', 'Lucky Me Instant Noodles', 'Monde Nissin', 'Instant Foods', 15.00),
('DOVE001', 'Dove Beauty Bar 135g', 'Unilever', 'Personal Care', 89.00),
('SMIG001', 'San Miguel Beer 330ml', 'San Miguel', 'Beverages', 45.00)
ON CONFLICT (sku) DO NOTHING;

-- Function to get dashboard metrics with filters
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
    start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    end_date DATE DEFAULT CURRENT_DATE,
    brands TEXT[] DEFAULT NULL,
    locations TEXT[] DEFAULT NULL
)
RETURNS TABLE (
    total_revenue NUMERIC,
    total_transactions BIGINT,
    avg_basket_size NUMERIC,
    active_customers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(t.total_amount), 0) as total_revenue,
        COUNT(DISTINCT t.id) as total_transactions,
        COALESCE(AVG(t.total_amount), 0) as avg_basket_size,
        COUNT(DISTINCT t.customer_id) as active_customers
    FROM transactions t
    JOIN stores s ON t.store_id = s.id
    JOIN transaction_items ti ON t.id = ti.transaction_id
    JOIN products p ON ti.product_id = p.id
    WHERE 
        DATE(t.transaction_date) BETWEEN start_date AND end_date
        AND (brands IS NULL OR p.brand = ANY(brands))
        AND (locations IS NULL OR s.region = ANY(locations));
END;
$$ LANGUAGE plpgsql;