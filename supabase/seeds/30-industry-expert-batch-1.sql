-- supabase/seeds/30-industry-expert-batch-1.sql
-- Industries: Healthcare, Cybersecurity, Legal & Professional, Education

BEGIN;

-- 1. Healthcare (healthcare)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "days_sales_outstanding": "< 45 days",
        "cac_payback": "< 18 months",
        "clinician_churn": "< 10% annual",
        "implementation_time": "< 3 months",
        "regulatory_compliance_score": "100%",
        "gross_margin": "> 70% (Software) / > 40% (Services)"
    }'::jsonb,
    warning_signs = '[
        "No HIPAA or GDPR compliance documentation in early Seed stage.",
        "Clinical trials heavily biased toward a single demographic or geography.",
        "High reliance on manual data entry by busy clinicians without automated integration.",
        "Sales cycles exceeding 12 months for enterprise hospital systems.",
        "Unclear reimbursement strategy (CPT codes not identified)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Pilot Purgatory",
            "description": "Getting stuck in endless free or low-cost pilots with health systems that never transition to enterprise contracts."
        },
        {
            "pattern": "The Regulatory Wall",
            "description": "Underestimating the time and cost for FDA clearance or data privacy certifications, leading to bankruptcy before launch."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Clinical validation data; initial provider interest; clear regulatory roadmap.",
        "Seed": "2+ institutional pilots; HIPAA compliant; identified reimbursement path.",
        "Series A": "$1M+ ARR; proven clinical outcomes; scalability across multiple networks."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'healthcare';

-- 2. Cybersecurity (cybersecurity)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "mean_time_to_detect_mttd": "< 24 hours",
        "mean_time_to_remediate_mttr": "< 4 hours",
        "false_positive_rate": "< 5%",
        "net_retention_nrr": "> 110%",
        "cac_ratio": "> 3.0",
        "gross_margin": "> 75%"
    }'::jsonb,
    warning_signs = '[
        "Reliance on a single signature-based detection method without behavioral analysis.",
        "Lack of SOC2 Type II or ISO 27001 certification at the growth stage.",
        "Significant performance overhead (>10% CPU/Memory) on user devices.",
        "High churn following a publicized data breach or vulnerability discovery.",
        "Long sales cycles involving multiple levels of CISO approval."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Feature-Not-Product Trap",
            "description": "Building a point solution that major platform players (CrowdStrike, Palo Alto) add as a free feature."
        },
        {
            "pattern": "The Complexity Barrier",
            "description": "Creating a tool so complex that it requires weeks of training for security analysts, leading to low adoption."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Technical founder depth; alpha with security teams; unique defense mechanism.",
        "Seed": "$200k+ ARR; SOC2 underway; friction-less POC (Proof of Concept) model.",
        "Series A": "$2M+ ARR; channel partnerships; high analyst rating (Gartner/Forrester)."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'cybersecurity';

-- 3. Legal & Professional (legal_professional)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "billable_hour_efficiency": "> 20% gain via automation",
        "document_turnaround_time": "< 2 hours",
        "customer_acquisition_cost": "< $200 per law firm seat",
        "monthly_recurring_revenue": "> $50 per user",
        "churn": "< 1% monthly (Enterprise)",
        "accuracy_rate": "> 99.9% for search/retrieval"
    }'::jsonb,
    warning_signs = '[
        "AI hallucinations in legal citations or case law references.",
        "Resistance from senior partners due to traditional billable hour incentives.",
        "Lack of robust version control or audit trails in document automation.",
        "Data residency issues (clients requiring data to stay within specific jurisdictions).",
        "Poor integration with existing Practice Management Systems (Clio, NetDocuments)."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The Billable Hour Paradox",
            "description": "Selling software that makes lawyers more efficient is difficult when they charge by the hour; missing the shift to fixed-fee models."
        },
        {
            "pattern": "The Integrity Breach",
            "description": "One major error in a filing or contract leading to total loss of trust within the legal community."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Domain expert founders; MVP with document processing; initial boutique firm traction.",
        "Seed": "$500k ARR; integrations with major PMS; proprietary legal graph/database.",
        "Series A": "$3M+ ARR; expansion into AM Law 100 firms; proven efficiency gains."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'legal_professional';

-- 4. Education (education)
UPDATE public.industry_playbooks
SET 
    benchmarks = '{
        "student_engagement_rate": "> 60% daily active",
        "completion_rate": "> 40% (B2C) / > 80% (B2B)",
        "acv_school_district": "> $25,000",
        "renewals": "> 90% (Annual cycles)",
        "learning_outcome_lift": "> 15% vs control group",
        "gross_margin": "> 60%"
    }'::jsonb,
    warning_signs = '[
        "High reliance on discretionary teacher spend rather than district budgets.",
        "Low usage during summer months leads to high seasonal churn.",
        "Lack of alignment with state or national curriculum standards (Common Core, etc.).",
        "Data privacy concerns (COPPA/FERPA) not addressed in the architecture.",
        "High cost of content creation without a scalable user-generated loop."
    ]'::jsonb,
    failure_patterns = '[
        {
            "pattern": "The District Sales Desert",
            "description": "Building a great tool but failing to navigate the 18-month procurement cycle of public school districts."
        },
        {
            "pattern": "The Engagement Cliff",
            "description": "Users sign up for the novelty of learning but drop off after the first week due to lack of gamification or utility."
        }
    ]'::jsonb,
    investor_expectations = '{
        "Pre-seed": "Pedagogical foundation; initial classroom pilots; organic teacher adoption.",
        "Seed": "$300k+ ARR or 50k+ active students; district-wide pilots; COPPA/FERPA compliant.",
        "Series A": "$2M+ ARR; proven efficacy data; expansion across states/regions."
    }'::jsonb,
    is_active = true,
    updated_at = NOW()
WHERE industry_id = 'education';

COMMIT;
