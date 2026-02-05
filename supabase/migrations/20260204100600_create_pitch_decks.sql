-- =============================================================================
-- migration: 20260204100600_create_pitch_decks.sql
-- purpose: create pitch_decks and pitch_deck_slides tables
-- affected tables: pitch_decks, pitch_deck_slides
-- dependencies: startups
-- =============================================================================

-- =============================================================================
-- 1. table: pitch_decks
-- =============================================================================

-- pitch_decks stores pitch deck metadata and settings
-- the actual slides are in pitch_deck_slides
create table if not exists public.pitch_decks (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  startup_id uuid not null references public.startups(id) on delete cascade,

  -- deck details
  title text not null default 'Pitch Deck',
  description text,

  -- deck type and stage
  deck_type text not null default 'investor' check (deck_type in ('investor', 'demo', 'sales', 'internal')),
  funding_stage text check (funding_stage in ('pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth')),

  -- status
  status text not null default 'draft' check (status in ('draft', 'review', 'final', 'archived')),

  -- versioning
  version integer not null default 1,
  is_current boolean not null default true,
  parent_version_id uuid references public.pitch_decks(id) on delete set null,

  -- sharing
  share_token text unique,
  is_public boolean not null default false,

  -- ai metadata
  ai_generated boolean default false,
  completeness_score integer default 0 check (completeness_score >= 0 and completeness_score <= 100),

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comment
comment on table public.pitch_decks is 'Pitch deck metadata with versioning and sharing support.';
comment on column public.pitch_decks.deck_type is 'Deck purpose: investor, demo, sales, or internal.';
comment on column public.pitch_decks.funding_stage is 'Target funding stage: pre-seed through growth.';
comment on column public.pitch_decks.share_token is 'Unique token for shareable link access.';

-- =============================================================================
-- 2. table: pitch_deck_slides
-- =============================================================================

-- pitch_deck_slides stores individual slides within a deck
create table if not exists public.pitch_deck_slides (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  deck_id uuid not null references public.pitch_decks(id) on delete cascade,

  -- slide content
  slide_type text not null, -- 'title', 'problem', 'solution', 'market', 'product', 'traction', 'team', 'financials', 'ask', 'contact', 'custom'
  title text,
  content text,
  notes text, -- speaker notes

  -- ordering
  position integer not null,

  -- visual elements
  layout text default 'default', -- 'default', 'image-left', 'image-right', 'full-image', 'split'
  image_url text,
  chart_data jsonb, -- for slides with charts

  -- ai metadata
  ai_generated boolean default false,
  ai_suggestions jsonb default '{}'::jsonb,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- ensure unique position per deck
  unique (deck_id, position)
);

-- add table comment
comment on table public.pitch_deck_slides is 'Individual slides within a pitch deck.';
comment on column public.pitch_deck_slides.slide_type is 'Slide type: title, problem, solution, market, product, traction, team, financials, ask, contact, or custom.';
comment on column public.pitch_deck_slides.layout is 'Visual layout template for the slide.';

-- =============================================================================
-- 3. indexes
-- =============================================================================

-- pitch_decks indexes
create index if not exists idx_pitch_decks_startup_id
  on public.pitch_decks(startup_id);

create index if not exists idx_pitch_decks_current
  on public.pitch_decks(startup_id, is_current)
  where is_current = true;

create index if not exists idx_pitch_decks_share_token
  on public.pitch_decks(share_token)
  where share_token is not null;

create index if not exists idx_pitch_decks_parent
  on public.pitch_decks(parent_version_id)
  where parent_version_id is not null;

-- pitch_deck_slides indexes
create index if not exists idx_pitch_deck_slides_deck_id
  on public.pitch_deck_slides(deck_id);

create index if not exists idx_pitch_deck_slides_position
  on public.pitch_deck_slides(deck_id, position);

-- =============================================================================
-- 4. triggers
-- =============================================================================

-- auto-update updated_at timestamp for pitch_decks
create trigger trigger_pitch_decks_updated_at
  before update on public.pitch_decks
  for each row
  execute function public.handle_updated_at();

-- auto-update updated_at timestamp for pitch_deck_slides
create trigger trigger_pitch_deck_slides_updated_at
  before update on public.pitch_deck_slides
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- 5. row level security: pitch_decks
-- =============================================================================

alter table public.pitch_decks enable row level security;

-- select: authenticated users can view decks for their org's startups
-- or public decks via share token
create policy "users can view pitch decks for their startups"
  on public.pitch_decks
  for select
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- select: anon can view public decks
create policy "anyone can view public pitch decks"
  on public.pitch_decks
  for select
  to anon
  using (is_public = true);

-- insert: authenticated users can create decks for their org's startups
create policy "users can create pitch decks"
  on public.pitch_decks
  for insert
  to authenticated
  with check (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: authenticated users can update their org's pitch decks
create policy "users can update pitch decks"
  on public.pitch_decks
  for update
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- delete: authenticated users can delete their org's pitch decks
create policy "users can delete pitch decks"
  on public.pitch_decks
  for delete
  to authenticated
  using (
    startup_id in (
      select s.id
      from public.startups s
      where s.org_id = (select public.user_org_id())
    )
  );

-- service role: full access
create policy "service role has full access to pitch decks"
  on public.pitch_decks
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- 6. row level security: pitch_deck_slides
-- =============================================================================

alter table public.pitch_deck_slides enable row level security;

-- select: users can view slides for decks they can access
create policy "users can view slides for accessible decks"
  on public.pitch_deck_slides
  for select
  to authenticated
  using (
    deck_id in (
      select pd.id
      from public.pitch_decks pd
      join public.startups s on s.id = pd.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- select: anon can view slides for public decks
create policy "anyone can view slides for public decks"
  on public.pitch_deck_slides
  for select
  to anon
  using (
    deck_id in (
      select pd.id
      from public.pitch_decks pd
      where pd.is_public = true
    )
  );

-- insert: users can create slides for their org's decks
create policy "users can create slides"
  on public.pitch_deck_slides
  for insert
  to authenticated
  with check (
    deck_id in (
      select pd.id
      from public.pitch_decks pd
      join public.startups s on s.id = pd.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- update: users can update slides for their org's decks
create policy "users can update slides"
  on public.pitch_deck_slides
  for update
  to authenticated
  using (
    deck_id in (
      select pd.id
      from public.pitch_decks pd
      join public.startups s on s.id = pd.startup_id
      where s.org_id = (select public.user_org_id())
    )
  )
  with check (
    deck_id in (
      select pd.id
      from public.pitch_decks pd
      join public.startups s on s.id = pd.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- delete: users can delete slides for their org's decks
create policy "users can delete slides"
  on public.pitch_deck_slides
  for delete
  to authenticated
  using (
    deck_id in (
      select pd.id
      from public.pitch_decks pd
      join public.startups s on s.id = pd.startup_id
      where s.org_id = (select public.user_org_id())
    )
  );

-- service role: full access
create policy "service role has full access to slides"
  on public.pitch_deck_slides
  for all
  to service_role
  using (true)
  with check (true);

-- =============================================================================
-- end of migration: 20260204100600_create_pitch_decks.sql
-- =============================================================================
