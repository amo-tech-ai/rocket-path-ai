---
paths:
  - "supabase/migrations/**"
  - "src/integrations/**"
---

# Database & RLS Rules

- Every table MUST have RLS enabled — no exceptions
- Use `(SELECT auth.uid())` (wrapped in subquery) for initPlan caching — never bare `auth.uid()`
- `user_org_id()` is the single SECURITY DEFINER org helper function
- `has_role(uuid, app_role)` checks `user_roles` table
- `startup_in_org(startup_id)` calls `user_org_id()` internally
- Zero `FOR ALL` policies — always split into per-operation policies (SELECT/INSERT/UPDATE/DELETE)
- Every UPDATE policy MUST have a `WITH CHECK` clause (mirrors USING — prevents row escape)
- service_role bypasses RLS — never create explicit policies for it
- Use `.maybeSingle()` not `.single()` for access checks (`.single()` errors on 0 rows)
- Migration files: use descriptive names, one concern per migration
- Never drop columns in production without a deprecation migration first
