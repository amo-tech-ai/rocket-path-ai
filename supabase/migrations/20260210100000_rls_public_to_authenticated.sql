-- S1: Fix 40 RLS policies targeting {public} role → authenticated
-- Risk: LOW — all 40 policies already check auth.uid() internally.
-- Changing role target from public to authenticated prevents unnecessary
-- policy evaluation for anon requests (performance + least-privilege).
-- service_role bypasses RLS entirely, so this change is transparent to it.
-- Reference: supabase-postgres-best-practices/security-rls-basics.md
-- Verified: pg_policies query on 2026-02-10, all 40 policy names confirmed

-- =============================================
-- competitor_profiles (4 policies)
-- =============================================
ALTER POLICY "Users can add competitors for their startups" ON competitor_profiles TO authenticated;
ALTER POLICY "Users can delete competitors for their startups" ON competitor_profiles TO authenticated;
ALTER POLICY "Users can update competitors for their startups" ON competitor_profiles TO authenticated;
ALTER POLICY "Users can view competitors for their startups" ON competitor_profiles TO authenticated;

-- =============================================
-- daily_focus_recommendations (2 policies)
-- Note: "Service role can manage recommendations" checks jwt->>'role' = 'service_role'
-- but service_role bypasses RLS anyway, so this policy is redundant.
-- Changing to authenticated is safe — service_role still bypasses.
-- =============================================
ALTER POLICY "Service role can manage recommendations" ON daily_focus_recommendations TO authenticated;
ALTER POLICY "Users can read own recommendations" ON daily_focus_recommendations TO authenticated;

-- =============================================
-- lean_canvases (4 policies)
-- =============================================
ALTER POLICY "lean_canvases_delete_org" ON lean_canvases TO authenticated;
ALTER POLICY "lean_canvases_insert_org" ON lean_canvases TO authenticated;
ALTER POLICY "lean_canvases_select_org" ON lean_canvases TO authenticated;
ALTER POLICY "lean_canvases_update_org" ON lean_canvases TO authenticated;

-- =============================================
-- market_research (4 policies)
-- =============================================
ALTER POLICY "Users can delete market research for their startups" ON market_research TO authenticated;
ALTER POLICY "Users can insert market research for their startups" ON market_research TO authenticated;
ALTER POLICY "Users can update market research for their startups" ON market_research TO authenticated;
ALTER POLICY "Users can view market research for their startups" ON market_research TO authenticated;

-- =============================================
-- opportunity_canvas (4 policies)
-- =============================================
ALTER POLICY "Users can delete opportunity canvas for their startups" ON opportunity_canvas TO authenticated;
ALTER POLICY "Users can insert opportunity canvas for their startups" ON opportunity_canvas TO authenticated;
ALTER POLICY "Users can update opportunity canvas for their startups" ON opportunity_canvas TO authenticated;
ALTER POLICY "Users can view opportunity canvas for their startups" ON opportunity_canvas TO authenticated;

-- =============================================
-- organizations (1 policy)
-- =============================================
ALTER POLICY "Users can create first organization only" ON organizations TO authenticated;

-- =============================================
-- playbook_runs (3 policies)
-- =============================================
ALTER POLICY "Users can insert their own startup playbook runs" ON playbook_runs TO authenticated;
ALTER POLICY "Users can update their own startup playbook runs" ON playbook_runs TO authenticated;
ALTER POLICY "Users can view their own startup playbook runs" ON playbook_runs TO authenticated;

-- =============================================
-- profiles (5 policies)
-- =============================================
ALTER POLICY "Users create own profile" ON profiles TO authenticated;
ALTER POLICY "Users delete own profile" ON profiles TO authenticated;
ALTER POLICY "Users update own profile" ON profiles TO authenticated;
ALTER POLICY "Users view org member profiles" ON profiles TO authenticated;
ALTER POLICY "Users view own profile" ON profiles TO authenticated;

-- =============================================
-- startup_members (5 policies)
-- =============================================
ALTER POLICY "Owners can delete or self-remove" ON startup_members TO authenticated;
ALTER POLICY "Owners can update members" ON startup_members TO authenticated;
ALTER POLICY "Owners/admins can insert members" ON startup_members TO authenticated;
ALTER POLICY "Users can view co-members" ON startup_members TO authenticated;
ALTER POLICY "Users can view their own memberships" ON startup_members TO authenticated;

-- =============================================
-- validation_reports (2 policies)
-- =============================================
ALTER POLICY "Users can insert reports via their sessions" ON validation_reports TO authenticated;
ALTER POLICY "Users can view reports from their validator sessions" ON validation_reports TO authenticated;

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
