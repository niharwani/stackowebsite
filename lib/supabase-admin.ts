import { supabase, Product, Category } from './supabase';

// Product Types for Create/Update
export type ProductInput = {
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  category: string;
  image_url?: string | null;
  video_url?: string | null;
  in_stock: boolean;
  is_new: boolean;
  is_featured: boolean;
};

export type CategoryInput = {
  name: string;
  slug: string;
};

// ==================== PRODUCTS ====================

export async function createProduct(product: ProductInput): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...product,
      emoji: '📦', // Default emoji, not used in UI anymore
      rating: 5.0,
      reviews: 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw new Error(error.message);
  }

  // Update category product count
  await updateCategoryProductCount(product.category);

  return data;
}

export async function updateProduct(id: string, product: Partial<ProductInput>): Promise<Product | null> {
  // Get current product to check if category changed
  const { data: currentProduct } = await supabase
    .from('products')
    .select('category')
    .eq('id', id)
    .single();

  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message);
  }

  // Update category counts if category changed
  if (currentProduct && product.category && currentProduct.category !== product.category) {
    await updateCategoryProductCount(currentProduct.category);
    await updateCategoryProductCount(product.category);
  }

  return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
  // Get product category before deleting
  const { data: product } = await supabase
    .from('products')
    .select('category')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.message);
  }

  // Update category product count
  if (product) {
    await updateCategoryProductCount(product.category);
  }

  return true;
}

// ==================== CATEGORIES ====================

export async function createCategory(category: CategoryInput): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert([{
      ...category,
      emoji: '📁', // Default emoji, not used in UI anymore
      product_count: 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateCategory(id: string, category: Partial<CategoryInput>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw new Error(error.message);
  }

  return true;
}

// Helper to update category product count
async function updateCategoryProductCount(categorySlug: string) {
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category', categorySlug);

  await supabase
    .from('categories')
    .update({ product_count: count || 0 })
    .eq('slug', categorySlug);
}

// ==================== MEDIA / FILE UPLOAD ====================

export async function uploadFile(
  file: File,
  bucket: string = 'product-images'
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteFile(
  url: string,
  bucket: string = 'product-images'
): Promise<boolean> {
  // Extract file path from URL
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    console.error('Error deleting file:', error);
    throw new Error(error.message);
  }

  return true;
}

export async function listFiles(bucket: string = 'product-images') {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list();

  if (error) {
    console.error('Error listing files:', error);
    return [];
  }

  return data.map(file => ({
    name: file.name,
    url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl,
    created_at: file.created_at,
  }));
}
