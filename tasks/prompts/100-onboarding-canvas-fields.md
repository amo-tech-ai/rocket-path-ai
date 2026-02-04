# 100 - Onboarding Canvas Fields Enhancement

---

| Aspect | Details |
|--------|---------|
| **Screens** | Onboarding Step 1 (Context), Step 3 (Interview) |
| **Features** | New form fields, interview questions, canvas-ready data |
| **Agents** | onboarding-agent |
| **Edge Functions** | /onboarding-agent |
| **Use Cases** | Capture data to auto-generate Lean Canvas + Validation Report |
| **Real-World** | "Founder answers 6 key questions, system generates complete canvas" |

---

```yaml
---
task_id: 100-ONB
title: Onboarding Canvas Fields Enhancement
diagram_ref: startup-coach-design
phase: MVP
priority: P0
status: Not Started
skill: /feature-dev
ai_model: gemini-3-flash-preview
subagents: [frontend-designer, code-reviewer]
edge_function: onboarding-agent
schema_tables: [onboarding_sessions, startups]
depends_on: []
---
```

---

## Description

Enhance the onboarding wizard to capture the 6 essential questions needed to auto-generate a Lean Canvas and Validation Report. Split between Step 1 (form fields for quick capture) and Step 3 (interview questions for deeper insight).

## Rationale

**Problem:** Current onboarding captures general info but not structured canvas data.
**Solution:** Add explicit questions that map directly to Lean Canvas boxes.
**Impact:** System can auto-generate complete Lean Canvas + Validation Report after onboarding.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | answer clear questions about my startup | my canvas is generated automatically |
| Founder | explain how customers solve the problem today | my competitive position is clear |
| Founder | describe my channels | my go-to-market is captured |
| System | have structured canvas data | I can generate accurate reports |

## Real-World Example

> Jake completes onboarding. In Step 1, he fills in his problem and solution.
> In Step 3, the coach asks: "How do your target customers solve this problem today?"
> Jake explains they use spreadsheets and manual processes.
> After completion, the system generates his Lean Canvas with "Existing Alternatives:
> Spreadsheets, manual processes" already filled in.

---

## Goals

1. **Primary:** Capture 6 canvas-essential questions
2. **Secondary:** Data maps cleanly to 9 Lean Canvas boxes
3. **Quality:** No duplicate questions, smooth flow

## Acceptance Criteria

- [ ] Step 1 has explicit "Problem" field (separate from description)
- [ ] Step 1 has explicit "Solution" field (separate from description)
- [ ] Step 3 interview includes "How do they solve it today?"
- [ ] Step 3 interview includes "How will customers find you?"
- [ ] Step 3 interview includes "Why you, why now?"
- [ ] All new fields saved to onboarding_sessions
- [ ] Data available for canvas generation after completion
- [ ] Existing fields (target_market, business_model) unchanged

---

## Field Mapping

### Step 1 Form Fields (Quick Capture)

| Field | Type | Placeholder | Maps to Canvas |
|-------|------|-------------|----------------|
| `problem` | textarea | "What problem are you solving? Be specific about the pain." | Problem |
| `solution` | textarea | "What's your solution? How does it work?" | Solution |
| `target_market` | text | (existing) | Customer Segments |
| `business_model` | select | (existing) | Revenue Streams |

### Step 3 Interview Questions (Deeper Insight)

| Question | Field | Maps to Canvas | Maps to Dimension |
|----------|-------|----------------|-------------------|
| "How do your target customers solve this problem today? What tools, workarounds, or alternatives do they use?" | `existing_alternatives` | Existing Alternatives | Defensibility |
| "How will customers discover and reach your product? What channels will you use?" | `channels` | Channels | Viability |
| "Why are you the right person to build this, and why is now the right time?" | `why_now` | Unfair Advantage | Timing, Mission |

---

## Schema Updates

### Add to onboarding_sessions

```sql
ALTER TABLE onboarding_sessions
ADD COLUMN IF NOT EXISTS problem TEXT,
ADD COLUMN IF NOT EXISTS solution TEXT,
ADD COLUMN IF NOT EXISTS existing_alternatives TEXT,
ADD COLUMN IF NOT EXISTS channels TEXT,
ADD COLUMN IF NOT EXISTS why_now TEXT;
```

### Add to startups (on completion)

```sql
ALTER TABLE startups
ADD COLUMN IF NOT EXISTS problem TEXT,
ADD COLUMN IF NOT EXISTS solution TEXT,
ADD COLUMN IF NOT EXISTS existing_alternatives TEXT,
ADD COLUMN IF NOT EXISTS channels TEXT,
ADD COLUMN IF NOT EXISTS why_now TEXT;
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/20260204_onboarding_canvas_fields.sql` | Create |
| Types | `src/hooks/useWizardSession.ts` | Modify - add fields to WizardFormData |
| Step 1 UI | `src/components/onboarding/step1/Step1Context.tsx` | Modify - add Problem/Solution fields |
| Problem Input | `src/components/onboarding/step1/ProblemInput.tsx` | Create |
| Solution Input | `src/components/onboarding/step1/SolutionInput.tsx` | Create |
| Validation | `src/lib/step1Schema.ts` | Modify - add validation for new fields |
| Interview Config | `src/hooks/onboarding/useOnboardingQuestions.ts` | Modify - add 3 canvas questions |
| Edge Function | `supabase/functions/onboarding-agent/index.ts` | Modify - handle new fields |

---

## Step 1 UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Tell us about your startup                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Company Name                                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Acme Inc                                                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ What problem are you solving? *                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Small businesses waste 10+ hours/week on manual invoicing   │ │
│ │ and chasing payments...                                     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ What's your solution? *                                         │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ AI-powered invoicing that auto-generates, sends, and        │ │
│ │ follows up on invoices...                                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Who is your target market? *                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Freelancers and small agencies with 1-10 employees          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Business Model *                                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [x] SaaS Subscription  [ ] Marketplace  [ ] Transaction     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [Continue →]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 3 Interview Questions

### Question 1: Existing Alternatives

```typescript
{
  id: 'existing_alternatives',
  topic: 'Competition',
  question: "How do your target customers solve this problem today? What tools, workarounds, or alternatives do they use?",
  placeholder: "e.g., They use spreadsheets, hire contractors, or just ignore the problem...",
  followUp: "What's the biggest frustration with these alternatives?",
  mapsTo: 'existing_alternatives'
}
```

### Question 2: Channels

```typescript
{
  id: 'channels',
  topic: 'Go-to-Market',
  question: "How will customers discover and reach your product? What channels will you use to acquire them?",
  placeholder: "e.g., Content marketing, paid ads, partnerships, word of mouth...",
  followUp: "Which channel do you think will work best initially?",
  mapsTo: 'channels'
}
```

### Question 3: Why Now

```typescript
{
  id: 'why_now',
  topic: 'Timing & Team',
  question: "Why are you the right person to build this, and why is now the right time?",
  placeholder: "e.g., I spent 5 years in this industry and see a shift happening because of AI...",
  followUp: "What's your unfair advantage?",
  mapsTo: 'why_now'
}
```

---

## Canvas Generation Mapping

After onboarding, the system can generate a Lean Canvas:

| Canvas Box | Source Field |
|------------|--------------|
| Problem | `problem` |
| Solution | `solution` |
| Key Metrics | derived from `business_model` |
| Unique Value Proposition | derived from `problem` + `solution` |
| Unfair Advantage | `why_now` |
| Channels | `channels` |
| Customer Segments | `target_market` |
| Cost Structure | derived from `business_model` |
| Revenue Streams | `business_model` |
| Existing Alternatives | `existing_alternatives` |

---

## Validation Schema Update

```typescript
// src/lib/step1Schema.ts

export const step1Schema = z.object({
  company_name: z.string().min(2, 'Company name required'),
  problem: z.string().min(20, 'Please describe the problem in more detail'),
  solution: z.string().min(20, 'Please describe your solution in more detail'),
  target_market: z.string().min(10, 'Please describe your target market'),
  business_model: z.array(z.string()).min(1, 'Select at least one business model'),
  // ... existing fields
});
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| User skips problem field | Validation error, can't proceed |
| Problem and description overlap | Keep both, AI deduplicates |
| Interview question skipped | Mark as incomplete, allow later |
| Very long answers | Truncate display, store full text |

---

## Security Checklist

- [ ] New fields sanitized before storage
- [ ] RLS policies cover new columns
- [ ] No PII in canvas fields

---

## Testing Requirements

| Type | Coverage |
|------|----------|
| Unit | Validation schema, field mapping |
| Integration | Save/load new fields |
| E2E | Complete flow with new questions |

### Test Cases

- [ ] Problem field validates min length
- [ ] Solution field validates min length
- [ ] Interview questions appear in Step 3
- [ ] Answers saved to session
- [ ] Data transferred to startup on completion

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Test migration
supabase db push

# Manual testing
1. Start onboarding
2. Fill problem/solution in Step 1
3. Answer 3 new questions in Step 3
4. Complete wizard
5. Verify data in startups table
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Step 1 fields | `src/components/onboarding/step1/` |
| Interview questions | `src/hooks/onboarding/useOnboardingQuestions.ts` |
| Validation | `src/lib/step1Schema.ts` |
| Session types | `src/hooks/useWizardSession.ts` |

---

## Next Task

After this task, implement **101-coach-database.md** to create the validation tables, then the coach can use this enhanced onboarding data to generate:
1. Complete Lean Canvas
2. Validation Report with 7-dimension scores

---

## Design Document

See: `/tasks/plan/2026-02-04-startup-coach-design.md`
