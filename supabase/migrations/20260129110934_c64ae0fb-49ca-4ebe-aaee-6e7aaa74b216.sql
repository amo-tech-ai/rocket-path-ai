
-- Fix 1: Recreate has_role function without SET LOCAL (which is illegal in STABLE functions)
-- Use SECURITY DEFINER to bypass RLS instead

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix 2: Ensure user_org_id function is STABLE and properly configured
CREATE OR REPLACE FUNCTION public.user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Fix 3: Update profiles SELECT policy to handle users without org_id (first-time users)
-- Drop and recreate the policy to be more permissive for own profile access
DROP POLICY IF EXISTS "Users view profiles in org" ON public.profiles;

CREATE POLICY "Users view own profile or org profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid() 
  OR (
    org_id IS NOT NULL 
    AND org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
  )
);
