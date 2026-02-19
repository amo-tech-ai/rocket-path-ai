# Idea Validation Frameworks — Prompt Pack

> **Source:** Paul Graham, Ash Maurya, Innovation Funnel
> **Use With:** validation-agent, idea-validator edge functions
> **Updated:** 2026-02-02

---

## Paul Graham — Startup Idea Criteria

### The Well vs Crater Model

**Deep Narrow Wells Beat Shallow Broad Craters**

- Good ideas: Small number of users who want it A LOT (deep well)
- Bad ideas: Large number of users who want it a little (shallow crater)
- Question: "Who wants this RIGHT NOW? Who wants this so much they'll use a crappy v1?"

### The Schlep Filter

**Valuable ideas hide behind tedious work**

- Programmers avoid ideas requiring messy real-world problems
- Stripe succeeded because competitors avoided payment complexity
- Turn OFF the schlep filter to find valuable opportunities

### Organic vs Made-Up Ideas

| Type | Source | Success Rate |
|------|--------|--------------|
| Organic | "Live in the future, build what's missing" | High |
| Made-Up | Brainstorming, "sitcom startup" | Low |

### Key Questions

1. "Who wants this right now?" — If no answer, idea is bad
2. "Would you use this if you hadn't built it?" — Tests genuine need
3. "Is this a well or a crater?" — Depth > breadth
4. "What schlep are you avoiding?" — Hidden opportunity

---

## Ash Maurya — Product/Market Fit Thresholds

### PMF Revenue Targets

| Customers | ARPA/Year | Total ARR |
|-----------|-----------|-----------|
| 10 | $1,000,000 | $10M |
| 100 | $100,000 | $10M |
| 1,000 | $10,000 | $10M |
| 10,000 | $1,000 | $10M |
| 100,000 | $100 | $10M |

**Formula:** Customers × ARPA = $10M ARR = PMF

### PMF Additional Criteria

1. (1 product + 1 early adopter) focus
2. Low attrition (churn)
3. Profitable or within striking distance
4. Simple early adopter segmentation
5. Early adopter < 20% of total market

### Validation Recipes

**90-Day Goal Recipe**
- "How many new customers in 90 days?"
- Forces specific traction targets
- Reveals assumptions

**Phantom Customer Recipe**
- "Can you describe your ideal early adopter?"
- If vague → customer discovery needed
- If precise → market sizing next

**80/20 Recipe**
- 80% of growth from 20% of customers
- Identify beachhead segment
- Focus resources

**Next X Customers Recipe**
- "Where will your next X customers come from?"
- Tests repeatability
- Reveals channel strategy

---

## Innovation Funnel Stages

### Stage 1: Strategy Alignment

| Input | Output |
|-------|--------|
| Who is our customer? | ICP definition |
| What job do we help them do? | Core value prop |
| What's our worldview? | Innovation thesis |

### Stage 2: Ideation

**Seven Idea Sources:**
1. Scratch your itch
2. R&D/Invention
3. Analogs
4. Accidental discovery
5. Customer requests/behavior
6. External changes
7. Innovation theory

### Stage 3: Exploration

**Time-boxed business modeling (2 weeks)**
- Lean Canvas for qualitative assumptions
- Traction Roadmap for quantitative targets
- Minimum success criteria defined

### Stage 4: Selection

**Every idea gets same initial investment:**
- 3-5 people
- 90 days
- Problem/solution fit goal

### Stage 5: Validation

**Three Stages:**
1. Problem/Solution Fit (90 days)
2. Product/Market Fit (6-12 months)
3. Scale (ongoing)

---

## Key Metrics

### The Only Metric That Matters

**Throughput == Traction**

> "Traction is the rate at which a business model captures monetizable value from its customers."

### Anti-Metrics (Vanity)

- Customer interviews completed
- Canvases filled
- Experiments run

### Real Metrics

| Stage | Metric |
|-------|--------|
| Problem | Customer pain level (1-5) |
| Solution | Willingness to pay |
| Market | CAC, LTV, LTV:CAC |
| Scale | MRR, growth rate |

---

## System Prompt Fragment

Use this in validation-agent prompts:

```
You are a startup validation expert. When evaluating ideas:

1. WELL VS CRATER: Prefer deep narrow demand over broad shallow interest.
   Ask: "Who wants this RIGHT NOW? Who would use a crappy v1?"

2. PMF THRESHOLDS: To reach PMF, aim for one of:
   - 10 customers × $1M/year
   - 100 customers × $100K/year
   - 1,000 customers × $10K/year
   - 10,000 customers × $1K/year
   - 100,000 customers × $100/year

3. SCHLEP FILTER: Look for opportunities others avoid due to complexity.
   Valuable ideas often hide behind tedious work.

4. THROUGHPUT: Focus on traction (monetizable value captured from customers),
   not activity metrics like interviews or experiments.

5. 90-DAY SPRINTS: Give ideas 90 days and 3-5 people to reach problem/solution fit.
   If no traction signal, pivot or kill.
```

---

## References

| Source | Key Concept |
|--------|-------------|
| Paul Graham, "How to Get Startup Ideas" | Well vs Crater, Schlep Filter |
| Ash Maurya, "Do You Really Have PMF?" | 10×$1M thresholds, Recipes |
| Ash Maurya, "Idea Funnel" | Throughput == Traction |
