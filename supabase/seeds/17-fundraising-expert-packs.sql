-- ============================================================================
-- Seed: Fundraising Expert Agent Prompt Packs
-- Source: tasks/prompt-library/15-fundraising-expert-agent.md
-- Contains: 7 prompt packs with ~21 steps total
-- Agent: Fundraising Advisor Agent | Model: Claude Sonnet 4.5
-- ============================================================================

-- Pack 1: Fundraising Readiness Assessment
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_fundraising_readiness',
  'Fundraising Readiness Assessment',
  'fundraising-readiness',
  'Objectively assess whether to raise now with readiness score calculator',
  'funding',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "round requirements, investor expectations"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_fundraising_readiness', 1, 'Calculate readiness score',
   E'You are a fundraising expert who has raised $200M+ across 50+ rounds.

**Readiness Requirements by Round:**

| Round | Minimum Requirements | Nice to Have | Red Flags |
|-------|---------------------|--------------|-----------|
| **Pre-Seed** | Strong team, clear problem, MVP | Early signal, domain expertise | No relevant experience |
| **Seed** | Working product, 100+ users, early retention | $10K+ MRR, 20%+ MoM growth | No users, theoretical |
| **Series A** | PMF proven, $1M+ ARR, 100%+ growth | NRR >100%, CAC payback <12mo | Unclear PMF, high churn |
| **Series B** | Category leader trajectory, $5M+ ARR | Positive unit economics | Slowing growth, poor retention |

**Readiness Score Calculator:**

| Criterion | Weight |
|-----------|--------|
| Team quality | 25% |
| Market size | 15% |
| Traction | 20% |
| Product-market fit | 20% |
| Unit economics | 10% |
| Competitive position | 10% |

**Scoring Guide:**
- 9-10: Ready now
- 7-8: Almost ready (2-3 months)
- 5-6: Significant gaps (6+ months)
- <5: Not ready (focus on product)

**When NOT to Raise:**
- No traction — Investors won''t believe
- Pivoting — Wait until validated
- Market downturn — Valuations compressed
- Just raised — Signaling risk
- Team issues — Fix before inviting scrutiny

**Company Information:**
Company: {{company_name}}
Stage: {{current_stage}}
Target round: {{target_round}}
Team: {{team_summary}}
Market: {{market_size}}
Traction: {{traction_metrics}}
PMF signals: {{pmf_signals}}
Unit economics: {{unit_economics}}
Competition: {{competitive_position}}

Calculate readiness score with detailed breakdown.',
   '{"company_name": "string", "current_stage": "string", "target_round": "string", "team_summary": "string", "market_size": "string", "traction_metrics": "string", "pmf_signals": "string", "unit_economics": "string", "competitive_position": "string"}'::jsonb,
   '{"readiness_score": "number", "score_breakdown": "object", "gap_analysis": "array", "timeline_to_ready": "string", "recommendation": "string", "raise_amount_range": "string", "valuation_range": "string"}'::jsonb,
   'claude', 3000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 2: Investor Targeting
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_investor_targeting',
  'Investor Targeting',
  'investor-targeting',
  'Build a prioritized list of the right investors with thesis matching',
  'funding',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "investor thesis matching, portfolio analysis"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_investor_targeting', 1, 'Build prioritized investor list',
   E'You are building a prioritized investor target list.

**Investor Thesis Matching Factors:**

| Factor | Why It Matters | How to Research |
|--------|----------------|-----------------|
| **Stage** | Must match your round | Portfolio page, Crunchbase |
| **Sector** | Must invest in your space | Portfolio, blog, Twitter |
| **Check size** | Must fit your raise | Fund size / 20 = typical check |
| **Geography** | Many prefer local | Portfolio geography |
| **Ownership target** | Affects interest | Ask directly |

**Investor Prioritization (ABC Method):**

| Tier | Criteria | Approach | Volume |
|------|----------|----------|--------|
| **A (Dream)** | Perfect thesis match, value-add | Warm intro only | 10-15 |
| **B (Strong)** | Good match, would take meeting | Warm or strategic cold | 20-30 |
| **C (Maybe)** | Possible but not ideal | Volume cold | 20-30 |

**Angel vs. VC Matrix:**

| Factor | Angels | VCs |
|--------|--------|-----|
| Check size | $10K-$100K | $100K-$10M |
| Decision speed | Days-weeks | Weeks-months |
| Value-add | Network, mentorship | Brand, follow-on |
| Ownership need | Flexible | Target % |

**Company Information:**
Company: {{company_name}}
Industry: {{industry}}
Stage: {{stage}}
Raise amount: {{raise_amount}}
Location: {{location}}
Existing investors: {{existing_investors}}
Warm connections: {{warm_connections}}

Generate investor target list with thesis match scores and intro paths.',
   '{"company_name": "string", "industry": "string", "stage": "string", "raise_amount": "string", "location": "string", "existing_investors": "string", "warm_connections": "string"}'::jsonb,
   '{"tier_a_investors": "array", "tier_b_investors": "array", "tier_c_investors": "array", "intro_strategy": "object", "outreach_sequence": "array"}'::jsonb,
   'claude', 3000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: Outreach Strategy
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_outreach_strategy',
  'Investor Outreach Strategy',
  'investor-outreach-strategy',
  'Craft emails that get meetings with response rate optimization',
  'funding',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "cold outreach, warm intros"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_outreach_strategy', 1, 'Generate outreach templates',
   E'You are crafting investor outreach that gets meetings.

**Outreach Hierarchy (Best to Worst):**

| Type | Response Rate |
|------|---------------|
| Portfolio founder intro | 60-80% |
| Mutual investor intro | 40-60% |
| Mutual connection intro | 30-50% |
| Operating exec intro | 20-40% |
| Cold email | 5-15% |
| Cold LinkedIn | 3-10% |

**Cold Email Framework:**

| Section | Purpose | Example |
|---------|---------|---------|
| **Hook** | Why you''re emailing THEM | "I noticed you led XYZ''s seed..." |
| **Problem** | What you solve | "SMBs lose 4% to payment fees" |
| **Traction** | Why to believe | "$150K MRR, 3x YoY growth" |
| **Ask** | What you want | "Would you have 20 min next week?" |

**Follow-Up Cadence:**

| Day | Action | Content |
|-----|--------|---------|
| 0 | Initial email | Full pitch |
| 3 | Follow-up 1 | "Following up — quick question?" |
| 7 | Follow-up 2 | Add new traction/news |
| 14 | Break-up email | "Should I close this out?" |

**Company Information:**
Company: {{company_name}}
One-liner: {{one_liner}}
Traction highlight: {{traction_highlight}}
Raise amount: {{raise_amount}}
Target investor: {{target_investor}}
Investor thesis: {{investor_thesis}}
Connection path: {{connection_path}}

Generate personalized outreach templates.',
   '{"company_name": "string", "one_liner": "string", "traction_highlight": "string", "raise_amount": "string", "target_investor": "string", "investor_thesis": "string", "connection_path": "string"}'::jsonb,
   '{"cold_email": "string", "warm_intro_request": "string", "followup_1": "string", "followup_2": "string", "breakup_email": "string", "linkedin_message": "string"}'::jsonb,
   'claude', 2500, 0.6)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 4: Pipeline Management
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_pipeline_management',
  'Fundraising Pipeline Management',
  'fundraising-pipeline',
  'Run an organized fundraising process with CRM structure',
  'funding',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "deal cycles, investor psychology"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_pipeline_management', 1, 'Analyze pipeline and recommend actions',
   E'You are managing a fundraising pipeline.

**Pipeline Stages:**

| Stage | Definition | Conversion Target |
|-------|------------|-------------------|
| **Lead** | Identified, not contacted | 100% (baseline) |
| **Contacted** | Emailed or intro''d | 50% of leads |
| **Meeting** | Had first meeting | 30% of contacted |
| **Deep Dive** | Multiple meetings, interested | 50% of meetings |
| **DD** | In due diligence | 50% of deep dive |
| **Term Sheet** | Received offer | 50% of DD |
| **Closed** | Signed and wired | 80% of term sheets |

**Timing and Momentum Tactics:**
- Start meetings same week → Create FOMO
- Share progress updates → Social proof
- Create soft deadline → Force decisions
- Run parallel processes → Multiple offers
- Update regularly → Stay top of mind

**Current Pipeline:**
{{pipeline_data}}

**Recent Updates:**
{{recent_updates}}

Analyze pipeline health and recommend next actions.',
   '{"pipeline_data": "string", "recent_updates": "string"}'::jsonb,
   '{"pipeline_health_score": "number", "stage_conversion_analysis": "object", "momentum_assessment": "string", "priority_actions": "array", "update_email_draft": "string", "weekly_checklist": "array"}'::jsonb,
   'claude', 2500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 5: Term Sheet Analysis
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_term_sheet_analysis',
  'Term Sheet Analysis',
  'term-sheet-analysis',
  'Understand, compare, and negotiate term sheet terms',
  'funding',
  ARRAY['seed', 'series-a', 'series-b'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "deal structure, valuation, negotiation"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_term_sheet_analysis', 1, 'Analyze term sheet terms',
   E'You are analyzing a term sheet for a founder.

**Key Term Sheet Terms:**

| Term | What It Means | Founder Impact | Negotiability |
|------|---------------|----------------|---------------|
| **Valuation** | Pre-money value | Dilution amount | Moderate |
| **Option pool** | Employee equity reserved | Comes from founders | High |
| **Liquidation preference** | Who gets paid first | Downside protection | Low-Moderate |
| **Participation** | Double-dip or not | Upside sharing | Moderate |
| **Anti-dilution** | Down-round protection | Future dilution | Low |
| **Board seats** | Control and governance | Decision power | Moderate-High |
| **Pro-rata rights** | Follow-on investment | Future dilution | Low |
| **Protective provisions** | Veto rights | Major decisions | Low |

**Red Flags in Term Sheets:**

| Red Flag | Why It''s Bad |
|----------|--------------|
| Participating preferred | Double-dip on returns |
| Full ratchet anti-dilution | Severe down-round punishment |
| Super-voting rights | Disproportionate control |
| Redemption rights | Can force buyback |
| No-shop >60 days | Too long exclusivity |

**Negotiation Priorities:**

| Priority | Protect | Can Give |
|----------|---------|----------|
| 1. Valuation | Don''t go below floor | Minor terms |
| 2. Control | Keep board, no super-majority | Reasonable protectives |
| 3. Pro-rata | Accept standard | Don''t fight small investors |
| 4. Pool | Negotiate from post | Accept reasonable size |

**Term Sheet:**
{{term_sheet_text}}

**Other Offers (if any):**
{{other_offers}}

Analyze the term sheet and provide negotiation strategy.',
   '{"term_sheet_text": "string", "other_offers": "string"}'::jsonb,
   '{"analysis": "object", "standard_vs_concerning": "object", "dilution_calculation": "object", "red_flags": "array", "negotiation_strategy": "array", "counter_proposal": "string", "walk_away_criteria": "array", "recommendation": "string"}'::jsonb,
   'claude', 3500, 0.3)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 6: Due Diligence Prep
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_due_diligence_prep',
  'Due Diligence Prep',
  'due-diligence-prep',
  'Prepare for investor due diligence with complete data room structure',
  'funding',
  ARRAY['seed', 'series-a', 'series-b'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "DD requirements, legal, data room"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_due_diligence_prep', 1, 'Generate DD checklist and timeline',
   E'You are preparing a founder for due diligence.

**Due Diligence Checklist:**

| Category | Documents | Priority |
|----------|-----------|----------|
| **Corporate** | Incorporation, bylaws, cap table | Must have |
| **Financial** | P&L, balance sheet, projections, bank statements | Must have |
| **Legal** | IP assignments, employment agreements, contracts | Must have |
| **Product** | Demo, architecture, roadmap | Important |
| **Customer** | Customer list, case studies, churn analysis | Important |
| **Team** | Org chart, key bios, references | Important |
| **Market** | Market research, competitive analysis | Nice to have |

**Common DD Issues:**

| Issue | Impact | Fix |
|-------|--------|-----|
| Messy cap table | Delay or kill deal | Use Carta, clean up |
| IP not assigned | Deal killer | Get assignment docs signed |
| No founder vesting | Red flag | Add reverse vesting |
| Outstanding lawsuits | Major concern | Disclose and explain |
| Key customer concentration | Risk flag | Diversification plan |

**DD Timeline:**

| Phase | Duration | Activities |
|-------|----------|------------|
| Initial request | Day 1 | Receive DD checklist |
| Document gathering | Days 1-7 | Collect and upload |
| VC review | Days 7-14 | They review materials |
| Questions | Days 14-21 | Answer follow-ups |
| Reference calls | Days 14-21 | Customer and personal refs |
| Legal DD | Days 21-28 | Lawyers review |
| Close | Days 28-35 | Final docs and wire |

**Current Situation:**
Company: {{company_name}}
Stage: {{stage}}
Existing docs: {{existing_docs}}
Known issues: {{known_issues}}

Generate personalized DD checklist with status tracker.',
   '{"company_name": "string", "stage": "string", "existing_docs": "string", "known_issues": "string"}'::jsonb,
   '{"dd_checklist": "array", "data_room_structure": "object", "missing_docs": "array", "issue_remediation": "array", "timeline": "object", "reference_prep": "object"}'::jsonb,
   'claude', 3000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 7: Round Narrative
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_round_narrative',
  'Round Narrative Builder',
  'round-narrative',
  'Craft the story that creates investor conviction',
  'pitch',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "fundraising-advisor", "library_ref": "15-fundraising-expert-agent", "expertise": "storytelling, conviction building"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_round_narrative', 1, 'Build compelling round narrative',
   E'You are crafting the story that creates investor conviction.

**Round Narrative Framework:**

| Element | Question Answered | Example |
|---------|-------------------|---------|
| **Why us?** | Why is this team going to win? | "We built payments at Stripe for 5 years" |
| **Why now?** | Why is this the right moment? | "Regulation just changed enabling X" |
| **Why this market?** | Why is this opportunity attractive? | "$50B market growing 30% annually" |
| **Why this product?** | Why does your solution win? | "Only platform that does X, Y, Z together" |
| **Why this round?** | Why raise this amount now? | "To hit $3M ARR and raise Series A" |

**Narrative Arc:**

| Beat | Content | Emotional Goal |
|------|---------|----------------|
| **Hook** | Bold claim or surprising fact | Attention |
| **Problem** | The pain that exists | Empathy |
| **Villain** | Why current solutions fail | Frustration |
| **Hero** | Your solution arrives | Hope |
| **Evidence** | Traction and proof | Belief |
| **Vision** | Where this goes | Excitement |
| **Ask** | What you need | Commitment |

**Conviction Builders:**
- Social proof: Customers, logos, advisors
- Metrics momentum: Growth rate, retention
- Contrarian insight: Belief most people don''t share
- Team credibility: Relevant experience
- Market timing: Why now works

**Handling Objections:**

| Objection | Response Framework |
|-----------|-------------------|
| "Too early" | Show momentum, de-risk |
| "Too crowded" | Show differentiation |
| "Team unproven" | Show experience, advisors |
| "Valuation high" | Show comps, justify |
| "Not my thesis" | Reframe or move on |

**Company Information:**
Company: {{company_name}}
Team background: {{team_background}}
Problem: {{problem_statement}}
Solution: {{solution_summary}}
Market: {{market_size}}
Traction: {{traction_metrics}}
Raise: {{raise_amount}}
Use of funds: {{use_of_funds}}

Build the complete round narrative.',
   '{"company_name": "string", "team_background": "string", "problem_statement": "string", "solution_summary": "string", "market_size": "string", "traction_metrics": "string", "raise_amount": "string", "use_of_funds": "string"}'::jsonb,
   '{"full_narrative": "string", "key_talking_points": "array", "objection_responses": "object", "elevator_pitch_30s": "string", "elevator_pitch_2min": "string", "elevator_pitch_5min": "string", "why_us_why_now": "object"}'::jsonb,
   'claude', 4000, 0.6)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification query
SELECT 'Fundraising Expert packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'fundraising-advisor';
