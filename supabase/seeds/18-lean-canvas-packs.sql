-- ============================================================================
-- Seed: Lean Canvas Expert Agent Prompt Packs
-- Source: tasks/prompt-library/11-lean-canvas-expert-agent.md
-- Contains: 3 prompt packs with ~9 steps total
-- Agent: Canvas Builder Agent | Model: Gemini 3 Pro
-- ============================================================================

-- Pack 1: Problem-Customer-UVP Canvas Builder
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_canvas_problem_customer',
  'Problem-Customer-UVP Canvas',
  'canvas-problem-customer-uvp',
  'Build the top-left canvas boxes: Problem, Customer Segments, and Unique Value Proposition',
  'canvas',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "canvas-builder", "library_ref": "11-lean-canvas-expert-agent", "expertise": "jobs-to-be-done, market segmentation, positioning"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_canvas_problem_customer', 1, 'Define problem with specificity',
   E'You are a world-class business model architect who has helped 500+ startups build their Lean Canvas.\n\n**Problem Box Guidelines:**\n| Element | Great | Weak |\n|---------|------|------|\n| Specificity | "SMBs spend 8 hrs/week on manual invoicing" | "Invoicing is hard" |\n| Quantification | "$4,000/month lost to late payments" | "They lose money" |\n| Existing Alternatives | "Spreadsheets, Quickbooks (limited), hiring bookkeeper" | "No good solutions" |\n| Urgency | "Happens every week, pain is growing" | "Sometimes annoying" |\n\n**Industry-Specific Patterns:**\n| Industry | Common Problem Patterns |\n|----------|-------------------------|\n| FinTech | Compliance burden, payment friction, cash flow visibility |\n| Healthcare | Administrative overhead, patient engagement, data silos |\n| SaaS | Tool sprawl, workflow fragmentation, data loss |\n| Marketplace | Discovery, trust, transaction friction |\n\n**Context:**\nBusiness: {{business_description}}\nIndustry: {{industry}}\nTarget Audience: {{target_audience}}\n\nDefine the top 1-3 problems with specificity and quantification.',
   '{"business_description": "string", "industry": "string", "target_audience": "string"}'::jsonb,
   '{"problem_1": "object", "problem_2": "object", "problem_3": "object", "existing_alternatives": "array", "urgency_score": "number"}'::jsonb,
   'gemini', 2000, 0.4),

  ('pack_canvas_problem_customer', 2, 'Identify customer segments and beachhead',
   E'You are continuing to build the Lean Canvas.\n\n**Customer Segmentation Framework:**\n| Level | Questions | Example |\n|------|-----------|--------|\n| Macro | What industry? | B2B SaaS |\n| Meso | What company size/stage? | Seed-stage startups |\n| Micro | What specific role? | First-time solo founders |\n| Psychographic | What mindset? | Bootstrapping, scrappy, time-poor |\n| Behavioral | What actions? | Already using 3+ tools, active on Twitter |\n\n**Beachhead Criteria:**\n- Small enough to dominate quickly\n- Connected enough for word-of-mouth\n- Desperate enough to pay today\n- Representative enough to expand from\n\n**Problems Identified:**\n{{problems}}\n\nBusiness: {{business_description}}\n\nDefine the beachhead customer segment with precision.',
   '{"problems": "string", "business_description": "string"}'::jsonb,
   '{"beachhead_segment": "object", "expansion_path": "array", "early_adopter_profile": "object", "tam_sam_som": "object"}'::jsonb,
   'gemini', 2000, 0.4),

  ('pack_canvas_problem_customer', 3, 'Craft unique value proposition',
   E'You are crafting the Unique Value Proposition for the Lean Canvas.\n\n**UVP Formula:**\n"For [target customer] who [need/want/struggle with], [Product] is a [category] that [key benefit]. Unlike [competitor], we [key differentiator]."\n\n**Strong UVP Patterns:**\n| Pattern | Example | Why It Works |\n|---------|---------|-------------|\n| "The only X that Y" | "The only CRM that closes deals for you" | Exclusivity |\n| "X for Y" | "Slack for healthcare teams" | Borrowed credibility |\n| "Z% faster/cheaper" | "Close deals 40% faster" | Quantified benefit |\n| "No more X" | "No more spreadsheet chaos" | Problem elimination |\n\n**UVP Tests:**\n1. Can a 5-year-old understand it?\n2. Does it pass the "so what?" test?\n3. Is it defensible, not just claimable?\n\n**Context:**\nProblems: {{problems}}\nCustomer: {{customer_segment}}\nBusiness: {{business_description}}\n\nCraft the UVP with support pillars.',
   '{"problems": "string", "customer_segment": "string", "business_description": "string"}'::jsonb,
   '{"primary_uvp": "string", "support_pillars": "array", "positioning_statement": "string", "differentiation_matrix": "object"}'::jsonb,
   'gemini', 2000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 2: Solution-Channels-Revenue Canvas Builder
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_canvas_solution_revenue',
  'Solution-Channels-Revenue Canvas',
  'canvas-solution-channels-revenue',
  'Build the middle canvas boxes: Solution, Channels, and Revenue Streams',
  'canvas',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "canvas-builder", "library_ref": "11-lean-canvas-expert-agent", "expertise": "outcome-driven design, channel economics, SaaS pricing"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_canvas_solution_revenue', 1, 'Map features to problems and outcomes',
   E'You are building the Solution box of the Lean Canvas.\n\n**Feature ↔ Problem Mapping:**\n| Problem | Feature | Outcome | Metric |\n|---------|---------|---------|--------|\n| 8 hrs/week on invoicing | Auto-invoice generation | Save 7 hrs/week | Time saved |\n| $4k/month late payments | Automated follow-ups | 50% fewer late payments | AR days reduced |\n\n**Solution Quality Tests:**\n1. Does each feature clearly solve a stated problem?\n2. Can you measure the outcome?\n3. Is this the simplest solution?\n4. Can you build an MVP in 4 weeks?\n\n**Context:**\nProblems: {{problems}}\nCustomer: {{customer_segment}}\nBusiness: {{business_description}}\n\nDefine top 3 features with problem-outcome-metric chain.',
   '{"problems": "string", "customer_segment": "string", "business_description": "string"}'::jsonb,
   '{"feature_1": "object", "feature_2": "object", "feature_3": "object", "mvp_scope": "array", "build_vs_buy": "object"}'::jsonb,
   'gemini', 2000, 0.4),

  ('pack_canvas_solution_revenue', 2, 'Build channel strategy',
   E'You are building the Channels box of the Lean Canvas.\n\n**Channel Categories:**\n| Type | Examples | Best For |\n|------|----------|----------|\n| Inbound | SEO, content, social | Long-term, low CAC |\n| Outbound | Cold email, ads, PR | Fast, scalable, higher CAC |\n| Product-led | Freemium, viral, referral | High volume, very low CAC |\n| Partner-led | Integrations, resellers | Borrowed audiences |\n\n**Industry-Specific Playbooks:**\n| Industry | Primary Channels | Why |\n|----------|------------------|-----|\n| FinTech | Partnerships, CFO communities | Trust-based sales |\n| Healthcare | Trade shows, associations | Relationship-driven |\n| SaaS | Content marketing, PLG | Discovery-driven |\n| Marketplace | Supply-side first, SEO | Chicken-and-egg |\n\n**Context:**\nBusiness: {{business_description}}\nIndustry: {{industry}}\nCustomer: {{customer_segment}}\n\nRecommend channel strategy with playbook.',
   '{"business_description": "string", "industry": "string", "customer_segment": "string"}'::jsonb,
   '{"primary_channel": "object", "secondary_channels": "array", "channel_experiments": "array", "cac_estimates": "object", "timeline": "object"}'::jsonb,
   'gemini', 2000, 0.4),

  ('pack_canvas_solution_revenue', 3, 'Design revenue model and pricing',
   E'You are building the Revenue Streams box of the Lean Canvas.\n\n**Revenue Model Types:**\n| Model | How It Works | Best For |\n|-------|--------------|----------|\n| Subscription | Recurring monthly/annual | Ongoing value delivery |\n| Transaction fee | % of each transaction | Payment enablement |\n| Usage-based | Pay per use | Variable consumption |\n| Freemium | Free + premium | High volume, conversion funnel |\n| Marketplace | Take rate on GMV | Two-sided platforms |\n\n**Pricing Tier Framework:**\n| Tier | Name | Price | Target |\n|------|------|-------|--------|\n| Free | Starter | $0 | Trial |\n| Tier 1 | Pro | $29-99/mo | Power users |\n| Tier 2 | Team | $99-299/mo | Small teams |\n| Tier 3 | Business | $299-999/mo | Growing companies |\n| Tier 4 | Enterprise | Custom | Large orgs |\n\n**Industry Benchmarks:**\n| Industry | Entry Price | ACV | NRR |\n|----------|-------------|-----|-----|\n| B2B SaaS | $29-99/seat | $15K-50K/yr | 110-130% |\n| SMB SaaS | $9-49/mo | $500-2K/yr | 80-100% |\n\n**Context:**\nBusiness: {{business_description}}\nIndustry: {{industry}}\nSolution: {{solution_summary}}\n\nDesign the revenue model with pricing tiers.',
   '{"business_description": "string", "industry": "string", "solution_summary": "string"}'::jsonb,
   '{"primary_revenue_model": "object", "pricing_tiers": "array", "ltv_estimate": "object", "year_1_forecast": "object", "monetization_experiments": "array"}'::jsonb,
   'gemini', 2500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: Metrics-Costs-Advantage Canvas Builder
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_canvas_metrics_advantage',
  'Metrics-Costs-Advantage Canvas',
  'canvas-metrics-costs-advantage',
  'Build bottom canvas boxes: Key Metrics, Cost Structure, and Unfair Advantage',
  'canvas',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "canvas-builder", "library_ref": "11-lean-canvas-expert-agent", "expertise": "pirate metrics, unit economics, moats"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_canvas_metrics_advantage', 1, 'Define key metrics with AARRR framework',
   E'You are building the Key Metrics box of the Lean Canvas.\n\n**Pirate Metrics (AARRR):**\n| Stage | Metric | Definition | Benchmark |\n|-------|--------|------------|----------|\n| Acquisition | Visitors, signups | How they find you | Varies |\n| Activation | First value moment | When they get it | Day 1: 40%+ |\n| Retention | Return rate | Do they come back | Week 4: 20%+ |\n| Revenue | Conversion, ARPU | Do they pay | Trial > Paid: 5-10% |\n| Referral | NPS, viral K | Do they share | NPS > 40 |\n\n**Industry-Specific Metrics:**\n| Industry | Metric 1 | Metric 2 | Metric 3 |\n|----------|----------|----------|----------|\n| B2B SaaS | MRR/ARR | Net retention | CAC payback |\n| Marketplace | GMV | Take rate | Liquidity |\n| Consumer | DAU/MAU | Engagement | Viral K |\n| FinTech | Transaction volume | Default rate | Compliance |\n\n**One Metric That Matters:**\n- Pre-PMF: Retention\n- Post-PMF: Growth\n- Scaling: Unit economics\n\n**Context:**\nBusiness: {{business_description}}\nIndustry: {{industry}}\nStage: {{stage}}\n\nDefine key metrics with benchmarks.',
   '{"business_description": "string", "industry": "string", "stage": "string"}'::jsonb,
   '{"omtm": "object", "dashboard_metrics": "array", "benchmark_targets": "object", "alert_thresholds": "object", "reporting_cadence": "object"}'::jsonb,
   'gemini', 2000, 0.4),

  ('pack_canvas_metrics_advantage', 2, 'Model cost structure and unit economics',
   E'You are building the Cost Structure box of the Lean Canvas.\n\n**Cost Categories:**\n| Category | Examples | Fixed/Variable |\n|----------|----------|----------------|\n| People | Salaries, contractors | Fixed (semi) |\n| Technology | Cloud, tools, APIs | Variable |\n| Marketing | Ads, content, events | Variable |\n| Operations | Office, legal, accounting | Fixed |\n| COGS | Hosting per user, support | Variable |\n\n**First Year Cost Model:**\n| Month | Burn | Major Expenses |\n|-------|------|----------------|\n| 1-3 | $15k/mo | MVP build, initial marketing |\n| 4-6 | $25k/mo | First hires, scaling marketing |\n| 7-9 | $40k/mo | Team expansion, customer success |\n| 10-12 | $50k/mo | Growth acceleration |\n\n**Unit Economics:**\n- CAC: Total spent / customers acquired\n- LTV: ARPU × Gross margin × Customer lifetime\n- LTV:CAC ratio: Should be > 3:1\n- CAC payback: Months to recover CAC\n\n**Context:**\nBusiness: {{business_description}}\nRevenue model: {{revenue_model}}\n\nModel the cost structure with unit economics.',
   '{"business_description": "string", "revenue_model": "string"}'::jsonb,
   '{"fixed_costs": "object", "variable_costs": "object", "first_year_total": "object", "unit_economics": "object", "runway_estimate": "string"}'::jsonb,
   'gemini', 2500, 0.4),

  ('pack_canvas_metrics_advantage', 3, 'Identify unfair advantage and moat',
   E'You are building the Unfair Advantage box of the Lean Canvas.\n\n**Moat Types:**\n| Type | Description | Strength |\n|------|-------------|----------|\n| Network effects | Value increases with users | Very strong |\n| Switching costs | Painful to leave | Strong |\n| Economies of scale | Cheaper at volume | Strong |\n| Brand | Trust and recognition | Moderate |\n| Regulatory | Legal barriers | Strong |\n| Data | Proprietary datasets | Strong |\n| Talent | Unique team expertise | Moderate |\n\n**What Counts as Unfair Advantage:**\n✅ Something competitors can''t easily get\n✅ Grows stronger over time\n✅ Tied to how you make money\n\n**What Does NOT Count:**\n❌ "We''re passionate"\n❌ "First mover"\n❌ "We move fast"\n❌ Features (can be copied)\n\n**Building Unfair Advantage:**\n- Day 1: Founder-market fit, unique insight\n- Year 1: Early data, customer relationships\n- Year 2+: Network effects, switching costs\n\n**Context:**\nBusiness: {{business_description}}\nFounder background: {{founder_background}}\nIndustry: {{industry}}\n\nIdentify the unfair advantage with roadmap.',
   '{"business_description": "string", "founder_background": "string", "industry": "string"}'::jsonb,
   '{"primary_unfair_advantage": "string", "how_it_strengthens": "string", "honest_assessment": "string", "roadmap_to_defensibility": "array", "competitive_response": "string"}'::jsonb,
   'gemini', 2000, 0.5)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification
SELECT 'Lean Canvas packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'canvas-builder';
