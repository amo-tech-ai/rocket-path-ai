# Top 10 Skills for Startup AI (skills.sh)

> **Source:** [skills.sh](https://skills.sh/) leaderboard + StartupAI stack (React/Vite, Supabase, Gemini/Claude).  
> **Updated:** 2026-02-03

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

## Install commands (skills.sh standard)

```bash
# Already in project
npx skills add supabase/agent-skills

# Recommended next
npx skills add vercel-labs/agent-skills    # pick vercel-react-best-practices
npx skills add anthropics/skills           # frontend-design, doc-coauthoring, webapp-testing
npx skills add obra/superpowers            # TDD, debugging, writing-plans, code-review
npx skills add better-auth/skills           # better-auth-best-practices
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
