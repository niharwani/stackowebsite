-- Supabase Admin Setup SQL
-- Run this in your Supabase SQL Editor after running supabase-setup.sql
-- This enables full CRUD access for the admin panel

-- ==================== UPDATE PRODUCTS TABLE ====================

-- Add video_url column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ==================== UPDATE RLS POLICIES ====================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;

-- Create new policies that allow all operations
-- In production, you should add authentication checks here

-- Products: Allow all operations
CREATE POLICY "Allow all operations on products" ON products
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Categories: Allow all operations
CREATE POLICY "Allow all operations on categories" ON categories
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ==================== STORAGE SETUP ====================

-- Create storage bucket for product images
-- Note: You may need to do this in the Supabase Dashboard > Storage section
-- Or run this command:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket
-- Allow public read access
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow public upload (in production, restrict this to authenticated users)
CREATE POLICY "Allow upload to product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow public update
CREATE POLICY "Allow update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow public delete
CREATE POLICY "Allow delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- ==================== OPTIONAL: CREATE MEDIA TABLE ====================

-- Uncomment if you want to track uploaded media in a table
/*
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  size INTEGER,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on media" ON media
  FOR ALL
  USING (true)
  WITH CHECK (true);
*/

-- ==================== INSTRUCTIONS ====================

/*
IMPORTANT: Storage Bucket Setup

If the storage bucket creation fails via SQL, create it manually:

1. Go to Supabase Dashboard > Storage
2. Click "New bucket"
3. Name: product-images
4. Make it PUBLIC (check the "Public bucket" option)
5. Click "Create bucket"

Then run the storage policies above, or set them in the dashboard:
- Go to Storage > product-images > Policies
- Add policies for SELECT, INSERT, UPDATE, DELETE
- Set each policy to allow all (true) for now

For production, you should:
1. Set up Supabase Auth
2. Restrict write operations to authenticated admin users
3. Example policy for authenticated only:

   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
*/
