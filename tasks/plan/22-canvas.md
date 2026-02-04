# Canvas + Report

> Auto-generate Lean Canvas and Validation Report from 6 questions

---

## Input → Output

```
6 Questions → AI Processing → Lean Canvas + Validation Report
```

---

## The 6 Questions

| # | Question | Required |
|---|----------|----------|
| 1 | What problem are you solving? | Yes |
| 2 | What's your solution? | Yes |
| 3 | Who is your target market? | Yes |
| 4 | How will you make money? | Yes |
| 5 | How do they solve it today? | Yes |
| 6 | How will customers find you? + Why you, why now? | Yes |

---

## Lean Canvas (9 Boxes)

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   PROBLEM   │  SOLUTION   │    UVP      │  UNFAIR     │  CUSTOMER   │
│             │             │             │  ADVANTAGE  │  SEGMENTS   │
│ Q1: Problem │ Q2: Solution│ AI derives  │ Q6: Why you │ Q3: Target  │
│             │             │ from Q1+Q2  │    why now  │    market   │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│  EXISTING   │             │             │             │             │
│ALTERNATIVES │ KEY METRICS │  CHANNELS   │COST STRUCT. │  REVENUE    │
│             │             │             │             │  STREAMS    │
│ Q5: How now │ AI derives  │ Q6: How     │ AI derives  │ Q4: Money   │
│             │             │    find you │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## Question → Canvas Mapping

| Question | Canvas Box | AI Derives |
|----------|------------|------------|
| Q1: Problem | Problem | - |
| Q2: Solution | Solution | UVP (from Q1+Q2) |
| Q3: Target | Customer Segments | - |
| Q4: Money | Revenue Streams | Cost Structure |
| Q5: How now | Existing Alternatives | - |
| Q6: Channels | Channels | - |
| Q6: Why you | Unfair Advantage | - |
| - | Key Metrics | AI suggests based on business model |

---

## Validation Report (7 Dimensions)

| Dimension | Score | Based On |
|-----------|-------|----------|
| **Clarity** | 0-10 | How clear is problem + solution? |
| **Desirability** | 0-10 | How urgent is the problem? Who wants it? |
| **Viability** | 0-10 | Can this make money? Business model? |
| **Feasibility** | 0-10 | Can you build/deliver this? |
| **Defensibility** | 0-10 | Why won't others copy? Unfair advantage? |
| **Timing** | 0-10 | Why now? Market readiness? |
| **Mission** | 0-10 | Why you? Founder fit? |

**Overall Score:** Average of 7 dimensions (0-100 scale)

---

## Report Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ VERDICT                                              78/100    │
│ Promising - needs customer validation                          │
├─────────────────────────────────────────────────────────────────┤
│ STRENGTHS          │ CONCERNS           │ NEXT STEPS           │
│ • Clear problem    │ • No customers yet │ 1. Interview 10      │
│ • Good timing      │ • Unproven demand  │ 2. Test pricing      │
│ • Strong UVP       │ • No unfair adv.   │ 3. Build demo        │
├─────────────────────────────────────────────────────────────────┤
│ DIMENSION SCORES                                               │
│ Clarity ████████░░ 8  Desirability ███████░░░ 7               │
│ Viability ██████░░░░ 6  Feasibility ████████░░ 8              │
│ Defensibility ████░░░░░░ 4  Timing █████████░ 9               │
│ Mission ███████░░░ 7                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Prompt (Generation)

```
Given this startup information:
- Problem: {problem}
- Solution: {solution}
- Target Market: {target_market}
- Business Model: {business_model}
- Existing Alternatives: {existing_alternatives}
- Channels: {channels}
- Why You/Now: {why_now}

Generate:
1. Complete Lean Canvas (9 boxes)
2. Validation scores (7 dimensions, 0-10 each)
3. Top 3 strengths
4. Top 3 concerns
5. Top 3 next steps

Be specific to their industry: {industry}
```

---

## Storage

### lean_canvases table
```json
{
  "problem": "...",
  "solution": "...",
  "uvp": "...",
  "unfair_advantage": "...",
  "customer_segments": "...",
  "channels": "...",
  "revenue_streams": "...",
  "cost_structure": "...",
  "key_metrics": "...",
  "existing_alternatives": "..."
}
```

### validation_assessments table
```
session_id | dimension     | score | feedback
-----------+---------------+-------+----------
uuid       | clarity       | 8     | "Clear problem..."
uuid       | desirability  | 7     | "Good demand..."
...
```

---

## When Generated

| Trigger | Action |
|---------|--------|
| Onboarding complete | Auto-generate canvas + report |
| Coach collects 6 answers | Auto-generate canvas + report |
| User edits canvas | Re-score validation report |
| User requests refresh | Re-generate with latest data |

---

## Keep It Simple

- ONE canvas format (Lean Canvas)
- ONE report format (7 dimensions)
- Auto-generate, let user edit
- Re-score on changes
