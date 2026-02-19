# Validator Schemas

JSON schemas for the validator pipeline. These match the edge function types in `supabase/functions/validator-start/types.ts` and `schemas.ts`.

## Intake Schema (StartupProfile)

The extractor agent produces this from raw user input. All fields are strings.

```json
{
  "idea": "One-sentence description of the startup idea",
  "problem": "The core problem being solved",
  "customer": "Target customer segment",
  "solution": "How the startup solves the problem",
  "differentiation": "What makes this unique vs alternatives",
  "alternatives": "Current alternatives/competitors mentioned",
  "validation": "Any existing validation or traction mentioned",
  "industry": "Primary industry (e.g., fintech, healthtech, saas)",
  "websites": "URLs or websites the founder wants researched, or empty string"
}
```

**Source:** `supabase/functions/validator-start/types.ts` → `StartupProfile`

---

## Scorecard Output Schema (ScoringResult)

The scoring agent provides qualitative dimension scores and factor descriptions. The deterministic scoring layer (`scoring-math.ts`) then computes `overall_score`, `verdict`, and factor `status` values.

### What the LLM produces (raw):

```json
{
  "dimension_scores": {
    "problemClarity": 0-100,
    "solutionStrength": 0-100,
    "marketSize": 0-100,
    "competition": 0-100,
    "businessModel": 0-100,
    "teamFit": 0-100,
    "timing": 0-100
  },
  "market_factors": [
    { "name": "Market Size", "score": 1-10, "description": "..." },
    { "name": "Growth Rate", "score": 1-10, "description": "..." },
    { "name": "Competition", "score": 1-10, "description": "..." },
    { "name": "Timing", "score": 1-10, "description": "..." }
  ],
  "execution_factors": [
    { "name": "Team", "score": 1-10, "description": "..." },
    { "name": "Product", "score": 1-10, "description": "..." },
    { "name": "Go-to-Market", "score": 1-10, "description": "..." },
    { "name": "Unit Economics", "score": 1-10, "description": "..." }
  ],
  "highlights": ["Strength 1", "Strength 2", "Strength 3"],
  "red_flags": ["Risk 1", "Risk 2"],
  "risks_assumptions": ["Assumes X — if wrong, Y happens"]
}
```

### What deterministic math adds:

```json
{
  "overall_score": 73,
  "verdict": "caution",
  "market_factors[].status": "strong|moderate|weak",
  "execution_factors[].status": "strong|moderate|weak",
  "scores_matrix": {
    "dimensions": [
      { "name": "Problem Clarity", "score": 80, "weight": 15 },
      { "name": "Solution Strength", "score": 70, "weight": 15 }
    ],
    "overall_weighted": 73
  }
}
```

**Source:** `supabase/functions/validator-start/scoring-math.ts` → `computeScore()`

---

## 7-Dimension Weights (Single Source of Truth)

| Dimension Key | Display Name | Weight |
|---|---|---:|
| `problemClarity` | Problem Clarity | 15% |
| `solutionStrength` | Solution Strength | 15% |
| `marketSize` | Market Size | 15% |
| `competition` | Competition | 10% |
| `businessModel` | Business Model | 15% |
| `teamFit` | Team Fit | 15% |
| `timing` | Timing | 15% |

**Total:** 100%

**Source:** `src/types/validation-report.ts` → `DIMENSION_CONFIG`

---

## Risk Assessment Schema (RiskAssumptionV2)

```json
{
  "assumption": "What we believe to be true",
  "if_wrong": "Plain consequence if wrong",
  "severity": "fatal|risky|watch",
  "impact": "high|low",
  "probability": "high|low",
  "how_to_test": "Cheapest validation method"
}
```

**Source:** `supabase/functions/validator-start/types.ts` → `RiskAssumptionV2`

---

## Report Output Schema (ValidatorReport)

The composer agent produces a 14-section report. Key sections:

| Section | Type | Description |
|---|---|---|
| `summary_verdict` | string | 3-sentence executive summary |
| `problem_clarity` | ProblemClarityV2 | Who, pain, current fix, severity |
| `customer_use_case` | CustomerUseCaseV2 | Persona, without/with, time saved |
| `market_sizing` | object | TAM, SAM, SOM, citations |
| `competition` | object | Competitors, SWOT, positioning |
| `risks_assumptions` | RiskAssumptionV2[] | Prioritized risks |
| `mvp_scope` | MVPScopeV2 | Build/buy/skip, success metric |
| `next_steps` | NextStepV2[] | Actions with timeframe, effort |
| `technology_stack` | TechnologyAssessment | Stack, feasibility, risks |
| `revenue_model` | RevenueModelAssessment | Model, unit economics |
| `team_hiring` | TeamAssessment | Gaps, roles, burn |
| `key_questions` | KeyQuestion[] | Critical questions to answer |
| `resources_links` | ResourceCategory[] | Categorized links |
| `scores_matrix` | ScoresMatrix | Dimensions, overall weighted |
| `financial_projections` | FinancialProjections | 3 scenarios, break-even |

**Source:** `supabase/functions/validator-start/types.ts` → `ValidatorReport`

---

## Schema-to-Edge-Function Mapping

| Schema | Edge Function File | Agent |
|---|---|---|
| StartupProfile (intake) | `schemas.ts` → `AGENT_SCHEMAS.extractor` | ExtractorAgent |
| MarketResearch | `schemas.ts` → `AGENT_SCHEMAS.research` | ResearchAgent |
| CompetitorAnalysis | `schemas.ts` → `AGENT_SCHEMAS.competitors` | CompetitorAgent |
| ScoringResult (raw) | `schemas.ts` → `AGENT_SCHEMAS.scoring` | ScoringAgent |
| ScoringMathResult | `scoring-math.ts` → `computeScore()` | Deterministic |
| MVPPlan | `schemas.ts` → `AGENT_SCHEMAS.mvp` | MVPAgent |
| ValidatorReport (14 sections) | `schemas.ts` → `AGENT_SCHEMAS.composer` | ComposerAgent |
