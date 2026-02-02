'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Package } from 'lucide-react';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="funko-card"
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:border-gray-300 hover:shadow-xl">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.is_new && <Badge variant="new">New</Badge>}
            {product.original_price && (
              <Badge variant="sale">
                -{calculateDiscount(product.original_price, product.price)}%
              </Badge>
            )}
            {!product.in_stock && <Badge variant="soldout">Sold Out</Badge>}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full transition-colors duration-200 shadow-md"
              aria-label="Add to wishlist"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Image Container */}
          <div className="relative aspect-square p-6 flex items-center justify-center bg-gray-50 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="transform group-hover:scale-110 transition-transform duration-500 product-image-zoom">
                <Package className="w-24 h-24 text-gray-400" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 bg-white">
            {/* Category */}
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              {product.category.replace('-', ' ')}
            </p>

            {/* Name */}
            <h3 className="font-semibold text-gray-900 group-hover:text-funko-purple transition-colors duration-300 line-clamp-1 mb-2">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="p-2 bg-black hover:bg-funko-purple text-white rounded-lg transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
