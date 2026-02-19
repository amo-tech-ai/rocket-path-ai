-- migration: create_knowledge_map
-- description: P2 strategic knowledge map with 5 dimensions
-- task_ref: 23-knowledge-map
-- depends_on: startups

-- ============================================================
-- knowledge_map: confidence tracking across 5 knowledge dimensions
-- ============================================================
create table public.knowledge_map (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  dimension text not null check (dimension in ('customer','market','product','business_model','technology')),
  confidence_score int not null default 0 check (confidence_score between 0 and 100),
  source_tier text not null default 'T4' check (source_tier in ('T1','T2','T3','T4')),
  evidence_count int not null default 0,
  key_insights jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  last_updated_from text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (startup_id, dimension)
);

comment on table public.knowledge_map is 'Strategic knowledge confidence across 5 dimensions per startup';

create index idx_knowledge_map_startup_id on public.knowledge_map (startup_id);

alter table public.knowledge_map enable row level security;

create policy "select_own_knowledge_map"
  on public.knowledge_map for select to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "insert_own_knowledge_map"
  on public.knowledge_map for insert to authenticated
  with check (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "update_own_knowledge_map"
  on public.knowledge_map for update to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ))
  with check (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "delete_own_knowledge_map"
  on public.knowledge_map for delete to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

-- updated_at trigger
create trigger set_knowledge_map_updated_at
  before update on public.knowledge_map
  for each row execute function public.update_updated_at_column();
