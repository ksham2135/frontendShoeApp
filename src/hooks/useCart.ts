import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, getProductById } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const CART_STORAGE_KEY = 'stride_cart';

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

function getStoredCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    const stored = getStoredCart();
    const itemsWithProducts: CartItemWithProduct[] = [];
    
    for (const item of stored) {
      const product = getProductById(item.product_id);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    setCartItems(itemsWithProducts);
    setIsLoading(false);
  }, [user]);

  const addToCart = useCallback((productId: string, quantity: number = 1, size: string, color: string): boolean => {
    if (!user) return false;

    const product = getProductById(productId);
    if (!product) return false;

    const stored = getStoredCart();
    const existingIndex = stored.findIndex(
      item => item.product_id === productId && item.size === size && item.color === color
    );

    if (existingIndex >= 0) {
      stored[existingIndex].quantity += quantity;
    } else {
      stored.push({
        id: `cart_${Date.now()}`,
        product_id: productId,
        quantity,
        size,
        color,
      });
    }

    saveCart(stored);
    
    // Update state
    const itemsWithProducts: CartItemWithProduct[] = [];
    for (const item of stored) {
      const prod = getProductById(item.product_id);
      if (prod) {
        itemsWithProducts.push({ ...item, product: prod });
      }
    }
    setCartItems(itemsWithProducts);
    
    return true;
  }, [user]);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    const stored = getStoredCart();
    
    if (quantity <= 0) {
      const filtered = stored.filter(item => item.id !== itemId);
      saveCart(filtered);
    } else {
      const index = stored.findIndex(item => item.id === itemId);
      if (index >= 0) {
        stored[index].quantity = quantity;
        saveCart(stored);
      }
    }

    // Update state
    const updated = quantity <= 0 
      ? cartItems.filter(item => item.id !== itemId)
      : cartItems.map(item => item.id === itemId ? { ...item, quantity } : item);
    setCartItems(updated);
  }, [cartItems]);

  const removeFromCart = useCallback((itemId: string) => {
    const stored = getStoredCart().filter(item => item.id !== itemId);
    saveCart(stored);
    setCartItems(cartItems.filter(item => item.id !== itemId));
  }, [cartItems]);

  const clearCart = useCallback(() => {
    saveCart([]);
    setCartItems([]);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount: cartItems.length,
  };
}
