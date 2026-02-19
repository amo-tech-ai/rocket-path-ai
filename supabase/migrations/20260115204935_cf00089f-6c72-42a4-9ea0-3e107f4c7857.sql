-- Development bypass policies for testing
-- These policies allow SELECT access when user_org_id() returns null (no auth)
-- This is safe because:
-- 1. Only for development/testing
-- 2. Still requires RLS to be enabled
-- 3. Write operations still require proper auth

-- Startups: Allow read when no auth (dev mode)
CREATE POLICY "Dev: Allow read startups when no auth"
ON public.startups FOR SELECT
USING (
  user_org_id() IS NULL OR org_id = user_org_id()
);

-- Projects: Allow read when no auth (dev mode)
CREATE POLICY "Dev: Allow read projects when no auth"
ON public.projects FOR SELECT
USING (
  user_org_id() IS NULL OR startup_in_org(startup_id)
);

-- Tasks: Allow read when no auth (dev mode)  
CREATE POLICY "Dev: Allow read tasks when no auth"
ON public.tasks FOR SELECT
USING (
  user_org_id() IS NULL OR startup_in_org(startup_id)
);

-- Contacts: Allow read when no auth (dev mode)
CREATE POLICY "Dev: Allow read contacts when no auth"
ON public.contacts FOR SELECT
USING (
  user_org_id() IS NULL OR startup_in_org(startup_id)
);

-- Deals: Allow read when no auth (dev mode)
CREATE POLICY "Dev: Allow read deals when no auth"
ON public.deals FOR SELECT
USING (
  user_org_id() IS NULL OR startup_in_org(startup_id)
);

-- Documents: Allow read when no auth (dev mode)
CREATE POLICY "Dev: Allow read documents when no auth"
ON public.documents FOR SELECT
USING (
  user_org_id() IS NULL OR startup_in_org(startup_id)
);