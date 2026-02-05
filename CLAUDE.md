# CLAUDE.md

> **Updated:** 2026-02-02 | **Version:** 3.1

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
- **AI:** Gemini 3 (fast ops, image, video) + Claude 4.5 (reasoning)

## Key Directories

```
src/
├── components/ui/        # shadcn components
├── hooks/                # useAuth, useCRM, etc.
├── pages/                # Route components
├── lib/                  # Utilities
supabase/functions/       # Edge Functions (Deno)
startup-system/           # PRD, diagrams, roadmaps, playbooks
.claude/                  # Skills and agents
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

### Text Models

| Use Case | Provider | Model |
|----------|----------|-------|
| Fast extraction | Gemini | `gemini-3-flash-preview` |
| Deep analysis | Gemini | `gemini-3-pro-preview` |
| Fast tasks | Claude | `claude-haiku-4-5` |
| Balanced | Claude | `claude-sonnet-4-5` |
| Complex reasoning | Claude | `claude-opus-4-5` |

### Multimodal Models

| Use Case | Provider | Model |
|----------|----------|-------|
| Image generation | Gemini | `gemini-3-pro-image-preview` |
| Video generation | Gemini | `veo-3.1-generate-preview` |

## Claude Agent SDK

### Built-in Tools

| Tool | Purpose |
|------|---------|
| Read | Read files |
| Write | Create files |
| Edit | Modify files |
| Bash | Run commands |
| Glob | Find files by pattern |
| Grep | Search file contents |
| WebSearch | Search the web |
| WebFetch | Fetch web pages |
| Task | Invoke subagents |

### Subagents

| Agent | Purpose |
|-------|---------|
| `code-reviewer` | Security, quality review |
| `test-runner` | Test execution |
| `research-assistant` | Code exploration |

### Features

| Feature | Use Case |
|---------|----------|
| Extended Thinking | Complex multi-step reasoning |
| Prompt Caching | Cost savings on repeated prompts |
| Hooks | Validate/block tool use |
| MCP Servers | External tool integration |

## System Documentation

| Document | Path |
|----------|------|
| PRD | `startup-system/prd.md` |
| Diagrams | `startup-system/03-mermaid-diagrams.md` |
| Diagram Index | `startup-system/04-diagram-index.md` |
| System Index | `startup-system/index-startup.md` |
| Universal System | `startup-system/02-universal-product-system.md` |
| Task Template | `startup-system/TASK-TEMPLATE.md` |

### Roadmaps

| Phase | Document |
|-------|----------|
| CORE (W1-6) | `startup-system/roadmaps/01-roadmap-core.md` |
| MVP (W7-12) | `startup-system/roadmaps/02-roadmap-mvp.md` |
| ADVANCED (W13-16) | `startup-system/roadmaps/03-roadmap-advanced.md` |
| PRODUCTION (W17-18) | `startup-system/roadmaps/04-roadmap-production.md` |

## Skills

### Startup Skills

| Skill | Trigger |
|-------|---------|
| `/lean-canvas` | Business model, UVP |
| `/idea-validator` | Validate idea, problem score |
| `/mvp-builder` | MVP, RICE score |
| `/traction` | Metrics, PMF, growth |
| `/fundraising` | Investors, term sheet |
| `/pitch-deck` | Pitch presentation |

### Development Skills

| Skill | Trigger |
|-------|---------|
| `/feature-dev` | Feature implementation |
| `/frontend-design` | UI components |
| `/supabase` | Database, RLS |
| `/edge-functions` | API endpoints |
| `/gemini` | Gemini AI integration |
| `/sdk-agent` | Claude Agent SDK |

## Critical Rules

1. Path alias: `@/` → `./src/`
2. Env vars: `import.meta.env.VITE_*` only
3. Auth: Protected routes use `<ProtectedRoute>`
4. RLS: Every table needs policies
5. Edge functions: Deno runtime, verify JWT
6. Tasks come from diagrams: `startup-system/04-diagram-index.md`
7. **Tasks MUST follow `TASK-TEMPLATE.md` format** — includes YAML frontmatter, diagram_ref, skill, ai_model, subagents, edge_function, schema, wiring plan

## Claude 4 Best Practices

### Prompting

| Principle | Example |
|-----------|---------|
| Be explicit | "Create a fully-featured dashboard with charts and filters" |
| Add context | Explain WHY instructions matter |
| Default to action | "Change X" not "Can you suggest..." |
| Read before edit | Always inspect files before proposing changes |

### Tool Usage

```
# Parallel execution (when no dependencies)
Read 3 files → Run 3 Read tools in parallel

# Action vs Suggestion
"Suggest changes" → Claude provides suggestions
"Make these edits" → Claude implements changes
```

### Long-Horizon Tasks

- Use `progress.txt` for state tracking
- Use `tests.json` for structured test status
- Create `init.sh` for setup scripts
- Use git for checkpoints
- Verify incrementally before moving on

### Avoid Over-Engineering

- Only make requested changes
- Keep solutions simple
- Don't add unnecessary abstractions
- Don't create helpers for one-time ops
- Reuse existing patterns

## Phase System

| Phase | Question | Weeks |
|-------|----------|-------|
| CORE | Can it work? | 1-6 |
| MVP | Does it solve the problem? | 7-12 |
| ADVANCED | Does it help users do better? | 13-16 |
| PRODUCTION | Can it scale? | 17-18 |

## Context Management

**DO:**
- Scope file reads explicitly
- One task per session
- Use `/compact` when session gets long
- Reference `startup-system/` for specs
- Use subagents for specialized work

**DON'T:**
- Read entire folders without filtering
- Keep multiple tasks in one session
- Paste full logs (summarize instead)
- Paste large code blocks (reference files)

**Prompt Caching:**
- `.claude/CACHED-CONTEXT.md` - Stable patterns reference
- `.claude/docs/prompt-caching-guide.md` - Best practices
- Subagents run in isolated contexts (efficient caching)
- Skills have optimized prompts

**Ignored folders (see .claude/settings.json):**
- `pm/`, `tasks/prompts/`, `knowledge/`, `archive/`, `screenshots/`

## References

| Topic | Location |
|-------|----------|
| Claude 4 Best Practices | `knowledge/claude-reference/claude-4-best-practices.md` |
| Prompt Caching Guide | `.claude/docs/prompt-caching-guide.md` |
| Cached Context | `.claude/CACHED-CONTEXT.md` |
| Subagents Guide | `startup-system/sub-agents.md` |
| Task Template | `startup-system/TASK-TEMPLATE.md` |
| System Index | `startup-system/index-startup.md` |
