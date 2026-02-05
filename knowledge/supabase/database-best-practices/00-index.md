# Supabase Database - Best Practices Guide

**Version:** 1.0  
**Date:** January 27, 2025  
**Status:** ✅ Production-Ready  
**Source:** Official Supabase Documentation + Project-Specific Patterns

---

## Overview

This guide provides comprehensive best practices for designing, querying, and optimizing Supabase PostgreSQL databases. It's based on official Supabase documentation and tailored for StartupAI's schema.

---

## Document Structure

### Core Schema Design

| Document | Title | Focus |
|----------|-------|-------|
| [01-tables-schema.md](./01-tables-schema.md) | Tables & Schema Design | Table creation, primary keys, data types, columns |
| [02-arrays.md](./02-arrays.md) | Working with Arrays | Array columns, querying arrays, array operations |
| [03-indexes.md](./03-indexes.md) | Indexes & Performance | B-Tree indexes, partial indexes, query optimization |
| [04-joins-relationships.md](./04-joins-relationships.md) | Joins & Relationships | Foreign keys, one-to-many, many-to-many, nested queries |
| [05-json-jsonb.md](./05-json-jsonb.md) | JSON & JSONB | Unstructured data, JSON queries, validation |
| [06-enums.md](./06-enums.md) | Enums & Custom Types | Enum creation, when to use, managing enum values |

### Database Functions & Automation

| Document | Title | Focus |
|----------|-------|-------|
| [07-database-functions.md](./07-database-functions.md) | Database Functions | PostgreSQL functions, SECURITY DEFINER/INVOKER, volatility |
| [08-triggers.md](./08-triggers.md) | Triggers | Table triggers, event triggers, trigger functions |
| [09-webhooks.md](./09-webhooks.md) | Database Webhooks | HTTP webhooks, event-driven patterns, integrations |
| [10-partitions.md](./10-partitions.md) | Table Partitioning | Range/list/hash partitions, performance, maintenance |

### Security & Access Control

| Document | Title | Focus |
|----------|-------|-------|
| [11-row-level-security.md](./11-row-level-security.md) | Row-Level Security | RLS policies, performance, helper functions |
| [12-column-level-security.md](./12-column-level-security.md) | Column-Level Security | Column masking, selective access, views |
| [13-rbac-custom-claims.md](./13-rbac-custom-claims.md) | RBAC & Custom Claims | JWT claims, role-based access, app_metadata |
| [14-roles.md](./14-roles.md) | PostgreSQL Roles | Custom roles, permissions, role hierarchy |

### Performance & Optimization

| Document | Title | Focus |
|----------|-------|-------|
| [15-configuration.md](./15-configuration.md) | PostgreSQL Configuration | Memory settings, connection pooling, tuning |
| [16-query-optimization.md](./16-query-optimization.md) | Query Optimization | EXPLAIN ANALYZE, index strategies, query patterns |
| [17-database-advisors.md](./17-database-advisors.md) | Database Advisors | Supabase advisors, recommendations, automation |

### Implementation

| Document | Title | Focus |
|----------|-------|-------|
| [18-implementation-plan.md](./18-implementation-plan.md) | Implementation Plan | Systematic approach, phases, verification |

---

## Quick Reference

### Essential Patterns

**Table Creation:**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
-- B-Tree index
CREATE INDEX idx_tasks_org_id ON tasks(org_id);

-- Partial index
CREATE INDEX idx_active_tasks ON tasks(org_id) WHERE status = 'active';

-- Composite index
CREATE INDEX idx_tasks_org_status ON tasks(org_id, status);
```

**Foreign Keys:**
```sql
ALTER TABLE tasks
  ADD COLUMN user_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Always index foreign keys
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

**Database Functions:**
```sql
CREATE OR REPLACE FUNCTION public.calculate_total(amount numeric)
RETURNS numeric
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
STABLE
AS $$
BEGIN
  RETURN amount * 1.1;
END;
$$;
```

**Triggers:**
```sql
CREATE TRIGGER handle_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

**RLS Policies:**
```sql
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));
```

**JSONB:**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY,
  metadata JSONB NOT NULL
);

-- Query JSONB
SELECT metadata->>'action' FROM events WHERE metadata->>'status' = 'completed';

-- Index JSONB
CREATE INDEX idx_events_metadata_gin ON events USING gin(metadata);
```

---

## Project-Specific Patterns

### Multi-Tenant Isolation

All tables must include `org_id` for multi-tenant isolation:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
  -- ... other columns
);

-- Index for org-based queries
CREATE INDEX idx_tasks_org_id ON tasks(org_id);
```

### RLS Policies

All tables should have Row Level Security enabled:

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their org's tasks"
  ON tasks FOR SELECT
  USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
```

---

## Cross-References

- **Schema Documentation:** [`../01-new-supabase.md`](../01-new-supabase.md)
- **Edge Functions Best Practices:** [`../best-practices/`](../best-practices/)
- **Audit Report:** [`../04-audit.md`](../04-audit.md)
- **Cursor Rules:** [`../../.cursor/rules/supabase/`](../../.cursor/rules/supabase/)

## Related Topics

### Security
- **RLS:** [11-row-level-security.md](./11-row-level-security.md)
- **Column Security:** [12-column-level-security.md](./12-column-level-security.md)
- **RBAC:** [13-rbac-custom-claims.md](./13-rbac-custom-claims.md)
- **Roles:** [14-roles.md](./14-roles.md)

### Performance
- **Indexes:** [03-indexes.md](./03-indexes.md)
- **Query Optimization:** [16-query-optimization.md](./16-query-optimization.md)
- **Configuration:** [15-configuration.md](./15-configuration.md)
- **Advisors:** [17-database-advisors.md](./17-database-advisors.md)

### Automation
- **Functions:** [07-database-functions.md](./07-database-functions.md)
- **Triggers:** [08-triggers.md](./08-triggers.md)
- **Webhooks:** [09-webhooks.md](./09-webhooks.md)
- **Partitions:** [10-partitions.md](./10-partitions.md)

---

## Implementation Roadmap

**Quick Start:** See [`18-implementation-plan.md`](./18-implementation-plan.md) for systematic implementation approach

**Priority Order:**
1. **Foundation** (Week 1-2): RLS, helper functions, schema review
2. **Performance** (Week 3-4): Indexes, query optimization
3. **Security** (Week 5-6): RBAC, column security, policy optimization
4. **Automation** (Week 7-8): Triggers, webhooks, audit logging
5. **Advanced** (Week 9-12): Partitioning, advanced functions, configuration

---

**Last Updated:** January 27, 2025  
**Maintained By:** Engineering Team  
**Total Documents:** 18 comprehensive guides
