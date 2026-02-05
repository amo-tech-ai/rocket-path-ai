-- =============================================================================
-- Migration: Create Industry Events Table
-- Purpose: Store reference data for major AI conferences and tech events
-- Description: This table provides founders with a curated database of
--              AI events they can attend for networking, learning, and exposure.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Step 1: Create enums for event categorization
-- -----------------------------------------------------------------------------

-- Event format enum (in-person, virtual, hybrid)
do $$ begin
    create type public.event_format as enum ('in_person', 'virtual', 'hybrid');
exception
    when duplicate_object then null;
end $$;

-- Event category enum
do $$ begin
    create type public.event_category as enum (
        'research',
        'industry',
        'startup_vc',
        'trade_show',
        'enterprise',
        'government_policy',
        'developer'
    );
exception
    when duplicate_object then null;
end $$;

-- Ticket cost tier enum
do $$ begin
    create type public.ticket_cost_tier as enum ('free', '$', '$$', '$$$', '$$$$');
exception
    when duplicate_object then null;
end $$;

-- Media pass availability enum
do $$ begin
    create type public.media_pass_status as enum ('yes', 'no', 'unclear');
exception
    when duplicate_object then null;
end $$;

-- -----------------------------------------------------------------------------
-- Step 2: Create the industry_events table
-- -----------------------------------------------------------------------------

create table if not exists public.industry_events (
    -- Primary key
    id uuid primary key default gen_random_uuid(),

    -- Basic event information
    name text not null,
    full_name text,
    slug text unique,
    description text,

    -- Categorization (arrays for multi-select)
    categories event_category[] default '{}',
    topics text[] default '{}',
    audience_types text[] default '{}',  -- ['Researchers', 'Founders', 'Investors', 'Enterprise', 'Developers']

    -- Date and timing
    event_date date,
    end_date date,
    dates_confirmed boolean default false,
    typical_month text,  -- For events with TBA dates
    timezone text default 'UTC',

    -- Location
    location_city text,
    location_country text,
    venue text,
    format event_format default 'in_person',

    -- Pricing
    ticket_cost_tier ticket_cost_tier default '$$',
    ticket_cost_min numeric(10, 2),
    ticket_cost_max numeric(10, 2),

    -- Metrics
    startup_relevance integer check (startup_relevance between 1 and 5) default 3,
    expected_attendance integer,

    -- Links
    website_url text,
    twitter_handle text,
    linkedin_url text,
    youtube_url text,
    cfp_url text,  -- Call for Papers
    registration_url text,

    -- Additional info
    media_pass_available media_pass_status default 'unclear',
    notable_speakers text[] default '{}',
    tags text[] default '{}',

    -- Metadata (for additional flexible data)
    metadata jsonb default '{}',

    -- Timestamps
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- -----------------------------------------------------------------------------
-- Step 3: Create indexes for common queries
-- -----------------------------------------------------------------------------

-- Index on event date for calendar queries
create index if not exists idx_industry_events_event_date
    on public.industry_events (event_date);

-- Index on categories for filtering
create index if not exists idx_industry_events_categories
    on public.industry_events using gin (categories);

-- Index on topics for search
create index if not exists idx_industry_events_topics
    on public.industry_events using gin (topics);

-- Index on location for geographic filtering
create index if not exists idx_industry_events_location
    on public.industry_events (location_country, location_city);

-- Index on startup relevance for sorting
create index if not exists idx_industry_events_startup_relevance
    on public.industry_events (startup_relevance desc);

-- Full-text search index on name and description
create index if not exists idx_industry_events_search
    on public.industry_events using gin (
        to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
    );

-- -----------------------------------------------------------------------------
-- Step 4: Create updated_at trigger
-- -----------------------------------------------------------------------------

-- Function to update the updated_at timestamp
create or replace function public.update_industry_events_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Trigger to auto-update updated_at
drop trigger if exists update_industry_events_updated_at on public.industry_events;
create trigger update_industry_events_updated_at
    before update on public.industry_events
    for each row
    execute function public.update_industry_events_updated_at();

-- -----------------------------------------------------------------------------
-- Step 5: Enable Row Level Security
-- Note: This is reference data, so we allow public read access
-- -----------------------------------------------------------------------------

alter table public.industry_events enable row level security;

-- Policy: Anyone can read events (public reference data)
create policy "Anyone can read industry events"
    on public.industry_events
    for select
    to anon, authenticated
    using (true);

-- Policy: Only authenticated users with admin role can insert
-- (This can be expanded later with proper admin checks)
create policy "Authenticated users can insert events"
    on public.industry_events
    for insert
    to authenticated
    with check (true);

-- Policy: Only authenticated users can update events
create policy "Authenticated users can update events"
    on public.industry_events
    for update
    to authenticated
    using (true)
    with check (true);

-- Policy: Only authenticated users can delete events
create policy "Authenticated users can delete events"
    on public.industry_events
    for delete
    to authenticated
    using (true);

-- -----------------------------------------------------------------------------
-- Step 6: Create speaker-event mapping table (for tracking speaker appearances)
-- -----------------------------------------------------------------------------

create table if not exists public.event_speakers (
    id uuid primary key default gen_random_uuid(),

    -- References
    event_id uuid references public.industry_events(id) on delete cascade,

    -- Speaker information
    speaker_name text not null,
    speaker_title text,
    speaker_company text,
    speaker_linkedin text,

    -- Appearance details
    appearance_year integer,
    appearance_type text check (appearance_type in ('keynote', 'panel', 'fireside', 'workshop', 'speaker')),
    is_confirmed boolean default false,

    -- Source verification
    source_url text,

    -- Timestamps
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

-- Index for looking up speakers by event
create index if not exists idx_event_speakers_event_id
    on public.event_speakers (event_id);

-- Index for searching by speaker name
create index if not exists idx_event_speakers_name
    on public.event_speakers (speaker_name);

-- Enable RLS on event_speakers
alter table public.event_speakers enable row level security;

-- Public read access for speaker data
create policy "Anyone can read event speakers"
    on public.event_speakers
    for select
    to anon, authenticated
    using (true);

-- Authenticated users can manage speaker data
create policy "Authenticated users can manage event speakers"
    on public.event_speakers
    for all
    to authenticated
    using (true)
    with check (true);

-- -----------------------------------------------------------------------------
-- Step 7: Create user event tracking table (for users to track events they want to attend)
-- -----------------------------------------------------------------------------

create table if not exists public.user_event_tracking (
    id uuid primary key default gen_random_uuid(),

    -- References
    user_id uuid references auth.users(id) on delete cascade not null,
    event_id uuid references public.industry_events(id) on delete cascade not null,

    -- Tracking status
    status text check (status in ('interested', 'registered', 'attending', 'attended', 'skipped')) default 'interested',

    -- User notes
    notes text,
    reminder_date date,

    -- Timestamps
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,

    -- Unique constraint: one tracking record per user per event
    unique (user_id, event_id)
);

-- Index for user lookups
create index if not exists idx_user_event_tracking_user_id
    on public.user_event_tracking (user_id);

-- Index for event lookups
create index if not exists idx_user_event_tracking_event_id
    on public.user_event_tracking (event_id);

-- Enable RLS
alter table public.user_event_tracking enable row level security;

-- Users can only see their own tracking records
create policy "Users can view own event tracking"
    on public.user_event_tracking
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Users can only insert their own tracking records
create policy "Users can insert own event tracking"
    on public.user_event_tracking
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Users can only update their own tracking records
create policy "Users can update own event tracking"
    on public.user_event_tracking
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Users can only delete their own tracking records
create policy "Users can delete own event tracking"
    on public.user_event_tracking
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Step 8: Add comments for documentation
-- -----------------------------------------------------------------------------

comment on table public.industry_events is 'Reference table of major AI conferences and tech events for founders';
comment on column public.industry_events.startup_relevance is 'Score from 1-5 indicating how relevant the event is for startup founders';
comment on column public.industry_events.ticket_cost_tier is 'Price tier: free, $ (<$500), $$ ($500-1500), $$$ ($1500-3000), $$$$ (>$3000)';
comment on column public.industry_events.typical_month is 'For events with TBA dates, indicates when the event typically occurs';

comment on table public.event_speakers is 'Tracks verified speaker appearances at industry events';
comment on table public.user_event_tracking is 'Allows users to track events they are interested in or attending';

-- =============================================================================
-- END OF MIGRATION: Create Industry Events
-- =============================================================================
