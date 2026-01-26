import { useState, useEffect, useCallback } from 'react';
import { Order, ShippingAddress } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { CartItemWithProduct } from './useCart';

const ORDERS_STORAGE_KEY = 'stride_orders';

function getStoredOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

function generateOrderNumber(): string {
  return `STR${Date.now().toString(36).toUpperCase()}`;
}

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from localStorage
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const stored = getStoredOrders();
    setOrders(stored);
    setIsLoading(false);
  }, [user]);

  const createOrder = useCallback((
    cartItems: CartItemWithProduct[],
    shippingAddress: ShippingAddress,
    couponCode: string | null,
    discount: number
  ): Order => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const total = subtotal - discount;

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      order_number: generateOrderNumber(),
      status: 'placed',
      subtotal,
      discount,
      total,
      coupon_code: couponCode,
      shipping_address: shippingAddress,
      created_at: new Date().toISOString(),
      items: cartItems.map(item => ({
        id: `item_${Date.now()}_${item.id}`,
        product_id: item.product_id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color,
      })),
    };

    const stored = getStoredOrders();
    stored.unshift(newOrder);
    saveOrders(stored);
    setOrders(stored);

    return newOrder;
  }, []);

  return {
    orders,
    isLoading,
    createOrder,
  };
}
