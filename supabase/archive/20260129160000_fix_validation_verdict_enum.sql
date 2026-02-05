-- =============================================================================
-- Migration: Fix validation_reports.verdict to allow 'needs_work'
-- Purpose: get_validation_verdict(score) returns 'needs_work' for 40-59 but
--          validation_reports.verdict previously allowed only go/conditional/pivot/no-go.
-- See: tasks/validator/00.1-validator-verification.md
-- =============================================================================

-- Drop existing check constraint (Postgres names it validation_reports_verdict_check when inline)
alter table if exists public.validation_reports
  drop constraint if exists validation_reports_verdict_check;

-- Allow needs_work so get_validation_verdict() result can be stored
alter table public.validation_reports
  add constraint validation_reports_verdict_check
  check (verdict in ('go', 'conditional', 'needs_work', 'pivot', 'no-go'));

comment on column public.validation_reports.verdict is 'Validation verdict: go, conditional, needs_work (40-59), pivot, no-go';
