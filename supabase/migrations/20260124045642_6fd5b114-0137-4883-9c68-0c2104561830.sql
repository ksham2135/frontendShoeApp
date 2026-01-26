-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'customer');

-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'customer',
    UNIQUE (user_id, role)
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors TEXT[] NOT NULL DEFAULT '{}',
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist table
CREATE TABLE public.wishlist (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- Create cart_items table
CREATE TABLE public.cart_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, product_id, size, color)
);

-- Create order_status enum
CREATE TYPE public.order_status AS ENUM ('placed', 'shipped', 'delivered', 'cancelled');

-- Create payment_status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'success', 'failed');

-- Create orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL UNIQUE,
    status order_status NOT NULL DEFAULT 'placed',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    coupon_code TEXT,
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discount_type enum
CREATE TYPE public.discount_type AS ENUM ('percentage', 'flat');

-- Create coupons table
CREATE TABLE public.coupons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type discount_type NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_value DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_roles (read-only for users, admin can manage)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view active products" ON public.products
  FOR SELECT USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for wishlist
CREATE POLICY "Users can view their own wishlist" ON public.wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own wishlist" ON public.wishlist
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" ON public.cart_items
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON public.order_items
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coupons
CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupons
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for contact_messages
CREATE POLICY "Anyone can create contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON public.contact_messages
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage contact messages" ON public.contact_messages
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Men', 'men', 'Premium footwear collection for men', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'),
  ('Women', 'women', 'Stylish and comfortable shoes for women', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800'),
  ('Kids', 'kids', 'Fun and durable shoes for kids', 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=800');

-- Insert sample products
INSERT INTO public.products (name, brand, category_id, sizes, colors, price, original_price, stock_quantity, description, image_url, is_featured) VALUES
  ('Air Max Pro', 'Nike', (SELECT id FROM public.categories WHERE slug = 'men'), ARRAY['7', '8', '9', '10', '11'], ARRAY['Black', 'White', 'Red'], 12999.00, 15999.00, 50, 'Premium running shoes with advanced cushioning technology', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', true),
  ('Classic Leather', 'Adidas', (SELECT id FROM public.categories WHERE slug = 'men'), ARRAY['7', '8', '9', '10', '11', '12'], ARRAY['White', 'Black'], 8999.00, 10999.00, 75, 'Timeless leather sneakers for everyday wear', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', true),
  ('Sport Runner', 'Puma', (SELECT id FROM public.categories WHERE slug = 'men'), ARRAY['7', '8', '9', '10'], ARRAY['Blue', 'Black', 'Grey'], 6999.00, NULL, 100, 'Lightweight running shoes for maximum performance', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', false),
  ('Ultra Boost', 'Adidas', (SELECT id FROM public.categories WHERE slug = 'men'), ARRAY['8', '9', '10', '11'], ARRAY['Black', 'White'], 17999.00, 21999.00, 30, 'Revolutionary boost technology for ultimate comfort', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', true),
  ('Gel Kayano', 'Asics', (SELECT id FROM public.categories WHERE slug = 'men'), ARRAY['7', '8', '9', '10', '11'], ARRAY['Navy', 'Grey'], 14999.00, NULL, 45, 'Premium stability running shoes', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', false),
  ('Floral Canvas', 'Vans', (SELECT id FROM public.categories WHERE slug = 'women'), ARRAY['5', '6', '7', '8'], ARRAY['Pink', 'White', 'Floral'], 5999.00, 7999.00, 60, 'Stylish canvas shoes with floral prints', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', true),
  ('Air Zoom Pegasus', 'Nike', (SELECT id FROM public.categories WHERE slug = 'women'), ARRAY['5', '6', '7', '8', '9'], ARRAY['Pink', 'Purple', 'White'], 11999.00, 14999.00, 40, 'Responsive cushioning for daily runs', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800', true),
  ('Stan Smith', 'Adidas', (SELECT id FROM public.categories WHERE slug = 'women'), ARRAY['5', '6', '7', '8'], ARRAY['White', 'Green', 'Pink'], 9999.00, NULL, 55, 'Iconic tennis-inspired sneakers', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', false),
  ('Gel-Nimbus', 'Asics', (SELECT id FROM public.categories WHERE slug = 'women'), ARRAY['5', '6', '7', '8', '9'], ARRAY['Lavender', 'White'], 15999.00, 18999.00, 35, 'Maximum cushioning for long runs', 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800', true),
  ('Classic Slip-On', 'Vans', (SELECT id FROM public.categories WHERE slug = 'women'), ARRAY['5', '6', '7', '8'], ARRAY['Black', 'Checkered'], 4999.00, NULL, 80, 'Easy slip-on style for everyday', 'https://images.unsplash.com/photo-1494496195158-c3becb4f2475?w=800', false),
  ('Kids Air Max', 'Nike', (SELECT id FROM public.categories WHERE slug = 'kids'), ARRAY['1', '2', '3', '4', '5'], ARRAY['Blue', 'Red', 'White'], 5999.00, 7999.00, 70, 'Comfortable and stylish shoes for active kids', 'https://images.unsplash.com/photo-1555274175-75f79b09d5b8?w=800', true),
  ('Junior Runner', 'Adidas', (SELECT id FROM public.categories WHERE slug = 'kids'), ARRAY['1', '2', '3', '4', '5', '6'], ARRAY['Pink', 'Blue', 'Yellow'], 4499.00, NULL, 90, 'Lightweight running shoes for young athletes', 'https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=800', true),
  ('Flex Contact', 'Nike', (SELECT id FROM public.categories WHERE slug = 'kids'), ARRAY['2', '3', '4', '5'], ARRAY['Grey', 'Orange'], 3999.00, 4999.00, 65, 'Flexible and breathable for everyday play', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800', false),
  ('Speedster Jr', 'Puma', (SELECT id FROM public.categories WHERE slug = 'kids'), ARRAY['1', '2', '3', '4', '5'], ARRAY['Green', 'Black'], 3499.00, NULL, 85, 'Speed-focused design for young runners', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', false),
  ('Light Up Sneakers', 'Skechers', (SELECT id FROM public.categories WHERE slug = 'kids'), ARRAY['1', '2', '3', '4'], ARRAY['Rainbow', 'Blue'], 4999.00, 5999.00, 50, 'Fun light-up shoes kids love', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', true);

-- Insert sample coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active, expires_at) VALUES
  ('WELCOME10', 'percentage', 10, 1000, 1000, true, now() + interval '1 year'),
  ('FLAT500', 'flat', 500, 3000, 500, true, now() + interval '6 months'),
  ('SUMMER20', 'percentage', 20, 5000, 200, true, now() + interval '3 months');