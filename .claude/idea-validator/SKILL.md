---
name: idea-validator
description: Use this skill when validating startup ideas - scoring problem clarity, assessing market viability, identifying risks, and providing go/no-go recommendations. Triggers on "validate idea", "problem score", "market analysis", "go or no-go", "idea assessment".
---

# Idea Validator

## Overview

Systematically validate startup ideas through problem clarity scoring, market analysis, risk identification, and evidence-based go/no-go recommendations.

## When to Use

- Implementing idea scoring algorithms
- Building market analysis features
- Creating risk assessment logic
- Designing problem clarity evaluation
- Generating validation recommendations

---

## Paul Graham Criteria

### Well vs Crater Model

| Type | Shape | Example | Outcome |
|------|-------|---------|---------|
| Well | Deep, narrow | Facebook at Harvard | Success |
| Crater | Shallow, broad | Social network for pet owners | Failure |

**Key Question:** "Who wants this RIGHT NOW? Who wants this so much they'll use a crappy v1 from a startup they've never heard of?"

### Schlep Filter

Valuable ideas hide behind tedious work. Turn OFF the schlep filter.

| Avoided Schlep | Winner |
|----------------|--------|
| Payment processing | Stripe |
| Apartment rentals | Airbnb |
| File syncing | Dropbox |

### Organic vs Made-Up Ideas

| Organic | Made-Up |
|---------|---------|
| "Live in the future, build what's missing" | Brainstormed in a meeting |
| Solves founder's real problem | Sounds plausible but fake demand |
| High success rate | "Sitcom startup" |

---

## Ash Maurya PMF Thresholds

### Revenue Targets for PMF

| Customers | ARPA/Year | = $10M ARR |
|-----------|-----------|------------|
| 10 | $1,000,000 | PMF |
| 100 | $100,000 | PMF |
| 1,000 | $10,000 | PMF |
| 10,000 | $1,000 | PMF |
| 100,000 | $100 | PMF |

### PMF Checklist

- [ ] (1 product + 1 early adopter) focus
- [ ] Low churn
- [ ] Profitable or near-profitable
- [ ] Simple early adopter segmentation
- [ ] Early adopter < 20% of total market

### Validation Recipes

| Recipe | Question | Purpose |
|--------|----------|---------|
| 90-Day Goal | "How many customers in 90 days?" | Force specificity |
| Phantom Customer | "Describe your ideal early adopter?" | Test clarity |
| 80/20 | "Which segment is your beachhead?" | Focus resources |
| Next X | "Where will your next X customers come from?" | Test repeatability |

---

## Innovation Funnel

### Funnel Stages

| Stage | Duration | Gate |
|-------|----------|------|
| Strategy Alignment | 1 week | ICP + Job defined |
| Ideation | 1 week | 5+ ideas sourced |
| Exploration | 2 weeks | Business model viable |
| Selection | 1 week | Top 1-2 selected |
| Validation | 90 days | Problem/solution fit |

### Key Insight: Throughput == Traction

> "Traction is the rate at which a business model captures monetizable value from its customers."

**Anti-Metrics (Don't Measure):**
- Interviews completed
- Canvases filled
- Experiments run

**Real Metrics (Do Measure):**
- Paying customers
- Revenue
- Retention

---

## Validation Phases

| Phase | Question | Gate |
|-------|----------|------|
| PROBLEM | Is the problem real? | Score ≥70% |
| MARKET | Is the market viable? | Viable quadrant |
| SOLUTION | Does the solution work? | 1+ paying customer |

### Phase 1: Problem Validation

- Problem clarity score (0-100)
- Customer pain level (1-5)
- Existing alternatives scan
- GATE: Problem score ≥70% → Proceed

### Phase 2: Market Validation

- Supply-Demand Matrix
- TAM/SAM/SOM estimation
- Search demand analysis
- GATE: Viable quadrant → Proceed

### Phase 3: Solution Validation

- 10+ customer interviews
- Assumption testing
- Willingness-to-pay signals
- GATE: 1+ validated → Proceed to MVP

## Problem Clarity Score

```typescript
interface ProblemScore {
  specificity: number;      // 0-25: How specific is the problem?
  frequency: number;        // 0-25: How often does it occur?
  severity: number;         // 0-25: How painful is it?
  measurability: number;    // 0-25: Can we measure improvement?
}

function scoreProblemClarity(problem: string): ProblemScore {
  // AI evaluates each dimension
  // Total: 0-100
}
```

## Customer Pain Levels

| Level | Type | Description | Target? |
|-------|------|-------------|---------|
| 1 | Latent | Has problem, unaware | No |
| 2 | Aware | Knows problem exists | Maybe |
| 3 | Searching | Actively looking | Yes |
| 4 | Cobbled | Built own solution | Yes |
| 5 | Budget | Ready to buy NOW | Ideal |

## Supply-Demand Matrix

```
         High Demand
              │
    OPPORTUNITY│  RED OCEAN
    (Build!)   │  (Differentiate)
              │
Low ──────────┼────────── High
Supply        │           Supply
              │
    NICHE     │  AVOID
    (Focus)   │  (Saturated)
              │
         Low Demand
```

## Edge Function: `idea-validator`

```typescript
// Actions
- 'score_problem': Calculate problem clarity score
- 'analyze_market': Generate TAM/SAM/SOM + matrix
- 'assess_pain': Evaluate customer pain level
- 'recommend': Go/No-Go with reasoning
```

## Go/No-Go Logic

```typescript
function recommendGoNoGo(scores: ValidationScores): Recommendation {
  if (scores.problem < 60) return 'NO_GO: Problem not clear enough';
  if (scores.market === 'AVOID') return 'NO_GO: Market saturated';
  if (scores.pain < 3) return 'CAUTION: Low customer urgency';
  if (scores.problem >= 80 && scores.market === 'OPPORTUNITY') {
    return 'GO: Strong opportunity';
  }
  return 'EXPLORE: Run validation experiments';
}
```

## AI Model Selection

| Task | Model |
|------|-------|
| Problem scoring | `gemini-3-flash-preview` |
| Market analysis | `gemini-3-pro-preview` |
| Competitor scan | `gemini-3-pro-preview` with search |
| Recommendations | `claude-sonnet-4-5-20250929` |

## References

- PRD Section 4: Business Idea Validator
- Strategy Section 4: Validation Phases
- `/tasks/startup-system/startupai-prd.md`
