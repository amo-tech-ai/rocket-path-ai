---
name: mvp-builder
description: Use this skill when scoping and planning MVPs - defining minimum features, applying RICE scoring, using MVP Canvas, and prioritizing with Kano model. Triggers on "MVP", "minimum viable", "feature prioritization", "RICE score", "Kano model", "MVP Canvas".
---

# MVP Builder

## Overview

Guide founders through MVP scoping using the 7-block MVP Canvas, RICE scoring for feature prioritization, and Kano model for feature classification.

## When to Use

- Building MVP Canvas UI
- Implementing feature prioritization
- Creating RICE scoring algorithms
- Designing Kano classification
- Scoping minimum viable products

## MVP Canvas (7 Blocks)

```
┌─────────────────────────────────────────────────────────────┐
│                    1. MVP PROPOSAL                          │
│               What's the proposal for this MVP?             │
├─────────────────────────────┬───────────────────────────────┤
│   2. SEGMENTED PERSONAS     │         4. FEATURES           │
│   Who is this MVP for?      │   What are we building?       │
├─────────────────────────────┼───────────────────────────────┤
│       3. JOURNEYS           │     5. EXPECTED RESULT        │
│   Which journeys improved?  │   What learning do we seek?   │
├─────────────────────────────┴───────────────────────────────┤
│          6. METRICS TO VALIDATE BUSINESS HYPOTHESES         │
├─────────────────────────────────────────────────────────────┤
│                   7. COST & SCHEDULE                        │
└─────────────────────────────────────────────────────────────┘
```

## RICE Scoring

```typescript
interface RICEScore {
  reach: number;      // Users impacted (0-100%)
  impact: number;     // Effect on UX (0.25, 0.5, 1, 2, 3)
  confidence: number; // Certainty (0-100%)
  effort: number;     // Dev days (1-30)
}

function calculateRICE(feature: RICEScore): number {
  return (feature.reach * feature.impact * feature.confidence) / feature.effort;
}
```

## Kano Model

| Category | Description | MVP Include? |
|----------|-------------|--------------|
| **Must-Have** | Required, no delight | Yes |
| **Performance** | More = better | Maybe |
| **Delighter** | Surprise value | No |
| **Indifferent** | No impact | No |
| **Reverse** | More = worse | Avoid |

## MVP Scoping Rules

1. **Start with 3-5 features max**
2. Focus on ONE user journey
3. Validate hypothesis, not technology
4. Manual before automated
5. Ugly but functional > polished but slow

## Edge Function: `mvp-scoper`

```typescript
// Actions
- 'complete_canvas': Guide MVP Canvas completion
- 'score_features': Apply RICE to feature list
- 'classify_kano': Categorize features
- 'recommend_scope': Suggest minimum feature set
```

## AI Model Selection

| Task | Model |
|------|-------|
| Canvas completion | `gemini-3-flash-preview` |
| Feature scoring | `gemini-3-flash-preview` |
| Scope recommendations | `gemini-3-pro-preview` |

## References

- PRD Section 5B: MVP Canvas System
- Diagram D-07: MVP Planning
- `/tasks/guides/07-mvp-canavas.md`
