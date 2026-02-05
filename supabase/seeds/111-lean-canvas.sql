-- =============================================================================
-- Seed: Lean Canvas
-- Purpose: Create sample lean canvas for /lean-canvas page
-- Startup: StartupAI (d33f795b-5a99-4df3-9819-52a4baba0895)
-- UUID Range: 111-112
-- =============================================================================

-- Clear existing lean canvases for this startup
DELETE FROM public.lean_canvases WHERE startup_id = 'd33f795b-5a99-4df3-9819-52a4baba0895';

-- Insert lean canvas
INSERT INTO public.lean_canvases (
  id,
  startup_id,
  problem,
  customer_segments,
  unique_value_proposition,
  solution,
  channels,
  revenue_streams,
  cost_structure,
  key_metrics,
  unfair_advantage,
  validation_score,
  completeness_score,
  version,
  is_current,
  source,
  metadata,
  created_at,
  updated_at
) VALUES
-- Canvas 111: Current version (complete)
(
  '00000000-0000-0000-0000-000000000111'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  '**Top 3 Problems:**
1. 99% of startups fail, often due to lack of experienced guidance
2. First-time founders waste 6+ months on wrong activities without structure
3. Traditional accelerators help only 1% of startups, leaving millions without support

**Existing Alternatives:**
- Generic AI tools (ChatGPT) - no startup context
- Horizontal tools (Notion, Airtable) - require customization
- Expensive consultants - not scalable
- Free content online - overwhelming and unstructured',

  '**Target Customer Segments:**

1. **First-time founders** (Primary)
   - Age: 25-45
   - Solo or 2-person teams
   - Pre-revenue to $100K ARR
   - Tech-savvy but not experts

2. **Accelerator programs** (Secondary)
   - 10-50 startups per cohort
   - Need scalable founder support
   - Budget for tools

3. **Micro-funds / Angels** (Emerging)
   - Portfolio support needs
   - Want to add value beyond capital

**Early Adopters:**
- YC applicants who didn''t get in
- Indie hackers with traction
- Career switchers starting first company',

  '**Single, Clear, Compelling Message:**

"The AI co-founder for first-time entrepreneurs"

**High-Level Concept:**
YC in your pocket, powered by AI

**Why Different:**
- Only AI-native platform built specifically for founders
- Combines methodology (YC/Sequoia) with real-time guidance
- End-to-end: from idea validation to investor meetings
- Learns from your startup data to personalize advice',

  '**Solution Features (mapped to problems):**

1. **For lack of guidance:**
   - AI strategic advisor available 24/7
   - Smart interviewer that asks the right questions
   - Personalized action recommendations

2. **For wasted time:**
   - Automated task prioritization
   - Stage-appropriate workflows
   - Progress tracking dashboard

3. **For accessibility:**
   - $29-99/month pricing (vs $10K+ consultants)
   - Self-serve onboarding
   - Works asynchronously

**MVP Features:**
- Smart onboarding wizard
- AI pitch deck builder
- Intelligent CRM
- Task management with AI prioritization',

  '**Path to Customers:**

1. **Free Channels:**
   - Content marketing (SEO, blog)
   - Twitter/LinkedIn thought leadership
   - Product Hunt launch
   - Indie Hackers community

2. **Paid Channels:**
   - Google Ads (startup keywords)
   - LinkedIn Ads (founder targeting)
   - Podcast sponsorships

3. **Partnership Channels:**
   - Accelerator partnerships
   - VC portfolio tools
   - Startup tool bundles

**Current Focus:**
Content + community (organic growth)',

  '**Revenue Streams:**

1. **SaaS Subscriptions** (Primary - 90%)
   - Starter: $29/month
   - Pro: $99/month
   - Enterprise: Custom pricing

2. **Enterprise/Accelerator Licenses** (Emerging - 10%)
   - Per-cohort pricing
   - Annual contracts
   - White-label options

**Pricing Model:**
- Freemium with 14-day trial
- Usage-based limits on AI calls
- Premium features in higher tiers

**Target Metrics:**
- ARPU: $100/month
- LTV: $2,400
- Annual contract value (Enterprise): $25K',

  '**Fixed Costs:**
- Team salaries: $40K/month (3 FTE)
- Infrastructure: $5K/month
- Tools & software: $2K/month
- Office/remote: $1K/month

**Variable Costs:**
- AI API costs: $0.50-2.00 per user/month
- Payment processing: 2.9%
- Customer support: $5/user/month

**Total Monthly Burn:**
$50K (current)
$80K (post-raise)

**Break-even:**
~500 customers at $100 ARPU',

  '**Key Metrics to Track:**

1. **Acquisition:**
   - MRR / ARR
   - New users per week
   - Conversion rate (free → paid)

2. **Activation:**
   - Onboarding completion rate
   - Time to first pitch deck
   - Feature adoption %

3. **Retention:**
   - Monthly churn rate
   - Net Revenue Retention
   - DAU/MAU ratio

4. **Revenue:**
   - ARPU
   - LTV/CAC ratio
   - Expansion revenue %

**Current Numbers:**
- MRR: $8,500
- Monthly growth: 22%
- Churn: 4%
- LTV/CAC: 4.8x',

  '**Unfair Advantages:**

1. **Proprietary Methodology**
   - Codified best practices from YC, Sequoia, a16z
   - Continuously improved from user outcomes
   - Hard to replicate

2. **Data Network Effects**
   - Each user makes AI smarter
   - Investor database grows with usage
   - Benchmark data improves recommendations

3. **First Mover in AI-Native**
   - Competitors are retrofitting AI
   - We''re building AI-first
   - 18+ month head start

4. **Founder Background**
   - Serial entrepreneur credibility
   - Enterprise software experience
   - Stanford network

**Why Can''t Others Copy:**
- Requires both startup expertise AND AI capability
- Network effects compound over time
- Brand/community takes years to build',

  75.00, -- validation_score
  100, -- completeness_score (all 9 sections filled)
  2,
  true,
  'ai_enhanced',
  '{"last_ai_review": "2026-01-25", "insights_generated": 12}'::jsonb,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '2 days'
),
-- Canvas 112: Previous version (archived)
(
  '00000000-0000-0000-0000-000000000112'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'First-time founders lack guidance and structure',
  'First-time startup founders',
  'AI-powered startup guidance',
  'AI chatbot for founders',
  'Content marketing, Twitter',
  'SaaS subscription',
  'Team, infrastructure, AI costs',
  'MRR, users, churn',
  'First mover advantage',
  45.00,
  67,
  1,
  false,
  'manual',
  '{"archived_reason": "Expanded and refined after customer interviews"}'::jsonb,
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '60 days'
);

-- =============================================================================
-- END OF SEED: Lean Canvas (IDs 111-112)
-- =============================================================================
