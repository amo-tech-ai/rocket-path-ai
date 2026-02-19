-- ============================================================================
-- Seed: GTM Strategy Expert Agent Prompt Packs
-- Source: tasks/prompt-library/14-gtm-strategy-expert-agent.md
-- Contains: 4 prompt packs with ~7 steps total
-- Agent: GTM Strategist Agent | Model: Gemini 3 Pro
-- ============================================================================

-- Pack 1: GTM Strategy Builder
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_gtm_strategy_builder',
  'GTM Strategy Builder',
  'gtm-strategy-builder',
  'Create a complete, executable go-to-market strategy with 90-day action plan',
  'gtm',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "gtm-strategist", "library_ref": "14-gtm-strategy-expert-agent", "expertise": "channel selection, ICP definition, CAC optimization"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_gtm_strategy_builder', 1, 'Build complete GTM strategy',
   E'You are a GTM expert who has led GTM for 100+ product launches and managed $50M+ in marketing spend.\n\n**GTM Strategy Framework:**\n| Section | Purpose | Key Decisions |\n|---------|---------|---------------|\n| Target Market | Who we''re selling to | ICP, segments, prioritization |\n| Positioning | How we''re different | Value prop, competitive position |\n| Channels | How we reach them | Channel mix, prioritization |\n| Messaging | What we say | Key messages, proof points |\n| Pricing | What we charge | Model, tiers |\n| Sales Motion | How we sell | Self-serve, assisted, enterprise |\n| Launch Plan | How we enter | Timeline, milestones |\n\n**Industry-Specific GTM Playbooks:**\n| Industry | Primary GTM | Why | Key Metrics |\n|----------|-------------|-----|-------------|\n| B2B SaaS | Product-led + content | Discovery via search, low CAC | Free trial %, conversion, NRR |\n| Enterprise | Outbound + events | High ACV justifies high CAC | Pipeline, win rate, ACV |\n| Marketplace | Supply-side + SEO | Need supply before demand | Liquidity, take rate, GMV |\n| Consumer | Performance + viral | Volume game | CAC, D7 retention, viral K |\n| FinTech | Partnerships + trust | Trust-based, compliance-heavy | Partner deals, compliance |\n| Healthcare | Institutional + outcomes | Long cycles, evidence needed | Pilot rate, outcomes |\n\n**Company Information:**\nBusiness: {{business_description}}\nIndustry: {{industry}}\nTarget audience: {{target_audience}}\nProduct: {{product_summary}}\nCurrent traction: {{traction}}\nBudget: {{marketing_budget}}\n\nCreate complete GTM strategy with 90-day plan.',
   '{"business_description": "string", "industry": "string", "target_audience": "string", "product_summary": "string", "traction": "string", "marketing_budget": "string"}'::jsonb,
   '{"gtm_strategy": "object", "90_day_plan": "array", "channel_mix": "object", "key_metrics": "array", "risk_assessment": "array"}'::jsonb,
   'gemini', 4000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 2: ICP Definition
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_icp_definition',
  'ICP Definition',
  'icp-definition',
  'Define ideal customer profile with precision targeting and anti-personas',
  'gtm',
  ARRAY['idea', 'pre-seed', 'seed'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "gtm-strategist", "library_ref": "14-gtm-strategy-expert-agent", "expertise": "segmentation, targeting"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_icp_definition', 1, 'Define ICP with 5 layers',
   E'You are defining the Ideal Customer Profile.\n\n**ICP Framework — The 5 Layers:**\n| Layer | What to Define | Example |\n|-------|----------------|---------|\n| Firmographics | Company characteristics | B2B, 2-10 employees, <$2M revenue |\n| Demographics | Person characteristics | Founder/CEO, 25-40 years old |\n| Psychographics | Mindset and values | Growth-oriented, time-poor |\n| Technographics | Tools they use | Notion, Slack, Stripe |\n| Behavioral | Actions they take | Posts weekly, attends meetups |\n\n**Qualification Criteria (BANT+):**\n| Criterion | Must Have | Nice to Have | Disqualifier |\n|-----------|-----------|--------------|-------------|\n| Problem awareness | Know they have problem | Actively searching | "We don''t need this" |\n| Budget | Can afford your price | Budget allocated | No purchasing power |\n| Authority | Can make decision | Quick process | Long approval chain |\n| Timeline | Need solution now | In next quarter | "Maybe next year" |\n| Fit | Match your solution | Growth potential | Wrong use case |\n\n**Finding Your ICP (Pattern Analysis):**\n- Who were your first 10 happy customers?\n- Which customers closed fastest?\n- Which customers have lowest churn?\n- Which customers expanded most?\n- Which customers referred others?\n\n**Anti-Personas (Who NOT to sell to):**\n| Anti-Persona | Why to Avoid |\n|--------------|-------------|\n| Discount hunters | Never convert, high churn |\n| Feature requesters | Never satisfied |\n| "Just exploring" | Long cycle, low conversion |\n| Wrong size | Wrong sales motion |\n\n**Business Context:**\nBusiness: {{business_description}}\nProduct: {{product_summary}}\nExisting customers: {{existing_customers}}\nIndustry: {{industry}}\n\nDefine ICP with scoring criteria.',
   '{"business_description": "string", "product_summary": "string", "existing_customers": "string", "industry": "string"}'::jsonb,
   '{"icp_document": "object", "qualification_criteria": "object", "anti_personas": "array", "where_to_find": "array", "icp_interview_script": "array"}'::jsonb,
   'gemini', 3000, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 3: Channel Strategy
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_channel_strategy',
  'Channel Strategy Builder',
  'channel-strategy-builder',
  'Select, prioritize, and execute on acquisition channels with CAC targets',
  'gtm',
  ARRAY['pre-seed', 'seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "gtm-strategist", "library_ref": "14-gtm-strategy-expert-agent", "expertise": "channel economics, CAC optimization"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_channel_strategy', 1, 'Build channel strategy with playbooks',
   E'You are building a channel acquisition strategy.\n\n**Channel Categories:**\n| Category | Channels | Best For | CAC Range |\n|----------|----------|----------|-----------|\n| Inbound | SEO, content, social | Long-term, low CAC | $50-$300 |\n| Outbound | Cold email, cold call, LinkedIn | Faster, higher CAC | $200-$1000+ |\n| Product-led | Freemium, viral, referral | Volume, very low CAC | $10-$100 |\n| Paid | Google, Facebook, LinkedIn ads | Fast, scalable | $100-$500+ |\n| Partners | Integrations, affiliates | Borrowed audiences | Revenue share |\n| Events | Conferences, webinars | High-touch, enterprise | $500-$2000 |\n\n**Channel Scoring Matrix:**\n| Factor | Weight |\n|--------|--------|\n| Reach | 20% |\n| Cost efficiency | 25% |\n| Speed to results | 20% |\n| Scalability | 15% |\n| Fit with audience | 20% |\n\n**Channel Economics Targets:**\n| Metric | Good | Great | Red Flag |\n|--------|------|-------|----------|\n| CAC | <$300 | <$100 | >$500 |\n| CAC payback | <12 mo | <6 mo | >18 mo |\n| LTV:CAC | >3:1 | >5:1 | <2:1 |\n| Conversion | >2% | >5% | <1% |\n\n**LinkedIn Outbound Playbook (B2B SaaS):**\n| Step | Action | Metrics |\n|------|--------|---------|\n| 1 | Build target list (Sales Nav) | 1000 accounts |\n| 2 | Personalized first message | |\n| 3 | Connect (20-30/day) | 30% accept |\n| 4 | 3-message sequence | 5% response |\n| 5 | Book discovery call | 50% meeting |\n| 6 | Demo and close | 20% close |\n\n**Context:**\nBusiness: {{business_description}}\nIndustry: {{industry}}\nICP: {{icp_summary}}\nBudget: {{marketing_budget}}\nTimeline: {{timeline}}\n\nBuild channel strategy.',
   '{"business_description": "string", "industry": "string", "icp_summary": "string", "marketing_budget": "string", "timeline": "string"}'::jsonb,
   '{"channel_prioritization": "array", "channel_mix_budget": "object", "channel_playbooks": "array", "cac_targets": "object", "90_day_experiments": "array"}'::jsonb,
   'gemini', 3500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Pack 4: Sales Motion Design
INSERT INTO prompt_packs (id, title, slug, description, category, stage_tags, industry_tags, version, is_active, source, metadata)
VALUES (
  'pack_sales_motion',
  'Sales Motion Design',
  'sales-motion-design',
  'Build a repeatable sales process from founder-led to sales team',
  'gtm',
  ARRAY['seed', 'series-a'],
  ARRAY['all'],
  1, true, 'prompt-library',
  '{"agent": "gtm-strategist", "library_ref": "14-gtm-strategy-expert-agent", "expertise": "sales process, conversion optimization"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  metadata = EXCLUDED.metadata,
  updated_at = now();

INSERT INTO prompt_pack_steps (pack_id, step_order, purpose, prompt_template, input_schema, output_schema, model_preference, max_tokens, temperature)
VALUES
  ('pack_sales_motion', 1, 'Design sales motion and funnel',
   E'You are designing a repeatable sales process.\n\n**Sales Motion Types:**\n| Motion | Description | Best For | ACV |\n|--------|-------------|----------|-----|\n| Self-serve | Customer buys without help | Low complexity | <$500/yr |\n| Sales-assisted | Light touch, demos | Medium | $500-$5K/yr |\n| Inside sales | Full process, remote | SMB, mid-market | $5K-$50K/yr |\n| Field sales | In-person, long cycle | Enterprise | $50K+/yr |\n| Product-led + sales | Self-serve with upgrade help | Combo | Variable |\n\n**Sales Funnel Design:**\n| Stage | Goal | Activities | Conversion |\n|-------|------|------------|------------|\n| Lead | Capture interest | Content, ads, outbound | 100% baseline |\n| MQL | Qualify fit | Scoring, enrichment | 30% of leads |\n| SQL | Book meeting | SDR outreach | 50% of MQLs |\n| Discovery | Understand needs | Discovery call | 80% of SQLs |\n| Demo | Show value | Product demo | 70% of discoveries |\n| Proposal | Present offer | Pricing, proposal | 80% of demos |\n| Closed | Get signature | Negotiation, close | 30% of proposals |\n\n**Founder-Led Sales Framework:**\n| Phase | Activities | Exit Criteria |\n|-------|------------|---------------|\n| Learning (0-50) | Founder does all sales | Repeatable pitch/process |\n| Documenting (50-100) | Document playbook | Written sales process |\n| Transitioning (100-200) | Hire first SDR/AE | Rep hitting quota |\n| Scaling (200+) | Build sales team | Org running independently |\n\n**Sales Playbook Components:**\n- ICP and qualification criteria\n- Outreach templates\n- Discovery script\n- Demo flow\n- Objection handling\n- Proposal template\n- Close techniques\n\n**Context:**\nBusiness: {{business_description}}\nACV: {{acv}}\nCurrent customers: {{current_customers}}\nCurrent sales process: {{current_process}}\n\nDesign the sales motion.',
   '{"business_description": "string", "acv": "string", "current_customers": "string", "current_process": "string"}'::jsonb,
   '{"recommended_motion": "object", "sales_funnel": "object", "playbook_outline": "array", "first_sales_hire": "object", "metrics_dashboard": "object"}'::jsonb,
   'gemini', 3500, 0.4)
ON CONFLICT (pack_id, step_order) DO UPDATE SET
  purpose = EXCLUDED.purpose,
  prompt_template = EXCLUDED.prompt_template,
  updated_at = now();

-- Verification
SELECT 'GTM Expert packs seeded: ' || COUNT(DISTINCT id) || ' packs' as result
FROM prompt_packs 
WHERE metadata->>'agent' = 'gtm-strategist';
