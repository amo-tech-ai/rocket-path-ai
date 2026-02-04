# 111 - Competitor Intelligence

> Positioning matrix, SWOT analysis, and competitive differentiation

---

| Aspect | Details |
|--------|---------|
| **Screens** | Competitor Intelligence (new screen) |
| **Features** | Positioning matrix, competitor cards, SWOT, feature comparison |
| **Agents** | competitor-agent (new) |
| **Edge Functions** | /competitor-agent |
| **Use Cases** | Competitive landscape mapping, differentiation strategy |
| **Real-World** | "7 competitors identified, your gap: AI-powered predictions" |

---

```yaml
---
task_id: 111-competitor-intel
title: Competitor Intelligence
diagram_ref: validator-platform
phase: MVP
priority: P1
status: Not Started
skill: /feature-dev
ai_model: gemini-3-pro-preview
subagents: [frontend-designer, supabase-expert, ai-agent-dev]
edge_function: competitor-agent
schema_tables: [idea_competitors, idea_competitor_products, idea_competitor_swot]
depends_on: [110-market-analysis]
---
```

---

## Description

Build a competitive intelligence system that identifies direct, indirect, and alternative competitors, maps positioning on a quality/price matrix, generates SWOT analysis per competitor, and highlights differentiation opportunities. Integrates with existing `competitor_profiles` table.

## Rationale

**Problem:** Founders often don't know their competitive landscape or how to differentiate.
**Solution:** Automated competitor discovery with actionable positioning insights.
**Impact:** Clear understanding of where to compete and how to win.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see all my competitors | I know who I'm up against |
| Founder | understand positioning | I can find my unique angle |
| Founder | see competitor weaknesses | I can exploit gaps |
| Investor | review competitive landscape | I can assess defensibility |

## Real-World Example

> Sarah validates her restaurant inventory SaaS:
> - **Direct:** MarketMan, BlueCart, Foodics (inventory-focused)
> - **Indirect:** Toast, Square (broader POS with inventory)
> - **Alternative:** Spreadsheets, manual counting
> - **Opportunity:** "None use AI for demand prediction"
> - **Position:** Premium/High-Tech quadrant (underserved)

---

## Goals

1. **Primary:** Identify and categorize all relevant competitors
2. **Secondary:** Map positioning and find differentiation opportunities
3. **Quality:** Real competitor data, actionable insights

## Acceptance Criteria

- [ ] Competitor discovery (direct, indirect, alternative)
- [ ] 2x2 positioning matrix (quality vs price)
- [ ] Competitor cards with key info
- [ ] SWOT analysis per competitor
- [ ] Feature comparison matrix
- [ ] Differentiation opportunities highlighted
- [ ] Threat level indicators
- [ ] Link to existing `competitor_profiles` table
- [ ] Generation time <45 seconds

---

## Competitor Analysis Structure

### Competitor Categories

| Category | Definition | Example |
|----------|------------|---------|
| **Direct** | Same problem, same solution | MarketMan (inventory SaaS) |
| **Indirect** | Same problem, different solution | Toast (POS with inventory) |
| **Alternative** | Different approach entirely | Spreadsheets, manual |

### Positioning Matrix

```
                    HIGH QUALITY
                         │
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │   PREMIUM          │   LUXURY           │
    │   (Your target?)   │   (Enterprise)     │
    │        ●You        │                    │
    │                    │        ●Competitor │
LOW ├────────────────────┼────────────────────┤ HIGH
PRICE                    │                    PRICE
    │                    │                    │
    │   BUDGET           │   OVERPRICED       │
    │   (Mass market)    │   (Avoid)          │
    │        ●Competitor │                    │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    LOW QUALITY
```

### Competitor Card Content

| Field | Description |
|-------|-------------|
| Name | Company name |
| Logo | Company logo (if available) |
| Funding | Total raised, last round |
| Pricing | Price range, model |
| Strengths | 3-5 key strengths |
| Weaknesses | 3-5 key weaknesses |
| Threat Level | High/Medium/Low |
| Opportunity | How to beat them |

### SWOT Per Competitor

| Section | Questions Answered |
|---------|-------------------|
| **Strengths** | What do they do well? Why do customers choose them? |
| **Weaknesses** | Where do they fall short? Common complaints? |
| **Opportunities** | What gaps can you exploit? What are they ignoring? |
| **Threats** | How might they respond? What's their moat? |

---

## Schema

### Table: idea_competitors

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups, NOT NULL |
| validation_report_id | uuid | FK → validation_reports |
| name | text | NOT NULL |
| website | text | |
| category | text | CHECK IN ('direct', 'indirect', 'alternative') |
| funding_total | bigint | Total funding raised |
| funding_stage | text | Last funding round |
| employee_count | text | Size range |
| pricing_model | text | Subscription, usage, etc. |
| pricing_range | text | Low/Mid/High |
| position_quality | integer | 1-10 quality score |
| position_price | integer | 1-10 price score |
| threat_level | text | CHECK IN ('high', 'medium', 'low') |
| differentiation_opportunity | text | How to beat them |
| logo_url | text | |
| created_at | timestamptz | default now() |

### Table: idea_competitor_products

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| competitor_id | uuid | FK → idea_competitors |
| product_name | text | NOT NULL |
| description | text | |
| features | text[] | Key features |
| target_market | text | Who they target |
| pricing | text | Specific pricing |

### Table: idea_competitor_swot

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| competitor_id | uuid | FK → idea_competitors |
| type | text | CHECK IN ('strength', 'weakness', 'opportunity', 'threat') |
| description | text | NOT NULL |
| severity | integer | 1-5 importance |
| source | text | Where this insight came from |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_competitor_intel_tables.sql` | Create |
| Types | `src/types/competitor.ts` | Create |
| Hook | `src/hooks/useCompetitorIntel.ts` | Create |
| Page | `src/pages/CompetitorIntelligence.tsx` | Create |
| Component | `src/components/competitor/PositioningMatrix.tsx` | Create |
| Component | `src/components/competitor/CompetitorCard.tsx` | Create |
| Component | `src/components/competitor/SWOTAnalysis.tsx` | Create |
| Component | `src/components/competitor/FeatureMatrix.tsx` | Create |
| Edge Function | `supabase/functions/competitor-agent/index.ts` | Create |

---

## Feature Comparison Matrix

| Feature | You | Competitor A | Competitor B | Competitor C |
|---------|-----|--------------|--------------|--------------|
| AI Predictions | ✅ | ❌ | ❌ | ⚠️ (basic) |
| Real-time Sync | ✅ | ✅ | ❌ | ✅ |
| Mobile App | ✅ | ✅ | ✅ | ❌ |
| Integrations | 10+ | 50+ | 5 | 20 |
| Pricing | $99/mo | $149/mo | $49/mo | $199/mo |

Legend: ✅ Yes | ❌ No | ⚠️ Partial

---

## Edge Function: competitor-agent

### Actions

| Action | Input | Output |
|--------|-------|--------|
| `discover_competitors` | startup_id, industry | List of competitors |
| `analyze_competitor` | competitor_url | Detailed profile |
| `generate_swot` | competitor_id | SWOT analysis |
| `map_positioning` | startup_id | Positioning matrix |
| `find_opportunities` | startup_id | Differentiation opportunities |

### AI Behavior

The agent should:
- Act as a competitive intelligence analyst
- Identify direct competitors (same solution)
- Identify indirect competitors (different solution, same problem)
- Identify alternatives (how people solve it today without software)
- Assess funding and stage for each competitor
- Assess pricing and positioning
- Identify key strengths and weaknesses
- Calculate threat level to this startup
- Be specific with company names and data
- Flag if information might be outdated

---

## Data Sources

| Source | Data Type | Use Case |
|--------|-----------|----------|
| Crunchbase | Funding, employees | Competitor profiles |
| G2/Capterra | Reviews, features | SWOT insights |
| LinkedIn | Company size, growth | Threat assessment |
| Website scraping | Pricing, features | Feature comparison |
| SEMrush/Ahrefs | Traffic, keywords | Market position |

---

## Integration with competitor_profiles

The existing `competitor_profiles` table stores competitor data discovered during validation. This task extends it by:

- Adding `competitor_profile_id` column to `idea_competitors` table
- Creating FK reference to `competitor_profiles(id)`
- Allowing reuse of existing competitor data across validations

---

## Threat Level Logic

Calculate threat level based on:

| Factor | High Score | Medium Score | Low Score |
|--------|------------|--------------|-----------|
| Funding | >$10M (+3) | $1-10M (+2) | <$1M (+1) |
| Category | Direct (+3) | Indirect (+1) | Alternative (+0) |
| Pricing overlap | Same range (+2) | Adjacent (+1) | Different (+0) |
| Company size | >100 employees (+1) | 10-100 (+0) | <10 (+0) |

**Threat Level:**
- High: Score >= 7
- Medium: Score 4-6
- Low: Score < 4

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No competitors found | Flag as risk (market may not exist) |
| Too many competitors | Focus on top 7-10, group others |
| New category | Focus on alternatives, indirect |
| Dominant player | Highlight niche opportunities |

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Manual testing
- Discover competitors for SaaS startup
- Verify positioning matrix renders correctly
- Check SWOT analysis is actionable
- Test feature comparison accuracy
- Verify threat levels make sense
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Existing competitor data | `competitor_profiles` table |
| Matrix visualization | Consider using Recharts scatter |
| Card components | `src/components/ui/card.tsx` |
| Edge function pattern | `supabase/functions/lean-canvas-agent/` |
