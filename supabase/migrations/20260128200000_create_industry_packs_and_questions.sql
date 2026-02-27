-- ============================================================================
-- Migration: Create Industry Packs & Questions tables + seed generic pack
-- ============================================================================
-- Purpose: Create industry_packs and industry_questions tables with RLS,
--          indexes, helper functions, and seed 40 universal questions.
--
-- Note: Originally split across two migrations (CREATE in archived
--       20260128145100, SEED in 20260128223016). Combined here so
--       `supabase db reset` works from scratch.
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.industry_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL UNIQUE,
  display_name text,
  description text,
  icon text,
  advisor_persona text,
  advisor_system_prompt text,
  terminology jsonb DEFAULT '[]',
  benchmarks jsonb DEFAULT '[]',
  competitive_intel jsonb DEFAULT '{}',
  mental_models jsonb DEFAULT '[]',
  diagnostics jsonb DEFAULT '[]',
  market_context jsonb DEFAULT '{}',
  success_stories jsonb DEFAULT '[]',
  common_mistakes jsonb DEFAULT '[]',
  investor_expectations jsonb DEFAULT '{}',
  startup_types jsonb DEFAULT '[]',
  question_intro text,
  is_active boolean DEFAULT true,
  version text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.industry_packs IS 'Industry packs for Smart Interviewer: terminology, benchmarks, advisor persona, AI context.';

CREATE TABLE IF NOT EXISTS public.industry_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id uuid NOT NULL REFERENCES public.industry_packs(id) ON DELETE CASCADE,
  question_key text NOT NULL,
  category text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  question text NOT NULL,
  why_this_matters text,
  thinking_prompt text,
  ai_coach_prompt text,
  quality_criteria jsonb DEFAULT '{}',
  red_flags jsonb DEFAULT '[]',
  examples jsonb DEFAULT '[]',
  input_type text NOT NULL DEFAULT 'textarea',
  input_options jsonb DEFAULT null,
  outputs_to text[] DEFAULT array[]::text[],
  contexts text[] DEFAULT array['onboarding']::text[],
  stage_filter text[] DEFAULT array['pre_seed', 'seed', 'series_a']::text[],
  is_required boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pack_id, question_key)
);
COMMENT ON TABLE public.industry_questions IS 'Industry-specific questions for Smart Interviewer.';

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_industry_questions_pack_id ON public.industry_questions(pack_id);
CREATE INDEX IF NOT EXISTS idx_industry_questions_category ON public.industry_questions(category);
CREATE INDEX IF NOT EXISTS idx_industry_questions_contexts ON public.industry_questions USING gin(contexts);
CREATE INDEX IF NOT EXISTS idx_industry_questions_stage_filter ON public.industry_questions USING gin(stage_filter);
CREATE INDEX IF NOT EXISTS idx_industry_questions_active ON public.industry_questions(is_active) WHERE is_active = true;

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE public.industry_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_questions ENABLE ROW LEVEL SECURITY;

-- industry_packs: read-only for all authenticated users
DO $$ BEGIN
  CREATE POLICY "Anyone can view active industry packs"
    ON public.industry_packs FOR SELECT TO anon, authenticated USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- industry_questions: read-only for all, managed by authenticated
DO $$ BEGIN
  CREATE POLICY "Anyone can view active industry questions"
    ON public.industry_questions FOR SELECT TO anon, authenticated USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage industry questions"
    ON public.industry_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$ BEGIN new.updated_at = now(); RETURN new; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_industry_packs_updated_at ON public.industry_packs;
CREATE TRIGGER update_industry_packs_updated_at
  BEFORE UPDATE ON public.industry_packs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_industry_questions_updated_at ON public.industry_questions;
CREATE TRIGGER update_industry_questions_updated_at
  BEFORE UPDATE ON public.industry_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_industry_questions(
  p_industry text,
  p_context text DEFAULT 'onboarding',
  p_stage text DEFAULT 'seed'
)
RETURNS TABLE (
  id uuid, question_key text, category text, question text, why_this_matters text,
  thinking_prompt text, ai_coach_prompt text, quality_criteria jsonb, red_flags jsonb,
  examples jsonb, input_type text, input_options jsonb, outputs_to text[],
  is_required boolean, display_order integer
) AS $$
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_industry_ai_context(p_industry text)
RETURNS jsonb AS $$
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================================
-- SEED: Generic industry pack
-- ============================================================================

INSERT INTO public.industry_packs (industry, display_name, description, is_active)
VALUES ('generic', 'Generic', 'Universal questions for all industries', true)
ON CONFLICT (industry) DO NOTHING;

-- ============================================================================
-- SEED: 40 universal questions across 8 categories
-- ============================================================================

DO $$
DECLARE
  v_generic_pack_id uuid;
BEGIN
  SELECT id INTO v_generic_pack_id FROM industry_packs WHERE industry = 'generic' LIMIT 1;

  IF v_generic_pack_id IS NULL THEN
    RAISE EXCEPTION 'Generic industry pack not found';
  END IF;

  -- PROBLEM VALIDATION (8 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'pv_problem_statement', 'problem_validation', 1,
   'What specific problem are you solving?',
   'Investors fund solutions to painful problems. A vague problem = a vague opportunity.',
   'Describe the problem in terms of who suffers, what they suffer from, and why current solutions fail.',
   'Evaluate if the problem is specific, painful, and clearly articulated. Ask follow-up if too vague.',
   '{"specificity": "Problem affects a defined audience", "pain_level": "Clear quantifiable impact", "frequency": "Problem occurs regularly"}'::jsonb,
   '["Too broad/generic", "No clear victim", "Solution disguised as problem"]'::jsonb,
   '[{"good": "B2B sales teams spend 40% of time on manual data entry", "bad": "Sales is hard"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.problem', 'pitch_deck.problem'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed'], true, true),

  (v_generic_pack_id, 'pv_who_has_problem', 'problem_validation', 2,
   'Who exactly has this problem?',
   'A great solution for the wrong customer is still worthless. Specificity enables focus.',
   'Think beyond demographics. What role, company size, industry, and behavior defines your ideal customer?',
   'Check if the target is specific enough to find and reach. Push for behavioral/situational triggers.',
   '{"identifiable": "Can you find them?", "reachable": "Can you reach them?", "willing_to_pay": "Do they have budget?"}'::jsonb,
   '["Everyone has this problem", "No clear persona", "Too many different personas"]'::jsonb,
   '[{"good": "VP Sales at B2B SaaS companies with 10-50 SDRs", "bad": "Businesses"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.customer_segments', 'pitch_deck.market'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed', 'series_a'], true, true),

  (v_generic_pack_id, 'pv_problem_evidence', 'problem_validation', 3,
   'How do you know this problem exists?',
   'Assumptions kill startups. Evidence builds conviction.',
   'What conversations, data, or experiences prove this problem is real and worth solving?',
   'Distinguish between assumptions and validated evidence. Push for primary research.',
   '{"primary_research": "Direct customer conversations", "quantitative": "Data or metrics", "personal": "Founder experience"}'::jsonb,
   '["Just an idea", "No customer conversations", "Only secondary research"]'::jsonb,
   '[{"good": "Interviewed 30 sales leaders, 27 mentioned this as top-3 pain", "bad": "I read about it online"}]'::jsonb,
   'textarea', ARRAY['wizard_sessions.ai_extractions'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true),

  (v_generic_pack_id, 'pv_current_alternatives', 'problem_validation', 4,
   'How are people solving this problem today?',
   'No alternatives means no market. Bad alternatives mean opportunity.',
   'List the workarounds, competitors, and manual processes people currently use.',
   'Identify if alternatives exist and why they fail. No alternatives is a red flag.',
   '{"alternatives_exist": "People are spending time/money on this", "clear_gaps": "Alternatives have obvious weaknesses"}'::jsonb,
   '["No one is trying to solve this", "Perfect solution already exists"]'::jsonb,
   '[{"good": "Teams use spreadsheets + 3 different tools that dont integrate", "bad": "There is no competition"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.existing_alternatives', 'pitch_deck.competition'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed', 'series_a'], true, true),

  (v_generic_pack_id, 'pv_why_now', 'problem_validation', 5,
   'Why is now the right time to solve this?',
   'Timing is everything. Market shifts create windows of opportunity.',
   'What technology, regulation, or behavior change makes this possible or necessary now?',
   'Look for external tailwinds. "Now is always good" is not compelling.',
   '{"technology_shift": "New tech enables solution", "market_shift": "Behavior or regulation changed", "cost_shift": "Economics recently changed"}'::jsonb,
   '["No clear timing advantage", "Problem has existed forever unchanged"]'::jsonb,
   '[{"good": "GPT-4 enables real-time conversation analysis that wasnt possible before", "bad": "Sales has always been important"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.why_now'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'pv_problem_cost', 'problem_validation', 6,
   'What does this problem cost your customers?',
   'Quantified pain justifies budget. ROI drives purchasing decisions.',
   'Calculate time lost, money wasted, or opportunities missed due to this problem.',
   'Push for specific numbers. Vague costs = vague value prop.',
   '{"time_cost": "Hours/week wasted", "money_cost": "Direct financial impact", "opportunity_cost": "Revenue missed"}'::jsonb,
   '["No quantified impact", "Trivial costs mentioned"]'::jsonb,
   '[{"good": "Sales teams lose $50K/year per rep in missed follow-ups", "bad": "Its annoying"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.problem', 'pitch_deck.problem'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'pv_urgency_trigger', 'problem_validation', 7,
   'What triggers someone to actively seek a solution?',
   'Knowing triggers enables targeted marketing and sales timing.',
   'What event, milestone, or pain spike makes someone search for a solution right now?',
   'Identify specific trigger events. "They just realize it" is not a trigger.',
   '{"specific_event": "Clear triggering moment", "observable": "Can be detected or predicted"}'::jsonb,
   '["No clear trigger", "Always a problem but never urgent"]'::jsonb,
   '[{"good": "When they hire their 5th SDR and realize onboarding takes 3 months", "bad": "When they want to improve"}]'::jsonb,
   'textarea', ARRAY['wizard_sessions.form_data'], ARRAY['onboarding'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'pv_problem_priority', 'problem_validation', 8,
   'Is this a top-3 priority for your target customer?',
   'Customers buy priorities, not nice-to-haves. Priority = budget.',
   'Where does this rank versus other problems they face? What evidence supports that ranking?',
   'Challenge if this is truly a priority. Vitamin vs painkiller distinction.',
   '{"ranked_high": "Customer confirms top-3", "budget_allocated": "Spending exists for this"}'::jsonb,
   '["Nice to have", "Never mentioned as priority", "No budget allocated"]'::jsonb,
   '[{"good": "In 30 interviews, 24 ranked this in their top 3 challenges", "bad": "I think they would care"}]'::jsonb,
   'textarea', ARRAY['wizard_sessions.form_data'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- SOLUTION DESIGN (6 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'sd_core_solution', 'solution_design', 1,
   'What is your solution in one sentence?',
   'Clarity is power. If you cant explain it simply, you dont understand it well enough.',
   'Complete this: "We help [who] to [do what] by [how], unlike [alternatives]."',
   'Evaluate clarity and completeness. Push back if jargon-heavy or vague.',
   '{"clear_who": "Target defined", "clear_what": "Outcome defined", "clear_how": "Mechanism explained"}'::jsonb,
   '["Too technical", "No clear differentiation", "Feature list instead of outcome"]'::jsonb,
   '[{"good": "We help sales teams close 40% more deals by automating follow-ups with AI", "bad": "We use machine learning for sales optimization"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.solution', 'pitch_deck.solution'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed', 'series_a'], true, true),

  (v_generic_pack_id, 'sd_unique_approach', 'solution_design', 2,
   'What makes your approach different from alternatives?',
   'Differentiation creates defensibility and pricing power.',
   'What do you do that competitors cannot or will not do?',
   'Look for genuine technical or strategic moats, not just features.',
   '{"defensible": "Hard to copy", "meaningful": "Matters to customers", "sustainable": "Will last"}'::jsonb,
   '["Just better UX", "First mover only", "No real difference"]'::jsonb,
   '[{"good": "Our proprietary training data from 10K sales calls gives us 3x accuracy", "bad": "Were more user-friendly"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.unfair_advantage', 'pitch_deck.competition'], ARRAY['onboarding', 'pitch_deck'], ARRAY['seed', 'series_a'], true, true),

  (v_generic_pack_id, 'sd_mvp_scope', 'solution_design', 3,
   'What is the minimum product that solves the core problem?',
   'MVPs test hypotheses, not showcase features. Less is more.',
   'What single capability would make early customers pay you?',
   'Challenge scope. If MVP takes > 3 months, its probably not minimum.',
   '{"focused": "One core value prop", "buildable": "< 3 months to launch", "testable": "Can validate hypothesis"}'::jsonb,
   '["Too many features", "No customer input on scope", "MVP = full product"]'::jsonb,
   '[{"good": "Auto-draft follow-up emails from call transcripts", "bad": "Full CRM with AI, integrations, and mobile app"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.solution'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true),

  (v_generic_pack_id, 'sd_key_features', 'solution_design', 4,
   'What are the 3 most important features?',
   'Focus wins. Too many features = diluted value prop and slow execution.',
   'Rank features by customer impact, not technical coolness.',
   'Ensure features map to customer problems. Challenge feature bloat.',
   '{"problem_linked": "Each feature solves stated problem", "prioritized": "Clear #1", "achievable": "Can build in 6 months"}'::jsonb,
   '["10+ features listed", "Features dont map to problems", "All equally important"]'::jsonb,
   '[{"good": "1. Auto-transcription 2. AI follow-up drafts 3. CRM sync", "bad": "We have 20 powerful features"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.product'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'sd_tech_advantage', 'solution_design', 5,
   'What technical advantages do you have?',
   'Technical moats create long-term defensibility.',
   'What technology, data, or IP gives you an edge?',
   'Distinguish between "using AI" (not a moat) and proprietary advantages.',
   '{"proprietary": "Owned by you", "hard_to_replicate": "Takes time/resources to copy", "compounding": "Gets stronger over time"}'::jsonb,
   '["Using off-the-shelf AI", "No proprietary data", "Easily replicable"]'::jsonb,
   '[{"good": "Fine-tuned models on 1M+ proprietary sales conversations", "bad": "We use ChatGPT"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.unfair_advantage'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'sd_user_journey', 'solution_design', 6,
   'Walk me through how a user accomplishes their goal with your product.',
   'User journeys reveal complexity and friction points.',
   'Describe step-by-step what happens from sign-up to value delivery.',
   'Look for complexity and time-to-value. Simpler = better.',
   '{"clear_steps": "Logical flow", "quick_value": "Value in < 5 min", "minimal_friction": "Few barriers"}'::jsonb,
   '["Many steps to value", "Requires training", "Depends on integrations"]'::jsonb,
   '[{"good": "Connect email -> AI analyzes calls -> Get follow-up drafts in inbox", "bad": "Complex 10-step onboarding"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.solution'], ARRAY['onboarding'], ARRAY['seed', 'series_a'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- BUSINESS MODEL (6 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'bm_revenue_model', 'business_model', 1,
   'How do you make money?',
   'Revenue model determines scalability, predictability, and valuation multiples.',
   'Describe your pricing model: subscription, usage-based, transaction fee, etc.',
   'Evaluate model fit for the market. Check for proven willingness to pay.',
   '{"clear_model": "Defined pricing structure", "market_fit": "Customers pay this way", "scalable": "Grows with usage"}'::jsonb,
   '["Will figure it out later", "Ads only", "No clear monetization"]'::jsonb,
   '[{"good": "$99/seat/month SaaS subscription", "bad": "Well monetize through ads eventually"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.revenue_streams', 'pitch_deck.business_model'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed', 'series_a'], true, true),

  (v_generic_pack_id, 'bm_pricing', 'business_model', 2,
   'What do you charge and why?',
   'Pricing reflects value capture and market positioning.',
   'Explain your price point and how you arrived at it. What does it cost competitors?',
   'Check for value-based pricing. Cost-plus is a red flag.',
   '{"value_based": "Priced on value delivered", "competitive": "Reasonable vs alternatives", "tested": "Validated with customers"}'::jsonb,
   '["Random number", "Cost-plus only", "Racing to bottom"]'::jsonb,
   '[{"good": "$99/mo saves 10 hrs/week = $500+ value, 5x ROI", "bad": "Competitors charge $50 so we charge $40"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.revenue_streams', 'pitch_deck.business_model'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'bm_unit_economics', 'business_model', 3,
   'What are your unit economics (CAC, LTV)?',
   'Unit economics determine if the business can scale profitably.',
   'Calculate customer acquisition cost and lifetime value. LTV should be 3x+ CAC.',
   'Push for specifics. "We dont know yet" is acceptable pre-revenue but concerning post-revenue.',
   '{"ltv_cac_ratio": "LTV > 3x CAC", "payback": "< 12 months", "improving": "Trending better"}'::jsonb,
   '["LTV < CAC", "No idea", "Ignoring acquisition costs"]'::jsonb,
   '[{"good": "CAC $200, LTV $2,400, 12-month payback", "bad": "We focus on growth, not unit economics"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.financials'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'bm_expansion_revenue', 'business_model', 4,
   'How do you grow revenue from existing customers?',
   'Expansion revenue reduces reliance on new customer acquisition.',
   'What upsells, add-ons, or usage-based growth exists?',
   'Look for natural expansion paths. Pure flat subscription limits growth.',
   '{"upsell_path": "Clear upgrade tiers", "usage_growth": "Revenue grows with usage", "net_retention": "> 100%"}'::jsonb,
   '["No expansion path", "One flat tier only"]'::jsonb,
   '[{"good": "Seat expansion + usage-based AI credits + enterprise tier", "bad": "Everyone pays the same forever"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.revenue_streams'], ARRAY['pitch_deck'], ARRAY['series_a'], false, true),

  (v_generic_pack_id, 'bm_cost_structure', 'business_model', 5,
   'What are your major costs?',
   'Understanding costs reveals margin potential and scaling economics.',
   'List top 3-5 cost categories and their approximate breakdown.',
   'Check for gross margin potential. AI/cloud costs can eat margins.',
   '{"clear_breakdown": "Top costs identified", "margin_path": "Path to healthy margins", "scalable": "Costs dont scale linearly"}'::jsonb,
   '["Ignoring AI costs", "No cost awareness", "Costs scale 1:1 with revenue"]'::jsonb,
   '[{"good": "Engineering 60%, Cloud/AI 20%, S&M 15%", "bad": "Not sure, focused on growth"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.cost_structure', 'pitch_deck.financials'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'bm_gross_margin', 'business_model', 6,
   'What is your target gross margin?',
   'Gross margin determines how much you can invest in growth.',
   'Calculate: (Revenue - COGS) / Revenue. SaaS should target 70-80%+.',
   'Check margin realism. AI-heavy products often have lower margins.',
   '{"target_defined": "Clear margin goal", "realistic": "Achievable with scale", "competitive": "In line with industry"}'::jsonb,
   '["Sub-50% margins with no path up", "Ignoring compute costs"]'::jsonb,
   '[{"good": "Currently 65%, targeting 75% at scale as AI costs decrease", "bad": "Well figure it out"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.financials'], ARRAY['pitch_deck'], ARRAY['series_a'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- COMPETITIVE STRATEGY (5 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'cs_direct_competitors', 'competitive_strategy', 1,
   'Who are your top 3 direct competitors?',
   'Knowing competitors proves market awareness and helps define positioning.',
   'Name competitors solving the same problem for the same customer.',
   'Challenge "no competitors" claims. Someone is getting the budget.',
   '{"named": "Specific companies", "similar": "Same problem/customer", "researched": "Know their strengths"}'::jsonb,
   '["No competitors", "Only big tech", "Havent researched"]'::jsonb,
   '[{"good": "Gong ($7B), Chorus (acquired $575M), Clari", "bad": "Were unique, no competition"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.existing_alternatives', 'pitch_deck.competition'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed', 'series_a'], true, true),

  (v_generic_pack_id, 'cs_indirect_competitors', 'competitive_strategy', 2,
   'What are the indirect alternatives customers might choose?',
   'Indirect competition often wins when direct solutions fail.',
   'What else competes for the same budget, time, or attention?',
   'Look for non-obvious alternatives: spreadsheets, agencies, doing nothing.',
   '{"identified": "Non-obvious alternatives", "understood": "Know why they win"}'::jsonb,
   '["Only listing direct competitors", "Ignoring status quo"]'::jsonb,
   '[{"good": "Hiring more SDRs, using agencies, building in-house", "bad": "Just the SaaS competitors"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.existing_alternatives'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'cs_differentiation', 'competitive_strategy', 3,
   'Why will you win against these competitors?',
   'Clear differentiation enables focused positioning and sales.',
   'What do you do better, cheaper, or differently that matters to customers?',
   'Challenge generic claims. "Better UX" is not sustainable differentiation.',
   '{"specific": "Clear advantage stated", "defensible": "Hard to copy", "valued": "Customers care about this"}'::jsonb,
   '["Just better", "First mover", "Lower price only"]'::jsonb,
   '[{"good": "2x faster time-to-value with zero integration needed", "bad": "Were more innovative"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.unfair_advantage', 'pitch_deck.competition'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], true, true),

  (v_generic_pack_id, 'cs_moat', 'competitive_strategy', 4,
   'What is your long-term defensibility (moat)?',
   'Moats protect against competition and enable sustainable growth.',
   'What gets stronger over time: network effects, data, brand, switching costs?',
   'Evaluate moat strength. Technology alone is rarely a moat.',
   '{"identified": "Clear moat type", "compounding": "Gets stronger", "sustainable": "Multi-year advantage"}'::jsonb,
   '["Technology only", "No clear moat", "Easy to replicate"]'::jsonb,
   '[{"good": "Network effects: more users = more data = better AI = more users", "bad": "We have good technology"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.unfair_advantage', 'pitch_deck.competition'], ARRAY['pitch_deck'], ARRAY['series_a'], false, true),

  (v_generic_pack_id, 'cs_positioning', 'competitive_strategy', 5,
   'How do you want to be positioned in customers minds?',
   'Positioning drives marketing, sales, and product decisions.',
   'Complete: "We are the [category] for [audience] who want [outcome]."',
   'Check for clarity and distinctiveness. Generic positioning fails.',
   '{"clear": "Easily understood", "distinct": "Different from alternatives", "memorable": "Sticks in mind"}'::jsonb,
   '["Generic category", "Trying to be everything", "No clear position"]'::jsonb,
   '[{"good": "The AI sales coach that helps reps close 40% more deals", "bad": "An AI-powered sales platform"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.title'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- CUSTOMER DISCOVERY (5 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'cd_customer_conversations', 'customer_discovery', 1,
   'How many potential customers have you talked to?',
   'Customer conversations are the foundation of product-market fit.',
   'Count only substantive conversations (30+ min) with target customers.',
   'Push for quality over quantity. 10 deep conversations > 100 surveys.',
   '{"sufficient": "10+ conversations", "quality": "30+ min each", "diverse": "Different company types"}'::jsonb,
   '["Zero conversations", "Only friends/family", "Surveys only"]'::jsonb,
   '[{"good": "47 conversations with sales leaders at SaaS companies", "bad": "We sent a survey to our network"}]'::jsonb,
   'textarea', ARRAY['wizard_sessions.form_data'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], true, true),

  (v_generic_pack_id, 'cd_key_insights', 'customer_discovery', 2,
   'What surprised you most from customer conversations?',
   'Surprises reveal assumptions you didnt know you had.',
   'What did you learn that contradicted your initial hypothesis?',
   'Genuine surprises show real learning. "Confirmed everything" is concerning.',
   '{"genuine": "Real surprise", "actionable": "Changed your approach", "specific": "Clear example"}'::jsonb,
   '["Nothing surprised us", "Confirmed everything", "No specific examples"]'::jsonb,
   '[{"good": "We thought price was the issue, but its implementation time", "bad": "Everyone loved our idea"}]'::jsonb,
   'textarea', ARRAY['wizard_sessions.form_data'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true),

  (v_generic_pack_id, 'cd_willingness_to_pay', 'customer_discovery', 3,
   'What evidence do you have that customers will pay?',
   'Willingness to pay is the ultimate validation.',
   'Have you received LOIs, pre-orders, or deposits? If not, what signals exist?',
   'Distinguish between polite interest and real buying signals.',
   '{"commitments": "LOIs or deposits", "price_tested": "Discussed pricing", "urgency": "Want it now"}'::jsonb,
   '["Everyone said theyd use it", "No pricing conversations", "Only feedback on free version"]'::jsonb,
   '[{"good": "$50K in LOIs from 5 companies", "bad": "30 people said theyd definitely use it"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.revenue_streams', 'pitch_deck.traction'], ARRAY['onboarding', 'pitch_deck'], ARRAY['pre_seed', 'seed'], false, true),

  (v_generic_pack_id, 'cd_icp_refinement', 'customer_discovery', 4,
   'How has your ideal customer profile evolved?',
   'ICP refinement shows learning and focus.',
   'How is your target customer different now vs. when you started?',
   'Look for specificity increase. Broader ICP over time is concerning.',
   '{"more_specific": "Narrowed focus", "evidence_based": "Based on data", "actionable": "Can find them"}'::jsonb,
   '["Same as day one", "Getting broader", "No changes based on feedback"]'::jsonb,
   '[{"good": "Started with all B2B, now focused on B2B SaaS 50-500 employees with 10+ SDRs", "bad": "Still targeting everyone"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.customer_segments'], ARRAY['onboarding'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'cd_champion_profile', 'customer_discovery', 5,
   'Who is the champion and who is the buyer?',
   'Understanding the buying process is critical for sales.',
   'Who discovers you, who champions internally, and who signs the check?',
   'Check for understanding of enterprise buying dynamics.',
   '{"champion_id": "Know who advocates", "buyer_id": "Know who pays", "process": "Understand buying journey"}'::jsonb,
   '["Same person", "Havent thought about it", "Just need product-market fit first"]'::jsonb,
   '[{"good": "SDR managers find us, VP Sales champions, CRO approves", "bad": "Whoever wants to buy"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.customer_segments'], ARRAY['onboarding'], ARRAY['seed', 'series_a'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- GO-TO-MARKET (4 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'gtm_acquisition_channels', 'go_to_market', 1,
   'How do you acquire customers today?',
   'Proven channels are more valuable than theoretical ones.',
   'List channels in order of effectiveness. Which brings the best customers?',
   'Push for specifics. "Marketing" is not a channel.',
   '{"specific": "Named channels", "proven": "Has worked", "measurable": "Know the numbers"}'::jsonb,
   '["Will do marketing", "Viral growth", "No customer acquisition yet"]'::jsonb,
   '[{"good": "LinkedIn outbound (40%), referrals (35%), content (25%)", "bad": "Marketing and sales"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.channels', 'pitch_deck.go_to_market'], ARRAY['onboarding', 'pitch_deck'], ARRAY['seed', 'series_a'], true, true),

  (v_generic_pack_id, 'gtm_first_10_customers', 'go_to_market', 2,
   'How did you get your first 10 customers?',
   'First customer stories reveal what actually works.',
   'Walk through specific customer acquisitions. What worked?',
   'Look for repeatable patterns vs. one-off wins.',
   '{"specific_stories": "Named examples", "repeatable": "Pattern emerges", "learnings": "Know what worked"}'::jsonb,
   '["Friends and family only", "Dont have 10 yet", "Random luck"]'::jsonb,
   '[{"good": "Cold outreach to sales leaders, 3% response rate, 10% close rate", "bad": "Founder network"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.traction'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'gtm_sales_motion', 'go_to_market', 3,
   'What is your sales motion (PLG, sales-led, hybrid)?',
   'Sales motion determines team structure, funding needs, and growth trajectory.',
   'How does a customer go from awareness to paying?',
   'Match motion to ACV. $10K+ usually needs sales-led or hybrid.',
   '{"defined": "Clear motion", "matches_acv": "Appropriate for price point", "proven": "Has worked"}'::jsonb,
   '["Not sure yet", "Motion doesnt match price", "No process defined"]'::jsonb,
   '[{"good": "PLG for SMB ($99/mo), sales-led for Enterprise ($50K+/yr)", "bad": "Enterprise PLG only"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.channels', 'pitch_deck.go_to_market'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true),

  (v_generic_pack_id, 'gtm_scalability', 'go_to_market', 4,
   'How will you scale customer acquisition 10x?',
   'Investors fund scalable growth, not linear effort.',
   'What channels or strategies will work at 10x current volume?',
   'Challenge if current approach can scale. Founder-led sales doesnt scale.',
   '{"identified": "Named scale channels", "tested": "Have early signals", "realistic": "Numbers make sense"}'::jsonb,
   '["More of the same", "Hire more salespeople", "No scale plan"]'::jsonb,
   '[{"good": "PLG flywheel + partner channel + content engine", "bad": "Hire 100 SDRs"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.go_to_market'], ARRAY['pitch_deck'], ARRAY['series_a'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- MVP PLANNING (4 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'mvp_core_hypothesis', 'mvp_planning', 1,
   'What is the core hypothesis your MVP tests?',
   'MVPs are experiments. Without a hypothesis, you cant learn.',
   'State what you believe and how the MVP proves or disproves it.',
   'Ensure hypothesis is falsifiable. "People will like it" is not testable.',
   '{"falsifiable": "Can be proven wrong", "specific": "Clear success criteria", "important": "Matters to business"}'::jsonb,
   '["No hypothesis", "Just building features", "Not falsifiable"]'::jsonb,
   '[{"good": "Sales teams will use AI-drafted follow-ups for 50%+ of their emails", "bad": "People will like our product"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.solution'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], true, true),

  (v_generic_pack_id, 'mvp_success_metrics', 'mvp_planning', 2,
   'How will you measure MVP success?',
   'Metrics define success. Without them, any outcome feels like a win.',
   'Define 2-3 specific metrics and their targets.',
   'Push for leading indicators over lagging. Retention over signups.',
   '{"specific": "Named metrics", "targets": "Clear thresholds", "leading": "Predict success"}'::jsonb,
   '["Signups only", "No specific targets", "Too many metrics"]'::jsonb,
   '[{"good": "Week 2 retention > 40%, DAU/MAU > 30%, NPS > 40", "bad": "Get users and see what happens"}]'::jsonb,
   'textarea', ARRAY['lean_canvas.key_metrics', 'pitch_deck.traction'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true),

  (v_generic_pack_id, 'mvp_timeline', 'mvp_planning', 3,
   'What is your timeline to MVP launch?',
   'Speed matters. Faster learning = faster product-market fit.',
   'How long until you can put something in front of customers?',
   'Challenge long timelines. 3+ months is concerning for true MVP.',
   '{"realistic": "Achievable timeline", "fast": "< 3 months", "customer_input": "Customers involved"}'::jsonb,
   '["6+ months", "Perfect before launch", "No timeline"]'::jsonb,
   '[{"good": "4 weeks to alpha with 5 design partners", "bad": "6 months to full product"}]'::jsonb,
   'textarea', ARRAY['wizard_sessions.form_data'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true),

  (v_generic_pack_id, 'mvp_design_partners', 'mvp_planning', 4,
   'Do you have design partners or early customers committed?',
   'Design partners validate demand and accelerate learning.',
   'Who has agreed to use/test your product before its ready?',
   'LOIs and commitments matter. Verbal interest doesnt.',
   '{"committed": "Named companies", "engaged": "Active participation", "diverse": "Different use cases"}'::jsonb,
   '["No commitments", "Just friends", "Will find them later"]'::jsonb,
   '[{"good": "5 companies signed LOIs for beta access", "bad": "A few people said theyd try it"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.traction'], ARRAY['onboarding'], ARRAY['pre_seed', 'seed'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

  -- EXECUTION PLANNING (2 questions)
  INSERT INTO industry_questions (pack_id, question_key, category, display_order, question, why_this_matters, thinking_prompt, ai_coach_prompt, quality_criteria, red_flags, examples, input_type, outputs_to, contexts, stage_filter, is_required, is_active)
  VALUES
  (v_generic_pack_id, 'ep_next_milestones', 'execution_planning', 1,
   'What are your next 3 major milestones?',
   'Milestones show execution ability and planning skills.',
   'Define specific, measurable milestones with target dates.',
   'Challenge vague milestones. "Launch" is not specific enough.',
   '{"specific": "Clear deliverables", "measurable": "Know when achieved", "timebound": "Target dates"}'::jsonb,
   '["Vague milestones", "No dates", "Too far out"]'::jsonb,
   '[{"good": "1. 10 paying customers by March 2. $10K MRR by May 3. Seed round by July", "bad": "Launch, grow, raise"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.roadmap', 'pitch_deck.ask'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], true, true),

  (v_generic_pack_id, 'ep_biggest_risk', 'execution_planning', 2,
   'What is the biggest risk to your success?',
   'Self-awareness about risks shows maturity and planning ability.',
   'What could kill this company? How are you mitigating it?',
   'Probe for genuine risk awareness. "No risks" is the biggest risk.',
   '{"identified": "Named key risk", "mitigation": "Have a plan", "honest": "Genuine assessment"}'::jsonb,
   '["No risks", "Competition only", "Havent thought about it"]'::jsonb,
   '[{"good": "Adoption risk: sales teams may resist AI. Mitigating with change management playbook.", "bad": "Competition might copy us"}]'::jsonb,
   'textarea', ARRAY['pitch_deck.risks'], ARRAY['pitch_deck'], ARRAY['seed', 'series_a'], false, true)
  ON CONFLICT (pack_id, question_key) DO NOTHING;

END $$;
