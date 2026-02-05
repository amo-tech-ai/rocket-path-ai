-- =============================================================================
-- Migration: Add UPDATE/DELETE RLS policies for validator tables
-- Purpose: Allow users to update/refresh validation data they own
-- Author: StartupAI
-- Created: 2026-01-29
-- Applied: 2026-01-29 (via Supabase MCP)
-- =============================================================================

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "validation_scores_update_own" ON public.validation_scores;
DROP POLICY IF EXISTS "market_sizes_update_own" ON public.market_sizes;
DROP POLICY IF EXISTS "framework_analyses_update_own" ON public.framework_analyses;
DROP POLICY IF EXISTS "critic_reviews_update_own" ON public.critic_reviews;
DROP POLICY IF EXISTS "validation_metadata_update_own" ON public.validation_metadata;
DROP POLICY IF EXISTS "competitor_profiles_update_own" ON public.competitor_profiles;
DROP POLICY IF EXISTS "competitor_profiles_update_org" ON public.competitor_profiles;
DROP POLICY IF EXISTS "validation_conditions_delete_own" ON public.validation_conditions;
DROP POLICY IF EXISTS "competitor_profiles_delete_own" ON public.competitor_profiles;

-- =============================================================================
-- validation_scores: UPDATE policy for score recalculation
-- =============================================================================
CREATE POLICY "validation_scores_update_own"
  ON public.validation_scores FOR UPDATE
  USING (
    validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- market_sizes: UPDATE policy for market refresh
-- =============================================================================
CREATE POLICY "market_sizes_update_own"
  ON public.market_sizes FOR UPDATE
  USING (
    startup_id IN (
      SELECT s.id FROM public.startups s
      JOIN public.profiles p ON s.org_id = p.org_id
      WHERE p.id = auth.uid()
    )
    OR validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- framework_analyses: UPDATE policy for re-running analysis
-- =============================================================================
CREATE POLICY "framework_analyses_update_own"
  ON public.framework_analyses FOR UPDATE
  USING (
    startup_id IN (
      SELECT s.id FROM public.startups s
      JOIN public.profiles p ON s.org_id = p.org_id
      WHERE p.id = auth.uid()
    )
    OR validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- critic_reviews: UPDATE policy for re-running critic
-- =============================================================================
CREATE POLICY "critic_reviews_update_own"
  ON public.critic_reviews FOR UPDATE
  USING (
    validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- validation_metadata: UPDATE policy for cache refresh
-- =============================================================================
CREATE POLICY "validation_metadata_update_own"
  ON public.validation_metadata FOR UPDATE
  USING (
    validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- competitor_profiles: UPDATE policy (improved with validation_report_id)
-- =============================================================================
CREATE POLICY "competitor_profiles_update_own"
  ON public.competitor_profiles FOR UPDATE
  USING (
    startup_id IN (
      SELECT s.id FROM public.startups s
      JOIN public.profiles p ON s.org_id = p.org_id
      WHERE p.id = auth.uid()
    )
    OR validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- DELETE policies
-- =============================================================================

-- validation_conditions: DELETE for removing conditions
CREATE POLICY "validation_conditions_delete_own"
  ON public.validation_conditions FOR DELETE
  USING (
    validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- competitor_profiles: DELETE for removing competitors
CREATE POLICY "competitor_profiles_delete_own"
  ON public.competitor_profiles FOR DELETE
  USING (
    startup_id IN (
      SELECT s.id FROM public.startups s
      JOIN public.profiles p ON s.org_id = p.org_id
      WHERE p.id = auth.uid()
    )
    OR validation_report_id IN (
      SELECT id FROM public.validation_reports WHERE user_id = auth.uid()
    )
  );

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
