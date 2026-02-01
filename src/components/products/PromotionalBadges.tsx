import { Badge } from '@/components/ui/badge';
import { Truck, Percent } from 'lucide-react';
import { Product } from '@/types';

interface PromotionalBadgesProps {
  product: Product;
}

const PromotionalBadges = ({ product }: PromotionalBadgesProps) => {
  const currentPrice = product.sale_price || product.price;
  const hasFreeDelivery = currentPrice < 5000;
  const hasAdvancePaymentDiscount = true; // 10% off on advance payment for all products

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1">
      {hasFreeDelivery && (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
          <Truck className="h-3 w-3 mr-1" />
          Free Delivery
        </Badge>
      )}
      <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
        <Percent className="h-3 w-3 mr-1" />
        10% Off Advance Payment
      </Badge>
    </div>
  );
};

export default PromotionalBadges;
