# Validation Report V3 — Consulting-Grade Upgrade

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the validation report from a 12-section card layout into a 9-page consulting-grade diagnostic with per-page sub-scores, strategy diagrams, and an AI Lean Canvas — full stack (pipeline + frontend).

**Architecture:** Extend the existing 7-agent pipeline by (a) expanding the Scoring agent to produce per-dimension sub-scores, (b) adding AI Strategy + Validation Proof sections to the Composer, and (c) building new frontend components that follow the existing luxury visual pattern (SectionShell, Playfair headings, staggered animations, threat-color system). The AI Lean Canvas is a new composite view derived from existing report data.

**Tech Stack:** Gemini 3 Flash (pipeline), React 18 + TypeScript + Tailwind + shadcn/ui (frontend), Supabase Edge Functions (Deno)

---

## Reference Files

These files are touched repeatedly. Read them before starting any task.

| File | Purpose |
|------|---------|
| `supabase/functions/validator-start/types.ts` | Pipeline type definitions |
| `supabase/functions/validator-start/schemas.ts` | Gemini JSON schemas |
| `supabase/functions/validator-start/agents/scoring.ts` | Scoring agent |
| `supabase/functions/validator-start/agents/composer.ts` | Composer agent (4 groups) |
| `supabase/functions/validator-start/scoring-math.ts` | Deterministic score math |
| `src/types/validation-report.ts` | Frontend type definitions |
| `src/components/validator/report/ReportV2Layout.tsx` | Report page layout |
| `src/components/validator/report/shared/SectionShell.tsx` | Section wrapper component |
| `src/components/validator/report/CompetitorLuxury.tsx` | Visual style reference |

## Design Spec (from 500/501/502 docs)

Each of the 9 validation pages follows this structure:
1. **Strategy Diagram** — Visual flow showing how this dimension works
2. **Composite Score** — Named index (0-100) with sub-score bars
3. **Executive Description** — Plain English, 2-3 sentences
4. **Risk Signals** — What could go wrong
5. **Priority Actions** — What to fix next

The 9 pages: Problem, Customer, Market, Competition, Revenue, AI Strategy, Execution, Validation Proof, Risk.

Each page has a unique diagram style:
- Problem → Causal/Pain Chain
- Customer → ICP Funnel
- Market → TAM/SAM/SOM Pyramid (exists)
- Competition → 2x2 Matrix (exists)
- Revenue → Engine Flow
- AI Strategy → Capability Stack
- Execution → Timeline
- Validation Proof → Evidence Funnel
- Risk → Heat Grid (exists)

---

## Phase 0: Chat Interview Expansion (BLOCKER — must complete before Phase 2)

The V3 report requires data the chat interview doesn't currently collect. Without this phase, Composer Group E has no input for AI Strategy, Validation Proof, financial metrics, or distribution strategy.

**Current state:** 8 coverage topics, 8 extracted fields, 8 confidence fields.
**Target state:** 12 coverage topics, 12 extracted fields, 12 confidence fields.

### Task 0A: Expand interview prompt with 4 new topics

**Files:**
- Modify: `supabase/functions/validator-followup/prompt.ts`

**What to do:**

Add 4 new topics to the interview checklist (after the existing 8):

```
9. ai_technology — What AI/technology stack powers the product? Models, APIs, build-vs-buy
10. validation_evidence — What real-world proof exists? Count interviews, signups, experiments, payments
11. financial_metrics — What are the unit economics? Burn rate, CAC, LTV, runway
12. distribution — How will customers find this? Channels, GTM, partnerships, growth loops
```

Add depth definitions for each:
```
ai_technology:
  - none: not discussed
  - shallow: mentioned AI or tech briefly
  - deep: specific models, APIs, build-vs-buy decision, data strategy

validation_evidence:
  - none: not discussed
  - shallow: vague mentions ("some interest")
  - deep: specific counts (3 interviews, 50 signups, 1 paying user)

financial_metrics:
  - none: not discussed
  - shallow: mentioned pricing or costs
  - deep: specific numbers (burn rate, CAC, LTV, margins, runway)

distribution:
  - none: not discussed
  - shallow: mentioned a channel vaguely
  - deep: specific GTM plan with channels, partnerships, growth loops
```

Update interview techniques to include new probing patterns:
- For ai_technology: "What AI models or APIs power this? Are you building or buying?"
- For validation_evidence: "How many people have you actually talked to? Any signups or payments?"
- For financial_metrics: "What does it cost to acquire one customer? What's your burn rate?"
- For distribution: "How will your first 100 customers find you?"

**Commit:** `feat(validator): expand interview prompt with V3 topics`

---

### Task 0B: Expand Gemini response schema with new fields

**Files:**
- Modify: `supabase/functions/validator-followup/schema.ts`

**What to do:**

Add 4 new fields to `coverage` object in `followupResponseSchema`:
```typescript
ai_technology: { type: 'STRING', enum: ['none', 'shallow', 'deep'] },
validation_evidence: { type: 'STRING', enum: ['none', 'shallow', 'deep'] },
financial_metrics: { type: 'STRING', enum: ['none', 'shallow', 'deep'] },
distribution: { type: 'STRING', enum: ['none', 'shallow', 'deep'] },
```

Add 4 new fields to `extracted` object:
```typescript
ai_technology: { type: 'STRING', description: 'AI/tech stack details' },
validation_counts: { type: 'STRING', description: 'Quantified traction: X interviews, Y signups, Z payments' },
tested_assumptions: { type: 'STRING', description: 'Which assumptions tested and results' },
financial_metrics: { type: 'STRING', description: 'Unit economics: CAC, LTV, burn, runway' },
```

Add 4 new fields to `confidence` object:
```typescript
ai_technology: { type: 'STRING', enum: ['low', 'medium', 'high'] },
validation_counts: { type: 'STRING', enum: ['low', 'medium', 'high'] },
tested_assumptions: { type: 'STRING', enum: ['low', 'medium', 'high'] },
financial_metrics: { type: 'STRING', enum: ['low', 'medium', 'high'] },
```

**Commit:** `feat(validator): expand Gemini schema with V3 fields`

---

### Task 0C: Update frontend interfaces for 12-field tracking

**Files:**
- Modify: `src/hooks/useValidatorFollowup.ts`

**What to do:**

Expand `FollowupCoverage` interface (8 → 12):
```typescript
export interface FollowupCoverage {
  customer: CoverageDepth;
  problem: CoverageDepth;
  competitors: CoverageDepth;
  innovation: CoverageDepth;
  demand: CoverageDepth;
  research: CoverageDepth;
  uniqueness: CoverageDepth;
  websites: CoverageDepth;
  // V3 additions
  ai_technology: CoverageDepth;
  validation_evidence: CoverageDepth;
  financial_metrics: CoverageDepth;
  distribution: CoverageDepth;
}
```

Expand `ExtractedFields` interface (8 → 12):
```typescript
export interface ExtractedFields {
  problem: string;
  customer: string;
  solution: string;
  differentiation: string;
  demand: string;
  competitors: string;
  business_model: string;
  websites: string;
  // V3 additions
  ai_technology: string;
  validation_counts: string;
  tested_assumptions: string;
  financial_metrics: string;
}
```

Expand `ConfidenceMap` type (8 → 12) with the same 4 new fields.

Update `hasMinimumData()`:
- Old: problem + customer + 3 topics shallow
- New: problem + customer + 5 topics shallow (ensuring at least one V3 topic is covered)

Update `checkReadiness()`:
- Quick ready: 3+ msgs, 8+ shallow (up from 6), 4+ deep (up from 3)
- Normal ready: 5+ msgs, 7+ shallow (up from 5), 3+ deep (up from 2)
- Forced ready: 10+ msgs (unchanged)
- Add: validation_evidence must be at least shallow before ready

**Commit:** `feat(validator): expand frontend interfaces for V3 tracking`

---

### Task 0D: Update ContextPanel with new coverage topics

**Files:**
- Modify: `src/components/validator/chat/ContextPanel.tsx`

**What to do:**

Add the 4 new coverage topics to the visual tracking UI. The ContextPanel shows colored indicators for each topic's depth.

Add new topic labels and icons:
- ai_technology → "AI & Tech" (Cpu icon)
- validation_evidence → "Validation" (CheckCircle icon)
- financial_metrics → "Financials" (DollarSign icon)
- distribution → "Distribution" (Share2 icon)

Group topics into sections:
- Core (existing 8): Problem, Customer, Competitors, etc.
- V3 (new 4): AI & Tech, Validation, Financials, Distribution

Consider a "V3 Ready" badge that lights up when all 4 new topics have at least shallow coverage.

**Commit:** `feat(validator): show V3 coverage topics in ContextPanel`

---

### Task 0E: Update readiness logic and testing

**Files:**
- Modify: `src/hooks/useValidatorFollowup.ts` (readiness functions)
- Test: Run existing validator tests to ensure no regressions

**What to do:**

Verify the updated readiness thresholds work correctly:
1. Users who only discuss 8 topics can still complete (forced ready at 10 msgs)
2. Users who discuss V3 topics get proper tracking
3. The interview naturally flows into V3 topics after core topics are covered
4. validation_evidence shallow requirement doesn't create a dead end

Test edge cases:
- Old sessions with 8-field data still work (backward compat)
- New sessions track all 12 fields
- Readiness doesn't trigger too early or too late

**Commit:** `feat(validator): validate V3 readiness logic`

---

## Phase 1: Types & Schema Foundation

### Task 1: Add sub-score types to pipeline types

**Files:**
- Modify: `supabase/functions/validator-start/types.ts`
- Modify: `src/types/validation-report.ts`

**What to do:**

Add `SubScore` type and per-dimension sub-score interfaces to both files (keep them in sync).

```typescript
// Add to both types.ts files

export interface SubScore {
  name: string;
  score: number; // 0-100
  label: string; // human-readable
}

export interface DimensionDetail {
  composite_score: number; // 0-100
  sub_scores: SubScore[];
  executive_summary: string; // 2-3 sentence plain English
  risk_signals: string[]; // What could go wrong
  priority_actions: string[]; // What to fix
}
```

Add new section types for the 2 missing pages:

```typescript
export interface AIStrategyAssessment {
  detail: DimensionDetail; // composite score + sub-scores
  automation_level: 'assist' | 'copilot' | 'agent';
  ai_capability_stack: Array<{
    layer: string; // "Model", "Infrastructure", "Workflow", "Impact"
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

Update `ValidatorReport` interface to include these:

```typescript
// Add to ValidatorReport interface
ai_strategy?: AIStrategyAssessment;
validation_proof?: ValidationProofAssessment;
// Add optional DimensionDetail to existing sections for sub-scores
problem_detail?: DimensionDetail;
customer_detail?: DimensionDetail;
market_detail?: DimensionDetail;
competition_detail?: DimensionDetail;
revenue_detail?: DimensionDetail;
execution_detail?: DimensionDetail;
risk_detail?: DimensionDetail;
```

**Commit:** `feat(validator): add V3 sub-score and dimension detail types`

---

### Task 2: Add Gemini JSON schemas for new sections

**Files:**
- Modify: `supabase/functions/validator-start/schemas.ts`

**What to do:**

Add schemas for the `DimensionDetail` shape and the 2 new assessment types. These go into the Composer GroupC schema (which already handles execution/economics).

Add a reusable `dimensionDetailSchema` object:

```typescript
const dimensionDetailSchema = {
  type: 'OBJECT',
  properties: {
    composite_score: { type: 'INTEGER', description: 'Score 0-100' },
    sub_scores: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          score: { type: 'INTEGER' },
          label: { type: 'STRING' },
        },
        required: ['name', 'score', 'label'],
      },
    },
    executive_summary: { type: 'STRING', description: '2-3 sentences, plain English' },
    risk_signals: { type: 'ARRAY', items: { type: 'STRING' } },
    priority_actions: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['composite_score', 'sub_scores', 'executive_summary', 'risk_signals', 'priority_actions'],
};
```

Add `aiStrategySchema` and `validationProofSchema` using this base shape plus their specific fields.

Add `dimensionDetailsSchema` for the 7 existing dimensions (problem_detail, customer_detail, etc.) — these go into the scoring agent response or a new composer group.

**Commit:** `feat(validator): add V3 Gemini JSON schemas for sub-scores`

---

## Phase 2: Pipeline Changes

### Task 3: Expand Scoring Agent to produce per-dimension sub-scores

**Files:**
- Modify: `supabase/functions/validator-start/agents/scoring.ts`
- Modify: `supabase/functions/validator-start/scoring-math.ts`

**What to do:**

The scoring agent already produces 7 dimension scores (0-100). Expand its prompt to also return 3-5 sub-scores per dimension.

Update the scoring prompt (line ~40 in scoring.ts) to add:

```
For EACH dimension, also provide 3-5 sub-scores (0-100) that break down what contributes to that dimension's score.

Sub-scores per dimension:
- problemClarity: pain_intensity, frequency, economic_impact, replacement_urgency
- solutionStrength: uniqueness, feasibility, scalability, user_fit
- marketSize: tam_methodology, niche_focus, competition_density, distribution_feasibility
- competition: differentiation_depth, switching_cost, replicability_risk, competitive_reaction
- businessModel: pricing_clarity, monetization_validation, unit_economics, margin_sustainability, scalability
- teamFit: capability_match, resource_allocation, timeline_realism, operational_complexity
- timing: market_readiness, regulatory_environment, technology_maturity, competitive_window
```

Update the scoring schema to include a `dimension_sub_scores` field (a record keyed by dimension name, each containing an array of `{name, score, label}`).

Update `scoring-math.ts` to pass through sub-scores without modifying them (they're informational, not used in overall score calculation).

**Important:** Keep the existing 7-dimension weighted scoring math UNCHANGED. Sub-scores are additive information, not a replacement.

**Commit:** `feat(validator): expand scoring agent with per-dimension sub-scores`

---

### Task 4: Add Composer Group E for AI Strategy + Validation Proof + Dimension Details

**Files:**
- Modify: `supabase/functions/validator-start/agents/composer.ts`
- Modify: `supabase/functions/validator-start/config.ts` (if timeout adjustments needed)

**What to do:**

The composer currently runs Groups A (problem/customer), B (market/risk), C (execution/economics) in parallel, then D (synthesis) sequentially.

Add **Group E** that runs in parallel with A/B/C. It generates:
1. `ai_strategy` — AIStrategyAssessment
2. `validation_proof` — ValidationProofAssessment
3. `problem_detail` through `risk_detail` — DimensionDetail for each existing section

Group E prompt receives: `profile`, `scoring` (with sub-scores), `technology_stack` from profile context.

Group E output is merged into the final ValidatorReport alongside A/B/C/D outputs in `mergeGroups()`.

**Budget adjustment:** Current parallel budget is 70% of total. With 4 parallel groups instead of 3, keep the same 70% allocation — each group still gets up to 35s, they run concurrently via `Promise.allSettled`.

**Prompt structure for Group E:**

```
You are a consulting analyst producing dimension detail pages for a startup validation report.

For each of these 9 dimensions, produce a DimensionDetail object:
- composite_score: Use the provided dimension score
- sub_scores: 3-5 sub-scores (use the provided sub-scores from scoring, convert to 0-100 with human labels)
- executive_summary: 2-3 sentences in plain English explaining what this score means for the founder
- risk_signals: 2-3 specific risks for this dimension
- priority_actions: 2-3 concrete next steps to improve this dimension

Additionally produce:
- ai_strategy: Full AIStrategyAssessment with capability stack, automation level, data strategy, governance
- validation_proof: Full ValidationProofAssessment with evidence items, confidence level, assumption map
```

**Commit:** `feat(validator): add composer Group E for V3 dimension details`

---

### Task 5: Update Verifier to validate new sections

**Files:**
- Modify: `supabase/functions/validator-start/agents/verifier.ts`

**What to do:**

The verifier checks for required fields in the final report. Add checks for:
- `ai_strategy` exists and has `detail.composite_score`
- `validation_proof` exists and has `detail.composite_score`
- All 7 `*_detail` fields exist and have `composite_score` + `sub_scores` array

These should be **warnings** (not failures) since V3 sections are additive — old reports without them should still pass verification.

**Commit:** `feat(validator): add V3 section validation to verifier`

---

## Phase 3: Shared Frontend Components

### Task 6: Create SubScoreBar component

**Files:**
- Create: `src/components/validator/report/shared/SubScoreBar.tsx`

**What to do:**

A horizontal bar chart showing 3-5 sub-scores for a dimension. Follows the existing luxury style:

```typescript
interface SubScoreBarProps {
  subScores: Array<{ name: string; score: number; label: string }>;
}
```

Visual pattern:
- Vertical stack of labeled bars
- Label (11px uppercase, 0.15em tracking) on left
- Animated bar (bg-primary with opacity based on score) filling to score%
- Score number (Playfair, tabular-nums) on right
- Staggered animation delay per bar (100ms increments)
- Bar height: 6px, rounded-full
- Gap between bars: 12px

Reference `AnimatedBar.tsx` in shared/ for the existing bar pattern. This component is similar but with labels and Playfair score numbers.

**Commit:** `feat(validator): add SubScoreBar shared component`

---

### Task 7: Create StrategyDiagram component

**Files:**
- Create: `src/components/validator/report/shared/StrategyDiagram.tsx`

**What to do:**

A reusable flow/funnel/chain diagram component that renders different diagram styles:

```typescript
interface StrategyDiagramProps {
  type: 'chain' | 'funnel' | 'stack' | 'flow' | 'grid';
  steps: Array<{ label: string; sublabel?: string; status?: 'strong' | 'moderate' | 'weak' }>;
  title?: string;
}
```

Render patterns by type:
- **chain**: Horizontal connected boxes with arrows (Pain Chain for Problem)
- **funnel**: Narrowing trapezoids top-to-bottom (ICP Funnel for Customer, Evidence Funnel for Validation)
- **stack**: Vertical layers bottom-to-top (AI Capability Stack)
- **flow**: Horizontal flow with arrows (Revenue Engine, Execution Timeline)
- **grid**: 2x2 or NxN grid cells (Risk Heat)

Each step box:
- bg based on status: strong (sage-light), moderate (warm/20), weak (destructive/10)
- Rounded-lg border
- Label centered, 13px
- Connected by SVG arrows (chain/flow) or borders (stack/funnel)

Reference the SVG patterns in `CompetitorLuxury.tsx` (320x320 SVG with quadrants) and `MarketSizeLuxury.tsx` (concentric rings) for the luxury SVG approach.

**Commit:** `feat(validator): add StrategyDiagram shared component`

---

### Task 8: Create DimensionPage wrapper component

**Files:**
- Create: `src/components/validator/report/shared/DimensionPage.tsx`

**What to do:**

A wrapper that implements the 5-part consulting structure for any dimension:

```typescript
interface DimensionPageProps {
  detail: DimensionDetail;
  diagram: React.ReactNode; // StrategyDiagram or custom SVG
  scoreName: string; // e.g. "Problem Severity Index"
  children?: React.ReactNode; // section-specific content between diagram and risk
}
```

Layout (inside SectionShell):
1. Strategy Diagram (passed as prop)
2. Composite Score (large Playfair number) + Score Name + SubScoreBar
3. Executive Summary (prose paragraph)
4. `{children}` — section-specific extra content
5. Risk Signals — red/amber cards with AlertTriangle icons
6. Priority Actions — numbered list with CheckCircle icons, actionable language

This is the reusable "consulting page" shell that every section wraps its specific content with.

**Commit:** `feat(validator): add DimensionPage wrapper component`

---

## Phase 4: New Section Components

### Task 9: Create AIStrategyCard component

**Files:**
- Create: `src/components/validator/report/AIStrategyCard.tsx`

**What to do:**

Renders the AI & Technology Strategy dimension page.

```typescript
interface AIStrategyCardProps {
  data: AIStrategyAssessment;
}
```

Layout:
1. DimensionPage wrapper with scoreName="AI Leverage Index"
2. StrategyDiagram type="stack" showing the AI Capability Stack (Model → Infrastructure → Workflow → Impact)
3. Section-specific children:
   - Automation Level badge (assist/copilot/agent) with progress indicator
   - Data Strategy badge (owned/borrowed/hybrid)
   - Governance Readiness badge (not_ready/basic/compliant)
   - Technical risks from existing `technology_stack` data (if available)

Follow CompetitorLuxury card styling: border-l-4, threat-colored, staggered animation.

**Commit:** `feat(validator): add AIStrategyCard report section`

---

### Task 10: Create ValidationProofCard component

**Files:**
- Create: `src/components/validator/report/ValidationProofCard.tsx`

**What to do:**

Renders the Validation Proof & Evidence dimension page.

```typescript
interface ValidationProofCardProps {
  data: ValidationProofAssessment;
}
```

Layout:
1. DimensionPage wrapper with scoreName="Validation Confidence Index"
2. StrategyDiagram type="funnel" showing: Hypothesis → Interview → Experiment → Conversion → Revenue
3. Section-specific children:
   - Evidence items grid (icon per type: interview=Users, signup=UserPlus, conversion=ArrowRight, payment=DollarSign, experiment=Flask)
   - Evidence Confidence badge (high/medium/low/none with color)
   - Assumption Map: tested vs untested assumptions with check/x icons

**Commit:** `feat(validator): add ValidationProofCard report section`

---

### Task 11: Wire new sections into ReportV2Layout

**Files:**
- Modify: `src/components/validator/report/ReportV2Layout.tsx`

**What to do:**

Add the 2 new sections between the existing sections. Based on the docs ordering:

After S5 (Risk → current), insert:
- S6: AI Strategy (AIStrategyCard) — uses `details.ai_strategy`
- S7: Execution (existing MVP + Team + NextSteps stay but get unified title)

Renumber: the existing MVP (S6), Next Steps (S7) become part of a unified Execution section.

After current S12 (Key Questions), add:
- S8: Validation Proof (ValidationProofCard) — uses `details.validation_proof`

Both sections render conditionally: `{details.ai_strategy && <AIStrategyCard ... />}`

This ensures backward compatibility — old reports without V3 data still render fine.

**Commit:** `feat(validator): wire AIStrategy and ValidationProof into report layout`

---

## Phase 5: Enhance Existing Sections with Sub-Scores

### Task 12: Add DimensionPage wrapper to ProblemCard

**Files:**
- Modify: `src/components/validator/report/ProblemCard.tsx`

**What to do:**

Wrap existing ProblemCard content with DimensionPage when `detail` data is available:

```typescript
interface ProblemCardProps {
  who: string;
  pain: string;
  currentFix: string;
  severity: 'high' | 'medium' | 'low';
  detail?: DimensionDetail; // NEW — optional V3 data
}
```

If `detail` exists:
- Render DimensionPage with scoreName="Problem Severity Index"
- Add StrategyDiagram type="chain" with steps: User Friction → Operational Cost → Financial Impact → Urgency → Purchase Decision
- Keep existing Who/Pain/Fix cards as `children` inside DimensionPage

If `detail` is undefined: render existing layout unchanged (backward compat).

**Commit:** `feat(validator): add sub-scores to ProblemCard`

---

### Task 13: Add DimensionPage wrapper to CustomerPersona

**Files:**
- Modify: `src/components/validator/report/CustomerPersona.tsx`

**What to do:**

Same pattern as Task 12. Add optional `detail?: DimensionDetail` prop.

- scoreName: "ICP Precision Index"
- StrategyDiagram type="funnel": Total Segment → Narrow ICP → Early Adopter → Budget Holder → Decision Authority
- Existing before/after persona content becomes `children`

**Commit:** `feat(validator): add sub-scores to CustomerPersona`

---

### Task 14: Add DimensionPage wrapper to MarketSizeLuxury

**Files:**
- Modify: `src/components/validator/report/MarketSizeLuxury.tsx`

**What to do:**

Add optional `detail?: DimensionDetail` prop.

- scoreName: "Market Realism Index"
- The existing concentric rings SVG IS the strategy diagram — no need to add StrategyDiagram
- Add SubScoreBar below the existing rings/cards layout
- Add risk_signals and priority_actions sections at bottom

**Commit:** `feat(validator): add sub-scores to MarketSizeLuxury`

---

### Task 15: Add DimensionPage wrapper to CompetitorLuxury

**Files:**
- Modify: `src/components/validator/report/CompetitorLuxury.tsx`

**What to do:**

Add optional `detail?: DimensionDetail` prop.

- scoreName: "Defensibility Index"
- The existing 2x2 positioning matrix IS the strategy diagram
- Add SubScoreBar below the competitor cards
- Add risk_signals and priority_actions sections at bottom

**Commit:** `feat(validator): add sub-scores to CompetitorLuxury`

---

### Task 16: Add DimensionPage wrapper to RevenueModelDash

**Files:**
- Modify: `src/components/validator/report/RevenueModelDash.tsx`

**What to do:**

Add optional `detail?: DimensionDetail` prop.

- scoreName: "Revenue Strategic Index"
- Add StrategyDiagram type="flow": Customer → Offer → Pricing → Conversion → Retention → Expansion
- Existing unit economics cards become `children`

**Commit:** `feat(validator): add sub-scores to RevenueModelDash`

---

### Task 17: Enhance RiskHeatmap with sub-scores and dependency signals

**Files:**
- Modify: `src/components/validator/report/RiskHeatmap.tsx`

**What to do:**

Add optional `detail?: DimensionDetail` prop.

- scoreName: "Risk Exposure Index"
- Existing 2x2 grid IS the strategy diagram
- Add SubScoreBar (Financial Risk, Regulatory Risk, Execution Risk, AI Governance Risk, Market Volatility)
- Add executive_summary and priority_actions below existing risk cards

**Commit:** `feat(validator): add sub-scores to RiskHeatmap`

---

### Task 18: Wire detail props through ReportV2Layout

**Files:**
- Modify: `src/components/validator/report/ReportV2Layout.tsx`

**What to do:**

Pass the `*_detail` fields from `details` to each section component:

```tsx
<ProblemCard
  who={...}
  pain={...}
  currentFix={...}
  severity={...}
  detail={details.problem_detail}  // NEW
/>
```

Same pattern for all 7 enhanced sections. Each gets its corresponding `*_detail` prop.

**Commit:** `feat(validator): pass V3 dimension details to all report sections`

---

## Phase 6: AI Lean Canvas

### Task 19: Create AI Lean Canvas types

**Files:**
- Modify: `src/types/validation-report.ts`
- Modify: `supabase/functions/validator-start/types.ts`

**What to do:**

```typescript
export interface AILeanCanvasBlock {
  title: string;
  items: string[];
}

export interface AILeanCanvas {
  core_problem: AILeanCanvasBlock;
  ai_solution: AILeanCanvasBlock;
  unique_ai_advantage: AILeanCanvasBlock;
  customer_segments: AILeanCanvasBlock;
  value_proposition: AILeanCanvasBlock;
  revenue_model: AILeanCanvasBlock;
  cost_structure: AILeanCanvasBlock;
  key_metrics: AILeanCanvasBlock;
  distribution_gtm: AILeanCanvasBlock;
}
```

Add `lean_canvas?: AILeanCanvas` to `ValidatorReport`.

**Commit:** `feat(validator): add AILeanCanvas types`

---

### Task 20: Generate AI Lean Canvas in Composer

**Files:**
- Modify: `supabase/functions/validator-start/agents/composer.ts`
- Modify: `supabase/functions/validator-start/schemas.ts`

**What to do:**

Add lean_canvas generation to an existing Composer Group (Group E from Task 4, or add to Group D synthesis since it already has all context).

The lean canvas is a synthesis of existing report data — each block maps to existing sections:
- core_problem → problem_clarity
- ai_solution → mvp_scope + technology_stack
- unique_ai_advantage → competition differentiation + ai_strategy
- customer_segments → customer_use_case
- value_proposition → problem + solution + differentiation
- revenue_model → revenue_model
- cost_structure → team_hiring.monthly_burn + technology_stack
- key_metrics → scoring dimensions + financial_projections
- distribution_gtm → next_steps + market entry strategy

Add the schema and merge lean_canvas into the final report.

**Commit:** `feat(validator): generate AI Lean Canvas in composer pipeline`

---

### Task 21: Create LeanCanvasGrid component

**Files:**
- Create: `src/components/validator/report/LeanCanvasGrid.tsx`

**What to do:**

A 3x3 grid component rendering the 9 lean canvas blocks:

```typescript
interface LeanCanvasGridProps {
  canvas: AILeanCanvas;
}
```

Layout: CSS Grid 3 columns on desktop, 2 on tablet, 1 on mobile.

Each block:
- Card with bg-card, rounded-xl, border, p-4
- Title: 11px uppercase tracking, muted-foreground
- Items: bullet list, 13px sans
- Subtle icon per block (from Lucide)
- Staggered animation on mount

Block icons:
- core_problem → AlertCircle
- ai_solution → Cpu
- unique_ai_advantage → Shield
- customer_segments → Users
- value_proposition → Target
- revenue_model → DollarSign
- cost_structure → Calculator
- key_metrics → BarChart3
- distribution_gtm → Share2

**Commit:** `feat(validator): add LeanCanvasGrid component`

---

### Task 22: Wire Lean Canvas into report

**Files:**
- Modify: `src/components/validator/report/ReportV2Layout.tsx`

**What to do:**

Add the LeanCanvasGrid as the final section before Resources, wrapped in SectionShell:

```tsx
{details.lean_canvas && (
  <SectionShell id="lean-canvas" number={10} title="AI Startup Lean Canvas">
    <LeanCanvasGrid canvas={details.lean_canvas} />
  </SectionShell>
)}
```

**Commit:** `feat(validator): wire AI Lean Canvas into report layout`

---

## Phase 7: Scoring Integration

### Task 23: Update StickyScoreBar with V3 dimension navigation

**Files:**
- Modify: `src/components/validator/report/shared/StickyScoreBar.tsx`

**What to do:**

The sticky bar currently shows overall score + a few metric chips. Enhance it to show mini score indicators for each of the 9 dimensions (clickable to scroll to that section).

Add a row of 9 small circles (16x16) below the main score, each:
- Colored by score: green (>=75), amber (50-74), red (<50)
- Tooltip with dimension name + score on hover
- onClick scrolls to that section via `document.getElementById(sectionId).scrollIntoView()`

Only show this row if V3 dimension details are available.

**Commit:** `feat(validator): add dimension score navigation to StickyScoreBar`

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| **0. Chat Interview Expansion** | 0A-0E | V3-ready interview data (AI, traction, financials, distribution) |
| 1. Types & Schemas | 1-2 | Foundation types for all V3 features |
| 2. Pipeline | 3-5 | Scoring sub-scores + Composer Group E + Verifier |
| 3. Shared Components | 6-8 | SubScoreBar, StrategyDiagram, DimensionPage |
| 4. New Sections | 9-11 | AI Strategy + Validation Proof pages |
| 5. Enhance Existing | 12-18 | Sub-scores on all 7 existing sections |
| 6. AI Lean Canvas | 19-22 | 9-block canvas generation + display |
| 7. Score Navigation | 23 | Dimension score indicators in sticky bar |

**Total: 28 tasks across 8 phases (Phase 0-7).**

Dependencies:
- **Phase 0 is a BLOCKER for Phase 2** (pipeline needs V3 interview data)
- Phase 1 can run in parallel with Phase 0 (types don't depend on interview)
- Phase 2 depends on Phase 0 (interview data) + Phase 1 (types/schemas)
- Phase 3 depends on nothing (can parallel with Phase 0/1/2)
- Phase 4 depends on Phase 3 (shared components)
- Phase 5 depends on Phase 3 (shared components)
- Phase 6 depends on Phase 1 (types)
- Phase 7 depends on Phase 2 (scoring data)

Phases 0+1 run first (parallel). Then Phase 2+3 (parallel). Then Phases 4, 5, 6 (parallel). Phase 7 last.
