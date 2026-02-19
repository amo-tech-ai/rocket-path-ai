-- ============================================================================
-- Seed: Prompt Packs
-- Description: Populate prompt_packs and prompt_pack_steps tables with
--              starter packs for validation, pitch, canvas, GTM, pricing,
--              market analysis, and ideation
-- Author: StartupAI
-- Created: 2026-01-29
-- Updated: 2026-01-29 - Schema aligned with migration
--                       20260129180000_industry_playbooks_prompt_packs_complete.sql
--
-- Total: 14 packs, 42+ steps
-- Categories: validation (4), pitch (2), canvas (2), gtm (1), pricing (1),
--             market (2), ideation (2)
--
-- SCHEMA NOTES:
-- - prompt_packs.id is TEXT (can use UUID format as text)
-- - prompt_pack_steps.id is UUID (auto-generated if not provided)
-- - Both tables have ON CONFLICT handling for safe re-runs
-- ============================================================================

-- First, ensure we have conflict handling
-- If you need to update existing packs, use ON CONFLICT DO UPDATE

-- ============================================================================
-- VALIDATION CATEGORY
-- ============================================================================

-- Pack 1: Problem Validation Framework
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000001',
  'Problem Validation Framework',
  'problem-validation',
  'Validate your startup problem with structured customer discovery',
  'validation',
  array['idea', 'pre-seed'],
  array['saas', 'b2b', 'b2c', 'marketplace'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
-- Step 1: Problem Snapshot
(
  'b0000001-0001-0001-0001-000000000001',
  'a0000001-0001-0001-0001-000000000001',
  1,
  'Create a clear problem snapshot',
  'You are helping a startup founder validate their problem.

Startup: {{startup_name}}
Industry: {{industry}}
Initial Problem Statement: {{problem_statement}}

Create a Problem Snapshot with:
1. WHO has this problem (be specific about the persona)
2. WHAT is the core pain point
3. WHY does this problem exist today
4. HOW are people currently solving it (workarounds)
5. WHEN does this problem occur most acutely

Format as a structured analysis with clear sections.',
  '{"type": "object", "properties": {"who": {"type": "string"}, "what": {"type": "string"}, "why": {"type": "string"}, "how": {"type": "string"}, "when": {"type": "string"}, "summary": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
-- Step 2: Customer Discovery Questions
(
  'b0000001-0001-0001-0001-000000000002',
  'a0000001-0001-0001-0001-000000000001',
  2,
  'Generate customer discovery interview questions',
  'Based on the problem snapshot:
{{previous_output}}

Generate 10 customer discovery interview questions that:
- Are open-ended (no yes/no questions)
- Focus on past behavior, not future predictions
- Uncover the frequency and severity of the problem
- Reveal current solutions and workarounds
- Identify willingness to pay

Group questions by theme.',
  '{"type": "object", "properties": {"questions": {"type": "array", "items": {"type": "object", "properties": {"theme": {"type": "string"}, "question": {"type": "string"}, "purpose": {"type": "string"}}}}}}'::jsonb,
  'gemini',
  0.6
),
-- Step 3: Validation Scorecard
(
  'b0000001-0001-0001-0001-000000000003',
  'a0000001-0001-0001-0001-000000000001',
  3,
  'Create problem validation scorecard',
  'Create a Problem Validation Scorecard for:

Startup: {{startup_name}}
Problem Snapshot: {{step_1_output}}

Rate these dimensions (1-10):
1. Problem Frequency - How often does this occur?
2. Problem Severity - How painful is it?
3. Market Size - How many people have this problem?
4. Willingness to Pay - Will people pay to solve it?
5. Current Solutions - How poor are existing alternatives?

Calculate overall validation score and provide recommendation.',
  '{"type": "object", "properties": {"scores": {"type": "object", "properties": {"frequency": {"type": "number"}, "severity": {"type": "number"}, "market_size": {"type": "number"}, "willingness_to_pay": {"type": "number"}, "current_solutions": {"type": "number"}}}, "overall_score": {"type": "number"}, "recommendation": {"type": "string"}, "next_steps": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'gemini',
  0.5
);

-- Pack 2: Idea Validation Sprint
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000002',
  'Idea Validation Sprint',
  'idea-validation',
  'Validate your startup idea in 5 structured steps',
  'validation',
  array['idea'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000004',
  'a0000001-0001-0001-0001-000000000002',
  1,
  'Identify the elephant in the room',
  'You are a startup advisor helping identify critical assumptions.

Startup: {{startup_name}}
One-liner: {{one_liner}}
Target Market: {{target_market}}

Identify the "Elephant in the Room" - the single biggest assumption that, if wrong, would kill this startup.

Consider:
- Market assumptions (do people want this?)
- Technical assumptions (can we build it?)
- Business model assumptions (will people pay?)
- Distribution assumptions (can we reach customers?)

Be brutally honest. Name the elephant clearly.',
  '{"type": "object", "properties": {"elephant": {"type": "string"}, "category": {"type": "string"}, "why_critical": {"type": "string"}, "evidence_needed": {"type": "string"}, "test_method": {"type": "string"}}}'::jsonb,
  'claude',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000005',
  'a0000001-0001-0001-0001-000000000002',
  2,
  'Design validation experiment',
  'Design a lean validation experiment to test:

Elephant: {{step_1_output.elephant}}
Evidence Needed: {{step_1_output.evidence_needed}}

Create a validation experiment that:
- Can be run in under 2 weeks
- Costs less than $500
- Provides clear pass/fail criteria
- Uses real customer behavior (not surveys)

Include specific metrics and thresholds.',
  '{"type": "object", "properties": {"experiment_name": {"type": "string"}, "hypothesis": {"type": "string"}, "method": {"type": "string"}, "timeline": {"type": "string"}, "budget": {"type": "string"}, "success_criteria": {"type": "object", "properties": {"metric": {"type": "string"}, "threshold": {"type": "string"}}}, "next_steps_if_pass": {"type": "string"}, "next_steps_if_fail": {"type": "string"}}}'::jsonb,
  'gemini',
  0.6
);

-- Pack 3: Critic Agent - Risk Assessment
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000010',
  'Critic Agent - Risk Assessment',
  'critic-risk-assessment',
  'Challenge assumptions, identify risks, prepare for investor questions',
  'validation',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "claude-sonnet"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
-- Step 1: Devil''s Advocate Review
(
  'b0000001-0001-0001-0001-000000000020',
  'a0000001-0001-0001-0001-000000000010',
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
   - List 5 assumptions this idea relies on
   - Rate each assumption''s validity (proven/unproven/risky)
   - Identify the "elephant in the room"

2. CRITICAL RISKS
   For each category (technical, market, financial, competitive, operational):
   - Identify specific risks
   - Assign severity: Critical (-3) / High (-2) / Medium (-1) / Low (-0.5)

3. COUNTER-ARGUMENTS
   For each risk, suggest how the founder could address it

4. TOUGH QUESTIONS
   List 5 questions investors WILL ask

Be brutally honest but constructive.',
  '{"type": "object", "properties": {"assumptions": {"type": "array"}, "elephant_in_room": {"type": "string"}, "risks": {"type": "array"}, "total_deduction": {"type": "number"}, "adjusted_score": {"type": "number"}, "investor_questions": {"type": "array"}}}'::jsonb,
  'claude-sonnet',
  0.6
),
-- Step 2: Risk Matrix
(
  'b0000001-0001-0001-0001-000000000021',
  'a0000001-0001-0001-0001-000000000010',
  2,
  'Create comprehensive risk matrix',
  'Based on the critic review:
{{previous_output}}

Create a prioritized risk matrix:

For each risk:
1. Category (technical/market/financial/competitive/operational/team)
2. Description
3. Probability (1-5)
4. Impact (1-5)
5. Risk Score (probability × impact)
6. Mitigation strategy
7. Mitigation effort (low/medium/high)

Sort by risk score (highest first).
Identify top 3 risks to address immediately.',
  '{"type": "object", "properties": {"risk_matrix": {"type": "array"}, "top_3_risks": {"type": "array"}, "overall_risk_level": {"type": "string"}}}'::jsonb,
  'claude-sonnet',
  0.5
),
-- Step 3: Investor Q&A Prep
(
  'b0000001-0001-0001-0001-000000000022',
  'a0000001-0001-0001-0001-000000000010',
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

For each question:
- The question
- Why investors ask this
- What a good answer looks like
- Red flags in bad answers',
  '{"type": "object", "properties": {"questions": {"type": "array"}}}'::jsonb,
  'claude-sonnet',
  0.6
);

-- Pack 4: Go/No-Go Recommendation
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000012',
  'Go/No-Go Recommendation',
  'go-nogo-recommendation',
  'Provide clear verdicts with actionable next steps',
  'validation',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "claude-sonnet"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
-- Step 1: Strategic Verdict
(
  'b0000001-0001-0001-0001-000000000040',
  'a0000001-0001-0001-0001-000000000012',
  1,
  'Determine Go/No-Go verdict',
  'Provide a strategic Go/No-Go recommendation:

STARTUP: {{startup_name}}
VALIDATION SCORE: {{score}}/100
BLUE OCEAN SCORE: {{blue_ocean}}/10

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

Determine verdict:
- 🟢 GO (80-100): Ready to proceed
- 🟡 CONDITIONAL (60-79): Address conditions first
- 🟠 NEEDS WORK (40-59): Significant improvements needed
- 🔴 PIVOT (0-39): Consider major changes

Provide:
1. Verdict + confidence level
2. Top 3 supporting factors
3. Biggest concern
4. Specific conditions to meet (for CONDITIONAL)
5. Recommended next steps
6. Re-validation trigger',
  '{"type": "object", "properties": {"verdict": {"type": "string"}, "confidence": {"type": "string"}, "key_factors": {"type": "object"}, "conditions": {"type": "array"}, "next_steps": {"type": "array"}, "revalidation": {"type": "object"}}}'::jsonb,
  'claude-sonnet',
  0.5
),
-- Step 2: Condition Generator
(
  'b0000001-0001-0001-0001-000000000041',
  'a0000001-0001-0001-0001-000000000012',
  2,
  'Generate SMART conditions',
  'Generate specific conditions to improve validation score:

STARTUP: {{startup_name}}
CURRENT SCORE: {{score}}/100
VERDICT: {{verdict}}
WEAK AREAS: {{weak_areas}}

For each weak area, create SMART conditions:
- Specific: What exactly needs to happen?
- Measurable: How will we know it''s done?
- Achievable: Is this realistic?
- Relevant: Will this improve the score?
- Time-bound: What''s the deadline?

Include:
- Condition title
- Current state
- Required outcome
- Evidence needed
- Timeline
- Expected point improvement
- Task to create

Generate 3-5 conditions, prioritized by impact.',
  '{"type": "object", "properties": {"conditions": {"type": "array"}, "total_potential_improvement": {"type": "number"}, "estimated_score_after": {"type": "number"}}}'::jsonb,
  'claude-sonnet',
  0.5
),
-- Step 3: Pivot Suggestions (for PIVOT verdict)
(
  'b0000001-0001-0001-0001-000000000042',
  'a0000001-0001-0001-0001-000000000012',
  3,
  'Generate pivot options',
  'Generate pivot suggestions for this startup:

STARTUP: {{startup_name}}
ORIGINAL IDEA: {{description}}
SCORE: {{score}}/100 (PIVOT recommended)
CRITICAL ISSUES: {{critical_issues}}

Generate 3-5 pivot options:
1. Adjacent Market Pivot (same solution, different customer)
2. Customer Problem Pivot (same customer, different problem)
3. Solution Pivot (same problem, different approach)
4. Business Model Pivot (same product, different monetization)
5. Platform Pivot (product to platform)

For each:
- Describe the new direction
- Why it might work better
- Estimated Blue Ocean potential
- New risks
- Validation steps

Recommend the most promising pivot.',
  '{"type": "object", "properties": {"pivots": {"type": "array"}, "recommended_pivot": {"type": "string"}, "reasoning": {"type": "string"}}}'::jsonb,
  'claude-sonnet',
  0.7
);

-- ============================================================================
-- PITCH CATEGORY
-- ============================================================================

-- Pack 5: One-Liner Generator
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000003',
  'Perfect One-Liner Generator',
  'one-liner-generator',
  'Create a compelling one-sentence pitch that hooks investors',
  'pitch',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000006',
  'a0000001-0001-0001-0001-000000000003',
  1,
  'Extract core value proposition',
  'Analyze this startup to extract the core value proposition:

Startup Name: {{startup_name}}
Description: {{description}}
Problem: {{problem_statement}}
Solution: {{solution}}
Target Customer: {{target_customer}}

Extract:
1. The TRANSFORMATION (before → after)
2. The UNIQUE MECHANISM (how you deliver it)
3. The TARGET (who specifically benefits)
4. The OUTCOME (measurable result)',
  '{"type": "object", "properties": {"transformation": {"type": "object", "properties": {"before": {"type": "string"}, "after": {"type": "string"}}}, "mechanism": {"type": "string"}, "target": {"type": "string"}, "outcome": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000007',
  'a0000001-0001-0001-0001-000000000003',
  2,
  'Generate one-liner variations',
  'Using this value proposition analysis:
{{previous_output}}

Generate 5 one-liner variations using these formulas:

1. "We help [TARGET] [TRANSFORMATION] by [MECHANISM]"
2. "[TARGET]''s [OUTCOME] platform"
3. "The [ANALOGY] for [TARGET]"
4. "[MECHANISM] that [TRANSFORMATION]"
5. "From [BEFORE] to [AFTER] in [TIMEFRAME]"

Make each unique, memorable, and under 15 words.',
  '{"type": "object", "properties": {"one_liners": {"type": "array", "items": {"type": "object", "properties": {"formula": {"type": "string"}, "one_liner": {"type": "string"}, "word_count": {"type": "number"}}}}}}'::jsonb,
  'gemini',
  0.8
),
(
  'b0000001-0001-0001-0001-000000000008',
  'a0000001-0001-0001-0001-000000000003',
  3,
  'Select and refine best one-liner',
  'Review these one-liner options:
{{previous_output}}

Score each on:
- Clarity (1-10): Is it instantly understandable?
- Memorability (1-10): Will it stick in someone''s mind?
- Differentiation (1-10): Does it stand out from competitors?
- Accuracy (1-10): Does it truly represent the business?

Select the best one and refine it further. Provide the final polished version.',
  '{"type": "object", "properties": {"scores": {"type": "array", "items": {"type": "object", "properties": {"one_liner": {"type": "string"}, "clarity": {"type": "number"}, "memorability": {"type": "number"}, "differentiation": {"type": "number"}, "accuracy": {"type": "number"}, "total": {"type": "number"}}}}, "winner": {"type": "string"}, "refined_version": {"type": "string"}, "usage_tips": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'claude',
  0.6
);

-- Pack 6: Investor Pitch Builder
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000004',
  'Investor Pitch Builder',
  'investor-pitch-builder',
  'Build a compelling investor pitch deck narrative',
  'pitch',
  array['pre-seed', 'seed', 'series-a'],
  array['saas', 'b2b', 'fintech', 'healthtech', 'ai'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000009',
  'a0000001-0001-0001-0001-000000000004',
  1,
  'Generate problem slide content',
  'Create compelling Problem slide content for:

Startup: {{startup_name}}
Industry: {{industry}}
Target Customer: {{target_customer}}
Problem Statement: {{problem_statement}}

Generate:
1. A hook statistic or story that illustrates the problem
2. 3 bullet points describing the problem dimensions
3. The emotional impact on the target customer
4. Why NOW is the right time to solve this',
  '{"type": "object", "properties": {"hook": {"type": "string"}, "bullet_points": {"type": "array", "items": {"type": "string"}}, "emotional_impact": {"type": "string"}, "why_now": {"type": "string"}, "speaker_notes": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000070',
  'a0000001-0001-0001-0001-000000000004',
  2,
  'Generate solution slide content',
  'Create compelling Solution slide content:

Problem Context: {{step_1_output}}
Solution: {{solution}}
Key Features: {{features}}

Generate:
1. One-sentence solution statement
2. 3 key benefits (not features)
3. Visual/demo description suggestion
4. Proof point or early validation',
  '{"type": "object", "properties": {"solution_statement": {"type": "string"}, "key_benefits": {"type": "array", "items": {"type": "string"}}, "visual_suggestion": {"type": "string"}, "proof_point": {"type": "string"}, "speaker_notes": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000011',
  'a0000001-0001-0001-0001-000000000004',
  3,
  'Generate market size slide',
  'Create Market Size slide content:

Industry: {{industry}}
Target Customer: {{target_customer}}
Geography: {{geography}}

Calculate and present:
1. TAM (Total Addressable Market)
2. SAM (Serviceable Addressable Market)
3. SOM (Serviceable Obtainable Market)

Use bottom-up methodology. Show your math.',
  '{"type": "object", "properties": {"tam": {"type": "object", "properties": {"value": {"type": "string"}, "calculation": {"type": "string"}}}, "sam": {"type": "object", "properties": {"value": {"type": "string"}, "calculation": {"type": "string"}}}, "som": {"type": "object", "properties": {"value": {"type": "string"}, "calculation": {"type": "string"}}}, "growth_rate": {"type": "string"}, "speaker_notes": {"type": "string"}}}'::jsonb,
  'gemini',
  0.5
);

-- ============================================================================
-- CANVAS CATEGORY
-- ============================================================================

-- Pack 7: Lean Canvas Generator
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000005',
  'AI Lean Canvas Generator',
  'lean-canvas-generator',
  'Generate a complete Lean Canvas from your startup description',
  'canvas',
  array['idea', 'pre-seed'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000012',
  'a0000001-0001-0001-0001-000000000005',
  1,
  'Extract startup context',
  'Analyze this startup to extract key information:

Startup Name: {{startup_name}}
Description: {{description}}
Website: {{website_url}}
Additional Context: {{additional_context}}

Extract and structure:
1. Core offering
2. Target customers
3. Main problem being solved
4. Unique approach
5. Industry/vertical',
  '{"type": "object", "properties": {"core_offering": {"type": "string"}, "target_customers": {"type": "array", "items": {"type": "string"}}, "main_problem": {"type": "string"}, "unique_approach": {"type": "string"}, "industry": {"type": "string"}}}'::jsonb,
  'gemini',
  0.6
),
(
  'b0000001-0001-0001-0001-000000000013',
  'a0000001-0001-0001-0001-000000000005',
  2,
  'Generate Lean Canvas',
  'Generate a complete Lean Canvas for:

Context: {{previous_output}}
Startup: {{startup_name}}

Fill out all 9 sections:
1. Problem (top 3 problems)
2. Customer Segments (target customers)
3. Unique Value Proposition (single clear message)
4. Solution (top 3 features)
5. Channels (path to customers)
6. Revenue Streams (how you make money)
7. Cost Structure (main costs)
8. Key Metrics (numbers that matter)
9. Unfair Advantage (what can''t be copied)

Be specific and actionable.',
  '{"type": "object", "properties": {"problem": {"type": "array", "items": {"type": "string"}}, "customer_segments": {"type": "array", "items": {"type": "string"}}, "unique_value_proposition": {"type": "string"}, "solution": {"type": "array", "items": {"type": "string"}}, "channels": {"type": "array", "items": {"type": "string"}}, "revenue_streams": {"type": "array", "items": {"type": "string"}}, "cost_structure": {"type": "array", "items": {"type": "string"}}, "key_metrics": {"type": "array", "items": {"type": "string"}}, "unfair_advantage": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000014',
  'a0000001-0001-0001-0001-000000000005',
  3,
  'Validate and improve canvas',
  'Review and improve this Lean Canvas:

{{previous_output}}

For each section:
1. Rate quality (1-10)
2. Identify weaknesses
3. Suggest improvements
4. Flag assumptions to test

Provide an overall canvas score and top 3 priorities.',
  '{"type": "object", "properties": {"section_reviews": {"type": "array", "items": {"type": "object", "properties": {"section": {"type": "string"}, "score": {"type": "number"}, "weakness": {"type": "string"}, "improvement": {"type": "string"}, "assumption": {"type": "string"}}}}, "overall_score": {"type": "number"}, "top_priorities": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'claude',
  0.6
);

-- Pack 8: Customer Archetype Builder
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000006',
  'Customer Archetype Builder',
  'customer-archetype',
  'Build detailed customer personas with jobs-to-be-done',
  'canvas',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000015',
  'a0000001-0001-0001-0001-000000000006',
  1,
  'Identify customer segments',
  'Identify distinct customer segments for:

Startup: {{startup_name}}
Solution: {{solution}}
Target Market: {{target_market}}

For each segment, provide:
- Segment name
- Size estimate
- Primary motivation
- Willingness to pay',
  '{"type": "object", "properties": {"segments": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "size": {"type": "string"}, "motivation": {"type": "string"}, "willingness_to_pay": {"type": "string"}}}}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000016',
  'a0000001-0001-0001-0001-000000000006',
  2,
  'Build detailed archetype',
  'Build a detailed customer archetype for the top segment:

Segment: {{step_1_output.segments[0]}}

Create a vivid persona including:
1. Name and demographics
2. Day in the life
3. Goals and aspirations
4. Frustrations and pain points
5. Current solutions they use
6. How they discover new products
7. Decision-making process
8. Objections they might have',
  '{"type": "object", "properties": {"name": {"type": "string"}, "demographics": {"type": "object"}, "day_in_life": {"type": "string"}, "goals": {"type": "array", "items": {"type": "string"}}, "frustrations": {"type": "array", "items": {"type": "string"}}, "current_solutions": {"type": "array", "items": {"type": "string"}}, "discovery_channels": {"type": "array", "items": {"type": "string"}}, "decision_process": {"type": "string"}, "objections": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'gemini',
  0.8
),
(
  'b0000001-0001-0001-0001-000000000017',
  'a0000001-0001-0001-0001-000000000006',
  3,
  'Map jobs-to-be-done',
  'Map Jobs-to-be-Done for:

Archetype: {{previous_output}}

Identify:
1. Functional jobs (tasks they need to complete)
2. Emotional jobs (how they want to feel)
3. Social jobs (how they want to be perceived)

For each job, rate:
- Importance (1-10)
- Satisfaction with current solutions (1-10)
- Opportunity score = Importance + (Importance - Satisfaction)',
  '{"type": "object", "properties": {"functional_jobs": {"type": "array", "items": {"type": "object", "properties": {"job": {"type": "string"}, "importance": {"type": "number"}, "satisfaction": {"type": "number"}, "opportunity": {"type": "number"}}}}, "emotional_jobs": {"type": "array", "items": {"type": "object", "properties": {"job": {"type": "string"}, "importance": {"type": "number"}, "satisfaction": {"type": "number"}, "opportunity": {"type": "number"}}}}, "social_jobs": {"type": "array", "items": {"type": "object", "properties": {"job": {"type": "string"}, "importance": {"type": "number"}, "satisfaction": {"type": "number"}, "opportunity": {"type": "number"}}}}, "top_opportunities": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'gemini',
  0.6
);

-- ============================================================================
-- GTM CATEGORY
-- ============================================================================

-- Pack 9: Go-to-Market Strategy
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000007',
  'Go-to-Market Strategy Builder',
  'gtm-strategy',
  'Build a comprehensive go-to-market strategy',
  'gtm',
  array['pre-seed', 'seed'],
  array['saas', 'b2b'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000018',
  'a0000001-0001-0001-0001-000000000007',
  1,
  'Analyze market entry',
  'Analyze market entry options for:

Startup: {{startup_name}}
Product: {{product_description}}
Target Market: {{target_market}}
Budget: {{marketing_budget}}

Evaluate these GTM motions:
1. Product-Led Growth (PLG)
2. Sales-Led Growth (SLG)
3. Community-Led Growth (CLG)
4. Partnership-Led Growth

Score each on fit (1-10) with rationale.',
  '{"type": "object", "properties": {"motions": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "fit_score": {"type": "number"}, "rationale": {"type": "string"}, "pros": {"type": "array", "items": {"type": "string"}}, "cons": {"type": "array", "items": {"type": "string"}}}}}, "recommended": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000019',
  'a0000001-0001-0001-0001-000000000007',
  2,
  'Build channel strategy',
  'Build a channel strategy for:

Recommended Motion: {{step_1_output.recommended}}
Target Customer: {{target_customer}}
Budget: {{marketing_budget}}

For each channel, provide:
1. Channel name
2. Why it fits your customer
3. Expected CAC range
4. Time to first results
5. Scalability (1-10)

Prioritize top 3 channels to focus on first.',
  '{"type": "object", "properties": {"channels": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "fit_reason": {"type": "string"}, "cac_range": {"type": "string"}, "time_to_results": {"type": "string"}, "scalability": {"type": "number"}}}}, "priority_channels": {"type": "array", "items": {"type": "string"}}, "90_day_plan": {"type": "string"}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000080',
  'a0000001-0001-0001-0001-000000000007',
  3,
  'Create launch checklist',
  'Create a GTM launch checklist:

Motion: {{step_1_output.recommended}}
Priority Channels: {{step_2_output.priority_channels}}

Create a 90-day launch plan with:
- Week 1-2: Foundation tasks
- Week 3-4: Channel setup
- Week 5-8: Initial experiments
- Week 9-12: Scale what works

Include specific tasks, owners, and success metrics.',
  '{"type": "object", "properties": {"foundation": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}, "channel_setup": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}, "experiments": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}, "scaling": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}}}'::jsonb,
  'gemini',
  0.6
);

-- ============================================================================
-- PRICING CATEGORY
-- ============================================================================

-- Pack 10: SaaS Pricing Strategy
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000008',
  'SaaS Pricing Strategy',
  'pricing-strategy',
  'Design an optimal pricing strategy for your SaaS',
  'pricing',
  array['pre-seed', 'seed', 'series-a'],
  array['saas', 'b2b'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000021b',
  'a0000001-0001-0001-0001-000000000008',
  1,
  'Analyze value metrics',
  'Identify the optimal value metric for:

Product: {{product_description}}
Target Customer: {{target_customer}}
Key Features: {{features}}

A value metric should:
1. Align with customer value received
2. Scale with customer success
3. Be easy to understand
4. Be hard to game

Evaluate these options:
- Per user/seat
- Per usage (API calls, storage, etc.)
- Per feature tier
- Per outcome (revenue generated, etc.)

Recommend the best value metric with rationale.',
  '{"type": "object", "properties": {"value_metrics": {"type": "array", "items": {"type": "object", "properties": {"metric": {"type": "string"}, "alignment_score": {"type": "number"}, "scalability_score": {"type": "number"}, "simplicity_score": {"type": "number"}, "total_score": {"type": "number"}}}}, "recommended": {"type": "string"}, "rationale": {"type": "string"}}}'::jsonb,
  'gemini',
  0.6
),
(
  'b0000001-0001-0001-0001-000000000022b',
  'a0000001-0001-0001-0001-000000000008',
  2,
  'Design pricing tiers',
  'Design pricing tiers using:

Value Metric: {{step_1_output.recommended}}
Target Customer: {{target_customer}}
Competitor Pricing: {{competitor_pricing}}

Create 3-4 tiers:
1. Free/Starter (land)
2. Pro (expand)
3. Business/Team (scale)
4. Enterprise (maximize)

For each tier specify:
- Name
- Price point
- Value metric limits
- Key features included
- Target persona',
  '{"type": "object", "properties": {"tiers": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "price": {"type": "string"}, "billing": {"type": "string"}, "value_metric_limit": {"type": "string"}, "features": {"type": "array", "items": {"type": "string"}}, "target_persona": {"type": "string"}}}}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000023b',
  'a0000001-0001-0001-0001-000000000008',
  3,
  'Project revenue model',
  'Project revenue for these tiers:

Tiers: {{step_2_output}}
Market Size: {{market_size}}
Expected Conversion: {{expected_conversion}}

Model 3 scenarios:
1. Conservative (bottom 25%)
2. Base (median)
3. Optimistic (top 25%)

For each, project:
- Month 6 MRR
- Month 12 MRR
- Customer mix by tier
- Key assumptions',
  '{"type": "object", "properties": {"scenarios": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "month_6_mrr": {"type": "string"}, "month_12_mrr": {"type": "string"}, "customer_mix": {"type": "object"}, "assumptions": {"type": "array", "items": {"type": "string"}}}}}, "recommendation": {"type": "string"}}}'::jsonb,
  'gemini',
  0.5
);

-- ============================================================================
-- MARKET CATEGORY
-- ============================================================================

-- Pack 11: Competitor Deep Dive
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000009',
  'Competitor Deep Dive',
  'competitor-analysis',
  'Comprehensive competitive analysis framework',
  'market',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000024',
  'a0000001-0001-0001-0001-000000000009',
  1,
  'Identify competitors',
  'Identify competitors for:

Startup: {{startup_name}}
Industry: {{industry}}
Solution: {{solution}}

Categorize:
1. Direct competitors (same solution, same customer)
2. Indirect competitors (different solution, same problem)
3. Potential competitors (adjacent markets)

For each, note their positioning and estimated size.',
  '{"type": "object", "properties": {"direct": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "positioning": {"type": "string"}, "size": {"type": "string"}}}}, "indirect": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "positioning": {"type": "string"}, "size": {"type": "string"}}}}, "potential": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "positioning": {"type": "string"}, "size": {"type": "string"}}}}}}'::jsonb,
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000025',
  'a0000001-0001-0001-0001-000000000009',
  2,
  'Build comparison matrix',
  'Build a competitive comparison matrix:

Competitors: {{step_1_output}}
Your Solution: {{solution}}

Compare on these dimensions:
1. Core features
2. Pricing
3. Target customer
4. Strengths
5. Weaknesses
6. Market position

Identify gaps and opportunities.',
  '{"type": "object", "properties": {"comparison_matrix": {"type": "array", "items": {"type": "object", "properties": {"competitor": {"type": "string"}, "features": {"type": "string"}, "pricing": {"type": "string"}, "target": {"type": "string"}, "strengths": {"type": "array", "items": {"type": "string"}}, "weaknesses": {"type": "array", "items": {"type": "string"}}}}}, "gaps": {"type": "array", "items": {"type": "string"}}, "opportunities": {"type": "array", "items": {"type": "string"}}}}'::jsonb,
  'gemini',
  0.6
),
(
  'b0000001-0001-0001-0001-000000000026',
  'a0000001-0001-0001-0001-000000000009',
  3,
  'Define differentiation',
  'Define your differentiation strategy:

Comparison: {{previous_output}}
Your Strengths: {{strengths}}

Create:
1. Positioning statement
2. Key differentiators (top 3)
3. Competitive moat strategy
4. Counter-positioning for each competitor',
  '{"type": "object", "properties": {"positioning_statement": {"type": "string"}, "differentiators": {"type": "array", "items": {"type": "string"}}, "moat_strategy": {"type": "string"}, "counter_positioning": {"type": "array", "items": {"type": "object", "properties": {"competitor": {"type": "string"}, "counter": {"type": "string"}}}}}}'::jsonb,
  'claude',
  0.7
);

-- Pack 12: Blue Ocean Analysis
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000011',
  'Blue Ocean Analysis',
  'blue-ocean-analysis',
  'Assess competitive positioning and market uniqueness',
  'market',
  array['idea', 'pre-seed', 'seed'],
  array['saas', 'b2b', 'b2c', 'marketplace'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "gemini"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
-- Step 1: Blue Ocean Score
(
  'b0000001-0001-0001-0001-000000000030',
  'a0000001-0001-0001-0001-000000000011',
  1,
  'Calculate Blue Ocean Score',
  'Calculate the Blue Ocean Score for this startup:

STARTUP: {{startup_name}}
ONE-LINER: {{one_liner}}
INDUSTRY: {{industry}}
COMPETITORS FOUND: {{competitors}}
CLAIMED DIFFERENTIATION: {{uvp}}

Analyze three factors:

1. MARKET SATURATION (0-10, higher = less saturated)
   Scoring: 0-2 competitors = 10, 3-5 = 8, 6-10 = 6, 11-20 = 4, 20+ = 2
   Adjustments: Well-funded competitor (>$10M) = -1, Public company = -2, Clear niche = +2

2. INNOVATION LEVEL (0-10)
   New category = 10, New business model = 8, New tech = 7, Feature innovation = 6, Incremental = 4, Me-too = 2

3. DIFFERENTIATION CLARITY (0-10)
   10-word explanation = 10, 1-2 sentences = 8, Needs explanation = 6, Generic ("AI-powered") = 4, None = 2

FINAL SCORE = (Saturation × 0.40) + (Innovation × 0.35) + (Differentiation × 0.25)

Interpret: 8-10 Blue Ocean, 6-7.9 Open Water, 4-5.9 Mixed, 2-3.9 Crowded, 0-1.9 Red Ocean',
  '{"type": "object", "properties": {"blue_ocean_score": {"type": "number"}, "saturation": {"type": "object"}, "innovation": {"type": "object"}, "differentiation": {"type": "object"}, "interpretation": {"type": "string"}, "improvement_strategies": {"type": "array"}}}'::jsonb,
  'gemini',
  0.6
),
-- Step 2: Strategy Canvas
(
  'b0000001-0001-0001-0001-000000000031',
  'a0000001-0001-0001-0001-000000000011',
  2,
  'Create Strategy Canvas',
  'Create a Strategy Canvas for:

STARTUP: {{startup_name}}
COMPETITORS: {{competitors}}
BLUE OCEAN SCORE: {{blue_ocean_score}}

1. Identify 6-8 factors that matter in this industry
2. Rate each player 1-10 on each factor
3. Find white space opportunities
4. Apply Four Actions Framework:
   - ELIMINATE: What to remove?
   - REDUCE: What to reduce below standard?
   - RAISE: What to raise above standard?
   - CREATE: What new to introduce?

Format for charting.',
  '{"type": "object", "properties": {"factors": {"type": "array"}, "ratings": {"type": "object"}, "white_space": {"type": "array"}, "four_actions": {"type": "object"}}}'::jsonb,
  'gemini',
  0.7
);

-- ============================================================================
-- IDEATION CATEGORY
-- ============================================================================

-- Pack 13: Startup Idea Generator
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000100',
  'Startup Idea Generator',
  'idea-generator',
  'Generate and evaluate startup ideas systematically',
  'ideation',
  array['idea'],
  array['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech', 'ai'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000027',
  'a0000001-0001-0001-0001-000000000100',
  1,
  'Generate ideas from problems',
  'Generate startup ideas based on:

Domain Expertise: {{domain}}
Skills: {{skills}}
Problems You''ve Experienced: {{problems}}
Budget/Resources: {{resources}}

Generate 5 startup ideas using these frameworks:
1. Problem you''ve personally experienced
2. Industry expertise application
3. Existing solution 10x improvement
4. Adjacent market opportunity
5. Technology trend application

For each, provide name, one-liner, and target customer.',
  '{"type": "object", "properties": {"ideas": {"type": "array", "items": {"type": "object", "properties": {"framework": {"type": "string"}, "name": {"type": "string"}, "one_liner": {"type": "string"}, "target_customer": {"type": "string"}, "problem_solved": {"type": "string"}}}}}}'::jsonb,
  'gemini',
  0.9
),
(
  'b0000001-0001-0001-0001-000000000028',
  'a0000001-0001-0001-0001-000000000100',
  2,
  'Score and rank ideas',
  'Score and rank these ideas:

{{previous_output}}

Score each idea (1-10) on:
1. Problem urgency
2. Market size
3. Founder-market fit
4. Technical feasibility
5. Competition level (inverse)
6. Revenue potential

Calculate weighted average and rank.',
  '{"type": "object", "properties": {"scored_ideas": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "problem_urgency": {"type": "number"}, "market_size": {"type": "number"}, "founder_fit": {"type": "number"}, "feasibility": {"type": "number"}, "competition": {"type": "number"}, "revenue_potential": {"type": "number"}, "weighted_score": {"type": "number"}}}}, "ranking": {"type": "array", "items": {"type": "string"}}, "top_pick": {"type": "string"}, "rationale": {"type": "string"}}}'::jsonb,
  'gemini',
  0.5
);

-- Pack 14: Execution Mode Advisor
insert into prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
values (
  'a0000001-0001-0001-0001-000000000013',
  'Execution Mode Advisor',
  'execution-mode-advisor',
  'Customize advice for solopreneur vs startup vs scale-up',
  'ideation',
  array['idea', 'pre-seed', 'seed', 'series-a'],
  array['saas', 'b2b', 'b2c', 'marketplace'],
  'startupai',
  '{"author": "StartupAI", "version": "1.0", "model": "gemini"}'::jsonb
);

insert into prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
values
(
  'b0000001-0001-0001-0001-000000000050',
  'a0000001-0001-0001-0001-000000000013',
  1,
  'Customize advice by execution mode',
  'Provide tailored advice for this startup based on execution mode:

STARTUP: {{startup_name}}
ONE-LINER: {{one_liner}}
EXECUTION MODE: {{execution_mode}}

Mode definitions:
- Solopreneur (1-2 people): $10M-$500M TAM, bootstrap, AI tools
- Small Team (3-10): $100M-$1B TAM, angel/pre-seed, niche focus
- Startup (11-50): $500M-$5B TAM, VC-backed, growth focus
- Scale-up (50+): $1B+ TAM, Series B+, market leadership

Provide mode-specific advice for:

1. TECH STACK
   Solopreneur: No-code, AI tools, automation
   Small Team: Modern stack, some custom
   Startup: Scalable architecture
   Scale-up: Enterprise-grade

2. GO-TO-MARKET
   Solopreneur: Content, communities, personal brand
   Small Team: Niche partnerships, early customers
   Startup: Multiple channels, paid acquisition
   Scale-up: International, enterprise sales

3. REVENUE FOCUS
   Solopreneur: Quick to revenue, profitability
   Small Team: SaaS, clear unit economics
   Startup: Growth over profit
   Scale-up: Hyper-growth, path to profitability

4. HIRING
   Solopreneur: Contractors, AI assistants
   Small Team: Key hires, equity
   Startup: Aggressive hiring
   Scale-up: Exec team, global

5. FUNDING
   Solopreneur: Bootstrap, small angel
   Small Team: Angels, pre-seed
   Startup: Seed, Series A
   Scale-up: Series B+, growth equity

Tailor all recommendations to the selected mode.',
  '{"type": "object", "properties": {"mode": {"type": "string"}, "tech_advice": {"type": "string"}, "gtm_advice": {"type": "string"}, "revenue_advice": {"type": "string"}, "hiring_advice": {"type": "string"}, "funding_advice": {"type": "string"}, "key_metrics": {"type": "array"}, "warnings": {"type": "array"}}}'::jsonb,
  'gemini',
  0.6
);

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
