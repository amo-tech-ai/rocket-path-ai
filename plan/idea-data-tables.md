# Idea Validation: Supabase Database Strategy

> **Purpose:** Database schema design for IdeaProof-style validation platform
> **Based on:** 01-idea-proof.md, 10-idea-market-research.md, 20-saas.md

---

## Table of Contents

1. [Data Model Overview](#1-data-model-overview)
2. [Core Tables](#2-core-tables)
3. [Validation & Scoring Tables](#3-validation--scoring-tables)
4. [Market Analysis Tables](#4-market-analysis-tables)
5. [Competitive Intelligence Tables](#5-competitive-intelligence-tables)
6. [Financial & Business Model Tables](#6-financial--business-model-tables)
7. [Roadmap & Resources Tables](#7-roadmap--resources-tables)
8. [Calculations & Formulas](#8-calculations--formulas)
9. [Database Relationships](#9-database-relationships)
10. [Implementation Priority](#10-implementation-priority)

---

## 1. Data Model Overview

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         IDEA VALIDATION DATA MODEL                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐       ┌──────────────┐       ┌──────────────┐           │
│   │  ideas   │──────▶│ validation_  │──────▶│   market_    │           │
│   │ (core)   │       │   scores     │       │   analysis   │           │
│   └──────────┘       └──────────────┘       └──────────────┘           │
│        │                    │                      │                    │
│        │                    │                      │                    │
│        ▼                    ▼                      ▼                    │
│   ┌──────────┐       ┌──────────────┐       ┌──────────────┐           │
│   │ target_  │       │  risk_       │       │ competitors  │           │
│   │ audience │       │  assessment  │       │              │           │
│   └──────────┘       └──────────────┘       └──────────────┘           │
│        │                    │                      │                    │
│        ▼                    ▼                      ▼                    │
│   ┌──────────┐       ┌──────────────┐       ┌──────────────┐           │
│   │ revenue_ │       │   roadmap    │       │  resources   │           │
│   │ models   │       │   phases     │       │              │           │
│   └──────────┘       └──────────────┘       └──────────────┘           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Domains

| Domain | Tables | Purpose |
|--------|--------|---------|
| **Core** | ideas, projects | Main entity storage |
| **Validation** | validation_scores, score_factors, recommendations | Scoring engine |
| **Market** | market_analysis, market_trends, market_segments | Market intelligence |
| **Competition** | competitors, competitor_features, positioning_matrix | Competitive analysis |
| **Financial** | unit_economics, revenue_projections, revenue_models | Business model |
| **Risk** | risk_assessments, opportunities | Risk/opportunity tracking |
| **Execution** | roadmap_phases, team_requirements, strategic_partners | Implementation |
| **Resources** | research_sources, curated_resources, gtm_channels | Supporting data |

---

## 2. Core Tables

### Table: `ideas`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK, default gen_random_uuid() | Unique identifier |
| `project_id` | uuid | FK → projects.id | Parent project |
| `user_id` | uuid | FK → auth.users.id, NOT NULL | Owner |
| `name` | text | NOT NULL | Idea name |
| `description` | text | | Full description |
| `problem_statement` | text | | Problem being solved |
| `solution_statement` | text | | Proposed solution |
| `target_audience` | text | | Target customer description |
| `monetization_plan` | text | | How it makes money |
| `industry` | text | | Industry category |
| `status` | text | DEFAULT 'draft' | draft, validating, validated, building |
| `overall_score` | integer | CHECK (0-100) | Calculated overall score |
| `confidence_score` | integer | CHECK (0-100) | AI confidence level |
| `validation_step` | integer | DEFAULT 1 | Current step (1-3) |
| `estimated_duration` | text | | "6-8 weeks" format |
| `created_at` | timestamptz | DEFAULT now() | Creation timestamp |
| `updated_at` | timestamptz | DEFAULT now() | Last update |

### Table: `idea_summaries`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id, UNIQUE | One summary per idea |
| `headline` | text | | "Promising with Caveats" |
| `executive_summary` | text | | One-paragraph decision snapshot |
| `top_opportunity` | text | | Primary opportunity identified |
| `top_risk` | text | | Primary risk identified |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `idea_recommendations`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `recommendation` | text | NOT NULL | Recommendation text |
| `priority` | integer | DEFAULT 1 | 1=highest priority |
| `category` | text | | strategic, tactical, immediate |
| `created_at` | timestamptz | DEFAULT now() | |

---

## 3. Validation & Scoring Tables

### Table: `validation_scores`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id, UNIQUE | One score set per idea |
| `problem_validation` | integer | CHECK (0-100) | Problem validation score |
| `solution_validation` | integer | CHECK (0-100) | Solution validation score |
| `market_validation` | integer | CHECK (0-100) | Market validation score |
| `market_analysis_score` | integer | CHECK (0-100) | Market analysis score |
| `risk_score` | integer | CHECK (0-100) | 100 = lowest risk |
| `differentiation_score` | integer | CHECK (0-100) | Uniqueness score |
| `confidence_score` | integer | CHECK (0-100) | AI confidence |
| `overall_score` | integer | CHECK (0-100) | Weighted average |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |

### Table: `score_factors`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `category` | text | NOT NULL | market, execution |
| `factor_name` | text | NOT NULL | Factor being scored |
| `score` | integer | CHECK (0-100) | Individual score |
| `weight` | decimal | DEFAULT 1.0 | Weight in calculation |
| `explanation` | text | | Score explanation |
| `created_at` | timestamptz | DEFAULT now() | |

**Market Factors:**
- Target Market Clarity
- Market Timing
- Market Readiness
- Entry Barriers
- Competition Level
- Problem-Solution Fit

**Execution Factors:**
- Founder/Personal Fit
- MVP Viability
- Value Proposition
- Initial Feasibility
- Resource Requirements

### Table: `validation_signals`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `signal_type` | text | NOT NULL | green_light, red_flag, strength, concern |
| `signal_text` | text | NOT NULL | Signal description |
| `severity` | text | | low, medium, high |
| `source` | text | | Where signal came from |
| `created_at` | timestamptz | DEFAULT now() | |

---

## 4. Market Analysis Tables

### Table: `market_analysis`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id, UNIQUE | One analysis per idea |
| `tam` | decimal | | Total Addressable Market ($) |
| `tam_formatted` | text | | "$3.1B" display format |
| `sam_low` | decimal | | SAM lower bound ($) |
| `sam_high` | decimal | | SAM upper bound ($) |
| `sam_formatted` | text | | "$310M-$620M" format |
| `som_low` | decimal | | SOM lower bound ($) |
| `som_high` | decimal | | SOM upper bound ($) |
| `som_formatted` | text | | "$25M-$75M" format |
| `cagr` | decimal | | Compound annual growth rate |
| `market_maturity` | text | | emerging, growing, mature, declining |
| `seasonality` | text | | none, low, medium, high |
| `competitor_count` | integer | | Number of competitors |
| `source_count` | integer | | Research sources used |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |

### Table: `market_segments`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `market_analysis_id` | uuid | FK → market_analysis.id | Parent analysis |
| `segment_name` | text | NOT NULL | Segment name |
| `market_size` | decimal | | Segment size ($) |
| `market_share` | decimal | | Share of TAM (%) |
| `description` | text | | Segment description |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `target_regions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `market_analysis_id` | uuid | FK → market_analysis.id | Parent analysis |
| `region` | text | NOT NULL | Region name |
| `market_size` | decimal | | Regional market size ($) |
| `market_share` | decimal | | Regional share (%) |
| `priority` | integer | DEFAULT 1 | Target priority |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `market_trends`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `trend_name` | text | NOT NULL | Trend description |
| `timeframe` | text | | short-term, medium-term, long-term |
| `impact` | text | | low, medium, high |
| `trend_type` | text | | trend, driver |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `market_benchmarks`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `market_analysis_id` | uuid | FK → market_analysis.id | Parent analysis |
| `metric_name` | text | NOT NULL | CAC, LTV, etc. |
| `metric_value` | decimal | NOT NULL | Numeric value |
| `metric_formatted` | text | | "$200" display format |
| `source` | text | | Data source |
| `source_url` | text | | Source link |
| `created_at` | timestamptz | DEFAULT now() | |

---

## 5. Competitive Intelligence Tables

### Table: `competitors`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `name` | text | NOT NULL | Competitor name |
| `website` | text | | Company website |
| `competitor_type` | text | | direct, indirect, alternative |
| `market_share` | decimal | | Estimated market share (%) |
| `funding_stage` | text | | seed, series_a, series_b, public |
| `funding_amount` | decimal | | Total funding ($) |
| `pricing_low` | decimal | | Lower pricing bound |
| `pricing_high` | decimal | | Upper pricing bound |
| `pricing_model` | text | | subscription, commission, etc. |
| `quality_score` | integer | CHECK (0-100) | Quality positioning |
| `price_score` | integer | CHECK (0-100) | Price positioning |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |

### Table: `competitor_products`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `competitor_id` | uuid | FK → competitors.id | Parent competitor |
| `product_name` | text | NOT NULL | Product name |
| `description` | text | | Product description |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `competitor_strengths_weaknesses`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `competitor_id` | uuid | FK → competitors.id | Parent competitor |
| `type` | text | NOT NULL | strength, weakness |
| `description` | text | NOT NULL | Description |
| `opportunity_for_us` | text | | How we can capitalize |
| `created_at` | timestamptz | DEFAULT now() | |

---

## 6. Financial & Business Model Tables

### Table: `unit_economics`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id, UNIQUE | One per idea |
| `startup_costs_low` | decimal | | Lower startup cost estimate |
| `startup_costs_high` | decimal | | Upper startup cost estimate |
| `cac` | decimal | | Customer Acquisition Cost |
| `ltv` | decimal | | Lifetime Value |
| `ltv_cac_ratio` | decimal | | GENERATED: ltv / cac |
| `arpu` | decimal | | Average Revenue Per User |
| `gross_margin` | decimal | | Gross margin (%) |
| `churn_rate` | decimal | | Monthly churn rate (%) |
| `payback_months` | decimal | | CAC payback period |
| `break_even_months` | integer | | Months to break even |
| `created_at` | timestamptz | DEFAULT now() | |
| `updated_at` | timestamptz | DEFAULT now() | |

### Table: `revenue_projections`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `year` | integer | NOT NULL | Year number (1, 2, 3...) |
| `revenue` | decimal | NOT NULL | Projected revenue ($) |
| `revenue_formatted` | text | | "$250K" display format |
| `growth_rate` | decimal | | YoY growth rate (%) |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `revenue_models`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `model_name` | text | NOT NULL | Model name |
| `model_type` | text | | subscription, commission, freemium, etc. |
| `fit_score` | text | | low, medium, high |
| `complexity` | text | | low, medium, high |
| `timeline_months` | integer | | Months to implement |
| `is_recommended` | boolean | DEFAULT false | Primary recommendation |
| `advantages` | text[] | | Array of advantages |
| `challenges` | text[] | | Array of challenges |
| `examples` | text[] | | Example companies |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `pricing_strategies`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `strategy_name` | text | NOT NULL | Strategy name |
| `price_low` | decimal | | Lower price point |
| `price_high` | decimal | | Upper price point |
| `pricing_unit` | text | | per_user, per_month, per_transaction |
| `is_selected` | boolean | DEFAULT false | Currently selected |
| `rationale` | text | | Why this strategy |
| `created_at` | timestamptz | DEFAULT now() | |

---

## 7. Roadmap & Resources Tables

### Table: `roadmap_phases`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `phase_number` | integer | NOT NULL | 1, 2, 3... |
| `phase_name` | text | NOT NULL | Phase name |
| `duration_months` | integer | | Duration in months |
| `budget` | decimal | | Phase budget ($) |
| `status` | text | DEFAULT 'planned' | planned, in_progress, completed |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `roadmap_activities`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `phase_id` | uuid | FK → roadmap_phases.id | Parent phase |
| `activity` | text | NOT NULL | Activity description |
| `is_milestone` | boolean | DEFAULT false | Is this a milestone? |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `budget_breakdown`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `category` | text | NOT NULL | Budget category |
| `amount` | decimal | NOT NULL | Amount ($) |
| `percentage` | decimal | | % of total budget |
| `period` | text | | year_1, year_2, etc. |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `team_requirements`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `team_size` | integer | | Total team size needed |
| `mvp_launch_month` | integer | | Month for MVP launch |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `team_roles`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `team_req_id` | uuid | FK → team_requirements.id | Parent requirements |
| `role_title` | text | NOT NULL | Role title |
| `is_required` | boolean | DEFAULT true | Required vs optional |
| `priority` | integer | DEFAULT 1 | Hiring priority |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `risk_assessments`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `risk_type` | text | NOT NULL | technical, market, financial, operational |
| `risk_description` | text | NOT NULL | Risk description |
| `severity` | text | | low, medium, high |
| `impact` | text | | Impact description |
| `mitigation` | text | | Mitigation strategy |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `opportunities`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `opportunity` | text | NOT NULL | Opportunity description |
| `impact` | text | | low, medium, high |
| `timeline` | text | | Timeline to realize |
| `revenue_potential` | text | | Revenue potential |
| `requirements` | text[] | | What's needed |
| `investment_required` | text | | Investment range |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `strategic_partners`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `partner_name` | text | NOT NULL | Partner name/type |
| `partner_type` | text | | strategic, technology, distribution |
| `value_proposition` | text | | What they bring |
| `timeline_months` | integer | | Time to partnership |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `gtm_channels`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `channel_name` | text | NOT NULL | Channel name |
| `effort` | text | | low, medium, high |
| `impact` | text | | low, medium, high |
| `description` | text | | Channel description |
| `estimated_cost` | decimal | | Estimated cost ($) |
| `timeline_months` | integer | | Timeline to implement |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `technology_assessment`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id, UNIQUE | One per idea |
| `innovation_level` | text | | low, moderate, significant, breakthrough |
| `complexity` | text | | low, medium, high |
| `dev_time_months` | integer | | Development timeline |
| `tech_stack` | text[] | | Recommended technologies |
| `scalability_notes` | text | | Scalability considerations |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `research_sources`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `category` | text | NOT NULL | market, competitor, financial, general |
| `publisher` | text | NOT NULL | Source publisher |
| `description` | text | | Source description |
| `url` | text | | Source URL |
| `priority` | text | | low, medium, high |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `curated_resources`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `resource_type` | text | NOT NULL | legal, survey, course, funding, advisor, community |
| `resource_name` | text | NOT NULL | Resource name |
| `url` | text | | Resource URL |
| `description` | text | | Description |
| `created_at` | timestamptz | DEFAULT now() | |

### Table: `key_questions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | uuid | PK | Unique identifier |
| `idea_id` | uuid | FK → ideas.id | Parent idea |
| `question` | text | NOT NULL | Question text |
| `category` | text | | differentiation, customers, pricing, etc. |
| `is_answered` | boolean | DEFAULT false | Has been answered |
| `answer` | text | | User's answer |
| `created_at` | timestamptz | DEFAULT now() | |

---

## 8. Calculations & Formulas

### Score Calculations

| Calculation | Formula | Description |
|-------------|---------|-------------|
| **Overall Score** | `(problem_validation * 0.25) + (solution_validation * 0.25) + (market_validation * 0.30) + (differentiation_score * 0.20)` | Weighted validation score |
| **Risk Score** | `100 - AVG(risk_severity_values)` | Higher = lower risk |
| **Confidence Score** | Based on data completeness and source quality | AI certainty level |

### Financial Calculations

| Calculation | Formula | Target |
|-------------|---------|--------|
| **LTV** | `(ARPU × Gross_Margin%) ÷ Churn_Rate` | Higher is better |
| **LTV:CAC Ratio** | `LTV ÷ CAC` | >3:1 minimum |
| **CAC Payback** | `CAC ÷ (Monthly_ARPU × Gross_Margin%)` | <12 months |
| **Gross Margin** | `(Revenue - Direct_Costs) ÷ Revenue × 100` | >70% for SaaS |
| **Net Revenue Retention** | `(Start_MRR + Expansion - Downgrades - Churn) ÷ Start_MRR × 100` | >100% |
| **Rule of 40** | `YoY_Growth% + EBITDA_Margin%` | >40% = healthy |
| **Magic Number** | `Net_New_ARR(Q) ÷ S&M_Spend(Q-1)` | >0.75 efficient |

### Market Calculations

| Calculation | Formula | Notes |
|-------------|---------|-------|
| **TAM** | Industry reports or bottom-up | Total market |
| **SAM** | `TAM × Reachable_Segment%` | Typically 10-30% of TAM |
| **SOM** | `SAM × Obtainable%` | 1-10% of SAM in year 1-3 |
| **CAGR** | `((End_Value / Start_Value)^(1/Years) - 1) × 100` | Growth rate |

### Database Functions (PostgreSQL)

```sql
-- Calculate LTV
CREATE OR REPLACE FUNCTION calculate_ltv(
  p_arpu DECIMAL,
  p_gross_margin DECIMAL,
  p_churn_rate DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  IF p_churn_rate = 0 THEN
    RETURN NULL;
  END IF;
  RETURN (p_arpu * p_gross_margin) / p_churn_rate;
END;
$$ LANGUAGE plpgsql;

-- Calculate LTV:CAC Ratio
CREATE OR REPLACE FUNCTION calculate_ltv_cac_ratio(
  p_ltv DECIMAL,
  p_cac DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  IF p_cac = 0 THEN
    RETURN NULL;
  END IF;
  RETURN p_ltv / p_cac;
END;
$$ LANGUAGE plpgsql;

-- Calculate Payback Period
CREATE OR REPLACE FUNCTION calculate_payback_months(
  p_cac DECIMAL,
  p_arpu DECIMAL,
  p_gross_margin DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  IF (p_arpu * p_gross_margin) = 0 THEN
    RETURN NULL;
  END IF;
  RETURN p_cac / (p_arpu * p_gross_margin);
END;
$$ LANGUAGE plpgsql;

-- Calculate Overall Validation Score
CREATE OR REPLACE FUNCTION calculate_overall_score(
  p_problem_score INTEGER,
  p_solution_score INTEGER,
  p_market_score INTEGER,
  p_differentiation_score INTEGER
) RETURNS INTEGER AS $$
BEGIN
  RETURN ROUND(
    (p_problem_score * 0.25) +
    (p_solution_score * 0.25) +
    (p_market_score * 0.30) +
    (p_differentiation_score * 0.20)
  );
END;
$$ LANGUAGE plpgsql;

-- Calculate Rule of 40
CREATE OR REPLACE FUNCTION calculate_rule_of_40(
  p_growth_rate DECIMAL,
  p_profit_margin DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN p_growth_rate + p_profit_margin;
END;
$$ LANGUAGE plpgsql;
```

### Triggers for Auto-Calculation

```sql
-- Auto-update LTV:CAC ratio when unit_economics changes
CREATE OR REPLACE FUNCTION update_ltv_cac_ratio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ltv_cac_ratio := calculate_ltv_cac_ratio(NEW.ltv, NEW.cac);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_ltv_cac_ratio
  BEFORE INSERT OR UPDATE ON unit_economics
  FOR EACH ROW
  EXECUTE FUNCTION update_ltv_cac_ratio();

-- Auto-update overall score when validation_scores changes
CREATE OR REPLACE FUNCTION update_overall_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.overall_score := calculate_overall_score(
    NEW.problem_validation,
    NEW.solution_validation,
    NEW.market_validation,
    NEW.differentiation_score
  );
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_overall_score
  BEFORE INSERT OR UPDATE ON validation_scores
  FOR EACH ROW
  EXECUTE FUNCTION update_overall_score();
```

---

## 9. Database Relationships

### Foreign Key Relationships

```sql
-- ideas (root table)
ALTER TABLE idea_summaries
  ADD CONSTRAINT fk_idea_summaries_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE idea_recommendations
  ADD CONSTRAINT fk_idea_recommendations_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE validation_scores
  ADD CONSTRAINT fk_validation_scores_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE score_factors
  ADD CONSTRAINT fk_score_factors_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE validation_signals
  ADD CONSTRAINT fk_validation_signals_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE market_analysis
  ADD CONSTRAINT fk_market_analysis_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE market_trends
  ADD CONSTRAINT fk_market_trends_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE competitors
  ADD CONSTRAINT fk_competitors_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE unit_economics
  ADD CONSTRAINT fk_unit_economics_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE revenue_projections
  ADD CONSTRAINT fk_revenue_projections_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE revenue_models
  ADD CONSTRAINT fk_revenue_models_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE roadmap_phases
  ADD CONSTRAINT fk_roadmap_phases_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE risk_assessments
  ADD CONSTRAINT fk_risk_assessments_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

ALTER TABLE opportunities
  ADD CONSTRAINT fk_opportunities_idea
  FOREIGN KEY (idea_id) REFERENCES ideas(id) ON DELETE CASCADE;

-- Child tables
ALTER TABLE market_segments
  ADD CONSTRAINT fk_market_segments_analysis
  FOREIGN KEY (market_analysis_id) REFERENCES market_analysis(id) ON DELETE CASCADE;

ALTER TABLE target_regions
  ADD CONSTRAINT fk_target_regions_analysis
  FOREIGN KEY (market_analysis_id) REFERENCES market_analysis(id) ON DELETE CASCADE;

ALTER TABLE market_benchmarks
  ADD CONSTRAINT fk_market_benchmarks_analysis
  FOREIGN KEY (market_analysis_id) REFERENCES market_analysis(id) ON DELETE CASCADE;

ALTER TABLE competitor_products
  ADD CONSTRAINT fk_competitor_products_competitor
  FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE;

ALTER TABLE competitor_strengths_weaknesses
  ADD CONSTRAINT fk_competitor_sw_competitor
  FOREIGN KEY (competitor_id) REFERENCES competitors(id) ON DELETE CASCADE;

ALTER TABLE roadmap_activities
  ADD CONSTRAINT fk_roadmap_activities_phase
  FOREIGN KEY (phase_id) REFERENCES roadmap_phases(id) ON DELETE CASCADE;

ALTER TABLE team_roles
  ADD CONSTRAINT fk_team_roles_requirements
  FOREIGN KEY (team_req_id) REFERENCES team_requirements(id) ON DELETE CASCADE;
```

---

## 10. Implementation Priority

### Phase 1: Core Tables (Week 1)

| Priority | Table | Reason |
|----------|-------|--------|
| P0 | `ideas` | Core entity |
| P0 | `validation_scores` | Primary output |
| P0 | `idea_summaries` | Executive summary |
| P1 | `idea_recommendations` | Key actions |
| P1 | `validation_signals` | Green lights / red flags |

### Phase 2: Market Analysis (Week 2)

| Priority | Table | Reason |
|----------|-------|--------|
| P0 | `market_analysis` | TAM/SAM/SOM |
| P1 | `market_trends` | Trend tracking |
| P1 | `market_benchmarks` | Industry benchmarks |
| P2 | `market_segments` | Segment breakdown |
| P2 | `target_regions` | Geographic data |

### Phase 3: Competition (Week 3)

| Priority | Table | Reason |
|----------|-------|--------|
| P0 | `competitors` | Competitor profiles |
| P1 | `competitor_products` | Product details |
| P1 | `competitor_strengths_weaknesses` | SWOT data |

### Phase 4: Financial (Week 4)

| Priority | Table | Reason |
|----------|-------|--------|
| P0 | `unit_economics` | Core unit econ |
| P0 | `revenue_models` | Business model |
| P1 | `revenue_projections` | Financial forecast |
| P1 | `pricing_strategies` | Pricing options |

### Phase 5: Execution (Week 5-6)

| Priority | Table | Reason |
|----------|-------|--------|
| P1 | `roadmap_phases` | Implementation plan |
| P1 | `risk_assessments` | Risk tracking |
| P2 | `opportunities` | Growth opportunities |
| P2 | `team_requirements` | Team planning |
| P2 | `strategic_partners` | Partnership tracking |
| P2 | `gtm_channels` | Go-to-market |
| P2 | `score_factors` | Detailed scoring |
| P3 | `research_sources` | Source tracking |
| P3 | `curated_resources` | Resource library |
| P3 | `key_questions` | Discovery questions |

---

## Summary

| Category | Tables | Key Calculations |
|----------|--------|------------------|
| **Core** | 3 | Overall score |
| **Validation** | 3 | Problem/Solution/Market scores |
| **Market** | 5 | TAM/SAM/SOM, CAGR |
| **Competition** | 3 | Positioning matrix |
| **Financial** | 4 | LTV, CAC, LTV:CAC, Payback |
| **Execution** | 10 | Budget breakdown, ROI |
| **Total** | **28 tables** | **12 calculations** |

---

*Generated from: 01-idea-proof.md, 10-idea-market-research.md, 20-saas.md*
