'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Package,
  Frown,
  MessageCircle,
} from 'lucide-react';
import { getProductById, getProductsByCategory, Product } from '@/lib/supabase';
import { formatPrice, calculateDiscount, getProductImage, parseProductImages } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/shop/ProductCard';

const WHATSAPP_NUMBER = '919987744781';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      const productData = await getProductById(params.id as string);
      setProduct(productData);

      if (productData) {
        const related = await getProductsByCategory(productData.category);
        setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));
      }

      setLoading(false);
    }
    loadProduct();
  }, [params.id]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hi! I'm interested in buying *${product.name}* (Rs. ${product.price}). Please let me know the availability and next steps.`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-24 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded w-40"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <Frown className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            {(() => {
              const images = parseProductImages(product.image_url);
              const currentImage = images[selectedImageIndex] || null;

              return (
                <>
                  {/* Main Image */}
                  <div className="aspect-square bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center relative">
                    {/* Badges */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                      {product.is_new && <Badge variant="new">New</Badge>}
                      {product.original_price && (
                        <Badge variant="sale">
                          -{calculateDiscount(product.original_price, product.price)}%
                        </Badge>
                      )}
                    </div>

                    {/* Product Image */}
                    {currentImage ? (
                      <img
                        src={currentImage}
                        alt={product.name}
                        className="w-full h-full object-contain p-8"
                      />
                    ) : (
                      <Package className="w-32 h-32 text-gray-400" />
                    )}
                  </div>

                  {/* Image Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                            index === selectedImageIndex
                              ? 'border-black'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-contain bg-gray-50 p-1"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            {/* Category */}
            <p className="text-gray-500 uppercase tracking-wider text-sm font-medium mb-2">
              {product.category.replace('-', ' ')}
            </p>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-900 font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-black text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.in_stock ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className={`font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 py-4 px-8 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600"
              >
                <MessageCircle className="w-5 h-5" />
                Order on WhatsApp
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Truck className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over Rs. 2000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shield className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Handcrafted</p>
                  <p className="text-xs text-gray-500">Made with love</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                  <p className="text-xs text-gray-500">7-day policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-gray-200 pt-12"
          >
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
