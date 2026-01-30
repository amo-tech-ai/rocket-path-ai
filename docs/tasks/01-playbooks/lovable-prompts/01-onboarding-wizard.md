---
task_number: "01"
title: "Onboarding Wizard"
category: "Wizards"
subcategory: "Onboarding"
phase: 1
priority: "P0"
status: "Open"
percent_complete: 20
owner: "Frontend Developer"
---

# StartupAI Prompt: Onboarding Wizard (Full Specification)

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screens** | `/onboarding` → 4-step wizard with progress stepper |
| **Features** | Industry picker, problem sharpening, founder-fit assessment, one-liner generator |
| **Agents** | Industry Expert (Gemini 3 Pro), Problem Sharpener (Claude Sonnet), Founder Analyst (Gemini Flash), Pitch Writer (Claude Sonnet) |
| **Use Cases** | New user registration, profile enrichment, idea capture, pitch preparation |
| **Duration** | 5-10 minutes to complete |
| **Models** | Gemini 3 Pro (industry context), Gemini 3 Flash (classification), Claude Sonnet (writing, analysis) |
| **Tables** | `profiles`, `startups`, `ai_runs`, `playbook_runs`, `industry_playbooks` |
| **Edge Functions** | `onboarding-agent`, `industry-expert-agent`, `prompt-pack` |

---

## Real World Examples

### Example 1: Maria — FinTech Payments Founder
> Maria selects "FinTech — Payments" in Step 1. The wizard asks about regulatory compliance, transaction volumes, and payment rails—not generic "what's your problem?" questions. In Step 2, the AI suggests specific metrics like "CAC payback < 12 months" and validates her fraud reduction claims against industry benchmarks. Her one-liner: "Turn 90-day receivables into same-week payments for construction contractors."

### Example 2: James — Healthcare AI Founder
> James picks "Healthcare — Diagnostics." The wizard asks about FDA pathway, clinical validation, and reimbursement strategy. The Problem Sharpener agent uses healthcare terminology like "clinical endpoints" and "prior authorization." His one-liner mentions "improving diagnostic accuracy by 34%" instead of generic "AI-powered platform."

### Example 3: Sarah — B2B SaaS Founder
> Sarah selects "AI SaaS — Enterprise." Questions focus on ACV, net retention, and enterprise sales cycles. The Founder Analyst asks about her relevant domain experience—"Have you sold to enterprise IT before?"—because founder-market fit matters more than technical skills for enterprise B2B. The wizard pre-fills her Lean Canvas with enterprise-specific templates.

---

## Description

Build a 4-step onboarding wizard that transforms a founder's raw idea into a structured startup profile. The wizard adapts questions, terminology, and benchmarks based on the selected industry. Each step has an AI agent that enriches, validates, and structures the founder's input. Data captured flows into Lean Canvas, Pitch Deck, and Validator without re-entry.

---

## Rationale

**Why this approach?**
1. **Generic onboarding fails** — "What's your problem?" gets vague answers. Industry-specific questions get actionable data.
2. **Context is king** — Every AI response in the platform needs industry context. Capture it once, use it everywhere.
3. **Reduce time-to-value** — Founders who complete onboarding have 3x higher activation than those who skip.
4. **Data quality** — Structured capture enables AI to provide meaningful advice later.

**Why 4 steps?**
- Step 1 (Industry): Unlocks all downstream personalization
- Step 2 (Problem): Core of business model and pitch
- Step 3 (Founder Fit): Critical for investor evaluation
- Step 4 (One-Liner): Forces clarity, used everywhere

---

## User Stories

| ID | As a... | I want to... | So that... | Acceptance |
|----|---------|--------------|------------|------------|
| US1 | New founder | Select my industry from a categorized list | All AI advice uses my industry's terminology and benchmarks | Industry persists to profile, affects all prompts |
| US2 | FinTech founder | Answer questions about regulations and compliance | The platform understands my unique constraints | Step 2 shows industry-specific questions |
| US3 | First-time founder | Understand what makes a good problem statement | I don't pitch something investors ignore | AI provides examples and validation |
| US4 | Serial entrepreneur | Skip basic questions I already know | I can get to value faster | Smart skip logic based on answers |
| US5 | Founder with idea | Generate a one-liner investors remember | My pitch has a hook | AI generates 3 options, user picks |
| US6 | Returning user | Resume where I left off | I don't lose progress | State saved to DB per step |

---

## Purpose, Goals & Outcomes

### Purpose
Guide first-time founders from "I have an idea" to "I have a validated startup profile" in under 10 minutes.

### Goals
1. Capture industry selection that persists across all features
2. Ask 8 industry-specific questions (not generic startup questions)
3. Generate a founder-market fit score
4. Create a memorable one-liner for the startup
5. Pre-fill data for lean canvas and pitch deck

### Outcomes
| Metric | Target | Measurement |
|--------|--------|-------------|
| Profile completeness | 100% for finishers | All required fields filled |
| Time to complete | < 10 minutes | Average session duration |
| Activation rate | 3x vs. skippers | % who use Canvas/Pitch after |
| One-liner satisfaction | > 80% | % who keep generated liner |
| Industry terminology | 100% | AI uses correct terms after Step 1 |

---

## Key Points

1. **Industry-first design** — Everything adapts based on industry selection
2. **Progressive disclosure** — Each step unlocks based on previous answers
3. **AI enrichment at every step** — Not just data capture, but data improvement
4. **Cross-feature data flow** — Onboarding data populates Canvas, Pitch, CRM
5. **Save & resume** — Progress persists, can complete over multiple sessions
6. **Mobile-first** — Single column on mobile, no horizontal scrolling

---

## 3-Panel Layout Logic

```
┌─────────────────┬───────────────────────────────────────────────┬─────────────────┐
│   LEFT PANEL    │              MAIN PANEL                       │   RIGHT PANEL   │
│    (Context)    │               (Work)                          │  (Intelligence) │
├─────────────────┼───────────────────────────────────────────────┼─────────────────┤
│ Progress Bar    │ Step 1: Industry Picker                       │ Why This Matters│
│ Step 1/4        │ ┌─────────────────────────────────────────┐   │ "Industry sets  │
│ ● Industry      │ │  Select Your Industry                   │   │ terminology,    │
│ ○ Problem       │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │   │ benchmarks..."  │
│ ○ Founder       │ │  │FinTech│ │Health│ │EdTech│ │AI SaaS│  │   │                 │
│ ○ One-Liner     │ │  └──────┘ └──────┘ └──────┘ └──────┘   │   │ Industry Tips   │
│                 │ │                                         │   │ "FinTech needs  │
│ Industry Badge  │ │  Sub-category: [Payments ▼]            │   │ regulatory..."  │
│ [Not Selected]  │ │                                         │   │                 │
│                 │ │  [Continue →]                           │   │ Example Startups│
│ Time: ~3 min    │ └─────────────────────────────────────────┘   │ Stripe, Plaid.. │
└─────────────────┴───────────────────────────────────────────────┴─────────────────┘
```

### Left Panel (Context)
| Element | Purpose | Data Source |
|---------|---------|-------------|
| Progress Stepper | Current step visualization | Local state |
| Industry Badge | Selected industry (after Step 1) | `profiles.industry_id` |
| Completeness % | Profile fill percentage | Calculated |
| Time Estimate | Minutes remaining | Step count |
| Help Link | "Why these questions?" | Static content |

### Main Panel (Work)
| Step | Content | AI Behavior |
|------|---------|-------------|
| Step 1: Industry | Category picker (13 industries), sub-category dropdown | None (selection only) |
| Step 2: Problem & Customer | Problem textarea, customer segment cards, pain severity | AI enrichment button |
| Step 3: Founder Fit | Experience cards, skill checklist, "Why you?" textarea | AI assessment |
| Step 4: One-Liner | Generated preview, 3 alternatives, edit controls | Auto-generate on enter |

### Right Panel (Intelligence)
| Element | Trigger | Content |
|---------|---------|---------|
| Agent Avatar | Step change | Shows current agent (Industry Expert, Problem Sharpener, etc.) |
| Industry Insights | Step 2-4 | Real-time tips based on input ("FinTech founders typically...") |
| Benchmark Comparisons | Step 2 | "Your metrics vs. industry standard" |
| Validation Warnings | Real-time | Red flags detected in input |
| Terminology Suggestions | Real-time | "Consider using 'unit economics' instead of..." |
| Next Question Preview | Real-time | What AI will ask based on current answers |

---

## Screens & Features Breakdown

### Step 1: Industry Selection
| Feature | Description | Technical |
|---------|-------------|-----------|
| Category Grid | 13 industry categories with icons | Static array, no API |
| Sub-category Dropdown | Industry-specific sub-types | Loaded from `industry_playbooks` |
| Example Startups | 3-4 examples per industry | Stored in playbook |
| Smart Defaults | Common selections highlighted | Usage analytics |

### Step 2: Problem & Customer
| Feature | Description | Technical |
|---------|-------------|-----------|
| Problem Textarea | Freeform problem statement | Max 500 chars |
| AI Sharpen Button | Enriches problem statement | `onboarding-agent` action |
| Customer Segments | B2B/B2C/B2B2C selection | Radio cards |
| Pain Severity | How bad is the problem? (1-10) | Slider input |
| Industry Questions | 4 industry-specific questions | From `onboarding_questions` table |

### Step 3: Founder Fit
| Feature | Description | Technical |
|---------|-------------|-----------|
| Experience Cards | Relevant background selector | Multi-select |
| Skill Inventory | Technical, domain, sales, etc. | Checkbox grid |
| Why You Textarea | Founder-market fit narrative | Max 300 chars |
| AI Assessment | Fit score with reasoning | `onboarding-agent` action |

### Step 4: One-Liner
| Feature | Description | Technical |
|---------|-------------|-----------|
| Generated Preview | AI-created one-liner | `prompt-pack` action |
| Alternatives | 3 options to choose from | Same action, multiple outputs |
| Edit Controls | Inline editing of selected | Contains preview |
| Save & Continue | Completes onboarding | Redirects to dashboard |

---

## Dashboard, Chatbot & Wizard Mapping

### Wizard Flow
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Step 1     │────▶│   Step 2     │────▶│   Step 3     │────▶│   Step 4     │
│  Industry    │     │   Problem    │     │  Founder Fit │     │  One-Liner   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
       ▼                    ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Agent:     │     │   Agent:     │     │   Agent:     │     │   Agent:     │
│ Industry     │     │ Problem      │     │ Founder      │     │ Pitch        │
│ Expert       │     │ Sharpener    │     │ Analyst      │     │ Writer       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │                    │
       ▼                    ▼                    ▼                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Supabase Tables                                  │
│  profiles, startups, ai_runs, playbook_runs, industry_playbooks              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Agent-to-Edge Function Mapping
| Agent | Edge Function | Model | Trigger |
|-------|---------------|-------|---------|
| Industry Expert | `industry-expert-agent` | Gemini 3 Pro | Step 1 complete |
| Problem Sharpener | `onboarding-agent` | Claude Sonnet | Step 2 "Sharpen" click |
| Founder Analyst | `onboarding-agent` | Gemini 3 Flash | Step 3 complete |
| Pitch Writer | `prompt-pack` | Claude Sonnet | Step 4 enter |

### Chatbot Integration
- Chat can invoke onboarding via: "Help me sharpen my problem statement"
- Chat context includes onboarding data after completion
- Chat can modify onboarding data: "Update my industry to Healthcare"

---

## Frontend/Backend Wiring Plan

### Frontend Architecture

```typescript
// Component Hierarchy
OnboardingPage
├── OnboardingWizard (state management)
│   ├── ProgressStepper (left panel)
│   ├── StepContent (main panel)
│   │   ├── IndustryPicker (Step 1)
│   │   ├── ProblemWizard (Step 2)
│   │   ├── FounderFitCard (Step 3)
│   │   └── OneLinerGenerator (Step 4)
│   └── AIAssistantPanel (right panel)
└── OnboardingComplete (redirect)
```

### State Management
```typescript
interface OnboardingState {
  currentStep: 1 | 2 | 3 | 4;
  industry: { category: string; subcategory: string } | null;
  problem: { statement: string; customer: string; severity: number };
  founderFit: { experience: string[]; skills: string[]; whyYou: string };
  oneLiner: { selected: string; alternatives: string[] };
  aiLoading: boolean;
  aiSuggestions: any[];
}
```

### API Calls Flow
```
1. Step 1 Complete
   └→ POST /functions/v1/industry-expert-agent
      └→ Returns: questions, terminology, benchmarks
      └→ Store in: local state + profiles.industry_id

2. Step 2 "Sharpen" Click
   └→ POST /functions/v1/onboarding-agent
      Body: { action: 'enrich_problem', step: 2, data: {...} }
      └→ Returns: sharpened_problem, follow_up_questions
      └→ Display in: main panel + suggestions

3. Step 3 Complete
   └→ POST /functions/v1/onboarding-agent
      Body: { action: 'assess_founder_fit', step: 3, data: {...} }
      └→ Returns: fit_score, strengths, gaps, positioning
      └→ Store in: startups.founder_fit_score

4. Step 4 Enter
   └→ POST /functions/v1/prompt-pack
      Body: { action: 'run', pack_slug: 'one-liner-generator', inputs: {...} }
      └→ Returns: { options: [{ one_liner, rationale }] }
      └→ Display in: main panel for selection
```

---

## Supabase Schema

### Tables Used

```sql
-- profiles (updated on Step 1, Step 4)
profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  industry_id TEXT,           -- Set in Step 1
  funding_stage TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,  -- Set in Step 4
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- startups (updated on Steps 2-4)
startups (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT,
  one_liner TEXT,                    -- Set in Step 4
  problem_statement TEXT,            -- Set in Step 2
  problem_sharpened TEXT,            -- Set in Step 2 (AI enriched)
  target_customer TEXT,              -- Set in Step 2
  customer_segment TEXT,             -- B2B, B2C, B2B2C
  pain_severity INTEGER,             -- 1-10
  founder_fit_score INTEGER,         -- Set in Step 3
  founder_fit_details JSONB,         -- { strengths, gaps, positioning }
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- ai_runs (logged on every AI call)
ai_runs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  action TEXT,                       -- 'enrich_problem', 'assess_fit', etc.
  model TEXT,                        -- 'gemini-3-pro', 'claude-sonnet'
  input_text TEXT,
  output_text TEXT,
  industry_context_used BOOLEAN,
  context_tokens INTEGER,
  feature_context TEXT,              -- 'onboarding'
  created_at TIMESTAMPTZ
)

-- playbook_runs (tracks wizard progress)
playbook_runs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  playbook_type TEXT,                -- 'onboarding'
  current_step INTEGER,
  status TEXT,                       -- 'in_progress', 'completed'
  step_data JSONB,                   -- { step1: {...}, step2: {...} }
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)

-- industry_playbooks (read for context)
industry_playbooks (
  id TEXT PRIMARY KEY,               -- 'fintech', 'healthcare', etc.
  display_name TEXT,
  narrative_arc TEXT,
  terminology JSONB,                 -- { use_these: [], avoid_these: [] }
  benchmarks JSONB,                  -- Metrics by stage
  investor_expectations JSONB,
  failure_patterns JSONB,
  success_stories JSONB,
  gtm_patterns JSONB,
  decision_frameworks JSONB,
  investor_questions JSONB,
  warning_signs JSONB,
  stage_checklists JSONB,
  slide_emphasis JSONB
)

-- onboarding_questions (read for Step 2)
onboarding_questions (
  id UUID PRIMARY KEY,
  text TEXT,
  type TEXT,
  topic TEXT,
  why_matters TEXT,
  options JSONB,
  is_active BOOLEAN,
  display_order INTEGER
)
```

### RLS Policies
```sql
-- Users can only see/update their own data
CREATE POLICY "Users own their profiles" ON profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their startups" ON startups
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their ai_runs" ON ai_runs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their playbook_runs" ON playbook_runs
  FOR ALL USING (auth.uid() = user_id);

-- Industry playbooks are readable by all authenticated users
CREATE POLICY "Playbooks are public" ON industry_playbooks
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## Edge Functions

### 1. `onboarding-agent`
**Purpose:** Handles all onboarding AI operations

```typescript
// supabase/functions/onboarding-agent/index.ts

interface OnboardingRequest {
  action: 'enrich_problem' | 'assess_founder_fit' | 'validate_answers';
  step: 1 | 2 | 3 | 4;
  industry_id: string;
  data: Record<string, any>;
}

interface OnboardingResponse {
  success: boolean;
  result: {
    sharpened_problem?: string;
    follow_up_questions?: string[];
    fit_score?: number;
    strengths?: string[];
    gaps?: string[];
    positioning?: string;
    warnings?: string[];
  };
  tokens_used: number;
}

// Action handlers
switch (action) {
  case 'enrich_problem':
    // Model: Claude Sonnet (quality writing)
    // Knowledge: terminology, benchmarks from playbook
    // Output: Sharpened problem statement
    break;
    
  case 'assess_founder_fit':
    // Model: Gemini 3 Flash (fast analysis)
    // Knowledge: investor_expectations from playbook
    // Output: Fit score, strengths, gaps
    break;
    
  case 'validate_answers':
    // Model: Gemini 3 Flash (pattern matching)
    // Knowledge: failure_patterns, warning_signs
    // Output: Warnings, suggestions
    break;
}
```

### 2. `industry-expert-agent`
**Purpose:** Returns industry-specific context for onboarding

```typescript
// supabase/functions/industry-expert-agent/index.ts

interface IndustryContextRequest {
  industry_id: string;
  context_type: 'onboarding' | 'canvas' | 'pitch' | 'full';
}

interface IndustryContextResponse {
  industry: {
    id: string;
    display_name: string;
    narrative_arc: string;
  };
  onboarding_questions: Array<{
    id: string;
    question: string;
    type: 'text' | 'select' | 'multiselect';
    options?: string[];
  }>;
  terminology: {
    use_these: string[];
    avoid_these: string[];
    investor_vocabulary: string[];
  };
  benchmarks: Array<{
    metric: string;
    good: string;
    great: string;
    stage: string;
  }>;
}
```

### 3. `prompt-pack` (for one-liner generation)
**Purpose:** Runs the one-liner generator prompt pack

```typescript
// Uses existing prompt-pack with pack_slug: 'one-liner-generator'
// Model: Claude Sonnet
// Input: All onboarding data (problem, customer, fit)
// Output: 3 one-liner options with rationale
```

---

## Gemini 3 Features, Tools & Agents

### Gemini 3 Pro — Industry Expert Agent
| Feature | Usage |
|---------|-------|
| **Large Context Window** | Load full industry playbook (10K+ tokens) |
| **Structured Output** | Return JSON with questions, terminology, benchmarks |
| **Grounding** | Connect to industry databases for fresh data |
| **Fast Response** | Industry context in < 2 seconds |

### Gemini 3 Flash — Founder Analyst
| Feature | Usage |
|---------|-------|
| **Speed** | Fit assessment in < 1 second |
| **Classification** | Categorize experience types |
| **Pattern Matching** | Compare to investor expectations |
| **Cost Efficiency** | High-volume validation calls |

### Gemini 3 Tools Used
```typescript
// Function calling for structured extraction
const tools = [
  {
    name: "extract_industry_questions",
    description: "Get industry-specific onboarding questions",
    parameters: { industry_id: "string" }
  },
  {
    name: "assess_founder_fit",
    description: "Evaluate founder-market fit",
    parameters: { experience: "array", skills: "array", why_you: "string" }
  }
];
```

---

## Claude SDK Agents, Tools & Features

### Claude Sonnet — Problem Sharpener
| Feature | Usage |
|---------|-------|
| **Deep Reasoning** | Understand vague problem statements |
| **Writing Quality** | Produce investor-ready language |
| **XML Tags** | Structured output parsing |
| **Chain of Thought** | Explain enrichment reasoning |

### Claude Sonnet — Pitch Writer
| Feature | Usage |
|---------|-------|
| **Creative Writing** | Generate memorable one-liners |
| **Variation Generation** | 3 distinct options per request |
| **Tone Control** | Match industry vocabulary |
| **Conciseness** | Enforce < 15 word limit |

### Claude Prompt Structure
```xml
<role>
You are a startup pitch expert who has written one-liners for 300+ funded startups.
</role>

<context>
<industry>{{playbook.display_name}}</industry>
<terminology>{{playbook.terminology}}</terminology>
<problem>{{user.problem_statement}}</problem>
<customer>{{user.target_customer}}</customer>
</context>

<task>
Generate 3 one-liner options for this startup. Each should be:
- Under 15 words
- Memorable and specific
- Using industry-appropriate terminology
</task>

<output_format>
Return JSON: { options: [{ one_liner: string, rationale: string }] }
</output_format>
```

---

## AI Agents, Automations & Workflows

### Agent Autonomy Levels

| Agent | Level | Behavior |
|-------|-------|----------|
| Industry Expert | Background | Runs automatically on selection, no user action |
| Problem Sharpener | Act with Approval | Generates suggestion, user accepts/edits |
| Founder Analyst | Suggest | Shows assessment, user confirms |
| Pitch Writer | Act with Approval | Generates 3 options, user picks |

### Automation Triggers

| Trigger | Automation | Result |
|---------|-----------|--------|
| Step 1 complete | Load industry context | Questions adapt |
| Step 2 "Sharpen" | Enrich problem | Better statement |
| Step 3 complete | Calculate fit score | Score displayed |
| Step 4 enter | Generate one-liners | 3 options shown |
| Step 4 complete | Pre-fill canvas | Canvas started |

### Workflow: Complete Onboarding
```
1. User selects industry
   └→ Automation: Load industry playbook
   └→ Automation: Prepare Step 2 questions
   
2. User enters problem statement
   └→ [Optional] User clicks "Sharpen"
   └→ Automation: AI enriches problem
   └→ Automation: Validate against failure patterns
   
3. User completes founder fit
   └→ Automation: Calculate fit score
   └→ Automation: Identify gaps
   
4. User generates one-liner
   └→ Automation: AI creates 3 options
   └→ User selects/edits
   └→ Automation: Mark onboarding complete
   └→ Automation: Pre-fill Canvas Problem box
   └→ Automation: Pre-fill Pitch Deck intro
   └→ Redirect: Dashboard
```

---

## Dependencies

| Dependency | Type | Status | Notes |
|------------|------|--------|-------|
| `industry_playbooks` table | Database | ✅ Ready | 19 industries with 10 knowledge categories |
| `profiles` table | Database | ✅ Ready | RLS policies in place |
| `startups` table | Database | ✅ Ready | RLS policies in place |
| `ai_runs` table | Database | ✅ Ready | Logging enabled |
| `playbook_runs` table | Database | 🟢 Ready | Progress tracking |
| `onboarding-agent` edge function | Function | ✅ Ready | Deployed |
| `industry-expert-agent` edge function | Function | ✅ Ready | Deployed |
| `prompt-pack` edge function | Function | ✅ Ready | Deployed |
| Gemini 3 Pro API | External | ✅ Ready | Key configured |
| Gemini 3 Flash API | External | ✅ Ready | Key configured |
| Claude Sonnet API | External | ✅ Ready | Key configured |
| React Hook Form | Frontend | ✅ Ready | Form management |
| Zod | Frontend | ✅ Ready | Validation |
| Framer Motion | Frontend | ✅ Ready | Step transitions |

---

## Acceptance Criteria

### Functional
- [ ] Industry selection persists and affects all subsequent questions
- [ ] Each step shows industry-specific questions (not generic)
- [ ] AI enrichment uses industry terminology and benchmarks
- [ ] Progress saves between sessions (can resume later)
- [ ] One-liner generates in < 3 seconds
- [ ] All outputs save to profile and startup tables
- [ ] Data flows to Canvas without re-entry

### Technical
- [ ] Edge functions respond in < 5 seconds
- [ ] AI runs logged with token counts
- [ ] Error states show helpful recovery actions
- [ ] Optimistic UI updates immediately
- [ ] RLS policies enforced on all tables

### UX
- [ ] Mobile responsive (single column on mobile)
- [ ] Keyboard navigation works throughout
- [ ] Screen reader labels on all elements
- [ ] Progress stepper shows clear current state
- [ ] Loading states during AI calls

---

## Testing Checklist

| Test | Type | Expected Result |
|------|------|-----------------|
| Select FinTech industry | E2E | Industry-specific questions appear |
| Complete all 4 steps | E2E | Redirects to dashboard, profile marked complete |
| Close mid-wizard, reopen | E2E | Resumes at last step |
| Click "Sharpen" on problem | Integration | AI returns enriched problem in < 3s |
| Generate one-liner | Integration | 3 options returned with rationale |
| Check Canvas after complete | E2E | Problem box pre-filled |
| Mobile view | Visual | Single column, no scroll issues |
| Keyboard-only navigation | A11y | Can complete wizard without mouse |
