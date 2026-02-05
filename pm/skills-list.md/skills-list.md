# Top 25 Skills for Startup AI (skills.sh)

> **Source:** [skills.sh](https://skills.sh/) leaderboard + StartupAI stack (React/Vite, Supabase, Gemini/Claude).  
> **Updated:** 2026-02-03 | **Top 10** (core) + **Next 15** (quality, tooling, scale).

| # | Skill | Repo | Features | Use Cases | Real-World Examples | Rare / Review | Score /100 |
|---|-------|------|----------|-----------|---------------------|---------------|------------|
| 1 | **supabase-postgres-best-practices** | supabase/agent-skills | Query perf, indexes, RLS, connection pooling, schema design, EXPLAIN | Writing/optimizing SQL, migrations, RLS policies, scaling | Slow dashboard query → add partial index; RLS policy review before launch | Official Supabase; 8 priority categories; rare as single DB-focused skill | **94** |
| 2 | **vercel-react-best-practices** | vercel-labs/agent-skills | Components, hooks, state, SSR/CSR, perf, patterns | React/Vite SPA, dashboards, forms, list/detail UIs | Wizard steps state; dashboard data fetching; avoiding re-render storms | Very high installs; applies to Vite React even though Vercel-branded | **92** |
| 3 | **frontend-design** | anthropics/skills | UI/UX, layout, accessibility, design systems, polish | Landing, onboarding, dashboard, shadcn consistency | Onboarding wizard UX; dashboard card hierarchy; a11y on forms | High-quality UI guidance; reduces "generic AI" look | **90** |
| 4 | **better-auth-best-practices** | better-auth/skills | Sessions, OAuth, security, edge cases | Auth flows, Supabase Auth alignment, secure patterns | Session refresh; OAuth callback handling; RLS + auth consistency | Niche but aligns with Supabase Auth; good for hardening | **86** |
| 5 | **test-driven-development** | obra/superpowers | RED-GREEN-REFACTOR, test-first, Vitest/Jest | New features, edge functions, hooks, utils | Write test for lean canvas save; then implement; same for edge fn | Superpowers ecosystem; discipline for agent-generated code | **88** |
| 6 | **systematic-debugging** | obra/superpowers | Reproduce, isolate, hypothesize, fix, verify | Bugs, failing tests, prod issues | "Dashboard empty" → check RLS, then hooks, then network | Reduces random edits; forces evidence-based fix | **87** |
| 7 | **writing-plans** | obra/superpowers | Multi-step plans, dependencies, checkpoints | Features, migrations, API wiring, refactors | Plan: migration → RLS → edge fn → hook → UI for new idea table | Keeps agent on track for 5+ step tasks | **85** |
| 8 | **doc-coauthoring** | anthropics/skills | PRDs, specs, structure, clarity | PRD, startup-system docs, task specs, playbooks | Coauthor roadmap section; turn playbook into structured doc | Improves quality of specs agents consume | **84** |
| 9 | **webapp-testing** | anthropics/skills | E2E, component tests, coverage, patterns | Critical paths: signup, wizard, dashboard, pitch deck | E2E: complete onboarding; test deck generation flow | Complements TDD; focuses on user journeys | **83** |
| 10 | **requesting-code-review** | obra/superpowers | Checklist, standards, security, before merge | Before PR, after feature, before production | "Review onboarding step 4" against RLS and error handling | Catches what systematic-debugging and TDD might miss | **82** |

---

## Next 15 skills (11–25)

| # | Skill | Repo | Features | Use Cases | Real-World Examples | Rare / Review | Score /100 |
|---|-------|------|----------|-----------|---------------------|---------------|------------|
| 11 | **verification-before-completion** | obra/superpowers | Run checks before claiming done, evidence over assertions | Before "complete", before PR, before deploy | Run `npm run build` + tests before saying feature is done | Stops false "done"; forces verification commands | **81** |
| 12 | **receiving-code-review** | obra/superpowers | Interpret feedback, verify suggestions, push back when wrong | After review comments, before re-implementing | "Is this RLS suggestion correct?" → verify then implement | Reduces blind acceptance of bad review advice | **80** |
| 13 | **vitest** | antfu/skills | Vitest config, mocks, coverage, component testing | Unit/integration tests in Vite project | Test hooks, edge-fn handlers, utils with Vitest | Matches your stack (Vite); antfu ecosystem | **79** |
| 14 | **ai-sdk** | vercel/ai | Streaming, tool use, prompts, error handling | Chat, copilot, AI features in app | Add streaming chat to dashboard; tool-calling for deck gen | Vercel AI SDK patterns; useful even with Gemini/Claude | **78** |
| 15 | **security-review** | zackkorman/skills | Security audit, OWASP, auth, injection, secrets | Before production, after new auth/data features | Review RLS + edge fn for IDOR; check for hardcoded secrets | Focused security skill; complements better-auth | **77** |
| 16 | **finishing-a-development-branch** | obra/superpowers | Merge vs PR vs cleanup, integration options | When feature is verified and ready to ship | Choose: merge to main, open PR, or clean up branch | Clear handoff; avoids half-merged state | **76** |
| 17 | **vite** | antfu/skills | Vite config, plugins, env, build, SSR hints | Config, perf, env vars, dev vs prod | Tune Vite for faster HMR; fix env in edge build | Direct fit for Vite 5 + React | **75** |
| 18 | **tanstack-query** | jezweb/claude-skills | Caching, mutations, invalidation, loading/error | Dashboard data, CRUD, optimistic updates | Replace raw fetch in dashboard with TanStack Query | Common in React + Supabase apps | **74** |
| 19 | **vercel-composition-patterns** | vercel-labs/agent-skills | Composition, layout, shared UI patterns | Complex UIs, dashboards, wizard layout | Reusable wizard layout; shared panel patterns | Complements vercel-react-best-practices | **73** |
| 20 | **next-best-practices** | vercel-labs/next-skills | Routing, data fetching, caching, API routes | If you add Next later; patterns transfer to Vite | App-router mental model; fetch/cache patterns | Next-focused but many patterns apply to SPA | **72** |
| 21 | **email-best-practices** | resend/email-best-practices | Deliverability, templates, tracking, compliance | Notifications, magic links, digest emails | Onboarding emails; password reset; transactional | Resend-focused; good if you add email | **71** |
| 22 | **turborepo** | vercel/turborepo | Monorepo, tasks, caching, pipelines | If repo grows to apps + packages | Shared UI package; shared types; parallel builds | Only if you move to monorepo | **70** |
| 23 | **mcp-builder** | anthropics/skills | Design and build MCP servers, tools, resources | Custom MCP for Supabase, internal APIs | MCP tool for "run migration" or "fetch dashboard stats" | Expands agent tooling | **69** |
| 24 | **dispatching-parallel-agents** | obra/superpowers | Run independent tasks in parallel, handoff | Multiple features, audits, docs in one session | "Review RLS and update PRD in parallel" | Throughput for independent work | **68** |
| 25 | **using-git-worktrees** | obra/superpowers | Isolated worktrees, branch per experiment | Try big refactor or experiment without touching main | New worktree for "migrate to TanStack Query" | Safe experimentation | **67** |

---

## Install commands (skills.sh standard)

```bash
# Already in project
npx skills add supabase/agent-skills

# Recommended next
npx skills add vercel-labs/agent-skills    # pick vercel-react-best-practices
npx skills add anthropics/skills           # frontend-design, doc-coauthoring, webapp-testing
npx skills add obra/superpowers            # TDD, debugging, writing-plans, code-review
npx skills add better-auth/skills           # better-auth-best-practices

# Next 15 (skills 11–25)
npx skills add obra/superpowers             # verification-before-completion, receiving-code-review, finishing-a-development-branch, dispatching-parallel-agents, using-git-worktrees
npx skills add antfu/skills                 # vitest, vite
npx skills add vercel/ai                    # ai-sdk
npx skills add vercel-labs/agent-skills     # vercel-composition-patterns (if not already)
npx skills add vercel-labs/next-skills      # next-best-practices (optional)
npx skills add anthropics/skills            # mcp-builder
npx skills add zackkorman/skills             # security-review
npx skills add jezweb/claude-skills         # tanstack-query
npx skills add resend/email-best-practices  # email-best-practices (if adding email)
npx skills add vercel/turborepo             # turborepo (if moving to monorepo)
```

---

## Scoring criteria (used for Score /100)

| Factor | Weight | Notes |
|--------|--------|--------|
| Relevance to StartupAI stack | 30% | Supabase, React, AI, dashboards, startup flows |
| Impact on quality/speed | 25% | Fewer bugs, clearer code, faster iteration |
| Rarity / uniqueness | 20% | Not redundant with existing .cursor/skills or .claude |
| Leaderboard adoption | 15% | installs / community signal from skills.sh |
| Ease of use by agent | 10% | Clear triggers, good references |

---

## Overlap with current setup

| skills.sh skill | Current project | Action |
|-----------------|-----------------|--------|
| supabase-postgres-best-practices | `.agents/skills/supabase-postgres-best-practices` + `.cursor/skills/supabase` | Keep both; Supabase skill is Postgres-deep, .cursor/supabase is workflow |
| frontend-design | `.claude/frontend-design/` | Optional: add anthropics/skills version for second opinion |
| test-driven-development, writing-plans, etc. | `superpowers` in skills.md | Already listed; ensure installed via `npx skills add obra/superpowers` |

---

## References

- [skills.sh – Agent Skills Directory](https://skills.sh/)
- [Supabase Agent Skills](https://github.com/supabase/agent-skills)
- [Postgres best practices for AI agents (Supabase)](https://supabase.com/blog/postgres-best-practices-for-ai-agents)
- Project: `skills.md`, `CLAUDE.md`, `.cursor/skills/`, `.agents/skills/`
