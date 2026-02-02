'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  MoreVertical,
  Filter,
  ChevronDown,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getProducts, getCategories, Product, Category } from '@/lib/supabase';
import { deleteProduct } from '@/lib/supabase-admin';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [productsData, categoriesData] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
    setLoading(false);
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const filter = searchParams.get('filter');
    const matchesFilter =
      !filter ||
      (filter === 'featured' && product.is_featured) ||
      (filter === 'new' && product.is_new) ||
      (filter === 'outofstock' && !product.in_stock);
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Products">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none w-full sm:w-64"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none bg-white cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Add New Button */}
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0073aa] hover:bg-[#005f8b] text-white font-medium rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'No products match your filters'
                : 'No products yet'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 text-[#0073aa] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add your first product
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                    />
                  </th>
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
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="w-20 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-medium text-gray-900 hover:text-[#0073aa]"
                          >
                            {product.name}
                          </Link>
                          <p className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-gray-900">
                          Rs. {product.price}
                        </span>
                        {product.original_price && (
                          <span className="block text-sm text-gray-400 line-through">
                            Rs. {product.original_price}
                          </span>
                        )}
                      </div>
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
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {product.is_new && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            New
                          </span>
                        )}
                        {product.is_featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#0073aa] transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Count */}
      {!loading && (
        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Product
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout title="Products">
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#0073aa] border-t-transparent rounded-full animate-spin" />
          </div>
        </AdminLayout>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
