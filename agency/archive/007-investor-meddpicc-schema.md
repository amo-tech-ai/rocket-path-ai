---
task_id: 006-IMS
title: Investor MEDDPICC Schema
phase: MVP
priority: P1
status: Not Started
estimated_effort: 0.5 day
skill: [data, supabase-auth]
subagents: [supabase-expert, security-auditor]
edge_function: none (schema only)
schema_tables: [investors]
depends_on: []
---

| Aspect | Details |
|--------|---------|
| **Screens** | None (schema migration only) |
| **Features** | MEDDPICC score column, deal verdict, signal data |
| **Edge Functions** | None |
| **Real-World** | "The investors table now has columns to store MEDDPICC scores and deal verdicts" |

## Description

**The situation:** The `investors` table tracks investor records with basic fields (name, type, focus, check_size, etc.) but has no columns for structured deal scoring. MEDDPICC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify Pain, Champion, Competition) is the industry-standard B2B sales framework, scoring 8 dimensions × 5 points = /40 max.

**Why it matters:** Without structured scoring, investor prioritization is gut-feel. MEDDPICC gives founders an objective way to rank investor conversations by deal readiness. This migration is a prerequisite for task 007 (wiring the investor-agent to compute MEDDPICC scores).

**What already exists:**
- `investors` table — id, org_id, name, type, focus_areas, check_size_min, check_size_max, status, notes, etc.
- RLS policies on investors table (org-based isolation via `user_org_id()`)
- `supabase/functions/investor-agent/index.ts` — 12-action agent (currently no MEDDPICC)

**The build:**
- Migration: `ALTER TABLE investors ADD COLUMN meddpicc_score int`
- Migration: `ALTER TABLE investors ADD COLUMN deal_verdict text` (Strong Buy / Buy / Hold / Pass)
- Migration: `ALTER TABLE investors ADD COLUMN signal_data jsonb DEFAULT '{}'::jsonb`
- Add CHECK constraint: `meddpicc_score >= 0 AND meddpicc_score <= 40`
- Add CHECK constraint: `deal_verdict IN ('strong_buy', 'buy', 'hold', 'pass')`
- Create index on `meddpicc_score` for sorting
- No RLS changes needed — existing policies cover new columns

**Example:** The migration adds 3 columns. After running, `SELECT meddpicc_score, deal_verdict, signal_data FROM investors` returns NULLs for all existing rows. Task 007 wires the investor-agent to populate these.

## Rationale
**Problem:** No structured storage for investor deal scoring.
**Solution:** Three new columns on existing investors table with validation constraints.
**Impact:** Enables MEDDPICC scoring (task 007), detail sheets (task 020), and export overlays (task 016).

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | schema ready for MEDDPICC data | investor-agent can write scores |
| Founder | investors table supports deal verdicts | pipeline can show Strong Buy / Pass pills |
| DBA | constraints on score and verdict | invalid data can't be inserted |

## Goals
1. **Primary:** 3 new columns on investors table with validation
2. **Quality:** Migration is backward-compatible (all NULLable)

## Acceptance Criteria
- [ ] `meddpicc_score int` column added (nullable, CHECK 0-40)
- [ ] `deal_verdict text` column added (nullable, CHECK valid values)
- [ ] `signal_data jsonb` column added (default empty object)
- [ ] Index on `meddpicc_score` for ORDER BY queries
- [ ] Existing investors table data unaffected
- [ ] Existing RLS policies cover new columns (no changes needed)
- [ ] Migration runs cleanly on production

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/YYYYMMDD_investor_meddpicc_columns.sql` | Create |

### Schema Changes

#### Table: investors (ALTER)
| Column | Type | Constraints |
|--------|------|-------------|
| meddpicc_score | int | CHECK (meddpicc_score >= 0 AND meddpicc_score <= 40) |
| deal_verdict | text | CHECK (deal_verdict IN ('strong_buy', 'buy', 'hold', 'pass')) |
| signal_data | jsonb | DEFAULT '{}'::jsonb |

#### Indexes
| Index | Column | Purpose |
|-------|--------|---------|
| idx_investors_meddpicc_score | meddpicc_score | Sort investors by score |

#### RLS
No changes — existing org-based policies on investors table apply to new columns automatically.

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Existing investors with no score | meddpicc_score is NULL — no errors |
| Score outside 0-40 range | CHECK constraint rejects INSERT/UPDATE |
| Invalid deal_verdict value | CHECK constraint rejects |
| signal_data as complex nested JSON | jsonb accepts any valid JSON structure |

## Real-World Examples

**Scenario 1 — Clean migration:** The investors table has 50 rows. Migration runs, adds 3 columns, all NULL. No data loss, no downtime. Frontend query `SELECT * FROM investors ORDER BY meddpicc_score DESC NULLS LAST` works immediately.

**Scenario 2 — Constraint enforcement:** After task 007 wires the investor-agent, it tries to INSERT meddpicc_score = 45 (above max). **With the CHECK constraint,** the database rejects it with a clear error, preventing invalid data.

## Outcomes

| Before | After |
|--------|-------|
| No columns for deal scoring | meddpicc_score (0-40), deal_verdict, signal_data |
| No validation on score range | CHECK constraints enforce 0-40 and valid verdicts |
| No index for score sorting | Index enables fast ORDER BY meddpicc_score |
| N/A | Zero-downtime migration — all columns nullable |
