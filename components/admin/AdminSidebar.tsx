'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  Image,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
  { href: '/admin/media', icon: Image, label: 'Media' },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/admin/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#1d2327] text-white z-50 transition-all duration-300 flex flex-col
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          {!collapsed && (
            <Link href="/admin" className="font-display text-xl font-bold">
              Stacko Admin
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 hover:bg-gray-700 rounded"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors
                      ${active
                        ? 'bg-[#0073aa] text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
          {!collapsed && (
            <Link
              href="/"
              target="_blank"
              className="block text-center text-xs text-gray-500 mt-3 hover:text-gray-400"
            >
              View Store
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
