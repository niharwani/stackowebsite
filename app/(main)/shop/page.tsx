'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { getProducts, getCategories, Product, Category } from '@/lib/supabase';
import ProductGrid from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';

type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((p) => p.in_stock);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered = [...filtered].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, showInStockOnly, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, 5000]);
    setShowInStockOnly(false);
    setSortBy('featured');
  };

  if (loading) {
    return <ShopLoading />;
  }

  return (
    <>
      {/* Search & Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition-all duration-200"
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-black cursor-pointer min-w-[180px]"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-black transition-colors"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <FilterSidebarWrapper
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          showInStockOnly={showInStockOnly}
          onInStockChange={setShowInStockOnly}
          onClearFilters={clearFilters}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />

        {/* Products */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="text-gray-900 font-medium">{filteredProducts.length}</span> products
            </p>
          </div>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </>
  );
}

// Wrapper for FilterSidebar to work with Supabase categories
function FilterSidebarWrapper({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showInStockOnly,
  onInStockChange,
  onClearFilters,
  isMobileOpen,
  onMobileClose,
}: {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showInStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  onClearFilters: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  return (
    <FilterSidebarDynamic
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={onCategoryChange}
      priceRange={priceRange}
      onPriceRangeChange={onPriceRangeChange}
      showInStockOnly={showInStockOnly}
      onInStockChange={onInStockChange}
      onClearFilters={onClearFilters}
      isMobileOpen={isMobileOpen}
      onMobileClose={onMobileClose}
    />
  );
}

// Dynamic filter sidebar that uses Supabase categories
function FilterSidebarDynamic({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showInStockOnly,
  onInStockChange,
  onClearFilters,
  isMobileOpen,
  onMobileClose,
}: {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showInStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  onClearFilters: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const hasActiveFilters = selectedCategory !== 'all' || showInStockOnly || priceRange[0] > 0 || priceRange[1] < 5000;

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h3 className="font-bold text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-funko-purple hover:text-purple-700 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Category</h4>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange('all')}
            className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              selectedCategory === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-between text-sm font-medium ${
                selectedCategory === category.slug
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.name}</span>
              <span className={`text-xs ${selectedCategory === category.slug ? 'text-white/70' : 'text-gray-400'}`}>
                {category.product_count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Price Range</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => onPriceRangeChange([Number(e.target.value), priceRange[1]])}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <span className="text-gray-400 pt-5">-</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <input
                type="number"
                min={priceRange[0]}
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-8">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Availability</h4>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 bg-white text-black focus:ring-black accent-black"
          />
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm font-medium">
            In Stock Only
          </span>
        </label>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {content}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onMobileClose} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900"
            >
              <span className="text-xl">&times;</span>
            </button>
            <div className="pt-8">
              {content}
            </div>
            <div className="mt-6">
              <button
                onClick={onMobileClose}
                className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShopLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-[180px] h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 h-96 bg-gray-200 rounded-xl animate-pulse" />
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Shop All
          </h1>
          <p className="text-gray-600 mt-2">
            Browse our complete collection of custom collectibles
          </p>
        </motion.div>

        <Suspense fallback={<ShopLoading />}>
          <ShopContent />
        </Suspense>
      </div>
    </div>
  );
}
