'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, User, Lightbulb, Key, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCategories, Category } from '@/lib/supabase';

const categoryConfig: Record<string, { gradient: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  figurines: {
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    icon: User,
  },
  lamps: {
    gradient: 'from-yellow-500 to-orange-500',
    bgColor: 'bg-yellow-50',
    icon: Lightbulb,
  },
  accessories: {
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    icon: Key,
  },
  default: {
    gradient: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50',
    icon: Package,
  },
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    }
    loadCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our collection of custom-made collectibles
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((category, index) => {
            const config = categoryConfig[category.slug] || categoryConfig.default;
            const IconComponent = config.icon;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="group block relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 funko-card"
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                  {/* Content */}
                  <div className="relative p-8 lg:p-10 text-center">
                    {/* Icon Container */}
                    <div className={`inline-flex items-center justify-center w-24 h-24 lg:w-28 lg:h-28 ${config.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-12 h-12 lg:w-14 lg:h-14 text-gray-700" />
                    </div>

                    {/* Name */}
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-funko-purple transition-colors duration-300 mb-1">
                      {category.name}
                    </h3>

                    {/* Count */}
                    <p className="text-sm text-gray-400 mb-4">
                      {category.product_count} {category.product_count === 1 ? 'Product' : 'Products'}
                    </p>

                    {/* Arrow */}
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-funko-purple opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Shop Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Featured Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-8 lg:p-12">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">
                  Custom Made Just for You
                </h3>
                <p className="text-white/80 max-w-md">
                  Every piece is handcrafted with love and attention to detail
                </p>
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
