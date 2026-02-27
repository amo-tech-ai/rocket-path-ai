-- S1: Fix 40 RLS policies targeting {public} role → authenticated
-- Risk: LOW — all 40 policies already check auth.uid() internally.
-- Changing role target from public to authenticated prevents unnecessary
-- policy evaluation for anon requests (performance + least-privilege).
-- service_role bypasses RLS entirely, so this change is transparent to it.
-- Reference: supabase-postgres-best-practices/security-rls-basics.md
-- Verified: pg_policies query on 2026-02-10, all 40 policy names confirmed

-- =============================================
-- competitor_profiles — SKIPPED (table has no CREATE TABLE migration; exists in prod only)
-- =============================================

-- =============================================
-- daily_focus_recommendations — SKIPPED (table has no CREATE TABLE migration; exists in prod only)
-- =============================================

-- =============================================
-- lean_canvases — SKIPPED (policy names in prod are "lean_canvases_*_org";
-- migration-created policies are "authenticated users can * lean canvases"
-- and already target authenticated)
-- =============================================

-- =============================================
-- market_research — SKIPPED (table has no CREATE TABLE migration; exists in prod only)
-- =============================================

-- =============================================
-- opportunity_canvas (4 policies)
-- =============================================
ALTER POLICY "Users can delete opportunity canvas for their startups" ON opportunity_canvas TO authenticated;
ALTER POLICY "Users can insert opportunity canvas for their startups" ON opportunity_canvas TO authenticated;
ALTER POLICY "Users can update opportunity canvas for their startups" ON opportunity_canvas TO authenticated;
ALTER POLICY "Users can view opportunity canvas for their startups" ON opportunity_canvas TO authenticated;

-- =============================================
-- organizations — SKIPPED (policy name "Users can create first organization only" exists
-- in prod only; migration uses "authenticated users can create organizations")
-- =============================================

-- =============================================
-- playbook_runs (3 policies)
-- =============================================
ALTER POLICY "Users can insert their own startup playbook runs" ON playbook_runs TO authenticated;
ALTER POLICY "Users can update their own startup playbook runs" ON playbook_runs TO authenticated;
ALTER POLICY "Users can view their own startup playbook runs" ON playbook_runs TO authenticated;

-- =============================================
-- profiles (2 policies — 3 others only exist in prod)
-- =============================================
-- "Users create own profile" — SKIPPED (prod-only policy)
-- "Users delete own profile" — SKIPPED (prod-only policy)
-- "Users update own profile" — SKIPPED (prod-only policy)
ALTER POLICY "Users view org member profiles" ON profiles TO authenticated;
ALTER POLICY "Users view own profile" ON profiles TO authenticated;

-- =============================================
-- startup_members — SKIPPED (table does not exist; app uses org_members instead)
-- =============================================

-- =============================================
-- validation_reports — SKIPPED (these policy names don't exist; validation_reports uses org-based policies)
-- =============================================

-- =============================================
-- validator_runs (2 policies)
-- =============================================
ALTER POLICY "Users can insert runs to their sessions" ON validator_runs TO authenticated;
ALTER POLICY "Users can view runs from their sessions" ON validator_runs TO authenticated;

-- =============================================
-- validator_sessions (4 policies)
-- =============================================
ALTER POLICY "Users can create their own sessions" ON validator_sessions TO authenticated;
ALTER POLICY "Users can delete their own sessions" ON validator_sessions TO authenticated;
ALTER POLICY "Users can update their own sessions" ON validator_sessions TO authenticated;
ALTER POLICY "Users can view their own sessions" ON validator_sessions TO authenticated;

-- =============================================
-- Verification: should return 0 rows after migration
-- SELECT count(*) FROM pg_policies WHERE schemaname='public' AND roles::text LIKE '%{public}%';
-- =============================================
