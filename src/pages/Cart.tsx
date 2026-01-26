import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, isLoading, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="mb-4">Please login to view your cart</p>
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

  if (!cartItems.length) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-4">Start shopping to add items to your cart</p>
          <Link to="/products" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
            Shop Now
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                <img src={item.product.image_url || '/placeholder.svg'} alt={item.product.name} className="w-24 h-24 object-cover rounded" />
                <div className="flex-1">
                  <Link to={`/product/${item.product_id}`} className="font-medium hover:text-accent">{item.product.name}</Link>
                  <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                  {item.size && <p className="text-sm">Size: {item.size}</p>}
                  {item.color && <p className="text-sm">Color: {item.color}</p>}
                  <p className="font-bold mt-2">₹{item.product.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 border rounded hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 border rounded hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                <span>Total</span><span>₹{subtotal.toLocaleString()}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
