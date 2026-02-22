-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('Men', 'Women', 'Kids', 'Unisex')),
  category TEXT NOT NULL,
  condition_label TEXT NOT NULL,
  condition_score INTEGER NOT NULL CHECK (condition_score >= 1 AND condition_score <= 10),
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  condition_notes TEXT NOT NULL,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'jazzcash', 'easypaisa', 'bank_transfer')),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  voucher_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vouchers table
CREATE TABLE vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER DEFAULT 0,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sliders table
CREATE TABLE sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_link TEXT NOT NULL,
  background_color TEXT NOT NULL DEFAULT '#284E3D',
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create banners table
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  background_color TEXT NOT NULL DEFAULT '#284E3D',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_sliders_sort_order ON sliders(sort_order);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read for active products)
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Authenticated users can manage products" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for sliders (public read for active sliders)
CREATE POLICY "Public can view active sliders" ON sliders
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage sliders" ON sliders
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for orders (users can read their own orders)
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage orders" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for customers
CREATE POLICY "Authenticated users can manage customers" ON customers
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for vouchers
CREATE POLICY "Public can view active vouchers" ON vouchers
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage vouchers" ON vouchers
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for banners
CREATE POLICY "Public can view active banners" ON banners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage banners" ON banners
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
