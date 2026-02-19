-- ============================================================================
-- Seed: Prompt Packs (Agent-Driven)
-- Description: Initial prompt packs with auto-trigger configuration
-- Author: StartupAI
-- Created: 2026-01-29
-- ============================================================================

-- ============================================================================
-- IDEATION PACKS
-- ============================================================================

-- Problem Sharpener (Onboarding Step 1)
insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'Problem Sharpener',
  'ideation-problem-sharpener',
  'ideation',
  'Turn a fuzzy description into a crisp who/struggle/why-now statement',
  '{"onboarding", "chat"}',
  '{"/onboarding", "/onboarding/1", "/get-started"}',
  '{"sharpen", "problem", "first principles", "who", "struggle"}',
  10
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents,
  priority = excluded.priority;

-- Get pack ID for steps
do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'ideation-problem-sharpener';

  -- Step 1: Problem Snapshot
  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'problem_snapshot',
    'Turn fuzzy description into who/struggle/why-now',
    E'I''m building a product for {{target_audience}} who struggle with {{problem}}.

Using this information, rewrite it into a sharp who/struggle/why-now statement. Keep it short and clear so it highlights who the user is, what their struggle is, and why solving it now matters.

Return ONLY valid JSON:
{
  "who": "specific target user description",
  "struggle": "their main challenge or frustration",
  "why_now": "why solving this matters now"
}',
    '{"type": "object", "properties": {"who": {"type": "string"}, "struggle": {"type": "string"}, "why_now": {"type": "string"}}, "required": ["who", "struggle", "why_now"]}',
    'gemini',
    '{"profile"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    prompt_template = excluded.prompt_template,
    apply_to = excluded.apply_to;

  -- Step 2: Idea in 10 Words
  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    2,
    'idea_10_words',
    'Compress idea into 10 words or fewer',
    E'My idea: {{description}}

Compress this idea into 10 words or fewer. Every word must earn its place.

Return ONLY valid JSON:
{
  "idea_short": "the 10-word (or shorter) description",
  "word_count": 10
}',
    '{"type": "object", "properties": {"idea_short": {"type": "string"}, "word_count": {"type": "integer"}}, "required": ["idea_short"]}',
    'gemini',
    '{"profile"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    prompt_template = excluded.prompt_template;
end $$;

-- ============================================================================
-- VALIDATION PACKS
-- ============================================================================

-- Quick Validate
insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'Quick Validate',
  'validation-quick',
  'validation',
  'Rapid idea validation with ICP, pain level, and readiness score',
  '{"validator", "chat", "dashboard"}',
  '{"/validator", "/validate"}',
  '{"validate", "score", "assess", "icp", "readiness"}',
  10
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'validation-quick';

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'quick_score',
    'Generate validation score with 6 dimensions',
    E'Analyze this startup idea and provide a validation assessment:

Idea: {{idea_description}}
Industry: {{industry}}
Stage: {{stage}}

Evaluate on these dimensions (0-100 each):
1. Problem clarity and severity
2. Market size and growth potential
3. Competition and differentiation
4. Solution fit
5. Business model viability
6. Execution feasibility

Return ONLY valid JSON:
{
  "scores": {
    "problem": 0-100,
    "market": 0-100,
    "competition": 0-100,
    "solution": 0-100,
    "business": 0-100,
    "execution": 0-100
  },
  "overall_score": 0-100,
  "verdict": "go" | "conditional" | "pivot" | "no_go",
  "icp": "ideal customer profile description",
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"],
  "next_steps": ["action1", "action2", "action3"]
}',
    '{"type": "object", "properties": {"scores": {"type": "object"}, "overall_score": {"type": "number"}, "verdict": {"type": "string"}, "icp": {"type": "string"}, "strengths": {"type": "array"}, "concerns": {"type": "array"}, "next_steps": {"type": "array"}}, "required": ["overall_score", "verdict"]}',
    'gemini',
    '{"validation", "score", "tasks"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    apply_to = excluded.apply_to;
end $$;

-- ============================================================================
-- MARKET PACKS
-- ============================================================================

-- Competitor Finder (Onboarding Step 2)
insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'Competitor Finder',
  'market-competitor-finder',
  'market',
  'Identify competitors and market positioning',
  '{"onboarding", "chat", "dashboard"}',
  '{"/onboarding/2"}',
  '{"competitor", "competition", "market", "alternative"}',
  10
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'market-competitor-finder';

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'competitor_list',
    'Find 5-8 competitors with positioning',
    E'Analyze the competitive landscape for this startup:

Description: {{description}}
Industry: {{industry}}
Target Market: {{target_market}}

Find 5-8 direct and indirect competitors. For each competitor, identify their positioning and how they differ.

Return ONLY valid JSON:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "type": "direct" | "indirect",
      "positioning": "their market position",
      "strengths": ["strength1"],
      "weaknesses": ["weakness1"],
      "pricing": "pricing info if known"
    }
  ],
  "market_gaps": ["gap1", "gap2"],
  "differentiation_opportunities": ["opportunity1", "opportunity2"]
}',
    '{"type": "object", "properties": {"competitors": {"type": "array"}, "market_gaps": {"type": "array"}, "differentiation_opportunities": {"type": "array"}}, "required": ["competitors"]}',
    'gemini',
    '{"profile"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    apply_to = excluded.apply_to;
end $$;

-- ============================================================================
-- PITCH PACKS
-- ============================================================================

-- One Sentence Pitch (Onboarding Step 4)
insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'One Sentence Pitch',
  'pitch-one-sentence',
  'pitch',
  'Generate a compelling one-sentence pitch',
  '{"onboarding", "chat"}',
  '{"/onboarding/4", "/onboarding/pitch"}',
  '{"pitch", "elevator", "one sentence", "tagline"}',
  10
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'pitch-one-sentence';

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'one_sentence',
    'Generate FI-format one sentence pitch',
    E'Create a compelling one-sentence pitch for this startup:

Company: {{company_name}}
Description: {{description}}
Target: {{target_market}}
Problem: {{problem}}
Solution: {{solution}}

Use this format: "For [target customer] who [need/problem], [product name] is a [category] that [key benefit]. Unlike [competitor/alternative], our product [key differentiator]."

Return ONLY valid JSON:
{
  "pitch_fi_format": "the complete pitch following the format",
  "pitch_short": "a 15-word or less version",
  "pitch_tweet": "280 character version for social",
  "hook_line": "attention-grabbing opening line"
}',
    '{"type": "object", "properties": {"pitch_fi_format": {"type": "string"}, "pitch_short": {"type": "string"}, "pitch_tweet": {"type": "string"}, "hook_line": {"type": "string"}}, "required": ["pitch_fi_format"]}',
    'gemini',
    '{"profile"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    apply_to = excluded.apply_to;
end $$;

-- ============================================================================
-- CANVAS PACKS
-- ============================================================================

-- Canvas UVP Generator
insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'Canvas UVP Generator',
  'canvas-uvp',
  'canvas',
  'Generate unique value proposition for Lean Canvas',
  '{"canvas", "chat"}',
  '{"/canvas", "/lean-canvas"}',
  '{"uvp", "value proposition", "canvas"}',
  10
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'canvas-uvp';

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'uvp_generator',
    'Generate unique value proposition',
    E'Generate a unique value proposition for this startup:

Problem: {{problem}}
Solution: {{solution}}
Target Customer: {{target_market}}

Create a clear, compelling UVP that explains why customers should choose this product.

Return ONLY valid JSON:
{
  "uvp_short": "one sentence UVP",
  "uvp_long": "2-3 sentence expanded UVP",
  "before_after": {
    "before": "life before the product",
    "after": "life after the product"
  },
  "suggested_channels": ["channel1", "channel2", "channel3"]
}',
    '{"type": "object", "properties": {"uvp_short": {"type": "string"}, "uvp_long": {"type": "string"}, "before_after": {"type": "object"}, "suggested_channels": {"type": "array"}}, "required": ["uvp_short"]}',
    'gemini',
    '{"canvas"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    apply_to = excluded.apply_to;
end $$;

-- ============================================================================
-- FOUNDER-FIT PACK (Onboarding Step 3)
-- ============================================================================

insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'Founder-Market Fit',
  'hiring-founder-fit',
  'hiring',
  'Evaluate founder-market fit based on background and market',
  '{"onboarding", "chat"}',
  '{"/onboarding/3"}',
  '{"founder", "team", "fit", "background"}',
  10
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'hiring-founder-fit';

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'founder_fit',
    'Evaluate founder-market fit',
    E'Evaluate the founder-market fit for this startup:

Founder Background: {{founder_background}}
Industry: {{industry}}
Problem Being Solved: {{problem}}
Target Market: {{target_market}}

Assess whether the founder has relevant experience, skills, and insights to succeed in this market.

Return ONLY valid JSON:
{
  "fit_score": 0-100,
  "fit_verdict": "strong" | "moderate" | "needs_work",
  "advantages": ["advantage1", "advantage2"],
  "gaps": ["gap1", "gap2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "summary": "one paragraph summary of founder-market fit"
}',
    '{"type": "object", "properties": {"fit_score": {"type": "number"}, "fit_verdict": {"type": "string"}, "advantages": {"type": "array"}, "gaps": {"type": "array"}, "recommendations": {"type": "array"}, "summary": {"type": "string"}}, "required": ["fit_score", "fit_verdict"]}',
    'gemini',
    '{"profile"}'
  ) on conflict (pack_id, step_order) do update set
    name = excluded.name,
    apply_to = excluded.apply_to;
end $$;

-- ============================================================================
-- INDUSTRY-SPECIFIC PACKS
-- ============================================================================

-- SaaS Validation Pack
insert into prompt_packs (title, slug, category, description, industry_tags, use_case_tags, trigger_intents, priority)
values (
  'SaaS Validation Pack',
  'validation-saas',
  'validation',
  'SaaS-specific validation with PLG metrics, churn, and retention focus',
  '{"saas", "b2b", "software"}',
  '{"validator", "chat"}',
  '{"validate", "saas", "churn", "retention"}',
  15
) on conflict (slug) do update set
  industry_tags = excluded.industry_tags,
  priority = excluded.priority;

-- Fintech Validation Pack
insert into prompt_packs (title, slug, category, description, industry_tags, use_case_tags, trigger_intents, priority)
values (
  'Fintech Validation Pack',
  'validation-fintech',
  'validation',
  'Fintech-specific validation with compliance, regulatory, and trust focus',
  '{"fintech", "banking", "payments"}',
  '{"validator", "chat"}',
  '{"validate", "fintech", "compliance", "regulatory"}',
  15
) on conflict (slug) do update set
  industry_tags = excluded.industry_tags,
  priority = excluded.priority;

-- Marketplace Validation Pack
insert into prompt_packs (title, slug, category, description, industry_tags, use_case_tags, trigger_intents, priority)
values (
  'Marketplace Validation Pack',
  'validation-marketplace',
  'validation',
  'Marketplace-specific validation with supply/demand, liquidity, and network effects',
  '{"marketplace", "platform"}',
  '{"validator", "chat"}',
  '{"validate", "marketplace", "supply", "demand", "liquidity"}',
  15
) on conflict (slug) do update set
  industry_tags = excluded.industry_tags,
  priority = excluded.priority;

-- ============================================================================
-- INDUSTRY-SPECIFIC PACK STEPS
-- ============================================================================

-- SaaS Validation Step
do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'validation-saas';
  if v_pack_id is null then return; end if;

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'saas_validation',
    'SaaS-specific validation with PLG metrics',
    E'Analyze this SaaS startup idea with industry-specific criteria:

Idea: {{idea_description}}
Target Market: {{target_market}}
Pricing Model: {{pricing_model}}

Evaluate with SaaS-specific metrics:
1. Product-Led Growth (PLG) potential
2. CAC/LTV dynamics
3. Churn risk factors
4. Expansion revenue opportunity
5. Time to value
6. Network/viral effects

Return ONLY valid JSON:
{
  "scores": {
    "plg_potential": 0-100,
    "cac_ltv": 0-100,
    "churn_risk": 0-100,
    "expansion_opportunity": 0-100,
    "time_to_value": 0-100,
    "viral_potential": 0-100
  },
  "overall_score": 0-100,
  "verdict": "go" | "conditional" | "pivot" | "no_go",
  "saas_specific_insights": {
    "recommended_pricing_model": "string",
    "suggested_onboarding_flow": "string",
    "key_activation_metric": "string"
  },
  "risks": ["risk1", "risk2"],
  "next_steps": ["step1", "step2", "step3"]
}',
    '{"type": "object", "required": ["overall_score", "verdict"]}',
    'gemini',
    '{"validation", "score", "tasks"}'
  ) on conflict (pack_id, step_order) do update set
    prompt_template = excluded.prompt_template,
    apply_to = excluded.apply_to;
end $$;

-- Fintech Validation Step
do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'validation-fintech';
  if v_pack_id is null then return; end if;

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'fintech_validation',
    'Fintech-specific validation with compliance focus',
    E'Analyze this fintech startup idea with industry-specific criteria:

Idea: {{idea_description}}
Target Market: {{target_market}}
Financial Service Type: {{service_type}}

Evaluate with fintech-specific metrics:
1. Regulatory compliance complexity
2. Trust and security requirements
3. Banking partnership needs
4. Fraud/risk exposure
5. Unit economics (interchange, fees)
6. Market timing (open banking, etc.)

Return ONLY valid JSON:
{
  "scores": {
    "regulatory_complexity": 0-100,
    "trust_requirements": 0-100,
    "partnership_needs": 0-100,
    "fraud_risk": 0-100,
    "unit_economics": 0-100,
    "market_timing": 0-100
  },
  "overall_score": 0-100,
  "verdict": "go" | "conditional" | "pivot" | "no_go",
  "fintech_specific_insights": {
    "required_licenses": ["license1"],
    "key_compliance_areas": ["area1"],
    "recommended_banking_partners": ["partner1"]
  },
  "risks": ["risk1", "risk2"],
  "next_steps": ["step1", "step2", "step3"]
}',
    '{"type": "object", "required": ["overall_score", "verdict"]}',
    'gemini',
    '{"validation", "score", "tasks"}'
  ) on conflict (pack_id, step_order) do update set
    prompt_template = excluded.prompt_template,
    apply_to = excluded.apply_to;
end $$;

-- Marketplace Validation Step
do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'validation-marketplace';
  if v_pack_id is null then return; end if;

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'marketplace_validation',
    'Marketplace-specific validation with liquidity focus',
    E'Analyze this marketplace startup idea with industry-specific criteria:

Idea: {{idea_description}}
Supply Side: {{supply_description}}
Demand Side: {{demand_description}}

Evaluate with marketplace-specific metrics:
1. Chicken-and-egg problem severity
2. Liquidity potential
3. Take rate sustainability
4. Network effects strength
5. Disintermediation risk
6. Supply/demand fragmentation

Return ONLY valid JSON:
{
  "scores": {
    "chicken_egg_severity": 0-100,
    "liquidity_potential": 0-100,
    "take_rate_sustainability": 0-100,
    "network_effects": 0-100,
    "disintermediation_risk": 0-100,
    "fragmentation": 0-100
  },
  "overall_score": 0-100,
  "verdict": "go" | "conditional" | "pivot" | "no_go",
  "marketplace_specific_insights": {
    "recommended_launch_market": "string",
    "supply_acquisition_strategy": "string",
    "demand_acquisition_strategy": "string"
  },
  "risks": ["risk1", "risk2"],
  "next_steps": ["step1", "step2", "step3"]
}',
    '{"type": "object", "required": ["overall_score", "verdict"]}',
    'gemini',
    '{"validation", "score", "tasks"}'
  ) on conflict (pack_id, step_order) do update set
    prompt_template = excluded.prompt_template,
    apply_to = excluded.apply_to;
end $$;

-- ============================================================================
-- DEEP VALIDATION PACK
-- ============================================================================

insert into prompt_packs (title, slug, category, description, use_case_tags, auto_trigger_routes, trigger_intents, priority)
values (
  'Deep Validation',
  'validation-deep',
  'validation',
  'Comprehensive 16-section validation report',
  '{"validator", "chat"}',
  '{"/validator/deep"}',
  '{"deep validate", "comprehensive", "full analysis"}',
  5
) on conflict (slug) do update set
  auto_trigger_routes = excluded.auto_trigger_routes,
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'validation-deep';
  if v_pack_id is null then return; end if;

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to, max_tokens)
  values (
    v_pack_id,
    1,
    'deep_analysis',
    'Generate comprehensive 16-section validation report',
    E'Generate a comprehensive validation report for this startup idea:

Idea: {{idea_description}}
Industry: {{industry}}
Target Market: {{target_market}}
Stage: {{stage}}

Analyze across these 16 sections:
1. Executive Summary
2. Problem Analysis
3. Solution Assessment
4. Market Size (TAM/SAM/SOM)
5. Competitive Landscape
6. Business Model
7. Go-to-Market Strategy
8. Team/Founder Fit
9. Financial Projections
10. Risk Assessment
11. Regulatory Considerations
12. Technology Requirements
13. Scalability Analysis
14. Investment Readiness
15. Key Milestones
16. Recommendations

Return ONLY valid JSON with all 16 sections as keys, each containing "analysis" (string) and "score" (0-100).',
    '{"type": "object", "required": ["executive_summary", "problem_analysis", "market_size", "competitive_landscape"]}',
    'gemini',
    '{"validation"}'::text[],
    4000
  ) on conflict (pack_id, step_order) do update set
    prompt_template = excluded.prompt_template,
    max_tokens = excluded.max_tokens;
end $$;

-- ============================================================================
-- CRITIC PACK (Claude-powered)
-- ============================================================================

insert into prompt_packs (title, slug, category, description, use_case_tags, trigger_intents, priority)
values (
  'Investor Critic',
  'validation-critic',
  'validation',
  'Tough investor-style critique identifying risks and red flags',
  '{"validator", "chat"}',
  '{"critic", "critique", "risk", "red flags", "elephant"}',
  8
) on conflict (slug) do update set
  trigger_intents = excluded.trigger_intents;

do $$
declare
  v_pack_id uuid;
begin
  select id into v_pack_id from prompt_packs where slug = 'validation-critic';
  if v_pack_id is null then return; end if;

  insert into prompt_pack_steps (pack_id, step_order, name, purpose, prompt_template, output_schema, model_preference, apply_to)
  values (
    v_pack_id,
    1,
    'investor_critique',
    'Generate tough investor-style critique',
    E'You are a seasoned investor who has seen thousands of pitches. Be direct, honest, and constructively critical.

Analyze this startup:
Idea: {{idea_description}}
Industry: {{industry}}
Target Market: {{target_market}}
Traction: {{traction}}

Identify:
1. The "elephant in the room" - the biggest unaddressed concern
2. Red flags that would make investors pass
3. Questions investors will definitely ask
4. What needs to be true for this to work (key assumptions)
5. Comparable failures and what went wrong

Return ONLY valid JSON:
{
  "elephant_in_room": {
    "issue": "the main unaddressed concern",
    "why_critical": "why this matters",
    "how_to_address": "what to do about it"
  },
  "red_flags": [
    {"flag": "description", "severity": "high|medium|low", "mitigation": "how to fix"}
  ],
  "investor_questions": ["question1", "question2", "question3"],
  "key_assumptions": ["assumption1", "assumption2"],
  "comparable_failures": [
    {"company": "name", "what_went_wrong": "description", "lesson": "what to learn"}
  ],
  "overall_risk_level": "high" | "medium" | "low",
  "recommendation": "string"
}',
    '{"type": "object", "required": ["elephant_in_room", "red_flags", "investor_questions"]}',
    'claude',
    '{"validation"}'
  ) on conflict (pack_id, step_order) do update set
    prompt_template = excluded.prompt_template,
    model_preference = excluded.model_preference;
end $$;

-- ============================================================================
-- PLAYBOOK: Onboarding Journey
-- ============================================================================

insert into playbooks (title, slug, description, category, estimated_time_minutes, is_active, is_featured)
values (
  'Startup Onboarding',
  'onboarding-journey',
  'Complete your startup profile in 4 steps',
  'onboarding',
  15,
  true,
  true
) on conflict (slug) do nothing;

do $$
declare
  v_playbook_id uuid;
  v_pack_id uuid;
begin
  select id into v_playbook_id from playbooks where slug = 'onboarding-journey';
  if v_playbook_id is null then return; end if;

  -- Step 1: Problem
  select id into v_pack_id from prompt_packs where slug = 'ideation-problem-sharpener';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 1, 'Define Your Problem', 'Sharpen your problem statement', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;

  -- Step 2: Market
  select id into v_pack_id from prompt_packs where slug = 'market-competitor-finder';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 2, 'Understand Your Market', 'Identify competitors and market position', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;

  -- Step 3: Team
  select id into v_pack_id from prompt_packs where slug = 'hiring-founder-fit';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 3, 'Founder-Market Fit', 'Evaluate your team fit', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;

  -- Step 4: Pitch
  select id into v_pack_id from prompt_packs where slug = 'pitch-one-sentence';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 4, 'Craft Your Pitch', 'Create your one-sentence pitch', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;
end $$;

-- ============================================================================
-- PLAYBOOK: Validation Journey
-- ============================================================================

insert into playbooks (title, slug, description, category, estimated_time_minutes, is_active, is_featured)
values (
  'Idea Validation',
  'validation-journey',
  'Validate your startup idea with quick score, deep analysis, and investor critique',
  'validation',
  30,
  true,
  true
) on conflict (slug) do nothing;

do $$
declare
  v_playbook_id uuid;
  v_pack_id uuid;
begin
  select id into v_playbook_id from playbooks where slug = 'validation-journey';
  if v_playbook_id is null then return; end if;

  -- Step 1: Quick Validate
  select id into v_pack_id from prompt_packs where slug = 'validation-quick';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 1, 'Quick Validation', 'Get initial score and feedback', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;

  -- Step 2: Deep Validate
  select id into v_pack_id from prompt_packs where slug = 'validation-deep';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 2, 'Deep Analysis', 'Comprehensive 16-section report', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;

  -- Step 3: Critic Review
  select id into v_pack_id from prompt_packs where slug = 'validation-critic';
  insert into playbook_steps (playbook_id, step_order, title, description, pack_id, action_type)
  values (v_playbook_id, 3, 'Investor Critique', 'Identify risks and red flags', v_pack_id, 'pack')
  on conflict (playbook_id, step_order) do update set pack_id = excluded.pack_id;
end $$;

-- ============================================================================
-- END OF SEED
-- ============================================================================
