'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const megaMenuData = {
  products: {
    title: 'Products',
    categories: [
      { name: 'Figurines', href: '/shop?category=figurines' },
      { name: 'Lamps', href: '/shop?category=lamps' },
      { name: 'Accessories', href: '/shop?category=accessories' },
    ],
    featured: {
      title: 'Popular',
      items: [
        { name: "Mini'Me Figurine", href: '/shop?category=figurines' },
        { name: "Couple Mini'Me", href: '/shop?category=figurines' },
        { name: 'Custom Lamp', href: '/shop?category=lamps' },
      ],
    },
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Shop All', hasMegaMenu: false },
    { href: '#', label: 'Products', hasMegaMenu: true, menuKey: 'products' },
    { href: '/about', label: 'About', hasMegaMenu: false },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="relative w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:bg-funko-purple transition-colors duration-300">
                <span className="text-white font-display font-bold text-xl">S</span>
              </div>
              <span className="text-2xl lg:text-3xl font-display font-bold text-black tracking-tight hidden sm:block uppercase">
                STACKO
              </span>
            </Link>

            {/* Center: Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1" ref={megaMenuRef}>
              {navLinks.map(link => (
                <div key={link.label} className="relative">
                  {link.hasMegaMenu ? (
                    <button
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        activeMegaMenu === link.menuKey
                          ? 'text-funko-purple'
                          : 'text-gray-700 hover:text-black'
                      }`}
                      onClick={() => setActiveMegaMenu(activeMegaMenu === link.menuKey ? null : link.menuKey!)}
                      onMouseEnter={() => setActiveMegaMenu(link.menuKey!)}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMegaMenu === link.menuKey ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {activeMegaMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg mega-menu"
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <div className="grid grid-cols-4 gap-8">
                        {/* Categories */}
                        <div className="col-span-2">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 font-poppins">
                            Shop by Category
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {megaMenuData.products.categories.map(category => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                onClick={() => setActiveMegaMenu(null)}
                              >
                                <span className="font-medium text-gray-900 group-hover:text-funko-purple transition-colors">
                                  {category.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Featured */}
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 font-poppins">
                            Popular
                          </h3>
                          <ul className="space-y-3">
                            {megaMenuData.products.featured.items.map(item => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className="text-gray-700 hover:text-funko-purple transition-colors font-medium"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Promo Card */}
                        <div className="bg-gradient-to-br from-funko-purple to-funko-pink rounded-xl p-6 text-white">
                          <h3 className="font-display font-bold text-xl mb-2 uppercase">Custom Made</h3>
                          <p className="text-white/80 text-sm mb-4">
                            Every piece is handcrafted with love just for you.
                          </p>
                          <Link
                            href="/shop"
                            className="inline-block bg-white text-funko-purple font-semibold px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                            onClick={() => setActiveMegaMenu(null)}
                          >
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
                    >
                      <div className="relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-funko-purple focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <div className="mt-3 text-sm text-gray-500">
                        <p className="font-medium text-gray-700 mb-2">Popular Searches</p>
                        <div className="flex flex-wrap gap-2">
                          {["Mini'Me", 'Couple', 'Lamp', 'Keychain'].map(term => (
                            <Link
                              key={term}
                              href={`/shop?search=${term.toLowerCase()}`}
                              className="px-3 py-1 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                              onClick={() => setIsSearchOpen(false)}
                            >
                              {term}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.hasMegaMenu ? '/shop' : link.href}
                  className="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-funko-purple rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
