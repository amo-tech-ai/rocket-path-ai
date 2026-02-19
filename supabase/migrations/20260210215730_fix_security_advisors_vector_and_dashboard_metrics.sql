-- Migration: fix_security_advisors_vector_and_dashboard_metrics
-- Purpose: Address Supabase Security Advisor findings from audit 15-supabase-audit.md
-- 1. Move vector extension from public to extensions schema (lint 0014_extension_in_public)
-- 2. Revoke dashboard_metrics from anon/public (lint 0016_materialized_view_in_api)
-- Reference: https://supabase.com/docs/guides/database/database-advisors
-- Applied: 2026-02-10

-- =============================================================================
-- 1. Move vector extension to extensions schema
-- =============================================================================
-- Extension in public is exposed through Supabase APIs. Moving to extensions
-- schema removes it from the default API surface.
-- Note: knowledge_chunks.embedding and search_knowledge() use vector type;
-- the type moves with the extension. Columns reference by OID so no table alter needed.
do $$
begin
  if exists (
    select 1 from pg_extension e
    join pg_namespace n on e.extnamespace = n.oid
    where e.extname = 'vector' and n.nspname = 'public'
  ) then
    alter extension vector set schema extensions;
  end if;
end $$;

-- =============================================================================
-- 2. Revoke dashboard_metrics from anon and public
-- =============================================================================
-- Materialized views cannot have RLS. Revoking from anon/public ensures
-- only authenticated users (with explicit grant) and service_role can select.
-- authenticated keeps select for app (useHealthScore, etc).
revoke select on public.dashboard_metrics from anon;
revoke select on public.dashboard_metrics from public;

-- Ensure authenticated and service_role retain select (idempotent)
grant select on public.dashboard_metrics to authenticated;
grant select on public.dashboard_metrics to service_role;
