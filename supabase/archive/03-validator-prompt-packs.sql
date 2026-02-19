-- =============================================================================
-- Seed: Validator Prompt Packs
-- Purpose: Add validator-specific prompt packs for Critic, Blue Ocean, Go/No-Go,
--          and Execution Mode analysis
-- Real-world scenarios: Idea validation, risk assessment, competitive analysis
-- =============================================================================

-- =============================================================================
-- CRITIC AGENT PROMPT PACK
-- Purpose: Challenge assumptions, identify risks, prepare for investor questions
-- =============================================================================

insert into public.prompt_packs (
  id,
  title,
  slug,
  description,
  category,
  stage_tags,
  industry_tags,
  version,
  is_active,
  source,
  metadata,
  created_at,
  updated_at
) values (
  'a0000001-0001-0001-0001-000000000010'::uuid,
  'Critic Agent - Risk Assessment',
  'critic-risk-assessment',
  'Challenge assumptions, identify risks, prepare for investor questions. Acts as a devil advocate to find weaknesses.',
  'validation',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  1,
  true,
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "claude-sonnet", "estimated_time_seconds": 30}'::jsonb,
  '2026-01-29 13:00:00+00'::timestamptz,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  metadata = excluded.metadata,
  updated_at = now();

-- Critic Step 1: Devil's Advocate Review
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000020'::uuid,
  'a0000001-0001-0001-0001-000000000010'::uuid,
  1,
  'Challenge assumptions and identify risks',
  'You are a skeptical investor and startup critic. Your job is to find weaknesses, not validate strengths.

STARTUP: {{startup_name}}
ONE-LINER: {{one_liner}}
INITIAL SCORE: {{score}}/100

SECTION SUMMARIES:
- Problem: {{problem_summary}}
- Market: {{market_summary}}
- Competition: {{competition_summary}}
- Solution: {{solution_summary}}
- Business Model: {{business_summary}}
- Team: {{team_summary}}

Challenge this startup by:

1. ASSUMPTION TESTING
   - List 5 key assumptions this idea relies on
   - Rate each assumption''s validity (proven/unproven/risky)
   - Identify the "elephant in the room" - the biggest unaddressed issue

2. CRITICAL RISKS
   For each category (technical, market, financial, competitive, operational):
   - Identify specific risks
   - Assign severity: Critical (-3) / High (-2) / Medium (-1) / Low (-0.5)

3. COUNTER-ARGUMENTS
   For each major risk, suggest how the founder could address it

4. TOUGH QUESTIONS
   List 5 questions investors WILL ask that could sink this pitch

Be brutally honest but constructive. Your goal is to help founders prepare, not discourage them.',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "one_liner": {"type": "string"}, "score": {"type": "number"}, "problem_summary": {"type": "string"}, "market_summary": {"type": "string"}, "competition_summary": {"type": "string"}, "solution_summary": {"type": "string"}, "business_summary": {"type": "string"}, "team_summary": {"type": "string"}}}'::jsonb,
  '{"type": "object", "required": ["assumptions", "elephant_in_room", "risks", "total_deduction", "adjusted_score", "investor_questions"], "properties": {"assumptions": {"type": "array", "items": {"type": "object", "properties": {"assumption": {"type": "string"}, "validity": {"type": "string", "enum": ["proven", "unproven", "risky"]}, "evidence": {"type": "string"}}}}, "elephant_in_room": {"type": "string"}, "risks": {"type": "array", "items": {"type": "object", "properties": {"category": {"type": "string"}, "description": {"type": "string"}, "severity": {"type": "string"}, "deduction": {"type": "number"}, "mitigation": {"type": "string"}}}}, "total_deduction": {"type": "number"}, "adjusted_score": {"type": "number"}, "investor_questions": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'claude-sonnet',
  3000,
  0.6,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- Critic Step 2: Risk Matrix
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000021'::uuid,
  'a0000001-0001-0001-0001-000000000010'::uuid,
  2,
  'Create comprehensive risk matrix',
  'Based on the critic review:
{{previous_output}}

Create a prioritized risk matrix:

For each risk:
1. Category (technical/market/financial/competitive/operational/team)
2. Description
3. Probability (1-5, where 5 is almost certain)
4. Impact (1-5, where 5 is catastrophic)
5. Risk Score (probability × impact)
6. Mitigation strategy
7. Mitigation effort (low/medium/high)

Sort by risk score (highest first).
Identify the top 3 risks to address immediately.
Calculate overall risk level: Critical (>15 score), High (10-15), Moderate (5-9), Low (<5).',
  '{"type": "object", "properties": {"previous_output": {"type": "object"}}}'::jsonb,
  '{"type": "object", "required": ["risk_matrix", "top_3_risks", "overall_risk_level"], "properties": {"risk_matrix": {"type": "array", "items": {"type": "object", "properties": {"category": {"type": "string"}, "description": {"type": "string"}, "probability": {"type": "integer"}, "impact": {"type": "integer"}, "risk_score": {"type": "integer"}, "mitigation": {"type": "string"}, "effort": {"type": "string"}}}}, "top_3_risks": {"type": "array", "items": {"type": "object", "properties": {"risk": {"type": "string"}, "action": {"type": "string"}, "timeline": {"type": "string"}}}}, "overall_risk_level": {"type": "string", "enum": ["critical", "high", "moderate", "low"]}}}'::jsonb,
  'claude-sonnet',
  2500,
  0.5,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- Critic Step 3: Investor Q&A Prep
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000022'::uuid,
  'a0000001-0001-0001-0001-000000000010'::uuid,
  3,
  'Prepare for investor questions',
  'Generate the 15 toughest investor questions for:

STARTUP: {{startup_name}}
VALIDATION SCORE: {{score}}/100
TOP RISKS: {{top_risks}}

Organize by category:
- Market (4 questions)
- Business Model (4 questions)
- Competition (3 questions)
- Team (2 questions)
- Risk (2 questions)

For each question provide:
- The exact question
- Why investors ask this (what they''re really probing for)
- What a good answer looks like
- Red flags in bad answers

These should be the questions that separate fundable startups from the rest.',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "score": {"type": "number"}, "top_risks": {"type": "array"}}}'::jsonb,
  '{"type": "object", "required": ["questions"], "properties": {"questions": {"type": "array", "items": {"type": "object", "properties": {"category": {"type": "string"}, "question": {"type": "string"}, "why_asked": {"type": "string"}, "good_answer": {"type": "string"}, "red_flags": {"type": "array", "items": {"type": "string"}}}}}}}'::jsonb,
  'claude-sonnet',
  3000,
  0.6,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- =============================================================================
-- BLUE OCEAN ANALYSIS PROMPT PACK
-- Purpose: Assess competitive positioning and market uniqueness
-- =============================================================================

insert into public.prompt_packs (
  id,
  title,
  slug,
  description,
  category,
  stage_tags,
  industry_tags,
  version,
  is_active,
  source,
  metadata,
  created_at,
  updated_at
) values (
  'a0000001-0001-0001-0001-000000000011'::uuid,
  'Blue Ocean Analysis',
  'blue-ocean-analysis',
  'Assess competitive positioning and market uniqueness using Blue Ocean Strategy framework',
  'validation',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace'],
  1,
  true,
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "gemini", "estimated_time_seconds": 20}'::jsonb,
  '2026-01-29 13:00:00+00'::timestamptz,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  metadata = excluded.metadata,
  updated_at = now();

-- Blue Ocean Step 1: Score Calculation
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000030'::uuid,
  'a0000001-0001-0001-0001-000000000011'::uuid,
  1,
  'Calculate Blue Ocean Score',
  'Calculate the Blue Ocean Score for this startup:

STARTUP: {{startup_name}}
ONE-LINER: {{one_liner}}
INDUSTRY: {{industry}}
COMPETITORS FOUND: {{competitor_count}}
COMPETITOR DETAILS: {{competitors}}
CLAIMED DIFFERENTIATION: {{uvp}}

Analyze three factors:

1. MARKET SATURATION (0-10, higher = less saturated)
   Base Scoring:
   - 0-2 competitors = 10
   - 3-5 competitors = 8
   - 6-10 competitors = 6
   - 11-20 competitors = 4
   - 20+ competitors = 2

   Adjustments:
   - Well-funded competitor (>$10M raised) = -1
   - Public company competitor = -2
   - Clear niche carved out = +2

2. INNOVATION LEVEL (0-10)
   - Creating new category = 10
   - New business model in existing category = 8
   - New technology approach = 7
   - Significant feature innovation = 6
   - Incremental improvement = 4
   - Me-too product = 2

3. DIFFERENTIATION CLARITY (0-10)
   - Can explain in 10 words = 10
   - Needs 1-2 sentences = 8
   - Requires detailed explanation = 6
   - Generic positioning ("AI-powered", "easy to use") = 4
   - No clear differentiation = 2

FINAL SCORE = (Saturation × 0.40) + (Innovation × 0.35) + (Differentiation × 0.25)

Interpretation:
- 8.0-10.0: 🌊 Blue Ocean (wide open market)
- 6.0-7.9: 🌀 Open Water (good positioning)
- 4.0-5.9: 🌊⚡ Mixed Waters (competitive but viable)
- 2.0-3.9: 🦈 Crowded Waters (significant competition)
- 0.0-1.9: 🩸 Red Ocean (extremely competitive)',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "one_liner": {"type": "string"}, "industry": {"type": "string"}, "competitor_count": {"type": "integer"}, "competitors": {"type": "array"}, "uvp": {"type": "string"}}}'::jsonb,
  '{"type": "object", "required": ["blue_ocean_score", "saturation", "innovation", "differentiation", "interpretation", "improvement_strategies"], "properties": {"blue_ocean_score": {"type": "number"}, "saturation": {"type": "object", "properties": {"score": {"type": "number"}, "reasoning": {"type": "string"}, "adjustments": {"type": "array"}}}, "innovation": {"type": "object", "properties": {"score": {"type": "number"}, "level": {"type": "string"}, "reasoning": {"type": "string"}}}, "differentiation": {"type": "object", "properties": {"score": {"type": "number"}, "clarity": {"type": "string"}, "reasoning": {"type": "string"}}}, "interpretation": {"type": "string"}, "improvement_strategies": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'gemini',
  2500,
  0.6,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- Blue Ocean Step 2: Strategy Canvas
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000031'::uuid,
  'a0000001-0001-0001-0001-000000000011'::uuid,
  2,
  'Create Strategy Canvas',
  'Create a Strategy Canvas visualization for:

STARTUP: {{startup_name}}
INDUSTRY: {{industry}}
COMPETITORS: {{competitors}}
BLUE OCEAN SCORE: {{blue_ocean_score}}

1. Identify 6-8 key factors that matter in this industry
   (e.g., price, features, ease of use, support, integrations, etc.)

2. Rate each player 1-10 on each factor:
   - Your startup
   - Top 3-5 competitors

3. Identify white space opportunities:
   - Where are all competitors clustered?
   - Where is no one competing?
   - What unmet needs exist?

4. Apply the Four Actions Framework:
   - ELIMINATE: What factors can you completely remove?
   - REDUCE: What should be well below industry standard?
   - RAISE: What should be well above industry standard?
   - CREATE: What new factors can you introduce?

Format the data for easy charting.',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "industry": {"type": "string"}, "competitors": {"type": "array"}, "blue_ocean_score": {"type": "number"}}}'::jsonb,
  '{"type": "object", "required": ["factors", "ratings", "white_space", "four_actions"], "properties": {"factors": {"type": "array", "items": {"type": "string"}}, "ratings": {"type": "object", "additionalProperties": {"type": "object", "additionalProperties": {"type": "number"}}}, "white_space": {"type": "array", "items": {"type": "object", "properties": {"opportunity": {"type": "string"}, "potential": {"type": "string"}}}}, "four_actions": {"type": "object", "properties": {"eliminate": {"type": "array"}, "reduce": {"type": "array"}, "raise": {"type": "array"}, "create": {"type": "array"}}}}}'::jsonb,
  'gemini',
  2500,
  0.7,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- =============================================================================
-- GO/NO-GO RECOMMENDATION PROMPT PACK
-- Purpose: Provide clear verdicts with actionable next steps
-- =============================================================================

insert into public.prompt_packs (
  id,
  title,
  slug,
  description,
  category,
  stage_tags,
  industry_tags,
  version,
  is_active,
  source,
  metadata,
  created_at,
  updated_at
) values (
  'a0000001-0001-0001-0001-000000000012'::uuid,
  'Go/No-Go Recommendation',
  'go-nogo-recommendation',
  'Provide clear verdicts (GO/CONDITIONAL/NEEDS WORK/PIVOT) with actionable next steps and conditions',
  'validation',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  1,
  true,
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "claude-sonnet", "estimated_time_seconds": 25}'::jsonb,
  '2026-01-29 13:00:00+00'::timestamptz,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  metadata = excluded.metadata,
  updated_at = now();

-- Go/No-Go Step 1: Strategic Verdict
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000040'::uuid,
  'a0000001-0001-0001-0001-000000000012'::uuid,
  1,
  'Determine Go/No-Go verdict',
  'Provide a strategic Go/No-Go recommendation:

STARTUP: {{startup_name}}
VALIDATION SCORE: {{score}}/100
BLUE OCEAN SCORE: {{blue_ocean_score}}/10

SCORE BREAKDOWN:
- Problem: {{problem_score}}/100
- Market: {{market_score}}/100
- Competition: {{competition_score}}/100
- Solution: {{solution_score}}/100
- Business Model: {{business_score}}/100
- Execution: {{execution_score}}/100

RISK SUMMARY:
- Critical risks: {{critical_risks}}
- Risk deduction: {{risk_deduction}} points
- Top concerns: {{top_concerns}}

Determine verdict based on final score:
- 🟢 GO (80-100): Strong fundamentals, ready to proceed with confidence
- 🟡 CONDITIONAL (60-79): Promising but needs specific conditions met first
- 🟠 NEEDS WORK (40-59): Significant gaps require addressing before proceeding
- 🔴 PIVOT (0-39): Fundamental issues suggest major strategic changes needed

Provide:
1. Verdict with confidence level (high/medium/low)
2. Top 3 supporting factors for this verdict
3. Single biggest concern regardless of verdict
4. Specific conditions to meet (especially for CONDITIONAL)
5. Recommended next steps (3-5 actions)
6. Re-validation trigger (what should prompt re-assessment)',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "score": {"type": "number"}, "blue_ocean_score": {"type": "number"}, "problem_score": {"type": "number"}, "market_score": {"type": "number"}, "competition_score": {"type": "number"}, "solution_score": {"type": "number"}, "business_score": {"type": "number"}, "execution_score": {"type": "number"}, "critical_risks": {"type": "array"}, "risk_deduction": {"type": "number"}, "top_concerns": {"type": "array"}}}'::jsonb,
  '{"type": "object", "required": ["verdict", "confidence", "key_factors", "biggest_concern", "conditions", "next_steps", "revalidation_trigger"], "properties": {"verdict": {"type": "string", "enum": ["go", "conditional", "needs_work", "pivot"]}, "confidence": {"type": "string", "enum": ["high", "medium", "low"]}, "key_factors": {"type": "object", "properties": {"supporting": {"type": "array", "items": {"type": "string"}}, "against": {"type": "array", "items": {"type": "string"}}}}, "biggest_concern": {"type": "string"}, "conditions": {"type": "array", "items": {"type": "object", "properties": {"condition": {"type": "string"}, "priority": {"type": "string"}, "timeline": {"type": "string"}}}}, "next_steps": {"type": "array", "items": {"type": "object", "properties": {"action": {"type": "string"}, "timeline": {"type": "string"}, "outcome": {"type": "string"}}}}, "revalidation_trigger": {"type": "string"}}}'::jsonb,
  'claude-sonnet',
  2500,
  0.5,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- Go/No-Go Step 2: SMART Condition Generator
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000041'::uuid,
  'a0000001-0001-0001-0001-000000000012'::uuid,
  2,
  'Generate SMART conditions',
  'Generate specific SMART conditions to improve the validation score:

STARTUP: {{startup_name}}
CURRENT SCORE: {{score}}/100
VERDICT: {{verdict}}
WEAK AREAS: {{weak_areas}}

For each weak area (score < 60), create SMART conditions:
- Specific: What exactly needs to happen?
- Measurable: How will we know it''s done?
- Achievable: Is this realistic in the timeframe?
- Relevant: Will this directly improve the score?
- Time-bound: What''s the deadline?

For each condition include:
- Title (action-oriented)
- Current state (what exists now)
- Required outcome (specific target)
- Evidence needed (how to prove completion)
- Timeline (days/weeks)
- Expected point improvement
- Suggested task to create

Generate 3-5 conditions, prioritized by impact on score.
Calculate total potential improvement if all conditions are met.',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "score": {"type": "number"}, "verdict": {"type": "string"}, "weak_areas": {"type": "array"}}}'::jsonb,
  '{"type": "object", "required": ["conditions", "total_potential_improvement", "estimated_score_after"], "properties": {"conditions": {"type": "array", "items": {"type": "object", "properties": {"title": {"type": "string"}, "category": {"type": "string"}, "current_state": {"type": "string"}, "required_outcome": {"type": "string"}, "evidence_needed": {"type": "string"}, "timeline_days": {"type": "integer"}, "expected_improvement": {"type": "number"}, "task_suggestion": {"type": "object", "properties": {"title": {"type": "string"}, "description": {"type": "string"}}}}}}, "total_potential_improvement": {"type": "number"}, "estimated_score_after": {"type": "number"}}}'::jsonb,
  'claude-sonnet',
  2500,
  0.5,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- Go/No-Go Step 3: Pivot Suggestions
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000042'::uuid,
  'a0000001-0001-0001-0001-000000000012'::uuid,
  3,
  'Generate pivot options (for PIVOT verdict)',
  'Generate pivot suggestions for this startup:

STARTUP: {{startup_name}}
ORIGINAL IDEA: {{description}}
SCORE: {{score}}/100 (PIVOT recommended)
CRITICAL ISSUES: {{critical_issues}}
TEAM STRENGTHS: {{team_strengths}}

Generate 3-5 pivot options using these frameworks:
1. Adjacent Market Pivot (same solution, different customer)
2. Customer Problem Pivot (same customer, different problem)
3. Solution Pivot (same problem, different approach)
4. Business Model Pivot (same product, different monetization)
5. Platform Pivot (product to platform)

For each pivot provide:
- Pivot type
- New direction description
- Why it might work better than current approach
- Estimated Blue Ocean potential (1-10)
- New risks introduced
- Validation steps (2-3 quick tests)
- Estimated time to validate

Recommend the most promising pivot with detailed reasoning.',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "description": {"type": "string"}, "score": {"type": "number"}, "critical_issues": {"type": "array"}, "team_strengths": {"type": "array"}}}'::jsonb,
  '{"type": "object", "required": ["pivots", "recommended_pivot", "reasoning"], "properties": {"pivots": {"type": "array", "items": {"type": "object", "properties": {"type": {"type": "string"}, "description": {"type": "string"}, "rationale": {"type": "string"}, "blue_ocean_potential": {"type": "number"}, "new_risks": {"type": "array"}, "validation_steps": {"type": "array"}, "time_to_validate": {"type": "string"}}}}, "recommended_pivot": {"type": "string"}, "reasoning": {"type": "string"}}}'::jsonb,
  'claude-sonnet',
  3000,
  0.7,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- =============================================================================
-- EXECUTION MODE ADVISOR PROMPT PACK
-- Purpose: Customize advice based on execution mode (solo, team, startup, scale)
-- =============================================================================

insert into public.prompt_packs (
  id,
  title,
  slug,
  description,
  category,
  stage_tags,
  industry_tags,
  version,
  is_active,
  source,
  metadata,
  created_at,
  updated_at
) values (
  'a0000001-0001-0001-0001-000000000013'::uuid,
  'Execution Mode Advisor',
  'execution-mode-advisor',
  'Customize validation advice for solopreneur vs small team vs startup vs scale-up',
  'validation',
  array['idea', 'pre-seed', 'seed', 'series-a'],
  array['saas', 'b2b', 'b2c', 'marketplace'],
  1,
  true,
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "gemini", "estimated_time_seconds": 15}'::jsonb,
  '2026-01-29 13:00:00+00'::timestamptz,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  metadata = excluded.metadata,
  updated_at = now();

-- Execution Mode Step 1: Tailored Advice
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000050'::uuid,
  'a0000001-0001-0001-0001-000000000013'::uuid,
  1,
  'Customize advice by execution mode',
  'Provide tailored advice for this startup based on execution mode:

STARTUP: {{startup_name}}
ONE-LINER: {{one_liner}}
EXECUTION MODE: {{execution_mode}}
CURRENT RESOURCES: {{resources}}

Mode definitions:
- Solopreneur (1-2 people): $10M-$500M TAM viable, bootstrap/side project, AI tools crucial
- Small Team (3-10): $100M-$1B TAM, angel/pre-seed funding, niche focus
- Startup (11-50): $500M-$5B TAM, VC-backed, growth focus
- Scale-up (50+): $1B+ TAM, Series B+, market leadership goal

Provide mode-specific advice for:

1. TECH STACK RECOMMENDATIONS
   - Solopreneur: No-code, AI tools, heavy automation
   - Small Team: Modern stack with some custom code
   - Startup: Scalable architecture from start
   - Scale-up: Enterprise-grade, microservices

2. GO-TO-MARKET STRATEGY
   - Solopreneur: Content marketing, communities, personal brand
   - Small Team: Niche partnerships, early customer acquisition
   - Startup: Multiple channels, paid acquisition
   - Scale-up: International expansion, enterprise sales

3. REVENUE EXPECTATIONS
   - Solopreneur: Quick to revenue, profitability focused
   - Small Team: SaaS metrics, clear unit economics
   - Startup: Growth over profit, land and expand
   - Scale-up: Hyper-growth, path to profitability

4. HIRING ADVICE
   - Solopreneur: Contractors, AI assistants, automation
   - Small Team: Key hires, equity-heavy compensation
   - Startup: Aggressive hiring, culture building
   - Scale-up: Exec team, global talent

5. FUNDING PATH
   - Solopreneur: Bootstrap, small angels, revenue-based
   - Small Team: Angels, pre-seed
   - Startup: Seed, Series A
   - Scale-up: Series B+, growth equity

6. KEY METRICS TO TRACK (3-5 mode-specific metrics)

7. WARNING SIGNS (things that work in other modes but not this one)',
  '{"type": "object", "properties": {"startup_name": {"type": "string"}, "one_liner": {"type": "string"}, "execution_mode": {"type": "string", "enum": ["solopreneur", "small_team", "startup", "scale_up"]}, "resources": {"type": "object"}}}'::jsonb,
  '{"type": "object", "required": ["mode", "tech_advice", "gtm_advice", "revenue_advice", "hiring_advice", "funding_advice", "key_metrics", "warnings"], "properties": {"mode": {"type": "string"}, "tech_advice": {"type": "object", "properties": {"recommended_stack": {"type": "array"}, "tools": {"type": "array"}, "rationale": {"type": "string"}}}, "gtm_advice": {"type": "object", "properties": {"channels": {"type": "array"}, "budget_range": {"type": "string"}, "timeline": {"type": "string"}}}, "revenue_advice": {"type": "object", "properties": {"target_mrr_6mo": {"type": "string"}, "pricing_strategy": {"type": "string"}, "profitability_timeline": {"type": "string"}}}, "hiring_advice": {"type": "object", "properties": {"first_hires": {"type": "array"}, "compensation_mix": {"type": "string"}}}, "funding_advice": {"type": "object", "properties": {"recommended_path": {"type": "string"}, "target_raise": {"type": "string"}, "valuation_range": {"type": "string"}}}, "key_metrics": {"type": "array", "items": {"type": "object", "properties": {"metric": {"type": "string"}, "target": {"type": "string"}, "why_important": {"type": "string"}}}}, "warnings": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'gemini',
  3000,
  0.6,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- =============================================================================
-- QUICK VALIDATOR PROMPT PACK (60-second validation)
-- Purpose: Fast initial validation with 6-dimension scoring
-- =============================================================================

insert into public.prompt_packs (
  id,
  title,
  slug,
  description,
  category,
  stage_tags,
  industry_tags,
  version,
  is_active,
  source,
  metadata,
  created_at,
  updated_at
) values (
  'a0000001-0001-0001-0001-000000000014'::uuid,
  'Quick Validator - 60 Second Assessment',
  'quick-validator',
  'Fast initial validation with 6-dimension scoring targeting < 10 second response',
  'validation',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech', 'edtech', 'climatetech'],
  1,
  true,
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "gemini", "estimated_time_seconds": 10}'::jsonb,
  '2026-01-29 13:00:00+00'::timestamptz,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  metadata = excluded.metadata,
  updated_at = now();

-- Quick Validator Step 1: 6-Dimension Score
insert into public.prompt_pack_steps (
  id,
  pack_id,
  step_order,
  purpose,
  prompt_template,
  input_schema,
  output_schema,
  model_preference,
  max_tokens,
  temperature,
  created_at
) values (
  'b0000001-0001-0001-0001-000000000060'::uuid,
  'a0000001-0001-0001-0001-000000000014'::uuid,
  1,
  'Quick 6-dimension validation scoring',
  'Provide a quick validation assessment for this startup idea:

IDEA: {{idea_description}}
INDUSTRY: {{industry}}
TARGET MARKET: {{target_market}}
EXECUTION MODE: {{execution_mode}}

Score each dimension 0-100:

1. PROBLEM (20% weight)
   - Is the problem real and significant?
   - How painful is it for customers?
   - Is the timing right?

2. MARKET (20% weight)
   - Is the market large enough?
   - Is it growing?
   - Can you reach customers?

3. COMPETITION (15% weight)
   - Who else solves this?
   - What''s different about this approach?
   - Are there barriers to entry?

4. SOLUTION (20% weight)
   - Does the solution actually solve the problem?
   - Is it technically feasible?
   - Is it defensible?

5. BUSINESS MODEL (15% weight)
   - Is the monetization clear?
   - Can it scale profitably?
   - Are unit economics viable?

6. EXECUTION (10% weight)
   - Can the team execute?
   - What resources are needed?
   - Is the timeline realistic?

Calculate:
- Base Score = weighted average
- Quick verdict based on score
- Top 3 strengths
- Top 3 risks
- 3 immediate next steps

Be fast but accurate. This is a first-pass assessment.',
  '{"type": "object", "required": ["idea_description"], "properties": {"idea_description": {"type": "string"}, "industry": {"type": "string"}, "target_market": {"type": "string"}, "execution_mode": {"type": "string"}}}'::jsonb,
  '{"type": "object", "required": ["overall_score", "scores", "verdict", "strengths", "risks", "next_steps"], "properties": {"overall_score": {"type": "number"}, "scores": {"type": "object", "properties": {"problem": {"type": "number"}, "market": {"type": "number"}, "competition": {"type": "number"}, "solution": {"type": "number"}, "business": {"type": "number"}, "execution": {"type": "number"}}}, "verdict": {"type": "string", "enum": ["go", "conditional", "needs_work", "pivot"]}, "strengths": {"type": "array", "items": {"type": "string"}, "maxItems": 3}, "risks": {"type": "array", "items": {"type": "string"}, "maxItems": 3}, "next_steps": {"type": "array", "items": {"type": "string"}, "maxItems": 3}}}'::jsonb,
  'gemini',
  1500,
  0.5,
  '2026-01-29 13:00:00+00'::timestamptz
)
on conflict on constraint prompt_pack_steps_unique_order do update set
  purpose = excluded.purpose,
  prompt_template = excluded.prompt_template,
  output_schema = excluded.output_schema;

-- =============================================================================
-- END OF SEED: Validator Prompt Packs
-- =============================================================================
