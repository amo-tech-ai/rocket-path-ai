-- supabase/seeds/27-fintech-expert-data.sql
-- Description: Populate high-fidelity expert knowledge for the Fintech industry.

BEGIN;

UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "avg_payback_period": "< 12 months",
        "ltv_cac_ratio": "> 3.0",
        "monthly_net_churn": "< 2% (B2B) / < 5% (B2C)",
        "gross_transaction_margin": "> 70%",
        "fraud_rate_bps": "< 10 bps (0.1%)",
        "kyc_conversion_rate": "> 85%"
    }'::jsonb,
    warning_signs = '[
        "Regulatory dependency on a single Banking-as-a-Service (BaaS) partner with no redundancy.",
        "Negative unit economics masked by rapid top-line transaction volume growth.",
        "Lack of designated internal Compliance or AML officer at Seed stage or beyond.",
        "High decline rates (>15%) during top-of-funnel KYC/Onboarding.",
        "Excessive reliance on high-cost interchange as the primary revenue stream without value-add fees."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Regulatory Wall",
            "description": "Scaling customer acquisition aggressively before securing necessary licensing or passing partner bank audits, leading to forced shutdown or massive fines."
        },
        {
            "pattern": "The Capital Trap",
            "description": "Fintechs are capital-intensive; failing to prove positive unit economics (Contribution Margin 2) before the initial VC capital runs out."
        },
        {
            "pattern": "The Fraud Spiral",
            "description": "Optimizing for low-friction onboarding at the expense of robust fraud detection, resulting in catastrophic loss events that trigger bank partner termination."
        }
    ]'::jsonb,
    terminology = '{
        "Interchange": "The fee paid by a merchant to the card-issuing bank for every transaction.",
        "BaaS (Banking-as-a-Service)": "Platforms that allow non-banks to offer financial services via API, usually backed by a partner bank.",
        "KYC/AML": "Know Your Customer and Anti-Money Laundering; the regulatory requirements to verify identity and prevent financial crimes.",
        "GTV (Gross Transaction Volume)": "The total dollar amount of transactions processed through the platform.",
        "BIN (Bank Identification Number)": "The first 4-6 digits of a credit card used to identify the issuing institution.",
        "NIM (Net Interest Margin)": "The difference between interest income generated and the amount of interest paid out."
    }'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Working MVP with at least one core infrastructure partner (Stripe, Unit, Treasury Prime) integrated; LOIs from initial B2B customers.",
        "Seed": "$1M+ Monthly Gross Transaction Volume (GTV); initial evidence of cohort-based retention and LTV > CAC proof.",
        "Series A": "$3M - $5M ARR; clear path to full regulatory licensing (if required); scalable GTM and robust unit economics."
    }'::jsonb,
    gtm_patterns = '[
        "B2B2C distribution via existing platforms (Embedded Finance).",
        "Content-led acquisition targeting specific financial pain points (tax, payroll).",
        "High-touch direct sales for enterprise treasury or infrastructure solutions."
    ]'::jsonb,
    slide_emphasis = '{
        "Compliance_&_Regulatory": "High (Explain the moat here)",
        "Business_Model": "Critical (Show interchange vs. fees)",
        "Security_&_Fraud": "Medium-High (Trust is the product)"
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'fintech';

COMMIT;
