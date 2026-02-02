import Link from 'next/link';
import { Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', href: '/shop' },
      { label: 'Figurines', href: '/shop?category=figurines' },
      { label: 'Lamps', href: '/shop?category=lamps' },
      { label: 'Accessories', href: '/shop?category=accessories' },
    ],
    assistance: [
      { label: 'FAQ', href: '#' },
      { label: 'Shipping Info', href: '#' },
      { label: 'Returns & Exchanges', href: '#' },
      { label: 'Track Your Order', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
    about: [
      { label: 'About Stacko', href: '/about' },
      { label: 'Our Story', href: '/about' },
      { label: 'Contact', href: '#' },
    ],
    connect: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'WhatsApp', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-display font-bold text-black tracking-tight uppercase">
                STACKO
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-6">
              Custom collectibles made with love. Personalized figurines, lamps, and accessories just for you.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 text-gray-500 hover:text-black hover:bg-gray-200 rounded-lg transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-sm font-display font-bold text-black uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Assistance Links */}
          <div>
            <h3 className="text-sm font-display font-bold text-black uppercase tracking-wider mb-4">Help</h3>
            <ul className="space-y-3">
              {footerLinks.assistance.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-display font-bold text-black uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-3">
              {footerLinks.about.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h3 className="text-sm font-display font-bold text-black uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-3">
              {footerLinks.connect.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-black text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Stacko. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="#" className="text-gray-500 hover:text-black transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-black transition-colors">
                Terms of Service
              </Link>
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>India</span>
              <span>|</span>
              <span>INR ₹</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
