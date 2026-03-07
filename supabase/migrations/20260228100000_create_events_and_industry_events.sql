-- Create events + industry_events tables and supporting enums.
-- These tables exist on remote but were never captured in a migration.
-- Required by events_directory view (20260305100000, 20260306120000).
-- All enums and tables use IF NOT EXISTS for idempotency.
-- RLS policies follow .cursor/rules/supabase/supabase-create-rls-policies.mdc:
--   separate policies per operation, (select auth.uid()) for caching,
--   UPDATE has both USING and WITH CHECK, no service_role policies.

-- ============================================================
-- 1. Create enums (IF NOT EXISTS via DO block)
-- ============================================================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_type') then
    create type public.event_type as enum (
      'meeting', 'deadline', 'reminder', 'milestone', 'call', 'demo',
      'pitch', 'funding_round', 'other', 'demo_day', 'pitch_night',
      'networking', 'workshop', 'conference', 'meetup', 'webinar', 'hackathon'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'event_status') then
    create type public.event_status as enum (
      'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'event_scope') then
    create type public.event_scope as enum ('internal', 'hosted', 'external');
  end if;

  if not exists (select 1 from pg_type where typname = 'event_category') then
    create type public.event_category as enum (
      'research', 'industry', 'startup_vc', 'trade_show',
      'enterprise', 'government_policy', 'developer'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'attending_status') then
    create type public.attending_status as enum (
      'interested', 'registered', 'attending', 'attended', 'not_attending'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'event_location_type') then
    create type public.event_location_type as enum ('in_person', 'virtual', 'hybrid');
  end if;

  if not exists (select 1 from pg_type where typname = 'event_format') then
    create type public.event_format as enum ('in_person', 'virtual', 'hybrid');
  end if;

  if not exists (select 1 from pg_type where typname = 'ticket_cost_tier') then
    create type public.ticket_cost_tier as enum ('free', 'low', 'medium', 'high', 'premium');
  end if;

  if not exists (select 1 from pg_type where typname = 'media_pass_status') then
    create type public.media_pass_status as enum ('yes', 'no', 'unclear');
  end if;
end
$$;

-- ============================================================
-- 2. Create events table
-- ============================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references public.startups(id) on delete cascade,
  title text not null,
  description text,
  event_type event_type not null default 'other'::event_type,
  status event_status not null default 'scheduled'::event_status,
  start_date timestamptz not null,
  end_date timestamptz,
  all_day boolean default false,
  location text,
  virtual_meeting_url text,
  attendees jsonb default '[]'::jsonb,
  related_contact_id uuid references public.contacts(id) on delete set null,
  related_deal_id uuid references public.deals(id) on delete set null,
  related_project_id uuid references public.projects(id) on delete set null,
  reminder_minutes integer default 15,
  recurrence_rule text,
  color text,
  metadata jsonb default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  event_scope event_scope not null default 'internal'::event_scope,
  name text,
  slug text unique,
  timezone text default 'UTC'::text,
  location_type event_location_type default 'in_person'::event_location_type,
  capacity integer,
  registration_url text,
  registration_deadline timestamptz,
  is_public boolean default false,
  requires_approval boolean default false,
  budget numeric default 0,
  ticket_price numeric default 0,
  health_score integer default 0,
  tasks_total integer default 0,
  tasks_completed integer default 0,
  sponsors_target integer default 0,
  sponsors_confirmed integer default 0,
  agenda jsonb default '[]'::jsonb,
  tags text[] default '{}'::text[],
  cover_image_url text,
  published_at timestamptz,
  cancelled_at timestamptz,
  external_url text,
  organizer_name text,
  organizer_logo_url text,
  relevance_score integer default 0,
  attending_status attending_status,
  source text,
  discovered_at timestamptz,
  cfp_deadline timestamptz,
  cfp_url text,
  is_featured boolean default false,
  industry text,
  target_audience text[]
);

comment on table public.events is 'Startup events: meetings, pitches, milestones, hosted events, external events';

-- RLS
alter table public.events enable row level security;

-- SELECT: org members see their events + external events; anon sees public
create policy "authenticated_select_events"
  on public.events for select to authenticated
  using (startup_in_org(startup_id) or (event_scope = 'external'::event_scope));

create policy "anon can view public external events"
  on public.events for select to anon
  using ((event_scope = 'external'::event_scope) and (is_public = true));

create policy "anon can view public hosted events"
  on public.events for select to anon
  using ((event_scope = 'hosted'::event_scope) and (is_public = true));

-- INSERT
create policy "users can create events in their org"
  on public.events for insert to authenticated
  with check (startup_in_org(startup_id));

-- UPDATE (both USING and WITH CHECK per best practices)
create policy "users can update events in their org"
  on public.events for update to authenticated
  using (startup_in_org(startup_id))
  with check (startup_in_org(startup_id));

-- DELETE
create policy "users can delete events in their org"
  on public.events for delete to authenticated
  using (startup_in_org(startup_id));

-- Indexes
create index if not exists idx_events_startup_date on public.events (startup_id, start_date);
create index if not exists idx_events_startup_scope on public.events (startup_id, event_scope);
create index if not exists idx_events_start_date on public.events (start_date);
create index if not exists idx_events_event_type on public.events (event_type);
create index if not exists idx_events_created_by on public.events (created_by);
create index if not exists idx_events_related_contact_id on public.events (related_contact_id);
create index if not exists idx_events_related_deal_id on public.events (related_deal_id);
create index if not exists idx_events_related_project_id on public.events (related_project_id);

-- ============================================================
-- 3. Create industry_events table
-- ============================================================
create table if not exists public.industry_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  full_name text,
  slug text unique,
  description text,
  categories event_category[] default '{}'::event_category[],
  topics text[] default '{}'::text[],
  audience_types text[] default '{}'::text[],
  event_date date,
  end_date date,
  dates_confirmed boolean default false,
  typical_month text,
  timezone text default 'UTC'::text,
  location_city text,
  location_country text,
  venue text,
  format event_format default 'in_person'::event_format,
  ticket_cost_tier ticket_cost_tier default 'medium'::ticket_cost_tier,
  ticket_cost_min numeric,
  ticket_cost_max numeric,
  startup_relevance integer default 3,
  expected_attendance integer,
  website_url text,
  twitter_handle text,
  linkedin_url text,
  youtube_url text,
  cfp_url text,
  registration_url text,
  media_pass_available media_pass_status default 'unclear'::media_pass_status,
  notable_speakers text[] default '{}'::text[],
  tags text[] default '{}'::text[],
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  image_url text,
  image_path text,
  enriched_at timestamptz,
  enrichment_status text,
  source_domain text,
  enrichment_metadata jsonb default '{}'::jsonb,
  cloudinary_public_id text,
  cloudinary_version integer,
  cloudinary_folder text default 'industry-events'::text
);

comment on table public.industry_events is 'Curated directory of industry events (conferences, meetups, trade shows) relevant to startups';

-- RLS
alter table public.industry_events enable row level security;

-- SELECT: everyone can read
create policy "Anon users can read industry events"
  on public.industry_events for select to anon
  using (true);

create policy "Authenticated users can read industry events"
  on public.industry_events for select to authenticated
  using (true);

-- INSERT/UPDATE/DELETE: admin only
create policy "Admin users can insert industry events"
  on public.industry_events for insert to authenticated
  with check (has_role((select auth.uid()), 'admin'::app_role));

create policy "Admin users can update industry events"
  on public.industry_events for update to authenticated
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));

create policy "Admin users can delete industry events"
  on public.industry_events for delete to authenticated
  using (has_role((select auth.uid()), 'admin'::app_role));

-- Indexes
create index if not exists idx_industry_events_event_date on public.industry_events (event_date);
create index if not exists idx_industry_events_startup_relevance on public.industry_events (startup_relevance desc);
