-- Updated schema with comprehensive product management and vendor support

-- Create or update products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  images JSONB DEFAULT '[]'::jsonb,
  is_organic BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  avg_rating DECIMAL(3, 1),
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on product category for faster searches
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);

-- Create product categories table for standardized categories
CREATE TABLE IF NOT EXISTS product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product subcategories table
CREATE TABLE IF NOT EXISTS product_subcategories (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, name)
);

-- Create product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, user_id)
);

-- Create index on product reviews
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);

-- Create or update orders table for complete order management
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order items table for detailed order contents
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL,
  supplier_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on order items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_supplier ON order_items(supplier_id);

-- Create vendor stats view for dashboard
CREATE OR REPLACE VIEW vendor_stats AS
SELECT
  u.id AS vendor_id,
  COALESCE(product_count.count, 0) AS total_products,
  COALESCE(order_count.count, 0) AS total_orders,
  COALESCE(revenue.total, 0.0) AS total_revenue,
  COALESCE(ratings.avg, 0.0) AS avg_rating
FROM
  users u
LEFT JOIN (
  SELECT supplier_id, COUNT(*) as count
  FROM products
  GROUP BY supplier_id
) product_count ON u.id = product_count.supplier_id
LEFT JOIN (
  SELECT supplier_id, COUNT(DISTINCT order_id) as count
  FROM order_items
  GROUP BY supplier_id
) order_count ON u.id = order_count.supplier_id
LEFT JOIN (
  SELECT supplier_id, SUM(price * quantity) as total
  FROM order_items
  GROUP BY supplier_id
) revenue ON u.id = revenue.supplier_id
LEFT JOIN (
  SELECT p.supplier_id, AVG(pr.rating) as avg
  FROM product_reviews pr
  JOIN products p ON pr.product_id = p.id
  GROUP BY p.supplier_id
) ratings ON u.id = ratings.supplier_id
WHERE u.role = 'supplier';

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- For products table
DROP TRIGGER IF EXISTS update_product_timestamp ON products;
CREATE TRIGGER update_product_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- For orders table
DROP TRIGGER IF EXISTS update_order_timestamp ON orders;
CREATE TRIGGER update_order_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- For product reviews table
DROP TRIGGER IF EXISTS update_review_timestamp ON product_reviews;
CREATE TRIGGER update_review_timestamp
BEFORE UPDATE ON product_reviews
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- Create trigger to update product avg_rating when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the product's average rating and review count
  UPDATE products
  SET 
    avg_rating = (
      SELECT AVG(rating) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM product_reviews 
      WHERE product_id = NEW.product_id
    )
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Add trigger for review insertion
DROP TRIGGER IF EXISTS update_product_rating_insert ON product_reviews;
CREATE TRIGGER update_product_rating_insert
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE PROCEDURE update_product_rating();

-- Sample data for product categories
INSERT INTO product_categories (name, description)
VALUES 
  ('Fruits & Vegetables', 'Fresh organic fruits and vegetables'),
  ('Spices & Herbs', 'Organic and traditional spices and herbs'),
  ('Grains & Pulses', 'Organic whole grains, rice and lentils'),
  ('Dairy Products', 'Farm-fresh dairy products'),
  ('Natural Oils', 'Cold-pressed and organic oils')
ON CONFLICT (name) DO NOTHING;

-- Sample data for product subcategories
INSERT INTO product_subcategories (category_id, name)
VALUES 
  (1, 'Seasonal Fruits'),
  (1, 'Leafy Greens'),
  (1, 'Root Vegetables'),
  (2, 'Whole Spices'),
  (2, 'Ground Spices'),
  (2, 'Dried Herbs'),
  (3, 'Rice Varieties'),
  (3, 'Lentils'),
  (3, 'Flour & Grains'),
  (4, 'Milk'),
  (4, 'Ghee'),
  (4, 'Paneer'),
  (5, 'Coconut Oil'),
  (5, 'Groundnut Oil'),
  (5, 'Sesame Oil')
ON CONFLICT (category_id, name) DO NOTHING;
