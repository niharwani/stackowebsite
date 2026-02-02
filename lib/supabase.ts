import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string | null;
  video_url: string | null;
  emoji: string;
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
  rating: number;
  reviews: number;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  product_count: number;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
}
