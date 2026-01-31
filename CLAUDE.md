# CLAUDE.md

> **Updated:** 2026-01-31 | **Version:** 2.1 (Context Optimized)

## Project Overview

StartupAI — AI-powered OS for startup founders.
React/TS SPA + Vite + Supabase (Auth, RLS, Edge Functions) + shadcn/ui.

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
- **AI:** Gemini 3 (fast ops) + Claude 4.5 (reasoning)

## Key Directories

```
src/
├── components/ui/        # shadcn components
├── hooks/                # useAuth, useCRM, etc.
├── pages/                # Route components
├── lib/                  # Utilities
supabase/functions/       # 14 Edge Functions (Deno)
```

## Import Pattern

```typescript
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
```

## Authentication

- OAuth: Google + LinkedIn via Supabase
- Hook: `useAuth` → `user`, `signInWithGoogle`, `signInWithLinkedIn`, `signOut`
- Protected routes: `<ProtectedRoute>` wrapper
- RLS enforces data isolation

## AI Models

| Use Case | Provider | Model |
|----------|----------|-------|
| Chat, extraction | Gemini | `gemini-3-flash-preview` |
| Deep analysis | Gemini | `gemini-3-pro-preview` |
| Reasoning | Claude | `claude-sonnet-4-5-20250929` |

## Critical Rules

1. Path alias: `@/` → `./src/`
2. Env vars: `import.meta.env.VITE_*` only
3. Auth: Protected routes use `<ProtectedRoute>`
4. RLS: Every table needs policies
5. Edge functions: Deno runtime, verify JWT

## Context Management

**DO:**
- Scope file reads explicitly
- One task per session
- Use `/compact` when session gets long

**DON'T:**
- Read entire folders without filtering
- Keep multiple tasks in one session
- Paste full logs (summarize instead)

**Ignored folders (see .claude/settings.json):**
- `pm/`, `tasks/prompts/`, `knowledge/`, `archive/`, `screenshots/`
