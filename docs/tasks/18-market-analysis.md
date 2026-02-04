# 110 - Market Analysis

> TAM/SAM/SOM, trends, segments, and industry benchmarks

---

| Aspect | Details |
|--------|---------|
| **Screens** | Market Analysis (new screen) |
| **Features** | TAM/SAM/SOM funnel, market trends, segments, benchmarks table |
| **Agents** | market-research-agent (new) |
| **Edge Functions** | /market-research-agent |
| **Use Cases** | Deep market intelligence, investor-ready sizing |
| **Real-World** | "Show me TAM: $3.1B, SAM: $620M, SOM: $75M with 19.8% CAGR" |

---

```yaml
---
task_id: 110-market-analysis
title: Market Analysis
diagram_ref: validator-platform
phase: MVP
priority: P1
status: Not Started
skill: /feature-dev
ai_model: gemini-3-pro-preview
subagents: [frontend-designer, supabase-expert, ai-agent-dev]
edge_function: market-research-agent
schema_tables: [idea_market_analysis, idea_market_segments, idea_market_trends, idea_market_benchmarks]
depends_on: [106-validation]
---
```

---

## Description

Build a comprehensive market analysis system that provides TAM/SAM/SOM calculations with methodology, market trend analysis (short/medium/long term), customer segment breakdown, and industry benchmark comparisons. This extends the basic validation report with deep market intelligence.

## Rationale

**Problem:** 106-validation provides basic market size but lacks depth for investor conversations.
**Solution:** Dedicated market analysis with trends, segments, and benchmarks.
**Impact:** Founders can confidently present market opportunity with supporting data.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see TAM/SAM/SOM with methodology | I can explain how I sized the market |
| Founder | understand market trends | I know if timing is right |
| Founder | see customer segments | I can prioritize which to target first |
| Investor | review industry benchmarks | I can compare to portfolio companies |

## Real-World Example

> Marcus opens Market Analysis for his restaurant tech SaaS:
> - **TAM:** $15.2B (all restaurant management software)
> - **SAM:** $3.1B (AI-powered inventory management)
> - **SOM:** $75M (mid-size chains, North America, Year 1-3)
> - **CAGR:** 19.8% (2024-2028)
> - **Key Trend:** "AI adoption in restaurants growing 25% YoY"

---

## Goals

1. **Primary:** Generate accurate TAM/SAM/SOM with transparent methodology
2. **Secondary:** Provide actionable trend insights
3. **Quality:** Data sourced from reputable sources, <30s generation

## Acceptance Criteria

- [ ] TAM/SAM/SOM funnel visualization
- [ ] Methodology explanation for each calculation
- [ ] 3 trend cards: short-term (1yr), medium (3yr), long-term (5yr+)
- [ ] Customer segment breakdown with sizes
- [ ] Industry benchmarks table (CAC, LTV, churn by vertical)
- [ ] Data freshness indicator (<30 days)
- [ ] Sources and citations displayed
- [ ] Generation time <30 seconds

---

## Market Analysis Structure

### TAM/SAM/SOM Section

| Metric | Calculation Method | Display |
|--------|-------------------|---------|
| TAM | Top-down from industry reports | $X.XB with source |
| SAM | Geographic + segment filtering | $X.XB with methodology |
| SOM | Realistic capture (1-3% of SAM) | $X.XM Year 1-3 target |
| CAGR | Industry growth rate | X.X% (20XX-20XX) |

### Trend Cards

| Timeframe | Content | Example |
|-----------|---------|---------|
| Short (1yr) | Immediate opportunities/threats | "Remote work driving 40% increase in collaboration tools" |
| Medium (3yr) | Market evolution | "AI assistants becoming table stakes" |
| Long (5yr+) | Strategic shifts | "Voice-first interfaces disrupting traditional SaaS" |

### Segment Breakdown

| Segment | Size | Growth | Priority |
|---------|------|--------|----------|
| Enterprise (1000+) | $X.XB | X% | Low (hard to penetrate) |
| Mid-market (100-999) | $X.XM | X% | High (sweet spot) |
| SMB (<100) | $X.XM | X% | Medium (volume play) |

### Benchmarks Table

| Metric | Industry Avg | Top Quartile | Your Target |
|--------|-------------|--------------|-------------|
| CAC | $X | $X | — |
| LTV | $X | $X | — |
| Churn | X% | X% | — |
| Gross Margin | X% | X% | — |

---

## Schema

### Table: idea_market_analysis

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups, NOT NULL |
| validation_report_id | uuid | FK → validation_reports |
| tam | bigint | Total Addressable Market ($) |
| tam_methodology | text | How TAM was calculated |
| sam | bigint | Serviceable Addressable Market ($) |
| sam_methodology | text | How SAM was calculated |
| som | bigint | Serviceable Obtainable Market ($) |
| som_methodology | text | How SOM was calculated |
| cagr | numeric(5,2) | Compound Annual Growth Rate % |
| market_maturity | text | CHECK IN ('emerging', 'growing', 'mature', 'declining') |
| data_freshness | timestamptz | When data was last updated |
| sources | jsonb | Array of source citations |
| created_at | timestamptz | default now() |

### Table: idea_market_segments

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| market_analysis_id | uuid | FK → idea_market_analysis |
| segment_name | text | NOT NULL |
| segment_size | bigint | Market size in $ |
| growth_rate | numeric(5,2) | Annual growth % |
| priority | text | CHECK IN ('high', 'medium', 'low') |
| rationale | text | Why this priority |
| characteristics | jsonb | Segment characteristics |

### Table: idea_market_trends

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| market_analysis_id | uuid | FK → idea_market_analysis |
| timeframe | text | CHECK IN ('short', 'medium', 'long') |
| trend_name | text | NOT NULL |
| description | text | NOT NULL |
| impact | text | CHECK IN ('positive', 'negative', 'neutral') |
| confidence | numeric(3,2) | 0.0-1.0 confidence score |
| source | text | Citation |

### Table: idea_market_benchmarks

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| market_analysis_id | uuid | FK → idea_market_analysis |
| metric_name | text | NOT NULL |
| industry_average | numeric | |
| top_quartile | numeric | |
| bottom_quartile | numeric | |
| unit | text | '$', '%', 'months', etc. |
| source | text | Citation |
| industry | text | Specific industry vertical |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_market_analysis_tables.sql` | Create |
| Types | `src/types/market-analysis.ts` | Create |
| Hook | `src/hooks/useMarketAnalysis.ts` | Create |
| Page | `src/pages/MarketAnalysis.tsx` | Create |
| Component | `src/components/market/TAMFunnel.tsx` | Create |
| Component | `src/components/market/TrendCards.tsx` | Create |
| Component | `src/components/market/SegmentTable.tsx` | Create |
| Component | `src/components/market/BenchmarksTable.tsx` | Create |
| Edge Function | `supabase/functions/market-research-agent/index.ts` | Create |

---

## TAM Funnel Visualization

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    TAM: $15.2B                          │
│            All restaurant management software           │
│                                                         │
│         ┌─────────────────────────────────────┐        │
│         │                                      │        │
│         │           SAM: $3.1B                 │        │
│         │    AI-powered inventory mgmt         │        │
│         │                                      │        │
│         │      ┌──────────────────────┐       │        │
│         │      │                       │       │        │
│         │      │      SOM: $75M        │       │        │
│         │      │   Mid-size chains     │       │        │
│         │      │   North America Y1-3  │       │        │
│         │      │                       │       │        │
│         │      └──────────────────────┘       │        │
│         └─────────────────────────────────────┘        │
│                                                         │
│                    CAGR: 19.8%                          │
└─────────────────────────────────────────────────────────┘
```

---

## Edge Function: market-research-agent

### Actions

| Action | Input | Output |
|--------|-------|--------|
| `analyze_market` | startup_id, industry | Full market analysis |
| `calculate_tam` | industry, geography | TAM with methodology |
| `get_trends` | industry | Trend cards |
| `get_benchmarks` | industry, stage | Benchmark table |

### AI Behavior

The agent should:
- Act as a market research analyst specializing in startup markets
- Provide TAM/SAM/SOM with clear methodology
- Generate market trends at 3 timeframes
- Create customer segment breakdown
- Use the 20-saas.md framework for SaaS metrics
- Always cite sources and indicate data freshness
- Be conservative in estimates - better to underestimate than overpromise

---

## Data Sources

| Source Type | Examples | Use Case |
|-------------|----------|----------|
| Industry reports | Gartner, Forrester, Statista | TAM baseline |
| Public filings | SEC 10-K, S-1 | Competitor benchmarks |
| Market databases | Crunchbase, PitchBook | Funding/valuation data |
| Search trends | Google Trends, SparkToro | Demand indicators |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Very niche market | Flag small TAM, suggest adjacent markets |
| No industry data | Use proxy industries, flag uncertainty |
| Emerging category | Note limited historical data |
| Conflicting sources | Show range, cite both |

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Manual testing
- Generate market analysis for SaaS startup
- Verify TAM/SAM/SOM calculations match methodology
- Check trends are timeframe-appropriate
- Verify benchmarks match industry
- Test with multiple industries
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Chart visualization | `src/components/` existing charts |
| Data tables | `src/components/ui/table.tsx` |
| Edge function pattern | `supabase/functions/lean-canvas-agent/` |
| Knowledge retrieval | `knowledge_chunks` table |
