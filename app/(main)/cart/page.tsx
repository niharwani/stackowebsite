'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Package,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getProductImage } from '@/lib/utils';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shippingCost = totalPrice >= 2000 ? 0 : 99;
  const orderTotal = totalPrice + shippingCost;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      alert('This is a demo store. Checkout functionality would be implemented in production.');
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Looks like you haven't added any collectibles to your cart yet. Start browsing to find your next favorite piece!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                // Handle both Supabase format (snake_case) and legacy format (camelCase)
                const product = item.product;
                const imageUrl = 'image_url' in product ? getProductImage(product.image_url) : null;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link
                        href={`/product/${product.id}`}
                        className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
                      >
                        {imageUrl ? (
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Package className="w-12 h-12 text-gray-400" />
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              {product.category.replace('-', ' ')}
                            </p>
                            <Link
                              href={`/product/${product.id}`}
                              className="font-semibold text-gray-900 hover:text-funko-purple transition-colors line-clamp-1"
                            >
                              {product.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
                            <button
                              onClick={() => updateQuantity(product.id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-gray-900 font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(product.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                {formatPrice(product.price)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-2 block font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black"
                    />
                  </div>
                  <button className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Summary Lines */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'font-medium text-gray-900'}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over Rs. 2,000
                  </p>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(orderTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Checkout
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Truck className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Fast, reliable shipping</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
