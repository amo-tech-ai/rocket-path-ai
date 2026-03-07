-- Migration: Create missing tables — Events subsystem + Cache/Sharing/Sprints
-- Purpose: Captures 8 tables that exist on remote but have no local creation migration.
--          Also creates 7 enum types used by these tables.
-- Tables:  event_assets, event_attendees, event_speakers, event_venues,
--          deck_templates, dashboard_metrics_cache, share_views, sprint_tasks
-- Pattern: All statements are idempotent (CREATE TABLE IF NOT EXISTS, DO $$ BEGIN ... EXCEPTION)
-- Dependencies: events (20260228100000), industry_events (20260228100000),
--               contacts, campaigns, shareable_links, organizations, startups (earlier migrations)

-- ============================================================================
-- ENUM TYPES (7 types used by tables in this migration)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE public.event_asset_type AS ENUM (
    'social_post', 'email', 'graphic', 'banner', 'flyer',
    'press_release', 'blog_post', 'video', 'landing_page',
    'registration_form', 'agenda', 'speaker_bio',
    'sponsor_logo_pack', 'photo', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.asset_platform AS ENUM (
    'twitter', 'linkedin', 'instagram', 'facebook', 'tiktok',
    'youtube', 'email', 'website', 'whatsapp', 'press',
    'internal', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.asset_status AS ENUM (
    'draft', 'review', 'approved', 'scheduled',
    'published', 'failed', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.rsvp_status AS ENUM (
    'invited', 'pending', 'registered', 'confirmed',
    'waitlist', 'declined', 'cancelled', 'no_show'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.attendee_type AS ENUM (
    'general', 'vip', 'speaker', 'panelist', 'sponsor_rep',
    'press', 'investor', 'founder', 'mentor', 'staff', 'volunteer'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.venue_status AS ENUM (
    'researching', 'shortlisted', 'contacted', 'visiting',
    'negotiating', 'booked', 'cancelled', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.template_category AS ENUM (
    'startup', 'series_a', 'series_b', 'growth', 'enterprise',
    'saas', 'marketplace', 'fintech', 'healthtech', 'general', 'custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ============================================================================
-- TABLE 1: event_assets (43 columns, 4 FK)
-- Marketing/social assets linked to events
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_assets (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  description     text,
  asset_type      event_asset_type NOT NULL,
  platform        asset_platform NOT NULL DEFAULT 'other'::asset_platform,
  status          asset_status NOT NULL DEFAULT 'draft'::asset_status,
  title           text,
  content         text,
  caption         text,
  hashtags        text[],
  call_to_action  text,
  link_url        text,
  media_url       text,
  media_urls      text[] DEFAULT '{}'::text[],
  media_type      text,
  thumbnail_url   text,
  file_size_bytes bigint,
  dimensions      jsonb,
  scheduled_at    timestamptz,
  published_at    timestamptz,
  expires_at      timestamptz,
  engagement      jsonb DEFAULT '{}'::jsonb,
  impressions     integer DEFAULT 0,
  clicks          integer DEFAULT 0,
  likes           integer DEFAULT 0,
  shares          integer DEFAULT 0,
  comments        integer DEFAULT 0,
  ai_generated    boolean DEFAULT false,
  ai_model        text,
  ai_prompt       text,
  generation_params jsonb DEFAULT '{}'::jsonb,
  version         integer DEFAULT 1,
  parent_asset_id uuid,
  external_post_id text,
  external_url    text,
  approved_by     uuid,
  approved_at     timestamptz,
  rejection_reason text,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid,
  event_id        uuid,

  -- Foreign keys
  CONSTRAINT event_assets_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_assets_parent_asset_id_fkey
    FOREIGN KEY (parent_asset_id) REFERENCES public.event_assets(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_assets_event_id ON public.event_assets USING btree (event_id);
CREATE INDEX IF NOT EXISTS idx_event_assets_created_by ON public.event_assets USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_event_assets_approved_by ON public.event_assets USING btree (approved_by);
CREATE INDEX IF NOT EXISTS idx_event_assets_parent_asset_id ON public.event_assets USING btree (parent_asset_id);

-- RLS
ALTER TABLE public.event_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can select event assets"
  ON public.event_assets FOR SELECT TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can insert event assets"
  ON public.event_assets FOR INSERT TO authenticated
  WITH CHECK (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can update event assets"
  ON public.event_assets FOR UPDATE TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ))
  WITH CHECK (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can delete event assets"
  ON public.event_assets FOR DELETE TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

-- Trigger
CREATE TRIGGER set_event_assets_updated_at
  BEFORE UPDATE ON public.event_assets
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================================
-- TABLE 2: event_attendees (42 columns, 3 FK)
-- People registered/attending events
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_attendees (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id            uuid,
  name                  text NOT NULL,
  email                 text NOT NULL,
  phone                 text,
  company               text,
  title                 text,
  linkedin_url          text,
  rsvp_status           rsvp_status NOT NULL DEFAULT 'pending'::rsvp_status,
  attendee_type         attendee_type NOT NULL DEFAULT 'general'::attendee_type,
  ticket_type           text,
  ticket_price          numeric(10,2) DEFAULT 0,
  registration_code     text UNIQUE,
  checked_in            boolean DEFAULT false,
  checked_in_at         timestamptz,
  checked_in_by         uuid,
  badge_printed         boolean DEFAULT false,
  dietary_requirements  text,
  accessibility_needs   text,
  session_preferences   jsonb DEFAULT '[]'::jsonb,
  whatsapp_opted_in     boolean DEFAULT false,
  email_opted_in        boolean DEFAULT true,
  last_messaged_at      timestamptz,
  messages_received     integer DEFAULT 0,
  attended_sessions     jsonb DEFAULT '[]'::jsonb,
  feedback_submitted    boolean DEFAULT false,
  feedback_rating       integer,
  feedback_text         text,
  registration_source   text,
  referral_code         text,
  utm_source            text,
  utm_medium            text,
  utm_campaign          text,
  notes                 text,
  internal_notes        text,
  invited_at            timestamptz,
  registered_at         timestamptz,
  confirmed_at          timestamptz,
  cancelled_at          timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  event_id              uuid,

  -- Check constraints
  CONSTRAINT event_attendees_feedback_rating_check
    CHECK (feedback_rating >= 1 AND feedback_rating <= 5),

  -- Foreign keys
  CONSTRAINT event_attendees_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE,
  CONSTRAINT event_attendees_contact_id_fkey
    FOREIGN KEY (contact_id) REFERENCES public.contacts(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees USING btree (event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_contact_id ON public.event_attendees USING btree (contact_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_checked_in_by ON public.event_attendees USING btree (checked_in_by);

-- RLS
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can select event attendees"
  ON public.event_attendees FOR SELECT TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can insert event attendees"
  ON public.event_attendees FOR INSERT TO authenticated
  WITH CHECK (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can update event attendees"
  ON public.event_attendees FOR UPDATE TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ))
  WITH CHECK (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can delete event attendees"
  ON public.event_attendees FOR DELETE TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

-- Trigger
CREATE TRIGGER set_event_attendees_updated_at
  BEFORE UPDATE ON public.event_attendees
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================================
-- TABLE 3: event_speakers (12 columns, 1 FK)
-- Speaker data linked to industry_events (public read, admin write)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_speakers (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         uuid,
  speaker_name     text NOT NULL,
  speaker_title    text,
  speaker_company  text,
  speaker_linkedin text,
  appearance_year  integer,
  appearance_type  text,
  is_confirmed     boolean DEFAULT false,
  source_url       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  -- Check constraints
  CONSTRAINT event_speakers_appearance_type_check
    CHECK (appearance_type = ANY (ARRAY['keynote'::text, 'panel'::text, 'fireside'::text, 'workshop'::text, 'speaker'::text])),

  -- Foreign keys (references industry_events, not events)
  CONSTRAINT event_speakers_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.industry_events(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON public.event_speakers USING btree (event_id);

-- RLS
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;

-- Public read (anon + authenticated)
CREATE POLICY "Anon users can read event speakers"
  ON public.event_speakers FOR SELECT TO anon
  USING (true);

CREATE POLICY "Authenticated users can read event speakers"
  ON public.event_speakers FOR SELECT TO authenticated
  USING (true);

-- Admin-only write
CREATE POLICY "Admin users can insert event speakers"
  ON public.event_speakers FOR INSERT TO authenticated
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Admin users can update event speakers"
  ON public.event_speakers FOR UPDATE TO authenticated
  USING (has_role((SELECT auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((SELECT auth.uid()), 'admin'::app_role));

CREATE POLICY "Admin users can delete event speakers"
  ON public.event_speakers FOR DELETE TO authenticated
  USING (has_role((SELECT auth.uid()), 'admin'::app_role));

-- Trigger
CREATE TRIGGER handle_event_speakers_updated_at
  BEFORE UPDATE ON public.event_speakers
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================================
-- TABLE 4: event_venues (50 columns, 2 FK)
-- Venue research and booking for events
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.event_venues (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  description         text,
  venue_type          text,
  website             text,
  address             text,
  city                text,
  state               text,
  country             text,
  postal_code         text,
  latitude            numeric(10,7),
  longitude           numeric(10,7),
  google_place_id     text,
  capacity            integer,
  seated_capacity     integer,
  standing_capacity   integer,
  rental_cost         numeric(10,2) DEFAULT 0,
  deposit_amount      numeric(10,2) DEFAULT 0,
  catering_minimum    numeric(10,2),
  additional_fees     jsonb DEFAULT '[]'::jsonb,
  contact_name        text,
  contact_email       text,
  contact_phone       text,
  amenities           jsonb DEFAULT '[]'::jsonb,
  equipment_included  jsonb DEFAULT '[]'::jsonb,
  parking_info        text,
  accessibility_info  text,
  wifi_available      boolean DEFAULT true,
  av_equipment        boolean DEFAULT false,
  catering_available  boolean DEFAULT false,
  catering_required   boolean DEFAULT false,
  photos              text[] DEFAULT '{}'::text[],
  virtual_tour_url    text,
  floor_plan_url      text,
  status              venue_status NOT NULL DEFAULT 'researching'::venue_status,
  is_primary          boolean DEFAULT false,
  visited_at          timestamptz,
  booked_at           timestamptz,
  deposit_paid_at     timestamptz,
  contract_signed_at  timestamptz,
  fit_score           integer,
  ai_analysis         text,
  discovery_source    text,
  notes               text,
  pros                text,
  cons                text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  created_by          uuid,
  event_id            uuid,

  -- Check constraints
  CONSTRAINT event_venues_fit_score_check
    CHECK (fit_score >= 0 AND fit_score <= 100),

  -- Foreign keys
  CONSTRAINT event_venues_event_id_fkey
    FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_event_venues_event_id ON public.event_venues USING btree (event_id);
CREATE INDEX IF NOT EXISTS idx_event_venues_created_by ON public.event_venues USING btree (created_by);

-- RLS
ALTER TABLE public.event_venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated can select event venues"
  ON public.event_venues FOR SELECT TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can insert event venues"
  ON public.event_venues FOR INSERT TO authenticated
  WITH CHECK (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can update event venues"
  ON public.event_venues FOR UPDATE TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ))
  WITH CHECK (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

CREATE POLICY "authenticated can delete event venues"
  ON public.event_venues FOR DELETE TO authenticated
  USING (event_id IN (
    SELECT events.id FROM events WHERE startup_in_org(events.startup_id)
  ));

-- Trigger
CREATE TRIGGER set_event_venues_updated_at
  BEFORE UPDATE ON public.event_venues
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================================
-- TABLE 5: deck_templates (18 columns, 2 FK)
-- Pitch deck templates — org-scoped + public templates
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.deck_templates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  description   text,
  category      template_category NOT NULL DEFAULT 'general'::template_category,
  theme         text NOT NULL DEFAULT 'modern'::text,
  structure     jsonb NOT NULL DEFAULT '[]'::jsonb,
  preview_url   text,
  thumbnail_url text,
  slide_count   integer DEFAULT 0,
  color_scheme  jsonb DEFAULT '{"accent": "#F59E0B", "primary": "#3B82F6", "secondary": "#1E40AF"}'::jsonb,
  fonts         jsonb DEFAULT '{"body": "Inter", "heading": "Inter"}'::jsonb,
  is_public     boolean DEFAULT false,
  is_default    boolean DEFAULT false,
  org_id        uuid,
  created_by    uuid,
  usage_count   integer DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  -- Foreign keys
  CONSTRAINT deck_templates_org_id_fkey
    FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_deck_templates_org_id ON public.deck_templates USING btree (org_id);
CREATE INDEX IF NOT EXISTS idx_deck_templates_created_by ON public.deck_templates USING btree (created_by);

-- RLS
ALTER TABLE public.deck_templates ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view public templates
CREATE POLICY "anyone can view public templates"
  ON public.deck_templates FOR SELECT TO authenticated
  USING (is_public = true);

-- Users can view their org's templates
CREATE POLICY "users can view org templates"
  ON public.deck_templates FOR SELECT TO authenticated
  USING (org_id IS NOT NULL AND org_id = (SELECT user_org_id()));

-- Users can create templates for their org (not public)
CREATE POLICY "users can create org templates"
  ON public.deck_templates FOR INSERT TO authenticated
  WITH CHECK (org_id = (SELECT user_org_id()) AND is_public = false);

-- Users can update their own org templates
CREATE POLICY "users can update own org templates"
  ON public.deck_templates FOR UPDATE TO authenticated
  USING (org_id = (SELECT user_org_id()) AND created_by = (SELECT auth.uid()))
  WITH CHECK (org_id = (SELECT user_org_id()));

-- Users can delete their own org templates
CREATE POLICY "users can delete own org templates"
  ON public.deck_templates FOR DELETE TO authenticated
  USING (org_id = (SELECT user_org_id()) AND created_by = (SELECT auth.uid()));

-- Trigger
CREATE TRIGGER set_deck_templates_updated_at
  BEFORE UPDATE ON public.deck_templates
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();


-- ============================================================================
-- TABLE 6: dashboard_metrics_cache (5 columns, 1 FK)
-- Cached dashboard metrics per startup — startup_id scoped
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.dashboard_metrics_cache (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id  uuid NOT NULL,
  metric_type text NOT NULL,
  value       jsonb NOT NULL DEFAULT '{}'::jsonb,
  computed_at timestamptz NOT NULL DEFAULT now(),

  -- Unique constraint: one row per (startup_id, metric_type)
  CONSTRAINT uq_dashboard_metrics_cache_startup_type
    UNIQUE (startup_id, metric_type),

  -- Foreign keys
  CONSTRAINT dashboard_metrics_cache_startup_id_fkey
    FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE CASCADE
);

-- RLS
ALTER TABLE public.dashboard_metrics_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dashboard_metrics_cache_select_org"
  ON public.dashboard_metrics_cache FOR SELECT TO authenticated
  USING ((SELECT startup_in_org(dashboard_metrics_cache.startup_id)));

CREATE POLICY "dashboard_metrics_cache_insert_org"
  ON public.dashboard_metrics_cache FOR INSERT TO authenticated
  WITH CHECK ((SELECT startup_in_org(dashboard_metrics_cache.startup_id)));

CREATE POLICY "dashboard_metrics_cache_update_org"
  ON public.dashboard_metrics_cache FOR UPDATE TO authenticated
  USING ((SELECT startup_in_org(dashboard_metrics_cache.startup_id)))
  WITH CHECK ((SELECT startup_in_org(dashboard_metrics_cache.startup_id)));


-- ============================================================================
-- TABLE 7: share_views (7 columns, 1 FK)
-- Tracks views on shareable links (analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.share_views (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id    uuid NOT NULL,
  viewed_at  timestamptz NOT NULL DEFAULT now(),
  ip_hash    text,
  user_agent text,
  referrer   text,
  country    text,

  -- Foreign keys
  CONSTRAINT share_views_link_id_fkey
    FOREIGN KEY (link_id) REFERENCES public.shareable_links(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_share_views_link_id ON public.share_views USING btree (link_id);

-- RLS
ALTER TABLE public.share_views ENABLE ROW LEVEL SECURITY;

-- Owner can view analytics for their links
CREATE POLICY "share_views_select_owner"
  ON public.share_views FOR SELECT TO public
  USING (link_id IN (
    SELECT shareable_links.id FROM shareable_links
    WHERE shareable_links.created_by = (SELECT auth.uid())
  ));

-- Authenticated users can insert views for their own links
CREATE POLICY "share_views_insert_authenticated"
  ON public.share_views FOR INSERT TO authenticated
  WITH CHECK (link_id IN (
    SELECT shareable_links.id FROM shareable_links
    WHERE shareable_links.created_by = (SELECT auth.uid())
  ));

-- Service role can insert views (edge functions recording views)
CREATE POLICY "share_views_insert_service"
  ON public.share_views FOR INSERT TO service_role
  WITH CHECK (true);


-- ============================================================================
-- TABLE 8: sprint_tasks (12 columns, 1 FK)
-- Kanban tasks within campaign sprints
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.sprint_tasks (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id      uuid NOT NULL,
  sprint_number    integer NOT NULL,
  title            text NOT NULL,
  source           text NOT NULL,
  success_criteria text NOT NULL DEFAULT ''::text,
  ai_tip           text DEFAULT ''::text,
  priority         text NOT NULL DEFAULT 'medium'::text,
  "column"         text NOT NULL DEFAULT 'backlog'::text,
  position         integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  -- Check constraints
  CONSTRAINT sprint_tasks_sprint_number_check
    CHECK (sprint_number >= 1 AND sprint_number <= 6),
  CONSTRAINT sprint_tasks_priority_check
    CHECK (priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])),
  CONSTRAINT sprint_tasks_column_check
    CHECK ("column" = ANY (ARRAY['backlog'::text, 'todo'::text, 'doing'::text, 'done'::text])),

  -- Foreign keys
  CONSTRAINT sprint_tasks_campaign_id_fkey
    FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_campaign_id ON public.sprint_tasks USING btree (campaign_id);

-- RLS
ALTER TABLE public.sprint_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sprint tasks"
  ON public.sprint_tasks FOR SELECT TO authenticated
  USING (campaign_id IN (
    SELECT c.id FROM campaigns c
    JOIN startups s ON s.id = c.startup_id
    WHERE s.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "Users can insert own sprint tasks"
  ON public.sprint_tasks FOR INSERT TO authenticated
  WITH CHECK (campaign_id IN (
    SELECT c.id FROM campaigns c
    JOIN startups s ON s.id = c.startup_id
    WHERE s.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "Users can update own sprint tasks"
  ON public.sprint_tasks FOR UPDATE TO authenticated
  USING (campaign_id IN (
    SELECT c.id FROM campaigns c
    JOIN startups s ON s.id = c.startup_id
    WHERE s.org_id = (SELECT user_org_id())
  ))
  WITH CHECK (campaign_id IN (
    SELECT c.id FROM campaigns c
    JOIN startups s ON s.id = c.startup_id
    WHERE s.org_id = (SELECT user_org_id())
  ));

CREATE POLICY "Users can delete own sprint tasks"
  ON public.sprint_tasks FOR DELETE TO authenticated
  USING (campaign_id IN (
    SELECT c.id FROM campaigns c
    JOIN startups s ON s.id = c.startup_id
    WHERE s.org_id = (SELECT user_org_id())
  ));

-- Trigger
CREATE TRIGGER set_sprint_tasks_updated_at
  BEFORE UPDATE ON public.sprint_tasks
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
