import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';

const statusStyles: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-yellow-100 text-yellow-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, isLoading } = useOrders();

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="mb-4">Please login to view your orders</p>
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

  if (!orders.length) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-4">Start shopping to place your first order</p>
          <button onClick={() => navigate('/products')} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
            Shop Now
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="font-bold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.product_image || '/placeholder.svg'} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• ${item.color}`}
                      </p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
