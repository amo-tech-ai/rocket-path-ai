# CLAUDE.md

> **Updated:** 2026-02-13 | **Version:** 4.2

StartupAI — AI-powered OS for startup founders. React/TS SPA + Vite + Supabase + shadcn/ui.
Validator pipeline working E2E (7 agents, V2 report with 6 visual components). 45 edge functions, 47 pages, 284 tests.

## Commands

```bash
npm run dev          # Vite dev (port 8080)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest
```

## Tech Stack

- **Frontend:** Vite 5 + React 18 + TypeScript + Tailwind + shadcn/ui
- **Backend:** Supabase (PostgreSQL + RLS + OAuth + Edge Functions)
- **AI:** Gemini 3 (fast ops) + Claude 4.6 (reasoning)

## Key Directories

```
src/pages/                # 47 route components
src/components/ui/        # shadcn components
src/components/validator/ # Validator pipeline UI (10 V2 sections + 4 shared)
src/hooks/                # 78 hooks: useAuth, useValidatorPipeline, etc.
supabase/functions/       # 42 Edge Functions (Deno)
├── validator-start/      # 7-agent pipeline (agents/, pipeline.ts, config.ts)
├── _shared/              # gemini.ts, cors.ts, rate-limit.ts
.agents/skills/           # 37 skills (gemini, supabase, frontend-design, mermaid, etc.)
lean/                     # Progress trackers, task specs, strategy docs
```

## Critical Rules

1. **Path alias:** `@/` → `./src/`
2. **Env vars:** `import.meta.env.VITE_*` only (never expose server keys)
3. **Auth:** Protected routes use `<ProtectedRoute>`, hook: `useAuth`
4. **RLS:** Every table needs policies — no exceptions
5. **Edge functions:** Deno runtime, always verify JWT
6. **Imports:** `import { X } from "@/components/ui/x"` — use barrel exports

## AI Models

| Use Case | Model ID |
|----------|----------|
| Fast extraction | `gemini-3-flash-preview` |
| Deep analysis | `gemini-3-pro-preview` |
| Image gen | `gemini-3-pro-image-preview` |
| Fast tasks | `claude-haiku-4-5` |
| Balanced | `claude-sonnet-4-5` |
| Complex reasoning | `claude-opus-4-6` |

## Edge Function Gotchas

- `AbortSignal.timeout()` does NOT reliably abort `response.json()` on Deno Deploy — wrap in `Promise.race` with hard timeout
- Gemini: Always use `responseJsonSchema` + `responseMimeType` for guaranteed JSON
- Gemini 3: Keep temperature at 1.0 (lower causes looping)
- API key in `x-goog-api-key` header, not query param
- Paid plan: 400s wall-clock limit. Pipeline deadline: 300s
- Use `EdgeRuntime.waitUntil()` for background work

## Task Management

Use the **Claude Tasks system** (`TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`) for session work:
- Run `TaskList` at session start to see pending work and pick the next unblocked task
- Mark tasks `in_progress` when starting, `completed` when done
- Respect `blockedBy` chains — don't start blocked tasks
- Source of truth: `tasks/next-steps.md` (28 active tasks, 9 sections, priority-ordered)
- After completing tasks, update `tasks/next-steps.md`, `tasks/changelog`, and `CHANGELOG.md`

## Context Management

- One task per session. Use `/compact` when long. Use `/clear` between unrelated tasks
- Use subagents (Task tool) for high-volume reads, tests, exploration
- Reference files with paths — don't paste large blocks
- Skills contain domain knowledge (invoke with `/skill-name`)

**Ignored (`.claude/settings.json`):** `pm/`, `tasks/prompts/`, `knowledge/`, `archive/`, `screenshots/`, `figma/`, `.backup*/`

## Skills (`.agents/skills/`)

| Skill | Purpose |
|-------|---------|
| `gemini` | Gemini 3 API integration, structured output, search |
| `supabase-postgres-best-practices` | DB schema, RLS, query optimization |
| `frontend-design` | UI components, Tailwind, shadcn/ui |
| `mermaid-diagrams` | Architecture & flow diagrams |

## Key References

| Topic | Path |
|-------|------|
| PRD | `prd.md` |
| Changelog | `CHANGELOG.md` |
| Next Steps (active tasks) | `tasks/next-steps.md` |
| Task Specs (prompts) | `tasks/prompts/index-prompts.md` |
| Progress Tracker | `tasks/index-progress.md` |
| Validator Strategy | `tasks/validator/strategy/00-INDEX.md` |
| Gemini Skill | `.agents/skills/gemini/SKILL.md` |
| Supabase Skill | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
