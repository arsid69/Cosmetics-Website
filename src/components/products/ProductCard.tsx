import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import PromotionalBadges from './PromotionalBadges';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="group card-luxury overflow-hidden">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            src={product.image_url || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <PromotionalBadges product={product} />
          {hasDiscount && (
            <span className="absolute top-3 right-3 badge-sale">
              Sale
            </span>
          )}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button variant="secondary" size="icon" className="bg-background/80 backdrop-blur-sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      <div className="pt-4 space-y-2">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="price-sale">{formatPrice(product.sale_price!)}</span>
              <span className="price-original">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;