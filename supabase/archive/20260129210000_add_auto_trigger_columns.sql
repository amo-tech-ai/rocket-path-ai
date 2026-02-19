-- ============================================================================
-- Migration: Add Auto-Trigger Columns for Agent-Driven Selection
-- Description: Enables automatic pack selection based on route/intent
-- Author: StartupAI
-- Created: 2026-01-29
-- ============================================================================

-- Add auto-trigger columns to prompt_packs
alter table prompt_packs add column if not exists trigger_intents text[] default '{}';
alter table prompt_packs add column if not exists auto_trigger_routes text[] default '{}';
alter table prompt_packs add column if not exists priority int default 0;

-- Add name column to steps (short identifier)
alter table prompt_pack_steps add column if not exists name text;

-- Add apply_to column to steps (auto-apply targets)
alter table prompt_pack_steps add column if not exists apply_to text[] default '{}';

-- Add applied_to tracking to prompt_runs
alter table prompt_runs add column if not exists applied_to text[];
alter table prompt_runs add column if not exists applied_at timestamptz;

-- Comments
comment on column prompt_packs.trigger_intents is 'Keywords that trigger this pack: validate, sharpen, competitor';
comment on column prompt_packs.auto_trigger_routes is 'Routes that auto-trigger this pack: /onboarding/1, /validator';
comment on column prompt_packs.priority is 'Selection priority when multiple packs match (higher = preferred)';
comment on column prompt_pack_steps.name is 'Short identifier: problem_snapshot, competitor_list';
comment on column prompt_pack_steps.apply_to is 'Auto-apply targets: profile, canvas, tasks, validation, slides';
comment on column prompt_runs.applied_to is 'Which targets were updated after run';
comment on column prompt_runs.applied_at is 'When outputs were applied to DB';

-- Indexes for auto-trigger
create index if not exists idx_prompt_packs_trigger_intents on prompt_packs using gin(trigger_intents);
create index if not exists idx_prompt_packs_auto_routes on prompt_packs using gin(auto_trigger_routes);
create index if not exists idx_prompt_packs_priority on prompt_packs(priority desc);

-- ============================================================================
-- FUNCTION: search_best_pack (agent-driven selection)
-- ============================================================================
create or replace function search_best_pack(
  p_module text,
  p_industry text default null,
  p_stage text default null,
  p_route text default null,
  p_intent text default null
)
returns table (
  pack_id uuid,
  title text,
  slug text,
  category text,
  step_count bigint,
  first_step_id uuid,
  first_step_name text,
  match_score int
)
language sql stable
security definer
as $$
  with module_categories as (
    select unnest(case p_module
      when 'onboarding' then array['validation', 'ideation', 'market']
      when 'canvas' then array['canvas', 'pricing', 'gtm']
      when 'pitch' then array['pitch']
      when 'validation' then array['validation', 'market']
      when 'gtm' then array['gtm', 'pricing']
      when 'pricing' then array['pricing']
      when 'market' then array['market']
      when 'ideation' then array['ideation']
      when 'funding' then array['funding']
      when 'founder-fit' then array['hiring']
      else array[p_module]
    end) as cat
  ),
  scored_packs as (
    select
      pp.id,
      pp.title,
      pp.slug,
      pp.category,
      pp.priority,
      count(pps.id) as step_count,
      (
        -- Base score for category match
        10 +
        -- Route match bonus
        case when p_route is not null and p_route = any(pp.auto_trigger_routes) then 20 else 0 end +
        -- Intent match bonus
        case when p_intent is not null and p_intent = any(pp.trigger_intents) then 15 else 0 end +
        -- Industry match bonus
        case when p_industry is not null and lower(p_industry) = any(pp.industry_tags) then 10 else 0 end +
        -- Stage match bonus
        case when p_stage is not null and lower(p_stage) = any(pp.stage_tags) then 5 else 0 end +
        -- Priority bonus
        pp.priority
      ) as match_score
    from prompt_packs pp
    left join prompt_pack_steps pps on pps.pack_id = pp.id
    where pp.is_active = true
      and pp.category in (select cat from module_categories)
    group by pp.id
  )
  select
    sp.id as pack_id,
    sp.title,
    sp.slug,
    sp.category,
    sp.step_count,
    fs.id as first_step_id,
    fs.name as first_step_name,
    sp.match_score::int
  from scored_packs sp
  left join lateral (
    select pps.id, pps.name
    from prompt_pack_steps pps
    where pps.pack_id = sp.id
    order by pps.step_order
    limit 1
  ) fs on true
  order by sp.match_score desc, sp.step_count desc
  limit 5;
$$;

comment on function search_best_pack is 'Find best matching pack using route, intent, industry, and stage';

-- Grant to authenticated users
grant execute on function search_best_pack(text, text, text, text, text) to authenticated;

-- ============================================================================
-- FUNCTION: get_auto_apply_targets (determine what to update)
-- ============================================================================
create or replace function get_auto_apply_targets(p_step_id uuid)
returns text[]
language sql stable
security definer
as $$
  select coalesce(apply_to, '{}')
  from prompt_pack_steps
  where id = p_step_id;
$$;

grant execute on function get_auto_apply_targets(uuid) to authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
