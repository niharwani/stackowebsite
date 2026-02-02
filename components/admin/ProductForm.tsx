'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Loader2,
} from 'lucide-react';
import { Product, Category, getCategories } from '@/lib/supabase';
import { createProduct, updateProduct, uploadFile, ProductInput } from '@/lib/supabase-admin';

interface ProductFormProps {
  product?: Product | null;
  isEditing?: boolean;
}

export default function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState<ProductInput>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    original_price: product?.original_price || null,
    category: product?.category || '',
    image_url: product?.image_url || null,
    video_url: product?.video_url || null,
    in_stock: product?.in_stock ?? true,
    is_new: product?.is_new ?? false,
    is_featured: product?.is_featured ?? false,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
    // Set default category if creating new product and categories exist
    if (!isEditing && data.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: data[0].slug }));
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? null : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const url = await uploadFile(file, 'product-images');
      setFormData((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError('Failed to upload image. Make sure Supabase storage is configured.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_url: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>

            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none resize-none"
              />
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>

              {formData.image_url ? (
                <div className="relative w-full max-w-xs">
                  <img
                    src={formData.image_url}
                    alt="Product"
                    className="w-full aspect-square object-contain border border-gray-200 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full max-w-xs aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0073aa] transition-colors bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm">Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-sm">Click to upload image</span>
                      <span className="text-xs">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label
                htmlFor="video_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video URL (YouTube, Vimeo, or direct link)
              </label>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  id="video_url"
                  name="video_url"
                  value={formData.video_url || ''}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h2>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price (Rs.) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="999"
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none"
                  required
                />
              </div>

              {/* Original Price */}
              <div>
                <label
                  htmlFor="original_price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Original Price (Rs.)
                </label>
                <input
                  type="number"
                  id="original_price"
                  name="original_price"
                  value={formData.original_price || ''}
                  onChange={handleChange}
                  placeholder="1299"
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if no discount
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Actions Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#0073aa] hover:bg-[#005f8b] text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {isEditing ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>

          {/* Category Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none bg-white"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-3">
              {/* In Stock */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                />
                <div>
                  <span className="font-medium text-gray-900">In Stock</span>
                  <p className="text-xs text-gray-500">Product is available</p>
                </div>
              </label>

              {/* Is New */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_new"
                  checked={formData.is_new}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                />
                <div>
                  <span className="font-medium text-gray-900">New Badge</span>
                  <p className="text-xs text-gray-500">Show "New" label</p>
                </div>
              </label>

              {/* Is Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                />
                <div>
                  <span className="font-medium text-gray-900">Featured</span>
                  <p className="text-xs text-gray-500">Show on homepage</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
