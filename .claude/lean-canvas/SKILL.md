---
name: lean-canvas
description: Use this skill when working on Lean Canvas features - completing blocks, extracting assumptions, detecting bias, generating suggestions, and validating business models. Triggers on "canvas", "business model", "problem block", "UVP", "assumption", "customer segment".
---

# Lean Canvas

## Overview

Guide founders through completing the 9-block Lean Canvas with AI assistance. Extract assumptions, detect solution-first bias, generate content suggestions, and track canvas evolution over time.

## When to Use

- Implementing canvas UI components
- Building AI suggestion features for blocks
- Creating assumption extraction logic
- Detecting and warning about solution-first bias
- Scoring canvas completeness
- Versioning and tracking canvas changes

## Workflow

```
1. BLOCK COMPLETION
   ├── User opens block → AI suggests content
   ├── Detect bias → Show warning if solution-first
   ├── Save → Extract assumptions
   └── Calculate score → Update progress

2. AI ASSISTANCE
   ├── Problem: Extract from interviews, website
   ├── Customer: Build psychographic from JTBD
   ├── UVP: Generate 3 options (≤120 chars)
   ├── Solution: Suggest MVP features
   └── All blocks: Industry-specific guidance

3. ASSUMPTION TRACKING
   ├── Extract implicit assumptions per block
   ├── Score by Impact × Uncertainty
   ├── Prioritize top 3 for testing
   └── Link to Validation Lab
```

## The 9 Blocks

| # | Block | AI Completion | Validation |
|---|-------|---------------|------------|
| 1 | Problem | Extract from interviews/website | Customer interviews |
| 2 | Customer Segments | Build from JTBD, pain levels | Segment testing |
| 3 | UVP | Generate 3 options | Landing page A/B |
| 4 | Solution | Suggest MVP features | Concierge tests |
| 5 | Channels | Recommend from playbook | Channel experiments |
| 6 | Revenue | Suggest models | Price testing |
| 7 | Cost Structure | Estimate from stage | Financial modeling |
| 8 | Key Metrics | Recommend OMTM | Dashboard tracking |
| 9 | Unfair Advantage | Identify from founder | Competitive analysis |

## Canvas Score Algorithm

```typescript
const BLOCK_WEIGHTS = {
  problem: 0.20,           // Most critical
  customer_segments: 0.15,
  uvp: 0.15,
  solution: 0.10,
  channels: 0.10,
  revenue: 0.10,
  costs: 0.05,
  metrics: 0.10,
  unfair_advantage: 0.05
};

function calculateCanvasScore(canvas: LeanCanvas): number {
  return Object.entries(BLOCK_WEIGHTS).reduce((score, [block, weight]) => {
    const blockScore = evaluateBlockCompleteness(canvas[block]);
    return score + (blockScore * weight);
  }, 0);
}
```

## Bias Detection

```typescript
const SOLUTION_FIRST_PATTERNS = [
  /we (will|are going to) build/i,
  /our (app|platform|software|tool)/i,
  /using (AI|ML|blockchain)/i,
  /features? (include|like)/i
];

function detectSolutionBias(problemBlock: string): boolean {
  return SOLUTION_FIRST_PATTERNS.some(p => p.test(problemBlock));
}
```

## Edge Function: `lean-canvas-agent`

```typescript
// Actions
- 'suggest_content': Generate block content suggestions
- 'extract_assumptions': Pull testable assumptions from block
- 'detect_bias': Check for solution-first thinking
- 'score_canvas': Calculate completeness score
- 'version_canvas': Save versioned snapshot
```

## Database Schema

```sql
lean_canvas_versions (
  id uuid PRIMARY KEY,
  startup_id uuid REFERENCES startups,
  version int,
  canvas_data jsonb,
  score int,
  assumptions jsonb,
  created_at timestamptz
)
```

## AI Model Selection

| Task | Model |
|------|-------|
| Block suggestions | `gemini-3-flash-preview` |
| UVP generation | `gemini-3-pro-preview` |
| Bias detection | `gemini-3-flash-preview` |
| Assumption extraction | `gemini-3-pro-preview` |

## References

- PRD Section 5: Lean Canvas System
- Diagram D-06: Lean Canvas Flow
- `/tasks/startup-system/startupai-prd.md`
