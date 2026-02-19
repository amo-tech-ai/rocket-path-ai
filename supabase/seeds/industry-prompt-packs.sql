-- ============================================================================
-- Seed Data: Industry-Aware Prompt Packs
-- These packs integrate with industry playbooks for context-aware AI responses
-- Date: 2026-01-29
-- Updated: Schema aligned with 20260129180000_industry_playbooks_prompt_packs_complete.sql
--
-- IMPORTANT: Tables are created by migrations, NOT by this seed file.
-- This file only INSERTs data into existing tables.
-- ============================================================================

-- ============================================================================
-- INDUSTRY-AWARE PROMPT PACKS
-- ============================================================================

-- 1. Industry-Aware Validation Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_industry_validation', 'Industry-Aware Validation', 'industry-validation', 'Validate startup against industry-specific benchmarks and failure patterns', 'validation', ARRAY['pre-seed', 'seed'], ARRAY['all'], 1, true, 'system', '{"workflow": "3-step", "industry_aware": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_industry_validation', 1, 'Check for failure patterns', 
   E'You are an industry expert analyzing a startup for common failure patterns.\n\n<industry_context>\n{{industry_context}}\n</industry_context>\n\n<startup_profile>\n{{startup_profile}}\n</startup_profile>\n\nAnalyze this startup against known failure patterns for their industry. For each pattern detected:\n1. Name the pattern\n2. Explain why it applies\n3. Rate severity (critical/warning/watch)\n4. Recommend specific actions to avoid it\n\nBe specific and actionable.', 
   '{"startup_profile": "object", "industry_context": "object"}'::jsonb, 
   '{"patterns_detected": "array", "overall_risk": "string", "top_priority_action": "string"}'::jsonb, 
   'claude', 2000, 0.3),
   
  ('pack_industry_validation', 2, 'Compare against benchmarks', 
   E'You are an industry analyst comparing a startup against industry benchmarks.\n\n<industry_benchmarks>\n{{benchmarks}}\n</industry_benchmarks>\n\n<startup_metrics>\n{{startup_metrics}}\n</startup_metrics>\n\nFor each relevant benchmark:\n1. Compare the startup''s metrics\n2. Rate as above/at/below industry average\n3. Calculate a percentile if possible\n4. Suggest improvements for weak areas\n\nProvide an overall readiness score (1-100).', 
   '{"startup_metrics": "object", "benchmarks": "array"}'::jsonb, 
   '{"comparisons": "array", "overall_score": "number", "priority_improvements": "array"}'::jsonb, 
   'gemini', 1500, 0.3),
   
  ('pack_industry_validation', 3, 'Scan for warning signs', 
   E'You are a risk monitor scanning for early warning signs.\n\n<warning_signs>\n{{warning_signs}}\n</warning_signs>\n\n<current_signals>\n{{current_signals}}\n</current_signals>\n\nCheck each warning sign against current signals. For active warnings:\n1. Identify the trigger\n2. Rate urgency (immediate/soon/monitor)\n3. Recommend specific action\n4. Estimate time to address\n\nProvide overall health assessment.', 
   '{"current_signals": "object", "warning_signs": "array"}'::jsonb, 
   '{"active_warnings": "array", "overall_health": "string", "top_priority_action": "string"}'::jsonb, 
   'gemini', 1500, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- 2. Industry-Aware Pitch Prep Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_industry_pitch', 'Industry-Aware Pitch Prep', 'industry-pitch-prep', 'Prepare pitch with industry-specific investor expectations and Q&A', 'pitch', ARRAY['pre-seed', 'seed', 'series-a'], ARRAY['all'], 1, true, 'system', '{"workflow": "3-step", "industry_aware": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_industry_pitch', 1, 'Check investor expectations alignment', 
   E'You are an investor relations expert assessing pitch readiness.\n\n<investor_expectations>\n{{investor_expectations}}\n</investor_expectations>\n\n<startup_profile>\n{{startup_profile}}\n</startup_profile>\n\n<stage>{{stage}}</stage>\n\nEvaluate how well this startup meets investor expectations for their stage:\n1. List what investors expect at this stage\n2. Rate alignment for each expectation (met/partial/gap)\n3. Calculate readiness score (1-100)\n4. List gaps to close before fundraising\n5. Provide specific recommendations', 
   '{"startup_profile": "object", "stage": "string", "investor_expectations": "object"}'::jsonb, 
   '{"readiness_score": "number", "gaps_to_close": "array", "recommendation": "string"}'::jsonb, 
   'gemini', 1500, 0.3),
   
  ('pack_industry_pitch', 2, 'Validate terminology', 
   E'You are an industry terminology expert reviewing pitch content.\n\n<terminology>\n{{terminology}}\n</terminology>\n\n<content>\n{{content}}\n</content>\n\nReview the content for terminology issues:\n1. Find phrases to avoid and suggest replacements\n2. Suggest industry-specific phrases to add\n3. Rate terminology score (1-100)\n4. Highlight investor vocabulary that should be used', 
   '{"content": "string", "terminology": "object"}'::jsonb, 
   '{"phrases_to_replace": "array", "terminology_score": "number", "rewritten_sections": "object"}'::jsonb, 
   'gemini', 1000, 0.3),
   
  ('pack_industry_pitch', 3, 'Prepare for investor questions', 
   E'You are a pitch coach preparing a founder for investor Q&A.\n\n<investor_questions>\n{{investor_questions}}\n</investor_questions>\n\n<startup_profile>\n{{startup_profile}}\n</startup_profile>\n\nFor each likely investor question:\n1. State the question\n2. Explain why investors ask this\n3. Draft a strong answer based on the startup profile\n4. Identify gaps that need addressing before the meeting', 
   '{"startup_profile": "object", "investor_questions": "array"}'::jsonb, 
   '{"prepared_answers": "array", "biggest_gaps": "array", "practice_priority": "array"}'::jsonb, 
   'claude', 2500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- 3. Industry-Aware GTM Strategy Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_industry_gtm', 'Industry-Aware GTM Strategy', 'industry-gtm-strategy', 'Build GTM strategy using proven industry patterns', 'gtm', ARRAY['pre-seed', 'seed'], ARRAY['all'], 1, true, 'system', '{"workflow": "3-step", "industry_aware": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_industry_gtm', 1, 'Select GTM strategy', 
   E'You are a GTM strategist with deep industry expertise.\n\n<gtm_patterns>\n{{gtm_patterns}}\n</gtm_patterns>\n\n<startup_profile>\n{{startup_profile}}\n</startup_profile>\n\nRecommend the best GTM strategy for this startup:\n1. Evaluate each proven pattern for fit\n2. Recommend primary strategy with rationale\n3. Outline first 90 days plan\n4. Define key metrics to track\n5. Identify common GTM mistakes to avoid', 
   '{"startup_profile": "object", "gtm_patterns": "array"}'::jsonb, 
   '{"recommended_strategy": "object", "first_90_days": "array", "key_metrics_to_track": "array"}'::jsonb, 
   'gemini', 2000, 0.4),
   
  ('pack_industry_gtm', 2, 'Apply decision frameworks', 
   E'You are a strategic advisor using industry decision frameworks.\n\n<decision_frameworks>\n{{decision_frameworks}}\n</decision_frameworks>\n\n<decision_question>\n{{decision_question}}\n</decision_question>\n\n<startup_context>\n{{startup_context}}\n</startup_context>\n\nApply the relevant decision frameworks to answer the question:\n1. Identify which framework applies\n2. Walk through the if/then logic\n3. Provide clear recommendation\n4. Explain the reasoning\n5. List next steps', 
   '{"decision_question": "string", "startup_context": "object", "decision_frameworks": "array"}'::jsonb, 
   '{"recommendation": "string", "reasoning": "string", "next_steps": "array"}'::jsonb, 
   'claude', 1500, 0.3),
   
  ('pack_industry_gtm', 3, 'Check for GTM failure patterns', 
   E'You are a GTM risk analyst checking for common mistakes.\n\n<failure_patterns>\n{{failure_patterns}}\n</failure_patterns>\n\n<gtm_plan>\n{{gtm_plan}}\n</gtm_plan>\n\nReview the GTM plan for failure pattern risks:\n1. Check each relevant failure pattern\n2. Identify any matches or near-matches\n3. Rate overall GTM risk\n4. Recommend preventive actions', 
   '{"gtm_plan": "object", "failure_patterns": "array"}'::jsonb, 
   '{"patterns_detected": "array", "overall_risk": "string", "preventive_actions": "array"}'::jsonb, 
   'claude', 1500, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- 4. Industry-Aware Stage Transition Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_industry_stage', 'Industry-Aware Stage Transition', 'industry-stage-transition', 'Plan transition to next funding stage with industry checklist', 'planning', ARRAY['pre-seed', 'seed', 'series-a'], ARRAY['all'], 1, true, 'system', '{"workflow": "3-step", "industry_aware": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_industry_stage', 1, 'Generate stage checklist', 
   E'You are a fundraising advisor creating a stage transition checklist.\n\n<stage_checklists>\n{{stage_checklists}}\n</stage_checklists>\n\n<current_stage>{{current_stage}}</current_stage>\n<target_stage>{{target_stage}}</target_stage>\n<startup_status>{{startup_status}}</startup_status>\n\nCreate a prioritized checklist for transitioning from current to target stage:\n1. List all required tasks from the stage checklist\n2. Mark which are complete vs pending\n3. Prioritize pending tasks (P1, P2)\n4. Estimate timeline for each\n5. Calculate overall readiness percentage', 
   '{"current_stage": "string", "target_stage": "string", "startup_status": "object", "stage_checklists": "array"}'::jsonb, 
   '{"priority_1": "array", "priority_2": "array", "timeline_summary": "array", "readiness_percentage": "number"}'::jsonb, 
   'gemini', 2000, 0.3),
   
  ('pack_industry_stage', 2, 'Check investor expectations', 
   E'You are an investor relations expert assessing stage readiness.\n\n<investor_expectations>\n{{investor_expectations}}\n</investor_expectations>\n\n<startup_profile>\n{{startup_profile}}\n</startup_profile>\n<stage>{{target_stage}}</stage>\n\nEvaluate readiness for the target stage:\n1. List what investors expect\n2. Rate alignment for each\n3. Calculate readiness score\n4. List critical gaps to close', 
   '{"startup_profile": "object", "target_stage": "string", "investor_expectations": "object"}'::jsonb, 
   '{"readiness_score": "number", "gaps_to_close": "array", "critical_blockers": "array"}'::jsonb, 
   'gemini', 1500, 0.3),
   
  ('pack_industry_stage', 3, 'Compare benchmarks', 
   E'You are an industry analyst comparing metrics to stage benchmarks.\n\n<benchmarks>\n{{benchmarks}}\n</benchmarks>\n\n<startup_metrics>\n{{startup_metrics}}\n</startup_metrics>\n<target_stage>{{target_stage}}</target_stage>\n\nCompare startup metrics against stage-appropriate benchmarks:\n1. List relevant benchmarks for target stage\n2. Compare current metrics\n3. Rate as above/at/below average\n4. Calculate overall score\n5. Recommend improvement priorities', 
   '{"startup_metrics": "object", "target_stage": "string", "benchmarks": "array"}'::jsonb, 
   '{"comparisons": "array", "overall_score": "number", "improvement_priorities": "array"}'::jsonb, 
   'gemini', 1500, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- 5. Industry Health Check Pack (for ongoing monitoring)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_industry_health', 'Industry Health Check', 'industry-health-check', 'Weekly/monthly health check against industry standards', 'validation', ARRAY['pre-seed', 'seed', 'series-a'], ARRAY['all'], 1, true, 'system', '{"workflow": "2-step", "industry_aware": true, "frequency": "weekly"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_industry_health', 1, 'Scan warning signs', 
   E'You are a startup health monitor performing a routine check.\n\n<warning_signs>\n{{warning_signs}}\n</warning_signs>\n\n<current_signals>\n{{current_signals}}\n</current_signals>\n<last_check_date>{{last_check_date}}</last_check_date>\n\nPerform a health scan:\n1. Check each warning sign trigger\n2. Identify any active warnings\n3. Compare to previous check\n4. Rate overall startup health\n5. Recommend immediate actions if needed', 
   '{"current_signals": "object", "warning_signs": "array", "last_check_date": "string"}'::jsonb, 
   '{"active_warnings": "array", "overall_health": "string", "changes_since_last": "array", "immediate_actions": "array"}'::jsonb, 
   'gemini', 1500, 0.3),
   
  ('pack_industry_health', 2, 'Compare benchmarks', 
   E'You are an industry analyst tracking progress.\n\n<benchmarks>\n{{benchmarks}}\n</benchmarks>\n\n<startup_metrics>\n{{startup_metrics}}\n</startup_metrics>\n<previous_metrics>\n{{previous_metrics}}\n</previous_metrics>\n\nTrack progress against benchmarks:\n1. Compare current vs previous metrics\n2. Rate improvement or decline\n3. Compare to industry benchmarks\n4. Calculate trend direction\n5. Highlight metrics needing attention', 
   '{"startup_metrics": "object", "previous_metrics": "object", "benchmarks": "array"}'::jsonb, 
   '{"comparisons": "array", "overall_score": "number", "trend": "string", "attention_needed": "array"}'::jsonb, 
   'gemini', 1500, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();


-- ============================================================================
-- ROUTING-REQUIRED PACKS (referenced by feature_pack_routing)
-- problem-validation, lean-canvas-generator, investor-pitch-builder
-- Prompt text aligned with prompt-library (02-ideation, 11-lean-canvas, 09-pitch)
-- ============================================================================

-- Problem Validation (onboarding step 1; library: 02-ideation-improved Problem Snapshot)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_problem_validation', 'Problem Validation', 'problem-validation', 'Sharpen problem into who/struggle/why-now for onboarding', 'validation', ARRAY['idea', 'pre-seed'], ARRAY['all'], 1, true, 'system', '{"workflow": "1-step", "onboarding_step": 1}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_problem_validation', 1, 'Create problem snapshot',
   E'You are a startup advisor. Transform this fuzzy problem into a crisp who/struggle/why-now statement.\n\nTarget audience: {{target_audience}}\nMain challenge: {{main_challenge}}\nIndustry: {{industry}}\n\nOutput: who (specific), struggle (quantified if possible), why_now (timing trigger), statement (one memorable sentence).',
   '{"target_audience": "string", "main_challenge": "string", "industry": "string"}'::jsonb,
   '{"who": "string", "struggle": "string", "why_now": "string", "statement": "string"}'::jsonb,
   'gemini', 1500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Lean Canvas Generator (library: 11-lean-canvas-expert-agent)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_lean_canvas', 'Lean Canvas Generator', 'lean-canvas-generator', 'Generate Lean Canvas from startup context', 'canvas', ARRAY['idea', 'pre-seed', 'seed'], ARRAY['all'], 1, true, 'system', '{"workflow": "multi-step"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_lean_canvas', 1, 'Extract startup context',
   E'You are a Lean Canvas expert. From the following startup description, extract structured fields for a Lean Canvas: problem (top 3), customer segments, value proposition, solution (key features), channels, revenue streams, key metrics, unfair advantage.\n\nStartup: {{startup_description}}\nIndustry: {{industry}}\n\nOutput each field as a short list or paragraph suitable for canvas boxes.',
   '{"startup_description": "string", "industry": "string"}'::jsonb,
   '{"problem": "array", "customer_segments": "string", "value_proposition": "string", "solution": "string", "channels": "array", "revenue_streams": "array", "key_metrics": "array", "unfair_advantage": "string"}'::jsonb,
   'gemini', 2000, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Investor Pitch Builder (library: 09-pitch-prompts-improved, 09.1-pitch-deck)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_investor_pitch', 'Investor Pitch Builder', 'investor-pitch-builder', 'Build problem/solution/market slides for pitch deck', 'pitch', ARRAY['pre-seed', 'seed', 'series-a'], ARRAY['all'], 1, true, 'system', '{"workflow": "multi-step"}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature) VALUES
  ('pack_investor_pitch', 1, 'Generate problem slide',
   E'You are a pitch coach. Create a concise problem slide for an investor deck.\n\nCompany: {{company_name}}\nProblem: {{problem}}\nTarget customer: {{target_customer}}\nIndustry: {{industry}}\n\nOutput: headline (one line), problem_description (2-3 sentences), key_pain_points (bullets).',
   '{"company_name": "string", "problem": "string", "target_customer": "string", "industry": "string"}'::jsonb,
   '{"headline": "string", "problem_description": "string", "key_pain_points": "array"}'::jsonb,
   'gemini', 1500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();


-- ============================================================================
-- INDUSTRY-SPECIFIC PROMPT PACKS
-- ============================================================================

-- FinTech Validation Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_fintech_validation', 'FinTech Validation', 'fintech-validation', 'FinTech-specific validation with compliance and regulatory focus', 'validation', ARRAY['pre-seed', 'seed'], ARRAY['fintech'], 1, true, 'system', '{"industry_specific": true, "compliance_focus": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- SaaS Validation Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_saas_validation', 'SaaS Validation', 'saas-validation', 'SaaS-specific validation with PLG and usage metrics focus', 'validation', ARRAY['pre-seed', 'seed'], ARRAY['saas', 'ai_saas'], 1, true, 'system', '{"industry_specific": true, "plg_focus": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- Healthcare Validation Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_healthcare_validation', 'Healthcare Validation', 'healthcare-validation', 'Healthcare-specific validation with regulatory and clinical focus', 'validation', ARRAY['pre-seed', 'seed'], ARRAY['healthcare'], 1, true, 'system', '{"industry_specific": true, "regulatory_focus": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

-- eCommerce Validation Pack
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata) VALUES
  ('pack_ecommerce_validation', 'eCommerce Validation', 'ecommerce-validation', 'eCommerce-specific validation with unit economics focus', 'validation', ARRAY['pre-seed', 'seed'], ARRAY['ecommerce_pure', 'retail_ecommerce'], 1, true, 'system', '{"industry_specific": true, "unit_economics_focus": true}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();


-- ============================================================================
-- PROMPT TEMPLATE REGISTRY
-- Maps template IDs to their purpose and required playbook sections
-- ============================================================================

INSERT INTO prompt_template_registry (id, name, description, playbook_sections, model_preference, max_tokens) VALUES
  ('TEMPLATE_1_INDUSTRY_CONTEXT', 'Industry Context Injection', 'Base template for industry context', ARRAY['all'], 'any', 3000),
  ('TEMPLATE_2_INVESTOR_EXPECTATIONS', 'Investor Expectations Check', 'Assess stage readiness per industry', ARRAY['investor_expectations'], 'gemini', 1500),
  ('TEMPLATE_3_FAILURE_PATTERN', 'Failure Pattern Detector', 'Identify known failure patterns', ARRAY['failure_patterns'], 'claude', 2000),
  ('TEMPLATE_4_BENCHMARK', 'Benchmark Comparison', 'Score against industry benchmarks', ARRAY['benchmarks'], 'gemini', 1500),
  ('TEMPLATE_5_TERMINOLOGY', 'Terminology Validator', 'Check industry language', ARRAY['terminology'], 'gemini', 1000),
  ('TEMPLATE_6_GTM_STRATEGY', 'GTM Strategy Advisor', 'Recommend GTM approach', ARRAY['gtm_patterns'], 'gemini', 2000),
  ('TEMPLATE_7_DECISION_FRAMEWORK', 'Decision Framework Guide', 'Apply decision logic', ARRAY['decision_frameworks'], 'claude', 1500),
  ('TEMPLATE_8_INVESTOR_QUESTIONS', 'Investor Question Prep', 'Prepare for investor Q&A', ARRAY['investor_questions'], 'claude', 2500),
  ('TEMPLATE_9_WARNING_SIGNS', 'Warning Sign Monitor', 'Detect early warnings', ARRAY['warning_signs'], 'gemini', 1500),
  ('TEMPLATE_10_STAGE_CHECKLIST', 'Stage Checklist Generator', 'Generate stage tasks', ARRAY['stage_checklists'], 'gemini', 2000)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  playbook_sections = EXCLUDED.playbook_sections;


-- ============================================================================
-- FEATURE-TO-PACK ROUTING
-- Maps features/routes to appropriate packs for auto-selection
-- Idempotent: delete existing routing rows we manage, then insert
-- ============================================================================

DELETE FROM feature_pack_routing
WHERE (feature_route, COALESCE(intent, ''), default_pack_slug) IN (
  ('/onboarding/*', '', 'problem-validation'),
  ('/validator', 'validate', 'industry-validation'),
  ('/validator', 'quick-check', 'industry-health-check'),
  ('/lean-canvas', 'generate', 'lean-canvas-generator'),
  ('/pitch-deck', 'generate', 'investor-pitch-builder'),
  ('/pitch-deck', 'prep', 'industry-pitch-prep'),
  ('/tasks', 'generate', 'industry-stage-transition'),
  ('/gtm', 'strategy', 'industry-gtm-strategy'),
  ('/chat', 'validate', 'industry-validation'),
  ('/chat', 'pitch', 'industry-pitch-prep'),
  ('/chat', 'gtm', 'industry-gtm-strategy'),
  ('/dashboard', 'health', 'industry-health-check')
);

INSERT INTO feature_pack_routing (feature_route, intent, default_pack_slug, priority) VALUES
  ('/onboarding/*', NULL, 'problem-validation', 10),
  ('/validator', 'validate', 'industry-validation', 10),
  ('/validator', 'quick-check', 'industry-health-check', 5),
  ('/lean-canvas', 'generate', 'lean-canvas-generator', 10),
  ('/pitch-deck', 'generate', 'investor-pitch-builder', 10),
  ('/pitch-deck', 'prep', 'industry-pitch-prep', 8),
  ('/tasks', 'generate', 'industry-stage-transition', 10),
  ('/gtm', 'strategy', 'industry-gtm-strategy', 10),
  ('/chat', 'validate', 'industry-validation', 5),
  ('/chat', 'pitch', 'industry-pitch-prep', 5),
  ('/chat', 'gtm', 'industry-gtm-strategy', 5),
  ('/dashboard', 'health', 'industry-health-check', 10);


-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This seed file creates:
-- - 5 industry-aware prompt packs (validation, pitch, gtm, stage, health)
-- - 3 routing-required packs (problem-validation, lean-canvas-generator, investor-pitch-builder)
-- - 4 industry-specific packs (fintech, saas, healthcare, ecommerce)
-- - 10 prompt template registry entries
-- - 12 feature-to-pack routing rules
--
-- All packs use ON CONFLICT to safely handle re-runs.
-- Prompt text aligned with tasks/01-playbooks/prompt-library where applicable.
-- ============================================================================
