-- supabase/seeds/28-saas-expert-data.sql
-- Description: Populate high-fidelity expert knowledge for the SaaS (Software as a Service) industry.

BEGIN;

UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "ltv_cac_ratio": "> 3.0",
        "monthly_net_revenue_retention": "> 100% (Negative Churn)",
        "cac_payback_months": "< 12 months",
        "magic_number": "> 0.75",
        "gross_margin": "> 80%",
        "rule_of_40": "> 40% (Growth Rate + Profit Margin)"
    }'::jsonb,
    warning_signs = '[
        "High gross churn (>5% monthly) being hidden by aggressive new customer acquisition.",
        "CAC increasing linearly with scale, indicating lack of organic growth loops.",
        "Sales cycles exceeding 9 months for mid-market ACVs (<$50k).",
        "Low feature adoption (<20%) of the core value proposition.",
        "Heavy reliance on professional services (>20% of total revenue) to mask product gaps."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Churn Silent Killer",
            "description": "Ignoring high small-business churn while focusing on top-of-funnel growth, leading to an unsustainable bucket that empties as fast as it fills."
        },
        {
            "pattern": "The Service Trap",
            "description": "Becoming a custom development shop for one or two large customers, losing the ability to build a scalable, multi-tenant product."
        },
        {
            "pattern": "The Mid-Market Death Valley",
            "description": "Having a product too expensive for self-service but too simple for enterprise sales, leading to high sales costs with low contract values."
        }
    ]'::jsonb,
    terminology = '{
        "MRR / ARR": "Monthly Recurring Revenue / Annual Recurring Revenue.",
        "Churn (Gross vs Net)": "Gross is lost revenue; Net includes expansion revenue from existing customers.",
        "ARPU / ARPA": "Average Revenue Per User / Average Revenue Per Account.",
        "LTV": "Lifetime Value; the total revenue expected from a customer over their relationship.",
        "CAC": "Customer Acquisition Cost; the total cost to acquire a new customer.",
        "Cohort Analysis": "Grouping users by their join date to track retention patterns over time.",
        "PLG (Product-Led Growth)": "A strategy where the product itself is the primary driver of customer acquisition and expansion."
    }'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Working MVP; initial design partners; evidence of problem-solution fit via qualitative feedback.",
        "Seed": "$10k - $50k MRR; proven acquisition channel; initial cohort retention data showing promise.",
        "Series A": "$1M+ ARR; repeatable sales playbook; Magic Number > 1.0; Net Revenue Retention > 100%."
    }'::jsonb,
    gtm_patterns = '[
        "Product-Led Growth (PLG) with self-service freemium models.",
        "Inbound content marketing and SEO targeting specific workflow pain points.",
        "Account-Based Marketing (ABM) for high-ACV enterprise segments."
    ]'::jsonb,
    slide_emphasis = '{
        "Retention_&_Cohorts": "Critical (Show the cohorts table)",
        "GTM_Playbook": "High (Show how you scale the machine)",
        "Unit_Economics": "High (LTV/CAC and Payback Period)"
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'saas';

COMMIT;
