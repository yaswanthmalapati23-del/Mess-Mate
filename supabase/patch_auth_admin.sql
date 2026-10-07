-- ====================================================================
-- MESS MATE: SUPABASE PATCH FOR @vitapstudent.ac.in & ADMIN PORTAL
-- Run this in your Supabase Dashboard -> SQL Editor -> Run (F5)
-- ====================================================================

-- 1. Insert/update the official student domain: @vitapstudent.ac.in
INSERT INTO public.allowed_college_domains (id, college_name, domain, is_active)
VALUES 
  ('vitap_student', 'VIT-AP Student Email', 'vitapstudent.ac.in', true),
  ('vitap', 'VIT-AP University', 'vitap.ac.in', true)
ON CONFLICT (domain) DO UPDATE SET is_active = true;

-- 2. Update the email validation trigger on auth.users
CREATE OR REPLACE FUNCTION public.validate_college_email_domain()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_domain text;
  domain_allowed boolean;
BEGIN
  user_domain := lower(split_part(new.email, '@', 2));
  
  SELECT exists(
    SELECT 1 FROM public.allowed_college_domains
    WHERE domain = user_domain AND is_active = true
  ) INTO domain_allowed;
  
  -- Fallback safeguard for vitapstudent.ac.in and vitap.ac.in
  IF NOT domain_allowed AND (user_domain = 'vitapstudent.ac.in' OR user_domain = 'vitap.ac.in' OR user_domain = 'student.vitap.ac.in') THEN
    domain_allowed := true;
  END IF;
  
  IF NOT domain_allowed THEN
    RAISE EXCEPTION 'Access Denied: Email domain % is not authorized. Registration is restricted to verified college domains (@vitapstudent.ac.in).', user_domain;
  END IF;
  
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS check_college_email_domain ON auth.users;
CREATE TRIGGER check_college_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_college_email_domain();

-- 3. Create Admin Users table & security controls
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'admin' CHECK (role IN ('admin', 'mess_committee', 'superadmin')),
  created_at timestamp WITH time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can view their own record
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- Helper function to verify admin status
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN exists(
    SELECT 1 FROM public.admin_users
    WHERE user_id = p_user_id
  );
END;
$$;

-- Allow admins to manage dishes, monthly menu, and food court
DROP POLICY IF EXISTS "Admins can insert dishes" ON public.dishes;
CREATE POLICY "Admins can insert dishes" ON public.dishes FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update dishes" ON public.dishes;
CREATE POLICY "Admins can update dishes" ON public.dishes FOR UPDATE USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete dishes" ON public.dishes;
CREATE POLICY "Admins can delete dishes" ON public.dishes FOR DELETE USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert monthly_menu" ON public.monthly_menu;
CREATE POLICY "Admins can insert monthly_menu" ON public.monthly_menu FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update monthly_menu" ON public.monthly_menu;
CREATE POLICY "Admins can update monthly_menu" ON public.monthly_menu FOR UPDATE USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can delete monthly_menu" ON public.monthly_menu;
CREATE POLICY "Admins can delete monthly_menu" ON public.monthly_menu FOR DELETE USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage food_court_items" ON public.food_court_items;
CREATE POLICY "Admins can manage food_court_items" ON public.food_court_items FOR ALL USING (public.is_admin(auth.uid()));
