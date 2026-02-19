-- =============================================================================
-- migration: 20260208100001_drop_dev_bypass_policies.sql
-- purpose: remove dev-only bypass policies that allow unauthenticated reads
-- affected tables: startups, projects, tasks, contacts, deals, documents
-- =============================================================================

DROP POLICY IF EXISTS "Dev: Allow read startups when no auth" ON public.startups;
DROP POLICY IF EXISTS "Dev: Allow read projects when no auth" ON public.projects;
DROP POLICY IF EXISTS "Dev: Allow read tasks when no auth" ON public.tasks;
DROP POLICY IF EXISTS "Dev: Allow read contacts when no auth" ON public.contacts;
DROP POLICY IF EXISTS "Dev: Allow read deals when no auth" ON public.deals;
DROP POLICY IF EXISTS "Dev: Allow read documents when no auth" ON public.documents;

-- =============================================================================
-- end of migration: 20260208100001_drop_dev_bypass_policies.sql
-- =============================================================================
