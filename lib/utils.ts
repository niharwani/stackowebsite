import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// Parse images from stored format (JSON array or single URL)
export function parseProductImages(imageUrl: string | null): string[] {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Not JSON, treat as single URL
    if (imageUrl.startsWith('http')) return [imageUrl];
  }
  return [];
}

// Get first/main image from stored format
export function getProductImage(imageUrl: string | null): string | null {
  const images = parseProductImages(imageUrl);
  return images.length > 0 ? images[0] : null;
}
