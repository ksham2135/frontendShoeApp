import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">STRIDE</h3>
            <p className="text-sm text-primary-foreground/70">
              Premium footwear for every step of your journey. Quality, comfort, and style combined.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/products/men" className="hover:text-primary-foreground transition-colors">Men</Link></li>
              <li><Link to="/products/women" className="hover:text-primary-foreground transition-colors">Women</Link></li>
              <li><Link to="/products/kids" className="hover:text-primary-foreground transition-colors">Kids</Link></li>
              <li><Link to="/products" className="hover:text-primary-foreground transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide">Account</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/orders" className="hover:text-primary-foreground transition-colors">My Orders</Link></li>
              <li><Link to="/wishlist" className="hover:text-primary-foreground transition-colors">Wishlist</Link></li>
              <li><Link to="/coupons" className="hover:text-primary-foreground transition-colors">Coupons</Link></li>
              <li><Link to="/cart" className="hover:text-primary-foreground transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold uppercase tracking-wide">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">FAQs</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/70">
          <p>&copy; {new Date().getFullYear()} STRIDE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
