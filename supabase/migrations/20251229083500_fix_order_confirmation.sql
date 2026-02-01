-- Fix order confirmation issues by ensuring proper RLS policies and column exists

-- First, ensure the order_confirmation_token column exists
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_confirmation_token TEXT UNIQUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_confirmation_token 
ON public.orders(order_confirmation_token);

-- Update existing orders without tokens
UPDATE public.orders 
SET order_confirmation_token = encode(sha256(random()::text || clock_timestamp()::text), 'hex')
WHERE order_confirmation_token IS NULL;

-- Drop and recreate orders policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Create new orders policies that work for both authenticated and guest users
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT 
  USING (auth.uid() = user_id OR (auth.uid() IS NULL AND order_confirmation_token IS NOT NULL));

CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR (auth.uid() IS NULL));

CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop and recreate order_items policies
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.order_items TO anon, authenticated;
