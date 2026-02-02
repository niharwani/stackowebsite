'use client';

import { useState } from 'react';
import { X, Truck } from 'lucide-react';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black text-white py-2.5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-sm">
        <Truck className="w-4 h-4" />
        <span className="font-medium">FREE SHIPPING</span>
        <span className="text-white/80">on orders Rs. 2,000+</span>
        <span className="mx-2 text-white/40 hidden sm:inline">|</span>
        <span className="text-white/80 hidden sm:inline">Handcrafted with love</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
