-- Enable leaked password protection and enhance security settings

-- Update auth configuration for enhanced security
-- Note: Some of these settings may need to be configured via Supabase Dashboard
-- as they are not directly available through SQL migrations

-- Create a function to check password strength
CREATE OR REPLACE FUNCTION public.check_password_strength(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_lower BOOLEAN;
  has_upper BOOLEAN;
  has_number BOOLEAN;
  min_length INT := 6;
BEGIN
  -- Check minimum length
  IF length(password) < min_length THEN
    RETURN FALSE;
  END IF;
  
  -- Check for lowercase letters
  has_lower := password ~ '[a-z]';
  
  -- Check for uppercase letters  
  has_upper := password ~ '[A-Z]';
  
  -- Check for numbers
  has_number := password ~ '[0-9]';
  
  -- Return TRUE if all requirements are met
  RETURN has_lower AND has_upper AND has_number;
END;
$$;

-- Create audit log for authentication attempts
CREATE TABLE IF NOT EXISTS public.auth_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'login_attempt', 'login_success', 'login_failure', 'signup'
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log (only admins can view, system can insert)
CREATE POLICY "Admins can view audit log" ON public.auth_audit_log FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit log" ON public.auth_audit_log FOR INSERT 
  WITH CHECK (true);

-- Create function to log authentication attempts
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  email TEXT,
  action TEXT,
  ip_address TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  success BOOLEAN DEFAULT true,
  error_message TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.auth_audit_log (email, action, ip_address, user_agent, success, error_message)
  VALUES (email, action, ip_address, user_agent, success, error_message);
END;
$$;
