-- migration: create_campaigns_sprints
-- description: P1 campaigns and sprints tables for 90-day validation plan
-- task_ref: 04-sprint-plan
-- depends_on: startups

-- ============================================================
-- campaigns: top-level 90-day validation plans
-- ============================================================
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  name text not null default '90-Day Validation Plan',
  status text not null default 'draft' check (status in ('draft','active','completed','archived')),
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.campaigns is '90-day validation campaigns linked to a startup';

create index idx_campaigns_startup_id on public.campaigns (startup_id);

alter table public.campaigns enable row level security;

create policy "select_own_campaigns"
  on public.campaigns for select to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "insert_own_campaigns"
  on public.campaigns for insert to authenticated
  with check (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "update_own_campaigns"
  on public.campaigns for update to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ))
  with check (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

create policy "delete_own_campaigns"
  on public.campaigns for delete to authenticated
  using (startup_id in (
    select id from public.startups where org_id = (select public.user_org_id())
  ));

-- updated_at trigger
create trigger set_campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.update_updated_at_column();

-- ============================================================
-- sprints: 2-week sprints within a campaign (max 6 per campaign)
-- ============================================================
create table public.sprints (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  sprint_number int not null check (sprint_number between 1 and 6),
  name text,
  status text not null default 'designed' check (status in ('designed','running','completed')),
  cards jsonb not null default '[]'::jsonb,
  plan text,
  "do" text,
  "check" text,
  act text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id, sprint_number)
);

comment on table public.sprints is 'Two-week sprints within a 90-day campaign, with PDCA fields';

create index idx_sprints_campaign_id on public.sprints (campaign_id);

alter table public.sprints enable row level security;

create policy "select_own_sprints"
  on public.sprints for select to authenticated
  using (campaign_id in (
    select c.id from public.campaigns c
    join public.startups s on s.id = c.startup_id
    where s.org_id = (select public.user_org_id())
  ));

create policy "insert_own_sprints"
  on public.sprints for insert to authenticated
  with check (campaign_id in (
    select c.id from public.campaigns c
    join public.startups s on s.id = c.startup_id
    where s.org_id = (select public.user_org_id())
  ));

create policy "update_own_sprints"
  on public.sprints for update to authenticated
  using (campaign_id in (
    select c.id from public.campaigns c
    join public.startups s on s.id = c.startup_id
    where s.org_id = (select public.user_org_id())
  ))
  with check (campaign_id in (
    select c.id from public.campaigns c
    join public.startups s on s.id = c.startup_id
    where s.org_id = (select public.user_org_id())
  ));

create policy "delete_own_sprints"
  on public.sprints for delete to authenticated
  using (campaign_id in (
    select c.id from public.campaigns c
    join public.startups s on s.id = c.startup_id
    where s.org_id = (select public.user_org_id())
  ));

-- updated_at trigger
create trigger set_sprints_updated_at
  before update on public.sprints
  for each row execute function public.update_updated_at_column();
