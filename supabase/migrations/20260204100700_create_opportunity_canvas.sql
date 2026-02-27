-- =============================================================================
-- Migration: 20260204100700_create_opportunity_canvas.sql
-- Description: Backfill CREATE TABLE for opportunity_canvas (exists in
--              production but had no CREATE TABLE migration).
--              Table stores AI-generated opportunity analysis with 5 scoring
--              dimensions, barriers, enablers, and recommendation.
-- Affected Tables: opportunity_canvas
-- Dependencies: startups
-- Note: Uses IF NOT EXISTS since the table already exists in production.
--       The vpc_data column is added by a later migration
--       (20260210214504_add_vpc_data_to_opportunity_canvas.sql).
-- =============================================================================

-- =============================================================================
-- 1. TABLE: opportunity_canvas
-- =============================================================================

create table if not exists public.opportunity_canvas (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,

  -- scoring dimensions (0-100 each)
  market_readiness integer,
  technical_feasibility integer,
  competitive_advantage integer,
  execution_capability integer,
  timing_score integer,

  -- weighted composite score (0-100)
  opportunity_score integer,

  -- structured analysis
  adoption_barriers jsonb,
  enablers jsonb,

  -- text analysis
  strategic_fit text,
  recommendation text,
  reasoning text,

  -- timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================================================
-- 2. INDEXES
-- =============================================================================

-- FK index for startup_id lookups and cascading deletes
create index if not exists idx_opportunity_canvas_startup_id
  on public.opportunity_canvas(startup_id);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.opportunity_canvas enable row level security;

-- Users can only access opportunity canvases for startups in their org
-- (org membership verified via org_members join through startups.org_id)

do $$ begin
  create policy "Users can view opportunity canvas for their startups"
    on public.opportunity_canvas for select
    to authenticated
    using (
      startup_id in (
        select s.id from public.startups s
        join public.org_members om on s.org_id = om.org_id
        where om.user_id = (select auth.uid()) and om.status = 'active'
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can insert opportunity canvas for their startups"
    on public.opportunity_canvas for insert
    to authenticated
    with check (
      startup_id in (
        select s.id from public.startups s
        join public.org_members om on s.org_id = om.org_id
        where om.user_id = (select auth.uid()) and om.status = 'active'
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can update opportunity canvas for their startups"
    on public.opportunity_canvas for update
    to authenticated
    using (
      startup_id in (
        select s.id from public.startups s
        join public.org_members om on s.org_id = om.org_id
        where om.user_id = (select auth.uid()) and om.status = 'active'
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users can delete opportunity canvas for their startups"
    on public.opportunity_canvas for delete
    to authenticated
    using (
      startup_id in (
        select s.id from public.startups s
        join public.org_members om on s.org_id = om.org_id
        where om.user_id = (select auth.uid()) and om.status = 'active'
      )
    );
exception when duplicate_object then null;
end $$;

-- =============================================================================
-- 4. COMMENTS
-- =============================================================================

comment on table public.opportunity_canvas is
  'AI-generated opportunity analysis with 5 scoring dimensions, barriers/enablers, and recommendation';

comment on column public.opportunity_canvas.market_readiness is
  'Score 0-100: demand signals, buyer awareness, market maturity, regulatory environment';

comment on column public.opportunity_canvas.technical_feasibility is
  'Score 0-100: tech stack complexity, talent availability, time to build';

comment on column public.opportunity_canvas.competitive_advantage is
  'Score 0-100: moats, network effects, IP, switching costs';

comment on column public.opportunity_canvas.execution_capability is
  'Score 0-100: team experience, resources, track record';

comment on column public.opportunity_canvas.timing_score is
  'Score 0-100: market cycle position, technology readiness, regulatory tailwinds';

comment on column public.opportunity_canvas.opportunity_score is
  'Weighted composite: market*0.25 + tech*0.20 + competitive*0.20 + execution*0.20 + timing*0.15';

comment on column public.opportunity_canvas.adoption_barriers is
  'JSON array of {title, description, severity} objects identifying barriers to adoption';

comment on column public.opportunity_canvas.enablers is
  'JSON array of {title, description, impact} objects identifying opportunity enablers';

comment on column public.opportunity_canvas.recommendation is
  'One of: pursue, explore, defer, reject — based on composite score and analysis';
