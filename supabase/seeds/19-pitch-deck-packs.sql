-- ============================================================================
-- Seed: Investor Docs & Pitch Deck Expert Prompt Packs
-- Source: tasks/prompt-library/12-investor-docs-pitch-deck-expert.md
-- Contains: 4 prompt packs with ~7 steps total
-- Agent: Deck Writer Agent | Model: Claude Sonnet 4.5
-- ============================================================================

-- Pack 1: Pitch Deck Generation (10-Slide)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_pitch_deck_generation',
  'Pitch Deck Generation',
  'pitch-deck-generation',
  'Generate a complete 10-slide investor pitch deck that closes rounds',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "deck-writer", "library_ref": "12-investor-docs-pitch-deck-expert", "expertise": "storytelling, investor psychology, visual communication"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_pitch_deck_generation', 1, 'Generate complete 10-slide deck structure',
   E'You are a former VC partner and pitch deck specialist who has reviewed 5,000+ decks and helped companies raise $500M+.\n\n**The 10-Slide Standard:**\n| Slide | Purpose | Key Elements | Time |\n|-------|---------|--------------|------|\n| 1. Cover | Hook + credibility | Company name, one-liner, logo | 5 sec |\n| 2. Problem | Create tension | Specific pain, quantified cost | 30 sec |\n| 3. Solution | Release tension | How you solve it, demo | 30 sec |\n| 4. Market | Show opportunity | TAM/SAM/SOM, growth rate | 20 sec |\n| 5. Product | Show what you''ve built | Screenshots, differentiation | 30 sec |\n| 6. Traction | Prove it works | Revenue, users, growth rate | 45 sec |\n| 7. Business Model | Show the money | How you make money, unit economics | 20 sec |\n| 8. Competition | Show awareness | Matrix or positioning map | 15 sec |\n| 9. Team | Build trust | Relevant experience | 20 sec |\n| 10. Ask | Close the deal | Amount, use of funds, milestones | 30 sec |\n\n**Industry-Specific Modifications:**\n| Industry | Lead With | Emphasize | De-emphasize |\n|----------|-----------|-----------|-------------|\n| FinTech | Compliance/trust | Regulatory moat | Pure tech |\n| Healthcare | Clinical validation | Outcomes, FDA path | Cool features |\n| SaaS | Metrics + retention | Net retention, CAC | Vision |\n| Marketplace | Liquidity, take rate | Supply quality | GMV alone |\n\n**Company Information:**\nCompany: {{company_name}}\nOne-liner: {{one_liner}}\nIndustry: {{industry}}\nProblem: {{problem_statement}}\nSolution: {{solution_summary}}\nMarket: {{market_size}}\nTraction: {{traction_metrics}}\nTeam: {{team_summary}}\nAsk: {{fundraise_amount}}\nUse of funds: {{use_of_funds}}\n\nGenerate the complete deck structure with content for each slide.',
   '{"company_name": "string", "one_liner": "string", "industry": "string", "problem_statement": "string", "solution_summary": "string", "market_size": "string", "traction_metrics": "string", "team_summary": "string", "fundraise_amount": "string", "use_of_funds": "string"}'::jsonb,
   '{"slides": "array", "speaker_notes": "array", "visual_recommendations": "array", "red_flags_to_avoid": "array"}'::jsonb,
   'claude', 5000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 2: Deck Critique & Review
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_deck_critique',
  'Pitch Deck Critique & Review',
  'deck-critique-review',
  'Review existing pitch deck with VC-level feedback and specific improvements',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "deck-writer", "library_ref": "12-investor-docs-pitch-deck-expert", "expertise": "VC evaluation criteria, deal-killers"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_deck_critique', 1, 'Evaluate and critique pitch deck',
   E'You are a pitch deck expert providing VC-level feedback.\n\n**Evaluation Framework:**\n| Criterion | Weight | Score 1-10 |\n|-----------|--------|------------|\n| First 30 seconds (hook) | 15% | |\n| Problem clarity | 15% | |\n| Solution believability | 10% | |\n| Market opportunity | 10% | |\n| Traction proof | 15% | |\n| Team credibility | 10% | |\n| Ask clarity | 10% | |\n| Visual quality | 10% | |\n| Narrative flow | 5% | |\n\n**Common Deck Failures:**\n| Failure | Example | Fix |\n|---------|---------|-----|\n| Vague problem | "Communication is hard" | Quantify: "Teams lose 8 hrs/week" |\n| Feature dump | "We do X, Y, Z, A, B..." | Focus: "ONE thing better than anyone" |\n| Fake TAM | "Everyone needs this" | Real SAM: "10,000 companies in Y1" |\n| Weak team | "We''re passionate" | Relevant: "Built payments at Stripe" |\n| Unclear ask | "We''re raising money" | Specific: "$1.5M at $6M post" |\n\n**Red Flags That Kill Deals:**\n- "No competition"\n- Typos and errors\n- Too many words (>6 per line)\n- No metrics\n- Defensive tone\n\n**Deck Content:**\n{{deck_content}}\n\n**Industry:**\n{{industry}}\n\nProvide detailed critique with actionable fixes.',
   '{"deck_content": "string", "industry": "string"}'::jsonb,
   '{"overall_score": "number", "score_breakdown": "object", "slide_by_slide_feedback": "array", "top_3_changes": "array", "deal_killer_flags": "array", "comparison_to_successful_decks": "string"}'::jsonb,
   'claude', 4000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: One-Pager Generator
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_one_pager',
  'One-Pager Generator',
  'one-pager-generator',
  'Create the single-page summary investors will forward to their partners',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "deck-writer", "library_ref": "12-investor-docs-pitch-deck-expert", "expertise": "distillation, visual hierarchy"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_one_pager', 1, 'Generate investor one-pager',
   E'You are creating a one-pager that investors will forward.\n\n**One-Pager Structure:**\n| Section | Space | Content |\n|---------|-------|---------|\n| Header | 10% | Logo, name, one-liner, contact |\n| Problem + Solution | 25% | 2-3 sentences each |\n| Market + Traction | 25% | TAM/SAM, key metrics (3-4 max) |\n| Team + Ask | 25% | Key bios (2-3 people), amount + use |\n| Footer | 15% | Website, deck link, next steps |\n\n**Best Practices:**\n- ONE page only\n- 50% visual, 50% text\n- Skimmable in 30 seconds\n- Mobile-readable\n- Action-oriented\n\n**What VCs Look For (in order):**\n1. Team: Do I trust these people?\n2. Market: Is this big enough?\n3. Traction: Have they proven anything?\n4. Ask: Can I size my check?\n\n**Company Information:**\nCompany: {{company_name}}\nOne-liner: {{one_liner}}\nProblem: {{problem_statement}}\nSolution: {{solution_summary}}\nMarket: {{market_size}}\nTraction: {{traction_metrics}}\nTeam: {{team_summary}}\nAsk: {{fundraise_amount}}\nWebsite: {{website}}\nContact: {{contact_info}}\n\nGenerate complete one-pager content.',
   '{"company_name": "string", "one_liner": "string", "problem_statement": "string", "solution_summary": "string", "market_size": "string", "traction_metrics": "string", "team_summary": "string", "fundraise_amount": "string", "website": "string", "contact_info": "string"}'::jsonb,
   '{"one_pager_content": "object", "visual_layout": "object", "headline_hook": "string", "key_metrics_highlight": "array", "forwardable_intro_email": "string"}'::jsonb,
   'claude', 2500, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 4: Pitch Narrative Arc
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_pitch_narrative',
  'Pitch Narrative Arc Builder',
  'pitch-narrative-arc',
  'Build the storytelling structure that creates investor belief and conviction',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "deck-writer", "library_ref": "12-investor-docs-pitch-deck-expert", "expertise": "storytelling, emotional resonance"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_pitch_narrative', 1, 'Build compelling pitch narrative',
   E'You are building the storytelling structure that creates investor belief.\n\n**Startup Story Arc:**\n| Act | Purpose | Emotion |\n|-----|---------|----------|\n| Act 1: Setup | Establish the world, the problem | Tension |\n| Act 2: Conflict | Show current solutions fail | Frustration |\n| Act 3: Hero | Introduce you and your solution | Hope |\n| Act 4: Proof | Show traction and metrics | Belief |\n| Act 5: Vision | Paint the future | Excitement |\n| Act 6: Ask | Call to action | Commitment |\n\n**Narrative Frameworks:**\n| Framework | Structure | Best For |\n|-----------|-----------|----------|\n| Founder Journey | "I experienced this, so I built this" | First-time founders |\n| Market Shift | "The world changed, creating opportunity" | Timing-based |\n| Technology Unlock | "New tech enables what wasn''t possible" | DeepTech, AI |\n| David vs. Goliath | "Incumbents failing, we''re the alternative" | Disruption |\n| Inevitable Future | "This WILL happen, we''re making it faster" | Platforms |\n\n**Emotional Beats:**\n| Beat | When | How |\n|------|------|-----|\n| Hook | First 10 sec | Surprising stat, bold claim |\n| Pain | Problem slide | Make them feel frustration |\n| Relief | Solution slide | "What if there was a way..." |\n| Proof | Traction slide | "And it''s working..." |\n| FOMO | Timing | "This is happening now" |\n| Invitation | Ask slide | "Join us in building..." |\n\n**Company Information:**\nCompany: {{company_name}}\nFounder story: {{founder_story}}\nProblem: {{problem_statement}}\nSolution: {{solution_summary}}\nMarket timing: {{why_now}}\nTraction: {{traction_metrics}}\nVision: {{vision}}\nAsk: {{fundraise_amount}}\n\nBuild the complete narrative arc.',
   '{"company_name": "string", "founder_story": "string", "problem_statement": "string", "solution_summary": "string", "why_now": "string", "traction_metrics": "string", "vision": "string", "fundraise_amount": "string"}'::jsonb,
   '{"narrative_arc": "object", "emotional_beats": "array", "opening_hook": "string", "closing_statement": "string", "story_variations": "object"}'::jsonb,
   'claude', 3500, 0.6)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification
SELECT 'Pitch Deck packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'deck-writer';
