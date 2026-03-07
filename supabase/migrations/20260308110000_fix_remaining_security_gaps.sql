-- ============================================================================
-- Fix 5 remaining security gaps identified by production audit
--
-- 1. prompt_packs UPDATE — add WITH CHECK (mirrors USING)
-- 2. prompt_pack_steps UPDATE — add WITH CHECK (mirrors USING)
-- 3. get_industry_ai_context() — add SET search_path = ''
-- 4. get_industry_questions() — add SET search_path = ''
-- 5. refresh_startup_metrics() — add SET search_path = ''
-- ============================================================================


-- ============================================================================
-- 1. prompt_packs: ADD WITH CHECK TO UPDATE POLICY
-- ============================================================================

DROP POLICY IF EXISTS "Admins can update prompt packs" ON public.prompt_packs;
CREATE POLICY "Admins can update prompt packs"
  ON public.prompt_packs FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = ( SELECT auth.uid() AS uid)
        AND user_roles.role = 'admin'::app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = ( SELECT auth.uid() AS uid)
        AND user_roles.role = 'admin'::app_role
    )
  );


-- ============================================================================
-- 2. prompt_pack_steps: ADD WITH CHECK TO UPDATE POLICY
-- ============================================================================

DROP POLICY IF EXISTS "Admins can update prompt pack steps" ON public.prompt_pack_steps;
CREATE POLICY "Admins can update prompt pack steps"
  ON public.prompt_pack_steps FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = ( SELECT auth.uid() AS uid)
        AND user_roles.role = 'admin'::app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = ( SELECT auth.uid() AS uid)
        AND user_roles.role = 'admin'::app_role
    )
  );


-- ============================================================================
-- 3. get_industry_ai_context() — ADD SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_industry_ai_context(p_industry text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $get_industry_ai_context$
DECLARE v_result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'industry', ip.industry, 'display_name', ip.display_name, 'description', ip.description,
    'advisor_persona', ip.advisor_persona, 'advisor_system_prompt', ip.advisor_system_prompt,
    'terminology', coalesce(ip.terminology, '[]'::jsonb), 'benchmarks', coalesce(ip.benchmarks, '[]'::jsonb),
    'competitive_intel', coalesce(ip.competitive_intel, '{}'::jsonb), 'mental_models', coalesce(ip.mental_models, '[]'::jsonb),
    'diagnostics', coalesce(ip.diagnostics, '[]'::jsonb), 'market_context', coalesce(ip.market_context, '{}'::jsonb),
    'success_stories', coalesce(ip.success_stories, '[]'::jsonb), 'common_mistakes', coalesce(ip.common_mistakes, '[]'::jsonb),
    'investor_expectations', coalesce(ip.investor_expectations, '{}'::jsonb),
    'startup_types', coalesce(ip.startup_types, '[]'::jsonb), 'question_intro', ip.question_intro
  ) INTO v_result
  FROM public.industry_packs ip
  WHERE ip.industry = p_industry AND ip.is_active = true LIMIT 1;
  RETURN coalesce(v_result, '{}'::jsonb);
END;
$get_industry_ai_context$;


-- ============================================================================
-- 4. get_industry_questions() — ADD SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_industry_questions(p_industry text, p_context text DEFAULT 'onboarding'::text, p_stage text DEFAULT 'seed'::text)
 RETURNS TABLE(id uuid, question_key text, category text, question text, why_this_matters text, thinking_prompt text, ai_coach_prompt text, quality_criteria jsonb, red_flags jsonb, examples jsonb, input_type text, input_options jsonb, outputs_to text[], is_required boolean, display_order integer)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $get_industry_questions$
BEGIN
  RETURN QUERY
  SELECT iq.id, iq.question_key, iq.category, iq.question, iq.why_this_matters,
    iq.thinking_prompt, iq.ai_coach_prompt, iq.quality_criteria, iq.red_flags,
    iq.examples, iq.input_type, iq.input_options, iq.outputs_to, iq.is_required, iq.display_order
  FROM public.industry_questions iq
  JOIN public.industry_packs ip ON ip.id = iq.pack_id
  WHERE ip.industry = p_industry AND ip.is_active = true AND iq.is_active = true
    AND p_context = ANY(iq.contexts) AND p_stage = ANY(iq.stage_filter)
  ORDER BY iq.display_order, iq.category;
END;
$get_industry_questions$;


-- ============================================================================
-- 5. refresh_startup_metrics() — ADD SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.refresh_startup_metrics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $refresh_startup_metrics$
begin
  refresh materialized view concurrently public.mv_startup_metrics;
end;
$refresh_startup_metrics$;
