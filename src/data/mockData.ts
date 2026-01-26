// Mock Data - Static JSON-like data for the shoe store

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  category_slug: string;
  sizes: string[];
  colors: string[];
  price: number;
  original_price: number | null;
  stock_quantity: number;
  description: string;
  image_url: string;
  is_featured: boolean;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: 'placed' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  shipping_address: ShippingAddress;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
}

// Categories Data
export const categories: Category[] = [
  {
    id: '1',
    name: 'Men',
    slug: 'men',
    description: 'Premium footwear collection for men',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '2',
    name: 'Women',
    slug: 'women',
    description: 'Stylish footwear collection for women',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60',
  },
  {
    id: '3',
    name: 'Kids',
    slug: 'kids',
    description: 'Comfortable footwear for kids',
    image_url: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=800&auto=format&fit=crop&q=60',
  },
];

// Products Data
export const products: Product[] = [
  // Men's Shoes
  {
    id: 'p1',
    name: 'Air Max Pro Runner',
    brand: 'Nike',
    category_id: '1',
    category_slug: 'men',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Black', 'White', 'Red'],
    price: 8999,
    original_price: 12999,
    stock_quantity: 25,
    description: 'Premium running shoes with advanced cushioning technology for maximum comfort during long runs.',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  {
    id: 'p2',
    name: 'Classic Leather Sneakers',
    brand: 'Adidas',
    category_id: '1',
    category_slug: 'men',
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['White', 'Black'],
    price: 6499,
    original_price: 7999,
    stock_quantity: 30,
    description: 'Timeless leather sneakers that combine style with everyday comfort.',
    image_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  {
    id: 'p3',
    name: 'Trail Blazer Hiking Boots',
    brand: 'Puma',
    category_id: '1',
    category_slug: 'men',
    sizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Brown', 'Green'],
    price: 7999,
    original_price: null,
    stock_quantity: 15,
    description: 'Durable hiking boots built for tough terrains with waterproof protection.',
    image_url: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=800&auto=format&fit=crop&q=60',
    is_featured: false,
  },
  {
    id: 'p4',
    name: 'Sport Elite Basketball',
    brand: 'Nike',
    category_id: '1',
    category_slug: 'men',
    sizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    colors: ['Black/Red', 'White/Blue'],
    price: 11999,
    original_price: 14999,
    stock_quantity: 20,
    description: 'High-performance basketball shoes with excellent ankle support and grip.',
    image_url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  
  // Women's Shoes
  {
    id: 'p5',
    name: 'Cloud Walker Running',
    brand: 'Nike',
    category_id: '2',
    category_slug: 'women',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Pink', 'White', 'Grey'],
    price: 7499,
    original_price: 9999,
    stock_quantity: 35,
    description: 'Lightweight running shoes designed for comfort and style.',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  {
    id: 'p6',
    name: 'Elegant Heels Classic',
    brand: 'Bata',
    category_id: '2',
    category_slug: 'women',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'],
    colors: ['Black', 'Nude', 'Red'],
    price: 3999,
    original_price: 5499,
    stock_quantity: 40,
    description: 'Classic heels perfect for formal occasions and office wear.',
    image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=60',
    is_featured: false,
  },
  {
    id: 'p7',
    name: 'Flex Yoga Trainers',
    brand: 'Adidas',
    category_id: '2',
    category_slug: 'women',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Purple', 'Black', 'Mint'],
    price: 5999,
    original_price: null,
    stock_quantity: 25,
    description: 'Flexible trainers ideal for yoga and light workouts.',
    image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  {
    id: 'p8',
    name: 'Street Style Sneakers',
    brand: 'Puma',
    category_id: '2',
    category_slug: 'women',
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7'],
    colors: ['White', 'Pink', 'Black'],
    price: 4999,
    original_price: 6999,
    stock_quantity: 30,
    description: 'Trendy sneakers for casual everyday wear.',
    image_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=60',
    is_featured: false,
  },
  
  // Kids' Shoes
  {
    id: 'p9',
    name: 'Little Champion Sports',
    brand: 'Nike',
    category_id: '3',
    category_slug: 'kids',
    sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
    colors: ['Blue', 'Red', 'Green'],
    price: 3499,
    original_price: 4999,
    stock_quantity: 50,
    description: 'Comfortable sports shoes for active kids.',
    image_url: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  {
    id: 'p10',
    name: 'School Day Classic',
    brand: 'Bata',
    category_id: '3',
    category_slug: 'kids',
    sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4'],
    colors: ['Black', 'Brown'],
    price: 1999,
    original_price: null,
    stock_quantity: 60,
    description: 'Durable school shoes built to last.',
    image_url: 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=800&auto=format&fit=crop&q=60',
    is_featured: false,
  },
  {
    id: 'p11',
    name: 'Playground Runner',
    brand: 'Adidas',
    category_id: '3',
    category_slug: 'kids',
    sizes: ['UK 2', 'UK 3', 'UK 4', 'UK 5'],
    colors: ['Orange', 'Blue', 'Pink'],
    price: 2999,
    original_price: 3999,
    stock_quantity: 45,
    description: 'Fun and colorful shoes for playground adventures.',
    image_url: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=800&auto=format&fit=crop&q=60',
    is_featured: true,
  },
  {
    id: 'p12',
    name: 'Cozy Velcro Sneakers',
    brand: 'Puma',
    category_id: '3',
    category_slug: 'kids',
    sizes: ['UK 1', 'UK 2', 'UK 3'],
    colors: ['Navy', 'Grey', 'White'],
    price: 2499,
    original_price: null,
    stock_quantity: 40,
    description: 'Easy-to-wear velcro sneakers for little ones.',
    image_url: 'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=800&auto=format&fit=crop&q=60',
    is_featured: false,
  },
];

// Coupons Data
export const coupons: Coupon[] = [
  {
    id: 'c1',
    code: 'WELCOME10',
    discount_type: 'percentage',
    discount_value: 10,
    min_order_value: 1000,
    max_uses: null,
    used_count: 0,
    expires_at: '2026-12-31',
  },
  {
    id: 'c2',
    code: 'FLAT500',
    discount_type: 'flat',
    discount_value: 500,
    min_order_value: 3000,
    max_uses: 100,
    used_count: 45,
    expires_at: '2026-06-30',
  },
  {
    id: 'c3',
    code: 'SUMMER25',
    discount_type: 'percentage',
    discount_value: 25,
    min_order_value: 5000,
    max_uses: 50,
    used_count: 12,
    expires_at: '2026-03-31',
  },
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category_slug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.is_featured);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    p => p.name.toLowerCase().includes(lowerQuery) || 
         p.brand.toLowerCase().includes(lowerQuery)
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function validateCoupon(code: string, orderTotal: number): { valid: boolean; discount: number; error?: string; coupon?: Coupon } {
  const coupon = coupons.find(c => c.code === code.toUpperCase());
  
  if (!coupon) {
    return { valid: false, discount: 0, error: 'Invalid coupon code' };
  }
  
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, discount: 0, error: 'Coupon has expired' };
  }
  
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { valid: false, discount: 0, error: 'Coupon usage limit reached' };
  }
  
  if (orderTotal < coupon.min_order_value) {
    return { valid: false, discount: 0, error: `Minimum order value is ₹${coupon.min_order_value}` };
  }
  
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (orderTotal * coupon.discount_value) / 100;
  } else {
    discount = coupon.discount_value;
  }
  
  return { valid: true, discount: Math.min(discount, orderTotal), coupon };
}
