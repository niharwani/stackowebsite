'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getCategories, Category } from '@/lib/supabase';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryInput,
} from '@/lib/supabase-admin';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState<CategoryInput>({
    name: '',
    slug: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, slug: category.slug });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', slug: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '' });
    setError('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Category slug is required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      await loadCategories();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Make sure no products are using this category.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout title="Categories">
      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500">
          {loading ? 'Loading...' : `${categories.length} categories`}
        </p>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0073aa] hover:bg-[#005f8b] text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-[#0073aa] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No categories yet</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 text-[#0073aa] hover:underline"
            >
              <Plus className="w-4 h-4" />
              Create your first category
            </button>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-gray-500" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-[#0073aa] transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">/{category.slug}</p>
              <p className="text-sm text-gray-600">
                {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g., Figurines"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="e.g., figurines"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073aa] focus:border-[#0073aa] outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Used in URLs. Auto-generated from name.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#0073aa] hover:bg-[#005f8b] text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingCategory ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Category
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{categoryToDelete?.name}"?
              {categoryToDelete && categoryToDelete.product_count > 0 && (
                <span className="block mt-2 text-amber-600 font-medium">
                  Warning: This category has {categoryToDelete.product_count} products.
                </span>
              )}
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
                    <Loader2 className="w-4 h-4 animate-spin" />
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
