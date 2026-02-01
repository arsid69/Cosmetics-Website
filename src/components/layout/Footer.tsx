import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-2xl font-semibold text-foreground">
                Luxe<span className="text-primary">Belle</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover timeless elegance with our curated collection of luxury
              handbags, makeup, and accessories.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Shop All', 'New Arrivals', 'Best Sellers', 'Sale'].map((link) => (
                <li key={link}>
                  <Link
                    to="/shop"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              {[
                { name: 'Makeup', slug: 'makeup' },
                { name: 'Handbags', slug: 'handbags' },
                { name: 'Clutches', slug: 'clutches' },
                { name: 'Accessories', slug: 'accessories' },
              ].map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/shop?category=${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="h-4 w-4 text-primary" />
                hello@luxebelle.com
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="h-4 w-4 text-primary" />
                +92 300 1234567
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>123 Fashion Street,<br />Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Promotional Banner */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
            <div className="text-center mb-4">
              <h3 className="font-display text-xl font-bold mb-2">Special Offers</h3>
              <p className="text-muted-foreground text-sm">Amazing deals just for you</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="flex items-center gap-2 text-blue-700">
                <span className="text-2xl">🎁</span>
                <div>
                  <span className="font-semibold">10% OFF</span>
                  <p className="text-xs">on advance payment</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-2xl">🚚</span>
                <div>
                  <span className="font-semibold">FREE DELIVERY</span>
                  <p className="text-xs">on orders above 5,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 LuxeBelle. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">
              Privacy Policy
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;