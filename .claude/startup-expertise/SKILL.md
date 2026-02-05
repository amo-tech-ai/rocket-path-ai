---
name: startup-expertise
description: Use when building startup features, accessing playbooks, implementing YC best practices, or needing industry-specific guidance. Triggers on "startup", "YC", "playbook", "fundraising", "pitch", "investor", "canvas", "validation", "metrics".
---

# Startup Expertise Skill

> **Purpose:** Access YC-level startup knowledge, industry playbooks, and best practices for building StartupAI features.

---

## When to Use This Skill

| Trigger | Example |
|---------|---------|
| Building startup features | "Implement health score calculation" |
| Accessing playbooks | "What metrics matter for SaaS?" |
| Industry guidance | "Fashion startup best practices" |
| Fundraising features | "Build investor matching" |
| Validation features | "Implement canvas analysis" |

---

## 1. Knowledge Sources

### Industry Playbooks (19 Available)

Access via Supabase:
```sql
-- Get playbook for specific industry
SELECT * FROM industry_playbooks WHERE industry_id = 'ai_saas';

-- List all available playbooks
SELECT industry_id, display_name FROM industry_playbooks WHERE is_active = true;
```

| Industry ID | Display Name | Key Metrics |
|-------------|--------------|-------------|
| `ai_saas` | AI SaaS / B2B | MRR, CAC, LTV, churn, NRR |
| `fintech` | FinTech | Transaction volume, take rate, compliance |
| `healthcare` | Healthcare | Outcomes, regulatory, reimbursement |
| `fashion_apparel` | Fashion & Apparel | Sell-through, markdown %, inventory |
| `ecommerce_pure` | eCommerce | AOV, conversion, repeat purchase |
| `education` | Education | Enrollment, completion, outcomes |
| `cybersecurity` | Cybersecurity | ARR, net retention, certifications |

**Full list:** Query `SELECT industry_id, display_name FROM industry_playbooks`

### Playbook Fields Available

```typescript
interface IndustryPlaybook {
  industry_id: string;
  display_name: string;
  narrative_arc: string;           // Story structure for pitches
  prompt_context: string;          // AI prompt enhancement
  investor_expectations: object;   // What investors look for
  failure_patterns: string[];      // Common mistakes
  success_stories: object[];       // Examples
  benchmarks: object;              // Industry benchmarks
  terminology: object;             // Industry-specific terms
  gtm_patterns: object;            // Go-to-market strategies
  decision_frameworks: object;     // How to make decisions
  investor_questions: string[];    // FAQ from investors
  warning_signs: string[];         // Red flags
  stage_checklists: object;        // Stage-specific tasks
  slide_emphasis: object;          // Pitch deck guidance
}
```

---

## 2. Prompt Packs

### What Are Prompt Packs?

Pre-built AI workflows for common startup tasks. Each pack is a multi-step prompt sequence.

### Available Categories

| Category | Packs | Use Case |
|----------|-------|----------|
| **Validation** | Problem validation, Customer interview, Market sizing | Early-stage founders |
| **Fundraising** | Pitch deck outline, Investor email, Due diligence prep | Raising capital |
| **Growth** | Channel analysis, Retention strategy, Pricing model | Scaling startups |
| **Planning** | OKR setting, Roadmap creation, Sprint planning | Execution |

### Accessing Prompt Packs

```typescript
// In edge function
const { data: pack } = await supabase
  .from('prompt_packs')
  .select('*')
  .eq('category', 'fundraising')
  .eq('name', 'pitch_deck_outline')
  .single();

// Execute pack steps
for (const step of pack.steps) {
  const result = await executePromptStep(step, context);
}
```

---

## 3. YC Best Practices

### Why Startups Succeed (YC Data)

| Factor | Weight | How to Measure |
|--------|--------|----------------|
| **Founder-Market Fit** | 30% | Domain expertise, passion, unfair advantage |
| **Problem Clarity** | 25% | Can explain in one sentence, clear pain point |
| **Traction Velocity** | 20% | Week-over-week growth rate |
| **Market Size** | 15% | TAM/SAM/SOM with bottoms-up analysis |
| **Team Completeness** | 10% | Technical + business + domain coverage |

### YC Application Tips

```markdown
## What YC Partners Look For

1. **Clarity** - Can you explain your startup in one sentence?
2. **Traction** - What have you built? What do users say?
3. **Insight** - What do you know that others don't?
4. **Determination** - What obstacles have you overcome?
5. **Speed** - How fast do you move?

## Common Mistakes
- Vague problem description
- No customer quotes
- Feature-focused instead of problem-focused
- Unrealistic market size (top-down TAM)
- No unfair advantage articulated
```

### Stage-Appropriate Guidance

| Stage | Focus | Key Metrics | YC Advice |
|-------|-------|-------------|-----------|
| **Idea** | Problem validation | # interviews, problem severity | "Talk to users" |
| **Pre-seed** | MVP + early users | Active users, engagement | "Do things that don't scale" |
| **Seed** | Product-market fit | Retention, NPS, growth rate | "Make something people want" |
| **Series A** | Repeatable growth | Unit economics, CAC payback | "Find your growth loop" |

---

## 4. Implementing Startup Features

### Health Score Calculation

```typescript
// Reference: health-scorer edge function
interface HealthScore {
  overall: number;  // 0-100
  breakdown: {
    product: number;   // Feature completeness, user feedback
    market: number;    // Competition, timing, size
    team: number;      // Completeness, experience
    traction: number;  // Growth rate, engagement
    financial: number; // Runway, unit economics
  };
  recommendations: string[];
}

// Weights by stage
const stageWeights = {
  idea: { product: 0.3, market: 0.3, team: 0.2, traction: 0.1, financial: 0.1 },
  seed: { product: 0.25, market: 0.2, team: 0.15, traction: 0.25, financial: 0.15 },
  series_a: { product: 0.2, market: 0.15, team: 0.15, traction: 0.25, financial: 0.25 },
};
```

### Investor Matching

```typescript
// Reference: investor-agent edge function
interface InvestorMatch {
  investor_id: string;
  match_score: number;  // 0-100
  reasons: string[];    // Why they match
  signals: {
    stage_fit: boolean;
    industry_fit: boolean;
    check_size_fit: boolean;
    thesis_alignment: number;
  };
}

// Matching criteria
const matchCriteria = {
  stage: startup.stage,
  industry: startup.industry,
  geography: startup.location,
  check_size: startup.raising_amount,
  thesis_keywords: extractKeywords(startup.description),
};
```

### Canvas Analysis

```typescript
// Reference: lean-canvas-agent edge function
interface CanvasAnalysis {
  completeness: number;  // 0-100
  coherence: number;     // 0-100 (do sections align?)
  gaps: string[];        // Missing or weak sections
  suggestions: {
    section: string;
    current: string;
    suggested: string;
    reason: string;
  }[];
}

// Section validation rules
const validationRules = {
  problem: { min_length: 50, requires: ['pain_point', 'frequency'] },
  solution: { must_address: 'problem', avoid: ['feature_list'] },
  unique_value: { formula: 'For [X] who [Y], we [Z] unlike [W]' },
  unfair_advantage: { not_allowed: ['first_mover', 'passion', 'hard_work'] },
};
```

---

## 5. Best Practices Checklist

### When Building Startup Features

- [ ] Check if industry playbook exists for user's industry
- [ ] Use stage-appropriate metrics and guidance
- [ ] Reference YC/a16z best practices where applicable
- [ ] Include industry-specific terminology
- [ ] Validate against common failure patterns
- [ ] Provide actionable recommendations, not just scores

### When Accessing Playbooks

- [ ] Always filter by `is_active = true`
- [ ] Cache playbook data (update frequency: monthly)
- [ ] Fall back to generic advice if industry not found
- [ ] Use `prompt_context` to enhance AI responses

### When Implementing Scoring

- [ ] Use stage-appropriate weights
- [ ] Provide breakdown, not just total score
- [ ] Include specific recommendations
- [ ] Compare to industry benchmarks where available
- [ ] Explain score changes over time

---

## 6. Quick Reference

### Edge Functions for Startup Features

| Function | Purpose | Playbook Integration |
|----------|---------|---------------------|
| `health-scorer` | Calculate startup health | Uses benchmarks |
| `stage-analyzer` | Determine/validate stage | Uses stage_checklists |
| `investor-agent` | Match and research investors | Uses investor_expectations |
| `lean-canvas-agent` | Canvas analysis | Uses decision_frameworks |
| `pitch-deck-agent` | Deck generation | Uses narrative_arc, slide_emphasis |
| `industry-expert-agent` | Industry guidance | Full playbook access |
| `compute-daily-focus` | Daily recommendations | Uses stage_checklists |

### Database Tables

| Table | Purpose |
|-------|---------|
| `industry_playbooks` | Industry-specific knowledge |
| `prompt_packs` | AI workflow templates |
| `startups` | User startup data |
| `health_scores` | Historical health scores |
| `lean_canvases` | Business model canvases |

---

## 7. Examples

### Example: Inject Industry Context into AI Prompt

```typescript
async function buildPromptWithPlaybook(
  basePrompt: string,
  startupId: string
): Promise<string> {
  // Get startup's industry
  const { data: startup } = await supabase
    .from('startups')
    .select('industry')
    .eq('id', startupId)
    .single();

  // Get playbook
  const { data: playbook } = await supabase
    .from('industry_playbooks')
    .select('prompt_context, terminology, benchmarks')
    .eq('industry_id', startup.industry)
    .single();

  if (!playbook) return basePrompt;

  return `${basePrompt}

Industry Context (${startup.industry}):
${playbook.prompt_context}

Key Terminology:
${JSON.stringify(playbook.terminology, null, 2)}

Industry Benchmarks:
${JSON.stringify(playbook.benchmarks, null, 2)}`;
}
```

### Example: Stage-Appropriate Task Generation

```typescript
async function generateStageTasks(
  startupId: string
): Promise<Task[]> {
  const { data: startup } = await supabase
    .from('startups')
    .select('stage, industry')
    .eq('id', startupId)
    .single();

  const { data: playbook } = await supabase
    .from('industry_playbooks')
    .select('stage_checklists')
    .eq('industry_id', startup.industry)
    .single();

  const checklist = playbook?.stage_checklists?.[startup.stage] || [];

  return checklist.map(item => ({
    title: item.title,
    description: item.description,
    category: item.category,
    priority: item.priority,
    stage_relevant: true,
  }));
}
```

---

**Related Skills:**
- `/gemini` - AI integration for startup features
- `/supabase` - Database operations
- `/edge-functions` - Serverless function patterns
- `/doc-coauthoring` - Document generation

**Related Prompts:**
- [06-investor-tools.md](../tasks/chat/06-investor-tools.md)
- [07-lean-canvas-tools.md](../tasks/chat/07-lean-canvas-tools.md)
- [10-proactive-suggestions.md](../tasks/chat/10-proactive-suggestions.md)
