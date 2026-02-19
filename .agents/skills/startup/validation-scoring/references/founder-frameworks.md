# Founder Frameworks

Frameworks from Paul Graham, Ash Maurya, and innovation methodology for evaluating startup ideas at the earliest stages.

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

## Customer Pain Levels

| Level | Type | Description | Target? |
|-------|------|-------------|---------|
| 1 | Latent | Has problem, unaware | No |
| 2 | Aware | Knows problem exists | Maybe |
| 3 | Searching | Actively looking | Yes |
| 4 | Cobbled | Built own solution | Yes |
| 5 | Budget | Ready to buy NOW | Ideal |

---

## Supply-Demand Matrix

```
         High Demand
              |
    OPPORTUNITY|  RED OCEAN
    (Build!)   |  (Differentiate)
              |
Low ----------+---------- High
Supply        |           Supply
              |
    NICHE     |  AVOID
    (Focus)   |  (Saturated)
              |
         Low Demand
```

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

### Throughput == Traction

**Anti-Metrics (Don't Measure):**
- Interviews completed
- Canvases filled
- Experiments run

**Real Metrics (Do Measure):**
- Paying customers
- Revenue
- Retention

---

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

---

## Problem Clarity Score

```typescript
interface ProblemScore {
  specificity: number;      // 0-25: How specific is the problem?
  frequency: number;        // 0-25: How often does it occur?
  severity: number;         // 0-25: How painful is it?
  measurability: number;    // 0-25: Can we measure improvement?
}
// Total: 0-100
```
