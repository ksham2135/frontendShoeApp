import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { getProductById } from '@/data/mockData';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = getProductById(id || '');
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">Product not found</div>
      </Layout>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (!user) { 
      alert('Please login'); 
      navigate('/auth'); 
      return; 
    }
    if (!selectedSize) { 
      alert('Please select a size'); 
      return; 
    }
    if (!selectedColor) { 
      alert('Please select a color'); 
      return; 
    }
    
    const success = addToCart(product.id, quantity, selectedSize, selectedColor);
    if (success) {
      alert('Added to cart!');
    }
  };

  const handleWishlist = () => {
    if (!user) { 
      alert('Please login'); 
      navigate('/auth'); 
      return; 
    }
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img src={product.image_url || '/placeholder.svg'} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
                  <span className="text-red-500 font-semibold">({discountPercentage}% off)</span>
                </>
              )}
            </div>
            
            {/* Size Selection */}
            <div>
              <p className="font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)} 
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedSize === size 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'hover:border-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button 
                    key={color} 
                    onClick={() => setSelectedColor(color)} 
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      selectedColor === color 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'hover:border-foreground'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Quantity */}
            <div>
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border rounded-md hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border rounded-md hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart} 
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button 
                onClick={handleWishlist}
                className="p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
            
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
