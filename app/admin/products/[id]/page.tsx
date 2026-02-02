'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Package } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, Product } from '@/lib/supabase';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const data = await getProductById(params.id as string);
      if (data) {
        setProduct(data);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-[#0073aa] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (notFound) {
    return (
      <AdminLayout title="Edit Product">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-500">
              The product you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${product?.name}`}>
      <ProductForm product={product} isEditing />
    </AdminLayout>
  );
}
