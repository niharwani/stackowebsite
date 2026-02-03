'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FolderOpen, Image, Plus, ArrowRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getProducts, getCategories, Product, Category } from '@/lib/supabase';
import { getProductImage } from '@/lib/utils';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      href: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'bg-green-500',
    },
    {
      label: 'Featured Products',
      value: products.filter(p => p.is_featured).length,
      icon: Image,
      href: '/admin/products?filter=featured',
      color: 'bg-purple-500',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Quick Actions */}
      <div className="mb-6">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0073aa] hover:bg-[#005f8b] text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? '-' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
          <Link
            href="/admin/products"
            className="text-sm text-[#0073aa] hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 text-[#0073aa] hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          {getProductImage(product.image_url) ? (
                            <img
                              src={getProductImage(product.image_url)!}
                              alt={product.name}
                              className="w-full h-full object-contain rounded"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 hover:text-[#0073aa]">
                          {product.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 capitalize">
                      {product.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Rs. {product.price}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.in_stock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
