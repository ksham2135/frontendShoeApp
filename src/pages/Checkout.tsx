import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { validateCoupon, ShippingAddress } from '@/data/mockData';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const { createOrder } = useOrders();

  const [address, setAddress] = useState<ShippingAddress>({ 
    fullName: '', 
    phone: '', 
    address: '', 
    city: '', 
    state: '', 
    pincode: '' 
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  if (!user) { 
    navigate('/auth'); 
    return null; 
  }
  
  if (!cartItems.length) { 
    navigate('/cart'); 
    return null; 
  }

  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    const result = validateCoupon(couponCode, subtotal);
    if (result.valid) {
      setDiscount(result.discount);
      setAppliedCoupon(couponCode.toUpperCase());
      alert(`Coupon applied! You save ₹${result.discount.toLocaleString()}`);
    } else {
      alert(result.error || 'Invalid coupon');
    }
  };

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.fullName || !address.phone || !address.address || 
        !address.city || !address.state || !address.pincode) {
      alert('Please fill all address fields');
      return;
    }

    if (address.phone.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    if (address.pincode.length < 6) {
      alert('Please enter a valid pincode');
      return;
    }

    setIsPlacing(true);
    
    try {
      createOrder(cartItems, address, appliedCoupon || null, discount);
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text"
                    value={address.fullName} 
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input 
                    type="tel"
                    value={address.phone} 
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input 
                    type="text"
                    value={address.address} 
                    onChange={(e) => setAddress({ ...address, address: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input 
                    type="text"
                    value={address.city} 
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input 
                    type="text"
                    value={address.state} 
                    onChange={(e) => setAddress({ ...address, state: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Pincode</label>
                  <input 
                    type="text"
                    value={address.pincode} 
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })} 
                    className="w-full h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate flex-1 pr-2">{item.product.name} x{item.quantity}</span>
                    <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  placeholder="Coupon code" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)} 
                  className="flex-1 h-10 px-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none text-sm"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-sm text-green-600 mb-4">Coupon {appliedCoupon} applied!</p>
              )}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span><span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between"><span>Shipping</span><span className="text-green-600">FREE</span></div>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg mb-6">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
              <button 
                onClick={handlePlaceOrder}
                disabled={isPlacing}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isPlacing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
