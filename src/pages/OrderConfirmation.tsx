import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';
import type { Database } from '@/integrations/supabase/types';

type OrderDetails = Database['public']['Tables']['orders']['Row'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      setLoading(true);

      try {
        // Try to fetch by ID first (for authenticated users)
        const { data: orderById, error: idError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .maybeSingle();

        if (!idError && orderById) {
          // Found order by ID - authenticated user
          setOrder(orderById);
          
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderById.id);
          
          if (itemsData) {
            setItems(itemsData);
          }
        } else {
          // Try to fetch by confirmation token (for guest users)
          const { data: orderByToken, error: tokenError } = await supabase
            .from('orders')
            .select('*')
            .eq('order_confirmation_token', orderId)
            .maybeSingle();

          if (!tokenError && orderByToken) {
            // Found order by token - guest user
            setOrder(orderByToken);
            
            const { data: tokenItemsData } = await supabase
              .from('order_items')
              .select('*')
              .eq('order_id', orderByToken.id);
            
            if (tokenItemsData) {
              setItems(tokenItemsData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }

      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-pulse">Loading order details...</div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Order Not Found</h1>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const paymentLabels: Record<string, string> = {
    cod: 'Cash on Delivery',
    jazzcash: 'JazzCash',
    easypaisa: 'Easypaisa',
    bank: 'Bank Transfer',
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've sent a confirmation email to{' '}
            <span className="text-foreground font-medium">{order.shipping_email}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('en-PK', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              {[
                { icon: CheckCircle, label: 'Confirmed', active: true },
                { icon: Package, label: 'Processing', active: false },
                { icon: Truck, label: 'Shipped', active: false },
                { icon: Home, label: 'Delivered', active: false },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className={`text-xs mt-2 ${step.active ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-display text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPrice(item.product_price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-display text-lg font-semibold mb-4">Shipping Details</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{order.shipping_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{order.shipping_phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{order.shipping_address}, {order.shipping_city}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium">{paymentLabels[order.payment_method] || order.payment_method}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-8 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/orders">View All Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
