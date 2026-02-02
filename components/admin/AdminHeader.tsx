'use client';

import { Menu, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function AdminHeader({ onMenuClick, title }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Page Title */}
        {title && (
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* View Store Link */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <span className="hidden sm:inline">View Store</span>
          <ExternalLink className="w-4 h-4" />
        </Link>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* Admin Avatar */}
        <div className="w-8 h-8 bg-[#0073aa] rounded-full flex items-center justify-center text-white font-medium text-sm">
          A
        </div>
      </div>
    </header>
  );
}
