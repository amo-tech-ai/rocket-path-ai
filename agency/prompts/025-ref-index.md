# Reference Docs — Index

> **Updated:** 2026-03-15
> **Renumbered:** 100-109 → 025-034 (sequential with implementation tasks)
> **Total:** 10 reference documents (025–034)

---

## Purpose

Implementation tasks (001–024) describe **what** to build. These reference docs describe **how** the data layer, auth, AI integrations, and wiring support those tasks.

---

## Reference Doc Registry

| # | File | Domain | Consult When |
|:-:|------|--------|-------------|
| 025 | `025-ref-schema-migrations.md` | Schema — tables, columns, indexes, triggers | Tasks 007, 009, 012, 015 |
| 026 | `026-ref-rls-policies.md` | RLS — per-table policies, org isolation | Any new table or policy |
| 027 | `027-ref-erd-diagrams.md` | ERD — entity relationships in Mermaid | Understanding relationships |
| 028 | `028-ref-data-flow-diagrams.md` | Data flows — chat, agents, automations | Tasks 002-011 |
| 029 | `029-ref-edge-function-wiring.md` | EF wiring — deploy order, rollback | Tasks 001-011 |
| 030 | `030-ref-gemini-integration.md` | Gemini 3 — structured output, search, tools | Tasks 002, 003, 009, 010 |
| 031 | `031-ref-claude-sdk.md` | Claude SDK — investor/CRM agents, reasoning | Tasks 005, 008 |
| 032 | `032-ref-auth-security.md` | Auth — JWT, org isolation, rate limiting | Any auth changes |
| 033 | `033-ref-frontend-wiring.md` | Frontend — hooks, components, pages, state | Tasks 004, 006, 013-020 |
| 034 | `034-ref-workflow-automation.md` | Workflows — wizards, dashboards, realtime | Task 015 |

---

## Dependency Graph

```
100 (schema) ──┬── 101 (RLS) ── 107 (auth+security)
               ├── 102 (ERD) ── 103 (data flows)
               └── 104 (EF wiring) ──┬── 105 (Gemini)
                                     ├── 106 (Claude)
                                     └── 108 (frontend) ── 109 (workflows)
```

---

## Key Skills Referenced

| Skill | Used In | Purpose |
|-------|---------|---------|
| `supabase-postgres-best-practices` | 100, 101, 107 | Schema design, RLS patterns, auth.uid() caching |
| `gemini` | 105 | Gemini 3 API, responseJsonSchema, search grounding |
| `supabase-edge-functions` | 104, 107 | EF patterns, JWT, Promise.race, CORS |
| `database-migration` | 100, 101 | Migration conventions, IF NOT EXISTS, triggers |
| `security-hardening` | 101, 107 | RLS audit, CORS, rate limiting |
| `frontend-design` | 108 | React hooks, shadcn/ui, Tailwind |
| `evidence-weighting` | 105 | Evidence tiers in Gemini schemas |
| `challenger-narrative` | 105, 106 | Narrative structure in AI prompts |

---

## Conventions (from supabase-postgres-best-practices)

### Migration Pattern
```sql
SET search_path = '';
CREATE TABLE IF NOT EXISTS public.my_table (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.my_table
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### RLS Naming
```sql
-- Format: {tablename}_{operation}_{role}
CREATE POLICY my_table_select_authenticated ON public.my_table
  FOR SELECT TO authenticated USING (true);
```

### auth.uid() Caching
```sql
-- Always wrap in subquery for initPlan optimization
USING (user_id = (SELECT auth.uid()))
```

### Org Isolation
```sql
-- Use user_org_id() SECURITY DEFINER helper
USING (org_id = (SELECT public.user_org_id()))
```

---

## Cross References

| Document | Path |
|----------|------|
| Feature Prompts Index | `agency/prompts/000-index.md` |
| Agency PRD | `agency/prd-agency.md` |
| Agency Roadmap | `agency/roadmap-agency.md` |
| Agency Wiring Map | `agency/INDEX.md` |
| Mermaid Diagrams | `agency/mermaid/00-index.md` |
| Agent Loader | `agency/lib/agent-loader.ts` |
| Supabase Best Practices | `.agents/skills/supabase-postgres-best-practices/SKILL.md` |
| Existing Migrations | `supabase/migrations/` (90 files) |
