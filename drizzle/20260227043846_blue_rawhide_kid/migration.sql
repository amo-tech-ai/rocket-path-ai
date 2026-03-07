-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "cron";
--> statement-breakpoint
CREATE SCHEMA "extensions";
--> statement-breakpoint
CREATE SCHEMA "graphql";
--> statement-breakpoint
CREATE SCHEMA "graphql_public";
--> statement-breakpoint
CREATE SCHEMA "net";
--> statement-breakpoint
CREATE SCHEMA "pgbouncer";
--> statement-breakpoint
CREATE SCHEMA "realtime";
--> statement-breakpoint
CREATE SCHEMA "storage";
--> statement-breakpoint
CREATE SCHEMA "supabase_migrations";
--> statement-breakpoint
CREATE SCHEMA "vault";
--> statement-breakpoint
CREATE TYPE "auth"."factor_type" AS ENUM('totp', 'webauthn', 'phone');--> statement-breakpoint
CREATE TYPE "auth"."factor_status" AS ENUM('unverified', 'verified');--> statement-breakpoint
CREATE TYPE "auth"."aal_level" AS ENUM('aal1', 'aal2', 'aal3');--> statement-breakpoint
CREATE TYPE "auth"."code_challenge_method" AS ENUM('s256', 'plain');--> statement-breakpoint
CREATE TYPE "auth"."one_time_token_type" AS ENUM('confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token');--> statement-breakpoint
CREATE TYPE "auth"."oauth_registration_type" AS ENUM('dynamic', 'manual');--> statement-breakpoint
CREATE TYPE "auth"."oauth_authorization_status" AS ENUM('pending', 'approved', 'denied', 'expired');--> statement-breakpoint
CREATE TYPE "auth"."oauth_response_type" AS ENUM('code');--> statement-breakpoint
CREATE TYPE "auth"."oauth_client_type" AS ENUM('public', 'confidential');--> statement-breakpoint
CREATE TYPE "realtime"."equality_op" AS ENUM('eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in');--> statement-breakpoint
CREATE TYPE "realtime"."action" AS ENUM('INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR');--> statement-breakpoint
CREATE TYPE "storage"."buckettype" AS ENUM('STANDARD', 'ANALYTICS', 'VECTOR');--> statement-breakpoint
CREATE TYPE "app_role" AS ENUM('admin', 'moderator', 'user');--> statement-breakpoint
CREATE TYPE "pitch_deck_status" AS ENUM('draft', 'in_progress', 'review', 'final', 'archived', 'generating');--> statement-breakpoint
CREATE TYPE "slide_type" AS ENUM('title', 'problem', 'solution', 'product', 'market', 'business_model', 'traction', 'competition', 'team', 'financials', 'ask', 'contact', 'custom');--> statement-breakpoint
CREATE TYPE "event_type" AS ENUM('meeting', 'deadline', 'reminder', 'milestone', 'call', 'demo', 'pitch', 'funding_round', 'other', 'demo_day', 'pitch_night', 'networking', 'workshop', 'conference', 'meetup', 'webinar', 'hackathon');--> statement-breakpoint
CREATE TYPE "event_status" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled');--> statement-breakpoint
CREATE TYPE "activity_type" AS ENUM('task_created', 'task_updated', 'task_completed', 'task_deleted', 'task_assigned', 'deal_created', 'deal_updated', 'deal_stage_changed', 'deal_won', 'deal_lost', 'contact_created', 'contact_updated', 'contact_deleted', 'email_sent', 'call_logged', 'meeting_scheduled', 'project_created', 'project_updated', 'project_completed', 'milestone_reached', 'document_created', 'document_updated', 'document_shared', 'deck_created', 'deck_updated', 'deck_shared', 'deck_exported', 'ai_insight_generated', 'ai_task_suggested', 'ai_analysis_completed', 'ai_extraction_completed', 'user_joined', 'user_left', 'settings_changed', 'other');--> statement-breakpoint
CREATE TYPE "template_category" AS ENUM('startup', 'series_a', 'series_b', 'growth', 'enterprise', 'saas', 'marketplace', 'fintech', 'healthtech', 'general', 'custom');--> statement-breakpoint
CREATE TYPE "startup_event_type" AS ENUM('demo_day', 'pitch_night', 'networking', 'workshop', 'investor_meetup', 'founder_dinner', 'hackathon', 'conference', 'webinar', 'other');--> statement-breakpoint
CREATE TYPE "startup_event_status" AS ENUM('draft', 'planning', 'confirmed', 'live', 'completed', 'cancelled', 'postponed');--> statement-breakpoint
CREATE TYPE "event_location_type" AS ENUM('in_person', 'virtual', 'hybrid');--> statement-breakpoint
CREATE TYPE "sponsor_tier" AS ENUM('platinum', 'gold', 'silver', 'bronze', 'in_kind', 'media', 'community');--> statement-breakpoint
CREATE TYPE "sponsor_status" AS ENUM('prospect', 'researching', 'contacted', 'negotiating', 'interested', 'confirmed', 'declined', 'cancelled');--> statement-breakpoint
CREATE TYPE "venue_status" AS ENUM('researching', 'shortlisted', 'contacted', 'visiting', 'negotiating', 'booked', 'cancelled', 'rejected');--> statement-breakpoint
CREATE TYPE "rsvp_status" AS ENUM('invited', 'pending', 'registered', 'confirmed', 'waitlist', 'declined', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "attendee_type" AS ENUM('general', 'vip', 'speaker', 'panelist', 'sponsor_rep', 'press', 'investor', 'founder', 'mentor', 'staff', 'volunteer');--> statement-breakpoint
CREATE TYPE "message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "message_type" AS ENUM('text', 'template', 'broadcast', 'image', 'document', 'location', 'contact', 'interactive');--> statement-breakpoint
CREATE TYPE "message_status" AS ENUM('pending', 'sent', 'delivered', 'read', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "message_channel" AS ENUM('whatsapp', 'sms', 'email', 'in_app');--> statement-breakpoint
CREATE TYPE "event_asset_type" AS ENUM('social_post', 'email', 'graphic', 'banner', 'flyer', 'press_release', 'blog_post', 'video', 'landing_page', 'registration_form', 'agenda', 'speaker_bio', 'sponsor_logo_pack', 'photo', 'other');--> statement-breakpoint
CREATE TYPE "asset_platform" AS ENUM('twitter', 'linkedin', 'instagram', 'facebook', 'tiktok', 'youtube', 'email', 'website', 'whatsapp', 'press', 'internal', 'other');--> statement-breakpoint
CREATE TYPE "asset_status" AS ENUM('draft', 'review', 'approved', 'scheduled', 'published', 'failed', 'archived');--> statement-breakpoint
CREATE TYPE "event_task_category" AS ENUM('planning', 'venue', 'sponsors', 'speakers', 'marketing', 'registration', 'logistics', 'catering', 'av_tech', 'content', 'communications', 'post_event', 'other');--> statement-breakpoint
CREATE TYPE "event_scope" AS ENUM('internal', 'hosted', 'external');--> statement-breakpoint
CREATE TYPE "attending_status" AS ENUM('interested', 'registered', 'attending', 'attended', 'not_attending');--> statement-breakpoint
CREATE TYPE "event_format" AS ENUM('in_person', 'virtual', 'hybrid');--> statement-breakpoint
CREATE TYPE "event_category" AS ENUM('research', 'industry', 'startup_vc', 'trade_show', 'enterprise', 'government_policy', 'developer');--> statement-breakpoint
CREATE TYPE "ticket_cost_tier" AS ENUM('free', 'low', 'medium', 'high', 'premium');--> statement-breakpoint
CREATE TYPE "media_pass_status" AS ENUM('yes', 'no', 'unclear');--> statement-breakpoint
CREATE TYPE "question_type" AS ENUM('multiple_choice', 'multi_select', 'text', 'number');--> statement-breakpoint
CREATE TYPE "pack_category" AS ENUM('ideation', 'validation', 'market', 'canvas', 'pitch', 'gtm', 'pricing', 'hiring', 'funding');--> statement-breakpoint
CREATE TYPE "model_preference" AS ENUM('gemini', 'claude', 'claude-sonnet', 'auto');--> statement-breakpoint
CREATE TYPE "run_status" AS ENUM('pending', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "playbook_status" AS ENUM('suggested', 'active', 'in_progress', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "validation_verdict" AS ENUM('go', 'conditional', 'pivot', 'no_go');--> statement-breakpoint
CREATE TYPE "feature_context" AS ENUM('onboarding', 'lean_canvas', 'pitch_deck', 'tasks', 'chatbot', 'validator', 'gtm_planning', 'fundraising');--> statement-breakpoint
CREATE TYPE "funding_stage" AS ENUM('pre_seed', 'seed', 'series_a', 'series_b', 'growth');--> statement-breakpoint
CREATE TYPE "coach_phase" AS ENUM('onboarding', 'assessment', 'constraint', 'campaign_setup', 'sprint_planning', 'sprint_execution', 'cycle_review');--> statement-breakpoint
CREATE TYPE "constraint_type" AS ENUM('acquisition', 'monetization', 'retention', 'scalability');--> statement-breakpoint
CREATE TYPE "pdca_step" AS ENUM('plan', 'do', 'check', 'act');--> statement-breakpoint
CREATE TYPE "assumption_status" AS ENUM('untested', 'testing', 'validated', 'invalidated', 'obsolete');--> statement-breakpoint
CREATE TYPE "assumption_source" AS ENUM('problem', 'solution', 'unique_value_proposition', 'unfair_advantage', 'customer_segments', 'channels', 'revenue_streams', 'cost_structure', 'key_metrics');--> statement-breakpoint
CREATE TYPE "experiment_type" AS ENUM('customer_interview', 'survey', 'landing_page', 'prototype_test', 'concierge', 'wizard_of_oz', 'smoke_test', 'a_b_test', 'fake_door', 'other');--> statement-breakpoint
CREATE TYPE "experiment_status" AS ENUM('designed', 'recruiting', 'running', 'collecting', 'analyzing', 'completed', 'paused', 'cancelled');--> statement-breakpoint
CREATE TYPE "segment_type" AS ENUM('early_adopter', 'mainstream', 'enterprise', 'smb', 'consumer', 'prosumer', 'developer', 'other');--> statement-breakpoint
CREATE TYPE "force_type" AS ENUM('push', 'pull', 'inertia', 'friction');--> statement-breakpoint
CREATE TYPE "job_type" AS ENUM('functional', 'emotional', 'social');--> statement-breakpoint
CREATE TYPE "interview_status" AS ENUM('scheduled', 'completed', 'transcribed', 'analyzed', 'cancelled', 'no_show');--> statement-breakpoint
CREATE TYPE "interview_type" AS ENUM('problem_discovery', 'solution_validation', 'usability_test', 'customer_development', 'sales_call', 'support_call', 'other');--> statement-breakpoint
CREATE TYPE "insight_type" AS ENUM('pain_point', 'desired_outcome', 'current_behavior', 'switching_trigger', 'objection', 'feature_request', 'competitor_mention', 'pricing_feedback', 'aha_moment', 'job_to_be_done', 'quote', 'other');--> statement-breakpoint
CREATE TYPE "workflow_status" AS ENUM('draft', 'active', 'paused', 'archived');--> statement-breakpoint
CREATE TYPE "trigger_type" AS ENUM('event', 'schedule', 'webhook', 'manual');--> statement-breakpoint
CREATE TYPE "action_type" AS ENUM('create_task', 'send_notification', 'update_record', 'call_api', 'send_email', 'ai_generate', 'delay', 'condition');--> statement-breakpoint
CREATE TYPE "knowledge_source_type" AS ENUM('deloitte', 'bcg', 'pwc', 'mckinsey', 'cb_insights', 'gartner', 'forrester', 'harvard_business_review', 'mit_sloan', 'yc_research', 'a16z', 'sequoia', 'internal', 'other');--> statement-breakpoint
CREATE TYPE "confidence_level" AS ENUM('high', 'medium', 'low');--> statement-breakpoint
CREATE TYPE "net"."request_status" AS ENUM('PENDING', 'SUCCESS', 'ERROR');--> statement-breakpoint
CREATE SEQUENCE "cron"."jobid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "cron"."runid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE SEQUENCE "graphql"."seq_schema_version" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1 CYCLE;--> statement-breakpoint
CREATE TABLE "auth"."audit_log_entries" (
	"instance_id" uuid,
	"id" uuid PRIMARY KEY,
	"payload" json,
	"created_at" timestamp with time zone,
	"ip_address" varchar(64) DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."custom_oauth_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"provider_type" text NOT NULL,
	"identifier" text NOT NULL CONSTRAINT "custom_oauth_providers_identifier_key" UNIQUE,
	"name" text NOT NULL,
	"client_id" text NOT NULL,
	"client_secret" text NOT NULL,
	"acceptable_client_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"scopes" text[] DEFAULT '{}'::text[] NOT NULL,
	"pkce_enabled" boolean DEFAULT true NOT NULL,
	"attribute_mapping" jsonb DEFAULT '{}' NOT NULL,
	"authorization_params" jsonb DEFAULT '{}' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"email_optional" boolean DEFAULT false NOT NULL,
	"issuer" text,
	"discovery_url" text,
	"skip_nonce_check" boolean DEFAULT false NOT NULL,
	"cached_discovery" jsonb,
	"discovery_cached_at" timestamp with time zone,
	"authorization_url" text,
	"token_url" text,
	"userinfo_url" text,
	"jwks_uri" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "custom_oauth_providers_authorization_url_https" CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
	CONSTRAINT "custom_oauth_providers_authorization_url_length" CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
	CONSTRAINT "custom_oauth_providers_client_id_length" CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
	CONSTRAINT "custom_oauth_providers_discovery_url_length" CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
	CONSTRAINT "custom_oauth_providers_identifier_format" CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
	CONSTRAINT "custom_oauth_providers_issuer_length" CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
	CONSTRAINT "custom_oauth_providers_jwks_uri_https" CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
	CONSTRAINT "custom_oauth_providers_jwks_uri_length" CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
	CONSTRAINT "custom_oauth_providers_name_length" CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
	CONSTRAINT "custom_oauth_providers_oauth2_requires_endpoints" CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
	CONSTRAINT "custom_oauth_providers_oidc_discovery_url_https" CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
	CONSTRAINT "custom_oauth_providers_oidc_issuer_https" CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
	CONSTRAINT "custom_oauth_providers_oidc_requires_issuer" CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
	CONSTRAINT "custom_oauth_providers_provider_type_check" CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
	CONSTRAINT "custom_oauth_providers_token_url_https" CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
	CONSTRAINT "custom_oauth_providers_token_url_length" CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
	CONSTRAINT "custom_oauth_providers_userinfo_url_https" CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
	CONSTRAINT "custom_oauth_providers_userinfo_url_length" CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);
--> statement-breakpoint
CREATE TABLE "auth"."flow_state" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid,
	"auth_code" text,
	"code_challenge_method" "auth"."code_challenge_method",
	"code_challenge" text,
	"provider_type" text NOT NULL,
	"provider_access_token" text,
	"provider_refresh_token" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"authentication_method" text NOT NULL,
	"auth_code_issued_at" timestamp with time zone,
	"invite_token" text,
	"referrer" text,
	"oauth_client_state_id" uuid,
	"linking_target_id" uuid,
	"email_optional" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."identities" (
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"identity_data" jsonb NOT NULL,
	"provider" text NOT NULL,
	"last_sign_in_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"email" text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	CONSTRAINT "identities_provider_id_provider_unique" UNIQUE("provider_id","provider")
);
--> statement-breakpoint
ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."instances" (
	"id" uuid PRIMARY KEY,
	"uuid" uuid,
	"raw_base_config" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."mfa_amr_claims" (
	"session_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"authentication_method" text NOT NULL,
	"id" uuid,
	CONSTRAINT "amr_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE("session_id","authentication_method")
);
--> statement-breakpoint
ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."mfa_challenges" (
	"id" uuid PRIMARY KEY,
	"factor_id" uuid NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"ip_address" inet NOT NULL,
	"otp_code" text,
	"web_authn_session_data" jsonb
);
--> statement-breakpoint
ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."mfa_factors" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"friendly_name" text,
	"factor_type" "auth"."factor_type" NOT NULL,
	"status" "auth"."factor_status" NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"secret" text,
	"phone" text,
	"last_challenged_at" timestamp with time zone CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE,
	"web_authn_credential" jsonb,
	"web_authn_aaguid" uuid,
	"last_webauthn_challenge_data" jsonb
);
--> statement-breakpoint
ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."oauth_authorizations" (
	"id" uuid PRIMARY KEY,
	"authorization_id" text NOT NULL CONSTRAINT "oauth_authorizations_authorization_id_key" UNIQUE,
	"client_id" uuid NOT NULL,
	"user_id" uuid,
	"redirect_uri" text NOT NULL,
	"scope" text NOT NULL,
	"state" text,
	"resource" text,
	"code_challenge" text,
	"code_challenge_method" "auth"."code_challenge_method",
	"response_type" "auth"."oauth_response_type" DEFAULT 'code'::"auth"."oauth_response_type" NOT NULL,
	"status" "auth"."oauth_authorization_status" DEFAULT 'pending'::"auth"."oauth_authorization_status" NOT NULL,
	"authorization_code" text CONSTRAINT "oauth_authorizations_authorization_code_key" UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
	"approved_at" timestamp with time zone,
	"nonce" text,
	CONSTRAINT "oauth_authorizations_authorization_code_length" CHECK ((char_length(authorization_code) <= 255)),
	CONSTRAINT "oauth_authorizations_code_challenge_length" CHECK ((char_length(code_challenge) <= 128)),
	CONSTRAINT "oauth_authorizations_expires_at_future" CHECK ((expires_at > created_at)),
	CONSTRAINT "oauth_authorizations_nonce_length" CHECK ((char_length(nonce) <= 255)),
	CONSTRAINT "oauth_authorizations_redirect_uri_length" CHECK ((char_length(redirect_uri) <= 2048)),
	CONSTRAINT "oauth_authorizations_resource_length" CHECK ((char_length(resource) <= 2048)),
	CONSTRAINT "oauth_authorizations_scope_length" CHECK ((char_length(scope) <= 4096)),
	CONSTRAINT "oauth_authorizations_state_length" CHECK ((char_length(state) <= 4096))
);
--> statement-breakpoint
CREATE TABLE "auth"."oauth_client_states" (
	"id" uuid PRIMARY KEY,
	"provider_type" text NOT NULL,
	"code_verifier" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."oauth_clients" (
	"id" uuid PRIMARY KEY,
	"client_secret_hash" text,
	"registration_type" "auth"."oauth_registration_type" NOT NULL,
	"redirect_uris" text NOT NULL,
	"grant_types" text NOT NULL,
	"client_name" text,
	"client_uri" text,
	"logo_uri" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"client_type" "auth"."oauth_client_type" DEFAULT 'confidential'::"auth"."oauth_client_type" NOT NULL,
	"token_endpoint_auth_method" text NOT NULL,
	CONSTRAINT "oauth_clients_client_name_length" CHECK ((char_length(client_name) <= 1024)),
	CONSTRAINT "oauth_clients_client_uri_length" CHECK ((char_length(client_uri) <= 2048)),
	CONSTRAINT "oauth_clients_logo_uri_length" CHECK ((char_length(logo_uri) <= 2048)),
	CONSTRAINT "oauth_clients_token_endpoint_auth_method_check" CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);
--> statement-breakpoint
CREATE TABLE "auth"."oauth_consents" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"scopes" text NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone,
	CONSTRAINT "oauth_consents_user_client_unique" UNIQUE("user_id","client_id"),
	CONSTRAINT "oauth_consents_revoked_after_granted" CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
	CONSTRAINT "oauth_consents_scopes_length" CHECK ((char_length(scopes) <= 2048)),
	CONSTRAINT "oauth_consents_scopes_not_empty" CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);
--> statement-breakpoint
CREATE TABLE "auth"."one_time_tokens" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"token_type" "auth"."one_time_token_type" NOT NULL,
	"token_hash" text NOT NULL,
	"relates_to" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "one_time_tokens_token_hash_check" CHECK ((char_length(token_hash) > 0))
);
--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."refresh_tokens" (
	"instance_id" uuid,
	"id" bigserial PRIMARY KEY,
	"token" varchar(255) CONSTRAINT "refresh_tokens_token_unique" UNIQUE,
	"user_id" varchar(255),
	"revoked" boolean,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"parent" varchar(255),
	"session_id" uuid
);
--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."saml_providers" (
	"id" uuid PRIMARY KEY,
	"sso_provider_id" uuid NOT NULL,
	"entity_id" text NOT NULL CONSTRAINT "saml_providers_entity_id_key" UNIQUE,
	"metadata_xml" text NOT NULL,
	"metadata_url" text,
	"attribute_mapping" jsonb,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"name_id_format" text,
	CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
	CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
	CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);
--> statement-breakpoint
ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."saml_relay_states" (
	"id" uuid PRIMARY KEY,
	"sso_provider_id" uuid NOT NULL,
	"request_id" text NOT NULL,
	"for_email" text,
	"redirect_to" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"flow_state_id" uuid,
	CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);
--> statement-breakpoint
ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."schema_migrations" (
	"version" varchar(255) PRIMARY KEY
);
--> statement-breakpoint
ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."sessions" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"factor_id" uuid,
	"aal" "auth"."aal_level",
	"not_after" timestamp with time zone,
	"refreshed_at" timestamp,
	"user_agent" text,
	"ip" inet,
	"tag" text,
	"oauth_client_id" uuid,
	"refresh_token_hmac_key" text,
	"refresh_token_counter" bigint,
	"scopes" text,
	CONSTRAINT "sessions_scopes_length" CHECK ((char_length(scopes) <= 4096))
);
--> statement-breakpoint
ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."sso_domains" (
	"id" uuid PRIMARY KEY,
	"sso_provider_id" uuid NOT NULL,
	"domain" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);
--> statement-breakpoint
ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."sso_providers" (
	"id" uuid PRIMARY KEY,
	"resource_id" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"disabled" boolean,
	CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);
--> statement-breakpoint
ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"instance_id" uuid,
	"id" uuid PRIMARY KEY,
	"aud" varchar(255),
	"role" varchar(255),
	"email" varchar(255),
	"encrypted_password" varchar(255),
	"email_confirmed_at" timestamp with time zone,
	"invited_at" timestamp with time zone,
	"confirmation_token" varchar(255),
	"confirmation_sent_at" timestamp with time zone,
	"recovery_token" varchar(255),
	"recovery_sent_at" timestamp with time zone,
	"email_change_token_new" varchar(255),
	"email_change" varchar(255),
	"email_change_sent_at" timestamp with time zone,
	"last_sign_in_at" timestamp with time zone,
	"raw_app_meta_data" jsonb,
	"raw_user_meta_data" jsonb,
	"is_super_admin" boolean,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	"phone" text DEFAULT NULL CONSTRAINT "users_phone_key" UNIQUE,
	"phone_confirmed_at" timestamp with time zone,
	"phone_change" text DEFAULT '',
	"phone_change_token" varchar(255) DEFAULT '',
	"phone_change_sent_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
	"email_change_token_current" varchar(255) DEFAULT '',
	"email_change_confirm_status" smallint DEFAULT 0,
	"banned_until" timestamp with time zone,
	"reauthentication_token" varchar(255) DEFAULT '',
	"reauthentication_sent_at" timestamp with time zone,
	"is_sso_user" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_email_change_confirm_status_check" CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);
--> statement-breakpoint
ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cron"."job" (
	"jobid" bigserial PRIMARY KEY,
	"schedule" text NOT NULL,
	"command" text NOT NULL,
	"nodename" text DEFAULT 'localhost' NOT NULL,
	"nodeport" integer DEFAULT inet_server_port() NOT NULL,
	"database" text DEFAULT current_database() NOT NULL,
	"username" text DEFAULT CURRENT_USER NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"jobname" text,
	CONSTRAINT "jobname_username_uniq" UNIQUE("jobname","username")
);
--> statement-breakpoint
ALTER TABLE "cron"."job" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "cron"."job_run_details" (
	"jobid" bigint,
	"runid" bigserial PRIMARY KEY,
	"job_pid" integer,
	"database" text,
	"username" text,
	"command" text,
	"status" text,
	"return_message" text,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "cron"."job_run_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "net"."_http_response" (
	"id" bigint,
	"status_code" integer,
	"content_type" text,
	"headers" jsonb,
	"content" text,
	"timed_out" boolean,
	"error_msg" text,
	"created" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "net"."http_request_queue" (
	"id" bigserial,
	"method" net.http_method NOT NULL,
	"url" text NOT NULL,
	"headers" jsonb,
	"body" bytea,
	"timeout_milliseconds" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "action_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"action_id" uuid NOT NULL,
	"status" text DEFAULT 'pending',
	"executed_at" timestamp with time zone,
	"result" jsonb,
	"error_message" text,
	"undo_state" jsonb,
	"rolled_back_at" timestamp with time zone,
	"rolled_back_by" uuid,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "action_executions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text, 'rolled_back'::text])))
);
--> statement-breakpoint
ALTER TABLE "action_executions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"user_id" uuid,
	"activity_type" "activity_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"entity_type" text,
	"entity_id" uuid,
	"task_id" uuid,
	"deal_id" uuid,
	"contact_id" uuid,
	"project_id" uuid,
	"document_id" uuid,
	"metadata" jsonb DEFAULT '{}',
	"is_system_generated" boolean DEFAULT false,
	"importance" text DEFAULT 'normal',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"org_id" uuid,
	CONSTRAINT "activities_importance_check" CHECK ((importance = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'critical'::text])))
);
--> statement-breakpoint
ALTER TABLE "activities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "agent_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid,
	"agent_name" text NOT NULL,
	"display_name" text NOT NULL,
	"description" text,
	"model" text DEFAULT 'gemini-3-flash-preview' NOT NULL,
	"fallback_model" text DEFAULT 'gemini-3-flash-preview',
	"max_input_tokens" integer DEFAULT 8000,
	"max_output_tokens" integer DEFAULT 2000,
	"thinking_level" text DEFAULT 'high',
	"enabled_tools" text[] DEFAULT '{}'::text[],
	"max_cost_per_run" numeric(6,4) DEFAULT '0.10',
	"daily_budget" numeric(8,2),
	"system_prompt" text,
	"temperature" numeric(2,1) DEFAULT '0.7',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "agent_configs_org_id_agent_name_key" UNIQUE("org_id","agent_name"),
	CONSTRAINT "agent_configs_thinking_level_check" CHECK ((thinking_level = ANY (ARRAY['none'::text, 'low'::text, 'high'::text])))
);
--> statement-breakpoint
ALTER TABLE "agent_configs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"startup_id" uuid,
	"agent_name" text NOT NULL,
	"action" text NOT NULL,
	"model" text NOT NULL,
	"provider" text DEFAULT 'gemini',
	"input_tokens" integer,
	"output_tokens" integer,
	"thinking_tokens" integer,
	"cost_usd" numeric(10,6),
	"duration_ms" integer,
	"status" text DEFAULT 'success',
	"error_message" text,
	"context_type" text,
	"context_id" text,
	"request_metadata" jsonb DEFAULT '{}',
	"response_metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	"industry_context_used" text,
	"feature_context" text,
	"context_tokens" integer,
	CONSTRAINT "ai_runs_provider_check" CHECK ((provider = ANY (ARRAY['gemini'::text, 'claude'::text, 'openai'::text]))),
	CONSTRAINT "ai_runs_status_check" CHECK ((status = ANY (ARRAY['success'::text, 'error'::text, 'timeout'::text, 'rate_limited'::text])))
);
--> statement-breakpoint
ALTER TABLE "ai_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_usage_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL CONSTRAINT "ai_usage_limits_org_id_key" UNIQUE,
	"monthly_cap_cents" integer DEFAULT 5000 NOT NULL,
	"current_month_total_cents" integer DEFAULT 0,
	"current_month_start" date DEFAULT (date_trunc('month'::text, now())),
	"last_reset_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ai_usage_limits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "assumptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"lean_canvas_id" uuid,
	"source_block" "assumption_source" NOT NULL,
	"statement" text NOT NULL,
	"impact_score" integer DEFAULT 5 NOT NULL,
	"uncertainty_score" integer DEFAULT 5 NOT NULL,
	"priority_score" integer GENERATED ALWAYS AS ((impact_score * uncertainty_score)) STORED,
	"status" "assumption_status" DEFAULT 'untested'::"assumption_status" NOT NULL,
	"tested_at" timestamp with time zone,
	"ai_extracted" boolean DEFAULT false,
	"extraction_confidence" numeric(3,2),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"risk_score" numeric DEFAULT '50',
	"evidence_count" integer DEFAULT 0,
	CONSTRAINT "assumptions_extraction_confidence_check" CHECK (((extraction_confidence >= (0)::numeric) AND (extraction_confidence <= (1)::numeric))),
	CONSTRAINT "assumptions_impact_score_check" CHECK (((impact_score >= 1) AND (impact_score <= 10))),
	CONSTRAINT "assumptions_risk_score_range" CHECK (((risk_score >= (0)::numeric) AND (risk_score <= (100)::numeric))),
	CONSTRAINT "assumptions_uncertainty_score_check" CHECK (((uncertainty_score >= 1) AND (uncertainty_score <= 10)))
);
--> statement-breakpoint
ALTER TABLE "assumptions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid,
	"startup_id" uuid,
	"user_id" uuid,
	"actor_type" text DEFAULT 'user',
	"actor_id" text,
	"action" text NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid,
	"old_data" jsonb,
	"new_data" jsonb,
	"ip_address" inet,
	"user_agent" text,
	"proposed_action_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "audit_log_actor_type_check" CHECK ((actor_type = ANY (ARRAY['user'::text, 'system'::text, 'ai_agent'::text, 'webhook'::text])))
);
--> statement-breakpoint
ALTER TABLE "audit_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"name" text DEFAULT '90-Day Validation Plan' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'completed'::text, 'archived'::text])))
);
--> statement-breakpoint
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_facts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"startup_id" uuid,
	"fact_type" text NOT NULL,
	"content" text NOT NULL,
	"confidence" numeric(3,2) DEFAULT '0.8',
	"source_message_id" uuid,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chat_facts_fact_type_check" CHECK ((fact_type = ANY (ARRAY['goal'::text, 'metric'::text, 'preference'::text, 'decision'::text, 'context'::text, 'constraint'::text])))
);
--> statement-breakpoint
ALTER TABLE "chat_facts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"tab" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"sources" jsonb DEFAULT '[]',
	"suggested_actions" jsonb DEFAULT '[]',
	"routing" jsonb,
	"ai_run_id" uuid,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chat_messages_role_check" CHECK ((role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text]))),
	CONSTRAINT "chat_messages_tab_check" CHECK ((tab = ANY (ARRAY['coach'::text, 'research'::text, 'planning'::text, 'actions'::text])))
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_pending" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"message_id" uuid,
	"suggestion_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"reasoning" text,
	"status" text DEFAULT 'pending',
	"expires_at" timestamp with time zone DEFAULT (now() + '24:00:00'::interval),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chat_pending_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'expired'::text]))),
	CONSTRAINT "chat_pending_suggestion_type_check" CHECK ((suggestion_type = ANY (ARRAY['task'::text, 'deal'::text, 'contact'::text, 'navigation'::text, 'research'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "chat_pending" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"startup_id" uuid,
	"title" text,
	"summary" text,
	"message_count" integer DEFAULT 0,
	"last_tab" text DEFAULT 'coach',
	"context_snapshot" jsonb DEFAULT '{}',
	"started_at" timestamp with time zone DEFAULT now(),
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chat_sessions_last_tab_check" CHECK ((last_tab = ANY (ARRAY['coach'::text, 'research'::text, 'planning'::text, 'actions'::text])))
);
--> statement-breakpoint
ALTER TABLE "chat_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"contact_id" uuid NOT NULL,
	"deal_id" uuid,
	"type" text NOT NULL,
	"direction" text,
	"subject" text,
	"content" text,
	"summary" text,
	"occurred_at" timestamp with time zone DEFAULT now(),
	"duration_minutes" integer,
	"participants" uuid[] DEFAULT '{}'::uuid[],
	"follow_up_required" boolean DEFAULT false,
	"follow_up_date" date,
	"sentiment" text,
	"key_points" text[] DEFAULT '{}'::text[],
	"action_items" text[] DEFAULT '{}'::text[],
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "communications_direction_check" CHECK ((direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))),
	CONSTRAINT "communications_sentiment_check" CHECK ((sentiment = ANY (ARRAY['positive'::text, 'neutral'::text, 'negative'::text]))),
	CONSTRAINT "communications_type_check" CHECK ((type = ANY (ARRAY['email'::text, 'call'::text, 'meeting'::text, 'note'::text, 'linkedin'::text, 'whatsapp'::text, 'sms'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "communications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "competitor_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"validation_report_id" uuid,
	"startup_id" uuid,
	"name" text NOT NULL,
	"website" text,
	"description" text,
	"competitor_type" text,
	"threat_level" text,
	"funding_stage" text,
	"funding_amount" numeric,
	"funding_currency" text DEFAULT 'USD',
	"employee_count" text,
	"market_share" numeric(5,2),
	"strengths" text[],
	"weaknesses" text[],
	"pricing_model" text,
	"pricing_range" text,
	"source" text,
	"source_url" text,
	"industry" text,
	"region" text,
	"discovered_at" timestamp with time zone DEFAULT now(),
	"last_updated_at" timestamp with time zone DEFAULT now(),
	"raw_data" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competitor_profiles_competitor_type_check" CHECK ((competitor_type = ANY (ARRAY['direct'::text, 'indirect'::text, 'potential'::text, 'alternative'::text]))),
	CONSTRAINT "competitor_profiles_threat_level_check" CHECK ((threat_level = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])))
);
--> statement-breakpoint
ALTER TABLE "competitor_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contact_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"contact_id" uuid NOT NULL,
	"tag" text NOT NULL,
	"color" text DEFAULT '#6366f1',
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "contact_tags_contact_id_tag_key" UNIQUE("contact_id","tag")
);
--> statement-breakpoint
ALTER TABLE "contact_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"title" text,
	"linkedin_url" text,
	"twitter_url" text,
	"type" text DEFAULT 'other',
	"sub_type" text,
	"relationship_strength" text DEFAULT 'cold',
	"source" text,
	"referred_by" uuid,
	"bio" text,
	"ai_summary" text,
	"enriched_at" timestamp with time zone,
	"tags" text[] DEFAULT '{}'::text[],
	"custom_fields" jsonb DEFAULT '{}',
	"last_contacted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "contacts_relationship_strength_check" CHECK ((relationship_strength = ANY (ARRAY['cold'::text, 'warm'::text, 'hot'::text, 'champion'::text]))),
	CONSTRAINT "contacts_type_check" CHECK ((type = ANY (ARRAY['investor'::text, 'customer'::text, 'advisor'::text, 'partner'::text, 'vendor'::text, 'employee'::text, 'media'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "context_injection_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"feature_context" text NOT NULL CONSTRAINT "context_injection_configs_feature_context_key" UNIQUE,
	"categories" text[] NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "context_injection_configs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customer_forces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"segment_id" uuid NOT NULL,
	"force_type" "force_type" NOT NULL,
	"description" text NOT NULL,
	"strength" integer DEFAULT 5 NOT NULL,
	"category" text,
	"source" text,
	"source_interview_id" uuid,
	"is_validated" boolean DEFAULT false,
	"validated_at" timestamp with time zone,
	"validation_notes" text,
	"ai_generated" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "customer_forces_source_check" CHECK ((source = ANY (ARRAY['interview'::text, 'survey'::text, 'observation'::text, 'assumption'::text, 'research'::text]))),
	CONSTRAINT "customer_forces_strength_check" CHECK (((strength >= 1) AND (strength <= 10)))
);
--> statement-breakpoint
ALTER TABLE "customer_forces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "customer_segments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"name" text NOT NULL,
	"segment_type" "segment_type" DEFAULT 'early_adopter'::"segment_type" NOT NULL,
	"demographics" jsonb DEFAULT '{}',
	"firmographics" jsonb DEFAULT '{}',
	"psychographics" jsonb DEFAULT '{}',
	"behaviors" jsonb DEFAULT '{}',
	"pain_points" text[] DEFAULT '{}'::text[],
	"trigger_event" text,
	"desired_outcome" text,
	"current_solutions" text[] DEFAULT '{}'::text[],
	"switching_barriers" text[] DEFAULT '{}'::text[],
	"description" text,
	"is_primary" boolean DEFAULT false,
	"is_early_adopter" boolean DEFAULT true,
	"priority" integer DEFAULT 1,
	"interview_count" integer DEFAULT 0,
	"validated_at" timestamp with time zone,
	"ai_generated" boolean DEFAULT false,
	"ai_confidence" numeric(3,2),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "customer_segments_priority_check" CHECK (((priority >= 1) AND (priority <= 10)))
);
--> statement-breakpoint
ALTER TABLE "customer_segments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "daily_focus_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + '18:00:00'::interval) NOT NULL,
	"primary_action" jsonb NOT NULL,
	"secondary_actions" jsonb DEFAULT '[]',
	"signal_weights" jsonb DEFAULT '{"momentum": 0.10, "health_gap": 0.25, "time_urgency": 0.15, "task_priority": 0.25, "stage_relevance": 0.25}',
	"scoring_breakdown" jsonb DEFAULT '{}',
	"action_completed_at" timestamp with time zone,
	"skipped_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_focus_recommendations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "dashboard_metrics_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"metric_type" text NOT NULL,
	"value" jsonb DEFAULT '{}' NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_dashboard_metrics_cache_startup_type" UNIQUE("startup_id","metric_type")
);
--> statement-breakpoint
ALTER TABLE "dashboard_metrics_cache" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"contact_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"type" text DEFAULT 'investor',
	"stage" text DEFAULT 'research',
	"amount" numeric(14,2),
	"currency" text DEFAULT 'USD',
	"probability" integer DEFAULT 0,
	"expected_close" date,
	"actual_close" date,
	"is_active" boolean DEFAULT true,
	"lost_reason" text,
	"ai_score" integer,
	"ai_insights" jsonb DEFAULT '{}',
	"risk_factors" text[] DEFAULT '{}'::text[],
	"notes" text,
	"tags" text[] DEFAULT '{}'::text[],
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "deals_probability_check" CHECK (((probability >= 0) AND (probability <= 100))),
	CONSTRAINT "deals_stage_check" CHECK ((stage = ANY (ARRAY['research'::text, 'outreach'::text, 'meeting'::text, 'due_diligence'::text, 'negotiation'::text, 'closed_won'::text, 'closed_lost'::text]))),
	CONSTRAINT "deals_type_check" CHECK ((type = ANY (ARRAY['investor'::text, 'customer'::text, 'partnership'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "deals" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "decision_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"decision_id" uuid NOT NULL,
	"evidence_type" text NOT NULL,
	"evidence_id" uuid,
	"evidence_table" text,
	"summary" text NOT NULL,
	"supports_decision" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "decision_evidence_evidence_type_check" CHECK ((evidence_type = ANY (ARRAY['assumption'::text, 'experiment'::text, 'interview'::text, 'metric'::text, 'research'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "decision_evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "decisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"decision_type" text NOT NULL,
	"title" text NOT NULL,
	"reasoning" text,
	"outcome" text,
	"outcome_at" timestamp with time zone,
	"decided_by" uuid,
	"decided_at" timestamp with time zone DEFAULT now(),
	"status" text DEFAULT 'active',
	"ai_suggested" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "decisions_decision_type_check" CHECK ((decision_type = ANY (ARRAY['pivot'::text, 'persevere'::text, 'launch'::text, 'kill'::text, 'invest'::text, 'partner'::text, 'hire'::text, 'other'::text]))),
	CONSTRAINT "decisions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'reversed'::text, 'superseded'::text])))
);
--> statement-breakpoint
ALTER TABLE "decisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "deck_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"category" "template_category" DEFAULT 'general'::"template_category" NOT NULL,
	"theme" text DEFAULT 'modern' NOT NULL,
	"structure" jsonb DEFAULT '[]' NOT NULL,
	"preview_url" text,
	"thumbnail_url" text,
	"slide_count" integer DEFAULT 0,
	"color_scheme" jsonb DEFAULT '{"accent":"#F59E0B", "primary":"#3B82F6", "secondary":"#1E40AF"}',
	"fonts" jsonb DEFAULT '{"body":"Inter", "heading":"Inter"}',
	"is_public" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"org_id" uuid,
	"created_by" uuid,
	"usage_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deck_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"document_id" uuid NOT NULL,
	"version_number" integer DEFAULT 1 NOT NULL,
	"content_json" jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}',
	"label" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "document_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"wizard_session_id" uuid,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"content_json" jsonb,
	"version" integer DEFAULT 1,
	"status" text DEFAULT 'draft',
	"ai_generated" boolean DEFAULT false,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"metadata" jsonb DEFAULT '{}',
	"file_url" text,
	"file_path" text,
	"file_size" bigint,
	"file_type" text,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "documents_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'review'::text, 'final'::text, 'archived'::text]))),
	CONSTRAINT "documents_type_check" CHECK ((type = ANY (ARRAY['startup_profile'::text, 'lean_canvas'::text, 'strategy'::text, 'pitch_deck'::text, 'roadmap'::text, 'executive_summary'::text, 'investor_update'::text, 'financial_model'::text, 'custom'::text])))
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"asset_type" "event_asset_type" NOT NULL,
	"platform" "asset_platform" DEFAULT 'other'::"asset_platform" NOT NULL,
	"status" "asset_status" DEFAULT 'draft'::"asset_status" NOT NULL,
	"title" text,
	"content" text,
	"caption" text,
	"hashtags" text[],
	"call_to_action" text,
	"link_url" text,
	"media_url" text,
	"media_urls" text[] DEFAULT '{}'::text[],
	"media_type" text,
	"thumbnail_url" text,
	"file_size_bytes" bigint,
	"dimensions" jsonb,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"engagement" jsonb DEFAULT '{}',
	"impressions" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"ai_generated" boolean DEFAULT false,
	"ai_model" text,
	"ai_prompt" text,
	"generation_params" jsonb DEFAULT '{}',
	"version" integer DEFAULT 1,
	"parent_asset_id" uuid,
	"external_post_id" text,
	"external_url" text,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"rejection_reason" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"event_id" uuid
);
--> statement-breakpoint
ALTER TABLE "event_assets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"contact_id" uuid,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"company" text,
	"title" text,
	"linkedin_url" text,
	"rsvp_status" "rsvp_status" DEFAULT 'pending'::"rsvp_status" NOT NULL,
	"attendee_type" "attendee_type" DEFAULT 'general'::"attendee_type" NOT NULL,
	"ticket_type" text,
	"ticket_price" numeric(10,2) DEFAULT '0',
	"registration_code" text CONSTRAINT "event_attendees_registration_code_key" UNIQUE,
	"checked_in" boolean DEFAULT false,
	"checked_in_at" timestamp with time zone,
	"checked_in_by" uuid,
	"badge_printed" boolean DEFAULT false,
	"dietary_requirements" text,
	"accessibility_needs" text,
	"session_preferences" jsonb DEFAULT '[]',
	"whatsapp_opted_in" boolean DEFAULT false,
	"email_opted_in" boolean DEFAULT true,
	"last_messaged_at" timestamp with time zone,
	"messages_received" integer DEFAULT 0,
	"attended_sessions" jsonb DEFAULT '[]',
	"feedback_submitted" boolean DEFAULT false,
	"feedback_rating" integer,
	"feedback_text" text,
	"registration_source" text,
	"referral_code" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"notes" text,
	"internal_notes" text,
	"invited_at" timestamp with time zone,
	"registered_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_id" uuid,
	CONSTRAINT "event_attendees_feedback_rating_check" CHECK (((feedback_rating >= 1) AND (feedback_rating <= 5)))
);
--> statement-breakpoint
ALTER TABLE "event_attendees" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_speakers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"event_id" uuid,
	"speaker_name" text NOT NULL,
	"speaker_title" text,
	"speaker_company" text,
	"speaker_linkedin" text,
	"appearance_year" integer,
	"appearance_type" text,
	"is_confirmed" boolean DEFAULT false,
	"source_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_speakers_appearance_type_check" CHECK ((appearance_type = ANY (ARRAY['keynote'::text, 'panel'::text, 'fireside'::text, 'workshop'::text, 'speaker'::text])))
);
--> statement-breakpoint
ALTER TABLE "event_speakers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "event_venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"description" text,
	"venue_type" text,
	"website" text,
	"address" text,
	"city" text,
	"state" text,
	"country" text,
	"postal_code" text,
	"latitude" numeric(10,7),
	"longitude" numeric(10,7),
	"google_place_id" text,
	"capacity" integer,
	"seated_capacity" integer,
	"standing_capacity" integer,
	"rental_cost" numeric(10,2) DEFAULT '0',
	"deposit_amount" numeric(10,2) DEFAULT '0',
	"catering_minimum" numeric(10,2),
	"additional_fees" jsonb DEFAULT '[]',
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"amenities" jsonb DEFAULT '[]',
	"equipment_included" jsonb DEFAULT '[]',
	"parking_info" text,
	"accessibility_info" text,
	"wifi_available" boolean DEFAULT true,
	"av_equipment" boolean DEFAULT false,
	"catering_available" boolean DEFAULT false,
	"catering_required" boolean DEFAULT false,
	"photos" text[] DEFAULT '{}'::text[],
	"virtual_tour_url" text,
	"floor_plan_url" text,
	"status" "venue_status" DEFAULT 'researching'::"venue_status" NOT NULL,
	"is_primary" boolean DEFAULT false,
	"visited_at" timestamp with time zone,
	"booked_at" timestamp with time zone,
	"deposit_paid_at" timestamp with time zone,
	"contract_signed_at" timestamp with time zone,
	"fit_score" integer,
	"ai_analysis" text,
	"discovery_source" text,
	"notes" text,
	"pros" text,
	"cons" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"event_id" uuid,
	CONSTRAINT "event_venues_fit_score_check" CHECK (((fit_score >= 0) AND (fit_score <= 100)))
);
--> statement-breakpoint
ALTER TABLE "event_venues" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_type" "event_type" DEFAULT 'other'::"event_type" NOT NULL,
	"status" "event_status" DEFAULT 'scheduled'::"event_status" NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"all_day" boolean DEFAULT false,
	"location" text,
	"virtual_meeting_url" text,
	"attendees" jsonb DEFAULT '[]',
	"related_contact_id" uuid,
	"related_deal_id" uuid,
	"related_project_id" uuid,
	"reminder_minutes" integer DEFAULT 15,
	"recurrence_rule" text,
	"color" text,
	"metadata" jsonb DEFAULT '{}',
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"event_scope" "event_scope" DEFAULT 'internal'::"event_scope" NOT NULL,
	"name" text,
	"slug" text CONSTRAINT "events_slug_key" UNIQUE,
	"timezone" text DEFAULT 'UTC',
	"location_type" "event_location_type" DEFAULT 'in_person'::"event_location_type",
	"capacity" integer,
	"registration_url" text,
	"registration_deadline" timestamp with time zone,
	"is_public" boolean DEFAULT false,
	"requires_approval" boolean DEFAULT false,
	"budget" numeric(10,2) DEFAULT '0',
	"ticket_price" numeric(10,2) DEFAULT '0',
	"health_score" integer DEFAULT 0,
	"tasks_total" integer DEFAULT 0,
	"tasks_completed" integer DEFAULT 0,
	"sponsors_target" integer DEFAULT 0,
	"sponsors_confirmed" integer DEFAULT 0,
	"agenda" jsonb DEFAULT '[]',
	"tags" text[] DEFAULT '{}'::text[],
	"cover_image_url" text,
	"published_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"external_url" text,
	"organizer_name" text,
	"organizer_logo_url" text,
	"relevance_score" integer DEFAULT 0,
	"attending_status" "attending_status",
	"source" text,
	"discovered_at" timestamp with time zone,
	"cfp_deadline" timestamp with time zone,
	"cfp_url" text,
	"is_featured" boolean DEFAULT false,
	"industry" text,
	"target_audience" text[],
	CONSTRAINT "events_health_score_check" CHECK (((health_score >= 0) AND (health_score <= 100))),
	CONSTRAINT "events_hosted_location_requires_capacity" CHECK (((event_scope <> 'hosted'::event_scope) OR (location_type <> ALL (ARRAY['in_person'::event_location_type, 'hybrid'::event_location_type])) OR ((capacity IS NOT NULL) AND (capacity > 0)))),
	CONSTRAINT "events_hosted_requires_name" CHECK (((event_scope <> 'hosted'::event_scope) OR (name IS NOT NULL))),
	CONSTRAINT "events_hosted_requires_slug" CHECK (((event_scope <> 'hosted'::event_scope) OR (slug IS NOT NULL))),
	CONSTRAINT "events_hosted_valid_type" CHECK (((event_scope <> 'hosted'::event_scope) OR (event_type = ANY (ARRAY['demo_day'::event_type, 'pitch_night'::event_type, 'networking'::event_type, 'workshop'::event_type, 'conference'::event_type, 'meetup'::event_type, 'webinar'::event_type, 'hackathon'::event_type, 'other'::event_type])))),
	CONSTRAINT "events_internal_no_hosted_fields" CHECK (((event_scope <> 'internal'::event_scope) OR (((capacity IS NULL) OR (capacity = 0)) AND ((budget IS NULL) OR (budget = (0)::numeric)) AND ((sponsors_target IS NULL) OR (sponsors_target = 0)) AND ((sponsors_confirmed IS NULL) OR (sponsors_confirmed = 0)) AND ((health_score IS NULL) OR (health_score = 0)) AND ((tasks_total IS NULL) OR (tasks_total = 0)) AND ((tasks_completed IS NULL) OR (tasks_completed = 0))))),
	CONSTRAINT "events_internal_valid_type" CHECK (((event_scope <> 'internal'::event_scope) OR (event_type = ANY (ARRAY['meeting'::event_type, 'call'::event_type, 'pitch'::event_type, 'demo'::event_type, 'reminder'::event_type, 'milestone'::event_type, 'deadline'::event_type, 'funding_round'::event_type, 'other'::event_type])))),
	CONSTRAINT "events_relevance_score_check" CHECK (((relevance_score >= 0) AND (relevance_score <= 100)))
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "experiment_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"experiment_id" uuid NOT NULL,
	"participant_id" text,
	"result_type" text NOT NULL,
	"data" jsonb DEFAULT '{}' NOT NULL,
	"raw_notes" text,
	"summary" text,
	"supports_hypothesis" boolean,
	"sentiment" text,
	"confidence" numeric(3,2),
	"ai_analyzed" boolean DEFAULT false,
	"ai_insights" jsonb DEFAULT '[]',
	"source" text,
	"recorded_at" timestamp with time zone DEFAULT now(),
	"recorded_by" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "experiment_results_confidence_check" CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))),
	CONSTRAINT "experiment_results_result_type_check" CHECK ((result_type = ANY (ARRAY['interview_response'::text, 'survey_response'::text, 'conversion_event'::text, 'signup_event'::text, 'engagement_metric'::text, 'feedback'::text, 'observation'::text, 'other'::text]))),
	CONSTRAINT "experiment_results_sentiment_check" CHECK ((sentiment = ANY (ARRAY['positive'::text, 'negative'::text, 'neutral'::text, 'mixed'::text])))
);
--> statement-breakpoint
ALTER TABLE "experiment_results" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "experiments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"assumption_id" uuid NOT NULL,
	"experiment_type" "experiment_type" NOT NULL,
	"title" text NOT NULL,
	"hypothesis" text NOT NULL,
	"success_criteria" text NOT NULL,
	"method" text,
	"status" "experiment_status" DEFAULT 'designed'::"experiment_status" NOT NULL,
	"target_sample_size" integer DEFAULT 5,
	"actual_sample_size" integer DEFAULT 0,
	"planned_start_date" date,
	"planned_end_date" date,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"outcome" text,
	"confidence_level" numeric(3,2),
	"summary" text,
	"ai_designed" boolean DEFAULT false,
	"ai_suggestions" jsonb DEFAULT '[]',
	"notes" text,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "experiments_confidence_level_check" CHECK (((confidence_level >= (0)::numeric) AND (confidence_level <= (1)::numeric))),
	CONSTRAINT "experiments_outcome_check" CHECK ((outcome = ANY (ARRAY['validated'::text, 'invalidated'::text, 'inconclusive'::text])))
);
--> statement-breakpoint
ALTER TABLE "experiments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "feature_pack_routing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"feature_route" text NOT NULL,
	"intent" text,
	"default_pack_slug" text NOT NULL,
	"industry_override_pattern" text,
	"stage_override_pattern" text,
	"priority" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feature_pack_routing" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "file_uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"storage_path" text NOT NULL,
	"bucket" text DEFAULT 'uploads',
	"category" text,
	"ai_extracted" boolean DEFAULT false,
	"ai_summary" text,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "file_uploads_category_check" CHECK ((category = ANY (ARRAY['pitch_deck'::text, 'financial'::text, 'legal'::text, 'product'::text, 'marketing'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "file_uploads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "financial_models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"model_type" text DEFAULT 'basic' NOT NULL,
	"monthly_burn" numeric,
	"monthly_revenue" numeric,
	"runway_months" integer,
	"projections" jsonb DEFAULT '{}' NOT NULL,
	"assumptions" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "financial_models" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "industry_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"full_name" text,
	"slug" text CONSTRAINT "industry_events_slug_key" UNIQUE,
	"description" text,
	"categories" "event_category"[] DEFAULT '{}'::"event_category"[],
	"topics" text[] DEFAULT '{}'::text[],
	"audience_types" text[] DEFAULT '{}'::text[],
	"event_date" date,
	"end_date" date,
	"dates_confirmed" boolean DEFAULT false,
	"typical_month" text,
	"timezone" text DEFAULT 'UTC',
	"location_city" text,
	"location_country" text,
	"venue" text,
	"format" "event_format" DEFAULT 'in_person'::"event_format",
	"ticket_cost_tier" "ticket_cost_tier" DEFAULT 'medium'::"ticket_cost_tier",
	"ticket_cost_min" numeric(10,2),
	"ticket_cost_max" numeric(10,2),
	"startup_relevance" integer DEFAULT 3,
	"expected_attendance" integer,
	"website_url" text,
	"twitter_handle" text,
	"linkedin_url" text,
	"youtube_url" text,
	"cfp_url" text,
	"registration_url" text,
	"media_pass_available" "media_pass_status" DEFAULT 'unclear'::"media_pass_status",
	"notable_speakers" text[] DEFAULT '{}'::text[],
	"tags" text[] DEFAULT '{}'::text[],
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"image_url" text,
	"image_path" text,
	"enriched_at" timestamp with time zone,
	"enrichment_status" text,
	"source_domain" text,
	"enrichment_metadata" jsonb DEFAULT '{}',
	"cloudinary_public_id" text,
	"cloudinary_version" integer,
	"cloudinary_folder" text DEFAULT 'industry-events',
	CONSTRAINT "industry_events_enrichment_status_check" CHECK ((enrichment_status = ANY (ARRAY['success'::text, 'partial'::text, 'needs_review'::text, 'failed'::text]))),
	CONSTRAINT "industry_events_startup_relevance_check" CHECK (((startup_relevance >= 1) AND (startup_relevance <= 5)))
);
--> statement-breakpoint
ALTER TABLE "industry_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "industry_playbooks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"industry_id" text NOT NULL CONSTRAINT "industry_playbooks_industry_id_key" UNIQUE,
	"display_name" text NOT NULL,
	"narrative_arc" text,
	"prompt_context" text,
	"investor_expectations" jsonb DEFAULT '{}' NOT NULL,
	"failure_patterns" jsonb DEFAULT '[]' NOT NULL,
	"success_stories" jsonb DEFAULT '[]' NOT NULL,
	"benchmarks" jsonb DEFAULT '[]' NOT NULL,
	"terminology" jsonb DEFAULT '{}' NOT NULL,
	"gtm_patterns" jsonb DEFAULT '[]' NOT NULL,
	"decision_frameworks" jsonb DEFAULT '[]' NOT NULL,
	"investor_questions" jsonb DEFAULT '[]' NOT NULL,
	"warning_signs" jsonb DEFAULT '[]' NOT NULL,
	"stage_checklists" jsonb DEFAULT '[]' NOT NULL,
	"slide_emphasis" jsonb DEFAULT '[]',
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"source" text DEFAULT 'system',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "industry_playbooks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"status" text DEFAULT 'active',
	"access_token_encrypted" text,
	"refresh_token_encrypted" text,
	"token_expires_at" timestamp with time zone,
	"scopes" text[] DEFAULT '{}'::text[],
	"settings" jsonb DEFAULT '{}',
	"last_sync_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "integrations_org_id_provider_key" UNIQUE("org_id","provider"),
	CONSTRAINT "integrations_provider_check" CHECK ((provider = ANY (ARRAY['stripe'::text, 'slack'::text, 'hubspot'::text, 'salesforce'::text, 'linkedin'::text, 'google'::text, 'notion'::text]))),
	CONSTRAINT "integrations_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'error'::text, 'disconnected'::text])))
);
--> statement-breakpoint
ALTER TABLE "integrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "interview_insights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"interview_id" uuid NOT NULL,
	"insight_type" "insight_type" NOT NULL,
	"insight" text NOT NULL,
	"source_quote" text,
	"quote_timestamp" text,
	"confidence" numeric(3,2) DEFAULT '0.5' NOT NULL,
	"importance" integer DEFAULT 5,
	"sentiment" text,
	"linked_assumption_ids" uuid[] DEFAULT '{}'::uuid[],
	"supports_assumptions" boolean,
	"tags" text[] DEFAULT '{}'::text[],
	"ai_model" text,
	"extraction_prompt_version" text,
	"is_validated" boolean DEFAULT false,
	"validated_by" uuid,
	"validated_at" timestamp with time zone,
	"is_dismissed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"risk_type" text,
	"is_locked" boolean DEFAULT false,
	"depth" text DEFAULT 'none',
	"hypothesis_id" uuid,
	CONSTRAINT "interview_insights_confidence_check" CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))),
	CONSTRAINT "interview_insights_depth_check" CHECK ((depth = ANY (ARRAY['none'::text, 'shallow'::text, 'deep'::text]))),
	CONSTRAINT "interview_insights_importance_check" CHECK (((importance >= 1) AND (importance <= 10))),
	CONSTRAINT "interview_insights_risk_type_check" CHECK ((risk_type = ANY (ARRAY['market'::text, 'technical'::text, 'regulatory'::text, 'competitive'::text, 'financial'::text]))),
	CONSTRAINT "interview_insights_sentiment_check" CHECK ((sentiment = ANY (ARRAY['positive'::text, 'negative'::text, 'neutral'::text, 'mixed'::text])))
);
--> statement-breakpoint
ALTER TABLE "interview_insights" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "interview_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"interview_id" uuid NOT NULL,
	"question_text" text NOT NULL,
	"question_type" text NOT NULL,
	"hypothesis_id" uuid,
	"decision_unlocked" text,
	"answer_text" text,
	"sequence_order" integer NOT NULL,
	"asked_at" timestamp with time zone,
	"answered_at" timestamp with time zone,
	"skipped" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "interview_questions_question_type_check" CHECK ((question_type = ANY (ARRAY['discovery'::text, 'hypothesis'::text, 'invalidation'::text, 'depth'::text, 'confirmation'::text])))
);
--> statement-breakpoint
ALTER TABLE "interview_questions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"segment_id" uuid,
	"experiment_id" uuid,
	"interview_type" "interview_type" DEFAULT 'problem_discovery'::"interview_type" NOT NULL,
	"status" "interview_status" DEFAULT 'scheduled'::"interview_status" NOT NULL,
	"interviewee_name" text,
	"interviewee_role" text,
	"interviewee_company" text,
	"interviewee_email" text,
	"is_anonymous" boolean DEFAULT false,
	"scheduled_at" timestamp with time zone,
	"conducted_at" timestamp with time zone,
	"duration_minutes" integer,
	"transcript" text,
	"raw_notes" text,
	"summary" text,
	"recording_url" text,
	"recording_consent" boolean DEFAULT false,
	"questions_used" jsonb DEFAULT '[]',
	"interview_guide_id" uuid,
	"ai_analyzed" boolean DEFAULT false,
	"ai_analyzed_at" timestamp with time zone,
	"ai_summary" text,
	"ai_sentiment" text,
	"ai_key_quotes" jsonb DEFAULT '[]',
	"conducted_by" uuid,
	"location" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"interview_mode" text DEFAULT 'smart',
	"readiness_score" numeric,
	CONSTRAINT "interviews_ai_sentiment_check" CHECK ((ai_sentiment = ANY (ARRAY['positive'::text, 'negative'::text, 'neutral'::text, 'mixed'::text]))),
	CONSTRAINT "interviews_interview_mode_check" CHECK ((interview_mode = ANY (ARRAY['smart'::text, 'quick'::text, 'deep'::text]))),
	CONSTRAINT "interviews_readiness_score_check" CHECK (((readiness_score >= (0)::numeric) AND (readiness_score <= (100)::numeric)))
);
--> statement-breakpoint
ALTER TABLE "interviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "investors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"name" text NOT NULL,
	"firm_name" text,
	"email" text,
	"phone" text,
	"title" text,
	"linkedin_url" text,
	"twitter_url" text,
	"website_url" text,
	"type" text DEFAULT 'vc',
	"investment_focus" text[],
	"stage_focus" text[],
	"check_size_min" numeric,
	"check_size_max" numeric,
	"portfolio_companies" text[],
	"status" text DEFAULT 'researching',
	"priority" text DEFAULT 'medium',
	"warm_intro_from" text,
	"first_contact_date" date,
	"last_contact_date" date,
	"next_follow_up" date,
	"meetings_count" integer DEFAULT 0,
	"notes" text,
	"tags" text[],
	"custom_fields" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "investors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "jobs_to_be_done" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"segment_id" uuid NOT NULL,
	"job_type" "job_type" NOT NULL,
	"situation" text NOT NULL,
	"motivation" text NOT NULL,
	"expected_outcome" text NOT NULL,
	"job_statement" text GENERATED ALWAYS AS (((((('When I '::text || situation) || ', I want to '::text) || motivation) || ' so I can '::text) || expected_outcome)) STORED,
	"importance" integer DEFAULT 5,
	"current_satisfaction" integer DEFAULT 5,
	"opportunity_score" integer GENERATED ALWAYS AS ((importance - current_satisfaction)) STORED,
	"frequency" text,
	"related_functional_job_id" uuid,
	"source" text,
	"source_interview_id" uuid,
	"is_validated" boolean DEFAULT false,
	"validated_at" timestamp with time zone,
	"interview_count" integer DEFAULT 0,
	"ai_generated" boolean DEFAULT false,
	"priority" integer DEFAULT 1,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "jobs_to_be_done_current_satisfaction_check" CHECK (((current_satisfaction >= 1) AND (current_satisfaction <= 10))),
	CONSTRAINT "jobs_to_be_done_frequency_check" CHECK ((frequency = ANY (ARRAY['hourly'::text, 'daily'::text, 'weekly'::text, 'monthly'::text, 'quarterly'::text, 'yearly'::text, 'situational'::text]))),
	CONSTRAINT "jobs_to_be_done_importance_check" CHECK (((importance >= 1) AND (importance <= 10))),
	CONSTRAINT "jobs_to_be_done_source_check" CHECK ((source = ANY (ARRAY['interview'::text, 'survey'::text, 'observation'::text, 'assumption'::text, 'research'::text])))
);
--> statement-breakpoint
ALTER TABLE "jobs_to_be_done" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"content" text NOT NULL,
	"source" text NOT NULL,
	"source_type" text NOT NULL,
	"source_url" text,
	"year" integer NOT NULL,
	"sample_size" integer,
	"confidence" text DEFAULT 'medium' NOT NULL,
	"category" text NOT NULL,
	"subcategory" text,
	"tags" text[] DEFAULT '{}'::text[],
	"industry" text,
	"stage" text,
	"region" text,
	"fetch_count" integer DEFAULT 0 NOT NULL,
	"last_fetched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"embedding" vector(1536),
	"document_id" uuid,
	"page_start" integer,
	"page_end" integer,
	"section_title" text,
	CONSTRAINT "knowledge_chunks_confidence_check" CHECK ((confidence = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])))
);
--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "knowledge_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"source_type" text,
	"year" integer,
	"llama_parse_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"content_hash" text
);
--> statement-breakpoint
ALTER TABLE "knowledge_documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "knowledge_map" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"dimension" text NOT NULL,
	"confidence_score" integer DEFAULT 0 NOT NULL,
	"source_tier" text DEFAULT 'T4' NOT NULL,
	"evidence_count" integer DEFAULT 0 NOT NULL,
	"key_insights" jsonb DEFAULT '[]' NOT NULL,
	"gaps" jsonb DEFAULT '[]' NOT NULL,
	"last_updated_from" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_map_startup_id_dimension_key" UNIQUE("startup_id","dimension"),
	CONSTRAINT "knowledge_map_confidence_score_check" CHECK (((confidence_score >= 0) AND (confidence_score <= 100))),
	CONSTRAINT "knowledge_map_dimension_check" CHECK ((dimension = ANY (ARRAY['customer'::text, 'market'::text, 'product'::text, 'business_model'::text, 'technology'::text]))),
	CONSTRAINT "knowledge_map_source_tier_check" CHECK ((source_tier = ANY (ARRAY['T1'::text, 'T2'::text, 'T3'::text, 'T4'::text])))
);
--> statement-breakpoint
ALTER TABLE "knowledge_map" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lean_canvas_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"canvas_id" uuid NOT NULL,
	"version_number" integer DEFAULT 1 NOT NULL,
	"content_json" jsonb NOT NULL,
	"change_summary" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lean_canvas_versions_canvas_id_version_number_key" UNIQUE("canvas_id","version_number")
);
--> statement-breakpoint
ALTER TABLE "lean_canvas_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lean_canvases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"problem" text,
	"customer_segments" text,
	"unique_value_proposition" text,
	"solution" text,
	"channels" text,
	"revenue_streams" text,
	"cost_structure" text,
	"key_metrics" text,
	"unfair_advantage" text,
	"validation_score" numeric(5,2),
	"version" integer DEFAULT 1,
	"is_current" boolean DEFAULT true,
	"source" text DEFAULT 'manual',
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"playbook_run_id" uuid,
	"completeness_score" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "lean_canvases" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "market_research" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"tam_value" numeric,
	"tam_source" text,
	"sam_value" numeric,
	"sam_source" text,
	"som_value" numeric,
	"som_source" text,
	"methodology" text,
	"trends" jsonb DEFAULT '[]',
	"market_leaders" jsonb DEFAULT '[]',
	"emerging_players" jsonb DEFAULT '[]',
	"sources" jsonb DEFAULT '[]',
	"ai_generated" boolean DEFAULT true,
	"confidence_score" numeric(3,2),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "market_research" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid DEFAULT gen_random_uuid(),
	"startup_event_id" uuid NOT NULL,
	"attendee_id" uuid,
	"broadcast_id" uuid,
	"channel" "message_channel" DEFAULT 'whatsapp'::"message_channel" NOT NULL,
	"direction" "message_direction" NOT NULL,
	"message_type" "message_type" DEFAULT 'text'::"message_type" NOT NULL,
	"status" "message_status" DEFAULT 'pending'::"message_status" NOT NULL,
	"content" text NOT NULL,
	"template_name" text,
	"template_params" jsonb DEFAULT '{}',
	"media_url" text,
	"media_type" text,
	"recipient_phone" text,
	"recipient_name" text,
	"recipient_email" text,
	"ai_handled" boolean DEFAULT false,
	"ai_confidence" numeric(5,4),
	"ai_intent" text,
	"ai_response_time_ms" integer,
	"escalated" boolean DEFAULT false,
	"escalation_reason" text,
	"escalated_at" timestamp with time zone,
	"escalated_to" uuid,
	"resolved" boolean DEFAULT false,
	"resolved_at" timestamp with time zone,
	"external_message_id" text,
	"conversation_id" text,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"event_id" uuid,
	CONSTRAINT "event_messages_pkey" PRIMARY KEY("id"),
	CONSTRAINT "event_messages_ai_confidence_check" CHECK (((ai_confidence >= (0)::numeric) AND (ai_confidence <= (1)::numeric)))
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "metric_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"snapshot_date" date DEFAULT CURRENT_DATE NOT NULL,
	"snapshot_type" text DEFAULT 'daily' NOT NULL,
	"tasks_total" integer DEFAULT 0 NOT NULL,
	"tasks_completed" integer DEFAULT 0 NOT NULL,
	"tasks_in_progress" integer DEFAULT 0 NOT NULL,
	"tasks_overdue" integer DEFAULT 0 NOT NULL,
	"contacts_total" integer DEFAULT 0 NOT NULL,
	"contacts_this_week" integer DEFAULT 0 NOT NULL,
	"deals_total" integer DEFAULT 0 NOT NULL,
	"deals_active" integer DEFAULT 0 NOT NULL,
	"deals_won" integer DEFAULT 0 NOT NULL,
	"deals_value_total" numeric(15,2) DEFAULT '0' NOT NULL,
	"documents_total" integer DEFAULT 0 NOT NULL,
	"canvas_completion_pct" integer DEFAULT 0 NOT NULL,
	"pitch_deck_slides" integer DEFAULT 0 NOT NULL,
	"validation_score" integer,
	"experiments_total" integer DEFAULT 0 NOT NULL,
	"experiments_completed" integer DEFAULT 0 NOT NULL,
	"interviews_total" integer DEFAULT 0 NOT NULL,
	"activities_this_week" integer DEFAULT 0 NOT NULL,
	"ai_runs_this_week" integer DEFAULT 0 NOT NULL,
	"health_score" integer,
	"momentum_score" integer,
	"engagement_score" integer,
	"raw_metrics" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "metric_snapshots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"link" text,
	"priority" text DEFAULT 'normal',
	"is_read" boolean DEFAULT false,
	"read_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "notifications_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text]))),
	CONSTRAINT "notifications_type_check" CHECK ((type = ANY (ARRAY['task_due'::text, 'deal_update'::text, 'ai_suggestion'::text, 'risk_alert'::text, 'system'::text, 'mention'::text])))
);
--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "onboarding_questions" (
	"id" text PRIMARY KEY,
	"text" text NOT NULL,
	"type" "question_type" DEFAULT 'multiple_choice'::"question_type" NOT NULL,
	"topic" text NOT NULL,
	"why_matters" text,
	"options" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "valid_options" CHECK (((type = ANY (ARRAY['text'::question_type, 'number'::question_type])) OR ((options IS NOT NULL) AND (jsonb_array_length(options) > 0))))
);
--> statement-breakpoint
ALTER TABLE "onboarding_questions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "opportunity_canvas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"market_readiness" integer,
	"technical_feasibility" integer,
	"competitive_advantage" integer,
	"execution_capability" integer,
	"timing_score" integer,
	"opportunity_score" integer,
	"adoption_barriers" jsonb DEFAULT '[]',
	"enablers" jsonb DEFAULT '[]',
	"strategic_fit" text,
	"recommendation" text,
	"reasoning" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"vpc_data" jsonb DEFAULT '{}',
	CONSTRAINT "opportunity_canvas_competitive_advantage_check" CHECK (((competitive_advantage >= 0) AND (competitive_advantage <= 100))),
	CONSTRAINT "opportunity_canvas_execution_capability_check" CHECK (((execution_capability >= 0) AND (execution_capability <= 100))),
	CONSTRAINT "opportunity_canvas_market_readiness_check" CHECK (((market_readiness >= 0) AND (market_readiness <= 100))),
	CONSTRAINT "opportunity_canvas_recommendation_check" CHECK ((recommendation = ANY (ARRAY['pursue'::text, 'explore'::text, 'defer'::text, 'reject'::text]))),
	CONSTRAINT "opportunity_canvas_technical_feasibility_check" CHECK (((technical_feasibility >= 0) AND (technical_feasibility <= 100))),
	CONSTRAINT "opportunity_canvas_timing_score_check" CHECK (((timing_score >= 0) AND (timing_score <= 100)))
);
--> statement-breakpoint
ALTER TABLE "opportunity_canvas" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "org_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"role" text DEFAULT 'member',
	"invited_by" uuid,
	"invited_email" text,
	"joined_at" timestamp with time zone,
	"status" text DEFAULT 'pending',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "org_members_user_id_org_id_key" UNIQUE("user_id","org_id"),
	CONSTRAINT "org_members_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text]))),
	CONSTRAINT "org_members_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'active'::text, 'inactive'::text])))
);
--> statement-breakpoint
ALTER TABLE "org_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"slug" text NOT NULL CONSTRAINT "organizations_slug_key" UNIQUE,
	"logo_url" text,
	"settings" jsonb DEFAULT '{"features": {"deep_research": true, "image_generation": false}, "default_model":"gemini-3-flash-preview", "ai_daily_cap_usd": 50}',
	"subscription_tier" text DEFAULT 'free',
	"subscription_status" text DEFAULT 'active',
	"stripe_customer_id" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "organizations_subscription_status_check" CHECK ((subscription_status = ANY (ARRAY['active'::text, 'past_due'::text, 'cancelled'::text]))),
	CONSTRAINT "organizations_subscription_tier_check" CHECK ((subscription_tier = ANY (ARRAY['free'::text, 'pro'::text, 'enterprise'::text])))
);
--> statement-breakpoint
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pitch_deck_slides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"deck_id" uuid NOT NULL,
	"slide_number" integer NOT NULL,
	"slide_type" "slide_type" DEFAULT 'custom'::"slide_type" NOT NULL,
	"title" text,
	"subtitle" text,
	"content" jsonb DEFAULT '{}',
	"notes" text,
	"image_url" text,
	"background_url" text,
	"layout" text DEFAULT 'default',
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1,
	CONSTRAINT "unique_slide_number_per_deck" UNIQUE("deck_id","slide_number")
);
--> statement-breakpoint
ALTER TABLE "pitch_deck_slides" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pitch_decks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "pitch_deck_status" DEFAULT 'draft'::"pitch_deck_status" NOT NULL,
	"template" text,
	"theme" text DEFAULT 'modern',
	"deck_type" text DEFAULT 'seed',
	"slide_count" integer DEFAULT 0,
	"thumbnail_url" text,
	"is_public" boolean DEFAULT false,
	"last_edited_by" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"signal_strength" integer DEFAULT 0,
	"signal_breakdown" jsonb DEFAULT '{}',
	"metadata" jsonb DEFAULT '{}',
	"playbook_run_id" uuid,
	"industry_pack" text,
	"wizard_data" jsonb DEFAULT '{}',
	"slides" jsonb[] DEFAULT '{}'::jsonb[],
	"critique" jsonb DEFAULT '{}',
	"export_url" text,
	CONSTRAINT "pitch_decks_deck_type_check" CHECK ((deck_type = ANY (ARRAY['seed'::text, 'series_a'::text, 'series_b'::text, 'growth'::text, 'custom'::text])))
);
--> statement-breakpoint
ALTER TABLE "pitch_decks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "pivot_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"assumption_id" uuid,
	"pivot_type" text NOT NULL,
	"old_value" text,
	"new_value" text,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pivot_logs_pivot_type_check" CHECK ((pivot_type = ANY (ARRAY['audience'::text, 'pain'::text, 'solution'::text, 'stage_advance'::text])))
);
--> statement-breakpoint
ALTER TABLE "pivot_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "playbook_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid,
	"playbook_type" text NOT NULL,
	"status" text DEFAULT 'in_progress',
	"current_step" integer DEFAULT 1,
	"total_steps" integer,
	"step_data" jsonb DEFAULT '{}',
	"metadata" jsonb DEFAULT '{}',
	"started_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "playbook_runs_status_check" CHECK ((status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text])))
);
--> statement-breakpoint
ALTER TABLE "playbook_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY,
	"email" text NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"org_id" uuid,
	"role" text DEFAULT 'member',
	"preferences" jsonb DEFAULT '{"theme":"light", "notifications": true, "ai_suggestions": true}',
	"onboarding_completed" boolean DEFAULT false,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "profiles_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text])))
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text DEFAULT 'other',
	"status" text DEFAULT 'active',
	"health" text DEFAULT 'on_track',
	"progress" integer DEFAULT 0,
	"start_date" date,
	"end_date" date,
	"owner_id" uuid,
	"team_members" uuid[] DEFAULT '{}'::uuid[],
	"goals" jsonb DEFAULT '[]',
	"tags" text[] DEFAULT '{}'::text[],
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "projects_health_check" CHECK ((health = ANY (ARRAY['on_track'::text, 'at_risk'::text, 'behind'::text, 'completed'::text]))),
	CONSTRAINT "projects_progress_check" CHECK (((progress >= 0) AND (progress <= 100))),
	CONSTRAINT "projects_status_check" CHECK ((status = ANY (ARRAY['planning'::text, 'active'::text, 'on_hold'::text, 'completed'::text, 'cancelled'::text]))),
	CONSTRAINT "projects_type_check" CHECK ((type = ANY (ARRAY['fundraising'::text, 'product'::text, 'hiring'::text, 'partnership'::text, 'marketing'::text, 'operations'::text, 'other'::text])))
);
--> statement-breakpoint
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "prompt_pack_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid,
	"org_id" uuid,
	"startup_id" uuid,
	"pack_id" text,
	"pack_slug" text,
	"step_order" integer,
	"action" text NOT NULL,
	"inputs_json" jsonb DEFAULT '{}',
	"outputs_json" jsonb DEFAULT '{}',
	"model" text,
	"input_tokens" integer,
	"output_tokens" integer,
	"cost_usd" numeric(10,6),
	"duration_ms" integer,
	"status" text DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"industry_id" text,
	"stage" text,
	"feature_context" text,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "prompt_pack_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "prompt_pack_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"pack_id" text NOT NULL,
	"step_order" integer NOT NULL,
	"purpose" text NOT NULL,
	"prompt_template" text NOT NULL,
	"input_schema" jsonb DEFAULT '{}',
	"output_schema" jsonb DEFAULT '{}',
	"model_preference" text DEFAULT 'gemini',
	"max_tokens" integer DEFAULT 2000,
	"temperature" numeric(3,2) DEFAULT '0.3',
	"tools" jsonb DEFAULT '[]',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "prompt_pack_steps_pack_id_step_order_key" UNIQUE("pack_id","step_order")
);
--> statement-breakpoint
ALTER TABLE "prompt_pack_steps" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "prompt_packs" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"slug" text NOT NULL CONSTRAINT "prompt_packs_slug_key" UNIQUE,
	"description" text,
	"category" text NOT NULL,
	"stage_tags" text[] DEFAULT ARRAY[]::text[],
	"industry_tags" text[] DEFAULT ARRAY['all'::text]::text[],
	"version" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"source" text DEFAULT 'system',
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_packs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "prompt_template_registry" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"description" text,
	"playbook_sections" text[] NOT NULL,
	"model_preference" text DEFAULT 'gemini',
	"max_tokens" integer DEFAULT 2000,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_template_registry" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "proposed_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"org_id" uuid NOT NULL,
	"startup_id" uuid,
	"agent_name" text NOT NULL,
	"ai_run_id" uuid,
	"action_type" text NOT NULL,
	"target_table" text NOT NULL,
	"target_id" uuid,
	"payload" jsonb NOT NULL,
	"before_state" jsonb,
	"after_state" jsonb,
	"reasoning" text,
	"confidence" numeric(3,2),
	"status" text DEFAULT 'pending',
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"rejection_reason" text,
	"expires_at" timestamp with time zone DEFAULT (now() + '7 days'::interval),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "proposed_actions_action_type_check" CHECK ((action_type = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'send'::text, 'external'::text, 'bulk'::text]))),
	CONSTRAINT "proposed_actions_confidence_check" CHECK (((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))),
	CONSTRAINT "proposed_actions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'expired'::text, 'executing'::text, 'completed'::text, 'failed'::text])))
);
--> statement-breakpoint
ALTER TABLE "proposed_actions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "share_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"link_id" uuid NOT NULL,
	"viewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"referrer" text,
	"country" text
);
--> statement-breakpoint
ALTER TABLE "share_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "shareable_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" uuid NOT NULL,
	"token" text DEFAULT encode(gen_random_bytes(32), 'hex'::text) NOT NULL CONSTRAINT "shareable_links_token_key" UNIQUE,
	"created_by" uuid NOT NULL,
	"expires_at" timestamp with time zone DEFAULT (now() + '7 days'::interval) NOT NULL,
	"revoked_at" timestamp with time zone,
	"access_count" integer DEFAULT 0,
	"last_accessed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "shareable_links_resource_type_check" CHECK ((resource_type = ANY (ARRAY['validation_report'::text, 'pitch_deck'::text, 'lean_canvas'::text, 'decision_log'::text])))
);
--> statement-breakpoint
ALTER TABLE "shareable_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" uuid DEFAULT gen_random_uuid(),
	"contact_id" uuid,
	"name" text NOT NULL,
	"company_name" text,
	"website" text,
	"logo_url" text,
	"description" text,
	"tier" "sponsor_tier" DEFAULT 'silver'::"sponsor_tier" NOT NULL,
	"status" "sponsor_status" DEFAULT 'prospect'::"sponsor_status" NOT NULL,
	"amount" numeric(10,2) DEFAULT '0',
	"in_kind_value" numeric(10,2) DEFAULT '0',
	"in_kind_description" text,
	"contact_name" text,
	"contact_email" text,
	"contact_phone" text,
	"contact_title" text,
	"outreach_sent_at" timestamp with time zone,
	"outreach_template" text,
	"last_contacted_at" timestamp with time zone,
	"follow_up_date" timestamp with time zone,
	"response_received_at" timestamp with time zone,
	"deliverables" jsonb DEFAULT '[]',
	"benefits" jsonb DEFAULT '[]',
	"match_score" integer,
	"ai_notes" text,
	"discovery_source" text,
	"notes" text,
	"internal_notes" text,
	"confirmed_at" timestamp with time zone,
	"contract_signed_at" timestamp with time zone,
	"payment_received_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"event_id" uuid,
	CONSTRAINT "event_sponsors_pkey" PRIMARY KEY("id"),
	CONSTRAINT "event_sponsors_match_score_check" CHECK (((match_score >= 0) AND (match_score <= 100)))
);
--> statement-breakpoint
ALTER TABLE "sponsors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sprint_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"campaign_id" uuid NOT NULL,
	"sprint_number" integer NOT NULL,
	"title" text NOT NULL,
	"source" text NOT NULL,
	"success_criteria" text DEFAULT '' NOT NULL,
	"ai_tip" text DEFAULT '',
	"priority" text DEFAULT 'medium' NOT NULL,
	"column" text DEFAULT 'backlog' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sprint_tasks_column_check" CHECK (("column" = ANY (ARRAY['backlog'::text, 'todo'::text, 'doing'::text, 'done'::text]))),
	CONSTRAINT "sprint_tasks_priority_check" CHECK ((priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]))),
	CONSTRAINT "sprint_tasks_sprint_number_check" CHECK (((sprint_number >= 1) AND (sprint_number <= 6)))
);
--> statement-breakpoint
ALTER TABLE "sprint_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sprints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"campaign_id" uuid NOT NULL,
	"sprint_number" integer NOT NULL,
	"name" text,
	"status" text DEFAULT 'designed' NOT NULL,
	"cards" jsonb DEFAULT '[]' NOT NULL,
	"plan" text,
	"do" text,
	"check" text,
	"act" text,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sprints_campaign_id_sprint_number_key" UNIQUE("campaign_id","sprint_number"),
	CONSTRAINT "sprints_sprint_number_check" CHECK (((sprint_number >= 1) AND (sprint_number <= 6))),
	CONSTRAINT "sprints_status_check" CHECK ((status = ANY (ARRAY['designed'::text, 'running'::text, 'completed'::text])))
);
--> statement-breakpoint
ALTER TABLE "sprints" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "startup_event_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_event_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"category" "event_task_category" DEFAULT 'other'::"event_task_category" NOT NULL,
	"due_offset_days" integer,
	"is_milestone" boolean DEFAULT false,
	"is_critical_path" boolean DEFAULT false,
	"depends_on" uuid[] DEFAULT '{}'::uuid[],
	"blocks" uuid[] DEFAULT '{}'::uuid[],
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "startup_event_tasks_startup_event_id_task_id_key" UNIQUE("startup_event_id","task_id")
);
--> statement-breakpoint
ALTER TABLE "startup_event_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "startup_health_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"overall_score" integer NOT NULL,
	"dimensions" jsonb DEFAULT '{}' NOT NULL,
	"bottleneck" text,
	"bottleneck_reason" text,
	"corrective_actions" jsonb DEFAULT '[]' NOT NULL,
	"computation_hash" text,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "startup_health_scores_overall_score_check" CHECK (((overall_score >= 0) AND (overall_score <= 100)))
);
--> statement-breakpoint
ALTER TABLE "startup_health_scores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "startup_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"invited_by" uuid,
	"invited_at" timestamp with time zone,
	"joined_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "startup_members_startup_id_user_id_key" UNIQUE("startup_id","user_id"),
	CONSTRAINT "startup_members_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text])))
);
--> statement-breakpoint
ALTER TABLE "startup_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "startups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tagline" text,
	"logo_url" text,
	"industry" text,
	"sub_industry" text,
	"stage" text DEFAULT 'idea',
	"business_model" text[] DEFAULT '{}'::text[],
	"pricing_model" text,
	"website_url" text,
	"linkedin_url" text,
	"twitter_url" text,
	"github_url" text,
	"target_customers" text[] DEFAULT '{}'::text[],
	"customer_segments" jsonb DEFAULT '[]',
	"unique_value" text,
	"key_features" text[] DEFAULT '{}'::text[],
	"competitors" text[] DEFAULT '{}'::text[],
	"team_size" integer,
	"founders" jsonb DEFAULT '[]',
	"traction_data" jsonb DEFAULT '{"arr": 0, "mrr": 0, "nrr": 0, "users": 0, "customers": 0, "churn_rate": 0, "milestones": [], "growth_rate_monthly": 0}',
	"is_raising" boolean DEFAULT false,
	"raise_amount" numeric(12,2),
	"valuation_cap" numeric(14,2),
	"use_of_funds" text[] DEFAULT '{}'::text[],
	"funding_rounds" jsonb DEFAULT '[]',
	"deep_research_report" text,
	"ai_summary" text,
	"profile_strength" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"target_market" text,
	"year_founded" integer,
	"investor_ready_score" integer,
	"investor_score_breakdown" jsonb DEFAULT '{}',
	"interview_signals" text[] DEFAULT '{}'::text[],
	"readiness_score" numeric(5,2),
	"readiness_rationale" text,
	"validation_verdict" text,
	"readiness_updated_at" timestamp with time zone,
	"problem_statement" text,
	"solution_description" text,
	"why_now" text,
	"problem_one_liner" text,
	"one_liner" text,
	"elevator_pitch" text,
	"tam_size" numeric,
	"sam_size" numeric,
	"som_size" numeric,
	"market_category" text,
	"market_trends" jsonb DEFAULT '[]',
	"problem" text,
	"solution" text,
	"existing_alternatives" text,
	"channels" text,
	"value_prop" text,
	"deleted_at" timestamp with time zone,
	"validation_stage" text DEFAULT 'idea' NOT NULL,
	"current_bet" jsonb DEFAULT '{}',
	"headquarters" text,
	CONSTRAINT "startups_investor_ready_score_check" CHECK (((investor_ready_score >= 0) AND (investor_ready_score <= 100))),
	CONSTRAINT "startups_profile_strength_check" CHECK (((profile_strength >= 0) AND (profile_strength <= 100))),
	CONSTRAINT "startups_stage_check" CHECK ((stage = ANY (ARRAY['idea'::text, 'pre_seed'::text, 'seed'::text, 'series_a'::text, 'series_b'::text, 'series_c'::text, 'growth'::text, 'public'::text]))),
	CONSTRAINT "startups_validation_stage_check" CHECK ((validation_stage = ANY (ARRAY['idea'::text, 'mvp'::text, 'selling'::text]))),
	CONSTRAINT "startups_year_founded_check" CHECK (((year_founded >= 1900) AND ((year_founded)::numeric <= (EXTRACT(year FROM now()) + (1)::numeric))))
);
--> statement-breakpoint
ALTER TABLE "startups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"project_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"category" text,
	"phase" text,
	"priority" text DEFAULT 'medium',
	"status" text DEFAULT 'pending',
	"assigned_to" uuid,
	"created_by" uuid,
	"due_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"contact_id" uuid,
	"deal_id" uuid,
	"parent_task_id" uuid,
	"ai_generated" boolean DEFAULT false,
	"ai_source" text,
	"tags" text[] DEFAULT '{}'::text[],
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"source" text DEFAULT 'manual',
	"trigger_rule_id" text,
	"trigger_score" numeric(5,2),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "tasks_category_check" CHECK ((category = ANY (ARRAY['fundraising'::text, 'product'::text, 'marketing'::text, 'operations'::text, 'sales'::text, 'hiring'::text, 'legal'::text, 'other'::text]))),
	CONSTRAINT "tasks_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
	CONSTRAINT "tasks_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text, 'blocked'::text])))
);
--> statement-breakpoint
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_event_tracking" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"status" text DEFAULT 'interested',
	"notes" text,
	"reminder_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_event_tracking_user_id_event_id_key" UNIQUE("user_id","event_id"),
	CONSTRAINT "user_event_tracking_status_check" CHECK ((status = ANY (ARRAY['interested'::text, 'registered'::text, 'attending'::text, 'attended'::text, 'skipped'::text])))
);
--> statement-breakpoint
ALTER TABLE "user_event_tracking" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"role" "app_role" DEFAULT 'user'::"app_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_id_role_key" UNIQUE("user_id","role")
);
--> statement-breakpoint
ALTER TABLE "user_roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "validator_agent_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"agent_name" text NOT NULL,
	"attempt" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"output_json" jsonb,
	"error" text,
	"duration_ms" integer,
	"started_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "validator_agent_runs_session_id_agent_name_attempt_key" UNIQUE("session_id","agent_name","attempt"),
	CONSTRAINT "validator_agent_runs_agent_name_check" CHECK ((agent_name = ANY (ARRAY['extract'::text, 'research'::text, 'competitors'::text, 'score'::text, 'mvp'::text, 'compose'::text, 'verify'::text]))),
	CONSTRAINT "validator_agent_runs_status_check" CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'ok'::text, 'failed'::text, 'skipped'::text])))
);
--> statement-breakpoint
ALTER TABLE "validator_agent_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "validator_reports" (
	"id" uuid DEFAULT gen_random_uuid(),
	"run_id" uuid,
	"report_type" text NOT NULL,
	"score" numeric(5,2),
	"summary" text,
	"details" jsonb DEFAULT '{}',
	"key_findings" text[],
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"session_id" uuid,
	"verified" boolean DEFAULT false,
	"verification_json" jsonb,
	"startup_id" uuid,
	"report_version" text DEFAULT 'v2' NOT NULL,
	CONSTRAINT "validation_reports_pkey" PRIMARY KEY("id"),
	CONSTRAINT "validation_reports_report_type_check" CHECK ((report_type = ANY (ARRAY['market'::text, 'founder'::text, 'product'::text, 'finance'::text, 'overall'::text, 'quick'::text, 'deep'::text, 'investor'::text]))),
	CONSTRAINT "validation_reports_score_check" CHECK (((score >= (0)::numeric) AND (score <= (100)::numeric)))
);
--> statement-breakpoint
ALTER TABLE "validator_reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "validator_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"agent_name" text NOT NULL,
	"model_used" text DEFAULT 'gemini-3-flash-preview' NOT NULL,
	"tool_used" jsonb DEFAULT '[]',
	"input_json" jsonb,
	"output_json" jsonb,
	"citations" jsonb DEFAULT '[]',
	"status" text DEFAULT 'queued' NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "validator_runs_status_check" CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'ok'::text, 'partial'::text, 'failed'::text])))
);
--> statement-breakpoint
ALTER TABLE "validator_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "validator_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"startup_id" uuid,
	"input_text" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"failed_steps" text[] DEFAULT '{}'::text[],
	CONSTRAINT "validator_sessions_status_check" CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'complete'::text, 'partial'::text, 'failed'::text, 'success'::text, 'degraded_success'::text])))
);
--> statement-breakpoint
ALTER TABLE "validator_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "weekly_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid NOT NULL,
	"week_start" date NOT NULL,
	"week_end" date NOT NULL,
	"summary" text,
	"key_learnings" jsonb DEFAULT '[]',
	"priorities_next_week" jsonb DEFAULT '[]',
	"metrics" jsonb DEFAULT '{}',
	"assumptions_tested" integer DEFAULT 0,
	"experiments_run" integer DEFAULT 0,
	"decisions_made" integer DEFAULT 0,
	"tasks_completed" integer DEFAULT 0,
	"health_score_start" integer,
	"health_score_end" integer,
	"ai_generated" boolean DEFAULT true,
	"edited_by_user" boolean DEFAULT false,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "weekly_reviews" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wizard_extractions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"session_id" uuid NOT NULL,
	"extraction_type" text NOT NULL,
	"source_url" text,
	"raw_content" text,
	"extracted_data" jsonb NOT NULL,
	"confidence" numeric(3,2),
	"ai_run_id" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "wizard_extractions_extraction_type_check" CHECK ((extraction_type = ANY (ARRAY['url'::text, 'linkedin'::text, 'pitch_deck'::text, 'document'::text])))
);
--> statement-breakpoint
ALTER TABLE "wizard_extractions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wizard_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"startup_id" uuid,
	"current_step" integer DEFAULT 1,
	"status" text DEFAULT 'in_progress',
	"form_data" jsonb DEFAULT '{}',
	"diagnostic_answers" jsonb DEFAULT '{}',
	"signals" text[] DEFAULT '{}'::text[],
	"industry_pack_id" uuid,
	"ai_extractions" jsonb DEFAULT '{}',
	"profile_strength" integer DEFAULT 0,
	"started_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	"last_activity_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"interview_answers" jsonb DEFAULT '[]',
	"interview_progress" integer DEFAULT 0,
	"extracted_traction" jsonb DEFAULT '{}',
	"extracted_funding" jsonb DEFAULT '{}',
	"enrichment_sources" text[] DEFAULT '{}'::text[],
	"enrichment_confidence" integer DEFAULT 0,
	"investor_score" integer DEFAULT 0,
	"ai_summary" jsonb,
	"ai_enrichments" jsonb,
	"updated_at" timestamp with time zone DEFAULT now(),
	"grounding_metadata" jsonb,
	"abandoned_at" timestamp with time zone,
	CONSTRAINT "wizard_sessions_current_step_check" CHECK (((current_step >= 1) AND (current_step <= 4))),
	CONSTRAINT "wizard_sessions_enrichment_confidence_check" CHECK (((enrichment_confidence >= 0) AND (enrichment_confidence <= 100))),
	CONSTRAINT "wizard_sessions_interview_progress_check" CHECK (((interview_progress >= 0) AND (interview_progress <= 100))),
	CONSTRAINT "wizard_sessions_status_check" CHECK ((status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text])))
);
--> statement-breakpoint
ALTER TABLE "wizard_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workflow_id" uuid NOT NULL,
	"action_type" text DEFAULT 'create_task' NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"step_order" integer DEFAULT 0 NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"conditions" jsonb DEFAULT '[]' NOT NULL,
	"on_error" text DEFAULT 'stop' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_actions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"startup_id" uuid,
	"org_id" uuid,
	"event_type" text NOT NULL,
	"source" text NOT NULL,
	"score_value" numeric(5,2),
	"threshold_value" numeric(5,2),
	"rule_id" text,
	"task_id" uuid,
	"error_message" text,
	"metadata" jsonb DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "workflow_activity_log" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workflow_id" uuid NOT NULL,
	"trigger_id" uuid,
	"trigger_payload" jsonb DEFAULT '{}' NOT NULL,
	"scheduled_for" timestamp with time zone DEFAULT now() NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"locked_at" timestamp with time zone,
	"locked_by" text,
	"last_error" text,
	"last_error_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_queue" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workflow_id" uuid NOT NULL,
	"queue_id" uuid,
	"trigger_id" uuid,
	"trigger_payload" jsonb DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"current_step" integer DEFAULT 0 NOT NULL,
	"results" jsonb DEFAULT '[]' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"duration_ms" integer,
	"error_message" text,
	"error_step" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflow_triggers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workflow_id" uuid NOT NULL,
	"trigger_type" text DEFAULT 'event' NOT NULL,
	"event_name" text,
	"schedule_cron" text,
	"webhook_path" text,
	"conditions" jsonb DEFAULT '[]' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflow_triggers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"org_id" uuid NOT NULL,
	"startup_id" uuid,
	"created_by" uuid,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"max_retries" integer DEFAULT 3 NOT NULL,
	"retry_delay_seconds" integer DEFAULT 60 NOT NULL,
	"timeout_seconds" integer DEFAULT 300 NOT NULL,
	"run_count" integer DEFAULT 0 NOT NULL,
	"success_count" integer DEFAULT 0 NOT NULL,
	"failure_count" integer DEFAULT 0 NOT NULL,
	"last_run_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "realtime"."messages" (
	"topic" text NOT NULL,
	"extension" text NOT NULL,
	"payload" jsonb,
	"event" text,
	"private" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"inserted_at" timestamp DEFAULT now(),
	"id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "messages_pkey" PRIMARY KEY("id","inserted_at")
);
--> statement-breakpoint
ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "realtime"."messages_2026_02_24" (
	"topic" text NOT NULL,
	"extension" text NOT NULL,
	"payload" jsonb,
	"event" text,
	"private" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"inserted_at" timestamp DEFAULT now(),
	"id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "messages_2026_02_24_pkey" PRIMARY KEY("id","inserted_at")
);
--> statement-breakpoint
CREATE TABLE "realtime"."messages_2026_02_25" (
	"topic" text NOT NULL,
	"extension" text NOT NULL,
	"payload" jsonb,
	"event" text,
	"private" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"inserted_at" timestamp DEFAULT now(),
	"id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "messages_2026_02_25_pkey" PRIMARY KEY("id","inserted_at")
);
--> statement-breakpoint
CREATE TABLE "realtime"."messages_2026_02_26" (
	"topic" text NOT NULL,
	"extension" text NOT NULL,
	"payload" jsonb,
	"event" text,
	"private" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"inserted_at" timestamp DEFAULT now(),
	"id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "messages_2026_02_26_pkey" PRIMARY KEY("id","inserted_at")
);
--> statement-breakpoint
CREATE TABLE "realtime"."messages_2026_02_27" (
	"topic" text NOT NULL,
	"extension" text NOT NULL,
	"payload" jsonb,
	"event" text,
	"private" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"inserted_at" timestamp DEFAULT now(),
	"id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "messages_2026_02_27_pkey" PRIMARY KEY("id","inserted_at")
);
--> statement-breakpoint
CREATE TABLE "realtime"."messages_2026_02_28" (
	"topic" text NOT NULL,
	"extension" text NOT NULL,
	"payload" jsonb,
	"event" text,
	"private" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"inserted_at" timestamp DEFAULT now(),
	"id" uuid DEFAULT gen_random_uuid(),
	CONSTRAINT "messages_2026_02_28_pkey" PRIMARY KEY("id","inserted_at")
);
--> statement-breakpoint
CREATE TABLE "realtime"."schema_migrations" (
	"version" bigint PRIMARY KEY,
	"inserted_at" timestamp(0)
);
--> statement-breakpoint
CREATE TABLE "realtime"."subscription" (
	"id" bigint GENERATED ALWAYS AS IDENTITY (sequence name "realtime"."subscription_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"subscription_id" uuid NOT NULL,
	"entity" regclass NOT NULL,
	"filters" realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
	"claims" jsonb NOT NULL,
	"claims_role" regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
	"created_at" timestamp DEFAULT timezone('utc'::text, now()) NOT NULL,
	"action_filter" text DEFAULT '*',
	CONSTRAINT "pk_subscription" PRIMARY KEY("id"),
	CONSTRAINT "subscription_action_filter_check" CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);
--> statement-breakpoint
CREATE TABLE "storage"."buckets" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"owner" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"public" boolean DEFAULT false,
	"avif_autodetection" boolean DEFAULT false,
	"file_size_limit" bigint,
	"allowed_mime_types" text[],
	"owner_id" text,
	"type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."buckets_analytics" (
	"name" text NOT NULL,
	"type" "storage"."buckettype" DEFAULT 'ANALYTICS'::"storage"."buckettype" NOT NULL,
	"format" text DEFAULT 'ICEBERG' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "storage"."buckets_analytics" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."buckets_vectors" (
	"id" text PRIMARY KEY,
	"type" "storage"."buckettype" DEFAULT 'VECTOR'::"storage"."buckettype" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "storage"."buckets_vectors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."migrations" (
	"id" integer PRIMARY KEY,
	"name" varchar(100) NOT NULL CONSTRAINT "migrations_name_key" UNIQUE,
	"hash" varchar(40) NOT NULL,
	"executed_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"bucket_id" text,
	"name" text,
	"owner" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"last_accessed_at" timestamp with time zone DEFAULT now(),
	"metadata" jsonb,
	"path_tokens" text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
	"version" text,
	"owner_id" text,
	"user_metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."s3_multipart_uploads" (
	"id" text PRIMARY KEY,
	"in_progress_size" bigint DEFAULT 0 NOT NULL,
	"upload_signature" text NOT NULL,
	"bucket_id" text NOT NULL,
	"key" text NOT NULL,
	"version" text NOT NULL,
	"owner_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."s3_multipart_uploads_parts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"upload_id" text NOT NULL,
	"size" bigint DEFAULT 0 NOT NULL,
	"part_number" integer NOT NULL,
	"bucket_id" text NOT NULL,
	"key" text NOT NULL,
	"etag" text NOT NULL,
	"owner_id" text,
	"version" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "storage"."vector_indexes" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"bucket_id" text NOT NULL,
	"data_type" text NOT NULL,
	"dimension" integer NOT NULL,
	"distance_metric" text NOT NULL,
	"metadata_configuration" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "storage"."vector_indexes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "supabase_migrations"."schema_migrations" (
	"version" text PRIMARY KEY,
	"statements" text[],
	"name" text,
	"created_by" text,
	"idempotency_key" text CONSTRAINT "schema_migrations_idempotency_key_key" UNIQUE,
	"rollback" text[]
);
--> statement-breakpoint
CREATE TABLE "vault"."secrets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text,
	"description" text DEFAULT '' NOT NULL,
	"secret" text NOT NULL,
	"key_id" uuid,
	"nonce" bytea DEFAULT vault._crypto_aead_det_noncegen(),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" ("instance_id");--> statement-breakpoint
CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" ("confirmation_token") WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" ("email_change_token_current") WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" ("email_change_token_new") WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" ("reauthentication_token") WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" ("recovery_token") WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" ("email") WHERE (is_sso_user = false);--> statement-breakpoint
CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" ("instance_id",lower((email)::text));--> statement-breakpoint
CREATE INDEX "users_instance_id_idx" ON "auth"."users" ("instance_id");--> statement-breakpoint
CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" ("is_anonymous");--> statement-breakpoint
CREATE INDEX "custom_oauth_providers_created_at_idx" ON "auth"."custom_oauth_providers" ("created_at");--> statement-breakpoint
CREATE INDEX "custom_oauth_providers_enabled_idx" ON "auth"."custom_oauth_providers" ("enabled");--> statement-breakpoint
CREATE INDEX "custom_oauth_providers_identifier_idx" ON "auth"."custom_oauth_providers" ("identifier");--> statement-breakpoint
CREATE INDEX "custom_oauth_providers_provider_type_idx" ON "auth"."custom_oauth_providers" ("provider_type");--> statement-breakpoint
CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" ("friendly_name","user_id") WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);--> statement-breakpoint
CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" ("user_id","phone");--> statement-breakpoint
CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_auth_code" ON "auth"."flow_state" ("auth_code");--> statement-breakpoint
CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" ("user_id","authentication_method");--> statement-breakpoint
CREATE INDEX "identities_email_idx" ON "auth"."identities" ("email" btree);--> statement-breakpoint
CREATE INDEX "identities_user_id_idx" ON "auth"."identities" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_oauth_client_states_created_at" ON "auth"."oauth_client_states" ("created_at");--> statement-breakpoint
CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX "oauth_auth_pending_exp_idx" ON "auth"."oauth_authorizations" ("expires_at") WHERE (status = 'pending'::auth.oauth_authorization_status);--> statement-breakpoint
CREATE INDEX "oauth_clients_deleted_at_idx" ON "auth"."oauth_clients" ("deleted_at");--> statement-breakpoint
CREATE INDEX "oauth_consents_active_client_idx" ON "auth"."oauth_consents" ("client_id") WHERE (revoked_at IS NULL);--> statement-breakpoint
CREATE INDEX "oauth_consents_active_user_client_idx" ON "auth"."oauth_consents" ("user_id","client_id") WHERE (revoked_at IS NULL);--> statement-breakpoint
CREATE INDEX "oauth_consents_user_order_idx" ON "auth"."oauth_consents" ("user_id","granted_at" DESC);--> statement-breakpoint
CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING hash ("relates_to");--> statement-breakpoint
CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING hash ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" ("user_id","token_type");--> statement-breakpoint
CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" ("instance_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" ("instance_id","user_id");--> statement-breakpoint
CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" ("parent");--> statement-breakpoint
CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" ("session_id","revoked");--> statement-breakpoint
CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" ("updated_at" DESC);--> statement-breakpoint
CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" ("sso_provider_id");--> statement-breakpoint
CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" ("for_email");--> statement-breakpoint
CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" ("sso_provider_id");--> statement-breakpoint
CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" ("not_after" DESC);--> statement-breakpoint
CREATE INDEX "sessions_oauth_client_id_idx" ON "auth"."sessions" ("oauth_client_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" (lower(domain));--> statement-breakpoint
CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" ("sso_provider_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" (lower(resource_id));--> statement-breakpoint
CREATE INDEX "sso_providers_resource_id_pattern_idx" ON "auth"."sso_providers" ("resource_id" btree);--> statement-breakpoint
CREATE INDEX "_http_response_created_idx" ON "net"."_http_response" ("created");--> statement-breakpoint
CREATE INDEX "idx_action_executions_action_id" ON "action_executions" ("action_id");--> statement-breakpoint
CREATE INDEX "idx_action_executions_rolled_back_by" ON "action_executions" ("rolled_back_by");--> statement-breakpoint
CREATE INDEX "idx_activities_activity_type" ON "activities" ("activity_type");--> statement-breakpoint
CREATE INDEX "idx_activities_contact" ON "activities" ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_activities_created_at" ON "activities" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_activities_deal_id" ON "activities" ("deal_id");--> statement-breakpoint
CREATE INDEX "idx_activities_document_id" ON "activities" ("document_id");--> statement-breakpoint
CREATE INDEX "idx_activities_org_id" ON "activities" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_activities_project" ON "activities" ("project_id");--> statement-breakpoint
CREATE INDEX "idx_activities_startup_created" ON "activities" ("startup_id","created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_activities_startup_id" ON "activities" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_activities_task_id" ON "activities" ("task_id");--> statement-breakpoint
CREATE INDEX "idx_activities_user_id" ON "activities" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_agent_configs_org_id" ON "agent_configs" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_ai_runs_created_at" ON "ai_runs" ("created_at");--> statement-breakpoint
CREATE INDEX "idx_ai_runs_org_id" ON "ai_runs" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_ai_runs_startup_id" ON "ai_runs" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_ai_runs_user_id" ON "ai_runs" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_assumptions_lean_canvas_id" ON "assumptions" ("lean_canvas_id");--> statement-breakpoint
CREATE INDEX "idx_assumptions_source_block" ON "assumptions" ("startup_id","source_block");--> statement-breakpoint
CREATE INDEX "idx_audit_log_org_id" ON "audit_log" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_audit_log_proposed_action_id" ON "audit_log" ("proposed_action_id");--> statement-breakpoint
CREATE INDEX "idx_audit_log_startup_id" ON "audit_log" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_audit_log_user_id" ON "audit_log" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_campaigns_startup" ON "campaigns" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_chat_facts_source_message_id" ON "chat_facts" ("source_message_id");--> statement-breakpoint
CREATE INDEX "idx_chat_facts_startup_id" ON "chat_facts" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_chat_facts_user_id" ON "chat_facts" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_ai_run_id" ON "chat_messages" ("ai_run_id") WHERE (ai_run_id IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_chat_messages_session_id" ON "chat_messages" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_chat_messages_user_id" ON "chat_messages" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_chat_pending_message_id" ON "chat_pending" ("message_id");--> statement-breakpoint
CREATE INDEX "idx_chat_pending_user_id" ON "chat_pending" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_chat_sessions_startup_id" ON "chat_sessions" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_chat_sessions_user_id" ON "chat_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_communications_contact_occurred" ON "communications" ("contact_id","occurred_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_communications_created_by" ON "communications" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_communications_deal_id" ON "communications" ("deal_id");--> statement-breakpoint
CREATE INDEX "idx_communications_startup_id" ON "communications" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_competitor_profiles_startup_id" ON "competitor_profiles" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_contact_tags_contact_id" ON "contact_tags" ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_contact_tags_created_by" ON "contact_tags" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_contacts_referred_by" ON "contacts" ("referred_by") WHERE (referred_by IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_contacts_startup_created" ON "contacts" ("startup_id","created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_customer_forces_segment_id" ON "customer_forces" ("segment_id");--> statement-breakpoint
CREATE INDEX "idx_customer_segments_startup_id" ON "customer_segments" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_daily_focus_active" ON "daily_focus_recommendations" ("startup_id","expires_at") WHERE ((action_completed_at IS NULL) AND (skipped_at IS NULL));--> statement-breakpoint
CREATE INDEX "idx_daily_focus_startup_id" ON "daily_focus_recommendations" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_deals_contact_id" ON "deals" ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_deals_startup_created" ON "deals" ("startup_id","created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_decision_evidence_decision_id" ON "decision_evidence" ("decision_id");--> statement-breakpoint
CREATE INDEX "idx_decisions_decided_by" ON "decisions" ("decided_by");--> statement-breakpoint
CREATE INDEX "idx_decisions_startup_id" ON "decisions" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_deck_templates_created_by" ON "deck_templates" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_deck_templates_org_id" ON "deck_templates" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_document_versions_created_by" ON "document_versions" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_document_versions_document_id" ON "document_versions" ("document_id");--> statement-breakpoint
CREATE INDEX "idx_documents_created_by" ON "documents" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_documents_startup_id" ON "documents" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_documents_type" ON "documents" ("type");--> statement-breakpoint
CREATE INDEX "idx_documents_wizard_session_id" ON "documents" ("wizard_session_id");--> statement-breakpoint
CREATE INDEX "idx_event_assets_approved_by" ON "event_assets" ("approved_by");--> statement-breakpoint
CREATE INDEX "idx_event_assets_created_by" ON "event_assets" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_event_assets_event_id" ON "event_assets" ("event_id");--> statement-breakpoint
CREATE INDEX "idx_event_assets_parent_asset_id" ON "event_assets" ("parent_asset_id");--> statement-breakpoint
CREATE INDEX "idx_event_attendees_checked_in_by" ON "event_attendees" ("checked_in_by");--> statement-breakpoint
CREATE INDEX "idx_event_attendees_contact_id" ON "event_attendees" ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_event_attendees_event_id" ON "event_attendees" ("event_id");--> statement-breakpoint
CREATE INDEX "idx_event_speakers_event_id" ON "event_speakers" ("event_id");--> statement-breakpoint
CREATE INDEX "idx_event_venues_created_by" ON "event_venues" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_event_venues_event_id" ON "event_venues" ("event_id");--> statement-breakpoint
CREATE INDEX "idx_events_created_by" ON "events" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_events_event_type" ON "events" ("event_type");--> statement-breakpoint
CREATE INDEX "idx_events_related_contact_id" ON "events" ("related_contact_id");--> statement-breakpoint
CREATE INDEX "idx_events_related_deal_id" ON "events" ("related_deal_id");--> statement-breakpoint
CREATE INDEX "idx_events_related_project_id" ON "events" ("related_project_id");--> statement-breakpoint
CREATE INDEX "idx_events_start_date" ON "events" ("start_date");--> statement-breakpoint
CREATE INDEX "idx_events_startup_date" ON "events" ("startup_id","start_date");--> statement-breakpoint
CREATE INDEX "idx_events_startup_scope" ON "events" ("startup_id","event_scope");--> statement-breakpoint
CREATE INDEX "idx_experiment_results_experiment_id" ON "experiment_results" ("experiment_id");--> statement-breakpoint
CREATE INDEX "idx_experiment_results_recorded_by" ON "experiment_results" ("recorded_by");--> statement-breakpoint
CREATE INDEX "idx_experiments_assumption_id" ON "experiments" ("assumption_id");--> statement-breakpoint
CREATE INDEX "idx_file_uploads_startup_id" ON "file_uploads" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_file_uploads_uploaded_by" ON "file_uploads" ("uploaded_by");--> statement-breakpoint
CREATE INDEX "idx_financial_models_startup_id" ON "financial_models" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_industry_events_event_date" ON "industry_events" ("event_date");--> statement-breakpoint
CREATE INDEX "idx_industry_events_startup_relevance" ON "industry_events" ("startup_relevance" DESC);--> statement-breakpoint
CREATE INDEX "idx_industry_playbooks_industry_id" ON "industry_playbooks" ("industry_id");--> statement-breakpoint
CREATE INDEX "idx_interview_insights_hypothesis_id" ON "interview_insights" ("hypothesis_id");--> statement-breakpoint
CREATE INDEX "idx_interview_insights_interview_id" ON "interview_insights" ("interview_id");--> statement-breakpoint
CREATE INDEX "idx_interview_insights_validated_by" ON "interview_insights" ("validated_by");--> statement-breakpoint
CREATE INDEX "idx_interview_questions_hypothesis_id" ON "interview_questions" ("hypothesis_id");--> statement-breakpoint
CREATE INDEX "idx_interview_questions_interview_id" ON "interview_questions" ("interview_id");--> statement-breakpoint
CREATE INDEX "idx_interviews_conducted_at" ON "interviews" ("startup_id","conducted_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_interviews_conducted_by" ON "interviews" ("conducted_by");--> statement-breakpoint
CREATE INDEX "idx_interviews_experiment_id" ON "interviews" ("experiment_id");--> statement-breakpoint
CREATE INDEX "idx_interviews_segment_id" ON "interviews" ("segment_id");--> statement-breakpoint
CREATE INDEX "idx_investors_startup_id" ON "investors" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_jobs_to_be_done_related_functional_job_id" ON "jobs_to_be_done" ("related_functional_job_id");--> statement-breakpoint
CREATE INDEX "idx_jobs_to_be_done_segment_id" ON "jobs_to_be_done" ("segment_id");--> statement-breakpoint
CREATE INDEX "idx_knowledge_chunks_category" ON "knowledge_chunks" ("category");--> statement-breakpoint
CREATE INDEX "idx_knowledge_chunks_document_id" ON "knowledge_chunks" ("document_id");--> statement-breakpoint
CREATE INDEX "idx_knowledge_chunks_industry" ON "knowledge_chunks" ("industry") WHERE (industry IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_knowledge_chunks_source_type" ON "knowledge_chunks" ("source_type");--> statement-breakpoint
CREATE INDEX "idx_knowledge_chunks_year" ON "knowledge_chunks" ("year" DESC);--> statement-breakpoint
CREATE INDEX "knowledge_chunks_embedding_idx" ON "knowledge_chunks" USING hnsw ("embedding" hnsw) WITH (m=16, ef_construction=64);--> statement-breakpoint
CREATE INDEX "knowledge_chunks_industry_idx" ON "knowledge_chunks" ("industry");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_knowledge_documents_content_hash" ON "knowledge_documents" ("content_hash") WHERE (content_hash IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_knowledge_map_startup" ON "knowledge_map" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_lean_canvas_versions_created_by" ON "lean_canvas_versions" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_lean_canvases_current" ON "lean_canvases" ("startup_id","is_current") WHERE (is_current = true);--> statement-breakpoint
CREATE INDEX "idx_lean_canvases_playbook_run_id" ON "lean_canvases" ("playbook_run_id");--> statement-breakpoint
CREATE INDEX "idx_lean_canvases_startup" ON "lean_canvases" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_market_research_startup_id" ON "market_research" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_messages_attendee_id" ON "messages" ("attendee_id");--> statement-breakpoint
CREATE INDEX "idx_messages_created_by" ON "messages" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_messages_escalated_to" ON "messages" ("escalated_to");--> statement-breakpoint
CREATE INDEX "idx_messages_event_id" ON "messages" ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_metric_snapshots_unique_daily" ON "metric_snapshots" ("startup_id","snapshot_date","snapshot_type");--> statement-breakpoint
CREATE INDEX "idx_notifications_user_id" ON "notifications" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_opportunity_canvas_startup_id" ON "opportunity_canvas" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_org_members_invited_by" ON "org_members" ("invited_by") WHERE (invited_by IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_org_members_org_id" ON "org_members" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_org_members_user_id" ON "org_members" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_pitch_deck_slides_deck_order" ON "pitch_deck_slides" ("deck_id","slide_number");--> statement-breakpoint
CREATE INDEX "idx_pitch_deck_slides_slide_type" ON "pitch_deck_slides" ("slide_type");--> statement-breakpoint
CREATE INDEX "idx_pitch_decks_created_by" ON "pitch_decks" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_pitch_decks_last_edited_by" ON "pitch_decks" ("last_edited_by");--> statement-breakpoint
CREATE INDEX "idx_pitch_decks_playbook_run_id" ON "pitch_decks" ("playbook_run_id");--> statement-breakpoint
CREATE INDEX "idx_pitch_decks_startup_status" ON "pitch_decks" ("startup_id","status");--> statement-breakpoint
CREATE INDEX "idx_pitch_decks_status" ON "pitch_decks" ("status");--> statement-breakpoint
CREATE INDEX "idx_pivot_logs_assumption_id" ON "pivot_logs" ("assumption_id");--> statement-breakpoint
CREATE INDEX "idx_pivot_logs_startup_id" ON "pivot_logs" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_playbook_runs_startup_id" ON "playbook_runs" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_id" ON "profiles" ("id");--> statement-breakpoint
CREATE INDEX "idx_profiles_org_id" ON "profiles" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_projects_active_health" ON "projects" ("startup_id","health") WHERE (status = 'active'::text);--> statement-breakpoint
CREATE INDEX "idx_projects_owner_id" ON "projects" ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_projects_startup_id" ON "projects" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_prompt_pack_runs_org_id" ON "prompt_pack_runs" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_prompt_pack_runs_pack_id" ON "prompt_pack_runs" ("pack_id");--> statement-breakpoint
CREATE INDEX "idx_prompt_pack_runs_startup_id" ON "prompt_pack_runs" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_prompt_pack_runs_user_id" ON "prompt_pack_runs" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_prompt_pack_steps_pack_id" ON "prompt_pack_steps" ("pack_id");--> statement-breakpoint
CREATE INDEX "idx_proposed_actions_ai_run_id" ON "proposed_actions" ("ai_run_id");--> statement-breakpoint
CREATE INDEX "idx_proposed_actions_approved_by" ON "proposed_actions" ("approved_by");--> statement-breakpoint
CREATE INDEX "idx_proposed_actions_org_id" ON "proposed_actions" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_proposed_actions_startup_id" ON "proposed_actions" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_proposed_actions_user_id" ON "proposed_actions" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_share_views_link_id" ON "share_views" ("link_id");--> statement-breakpoint
CREATE INDEX "idx_shareable_links_created_by" ON "shareable_links" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_shareable_links_resource" ON "shareable_links" ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "idx_shareable_links_startup_id" ON "shareable_links" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_shareable_links_token" ON "shareable_links" ("token");--> statement-breakpoint
CREATE INDEX "idx_sponsors_contact_id" ON "sponsors" ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_sponsors_created_by" ON "sponsors" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_sponsors_event_id" ON "sponsors" ("event_id");--> statement-breakpoint
CREATE INDEX "idx_sprint_tasks_campaign_id" ON "sprint_tasks" ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_sprints_campaign" ON "sprints" ("campaign_id");--> statement-breakpoint
CREATE INDEX "idx_startup_health_scores_startup_id" ON "startup_health_scores" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_startup_members_invited_by" ON "startup_members" ("invited_by");--> statement-breakpoint
CREATE INDEX "idx_startup_members_startup" ON "startup_members" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_startup_members_user" ON "startup_members" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_startups_org_id" ON "startups" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_active_priority" ON "tasks" ("startup_id","priority","due_at") WHERE (status <> ALL (ARRAY['completed'::text, 'cancelled'::text]));--> statement-breakpoint
CREATE INDEX "idx_tasks_assigned_to" ON "tasks" ("assigned_to");--> statement-breakpoint
CREATE INDEX "idx_tasks_contact_id" ON "tasks" ("contact_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_created_by" ON "tasks" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_tasks_deal_id" ON "tasks" ("deal_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_parent_task_id" ON "tasks" ("parent_task_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_project_id" ON "tasks" ("project_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_source" ON "tasks" ("source") WHERE (source IS NOT NULL);--> statement-breakpoint
CREATE INDEX "idx_tasks_startup_created" ON "tasks" ("startup_id","created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_tasks_startup_id" ON "tasks" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_tasks_startup_project_status" ON "tasks" ("startup_id","project_id","status");--> statement-breakpoint
CREATE INDEX "idx_validation_reports_run_id" ON "validator_reports" ("run_id");--> statement-breakpoint
CREATE INDEX "idx_validation_reports_session_id" ON "validator_reports" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_validation_reports_startup_id" ON "validator_reports" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_validator_runs_agent_name" ON "validator_runs" ("agent_name");--> statement-breakpoint
CREATE INDEX "idx_validator_runs_session_agent" ON "validator_runs" ("session_id","agent_name");--> statement-breakpoint
CREATE INDEX "idx_validator_runs_session_id" ON "validator_runs" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_validator_sessions_startup_id" ON "validator_sessions" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_validator_sessions_status" ON "validator_sessions" ("status");--> statement-breakpoint
CREATE INDEX "idx_validator_sessions_user_id" ON "validator_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_weekly_reviews_created_by" ON "weekly_reviews" ("created_by");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_weekly_reviews_startup_week" ON "weekly_reviews" ("startup_id","week_start");--> statement-breakpoint
CREATE INDEX "idx_wizard_extractions_ai_run_id" ON "wizard_extractions" ("ai_run_id");--> statement-breakpoint
CREATE INDEX "idx_wizard_extractions_session_id" ON "wizard_extractions" ("session_id");--> statement-breakpoint
CREATE INDEX "idx_wizard_sessions_industry_pack_id" ON "wizard_sessions" ("industry_pack_id");--> statement-breakpoint
CREATE INDEX "idx_wizard_sessions_last_activity" ON "wizard_sessions" ("last_activity_at" DESC NULLS LAST) WHERE (status = 'in_progress'::text);--> statement-breakpoint
CREATE INDEX "idx_wizard_sessions_startup_id" ON "wizard_sessions" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_wizard_sessions_status" ON "wizard_sessions" ("status");--> statement-breakpoint
CREATE INDEX "idx_wizard_sessions_user_id" ON "wizard_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX "idx_wizard_sessions_user_status" ON "wizard_sessions" ("user_id","status") WHERE (status = 'in_progress'::text);--> statement-breakpoint
CREATE INDEX "idx_workflow_actions_workflow_id" ON "workflow_actions" ("workflow_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_activity_created" ON "workflow_activity_log" ("created_at" DESC);--> statement-breakpoint
CREATE INDEX "idx_workflow_activity_log_org_id" ON "workflow_activity_log" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_activity_log_startup_id" ON "workflow_activity_log" ("startup_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_activity_log_task_id" ON "workflow_activity_log" ("task_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_queue_trigger_id" ON "workflow_queue" ("trigger_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_queue_workflow_id" ON "workflow_queue" ("workflow_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_runs_queue_id" ON "workflow_runs" ("queue_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_runs_trigger_id" ON "workflow_runs" ("trigger_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_runs_workflow_id" ON "workflow_runs" ("workflow_id");--> statement-breakpoint
CREATE INDEX "idx_workflow_triggers_workflow_id" ON "workflow_triggers" ("workflow_id");--> statement-breakpoint
CREATE INDEX "idx_workflows_created_by" ON "workflows" ("created_by");--> statement-breakpoint
CREATE INDEX "idx_workflows_org_id" ON "workflows" ("org_id");--> statement-breakpoint
CREATE INDEX "idx_workflows_startup_id" ON "workflows" ("startup_id");--> statement-breakpoint
CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" ("entity");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_action_filter_key" ON "realtime"."subscription" ("subscription_id","entity","filters","action_filter");--> statement-breakpoint
CREATE INDEX "messages_2026_02_24_inserted_at_topic_idx" ON "realtime"."messages_2026_02_24" ("inserted_at" DESC,"topic") WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));--> statement-breakpoint
CREATE INDEX "messages_2026_02_25_inserted_at_topic_idx" ON "realtime"."messages_2026_02_25" ("inserted_at" DESC,"topic") WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));--> statement-breakpoint
CREATE INDEX "messages_2026_02_26_inserted_at_topic_idx" ON "realtime"."messages_2026_02_26" ("inserted_at" DESC,"topic") WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));--> statement-breakpoint
CREATE INDEX "messages_2026_02_27_inserted_at_topic_idx" ON "realtime"."messages_2026_02_27" ("inserted_at" DESC,"topic") WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));--> statement-breakpoint
CREATE INDEX "messages_2026_02_28_inserted_at_topic_idx" ON "realtime"."messages_2026_02_28" ("inserted_at" DESC,"topic") WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));--> statement-breakpoint
CREATE UNIQUE INDEX "bname" ON "storage"."buckets" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" ("bucket_id","name");--> statement-breakpoint
CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" ("bucket_id","name");--> statement-breakpoint
CREATE INDEX "idx_objects_bucket_id_name_lower" ON "storage"."objects" ("bucket_id",lower(name));--> statement-breakpoint
CREATE INDEX "name_prefix_search" ON "storage"."objects" ("name" btree);--> statement-breakpoint
CREATE UNIQUE INDEX "buckets_analytics_unique_name_idx" ON "storage"."buckets_analytics" ("name") WHERE (deleted_at IS NULL);--> statement-breakpoint
CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" ("bucket_id","key","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "vector_indexes_name_bucket_id_idx" ON "storage"."vector_indexes" ("name","bucket_id");--> statement-breakpoint
CREATE UNIQUE INDEX "secrets_name_idx" ON "vault"."secrets" ("name") WHERE (name IS NOT NULL);--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."identities" ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_oauth_client_id_fkey" FOREIGN KEY ("oauth_client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."mfa_factors" ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."mfa_challenges" ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."mfa_amr_claims" ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."sso_domains" ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."saml_providers" ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."saml_relay_states" ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."one_time_tokens" ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."oauth_authorizations" ADD CONSTRAINT "oauth_authorizations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."oauth_authorizations" ADD CONSTRAINT "oauth_authorizations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."oauth_consents" ADD CONSTRAINT "oauth_consents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "auth"."oauth_clients"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "auth"."oauth_consents" ADD CONSTRAINT "oauth_consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "storage"."objects" ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");--> statement-breakpoint
ALTER TABLE "storage"."s3_multipart_uploads" ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");--> statement-breakpoint
ALTER TABLE "storage"."s3_multipart_uploads_parts" ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");--> statement-breakpoint
ALTER TABLE "storage"."s3_multipart_uploads_parts" ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "storage"."vector_indexes" ADD CONSTRAINT "vector_indexes_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets_vectors"("id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "startups" ADD CONSTRAINT "startups_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "fk_tasks_contact_id" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "fk_tasks_deal_id" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "profiles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "tasks"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_referred_by_fkey" FOREIGN KEY ("referred_by") REFERENCES "contacts"("id");--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "deals" ADD CONSTRAINT "deals_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "communications" ADD CONSTRAINT "communications_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "communications" ADD CONSTRAINT "communications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "communications" ADD CONSTRAINT "communications_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "communications" ADD CONSTRAINT "communications_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "contact_tags" ADD CONSTRAINT "contact_tags_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "contact_tags" ADD CONSTRAINT "contact_tags_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "proposed_actions" ADD CONSTRAINT "proposed_actions_ai_run_id_fkey" FOREIGN KEY ("ai_run_id") REFERENCES "ai_runs"("id");--> statement-breakpoint
ALTER TABLE "proposed_actions" ADD CONSTRAINT "proposed_actions_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "proposed_actions" ADD CONSTRAINT "proposed_actions_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "proposed_actions" ADD CONSTRAINT "proposed_actions_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "proposed_actions" ADD CONSTRAINT "proposed_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "proposed_actions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "action_executions" ADD CONSTRAINT "action_executions_rolled_back_by_fkey" FOREIGN KEY ("rolled_back_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "agent_configs" ADD CONSTRAINT "agent_configs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "wizard_sessions" ADD CONSTRAINT "wizard_sessions_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "wizard_sessions" ADD CONSTRAINT "wizard_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "wizard_extractions" ADD CONSTRAINT "wizard_extractions_ai_run_id_fkey" FOREIGN KEY ("ai_run_id") REFERENCES "ai_runs"("id");--> statement-breakpoint
ALTER TABLE "wizard_extractions" ADD CONSTRAINT "wizard_extractions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "wizard_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_wizard_session_id_fkey" FOREIGN KEY ("wizard_session_id") REFERENCES "wizard_sessions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_ai_run_id_fkey" FOREIGN KEY ("ai_run_id") REFERENCES "ai_runs"("id");--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_facts" ADD CONSTRAINT "chat_facts_source_message_id_fkey" FOREIGN KEY ("source_message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "chat_facts" ADD CONSTRAINT "chat_facts_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "chat_facts" ADD CONSTRAINT "chat_facts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chat_pending" ADD CONSTRAINT "chat_pending_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "chat_pending" ADD CONSTRAINT "chat_pending_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_proposed_action_id_fkey" FOREIGN KEY ("proposed_action_id") REFERENCES "proposed_actions"("id");--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "profiles"("id");--> statement-breakpoint
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "investors" ADD CONSTRAINT "investors_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_last_edited_by_fkey" FOREIGN KEY ("last_edited_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_playbook_run_id_fkey" FOREIGN KEY ("playbook_run_id") REFERENCES "playbook_runs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pitch_decks" ADD CONSTRAINT "pitch_decks_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pitch_deck_slides" ADD CONSTRAINT "pitch_deck_slides_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "pitch_decks"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_related_contact_id_fkey" FOREIGN KEY ("related_contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_related_deal_id_fkey" FOREIGN KEY ("related_deal_id") REFERENCES "deals"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_related_project_id_fkey" FOREIGN KEY ("related_project_id") REFERENCES "projects"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_deal_id_fkey" FOREIGN KEY ("deal_id") REFERENCES "deals"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "deck_templates" ADD CONSTRAINT "deck_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "deck_templates" ADD CONSTRAINT "deck_templates_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "event_sponsors_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "event_sponsors_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "event_sponsors_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_venues" ADD CONSTRAINT "event_venues_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "event_venues" ADD CONSTRAINT "event_venues_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_checked_in_by_fkey" FOREIGN KEY ("checked_in_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "event_messages_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "event_attendees"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "event_messages_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "event_messages_escalated_to_fkey" FOREIGN KEY ("escalated_to") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "event_messages_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_assets" ADD CONSTRAINT "event_assets_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "event_assets" ADD CONSTRAINT "event_assets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "event_assets" ADD CONSTRAINT "event_assets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_assets" ADD CONSTRAINT "event_assets_parent_asset_id_fkey" FOREIGN KEY ("parent_asset_id") REFERENCES "event_assets"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "startup_event_tasks" ADD CONSTRAINT "startup_event_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "event_speakers" ADD CONSTRAINT "event_speakers_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "industry_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_event_tracking" ADD CONSTRAINT "user_event_tracking_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "industry_events"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_event_tracking" ADD CONSTRAINT "user_event_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lean_canvases" ADD CONSTRAINT "lean_canvases_playbook_run_id_fkey" FOREIGN KEY ("playbook_run_id") REFERENCES "playbook_runs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "lean_canvases" ADD CONSTRAINT "lean_canvases_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "competitor_profiles" ADD CONSTRAINT "competitor_profiles_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "prompt_pack_steps" ADD CONSTRAINT "prompt_pack_steps_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "prompt_packs"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "prompt_pack_runs" ADD CONSTRAINT "prompt_pack_runs_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "prompt_pack_runs" ADD CONSTRAINT "prompt_pack_runs_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "prompt_packs"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "prompt_pack_runs" ADD CONSTRAINT "prompt_pack_runs_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "prompt_pack_runs" ADD CONSTRAINT "prompt_pack_runs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "validator_reports" ADD CONSTRAINT "validation_reports_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "validator_sessions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "validator_reports" ADD CONSTRAINT "validation_reports_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "playbook_runs" ADD CONSTRAINT "playbook_runs_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflow_activity_log" ADD CONSTRAINT "workflow_activity_log_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workflow_activity_log" ADD CONSTRAINT "workflow_activity_log_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflow_activity_log" ADD CONSTRAINT "workflow_activity_log_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "daily_focus_recommendations" ADD CONSTRAINT "daily_focus_recommendations_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_lean_canvas_id_fkey" FOREIGN KEY ("lean_canvas_id") REFERENCES "lean_canvases"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "assumptions" ADD CONSTRAINT "assumptions_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "experiments" ADD CONSTRAINT "experiments_assumption_id_fkey" FOREIGN KEY ("assumption_id") REFERENCES "assumptions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "experiment_results" ADD CONSTRAINT "experiment_results_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "experiment_results" ADD CONSTRAINT "experiment_results_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "customer_segments" ADD CONSTRAINT "customer_segments_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "customer_forces" ADD CONSTRAINT "customer_forces_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "customer_segments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "jobs_to_be_done" ADD CONSTRAINT "jobs_to_be_done_related_functional_job_id_fkey" FOREIGN KEY ("related_functional_job_id") REFERENCES "jobs_to_be_done"("id");--> statement-breakpoint
ALTER TABLE "jobs_to_be_done" ADD CONSTRAINT "jobs_to_be_done_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "customer_segments"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_conducted_by_fkey" FOREIGN KEY ("conducted_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_experiment_id_fkey" FOREIGN KEY ("experiment_id") REFERENCES "experiments"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_segment_id_fkey" FOREIGN KEY ("segment_id") REFERENCES "customer_segments"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "interview_insights" ADD CONSTRAINT "interview_insights_hypothesis_id_fkey" FOREIGN KEY ("hypothesis_id") REFERENCES "assumptions"("id");--> statement-breakpoint
ALTER TABLE "interview_insights" ADD CONSTRAINT "interview_insights_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "interview_insights" ADD CONSTRAINT "interview_insights_validated_by_fkey" FOREIGN KEY ("validated_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflow_triggers" ADD CONSTRAINT "workflow_triggers_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflow_actions" ADD CONSTRAINT "workflow_actions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflow_queue" ADD CONSTRAINT "workflow_queue_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "workflow_triggers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workflow_queue" ADD CONSTRAINT "workflow_queue_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_queue_id_fkey" FOREIGN KEY ("queue_id") REFERENCES "workflow_queue"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_trigger_id_fkey" FOREIGN KEY ("trigger_id") REFERENCES "workflow_triggers"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "metric_snapshots" ADD CONSTRAINT "metric_snapshots_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "knowledge_documents"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "startup_members" ADD CONSTRAINT "startup_members_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "startup_members" ADD CONSTRAINT "startup_members_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "startup_members" ADD CONSTRAINT "startup_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "validator_sessions" ADD CONSTRAINT "validator_sessions_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "validator_sessions" ADD CONSTRAINT "validator_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "validator_runs" ADD CONSTRAINT "validator_runs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "validator_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "market_research" ADD CONSTRAINT "market_research_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "opportunity_canvas" ADD CONSTRAINT "opportunity_canvas_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_hypothesis_id_fkey" FOREIGN KEY ("hypothesis_id") REFERENCES "assumptions"("id");--> statement-breakpoint
ALTER TABLE "interview_questions" ADD CONSTRAINT "interview_questions_interview_id_fkey" FOREIGN KEY ("interview_id") REFERENCES "interviews"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "decision_evidence" ADD CONSTRAINT "decision_evidence_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "decisions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "shareable_links" ADD CONSTRAINT "shareable_links_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "shareable_links" ADD CONSTRAINT "shareable_links_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "ai_usage_limits" ADD CONSTRAINT "ai_usage_limits_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "weekly_reviews" ADD CONSTRAINT "weekly_reviews_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "weekly_reviews" ADD CONSTRAINT "weekly_reviews_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "validator_agent_runs" ADD CONSTRAINT "validator_agent_runs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "validator_sessions"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sprints" ADD CONSTRAINT "sprints_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lean_canvas_versions" ADD CONSTRAINT "lean_canvas_versions_canvas_id_fkey" FOREIGN KEY ("canvas_id") REFERENCES "lean_canvases"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "lean_canvas_versions" ADD CONSTRAINT "lean_canvas_versions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");--> statement-breakpoint
ALTER TABLE "knowledge_map" ADD CONSTRAINT "knowledge_map_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "pivot_logs" ADD CONSTRAINT "pivot_logs_assumption_id_fkey" FOREIGN KEY ("assumption_id") REFERENCES "assumptions"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "pivot_logs" ADD CONSTRAINT "pivot_logs_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sprint_tasks" ADD CONSTRAINT "sprint_tasks_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "share_views" ADD CONSTRAINT "share_views_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "shareable_links"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "startup_health_scores" ADD CONSTRAINT "startup_health_scores_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "financial_models" ADD CONSTRAINT "financial_models_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "dashboard_metrics_cache" ADD CONSTRAINT "dashboard_metrics_cache_startup_id_fkey" FOREIGN KEY ("startup_id") REFERENCES "startups"("id") ON DELETE CASCADE;--> statement-breakpoint
CREATE VIEW "extensions"."pg_stat_statements" AS (SELECT userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, shared_blk_read_time, shared_blk_write_time, local_blk_read_time, local_blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time, jit_deform_count, jit_deform_time, stats_since, minmax_stats_since FROM pg_stat_statements(true) pg_stat_statements(userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, shared_blk_read_time, shared_blk_write_time, local_blk_read_time, local_blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time, jit_deform_count, jit_deform_time, stats_since, minmax_stats_since));--> statement-breakpoint
CREATE VIEW "extensions"."pg_stat_statements_info" AS (SELECT dealloc, stats_reset FROM pg_stat_statements_info() pg_stat_statements_info(dealloc, stats_reset));--> statement-breakpoint
CREATE VIEW "assumption_evidence" WITH (security_invoker = true) AS (SELECT a.id AS assumption_id, a.startup_id, a.statement AS assumption_statement, a.status AS assumption_status, count(ii.id) AS total_insights, count(ii.id) FILTER (WHERE ii.supports_assumptions = true) AS supporting_insights, count(ii.id) FILTER (WHERE ii.supports_assumptions = false) AS refuting_insights, count(ii.id) FILTER (WHERE ii.supports_assumptions IS NULL) AS neutral_insights, avg(ii.confidence) AS avg_confidence, array_agg(DISTINCT ii.interview_id) FILTER (WHERE ii.id IS NOT NULL) AS interview_ids FROM assumptions a LEFT JOIN interview_insights ii ON a.id = ANY (ii.linked_assumption_ids) GROUP BY a.id, a.startup_id, a.statement, a.status);--> statement-breakpoint
CREATE VIEW "calendar_events" WITH (security_invoker = true) AS (SELECT id, startup_id, title, description, event_type, status, start_date, end_date, all_day, location, virtual_meeting_url, attendees, related_contact_id, related_deal_id, related_project_id, reminder_minutes, recurrence_rule, color, metadata, created_by, created_at, updated_at FROM events WHERE event_scope = 'internal'::event_scope);--> statement-breakpoint
CREATE VIEW "customer_forces_balance" WITH (security_invoker = true) AS (SELECT cs.id AS segment_id, cs.startup_id, cs.name AS segment_name, COALESCE(sum( CASE WHEN cf.force_type = 'push'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS push_total, COALESCE(sum( CASE WHEN cf.force_type = 'pull'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS pull_total, COALESCE(sum( CASE WHEN cf.force_type = 'inertia'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS inertia_total, COALESCE(sum( CASE WHEN cf.force_type = 'friction'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS friction_total, COALESCE(sum( CASE WHEN cf.force_type = ANY (ARRAY['push'::force_type, 'pull'::force_type]) THEN cf.strength ELSE 0 END), 0::bigint) - COALESCE(sum( CASE WHEN cf.force_type = ANY (ARRAY['inertia'::force_type, 'friction'::force_type]) THEN cf.strength ELSE 0 END), 0::bigint) AS net_force_balance FROM customer_segments cs LEFT JOIN customer_forces cf ON cf.segment_id = cs.id GROUP BY cs.id, cs.startup_id, cs.name);--> statement-breakpoint
CREATE MATERIALIZED VIEW "dashboard_metrics" USING "heap" AS (SELECT s.id AS startup_id, s.name AS startup_name, s.org_id, COALESCE(t.tasks_total, 0::bigint) AS tasks_total, COALESCE(t.tasks_completed, 0::bigint) AS tasks_completed, COALESCE(t.tasks_in_progress, 0::bigint) AS tasks_in_progress, COALESCE(t.tasks_overdue, 0::bigint) AS tasks_overdue, CASE WHEN COALESCE(t.tasks_total, 0::bigint) > 0 THEN round(COALESCE(t.tasks_completed, 0::bigint)::numeric / t.tasks_total::numeric * 100::numeric) ELSE 0::numeric END AS task_completion_rate, COALESCE(c.contacts_total, 0::bigint) AS contacts_total, COALESCE(c.contacts_this_week, 0::bigint) AS contacts_this_week, COALESCE(d.deals_total, 0::bigint) AS deals_total, COALESCE(d.deals_active, 0::bigint) AS deals_active, COALESCE(d.deals_won, 0::bigint) AS deals_won, COALESCE(d.deals_value, 0::numeric) AS deals_total_value, CASE WHEN COALESCE(d.deals_total, 0::bigint) > 0 THEN round(COALESCE(d.deals_won, 0::bigint)::numeric / d.deals_total::numeric * 100::numeric) ELSE 0::numeric END AS deal_win_rate, COALESCE(lc.canvas_count, 0::bigint) AS canvas_count, COALESCE(lc.canvas_completion, 0) AS canvas_completion_pct, COALESCE(pd.deck_count, 0::bigint) AS pitch_deck_count, COALESCE(pd.total_slides, 0) AS pitch_deck_slides, COALESCE(v.validation_score, 0) AS validation_score, COALESCE(v.is_active, false) AS validation_active, COALESCE(e.experiments_total, 0::bigint) AS experiments_total, COALESCE(e.experiments_completed, 0::bigint) AS experiments_completed, COALESCE(i.interviews_total, 0::bigint) AS interviews_total, COALESCE(i.interviews_this_week, 0::bigint) AS interviews_this_week, COALESCE(a.activities_this_week, 0::bigint) AS activities_this_week, COALESCE(a.activities_total, 0::bigint) AS activities_total, LEAST(100::numeric, GREATEST(0::numeric, COALESCE(COALESCE(t.tasks_completed, 0::bigint)::numeric / NULLIF(t.tasks_total, 0)::numeric * 20::numeric, 0::numeric) + CASE WHEN COALESCE(lc.canvas_completion, 0) > 0 THEN 20 ELSE 0 END::numeric + CASE WHEN COALESCE(pd.total_slides, 0) >= 10 THEN 20 ELSE COALESCE(pd.total_slides, 0) * 2 END::numeric + CASE WHEN COALESCE(v.validation_score, 0) > 0 THEN 20 ELSE 0 END::numeric + CASE WHEN COALESCE(a.activities_this_week, 0::bigint) >= 5 THEN 20::bigint ELSE COALESCE(a.activities_this_week, 0::bigint) * 4 END::numeric))::integer AS health_score, now() AS refreshed_at FROM startups s LEFT JOIN LATERAL ( SELECT count(*) AS tasks_total, count(*) FILTER (WHERE tasks.status = 'completed'::text) AS tasks_completed, count(*) FILTER (WHERE tasks.status = 'in_progress'::text) AS tasks_in_progress, count(*) FILTER (WHERE tasks.status <> 'completed'::text AND tasks.due_at < CURRENT_DATE) AS tasks_overdue FROM tasks WHERE tasks.startup_id = s.id) t ON true LEFT JOIN LATERAL ( SELECT count(*) AS contacts_total, count(*) FILTER (WHERE contacts.created_at > (now() - '7 days'::interval)) AS contacts_this_week FROM contacts WHERE contacts.startup_id = s.id) c ON true LEFT JOIN LATERAL ( SELECT count(*) AS deals_total, count(*) FILTER (WHERE deals.is_active = true) AS deals_active, count(*) FILTER (WHERE deals.stage = 'won'::text) AS deals_won, COALESCE(sum(deals.amount), 0::numeric) AS deals_value FROM deals WHERE deals.startup_id = s.id) d ON true LEFT JOIN LATERAL ( SELECT count(*) AS canvas_count, max( CASE WHEN lean_canvases.problem IS NOT NULL THEN 11 WHEN lean_canvases.customer_segments IS NOT NULL THEN 11 WHEN lean_canvases.unique_value_proposition IS NOT NULL THEN 11 WHEN lean_canvases.solution IS NOT NULL THEN 11 WHEN lean_canvases.channels IS NOT NULL THEN 11 WHEN lean_canvases.revenue_streams IS NOT NULL THEN 11 WHEN lean_canvases.cost_structure IS NOT NULL THEN 11 WHEN lean_canvases.key_metrics IS NOT NULL THEN 11 WHEN lean_canvases.unfair_advantage IS NOT NULL THEN 11 ELSE 0 END) AS canvas_completion FROM lean_canvases WHERE lean_canvases.startup_id = s.id AND lean_canvases.is_current = true) lc ON true LEFT JOIN LATERAL ( SELECT count(*) AS deck_count, COALESCE(max(pitch_decks.slide_count), 0) AS total_slides FROM pitch_decks WHERE pitch_decks.startup_id = s.id) pd ON true LEFT JOIN LATERAL ( SELECT COALESCE(vr.score::integer, 0) AS validation_score, true AS is_active FROM validator_reports vr WHERE vr.startup_id = s.id ORDER BY vr.created_at DESC LIMIT 1) v ON true LEFT JOIN LATERAL ( SELECT count(*) AS experiments_total, count(*) FILTER (WHERE ex.status = 'completed'::experiment_status) AS experiments_completed FROM experiments ex JOIN assumptions asm ON asm.id = ex.assumption_id WHERE asm.startup_id = s.id) e ON true LEFT JOIN LATERAL ( SELECT count(*) AS interviews_total, count(*) FILTER (WHERE interviews.conducted_at > (now() - '7 days'::interval)) AS interviews_this_week FROM interviews WHERE interviews.startup_id = s.id) i ON true LEFT JOIN LATERAL ( SELECT count(*) AS activities_total, count(*) FILTER (WHERE activities.created_at > (now() - '7 days'::interval)) AS activities_this_week FROM activities WHERE activities.startup_id = s.id) a ON true);--> statement-breakpoint
CREATE VIEW "events_directory" WITH (security_invoker = true) AS (SELECT events.id, events.name, COALESCE(events.name, events.title) AS display_name, events.description, events.start_date, events.end_date, events.location, events.location AS display_location, events.event_type, events.status, 'hosted'::text AS event_source, events.event_scope, events.startup_id, events.capacity, events.budget, events.ticket_price, events.registration_url, events.is_public, events.slug, events.cover_image_url, events.organizer_name, events.organizer_logo_url, events.tags, events.industry, events.target_audience, events.related_contact_id, events.related_deal_id, events.virtual_meeting_url, NULL::integer AS startup_relevance, NULL::text AS ticket_cost_tier, NULL::numeric AS ticket_cost_min, NULL::numeric AS ticket_cost_max, NULL::text AS external_url, NULL::event_category[] AS categories, NULL::text[] AS topics, events.created_at, events.updated_at, events.published_at, events.cancelled_at FROM events WHERE events.event_scope = 'hosted'::event_scope UNION ALL SELECT industry_events.id, industry_events.name, COALESCE(industry_events.full_name, industry_events.name) AS display_name, industry_events.description, industry_events.event_date::timestamp with time zone AS start_date, industry_events.end_date::timestamp with time zone AS end_date, (industry_events.location_city || ', '::text) || COALESCE(industry_events.location_country, ''::text) AS location, (industry_events.location_city || ', '::text) || COALESCE(industry_events.location_country, ''::text) AS display_location, 'conference'::event_type AS event_type, CASE WHEN industry_events.event_date < CURRENT_DATE THEN 'completed'::event_status WHEN industry_events.event_date >= CURRENT_DATE THEN 'scheduled'::event_status ELSE 'scheduled'::event_status END AS status, 'industry'::text AS event_source, 'external'::event_scope AS event_scope, NULL::uuid AS startup_id, NULL::integer AS capacity, NULL::numeric AS budget, NULL::numeric AS ticket_price, industry_events.registration_url, true AS is_public, industry_events.slug, NULL::text AS cover_image_url, NULL::text AS organizer_name, NULL::text AS organizer_logo_url, industry_events.tags, NULL::text AS industry, industry_events.audience_types AS target_audience, NULL::uuid AS related_contact_id, NULL::uuid AS related_deal_id, NULL::text AS virtual_meeting_url, industry_events.startup_relevance, industry_events.ticket_cost_tier::text AS ticket_cost_tier, industry_events.ticket_cost_min, industry_events.ticket_cost_max, industry_events.website_url AS external_url, industry_events.categories, industry_events.topics, industry_events.created_at, industry_events.updated_at, NULL::timestamp with time zone AS published_at, NULL::timestamp with time zone AS cancelled_at FROM industry_events WHERE industry_events.event_date >= (CURRENT_DATE - '30 days'::interval) OR industry_events.event_date IS NULL);--> statement-breakpoint
CREATE VIEW "hosted_events" WITH (security_invoker = true) AS (SELECT id, startup_id, title, name, description, event_type, status, start_date, end_date, timezone, location_type, location, capacity, budget, ticket_price, health_score, tasks_total, tasks_completed, sponsors_target, sponsors_confirmed, registration_url, registration_deadline, is_public, requires_approval, slug, tags, agenda, cover_image_url, published_at, cancelled_at, organizer_name, organizer_logo_url, industry, target_audience, created_at, updated_at FROM events WHERE event_scope = 'hosted'::event_scope);--> statement-breakpoint
CREATE VIEW "vault"."decrypted_secrets" AS (SELECT id, name, description, secret, convert_from(vault._crypto_aead_det_decrypt(message => decode(secret, 'base64'::text), additional => convert_to(id::text, 'utf8'::name), key_id => 0::bigint, context => '\x7067736f6469756d'::bytea, nonce => nonce), 'utf8'::name) AS decrypted_secret, key_id, nonce, created_at, updated_at FROM vault.secrets s);--> statement-breakpoint
CREATE POLICY "cron_job_policy" ON "cron"."job" AS PERMISSIVE FOR ALL TO public USING ((username = CURRENT_USER));--> statement-breakpoint
CREATE POLICY "cron_job_run_details_policy" ON "cron"."job_run_details" AS PERMISSIVE FOR ALL TO public USING ((username = CURRENT_USER));--> statement-breakpoint
CREATE POLICY "System insert action executions" ON "action_executions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "System update action executions" ON "action_executions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users delete action executions in org" ON "action_executions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users view action executions in org" ON "action_executions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can create activities in their org" ON "activities" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "users can delete own activities in their org" ON "activities" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_in_org(startup_id) AND ((user_id = ( SELECT auth.uid() AS uid)) OR (is_system_generated = true))));--> statement-breakpoint
CREATE POLICY "users can update activities in their org" ON "activities" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id)) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "users can view activities in their org" ON "activities" AS PERMISSIVE FOR SELECT TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Admins delete agent configs" ON "agent_configs" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Admins insert agent configs" ON "agent_configs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Admins update agent configs" ON "agent_configs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))) WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Users view agent configs" ON "agent_configs" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((org_id IS NULL) OR (org_id = ( SELECT user_org_id() AS user_org_id))));--> statement-breakpoint
CREATE POLICY "Users delete ai runs in org" ON "ai_runs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users insert ai runs in org" ON "ai_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users update ai runs in org" ON "ai_runs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id))) WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users view ai runs in org" ON "ai_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "limits_insert" ON "ai_usage_limits" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((org_id IN ( SELECT p.org_id
   FROM profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "limits_select" ON "ai_usage_limits" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((org_id IN ( SELECT p.org_id
   FROM profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "limits_update" ON "ai_usage_limits" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((org_id IN ( SELECT p.org_id
   FROM profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "assumptions_delete_authenticated" ON "assumptions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "assumptions_insert_authenticated" ON "assumptions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "assumptions_select_authenticated" ON "assumptions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "assumptions_update_authenticated" ON "assumptions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users view audit log in org" ON "audit_log" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users can create campaigns" ON "campaigns" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can delete campaigns" ON "campaigns" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can update campaigns" ON "campaigns" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can view own campaigns" ON "campaigns" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users delete own chat facts" ON "chat_facts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users insert chat facts" ON "chat_facts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view own chat facts" ON "chat_facts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users delete own chat messages" ON "chat_messages" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users insert own chat messages" ON "chat_messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users update own chat messages" ON "chat_messages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view own chat messages" ON "chat_messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "System insert chat pending" ON "chat_pending" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users delete own chat pending" ON "chat_pending" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users update own chat pending" ON "chat_pending" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view own chat pending" ON "chat_pending" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users delete own chat sessions" ON "chat_sessions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users insert own chat sessions" ON "chat_sessions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users update own chat sessions" ON "chat_sessions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view own chat sessions" ON "chat_sessions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Authenticated users update communications in org" ON "communications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id)) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users create communications in org" ON "communications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users delete communications in org" ON "communications" AS PERMISSIVE FOR DELETE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view communications in org" ON "communications" AS PERMISSIVE FOR SELECT TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can add competitors for their startups" ON "competitor_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE ((sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text])))))));--> statement-breakpoint
CREATE POLICY "Users can delete competitors for their startups" ON "competitor_profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE ((sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text])))))));--> statement-breakpoint
CREATE POLICY "Users can update competitors for their startups" ON "competitor_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE ((sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text])))))));--> statement-breakpoint
CREATE POLICY "Users can view competitors for their startups" ON "competitor_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE (sm.user_id = ( SELECT auth.uid() AS uid))))));--> statement-breakpoint
CREATE POLICY "Users delete contact tags in org" ON "contact_tags" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id))));--> statement-breakpoint
CREATE POLICY "Users insert contact tags in org" ON "contact_tags" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id))));--> statement-breakpoint
CREATE POLICY "Users update contact tags in org" ON "contact_tags" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id)))) WITH CHECK ((contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id))));--> statement-breakpoint
CREATE POLICY "Users view contact tags in org" ON "contact_tags" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id))));--> statement-breakpoint
CREATE POLICY "Users create contacts in org" ON "contacts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users delete contacts in org" ON "contacts" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users update contacts in org" ON "contacts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL))) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view contacts in org" ON "contacts" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Anyone can view context injection configs" ON "context_injection_configs" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((is_active = true));--> statement-breakpoint
CREATE POLICY "customer_forces_delete_authenticated" ON "customer_forces" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_forces_insert_authenticated" ON "customer_forces" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_forces_select_authenticated" ON "customer_forces" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_forces_update_authenticated" ON "customer_forces" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_segments_delete_authenticated" ON "customer_segments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_segments_insert_authenticated" ON "customer_segments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_segments_select_authenticated" ON "customer_segments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "customer_segments_update_authenticated" ON "customer_segments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can read own recommendations" ON "daily_focus_recommendations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id IN ( SELECT profiles.org_id
           FROM profiles
          WHERE (profiles.id = ( SELECT auth.uid() AS uid)))))));--> statement-breakpoint
CREATE POLICY "dashboard_metrics_cache_insert_org" ON "dashboard_metrics_cache" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (( SELECT startup_in_org(dashboard_metrics_cache.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "dashboard_metrics_cache_select_org" ON "dashboard_metrics_cache" AS PERMISSIVE FOR SELECT TO "authenticated" USING (( SELECT startup_in_org(dashboard_metrics_cache.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "dashboard_metrics_cache_update_org" ON "dashboard_metrics_cache" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (( SELECT startup_in_org(dashboard_metrics_cache.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "Users create deals in org" ON "deals" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users delete deals in org" ON "deals" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users update deals in org" ON "deals" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL))) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view deals in org" ON "deals" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "evidence_delete" ON "decision_evidence" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));--> statement-breakpoint
CREATE POLICY "evidence_insert" ON "decision_evidence" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));--> statement-breakpoint
CREATE POLICY "evidence_select" ON "decision_evidence" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));--> statement-breakpoint
CREATE POLICY "evidence_update" ON "decision_evidence" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))));--> statement-breakpoint
CREATE POLICY "decisions_delete" ON "decisions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "decisions_insert" ON "decisions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "decisions_select" ON "decisions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "decisions_update" ON "decisions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "anyone can view public templates" ON "deck_templates" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_public = true));--> statement-breakpoint
CREATE POLICY "users can create org templates" ON "deck_templates" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (is_public = false)));--> statement-breakpoint
CREATE POLICY "users can delete own org templates" ON "deck_templates" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (created_by = ( SELECT auth.uid() AS uid))));--> statement-breakpoint
CREATE POLICY "users can update own org templates" ON "deck_templates" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (created_by = ( SELECT auth.uid() AS uid)))) WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "users can view org templates" ON "deck_templates" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((org_id IS NOT NULL) AND (org_id = ( SELECT user_org_id() AS user_org_id))));--> statement-breakpoint
CREATE POLICY "Users delete document versions in org" ON "document_versions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id))));--> statement-breakpoint
CREATE POLICY "Users insert document versions in org" ON "document_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id))));--> statement-breakpoint
CREATE POLICY "Users update document versions in org" ON "document_versions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id)))) WITH CHECK ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id))));--> statement-breakpoint
CREATE POLICY "Users view document versions in org" ON "document_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id))));--> statement-breakpoint
CREATE POLICY "Users delete documents in org" ON "documents" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users insert documents in org" ON "documents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users update documents in org" ON "documents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL))) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view documents in org" ON "documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "authenticated can delete event assets" ON "event_assets" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can insert event assets" ON "event_assets" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can select event assets" ON "event_assets" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can update event assets" ON "event_assets" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))) WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can delete event attendees" ON "event_attendees" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can insert event attendees" ON "event_attendees" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can select event attendees" ON "event_attendees" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can update event attendees" ON "event_attendees" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))) WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "Admin users can delete event speakers" ON "event_speakers" AS PERMISSIVE FOR DELETE TO "authenticated" USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Admin users can insert event speakers" ON "event_speakers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Admin users can update event speakers" ON "event_speakers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)) WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Anon users can read event speakers" ON "event_speakers" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can read event speakers" ON "event_speakers" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can delete event venues" ON "event_venues" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can insert event venues" ON "event_venues" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can select event venues" ON "event_venues" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can update event venues" ON "event_venues" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))) WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "anon can view public external events" ON "events" AS PERMISSIVE FOR SELECT TO "anon" USING (((event_scope = 'external'::event_scope) AND (is_public = true)));--> statement-breakpoint
CREATE POLICY "anon can view public hosted events" ON "events" AS PERMISSIVE FOR SELECT TO "anon" USING (((event_scope = 'hosted'::event_scope) AND (is_public = true)));--> statement-breakpoint
CREATE POLICY "authenticated_select_events" ON "events" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_in_org(startup_id) OR (event_scope = 'external'::event_scope)));--> statement-breakpoint
CREATE POLICY "users can create events in their org" ON "events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "users can delete events in their org" ON "events" AS PERMISSIVE FOR DELETE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "users can update events in their org" ON "events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id)) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "experiment_results_delete_authenticated" ON "experiment_results" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiment_results_insert_authenticated" ON "experiment_results" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiment_results_select_authenticated" ON "experiment_results" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiment_results_update_authenticated" ON "experiment_results" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiments_delete_authenticated" ON "experiments" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiments_insert_authenticated" ON "experiments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiments_select_authenticated" ON "experiments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "experiments_update_authenticated" ON "experiments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Anyone can view feature pack routing" ON "feature_pack_routing" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Users delete file uploads in org" ON "file_uploads" AS PERMISSIVE FOR DELETE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users insert file uploads in org" ON "file_uploads" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users update file uploads in org" ON "file_uploads" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id)) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view file uploads in org" ON "file_uploads" AS PERMISSIVE FOR SELECT TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "financial_models_delete_org" ON "financial_models" AS PERMISSIVE FOR DELETE TO "authenticated" USING (( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "financial_models_insert_org" ON "financial_models" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "financial_models_select_org" ON "financial_models" AS PERMISSIVE FOR SELECT TO "authenticated" USING (( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "financial_models_update_org" ON "financial_models" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "Admin users can delete industry events" ON "industry_events" AS PERMISSIVE FOR DELETE TO "authenticated" USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Admin users can insert industry events" ON "industry_events" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Admin users can update industry events" ON "industry_events" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)) WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Anon users can read industry events" ON "industry_events" AS PERMISSIVE FOR SELECT TO "anon" USING (true);--> statement-breakpoint
CREATE POLICY "Authenticated users can read industry events" ON "industry_events" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Anyone can view active industry playbooks" ON "industry_playbooks" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((is_active = true));--> statement-breakpoint
CREATE POLICY "Admins delete integrations" ON "integrations" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Admins insert integrations" ON "integrations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Admins update integrations" ON "integrations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))) WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Users view integrations in org" ON "integrations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "interview_insights_delete_authenticated" ON "interview_insights" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_insights_insert_authenticated" ON "interview_insights" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_insights_select_authenticated" ON "interview_insights" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_insights_update_authenticated" ON "interview_insights" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))) AND (NOT is_locked))) WITH CHECK ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_questions_delete_authenticated" ON "interview_questions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_questions_insert_authenticated" ON "interview_questions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_questions_select_authenticated" ON "interview_questions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interview_questions_update_authenticated" ON "interview_questions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interviews_delete_authenticated" ON "interviews" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interviews_insert_authenticated" ON "interviews" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interviews_select_authenticated" ON "interviews" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "interviews_update_authenticated" ON "interviews" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Authenticated users delete investors in org" ON "investors" AS PERMISSIVE FOR DELETE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Authenticated users insert investors in org" ON "investors" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Authenticated users update investors in org" ON "investors" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id)) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Authenticated users view investors in org" ON "investors" AS PERMISSIVE FOR SELECT TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "jobs_to_be_done_delete_authenticated" ON "jobs_to_be_done" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "jobs_to_be_done_insert_authenticated" ON "jobs_to_be_done" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "jobs_to_be_done_select_authenticated" ON "jobs_to_be_done" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "jobs_to_be_done_update_authenticated" ON "jobs_to_be_done" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))) WITH CHECK ((segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "authenticated users can read knowledge" ON "knowledge_chunks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "service role can manage knowledge" ON "knowledge_chunks" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "authenticated can read knowledge_documents" ON "knowledge_documents" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "service_role can manage knowledge_documents" ON "knowledge_documents" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Users can create knowledge map entries" ON "knowledge_map" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can delete knowledge map entries" ON "knowledge_map" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can update knowledge map entries" ON "knowledge_map" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can view own knowledge map" ON "knowledge_map" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can create canvas versions" ON "lean_canvas_versions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((canvas_id IN ( SELECT lc.id
   FROM (lean_canvases lc
     JOIN startups s ON ((lc.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can delete canvas versions" ON "lean_canvas_versions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((canvas_id IN ( SELECT lc.id
   FROM (lean_canvases lc
     JOIN startups s ON ((lc.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can view own canvas versions" ON "lean_canvas_versions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((canvas_id IN ( SELECT lc.id
   FROM (lean_canvases lc
     JOIN startups s ON ((lc.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "lean_canvases_delete_org" ON "lean_canvases" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "lean_canvases_insert_org" ON "lean_canvases" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "lean_canvases_select_org" ON "lean_canvases" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "lean_canvases_update_org" ON "lean_canvases" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can delete market research for their startups" ON "market_research" AS PERMISSIVE FOR DELETE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can insert market research for their startups" ON "market_research" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can update market research for their startups" ON "market_research" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can view market research for their startups" ON "market_research" AS PERMISSIVE FOR SELECT TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "authenticated can delete messages" ON "messages" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can insert messages" ON "messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can select messages" ON "messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can update messages" ON "messages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))) WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "users can create metric snapshots" ON "metric_snapshots" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can delete metric snapshots" ON "metric_snapshots" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can update metric snapshots" ON "metric_snapshots" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can view startup metric snapshots" ON "metric_snapshots" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users delete own notifications" ON "notifications" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users insert own notifications" ON "notifications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users update own notifications" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view own notifications" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Authenticated users can read active questions" ON "onboarding_questions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((is_active = true));--> statement-breakpoint
CREATE POLICY "Service role has full access" ON "onboarding_questions" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Users can delete opportunity canvas for their startups" ON "opportunity_canvas" AS PERMISSIVE FOR DELETE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can insert opportunity canvas for their startups" ON "opportunity_canvas" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can update opportunity canvas for their startups" ON "opportunity_canvas" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users can view opportunity canvas for their startups" ON "opportunity_canvas" AS PERMISSIVE FOR SELECT TO "authenticated" USING (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Admins delete org memberships" ON "org_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Admins insert org memberships" ON "org_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Admins update org memberships" ON "org_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))) WITH CHECK (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Users view org memberships" ON "org_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((user_id = ( SELECT auth.uid() AS uid)) OR (org_id = ( SELECT user_org_id() AS user_org_id))));--> statement-breakpoint
CREATE POLICY "Admins update organization" ON "organizations" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))) WITH CHECK (((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text]))));--> statement-breakpoint
CREATE POLICY "Owners delete organization" ON "organizations" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = 'owner'::text)));--> statement-breakpoint
CREATE POLICY "Users can create first organization only" ON "organizations" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((( SELECT auth.uid() AS uid) IS NOT NULL) AND (NOT (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.org_id IS NOT NULL)))))));--> statement-breakpoint
CREATE POLICY "Users view own organization" ON "organizations" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users can create slides for accessible decks" ON "pitch_deck_slides" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id))))));--> statement-breakpoint
CREATE POLICY "Users can delete slides for accessible decks" ON "pitch_deck_slides" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id))))));--> statement-breakpoint
CREATE POLICY "Users can update slides for accessible decks" ON "pitch_deck_slides" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id)))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id))))));--> statement-breakpoint
CREATE POLICY "Users can view slides for accessible decks" ON "pitch_deck_slides" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id))))));--> statement-breakpoint
CREATE POLICY "Users can create pitch decks for their startups" ON "pitch_decks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id)));--> statement-breakpoint
CREATE POLICY "Users can delete pitch decks for their startups" ON "pitch_decks" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id)));--> statement-breakpoint
CREATE POLICY "Users can update pitch decks for their startups" ON "pitch_decks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id))) WITH CHECK (((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id)));--> statement-breakpoint
CREATE POLICY "Users can view pitch decks for their startups" ON "pitch_decks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id)));--> statement-breakpoint
CREATE POLICY "delete_own_pivot_logs" ON "pivot_logs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "insert_own_pivot_logs" ON "pivot_logs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "select_own_pivot_logs" ON "pivot_logs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can insert their own startup playbook runs" ON "playbook_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM ((startups s
     JOIN organizations o ON ((s.org_id = o.id)))
     JOIN org_members om ON ((o.id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can update their own startup playbook runs" ON "playbook_runs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM ((startups s
     JOIN organizations o ON ((s.org_id = o.id)))
     JOIN org_members om ON ((o.id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can view their own startup playbook runs" ON "playbook_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM ((startups s
     JOIN organizations o ON ((s.org_id = o.id)))
     JOIN org_members om ON ((o.id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users create own profile" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users delete own profile" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users update own profile" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((id = ( SELECT auth.uid() AS uid))) WITH CHECK ((id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view org member profiles" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((org_id IS NOT NULL) AND (org_id = get_user_org_id())));--> statement-breakpoint
CREATE POLICY "Users view own profile" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users create projects in org" ON "projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users delete projects in org" ON "projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users update projects in org" ON "projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL))) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view projects in org" ON "projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Authenticated users can create prompt pack runs" ON "prompt_pack_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Service role can manage all prompt pack runs" ON "prompt_pack_runs" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Users can view their own prompt pack runs" ON "prompt_pack_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Anyone can view prompt pack steps" ON "prompt_pack_steps" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((EXISTS ( SELECT 1
   FROM prompt_packs
  WHERE ((prompt_packs.id = prompt_pack_steps.pack_id) AND (prompt_packs.is_active = true)))));--> statement-breakpoint
CREATE POLICY "Anyone can view active prompt packs" ON "prompt_packs" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING ((is_active = true));--> statement-breakpoint
CREATE POLICY "Anyone can view prompt template registry" ON "prompt_template_registry" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Users delete own proposed actions" ON "proposed_actions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users insert proposed actions in org" ON "proposed_actions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users update proposed actions in org" ON "proposed_actions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id))) WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users view proposed actions in org" ON "proposed_actions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "share_views_insert_authenticated" ON "share_views" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((link_id IN ( SELECT shareable_links.id
   FROM shareable_links
  WHERE (shareable_links.created_by = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "share_views_insert_service" ON "share_views" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "share_views_select_owner" ON "share_views" AS PERMISSIVE FOR SELECT TO public USING ((link_id IN ( SELECT shareable_links.id
   FROM shareable_links
  WHERE (shareable_links.created_by = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "links_anon_check_status" ON "shareable_links" AS PERMISSIVE FOR SELECT TO "anon" USING ((token = ( SELECT get_share_token() AS get_share_token)));--> statement-breakpoint
CREATE POLICY "links_insert_org" ON "shareable_links" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "links_select_org" ON "shareable_links" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "links_update_org" ON "shareable_links" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "authenticated can delete sponsors" ON "sponsors" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can insert sponsors" ON "sponsors" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can select sponsors" ON "sponsors" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "authenticated can update sponsors" ON "sponsors" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))) WITH CHECK ((event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id))));--> statement-breakpoint
CREATE POLICY "Users can delete own sprint tasks" ON "sprint_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can insert own sprint tasks" ON "sprint_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can read own sprint tasks" ON "sprint_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can update own sprint tasks" ON "sprint_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can create sprints" ON "sprints" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can delete sprints" ON "sprints" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can update sprints" ON "sprints" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Users can view own sprints" ON "sprints" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Authenticated users delete event tasks in org" ON "startup_event_tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id()))))));--> statement-breakpoint
CREATE POLICY "Authenticated users insert event tasks in org" ON "startup_event_tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id()))))));--> statement-breakpoint
CREATE POLICY "Authenticated users update event tasks in org" ON "startup_event_tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id())))))) WITH CHECK ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id()))))));--> statement-breakpoint
CREATE POLICY "Authenticated users view event tasks in org" ON "startup_event_tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id()))))));--> statement-breakpoint
CREATE POLICY "startup_health_scores_insert_org" ON "startup_health_scores" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (( SELECT startup_in_org(startup_health_scores.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "startup_health_scores_select_org" ON "startup_health_scores" AS PERMISSIVE FOR SELECT TO "authenticated" USING (( SELECT startup_in_org(startup_health_scores.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "startup_health_scores_update_org" ON "startup_health_scores" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (( SELECT startup_in_org(startup_health_scores.startup_id) AS startup_in_org));--> statement-breakpoint
CREATE POLICY "Owners can delete or self-remove" ON "startup_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE ((sm.startup_id = startup_members.startup_id) AND (sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = 'owner'::text)))) OR (( SELECT auth.uid() AS uid) = user_id)));--> statement-breakpoint
CREATE POLICY "Owners can update members" ON "startup_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE ((sm.startup_id = startup_members.startup_id) AND (sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = 'owner'::text)))));--> statement-breakpoint
CREATE POLICY "Owners/admins can insert members" ON "startup_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE ((sm.startup_id = startup_members.startup_id) AND (sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text]))))) OR (NOT (EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE (sm.startup_id = startup_members.startup_id))))));--> statement-breakpoint
CREATE POLICY "Users can view co-members" ON "startup_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE (sm.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can view their own memberships" ON "startup_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "Users create startups in org" ON "startups" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users delete startups in org" ON "startups" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users update startups in org" ON "startups" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (deleted_at IS NULL))) WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "Users view startups in org" ON "startups" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((org_id = ( SELECT user_org_id() AS user_org_id)) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users create tasks in org" ON "tasks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users delete tasks in org" ON "tasks" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users update tasks in org" ON "tasks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL))) WITH CHECK (startup_in_org(startup_id));--> statement-breakpoint
CREATE POLICY "Users view tasks in org" ON "tasks" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_in_org(startup_id) AND (deleted_at IS NULL)));--> statement-breakpoint
CREATE POLICY "Users can delete own event tracking" ON "user_event_tracking" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "Users can insert own event tracking" ON "user_event_tracking" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "Users can update own event tracking" ON "user_event_tracking" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id)) WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "Users can view own event tracking" ON "user_event_tracking" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "Admins can manage all roles" ON "user_roles" AS PERMISSIVE FOR ALL TO "authenticated" USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)) WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));--> statement-breakpoint
CREATE POLICY "Users can view own roles" ON "user_roles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "Service role can insert agent runs" ON "validator_agent_runs" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Service role can update agent runs" ON "validator_agent_runs" AS PERMISSIVE FOR UPDATE TO "service_role" USING (true);--> statement-breakpoint
CREATE POLICY "Users can view own session agent runs" ON "validator_agent_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "reports_public_read_via_share_token" ON "validator_reports" AS PERMISSIVE FOR SELECT TO "anon" USING ((EXISTS ( SELECT 1
   FROM shareable_links sl
  WHERE ((sl.resource_type = 'validation_report'::text) AND (sl.resource_id = validator_reports.id) AND (sl.revoked_at IS NULL) AND (sl.expires_at > now()) AND (sl.token = ( SELECT get_share_token() AS get_share_token))))));--> statement-breakpoint
CREATE POLICY "Users can insert reports via their sessions" ON "validator_reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can view reports from their validator sessions" ON "validator_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Service role can manage validator_runs" ON "validator_runs" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Users can insert runs to their sessions" ON "validator_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can view runs from their sessions" ON "validator_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users can create their own sessions" ON "validator_sessions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users can delete their own sessions" ON "validator_sessions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users can update their own sessions" ON "validator_sessions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users can view their own sessions" ON "validator_sessions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "reviews_delete" ON "weekly_reviews" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "reviews_insert" ON "weekly_reviews" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "reviews_select" ON "weekly_reviews" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "reviews_update" ON "weekly_reviews" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users insert wizard extractions" ON "wizard_extractions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((session_id IN ( SELECT wizard_sessions.id
   FROM wizard_sessions
  WHERE (wizard_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users view own wizard extractions" ON "wizard_extractions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((session_id IN ( SELECT wizard_sessions.id
   FROM wizard_sessions
  WHERE (wizard_sessions.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "Users delete own wizard sessions" ON "wizard_sessions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users insert own wizard sessions" ON "wizard_sessions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users update own wizard sessions" ON "wizard_sessions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid))) WITH CHECK ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "Users view own wizard sessions" ON "wizard_sessions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((user_id = ( SELECT auth.uid() AS uid)));--> statement-breakpoint
CREATE POLICY "users can create workflow actions" ON "workflow_actions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can delete workflow actions" ON "workflow_actions" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can update workflow actions" ON "workflow_actions" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can view workflow actions" ON "workflow_actions" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "Service role full access to workflow_activity_log" ON "workflow_activity_log" AS PERMISSIVE FOR ALL TO "service_role" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Users can view workflow activity for their startups" ON "workflow_activity_log" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((org_id IN ( SELECT om.org_id
   FROM org_members om
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((s.org_id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))));--> statement-breakpoint
CREATE POLICY "users can create queue items" ON "workflow_queue" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can delete queue items" ON "workflow_queue" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can update queue items" ON "workflow_queue" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can view workflow queue" ON "workflow_queue" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can create workflow runs" ON "workflow_runs" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can delete workflow runs" ON "workflow_runs" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can update workflow runs" ON "workflow_runs" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can view workflow runs" ON "workflow_runs" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can create workflow triggers" ON "workflow_triggers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can delete workflow triggers" ON "workflow_triggers" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can update workflow triggers" ON "workflow_triggers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))) WITH CHECK ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can view workflow triggers" ON "workflow_triggers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id)))));--> statement-breakpoint
CREATE POLICY "users can create org workflows" ON "workflows" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "users can delete org workflows" ON "workflows" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "users can update org workflows" ON "workflows" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id))) WITH CHECK ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "users can view org workflows" ON "workflows" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((org_id = ( SELECT user_org_id() AS user_org_id)));--> statement-breakpoint
CREATE POLICY "authenticated_insert_realtime" ON "realtime"."messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (can_access_realtime_channel(topic));--> statement-breakpoint
CREATE POLICY "authenticated_select_realtime" ON "realtime"."messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING (can_access_realtime_channel(topic));--> statement-breakpoint
CREATE POLICY "Anyone can read avatars" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO public USING ((bucket_id = 'avatars'::text));--> statement-breakpoint
CREATE POLICY "Org members can delete documents" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can delete pitch exports" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can delete startup assets" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can read documents" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can read pitch exports" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can read startup assets" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can update documents" ON "storage"."objects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can update pitch exports" ON "storage"."objects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can update startup assets" ON "storage"."objects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can upload documents" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can upload pitch exports" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Org members can upload startup assets" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text)));--> statement-breakpoint
CREATE POLICY "Users can delete own avatar" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));--> statement-breakpoint
CREATE POLICY "Users can update own avatar" ON "storage"."objects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));--> statement-breakpoint
CREATE POLICY "Users can upload own avatar" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));
*/