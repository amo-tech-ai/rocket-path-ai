-- ============================================================================
-- Seed: Startup Planning Stages Expert Prompt Packs
-- Source: tasks/prompt-library/13-startup-planning-stages-expert.md
-- Contains: 3 prompt packs with ~5 steps total
-- Agent: Stage Advisor Agent | Model: Gemini 3 Pro
-- ============================================================================

-- Pack 1: Stage Assessment
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_stage_assessment',
  'Startup Stage Assessment',
  'startup-stage-assessment',
  'Objectively determine current startup stage with gap analysis and stage-appropriate focus',
  'planning',
  ARRAY['idea', 'pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "stage-advisor", "library_ref": "13-startup-planning-stages-expert", "expertise": "stage indicators, milestones, premature scaling"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_stage_assessment', 1, 'Determine startup stage objectively',
   E'You are a startup stage expert who has guided 500+ startups from idea to growth.\n\n**The 5 Stages:**\n| Stage | Focus | Duration | Exit Criteria |\n|-------|-------|----------|---------------|\n| 1. Idea | Problem discovery | 1-3 months | Clear problem, solution hypothesis |\n| 2. Validation | Product-market fit | 3-12 months | Repeatable customer acquisition |\n| 3. Efficiency | Unit economics | 6-18 months | Positive unit economics |\n| 4. Growth | Scaling | 1-3 years | Market leadership trajectory |\n| 5. Expansion | New markets | Ongoing | Diversified revenue |\n\n**Stage Determination Matrix:**\n| Indicator | Idea | Validation | Efficiency | Growth |\n|-----------|------|------------|------------|--------|\n| Customer interviews | <20 | 20-100 | 100+ | N/A |\n| Paying customers | 0 | 1-100 | 100-1000 | 1000+ |\n| Monthly retention | Unknown | 20-60% | 60-80% | 80%+ |\n| Revenue | $0 | $1-$50K | $50K-$500K | $500K+ |\n| CAC payback | Unknown | >18 mo | 6-18 mo | <6 mo |\n| Growth rate | N/A | 5-15% | 10-20% | 15-30%+ |\n\n**Assessment Questions:**\n- Have you talked to 50+ customers?\n- Are paying customers using weekly?\n- What''s monthly retention rate?\n- What''s your CAC and LTV?\n- Are you growing 15%+ MoM?\n\n**Startup Information:**\nCustomer interviews: {{customer_interviews}}\nPaying customers: {{paying_customers}}\nRetention: {{retention_rate}}\nRevenue: {{revenue}}\nGrowth rate: {{growth_rate}}\n\nDetermine stage with justification.',
   '{"customer_interviews": "string", "paying_customers": "string", "retention_rate": "string", "revenue": "string", "growth_rate": "string"}'::jsonb,
   '{"current_stage": "string", "stage_completion_pct": "number", "key_gaps": "array", "stage_appropriate_focus": "array", "stage_inappropriate_activities": "array"}'::jsonb,
   'gemini', 2500, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 2: Stage-Specific Guide (Idea + Validation)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_early_stage_guide',
  'Early Stage Guide (Idea to Validation)',
  'early-stage-guide',
  'Guide founders through idea and validation stages to product-market fit',
  'planning',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "stage-advisor", "library_ref": "13-startup-planning-stages-expert", "expertise": "problem discovery, MVP, PMF signals"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_early_stage_guide', 1, 'Create idea-to-validation roadmap',
   E'You are guiding a founder through the early stages.\n\n**Idea Stage Focus (0→1):**\n- Primary: Validate real problem exists\n- Secondary: Develop solution hypothesis\n- Tertiary: Build something to get reactions\n\n**Idea Stage Milestones:**\n| Week | Milestone | Exit Criteria |\n|------|-----------|---------------|\n| 1-2 | Problem Hypothesis | Clear problem, customer profile |\n| 3-4 | Problem Interviews | 20+ validated conversations |\n| 5-6 | Solution Hypothesis | Clear solution direction |\n| 7-8 | MVP Spec | Buildable in <4 weeks |\n| 9-12 | MVP Build | Working prototype |\n\n**Validation Stage Focus:**\n- Primary: Achieve product-market fit\n- PMF = Customers so happy they tell others\n\n**PMF Indicators:**\n| Signal | Weak | Moderate | Strong |\n|--------|------|----------|--------|\n| Monthly retention | <20% | 20-40% | >40% |\n| NPS | <0 | 0-30 | >30 |\n| Organic growth | 0% | 10-30% | >30% |\n| "Very disappointed" | <20% | 20-40% | >40% |\n\n**Sean Ellis PMF Test:**\n"How would you feel if you could no longer use [product]?"\n>40% very disappointed = PMF\n\n**Pivot vs. Persevere:**\n| Signal | Persevere | Pivot |\n|--------|-----------|-------|\n| Retention | >30% | <15% |\n| Feedback | "Love it but..." | "Not for me" |\n| Founder energy | Energized | Depleted |\n\n**Current Situation:**\nStage: {{current_stage}}\nProgress: {{progress_summary}}\nChallenges: {{challenges}}\n\nCreate the stage-appropriate roadmap.',
   '{"current_stage": "string", "progress_summary": "string", "challenges": "string"}'::jsonb,
   '{"roadmap": "array", "customer_development_plan": "object", "mvp_scope": "object", "pmf_scorecard": "object", "pivot_persevere_recommendation": "string"}'::jsonb,
   'gemini', 3000, 0.4),

  ('pack_early_stage_guide', 2, 'Assess PMF and provide recommendations',
   E'You are assessing product-market fit for a startup.\n\n**PMF Assessment Framework:**\n\n**The Sean Ellis Test:**\n"How would you feel if you could no longer use [product]?"\n- Very disappointed: >40% = PMF ✓\n- Somewhat disappointed: 40-50%\n- Not disappointed: <40% = No PMF\n\n**PMF Signals:**\n| Signal | Weak | Moderate | Strong |\n|--------|------|----------|--------|\n| Monthly retention | <20% | 20-40% | >40% |\n| NPS score | <0 | 0-30 | >30 |\n| Organic growth | 0% | 10-30% | >30% |\n| Sales cycle | Months | Weeks | Days |\n| Customer effort | Heroic | Doable | Easy |\n\n**Current Metrics:**\nRetention: {{retention_rate}}\nNPS: {{nps_score}}\nOrganic growth: {{organic_growth}}\nCustomer feedback: {{customer_feedback}}\n\nProvide PMF assessment with gap analysis.',
   '{"retention_rate": "string", "nps_score": "string", "organic_growth": "string", "customer_feedback": "string"}'::jsonb,
   '{"pmf_score": "number", "pmf_achieved": "boolean", "gap_analysis": "array", "recommendations": "array", "6_month_plan": "object"}'::jsonb,
   'gemini', 2500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: Fundraising Readiness by Stage
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_stage_fundraising_readiness',
  'Stage-Appropriate Fundraising Readiness',
  'stage-fundraising-readiness',
  'Prepare founders for stage-appropriate fundraising with gap analysis',
  'funding',
  ARRAY['idea', 'pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "stage-advisor", "library_ref": "13-startup-planning-stages-expert", "expertise": "round requirements, investor expectations by stage"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_stage_fundraising_readiness', 1, 'Assess fundraising readiness for stage',
   E'You are assessing fundraising readiness by stage.\n\n**Requirements by Round:**\n| Stage | Round | Amount | What Investors Want | Valuation |\n|-------|-------|--------|---------------------|----------|\n| Idea | Pre-Seed | $100K-$1M | Team, vision, early traction | $2-$10M |\n| Validation | Seed | $1M-$4M | PMF signals, retention | $5-$20M |\n| Efficiency | Series A | $5M-$15M | Proven PMF, clear scale path | $20-$80M |\n| Growth | Series B | $20M-$50M | Scaling metrics, category lead | $100-$400M |\n\n**Pre-Seed Requirements:**\n- Compelling founder story\n- Clear problem definition\n- MVP or prototype\n- Early signal (waitlist, LOIs)\n\n**Seed Requirements:**\n- Working product\n- 100+ users/customers\n- Early retention (>20% M1)\n- $10K-$50K MRR or strong engagement\n- Clear PMF hypothesis\n\n**Series A Requirements:**\n- Proven PMF (>40% "very disappointed")\n- $1M+ ARR (or 100K+ active users)\n- Strong retention (>80% net)\n- Unit economics approaching positive\n- Repeatable acquisition channel\n- Scalable team\n\n**Current Status:**\nCurrent stage: {{current_stage}}\nTarget round: {{target_round}}\nTeam: {{team_summary}}\nProduct status: {{product_status}}\nTraction: {{traction_metrics}}\nRetention: {{retention_rate}}\nRevenue: {{revenue}}\n\nAssess readiness with gap analysis.',
   '{"current_stage": "string", "target_round": "string", "team_summary": "string", "product_status": "string", "traction_metrics": "string", "retention_rate": "string", "revenue": "string"}'::jsonb,
   '{"readiness_score": "number", "requirements_checklist": "array", "gaps": "array", "timeline_to_ready": "string", "investor_targeting": "object", "materials_checklist": "array"}'::jsonb,
   'gemini', 3000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification
SELECT 'Stage Planning packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'stage-advisor';
