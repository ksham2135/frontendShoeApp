import { Ticket, Copy } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { coupons } from '@/data/mockData';

export default function Coupons() {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Coupon code copied!');
  };

  if (!coupons.length) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Ticket className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No coupons available</h2>
          <p className="text-muted-foreground">Check back later for new offers!</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Available Coupons</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="border-2 border-dashed rounded-lg p-6 relative">
              <div className="absolute top-3 right-3">
                <button 
                  onClick={() => copyCode(coupon.code)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-accent">
                  {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                </p>
              </div>
              <div className="bg-muted px-4 py-2 rounded text-center font-mono font-bold text-lg mb-4">
                {coupon.code}
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {coupon.min_order_value > 0 && (
                  <p>Min. order: ₹{coupon.min_order_value.toLocaleString()}</p>
                )}
                {coupon.expires_at && (
                  <p>Valid till: {new Date(coupon.expires_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
