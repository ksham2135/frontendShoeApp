import { useState, useEffect, useCallback } from 'react';
import { Product, getProductById } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const WISHLIST_STORAGE_KEY = 'stride_wishlist';

export interface WishlistItemWithProduct {
  id: string;
  product_id: string;
  product: Product;
}

function getStoredWishlist(): string[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveWishlist(productIds: string[]) {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(productIds));
}

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage
  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      setIsLoading(false);
      return;
    }

    const stored = getStoredWishlist();
    const items: WishlistItemWithProduct[] = [];
    
    for (const productId of stored) {
      const product = getProductById(productId);
      if (product) {
        items.push({
          id: `wish_${productId}`,
          product_id: productId,
          product,
        });
      }
    }
    
    setWishlistItems(items);
    setIsLoading(false);
  }, [user]);

  const addToWishlist = useCallback((productId: string): boolean => {
    if (!user) return false;

    const product = getProductById(productId);
    if (!product) return false;

    const stored = getStoredWishlist();
    if (stored.includes(productId)) return false;

    stored.push(productId);
    saveWishlist(stored);
    
    setWishlistItems(prev => [...prev, {
      id: `wish_${productId}`,
      product_id: productId,
      product,
    }]);
    
    return true;
  }, [user]);

  const removeFromWishlist = useCallback((productId: string) => {
    const stored = getStoredWishlist().filter(id => id !== productId);
    saveWishlist(stored);
    setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
  }, [wishlistItems]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistItems.some(item => item.product_id === productId);
  }, [wishlistItems]);

  return {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };
}
