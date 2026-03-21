# Task Template

> **Purpose:** Generate implementation prompts from diagrams
> **Rule:** PRD → Diagrams → Tasks → Prompts
> **Updated:** 2026-02-08 | **Version:** 2.0
> **New in v2:** Production Ready Checklist, Regression Checklist, Over-Engineering Guard

---

## File Naming

**Format:** `XXX-name.md` (sequential, no gaps)

| Range | Phase | Question |
|-------|-------|----------|
| 001-004 | P1 CORE | Can it work? (enhance existing) |
| 005-020 | P2 MVP | Does it solve the problem? (new screens + infra) |
| 021-026 | P3 ADVANCED | Does it help users do better? |
| 027-030 | Special | i18n, docs, niche, strategy |

## Over-Engineering Guard

> Before adding any item to a task, ask: **"Does the user need this on day 1?"**

| Rule | Example |
|------|---------|
| One task = one shippable unit | Don't combine 3 knowledge systems in one task |
| Max 10 acceptance criteria | If > 10, split the task |
| No speculative features | Don't add "ROI Mirage detection" unless users asked |
| Defer polish to v1.1 | Animations, transitions, advanced scoring can wait |
| Scope test: Can you ship in 3-5 days? | If no, task is too big — split it |

---

## Task Structure

### 1. Summary Table

```markdown
| Aspect | Details |
|--------|---------|
| **Screens** | Dashboard, Wizard Step 2, Chat Panel |
| **Features** | Auto-extraction, Real-time sync, AI suggestions |
| **Agents** | onboarding-agent, lean-canvas-agent |
| **Edge Functions** | /onboarding-agent, /ai-chat |
| **Use Cases** | First-time setup, Data validation |
| **Real-World** | "Founder pastes LinkedIn → profile auto-fills" |
```

### 2. Frontmatter

```yaml
---
task_id: 001-ONB
title: Task Title
diagram_ref: D-XX
phase: CORE | MVP | ADVANCED | PRODUCTION
priority: P0 | P1 | P2 | P3
status: Not Started | In Progress | Completed
skill: /feature-dev | /frontend-design | /supabase | /edge-functions | /gemini | /sdk-agent
ai_model: gemini-3-flash-preview | gemini-3-pro-preview | claude-sonnet-4-5
subagents: [code-reviewer, test-runner, supabase-expert, debugger]
edge_function: function-name
schema_tables: [table1, table2]
depends_on: [XXX-task]
---
```

### 3. Description & Rationale

```markdown
## Description
> What does this feature do? One clear paragraph.

## Rationale
**Problem:** What pain point does this solve?
**Solution:** How does this feature address it?
**Impact:** What changes for the user?
```

### 4. User Stories & Examples

```markdown
## User Stories
| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | paste my LinkedIn URL | my profile auto-fills |

## Real-World Example
> Sarah pastes her LinkedIn URL. The system extracts her name, company, role
> in 2 seconds. She reviews and clicks "Continue."
```

### 5. Goals & Acceptance Criteria

```markdown
## Goals
1. **Primary:** User can [core action]
2. **Secondary:** System [supports action]
3. **Quality:** < X seconds response time

## Acceptance Criteria
- [ ] User can [action]
- [ ] System [response]
- [ ] Data [validated/persisted]
- [ ] Error states handled
- [ ] Mobile responsive
```

---

## AI Prompt Instructions

### Context Block
```markdown
You are implementing {{FEATURE_NAME}} for StartupAI.
- Stack: React 18 + TypeScript + Vite + Supabase + shadcn/ui
- Use existing patterns from the codebase
- Follow the wiring plan exactly
```

### Constraints
- Use `@/components/ui/` for UI components
- Keep components under 200 lines
- Use custom hooks for data fetching
- Handle loading, error, empty states
- No `any` types, no inline styles

### Expected Output
1. Approach explanation (2-3 sentences)
2. Code for each file in wiring plan
3. Migrations or config changes needed

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| `any` type | Proper TypeScript types |
| Inline styles | Tailwind classes |
| Direct Supabase in components | Custom hooks |
| Console.log | Proper error handling |
| Hardcoded strings | Constants |
| Nested ternaries | Early returns |

---

## Code Patterns

### Hook Pattern
```typescript
export function useFeature(id: string) {
  const [data, setData] = useState<Type | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  return { data, loading, error, refetch };
}
```

### Component Pattern
```typescript
export function Feature({ id }: Props) {
  const { data, loading, error } = useFeature(id);
  if (loading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;
  return (/* ... */);
}
```

---

## Wiring Plan

### API Flow
```
User action → Component → Hook → Supabase → Edge Function → AI → Response → UI
```

### Files Template
| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/X.tsx` | Create/Modify |
| Hook | `src/hooks/useX.ts` | Create/Modify |
| Type | `src/types/x.ts` | Create/Modify |
| Edge Function | `supabase/functions/x/index.ts` | Create/Modify |
| Migration | `supabase/migrations/xxx_x.sql` | Create |

---

## Schema Template

```markdown
### Table: [table_name]
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → auth.users, NOT NULL |
| project_id | uuid | FK → projects |
| created_at | timestamptz | default now() |

### RLS Policies
| Policy | Operation | Rule |
|--------|-----------|------|
| select_own | SELECT | user_id = auth.uid() |
| insert_own | INSERT | user_id = auth.uid() |
```

---

## Edge Function Template

```markdown
### Endpoint
- **Route:** `/functions/v1/[function-name]`
- **Method:** POST
- **Auth:** JWT required

### Actions
| Action | Description | AI Model |
|--------|-------------|----------|
| extract | Extract data | gemini-3-flash-preview |
| analyze | Deep analysis | gemini-3-pro-preview |
| generate | Generate content | claude-sonnet-4-5 |
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Empty data | Show empty state message |
| Network error | Show retry option |
| Invalid input | Show validation error |
| Slow response | Show loading skeleton |
| Session expired | Redirect to login |

---

## Security Checklist

- [ ] RLS policies enforce user isolation
- [ ] Input validated before DB insert
- [ ] JWT verified in edge function
- [ ] No secrets in client code
- [ ] XSS prevention (sanitize input)

---

## Production Ready Checklist

> Every task MUST pass all items before merging.

### Build Verification
- [ ] `npm run build` passes (no new errors)
- [ ] `npm run test` passes (no regressions, all 96+ tests green)
- [ ] `npm run lint` — no new errors introduced
- [ ] No `console.log` left in production code

### Feature Verification
- [ ] New component renders without console errors
- [ ] Loading, error, empty states all handled
- [ ] Works on desktop (1280px+) and mobile (375px)
- [ ] Data persists after page refresh

### Security (if new tables/edge functions)
- [ ] RLS policies enforce user isolation
- [ ] Edge function verifies JWT
- [ ] No secrets in client code (`import.meta.env.VITE_*` only)
- [ ] Input validated before DB write

### Deployment
- [ ] Edge function deployed and responds 200
- [ ] Migration applied without errors
- [ ] TypeScript types regenerated (`generate_typescript_types`)

---

## Regression Checklist

> Verify existing features still work after this task. Run these manually.

- [ ] **Validator**: Chat → follow-up → Progress → Report renders all 14 sections
- [ ] **Lean Canvas**: Auto-populate from report, coach chat works
- [ ] **Dashboard**: Loads without errors, health score displays
- [ ] **Auth**: Google OAuth login/logout cycle works
- [ ] **Onboarding**: Wizard completes all 4 steps
- [ ] **Profile**: Company profile loads and saves

---

## Testing Requirements

| Type | Coverage | When |
|------|----------|------|
| Unit | Hook logic, utilities | Every task |
| Integration | API calls, data flow | Tasks with edge functions |
| E2E | Critical user paths | Tasks touching validator or auth |
| Manual | Feature walkthrough | Every task |

### Test Cases (minimum)
- [ ] Happy path works end-to-end
- [ ] Empty state handled (no data)
- [ ] Error state handled (network failure)
- [ ] Loading state shown (skeleton/spinner)

---

## Verification

```bash
npm run build       # Builds successfully
npm run test        # Tests pass (96+ green)
npm run lint        # Check for new errors
```

### Manual Testing
- [ ] Feature works as described in acceptance criteria
- [ ] Works on mobile viewport (375px)
- [ ] Data persists after refresh

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Form handling | `src/components/onboarding/` |
| Data fetching | `src/hooks/useProjects.ts` |
| AI integration | `supabase/functions/lean-canvas-agent/` |
| RLS patterns | `supabase/migrations/` |

### Import Map
```typescript
import { Button, Input, Card } from "@/components/ui/*";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
```

---

## AI Models

| Model | Use Case | Speed |
|-------|----------|-------|
| `gemini-3-flash-preview` | Fast extraction | ⚡ |
| `gemini-3-pro-preview` | Deep analysis | Medium |
| `claude-haiku-4-5` | Quick tasks | ⚡ |
| `claude-sonnet-4-5` | Balanced | Medium |
| `claude-opus-4-5` | Complex reasoning | Slow |
| `gemini-3-pro-image-preview` | Image/vision | Medium |

---

## 3-Panel Layout

```
┌─────────────┬────────────────────┬─────────────┐
│ LEFT        │ MAIN               │ RIGHT       │
│ (Context)   │ (Work Area)        │ (AI)        │
├─────────────┼────────────────────┼─────────────┤
│ Navigation  │ Dashboard/Forms    │ Chat        │
│ Projects    │ Tables/Canvas      │ Suggestions │
│ Filters     │ Wizards            │ Insights    │
└─────────────┴────────────────────┴─────────────┘
```

---

## Screen → Agent Mapping

| Screen | Agent | Edge Function | Schema |
|--------|-------|---------------|--------|
| Dashboard | - | - | projects, activities |
| Onboarding | onboarding-agent | /onboarding-agent | startups |
| Chat | ai-chat | /ai-chat | messages |
| Lean Canvas | lean-canvas-agent | /lean-canvas-agent | lean_canvases |
| CRM | crm-agent | /crm-agent | contacts, deals |
| Pitch Deck | pitch-deck-agent | /pitch-deck-agent | pitch_decks |

---

## Quick Reference

### Task Prefixes
| Prefix | Category |
|--------|----------|
| ONB | Onboarding |
| CNV | Lean Canvas |
| VAL | Validation |
| AGT | AI Agents |
| CHT | Chat |
| CRM | CRM/Investors |
| PTH | Pitch Deck |
| DSH | Dashboard |

### Skills
| Skill | Use For |
|-------|---------|
| `/feature-dev` | Multi-file features |
| `/frontend-design` | UI components |
| `/supabase` | Database, RLS |
| `/edge-functions` | API endpoints |
| `/gemini` | Gemini AI |
| `/sdk-agent` | Claude SDK |

---

## Example Task

**File:** `001-extraction.md`

```yaml
---
task_id: 001-ONB
title: LinkedIn Auto-Extraction
diagram_ref: D-05
phase: CORE
priority: P0
status: Not Started
skill: /feature-dev
ai_model: gemini-3-flash-preview
subagents: [code-reviewer]
edge_function: onboarding-agent
schema_tables: [startups]
depends_on: []
---
```

```markdown
| Aspect | Details |
|--------|---------|
| **Screens** | Onboarding Wizard Step 1 |
| **Features** | URL paste, auto-extract, preview |
| **Agents** | onboarding-agent |
| **Real-World** | "Paste LinkedIn → profile fills in 2s" |

## Description
Founders paste LinkedIn URL, system extracts profile data using Gemini 3 Flash.

## Rationale
**Problem:** Manual data entry is slow.
**Solution:** AI extracts structured data from URLs.
**Impact:** Setup drops from 5 min to 30 sec.

## User Stories
| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | paste LinkedIn URL | profile auto-fills |

## Goals
1. **Primary:** Extract profile data from URL
2. **Quality:** < 3 second extraction

## Acceptance Criteria
- [ ] User can paste LinkedIn URL
- [ ] System extracts name, company, role, bio
- [ ] User can edit extracted data
- [ ] Data saves on continue

## Wiring Plan
| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/onboarding/LinkedInExtract.tsx` | Create |
| Hook | `src/hooks/useOnboarding.ts` | Modify |
| Edge Function | `supabase/functions/onboarding-agent/index.ts` | Modify |
```

---

## Workflow

```
1. Read diagram behavior
2. Create XXX-name.md file
3. Fill summary table
4. Write description + rationale
5. Add user stories + example
6. Define acceptance criteria
7. Create wiring plan
8. Implement
9. Run verification checks
10. Mark complete
```