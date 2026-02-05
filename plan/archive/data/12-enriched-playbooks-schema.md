---
task_number: "10"
title: "Enriched Industry Playbooks — Schema Definition"
category: "Supabase"
subcategory: "Schema"
phase: 1
priority: "P1"
status: "Complete"
percent_complete: 100
owner: "Backend Developer"
---

# Enriched Industry Playbooks — Schema Definition

**Version:** 2.0
**Date:** 2026-01-29
**Purpose:** TypeScript schema for enriched industry playbooks with 10 knowledge categories
**Status:** ✅ Aligned with implementation (`_shared/industry-context.ts`)

---

## Core Schema

```typescript
interface EnrichedIndustryPlaybook {
  id: string;
  industry_id: string;
  display_name: string;

  // Core narrative
  narrative_arc: string;

  // 10 Knowledge Categories
  investor_expectations: InvestorExpectations;
  failure_patterns: FailurePattern[];
  success_stories: SuccessStory[];
  benchmarks: BenchmarkMetric[];
  terminology: IndustryTerminology;
  gtm_patterns: GTMPattern[];
  decision_frameworks: DecisionFramework[];
  investor_questions: InvestorQuestion[];
  warning_signs: WarningSign[];
  stage_checklists: StageChecklist[];

  // Pitch-specific guidance
  slide_emphasis: SlideEmphasis[];

  // Metadata
  version: number;
  is_active: boolean;
}
```

---

## Knowledge Category Schemas

### 1. Investor Expectations

```typescript
interface InvestorExpectations {
  pre_seed: StageExpectation;
  seed: StageExpectation;
  series_a: StageExpectation;
}

interface StageExpectation {
  focus: string[];         // What investors prioritize
  metrics: string[];       // Specific numbers they want
  deal_breakers: string[]; // Instant no's
}
```

### 2. Failure Patterns

```typescript
interface FailurePattern {
  pattern: string;         // "Regulatory afterthought"
  why_fatal: string;       // "Banks won't partner without compliance"
  early_warning: string;   // "No compliance budget in seed raise"
  how_to_avoid: string;    // "Budget 15-20% of seed for licensing"
}
```

### 3. Success Stories

```typescript
interface SuccessStory {
  archetype: string;       // "Regulatory-First Infrastructure"
  pattern: string;         // "Licenses → bank pilot → scale"
  key_moves: string[];     // Specific actions that worked
  outcome_signal: string;  // Why this led to success
}
```

### 4. Benchmarks

```typescript
interface BenchmarkMetric {
  metric: string;          // "Net Revenue Retention"
  good: string;            // "100-120%"
  great: string;           // ">120%"
  stage: string;           // "seed" | "series_a" | "all"
  source?: string;         // "OpenView SaaS Benchmarks 2025"
}
```

### 5. Terminology

```typescript
interface IndustryTerminology {
  use_phrases: string[];        // Sound like an expert
  avoid_phrases: string[];      // Sound like a novice
  investor_vocabulary: string[];// Terms investors use
}
```

### 6. GTM Patterns

```typescript
interface GTMPattern {
  name: string;            // "Compliance-First Enterprise"
  description: string;     // Full strategy description
  stages: string[];        // When this works
  channels: string[];      // Where to focus
  timeline: string;        // Realistic timeframe
}
```

### 7. Decision Frameworks

```typescript
interface DecisionFramework {
  id?: string;
  decision: string;        // "B2C vs B2B vs B2B2C"
  rows: DecisionRow[];
}

interface DecisionRow {
  if_condition: string;    // "ACV < $5K and self-serve possible"
  then_action: string;     // "Go PLG"
  because: string;         // "Sales cost exceeds first-year revenue"
}
```

### 8. Investor Questions

```typescript
interface InvestorQuestion {
  category: string;           // "metrics" | "traction" | "team"
  question: string;           // "What's your CAC payback?"
  good_answer: string;        // Detailed example
  bad_answer: string;         // What to avoid
  follow_up?: string;         // What they'll ask next
}
```

### 9. Warning Signs

```typescript
interface WarningSign {
  signal: string;          // "Pilot takes >90 days"
  trigger: string;         // "Champion lacks budget authority"
  action: string;          // Specific response
  severity: 'critical' | 'warning';
}
```

### 10. Stage Checklists

```typescript
interface StageChecklist {
  stage: string;           // "pre_seed"
  tasks: ChecklistTask[];
}

interface ChecklistTask {
  task: string;            // "Get 5 signed LOIs"
  why: string;             // "Proves demand"
  how: string;             // Specific approach
  time: string;            // "4-6 weeks"
  cost: string;            // "$2-3K"
}
```

---

## Context Injection Helper

```typescript
// 8 Feature Contexts supported
type FeatureContext =
  | 'onboarding'
  | 'lean_canvas'
  | 'pitch_deck'
  | 'tasks'
  | 'chatbot'
  | 'validator'
  | 'gtm_planning'
  | 'fundraising';

type FundingStage = 'pre_seed' | 'seed' | 'series_a' | 'series_b' | 'growth';

const CONTEXT_MAP: Record<FeatureContext, (keyof EnrichedIndustryPlaybook)[]> = {
  onboarding: ['failure_patterns', 'terminology'],
  lean_canvas: ['gtm_patterns', 'benchmarks'],
  pitch_deck: ['investor_expectations', 'success_stories', 'failure_patterns',
               'investor_questions', 'warning_signs', 'slide_emphasis'],
  tasks: ['gtm_patterns', 'failure_patterns', 'stage_checklists', 'decision_frameworks'],
  chatbot: ['investor_expectations', 'failure_patterns', 'success_stories',
            'benchmarks', 'terminology', 'gtm_patterns', 'decision_frameworks',
            'investor_questions', 'warning_signs', 'stage_checklists'],
  validator: ['benchmarks', 'warning_signs', 'failure_patterns'],
  gtm_planning: ['gtm_patterns', 'failure_patterns', 'decision_frameworks'],
  fundraising: ['investor_expectations', 'investor_questions', 'stage_checklists', 'warning_signs']
};

async function getIndustryContext(
  industry_id: string,
  feature: FeatureContext,
  stage?: FundingStage
): Promise<Partial<EnrichedIndustryPlaybook> | null> {
  const playbook = await loadPlaybook(industry_id);
  const categories = CONTEXT_MAP[feature];
  return filterByCategories(playbook, categories, stage);
}
```

---

## Prompt Injection Format

```
INDUSTRY EXPERT CONTEXT: {industry_name}
Stage: {stage}

{if failure_patterns}
## Failure Patterns to Avoid
{foreach pattern in failure_patterns}
⚠️ {pattern.pattern}
   Why fatal: {pattern.why_fatal}
   Early warning: {pattern.early_warning}
   Prevention: {pattern.how_to_avoid}
{/foreach}
{/if}

{if investor_expectations && stage}
## What {stage} Investors Expect
Focus: {investor_expectations[stage].focus}
Key metrics: {investor_expectations[stage].metrics}
Deal breakers: {investor_expectations[stage].deal_breakers}
{/if}

{if benchmarks}
## Industry Benchmarks
{foreach metric in benchmarks where stage in metric.stage_relevant}
• {metric.name}: Good = {metric.good}, Great = {metric.great}
{/foreach}
{/if}

{if gtm_patterns}
## GTM Strategies That Work
{foreach gtm in gtm_patterns where stage in gtm.stages}
**{gtm.name}**: {gtm.description}
Channels: {gtm.channels}
Timeline: {gtm.timeline}
{/foreach}
{/if}

{if decision_frameworks}
## Decision Frameworks
{foreach df in decision_frameworks}
**{df.decision}**
{foreach rule in df.rules}
• IF {rule.if_condition} → {rule.then_action}
  (Because: {rule.rationale})
{/foreach}
{/foreach}
{/if}

{if terminology}
## Industry Language
Use: {terminology.use_phrases}
Avoid: {terminology.avoid_phrases}
{/if}
```

---

## File Locations

| File | Path |
|------|------|
| Schema | `tasks/00-plan/prompts/10-enriched-playbooks-schema.md` |
| Injection Map | `tasks/00-plan/prompts/11-context-injection-map.md` |
| Playbooks | `tasks/00-plan/industry/playbooks/{industry_id}.md` |
| Helper (edge) | `supabase/functions/_shared/industry-context.ts` |
