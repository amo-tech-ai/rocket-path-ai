-- ============================================================================
-- Seed: Prompt Packs from Prompt Library
-- ============================================================================
-- Purpose: Packs aligned with tasks/01-playbooks/prompt-library (01-prompt-library-index.md).
--          Use this file as the source of truth for library-defined packs.
-- Run after: Migrations that create prompt_packs / prompt_pack_steps.
-- Complements: industry-prompt-packs.sql (industry-aware + industry-specific packs).
--
-- Packs in this file (7 — the ones not in industry-prompt-packs.sql):
--   idea-validation, one-liner-generator, customer-archetype, gtm-strategy,
--   pricing-strategy, competitor-analysis, idea-generator
--
-- Schema: 20260129180000_industry_playbooks_prompt_packs_complete.sql
-- ============================================================================

-- ============================================================================
-- 1. Idea Validation Sprint (library: 02-ideation, 09-pitch-prompts)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_idea_validation', 'Idea Validation Sprint', 'idea-validation', 'Validate startup idea with first principles and pitch alignment', 'validation', ARRAY['idea', 'pre-seed'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "2-step", "library": "02-ideation"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_idea_validation', 1, 'First principles check',
   E'You are a startup advisor. The founder is building: {{product_description}} for {{target_audience}}.\n\nBreak this down into first principles: (1) restate the problem in basic terms, (2) list fundamental truths or constraints, (3) rebuild solution logic step by step. Highlight hidden assumptions and how the framing changes their perspective. Be clear and structured.',
   '{"product_description": "string", "target_audience": "string"}'::jsonb,
   '{"problem_restated": "string", "assumptions": "array", "solution_logic": "string", "key_risks": "array"}'::jsonb,
   'gemini', 2000, 0.3),
  ('pack_idea_validation', 2, 'Pitch alignment score',
   E'You are a pitch coach. Given this idea: {{idea_summary}}\n\nAssess how well it aligns with a strong pitch: (1) one-sentence clarity, (2) who/struggle/why-now, (3) differentiability. Return a readiness score 1-100 and 3 concrete improvements.',
   '{"idea_summary": "string"}'::jsonb,
   '{"readiness_score": "number", "improvements": "array", "one_liner_draft": "string"}'::jsonb,
   'gemini', 1500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- 2. Perfect One-Liner Generator (library: 09-pitch-prompts)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_one_liner', 'Perfect One-Liner Generator', 'one-liner-generator', 'Generate investor-ready one-sentence and tweet-length pitch', 'pitch', ARRAY['idea', 'pre-seed', 'seed'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "3-step", "library": "09-pitch-prompts"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_one_liner', 1, 'One-sentence pitch',
   E'You are a pitch coach. Company: {{company_name}}. Product: {{product_description}}. Audience: {{target_audience}}. Problem: {{problem}}.\n\nWrite one crisp sentence that states what the company does, for whom, and the problem it solves. No jargon. Memorable.',
   '{"company_name": "string", "product_description": "string", "target_audience": "string", "problem": "string"}'::jsonb,
   '{"one_sentence": "string", "hook_line": "string"}'::jsonb,
   'claude', 500, 0.4),
  ('pack_one_liner', 2, 'Tweet-length pitch',
   E'You are a pitch coach. One-sentence pitch: {{one_sentence}}\n\nCondense into a tweet-length pitch (under 280 characters) that keeps the core message and is shareable.',
   '{"one_sentence": "string"}'::jsonb,
   '{"tweet_pitch": "string"}'::jsonb,
   'gemini', 400, 0.4),
  ('pack_one_liner', 3, 'Ask in one sentence',
   E'You are a pitch coach. Context: {{one_sentence}}. Stage: {{stage}}. Use case: {{use_case}}.\n\nWrite a single-sentence ask (e.g. what they are raising, or what they want from the reader) that is clear and actionable.',
   '{"one_sentence": "string", "stage": "string", "use_case": "string"}'::jsonb,
   '{"ask_sentence": "string"}'::jsonb,
   'gemini', 300, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- 3. Customer Archetype Builder (library: 03-prompt-market)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_customer_archetype', 'Customer Archetype Builder', 'customer-archetype', 'Define who buys first and key customer segments', 'canvas', ARRAY['idea', 'pre-seed', 'seed'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "3-step", "library": "03-prompt-market"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_customer_archetype', 1, 'Who buys first',
   E'You are a go-to-market advisor. Product: {{product_description}}. Target audience: {{target_audience}}.\n\nIdentify who buys first: (1) primary segment, (2) why they buy first, (3) early adopter traits. Return structured segments with rationale.',
   '{"product_description": "string", "target_audience": "string"}'::jsonb,
   '{"primary_segment": "object", "early_adopter_traits": "array", "rationale": "string"}'::jsonb,
   'gemini', 1500, 0.4),
  ('pack_customer_archetype', 2, 'Three questions customers ask',
   E'You are a customer discovery expert. Product: {{product_description}}. Segments: {{segments}}.\n\nList the 3 most important questions this customer segment asks before buying. For each: question, why it matters, how to answer it.',
   '{"product_description": "string", "segments": "object"}'::jsonb,
   '{"questions": "array"}'::jsonb,
   'gemini', 1200, 0.3),
  ('pack_customer_archetype', 3, 'Archetype summary',
   E'You are a positioning expert. Input: {{archetype_data}}\n\nProduce a one-paragraph customer archetype summary suitable for a Lean Canvas or pitch: who they are, what they care about, and why they would choose this product.',
   '{"archetype_data": "object"}'::jsonb,
   '{"archetype_summary": "string", "key_attributes": "array"}'::jsonb,
   'claude', 800, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- 4. Go-to-Market Strategy Builder (library: 04-marketing)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_gtm_strategy', 'Go-to-Market Strategy Builder', 'gtm-strategy', 'Build GTM strategy: channels, positioning, launch', 'gtm', ARRAY['pre-seed', 'seed'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "3-step", "library": "04-marketing"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_gtm_strategy', 1, 'Channel strategy',
   E'You are a GTM advisor. Business: {{business_name}}. Audience: {{target_audience}}. Industry: {{industry}}. Goals: {{goals}}. Budget: {{budget}}.\n\nSuggest the best marketing channels to reach this audience. For each channel: name, why it fits, one tactic to start, and a simple metric to track.',
   '{"business_name": "string", "target_audience": "string", "industry": "string", "goals": "array", "budget": "string"}'::jsonb,
   '{"channels": "array", "recommended_first_channel": "string"}'::jsonb,
   'gemini', 1800, 0.4),
  ('pack_gtm_strategy', 2, 'One channel to start',
   E'You are a GTM advisor. Channels suggested: {{channels}}. Context: {{context}}.\n\nPick the single best channel to start with. Explain why, what to do in the first 30 days, and how to measure success.',
   '{"channels": "array", "context": "object"}'::jsonb,
   '{"first_channel": "string", "rationale": "string", "first_30_days": "array", "success_metric": "string"}'::jsonb,
   'gemini', 1200, 0.3),
  ('pack_gtm_strategy', 3, 'Launch week plan',
   E'You are a launch advisor. Product: {{product}}. Channel: {{first_channel}}. Launch date: {{launch_date}}.\n\nCreate a launch week plan: day-by-day actions, content or campaigns, and key milestones. Keep it actionable.',
   '{"product": "string", "first_channel": "string", "launch_date": "string"}'::jsonb,
   '{"launch_plan": "array", "milestones": "array"}'::jsonb,
   'claude', 1500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- 5. SaaS Pricing Strategy (library: 07-revenue-model)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_pricing_strategy', 'SaaS Pricing Strategy', 'pricing-strategy', 'Design pricing and run pricing experiments', 'pricing', ARRAY['pre-seed', 'seed'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "3-step", "library": "07-revenue-model"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_pricing_strategy', 1, 'Pricing design',
   E'You are a pricing advisor. Product: {{product_description}}. Audience: {{target_audience}}. Goal: {{goal}}.\n\nReturn 3–4 pricing strategies: name, how it works, why it might work here, and one risk or tradeoff. Be specific.',
   '{"product_description": "string", "target_audience": "string", "goal": "string"}'::jsonb,
   '{"strategies": "array", "recommendation": "string"}'::jsonb,
   'gemini', 1600, 0.4),
  ('pack_pricing_strategy', 2, 'Free vs trial',
   E'You are a monetization advisor. Product: {{product}}. Business model: {{business_model}}.\n\nRecommend freemium vs free trial: clear recommendation, 2–3 reasons, risks, and when the opposite might work.',
   '{"product": "string", "business_model": "string"}'::jsonb,
   '{"recommendation": "string", "reasons": "array", "risks": "array", "alternative_scenario": "string"}'::jsonb,
   'claude', 1200, 0.3),
  ('pack_pricing_strategy', 3, 'Pricing experiments',
   E'You are a growth advisor. Product: {{product}}. Current pricing: {{current_pricing}}.\n\nGenerate 3–5 pricing experiments: name, test description, hypothesis, metric to track, risk level. Include at least one test for higher price and one for packaging.',
   '{"product": "string", "current_pricing": "string"}'::jsonb,
   '{"experiments": "array"}'::jsonb,
   'gemini', 1500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- 6. Competitor Deep Dive (library: 03-prompt-market)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_competitor_analysis', 'Competitor Deep Dive', 'competitor-analysis', 'Map competitors and differentiation', 'market', ARRAY['idea', 'pre-seed', 'seed'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "3-step", "library": "03-prompt-market"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_competitor_analysis', 1, 'Competitor list',
   E'You are a market analyst. Product: {{product_description}} for {{target_audience}}.\n\nReturn a table (as structured data): Competitor, Type (Direct/Indirect), Key Offering, Strengths, Weaknesses, How We''re Different. Include 5–7 competitors, specific and relevant.',
   '{"product_description": "string", "target_audience": "string"}'::jsonb,
   '{"competitors": "array", "market_category": "string"}'::jsonb,
   'gemini', 2000, 0.3),
  ('pack_competitor_analysis', 2, 'Market definition',
   E'You are a positioning expert. Product: {{product}}. Competitors: {{competitors}}.\n\nDefine: Exact Market Category, Close Substitutes, Adjacent Businesses. For each give examples and why it matters for this product.',
   '{"product": "string", "competitors": "array"}'::jsonb,
   '{"market_category": "string", "close_substitutes": "array", "adjacent": "array"}'::jsonb,
   'gemini', 1200, 0.3),
  ('pack_competitor_analysis', 3, 'Differentiation summary',
   E'You are a strategy advisor. Competitor analysis: {{competitor_data}}.\n\nProduce a short differentiation summary: how this product is different, key positioning angles, and 2–3 talking points for sales or pitch.',
   '{"competitor_data": "object"}'::jsonb,
   '{"differentiation_summary": "string", "positioning_angles": "array", "talking_points": "array"}'::jsonb,
   'claude', 1000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- 7. Startup Idea Generator (library: 02-ideation)
-- ============================================================================
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_idea_generator', 'Startup Idea Generator', 'idea-generator', 'Generate and refine startup ideas from theme or problem', 'ideation', ARRAY['idea'], ARRAY['all'], 1, true, 'prompt-library', '{"workflow": "2-step", "library": "02-ideation"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_idea_generator', 1, 'Idea expansion',
   E'You are a startup ideation coach. Theme or area: {{theme}}. Constraints: {{constraints}}.\n\nGenerate 5–7 concrete startup ideas in this space. For each: one-line description, target customer, core problem, and why now. Be specific and varied.',
   '{"theme": "string", "constraints": "string"}'::jsonb,
   '{"ideas": "array"}'::jsonb,
   'gemini', 2000, 0.5),
  ('pack_idea_generator', 2, 'Idea in 10 words',
   E'You are a pitch coach. Idea: {{idea_description}}.\n\nCondense this idea into exactly 10 words that capture the essence. Then suggest one strongest angle for a one-sentence pitch.',
   '{"idea_description": "string"}'::jsonb,
   '{"ten_words": "string", "pitch_angle": "string"}'::jsonb,
   'gemini', 400, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- ============================================================================
-- FEATURE ROUTING (optional — for packs that should be auto-selected by route)
-- ============================================================================
-- Add routing for new packs if/when features use them. Example:
-- INSERT INTO feature_pack_routing (feature_route, intent, default_pack_slug, priority) VALUES
--   ('/validator', 'idea-check', 'idea-validation', 5),
--   ('/onboarding/*', 'one-liner', 'one-liner-generator', 5),
--   ('/lean-canvas', 'customer', 'customer-archetype', 5),
--   ('/gtm', 'strategy', 'gtm-strategy', 5),
--   ('/chat', 'pricing', 'pricing-strategy', 5),
--   ('/chat', 'competitors', 'competitor-analysis', 5),
--   ('/chat', 'idea', 'idea-generator', 5)
-- ON CONFLICT DO NOTHING;
-- (feature_pack_routing has no unique on (feature_route, intent, default_pack_slug), so we do not use ON CONFLICT here; add only if needed.)

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This seed adds 7 prompt packs (21 steps) from the prompt-library:
--   idea-validation (2), one-liner-generator (3), customer-archetype (3),
--   gtm-strategy (3), pricing-strategy (3), competitor-analysis (3), idea-generator (2).
-- Run after migrations. Complements industry-prompt-packs.sql (do not duplicate slugs).
-- ============================================================================
