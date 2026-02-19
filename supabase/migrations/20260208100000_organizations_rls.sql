-- =============================================================================
-- migration: 20260208100000_organizations_rls.sql
-- purpose: add RLS policies to organizations table (CRITICAL security fix)
-- affected tables: organizations
-- dependencies: org_members
-- =============================================================================

-- 1. Enable RLS on organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 2. SELECT: Users can view organizations they belong to
CREATE POLICY "users can view own organizations"
  ON public.organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT om.org_id
      FROM public.org_members om
      WHERE om.user_id = (SELECT auth.uid())
        AND om.status = 'active'
    )
  );

-- 3. INSERT: Any authenticated user can create an organization
CREATE POLICY "authenticated users can create organizations"
  ON public.organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. UPDATE: Only org owners and admins can update
CREATE POLICY "org admins can update organizations"
  ON public.organizations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.org_members om
      WHERE om.org_id = id
        AND om.user_id = (SELECT auth.uid())
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.org_members om
      WHERE om.org_id = id
        AND om.user_id = (SELECT auth.uid())
        AND om.role IN ('owner', 'admin')
        AND om.status = 'active'
    )
  );

-- 5. DELETE: Only org owners can delete
CREATE POLICY "org owners can delete organizations"
  ON public.organizations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.org_members om
      WHERE om.org_id = id
        AND om.user_id = (SELECT auth.uid())
        AND om.role = 'owner'
        AND om.status = 'active'
    )
  );

-- 6. Service role: full access for backend operations
CREATE POLICY "service role has full access to organizations"
  ON public.organizations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- end of migration: 20260208100000_organizations_rls.sql
-- =============================================================================
