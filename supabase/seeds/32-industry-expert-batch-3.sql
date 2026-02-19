-- supabase/seeds/32-industry-expert-batch-3.sql
-- Industries: Events Management, CRM & Social Media, Financial Services, Content Marketing

BEGIN;

-- 1. Events Management (events_management)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "registration_to_show_ratio": "> 50% (Virtual) / > 80% (In-person)",
        "acv_enterprise_event": "> $50,000",
        "attendee_nps": "> 60",
        "sponsorship_revenue_retention": "> 70%",
        "cost_per_attendee": "< $50 (Virtual)",
        "gross_margin": "> 40% (Events) / > 80% (SaaS)"
    }'::jsonb,
    warning_signs = '[
        "High churn of sponsors or exhibitors year-over-year.",
        "Lack of post-event data engagement (lead retrieval rates <20%).",
        "Over-reliance on a single major annual event for >90% of revenue.",
        "Significant technical issues in virtual event software during peak load.",
        "Low mobile app adoption during in-person events (<30%)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Empty Hall",
            "description": "Failing to build a recurring community between events, leading to starting from zero for every registration cycle."
        },
        {
            "pattern": "The Platform Bloat",
            "description": "Building too many features (ticketing, streaming, networking) instead of excelling at one, leading to a buggy, jack-of-all-trades product."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique event tech or niche; proof of community interest; initial bookings.",
        "Seed": "$500k ARR or 5 Major Events; high attendee engagement metrics.",
        "Series A": "$3M+ ARR; established multi-event strategy; proven sponsor ROI."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'events_management';

-- 2. CRM & Social Media (crm_social_media)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "daily_active_usage_dau": "> 40%",
        "data_enrichment_accuracy": "> 95%",
        "integration_depth": "> 5 active API connections per user",
        "monthly_net_retention": "> 105%",
        "average_seats_per_org": "> 5",
        "gross_margin": "> 85%"
    }'::jsonb,
    warning_signs = '[
        "Users spending <10 minutes per day in the platform (it''s not the system of record).",
        "High percentage of duplicate contacts or stale social data.",
        "Reliance on fragile web scraping for social data without official API access.",
        "Complexity prevents non-technical teams from setting up workflows.",
        "Competitive pressure from incumbents (Salesforce/HubSpot) adding the niche feature."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Data Graveyard",
            "description": "Providing a place to store data but no automated way to keep it fresh or actionable, leading to users abandoning it once it becomes messy."
        },
        {
            "pattern": "The API De-platforming",
            "description": "Building a tool dependent on a single social network (LinkedIn/X) that shuts down access or changes terms overnight."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique workflow or data layer; proof of utility for sales/marketing teams.",
        "Seed": "$50k MRR; 50%+ DAU/MAU; proven integrations with major stacks.",
        "Series A": "$2M+ ARR; expansion into enterprise; clear data moat/network effect."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'crm_social_media';

-- 3. Financial Services (financial_services)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "aum_growth_rate": "> 20% QoQ",
        "net_interest_margin": "> 3.0%",
        "cost_of_funds": "< 2.0%",
        "loan_to_deposit_ratio": "80% - 90%",
        "default_rate": "< 2.5%",
        "gross_margin": "> 60%"
    }'::jsonb,
    warning_signs = '[
        "Lack of diversified funding sources for lending operations.",
        "Significant concentration risk (top 5 clients >30% of AUM).",
        "Regulatory inquiries or warnings from national financial authorities.",
        "High processing latency for transactions or withdrawals (>24 hours).",
        "Inadequate KYC/AML automation leading to high manual review rates."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Liquidty Crunch",
            "description": "Mismatch between asset and liability durations, leading to inability to meet withdrawal demands during a market downturn."
        },
        {
            "pattern": "The Compliance Sinkhole",
            "description": "Scaling volume so fast that compliance systems break, leading to massive fines that exceed total venture capital raised."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Qualified leadership (banking/fintech background); clear license strategy; MVP.",
        "Seed": "$10M+ AUM or $100M+ Transaction Volume; initial regulatory approvals.",
        "Series A": "Stable unit economics; full regulatory stack; path to becoming a primary accounts provider."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'financial_services';

-- 4. Content Marketing (content_marketing)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "organic_traffic_growth": "> 15% MoM",
        "content_conversion_rate": "> 3% (To MQL)",
        "cost_per_lead_cpl": "< $50",
        "average_time_on_page": "> 3 minutes",
        "referral_traffic_share": "> 20%",
        "gross_margin": "> 80% (SaaS) / > 40% (Agencies)"
    }'::jsonb,
    warning_signs = '[
        "High bounce rates (>80%) indicating low relevance of content to target keywords.",
        "Heavy reliance on a single traffic source (e.g., Google Search) vulnerable to algorithm changes.",
        "Lack of clear attribution (not knowing which content drives revenue).",
        "High cost of content production compared to the leads generated.",
        "Low social sharing or engagement (content is a ghost town)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The SEO Vanity Trap",
            "description": "Ranking for high-volume keywords that have zero commercial intent, leading to high traffic but zero revenue."
        },
        {
            "pattern": "The AI Content Erosion",
            "description": "Producing low-quality, AI-generated content that gets penalized by search engines or ignored by sophisticated readers."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique content angle or tech layer (AI); initial audience traction; MQL data.",
        "Seed": "$50k MRR; proven SEO flywheel; clear ROI for customers.",
        "Series A": "$2M+ ARR; established brand authority; multichannel content machine."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'content_marketing';

COMMIT;
