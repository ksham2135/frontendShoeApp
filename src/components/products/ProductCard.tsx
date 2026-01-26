import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const inWishlist = isInWishlist(product.id);

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }

    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    const success = addToCart(product.id, 1, product.sizes[0], product.colors[0]);
    if (success) {
      alert('Added to cart!');
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card group block">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || '/placeholder.svg'}
          alt={product.name}
          className="product-image w-full h-full object-cover"
        />
        
        {/* Sale Badge */}
        {discountPercentage > 0 && (
          <span className="sale-badge">{discountPercentage}% OFF</span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="wishlist-btn"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
          />
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full py-2 px-4 bg-accent text-accent-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors disabled:opacity-50"
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {product.brand}
        </p>
        <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="price-current">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <>
              <span className="price-original">₹{product.original_price.toLocaleString()}</span>
              <span className="price-discount">({discountPercentage}% off)</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
