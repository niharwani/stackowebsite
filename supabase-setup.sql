-- Supabase Setup SQL
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/miwmahuqpagwhqkinrwa/sql)

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL DEFAULT '🎯',
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category TEXT NOT NULL,
  image_url TEXT,
  emoji TEXT NOT NULL DEFAULT '🎁',
  in_stock BOOLEAN DEFAULT true,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(2, 1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on products" ON products
  FOR SELECT USING (true);

-- Insert categories
INSERT INTO categories (name, slug, emoji, product_count) VALUES
  ('Figurines', 'figurines', '🧍', 2),
  ('Lamps', 'lamps', '💡', 1),
  ('Accessories', 'accessories', '🔑', 1)
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (name, description, price, original_price, category, emoji, in_stock, is_new, is_featured, rating, reviews) VALUES
  (
    'Mini''Me',
    'Your personalized mini figurine! A custom-made collectible that looks just like you. Perfect for your desk, shelf, or as a unique gift.',
    999,
    NULL,
    'figurines',
    '🧍',
    true,
    true,
    true,
    5.0,
    124
  ),
  (
    'Couple Mini''Me',
    'Celebrate your love with a custom couple figurine! Perfect for Valentine''s Day, anniversaries, or just because. Two personalized mini figures that capture your special bond.',
    1799,
    1999,
    'figurines',
    '💑',
    true,
    true,
    true,
    5.0,
    89
  ),
  (
    'Custom Lamp',
    'Light up your space with a personalized lamp! Features your custom design with warm LED lighting. Perfect for bedrooms, living rooms, or as a unique night light.',
    999,
    NULL,
    'lamps',
    '💡',
    true,
    true,
    true,
    4.9,
    67
  ),
  (
    'Custom Keychain',
    'Carry your memories everywhere with a personalized keychain! Durable, compact, and uniquely yours. Great for keys, bags, or as a thoughtful gift.',
    199,
    NULL,
    'accessories',
    '🔑',
    true,
    true,
    true,
    4.8,
    203
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
