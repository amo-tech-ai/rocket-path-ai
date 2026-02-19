-- FIX: Infinite recursion in profiles RLS policy
-- The issue is in "Users view own profile or org profiles" policy
-- It references profiles table inside its own USING clause causing infinite loop

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users view own profile or org profiles" ON profiles;

-- Create a new policy using a helper function to avoid recursion
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid();
$$;

-- Create safe policy that doesn't cause recursion
CREATE POLICY "Users view own profile"
ON profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY "Users view org member profiles"
ON profiles
FOR SELECT
USING (
  org_id IS NOT NULL 
  AND org_id = public.get_user_org_id()
);