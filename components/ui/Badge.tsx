'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'new' | 'sale' | 'soldout' | 'exclusive';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'new', children, className }: BadgeProps) {
  const variants = {
    new: 'bg-black text-white',
    sale: 'bg-red-600 text-white',
    soldout: 'bg-gray-400 text-white',
    exclusive: 'bg-purple-600 text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-bold uppercase tracking-wide rounded',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
