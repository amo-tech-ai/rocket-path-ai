-- =============================================================================
-- Seed: Documents
-- Purpose: Create sample documents for /documents page
-- Startup: StartupAI (d33f795b-5a99-4df3-9819-52a4baba0895)
-- UUID Range: 102-110
-- =============================================================================

-- Clear existing documents for this startup
DELETE FROM public.documents WHERE startup_id = 'd33f795b-5a99-4df3-9819-52a4baba0895';

-- Insert sample documents
INSERT INTO public.documents (
  id,
  startup_id,
  type,
  title,
  content,
  content_json,
  version,
  status,
  ai_generated,
  created_by,
  metadata,
  created_at,
  updated_at
) VALUES
-- Document 102: Executive Summary
(
  '00000000-0000-0000-0000-000000000102'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'executive_summary',
  'StartupAI Executive Summary',
  'StartupAI is an AI-powered operating system for startup founders. We help first-time entrepreneurs build fundable companies 3x faster by providing 24/7 strategic guidance, automated workflows, and investor-ready materials.

**The Problem**
99% of startups fail, often due to lack of experienced guidance. First-time founders waste 6+ months on wrong activities. Traditional accelerators help only 1% of startups, leaving millions without support.

**Our Solution**
StartupAI provides AI-powered guidance that combines Y Combinator methodology with real-time market intelligence. Our platform includes:
- Smart onboarding that extracts startup data from existing sources
- AI pitch deck builder with investor-grade templates
- Intelligent CRM for managing investor relationships
- Automated task prioritization based on startup stage

**Traction**
- $8,500 MRR / $102K ARR
- 450 active users
- 85 paying customers
- 22% month-over-month growth

**The Team**
Led by Sanjiv Khullar, a serial entrepreneur with 15+ years in enterprise software.

**The Ask**
Raising $1.5M seed round to scale product development and go-to-market.',
  NULL,
  2,
  'final',
  false,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"word_count": 189, "last_reviewed": "2026-01-28"}'::jsonb,
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '2 days'
),
-- Document 103: One Pager
(
  '00000000-0000-0000-0000-000000000103'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'custom',
  'Investor One Pager - January 2026',
  NULL,
  '{
    "company": "StartupAI",
    "tagline": "The AI Co-Founder for First-Time Entrepreneurs",
    "problem": "99% of startups fail due to lack of guidance",
    "solution": "AI-powered operating system for founders",
    "market": "$50B TAM in startup infrastructure",
    "traction": {"mrr": 8500, "users": 450, "growth": "22% MoM"},
    "team": "Serial entrepreneurs + AI experts",
    "ask": "$1.5M seed round",
    "contact": "sanjiv@startupai.one"
  }'::jsonb,
  1,
  'final',
  true,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"format": "pdf", "generated_by": "ai"}'::jsonb,
  NOW() - INTERVAL '21 days',
  NOW() - INTERVAL '5 days'
),
-- Document 104: Financial Model Summary
(
  '00000000-0000-0000-0000-000000000104'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'financial_model',
  'Financial Model - 3 Year Projections',
  'Key Financial Metrics and Projections

**Current State (Jan 2026)**
- MRR: $8,500
- ARR: $102,000
- Customers: 85
- ARPU: $100/mo

**2026 Projections**
- Exit ARR: $500,000
- Customers: 400
- Growth: 5x

**2027 Projections**
- Exit ARR: $2,500,000
- Customers: 1,500
- Growth: 5x

**2028 Projections**
- Exit ARR: $10,000,000
- Customers: 5,000
- Growth: 4x

**Key Assumptions**
- CAC: $500 (improving with brand)
- LTV: $2,400 (24 month retention)
- LTV/CAC: 4.8x
- Gross Margin: 85%
- Net Revenue Retention: 115%',
  NULL,
  3,
  'draft',
  false,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"spreadsheet_url": null, "last_updated_by": "founder"}'::jsonb,
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '3 days'
),
-- Document 105: Data Room Index
(
  '00000000-0000-0000-0000-000000000105'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'custom',
  'Data Room - Document Index',
  'StartupAI Data Room Index

**Company Overview**
- Executive Summary ✓
- One Pager ✓
- Pitch Deck ✓

**Financials**
- Financial Model ✓
- Monthly P&L (in progress)
- Cap Table (pending)

**Legal**
- Certificate of Incorporation (pending)
- Bylaws (pending)
- IP Assignment (pending)

**Product**
- Product Demo Video (in progress)
- Technical Architecture (pending)
- Roadmap (pending)

**Team**
- Founder Bios ✓
- Org Chart (pending)
- Advisory Board (in progress)',
  NULL,
  1,
  'draft',
  false,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"completion_percent": 35}'::jsonb,
  NOW() - INTERVAL '14 days',
  NOW() - INTERVAL '1 day'
),
-- Document 106: AI-Generated Market Analysis
(
  '00000000-0000-0000-0000-000000000106'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'strategy',
  'Market Analysis: Startup Infrastructure',
  'AI-Generated Market Analysis

**Market Overview**
The startup infrastructure market represents a $50B+ opportunity, encompassing tools and services that help founders build, launch, and scale their companies.

**Key Segments**
1. Productivity Tools ($15B) - Notion, Airtable, Linear
2. Financial Tools ($12B) - Stripe, Brex, Mercury
3. Development Tools ($10B) - GitHub, Vercel, Supabase
4. Analytics/BI ($8B) - Amplitude, Mixpanel
5. Founder Tools ($5B) - Our target segment

**Trends Driving Growth**
- Creator economy growth (100M+ aspiring entrepreneurs)
- AI making personalized guidance scalable
- Remote work increasing demand for digital tools
- Democratization of startup creation

**Competitive Landscape**
Most existing tools are horizontal (serve all businesses). There is no purpose-built AI platform for founders.',
  NULL,
  1,
  'final',
  true,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"ai_model": "gemini-3-pro", "generated_at": "2026-01-20", "sources": ["Crunchbase", "PitchBook", "CB Insights"]}'::jsonb,
  NOW() - INTERVAL '12 days',
  NOW() - INTERVAL '10 days'
),
-- Document 107: Customer Case Study
(
  '00000000-0000-0000-0000-000000000107'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'custom',
  'Case Study: TechFounders Accelerator',
  'How TechFounders Accelerator Uses StartupAI

**The Challenge**
TechFounders runs a 12-week accelerator program with 20 startups per cohort. Their team of 3 mentors struggled to provide personalized guidance to each startup.

**The Solution**
They implemented StartupAI as their primary founder support tool, giving each startup access to:
- AI-powered pitch deck creation
- Automated task prioritization
- Progress tracking dashboard

**The Results**
- 3x more founder interactions per mentor
- 40% faster pitch deck creation
- 85% founder satisfaction score
- 2 startups raised seed rounds during program

**Quote**
"StartupAI has transformed how we support our founders. The AI handles the routine guidance, freeing our mentors to focus on high-value strategic advice."
- Emily Rodriguez, Program Director',
  NULL,
  1,
  'final',
  false,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"customer": "TechFounders", "approved": true}'::jsonb,
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '3 days'
),
-- Document 108: Product Roadmap
(
  '00000000-0000-0000-0000-000000000108'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'roadmap',
  'Product Roadmap 2026',
  'StartupAI Product Roadmap 2026

**Q1 2026 (Current)**
- V2 Platform Launch
- AI Interview Feature
- Enhanced CRM
- Workflow Trigger System

**Q2 2026**
- API Platform for Integrations
- Notion/Airtable Integration
- Enterprise Admin Dashboard
- White-label Option

**Q3 2026**
- Investor Matching AI
- Automated Outreach
- Due Diligence Automation
- Mobile App (Beta)

**Q4 2026**
- International Expansion
- Multi-language Support
- Advanced Analytics
- Partner Ecosystem

**Beyond 2026**
- AI Agent Marketplace
- Startup-to-Investor Matching Network
- Exit Planning Tools',
  NULL,
  2,
  'draft',
  false,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"last_board_review": "2026-01-15"}'::jsonb,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '5 days'
),
-- Document 109: Founder Bio
(
  '00000000-0000-0000-0000-000000000109'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'custom',
  'Founder Bio - Sanjiv Khullar',
  'Sanjiv Khullar - CEO & Founder

**Background**
Serial entrepreneur with 15+ years of experience building enterprise software companies. Previously founded and exited two B2B SaaS companies.

**Experience**
- Founded DataSync (acquired 2019)
- VP Engineering at Salesforce (2015-2018)
- Early engineer at Oracle (2008-2015)
- MS Computer Science, Stanford University

**Why StartupAI**
"I started my first company with no guidance and made every mistake in the book. It took me 3 failed attempts before I had a successful exit. I believe AI can democratize access to startup expertise, giving every founder the guidance I wish I had."

**Connect**
- LinkedIn: linkedin.com/in/sanjivkhullar
- Twitter: @sanjivkhullar
- Email: sanjiv@startupai.one',
  NULL,
  1,
  'final',
  false,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"headshot_url": null}'::jsonb,
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '30 days'
),
-- Document 110: Competition Analysis
(
  '00000000-0000-0000-0000-000000000110'::uuid,
  'd33f795b-5a99-4df3-9819-52a4baba0895'::uuid,
  'strategy',
  'Competitive Analysis',
  'StartupAI Competitive Analysis

**Direct Competitors**
None - We are first-to-market in AI-native founder tools.

**Adjacent Competitors**

1. **Notion** (Horizontal productivity)
- Strengths: Large user base, flexible
- Weaknesses: Not startup-specific, no AI guidance
- Our advantage: Purpose-built for founders

2. **Airtable** (Database/workflow)
- Strengths: Powerful, customizable
- Weaknesses: Requires setup, no guidance
- Our advantage: Opinionated workflows

3. **Pitch** (Presentation software)
- Strengths: Beautiful decks
- Weaknesses: Just slides, no strategy
- Our advantage: End-to-end platform

4. **Generic AI (ChatGPT, etc.)**
- Strengths: Versatile
- Weaknesses: No startup context, no workflow
- Our advantage: Integrated, persistent, actionable

**Moat**
- Proprietary startup methodology
- Integrated data from onboarding
- Network effects from investor database
- Continuous learning from user outcomes',
  NULL,
  1,
  'final',
  true,
  '4bf963de-44fa-4dcf-ab50-1d3b178497a3'::uuid,
  '{"ai_model": "claude-4.5", "reviewed": true}'::jsonb,
  NOW() - INTERVAL '18 days',
  NOW() - INTERVAL '8 days'
);

-- =============================================================================
-- END OF SEED: Documents (IDs 102-110)
-- =============================================================================
