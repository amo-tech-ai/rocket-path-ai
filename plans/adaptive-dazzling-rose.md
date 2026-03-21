# MVP-01: V3 Types Foundation

## Context

The validator pipeline produces V2 reports with 15+ sections stored as JSONB in `validator_reports.details`. Currently `details` is typed as `any` in multiple places. MVP-01 creates the type foundation for V3 dimension detail pages (9 consulting-grade drill-down pages), replaces `any` with proper types, and unblocks all Phase 2 work (MVP-02 through MVP-07). No runtime behavior changes — types only.

## Files to Modify (6 files)

| # | File | Change |
|---|------|--------|
| 1 | `supabase/functions/validator-start/types.ts` | Add `SubScore`, `DimensionDetail`, `AIStrategyAssessment`, `ValidationProofAssessment`; add 9 optional fields to `ValidatorReport`; add `ComposerGroupE` interface |
| 2 | `supabase/functions/validator-start/schemas.ts` | Add `DIMENSION_DETAIL_SCHEMA`, `DIMENSION_SUB_SCORES` config, `groupE` placeholder in `COMPOSER_GROUP_SCHEMAS` |
| 3 | `src/types/validation-report.ts` | Mirror backend types + add `ReportDetailsV2`, `V3ReportDetails`, `isV3Report()` |
| 4 | `src/pages/ValidatorReport.tsx` | Replace inline `details` type (lines 90-117) with `ReportDetailsV2` import |
| 5 | `src/components/validator/report/ReportV2Layout.tsx` | Replace `details: any` with `ReportDetailsV2` |
| 6 | `src/pages/SharedReport.tsx` + `src/pages/EmbedReport.tsx` | Replace `details: any` with `ReportDetailsV2` if present |

## Step 1: Backend Types (`types.ts`)

Add after `NextStepV2` (line 205), before `ValidatorReport`:

```typescript
// V3: Dimension detail page types — SYNC: src/types/validation-report.ts
export interface SubScore {
  name: string;      // machine key, e.g. "pain_intensity"
  score: number;     // 0-100
  label: string;     // human-readable, e.g. "Pain Intensity"
}

export interface DimensionDetail {
  composite_score: number;        // 0-100, mirrors dimension score
  sub_scores: SubScore[];         // 3-5 sub-scores
  executive_summary: string;      // 2-3 sentences
  risk_signals: string[];         // 2-3 what could go wrong
  priority_actions: string[];     // 2-3 what to fix next
}

export interface AIStrategyAssessment {
  detail: DimensionDetail;
  automation_level: 'assist' | 'copilot' | 'agent';
  ai_capability_stack: Array<{
    layer: string;
    description: string;
    maturity: 'nascent' | 'developing' | 'mature';
  }>;
  data_strategy: 'owned' | 'borrowed' | 'hybrid';
  governance_readiness: 'not_ready' | 'basic' | 'compliant';
}

export interface ValidationProofAssessment {
  detail: DimensionDetail;
  evidence_items: Array<{
    type: 'interview' | 'signup' | 'conversion' | 'payment' | 'experiment';
    count: number;
    description: string;
  }>;
  evidence_confidence: 'high' | 'medium' | 'low' | 'none';
  assumption_map: Array<{
    assumption: string;
    tested: boolean;
    result?: string;
  }>;
}
```

Add to `ValidatorReport` (after line 236, before closing `}`):

```typescript
  // V3: Per-dimension consulting-page detail (all optional for backward compat)
  problem_detail?: DimensionDetail;
  customer_detail?: DimensionDetail;
  market_detail?: DimensionDetail;
  competition_detail?: DimensionDetail;
  revenue_detail?: DimensionDetail;
  execution_detail?: DimensionDetail;
  risk_detail?: DimensionDetail;
  ai_strategy?: AIStrategyAssessment;
  validation_proof?: ValidationProofAssessment;
```

Add after `ComposerGroupD` (line 339):

```typescript
// V3: Composer Group E — dimension details + new assessments (MVP-02 will implement)
export interface ComposerGroupE {
  problem_detail: DimensionDetail;
  customer_detail: DimensionDetail;
  market_detail: DimensionDetail;
  competition_detail: DimensionDetail;
  revenue_detail: DimensionDetail;
  execution_detail: DimensionDetail;
  risk_detail: DimensionDetail;
  ai_strategy: AIStrategyAssessment;
  validation_proof: ValidationProofAssessment;
}
```

## Step 2: Backend Schemas (`schemas.ts`)

Add after `COMPOSER_GROUP_SCHEMAS.groupD` (line 949):

```typescript
  // V3: Dimension detail schema (building block for Group E)
  dimensionDetail: {
    type: 'object',
    properties: {
      composite_score: { type: 'number', description: '0-100 dimension score' },
      sub_scores: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            score: { type: 'number' },
            label: { type: 'string' },
          },
          required: ['name', 'score', 'label'],
        },
      },
      executive_summary: { type: 'string' },
      risk_signals: { type: 'array', items: { type: 'string' } },
      priority_actions: { type: 'array', items: { type: 'string' } },
    },
    required: ['composite_score', 'sub_scores', 'executive_summary', 'risk_signals', 'priority_actions'],
  },
```

Add exported `DIMENSION_SUB_SCORES` constant after `COMPOSER_GROUP_SCHEMAS`:

```typescript
export const DIMENSION_SUB_SCORES = {
  problem:     ['pain_intensity', 'frequency', 'economic_impact', 'replacement_urgency'],
  customer:    ['icp_specificity', 'buyer_authority', 'workflow_disruption', 'willingness_to_pay'],
  market:      ['tam_methodology', 'niche_focus', 'growth_trajectory', 'distribution_feasibility'],
  competition: ['differentiation_depth', 'switching_cost', 'replicability_risk', 'competitive_reaction'],
  revenue:     ['pricing_clarity', 'monetization_validation', 'unit_economics', 'margin_sustainability'],
  ai_strategy: ['ai_differentiation', 'data_advantage', 'automation_readiness', 'governance_maturity'],
  execution:   ['capability_match', 'resource_allocation', 'timeline_realism', 'operational_complexity'],
  validation:  ['evidence_tier', 'experiment_count', 'signal_strength', 'assumption_coverage'],
  risk:        ['financial_risk', 'regulatory_risk', 'execution_risk', 'market_volatility', 'dependency_risk'],
} as const;
```

## Step 3: Frontend Types (`src/types/validation-report.ts`)

Add after `FinancialProjections` (line 311):

```typescript
// ============================================================================
// V3: Dimension Detail Page Types — SYNC: supabase/functions/validator-start/types.ts
// ============================================================================

export interface SubScore {
  name: string;
  score: number;
  label: string;
}

export interface DimensionDetail {
  composite_score: number;
  sub_scores: SubScore[];
  executive_summary: string;
  risk_signals: string[];
  priority_actions: string[];
}

export interface AIStrategyAssessment {
  detail: DimensionDetail;
  automation_level: 'assist' | 'copilot' | 'agent';
  ai_capability_stack: Array<{
    layer: string;
    description: string;
    maturity: 'nascent' | 'developing' | 'mature';
  }>;
  data_strategy: 'owned' | 'borrowed' | 'hybrid';
  governance_readiness: 'not_ready' | 'basic' | 'compliant';
}

export interface ValidationProofAssessment {
  detail: DimensionDetail;
  evidence_items: Array<{
    type: 'interview' | 'signup' | 'conversion' | 'payment' | 'experiment';
    count: number;
    description: string;
  }>;
  evidence_confidence: 'high' | 'medium' | 'low' | 'none';
  assumption_map: Array<{
    assumption: string;
    tested: boolean;
    result?: string;
  }>;
}

/** Named type for report.details JSONB — replaces inline `any` */
export interface ReportDetailsV2 {
  highlights?: string[];
  red_flags?: string[];
  summary_verdict: string;
  verdict_oneliner?: string;
  success_condition?: string;
  biggest_risk?: string;
  problem_clarity: string | ProblemClarityV2;
  customer_use_case: string | CustomerUseCaseV2;
  key_questions?: KeyQuestion[];
  market_sizing: { tam: number; sam: number; som: number; citations: string[] };
  competition: {
    competitors: Array<{ name: string; description: string; threat_level: string; strengths?: string[]; weaknesses?: string[] }>;
    citations: string[];
    direct_competitors?: Array<{ name: string; description: string; threat_level: string; strengths?: string[]; weaknesses?: string[] }>;
    market_gaps?: string[];
    swot?: SWOT;
    feature_comparison?: FeatureComparison;
    positioning?: PositioningMatrix;
  };
  scores_matrix?: ScoresMatrixData;
  top_threat?: RiskAssumptionV2;
  risks_assumptions: string[] | RiskAssumptionV2[];
  mvp_scope: string | MVPScopeV2;
  next_steps: string[] | NextStepV2[];
  dimension_scores?: Record<string, number>;
  market_factors?: Array<{ name: string; score: number; description: string; status: string }>;
  execution_factors?: Array<{ name: string; score: number; description: string; status: string }>;
  technology_stack?: TechnologyAssessment;
  revenue_model?: RevenueModelAssessment;
  team_hiring?: TeamAssessment;
  resources_links?: ResourceCategory[];
  financial_projections?: FinancialProjections;
}

/** V3 extends V2 with dimension detail pages + new assessments */
export interface V3ReportDetails extends ReportDetailsV2 {
  problem_detail?: DimensionDetail;
  customer_detail?: DimensionDetail;
  market_detail?: DimensionDetail;
  competition_detail?: DimensionDetail;
  revenue_detail?: DimensionDetail;
  execution_detail?: DimensionDetail;
  risk_detail?: DimensionDetail;
  ai_strategy?: AIStrategyAssessment;
  validation_proof?: ValidationProofAssessment;
}

/** Detect V3: has at least one dimension detail populated */
export function isV3Report(details: ReportDetailsV2): details is V3ReportDetails {
  const d = details as V3ReportDetails;
  return !!(d.problem_detail || d.customer_detail || d.ai_strategy);
}
```

## Step 4: Replace `details: any` in Frontend Consumers

**`src/pages/ValidatorReport.tsx`** — Replace inline type (lines 90-117) with:
```typescript
  details: ReportDetailsV2;
```
Add import of `ReportDetailsV2` from `@/types/validation-report`.

**`src/components/validator/report/ReportV2Layout.tsx`** — Replace `details: any` in props:
```typescript
  details: ReportDetailsV2;
```
Add import. The existing `isV2Report()` function stays, just update param type from `any` to `ReportDetailsV2`.

**`src/pages/SharedReport.tsx`** and **`src/pages/EmbedReport.tsx`** — If they type `details` as `any`, replace with `ReportDetailsV2`.

## What This Does NOT Touch

- `scoring-math.ts` — sub-scores are informational, not changing overall_score
- `pipeline.ts` — no new agent invocations
- `composer.ts` — Group E comes in MVP-02
- Database — V3 fields live in existing `details` JSONB column
- Any UI components — no new components until MVP-04

## Verification

1. `npm run build` — zero TS errors (all V3 fields optional, backward compatible)
2. `npm run test` — 325/325 pass (no runtime changes)
3. Open http://localhost:8200/validator/report/:id — existing reports render identically
4. `isV2Report()` returns true for existing reports (unchanged)
5. `isV3Report()` returns false for existing reports (no `*_detail` fields yet)
