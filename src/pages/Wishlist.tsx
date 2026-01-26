import { useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlistItems, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="mb-4">Please login to view your wishlist</p>
          <button onClick={() => navigate('/auth')} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
            Login
          </button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">Loading...</div>
      </Layout>
    );
  }

  if (!wishlistItems.length) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-4">Save items you love to your wishlist</p>
          <Link to="/products" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
            Explore Products
          </Link>
        </div>
      </Layout>
    );
  }

  const handleMoveToCart = (item: typeof wishlistItems[0]) => {
    const success = addToCart(item.product_id, 1, item.product.sizes[0], item.product.colors[0]);
    if (success) {
      removeFromWishlist(item.product_id);
      alert('Moved to cart!');
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistItems.length} items)</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden group">
              <Link to={`/product/${item.product_id}`} className="block aspect-square bg-muted">
                <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="w-full h-full object-cover" />
              </Link>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase">{item.product.brand}</p>
                <Link to={`/product/${item.product_id}`} className="font-medium line-clamp-2 hover:text-accent">
                  {item.product.name}
                </Link>
                <p className="font-bold">₹{item.product.price.toLocaleString()}</p>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleMoveToCart(item)}
                    className="flex-1 py-2 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-primary/90"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="p-2 border rounded-lg hover:bg-muted"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
