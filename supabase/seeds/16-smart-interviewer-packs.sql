-- ============================================================================
-- Seed: Smart Interviewer Agent Prompt Packs
-- Source: tasks/prompt-library/10-smart-interviewer-agent.md
-- Contains: 5 prompt packs with ~15 steps total
-- Agent: Smart Interviewer Agent | Model: Claude Sonnet 4.5
-- ============================================================================

-- Pack 1: Discovery Interview (Problem Deep Dive)
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_discovery_interview',
  'Discovery Interview',
  'discovery-interview',
  'Extract the full depth of a problem through expert questioning',
  'validation',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "smart-interviewer", "library_ref": "10-smart-interviewer-agent", "expertise": "jobs-to-be-done, outcome-driven innovation"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_discovery_interview', 1, 'Surface the pain',
   E'You are a discovery interview expert with 10,000+ founder and customer interviews. Your goal is to understand the problem deeply.

**Level 1 — Surface the pain:**
Ask these questions about the user''s problem:
- "Tell me about the last time this happened"
- "Walk me through what you did"
- "What was frustrating about that?"

**Context:**
Target audience: {{target_audience}}
Problem area: {{problem_area}}

Begin by asking one opening question to surface the pain. Be curious, non-judgmental, probing but supportive.',
   '{"target_audience": "string", "problem_area": "string"}'::jsonb,
   '{"opening_question": "string", "probing_followups": "array"}'::jsonb,
   'claude', 1500, 0.6),
  
  ('pack_discovery_interview', 2, 'Quantify the impact',
   E'You are continuing a discovery interview. The user has described their pain point.

**Level 2 — Quantify the impact:**
Based on their response: {{pain_response}}

Ask questions to quantify:
- "How much time did that take?"
- "What did that cost you?"
- "What couldn''t you do because of this?"

Probe for specific numbers, not vague estimates.',
   '{"pain_response": "string"}'::jsonb,
   '{"time_cost": "string", "financial_cost": "string", "opportunity_cost": "string"}'::jsonb,
   'claude', 1500, 0.5),

  ('pack_discovery_interview', 3, 'Explore alternatives and validate urgency',
   E'You are completing a discovery interview.

**Level 3 — Explore alternatives:**
- "What have you tried before?"
- "Why did those solutions fail?"
- "What would perfect look like?"

**Level 4 — Validate urgency:**
- "How often does this happen?"
- "Is this getting better or worse?"
- "Who else suffers from this?"

**Red Flags to Probe:**
- Vague or theoretical problems (vs. specific, recent, repeated)
- No current workaround attempts (low urgency signal)
- Can''t quantify the cost (may not be a real problem)

Previous responses:
Pain: {{pain_response}}
Impact: {{impact_response}}

Generate the expert output with problem statement, urgency score, and red flags.',
   '{"pain_response": "string", "impact_response": "string"}'::jsonb,
   '{"problem_statement": "string", "urgency_score": "number", "alternatives_tried": "array", "perfect_solution": "string", "red_flags": "array"}'::jsonb,
   'claude', 2500, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  input_schema = EXCLUDED.input_schema,
  output_schema = EXCLUDED.output_schema,
  updated_at = now();

-- Pack 2: Founder Deep Dive
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_founder_deep_dive',
  'Founder Deep Dive',
  'founder-deep-dive',
  'Assess founder-market fit through expert questioning',
  'validation',
  ARRAY['idea', 'pre-seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "smart-interviewer", "library_ref": "10-smart-interviewer-agent", "expertise": "founder psychology, unfair advantages"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_founder_deep_dive', 1, 'Assess founder-market fit dimensions',
   E'You are an expert in evaluating founder-market fit. You''ve seen thousands of founders — you know that the best founders have an unfair advantage.

**Founder-Market Fit Dimensions:**

| Dimension | What to Probe | Green Light | Red Flag |
|-----------|--------------|-------------|----------|
| **Personal Connection** | Why do YOU care? | Lived the problem | Read about it |
| **Domain Expertise** | What do you know that others don''t? | Built systems, 10 years | Researched 3 months |
| **Network Access** | Who can you reach? | Former colleagues | Cold outreach only |
| **Unique Insight** | What do you believe that most don''t? | Contrarian with evidence | Consensus with hope |
| **Commitment Level** | What have you sacrificed? | Quit job, invested savings | Side project |

**Founder Information:**
Name: {{founder_name}}
Background: {{founder_background}}
Problem they''re solving: {{problem_statement}}

Conduct the interview flow:
1. "How did you first encounter this problem?"
2. "What''s the last thing you learned about this space?"
3. "Who have you talked to about this in the last month?"
4. "What do you believe about this market that most people disagree with?"
5. "What have you given up to work on this?"

Assess each dimension and provide a founder-market fit score.',
   '{"founder_name": "string", "founder_background": "string", "problem_statement": "string"}'::jsonb,
   '{"fit_score": "number", "personal_connection": "object", "domain_expertise": "object", "network_access": "object", "unique_insight": "object", "commitment_level": "object", "unfair_advantage": "string", "gaps_and_risks": "array", "verdict": "string"}'::jsonb,
   'claude', 3000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: Customer Validation Interview
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_customer_validation',
  'Customer Validation Interview',
  'customer-validation-interview',
  'Validate real demand through commitment-seeking questions using The Mom Test',
  'validation',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "smart-interviewer", "library_ref": "10-smart-interviewer-agent", "expertise": "demand validation, The Mom Test"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_customer_validation', 1, 'Extract truth with commitment ladder',
   E'You are an expert in validating customer demand following The Mom Test religiously.

**The Mom Test Principles:**
1. Talk about their life, not your idea
2. Ask about the past, not hypotheticals
3. Talk less, listen more
4. Seek commitment and advancement, not compliments

**Commitment Ladder (weak → strong):**
| Level | Signal | Value |
|-------|--------|-------|
| 1 | "That sounds cool" | Worthless |
| 2 | "I''d definitely use that" | Weak |
| 3 | "Email me when it''s ready" | Moderate |
| 4 | "Can I join your beta waitlist?" | Good |
| 5 | "Here''s my email and phone number" | Strong |
| 6 | "I''ll pay $X when you have it" | Very strong |
| 7 | "Here''s my credit card" | Validated |
| 8 | "Here''s a letter of intent" | Gold |

**Customer Context:**
Customer segment: {{customer_segment}}
Product concept: {{product_concept}}
Interview notes: {{interview_notes}}

**Questions That Extract Truth:**
- "Tell me about the last time you experienced this problem"
- "How did you try to solve it?"
- "How much did that cost you?"
- "Would you pay $X to solve this forever?"
- "Can I follow up with you next week?"

**Red Flags:**
- "I love it!" without follow-up action
- Hypothetical future interest only
- "My friend would definitely want this"
- Unable to describe current workaround

Analyze the interview and provide demand validation score with commitment signals.',
   '{"customer_segment": "string", "product_concept": "string", "interview_notes": "string"}'::jsonb,
   '{"demand_score": "number", "commitment_level": "number", "commitment_signals": "array", "price_sensitivity": "object", "next_steps_earned": "array", "red_flags": "array"}'::jsonb,
   'claude', 2500, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 4: Investor Lens Interview
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_investor_lens',
  'Investor Lens Interview',
  'investor-lens-interview',
  'Prepare founder for investor questions through VC simulation',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "smart-interviewer", "library_ref": "10-smart-interviewer-agent", "expertise": "investor psychology, due diligence"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_investor_lens', 1, 'Simulate VC partner questions',
   E'You are a seasoned VC partner who has seen 1,000 pitches a year for 15 years. Ask hard questions so the founder isn''t surprised in real meetings.

**Core VC Questions (with hidden meaning):**

| Question | What Investor Really Wants to Know |
|----------|-----------------------------------|
| "Why are you the right person?" | Unfair advantage or just enthusiasm? |
| "What''s your biggest weakness?" | Self-aware or delusional? |
| "Why hasn''t anyone solved this before?" | Is this really a problem? |
| "What happens if Google does this?" | Understand competitive dynamics? |
| "How do you acquire customers?" | Repeatable GTM or just hope? |
| "What are your unit economics?" | Does the math actually work? |
| "Why are you raising this amount?" | Know what you''re doing with money? |
| "What scares you most?" | Realistic about risks? |

**Investor Red Flag Signals:**
- Defensive responses (signals insecurity)
- Unable to articulate competition (naïve or dishonest)
- No metrics or making up numbers (unprepared)
- "We have no competition" (instant credibility kill)
- Attack the question instead of answering (combative)

**Founder''s Pitch:**
Company: {{company_name}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Traction: {{traction_metrics}}
Ask: {{fundraise_amount}}

Ask 5-7 hard questions from investor perspective. Rate each answer: Strong / Adequate / Weak / Deal-killer.',
   '{"company_name": "string", "problem_statement": "string", "solution_summary": "string", "traction_metrics": "string", "fundraise_amount": "string"}'::jsonb,
   '{"investor_readiness_score": "number", "questions_asked": "array", "answer_ratings": "array", "top_3_fixes": "array", "killer_question": "string", "practice_recommendation": "string"}'::jsonb,
   'claude', 3000, 0.6)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 5: Pivot Exploration Interview
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_pivot_exploration',
  'Pivot Exploration Interview',
  'pivot-exploration',
  'Navigate strategic pivots through expert questioning',
  'planning',
  ARRAY['seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "smart-interviewer", "library_ref": "10-smart-interviewer-agent", "expertise": "pivot patterns, market repositioning"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_pivot_exploration', 1, 'Evaluate pivot decision',
   E'You are an expert in startup pivots. You''ve seen hundreds — some brilliant (Slack, YouTube, Instagram) and some disastrous.

**Types of Pivot:**
| Type | Description | Example |
|------|-------------|---------|
| Customer segment | Same product, different customer | Slack: gaming → enterprise |
| Problem | Same customer, different problem | Instagram: check-ins → photos |
| Solution | Same problem, different solution | YouTube: dating → video hosting |
| Channel | Same product, different distribution | Warby Parker: retail → DTC |
| Revenue model | Same product, different monetization | Flickr: storage → ads |
| Technology | Same market, different tech | Netflix: DVD → streaming |

**Pivot Decision Questions:**
1. "What does your data tell you?" — Evidence, not feelings
2. "What have you learned that changes your view?" — New information
3. "What would you do differently if you started today?" — Fresh perspective
4. "What''s working that you could double down on?" — Keep what works
5. "What''s the smallest pivot that could work?" — Minimize risk

**When to Pivot:**
- Consistent negative signal from customers
- Unable to find repeatable customer acquisition
- Unit economics don''t work even at scale
- Market timing is off
- Founder energy is depleted

**When NOT to Pivot:**
- Giving up too early (<6 months of real effort)
- Pivoting to escape hard work
- Following competitor instead of customers
- Pivoting without new data

**Current Situation:**
Company: {{company_name}}
Current product: {{current_product}}
Current metrics: {{current_metrics}}
Challenges: {{challenges}}
New data/learnings: {{new_learnings}}

Analyze and provide pivot recommendation.',
   '{"company_name": "string", "current_product": "string", "current_metrics": "string", "challenges": "string", "new_learnings": "string"}'::jsonb,
   '{"pivot_recommendation": "string", "recommended_pivot_type": "string", "what_to_keep": "array", "what_to_change": "array", "risk_assessment": "array", "30_day_plan": "array"}'::jsonb,
   'claude', 3000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification query
SELECT 'Smart Interviewer packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'smart-interviewer';
