# CLAUDE.md

> **Updated:** 2026-02-08 | **Version:** 4.0

StartupAI — AI-powered OS for startup founders. React/TS SPA + Vite + Supabase + shadcn/ui.
Validator pipeline working E2E (7 agents, 14-section report). 29 edge functions, 42 pages, 49 migrations.

## Commands

```bash
npm run dev          # Vite dev (port 8082)
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
src/pages/                # 42 route components
src/components/ui/        # shadcn components
src/components/validator/ # Validator pipeline UI (14 sections)
src/hooks/                # useAuth, useValidatorPipeline, etc.
supabase/functions/       # 31 Edge Functions (Deno)
├── validator-start/      # 7-agent pipeline (agents/, pipeline.ts, config.ts)
├── _shared/              # gemini.ts, cors.ts, rate-limit.ts
.agents/skills/           # 4 skills (gemini, supabase, frontend-design, mermaid)
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
| Lean Progress | `lean/next-steps.md` |
| Lean Task Map | `lean/03-lean-prompts/index-lean.md` |
| Validator Strategy | `tasks/validator/strategy/00-INDEX.md` |
| Gemini Skill | `.agents/skills/gemini/SKILL.md` |
| Supabase Skill | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
