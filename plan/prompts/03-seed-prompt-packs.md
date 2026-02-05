# Task 3: Seed Data & Starter Prompt Packs

> **Priority:** P1
> **Effort:** 3-4 hours
> **Dependencies:** Task 1 (Database Setup)

---

## Objective

Populate the database with starter prompt packs covering validation, pitch, canvas, GTM, and pricing categories.

---

## Checklist

### 3.1 Create Seed File

- [ ] Create seed file: `supabase/seeds/02-prompt-packs.sql`

### 3.2 Validation Category Packs

```sql
-- ============================================
-- VALIDATION CATEGORY
-- ============================================

-- Pack 1: Problem Validation
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000001',
  'Problem Validation Framework',
  'problem-validation',
  'Validate your startup problem with structured customer discovery',
  'validation',
  ARRAY['idea', 'pre-seed'],
  ARRAY['saas', 'b2b', 'b2c'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'
);

-- Problem Validation Steps
INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"who": {"type": "string"}, "what": {"type": "string"}, "why": {"type": "string"}, "how": {"type": "string"}, "when": {"type": "string"}, "summary": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"questions": {"type": "array", "items": {"type": "object", "properties": {"theme": {"type": "string"}, "question": {"type": "string"}, "purpose": {"type": "string"}}}}}}',
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
  '{"type": "object", "properties": {"scores": {"type": "object", "properties": {"frequency": {"type": "number"}, "severity": {"type": "number"}, "market_size": {"type": "number"}, "willingness_to_pay": {"type": "number"}, "current_solutions": {"type": "number"}}}, "overall_score": {"type": "number"}, "recommendation": {"type": "string"}, "next_steps": {"type": "array", "items": {"type": "string"}}}}',
  'gemini',
  0.5
);

-- Pack 2: Idea Validation
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000002',
  'Idea Validation Sprint',
  'idea-validation',
  'Validate your startup idea in 5 structured steps',
  'validation',
  ARRAY['idea'],
  ARRAY['saas', 'b2b', 'b2c', 'marketplace'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"elephant": {"type": "string"}, "category": {"type": "string"}, "why_critical": {"type": "string"}, "evidence_needed": {"type": "string"}, "test_method": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"experiment_name": {"type": "string"}, "hypothesis": {"type": "string"}, "method": {"type": "string"}, "timeline": {"type": "string"}, "budget": {"type": "string"}, "success_criteria": {"type": "object", "properties": {"metric": {"type": "string"}, "threshold": {"type": "string"}}}, "next_steps_if_pass": {"type": "string"}, "next_steps_if_fail": {"type": "string"}}}',
  'gemini',
  0.6
);
```

### 3.3 Pitch Category Packs

```sql
-- ============================================
-- PITCH CATEGORY
-- ============================================

-- Pack 3: One-Liner Generator
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000003',
  'Perfect One-Liner Generator',
  'one-liner-generator',
  'Create a compelling one-sentence pitch that hooks investors',
  'pitch',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"transformation": {"type": "object", "properties": {"before": {"type": "string"}, "after": {"type": "string"}}}, "mechanism": {"type": "string"}, "target": {"type": "string"}, "outcome": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"one_liners": {"type": "array", "items": {"type": "object", "properties": {"formula": {"type": "string"}, "one_liner": {"type": "string"}, "word_count": {"type": "number"}}}}}}',
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
  '{"type": "object", "properties": {"scores": {"type": "array", "items": {"type": "object", "properties": {"one_liner": {"type": "string"}, "clarity": {"type": "number"}, "memorability": {"type": "number"}, "differentiation": {"type": "number"}, "accuracy": {"type": "number"}, "total": {"type": "number"}}}}, "winner": {"type": "string"}, "refined_version": {"type": "string"}, "usage_tips": {"type": "array", "items": {"type": "string"}}}}',
  'claude',
  0.6
);

-- Pack 4: Investor Pitch Builder
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000004',
  'Investor Pitch Builder',
  'investor-pitch-builder',
  'Build a compelling investor pitch deck narrative',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['saas', 'b2b', 'fintech', 'healthtech', 'ai'],
  'custom',
  '{"author": "StartupAI", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"hook": {"type": "string"}, "bullet_points": {"type": "array", "items": {"type": "string"}}, "emotional_impact": {"type": "string"}, "why_now": {"type": "string"}, "speaker_notes": {"type": "string"}}}',
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000010',
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
  '{"type": "object", "properties": {"solution_statement": {"type": "string"}, "key_benefits": {"type": "array", "items": {"type": "string"}}, "visual_suggestion": {"type": "string"}, "proof_point": {"type": "string"}, "speaker_notes": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"tam": {"type": "object", "properties": {"value": {"type": "string"}, "calculation": {"type": "string"}}}, "sam": {"type": "object", "properties": {"value": {"type": "string"}, "calculation": {"type": "string"}}}, "som": {"type": "object", "properties": {"value": {"type": "string"}, "calculation": {"type": "string"}}}, "growth_rate": {"type": "string"}, "speaker_notes": {"type": "string"}}}',
  'gemini',
  0.5
);
```

### 3.4 Canvas Category Packs

```sql
-- ============================================
-- CANVAS CATEGORY
-- ============================================

-- Pack 5: Lean Canvas Generator
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000005',
  'AI Lean Canvas Generator',
  'lean-canvas-generator',
  'Generate a complete Lean Canvas from your startup description',
  'canvas',
  ARRAY['idea', 'pre-seed'],
  ARRAY['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech'],
  'custom',
  '{"author": "StartupAI", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"core_offering": {"type": "string"}, "target_customers": {"type": "array", "items": {"type": "string"}}, "main_problem": {"type": "string"}, "unique_approach": {"type": "string"}, "industry": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"problem": {"type": "array", "items": {"type": "string"}}, "customer_segments": {"type": "array", "items": {"type": "string"}}, "unique_value_proposition": {"type": "string"}, "solution": {"type": "array", "items": {"type": "string"}}, "channels": {"type": "array", "items": {"type": "string"}}, "revenue_streams": {"type": "array", "items": {"type": "string"}}, "cost_structure": {"type": "array", "items": {"type": "string"}}, "key_metrics": {"type": "array", "items": {"type": "string"}}, "unfair_advantage": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"section_reviews": {"type": "array", "items": {"type": "object", "properties": {"section": {"type": "string"}, "score": {"type": "number"}, "weakness": {"type": "string"}, "improvement": {"type": "string"}, "assumption": {"type": "string"}}}}, "overall_score": {"type": "number"}, "top_priorities": {"type": "array", "items": {"type": "string"}}}}',
  'claude',
  0.6
);

-- Pack 6: Customer Archetype Builder
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000006',
  'Customer Archetype Builder',
  'customer-archetype',
  'Build detailed customer personas with jobs-to-be-done',
  'canvas',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['saas', 'b2b', 'b2c'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"segments": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "size": {"type": "string"}, "motivation": {"type": "string"}, "willingness_to_pay": {"type": "string"}}}}}}',
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
  '{"type": "object", "properties": {"name": {"type": "string"}, "demographics": {"type": "object"}, "day_in_life": {"type": "string"}, "goals": {"type": "array", "items": {"type": "string"}}, "frustrations": {"type": "array", "items": {"type": "string"}}, "current_solutions": {"type": "array", "items": {"type": "string"}}, "discovery_channels": {"type": "array", "items": {"type": "string"}}, "decision_process": {"type": "string"}, "objections": {"type": "array", "items": {"type": "string"}}}}',
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
  '{"type": "object", "properties": {"functional_jobs": {"type": "array", "items": {"type": "object", "properties": {"job": {"type": "string"}, "importance": {"type": "number"}, "satisfaction": {"type": "number"}, "opportunity": {"type": "number"}}}}, "emotional_jobs": {"type": "array", "items": {"type": "object", "properties": {"job": {"type": "string"}, "importance": {"type": "number"}, "satisfaction": {"type": "number"}, "opportunity": {"type": "number"}}}}, "social_jobs": {"type": "array", "items": {"type": "object", "properties": {"job": {"type": "string"}, "importance": {"type": "number"}, "satisfaction": {"type": "number"}, "opportunity": {"type": "number"}}}}, "top_opportunities": {"type": "array", "items": {"type": "string"}}}}',
  'gemini',
  0.6
);
```

### 3.5 GTM Category Packs

```sql
-- ============================================
-- GTM (GO-TO-MARKET) CATEGORY
-- ============================================

-- Pack 7: Go-to-Market Strategy
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000007',
  'Go-to-Market Strategy Builder',
  'gtm-strategy',
  'Build a comprehensive go-to-market strategy',
  'gtm',
  ARRAY['pre-seed', 'seed'],
  ARRAY['saas', 'b2b'],
  'custom',
  '{"author": "StartupAI", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"motions": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "fit_score": {"type": "number"}, "rationale": {"type": "string"}, "pros": {"type": "array", "items": {"type": "string"}}, "cons": {"type": "array", "items": {"type": "string"}}}}}, "recommended": {"type": "string"}}}',
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
  '{"type": "object", "properties": {"channels": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "fit_reason": {"type": "string"}, "cac_range": {"type": "string"}, "time_to_results": {"type": "string"}, "scalability": {"type": "number"}}}}, "priority_channels": {"type": "array", "items": {"type": "string"}}, "90_day_plan": {"type": "string"}}}',
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000020',
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
  '{"type": "object", "properties": {"foundation": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}, "channel_setup": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}, "experiments": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}, "scaling": {"type": "array", "items": {"type": "object", "properties": {"task": {"type": "string"}, "owner": {"type": "string"}, "metric": {"type": "string"}}}}}}',
  'gemini',
  0.6
);
```

### 3.6 Pricing Category Packs

```sql
-- ============================================
-- PRICING CATEGORY
-- ============================================

-- Pack 8: Pricing Strategy
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000008',
  'SaaS Pricing Strategy',
  'pricing-strategy',
  'Design an optimal pricing strategy for your SaaS',
  'pricing',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['saas', 'b2b'],
  'custom',
  '{"author": "StartupAI", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
(
  'b0000001-0001-0001-0001-000000000021',
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
  '{"type": "object", "properties": {"value_metrics": {"type": "array", "items": {"type": "object", "properties": {"metric": {"type": "string"}, "alignment_score": {"type": "number"}, "scalability_score": {"type": "number"}, "simplicity_score": {"type": "number"}, "total_score": {"type": "number"}}}}, "recommended": {"type": "string"}, "rationale": {"type": "string"}}}',
  'gemini',
  0.6
),
(
  'b0000001-0001-0001-0001-000000000022',
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
  '{"type": "object", "properties": {"tiers": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "price": {"type": "string"}, "billing": {"type": "string"}, "value_metric_limit": {"type": "string"}, "features": {"type": "array", "items": {"type": "string"}}, "target_persona": {"type": "string"}}}}}}',
  'gemini',
  0.7
),
(
  'b0000001-0001-0001-0001-000000000023',
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
  '{"type": "object", "properties": {"scenarios": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "month_6_mrr": {"type": "string"}, "month_12_mrr": {"type": "string"}, "customer_mix": {"type": "object"}, "assumptions": {"type": "array", "items": {"type": "string"}}}}}, "recommendation": {"type": "string"}}}',
  'gemini',
  0.5
);
```

### 3.7 Additional Utility Packs

```sql
-- ============================================
-- MARKET CATEGORY
-- ============================================

-- Pack 9: Competitor Analysis
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000009',
  'Competitor Deep Dive',
  'competitor-analysis',
  'Comprehensive competitive analysis framework',
  'market',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['saas', 'b2b', 'b2c', 'marketplace'],
  'fi.co',
  '{"author": "FI.co", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
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
  '{"type": "object", "properties": {"direct": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "positioning": {"type": "string"}, "size": {"type": "string"}}}}, "indirect": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "positioning": {"type": "string"}, "size": {"type": "string"}}}}, "potential": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "positioning": {"type": "string"}, "size": {"type": "string"}}}}}}',
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
  '{"type": "object", "properties": {"comparison_matrix": {"type": "array", "items": {"type": "object", "properties": {"competitor": {"type": "string"}, "features": {"type": "string"}, "pricing": {"type": "string"}, "target": {"type": "string"}, "strengths": {"type": "array", "items": {"type": "string"}}, "weaknesses": {"type": "array", "items": {"type": "string"}}}}}, "gaps": {"type": "array", "items": {"type": "string"}}, "opportunities": {"type": "array", "items": {"type": "string"}}}}',
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
  '{"type": "object", "properties": {"positioning_statement": {"type": "string"}, "differentiators": {"type": "array", "items": {"type": "string"}}, "moat_strategy": {"type": "string"}, "counter_positioning": {"type": "array", "items": {"type": "object", "properties": {"competitor": {"type": "string"}, "counter": {"type": "string"}}}}}}',
  'claude',
  0.7
);

-- Pack 10: Ideation Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, source, metadata)
VALUES (
  'a0000001-0001-0001-0001-000000000010',
  'Startup Idea Generator',
  'idea-generator',
  'Generate and evaluate startup ideas systematically',
  'ideation',
  ARRAY['idea'],
  ARRAY['saas', 'b2b', 'b2c', 'marketplace', 'fintech', 'healthtech', 'ai'],
  'custom',
  '{"author": "StartupAI", "version": "1.0"}'
);

INSERT INTO prompt_pack_steps (id, pack_id, step_order, purpose, prompt_template, output_schema, model_preference, temperature)
VALUES
(
  'b0000001-0001-0001-0001-000000000027',
  'a0000001-0001-0001-0001-000000000010',
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
  '{"type": "object", "properties": {"ideas": {"type": "array", "items": {"type": "object", "properties": {"framework": {"type": "string"}, "name": {"type": "string"}, "one_liner": {"type": "string"}, "target_customer": {"type": "string"}, "problem_solved": {"type": "string"}}}}}}',
  'gemini',
  0.9
),
(
  'b0000001-0001-0001-0001-000000000028',
  'a0000001-0001-0001-0001-000000000010',
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
  '{"type": "object", "properties": {"scored_ideas": {"type": "array", "items": {"type": "object", "properties": {"name": {"type": "string"}, "problem_urgency": {"type": "number"}, "market_size": {"type": "number"}, "founder_fit": {"type": "number"}, "feasibility": {"type": "number"}, "competition": {"type": "number"}, "revenue_potential": {"type": "number"}, "weighted_score": {"type": "number"}}}}, "ranking": {"type": "array", "items": {"type": "string"}}, "top_pick": {"type": "string"}, "rationale": {"type": "string"}}}',
  'gemini',
  0.5
);
```

### 3.8 Apply Seed Data

```bash
# Apply seed data
supabase db seed

# Verify packs created
supabase db query "SELECT title, category, (SELECT COUNT(*) FROM prompt_pack_steps WHERE pack_id = prompt_packs.id) as steps FROM prompt_packs ORDER BY category"
```

---

## Verification

- [ ] 10 prompt packs created
- [ ] All steps have valid output_schema
- [ ] No foreign key violations
- [ ] Categories match CHECK constraint
- [ ] search_prompt_packs() returns results

---

## Prompt Pack Summary

| Pack | Category | Steps | Source |
|------|----------|-------|--------|
| Problem Validation Framework | validation | 3 | FI.co |
| Idea Validation Sprint | validation | 2 | FI.co |
| Perfect One-Liner Generator | pitch | 3 | FI.co |
| Investor Pitch Builder | pitch | 3 | Custom |
| AI Lean Canvas Generator | canvas | 3 | Custom |
| Customer Archetype Builder | canvas | 3 | FI.co |
| Go-to-Market Strategy Builder | gtm | 3 | Custom |
| SaaS Pricing Strategy | pricing | 3 | Custom |
| Competitor Deep Dive | market | 3 | FI.co |
| Startup Idea Generator | ideation | 2 | Custom |

**Total: 10 packs, 28 steps**

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/seeds/02-prompt-packs.sql` | Create |

---

## Acceptance Criteria

1. All 10 packs visible in `search_prompt_packs()`
2. Each pack has working steps
3. Output schemas are valid JSON Schema
4. Model preferences are set correctly
5. Tags enable filtering by stage/industry
