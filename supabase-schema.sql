-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Products policies (public read)
CREATE POLICY "Products are viewable by everyone" 
  ON products FOR SELECT 
  USING (true);

-- Orders policies (users can only see their own orders)
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  WITH CHECK (true);

-- Order items policies
CREATE POLICY "Order items are viewable by everyone" 
  ON order_items FOR SELECT 
  USING (true);

CREATE POLICY "Order items can be inserted" 
  ON order_items FOR INSERT 
  WITH CHECK (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Wireless Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'Electronics', 50),
('Smart Watch', 'Advanced fitness tracking smartwatch with heart rate monitor', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'Electronics', 30),
('Laptop Backpack', 'Durable laptop backpack with USB charging port and water-resistant material', 49.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800', 'Accessories', 100),
('Coffee Maker', 'Programmable coffee maker with thermal carafe', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800', 'Home', 25),
('Bluetooth Speaker', 'Portable waterproof Bluetooth speaker with 360° sound', 89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800', 'Electronics', 75),
('Yoga Mat', 'Premium non-slip yoga mat with carrying strap', 34.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', 'Fitness', 120),
('Desk Lamp', 'LED desk lamp with adjustable brightness and color temperature', 45.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800', 'Home', 60),
('Running Shoes', 'Lightweight running shoes with responsive cushioning', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Footwear', 40);