---
name: supabase
description: Alias for database-migration. Use when creating tables, adding columns, writing RLS policies, creating database functions, or seeding data. Triggers on "migration", "new table", "schema", "RLS policy", "database function", "seed", "alter table", "supabase".
alias_of: database-migration
---

# Supabase Database

> **Alias:** This skill redirects to `/database-migration` for all database operations.

## Overview

This is an alias for the `database-migration` skill. Use `/supabase` or `/database-migration` interchangeably for:

- Creating new tables
- Adding/modifying columns
- Writing or updating RLS policies
- Creating database functions or triggers
- Seeding reference data

## Quick Reference

See `.agents/skills/data/database-migration/SKILL.md` for the full workflow.

### Key Commands

```bash
supabase migration new <descriptive_name>  # Create migration
supabase db push                           # Apply migration
```

### Checklist

- [ ] Table has `id`, `created_at`, `updated_at`
- [ ] User-owned tables have `user_id` FK
- [ ] RLS enabled
- [ ] SELECT/INSERT/UPDATE/DELETE policies
- [ ] Indexes on query columns

## References

- `.agents/skills/data/database-migration/SKILL.md` - Full workflow
- `.agents/skills/data/supabase-postgres-best-practices/references/` - SQL patterns and best practices
- `.agents/skills/data/supabase-postgres-best-practices/` - Advanced Postgres optimization
