-- Migration: Create missing functions, enum types, and triggers
-- Purpose: Captures ~50 functions, ~21 enum types, and ~60 triggers that exist
--          on remote but are not in any local migration file.
-- Pattern: All statements are idempotent:
--          - CREATE OR REPLACE FUNCTION (naturally idempotent)
--          - DO $$ BEGIN CREATE TYPE ... EXCEPTION WHEN duplicate_object (idempotent)
--          - DO $$ BEGIN IF NOT EXISTS (trigger) ... CREATE TRIGGER (idempotent)
-- Dependencies: Runs after all existing migrations. Functions may reference
--               tables created in later migrations (Tasks 3, 4) but this is safe
--               because plpgsql function bodies are validated at call time, not
--               creation time. SQL-language functions only reference tables that
--               exist in earlier migrations.

-- ============================================================================
-- SECTION 0: MISSING COLUMNS ON EXISTING TABLES
-- These columns exist on remote but were added out-of-band (not in migrations).
-- SQL-language functions validate at creation time, so these must exist first.
-- ============================================================================

ALTER TABLE lean_canvases ADD COLUMN IF NOT EXISTS validation_score numeric;
ALTER TABLE lean_canvases ADD COLUMN IF NOT EXISTS source text DEFAULT 'manual';
ALTER TABLE lean_canvases ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- ============================================================================
-- SECTION 1: ENUM TYPES
-- ============================================================================
-- Only enums NOT already created in earlier migrations.
-- Excluded: app_role (20260115201717), feature_context (20260129000000),
--   assumption_status, assumption_source (20260204100800),
--   experiment_type, experiment_status (20260204100900),
--   segment_type (20260204101100), force_type (20260204101200),
--   job_type (20260204101300), interview_status, interview_type (20260204101400),
--   insight_type (20260204101500), coach_phase, constraint_type, pdca_step (20260204102000),
--   workflow_status, trigger_type, action_type, run_status (20260204110000),
--   knowledge_source_type, confidence_level (20260204120100),
--   funding_stage, pack_category (20260129180000),
--   event_type, event_status, event_scope, event_category, attending_status,
--   event_location_type, event_format, ticket_cost_tier, media_pass_status (20260228100000),
--   question_type (20260308100100)

DO $$ BEGIN
  CREATE TYPE public.activity_type AS ENUM (
    'task_created', 'task_updated', 'task_completed', 'task_deleted', 'task_assigned',
    'deal_created', 'deal_updated', 'deal_stage_changed', 'deal_won', 'deal_lost',
    'contact_created', 'contact_updated', 'contact_deleted',
    'email_sent', 'call_logged', 'meeting_scheduled',
    'project_created', 'project_updated', 'project_completed', 'milestone_reached',
    'document_created', 'document_updated', 'document_shared',
    'deck_created', 'deck_updated', 'deck_shared', 'deck_exported',
    'ai_insight_generated', 'ai_task_suggested', 'ai_analysis_completed', 'ai_extraction_completed',
    'user_joined', 'user_left', 'settings_changed', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.asset_platform AS ENUM (
    'twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube',
    'email', 'website', 'whatsapp', 'press', 'internal', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.asset_status AS ENUM (
    'draft', 'review', 'approved', 'scheduled', 'published', 'failed', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.attendee_type AS ENUM (
    'general', 'vip', 'speaker', 'panelist', 'sponsor_rep', 'press',
    'investor', 'founder', 'mentor', 'staff', 'volunteer'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.event_asset_type AS ENUM (
    'social_post', 'email', 'graphic', 'banner', 'flyer', 'press_release',
    'blog_post', 'video', 'landing_page', 'registration_form', 'agenda',
    'speaker_bio', 'sponsor_logo_pack', 'photo', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.event_task_category AS ENUM (
    'planning', 'venue', 'sponsors', 'speakers', 'marketing', 'registration',
    'logistics', 'catering', 'av_tech', 'content', 'communications',
    'post_event', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.message_channel AS ENUM (
    'whatsapp', 'sms', 'email', 'in_app'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.message_direction AS ENUM (
    'inbound', 'outbound'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.message_status AS ENUM (
    'pending', 'sent', 'delivered', 'read', 'failed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.message_type AS ENUM (
    'text', 'template', 'broadcast', 'image', 'document', 'location', 'contact', 'interactive'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.model_preference AS ENUM (
    'gemini', 'claude', 'claude-sonnet', 'auto'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.pitch_deck_status AS ENUM (
    'draft', 'in_progress', 'review', 'final', 'archived', 'generating'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.playbook_status AS ENUM (
    'suggested', 'active', 'in_progress', 'completed', 'skipped'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.rsvp_status AS ENUM (
    'invited', 'pending', 'registered', 'confirmed', 'waitlist',
    'declined', 'cancelled', 'no_show'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.slide_type AS ENUM (
    'title', 'problem', 'solution', 'product', 'market', 'business_model',
    'traction', 'competition', 'team', 'financials', 'ask', 'contact', 'custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.sponsor_status AS ENUM (
    'prospect', 'researching', 'contacted', 'negotiating', 'interested',
    'confirmed', 'declined', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.sponsor_tier AS ENUM (
    'platinum', 'gold', 'silver', 'bronze', 'in_kind', 'media', 'community'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.startup_event_status AS ENUM (
    'draft', 'planning', 'confirmed', 'live', 'completed', 'cancelled', 'postponed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.startup_event_type AS ENUM (
    'demo_day', 'pitch_night', 'networking', 'workshop', 'investor_meetup',
    'founder_dinner', 'hackathon', 'conference', 'webinar', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.template_category AS ENUM (
    'startup', 'series_a', 'series_b', 'growth', 'enterprise', 'saas',
    'marketplace', 'fintech', 'healthtech', 'general', 'custom'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.validation_verdict AS ENUM (
    'go', 'conditional', 'pivot', 'no_go'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.venue_status AS ENUM (
    'researching', 'shortlisted', 'contacted', 'visiting', 'negotiating',
    'booked', 'cancelled', 'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- SECTION 2: FUNCTIONS
-- ============================================================================

-- ============================================================================
-- 2.1 CORE HELPER FUNCTIONS
-- ============================================================================

-- org_role() - returns user's role from profiles
CREATE OR REPLACE FUNCTION public.org_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select role from public.profiles where id = auth.uid()
$function$;

-- is_org_member(uuid) - checks org membership via profiles
CREATE OR REPLACE FUNCTION public.is_org_member(check_org_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and org_id = check_org_id
  )
$function$;

-- slide_in_org(uuid) - checks if pitch deck slide is in user's org
CREATE OR REPLACE FUNCTION public.slide_in_org(slide_deck_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
    select exists(
        select 1
        from public.pitch_decks pd
        join public.startups s on pd.startup_id = s.id
        where pd.id = slide_deck_id
          and s.org_id = public.user_org_id()
    )
$function$;

-- get_share_token() - extracts share token from request headers
CREATE OR REPLACE FUNCTION public.get_share_token()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT COALESCE(
    (current_setting('request.headers', true)::json ->> 'x-share-token'),
    (current_setting('request.headers', true)::json ->> 'X-Share-Token')
  );
$function$;

-- get_user_startup_id(uuid) - gets user's startup ID via org
CREATE OR REPLACE FUNCTION public.get_user_startup_id(p_user_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select s.id
  from startups s
  join profiles p on p.org_id = s.org_id
  where p.id = p_user_id
  limit 1;
$function$;

-- get_validation_verdict(numeric) - maps score to verdict
CREATE OR REPLACE FUNCTION public.get_validation_verdict(p_score numeric)
 RETURNS text
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
BEGIN
  IF p_score >= 80 THEN
    RETURN 'go';
  ELSIF p_score >= 60 THEN
    RETURN 'conditional';
  ELSIF p_score >= 40 THEN
    RETURN 'needs_work';
  ELSE
    RETURN 'pivot';
  END IF;
END;
$function$;

-- calculate_validation_score(...) - weighted validation score
CREATE OR REPLACE FUNCTION public.calculate_validation_score(p_problem numeric, p_market numeric, p_competition numeric, p_solution numeric, p_business numeric, p_execution numeric, p_weights jsonb DEFAULT '{"market": 0.20, "problem": 0.20, "business": 0.15, "solution": 0.20, "execution": 0.10, "competition": 0.15}'::jsonb)
 RETURNS numeric
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
DECLARE
  v_base_score numeric;
BEGIN
  v_base_score := (
    COALESCE(p_problem, 0) * COALESCE((p_weights->>'problem')::numeric, 0.20) +
    COALESCE(p_market, 0) * COALESCE((p_weights->>'market')::numeric, 0.20) +
    COALESCE(p_competition, 0) * COALESCE((p_weights->>'competition')::numeric, 0.15) +
    COALESCE(p_solution, 0) * COALESCE((p_weights->>'solution')::numeric, 0.20) +
    COALESCE(p_business, 0) * COALESCE((p_weights->>'business')::numeric, 0.15) +
    COALESCE(p_execution, 0) * COALESCE((p_weights->>'execution')::numeric, 0.10)
  );

  RETURN ROUND(v_base_score, 2);
END;
$function$;

-- check_condition_rules(jsonb, jsonb) - evaluates automation condition rules
CREATE OR REPLACE FUNCTION public.check_condition_rules(p_rules jsonb, p_payload jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
declare v_rule record; v_field_value jsonb;
begin
  if p_rules is null or p_rules = '{}'::jsonb then return true; end if;
  for v_rule in select * from jsonb_each(p_rules) loop
    v_field_value := p_payload -> v_rule.key;
    if jsonb_typeof(v_rule.value) = 'object' and v_rule.value ? 'operator' then
      case v_rule.value->>'operator'
        when '=' then if v_field_value is distinct from v_rule.value->'value' then return false; end if;
        when '!=' then if v_field_value is not distinct from v_rule.value->'value' then return false; end if;
        when '>' then if (v_field_value::text)::numeric <= (v_rule.value->>'value')::numeric then return false; end if;
        when '>=' then if (v_field_value::text)::numeric < (v_rule.value->>'value')::numeric then return false; end if;
        when '<' then if (v_field_value::text)::numeric >= (v_rule.value->>'value')::numeric then return false; end if;
        when '<=' then if (v_field_value::text)::numeric > (v_rule.value->>'value')::numeric then return false; end if;
        when 'contains' then if not (v_field_value::text ilike '%' || (v_rule.value->>'value') || '%') then return false; end if;
        when 'in' then if not (v_field_value <@ v_rule.value->'value') then return false; end if;
        else null;
      end case;
    else
      if v_field_value is distinct from v_rule.value then return false; end if;
    end if;
  end loop;
  return true;
end;
$function$;

-- ============================================================================
-- 2.2 INDUSTRY / KNOWLEDGE FUNCTIONS
-- ============================================================================

-- get_industry_playbook(text) - returns matching playbook
CREATE OR REPLACE FUNCTION public.get_industry_playbook(p_industry_id text)
 RETURNS industry_playbooks
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select * from public.industry_playbooks
  where industry_id = lower(replace(p_industry_id, '-', '_'))
    and is_active = true limit 1;
$function$;

-- list_industries() - returns active industries
CREATE OR REPLACE FUNCTION public.list_industries()
 RETURNS TABLE(industry_id text, display_name text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select industry_id, display_name from public.industry_playbooks
  where is_active = true order by display_name;
$function$;

-- get_knowledge_stats() - returns knowledge chunk statistics
CREATE OR REPLACE FUNCTION public.get_knowledge_stats()
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'total_chunks', (select count(*) from knowledge_chunks),
    'by_category', (select coalesce(jsonb_object_agg(category, cnt), '{}'::jsonb) from (select category, count(*) as cnt from knowledge_chunks group by category) c),
    'by_source_type', (select coalesce(jsonb_object_agg(source_type, cnt), '{}'::jsonb) from (select source_type, count(*) as cnt from knowledge_chunks group by source_type) s),
    'by_year', (select coalesce(jsonb_object_agg(year::text, cnt), '{}'::jsonb) from (select year, count(*) as cnt from knowledge_chunks group by year) y)
  );
$function$;

-- increment_knowledge_fetch(uuid[]) - increments fetch count for chunks
CREATE OR REPLACE FUNCTION public.increment_knowledge_fetch(chunk_ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  update public.knowledge_chunks
  set fetch_count = fetch_count + 1, last_fetched_at = now()
  where id = any(chunk_ids);
end;
$function$;

-- ============================================================================
-- 2.3 CANVAS / VALIDATION FUNCTIONS
-- ============================================================================

-- get_current_canvas(uuid) - returns current lean canvas for startup
CREATE OR REPLACE FUNCTION public.get_current_canvas(p_startup_id uuid)
 RETURNS TABLE(id uuid, problem text, customer_segments text, unique_value_proposition text, solution text, channels text, revenue_streams text, cost_structure text, key_metrics text, unfair_advantage text, validation_score numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    id,
    problem,
    customer_segments,
    unique_value_proposition,
    solution,
    channels,
    revenue_streams,
    cost_structure,
    key_metrics,
    unfair_advantage,
    validation_score
  from lean_canvases
  where startup_id = p_startup_id
    and is_current = true
  order by created_at desc
  limit 1;
$function$;

-- get_competitor_summary(uuid) - SKIPPED: references competitor_profiles table
-- which doesn't exist on remote or local (dropped feature). Dead function.

-- get_pending_conditions(uuid) - SKIPPED: references validation_conditions table
-- which doesn't exist on remote or local (dropped feature). Dead function.

-- ============================================================================
-- 2.4 PROMPT PACK FUNCTIONS
-- ============================================================================

-- search_prompt_packs(...) - search active packs by category/industry/stage
CREATE OR REPLACE FUNCTION public.search_prompt_packs(p_category text DEFAULT NULL::text, p_industry text DEFAULT NULL::text, p_stage text DEFAULT NULL::text, p_limit integer DEFAULT 5)
 RETURNS TABLE(pack_id text, title text, slug text, category text, description text, step_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    pp.id as pack_id,
    pp.title,
    pp.slug,
    pp.category,
    pp.description,
    count(pps.id) as step_count
  from prompt_packs pp
  left join prompt_pack_steps pps on pps.pack_id = pp.id
  where pp.is_active = true
    and (p_category is null or pp.category = p_category)
    and (p_industry is null or p_industry = any(pp.industry_tags))
    and (p_stage is null or p_stage = any(pp.stage_tags))
  group by pp.id
  order by pp.version desc, pp.created_at desc
  limit p_limit;
$function$;

-- search_best_pack(...) - find best matching pack with scoring
CREATE OR REPLACE FUNCTION public.search_best_pack(p_module text, p_industry text DEFAULT NULL::text, p_stage text DEFAULT NULL::text, p_use_case text DEFAULT NULL::text)
 RETURNS TABLE(pack_id text, title text, slug text, category text, description text, step_count bigint, match_score numeric, first_step_id uuid, first_step_name text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_categories text[];
BEGIN
  v_categories := case p_module
    when 'onboarding' then array['validation', 'ideation', 'market']
    when 'canvas' then array['canvas', 'pricing', 'gtm']
    when 'pitch' then array['pitch']
    when 'validation' then array['validation', 'market']
    when 'gtm' then array['gtm', 'pricing']
    when 'pricing' then array['pricing']
    when 'market' then array['market']
    when 'ideation' then array['ideation']
    when 'funding' then array['funding']
    else array[p_module]
  end;

  RETURN QUERY
  WITH ranked_packs AS (
    SELECT
      pp.id,
      pp.title,
      pp.slug,
      pp.category,
      pp.description,
      count(pps.id) as step_count,
      (
        case when pp.category = any(v_categories) then 10 else 0 end +
        case when p_industry is not null and p_industry = any(pp.industry_tags) then 5 else 0 end +
        case when p_stage is not null and p_stage = any(pp.stage_tags) then 3 else 0 end +
        case when p_use_case is not null and p_use_case = any(pp.use_case_tags) then 4 else 0 end +
        pp.version * 0.1
      )::numeric as match_score
    FROM prompt_packs pp
    LEFT JOIN prompt_pack_steps pps ON pps.pack_id = pp.id
    WHERE pp.is_active = true
      AND pp.category = any(v_categories)
    GROUP BY pp.id
  )
  SELECT
    rp.id as pack_id,
    rp.title,
    rp.slug,
    rp.category,
    rp.description,
    rp.step_count,
    rp.match_score,
    fs.id as first_step_id,
    fs.name as first_step_name
  FROM ranked_packs rp
  LEFT JOIN LATERAL (
    SELECT pps.id, pps.name
    FROM prompt_pack_steps pps
    WHERE pps.pack_id = rp.id
    ORDER BY pps.step_order
    LIMIT 1
  ) fs ON true
  ORDER BY rp.match_score DESC, rp.step_count DESC;
END;
$function$;

-- get_pack_steps(uuid) - returns all steps for a pack
CREATE OR REPLACE FUNCTION public.get_pack_steps(p_pack_id text)
 RETURNS TABLE(step_id uuid, step_order integer, purpose text, prompt_template text, output_schema jsonb, model_preference text, temperature double precision)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    id as step_id,
    step_order,
    purpose,
    prompt_template,
    output_schema,
    model_preference,
    temperature
  from prompt_pack_steps
  where pack_id = p_pack_id
  order by step_order;
$function$;

-- get_next_pack_step(uuid, integer) - returns next step after current
CREATE OR REPLACE FUNCTION public.get_next_pack_step(p_pack_id text, p_current_step_order integer DEFAULT 0)
 RETURNS TABLE(step_id uuid, step_order integer, purpose text, prompt_template text, output_schema jsonb, model_preference text, temperature double precision)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    id as step_id,
    step_order,
    purpose,
    prompt_template,
    output_schema,
    model_preference,
    temperature
  from prompt_pack_steps
  where pack_id = p_pack_id
    and step_order > p_current_step_order
  order by step_order
  limit 1;
$function$;

-- get_pack_run_stats(uuid) - returns run statistics for a pack
-- get_pack_run_stats(text) - SKIPPED: references prompt_runs table
-- which doesn't exist on remote or local. Dead function.

-- ============================================================================
-- 2.5 PITCH DECK FUNCTIONS
-- ============================================================================

-- get_pitch_deck_with_slides(uuid) - returns deck with all slides as JSON
CREATE OR REPLACE FUNCTION public.get_pitch_deck_with_slides(p_deck_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'deck', row_to_json(d.*),
        'slides', (
            SELECT jsonb_agg(row_to_json(s.*) ORDER BY s.slide_number)
            FROM public.pitch_deck_slides s
            WHERE s.deck_id = p_deck_id
            AND s.is_visible = true
        ),
        'wizard_data', d.metadata->'wizard_data'
    ) INTO v_result
    FROM public.pitch_decks d
    WHERE d.id = p_deck_id;

    RETURN v_result;
END;
$function$;

-- create_pitch_deck_analytics() - trigger function (no-op placeholder)
CREATE OR REPLACE FUNCTION public.create_pitch_deck_analytics()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    -- Analytics table not deployed yet; no-op for now
    RETURN NEW;
END;
$function$;

-- update_pitch_deck_slide_count() - trigger to update slide count on deck
CREATE OR REPLACE FUNCTION public.update_pitch_deck_slide_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  update public.pitch_decks
  set slide_count = (
    select count(*)
    from public.pitch_deck_slides
    where deck_id = coalesce(new.deck_id, old.deck_id)
    and is_visible = true
  )
  where id = coalesce(new.deck_id, old.deck_id);
  return coalesce(new, old);
end;
$function$;

-- limit_pitch_deck_versions() - trigger to limit version history to 50
CREATE OR REPLACE FUNCTION public.limit_pitch_deck_versions()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
    DELETE FROM public.pitch_deck_versions
    WHERE deck_id = NEW.deck_id
    AND id NOT IN (
        SELECT id FROM public.pitch_deck_versions
        WHERE deck_id = NEW.deck_id
        ORDER BY created_at DESC
        LIMIT 50
    );
    RETURN NEW;
END;
$function$;

-- increment_template_usage(uuid) - increments deck template usage count
CREATE OR REPLACE FUNCTION public.increment_template_usage(template_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
    update public.deck_templates
    set usage_count = usage_count + 1
    where id = template_id;
end;
$function$;

-- ============================================================================
-- 2.6 SHARING FUNCTIONS
-- ============================================================================

-- increment_share_access(...) - tracks share link access
CREATE OR REPLACE FUNCTION public.increment_share_access(share_token text, viewer_ip text DEFAULT NULL::text, viewer_ua text DEFAULT NULL::text, viewer_referrer text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_link_id uuid;
BEGIN
  SELECT id INTO v_link_id
  FROM shareable_links
  WHERE token = share_token
    AND revoked_at IS NULL
    AND expires_at > now();

  IF v_link_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE shareable_links
  SET access_count = access_count + 1,
      last_accessed_at = now()
  WHERE id = v_link_id;

  INSERT INTO share_views (link_id, ip_hash, user_agent, referrer)
  VALUES (
    v_link_id,
    CASE WHEN viewer_ip IS NOT NULL
      THEN encode(digest(viewer_ip || 'startupai-salt', 'sha256'), 'hex')
      ELSE NULL
    END,
    left(viewer_ua, 500),
    left(viewer_referrer, 2000)
  );
END;
$function$;

-- ============================================================================
-- 2.7 ACTIVITY / LOGGING FUNCTION
-- ============================================================================

-- log_activity(...) - logs user activity
CREATE OR REPLACE FUNCTION public.log_activity(p_startup_id uuid, p_activity_type activity_type, p_title text, p_description text DEFAULT NULL::text, p_entity_type text DEFAULT NULL::text, p_entity_id uuid DEFAULT NULL::uuid, p_metadata jsonb DEFAULT '{}'::jsonb, p_is_system boolean DEFAULT false)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
    v_activity_id uuid;
begin
    insert into public.activities (
        startup_id,
        user_id,
        activity_type,
        title,
        description,
        entity_type,
        entity_id,
        metadata,
        is_system_generated
    ) values (
        p_startup_id,
        (select auth.uid()),
        p_activity_type,
        p_title,
        p_description,
        p_entity_type,
        p_entity_id,
        p_metadata,
        p_is_system
    )
    returning id into v_activity_id;

    return v_activity_id;
end;
$function$;

-- ============================================================================
-- 2.8 DASHBOARD / METRICS FUNCTIONS
-- ============================================================================

-- refresh_dashboard_metrics() - refreshes materialized view
CREATE OR REPLACE FUNCTION public.refresh_dashboard_metrics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  refresh materialized view concurrently public.dashboard_metrics;
end;
$function$;

-- get_metric_trends(uuid, integer) - SKIPPED: references metric_snapshots table
-- which was dropped in p1_batch_cleanup migration. Dead function.

-- capture_metric_snapshot(uuid) - captures daily metric snapshot
CREATE OR REPLACE FUNCTION public.capture_metric_snapshot(p_startup_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_snapshot_id uuid;
  v_metrics record;
begin
  select * into v_metrics from public.dashboard_metrics where startup_id = p_startup_id;
  if not found then return null; end if;

  insert into public.metric_snapshots (
    startup_id, snapshot_date, snapshot_type,
    tasks_total, tasks_completed, tasks_in_progress, tasks_overdue,
    contacts_total, contacts_this_week, deals_total, deals_active, deals_won, deals_value_total,
    canvas_completion_pct, pitch_deck_slides, validation_score,
    experiments_total, experiments_completed, interviews_total,
    activities_this_week, health_score, raw_metrics
  ) values (
    p_startup_id, current_date, 'daily',
    v_metrics.tasks_total, v_metrics.tasks_completed, v_metrics.tasks_in_progress, v_metrics.tasks_overdue,
    v_metrics.contacts_total, v_metrics.contacts_this_week, v_metrics.deals_total, v_metrics.deals_active,
    v_metrics.deals_won, v_metrics.deals_total_value, v_metrics.canvas_completion_pct, v_metrics.pitch_deck_slides,
    v_metrics.validation_score, v_metrics.experiments_total, v_metrics.experiments_completed,
    v_metrics.interviews_total, v_metrics.activities_this_week, v_metrics.health_score, to_jsonb(v_metrics)
  )
  on conflict (startup_id, snapshot_date, snapshot_type) do update set
    tasks_total = excluded.tasks_total, tasks_completed = excluded.tasks_completed,
    tasks_in_progress = excluded.tasks_in_progress, tasks_overdue = excluded.tasks_overdue,
    contacts_total = excluded.contacts_total, contacts_this_week = excluded.contacts_this_week,
    deals_total = excluded.deals_total, deals_active = excluded.deals_active, deals_won = excluded.deals_won,
    deals_value_total = excluded.deals_value_total, canvas_completion_pct = excluded.canvas_completion_pct,
    pitch_deck_slides = excluded.pitch_deck_slides, validation_score = excluded.validation_score,
    experiments_total = excluded.experiments_total, experiments_completed = excluded.experiments_completed,
    interviews_total = excluded.interviews_total, activities_this_week = excluded.activities_this_week,
    health_score = excluded.health_score, raw_metrics = excluded.raw_metrics
  returning id into v_snapshot_id;
  return v_snapshot_id;
end;
$function$;

-- ============================================================================
-- 2.9 TRIGGER FUNCTIONS
-- ============================================================================

-- set_task_completed_at() - sets completed_at on task status change
CREATE OR REPLACE FUNCTION public.set_task_completed_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at = now();
  end if;
  if old.status = 'completed' and new.status != 'completed' then
    new.completed_at = null;
  end if;
  return new;
end;
$function$;

-- set_document_version_number() - auto-increments document version
CREATE OR REPLACE FUNCTION public.set_document_version_number()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.version_number := coalesce(
    (select max(version_number) from public.document_versions where document_id = new.document_id),
    0
  ) + 1;
  return new;
end;
$function$;

-- calculate_campaign_end_date() - sets end_date from start_date + duration
CREATE OR REPLACE FUNCTION public.calculate_campaign_end_date()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if new.start_date is not null and new.end_date is null then
    new.end_date := new.start_date + (new.duration_days || ' days')::interval;
  end if;
  return new;
end;
$function$;

-- track_sprint_timeline() - sets started_at/completed_at on sprint status change
CREATE OR REPLACE FUNCTION public.track_sprint_timeline()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if new.status = 'in_progress' and old.status = 'planning' and new.started_at is null then
    new.started_at := now();
  end if;
  if new.status = 'completed' and old.status != 'completed' and new.completed_at is null then
    new.completed_at := now();
  end if;
  return new;
end;
$function$;

-- update_validation_session_interaction() - updates last_interaction_at
CREATE OR REPLACE FUNCTION public.update_validation_session_interaction()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  new.last_interaction_at := now();
  return new;
end;
$function$;

-- cleanup_zombie_sessions() - marks zombie validator sessions as failed
CREATE OR REPLACE FUNCTION public.cleanup_zombie_sessions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  cleaned_count integer;
BEGIN
  WITH zombies AS (
    UPDATE validator_sessions
    SET
      status = 'failed',
      error_message = 'Session timed out (zombie cleanup)',
      updated_at = NOW()
    WHERE status = 'running'
      AND created_at < NOW() - INTERVAL '3 minutes'
    RETURNING id
  )
  SELECT COUNT(*) INTO cleaned_count FROM zombies;

  UPDATE validator_runs
  SET
    status = 'failed',
    error_message = 'Parent session timed out (zombie cleanup)',
    finished_at = NOW()
  WHERE session_id IN (
    SELECT id FROM validator_sessions
    WHERE status = 'failed'
      AND error_message = 'Session timed out (zombie cleanup)'
      AND updated_at > NOW() - INTERVAL '1 minute'
  )
  AND status IN ('running', 'queued');

  IF cleaned_count > 0 THEN
    RAISE LOG 'zombie_cleanup: marked % sessions as failed', cleaned_count;
  END IF;

  RETURN cleaned_count;
END;
$function$;

-- ============================================================================
-- 2.10 REALTIME / BROADCAST FUNCTIONS
-- ============================================================================

-- send_realtime_event(text, text, jsonb) - sends private realtime event
CREATE OR REPLACE FUNCTION public.send_realtime_event(topic text, event_name text, payload jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  PERFORM realtime.send(payload, event_name, topic, TRUE);
END;
$function$;

-- broadcast_table_changes() - generic table change broadcaster
CREATE OR REPLACE FUNCTION public.broadcast_table_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  topic_name text;
  startup_uuid uuid;
  new_json jsonb;
  old_json jsonb;
BEGIN
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    new_json := row_to_json(NEW)::jsonb;
    startup_uuid := (new_json->>'startup_id')::uuid;
  END IF;

  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    old_json := row_to_json(OLD)::jsonb;
    IF startup_uuid IS NULL THEN
      startup_uuid := (old_json->>'startup_id')::uuid;
    END IF;
  END IF;

  IF startup_uuid IS NOT NULL THEN
    topic_name := TG_TABLE_NAME || ':' || startup_uuid::text || ':changes';
  ELSE
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
      topic_name := TG_TABLE_NAME || ':' || (new_json->>'id')::text || ':changes';
    ELSE
      topic_name := TG_TABLE_NAME || ':' || (old_json->>'id')::text || ':changes';
    END IF;
  END IF;

  PERFORM realtime.broadcast_changes(
    topic_name,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- broadcast_validator_report_insert() - broadcasts when validator report is created
CREATE OR REPLACE FUNCTION public.broadcast_validator_report_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  _supabase_url text := current_setting('app.settings.supabase_url', true);
  _service_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  PERFORM net.http_post(
    url := _supabase_url || '/realtime/v1/api/broadcast',
    headers := jsonb_build_object(
      'apikey', _service_key,
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || _service_key
    ),
    body := jsonb_build_object(
      'messages', jsonb_build_array(
        jsonb_build_object(
          'topic', 'validator:' || NEW.session_id::text,
          'event', 'report_created',
          'payload', jsonb_build_object(
            'reportId', NEW.id,
            'sessionId', NEW.session_id,
            'overallScore', NEW.overall_score,
            'timestamp', extract(epoch from now()) * 1000
          )
        )
      )
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'broadcast_validator_report_insert failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- broadcast_validator_session_change() - broadcasts session status changes
CREATE OR REPLACE FUNCTION public.broadcast_validator_session_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  _supabase_url text := current_setting('app.settings.supabase_url', true);
  _service_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    PERFORM net.http_post(
      url := _supabase_url || '/realtime/v1/api/broadcast',
      headers := jsonb_build_object(
        'apikey', _service_key,
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || _service_key
      ),
      body := jsonb_build_object(
        'messages', jsonb_build_array(
          jsonb_build_object(
            'topic', 'validator:' || NEW.id::text,
            'event', 'session_status_changed',
            'payload', jsonb_build_object(
              'sessionId', NEW.id,
              'status', NEW.status,
              'previousStatus', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE null END,
              'timestamp', extract(epoch from now()) * 1000
            )
          )
        )
      )
    );
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'broadcast_validator_session_change failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;

-- can_access_realtime_channel(text) - checks if user can access a realtime channel
CREATE OR REPLACE FUNCTION public.can_access_realtime_channel(channel_topic text)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (
    EXISTS (
      SELECT 1 FROM startups s
      JOIN profiles p ON p.org_id = s.org_id
      WHERE p.id = (SELECT auth.uid())
      AND (
        channel_topic LIKE '%:' || s.id::text || ':%'
        OR channel_topic LIKE '%:' || s.id::text || ':changes'
      )
    )
    OR channel_topic LIKE 'onboarding:%'
    OR EXISTS (
      SELECT 1 FROM pitch_decks pd
      JOIN startups s ON s.id = pd.startup_id
      JOIN profiles p ON p.org_id = s.org_id
      WHERE p.id = (SELECT auth.uid())
      AND channel_topic = 'pitch_deck_generation:' || pd.id::text
    )
    OR EXISTS (
      SELECT 1 FROM validator_sessions vs
      WHERE vs.user_id = (SELECT auth.uid())
      AND channel_topic = 'validator:' || vs.id::text
    )
  );
$function$;

-- check_realtime_setup() - diagnostic function for realtime setup
CREATE OR REPLACE FUNCTION public.check_realtime_setup()
 RETURNS TABLE(check_name text, status text, details text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    'Broadcast triggers'::text,
    COUNT(*)::text,
    'Number of broadcast_*_changes triggers'::text
  FROM pg_trigger
  WHERE tgname LIKE 'broadcast_%_changes';

  RETURN QUERY
  SELECT
    'Publication tables'::text,
    COUNT(*)::text,
    'Tables in supabase_realtime publication'::text
  FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime';

  RETURN QUERY
  SELECT
    'RLS policies'::text,
    COUNT(*)::text,
    'Policies on realtime.messages'::text
  FROM pg_policies
  WHERE schemaname = 'realtime' AND tablename = 'messages';
END;
$function$;

-- ============================================================================
-- 2.11 AUTOMATION FUNCTIONS
-- ============================================================================

-- emit_automation_event(...) - emits an automation event and notifies
CREATE OR REPLACE FUNCTION public.emit_automation_event(p_event_name text, p_payload jsonb DEFAULT '{}'::jsonb, p_source text DEFAULT 'frontend'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_event_id uuid;
  v_user_id uuid := auth.uid();
  v_startup_id uuid;
begin
  select s.id into v_startup_id
  from startups s
  join profiles p on p.org_id = s.org_id
  where p.id = v_user_id
  limit 1;
  insert into automation_events (user_id, startup_id, event_name, event_payload, source)
  values (v_user_id, v_startup_id, p_event_name, p_payload, p_source)
  returning id into v_event_id;
  perform pg_notify('automation_event', json_build_object('event_id', v_event_id, 'event_name', p_event_name, 'user_id', v_user_id)::text);
  return v_event_id;
end;
$function$;

-- find_matching_triggers(text, jsonb) - finds active triggers matching an event
CREATE OR REPLACE FUNCTION public.find_matching_triggers(p_event_name text, p_payload jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(trigger_id uuid, trigger_name text, pack_id uuid, playbook_id uuid, execution_mode text, auto_apply_outputs boolean, output_targets jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  return query
  select t.id, t.name, t.pack_id, t.playbook_id, t.execution_mode, t.auto_apply_outputs, t.output_targets
  from automation_triggers t
  where t.is_active = true and t.trigger_type = 'event' and t.event_name = p_event_name
    and (t.condition_rules = '{}'::jsonb or check_condition_rules(t.condition_rules, p_payload));
end;
$function$;

-- start_automation_execution(uuid, jsonb) - starts an automation execution
CREATE OR REPLACE FUNCTION public.start_automation_execution(p_trigger_id uuid, p_event_payload jsonb DEFAULT '{}'::jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_execution_id uuid;
  v_trigger record;
  v_user_id uuid := auth.uid();
  v_startup_id uuid;
  v_total_steps int;
begin
  select * into v_trigger from automation_triggers where id = p_trigger_id and is_active = true;
  if not found then raise exception 'Trigger not found or inactive'; end if;
  select s.id into v_startup_id from startups s join profiles p on p.org_id = s.org_id where p.id = v_user_id limit 1;
  if v_trigger.pack_id is not null then
    select count(*) into v_total_steps from prompt_pack_steps where pack_id = v_trigger.pack_id;
  elsif v_trigger.playbook_id is not null then
    select count(*) into v_total_steps from playbook_steps where playbook_id = v_trigger.playbook_id;
  else
    v_total_steps := 0;
  end if;
  insert into automation_executions (trigger_id, user_id, startup_id, pack_id, playbook_id, trigger_event, trigger_payload, status, started_at, total_steps)
  values (p_trigger_id, v_user_id, v_startup_id, v_trigger.pack_id, v_trigger.playbook_id, v_trigger.event_name, p_event_payload, 'running', now(), v_total_steps)
  returning id into v_execution_id;
  return v_execution_id;
end;
$function$;

-- update_automation_execution(...) - updates an automation execution status
CREATE OR REPLACE FUNCTION public.update_automation_execution(p_execution_id uuid, p_status text, p_steps_completed integer DEFAULT NULL::integer, p_outputs jsonb DEFAULT NULL::jsonb, p_applied_to jsonb DEFAULT NULL::jsonb, p_error_message text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  update automation_executions
  set status = coalesce(p_status, status), steps_completed = coalesce(p_steps_completed, steps_completed),
    outputs = coalesce(p_outputs, outputs), applied_to = coalesce(p_applied_to, applied_to),
    error_message = p_error_message,
    completed_at = case when p_status in ('completed', 'failed', 'cancelled') then now() else completed_at end
  where id = p_execution_id and user_id = auth.uid();
end;
$function$;

-- get_pending_automations() - gets pending automation executions
CREATE OR REPLACE FUNCTION public.get_pending_automations()
 RETURNS TABLE(execution_id uuid, trigger_id uuid, user_id uuid, startup_id uuid, pack_id uuid, playbook_id uuid, trigger_payload jsonb, retry_attempt integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  return query
  select e.id, e.trigger_id, e.user_id, e.startup_id, e.pack_id, e.playbook_id, e.trigger_payload, e.retry_attempt
  from automation_executions e
  join automation_triggers t on t.id = e.trigger_id
  where e.status in ('pending', 'retrying') and (e.retry_attempt < t.retry_count or e.retry_attempt = 0)
  order by e.created_at limit 10;
end;
$function$;
