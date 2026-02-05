---
name: validation-lab
description: Use this skill when designing and running validation experiments - customer interviews, landing page tests, smoke tests, concierge MVPs, and assumption testing. Triggers on "experiment", "validation", "customer interview", "smoke test", "assumption testing", "A/B test", "concierge MVP".
---

# Validation Lab

## Overview

Design, execute, and analyze validation experiments to test startup assumptions. Covers customer interviews, landing page tests, smoke tests, concierge MVPs, and structured experiment frameworks with hypothesis-driven learning.

## When to Use

- Designing customer interview scripts
- Creating landing page experiments
- Building assumption testing frameworks
- Implementing smoke test campaigns
- Tracking experiment results and learnings
- Running concierge MVP workflows

## Validation Experiment Types

```
EXPERIMENT TYPES BY STAGE

IDEA STAGE
├── Customer Interviews (20+ conversations)
├── Problem Surveys (100+ responses)
└── Competitive Analysis

PSF STAGE (Problem-Solution Fit)
├── Landing Page Tests (signup rate)
├── Smoke Tests (fake door)
├── Concierge MVP (manual delivery)
└── Wizard of Oz (human backend)

MVP STAGE
├── Feature Experiments
├── Pricing Tests
├── Channel Experiments
└── Activation Experiments

PMF STAGE (Product-Market Fit)
├── Sean Ellis Survey (40% "very disappointed")
├── Cohort Analysis
├── Retention Experiments
└── Referral Tests
```

## Experiment Framework

```typescript
interface Experiment {
  id: string;
  hypothesis: string;         // "We believe that..."
  riskiest_assumption: string; // The core assumption being tested
  success_criteria: string;    // "We'll know this is true when..."
  experiment_type: ExperimentType;
  sample_size: number;
  duration_days: number;
  status: 'planned' | 'running' | 'complete';
  result: ExperimentResult | null;
}

interface ExperimentResult {
  passed: boolean;
  metric_achieved: number;
  metric_target: number;
  confidence: number;  // 0-100
  key_learnings: string[];
  next_action: 'pivot' | 'persevere' | 'iterate';
  tasks_generated: Task[];
}

function evaluateExperiment(exp: Experiment, data: any): ExperimentResult {
  const achieved = calculateMetric(exp.experiment_type, data);
  const passed = achieved >= exp.success_criteria_value;

  return {
    passed,
    metric_achieved: achieved,
    metric_target: exp.success_criteria_value,
    confidence: calculateConfidence(exp.sample_size, data),
    key_learnings: extractLearnings(data),
    next_action: determineNextAction(passed, exp),
    tasks_generated: generateFollowUpTasks(passed, exp)
  };
}
```

## Customer Interview Framework

### Interview Script Template

```markdown
## Customer Interview Script

### Opening (2 min)
- Thank you for your time
- Brief context: "We're exploring [problem space]"
- Permission to record

### Problem Discovery (10 min)
1. Tell me about the last time you experienced [problem]?
2. How often does this happen?
3. What have you tried to solve it?
4. What happened with those solutions?
5. How much time/money does this cost you?

### Pain Level Assessment (5 min)
1. On a scale of 1-10, how painful is this problem?
2. What would it mean for you if this was solved?
3. Would you pay for a solution? How much?

### Closing (3 min)
- Anything else I should know?
- Know anyone else with this problem?
- Can I follow up with you?

### Post-Interview Notes
- Problem severity: [1-10]
- Willingness to pay: [Yes/No/Maybe]
- Key quotes:
- Follow-up actions:
```

### Interview Synthesis

```typescript
interface InterviewSynthesis {
  total_interviews: number;
  avg_problem_severity: number;
  willingness_to_pay_rate: number;
  top_problems: { problem: string; frequency: number }[];
  existing_solutions: { solution: string; satisfaction: number }[];
  key_quotes: string[];
  patterns_identified: string[];
  recommended_next_steps: string[];
}

function synthesizeInterviews(interviews: Interview[]): InterviewSynthesis {
  return {
    total_interviews: interviews.length,
    avg_problem_severity: average(interviews.map(i => i.severity)),
    willingness_to_pay_rate: interviews.filter(i => i.wtp).length / interviews.length,
    top_problems: groupAndCount(interviews.flatMap(i => i.problems)),
    existing_solutions: analyzeExistingSolutions(interviews),
    key_quotes: extractKeyQuotes(interviews),
    patterns_identified: identifyPatterns(interviews),
    recommended_next_steps: generateRecommendations(interviews)
  };
}
```

## Landing Page Test

```typescript
interface LandingPageTest {
  hypothesis: string;
  variants: LandingPageVariant[];
  traffic_source: string;
  target_signups: number;
  target_conversion: number;  // percentage
  duration_days: number;
}

interface LandingPageVariant {
  name: string;  // "A", "B", "C"
  headline: string;
  value_prop: string;
  cta: string;
  visitors: number;
  signups: number;
  conversion_rate: number;
}

// Benchmarks
const LANDING_PAGE_BENCHMARKS = {
  good_conversion: 0.05,    // 5%
  great_conversion: 0.10,   // 10%
  excellent_conversion: 0.15 // 15%
};
```

## Smoke Test (Fake Door)

```typescript
interface SmokeTest {
  feature_name: string;
  placement: string;  // "nav", "settings", "dashboard"
  cta_text: string;
  impression_count: number;
  click_count: number;
  click_rate: number;
  waitlist_signups: number;
  threshold: number;  // minimum click rate to proceed
}

function evaluateSmokeTest(test: SmokeTest): boolean {
  // Typical threshold: 5% click rate indicates interest
  return test.click_rate >= test.threshold;
}
```

## Assumption Mapping

```typescript
interface Assumption {
  id: string;
  category: 'problem' | 'solution' | 'customer' | 'channel' | 'revenue';
  statement: string;
  impact: number;      // 1-10: How important if wrong
  uncertainty: number; // 1-10: How uncertain we are
  risk_score: number;  // impact × uncertainty
  status: 'untested' | 'testing' | 'validated' | 'invalidated';
  experiment_id: string | null;
}

function prioritizeAssumptions(assumptions: Assumption[]): Assumption[] {
  return assumptions
    .map(a => ({ ...a, risk_score: a.impact * a.uncertainty }))
    .sort((a, b) => b.risk_score - a.risk_score);
}
```

## Experiment Dashboard Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Experiments Run | Total experiments completed | 10+ per quarter |
| Validation Rate | % of hypotheses validated | 30-50% |
| Learning Velocity | Key insights per week | 5+ |
| Pivot Rate | Major pivots based on data | 1-2 per quarter |
| Interview Coverage | Unique segments interviewed | 100% of ICPs |

## Edge Function: `validation-lab`

```typescript
// Actions
- 'design_experiment': Create experiment from assumption
- 'generate_interview': Create interview script for segment
- 'synthesize_interviews': Analyze interview batch
- 'evaluate_test': Analyze experiment results
- 'prioritize_assumptions': Rank assumptions by risk
- 'recommend_next': Suggest next experiment
```

## AI Model Selection

| Task | Model |
|------|-------|
| Interview script generation | `gemini-3-flash-preview` |
| Interview synthesis | `gemini-3-pro-preview` |
| Experiment design | `gemini-3-pro-preview` |
| Results analysis | `claude-sonnet-4-5-20250929` |
| Strategic recommendations | `claude-sonnet-4-5-20250929` |

## References

- PRD Section 6: Validation Lab
- Strategy Section 4: Validation Phases
- Diagram D-08: Validation Lab Flow
- `/startup-system/guides/53-validate-prompts.md`
