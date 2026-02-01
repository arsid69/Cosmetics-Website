-- Fix order security issues
-- 1. Allow guest checkout by updating orders policies
-- 2. Add order confirmation token to prevent public data exposure

-- Add order_confirmation_token column to orders table
ALTER TABLE public.orders 
ADD COLUMN order_confirmation_token TEXT UNIQUE;

-- Create function to generate secure order confirmation token
CREATE OR REPLACE FUNCTION public.generate_order_confirmation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(sha256(random()::text || clock_timestamp()::text), 'hex');
END;
$$;

-- Create trigger to automatically generate confirmation token for new orders
CREATE TRIGGER generate_order_confirmation_token
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_confirmation_token IS NULL)
  EXECUTE FUNCTION public.generate_order_confirmation_token();

-- Drop existing orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Create new orders policies that allow guest checkout
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR (auth.uid() IS NULL AND order_confirmation_token IS NOT NULL));

CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR (auth.uid() IS NULL));

CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing order_items policies
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Create new order_items policies
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.orders 
             WHERE orders.id = order_items.order_id 
             AND (orders.user_id = auth.uid() OR (auth.uid() IS NULL AND orders.order_confirmation_token IS NOT NULL)))
  );

CREATE POLICY "Users can insert order items" ON public.order_items FOR INSERT 
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders 
             WHERE orders.id = order_items.order_id 
             AND (orders.user_id = auth.uid() OR auth.uid() IS NULL))
  );

CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to get order by confirmation token (secure)
CREATE OR REPLACE FUNCTION public.get_order_by_token(token TEXT)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  status order_status,
  total DECIMAL,
  shipping_name TEXT,
  shipping_email TEXT,
  shipping_phone TEXT,
  shipping_address TEXT,
  shipping_city TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  order_confirmation_token TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT o.*
  FROM public.orders o
  WHERE o.order_confirmation_token = token;
END;
$$;

-- Create function to get order items by confirmation token
CREATE OR REPLACE FUNCTION public.get_order_items_by_token(token TEXT)
RETURNS TABLE (
  id UUID,
  order_id UUID,
  product_id UUID,
  product_name TEXT,
  product_price DECIMAL,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT oi.*
  FROM public.order_items oi
  JOIN public.orders o ON oi.order_id = o.id
  WHERE o.order_confirmation_token = token;
END;
$$;
