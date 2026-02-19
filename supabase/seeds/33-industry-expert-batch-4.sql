-- supabase/seeds/33-industry-expert-batch-4.sql
-- Industries: Photography Production, Video Production, Social Media Marketing, Sales & Marketing AI

BEGIN;

-- 1. Photography Production (photography_production)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "edit_turnaround_time": "< 48 hours",
        "client_selection_rate": "> 80% (Choosing more than base package)",
        "average_booking_value": "> $1,500 (B2B) / > $400 (B2C)",
        "referral_rate": "> 30%",
        "asset_delivery_speed": "< 1 hour (Preview) / < 24 hours (Final)",
        "gross_margin": "> 60%"
    }'::jsonb,
    warning_signs = '[
        "Inconsistent image quality across different photographers in a multi-shooter studio.",
        "Lack of high-speed redundant backup for raw assets (single point of failure).",
        "Slow delivery of final assets (>2 weeks) leading to client frustration.",
        "Low uptake of value-add services (retouching, printing, licensing).",
        "Manual booking and invoicing process leading to high overhead."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Freelancer Plateau",
            "description": "Failing to build a scalable system or agency model, remaining dependent on the founder''s individual time and talent."
        },
        {
            "pattern": "The Asset Management Nightmare",
            "description": "Losing track of client assets or failing to implement searchable metadata, leading to massive time loss in retrieval."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Unique production technology or niche; high-quality portfolio; initial commercial clients.",
        "Seed": "$20k Monthly Revenue; recurring agency contracts; proprietary post-production workflow.",
        "Series A": "$2M+ ARR; established B2B presence; scalable network of creators."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'photography_production';

-- 2. Video Production (video_production)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "render_efficiency_gain": "> 3x via automation/AI",
        "video_completion_rate": "> 70%",
        "acv_commercial_video": "> $15,000",
        "revision_cycle_count": "< 2 per project",
        "post_production_ratio": "3:1 (Hours spent per minute of final video)",
        "gross_margin": "> 50%"
    }'::jsonb,
    warning_signs = '[
        "Rendering bottlenecks halting creative workflow for hours.",
        "Inadequate audio quality or lack of professional sound design.",
        "High rates of revision requests (>3) indicating poor brief alignment.",
        "Lack of standardized metadata for B-roll library retrieval.",
        "Heavy reliance on a single lead editor for all high-value projects."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Scope Creep Sinkhole",
            "description": "Failing to define project boundaries, leading to infinite revisions that turn a profitable project into a loss."
        },
        {
            "pattern": "The Tech Obsolescence",
            "description": "Investing in expensive hardware that becomes obsolete before it reaches ROI, rather than leveraging cloud-based workflows."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Creative/Technical founder duo; high-value pilot project; proprietary tech/AI layer.",
        "Seed": "$500k GMV or $50k MRR; scalable editing/rendering pipeline; recurring B2B deals.",
        "Series A": "$4M+ ARR; expansion into enterprise brand management; proven cost efficiency vs traditional agencies."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'video_production';

-- 3. Social Media Marketing (social_media_marketing)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "engagement_rate_per_post": "> 1.5%",
        "follower_growth_rate": "> 5% MoM",
        "click_through_rate_ctr": "> 2.0%",
        "cost_per_engagement": "< $0.10",
        "viral_coefficient": "> 1.2",
        "gross_margin": "> 70%"
    }'::jsonb,
    warning_signs = '[
        "Engagement driven primarily by non-target regions or bot accounts.",
        "Lack of response to user comments or DMs (>24 hour delay).",
        "Consistent decline in organic reach indicating algorithm shadow-banning.",
        "Content strategy mismatch with platform-specific trends (e.g., posting legacy video on TikTok).",
        "High frequency of negative sentiment in comments without mitigation."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Algorithm Dependency",
            "description": "Building a business model that collapses when a single platform (Instagram/TikTok) changes its feed algorithm."
        },
        {
            "pattern": "The Vanity Metric Mirage",
            "description": "Focusing on follower counts while ignoring actual conversion to traffic or revenue, leading to high-cost, low-impact growth."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Proven audience growth logic; proprietary AI for content generation; initial clients.",
        "Seed": "$100k Monthly GMV or $30k MRR; high-quality case studies; multi-platform efficacy.",
        "Series A": "$3M+ ARR; established influencer/creation network; scalable ad-tech layer."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'social_media_marketing';

-- 4. Sales & Marketing AI (sales_marketing_ai)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "mql_to_sql_conversion": "> 25%",
        "lead_response_time": "< 2 minutes (Automated)",
        "outbound_reply_rate": "> 8% (Personalized AI)",
        "marketing_pipeline_contribution": "> 40% of total revenue",
        "cac_efficiency_gain": "> 30% reduction via AI",
        "gross_margin": "> 85%"
    }'::jsonb,
    warning_signs = '[
        "AI personalization feels generic or robotic ('I noticed you are a Human at Company').",
        "Lack of integration with core CRMs (Salesforce/HubSpot).",
        "High unsubscribe or spam report rates (>1%) for AI outbound campaigns.",
        "Poor handling of nuanced customer objections in automated chat/email.",
        "Over-automation leads to a cold brand perception and lower brand trust."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Spam Cannon",
            "description": "Using AI to generate volume over quality, leading to domain blacklisting and permanent damage to sales prospect relationships."
        },
        {
            "pattern": "The Integration Wall",
            "description": "Building a tool that marketing teams can''t easily slot into their existing tech stack, leading to high friction and low adoption."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Novel AI application for specific pain point; initial design partners; high conversion lift.",
        "Seed": "$50k MRR; proven reduction in sales cycle time; repeatable GTM motion.",
        "Series A": "$2M+ ARR; expansion into multi-channel AI agents; proven enterprise ROI."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'sales_marketing_ai';

COMMIT;
