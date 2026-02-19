-- supabase/seeds/23-26-low-priority-packs.sql
-- Description: Final 4 low-priority prompt packs (Product, Funding, Founder Fit, Pitch)
-- Seeds: 23, 24, 25, 26

BEGIN;

-- =============================================================================
-- SEED 23: PRODUCT PACKS (2 Packs)
-- =============================================================================

INSERT INTO public.prompt_packs (id, slug, title, description, category, stage_tags, industry_tags)
VALUES 
('pack_product_spec', 'product-spec-ai', 'Product Spec Generator', 'Turn your idea into a detailed one-pager product spec including name, core problem, and user flow.', 'product', ARRAY['ideation', 'validation'], ARRAY['all']),
('pack_product_strategy', 'product-roadmap-strategy', 'Product Roadmap & Goals', 'Develop solution goals and a high-impact roadmap with metrics for the next 12 months.', 'product', ARRAY['early_adoption', 'growth'], ARRAY['all'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.prompt_pack_steps (pack_id, step_order, purpose, prompt_template, output_schema)
VALUES
('pack_product_spec', 1, 'Generate Product Spec', 'I have an idea for a product and I want to turn it into a simple, clear product spec. Here''s what I know so far:

- **What it is or does:** {{business_description}}
- **Who it''s for:** {{target_user}}
- **Why it matters:** {{core_problem}}
- **Important features:** {{proposed_features}}

Take this and return a plain text product spec with the following sections:
- **Product Name:** [suggested name]
- **One-Liner:** [what it does, for whom, and why]
- **Target User:** [who it''s for]
- **Core Problem:** [the main pain point it solves]
- **Key Features:** Feature 1, Feature 2, Feature 3
- **User Flow:** What happens first -> next -> how the user completes their goal
- **Out of Scope:** Anything not being built for now', '{"type":"object","properties":{"spec":{"type":"string"}}}'),

('pack_product_strategy', 1, 'Define Solution Goals', 'I''m building a product that helps {{target_user}} solve {{core_problem}} using {{product_approach}}.

Return a Markdown table with the following columns:
| Problem to Solve | Why It Matters | Impact if Solved | How to Measure Success |', '{"type":"object","properties":{"goals_table":{"type":"string"}}}'),

('pack_product_strategy', 2, 'Build 12-Month Roadmap', 'I''m building a product that helps {{target_user}} solve {{core_problem}}. Our main goals for the next 12 months are: {{top_goals}}.

Using this and the solution goals from the previous step, return a roadmap table with:
| Feature or Initiative | Priority | Timeline | Resources Needed | Success Metric |', '{"type":"object","properties":{"roadmap_table":{"type":"string"}}}')
ON CONFLICT (pack_id, step_order) DO NOTHING;


-- =============================================================================
-- SEED 24: FUNDING PACKS (2 Packs)
-- =============================================================================

INSERT INTO public.prompt_packs (id, slug, title, description, category, stage_tags, industry_tags)
VALUES 
('pack_fundraising_readiness', 'fundraising-narrative-readiness', 'Fundraising Narrative & Readiness', 'Craft a compelling narrative and audit your investor readiness to reduce perceived risk.', 'funding', ARRAY['growth', 'fundraising'], ARRAY['all']),
('pack_investor_outreach', 'investor-targeting-outreach', 'Investor Targeting & Strategy', 'Generate a targeted investor list and a 3-bucket use of funds plan for your raise.', 'funding', ARRAY['growth', 'fundraising'], ARRAY['all'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.prompt_pack_steps (pack_id, step_order, purpose, prompt_template, output_schema)
VALUES
('pack_fundraising_readiness', 1, 'Draft Fundraising Narrative', 'I''m building a product that helps {{target_user}} solve {{core_problem}}. We are at {{current_stage}} stage based in {{geography}}.

Write a fundraising narrative that clearly answers "why now, why us, why this market." The output should reduce perceived investor risk and unify my story. Keep it compelling but concise.', '{"type":"object","properties":{"narrative":{"type":"string"}}}'),

('pack_fundraising_readiness', 2, 'Readiness Audit', 'Based on our traction: {{current_traction}}, perform an investment readiness check. 

Return a Markdown table with:
| Area | Strengths | Gaps | Why It Matters to Investors |
Cover competitive position, financial health, and scalability.', '{"type":"object","properties":{"readiness_table":{"type":"string"}}}'),

('pack_investor_outreach', 1, 'Target Investor List', 'I''m building a {{industry}} company at {{current_stage}} stage in {{geography}}.

Return a Markdown table with 10 investors:
| Investor Name | Stage Focus | Sector Focus | Geography | Why They''re a Fit |', '{"type":"object","properties":{"investor_list":{"type":"string"}}}'),

('pack_investor_outreach', 2, 'Use of Funds (3 Buckets)', 'We are raising {{raise_amount}} for {{round_type}}. Main uses: {{capital_use_areas}}.

Split the raise into 3 simple buckets with percentages (e.g. 50% Product & Eng, 30% Growth, 20% Ops). Give 2-3 concrete examples for each bucket.', '{"type":"object","properties":{"funds_plan":{"type":"string"}}}')
ON CONFLICT (pack_id, step_order) DO NOTHING;


-- =============================================================================
-- SEED 25: FOUNDER FIT PACK (1 Pack)
-- =============================================================================

INSERT INTO public.prompt_packs (id, slug, title, description, category, stage_tags, industry_tags)
VALUES 
('pack_founder_fit', 'founder-market-fit-audit', 'Founder-Market Fit Audit', 'Evaluate your unique advantages and identify potential blind spots as a founder.', 'founder_fit', ARRAY['ideation', 'onboarding'], ARRAY['all'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.prompt_pack_steps (pack_id, step_order, purpose, prompt_template, output_schema)
VALUES
('pack_founder_fit', 1, 'Founder Connect Analysis', 'Startup: {{business_description}}.
Founder Background: {{experience}}
Motivation: {{personal_motivation}}

Evaluate my founder-market fit. Return:
- Summary of fit
- Standout advantages
- Notable gaps/risks
- Verdict: **Strong/Medium/Weak Fit** + explanation.', '{"type":"object","properties":{"fit_analysis":{"type":"string"}}}'),

('pack_founder_fit', 2, 'Skill Inventory & Market Gaps', 'Hard/Soft Skills: {{skills}}
Target Industry: {{industry}}

Return a Markdown table:
| Skill | Market Demand | Role/Use Case | Gaps/Next Steps |', '{"type":"object","properties":{"skill_table":{"type":"string"}}}'),

('pack_founder_fit', 3, 'Blind Spot Checklist', 'Based on building a {{business_category}} product for {{target_user}}, list 5 likely cognitive biases I may face.

For each: Bias Name, How it shows up, Why it matters, Safeguard to limit it.', '{"type":"object","properties":{"biases_list":{"type":"string"}}}')
ON CONFLICT (pack_id, step_order) DO NOTHING;


-- =============================================================================
-- SEED 26: PITCH PROMPTS PACKS (2 Packs)
-- =============================================================================

INSERT INTO public.prompt_packs (id, slug, title, description, category, stage_tags, industry_tags)
VALUES 
('pack_pitch_creation', 'pitch-deck-builder', 'Pitch Deck Builder', 'Generate a full 10-15 slide narrative structure for your next pitch.', 'pitch', ARRAY['fundraising'], ARRAY['all']),
('pack_pitch_optimization', 'pitch-deck-analyzer', 'Pitch Deck Review & Visuals', 'Critique your existing deck and get design suggestions for impactful visuals.', 'pitch', ARRAY['fundraising'], ARRAY['all'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.prompt_pack_steps (pack_id, step_order, purpose, prompt_template, output_schema)
VALUES
('pack_pitch_creation', 1, 'Deck Narrative Structure', 'Develop a 12-slide pitch deck structure for {{startup_name}} targeting {{defined_audience}}. 

Include: Cover, Problem, Solution, Market, Business Model, Traction, GTM, Competition, Financials, Team, Vision, The Ask. Give bullet points for what each slide should say.', '{"type":"object","properties":{"deck_outline":{"type":"string"}}}'),

('pack_pitch_optimization', 1, 'Persuasion Analysis', 'Review my pitch deck targeting {{defined_audience}}. 

Provide specific recommendations for:
- Problem Urgency
- Product-Market Fit Clarity
- Market Compellingness
- Traction Credibility
- Team Capability', '{"type":"object","properties":{"critique":{"type":"string"}}}'),

('pack_pitch_optimization', 2, 'Investor Pitch Visuals', 'Design visual suggestions for:
1. Market Opportunity (TAM/SAM/SOM)
2. Competitive Landscape (Quadrant)
3. Traction (Growth Chart)
4. Use of Funds (Pie Chart)', '{"type":"object","properties":{"visual_suggestions":{"type":"string"}}}')
ON CONFLICT (pack_id, step_order) DO NOTHING;

COMMIT;
