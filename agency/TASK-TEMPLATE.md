# Task Template

> **Purpose:** Generate implementation prompts from diagrams
> **Rule:** PRD → Diagrams → Tasks → Prompts
> **Updated:** 2026-02-27 | **Version:** 4.0
> v4: Added 5-part structured Description (situation/why/exists/build/example), Real-World Examples, Outcomes sections. Renumbered to 11 sections.
> v3: Trimmed to ~200 lines. Removed CLAUDE.md duplicates. Added Claude 4.6 prompting best practices.

---

## File Naming

**Format:** `XXX-name.md` (sequential, no gaps)

| Range | Phase | Question |
|-------|-------|----------|
| 001-004 | P1 CORE | Can it work? (enhance existing) |
| 005-020 | P2 MVP | Does it solve the problem? (new screens + infra) |
| 021-026 | P3 ADVANCED | Does it help users do better? |
| 027-030 | Special | i18n, docs, niche, strategy |

---

## Scope Guard

Before adding any item, ask: **"Does the user need this on day 1?"**

- One task = one shippable unit (3-5 days max)
- Max 10 acceptance criteria — if more, split the task
- No speculative features — only what users asked for
- Defer polish to v1.1 (animations, transitions, advanced scoring)

---

## Task Structure

Every task file follows this order. Sections marked (optional) can be omitted for simple tasks.

### 1. Frontmatter

```yaml
---
task_id: 001-ONB
title: Task Title
phase: CORE | MVP | ADVANCED
priority: P0 | P1 | P2 | P3
status: Not Started | In Progress | Completed
estimated_effort: 1 day | 3 days | 1 week
skill: [category/skill-name, ...]  # From .agents/skills/ — see Skill Reference below
subagents: [code-reviewer, supabase-expert]
edge_function: function-name
schema_tables: [table1, table2]
depends_on: [XXX-task]
---
```

### 2. Summary Table

```markdown
| Aspect | Details |
|--------|---------|
| **Screens** | Dashboard, Wizard Step 2 |
| **Features** | Auto-extraction, AI suggestions |
| **Edge Functions** | /onboarding-agent |
| **Real-World** | "Founder pastes LinkedIn → profile auto-fills" |
```

### 3. Description (5-part structured format)

```markdown
## Description

**The situation:** What's the current state? What exists, what's broken, what's missing?
Describe the concrete reality a founder or developer faces today.

**Why it matters:** Why is this a problem worth solving? What's the cost of inaction?
Connect to real user pain, business risk, or developer friction.

**What already exists:** What code, patterns, or infrastructure can we build on?
Name specific files, functions, hooks, or tables that are relevant.

**The build:** What exactly will be created or changed?
Describe the implementation at a high level — components, migrations, edge function changes.

**Example:** One concrete scenario showing the feature in action.
Use a real founder name and startup type. Show before/after behavior.
```

### 4. Rationale

```markdown
## Rationale
**Problem:** What pain point does this solve?
**Solution:** How does this feature address it?
**Impact:** What changes for the user?
```

### 5. User Stories

```markdown
| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | paste my LinkedIn URL | my profile auto-fills |
```

### 6. Goals & Acceptance Criteria

```markdown
## Goals
1. **Primary:** User can [core action]
2. **Quality:** < X seconds response time

## Acceptance Criteria
- [ ] User can [action]
- [ ] Data [validated/persisted]
- [ ] Error states handled
- [ ] Loading + empty states shown
```

### 7. Wiring Plan

```markdown
| Layer | File | Action |
|-------|------|--------|
| Component | `src/components/X.tsx` | Create |
| Hook | `src/hooks/useX.ts` | Create |
| Edge Function | `supabase/functions/x/index.ts` | Modify |
| Migration | `supabase/migrations/xxx_x.sql` | Create |
```

### 8. Schema (optional — if new tables)

```markdown
### Table: [table_name]
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → auth.users, NOT NULL |

### RLS Policies
| Policy | Operation | Rule |
|--------|-----------|------|
| select_own | SELECT | user_id = auth.uid() |
```

### 9. Edge Cases (optional)

```markdown
| Scenario | Expected Behavior |
|----------|-------------------|
| Empty data | Show empty state |
| Network error | Show retry option |
| Session expired | Redirect to login |
```

### 10. Real-World Examples

```markdown
## Real-World Examples

**Scenario 1 — [Short title]:** [Concrete scenario with a named founder/user].
[What happens today without this feature]. **With this fix/feature,**
[what happens after]. [Why it matters in context].

**Scenario 2 — [Short title]:** [Different angle — edge case, team use,
or failure mode]. [Before]. **With this fix/feature,** [after].
```

Write 2-3 scenarios per task. Use real startup types (fintech, edtech, SaaS).
Name the founder. Show before/after behavior. Cover both happy path and failure modes.

### 11. Outcomes

```markdown
## Outcomes

| Before | After |
|--------|-------|
| [Current painful state] | [Improved state after implementation] |
| [Another problem] | [How it's resolved] |
```

3-5 rows. Each row is a concrete before/after pair. Avoid vague statements —
"performance improves" is bad, "fails fast at 15s instead of hanging for 400s" is good.

---

## Checklists

### Production Ready

- [ ] `npm run build` passes
- [ ] `npm run test` passes (no regressions)
- [ ] No `console.log` in production code
- [ ] Loading, error, empty states handled
- [ ] RLS policies enforce user isolation (if new tables)
- [ ] Edge function verifies JWT (if new function)
- [ ] No secrets in client code

### Regression (manual spot-check)

- [ ] Validator: Chat → Progress → Report renders
- [ ] Lean Canvas: Auto-populate + coach chat works
- [ ] Dashboard: Loads, health score displays
- [ ] Auth: OAuth login/logout cycle works

---

## Skill Reference

Use exact paths from `.agents/skills/`. Each prompt must list 1-3 skills the implementer should invoke.

| Category | Skill | Use When |
|----------|-------|----------|
| `ai/gemini` | Gemini integration | Edge functions calling Gemini API |
| `ai/prompt-packs` | Prompt engineering | Prompt templates, system prompts |
| `data/database-migration` | Schema changes | New tables, FK fixes, triggers, RLS |
| `data/supabase-edge-functions` | Edge fn patterns | Timeout, rate limiting, CORS, JWT |
| `data/supabase-postgres-best-practices` | Query optimization | Indexes, RLS performance, schema design |
| `design/frontend-design` | UI components | React pages, shadcn, Tailwind |
| `devops/edge-function-creator` | New edge functions | Creating/deploying new functions |
| `devops/security-hardening` | Security audit | RLS audit, error leakage, CSP |
| `infographic/chart-visualization` | Data viz | Charts, diagrams, visual components |
| `lean/lean-canvas` | Lean Canvas domain | Business model canvas features |
| `product/api-wiring` | Backend → Frontend | Connecting edge functions to hooks/UI |
| `product/feature-dev` | Multi-file features | Features spanning types, hooks, components |
| `startup/validation-scoring` | Scoring logic | Validator scoring, dimensions, verdicts |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| `any` type | Proper TypeScript types |
| Inline styles | Tailwind classes |
| Direct Supabase in components | Custom hooks |
| Console.log in production | Proper error handling |
| Hardcoded strings | Constants or env vars |
| Nested ternaries | Early returns |
| Components > 200 lines | Split into smaller components |
| Add features not requested | Solve only the stated problem |

---

## Prompting Best Practices (Claude 4.6)

These guidelines apply when writing task prompts and when Claude executes them.

### Be Explicit, Not Aggressive

Claude 4.6 follows instructions precisely. Use clear, normal language instead of
shouting directives. Over-prompting causes overtriggering.

| Avoid | Prefer |
|-------|--------|
| "You MUST ALWAYS use X" | "Use X for this task" |
| "CRITICAL: NEVER do Y" | "Avoid Y because [reason]" |
| "If in doubt, use tool Z" | "Use tool Z when it would help understand the problem" |

### Provide Context, Not Just Commands

Explain *why* a constraint exists so Claude can generalize correctly.

- Instead of: "Never use inline styles"
- Write: "Use Tailwind classes instead of inline styles — the codebase uses Tailwind for consistency and purging"

### Scope the Work Clearly

- State what to implement *and* what to skip
- Name exact files to create or modify in the wiring plan
- Set explicit quality targets (response time, line count limits)

### Minimize Repetition with CLAUDE.md

These are already in CLAUDE.md — don't repeat in task prompts:
- Tech stack details (React, Vite, Supabase, shadcn/ui)
- Import conventions (`@/` alias, barrel exports)
- AI model IDs and their use cases
- Edge function runtime rules (Deno, JWT, Promise.race)
- Screen → Agent mappings

### Research Before Implementation

Task prompts should instruct Claude to read existing code before writing:
- "Read `src/hooks/useX.ts` and follow the existing pattern"
- "Check the existing RLS policies on [table] before adding new ones"

### Keep Solutions Minimal

- Don't add error handling for scenarios that can't happen
- Don't create abstractions for one-time operations
- Don't add docstrings or comments to code you didn't change
- Three similar lines of code is better than a premature abstraction

### Test What Matters

- Write tests for hook logic and edge cases, not rendering boilerplate
- Prefer integration tests (hook + Supabase) over shallow snapshot tests
- Verify the happy path, empty state, and error state at minimum

---

## Workflow

```
1. Read task prompt completely
2. Read existing files referenced in wiring plan
3. Implement each file in wiring plan order
4. Run build + test + lint
5. Verify acceptance criteria manually
6. Mark task complete
```
