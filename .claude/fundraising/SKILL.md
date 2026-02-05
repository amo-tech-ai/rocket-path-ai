---
name: fundraising
description: Use this skill when building fundraising features - investor targeting, pitch materials, data room setup, term sheet analysis, and pipeline management. Triggers on "fundraising", "investor", "pitch deck", "term sheet", "data room", "Series A", "seed round", "capital raise".
---

# Fundraising

## Overview

Guide founders through the complete fundraising journey: readiness assessment, materials preparation, investor targeting, outreach campaigns, pipeline management, and term sheet negotiation.

## When to Use

- Building fundraising readiness checklists
- Creating investor targeting/matching features
- Implementing pitch deck generation
- Designing data room organization
- Building investor CRM/pipeline tracking
- Analyzing term sheets

## Fundraising Phases

```
PHASE 1: READINESS ASSESSMENT
├── Investment readiness checklist
├── Gap analysis (metrics, docs, team)
├── Stage-appropriate benchmarks
└── GATE: Readiness score ≥70% → Proceed

PHASE 2: MATERIALS PREPARATION
├── Pitch deck (industry-specific)
├── One-pager / Executive summary
├── Financial model
├── Data room setup
└── GATE: All docs complete → Proceed

PHASE 3: INVESTOR TARGETING
├── Build investor list (50+ matched)
├── Prioritize by fit/activity
├── Personalization research
└── GATE: Target list approved → Proceed

PHASE 4: OUTREACH & PIPELINE
├── Personalized email sequences
├── Pipeline tracking (stage, follow-ups)
├── Meeting prep / debrief
└── GATE: Term sheet received → Proceed

PHASE 5: CLOSE
├── Term sheet analysis
├── Due diligence management
├── Negotiation support
└── CLOSE: Funds wired
```

## Readiness Checklist by Stage

### Pre-Seed Readiness

| Category | Requirement | Weight |
|----------|-------------|--------|
| **Problem** | Clear who/struggle/why-now | 20% |
| **Solution** | Working prototype or mockup | 15% |
| **Team** | Founder-market fit evident | 20% |
| **Market** | TAM/SAM/SOM estimated | 10% |
| **Traction** | Early signals (waitlist, LOIs) | 15% |
| **Ask** | Clear use of funds | 10% |
| **Materials** | Deck + one-pager ready | 10% |

### Seed Readiness

| Category | Requirement | Weight |
|----------|-------------|--------|
| **Product** | MVP in market | 15% |
| **Traction** | 100+ users or $10K MRR | 25% |
| **Metrics** | CAC, LTV, retention tracked | 15% |
| **Team** | 2+ founders, key hires identified | 15% |
| **Market** | Competitive analysis complete | 10% |
| **Financial** | 18-month projection | 10% |
| **Materials** | Deck, data room, model ready | 10% |

### Series A Readiness

| Category | Requirement | Weight |
|----------|-------------|--------|
| **ARR** | $1M+ ARR | 25% |
| **Growth** | 10%+ MoM growth | 20% |
| **Unit Economics** | LTV:CAC 3:1+, payback <12mo | 20% |
| **Team** | Full founding team, key hires | 10% |
| **Market** | Clear path to $100M+ | 10% |
| **Retention** | NRR 100%+ | 10% |
| **Materials** | Complete data room | 5% |

## Investor Matching

```typescript
interface InvestorMatch {
  investor_id: string;
  name: string;
  firm: string;
  fit_score: number;  // 0-100
  factors: {
    stage_match: boolean;
    industry_match: boolean;
    check_size_match: boolean;
    geography_match: boolean;
    recent_activity: boolean;
    portfolio_synergy: boolean;
  };
  personalization: {
    recent_investments: string[];
    shared_connections: string[];
    relevant_tweets: string[];
    thesis_alignment: string;
  };
}

function scoreInvestorFit(startup: Startup, investor: Investor): number {
  let score = 0;
  if (investor.stages.includes(startup.stage)) score += 25;
  if (investor.industries.includes(startup.industry)) score += 25;
  if (investor.check_size >= startup.raise_amount * 0.1) score += 20;
  if (investor.geography === startup.geography) score += 10;
  if (investor.last_investment_days < 90) score += 10;
  if (hasPortfolioSynergy(startup, investor)) score += 10;
  return score;
}
```

## Pitch Deck Structure

| Slide | Content | Time |
|-------|---------|------|
| 1 | Cover + One-liner | 30s |
| 2 | Problem | 1m |
| 3 | Solution | 1m |
| 4 | Market | 1m |
| 5 | Product/Demo | 2m |
| 6 | Business Model | 1m |
| 7 | Traction | 1m |
| 8 | Competition | 1m |
| 9 | Team | 1m |
| 10 | Financial Plan | 1m |
| 11 | Ask + Use of Funds | 30s |
| 12 | Appendix | - |

## Data Room Structure

```
DATA ROOM/
├── 01-company/
│   ├── pitch_deck.pdf
│   ├── executive_summary.pdf
│   └── company_overview.pdf
├── 02-financial/
│   ├── financial_model.xlsx
│   ├── historical_financials.pdf
│   └── cap_table.pdf
├── 03-legal/
│   ├── incorporation_docs.pdf
│   ├── ip_assignments.pdf
│   └── material_contracts.pdf
├── 04-product/
│   ├── product_roadmap.pdf
│   ├── technical_architecture.pdf
│   └── demo_video.mp4
├── 05-team/
│   ├── founder_bios.pdf
│   ├── org_chart.pdf
│   └── key_hires_plan.pdf
└── 06-traction/
    ├── metrics_dashboard.pdf
    ├── customer_testimonials.pdf
    └── case_studies.pdf
```

## Term Sheet Analysis

```typescript
interface TermSheet {
  valuation: {
    pre_money: number;
    post_money: number;
    dilution: number;
  };
  investment: {
    amount: number;
    security_type: 'SAFE' | 'Convertible' | 'Priced';
    lead_investor: string;
  };
  governance: {
    board_seats: { founders: number; investors: number; independent: number };
    protective_provisions: string[];
    drag_along: boolean;
  };
  economics: {
    liquidation_preference: string; // "1x non-participating"
    anti_dilution: string; // "broad-based weighted average"
    participation: boolean;
  };
}

function analyzeTermSheet(terms: TermSheet): TermSheetAnalysis {
  return {
    valuation_fair: assessValuation(terms.valuation),
    governance_balanced: assessGovernance(terms.governance),
    economics_standard: assessEconomics(terms.economics),
    red_flags: identifyRedFlags(terms),
    negotiation_points: suggestNegotiations(terms)
  };
}
```

## Edge Function: `fundraising-agent`

```typescript
// Actions
- 'assess_readiness': Check fundraising readiness by stage
- 'match_investors': Find and score investor matches
- 'generate_deck': Create industry-specific pitch deck
- 'setup_dataroom': Generate data room structure
- 'analyze_terms': Review term sheet for red flags
- 'personalize_outreach': Create personalized investor emails
```

## AI Model Selection

| Task | Model |
|------|-------|
| Readiness assessment | `gemini-3-flash-preview` |
| Investor matching | `gemini-3-pro-preview` |
| Deck generation | `claude-sonnet-4-5-20250929` |
| Term sheet analysis | `claude-sonnet-4-5-20250929` |
| Outreach personalization | `gemini-3-pro-preview` |

## References

- PRD Section 11: Fundraising System
- Strategy Section 9: Investor Relations
- `/startup-system/guides/06-funding.md`
