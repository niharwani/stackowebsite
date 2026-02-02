'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-black hover:bg-gray-800 text-white focus:ring-gray-500 shadow-sm hover:shadow-md',
      secondary: 'bg-funko-purple hover:bg-purple-700 text-white focus:ring-purple-500 shadow-sm hover:shadow-md',
      outline: 'border-2 border-black text-black hover:bg-black hover:text-white focus:ring-gray-500',
      ghost: 'text-gray-700 hover:bg-gray-100 hover:text-black focus:ring-gray-500',
      white: 'bg-white hover:bg-gray-100 text-black focus:ring-gray-500 shadow-sm hover:shadow-md',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
