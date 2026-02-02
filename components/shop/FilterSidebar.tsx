'use client';

// This component is deprecated - the shop page now has its own FilterSidebarDynamic component
// that fetches categories from Supabase

import { X, SlidersHorizontal } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showInStockOnly: boolean;
  onInStockChange: (value: boolean) => void;
  onClearFilters: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  showInStockOnly,
  onInStockChange,
  onClearFilters,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
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
              <X className="w-6 h-6" />
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
