-- CORE-P1-1: Document startup_in_org() and user_org_id() as tenancy boundary
-- These two functions are the SINGLE tenancy enforcement mechanism for the entire system.
-- 37+ RLS policies across 13+ tables depend on startup_in_org().

COMMENT ON FUNCTION public.user_org_id() IS
  'Returns the org_id of the current authenticated user from profiles. '
  'SECURITY DEFINER — runs as function owner to bypass RLS on profiles. '
  'Used by startup_in_org() and directly in some RLS policies. '
  'Returns NULL for users without an org (solo founders).';

COMMENT ON FUNCTION public.startup_in_org(UUID) IS
  'TENANCY BOUNDARY — the single function that enforces organization-level data isolation. '
  'Returns TRUE if the given startup_id belongs to the current user''s org. '
  'Called by 37+ RLS policies across 13+ tables (lean_canvases, tasks, contacts, '
  'pitch_decks, documents, ai_runs, assumptions, weekly_reviews, etc.). '
  'SECURITY DEFINER — runs as function owner to bypass RLS on startups table. '
  'Depends on: user_org_id() → profiles.org_id → startups.org_id. '
  'CRITICAL: Any change to this function affects ALL tenant data isolation. '
  'Test thoroughly before modifying. See base_schema.sql lines 166-177.';
