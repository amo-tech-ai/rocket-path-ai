# Claude Code Context Review

> **Date:** 2026-02-09 | **Project:** StartupAI | **Stack:** React 18 + Vite 5 + TS + Supabase + Gemini 3

Review of all context items loaded into Claude Code sessions. Scored by relevance to StartupAI development.

**Scoring:** 0-100 based on frequency of use (30%), relevance to stack (30%), unique value (20%), no overlap/duplication (20%).

---

## 1. MCP Servers (48 tools across 5 servers)

### Supabase MCP (23 tools)

| # | Tool | Use Case | Score | Need |
|---|------|----------|-------|------|
| 1 | `search_docs` | Search Supabase docs via GraphQL | 85 | Yes |
| 2 | `list_tables` | View all tables in schemas | 90 | Yes |
| 3 | `list_extensions` | Check enabled PG extensions | 70 | Yes |
| 4 | `list_migrations` | View applied migrations | 85 | Yes |
| 5 | `apply_migration` | Run DDL migrations | 95 | Yes |
| 6 | `execute_sql` | Run raw SQL queries | 95 | Yes |
| 7 | `get_logs` | Debug edge function/auth/postgres logs | 90 | Yes |
| 8 | `get_advisors` | Security/performance audit advisories | 80 | Yes |
| 9 | `get_project_url` | Get API URL for project | 60 | Yes |
| 10 | `get_publishable_keys` | Get anon/publishable API keys | 60 | Yes |
| 11 | `generate_typescript_types` | Auto-gen TS types from schema | 85 | Yes |
| 12 | `list_edge_functions` | View deployed edge functions | 80 | Yes |
| 13 | `get_edge_function` | Read edge function source | 75 | Yes |
| 14 | `deploy_edge_function` | Deploy edge functions | 70 | Maybe |
| 15 | `create_branch` | Create dev database branch | 50 | Maybe |
| 16 | `list_branches` | List dev branches | 45 | Maybe |
| 17 | `delete_branch` | Delete dev branch | 40 | Maybe |
| 18 | `merge_branch` | Merge branch to production | 45 | Maybe |
| 19 | `reset_branch` | Reset branch migrations | 40 | Maybe |
| 20 | `rebase_branch` | Rebase branch on production | 40 | Maybe |
| 21 | `list_storage_buckets` | View storage buckets | 55 | Yes |
| 22 | `get_storage_config` | Check storage settings | 50 | Maybe |
| 23 | `update_storage_config` | Modify storage config | 45 | Maybe |

**Summary:** Core Supabase tools (SQL, migrations, types, logs) are essential daily-use. Branching tools (15-20) are low-use since we deploy to a single project. Storage tools (21-23) are occasional.

### Chrome Browser MCP (17 tools)

| # | Tool | Use Case | Score | Need |
|---|------|----------|-------|------|
| 24 | `javascript_tool` | Execute JS in browser tab | 75 | Yes |
| 25 | `read_page` | Get accessibility tree of page | 80 | Yes |
| 26 | `find` | Find elements by natural language | 75 | Yes |
| 27 | `form_input` | Set form field values | 70 | Yes |
| 28 | `computer` | Click, type, screenshot, scroll | 85 | Yes |
| 29 | `navigate` | Navigate to URLs, back/forward | 80 | Yes |
| 30 | `resize_window` | Set browser window size | 45 | Maybe |
| 31 | `gif_creator` | Record browser interactions as GIF | 40 | Maybe |
| 32 | `upload_image` | Upload screenshot to file input | 35 | No |
| 33 | `get_page_text` | Extract page text content | 70 | Yes |
| 34 | `tabs_context_mcp` | Get current tab group info | 80 | Yes |
| 35 | `tabs_create_mcp` | Create new tab in group | 75 | Yes |
| 36 | `update_plan` | Present action plan for approval | 50 | Maybe |
| 37 | `read_console_messages` | Read browser console output | 85 | Yes |
| 38 | `read_network_requests` | Monitor XHR/Fetch network calls | 80 | Yes |
| 39 | `shortcuts_list` | List available browser shortcuts | 30 | No |
| 40 | `shortcuts_execute` | Run browser shortcut/workflow | 30 | No |

**Summary:** Core browser tools (screenshot, click, navigate, console, network) are valuable for testing the SPA. GIF recording and shortcuts are low-use.

### Mermaid MCP (4 tools)

| # | Tool | Use Case | Score | Need |
|---|------|----------|-------|------|
| 41 | `generate_mermaid` | Create diagrams from Mermaid syntax | 85 | Yes |
| 42 | `update_diagram` | Update existing diagram | 70 | Yes |
| 43 | `list_diagrams` | List session diagrams | 50 | Maybe |
| 44 | `export_diagram` | Export SVG to disk | 75 | Yes |

**Summary:** All useful. We generate architecture diagrams, pipeline sequences, and kanban boards regularly. Core set is tight.

### Context7 MCP (2 tools)

| # | Tool | Use Case | Score | Need |
|---|------|----------|-------|------|
| 45 | `resolve-library-id` | Find Context7 library ID | 65 | Yes |
| 46 | `query-docs` | Query library docs with context | 70 | Yes |

**Summary:** Useful for looking up Supabase, React, Tailwind, shadcn/ui docs. Moderate use — often our custom skills have more specific knowledge.

### IDE MCP (2 tools)

| # | Tool | Use Case | Score | Need |
|---|------|----------|-------|------|
| 47 | `getDiagnostics` | Get VS Code language errors | 75 | Yes |
| 48 | `executeCode` | Run code in Jupyter kernel | 20 | No |

**Summary:** getDiagnostics is handy for checking TS errors. executeCode is irrelevant — we don't use Jupyter notebooks.

---

## 2. Custom Agents (25 agents)

### Built-in Agents (6)

| # | Agent | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 1 | `Bash` | Run shell commands, git, npm | 95 | Yes |
| 2 | `general-purpose` | Multi-step research and search | 80 | Yes |
| 3 | `Explore` | Fast codebase exploration | 90 | Yes |
| 4 | `Plan` | Design implementation plans | 85 | Yes |
| 5 | `statusline-setup` | Configure status line display | 15 | No |
| 6 | `claude-code-guide` | Answer questions about Claude Code | 40 | Maybe |

### Project Agents (10)

| # | Agent | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 7 | `code-reviewer` | Review code quality/bugs/security | 85 | Yes |
| 8 | `supabase-expert` | DB schema, RLS, migrations, edge fns | 90 | Yes |
| 9 | `ai-agent-dev` | Gemini/Claude API, prompt engineering | 85 | Yes |
| 10 | `security-auditor` | Vulnerability detection, RLS audit | 80 | Yes |
| 11 | `doc-writer` | Technical specs, API docs | 60 | Maybe |
| 12 | `frontend-designer` | React components, Tailwind, shadcn/ui | 85 | Yes |
| 13 | `startup-expert` | Lean Canvas, validation, metrics | 75 | Yes |
| 14 | `performance-optimizer` | React/DB/edge function optimization | 70 | Yes |
| 15 | `test-runner` | Run tests, analyze coverage | 65 | Yes |
| 16 | `debugger` | Errors, test failures, unexpected behavior | 80 | Yes |

### Plugin Agents (9)

| # | Agent | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 17 | `feature-dev:code-reviewer` | Confidence-based code review | 55 | Maybe |
| 18 | `feature-dev:code-explorer` | Deep feature analysis, trace paths | 65 | Maybe |
| 19 | `feature-dev:code-architect` | Design feature architectures | 60 | Maybe |
| 20 | `plugin-dev:plugin-validator` | Validate plugin structure | 20 | No |
| 21 | `plugin-dev:skill-reviewer` | Review skill quality | 25 | No |
| 22 | `plugin-dev:agent-creator` | Create new agents | 25 | No |
| 23 | `agent-sdk-dev:agent-sdk-verifier-py` | Verify Python Agent SDK apps | 10 | No |
| 24 | `agent-sdk-dev:agent-sdk-verifier-ts` | Verify TS Agent SDK apps | 15 | No |
| 25 | `superpowers:code-reviewer` | Review against plan + standards | 60 | Maybe |

**Summary:** Built-in + project agents are the workhorses. Plugin agents (20-24) are for Claude Code plugin development — not relevant to StartupAI. Feature-dev agents (17-19) overlap with project agents but add confidence scoring.

---

## 3. Skills (36 active + 5 disabled)

### Project Skills (6 — from `.agents/skills/`)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 1 | `gemini` | Gemini 3 API, structured output, G1-G6 rules | 95 | Yes |
| 2 | `supabase-postgres-best-practices` | DB schema, RLS, query optimization | 90 | Yes |
| 3 | `frontend-design` | UI components, Tailwind, shadcn/ui | 85 | Yes |
| 4 | `mermaid-diagrams` | Architecture/flow diagrams | 80 | Yes |
| 5 | `figma-prototyping` | Figma design integration | 35 | Maybe |
| 6 | `vercel-react-native-skills` | React Native / Expo patterns | 15 | No |

### User / Built-in Skills (2)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 7 | `keybindings-help` | Customize keyboard shortcuts | 10 | No |
| 8 | `find-skills` | Discover installable skills | 30 | Maybe |

### Plugin Skills — Core Workflows (9)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 9 | `pr` | Prepare and create pull requests | 75 | Yes |
| 10 | `code-review` | Review code quality/bugs | 80 | Yes |
| 11 | `claude-chrome` | Browser automation testing | 65 | Yes |
| 12 | `test-route` | Test authenticated API endpoints | 70 | Yes |
| 13 | `dev-docs` | Create feature task documentation | 55 | Maybe |
| 14 | `catchup` | Summarize branch changes | 60 | Maybe |
| 15 | `github-update` | Safely pull from GitHub | 70 | Yes |
| 16 | `build-and-fix` | Run build/lint, fix all errors | 80 | Yes |
| 17 | `vercel-react-best-practices` | React/Next.js performance patterns | 40 | Maybe |

### Plugin Skills — Feature Dev (1)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 18 | `feature-dev:feature-dev` | Guided feature development | 55 | Maybe |

### Plugin Skills — Plugin Dev (3 active + 5 disabled)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 19 | `plugin-dev:create-plugin` | End-to-end plugin creation | 15 | No |
| 20 | `plugin-dev:agent-development` | Create/configure agents | 20 | No |
| 21 | `plugin-dev:skill-development` | Create/configure skills | 25 | Maybe |
| — | `plugin-dev:_disabled_*` (5) | Plugin structure, settings, commands, hooks, MCP | 10 | No |

### Plugin Skills — Agent SDK (1)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 22 | `agent-sdk-dev:new-sdk-app` | Create Agent SDK applications | 10 | No |

### Plugin Skills — Code Review (1)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 23 | `code-review:code-review` | PR code review | 55 | Maybe |

### Plugin Skills — Ralph Loop (3)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 24 | `ralph-loop:help` | Explain Ralph Loop plugin | 15 | No |
| 25 | `ralph-loop:cancel-ralph` | Cancel active Ralph Loop | 15 | No |
| 26 | `ralph-loop:ralph-loop` | Start Ralph Loop session | 20 | No |

### Plugin Skills — Frontend Design (1)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 27 | `frontend-design:frontend-design` | Production-grade UI creation | 80 | Yes |

### Plugin Skills — Superpowers (13)

| # | Skill | Use Case | Score | Need |
|---|-------|----------|-------|------|
| 28 | `superpowers:brainstorming` | Explore intent before coding | 55 | Maybe |
| 29 | `superpowers:verification-before-completion` | Verify work before claiming done | 70 | Yes |
| 30 | `superpowers:test-driven-development` | TDD workflow | 50 | Maybe |
| 31 | `superpowers:finishing-a-development-branch` | Guide branch completion | 55 | Maybe |
| 32 | `superpowers:using-superpowers` | Discover available skills | 20 | No |
| 33 | `superpowers:receiving-code-review` | Handle review feedback rigorously | 45 | Maybe |
| 34 | `superpowers:systematic-debugging` | Structured bug investigation | 65 | Yes |
| 35 | `superpowers:dispatching-parallel-agents` | Parallelize independent tasks | 70 | Yes |
| 36 | `superpowers:writing-plans` | Structured implementation plans | 60 | Maybe |
| 37 | `superpowers:using-git-worktrees` | Isolated feature branches | 40 | Maybe |
| 38 | `superpowers:writing-skills` | Create/edit skills | 30 | Maybe |
| 39 | `superpowers:subagent-driven-development` | Execute plans with subagents | 55 | Maybe |
| 40 | `superpowers:executing-plans` | Execute plans with checkpoints | 55 | Maybe |
| 41 | `superpowers:requesting-code-review` | Request review of completed work | 50 | Maybe |

---

## 4. Memory Files (2)

| # | File | Use Case | Score | Need |
|---|------|----------|-------|------|
| 1 | `MEMORY.md` | Persistent project knowledge across sessions | 95 | Yes |
| 2 | `.claude/settings.json` | Ignore patterns for large dirs | 80 | Yes |

---

## 5. Summary Scorecard

### By Category

| Category | Items | Avg Score | Essential | Maybe | Not Needed |
|----------|-------|-----------|-----------|-------|------------|
| Supabase MCP | 23 | 65 | 14 | 9 | 0 |
| Chrome MCP | 17 | 62 | 12 | 3 | 2 |
| Mermaid MCP | 4 | 70 | 3 | 1 | 0 |
| Context7 MCP | 2 | 68 | 2 | 0 | 0 |
| IDE MCP | 2 | 48 | 1 | 0 | 1 |
| Built-in Agents | 6 | 68 | 4 | 1 | 1 |
| Project Agents | 10 | 78 | 9 | 1 | 0 |
| Plugin Agents | 9 | 37 | 0 | 4 | 5 |
| Project Skills | 6 | 67 | 4 | 1 | 1 |
| User Skills | 2 | 20 | 0 | 1 | 1 |
| Plugin Skills — Core | 9 | 66 | 5 | 4 | 0 |
| Plugin Skills — Dev Tools | 7 | 16 | 0 | 1 | 6 |
| Plugin Skills — Superpowers | 14 | 51 | 3 | 8 | 3 |
| Memory Files | 2 | 88 | 2 | 0 | 0 |
| **Totals** | **113** | **55** | **59** | **34** | **20** |

### Top 15 (Score 85+)

| Rank | Item | Category | Score |
|------|------|----------|-------|
| 1 | `Bash` agent | Agent | 95 |
| 2 | `gemini` skill | Skill | 95 |
| 3 | `execute_sql` | Supabase MCP | 95 |
| 4 | `apply_migration` | Supabase MCP | 95 |
| 5 | `MEMORY.md` | Memory | 95 |
| 6 | `list_tables` | Supabase MCP | 90 |
| 7 | `get_logs` | Supabase MCP | 90 |
| 8 | `supabase-expert` agent | Agent | 90 |
| 9 | `Explore` agent | Agent | 90 |
| 10 | `supabase-postgres-best-practices` skill | Skill | 90 |
| 11 | `generate_typescript_types` | Supabase MCP | 85 |
| 12 | `list_migrations` | Supabase MCP | 85 |
| 13 | `search_docs` | Supabase MCP | 85 |
| 14 | `computer` (screenshot/click) | Chrome MCP | 85 |
| 15 | `read_console_messages` | Chrome MCP | 85 |

### Bottom 10 (Score 20 or below)

| Rank | Item | Category | Score | Reason |
|------|------|----------|-------|--------|
| 1 | `agent-sdk-dev:agent-sdk-verifier-py` | Plugin Agent | 10 | No Python Agent SDK usage |
| 2 | `agent-sdk-dev:new-sdk-app` | Plugin Skill | 10 | Not building Agent SDK apps |
| 3 | `keybindings-help` | User Skill | 10 | One-time setup, not dev work |
| 4 | `plugin-dev:_disabled_*` (5 skills) | Plugin Skill | 10 | Disabled + not building plugins |
| 5 | `vercel-react-native-skills` | Project Skill | 15 | No React Native in this project |
| 6 | `agent-sdk-dev:agent-sdk-verifier-ts` | Plugin Agent | 15 | Not building Agent SDK apps |
| 7 | `plugin-dev:create-plugin` | Plugin Skill | 15 | Not building plugins |
| 8 | `statusline-setup` | Built-in Agent | 15 | One-time cosmetic config |
| 9 | `ralph-loop:help` | Plugin Skill | 15 | Not using Ralph Loop |
| 10 | `ralph-loop:cancel-ralph` | Plugin Skill | 15 | Not using Ralph Loop |

---

## 6. Recommendations

### Remove or Disable (saves context tokens)

| Item | Action | Token Savings |
|------|--------|---------------|
| `agent-sdk-dev` plugin | Uninstall | ~2k tokens |
| `ralph-loop` plugin | Uninstall | ~1k tokens |
| `plugin-dev` plugin | Uninstall (unless creating plugins) | ~3k tokens |
| `vercel-react-native-skills` | Remove from `.agents/skills/` | ~1k tokens |
| `keybindings-help` skill | Low priority — small footprint | ~200 tokens |

**Estimated savings:** ~7k tokens per session (4% of context).

### Keep Essential

- **Supabase MCP** — Core backend. Daily use for SQL, migrations, types, logs.
- **Chrome MCP** — Testing SPA flows, debugging console/network.
- **Mermaid MCP** — Architecture diagrams, pipeline sequences.
- **Context7 MCP** — Library docs lookup.
- **Project agents** (all 10) — Each maps to a development task type.
- **Project skills** (gemini, supabase, frontend-design, mermaid) — Domain knowledge.
- **Core plugin skills** (pr, code-review, build-and-fix, github-update, test-route) — Daily workflow.
- **Memory files** — Session continuity.

### Consider Consolidating

| Overlap | Items | Suggestion |
|---------|-------|------------|
| Code review | `code-reviewer` agent + `code-review` skill + `feature-dev:code-reviewer` + `superpowers:code-reviewer` + `code-review:code-review` | Use project `code-reviewer` agent + `code-review` skill. Disable plugin duplicates. |
| Frontend design | `frontend-designer` agent + `frontend-design` skill + `frontend-design:frontend-design` | Use project `frontend-designer` agent + project `frontend-design` skill. Plugin duplicate adds negligible value. |
| Planning | `Plan` agent + `superpowers:writing-plans` + `superpowers:executing-plans` | Use `Plan` agent for most work. Superpowers add checkpoint structure for large plans. |

---

## 7. Context Budget Impact

| Component | Est. Tokens | % of 200k |
|-----------|-------------|-----------|
| System prompt + safety rules | ~15k | 7.5% |
| MCP tool definitions (48) | ~25k | 12.5% |
| Agent definitions (25) | ~8k | 4.0% |
| Skill listings (41) | ~12k | 6.0% |
| CLAUDE.md | ~2k | 1.0% |
| MEMORY.md | ~3k | 1.5% |
| Plan file (if active) | ~2k | 1.0% |
| **Total static context** | **~67k** | **33.5%** |
| **Available for conversation** | **~133k** | **66.5%** |

Removing the 5 unnecessary plugins would recover ~7k tokens (3.5%), bringing available conversation context to ~140k (70%).
