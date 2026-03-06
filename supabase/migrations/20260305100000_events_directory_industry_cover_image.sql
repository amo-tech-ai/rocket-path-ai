-- Expose industry_events.image_url as cover_image_url in events_directory so
-- /events shows Cloudinary images for industry events (folder: industry-events).
-- Cloudinary folder id cdfe41b559092e445b36b46c5a8c4ded0b = path "industry-events".

CREATE OR REPLACE VIEW public.events_directory
WITH (security_invoker = true) AS
SELECT
  events.id,
  events.name,
  COALESCE(events.name, events.title) AS display_name,
  events.description,
  events.start_date,
  events.end_date,
  events.location,
  events.location AS display_location,
  events.event_type,
  events.status,
  'hosted'::text AS event_source,
  events.event_scope,
  events.startup_id,
  events.capacity,
  events.budget,
  events.ticket_price,
  events.registration_url,
  events.is_public,
  events.slug,
  events.cover_image_url,
  events.organizer_name,
  events.organizer_logo_url,
  events.tags,
  events.industry,
  events.target_audience,
  events.related_contact_id,
  events.related_deal_id,
  events.virtual_meeting_url,
  NULL::integer AS startup_relevance,
  NULL::text AS ticket_cost_tier,
  NULL::numeric AS ticket_cost_min,
  NULL::numeric AS ticket_cost_max,
  NULL::text AS external_url,
  NULL::event_category[] AS categories,
  NULL::text[] AS topics,
  events.created_at,
  events.updated_at,
  events.published_at,
  events.cancelled_at
FROM events
WHERE events.event_scope = 'hosted'::event_scope

UNION ALL

SELECT
  industry_events.id,
  industry_events.name,
  COALESCE(industry_events.full_name, industry_events.name) AS display_name,
  industry_events.description,
  industry_events.event_date::timestamp with time zone AS start_date,
  industry_events.end_date::timestamp with time zone AS end_date,
  (industry_events.location_city || ', '::text) || COALESCE(industry_events.location_country, ''::text) AS location,
  (industry_events.location_city || ', '::text) || COALESCE(industry_events.location_country, ''::text) AS display_location,
  'conference'::event_type AS event_type,
  CASE
    WHEN industry_events.event_date < CURRENT_DATE THEN 'completed'::event_status
    WHEN industry_events.event_date >= CURRENT_DATE THEN 'scheduled'::event_status
    ELSE 'scheduled'::event_status
  END AS status,
  'industry'::text AS event_source,
  'external'::event_scope AS event_scope,
  NULL::uuid AS startup_id,
  NULL::integer AS capacity,
  NULL::numeric AS budget,
  NULL::numeric AS ticket_price,
  industry_events.registration_url,
  true AS is_public,
  industry_events.slug,
  industry_events.image_url AS cover_image_url,
  NULL::text AS organizer_name,
  NULL::text AS organizer_logo_url,
  industry_events.tags,
  NULL::text AS industry,
  industry_events.audience_types AS target_audience,
  NULL::uuid AS related_contact_id,
  NULL::uuid AS related_deal_id,
  NULL::text AS virtual_meeting_url,
  industry_events.startup_relevance,
  industry_events.ticket_cost_tier::text AS ticket_cost_tier,
  industry_events.ticket_cost_min,
  industry_events.ticket_cost_max,
  industry_events.website_url AS external_url,
  industry_events.categories,
  industry_events.topics,
  industry_events.created_at,
  industry_events.updated_at,
  NULL::timestamp with time zone AS published_at,
  NULL::timestamp with time zone AS cancelled_at
FROM industry_events
WHERE industry_events.event_date >= (CURRENT_DATE - '30 days'::interval)
   OR industry_events.event_date IS NULL;

COMMENT ON VIEW public.events_directory IS 'Unified directory for /events: hosted events + industry events. cover_image_url for industry comes from industry_events.image_url (Cloudinary industry-events folder).';
