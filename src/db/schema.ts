import { pgSchema, pgEnum, pgTable, uuid, text, integer, bigint, varchar, bigserial, customType, timestamp, jsonb, date, numeric, json, boolean, inet, vector, smallint, index, uniqueIndex, foreignKey, primaryKey, unique, check, pgPolicy, pgView, pgMaterializedView, doublePrecision } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const auth = pgSchema("auth");
export const cron = pgSchema("cron");
export const extensions = pgSchema("extensions");
export const graphql = pgSchema("graphql");
export const graphqlPublic = pgSchema("graphql_public");
export const net = pgSchema("net");
export const pgbouncer = pgSchema("pgbouncer");
export const realtime = pgSchema("realtime");
export const storage = pgSchema("storage");
export const supabaseMigrations = pgSchema("supabase_migrations");
export const vault = pgSchema("vault");
export const factorTypeInAuth = auth.enum("factor_type", ["totp", "webauthn", "phone"])
export const factorStatusInAuth = auth.enum("factor_status", ["unverified", "verified"])
export const aalLevelInAuth = auth.enum("aal_level", ["aal1", "aal2", "aal3"])
export const codeChallengeMethodInAuth = auth.enum("code_challenge_method", ["s256", "plain"])
export const oneTimeTokenTypeInAuth = auth.enum("one_time_token_type", ["confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token"])
export const oauthRegistrationTypeInAuth = auth.enum("oauth_registration_type", ["dynamic", "manual"])
export const oauthAuthorizationStatusInAuth = auth.enum("oauth_authorization_status", ["pending", "approved", "denied", "expired"])
export const oauthResponseTypeInAuth = auth.enum("oauth_response_type", ["code"])
export const oauthClientTypeInAuth = auth.enum("oauth_client_type", ["public", "confidential"])
export const equalityOpInRealtime = realtime.enum("equality_op", ["eq", "neq", "lt", "lte", "gt", "gte", "in"])
export const actionInRealtime = realtime.enum("action", ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "ERROR"])
export const buckettypeInStorage = storage.enum("buckettype", ["STANDARD", "ANALYTICS", "VECTOR"])
export const appRole = pgEnum("app_role", ["admin", "moderator", "user"])
export const pitchDeckStatus = pgEnum("pitch_deck_status", ["draft", "in_progress", "review", "final", "archived", "generating"])
export const slideType = pgEnum("slide_type", ["title", "problem", "solution", "product", "market", "business_model", "traction", "competition", "team", "financials", "ask", "contact", "custom"])
export const eventType = pgEnum("event_type", ["meeting", "deadline", "reminder", "milestone", "call", "demo", "pitch", "funding_round", "other", "demo_day", "pitch_night", "networking", "workshop", "conference", "meetup", "webinar", "hackathon"])
export const eventStatus = pgEnum("event_status", ["scheduled", "in_progress", "completed", "cancelled", "rescheduled"])
export const activityType = pgEnum("activity_type", ["task_created", "task_updated", "task_completed", "task_deleted", "task_assigned", "deal_created", "deal_updated", "deal_stage_changed", "deal_won", "deal_lost", "contact_created", "contact_updated", "contact_deleted", "email_sent", "call_logged", "meeting_scheduled", "project_created", "project_updated", "project_completed", "milestone_reached", "document_created", "document_updated", "document_shared", "deck_created", "deck_updated", "deck_shared", "deck_exported", "ai_insight_generated", "ai_task_suggested", "ai_analysis_completed", "ai_extraction_completed", "user_joined", "user_left", "settings_changed", "other"])
export const templateCategory = pgEnum("template_category", ["startup", "series_a", "series_b", "growth", "enterprise", "saas", "marketplace", "fintech", "healthtech", "general", "custom"])
export const startupEventType = pgEnum("startup_event_type", ["demo_day", "pitch_night", "networking", "workshop", "investor_meetup", "founder_dinner", "hackathon", "conference", "webinar", "other"])
export const startupEventStatus = pgEnum("startup_event_status", ["draft", "planning", "confirmed", "live", "completed", "cancelled", "postponed"])
export const eventLocationType = pgEnum("event_location_type", ["in_person", "virtual", "hybrid"])
export const sponsorTier = pgEnum("sponsor_tier", ["platinum", "gold", "silver", "bronze", "in_kind", "media", "community"])
export const sponsorStatus = pgEnum("sponsor_status", ["prospect", "researching", "contacted", "negotiating", "interested", "confirmed", "declined", "cancelled"])
export const venueStatus = pgEnum("venue_status", ["researching", "shortlisted", "contacted", "visiting", "negotiating", "booked", "cancelled", "rejected"])
export const rsvpStatus = pgEnum("rsvp_status", ["invited", "pending", "registered", "confirmed", "waitlist", "declined", "cancelled", "no_show"])
export const attendeeType = pgEnum("attendee_type", ["general", "vip", "speaker", "panelist", "sponsor_rep", "press", "investor", "founder", "mentor", "staff", "volunteer"])
export const messageDirection = pgEnum("message_direction", ["inbound", "outbound"])
export const messageType = pgEnum("message_type", ["text", "template", "broadcast", "image", "document", "location", "contact", "interactive"])
export const messageStatus = pgEnum("message_status", ["pending", "sent", "delivered", "read", "failed", "cancelled"])
export const messageChannel = pgEnum("message_channel", ["whatsapp", "sms", "email", "in_app"])
export const eventAssetType = pgEnum("event_asset_type", ["social_post", "email", "graphic", "banner", "flyer", "press_release", "blog_post", "video", "landing_page", "registration_form", "agenda", "speaker_bio", "sponsor_logo_pack", "photo", "other"])
export const assetPlatform = pgEnum("asset_platform", ["twitter", "linkedin", "instagram", "facebook", "tiktok", "youtube", "email", "website", "whatsapp", "press", "internal", "other"])
export const assetStatus = pgEnum("asset_status", ["draft", "review", "approved", "scheduled", "published", "failed", "archived"])
export const eventTaskCategory = pgEnum("event_task_category", ["planning", "venue", "sponsors", "speakers", "marketing", "registration", "logistics", "catering", "av_tech", "content", "communications", "post_event", "other"])
export const eventScope = pgEnum("event_scope", ["internal", "hosted", "external"])
export const attendingStatus = pgEnum("attending_status", ["interested", "registered", "attending", "attended", "not_attending"])
export const eventFormat = pgEnum("event_format", ["in_person", "virtual", "hybrid"])
export const eventCategory = pgEnum("event_category", ["research", "industry", "startup_vc", "trade_show", "enterprise", "government_policy", "developer"])
export const ticketCostTier = pgEnum("ticket_cost_tier", ["free", "low", "medium", "high", "premium"])
export const mediaPassStatus = pgEnum("media_pass_status", ["yes", "no", "unclear"])
export const questionType = pgEnum("question_type", ["multiple_choice", "multi_select", "text", "number"])
export const packCategory = pgEnum("pack_category", ["ideation", "validation", "market", "canvas", "pitch", "gtm", "pricing", "hiring", "funding"])
export const modelPreference = pgEnum("model_preference", ["gemini", "claude", "claude-sonnet", "auto"])
export const runStatus = pgEnum("run_status", ["pending", "running", "completed", "failed", "cancelled"])
export const playbookStatus = pgEnum("playbook_status", ["suggested", "active", "in_progress", "completed", "skipped"])
export const validationVerdict = pgEnum("validation_verdict", ["go", "conditional", "pivot", "no_go"])
export const featureContext = pgEnum("feature_context", ["onboarding", "lean_canvas", "pitch_deck", "tasks", "chatbot", "validator", "gtm_planning", "fundraising"])
export const fundingStage = pgEnum("funding_stage", ["pre_seed", "seed", "series_a", "series_b", "growth"])
export const coachPhase = pgEnum("coach_phase", ["onboarding", "assessment", "constraint", "campaign_setup", "sprint_planning", "sprint_execution", "cycle_review"])
export const constraintType = pgEnum("constraint_type", ["acquisition", "monetization", "retention", "scalability"])
export const pdcaStep = pgEnum("pdca_step", ["plan", "do", "check", "act"])
export const assumptionStatus = pgEnum("assumption_status", ["untested", "testing", "validated", "invalidated", "obsolete"])
export const assumptionSource = pgEnum("assumption_source", ["problem", "solution", "unique_value_proposition", "unfair_advantage", "customer_segments", "channels", "revenue_streams", "cost_structure", "key_metrics"])
export const experimentType = pgEnum("experiment_type", ["customer_interview", "survey", "landing_page", "prototype_test", "concierge", "wizard_of_oz", "smoke_test", "a_b_test", "fake_door", "other"])
export const experimentStatus = pgEnum("experiment_status", ["designed", "recruiting", "running", "collecting", "analyzing", "completed", "paused", "cancelled"])
export const segmentType = pgEnum("segment_type", ["early_adopter", "mainstream", "enterprise", "smb", "consumer", "prosumer", "developer", "other"])
export const forceType = pgEnum("force_type", ["push", "pull", "inertia", "friction"])
export const jobType = pgEnum("job_type", ["functional", "emotional", "social"])
export const interviewStatus = pgEnum("interview_status", ["scheduled", "completed", "transcribed", "analyzed", "cancelled", "no_show"])
export const interviewType = pgEnum("interview_type", ["problem_discovery", "solution_validation", "usability_test", "customer_development", "sales_call", "support_call", "other"])
export const insightType = pgEnum("insight_type", ["pain_point", "desired_outcome", "current_behavior", "switching_trigger", "objection", "feature_request", "competitor_mention", "pricing_feedback", "aha_moment", "job_to_be_done", "quote", "other"])
export const workflowStatus = pgEnum("workflow_status", ["draft", "active", "paused", "archived"])
export const triggerType = pgEnum("trigger_type", ["event", "schedule", "webhook", "manual"])
export const actionType = pgEnum("action_type", ["create_task", "send_notification", "update_record", "call_api", "send_email", "ai_generate", "delay", "condition"])
export const knowledgeSourceType = pgEnum("knowledge_source_type", ["deloitte", "bcg", "pwc", "mckinsey", "cb_insights", "gartner", "forrester", "harvard_business_review", "mit_sloan", "yc_research", "a16z", "sequoia", "internal", "other"])
export const confidenceLevel = pgEnum("confidence_level", ["high", "medium", "low"])
export const requestStatusInNet = net.enum("request_status", ["PENDING", "SUCCESS", "ERROR"])

export const jobidSeqInCron = cron.sequence("jobid_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const runidSeqInCron = cron.sequence("runid_seq", { startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false, })
export const seqSchemaVersionInGraphql = graphql.sequence("seq_schema_version", { startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: true, })

export const auditLogEntriesInAuth = auth.table.withRLS("audit_log_entries", {
	instanceId: uuid("instance_id"),
	id: uuid().primaryKey(),
	payload: json(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	ipAddress: varchar("ip_address", { length: 64 }).default("").notNull(),
}, (table) => [
	index("audit_logs_instance_id_idx").using("btree", table.instanceId.asc().nullsLast()),
]);

export const customOauthProvidersInAuth = auth.table("custom_oauth_providers", {
	id: uuid().defaultRandom().primaryKey(),
	providerType: text("provider_type").notNull(),
	identifier: text().notNull(),
	name: text().notNull(),
	clientId: text("client_id").notNull(),
	clientSecret: text("client_secret").notNull(),
	acceptableClientIds: text("acceptable_client_ids").array().default([]).notNull(),
	scopes: text().array().default([]).notNull(),
	pkceEnabled: boolean("pkce_enabled").default(true).notNull(),
	attributeMapping: jsonb("attribute_mapping").default({}).notNull(),
	authorizationParams: jsonb("authorization_params").default({}).notNull(),
	enabled: boolean().default(true).notNull(),
	emailOptional: boolean("email_optional").default(false).notNull(),
	issuer: text(),
	discoveryUrl: text("discovery_url"),
	skipNonceCheck: boolean("skip_nonce_check").default(false).notNull(),
	cachedDiscovery: jsonb("cached_discovery"),
	discoveryCachedAt: timestamp("discovery_cached_at", { withTimezone: true }),
	authorizationUrl: text("authorization_url"),
	tokenUrl: text("token_url"),
	userinfoUrl: text("userinfo_url"),
	jwksUri: text("jwks_uri"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("custom_oauth_providers_created_at_idx").using("btree", table.createdAt.asc().nullsLast()),
	index("custom_oauth_providers_enabled_idx").using("btree", table.enabled.asc().nullsLast()),
	index("custom_oauth_providers_identifier_idx").using("btree", table.identifier.asc().nullsLast()),
	index("custom_oauth_providers_provider_type_idx").using("btree", table.providerType.asc().nullsLast()),
	unique("custom_oauth_providers_identifier_key").on(table.identifier),check("custom_oauth_providers_authorization_url_https", sql`((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))`),check("custom_oauth_providers_authorization_url_length", sql`((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))`),check("custom_oauth_providers_client_id_length", sql`((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))`),check("custom_oauth_providers_discovery_url_length", sql`((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))`),check("custom_oauth_providers_identifier_format", sql`(identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)`),check("custom_oauth_providers_issuer_length", sql`((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))`),check("custom_oauth_providers_jwks_uri_https", sql`((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))`),check("custom_oauth_providers_jwks_uri_length", sql`((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))`),check("custom_oauth_providers_name_length", sql`((char_length(name) >= 1) AND (char_length(name) <= 100))`),check("custom_oauth_providers_oauth2_requires_endpoints", sql`((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))`),check("custom_oauth_providers_oidc_discovery_url_https", sql`((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))`),check("custom_oauth_providers_oidc_issuer_https", sql`((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))`),check("custom_oauth_providers_oidc_requires_issuer", sql`((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))`),check("custom_oauth_providers_provider_type_check", sql`(provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))`),check("custom_oauth_providers_token_url_https", sql`((token_url IS NULL) OR (token_url ~~ 'https://%'::text))`),check("custom_oauth_providers_token_url_length", sql`((token_url IS NULL) OR (char_length(token_url) <= 2048))`),check("custom_oauth_providers_userinfo_url_https", sql`((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))`),check("custom_oauth_providers_userinfo_url_length", sql`((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048))`),]);

export const flowStateInAuth = auth.table.withRLS("flow_state", {
	id: uuid().primaryKey(),
	userId: uuid("user_id"),
	authCode: text("auth_code"),
	codeChallengeMethod: codeChallengeMethodInAuth("code_challenge_method"),
	codeChallenge: text("code_challenge"),
	providerType: text("provider_type").notNull(),
	providerAccessToken: text("provider_access_token"),
	providerRefreshToken: text("provider_refresh_token"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	authenticationMethod: text("authentication_method").notNull(),
	authCodeIssuedAt: timestamp("auth_code_issued_at", { withTimezone: true }),
	inviteToken: text("invite_token"),
	referrer: text(),
	oauthClientStateId: uuid("oauth_client_state_id"),
	linkingTargetId: uuid("linking_target_id"),
	emailOptional: boolean("email_optional").default(false).notNull(),
}, (table) => [
	index("flow_state_created_at_idx").using("btree", table.createdAt.desc().nullsFirst()),
	index("idx_auth_code").using("btree", table.authCode.asc().nullsLast()),
	index("idx_user_id_auth_method").using("btree", table.userId.asc().nullsLast(), table.authenticationMethod.asc().nullsLast()),
]);

export const identitiesInAuth = auth.table.withRLS("identities", {
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	identityData: jsonb("identity_data").notNull(),
	provider: text().notNull(),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	email: text().generatedAlwaysAs(sql`lower((identity_data ->> 'email'::text))`),
	id: uuid().defaultRandom().primaryKey(),
}, (table) => [
	index("identities_email_idx").using("btree", table.email.asc().nullsLast().op("btree")),
	index("identities_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	unique("identities_provider_id_provider_unique").on(table.providerId, table.provider),]);

export const instancesInAuth = auth.table.withRLS("instances", {
	id: uuid().primaryKey(),
	uuid: uuid(),
	rawBaseConfig: text("raw_base_config"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const mfaAmrClaimsInAuth = auth.table.withRLS("mfa_amr_claims", {
	sessionId: uuid("session_id").notNull().references(() => sessionsInAuth.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	authenticationMethod: text("authentication_method").notNull(),
	id: uuid().primaryKey(),
}, (table) => [
	unique("mfa_amr_claims_session_id_authentication_method_pkey").on(table.sessionId, table.authenticationMethod),]);

export const mfaChallengesInAuth = auth.table.withRLS("mfa_challenges", {
	id: uuid().primaryKey(),
	factorId: uuid("factor_id").notNull().references(() => mfaFactorsInAuth.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	verifiedAt: timestamp("verified_at", { withTimezone: true }),
	ipAddress: inet("ip_address").notNull(),
	otpCode: text("otp_code"),
	webAuthnSessionData: jsonb("web_authn_session_data"),
}, (table) => [
	index("mfa_challenge_created_at_idx").using("btree", table.createdAt.desc().nullsFirst()),
]);

export const mfaFactorsInAuth = auth.table.withRLS("mfa_factors", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	friendlyName: text("friendly_name"),
	factorType: factorTypeInAuth("factor_type").notNull(),
	status: factorStatusInAuth().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	secret: text(),
	phone: text(),
	lastChallengedAt: timestamp("last_challenged_at", { withTimezone: true }),
	webAuthnCredential: jsonb("web_authn_credential"),
	webAuthnAaguid: uuid("web_authn_aaguid"),
	lastWebauthnChallengeData: jsonb("last_webauthn_challenge_data"),
}, (table) => [
	index("factor_id_created_at_idx").using("btree", table.userId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
	uniqueIndex("mfa_factors_user_friendly_name_unique").using("btree", table.friendlyName.asc().nullsLast(), table.userId.asc().nullsLast()).where(sql`(TRIM(BOTH FROM friendly_name) <> ''::text)`),
	index("mfa_factors_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	uniqueIndex("unique_phone_factor_per_user").using("btree", table.userId.asc().nullsLast(), table.phone.asc().nullsLast()),
	unique("mfa_factors_last_challenged_at_key").on(table.lastChallengedAt),]);

export const oauthAuthorizationsInAuth = auth.table("oauth_authorizations", {
	id: uuid().primaryKey(),
	authorizationId: text("authorization_id").notNull(),
	clientId: uuid("client_id").notNull().references(() => oauthClientsInAuth.id, { onDelete: "cascade" } ),
	userId: uuid("user_id").references(() => usersInAuth.id, { onDelete: "cascade" } ),
	redirectUri: text("redirect_uri").notNull(),
	scope: text().notNull(),
	state: text(),
	resource: text(),
	codeChallenge: text("code_challenge"),
	codeChallengeMethod: codeChallengeMethodInAuth("code_challenge_method"),
	responseType: oauthResponseTypeInAuth("response_type").default("code").notNull(),
	status: oauthAuthorizationStatusInAuth().default("pending").notNull(),
	authorizationCode: text("authorization_code"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`(now() + '00:03:00'::interval)`).notNull(),
	approvedAt: timestamp("approved_at", { withTimezone: true }),
	nonce: text(),
}, (table) => [
	index("oauth_auth_pending_exp_idx").using("btree", table.expiresAt.asc().nullsLast()).where(sql`(status = 'pending'::auth.oauth_authorization_status)`),
	unique("oauth_authorizations_authorization_code_key").on(table.authorizationCode),	unique("oauth_authorizations_authorization_id_key").on(table.authorizationId),check("oauth_authorizations_authorization_code_length", sql`(char_length(authorization_code) <= 255)`),check("oauth_authorizations_code_challenge_length", sql`(char_length(code_challenge) <= 128)`),check("oauth_authorizations_expires_at_future", sql`(expires_at > created_at)`),check("oauth_authorizations_nonce_length", sql`(char_length(nonce) <= 255)`),check("oauth_authorizations_redirect_uri_length", sql`(char_length(redirect_uri) <= 2048)`),check("oauth_authorizations_resource_length", sql`(char_length(resource) <= 2048)`),check("oauth_authorizations_scope_length", sql`(char_length(scope) <= 4096)`),check("oauth_authorizations_state_length", sql`(char_length(state) <= 4096)`),]);

export const oauthClientStatesInAuth = auth.table("oauth_client_states", {
	id: uuid().primaryKey(),
	providerType: text("provider_type").notNull(),
	codeVerifier: text("code_verifier"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
}, (table) => [
	index("idx_oauth_client_states_created_at").using("btree", table.createdAt.asc().nullsLast()),
]);

export const oauthClientsInAuth = auth.table("oauth_clients", {
	id: uuid().primaryKey(),
	clientSecretHash: text("client_secret_hash"),
	registrationType: oauthRegistrationTypeInAuth("registration_type").notNull(),
	redirectUris: text("redirect_uris").notNull(),
	grantTypes: text("grant_types").notNull(),
	clientName: text("client_name"),
	clientUri: text("client_uri"),
	logoUri: text("logo_uri"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
	clientType: oauthClientTypeInAuth("client_type").default("confidential").notNull(),
	tokenEndpointAuthMethod: text("token_endpoint_auth_method").notNull(),
}, (table) => [
	index("oauth_clients_deleted_at_idx").using("btree", table.deletedAt.asc().nullsLast()),
check("oauth_clients_client_name_length", sql`(char_length(client_name) <= 1024)`),check("oauth_clients_client_uri_length", sql`(char_length(client_uri) <= 2048)`),check("oauth_clients_logo_uri_length", sql`(char_length(logo_uri) <= 2048)`),check("oauth_clients_token_endpoint_auth_method_check", sql`(token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text]))`),]);

export const oauthConsentsInAuth = auth.table("oauth_consents", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	clientId: uuid("client_id").notNull().references(() => oauthClientsInAuth.id, { onDelete: "cascade" } ),
	scopes: text().notNull(),
	grantedAt: timestamp("granted_at", { withTimezone: true }).default(sql`now()`).notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true }),
}, (table) => [
	index("oauth_consents_active_client_idx").using("btree", table.clientId.asc().nullsLast()).where(sql`(revoked_at IS NULL)`),
	index("oauth_consents_active_user_client_idx").using("btree", table.userId.asc().nullsLast(), table.clientId.asc().nullsLast()).where(sql`(revoked_at IS NULL)`),
	index("oauth_consents_user_order_idx").using("btree", table.userId.asc().nullsLast(), table.grantedAt.desc().nullsFirst()),
	unique("oauth_consents_user_client_unique").on(table.userId, table.clientId),check("oauth_consents_revoked_after_granted", sql`((revoked_at IS NULL) OR (revoked_at >= granted_at))`),check("oauth_consents_scopes_length", sql`(char_length(scopes) <= 2048)`),check("oauth_consents_scopes_not_empty", sql`(char_length(TRIM(BOTH FROM scopes)) > 0)`),]);

export const oneTimeTokensInAuth = auth.table.withRLS("one_time_tokens", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	tokenType: oneTimeTokenTypeInAuth("token_type").notNull(),
	tokenHash: text("token_hash").notNull(),
	relatesTo: text("relates_to").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => [
	index("one_time_tokens_relates_to_hash_idx").using("hash", table.relatesTo.asc().nullsLast()),
	index("one_time_tokens_token_hash_hash_idx").using("hash", table.tokenHash.asc().nullsLast()),
	uniqueIndex("one_time_tokens_user_id_token_type_key").using("btree", table.userId.asc().nullsLast(), table.tokenType.asc().nullsLast()),
check("one_time_tokens_token_hash_check", sql`(char_length(token_hash) > 0)`),]);

export const refreshTokensInAuth = auth.table.withRLS("refresh_tokens", {
	instanceId: uuid("instance_id"),
	id: bigserial({ mode: 'number' }).primaryKey(),
	token: varchar({ length: 255 }),
	userId: varchar("user_id", { length: 255 }),
	revoked: boolean(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	parent: varchar({ length: 255 }),
	sessionId: uuid("session_id").references(() => sessionsInAuth.id, { onDelete: "cascade" } ),
}, (table) => [
	index("refresh_tokens_instance_id_idx").using("btree", table.instanceId.asc().nullsLast()),
	index("refresh_tokens_instance_id_user_id_idx").using("btree", table.instanceId.asc().nullsLast(), table.userId.asc().nullsLast()),
	index("refresh_tokens_parent_idx").using("btree", table.parent.asc().nullsLast()),
	index("refresh_tokens_session_id_revoked_idx").using("btree", table.sessionId.asc().nullsLast(), table.revoked.asc().nullsLast()),
	index("refresh_tokens_updated_at_idx").using("btree", table.updatedAt.desc().nullsFirst()),
	unique("refresh_tokens_token_unique").on(table.token),]);

export const samlProvidersInAuth = auth.table.withRLS("saml_providers", {
	id: uuid().primaryKey(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProvidersInAuth.id, { onDelete: "cascade" } ),
	entityId: text("entity_id").notNull(),
	metadataXml: text("metadata_xml").notNull(),
	metadataUrl: text("metadata_url"),
	attributeMapping: jsonb("attribute_mapping"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	nameIdFormat: text("name_id_format"),
}, (table) => [
	index("saml_providers_sso_provider_id_idx").using("btree", table.ssoProviderId.asc().nullsLast()),
	unique("saml_providers_entity_id_key").on(table.entityId),check("entity_id not empty", sql`(char_length(entity_id) > 0)`),check("metadata_url not empty", sql`((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))`),check("metadata_xml not empty", sql`(char_length(metadata_xml) > 0)`),]);

export const samlRelayStatesInAuth = auth.table.withRLS("saml_relay_states", {
	id: uuid().primaryKey(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProvidersInAuth.id, { onDelete: "cascade" } ),
	requestId: text("request_id").notNull(),
	forEmail: text("for_email"),
	redirectTo: text("redirect_to"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	flowStateId: uuid("flow_state_id").references(() => flowStateInAuth.id, { onDelete: "cascade" } ),
}, (table) => [
	index("saml_relay_states_created_at_idx").using("btree", table.createdAt.desc().nullsFirst()),
	index("saml_relay_states_for_email_idx").using("btree", table.forEmail.asc().nullsLast()),
	index("saml_relay_states_sso_provider_id_idx").using("btree", table.ssoProviderId.asc().nullsLast()),
check("request_id not empty", sql`(char_length(request_id) > 0)`),]);

export const schemaMigrationsInAuth = auth.table.withRLS("schema_migrations", {
	version: varchar({ length: 255 }).primaryKey(),
});

export const sessionsInAuth = auth.table.withRLS("sessions", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	factorId: uuid("factor_id"),
	aal: aalLevelInAuth(),
	notAfter: timestamp("not_after", { withTimezone: true }),
	refreshedAt: timestamp("refreshed_at"),
	userAgent: text("user_agent"),
	ip: inet(),
	tag: text(),
	oauthClientId: uuid("oauth_client_id").references(() => oauthClientsInAuth.id, { onDelete: "cascade" } ),
	refreshTokenHmacKey: text("refresh_token_hmac_key"),
	refreshTokenCounter: bigint("refresh_token_counter", { mode: 'number' }),
	scopes: text(),
}, (table) => [
	index("sessions_not_after_idx").using("btree", table.notAfter.desc().nullsFirst()),
	index("sessions_oauth_client_id_idx").using("btree", table.oauthClientId.asc().nullsLast()),
	index("sessions_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	index("user_id_created_at_idx").using("btree", table.userId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
check("sessions_scopes_length", sql`(char_length(scopes) <= 4096)`),]);

export const ssoDomainsInAuth = auth.table.withRLS("sso_domains", {
	id: uuid().primaryKey(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProvidersInAuth.id, { onDelete: "cascade" } ),
	domain: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	uniqueIndex("sso_domains_domain_idx").using("btree", sql`true`),
	index("sso_domains_sso_provider_id_idx").using("btree", table.ssoProviderId.asc().nullsLast()),
check("domain not empty", sql`(char_length(domain) > 0)`),]);

export const ssoProvidersInAuth = auth.table.withRLS("sso_providers", {
	id: uuid().primaryKey(),
	resourceId: text("resource_id"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	disabled: boolean(),
}, (table) => [
	uniqueIndex("sso_providers_resource_id_idx").using("btree", sql`true`),
	index("sso_providers_resource_id_pattern_idx").using("btree", table.resourceId.asc().nullsLast().op("btree")),
check("resource_id not empty", sql`((resource_id = NULL::text) OR (char_length(resource_id) > 0))`),]);

export const usersInAuth = auth.table.withRLS("users", {
	instanceId: uuid("instance_id"),
	id: uuid().primaryKey(),
	aud: varchar({ length: 255 }),
	role: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	encryptedPassword: varchar("encrypted_password", { length: 255 }),
	emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
	invitedAt: timestamp("invited_at", { withTimezone: true }),
	confirmationToken: varchar("confirmation_token", { length: 255 }),
	confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
	recoveryToken: varchar("recovery_token", { length: 255 }),
	recoverySentAt: timestamp("recovery_sent_at", { withTimezone: true }),
	emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
	emailChange: varchar("email_change", { length: 255 }),
	emailChangeSentAt: timestamp("email_change_sent_at", { withTimezone: true }),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
	rawAppMetaData: jsonb("raw_app_meta_data"),
	rawUserMetaData: jsonb("raw_user_meta_data"),
	isSuperAdmin: boolean("is_super_admin"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	phone: text().default(sql`NULL`),
	phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true }),
	phoneChange: text("phone_change").default(""),
	phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(""),
	phoneChangeSentAt: timestamp("phone_change_sent_at", { withTimezone: true }),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true }).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
	emailChangeTokenCurrent: varchar("email_change_token_current", { length: 255 }).default(""),
	emailChangeConfirmStatus: smallint("email_change_confirm_status").default(0),
	bannedUntil: timestamp("banned_until", { withTimezone: true }),
	reauthenticationToken: varchar("reauthentication_token", { length: 255 }).default(""),
	reauthenticationSentAt: timestamp("reauthentication_sent_at", { withTimezone: true }),
	isSsoUser: boolean("is_sso_user").default(false).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
}, (table) => [
	uniqueIndex("confirmation_token_idx").using("btree", table.confirmationToken.asc().nullsLast()).where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_current_idx").using("btree", table.emailChangeTokenCurrent.asc().nullsLast()).where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_new_idx").using("btree", table.emailChangeTokenNew.asc().nullsLast()).where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("reauthentication_token_idx").using("btree", table.reauthenticationToken.asc().nullsLast()).where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("recovery_token_idx").using("btree", table.recoveryToken.asc().nullsLast()).where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("users_email_partial_key").using("btree", table.email.asc().nullsLast()).where(sql`(is_sso_user = false)`),
	index("users_instance_id_email_idx").using("btree", table.instanceId.asc().nullsLast(), sql`true`),
	index("users_instance_id_idx").using("btree", table.instanceId.asc().nullsLast()),
	index("users_is_anonymous_idx").using("btree", table.isAnonymous.asc().nullsLast()),
	unique("users_phone_key").on(table.phone),check("users_email_change_confirm_status_check", sql`((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2))`),]);

export const jobInCron = cron.table.withRLS("job", {
	jobid: bigserial({ mode: 'number' }).primaryKey(),
	schedule: text().notNull(),
	command: text().notNull(),
	nodename: text().default("localhost").notNull(),
	nodeport: integer().default(inet_server_port()).notNull(),
	database: text().default(sql`current_database()`).notNull(),
	username: text().default(sql`CURRENT_USER`).notNull(),
	active: boolean().default(true).notNull(),
	jobname: text(),
}, (table) => [
	unique("jobname_username_uniq").on(table.jobname, table.username),
	pgPolicy("cron_job_policy", { using: sql`(username = CURRENT_USER)` }),
]);

export const jobRunDetailsInCron = cron.table.withRLS("job_run_details", {
	jobid: bigint({ mode: 'number' }),
	runid: bigserial({ mode: 'number' }).primaryKey(),
	jobPid: integer("job_pid"),
	database: text(),
	username: text(),
	command: text(),
	status: text(),
	returnMessage: text("return_message"),
	startTime: timestamp("start_time", { withTimezone: true }),
	endTime: timestamp("end_time", { withTimezone: true }),
}, (table) => [

	pgPolicy("cron_job_run_details_policy", { using: sql`(username = CURRENT_USER)` }),
]);

export const httpResponseInNet = net.table("_http_response", {
	id: bigint({ mode: 'number' }),
	statusCode: integer("status_code"),
	contentType: text("content_type"),
	headers: jsonb(),
	content: text(),
	timedOut: boolean("timed_out"),
	errorMsg: text("error_msg"),
	created: timestamp({ withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("_http_response_created_idx").using("btree", table.created.asc().nullsLast()),
]);

export const httpRequestQueueInNet = net.table("http_request_queue", {
	id: bigserial({ mode: 'number' }).notNull(),
	method: customType({ dataType: () => 'net.http_method' })().notNull(),
	url: text().notNull(),
	headers: jsonb(),
	body: customType({ dataType: () => 'bytea' })(),
	timeoutMilliseconds: integer("timeout_milliseconds").notNull(),
});

export const actionExecutions = pgTable.withRLS("action_executions", {
	id: uuid().defaultRandom().primaryKey(),
	actionId: uuid("action_id").notNull().references(() => proposedActions.id, { onDelete: "cascade" } ),
	status: text().default("pending"),
	executedAt: timestamp("executed_at", { withTimezone: true }),
	result: jsonb(),
	errorMessage: text("error_message"),
	undoState: jsonb("undo_state"),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true }),
	rolledBackBy: uuid("rolled_back_by").references(() => profiles.id),
	durationMs: integer("duration_ms"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_action_executions_action_id").using("btree", table.actionId.asc().nullsLast()),
	index("idx_action_executions_rolled_back_by").using("btree", table.rolledBackBy.asc().nullsLast()),

	pgPolicy("System insert action executions", { for: "insert", to: ["authenticated"], withCheck: sql`(action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("System update action executions", { for: "update", to: ["authenticated"], using: sql`(action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users delete action executions in org", { for: "delete", to: ["authenticated"], using: sql`(action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users view action executions in org", { for: "select", to: ["authenticated"], using: sql`(action_id IN ( SELECT proposed_actions.id
   FROM proposed_actions
  WHERE (proposed_actions.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
check("action_executions_status_check", sql`(status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text, 'rolled_back'::text]))`),]);

export const activities = pgTable.withRLS("activities", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	userId: uuid("user_id").references(() => usersInAuth.id, { onDelete: "set null" } ),
	activityType: activityType("activity_type").notNull(),
	title: text().notNull(),
	description: text(),
	entityType: text("entity_type"),
	entityId: uuid("entity_id"),
	taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" } ),
	dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" } ),
	contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" } ),
	projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" } ),
	documentId: uuid("document_id").references(() => documents.id, { onDelete: "set null" } ),
	metadata: jsonb().default({}),
	isSystemGenerated: boolean("is_system_generated").default(false),
	importance: text().default("normal"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" } ),
}, (table) => [
	index("idx_activities_activity_type").using("btree", table.activityType.asc().nullsLast()),
	index("idx_activities_contact").using("btree", table.contactId.asc().nullsLast()),
	index("idx_activities_created_at").using("btree", table.createdAt.desc().nullsFirst()),
	index("idx_activities_deal_id").using("btree", table.dealId.asc().nullsLast()),
	index("idx_activities_document_id").using("btree", table.documentId.asc().nullsLast()),
	index("idx_activities_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_activities_project").using("btree", table.projectId.asc().nullsLast()),
	index("idx_activities_startup_created").using("btree", table.startupId.asc().nullsLast(), table.createdAt.desc().nullsFirst()),
	index("idx_activities_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_activities_task_id").using("btree", table.taskId.asc().nullsLast()),
	index("idx_activities_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("users can create activities in their org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("users can delete own activities in their org", { for: "delete", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND ((user_id = ( SELECT auth.uid() AS uid)) OR (is_system_generated = true)))` }),

	pgPolicy("users can update activities in their org", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("users can view activities in their org", { for: "select", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),
check("activities_importance_check", sql`(importance = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'critical'::text]))`),]);

export const agentConfigs = pgTable.withRLS("agent_configs", {
	id: uuid().defaultRandom().primaryKey(),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "cascade" } ),
	agentName: text("agent_name").notNull(),
	displayName: text("display_name").notNull(),
	description: text(),
	model: text().default("gemini-3-flash-preview").notNull(),
	fallbackModel: text("fallback_model").default("gemini-3-flash-preview"),
	maxInputTokens: integer("max_input_tokens").default(8000),
	maxOutputTokens: integer("max_output_tokens").default(2000),
	thinkingLevel: text("thinking_level").default("high"),
	enabledTools: text("enabled_tools").array().default([]),
	maxCostPerRun: numeric("max_cost_per_run", { mode: 'number', precision: 6, scale: 4 }).default(0.10),
	dailyBudget: numeric("daily_budget", { precision: 8, scale: 2 }),
	systemPrompt: text("system_prompt"),
	temperature: numeric({ mode: 'number', precision: 2, scale: 1 }).default(0.7),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_agent_configs_org_id").using("btree", table.orgId.asc().nullsLast()),
	unique("agent_configs_org_id_agent_name_key").on(table.orgId, table.agentName),
	pgPolicy("Admins delete agent configs", { for: "delete", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Admins insert agent configs", { for: "insert", to: ["authenticated"], withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Admins update agent configs", { for: "update", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))`, withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Users view agent configs", { for: "select", to: ["authenticated"], using: sql`((org_id IS NULL) OR (org_id = ( SELECT user_org_id() AS user_org_id)))` }),
check("agent_configs_thinking_level_check", sql`(thinking_level = ANY (ARRAY['none'::text, 'low'::text, 'high'::text]))`),]);

export const aiRuns = pgTable.withRLS("ai_runs", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	agentName: text("agent_name").notNull(),
	action: text().notNull(),
	model: text().notNull(),
	provider: text().default("gemini"),
	inputTokens: integer("input_tokens"),
	outputTokens: integer("output_tokens"),
	thinkingTokens: integer("thinking_tokens"),
	costUsd: numeric("cost_usd", { precision: 10, scale: 6 }),
	durationMs: integer("duration_ms"),
	status: text().default("success"),
	errorMessage: text("error_message"),
	contextType: text("context_type"),
	contextId: text("context_id"),
	requestMetadata: jsonb("request_metadata").default({}),
	responseMetadata: jsonb("response_metadata").default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	industryContextUsed: text("industry_context_used"),
	featureContext: text("feature_context"),
	contextTokens: integer("context_tokens"),
}, (table) => [
	index("idx_ai_runs_created_at").using("btree", table.createdAt.asc().nullsLast()),
	index("idx_ai_runs_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_ai_runs_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_ai_runs_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users delete ai runs in org", { for: "delete", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users insert ai runs in org", { for: "insert", to: ["authenticated"], withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users update ai runs in org", { for: "update", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))`, withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users view ai runs in org", { for: "select", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),
check("ai_runs_provider_check", sql`(provider = ANY (ARRAY['gemini'::text, 'claude'::text, 'openai'::text]))`),check("ai_runs_status_check", sql`(status = ANY (ARRAY['success'::text, 'error'::text, 'timeout'::text, 'rate_limited'::text]))`),]);

export const aiUsageLimits = pgTable.withRLS("ai_usage_limits", {
	id: uuid().defaultRandom().primaryKey(),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	monthlyCapCents: integer("monthly_cap_cents").default(5000).notNull(),
	currentMonthTotalCents: integer("current_month_total_cents").default(0),
	currentMonthStart: date("current_month_start").default(sql`(date_trunc('month'::text, now()))`),
	lastResetAt: timestamp("last_reset_at", { withTimezone: true }).default(sql`now()`),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	unique("ai_usage_limits_org_id_key").on(table.orgId),
	pgPolicy("limits_insert", { for: "insert", to: ["authenticated"], withCheck: sql`(org_id IN ( SELECT p.org_id
   FROM profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("limits_select", { for: "select", to: ["authenticated"], using: sql`(org_id IN ( SELECT p.org_id
   FROM profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("limits_update", { for: "update", to: ["authenticated"], using: sql`(org_id IN ( SELECT p.org_id
   FROM profiles p
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),
]);

export const assumptions = pgTable.withRLS("assumptions", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	leanCanvasId: uuid("lean_canvas_id").references(() => leanCanvases.id, { onDelete: "set null" } ),
	sourceBlock: assumptionSource("source_block").notNull(),
	statement: text().notNull(),
	impactScore: integer("impact_score").default(5).notNull(),
	uncertaintyScore: integer("uncertainty_score").default(5).notNull(),
	priorityScore: integer("priority_score").generatedAlwaysAs(sql`(impact_score * uncertainty_score)`),
	status: assumptionStatus().default("untested").notNull(),
	testedAt: timestamp("tested_at", { withTimezone: true }),
	aiExtracted: boolean("ai_extracted").default(false),
	extractionConfidence: numeric("extraction_confidence", { precision: 3, scale: 2 }),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	riskScore: numeric("risk_score", { mode: 'number' }).default(50),
	evidenceCount: integer("evidence_count").default(0),
}, (table) => [
	index("idx_assumptions_lean_canvas_id").using("btree", table.leanCanvasId.asc().nullsLast()),
	index("idx_assumptions_source_block").using("btree", table.startupId.asc().nullsLast(), table.sourceBlock.asc().nullsLast()),

	pgPolicy("assumptions_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("assumptions_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("assumptions_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("assumptions_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("assumptions_extraction_confidence_check", sql`((extraction_confidence >= (0)::numeric) AND (extraction_confidence <= (1)::numeric))`),check("assumptions_impact_score_check", sql`((impact_score >= 1) AND (impact_score <= 10))`),check("assumptions_risk_score_range", sql`((risk_score >= (0)::numeric) AND (risk_score <= (100)::numeric))`),check("assumptions_uncertainty_score_check", sql`((uncertainty_score >= 1) AND (uncertainty_score <= 10))`),]);

export const auditLog = pgTable.withRLS("audit_log", {
	id: uuid().defaultRandom().primaryKey(),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" } ),
	actorType: text("actor_type").default("user"),
	actorId: text("actor_id"),
	action: text().notNull(),
	tableName: text("table_name").notNull(),
	recordId: uuid("record_id"),
	oldData: jsonb("old_data"),
	newData: jsonb("new_data"),
	ipAddress: inet("ip_address"),
	userAgent: text("user_agent"),
	proposedActionId: uuid("proposed_action_id").references(() => proposedActions.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_audit_log_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_audit_log_proposed_action_id").using("btree", table.proposedActionId.asc().nullsLast()),
	index("idx_audit_log_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_audit_log_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users view audit log in org", { for: "select", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),
check("audit_log_actor_type_check", sql`(actor_type = ANY (ARRAY['user'::text, 'system'::text, 'ai_agent'::text, 'webhook'::text]))`),]);

export const campaigns = pgTable.withRLS("campaigns", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	name: text().default("90-Day Validation Plan").notNull(),
	status: text().default("draft").notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_campaigns_startup").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users can create campaigns", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can delete campaigns", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can update campaigns", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can view own campaigns", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
check("campaigns_status_check", sql`(status = ANY (ARRAY['draft'::text, 'active'::text, 'completed'::text, 'archived'::text]))`),]);

export const chatFacts = pgTable.withRLS("chat_facts", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	factType: text("fact_type").notNull(),
	content: text().notNull(),
	confidence: numeric({ mode: 'number', precision: 3, scale: 2 }).default(0.8),
	sourceMessageId: uuid("source_message_id").references(() => chatMessages.id, { onDelete: "set null" } ),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_chat_facts_source_message_id").using("btree", table.sourceMessageId.asc().nullsLast()),
	index("idx_chat_facts_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_chat_facts_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users delete own chat facts", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users insert chat facts", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view own chat facts", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("chat_facts_fact_type_check", sql`(fact_type = ANY (ARRAY['goal'::text, 'metric'::text, 'preference'::text, 'decision'::text, 'context'::text, 'constraint'::text]))`),]);

export const chatMessages = pgTable.withRLS("chat_messages", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	sessionId: uuid("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" } ),
	tab: text().notNull(),
	role: text().notNull(),
	content: text().notNull(),
	sources: jsonb().default([]),
	suggestedActions: jsonb("suggested_actions").default([]),
	routing: jsonb(),
	aiRunId: uuid("ai_run_id").references(() => aiRuns.id),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_chat_messages_ai_run_id").using("btree", table.aiRunId.asc().nullsLast()).where(sql`(ai_run_id IS NOT NULL)`),
	index("idx_chat_messages_session_id").using("btree", table.sessionId.asc().nullsLast()),
	index("idx_chat_messages_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users delete own chat messages", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users insert own chat messages", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users update own chat messages", { for: "update", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))`, withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view own chat messages", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("chat_messages_role_check", sql`(role = ANY (ARRAY['user'::text, 'assistant'::text, 'system'::text]))`),check("chat_messages_tab_check", sql`(tab = ANY (ARRAY['coach'::text, 'research'::text, 'planning'::text, 'actions'::text]))`),]);

export const chatPending = pgTable.withRLS("chat_pending", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	messageId: uuid("message_id").references(() => chatMessages.id, { onDelete: "set null" } ),
	suggestionType: text("suggestion_type").notNull(),
	content: jsonb().notNull(),
	reasoning: text(),
	status: text().default("pending"),
	expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`(now() + '24:00:00'::interval)`),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_chat_pending_message_id").using("btree", table.messageId.asc().nullsLast()),
	index("idx_chat_pending_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("System insert chat pending", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users delete own chat pending", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users update own chat pending", { for: "update", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))`, withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view own chat pending", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("chat_pending_status_check", sql`(status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'expired'::text]))`),check("chat_pending_suggestion_type_check", sql`(suggestion_type = ANY (ARRAY['task'::text, 'deal'::text, 'contact'::text, 'navigation'::text, 'research'::text, 'other'::text]))`),]);

export const chatSessions = pgTable.withRLS("chat_sessions", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	title: text(),
	summary: text(),
	messageCount: integer("message_count").default(0),
	lastTab: text("last_tab").default("coach"),
	contextSnapshot: jsonb("context_snapshot").default({}),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_chat_sessions_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_chat_sessions_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users delete own chat sessions", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users insert own chat sessions", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users update own chat sessions", { for: "update", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))`, withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view own chat sessions", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("chat_sessions_last_tab_check", sql`(last_tab = ANY (ARRAY['coach'::text, 'research'::text, 'planning'::text, 'actions'::text]))`),]);

export const communications = pgTable.withRLS("communications", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" } ),
	dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" } ),
	type: text().notNull(),
	direction: text(),
	subject: text(),
	content: text(),
	summary: text(),
	occurredAt: timestamp("occurred_at", { withTimezone: true }).default(sql`now()`),
	durationMinutes: integer("duration_minutes"),
	participants: uuid().array().default([]),
	followUpRequired: boolean("follow_up_required").default(false),
	followUpDate: date("follow_up_date"),
	sentiment: text(),
	keyPoints: text("key_points").array().default([]),
	actionItems: text("action_items").array().default([]),
	createdBy: uuid("created_by").references(() => profiles.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_communications_contact_occurred").using("btree", table.contactId.asc().nullsLast(), table.occurredAt.desc().nullsFirst()),
	index("idx_communications_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_communications_deal_id").using("btree", table.dealId.asc().nullsLast()),
	index("idx_communications_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Authenticated users update communications in org", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users create communications in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users delete communications in org", { for: "delete", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view communications in org", { for: "select", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),
check("communications_direction_check", sql`(direction = ANY (ARRAY['inbound'::text, 'outbound'::text]))`),check("communications_sentiment_check", sql`(sentiment = ANY (ARRAY['positive'::text, 'neutral'::text, 'negative'::text]))`),check("communications_type_check", sql`(type = ANY (ARRAY['email'::text, 'call'::text, 'meeting'::text, 'note'::text, 'linkedin'::text, 'whatsapp'::text, 'sms'::text, 'other'::text]))`),]);

export const competitorProfiles = pgTable.withRLS("competitor_profiles", {
	id: uuid().defaultRandom().primaryKey(),
	validationReportId: uuid("validation_report_id"),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	website: text(),
	description: text(),
	competitorType: text("competitor_type"),
	threatLevel: text("threat_level"),
	fundingStage: text("funding_stage"),
	fundingAmount: numeric("funding_amount"),
	fundingCurrency: text("funding_currency").default("USD"),
	employeeCount: text("employee_count"),
	marketShare: numeric("market_share", { precision: 5, scale: 2 }),
	strengths: text().array(),
	weaknesses: text().array(),
	pricingModel: text("pricing_model"),
	pricingRange: text("pricing_range"),
	source: text(),
	sourceUrl: text("source_url"),
	industry: text(),
	region: text(),
	discoveredAt: timestamp("discovered_at", { withTimezone: true }).default(sql`now()`),
	lastUpdatedAt: timestamp("last_updated_at", { withTimezone: true }).default(sql`now()`),
	rawData: jsonb("raw_data").default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_competitor_profiles_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users can add competitors for their startups", { for: "insert", to: ["authenticated"], withCheck: sql`((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE ((sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text]))))))` }),

	pgPolicy("Users can delete competitors for their startups", { for: "delete", to: ["authenticated"], using: sql`((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE ((sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text]))))))` }),

	pgPolicy("Users can update competitors for their startups", { for: "update", to: ["authenticated"], using: sql`((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE ((sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text]))))))` }),

	pgPolicy("Users can view competitors for their startups", { for: "select", to: ["authenticated"], using: sql`((startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE (sm.user_id = ( SELECT auth.uid() AS uid)))))` }),
check("competitor_profiles_competitor_type_check", sql`(competitor_type = ANY (ARRAY['direct'::text, 'indirect'::text, 'potential'::text, 'alternative'::text]))`),check("competitor_profiles_threat_level_check", sql`(threat_level = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]))`),]);

export const contactTags = pgTable.withRLS("contact_tags", {
	id: uuid().defaultRandom().primaryKey(),
	contactId: uuid("contact_id").notNull().references(() => contacts.id, { onDelete: "cascade" } ),
	tag: text().notNull(),
	color: text().default("#6366f1"),
	createdBy: uuid("created_by").references(() => profiles.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_contact_tags_contact_id").using("btree", table.contactId.asc().nullsLast()),
	index("idx_contact_tags_created_by").using("btree", table.createdBy.asc().nullsLast()),
	unique("contact_tags_contact_id_tag_key").on(table.contactId, table.tag),
	pgPolicy("Users delete contact tags in org", { for: "delete", to: ["authenticated"], using: sql`(contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id)))` }),

	pgPolicy("Users insert contact tags in org", { for: "insert", to: ["authenticated"], withCheck: sql`(contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id)))` }),

	pgPolicy("Users update contact tags in org", { for: "update", to: ["authenticated"], using: sql`(contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id)))`, withCheck: sql`(contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id)))` }),

	pgPolicy("Users view contact tags in org", { for: "select", to: ["authenticated"], using: sql`(contact_id IN ( SELECT contacts.id
   FROM contacts
  WHERE startup_in_org(contacts.startup_id)))` }),
]);

export const contacts = pgTable.withRLS("contacts", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	email: text(),
	phone: text(),
	company: text(),
	title: text(),
	linkedinUrl: text("linkedin_url"),
	twitterUrl: text("twitter_url"),
	type: text().default("other"),
	subType: text("sub_type"),
	relationshipStrength: text("relationship_strength").default("cold"),
	source: text(),
	referredBy: uuid("referred_by"),
	bio: text(),
	aiSummary: text("ai_summary"),
	enrichedAt: timestamp("enriched_at", { withTimezone: true }),
	tags: text().array().default([]),
	customFields: jsonb("custom_fields").default({}),
	lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
	foreignKey({
		columns: [table.referredBy],
		foreignColumns: [table.id],
		name: "contacts_referred_by_fkey"
	}),
	index("idx_contacts_referred_by").using("btree", table.referredBy.asc().nullsLast()).where(sql`(referred_by IS NOT NULL)`),
	index("idx_contacts_startup_created").using("btree", table.startupId.asc().nullsLast(), table.createdAt.desc().nullsFirst()),

	pgPolicy("Users create contacts in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users delete contacts in org", { for: "delete", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),

	pgPolicy("Users update contacts in org", { for: "update", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view contacts in org", { for: "select", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),
check("contacts_relationship_strength_check", sql`(relationship_strength = ANY (ARRAY['cold'::text, 'warm'::text, 'hot'::text, 'champion'::text]))`),check("contacts_type_check", sql`(type = ANY (ARRAY['investor'::text, 'customer'::text, 'advisor'::text, 'partner'::text, 'vendor'::text, 'employee'::text, 'media'::text, 'other'::text]))`),]);

export const contextInjectionConfigs = pgTable.withRLS("context_injection_configs", {
	id: uuid().defaultRandom().primaryKey(),
	featureContext: text("feature_context").notNull(),
	categories: text().array().notNull(),
	description: text(),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("context_injection_configs_feature_context_key").on(table.featureContext),
	pgPolicy("Anyone can view context injection configs", { for: "select", to: ["anon", "authenticated"], using: sql`(is_active = true)` }),
]);

export const customerForces = pgTable.withRLS("customer_forces", {
	id: uuid().defaultRandom().primaryKey(),
	segmentId: uuid("segment_id").notNull().references(() => customerSegments.id, { onDelete: "cascade" } ),
	forceType: forceType("force_type").notNull(),
	description: text().notNull(),
	strength: integer().default(5).notNull(),
	category: text(),
	source: text(),
	sourceInterviewId: uuid("source_interview_id"),
	isValidated: boolean("is_validated").default(false),
	validatedAt: timestamp("validated_at", { withTimezone: true }),
	validationNotes: text("validation_notes"),
	aiGenerated: boolean("ai_generated").default(false),
	displayOrder: integer("display_order").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_customer_forces_segment_id").using("btree", table.segmentId.asc().nullsLast()),

	pgPolicy("customer_forces_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("customer_forces_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("customer_forces_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("customer_forces_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("customer_forces_source_check", sql`(source = ANY (ARRAY['interview'::text, 'survey'::text, 'observation'::text, 'assumption'::text, 'research'::text]))`),check("customer_forces_strength_check", sql`((strength >= 1) AND (strength <= 10))`),]);

export const customerSegments = pgTable.withRLS("customer_segments", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	segmentType: segmentType("segment_type").default("early_adopter").notNull(),
	demographics: jsonb().default({}),
	firmographics: jsonb().default({}),
	psychographics: jsonb().default({}),
	behaviors: jsonb().default({}),
	painPoints: text("pain_points").array().default([]),
	triggerEvent: text("trigger_event"),
	desiredOutcome: text("desired_outcome"),
	currentSolutions: text("current_solutions").array().default([]),
	switchingBarriers: text("switching_barriers").array().default([]),
	description: text(),
	isPrimary: boolean("is_primary").default(false),
	isEarlyAdopter: boolean("is_early_adopter").default(true),
	priority: integer().default(1),
	interviewCount: integer("interview_count").default(0),
	validatedAt: timestamp("validated_at", { withTimezone: true }),
	aiGenerated: boolean("ai_generated").default(false),
	aiConfidence: numeric("ai_confidence", { precision: 3, scale: 2 }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_customer_segments_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("customer_segments_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("customer_segments_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("customer_segments_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("customer_segments_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("customer_segments_priority_check", sql`((priority >= 1) AND (priority <= 10))`),]);

export const dailyFocusRecommendations = pgTable.withRLS("daily_focus_recommendations", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	computedAt: timestamp("computed_at", { withTimezone: true }).default(sql`now()`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`(now() + '18:00:00'::interval)`).notNull(),
	primaryAction: jsonb("primary_action").notNull(),
	secondaryActions: jsonb("secondary_actions").default([]),
	signalWeights: jsonb("signal_weights").default({"momentum":0.1,"health_gap":0.25,"time_urgency":0.15,"task_priority":0.25,"stage_relevance":0.25}),
	scoringBreakdown: jsonb("scoring_breakdown").default({}),
	actionCompletedAt: timestamp("action_completed_at", { withTimezone: true }),
	skippedAt: timestamp("skipped_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_daily_focus_active").using("btree", table.startupId.asc().nullsLast(), table.expiresAt.asc().nullsLast()).where(sql`((action_completed_at IS NULL) AND (skipped_at IS NULL))`),
	index("idx_daily_focus_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users can read own recommendations", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id IN ( SELECT profiles.org_id
           FROM profiles
          WHERE (profiles.id = ( SELECT auth.uid() AS uid))))))` }),
]);

export const dashboardMetricsCache = pgTable.withRLS("dashboard_metrics_cache", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	metricType: text("metric_type").notNull(),
	value: jsonb().default({}).notNull(),
	computedAt: timestamp("computed_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("uq_dashboard_metrics_cache_startup_type").on(table.startupId, table.metricType),
	pgPolicy("dashboard_metrics_cache_insert_org", { for: "insert", to: ["authenticated"], withCheck: sql`( SELECT startup_in_org(dashboard_metrics_cache.startup_id) AS startup_in_org)` }),

	pgPolicy("dashboard_metrics_cache_select_org", { for: "select", to: ["authenticated"], using: sql`( SELECT startup_in_org(dashboard_metrics_cache.startup_id) AS startup_in_org)` }),

	pgPolicy("dashboard_metrics_cache_update_org", { for: "update", to: ["authenticated"], using: sql`( SELECT startup_in_org(dashboard_metrics_cache.startup_id) AS startup_in_org)` }),
]);

export const deals = pgTable.withRLS("deals", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" } ),
	name: text().notNull(),
	description: text(),
	type: text().default("investor"),
	stage: text().default("research"),
	amount: numeric({ precision: 14, scale: 2 }),
	currency: text().default("USD"),
	probability: integer().default(0),
	expectedClose: date("expected_close"),
	actualClose: date("actual_close"),
	isActive: boolean("is_active").default(true),
	lostReason: text("lost_reason"),
	aiScore: integer("ai_score"),
	aiInsights: jsonb("ai_insights").default({}),
	riskFactors: text("risk_factors").array().default([]),
	notes: text(),
	tags: text().array().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
	index("idx_deals_contact_id").using("btree", table.contactId.asc().nullsLast()),
	index("idx_deals_startup_created").using("btree", table.startupId.asc().nullsLast(), table.createdAt.desc().nullsFirst()),

	pgPolicy("Users create deals in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users delete deals in org", { for: "delete", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),

	pgPolicy("Users update deals in org", { for: "update", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view deals in org", { for: "select", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),
check("deals_probability_check", sql`((probability >= 0) AND (probability <= 100))`),check("deals_stage_check", sql`(stage = ANY (ARRAY['research'::text, 'outreach'::text, 'meeting'::text, 'due_diligence'::text, 'negotiation'::text, 'closed_won'::text, 'closed_lost'::text]))`),check("deals_type_check", sql`(type = ANY (ARRAY['investor'::text, 'customer'::text, 'partnership'::text, 'other'::text]))`),]);

export const decisionEvidence = pgTable.withRLS("decision_evidence", {
	id: uuid().defaultRandom().primaryKey(),
	decisionId: uuid("decision_id").notNull().references(() => decisions.id, { onDelete: "cascade" } ),
	evidenceType: text("evidence_type").notNull(),
	evidenceId: uuid("evidence_id"),
	evidenceTable: text("evidence_table"),
	summary: text().notNull(),
	supportsDecision: boolean("supports_decision").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_decision_evidence_decision_id").using("btree", table.decisionId.asc().nullsLast()),

	pgPolicy("evidence_delete", { for: "delete", to: ["authenticated"], using: sql`(decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid))))))` }),

	pgPolicy("evidence_insert", { for: "insert", to: ["authenticated"], withCheck: sql`(decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid))))))` }),

	pgPolicy("evidence_select", { for: "select", to: ["authenticated"], using: sql`(decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid))))))` }),

	pgPolicy("evidence_update", { for: "update", to: ["authenticated"], using: sql`(decision_id IN ( SELECT d.id
   FROM decisions d
  WHERE (d.startup_id IN ( SELECT s.id
           FROM (startups s
             JOIN org_members om ON ((om.org_id = s.org_id)))
          WHERE (om.user_id = ( SELECT auth.uid() AS uid))))))` }),
check("decision_evidence_evidence_type_check", sql`(evidence_type = ANY (ARRAY['assumption'::text, 'experiment'::text, 'interview'::text, 'metric'::text, 'research'::text, 'other'::text]))`),]);

export const decisions = pgTable.withRLS("decisions", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	decisionType: text("decision_type").notNull(),
	title: text().notNull(),
	reasoning: text(),
	outcome: text(),
	outcomeAt: timestamp("outcome_at", { withTimezone: true }),
	decidedBy: uuid("decided_by").references(() => usersInAuth.id),
	decidedAt: timestamp("decided_at", { withTimezone: true }).default(sql`now()`),
	status: text().default("active"),
	aiSuggested: boolean("ai_suggested").default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_decisions_decided_by").using("btree", table.decidedBy.asc().nullsLast()),
	index("idx_decisions_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("decisions_delete", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("decisions_insert", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("decisions_select", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("decisions_update", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("decisions_decision_type_check", sql`(decision_type = ANY (ARRAY['pivot'::text, 'persevere'::text, 'launch'::text, 'kill'::text, 'invest'::text, 'partner'::text, 'hire'::text, 'other'::text]))`),check("decisions_status_check", sql`(status = ANY (ARRAY['active'::text, 'reversed'::text, 'superseded'::text]))`),]);

export const deckTemplates = pgTable.withRLS("deck_templates", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	description: text(),
	category: templateCategory().default("general").notNull(),
	theme: text().default("modern").notNull(),
	structure: jsonb().default([]).notNull(),
	previewUrl: text("preview_url"),
	thumbnailUrl: text("thumbnail_url"),
	slideCount: integer("slide_count").default(0),
	colorScheme: jsonb("color_scheme").default({"accent":"#F59E0B","primary":"#3B82F6","secondary":"#1E40AF"}),
	fonts: jsonb().default({"body":"Inter","heading":"Inter"}),
	isPublic: boolean("is_public").default(false),
	isDefault: boolean("is_default").default(false),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "cascade" } ),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	usageCount: integer("usage_count").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_deck_templates_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_deck_templates_org_id").using("btree", table.orgId.asc().nullsLast()),

	pgPolicy("anyone can view public templates", { for: "select", to: ["authenticated"], using: sql`(is_public = true)` }),

	pgPolicy("users can create org templates", { for: "insert", to: ["authenticated"], withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (is_public = false))` }),

	pgPolicy("users can delete own org templates", { for: "delete", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (created_by = ( SELECT auth.uid() AS uid)))` }),

	pgPolicy("users can update own org templates", { for: "update", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (created_by = ( SELECT auth.uid() AS uid)))`, withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("users can view org templates", { for: "select", to: ["authenticated"], using: sql`((org_id IS NOT NULL) AND (org_id = ( SELECT user_org_id() AS user_org_id)))` }),
]);

export const documentVersions = pgTable.withRLS("document_versions", {
	id: uuid().defaultRandom().primaryKey(),
	documentId: uuid("document_id").notNull().references(() => documents.id, { onDelete: "cascade" } ),
	versionNumber: integer("version_number").default(1).notNull(),
	contentJson: jsonb("content_json").notNull(),
	metadata: jsonb().default({}),
	label: text(),
	createdBy: uuid("created_by").references(() => usersInAuth.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_document_versions_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_document_versions_document_id").using("btree", table.documentId.asc().nullsLast()),

	pgPolicy("Users delete document versions in org", { for: "delete", to: ["authenticated"], using: sql`(document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id)))` }),

	pgPolicy("Users insert document versions in org", { for: "insert", to: ["authenticated"], withCheck: sql`(document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id)))` }),

	pgPolicy("Users update document versions in org", { for: "update", to: ["authenticated"], using: sql`(document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id)))`, withCheck: sql`(document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id)))` }),

	pgPolicy("Users view document versions in org", { for: "select", to: ["authenticated"], using: sql`(document_id IN ( SELECT documents.id
   FROM documents
  WHERE startup_in_org(documents.startup_id)))` }),
]);

export const documents = pgTable.withRLS("documents", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	wizardSessionId: uuid("wizard_session_id").references(() => wizardSessions.id, { onDelete: "set null" } ),
	type: text().notNull(),
	title: text().notNull(),
	content: text(),
	contentJson: jsonb("content_json"),
	version: integer().default(1),
	status: text().default("draft"),
	aiGenerated: boolean("ai_generated").default(false),
	createdBy: uuid("created_by").references(() => profiles.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	metadata: jsonb().default({}),
	fileUrl: text("file_url"),
	filePath: text("file_path"),
	fileSize: bigint("file_size", { mode: 'number' }),
	fileType: text("file_type"),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
	index("idx_documents_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_documents_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_documents_type").using("btree", table.type.asc().nullsLast()),
	index("idx_documents_wizard_session_id").using("btree", table.wizardSessionId.asc().nullsLast()),

	pgPolicy("Users delete documents in org", { for: "delete", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),

	pgPolicy("Users insert documents in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users update documents in org", { for: "update", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view documents in org", { for: "select", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),
check("documents_status_check", sql`(status = ANY (ARRAY['draft'::text, 'review'::text, 'final'::text, 'archived'::text]))`),check("documents_type_check", sql`(type = ANY (ARRAY['startup_profile'::text, 'lean_canvas'::text, 'strategy'::text, 'pitch_deck'::text, 'roadmap'::text, 'executive_summary'::text, 'investor_update'::text, 'financial_model'::text, 'custom'::text]))`),]);

export const eventAssets = pgTable.withRLS("event_assets", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	description: text(),
	assetType: eventAssetType("asset_type").notNull(),
	platform: assetPlatform().default("other").notNull(),
	status: assetStatus().default("draft").notNull(),
	title: text(),
	content: text(),
	caption: text(),
	hashtags: text().array(),
	callToAction: text("call_to_action"),
	linkUrl: text("link_url"),
	mediaUrl: text("media_url"),
	mediaUrls: text("media_urls").array().default([]),
	mediaType: text("media_type"),
	thumbnailUrl: text("thumbnail_url"),
	fileSizeBytes: bigint("file_size_bytes", { mode: 'number' }),
	dimensions: jsonb(),
	scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	engagement: jsonb().default({}),
	impressions: integer().default(0),
	clicks: integer().default(0),
	likes: integer().default(0),
	shares: integer().default(0),
	comments: integer().default(0),
	aiGenerated: boolean("ai_generated").default(false),
	aiModel: text("ai_model"),
	aiPrompt: text("ai_prompt"),
	generationParams: jsonb("generation_params").default({}),
	version: integer().default(1),
	parentAssetId: uuid("parent_asset_id"),
	externalPostId: text("external_post_id"),
	externalUrl: text("external_url"),
	approvedBy: uuid("approved_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	approvedAt: timestamp("approved_at", { withTimezone: true }),
	rejectionReason: text("rejection_reason"),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
}, (table) => [
	foreignKey({
		columns: [table.parentAssetId],
		foreignColumns: [table.id],
		name: "event_assets_parent_asset_id_fkey"
	}).onDelete("set null"),
	index("idx_event_assets_approved_by").using("btree", table.approvedBy.asc().nullsLast()),
	index("idx_event_assets_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_event_assets_event_id").using("btree", table.eventId.asc().nullsLast()),
	index("idx_event_assets_parent_asset_id").using("btree", table.parentAssetId.asc().nullsLast()),

	pgPolicy("authenticated can delete event assets", { for: "delete", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can insert event assets", { for: "insert", to: ["authenticated"], withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can select event assets", { for: "select", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can update event assets", { for: "update", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))`, withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),
]);

export const eventAttendees = pgTable.withRLS("event_attendees", {
	id: uuid().defaultRandom().primaryKey(),
	contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" } ),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	company: text(),
	title: text(),
	linkedinUrl: text("linkedin_url"),
	rsvpStatus: rsvpStatus("rsvp_status").default("pending").notNull(),
	attendeeType: attendeeType("attendee_type").default("general").notNull(),
	ticketType: text("ticket_type"),
	ticketPrice: numeric("ticket_price", { mode: 'number', precision: 10, scale: 2 }).default(0),
	registrationCode: text("registration_code"),
	checkedIn: boolean("checked_in").default(false),
	checkedInAt: timestamp("checked_in_at", { withTimezone: true }),
	checkedInBy: uuid("checked_in_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	badgePrinted: boolean("badge_printed").default(false),
	dietaryRequirements: text("dietary_requirements"),
	accessibilityNeeds: text("accessibility_needs"),
	sessionPreferences: jsonb("session_preferences").default([]),
	whatsappOptedIn: boolean("whatsapp_opted_in").default(false),
	emailOptedIn: boolean("email_opted_in").default(true),
	lastMessagedAt: timestamp("last_messaged_at", { withTimezone: true }),
	messagesReceived: integer("messages_received").default(0),
	attendedSessions: jsonb("attended_sessions").default([]),
	feedbackSubmitted: boolean("feedback_submitted").default(false),
	feedbackRating: integer("feedback_rating"),
	feedbackText: text("feedback_text"),
	registrationSource: text("registration_source"),
	referralCode: text("referral_code"),
	utmSource: text("utm_source"),
	utmMedium: text("utm_medium"),
	utmCampaign: text("utm_campaign"),
	notes: text(),
	internalNotes: text("internal_notes"),
	invitedAt: timestamp("invited_at", { withTimezone: true }),
	registeredAt: timestamp("registered_at", { withTimezone: true }),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
	cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
}, (table) => [
	index("idx_event_attendees_checked_in_by").using("btree", table.checkedInBy.asc().nullsLast()),
	index("idx_event_attendees_contact_id").using("btree", table.contactId.asc().nullsLast()),
	index("idx_event_attendees_event_id").using("btree", table.eventId.asc().nullsLast()),
	unique("event_attendees_registration_code_key").on(table.registrationCode),
	pgPolicy("authenticated can delete event attendees", { for: "delete", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can insert event attendees", { for: "insert", to: ["authenticated"], withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can select event attendees", { for: "select", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can update event attendees", { for: "update", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))`, withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),
check("event_attendees_feedback_rating_check", sql`((feedback_rating >= 1) AND (feedback_rating <= 5))`),]);

export const eventSpeakers = pgTable.withRLS("event_speakers", {
	id: uuid().defaultRandom().primaryKey(),
	eventId: uuid("event_id").references(() => industryEvents.id, { onDelete: "cascade" } ),
	speakerName: text("speaker_name").notNull(),
	speakerTitle: text("speaker_title"),
	speakerCompany: text("speaker_company"),
	speakerLinkedin: text("speaker_linkedin"),
	appearanceYear: integer("appearance_year"),
	appearanceType: text("appearance_type"),
	isConfirmed: boolean("is_confirmed").default(false),
	sourceUrl: text("source_url"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_event_speakers_event_id").using("btree", table.eventId.asc().nullsLast()),

	pgPolicy("Admin users can delete event speakers", { for: "delete", to: ["authenticated"], using: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Admin users can insert event speakers", { for: "insert", to: ["authenticated"], withCheck: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Admin users can update event speakers", { for: "update", to: ["authenticated"], using: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)`, withCheck: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Anon users can read event speakers", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("Authenticated users can read event speakers", { for: "select", to: ["authenticated"], using: sql`true` }),
check("event_speakers_appearance_type_check", sql`(appearance_type = ANY (ARRAY['keynote'::text, 'panel'::text, 'fireside'::text, 'workshop'::text, 'speaker'::text]))`),]);

export const eventVenues = pgTable.withRLS("event_venues", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	description: text(),
	venueType: text("venue_type"),
	website: text(),
	address: text(),
	city: text(),
	state: text(),
	country: text(),
	postalCode: text("postal_code"),
	latitude: numeric({ precision: 10, scale: 7 }),
	longitude: numeric({ precision: 10, scale: 7 }),
	googlePlaceId: text("google_place_id"),
	capacity: integer(),
	seatedCapacity: integer("seated_capacity"),
	standingCapacity: integer("standing_capacity"),
	rentalCost: numeric("rental_cost", { mode: 'number', precision: 10, scale: 2 }).default(0),
	depositAmount: numeric("deposit_amount", { mode: 'number', precision: 10, scale: 2 }).default(0),
	cateringMinimum: numeric("catering_minimum", { precision: 10, scale: 2 }),
	additionalFees: jsonb("additional_fees").default([]),
	contactName: text("contact_name"),
	contactEmail: text("contact_email"),
	contactPhone: text("contact_phone"),
	amenities: jsonb().default([]),
	equipmentIncluded: jsonb("equipment_included").default([]),
	parkingInfo: text("parking_info"),
	accessibilityInfo: text("accessibility_info"),
	wifiAvailable: boolean("wifi_available").default(true),
	avEquipment: boolean("av_equipment").default(false),
	cateringAvailable: boolean("catering_available").default(false),
	cateringRequired: boolean("catering_required").default(false),
	photos: text().array().default([]),
	virtualTourUrl: text("virtual_tour_url"),
	floorPlanUrl: text("floor_plan_url"),
	status: venueStatus().default("researching").notNull(),
	isPrimary: boolean("is_primary").default(false),
	visitedAt: timestamp("visited_at", { withTimezone: true }),
	bookedAt: timestamp("booked_at", { withTimezone: true }),
	depositPaidAt: timestamp("deposit_paid_at", { withTimezone: true }),
	contractSignedAt: timestamp("contract_signed_at", { withTimezone: true }),
	fitScore: integer("fit_score"),
	aiAnalysis: text("ai_analysis"),
	discoverySource: text("discovery_source"),
	notes: text(),
	pros: text(),
	cons: text(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
}, (table) => [
	index("idx_event_venues_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_event_venues_event_id").using("btree", table.eventId.asc().nullsLast()),

	pgPolicy("authenticated can delete event venues", { for: "delete", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can insert event venues", { for: "insert", to: ["authenticated"], withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can select event venues", { for: "select", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can update event venues", { for: "update", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))`, withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),
check("event_venues_fit_score_check", sql`((fit_score >= 0) AND (fit_score <= 100))`),]);

export const events = pgTable.withRLS("events", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	description: text(),
	eventType: eventType("event_type").default("other").notNull(),
	status: eventStatus().default("scheduled").notNull(),
	startDate: timestamp("start_date", { withTimezone: true }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true }),
	allDay: boolean("all_day").default(false),
	location: text(),
	virtualMeetingUrl: text("virtual_meeting_url"),
	attendees: jsonb().default([]),
	relatedContactId: uuid("related_contact_id").references(() => contacts.id, { onDelete: "set null" } ),
	relatedDealId: uuid("related_deal_id").references(() => deals.id, { onDelete: "set null" } ),
	relatedProjectId: uuid("related_project_id").references(() => projects.id, { onDelete: "set null" } ),
	reminderMinutes: integer("reminder_minutes").default(15),
	recurrenceRule: text("recurrence_rule"),
	color: text(),
	metadata: jsonb().default({}),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	eventScope: eventScope("event_scope").default("internal").notNull(),
	name: text(),
	slug: text(),
	timezone: text().default("UTC"),
	locationType: eventLocationType("location_type").default("in_person"),
	capacity: integer(),
	registrationUrl: text("registration_url"),
	registrationDeadline: timestamp("registration_deadline", { withTimezone: true }),
	isPublic: boolean("is_public").default(false),
	requiresApproval: boolean("requires_approval").default(false),
	budget: numeric({ mode: 'number', precision: 10, scale: 2 }).default(0),
	ticketPrice: numeric("ticket_price", { mode: 'number', precision: 10, scale: 2 }).default(0),
	healthScore: integer("health_score").default(0),
	tasksTotal: integer("tasks_total").default(0),
	tasksCompleted: integer("tasks_completed").default(0),
	sponsorsTarget: integer("sponsors_target").default(0),
	sponsorsConfirmed: integer("sponsors_confirmed").default(0),
	agenda: jsonb().default([]),
	tags: text().array().default([]),
	coverImageUrl: text("cover_image_url"),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
	externalUrl: text("external_url"),
	organizerName: text("organizer_name"),
	organizerLogoUrl: text("organizer_logo_url"),
	relevanceScore: integer("relevance_score").default(0),
	attendingStatus: attendingStatus("attending_status"),
	source: text(),
	discoveredAt: timestamp("discovered_at", { withTimezone: true }),
	cfpDeadline: timestamp("cfp_deadline", { withTimezone: true }),
	cfpUrl: text("cfp_url"),
	isFeatured: boolean("is_featured").default(false),
	industry: text(),
	targetAudience: text("target_audience").array(),
}, (table) => [
	index("idx_events_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_events_event_type").using("btree", table.eventType.asc().nullsLast()),
	index("idx_events_related_contact_id").using("btree", table.relatedContactId.asc().nullsLast()),
	index("idx_events_related_deal_id").using("btree", table.relatedDealId.asc().nullsLast()),
	index("idx_events_related_project_id").using("btree", table.relatedProjectId.asc().nullsLast()),
	index("idx_events_start_date").using("btree", table.startDate.asc().nullsLast()),
	index("idx_events_startup_date").using("btree", table.startupId.asc().nullsLast(), table.startDate.asc().nullsLast()),
	index("idx_events_startup_scope").using("btree", table.startupId.asc().nullsLast(), table.eventScope.asc().nullsLast()),
	unique("events_slug_key").on(table.slug),
	pgPolicy("anon can view public external events", { for: "select", to: ["anon"], using: sql`((event_scope = 'external'::event_scope) AND (is_public = true))` }),

	pgPolicy("anon can view public hosted events", { for: "select", to: ["anon"], using: sql`((event_scope = 'hosted'::event_scope) AND (is_public = true))` }),

	pgPolicy("authenticated_select_events", { for: "select", to: ["authenticated"], using: sql`(startup_in_org(startup_id) OR (event_scope = 'external'::event_scope))` }),

	pgPolicy("users can create events in their org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("users can delete events in their org", { for: "delete", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("users can update events in their org", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)`, withCheck: sql`startup_in_org(startup_id)` }),
check("events_health_score_check", sql`((health_score >= 0) AND (health_score <= 100))`),check("events_hosted_location_requires_capacity", sql`((event_scope <> 'hosted'::event_scope) OR (location_type <> ALL (ARRAY['in_person'::event_location_type, 'hybrid'::event_location_type])) OR ((capacity IS NOT NULL) AND (capacity > 0)))`),check("events_hosted_requires_name", sql`((event_scope <> 'hosted'::event_scope) OR (name IS NOT NULL))`),check("events_hosted_requires_slug", sql`((event_scope <> 'hosted'::event_scope) OR (slug IS NOT NULL))`),check("events_hosted_valid_type", sql`((event_scope <> 'hosted'::event_scope) OR (event_type = ANY (ARRAY['demo_day'::event_type, 'pitch_night'::event_type, 'networking'::event_type, 'workshop'::event_type, 'conference'::event_type, 'meetup'::event_type, 'webinar'::event_type, 'hackathon'::event_type, 'other'::event_type])))`),check("events_internal_no_hosted_fields", sql`((event_scope <> 'internal'::event_scope) OR (((capacity IS NULL) OR (capacity = 0)) AND ((budget IS NULL) OR (budget = (0)::numeric)) AND ((sponsors_target IS NULL) OR (sponsors_target = 0)) AND ((sponsors_confirmed IS NULL) OR (sponsors_confirmed = 0)) AND ((health_score IS NULL) OR (health_score = 0)) AND ((tasks_total IS NULL) OR (tasks_total = 0)) AND ((tasks_completed IS NULL) OR (tasks_completed = 0))))`),check("events_internal_valid_type", sql`((event_scope <> 'internal'::event_scope) OR (event_type = ANY (ARRAY['meeting'::event_type, 'call'::event_type, 'pitch'::event_type, 'demo'::event_type, 'reminder'::event_type, 'milestone'::event_type, 'deadline'::event_type, 'funding_round'::event_type, 'other'::event_type])))`),check("events_relevance_score_check", sql`((relevance_score >= 0) AND (relevance_score <= 100))`),]);

export const experimentResults = pgTable.withRLS("experiment_results", {
	id: uuid().defaultRandom().primaryKey(),
	experimentId: uuid("experiment_id").notNull().references(() => experiments.id, { onDelete: "cascade" } ),
	participantId: text("participant_id"),
	resultType: text("result_type").notNull(),
	data: jsonb().default({}).notNull(),
	rawNotes: text("raw_notes"),
	summary: text(),
	supportsHypothesis: boolean("supports_hypothesis"),
	sentiment: text(),
	confidence: numeric({ precision: 3, scale: 2 }),
	aiAnalyzed: boolean("ai_analyzed").default(false),
	aiInsights: jsonb("ai_insights").default([]),
	source: text(),
	recordedAt: timestamp("recorded_at", { withTimezone: true }).default(sql`now()`),
	recordedBy: uuid("recorded_by").references(() => usersInAuth.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_experiment_results_experiment_id").using("btree", table.experimentId.asc().nullsLast()),
	index("idx_experiment_results_recorded_by").using("btree", table.recordedBy.asc().nullsLast()),

	pgPolicy("experiment_results_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("experiment_results_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("experiment_results_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("experiment_results_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(experiment_id IN ( SELECT e.id
   FROM (((experiments e
     JOIN assumptions a ON ((a.id = e.assumption_id)))
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("experiment_results_confidence_check", sql`((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))`),check("experiment_results_result_type_check", sql`(result_type = ANY (ARRAY['interview_response'::text, 'survey_response'::text, 'conversion_event'::text, 'signup_event'::text, 'engagement_metric'::text, 'feedback'::text, 'observation'::text, 'other'::text]))`),check("experiment_results_sentiment_check", sql`(sentiment = ANY (ARRAY['positive'::text, 'negative'::text, 'neutral'::text, 'mixed'::text]))`),]);

export const experiments = pgTable.withRLS("experiments", {
	id: uuid().defaultRandom().primaryKey(),
	assumptionId: uuid("assumption_id").notNull().references(() => assumptions.id, { onDelete: "cascade" } ),
	experimentType: experimentType("experiment_type").notNull(),
	title: text().notNull(),
	hypothesis: text().notNull(),
	successCriteria: text("success_criteria").notNull(),
	method: text(),
	status: experimentStatus().default("designed").notNull(),
	targetSampleSize: integer("target_sample_size").default(5),
	actualSampleSize: integer("actual_sample_size").default(0),
	plannedStartDate: date("planned_start_date"),
	plannedEndDate: date("planned_end_date"),
	startedAt: timestamp("started_at", { withTimezone: true }),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	outcome: text(),
	confidenceLevel: numeric("confidence_level", { precision: 3, scale: 2 }),
	summary: text(),
	aiDesigned: boolean("ai_designed").default(false),
	aiSuggestions: jsonb("ai_suggestions").default([]),
	notes: text(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_experiments_assumption_id").using("btree", table.assumptionId.asc().nullsLast()),

	pgPolicy("experiments_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("experiments_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("experiments_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("experiments_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(assumption_id IN ( SELECT a.id
   FROM ((assumptions a
     JOIN startups s ON ((s.id = a.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("experiments_confidence_level_check", sql`((confidence_level >= (0)::numeric) AND (confidence_level <= (1)::numeric))`),check("experiments_outcome_check", sql`(outcome = ANY (ARRAY['validated'::text, 'invalidated'::text, 'inconclusive'::text]))`),]);

export const featurePackRouting = pgTable.withRLS("feature_pack_routing", {
	id: uuid().defaultRandom().primaryKey(),
	featureRoute: text("feature_route").notNull(),
	intent: text(),
	defaultPackSlug: text("default_pack_slug").notNull(),
	industryOverridePattern: text("industry_override_pattern"),
	stageOverridePattern: text("stage_override_pattern"),
	priority: integer().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("Anyone can view feature pack routing", { for: "select", to: ["anon", "authenticated"], using: sql`true` }),
]);

export const fileUploads = pgTable.withRLS("file_uploads", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	uploadedBy: uuid("uploaded_by").notNull().references(() => profiles.id),
	filename: text().notNull(),
	originalFilename: text("original_filename").notNull(),
	mimeType: text("mime_type").notNull(),
	sizeBytes: bigint("size_bytes", { mode: 'number' }).notNull(),
	storagePath: text("storage_path").notNull(),
	bucket: text().default("uploads"),
	category: text(),
	aiExtracted: boolean("ai_extracted").default(false),
	aiSummary: text("ai_summary"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_file_uploads_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_file_uploads_uploaded_by").using("btree", table.uploadedBy.asc().nullsLast()),

	pgPolicy("Users delete file uploads in org", { for: "delete", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users insert file uploads in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users update file uploads in org", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view file uploads in org", { for: "select", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),
check("file_uploads_category_check", sql`(category = ANY (ARRAY['pitch_deck'::text, 'financial'::text, 'legal'::text, 'product'::text, 'marketing'::text, 'other'::text]))`),]);

export const financialModels = pgTable.withRLS("financial_models", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	modelType: text("model_type").default("basic").notNull(),
	monthlyBurn: numeric("monthly_burn"),
	monthlyRevenue: numeric("monthly_revenue"),
	runwayMonths: integer("runway_months"),
	projections: jsonb().default({}).notNull(),
	assumptions: jsonb().default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_financial_models_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("financial_models_delete_org", { for: "delete", to: ["authenticated"], using: sql`( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org)` }),

	pgPolicy("financial_models_insert_org", { for: "insert", to: ["authenticated"], withCheck: sql`( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org)` }),

	pgPolicy("financial_models_select_org", { for: "select", to: ["authenticated"], using: sql`( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org)` }),

	pgPolicy("financial_models_update_org", { for: "update", to: ["authenticated"], using: sql`( SELECT startup_in_org(financial_models.startup_id) AS startup_in_org)` }),
]);

export const industryEvents = pgTable.withRLS("industry_events", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	fullName: text("full_name"),
	slug: text(),
	description: text(),
	categories: eventCategory().array().default([]),
	topics: text().array().default([]),
	audienceTypes: text("audience_types").array().default([]),
	eventDate: date("event_date"),
	endDate: date("end_date"),
	datesConfirmed: boolean("dates_confirmed").default(false),
	typicalMonth: text("typical_month"),
	timezone: text().default("UTC"),
	locationCity: text("location_city"),
	locationCountry: text("location_country"),
	venue: text(),
	format: eventFormat().default("in_person"),
	ticketCostTier: ticketCostTier("ticket_cost_tier").default("medium"),
	ticketCostMin: numeric("ticket_cost_min", { precision: 10, scale: 2 }),
	ticketCostMax: numeric("ticket_cost_max", { precision: 10, scale: 2 }),
	startupRelevance: integer("startup_relevance").default(3),
	expectedAttendance: integer("expected_attendance"),
	websiteUrl: text("website_url"),
	twitterHandle: text("twitter_handle"),
	linkedinUrl: text("linkedin_url"),
	youtubeUrl: text("youtube_url"),
	cfpUrl: text("cfp_url"),
	registrationUrl: text("registration_url"),
	mediaPassAvailable: mediaPassStatus("media_pass_available").default("unclear"),
	notableSpeakers: text("notable_speakers").array().default([]),
	tags: text().array().default([]),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	imageUrl: text("image_url"),
	imagePath: text("image_path"),
	enrichedAt: timestamp("enriched_at", { withTimezone: true }),
	enrichmentStatus: text("enrichment_status"),
	sourceDomain: text("source_domain"),
	enrichmentMetadata: jsonb("enrichment_metadata").default({}),
	cloudinaryPublicId: text("cloudinary_public_id"),
	cloudinaryVersion: integer("cloudinary_version"),
	cloudinaryFolder: text("cloudinary_folder").default("industry-events"),
}, (table) => [
	index("idx_industry_events_event_date").using("btree", table.eventDate.asc().nullsLast()),
	index("idx_industry_events_startup_relevance").using("btree", table.startupRelevance.desc().nullsFirst()),
	unique("industry_events_slug_key").on(table.slug),
	pgPolicy("Admin users can delete industry events", { for: "delete", to: ["authenticated"], using: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Admin users can insert industry events", { for: "insert", to: ["authenticated"], withCheck: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Admin users can update industry events", { for: "update", to: ["authenticated"], using: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)`, withCheck: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Anon users can read industry events", { for: "select", to: ["anon"], using: sql`true` }),

	pgPolicy("Authenticated users can read industry events", { for: "select", to: ["authenticated"], using: sql`true` }),
check("industry_events_enrichment_status_check", sql`(enrichment_status = ANY (ARRAY['success'::text, 'partial'::text, 'needs_review'::text, 'failed'::text]))`),check("industry_events_startup_relevance_check", sql`((startup_relevance >= 1) AND (startup_relevance <= 5))`),]);

export const industryPlaybooks = pgTable.withRLS("industry_playbooks", {
	id: uuid().defaultRandom().primaryKey(),
	industryId: text("industry_id").notNull(),
	displayName: text("display_name").notNull(),
	narrativeArc: text("narrative_arc"),
	promptContext: text("prompt_context"),
	investorExpectations: jsonb("investor_expectations").default({}).notNull(),
	failurePatterns: jsonb("failure_patterns").default([]).notNull(),
	successStories: jsonb("success_stories").default([]).notNull(),
	benchmarks: jsonb().default([]).notNull(),
	terminology: jsonb().default({}).notNull(),
	gtmPatterns: jsonb("gtm_patterns").default([]).notNull(),
	decisionFrameworks: jsonb("decision_frameworks").default([]).notNull(),
	investorQuestions: jsonb("investor_questions").default([]).notNull(),
	warningSigns: jsonb("warning_signs").default([]).notNull(),
	stageChecklists: jsonb("stage_checklists").default([]).notNull(),
	slideEmphasis: jsonb("slide_emphasis").default([]),
	version: integer().default(1).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	source: text().default("system"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_industry_playbooks_industry_id").using("btree", table.industryId.asc().nullsLast()),
	unique("industry_playbooks_industry_id_key").on(table.industryId),
	pgPolicy("Anyone can view active industry playbooks", { for: "select", to: ["anon", "authenticated"], using: sql`(is_active = true)` }),
]);

export const integrations = pgTable.withRLS("integrations", {
	id: uuid().defaultRandom().primaryKey(),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	provider: text().notNull(),
	status: text().default("active"),
	accessTokenEncrypted: text("access_token_encrypted"),
	refreshTokenEncrypted: text("refresh_token_encrypted"),
	tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true }),
	scopes: text().array().default([]),
	settings: jsonb().default({}),
	lastSyncAt: timestamp("last_sync_at", { withTimezone: true }),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	unique("integrations_org_id_provider_key").on(table.orgId, table.provider),
	pgPolicy("Admins delete integrations", { for: "delete", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Admins insert integrations", { for: "insert", to: ["authenticated"], withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Admins update integrations", { for: "update", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))`, withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Users view integrations in org", { for: "select", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),
check("integrations_provider_check", sql`(provider = ANY (ARRAY['stripe'::text, 'slack'::text, 'hubspot'::text, 'salesforce'::text, 'linkedin'::text, 'google'::text, 'notion'::text]))`),check("integrations_status_check", sql`(status = ANY (ARRAY['pending'::text, 'active'::text, 'error'::text, 'disconnected'::text]))`),]);

export const interviewInsights = pgTable.withRLS("interview_insights", {
	id: uuid().defaultRandom().primaryKey(),
	interviewId: uuid("interview_id").notNull().references(() => interviews.id, { onDelete: "cascade" } ),
	insightType: insightType("insight_type").notNull(),
	insight: text().notNull(),
	sourceQuote: text("source_quote"),
	quoteTimestamp: text("quote_timestamp"),
	confidence: numeric({ mode: 'number', precision: 3, scale: 2 }).default(0.5).notNull(),
	importance: integer().default(5),
	sentiment: text(),
	linkedAssumptionIds: uuid("linked_assumption_ids").array().default([]),
	supportsAssumptions: boolean("supports_assumptions"),
	tags: text().array().default([]),
	aiModel: text("ai_model"),
	extractionPromptVersion: text("extraction_prompt_version"),
	isValidated: boolean("is_validated").default(false),
	validatedBy: uuid("validated_by").references(() => usersInAuth.id),
	validatedAt: timestamp("validated_at", { withTimezone: true }),
	isDismissed: boolean("is_dismissed").default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	riskType: text("risk_type"),
	isLocked: boolean("is_locked").default(false),
	depth: text().default("none"),
	hypothesisId: uuid("hypothesis_id").references(() => assumptions.id),
}, (table) => [
	index("idx_interview_insights_hypothesis_id").using("btree", table.hypothesisId.asc().nullsLast()),
	index("idx_interview_insights_interview_id").using("btree", table.interviewId.asc().nullsLast()),
	index("idx_interview_insights_validated_by").using("btree", table.validatedBy.asc().nullsLast()),

	pgPolicy("interview_insights_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interview_insights_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interview_insights_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interview_insights_update_authenticated", { for: "update", to: ["authenticated"], using: sql`((interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))) AND (NOT is_locked))`, withCheck: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("interview_insights_confidence_check", sql`((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))`),check("interview_insights_depth_check", sql`(depth = ANY (ARRAY['none'::text, 'shallow'::text, 'deep'::text]))`),check("interview_insights_importance_check", sql`((importance >= 1) AND (importance <= 10))`),check("interview_insights_risk_type_check", sql`(risk_type = ANY (ARRAY['market'::text, 'technical'::text, 'regulatory'::text, 'competitive'::text, 'financial'::text]))`),check("interview_insights_sentiment_check", sql`(sentiment = ANY (ARRAY['positive'::text, 'negative'::text, 'neutral'::text, 'mixed'::text]))`),]);

export const interviewQuestions = pgTable.withRLS("interview_questions", {
	id: uuid().defaultRandom().primaryKey(),
	interviewId: uuid("interview_id").notNull().references(() => interviews.id, { onDelete: "cascade" } ),
	questionText: text("question_text").notNull(),
	questionType: text("question_type").notNull(),
	hypothesisId: uuid("hypothesis_id").references(() => assumptions.id),
	decisionUnlocked: text("decision_unlocked"),
	answerText: text("answer_text"),
	sequenceOrder: integer("sequence_order").notNull(),
	askedAt: timestamp("asked_at", { withTimezone: true }),
	answeredAt: timestamp("answered_at", { withTimezone: true }),
	skipped: boolean().default(false),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_interview_questions_hypothesis_id").using("btree", table.hypothesisId.asc().nullsLast()),
	index("idx_interview_questions_interview_id").using("btree", table.interviewId.asc().nullsLast()),

	pgPolicy("interview_questions_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interview_questions_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interview_questions_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interview_questions_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(interview_id IN ( SELECT i.id
   FROM ((interviews i
     JOIN startups s ON ((s.id = i.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("interview_questions_question_type_check", sql`(question_type = ANY (ARRAY['discovery'::text, 'hypothesis'::text, 'invalidation'::text, 'depth'::text, 'confirmation'::text]))`),]);

export const interviews = pgTable.withRLS("interviews", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	segmentId: uuid("segment_id").references(() => customerSegments.id, { onDelete: "set null" } ),
	experimentId: uuid("experiment_id").references(() => experiments.id, { onDelete: "set null" } ),
	interviewType: interviewType("interview_type").default("problem_discovery").notNull(),
	status: interviewStatus().default("scheduled").notNull(),
	intervieweeName: text("interviewee_name"),
	intervieweeRole: text("interviewee_role"),
	intervieweeCompany: text("interviewee_company"),
	intervieweeEmail: text("interviewee_email"),
	isAnonymous: boolean("is_anonymous").default(false),
	scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
	conductedAt: timestamp("conducted_at", { withTimezone: true }),
	durationMinutes: integer("duration_minutes"),
	transcript: text(),
	rawNotes: text("raw_notes"),
	summary: text(),
	recordingUrl: text("recording_url"),
	recordingConsent: boolean("recording_consent").default(false),
	questionsUsed: jsonb("questions_used").default([]),
	interviewGuideId: uuid("interview_guide_id"),
	aiAnalyzed: boolean("ai_analyzed").default(false),
	aiAnalyzedAt: timestamp("ai_analyzed_at", { withTimezone: true }),
	aiSummary: text("ai_summary"),
	aiSentiment: text("ai_sentiment"),
	aiKeyQuotes: jsonb("ai_key_quotes").default([]),
	conductedBy: uuid("conducted_by").references(() => usersInAuth.id),
	location: text(),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	interviewMode: text("interview_mode").default("smart"),
	readinessScore: numeric("readiness_score"),
}, (table) => [
	index("idx_interviews_conducted_at").using("btree", table.startupId.asc().nullsLast(), table.conductedAt.desc().nullsFirst()),
	index("idx_interviews_conducted_by").using("btree", table.conductedBy.asc().nullsLast()),
	index("idx_interviews_experiment_id").using("btree", table.experimentId.asc().nullsLast()),
	index("idx_interviews_segment_id").using("btree", table.segmentId.asc().nullsLast()),

	pgPolicy("interviews_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interviews_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interviews_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("interviews_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("interviews_ai_sentiment_check", sql`(ai_sentiment = ANY (ARRAY['positive'::text, 'negative'::text, 'neutral'::text, 'mixed'::text]))`),check("interviews_interview_mode_check", sql`(interview_mode = ANY (ARRAY['smart'::text, 'quick'::text, 'deep'::text]))`),check("interviews_readiness_score_check", sql`((readiness_score >= (0)::numeric) AND (readiness_score <= (100)::numeric))`),]);

export const investors = pgTable.withRLS("investors", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	firmName: text("firm_name"),
	email: text(),
	phone: text(),
	title: text(),
	linkedinUrl: text("linkedin_url"),
	twitterUrl: text("twitter_url"),
	websiteUrl: text("website_url"),
	type: text().default("vc"),
	investmentFocus: text("investment_focus").array(),
	stageFocus: text("stage_focus").array(),
	checkSizeMin: numeric("check_size_min"),
	checkSizeMax: numeric("check_size_max"),
	portfolioCompanies: text("portfolio_companies").array(),
	status: text().default("researching"),
	priority: text().default("medium"),
	warmIntroFrom: text("warm_intro_from"),
	firstContactDate: date("first_contact_date"),
	lastContactDate: date("last_contact_date"),
	nextFollowUp: date("next_follow_up"),
	meetingsCount: integer("meetings_count").default(0),
	notes: text(),
	tags: text().array(),
	customFields: jsonb("custom_fields"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_investors_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Authenticated users delete investors in org", { for: "delete", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Authenticated users insert investors in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Authenticated users update investors in org", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Authenticated users view investors in org", { for: "select", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),
]);

export const jobsToBeDone = pgTable.withRLS("jobs_to_be_done", {
	id: uuid().defaultRandom().primaryKey(),
	segmentId: uuid("segment_id").notNull().references(() => customerSegments.id, { onDelete: "cascade" } ),
	jobType: jobType("job_type").notNull(),
	situation: text().notNull(),
	motivation: text().notNull(),
	expectedOutcome: text("expected_outcome").notNull(),
	jobStatement: text("job_statement").generatedAlwaysAs(sql`((((('When I '::text || situation) || ', I want to '::text) || motivation) || ' so I can '::text) || expected_outcome)`),
	importance: integer().default(5),
	currentSatisfaction: integer("current_satisfaction").default(5),
	opportunityScore: integer("opportunity_score").generatedAlwaysAs(sql`(importance - current_satisfaction)`),
	frequency: text(),
	relatedFunctionalJobId: uuid("related_functional_job_id"),
	source: text(),
	sourceInterviewId: uuid("source_interview_id"),
	isValidated: boolean("is_validated").default(false),
	validatedAt: timestamp("validated_at", { withTimezone: true }),
	interviewCount: integer("interview_count").default(0),
	aiGenerated: boolean("ai_generated").default(false),
	priority: integer().default(1),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	foreignKey({
		columns: [table.relatedFunctionalJobId],
		foreignColumns: [table.id],
		name: "jobs_to_be_done_related_functional_job_id_fkey"
	}),
	index("idx_jobs_to_be_done_related_functional_job_id").using("btree", table.relatedFunctionalJobId.asc().nullsLast()),
	index("idx_jobs_to_be_done_segment_id").using("btree", table.segmentId.asc().nullsLast()),

	pgPolicy("jobs_to_be_done_delete_authenticated", { for: "delete", to: ["authenticated"], using: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("jobs_to_be_done_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("jobs_to_be_done_select_authenticated", { for: "select", to: ["authenticated"], using: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("jobs_to_be_done_update_authenticated", { for: "update", to: ["authenticated"], using: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))`, withCheck: sql`(segment_id IN ( SELECT cs.id
   FROM ((customer_segments cs
     JOIN startups s ON ((s.id = cs.startup_id)))
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("jobs_to_be_done_current_satisfaction_check", sql`((current_satisfaction >= 1) AND (current_satisfaction <= 10))`),check("jobs_to_be_done_frequency_check", sql`(frequency = ANY (ARRAY['hourly'::text, 'daily'::text, 'weekly'::text, 'monthly'::text, 'quarterly'::text, 'yearly'::text, 'situational'::text]))`),check("jobs_to_be_done_importance_check", sql`((importance >= 1) AND (importance <= 10))`),check("jobs_to_be_done_source_check", sql`(source = ANY (ARRAY['interview'::text, 'survey'::text, 'observation'::text, 'assumption'::text, 'research'::text]))`),]);

export const knowledgeChunks = pgTable.withRLS("knowledge_chunks", {
	id: uuid().defaultRandom().primaryKey(),
	content: text().notNull(),
	source: text().notNull(),
	sourceType: text("source_type").notNull(),
	sourceUrl: text("source_url"),
	year: integer().notNull(),
	sampleSize: integer("sample_size"),
	confidence: text().default("medium").notNull(),
	category: text().notNull(),
	subcategory: text(),
	tags: text().array().default([]),
	industry: text(),
	stage: text(),
	region: text(),
	fetchCount: integer("fetch_count").default(0).notNull(),
	lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	embedding: vector({ dimensions: 1536 }),
	documentId: uuid("document_id").references(() => knowledgeDocuments.id, { onDelete: "set null" } ),
	pageStart: integer("page_start"),
	pageEnd: integer("page_end"),
	sectionTitle: text("section_title"),
}, (table) => [
	index("idx_knowledge_chunks_category").using("btree", table.category.asc().nullsLast()),
	index("idx_knowledge_chunks_document_id").using("btree", table.documentId.asc().nullsLast()),
	index("idx_knowledge_chunks_industry").using("btree", table.industry.asc().nullsLast()).where(sql`(industry IS NOT NULL)`),
	index("idx_knowledge_chunks_source_type").using("btree", table.sourceType.asc().nullsLast()),
	index("idx_knowledge_chunks_year").using("btree", table.year.desc().nullsFirst()),
	index("knowledge_chunks_embedding_idx").using("hnsw", table.embedding.asc().nullsLast().op("hnsw")).with({ "m": 16, "ef_construction": 64 }),
	index("knowledge_chunks_industry_idx").using("btree", table.industry.asc().nullsLast()),

	pgPolicy("authenticated users can read knowledge", { for: "select", to: ["authenticated"], using: sql`true` }),

	pgPolicy("service role can manage knowledge", { to: ["service_role"], using: sql`true`, withCheck: sql`true` }),
check("knowledge_chunks_confidence_check", sql`(confidence = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]))`),]);

export const knowledgeDocuments = pgTable.withRLS("knowledge_documents", {
	id: uuid().defaultRandom().primaryKey(),
	title: text().notNull(),
	sourceType: text("source_type"),
	year: integer(),
	llamaParseId: text("llama_parse_id"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	contentHash: text("content_hash"),
}, (table) => [
	uniqueIndex("idx_knowledge_documents_content_hash").using("btree", table.contentHash.asc().nullsLast()).where(sql`(content_hash IS NOT NULL)`),

	pgPolicy("authenticated can read knowledge_documents", { for: "select", to: ["authenticated"], using: sql`true` }),

	pgPolicy("service_role can manage knowledge_documents", { to: ["service_role"], using: sql`true`, withCheck: sql`true` }),
]);

export const knowledgeMap = pgTable.withRLS("knowledge_map", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	dimension: text().notNull(),
	confidenceScore: integer("confidence_score").default(0).notNull(),
	sourceTier: text("source_tier").default("T4").notNull(),
	evidenceCount: integer("evidence_count").default(0).notNull(),
	keyInsights: jsonb("key_insights").default([]).notNull(),
	gaps: jsonb().default([]).notNull(),
	lastUpdatedFrom: text("last_updated_from"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_knowledge_map_startup").using("btree", table.startupId.asc().nullsLast()),
	unique("knowledge_map_startup_id_dimension_key").on(table.startupId, table.dimension),
	pgPolicy("Users can create knowledge map entries", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can delete knowledge map entries", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can update knowledge map entries", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can view own knowledge map", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
check("knowledge_map_confidence_score_check", sql`((confidence_score >= 0) AND (confidence_score <= 100))`),check("knowledge_map_dimension_check", sql`(dimension = ANY (ARRAY['customer'::text, 'market'::text, 'product'::text, 'business_model'::text, 'technology'::text]))`),check("knowledge_map_source_tier_check", sql`(source_tier = ANY (ARRAY['T1'::text, 'T2'::text, 'T3'::text, 'T4'::text]))`),]);

export const leanCanvasVersions = pgTable.withRLS("lean_canvas_versions", {
	id: uuid().defaultRandom().primaryKey(),
	canvasId: uuid("canvas_id").notNull().references(() => leanCanvases.id, { onDelete: "cascade" } ),
	versionNumber: integer("version_number").default(1).notNull(),
	contentJson: jsonb("content_json").notNull(),
	changeSummary: text("change_summary"),
	createdBy: uuid("created_by").references(() => usersInAuth.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_lean_canvas_versions_created_by").using("btree", table.createdBy.asc().nullsLast()),
	unique("lean_canvas_versions_canvas_id_version_number_key").on(table.canvasId, table.versionNumber),
	pgPolicy("Users can create canvas versions", { for: "insert", to: ["authenticated"], withCheck: sql`(canvas_id IN ( SELECT lc.id
   FROM (lean_canvases lc
     JOIN startups s ON ((lc.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can delete canvas versions", { for: "delete", to: ["authenticated"], using: sql`(canvas_id IN ( SELECT lc.id
   FROM (lean_canvases lc
     JOIN startups s ON ((lc.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can view own canvas versions", { for: "select", to: ["authenticated"], using: sql`(canvas_id IN ( SELECT lc.id
   FROM (lean_canvases lc
     JOIN startups s ON ((lc.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
]);

export const leanCanvases = pgTable.withRLS("lean_canvases", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	problem: text(),
	customerSegments: text("customer_segments"),
	uniqueValueProposition: text("unique_value_proposition"),
	solution: text(),
	channels: text(),
	revenueStreams: text("revenue_streams"),
	costStructure: text("cost_structure"),
	keyMetrics: text("key_metrics"),
	unfairAdvantage: text("unfair_advantage"),
	validationScore: numeric("validation_score", { precision: 5, scale: 2 }),
	version: integer().default(1),
	isCurrent: boolean("is_current").default(true),
	source: text().default("manual"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	playbookRunId: uuid("playbook_run_id").references(() => playbookRuns.id, { onDelete: "set null" } ),
	completenessScore: integer("completeness_score").default(0),
}, (table) => [
	index("idx_lean_canvases_current").using("btree", table.startupId.asc().nullsLast(), table.isCurrent.asc().nullsLast()).where(sql`(is_current = true)`),
	index("idx_lean_canvases_playbook_run_id").using("btree", table.playbookRunId.asc().nullsLast()),
	index("idx_lean_canvases_startup").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("lean_canvases_delete_org", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("lean_canvases_insert_org", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("lean_canvases_select_org", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("lean_canvases_update_org", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN profiles p ON ((s.org_id = p.org_id)))
  WHERE (p.id = ( SELECT auth.uid() AS uid))))` }),
]);

export const marketResearch = pgTable.withRLS("market_research", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	tamValue: numeric("tam_value"),
	tamSource: text("tam_source"),
	samValue: numeric("sam_value"),
	samSource: text("sam_source"),
	somValue: numeric("som_value"),
	somSource: text("som_source"),
	methodology: text(),
	trends: jsonb().default([]),
	marketLeaders: jsonb("market_leaders").default([]),
	emergingPlayers: jsonb("emerging_players").default([]),
	sources: jsonb().default([]),
	aiGenerated: boolean("ai_generated").default(true),
	confidenceScore: numeric("confidence_score", { precision: 3, scale: 2 }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_market_research_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users can delete market research for their startups", { for: "delete", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users can insert market research for their startups", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users can update market research for their startups", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users can view market research for their startups", { for: "select", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),
]);

export const messages = pgTable.withRLS("messages", {
	id: uuid().defaultRandom().primaryKey(),
	startupEventId: uuid("startup_event_id").notNull(),
	attendeeId: uuid("attendee_id").references(() => eventAttendees.id, { onDelete: "set null" } ),
	broadcastId: uuid("broadcast_id"),
	channel: messageChannel().default("whatsapp").notNull(),
	direction: messageDirection().notNull(),
	messageType: messageType("message_type").default("text").notNull(),
	status: messageStatus().default("pending").notNull(),
	content: text().notNull(),
	templateName: text("template_name"),
	templateParams: jsonb("template_params").default({}),
	mediaUrl: text("media_url"),
	mediaType: text("media_type"),
	recipientPhone: text("recipient_phone"),
	recipientName: text("recipient_name"),
	recipientEmail: text("recipient_email"),
	aiHandled: boolean("ai_handled").default(false),
	aiConfidence: numeric("ai_confidence", { precision: 5, scale: 4 }),
	aiIntent: text("ai_intent"),
	aiResponseTimeMs: integer("ai_response_time_ms"),
	escalated: boolean().default(false),
	escalationReason: text("escalation_reason"),
	escalatedAt: timestamp("escalated_at", { withTimezone: true }),
	escalatedTo: uuid("escalated_to").references(() => usersInAuth.id, { onDelete: "set null" } ),
	resolved: boolean().default(false),
	resolvedAt: timestamp("resolved_at", { withTimezone: true }),
	externalMessageId: text("external_message_id"),
	conversationId: text("conversation_id"),
	sentAt: timestamp("sent_at", { withTimezone: true }),
	deliveredAt: timestamp("delivered_at", { withTimezone: true }),
	readAt: timestamp("read_at", { withTimezone: true }),
	failedAt: timestamp("failed_at", { withTimezone: true }),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
}, (table) => [
	index("idx_messages_attendee_id").using("btree", table.attendeeId.asc().nullsLast()),
	index("idx_messages_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_messages_escalated_to").using("btree", table.escalatedTo.asc().nullsLast()),
	index("idx_messages_event_id").using("btree", table.eventId.asc().nullsLast()),

	pgPolicy("authenticated can delete messages", { for: "delete", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can insert messages", { for: "insert", to: ["authenticated"], withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can select messages", { for: "select", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can update messages", { for: "update", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))`, withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),
check("event_messages_ai_confidence_check", sql`((ai_confidence >= (0)::numeric) AND (ai_confidence <= (1)::numeric))`),]);

export const metricSnapshots = pgTable.withRLS("metric_snapshots", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	snapshotDate: date("snapshot_date").default(sql`CURRENT_DATE`).notNull(),
	snapshotType: text("snapshot_type").default("daily").notNull(),
	tasksTotal: integer("tasks_total").default(0).notNull(),
	tasksCompleted: integer("tasks_completed").default(0).notNull(),
	tasksInProgress: integer("tasks_in_progress").default(0).notNull(),
	tasksOverdue: integer("tasks_overdue").default(0).notNull(),
	contactsTotal: integer("contacts_total").default(0).notNull(),
	contactsThisWeek: integer("contacts_this_week").default(0).notNull(),
	dealsTotal: integer("deals_total").default(0).notNull(),
	dealsActive: integer("deals_active").default(0).notNull(),
	dealsWon: integer("deals_won").default(0).notNull(),
	dealsValueTotal: numeric("deals_value_total", { mode: 'number', precision: 15, scale: 2 }).default(0).notNull(),
	documentsTotal: integer("documents_total").default(0).notNull(),
	canvasCompletionPct: integer("canvas_completion_pct").default(0).notNull(),
	pitchDeckSlides: integer("pitch_deck_slides").default(0).notNull(),
	validationScore: integer("validation_score"),
	experimentsTotal: integer("experiments_total").default(0).notNull(),
	experimentsCompleted: integer("experiments_completed").default(0).notNull(),
	interviewsTotal: integer("interviews_total").default(0).notNull(),
	activitiesThisWeek: integer("activities_this_week").default(0).notNull(),
	aiRunsThisWeek: integer("ai_runs_this_week").default(0).notNull(),
	healthScore: integer("health_score"),
	momentumScore: integer("momentum_score"),
	engagementScore: integer("engagement_score"),
	rawMetrics: jsonb("raw_metrics").default({}).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	uniqueIndex("idx_metric_snapshots_unique_daily").using("btree", table.startupId.asc().nullsLast(), table.snapshotDate.asc().nullsLast(), table.snapshotType.asc().nullsLast()),

	pgPolicy("users can create metric snapshots", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can delete metric snapshots", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can update metric snapshots", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can view startup metric snapshots", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM startups s
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
]);

export const notifications = pgTable.withRLS("notifications", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	type: text().notNull(),
	title: text().notNull(),
	content: text(),
	link: text(),
	priority: text().default("normal"),
	isRead: boolean("is_read").default(false),
	readAt: timestamp("read_at", { withTimezone: true }),
	expiresAt: timestamp("expires_at", { withTimezone: true }),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_notifications_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users delete own notifications", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users insert own notifications", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users update own notifications", { for: "update", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))`, withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view own notifications", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("notifications_priority_check", sql`(priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text]))`),check("notifications_type_check", sql`(type = ANY (ARRAY['task_due'::text, 'deal_update'::text, 'ai_suggestion'::text, 'risk_alert'::text, 'system'::text, 'mention'::text]))`),]);

export const onboardingQuestions = pgTable.withRLS("onboarding_questions", {
	id: text().primaryKey(),
	text: text().notNull(),
	type: questionType().default("multiple_choice").notNull(),
	topic: text().notNull(),
	whyMatters: text("why_matters"),
	options: jsonb(),
	isActive: boolean("is_active").default(true).notNull(),
	displayOrder: integer("display_order"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("Authenticated users can read active questions", { for: "select", to: ["authenticated"], using: sql`(is_active = true)` }),

	pgPolicy("Service role has full access", { to: ["service_role"], using: sql`true`, withCheck: sql`true` }),
check("valid_options", sql`((type = ANY (ARRAY['text'::question_type, 'number'::question_type])) OR ((options IS NOT NULL) AND (jsonb_array_length(options) > 0)))`),]);

export const opportunityCanvas = pgTable.withRLS("opportunity_canvas", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	marketReadiness: integer("market_readiness"),
	technicalFeasibility: integer("technical_feasibility"),
	competitiveAdvantage: integer("competitive_advantage"),
	executionCapability: integer("execution_capability"),
	timingScore: integer("timing_score"),
	opportunityScore: integer("opportunity_score"),
	adoptionBarriers: jsonb("adoption_barriers").default([]),
	enablers: jsonb().default([]),
	strategicFit: text("strategic_fit"),
	recommendation: text(),
	reasoning: text(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	vpcData: jsonb("vpc_data").default({}),
}, (table) => [
	index("idx_opportunity_canvas_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users can delete opportunity canvas for their startups", { for: "delete", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users can insert opportunity canvas for their startups", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users can update opportunity canvas for their startups", { for: "update", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users can view opportunity canvas for their startups", { for: "select", to: ["authenticated"], using: sql`startup_in_org(startup_id)` }),
check("opportunity_canvas_competitive_advantage_check", sql`((competitive_advantage >= 0) AND (competitive_advantage <= 100))`),check("opportunity_canvas_execution_capability_check", sql`((execution_capability >= 0) AND (execution_capability <= 100))`),check("opportunity_canvas_market_readiness_check", sql`((market_readiness >= 0) AND (market_readiness <= 100))`),check("opportunity_canvas_recommendation_check", sql`(recommendation = ANY (ARRAY['pursue'::text, 'explore'::text, 'defer'::text, 'reject'::text]))`),check("opportunity_canvas_technical_feasibility_check", sql`((technical_feasibility >= 0) AND (technical_feasibility <= 100))`),check("opportunity_canvas_timing_score_check", sql`((timing_score >= 0) AND (timing_score <= 100))`),]);

export const orgMembers = pgTable.withRLS("org_members", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	role: text().default("member"),
	invitedBy: uuid("invited_by").references(() => profiles.id),
	invitedEmail: text("invited_email"),
	joinedAt: timestamp("joined_at", { withTimezone: true }),
	status: text().default("pending"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_org_members_invited_by").using("btree", table.invitedBy.asc().nullsLast()).where(sql`(invited_by IS NOT NULL)`),
	index("idx_org_members_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_org_members_user_id").using("btree", table.userId.asc().nullsLast()),
	unique("org_members_user_id_org_id_key").on(table.userId, table.orgId),
	pgPolicy("Admins delete org memberships", { for: "delete", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Admins insert org memberships", { for: "insert", to: ["authenticated"], withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Admins update org memberships", { for: "update", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))`, withCheck: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Users view org memberships", { for: "select", to: ["authenticated"], using: sql`((user_id = ( SELECT auth.uid() AS uid)) OR (org_id = ( SELECT user_org_id() AS user_org_id)))` }),
check("org_members_role_check", sql`(role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text]))`),check("org_members_status_check", sql`(status = ANY (ARRAY['pending'::text, 'active'::text, 'inactive'::text]))`),]);

export const organizations = pgTable.withRLS("organizations", {
	id: uuid().defaultRandom().primaryKey(),
	name: text().notNull(),
	slug: text().notNull(),
	logoUrl: text("logo_url"),
	settings: jsonb().default({"features":{"deep_research":true,"image_generation":false},"default_model":"gemini-3-flash-preview","ai_daily_cap_usd":50}),
	subscriptionTier: text("subscription_tier").default("free"),
	subscriptionStatus: text("subscription_status").default("active"),
	stripeCustomerId: text("stripe_customer_id"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	unique("organizations_slug_key").on(table.slug),
	pgPolicy("Admins update organization", { for: "update", to: ["authenticated"], using: sql`((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))`, withCheck: sql`((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = ANY (ARRAY['owner'::text, 'admin'::text])))` }),

	pgPolicy("Owners delete organization", { for: "delete", to: ["authenticated"], using: sql`((id = ( SELECT user_org_id() AS user_org_id)) AND (( SELECT org_role() AS org_role) = 'owner'::text))` }),

	pgPolicy("Users can create first organization only", { for: "insert", to: ["authenticated"], withCheck: sql`((( SELECT auth.uid() AS uid) IS NOT NULL) AND (NOT (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = ( SELECT auth.uid() AS uid)) AND (p.org_id IS NOT NULL))))))` }),

	pgPolicy("Users view own organization", { for: "select", to: ["authenticated"], using: sql`(id = ( SELECT user_org_id() AS user_org_id))` }),
check("organizations_subscription_status_check", sql`(subscription_status = ANY (ARRAY['active'::text, 'past_due'::text, 'cancelled'::text]))`),check("organizations_subscription_tier_check", sql`(subscription_tier = ANY (ARRAY['free'::text, 'pro'::text, 'enterprise'::text]))`),]);

export const pitchDeckSlides = pgTable.withRLS("pitch_deck_slides", {
	id: uuid().defaultRandom().primaryKey(),
	deckId: uuid("deck_id").notNull().references(() => pitchDecks.id, { onDelete: "cascade" } ),
	slideNumber: integer("slide_number").notNull(),
	slideType: slideType("slide_type").default("custom").notNull(),
	title: text(),
	subtitle: text(),
	content: jsonb().default({}),
	notes: text(),
	imageUrl: text("image_url"),
	backgroundUrl: text("background_url"),
	layout: text().default("default"),
	isVisible: boolean("is_visible").default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	version: integer().default(1),
}, (table) => [
	index("idx_pitch_deck_slides_deck_order").using("btree", table.deckId.asc().nullsLast(), table.slideNumber.asc().nullsLast()),
	index("idx_pitch_deck_slides_slide_type").using("btree", table.slideType.asc().nullsLast()),
	unique("unique_slide_number_per_deck").on(table.deckId, table.slideNumber),
	pgPolicy("Users can create slides for accessible decks", { for: "insert", to: ["authenticated"], withCheck: sql`(EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id)))))` }),

	pgPolicy("Users can delete slides for accessible decks", { for: "delete", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id)))))` }),

	pgPolicy("Users can update slides for accessible decks", { for: "update", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id)))))`, withCheck: sql`(EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id)))))` }),

	pgPolicy("Users can view slides for accessible decks", { for: "select", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM pitch_decks
  WHERE ((pitch_decks.id = pitch_deck_slides.deck_id) AND ((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(pitch_decks.startup_id)))))` }),
]);

export const pitchDecks = pgTable.withRLS("pitch_decks", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	title: text().notNull(),
	description: text(),
	status: pitchDeckStatus().default("draft").notNull(),
	template: text(),
	theme: text().default("modern"),
	deckType: text("deck_type").default("seed"),
	slideCount: integer("slide_count").default(0),
	thumbnailUrl: text("thumbnail_url"),
	isPublic: boolean("is_public").default(false),
	lastEditedBy: uuid("last_edited_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	signalStrength: integer("signal_strength").default(0),
	signalBreakdown: jsonb("signal_breakdown").default({}),
	metadata: jsonb().default({}),
	playbookRunId: uuid("playbook_run_id").references(() => playbookRuns.id, { onDelete: "set null" } ),
	industryPack: text("industry_pack"),
	wizardData: jsonb("wizard_data").default({}),
	slides: jsonb().array().default(sql`'{}'`),
	critique: jsonb().default({}),
	exportUrl: text("export_url"),
}, (table) => [
	index("idx_pitch_decks_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_pitch_decks_last_edited_by").using("btree", table.lastEditedBy.asc().nullsLast()),
	index("idx_pitch_decks_playbook_run_id").using("btree", table.playbookRunId.asc().nullsLast()),
	index("idx_pitch_decks_startup_status").using("btree", table.startupId.asc().nullsLast(), table.status.asc().nullsLast()),
	index("idx_pitch_decks_status").using("btree", table.status.asc().nullsLast()),

	pgPolicy("Users can create pitch decks for their startups", { for: "insert", to: ["authenticated"], withCheck: sql`((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id))` }),

	pgPolicy("Users can delete pitch decks for their startups", { for: "delete", to: ["authenticated"], using: sql`((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id))` }),

	pgPolicy("Users can update pitch decks for their startups", { for: "update", to: ["authenticated"], using: sql`((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id))`, withCheck: sql`((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id))` }),

	pgPolicy("Users can view pitch decks for their startups", { for: "select", to: ["authenticated"], using: sql`((( SELECT user_org_id() AS user_org_id) IS NULL) OR startup_in_org(startup_id))` }),
check("pitch_decks_deck_type_check", sql`(deck_type = ANY (ARRAY['seed'::text, 'series_a'::text, 'series_b'::text, 'growth'::text, 'custom'::text]))`),]);

export const pivotLogs = pgTable.withRLS("pivot_logs", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	assumptionId: uuid("assumption_id").references(() => assumptions.id, { onDelete: "set null" } ),
	pivotType: text("pivot_type").notNull(),
	oldValue: text("old_value"),
	newValue: text("new_value"),
	reason: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_pivot_logs_assumption_id").using("btree", table.assumptionId.asc().nullsLast()),
	index("idx_pivot_logs_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("delete_own_pivot_logs", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("insert_own_pivot_logs", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("select_own_pivot_logs", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT startups.id
   FROM startups
  WHERE (startups.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
check("pivot_logs_pivot_type_check", sql`(pivot_type = ANY (ARRAY['audience'::text, 'pain'::text, 'solution'::text, 'stage_advance'::text]))`),]);

export const playbookRuns = pgTable.withRLS("playbook_runs", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "cascade" } ),
	playbookType: text("playbook_type").notNull(),
	status: text().default("in_progress"),
	currentStep: integer("current_step").default(1),
	totalSteps: integer("total_steps"),
	stepData: jsonb("step_data").default({}),
	metadata: jsonb().default({}),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_playbook_runs_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users can insert their own startup playbook runs", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM ((startups s
     JOIN organizations o ON ((s.org_id = o.id)))
     JOIN org_members om ON ((o.id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("Users can update their own startup playbook runs", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM ((startups s
     JOIN organizations o ON ((s.org_id = o.id)))
     JOIN org_members om ON ((o.id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("Users can view their own startup playbook runs", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM ((startups s
     JOIN organizations o ON ((s.org_id = o.id)))
     JOIN org_members om ON ((o.id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("playbook_runs_status_check", sql`(status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text]))`),]);

export const profiles = pgTable.withRLS("profiles", {
	id: uuid().primaryKey().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	email: text().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" } ),
	role: text().default("member"),
	preferences: jsonb().default({"theme":"light","notifications":true,"ai_suggestions":true}),
	onboardingCompleted: boolean("onboarding_completed").default(false),
	lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_profiles_id").using("btree", table.id.asc().nullsLast()),
	index("idx_profiles_org_id").using("btree", table.orgId.asc().nullsLast()),

	pgPolicy("Users create own profile", { for: "insert", to: ["authenticated"], withCheck: sql`(id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users delete own profile", { for: "delete", to: ["authenticated"], using: sql`(id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users update own profile", { for: "update", to: ["authenticated"], using: sql`(id = ( SELECT auth.uid() AS uid))`, withCheck: sql`(id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view org member profiles", { for: "select", to: ["authenticated"], using: sql`((org_id IS NOT NULL) AND (org_id = get_user_org_id()))` }),

	pgPolicy("Users view own profile", { for: "select", to: ["authenticated"], using: sql`(id = ( SELECT auth.uid() AS uid))` }),
check("profiles_role_check", sql`(role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text]))`),]);

export const projects = pgTable.withRLS("projects", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	description: text(),
	type: text().default("other"),
	status: text().default("active"),
	health: text().default("on_track"),
	progress: integer().default(0),
	startDate: date("start_date"),
	endDate: date("end_date"),
	ownerId: uuid("owner_id").references(() => profiles.id),
	teamMembers: uuid("team_members").array().default([]),
	goals: jsonb().default([]),
	tags: text().array().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
	index("idx_projects_active_health").using("btree", table.startupId.asc().nullsLast(), table.health.asc().nullsLast()).where(sql`(status = 'active'::text)`),
	index("idx_projects_owner_id").using("btree", table.ownerId.asc().nullsLast()),
	index("idx_projects_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("Users create projects in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users delete projects in org", { for: "delete", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),

	pgPolicy("Users update projects in org", { for: "update", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view projects in org", { for: "select", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),
check("projects_health_check", sql`(health = ANY (ARRAY['on_track'::text, 'at_risk'::text, 'behind'::text, 'completed'::text]))`),check("projects_progress_check", sql`((progress >= 0) AND (progress <= 100))`),check("projects_status_check", sql`(status = ANY (ARRAY['planning'::text, 'active'::text, 'on_hold'::text, 'completed'::text, 'cancelled'::text]))`),check("projects_type_check", sql`(type = ANY (ARRAY['fundraising'::text, 'product'::text, 'hiring'::text, 'partnership'::text, 'marketing'::text, 'operations'::text, 'other'::text]))`),]);

export const promptPackRuns = pgTable.withRLS("prompt_pack_runs", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").references(() => usersInAuth.id, { onDelete: "set null" } ),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	packId: text("pack_id").references(() => promptPacks.id, { onDelete: "set null" } ),
	packSlug: text("pack_slug"),
	stepOrder: integer("step_order"),
	action: text().notNull(),
	inputsJson: jsonb("inputs_json").default({}),
	outputsJson: jsonb("outputs_json").default({}),
	model: text(),
	inputTokens: integer("input_tokens"),
	outputTokens: integer("output_tokens"),
	costUsd: numeric("cost_usd", { precision: 10, scale: 6 }),
	durationMs: integer("duration_ms"),
	status: text().default("pending").notNull(),
	errorMessage: text("error_message"),
	industryId: text("industry_id"),
	stage: text(),
	featureContext: text("feature_context"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true }),
}, (table) => [
	index("idx_prompt_pack_runs_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_prompt_pack_runs_pack_id").using("btree", table.packId.asc().nullsLast()),
	index("idx_prompt_pack_runs_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_prompt_pack_runs_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Authenticated users can create prompt pack runs", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Service role can manage all prompt pack runs", { to: ["service_role"], using: sql`true`, withCheck: sql`true` }),

	pgPolicy("Users can view their own prompt pack runs", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
]);

export const promptPackSteps = pgTable.withRLS("prompt_pack_steps", {
	id: uuid().defaultRandom().primaryKey(),
	packId: text("pack_id").notNull().references(() => promptPacks.id, { onDelete: "cascade" } ),
	stepOrder: integer("step_order").notNull(),
	purpose: text().notNull(),
	promptTemplate: text("prompt_template").notNull(),
	inputSchema: jsonb("input_schema").default({}),
	outputSchema: jsonb("output_schema").default({}),
	modelPreference: text("model_preference").default("gemini"),
	maxTokens: integer("max_tokens").default(2000),
	temperature: numeric({ mode: 'number', precision: 3, scale: 2 }).default(0.3),
	tools: jsonb().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_prompt_pack_steps_pack_id").using("btree", table.packId.asc().nullsLast()),
	unique("prompt_pack_steps_pack_id_step_order_key").on(table.packId, table.stepOrder),
	pgPolicy("Anyone can view prompt pack steps", { for: "select", to: ["anon", "authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM prompt_packs
  WHERE ((prompt_packs.id = prompt_pack_steps.pack_id) AND (prompt_packs.is_active = true))))` }),
]);

export const promptPacks = pgTable.withRLS("prompt_packs", {
	id: text().primaryKey(),
	title: text().notNull(),
	slug: text().notNull(),
	description: text(),
	category: text().notNull(),
	stageTags: text("stage_tags").array().default(sql`ARRAY[]`),
	industryTags: text("industry_tags").array().default(sql`ARRAY['all'::text]`),
	version: integer().default(1).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	source: text().default("system"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("prompt_packs_slug_key").on(table.slug),
	pgPolicy("Anyone can view active prompt packs", { for: "select", to: ["anon", "authenticated"], using: sql`(is_active = true)` }),
]);

export const promptTemplateRegistry = pgTable.withRLS("prompt_template_registry", {
	id: text().primaryKey(),
	name: text().notNull(),
	description: text(),
	playbookSections: text("playbook_sections").array().notNull(),
	modelPreference: text("model_preference").default("gemini"),
	maxTokens: integer("max_tokens").default(2000),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [

	pgPolicy("Anyone can view prompt template registry", { for: "select", to: ["anon", "authenticated"], using: sql`true` }),
]);

export const proposedActions = pgTable.withRLS("proposed_actions", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	agentName: text("agent_name").notNull(),
	aiRunId: uuid("ai_run_id").references(() => aiRuns.id),
	actionType: text("action_type").notNull(),
	targetTable: text("target_table").notNull(),
	targetId: uuid("target_id"),
	payload: jsonb().notNull(),
	beforeState: jsonb("before_state"),
	afterState: jsonb("after_state"),
	reasoning: text(),
	confidence: numeric({ precision: 3, scale: 2 }),
	status: text().default("pending"),
	approvedBy: uuid("approved_by").references(() => profiles.id),
	approvedAt: timestamp("approved_at", { withTimezone: true }),
	rejectionReason: text("rejection_reason"),
	expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`(now() + '7 days'::interval)`),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_proposed_actions_ai_run_id").using("btree", table.aiRunId.asc().nullsLast()),
	index("idx_proposed_actions_approved_by").using("btree", table.approvedBy.asc().nullsLast()),
	index("idx_proposed_actions_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_proposed_actions_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_proposed_actions_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users delete own proposed actions", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users insert proposed actions in org", { for: "insert", to: ["authenticated"], withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users update proposed actions in org", { for: "update", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))`, withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users view proposed actions in org", { for: "select", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),
check("proposed_actions_action_type_check", sql`(action_type = ANY (ARRAY['create'::text, 'update'::text, 'delete'::text, 'send'::text, 'external'::text, 'bulk'::text]))`),check("proposed_actions_confidence_check", sql`((confidence >= (0)::numeric) AND (confidence <= (1)::numeric))`),check("proposed_actions_status_check", sql`(status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'expired'::text, 'executing'::text, 'completed'::text, 'failed'::text]))`),]);

export const shareViews = pgTable.withRLS("share_views", {
	id: uuid().defaultRandom().primaryKey(),
	linkId: uuid("link_id").notNull().references(() => shareableLinks.id, { onDelete: "cascade" } ),
	viewedAt: timestamp("viewed_at", { withTimezone: true }).default(sql`now()`).notNull(),
	ipHash: text("ip_hash"),
	userAgent: text("user_agent"),
	referrer: text(),
	country: text(),
}, (table) => [
	index("idx_share_views_link_id").using("btree", table.linkId.asc().nullsLast()),

	pgPolicy("share_views_insert_authenticated", { for: "insert", to: ["authenticated"], withCheck: sql`(link_id IN ( SELECT shareable_links.id
   FROM shareable_links
  WHERE (shareable_links.created_by = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("share_views_insert_service", { for: "insert", to: ["service_role"], withCheck: sql`true` }),

	pgPolicy("share_views_select_owner", { for: "select", using: sql`(link_id IN ( SELECT shareable_links.id
   FROM shareable_links
  WHERE (shareable_links.created_by = ( SELECT auth.uid() AS uid))))` }),
]);

export const shareableLinks = pgTable.withRLS("shareable_links", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	resourceType: text("resource_type").notNull(),
	resourceId: uuid("resource_id").notNull(),
	token: text().default(sql`encode(gen_random_bytes(32), 'hex'::text)`).notNull(),
	createdBy: uuid("created_by").notNull().references(() => usersInAuth.id),
	expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`(now() + '7 days'::interval)`).notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true }),
	accessCount: integer("access_count").default(0),
	lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_shareable_links_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_shareable_links_resource").using("btree", table.resourceType.asc().nullsLast(), table.resourceId.asc().nullsLast()),
	index("idx_shareable_links_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_shareable_links_token").using("btree", table.token.asc().nullsLast()),
	unique("shareable_links_token_key").on(table.token),
	pgPolicy("links_anon_check_status", { for: "select", to: ["anon"], using: sql`(token = ( SELECT get_share_token() AS get_share_token))` }),

	pgPolicy("links_insert_org", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("links_select_org", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("links_update_org", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
check("shareable_links_resource_type_check", sql`(resource_type = ANY (ARRAY['validation_report'::text, 'pitch_deck'::text, 'lean_canvas'::text, 'decision_log'::text]))`),]);

export const sponsors = pgTable.withRLS("sponsors", {
	id: uuid().defaultRandom().primaryKey(),
	contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" } ),
	name: text().notNull(),
	companyName: text("company_name"),
	website: text(),
	logoUrl: text("logo_url"),
	description: text(),
	tier: sponsorTier().default("silver").notNull(),
	status: sponsorStatus().default("prospect").notNull(),
	amount: numeric({ mode: 'number', precision: 10, scale: 2 }).default(0),
	inKindValue: numeric("in_kind_value", { mode: 'number', precision: 10, scale: 2 }).default(0),
	inKindDescription: text("in_kind_description"),
	contactName: text("contact_name"),
	contactEmail: text("contact_email"),
	contactPhone: text("contact_phone"),
	contactTitle: text("contact_title"),
	outreachSentAt: timestamp("outreach_sent_at", { withTimezone: true }),
	outreachTemplate: text("outreach_template"),
	lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
	followUpDate: timestamp("follow_up_date", { withTimezone: true }),
	responseReceivedAt: timestamp("response_received_at", { withTimezone: true }),
	deliverables: jsonb().default([]),
	benefits: jsonb().default([]),
	matchScore: integer("match_score"),
	aiNotes: text("ai_notes"),
	discoverySource: text("discovery_source"),
	notes: text(),
	internalNotes: text("internal_notes"),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
	contractSignedAt: timestamp("contract_signed_at", { withTimezone: true }),
	paymentReceivedAt: timestamp("payment_received_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" } ),
}, (table) => [
	index("idx_sponsors_contact_id").using("btree", table.contactId.asc().nullsLast()),
	index("idx_sponsors_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_sponsors_event_id").using("btree", table.eventId.asc().nullsLast()),

	pgPolicy("authenticated can delete sponsors", { for: "delete", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can insert sponsors", { for: "insert", to: ["authenticated"], withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can select sponsors", { for: "select", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),

	pgPolicy("authenticated can update sponsors", { for: "update", to: ["authenticated"], using: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))`, withCheck: sql`(event_id IN ( SELECT events.id
   FROM events
  WHERE startup_in_org(events.startup_id)))` }),
check("event_sponsors_match_score_check", sql`((match_score >= 0) AND (match_score <= 100))`),]);

export const sprintTasks = pgTable.withRLS("sprint_tasks", {
	id: uuid().defaultRandom().primaryKey(),
	campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" } ),
	sprintNumber: integer("sprint_number").notNull(),
	title: text().notNull(),
	source: text().notNull(),
	successCriteria: text("success_criteria").default("").notNull(),
	aiTip: text("ai_tip").default(""),
	priority: text().default("medium").notNull(),
	column: text().default("backlog").notNull(),
	position: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_sprint_tasks_campaign_id").using("btree", table.campaignId.asc().nullsLast()),

	pgPolicy("Users can delete own sprint tasks", { for: "delete", to: ["authenticated"], using: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can insert own sprint tasks", { for: "insert", to: ["authenticated"], withCheck: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can read own sprint tasks", { for: "select", to: ["authenticated"], using: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can update own sprint tasks", { for: "update", to: ["authenticated"], using: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((s.id = c.startup_id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
check("sprint_tasks_column_check", sql`("column" = ANY (ARRAY['backlog'::text, 'todo'::text, 'doing'::text, 'done'::text]))`),check("sprint_tasks_priority_check", sql`(priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text]))`),check("sprint_tasks_sprint_number_check", sql`((sprint_number >= 1) AND (sprint_number <= 6))`),]);

export const sprints = pgTable.withRLS("sprints", {
	id: uuid().defaultRandom().primaryKey(),
	campaignId: uuid("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" } ),
	sprintNumber: integer("sprint_number").notNull(),
	name: text(),
	status: text().default("designed").notNull(),
	cards: jsonb().default([]).notNull(),
	plan: text(),
	do: text(),
	check: text(),
	act: text(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_sprints_campaign").using("btree", table.campaignId.asc().nullsLast()),
	unique("sprints_campaign_id_sprint_number_key").on(table.campaignId, table.sprintNumber),
	pgPolicy("Users can create sprints", { for: "insert", to: ["authenticated"], withCheck: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can delete sprints", { for: "delete", to: ["authenticated"], using: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can update sprints", { for: "update", to: ["authenticated"], using: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("Users can view own sprints", { for: "select", to: ["authenticated"], using: sql`(campaign_id IN ( SELECT c.id
   FROM (campaigns c
     JOIN startups s ON ((c.startup_id = s.id)))
  WHERE (s.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
check("sprints_sprint_number_check", sql`((sprint_number >= 1) AND (sprint_number <= 6))`),check("sprints_status_check", sql`(status = ANY (ARRAY['designed'::text, 'running'::text, 'completed'::text]))`),]);

export const startupEventTasks = pgTable.withRLS("startup_event_tasks", {
	id: uuid().defaultRandom().primaryKey(),
	startupEventId: uuid("startup_event_id").notNull(),
	taskId: uuid("task_id").notNull().references(() => tasks.id, { onDelete: "cascade" } ),
	category: eventTaskCategory().default("other").notNull(),
	dueOffsetDays: integer("due_offset_days"),
	isMilestone: boolean("is_milestone").default(false),
	isCriticalPath: boolean("is_critical_path").default(false),
	dependsOn: uuid("depends_on").array().default([]),
	blocks: uuid().array().default([]),
	notes: text(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("startup_event_tasks_startup_event_id_task_id_key").on(table.startupEventId, table.taskId),
	pgPolicy("Authenticated users delete event tasks in org", { for: "delete", to: ["authenticated"], using: sql`(task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id())))))` }),

	pgPolicy("Authenticated users insert event tasks in org", { for: "insert", to: ["authenticated"], withCheck: sql`(task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id())))))` }),

	pgPolicy("Authenticated users update event tasks in org", { for: "update", to: ["authenticated"], using: sql`(task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id())))))`, withCheck: sql`(task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id())))))` }),

	pgPolicy("Authenticated users view event tasks in org", { for: "select", to: ["authenticated"], using: sql`(task_id IN ( SELECT tasks.id
   FROM tasks
  WHERE (tasks.startup_id IN ( SELECT startups.id
           FROM startups
          WHERE (startups.org_id = user_org_id())))))` }),
]);

export const startupHealthScores = pgTable.withRLS("startup_health_scores", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	overallScore: integer("overall_score").notNull(),
	dimensions: jsonb().default({}).notNull(),
	bottleneck: text(),
	bottleneckReason: text("bottleneck_reason"),
	correctiveActions: jsonb("corrective_actions").default([]).notNull(),
	computationHash: text("computation_hash"),
	computedAt: timestamp("computed_at", { withTimezone: true }).default(sql`now()`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_startup_health_scores_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("startup_health_scores_insert_org", { for: "insert", to: ["authenticated"], withCheck: sql`( SELECT startup_in_org(startup_health_scores.startup_id) AS startup_in_org)` }),

	pgPolicy("startup_health_scores_select_org", { for: "select", to: ["authenticated"], using: sql`( SELECT startup_in_org(startup_health_scores.startup_id) AS startup_in_org)` }),

	pgPolicy("startup_health_scores_update_org", { for: "update", to: ["authenticated"], using: sql`( SELECT startup_in_org(startup_health_scores.startup_id) AS startup_in_org)` }),
check("startup_health_scores_overall_score_check", sql`((overall_score >= 0) AND (overall_score <= 100))`),]);

export const startupMembers = pgTable.withRLS("startup_members", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	role: text().default("member").notNull(),
	invitedBy: uuid("invited_by").references(() => usersInAuth.id),
	invitedAt: timestamp("invited_at", { withTimezone: true }),
	joinedAt: timestamp("joined_at", { withTimezone: true }).default(sql`now()`),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_startup_members_invited_by").using("btree", table.invitedBy.asc().nullsLast()),
	index("idx_startup_members_startup").using("btree", table.startupId.asc().nullsLast()),
	index("idx_startup_members_user").using("btree", table.userId.asc().nullsLast()),
	unique("startup_members_startup_id_user_id_key").on(table.startupId, table.userId),
	pgPolicy("Owners can delete or self-remove", { for: "delete", to: ["authenticated"], using: sql`((EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE ((sm.startup_id = startup_members.startup_id) AND (sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = 'owner'::text)))) OR (( SELECT auth.uid() AS uid) = user_id))` }),

	pgPolicy("Owners can update members", { for: "update", to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE ((sm.startup_id = startup_members.startup_id) AND (sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = 'owner'::text))))` }),

	pgPolicy("Owners/admins can insert members", { for: "insert", to: ["authenticated"], withCheck: sql`((EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE ((sm.startup_id = startup_members.startup_id) AND (sm.user_id = ( SELECT auth.uid() AS uid)) AND (sm.role = ANY (ARRAY['owner'::text, 'admin'::text]))))) OR (NOT (EXISTS ( SELECT 1
   FROM startup_members sm
  WHERE (sm.startup_id = startup_members.startup_id)))))` }),

	pgPolicy("Users can view co-members", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT sm.startup_id
   FROM startup_members sm
  WHERE (sm.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("Users can view their own memberships", { for: "select", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
check("startup_members_role_check", sql`(role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'viewer'::text]))`),]);

export const startups = pgTable.withRLS("startups", {
	id: uuid().defaultRandom().primaryKey(),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	name: text().notNull(),
	description: text(),
	tagline: text(),
	logoUrl: text("logo_url"),
	industry: text(),
	subIndustry: text("sub_industry"),
	stage: text().default("idea"),
	businessModel: text("business_model").array().default([]),
	pricingModel: text("pricing_model"),
	websiteUrl: text("website_url"),
	linkedinUrl: text("linkedin_url"),
	twitterUrl: text("twitter_url"),
	githubUrl: text("github_url"),
	targetCustomers: text("target_customers").array().default([]),
	customerSegments: jsonb("customer_segments").default([]),
	uniqueValue: text("unique_value"),
	keyFeatures: text("key_features").array().default([]),
	competitors: text().array().default([]),
	teamSize: integer("team_size"),
	founders: jsonb().default([]),
	tractionData: jsonb("traction_data").default({"arr":0,"mrr":0,"nrr":0,"users":0,"customers":0,"churn_rate":0,"milestones":[],"growth_rate_monthly":0}),
	isRaising: boolean("is_raising").default(false),
	raiseAmount: numeric("raise_amount", { precision: 12, scale: 2 }),
	valuationCap: numeric("valuation_cap", { precision: 14, scale: 2 }),
	useOfFunds: text("use_of_funds").array().default([]),
	fundingRounds: jsonb("funding_rounds").default([]),
	deepResearchReport: text("deep_research_report"),
	aiSummary: text("ai_summary"),
	profileStrength: integer("profile_strength").default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	targetMarket: text("target_market"),
	yearFounded: integer("year_founded"),
	investorReadyScore: integer("investor_ready_score"),
	investorScoreBreakdown: jsonb("investor_score_breakdown").default({}),
	interviewSignals: text("interview_signals").array().default([]),
	readinessScore: numeric("readiness_score", { precision: 5, scale: 2 }),
	readinessRationale: text("readiness_rationale"),
	validationVerdict: text("validation_verdict"),
	readinessUpdatedAt: timestamp("readiness_updated_at", { withTimezone: true }),
	problemStatement: text("problem_statement"),
	solutionDescription: text("solution_description"),
	whyNow: text("why_now"),
	problemOneLiner: text("problem_one_liner"),
	oneLiner: text("one_liner"),
	elevatorPitch: text("elevator_pitch"),
	tamSize: numeric("tam_size"),
	samSize: numeric("sam_size"),
	somSize: numeric("som_size"),
	marketCategory: text("market_category"),
	marketTrends: jsonb("market_trends").default([]),
	problem: text(),
	solution: text(),
	existingAlternatives: text("existing_alternatives"),
	channels: text(),
	valueProp: text("value_prop"),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
	validationStage: text("validation_stage").default("idea").notNull(),
	currentBet: jsonb("current_bet").default({}),
	headquarters: text(),
}, (table) => [
	index("idx_startups_org_id").using("btree", table.orgId.asc().nullsLast()),

	pgPolicy("Users create startups in org", { for: "insert", to: ["authenticated"], withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users delete startups in org", { for: "delete", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (deleted_at IS NULL))` }),

	pgPolicy("Users update startups in org", { for: "update", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (deleted_at IS NULL))`, withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("Users view startups in org", { for: "select", to: ["authenticated"], using: sql`((org_id = ( SELECT user_org_id() AS user_org_id)) AND (deleted_at IS NULL))` }),
check("startups_investor_ready_score_check", sql`((investor_ready_score >= 0) AND (investor_ready_score <= 100))`),check("startups_profile_strength_check", sql`((profile_strength >= 0) AND (profile_strength <= 100))`),check("startups_stage_check", sql`(stage = ANY (ARRAY['idea'::text, 'pre_seed'::text, 'seed'::text, 'series_a'::text, 'series_b'::text, 'series_c'::text, 'growth'::text, 'public'::text]))`),check("startups_validation_stage_check", sql`(validation_stage = ANY (ARRAY['idea'::text, 'mvp'::text, 'selling'::text]))`),check("startups_year_founded_check", sql`((year_founded >= 1900) AND ((year_founded)::numeric <= (EXTRACT(year FROM now()) + (1)::numeric)))`),]);

export const tasks = pgTable.withRLS("tasks", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" } ),
	title: text().notNull(),
	description: text(),
	category: text(),
	phase: text(),
	priority: text().default("medium"),
	status: text().default("pending"),
	assignedTo: uuid("assigned_to").references(() => profiles.id, { onDelete: "set null" } ),
	createdBy: uuid("created_by").references(() => profiles.id),
	dueAt: timestamp("due_at", { withTimezone: true }),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" } ),
	dealId: uuid("deal_id").references(() => deals.id, { onDelete: "set null" } ),
	parentTaskId: uuid("parent_task_id"),
	aiGenerated: boolean("ai_generated").default(false),
	aiSource: text("ai_source"),
	tags: text().array().default([]),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	source: text().default("manual"),
	triggerRuleId: text("trigger_rule_id"),
	triggerScore: numeric("trigger_score", { precision: 5, scale: 2 }),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
	foreignKey({
		columns: [table.parentTaskId],
		foreignColumns: [table.id],
		name: "tasks_parent_task_id_fkey"
	}).onDelete("set null"),
	index("idx_tasks_active_priority").using("btree", table.startupId.asc().nullsLast(), table.priority.asc().nullsLast(), table.dueAt.asc().nullsLast()).where(sql`(status <> ALL (ARRAY['completed'::text, 'cancelled'::text]))`),
	index("idx_tasks_assigned_to").using("btree", table.assignedTo.asc().nullsLast()),
	index("idx_tasks_contact_id").using("btree", table.contactId.asc().nullsLast()),
	index("idx_tasks_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_tasks_deal_id").using("btree", table.dealId.asc().nullsLast()),
	index("idx_tasks_parent_task_id").using("btree", table.parentTaskId.asc().nullsLast()),
	index("idx_tasks_project_id").using("btree", table.projectId.asc().nullsLast()),
	index("idx_tasks_source").using("btree", table.source.asc().nullsLast()).where(sql`(source IS NOT NULL)`),
	index("idx_tasks_startup_created").using("btree", table.startupId.asc().nullsLast(), table.createdAt.desc().nullsFirst()),
	index("idx_tasks_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_tasks_startup_project_status").using("btree", table.startupId.asc().nullsLast(), table.projectId.asc().nullsLast(), table.status.asc().nullsLast()),

	pgPolicy("Users create tasks in org", { for: "insert", to: ["authenticated"], withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users delete tasks in org", { for: "delete", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),

	pgPolicy("Users update tasks in org", { for: "update", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))`, withCheck: sql`startup_in_org(startup_id)` }),

	pgPolicy("Users view tasks in org", { for: "select", to: ["authenticated"], using: sql`(startup_in_org(startup_id) AND (deleted_at IS NULL))` }),
check("tasks_category_check", sql`(category = ANY (ARRAY['fundraising'::text, 'product'::text, 'marketing'::text, 'operations'::text, 'sales'::text, 'hiring'::text, 'legal'::text, 'other'::text]))`),check("tasks_priority_check", sql`(priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))`),check("tasks_status_check", sql`(status = ANY (ARRAY['pending'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text, 'blocked'::text]))`),]);

export const userEventTracking = pgTable.withRLS("user_event_tracking", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	eventId: uuid("event_id").notNull().references(() => industryEvents.id, { onDelete: "cascade" } ),
	status: text().default("interested"),
	notes: text(),
	reminderDate: date("reminder_date"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("user_event_tracking_user_id_event_id_key").on(table.userId, table.eventId),
	pgPolicy("Users can delete own event tracking", { for: "delete", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),

	pgPolicy("Users can insert own event tracking", { for: "insert", to: ["authenticated"], withCheck: sql`(( SELECT auth.uid() AS uid) = user_id)` }),

	pgPolicy("Users can update own event tracking", { for: "update", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)`, withCheck: sql`(( SELECT auth.uid() AS uid) = user_id)` }),

	pgPolicy("Users can view own event tracking", { for: "select", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
check("user_event_tracking_status_check", sql`(status = ANY (ARRAY['interested'::text, 'registered'::text, 'attending'::text, 'attended'::text, 'skipped'::text]))`),]);

export const userRoles = pgTable.withRLS("user_roles", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	role: appRole().default("user").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("user_roles_user_id_role_key").on(table.userId, table.role),
	pgPolicy("Admins can manage all roles", { to: ["authenticated"], using: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)`, withCheck: sql`has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)` }),

	pgPolicy("Users can view own roles", { for: "select", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
]);

export const validatorAgentRuns = pgTable.withRLS("validator_agent_runs", {
	id: uuid().defaultRandom().primaryKey(),
	sessionId: uuid("session_id").notNull().references(() => validatorSessions.id, { onDelete: "cascade" } ),
	agentName: text("agent_name").notNull(),
	attempt: integer().default(0).notNull(),
	status: text().default("queued").notNull(),
	outputJson: jsonb("output_json"),
	error: text(),
	durationMs: integer("duration_ms"),
	startedAt: timestamp("started_at", { withTimezone: true }),
	endedAt: timestamp("ended_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("validator_agent_runs_session_id_agent_name_attempt_key").on(table.sessionId, table.agentName, table.attempt),
	pgPolicy("Service role can insert agent runs", { for: "insert", to: ["service_role"], withCheck: sql`true` }),

	pgPolicy("Service role can update agent runs", { for: "update", to: ["service_role"], using: sql`true` }),

	pgPolicy("Users can view own session agent runs", { for: "select", to: ["authenticated"], using: sql`(session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),
check("validator_agent_runs_agent_name_check", sql`(agent_name = ANY (ARRAY['extract'::text, 'research'::text, 'competitors'::text, 'score'::text, 'mvp'::text, 'compose'::text, 'verify'::text]))`),check("validator_agent_runs_status_check", sql`(status = ANY (ARRAY['queued'::text, 'running'::text, 'ok'::text, 'failed'::text, 'skipped'::text]))`),]);

export const validatorReports = pgTable.withRLS("validator_reports", {
	id: uuid().defaultRandom().primaryKey(),
	runId: uuid("run_id"),
	reportType: text("report_type").notNull(),
	score: numeric({ precision: 5, scale: 2 }),
	summary: text(),
	details: jsonb().default({}),
	keyFindings: text("key_findings").array(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	sessionId: uuid("session_id").references(() => validatorSessions.id, { onDelete: "set null" } ),
	verified: boolean().default(false),
	verificationJson: jsonb("verification_json"),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	reportVersion: text("report_version").default("v2").notNull(),
}, (table) => [
	index("idx_validation_reports_run_id").using("btree", table.runId.asc().nullsLast()),
	index("idx_validation_reports_session_id").using("btree", table.sessionId.asc().nullsLast()),
	index("idx_validation_reports_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("reports_public_read_via_share_token", { for: "select", to: ["anon"], using: sql`(EXISTS ( SELECT 1
   FROM shareable_links sl
  WHERE ((sl.resource_type = 'validation_report'::text) AND (sl.resource_id = validator_reports.id) AND (sl.revoked_at IS NULL) AND (sl.expires_at > now()) AND (sl.token = ( SELECT get_share_token() AS get_share_token)))))` }),

	pgPolicy("Users can insert reports via their sessions", { for: "insert", to: ["authenticated"], withCheck: sql`(session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("Users can view reports from their validator sessions", { for: "select", to: ["authenticated"], using: sql`(session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),
check("validation_reports_report_type_check", sql`(report_type = ANY (ARRAY['market'::text, 'founder'::text, 'product'::text, 'finance'::text, 'overall'::text, 'quick'::text, 'deep'::text, 'investor'::text]))`),check("validation_reports_score_check", sql`((score >= (0)::numeric) AND (score <= (100)::numeric))`),]);

export const validatorRuns = pgTable.withRLS("validator_runs", {
	id: uuid().defaultRandom().primaryKey(),
	sessionId: uuid("session_id").notNull().references(() => validatorSessions.id, { onDelete: "cascade" } ),
	agentName: text("agent_name").notNull(),
	modelUsed: text("model_used").default("gemini-3-flash-preview").notNull(),
	toolUsed: jsonb("tool_used").default([]),
	inputJson: jsonb("input_json"),
	outputJson: jsonb("output_json"),
	citations: jsonb().default([]),
	status: text().default("queued").notNull(),
	errorMessage: text("error_message"),
	startedAt: timestamp("started_at", { withTimezone: true }),
	finishedAt: timestamp("finished_at", { withTimezone: true }),
	durationMs: integer("duration_ms"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_validator_runs_agent_name").using("btree", table.agentName.asc().nullsLast()),
	index("idx_validator_runs_session_agent").using("btree", table.sessionId.asc().nullsLast(), table.agentName.asc().nullsLast()),
	index("idx_validator_runs_session_id").using("btree", table.sessionId.asc().nullsLast()),

	pgPolicy("Service role can manage validator_runs", { to: ["service_role"], using: sql`true`, withCheck: sql`true` }),

	pgPolicy("Users can insert runs to their sessions", { for: "insert", to: ["authenticated"], withCheck: sql`(session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("Users can view runs from their sessions", { for: "select", to: ["authenticated"], using: sql`(session_id IN ( SELECT validator_sessions.id
   FROM validator_sessions
  WHERE (validator_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),
check("validator_runs_status_check", sql`(status = ANY (ARRAY['queued'::text, 'running'::text, 'ok'::text, 'partial'::text, 'failed'::text]))`),]);

export const validatorSessions = pgTable.withRLS("validator_sessions", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	inputText: text("input_text").notNull(),
	status: text().default("running").notNull(),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	failedSteps: text("failed_steps").array().default([]),
}, (table) => [
	index("idx_validator_sessions_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_validator_sessions_status").using("btree", table.status.asc().nullsLast()),
	index("idx_validator_sessions_user_id").using("btree", table.userId.asc().nullsLast()),

	pgPolicy("Users can create their own sessions", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users can delete their own sessions", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users can update their own sessions", { for: "update", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users can view their own sessions", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("validator_sessions_status_check", sql`(status = ANY (ARRAY['queued'::text, 'running'::text, 'complete'::text, 'partial'::text, 'failed'::text, 'success'::text, 'degraded_success'::text]))`),]);

export const weeklyReviews = pgTable.withRLS("weekly_reviews", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").notNull().references(() => startups.id, { onDelete: "cascade" } ),
	weekStart: date("week_start").notNull(),
	weekEnd: date("week_end").notNull(),
	summary: text(),
	keyLearnings: jsonb("key_learnings").default([]),
	prioritiesNextWeek: jsonb("priorities_next_week").default([]),
	metrics: jsonb().default({}),
	assumptionsTested: integer("assumptions_tested").default(0),
	experimentsRun: integer("experiments_run").default(0),
	decisionsMade: integer("decisions_made").default(0),
	tasksCompleted: integer("tasks_completed").default(0),
	healthScoreStart: integer("health_score_start"),
	healthScoreEnd: integer("health_score_end"),
	aiGenerated: boolean("ai_generated").default(true),
	editedByUser: boolean("edited_by_user").default(false),
	createdBy: uuid("created_by").notNull().references(() => usersInAuth.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_weekly_reviews_created_by").using("btree", table.createdBy.asc().nullsLast()),
	uniqueIndex("idx_weekly_reviews_startup_week").using("btree", table.startupId.asc().nullsLast(), table.weekStart.asc().nullsLast()),

	pgPolicy("reviews_delete", { for: "delete", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("reviews_insert", { for: "insert", to: ["authenticated"], withCheck: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("reviews_select", { for: "select", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("reviews_update", { for: "update", to: ["authenticated"], using: sql`(startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((om.org_id = s.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid))))` }),
]);

export const wizardExtractions = pgTable.withRLS("wizard_extractions", {
	id: uuid().defaultRandom().primaryKey(),
	sessionId: uuid("session_id").notNull().references(() => wizardSessions.id, { onDelete: "cascade" } ),
	extractionType: text("extraction_type").notNull(),
	sourceUrl: text("source_url"),
	rawContent: text("raw_content"),
	extractedData: jsonb("extracted_data").notNull(),
	confidence: numeric({ precision: 3, scale: 2 }),
	aiRunId: uuid("ai_run_id").references(() => aiRuns.id),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_wizard_extractions_ai_run_id").using("btree", table.aiRunId.asc().nullsLast()),
	index("idx_wizard_extractions_session_id").using("btree", table.sessionId.asc().nullsLast()),

	pgPolicy("Users insert wizard extractions", { for: "insert", to: ["authenticated"], withCheck: sql`(session_id IN ( SELECT wizard_sessions.id
   FROM wizard_sessions
  WHERE (wizard_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),

	pgPolicy("Users view own wizard extractions", { for: "select", to: ["authenticated"], using: sql`(session_id IN ( SELECT wizard_sessions.id
   FROM wizard_sessions
  WHERE (wizard_sessions.user_id = ( SELECT auth.uid() AS uid))))` }),
check("wizard_extractions_extraction_type_check", sql`(extraction_type = ANY (ARRAY['url'::text, 'linkedin'::text, 'pitch_deck'::text, 'document'::text]))`),]);

export const wizardSessions = pgTable.withRLS("wizard_sessions", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "set null" } ),
	currentStep: integer("current_step").default(1),
	status: text().default("in_progress"),
	formData: jsonb("form_data").default({}),
	diagnosticAnswers: jsonb("diagnostic_answers").default({}),
	signals: text().array().default([]),
	industryPackId: uuid("industry_pack_id"),
	aiExtractions: jsonb("ai_extractions").default({}),
	profileStrength: integer("profile_strength").default(0),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).default(sql`now()`),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	interviewAnswers: jsonb("interview_answers").default([]),
	interviewProgress: integer("interview_progress").default(0),
	extractedTraction: jsonb("extracted_traction").default({}),
	extractedFunding: jsonb("extracted_funding").default({}),
	enrichmentSources: text("enrichment_sources").array().default([]),
	enrichmentConfidence: integer("enrichment_confidence").default(0),
	investorScore: integer("investor_score").default(0),
	aiSummary: jsonb("ai_summary"),
	aiEnrichments: jsonb("ai_enrichments"),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	groundingMetadata: jsonb("grounding_metadata"),
	abandonedAt: timestamp("abandoned_at", { withTimezone: true }),
}, (table) => [
	index("idx_wizard_sessions_industry_pack_id").using("btree", table.industryPackId.asc().nullsLast()),
	index("idx_wizard_sessions_last_activity").using("btree", table.lastActivityAt.desc().nullsLast()).where(sql`(status = 'in_progress'::text)`),
	index("idx_wizard_sessions_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_wizard_sessions_status").using("btree", table.status.asc().nullsLast()),
	index("idx_wizard_sessions_user_id").using("btree", table.userId.asc().nullsLast()),
	index("idx_wizard_sessions_user_status").using("btree", table.userId.asc().nullsLast(), table.status.asc().nullsLast()).where(sql`(status = 'in_progress'::text)`),

	pgPolicy("Users delete own wizard sessions", { for: "delete", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users insert own wizard sessions", { for: "insert", to: ["authenticated"], withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users update own wizard sessions", { for: "update", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))`, withCheck: sql`(user_id = ( SELECT auth.uid() AS uid))` }),

	pgPolicy("Users view own wizard sessions", { for: "select", to: ["authenticated"], using: sql`(user_id = ( SELECT auth.uid() AS uid))` }),
check("wizard_sessions_current_step_check", sql`((current_step >= 1) AND (current_step <= 4))`),check("wizard_sessions_enrichment_confidence_check", sql`((enrichment_confidence >= 0) AND (enrichment_confidence <= 100))`),check("wizard_sessions_interview_progress_check", sql`((interview_progress >= 0) AND (interview_progress <= 100))`),check("wizard_sessions_status_check", sql`(status = ANY (ARRAY['in_progress'::text, 'completed'::text, 'abandoned'::text]))`),]);

export const workflowActions = pgTable.withRLS("workflow_actions", {
	id: uuid().defaultRandom().primaryKey(),
	workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" } ),
	actionType: text("action_type").default("create_task").notNull(),
	name: text().notNull(),
	description: text(),
	stepOrder: integer("step_order").default(0).notNull(),
	config: jsonb().default({}).notNull(),
	conditions: jsonb().default([]).notNull(),
	onError: text("on_error").default("stop").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_workflow_actions_workflow_id").using("btree", table.workflowId.asc().nullsLast()),

	pgPolicy("users can create workflow actions", { for: "insert", to: ["authenticated"], withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can delete workflow actions", { for: "delete", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can update workflow actions", { for: "update", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can view workflow actions", { for: "select", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
]);

export const workflowActivityLog = pgTable.withRLS("workflow_activity_log", {
	id: uuid().defaultRandom().primaryKey(),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "cascade" } ),
	orgId: uuid("org_id").references(() => organizations.id, { onDelete: "set null" } ),
	eventType: text("event_type").notNull(),
	source: text().notNull(),
	scoreValue: numeric("score_value", { precision: 5, scale: 2 }),
	thresholdValue: numeric("threshold_value", { precision: 5, scale: 2 }),
	ruleId: text("rule_id"),
	taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" } ),
	errorMessage: text("error_message"),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
}, (table) => [
	index("idx_workflow_activity_created").using("btree", table.createdAt.desc().nullsFirst()),
	index("idx_workflow_activity_log_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_workflow_activity_log_startup_id").using("btree", table.startupId.asc().nullsLast()),
	index("idx_workflow_activity_log_task_id").using("btree", table.taskId.asc().nullsLast()),

	pgPolicy("Service role full access to workflow_activity_log", { to: ["service_role"], using: sql`true`, withCheck: sql`true` }),

	pgPolicy("Users can view workflow activity for their startups", { for: "select", to: ["authenticated"], using: sql`((org_id IN ( SELECT om.org_id
   FROM org_members om
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))) OR (startup_id IN ( SELECT s.id
   FROM (startups s
     JOIN org_members om ON ((s.org_id = om.org_id)))
  WHERE (om.user_id = ( SELECT auth.uid() AS uid)))))` }),
]);

export const workflowQueue = pgTable.withRLS("workflow_queue", {
	id: uuid().defaultRandom().primaryKey(),
	workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" } ),
	triggerId: uuid("trigger_id").references(() => workflowTriggers.id, { onDelete: "set null" } ),
	triggerPayload: jsonb("trigger_payload").default({}).notNull(),
	scheduledFor: timestamp("scheduled_for", { withTimezone: true }).default(sql`now()`).notNull(),
	priority: integer().default(0).notNull(),
	status: text().default("pending").notNull(),
	attempts: integer().default(0).notNull(),
	maxAttempts: integer("max_attempts").default(3).notNull(),
	lockedAt: timestamp("locked_at", { withTimezone: true }),
	lockedBy: text("locked_by"),
	lastError: text("last_error"),
	lastErrorAt: timestamp("last_error_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_workflow_queue_trigger_id").using("btree", table.triggerId.asc().nullsLast()),
	index("idx_workflow_queue_workflow_id").using("btree", table.workflowId.asc().nullsLast()),

	pgPolicy("users can create queue items", { for: "insert", to: ["authenticated"], withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can delete queue items", { for: "delete", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can update queue items", { for: "update", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can view workflow queue", { for: "select", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
]);

export const workflowRuns = pgTable.withRLS("workflow_runs", {
	id: uuid().defaultRandom().primaryKey(),
	workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" } ),
	queueId: uuid("queue_id").references(() => workflowQueue.id, { onDelete: "set null" } ),
	triggerId: uuid("trigger_id").references(() => workflowTriggers.id, { onDelete: "set null" } ),
	triggerPayload: jsonb("trigger_payload").default({}).notNull(),
	status: text().default("running").notNull(),
	currentStep: integer("current_step").default(0).notNull(),
	results: jsonb().default([]).notNull(),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`).notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	durationMs: integer("duration_ms"),
	errorMessage: text("error_message"),
	errorStep: integer("error_step"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_workflow_runs_queue_id").using("btree", table.queueId.asc().nullsLast()),
	index("idx_workflow_runs_trigger_id").using("btree", table.triggerId.asc().nullsLast()),
	index("idx_workflow_runs_workflow_id").using("btree", table.workflowId.asc().nullsLast()),

	pgPolicy("users can create workflow runs", { for: "insert", to: ["authenticated"], withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can delete workflow runs", { for: "delete", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can update workflow runs", { for: "update", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can view workflow runs", { for: "select", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
]);

export const workflowTriggers = pgTable.withRLS("workflow_triggers", {
	id: uuid().defaultRandom().primaryKey(),
	workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" } ),
	triggerType: text("trigger_type").default("event").notNull(),
	eventName: text("event_name"),
	scheduleCron: text("schedule_cron"),
	webhookPath: text("webhook_path"),
	conditions: jsonb().default([]).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_workflow_triggers_workflow_id").using("btree", table.workflowId.asc().nullsLast()),

	pgPolicy("users can create workflow triggers", { for: "insert", to: ["authenticated"], withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can delete workflow triggers", { for: "delete", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can update workflow triggers", { for: "update", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))`, withCheck: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),

	pgPolicy("users can view workflow triggers", { for: "select", to: ["authenticated"], using: sql`(workflow_id IN ( SELECT workflows.id
   FROM workflows
  WHERE (workflows.org_id = ( SELECT user_org_id() AS user_org_id))))` }),
]);

export const workflows = pgTable.withRLS("workflows", {
	id: uuid().defaultRandom().primaryKey(),
	orgId: uuid("org_id").notNull().references(() => organizations.id, { onDelete: "cascade" } ),
	startupId: uuid("startup_id").references(() => startups.id, { onDelete: "cascade" } ),
	createdBy: uuid("created_by").references(() => usersInAuth.id, { onDelete: "set null" } ),
	name: text().notNull(),
	description: text(),
	status: text().default("draft").notNull(),
	config: jsonb().default({}).notNull(),
	maxRetries: integer("max_retries").default(3).notNull(),
	retryDelaySeconds: integer("retry_delay_seconds").default(60).notNull(),
	timeoutSeconds: integer("timeout_seconds").default(300).notNull(),
	runCount: integer("run_count").default(0).notNull(),
	successCount: integer("success_count").default(0).notNull(),
	failureCount: integer("failure_count").default(0).notNull(),
	lastRunAt: timestamp("last_run_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_workflows_created_by").using("btree", table.createdBy.asc().nullsLast()),
	index("idx_workflows_org_id").using("btree", table.orgId.asc().nullsLast()),
	index("idx_workflows_startup_id").using("btree", table.startupId.asc().nullsLast()),

	pgPolicy("users can create org workflows", { for: "insert", to: ["authenticated"], withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("users can delete org workflows", { for: "delete", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("users can update org workflows", { for: "update", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))`, withCheck: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),

	pgPolicy("users can view org workflows", { for: "select", to: ["authenticated"], using: sql`(org_id = ( SELECT user_org_id() AS user_org_id))` }),
]);

export const messagesInRealtime = realtime.table.withRLS("messages", {
	topic: text().notNull(),
	extension: text().notNull(),
	payload: jsonb(),
	event: text(),
	private: boolean().default(false),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	insertedAt: timestamp("inserted_at").default(sql`now()`).notNull(),
	id: uuid().defaultRandom().notNull(),
}, (table) => [
	primaryKey({ columns: [table.id, table.insertedAt], name: "messages_pkey"}),

	pgPolicy("authenticated_insert_realtime", { for: "insert", to: ["authenticated"], withCheck: sql`can_access_realtime_channel(topic)` }),

	pgPolicy("authenticated_select_realtime", { for: "select", to: ["authenticated"], using: sql`can_access_realtime_channel(topic)` }),
]);

export const messages20260224InRealtime = realtime.table("messages_2026_02_24", {
	topic: text().notNull(),
	extension: text().notNull(),
	payload: jsonb(),
	event: text(),
	private: boolean().default(false),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	insertedAt: timestamp("inserted_at").default(sql`now()`).notNull(),
	id: uuid().defaultRandom().notNull(),
}, (table) => [
	primaryKey({ columns: [table.id, table.insertedAt], name: "messages_2026_02_24_pkey"}),
	index("messages_2026_02_24_inserted_at_topic_idx").using("btree", table.insertedAt.desc().nullsFirst(), table.topic.asc().nullsLast()).where(sql`((extension = 'broadcast'::text) AND (private IS TRUE))`),
]);

export const messages20260225InRealtime = realtime.table("messages_2026_02_25", {
	topic: text().notNull(),
	extension: text().notNull(),
	payload: jsonb(),
	event: text(),
	private: boolean().default(false),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	insertedAt: timestamp("inserted_at").default(sql`now()`).notNull(),
	id: uuid().defaultRandom().notNull(),
}, (table) => [
	primaryKey({ columns: [table.id, table.insertedAt], name: "messages_2026_02_25_pkey"}),
	index("messages_2026_02_25_inserted_at_topic_idx").using("btree", table.insertedAt.desc().nullsFirst(), table.topic.asc().nullsLast()).where(sql`((extension = 'broadcast'::text) AND (private IS TRUE))`),
]);

export const messages20260226InRealtime = realtime.table("messages_2026_02_26", {
	topic: text().notNull(),
	extension: text().notNull(),
	payload: jsonb(),
	event: text(),
	private: boolean().default(false),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	insertedAt: timestamp("inserted_at").default(sql`now()`).notNull(),
	id: uuid().defaultRandom().notNull(),
}, (table) => [
	primaryKey({ columns: [table.id, table.insertedAt], name: "messages_2026_02_26_pkey"}),
	index("messages_2026_02_26_inserted_at_topic_idx").using("btree", table.insertedAt.desc().nullsFirst(), table.topic.asc().nullsLast()).where(sql`((extension = 'broadcast'::text) AND (private IS TRUE))`),
]);

export const messages20260227InRealtime = realtime.table("messages_2026_02_27", {
	topic: text().notNull(),
	extension: text().notNull(),
	payload: jsonb(),
	event: text(),
	private: boolean().default(false),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	insertedAt: timestamp("inserted_at").default(sql`now()`).notNull(),
	id: uuid().defaultRandom().notNull(),
}, (table) => [
	primaryKey({ columns: [table.id, table.insertedAt], name: "messages_2026_02_27_pkey"}),
	index("messages_2026_02_27_inserted_at_topic_idx").using("btree", table.insertedAt.desc().nullsFirst(), table.topic.asc().nullsLast()).where(sql`((extension = 'broadcast'::text) AND (private IS TRUE))`),
]);

export const messages20260228InRealtime = realtime.table("messages_2026_02_28", {
	topic: text().notNull(),
	extension: text().notNull(),
	payload: jsonb(),
	event: text(),
	private: boolean().default(false),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
	insertedAt: timestamp("inserted_at").default(sql`now()`).notNull(),
	id: uuid().defaultRandom().notNull(),
}, (table) => [
	primaryKey({ columns: [table.id, table.insertedAt], name: "messages_2026_02_28_pkey"}),
	index("messages_2026_02_28_inserted_at_topic_idx").using("btree", table.insertedAt.desc().nullsFirst(), table.topic.asc().nullsLast()).where(sql`((extension = 'broadcast'::text) AND (private IS TRUE))`),
]);

export const schemaMigrationsInRealtime = realtime.table("schema_migrations", {
	version: bigint({ mode: 'number' }).primaryKey(),
	insertedAt: timestamp("inserted_at", { precision: 0 }),
});

export const subscriptionInRealtime = realtime.table("subscription", {
	id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
	subscriptionId: uuid("subscription_id").notNull(),
	entity: customType({ dataType: () => 'regclass' })().notNull(),
	filters: customType({ dataType: () => 'realtime.user_defined_filter' })().array().default([]).notNull(),
	claims: jsonb().notNull(),
	claimsRole: customType({ dataType: () => 'regrole' })("claims_role").notNull().generatedAlwaysAs(sql`realtime.to_regrole((claims ->> 'role'::text))`),
	createdAt: timestamp("created_at").default(sql`timezone('utc'::text, now())`).notNull(),
	actionFilter: text("action_filter").default("*"),
}, (table) => [
	index("ix_realtime_subscription_entity").using("btree", table.entity.asc().nullsLast()),
	uniqueIndex("subscription_subscription_id_entity_filters_action_filter_key").using("btree", table.subscriptionId.asc().nullsLast(), table.entity.asc().nullsLast(), table.filters.asc().nullsLast(), table.actionFilter.asc().nullsLast()),
check("subscription_action_filter_check", sql`(action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text]))`),]);

export const bucketsInStorage = storage.table.withRLS("buckets", {
	id: text().primaryKey(),
	name: text().notNull(),
	owner: uuid(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	public: boolean().default(false),
	avifAutodetection: boolean("avif_autodetection").default(false),
	fileSizeLimit: bigint("file_size_limit", { mode: 'number' }),
	allowedMimeTypes: text("allowed_mime_types").array(),
	ownerId: text("owner_id"),
	type: buckettypeInStorage().default("STANDARD").notNull(),
}, (table) => [
	uniqueIndex("bname").using("btree", table.name.asc().nullsLast()),
]);

export const bucketsAnalyticsInStorage = storage.table.withRLS("buckets_analytics", {
	name: text().notNull(),
	type: buckettypeInStorage().default("ANALYTICS").notNull(),
	format: text().default("ICEBERG").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	id: uuid().defaultRandom().primaryKey(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => [
	uniqueIndex("buckets_analytics_unique_name_idx").using("btree", table.name.asc().nullsLast()).where(sql`(deleted_at IS NULL)`),
]);

export const bucketsVectorsInStorage = storage.table.withRLS("buckets_vectors", {
	id: text().primaryKey(),
	type: buckettypeInStorage().default("VECTOR").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const migrationsInStorage = storage.table.withRLS("migrations", {
	id: integer().primaryKey(),
	name: varchar({ length: 100 }).notNull(),
	hash: varchar({ length: 40 }).notNull(),
	executedAt: timestamp("executed_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("migrations_name_key").on(table.name),]);

export const objectsInStorage = storage.table.withRLS("objects", {
	id: uuid().defaultRandom().primaryKey(),
	bucketId: text("bucket_id").references(() => bucketsInStorage.id),
	name: text(),
	owner: uuid(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }).default(sql`now()`),
	metadata: jsonb(),
	pathTokens: text("path_tokens").array().generatedAlwaysAs(sql`string_to_array(name, '/'::text)`),
	version: text(),
	ownerId: text("owner_id"),
	userMetadata: jsonb("user_metadata"),
}, (table) => [
	uniqueIndex("bucketid_objname").using("btree", table.bucketId.asc().nullsLast(), table.name.asc().nullsLast()),
	index("idx_objects_bucket_id_name").using("btree", table.bucketId.asc().nullsLast(), table.name.asc().nullsLast()),
	index("idx_objects_bucket_id_name_lower").using("btree", table.bucketId.asc().nullsLast(), sql`true`),
	index("name_prefix_search").using("btree", table.name.asc().nullsLast().op("btree")),

	pgPolicy("Anyone can read avatars", { for: "select", using: sql`(bucket_id = 'avatars'::text)` }),

	pgPolicy("Org members can delete documents", { for: "delete", to: ["authenticated"], using: sql`((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can delete pitch exports", { for: "delete", to: ["authenticated"], using: sql`((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can delete startup assets", { for: "delete", to: ["authenticated"], using: sql`((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can read documents", { for: "select", to: ["authenticated"], using: sql`((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can read pitch exports", { for: "select", to: ["authenticated"], using: sql`((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can read startup assets", { for: "select", to: ["authenticated"], using: sql`((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can update documents", { for: "update", to: ["authenticated"], using: sql`((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can update pitch exports", { for: "update", to: ["authenticated"], using: sql`((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can update startup assets", { for: "update", to: ["authenticated"], using: sql`((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can upload documents", { for: "insert", to: ["authenticated"], withCheck: sql`((bucket_id = 'documents'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can upload pitch exports", { for: "insert", to: ["authenticated"], withCheck: sql`((bucket_id = 'pitch-exports'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Org members can upload startup assets", { for: "insert", to: ["authenticated"], withCheck: sql`((bucket_id = 'startup-assets'::text) AND ((storage.foldername(name))[1] = (( SELECT user_org_id() AS user_org_id))::text))` }),

	pgPolicy("Users can delete own avatar", { for: "delete", to: ["authenticated"], using: sql`((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text))` }),

	pgPolicy("Users can update own avatar", { for: "update", to: ["authenticated"], using: sql`((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text))` }),

	pgPolicy("Users can upload own avatar", { for: "insert", to: ["authenticated"], withCheck: sql`((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text))` }),
]);

export const s3MultipartUploadsInStorage = storage.table.withRLS("s3_multipart_uploads", {
	id: text().primaryKey(),
	inProgressSize: bigint("in_progress_size", { mode: 'number' }).default(0).notNull(),
	uploadSignature: text("upload_signature").notNull(),
	bucketId: text("bucket_id").notNull().references(() => bucketsInStorage.id),
	key: text().notNull(),
	version: text().notNull(),
	ownerId: text("owner_id"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	userMetadata: jsonb("user_metadata"),
}, (table) => [
	index("idx_multipart_uploads_list").using("btree", table.bucketId.asc().nullsLast(), table.key.asc().nullsLast(), table.createdAt.asc().nullsLast()),
]);

export const s3MultipartUploadsPartsInStorage = storage.table.withRLS("s3_multipart_uploads_parts", {
	id: uuid().defaultRandom().primaryKey(),
	uploadId: text("upload_id").notNull().references(() => s3MultipartUploadsInStorage.id, { onDelete: "cascade" } ),
	size: bigint({ mode: 'number' }).default(0).notNull(),
	partNumber: integer("part_number").notNull(),
	bucketId: text("bucket_id").notNull().references(() => bucketsInStorage.id),
	key: text().notNull(),
	etag: text().notNull(),
	ownerId: text("owner_id"),
	version: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
});

export const vectorIndexesInStorage = storage.table.withRLS("vector_indexes", {
	id: text().default(sql`gen_random_uuid()`).primaryKey(),
	name: text().notNull(),
	bucketId: text("bucket_id").notNull().references(() => bucketsVectorsInStorage.id),
	dataType: text("data_type").notNull(),
	dimension: integer().notNull(),
	distanceMetric: text("distance_metric").notNull(),
	metadataConfiguration: jsonb("metadata_configuration"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	uniqueIndex("vector_indexes_name_bucket_id_idx").using("btree", table.name.asc().nullsLast(), table.bucketId.asc().nullsLast()),
]);

export const schemaMigrationsInSupabaseMigrations = supabaseMigrations.table("schema_migrations", {
	version: text().primaryKey(),
	statements: text().array(),
	name: text(),
	createdBy: text("created_by"),
	idempotencyKey: text("idempotency_key"),
	rollback: text().array(),
}, (table) => [
	unique("schema_migrations_idempotency_key_key").on(table.idempotencyKey),]);

export const secretsInVault = vault.table("secrets", {
	id: uuid().defaultRandom().primaryKey(),
	name: text(),
	description: text().default("").notNull(),
	secret: text().notNull(),
	keyId: uuid("key_id"),
	nonce: customType({ dataType: () => 'bytea' })().default("vault._crypto_aead_det_noncegen()"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	uniqueIndex("secrets_name_idx").using("btree", table.name.asc().nullsLast()).where(sql`(name IS NOT NULL)`),
]);
export const pgStatStatementsInExtensions = extensions.view("pg_stat_statements", {	userid: customType({ dataType: () => 'oid' })(),
	dbid: customType({ dataType: () => 'oid' })(),
	toplevel: boolean(),
	queryid: bigint({ mode: 'number' }),
	query: text(),
	plans: bigint({ mode: 'number' }),
	totalPlanTime: doublePrecision("total_plan_time"),
	minPlanTime: doublePrecision("min_plan_time"),
	maxPlanTime: doublePrecision("max_plan_time"),
	meanPlanTime: doublePrecision("mean_plan_time"),
	stddevPlanTime: doublePrecision("stddev_plan_time"),
	calls: bigint({ mode: 'number' }),
	totalExecTime: doublePrecision("total_exec_time"),
	minExecTime: doublePrecision("min_exec_time"),
	maxExecTime: doublePrecision("max_exec_time"),
	meanExecTime: doublePrecision("mean_exec_time"),
	stddevExecTime: doublePrecision("stddev_exec_time"),
	rows: bigint({ mode: 'number' }),
	sharedBlksHit: bigint("shared_blks_hit", { mode: 'number' }),
	sharedBlksRead: bigint("shared_blks_read", { mode: 'number' }),
	sharedBlksDirtied: bigint("shared_blks_dirtied", { mode: 'number' }),
	sharedBlksWritten: bigint("shared_blks_written", { mode: 'number' }),
	localBlksHit: bigint("local_blks_hit", { mode: 'number' }),
	localBlksRead: bigint("local_blks_read", { mode: 'number' }),
	localBlksDirtied: bigint("local_blks_dirtied", { mode: 'number' }),
	localBlksWritten: bigint("local_blks_written", { mode: 'number' }),
	tempBlksRead: bigint("temp_blks_read", { mode: 'number' }),
	tempBlksWritten: bigint("temp_blks_written", { mode: 'number' }),
	sharedBlkReadTime: doublePrecision("shared_blk_read_time"),
	sharedBlkWriteTime: doublePrecision("shared_blk_write_time"),
	localBlkReadTime: doublePrecision("local_blk_read_time"),
	localBlkWriteTime: doublePrecision("local_blk_write_time"),
	tempBlkReadTime: doublePrecision("temp_blk_read_time"),
	tempBlkWriteTime: doublePrecision("temp_blk_write_time"),
	walRecords: bigint("wal_records", { mode: 'number' }),
	walFpi: bigint("wal_fpi", { mode: 'number' }),
	walBytes: numeric("wal_bytes"),
	jitFunctions: bigint("jit_functions", { mode: 'number' }),
	jitGenerationTime: doublePrecision("jit_generation_time"),
	jitInliningCount: bigint("jit_inlining_count", { mode: 'number' }),
	jitInliningTime: doublePrecision("jit_inlining_time"),
	jitOptimizationCount: bigint("jit_optimization_count", { mode: 'number' }),
	jitOptimizationTime: doublePrecision("jit_optimization_time"),
	jitEmissionCount: bigint("jit_emission_count", { mode: 'number' }),
	jitEmissionTime: doublePrecision("jit_emission_time"),
	jitDeformCount: bigint("jit_deform_count", { mode: 'number' }),
	jitDeformTime: doublePrecision("jit_deform_time"),
	statsSince: timestamp("stats_since", { withTimezone: true }),
	minmaxStatsSince: timestamp("minmax_stats_since", { withTimezone: true }),
}).as(sql`SELECT userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, shared_blk_read_time, shared_blk_write_time, local_blk_read_time, local_blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time, jit_deform_count, jit_deform_time, stats_since, minmax_stats_since FROM pg_stat_statements(true) pg_stat_statements(userid, dbid, toplevel, queryid, query, plans, total_plan_time, min_plan_time, max_plan_time, mean_plan_time, stddev_plan_time, calls, total_exec_time, min_exec_time, max_exec_time, mean_exec_time, stddev_exec_time, rows, shared_blks_hit, shared_blks_read, shared_blks_dirtied, shared_blks_written, local_blks_hit, local_blks_read, local_blks_dirtied, local_blks_written, temp_blks_read, temp_blks_written, shared_blk_read_time, shared_blk_write_time, local_blk_read_time, local_blk_write_time, temp_blk_read_time, temp_blk_write_time, wal_records, wal_fpi, wal_bytes, jit_functions, jit_generation_time, jit_inlining_count, jit_inlining_time, jit_optimization_count, jit_optimization_time, jit_emission_count, jit_emission_time, jit_deform_count, jit_deform_time, stats_since, minmax_stats_since)`);

export const pgStatStatementsInfoInExtensions = extensions.view("pg_stat_statements_info", {	dealloc: bigint({ mode: 'number' }),
	statsReset: timestamp("stats_reset", { withTimezone: true }),
}).as(sql`SELECT dealloc, stats_reset FROM pg_stat_statements_info() pg_stat_statements_info(dealloc, stats_reset)`);

export const assumptionEvidence = pgView("assumption_evidence", {	assumptionId: uuid("assumption_id"),
	startupId: uuid("startup_id"),
	assumptionStatement: text("assumption_statement"),
	assumptionStatus: assumptionStatus("assumption_status"),
	totalInsights: bigint("total_insights", { mode: 'number' }),
	supportingInsights: bigint("supporting_insights", { mode: 'number' }),
	refutingInsights: bigint("refuting_insights", { mode: 'number' }),
	neutralInsights: bigint("neutral_insights", { mode: 'number' }),
	avgConfidence: numeric("avg_confidence"),
	interviewIds: uuid("interview_ids").array().array("[][]"),
}).with({"securityInvoker":true}).as(sql`SELECT a.id AS assumption_id, a.startup_id, a.statement AS assumption_statement, a.status AS assumption_status, count(ii.id) AS total_insights, count(ii.id) FILTER (WHERE ii.supports_assumptions = true) AS supporting_insights, count(ii.id) FILTER (WHERE ii.supports_assumptions = false) AS refuting_insights, count(ii.id) FILTER (WHERE ii.supports_assumptions IS NULL) AS neutral_insights, avg(ii.confidence) AS avg_confidence, array_agg(DISTINCT ii.interview_id) FILTER (WHERE ii.id IS NOT NULL) AS interview_ids FROM assumptions a LEFT JOIN interview_insights ii ON a.id = ANY (ii.linked_assumption_ids) GROUP BY a.id, a.startup_id, a.statement, a.status`);

export const calendarEvents = pgView("calendar_events", {	id: uuid(),
	startupId: uuid("startup_id"),
	title: text(),
	description: text(),
	eventType: eventType("event_type"),
	status: eventStatus(),
	startDate: timestamp("start_date", { withTimezone: true }),
	endDate: timestamp("end_date", { withTimezone: true }),
	allDay: boolean("all_day"),
	location: text(),
	virtualMeetingUrl: text("virtual_meeting_url"),
	attendees: jsonb(),
	relatedContactId: uuid("related_contact_id"),
	relatedDealId: uuid("related_deal_id"),
	relatedProjectId: uuid("related_project_id"),
	reminderMinutes: integer("reminder_minutes"),
	recurrenceRule: text("recurrence_rule"),
	color: text(),
	metadata: jsonb(),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
}).with({"securityInvoker":true}).as(sql`SELECT id, startup_id, title, description, event_type, status, start_date, end_date, all_day, location, virtual_meeting_url, attendees, related_contact_id, related_deal_id, related_project_id, reminder_minutes, recurrence_rule, color, metadata, created_by, created_at, updated_at FROM events WHERE event_scope = 'internal'::event_scope`);

export const customerForcesBalance = pgView("customer_forces_balance", {	segmentId: uuid("segment_id"),
	startupId: uuid("startup_id"),
	segmentName: text("segment_name"),
	pushTotal: bigint("push_total", { mode: 'number' }),
	pullTotal: bigint("pull_total", { mode: 'number' }),
	inertiaTotal: bigint("inertia_total", { mode: 'number' }),
	frictionTotal: bigint("friction_total", { mode: 'number' }),
	netForceBalance: bigint("net_force_balance", { mode: 'number' }),
}).with({"securityInvoker":true}).as(sql`SELECT cs.id AS segment_id, cs.startup_id, cs.name AS segment_name, COALESCE(sum( CASE WHEN cf.force_type = 'push'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS push_total, COALESCE(sum( CASE WHEN cf.force_type = 'pull'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS pull_total, COALESCE(sum( CASE WHEN cf.force_type = 'inertia'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS inertia_total, COALESCE(sum( CASE WHEN cf.force_type = 'friction'::force_type THEN cf.strength ELSE 0 END), 0::bigint) AS friction_total, COALESCE(sum( CASE WHEN cf.force_type = ANY (ARRAY['push'::force_type, 'pull'::force_type]) THEN cf.strength ELSE 0 END), 0::bigint) - COALESCE(sum( CASE WHEN cf.force_type = ANY (ARRAY['inertia'::force_type, 'friction'::force_type]) THEN cf.strength ELSE 0 END), 0::bigint) AS net_force_balance FROM customer_segments cs LEFT JOIN customer_forces cf ON cf.segment_id = cs.id GROUP BY cs.id, cs.startup_id, cs.name`);

export const dashboardMetrics = pgMaterializedView("dashboard_metrics", {	startupId: uuid("startup_id"),
	startupName: text("startup_name"),
	orgId: uuid("org_id"),
	tasksTotal: bigint("tasks_total", { mode: 'number' }),
	tasksCompleted: bigint("tasks_completed", { mode: 'number' }),
	tasksInProgress: bigint("tasks_in_progress", { mode: 'number' }),
	tasksOverdue: bigint("tasks_overdue", { mode: 'number' }),
	taskCompletionRate: numeric("task_completion_rate"),
	contactsTotal: bigint("contacts_total", { mode: 'number' }),
	contactsThisWeek: bigint("contacts_this_week", { mode: 'number' }),
	dealsTotal: bigint("deals_total", { mode: 'number' }),
	dealsActive: bigint("deals_active", { mode: 'number' }),
	dealsWon: bigint("deals_won", { mode: 'number' }),
	dealsTotalValue: numeric("deals_total_value"),
	dealWinRate: numeric("deal_win_rate"),
	canvasCount: bigint("canvas_count", { mode: 'number' }),
	canvasCompletionPct: integer("canvas_completion_pct"),
	pitchDeckCount: bigint("pitch_deck_count", { mode: 'number' }),
	pitchDeckSlides: integer("pitch_deck_slides"),
	validationScore: integer("validation_score"),
	validationActive: boolean("validation_active"),
	experimentsTotal: bigint("experiments_total", { mode: 'number' }),
	experimentsCompleted: bigint("experiments_completed", { mode: 'number' }),
	interviewsTotal: bigint("interviews_total", { mode: 'number' }),
	interviewsThisWeek: bigint("interviews_this_week", { mode: 'number' }),
	activitiesThisWeek: bigint("activities_this_week", { mode: 'number' }),
	activitiesTotal: bigint("activities_total", { mode: 'number' }),
	healthScore: integer("health_score"),
	refreshedAt: timestamp("refreshed_at", { withTimezone: true }),
}).as(sql`SELECT s.id AS startup_id, s.name AS startup_name, s.org_id, COALESCE(t.tasks_total, 0::bigint) AS tasks_total, COALESCE(t.tasks_completed, 0::bigint) AS tasks_completed, COALESCE(t.tasks_in_progress, 0::bigint) AS tasks_in_progress, COALESCE(t.tasks_overdue, 0::bigint) AS tasks_overdue, CASE WHEN COALESCE(t.tasks_total, 0::bigint) > 0 THEN round(COALESCE(t.tasks_completed, 0::bigint)::numeric / t.tasks_total::numeric * 100::numeric) ELSE 0::numeric END AS task_completion_rate, COALESCE(c.contacts_total, 0::bigint) AS contacts_total, COALESCE(c.contacts_this_week, 0::bigint) AS contacts_this_week, COALESCE(d.deals_total, 0::bigint) AS deals_total, COALESCE(d.deals_active, 0::bigint) AS deals_active, COALESCE(d.deals_won, 0::bigint) AS deals_won, COALESCE(d.deals_value, 0::numeric) AS deals_total_value, CASE WHEN COALESCE(d.deals_total, 0::bigint) > 0 THEN round(COALESCE(d.deals_won, 0::bigint)::numeric / d.deals_total::numeric * 100::numeric) ELSE 0::numeric END AS deal_win_rate, COALESCE(lc.canvas_count, 0::bigint) AS canvas_count, COALESCE(lc.canvas_completion, 0) AS canvas_completion_pct, COALESCE(pd.deck_count, 0::bigint) AS pitch_deck_count, COALESCE(pd.total_slides, 0) AS pitch_deck_slides, COALESCE(v.validation_score, 0) AS validation_score, COALESCE(v.is_active, false) AS validation_active, COALESCE(e.experiments_total, 0::bigint) AS experiments_total, COALESCE(e.experiments_completed, 0::bigint) AS experiments_completed, COALESCE(i.interviews_total, 0::bigint) AS interviews_total, COALESCE(i.interviews_this_week, 0::bigint) AS interviews_this_week, COALESCE(a.activities_this_week, 0::bigint) AS activities_this_week, COALESCE(a.activities_total, 0::bigint) AS activities_total, LEAST(100::numeric, GREATEST(0::numeric, COALESCE(COALESCE(t.tasks_completed, 0::bigint)::numeric / NULLIF(t.tasks_total, 0)::numeric * 20::numeric, 0::numeric) + CASE WHEN COALESCE(lc.canvas_completion, 0) > 0 THEN 20 ELSE 0 END::numeric + CASE WHEN COALESCE(pd.total_slides, 0) >= 10 THEN 20 ELSE COALESCE(pd.total_slides, 0) * 2 END::numeric + CASE WHEN COALESCE(v.validation_score, 0) > 0 THEN 20 ELSE 0 END::numeric + CASE WHEN COALESCE(a.activities_this_week, 0::bigint) >= 5 THEN 20::bigint ELSE COALESCE(a.activities_this_week, 0::bigint) * 4 END::numeric))::integer AS health_score, now() AS refreshed_at FROM startups s LEFT JOIN LATERAL ( SELECT count(*) AS tasks_total, count(*) FILTER (WHERE tasks.status = 'completed'::text) AS tasks_completed, count(*) FILTER (WHERE tasks.status = 'in_progress'::text) AS tasks_in_progress, count(*) FILTER (WHERE tasks.status <> 'completed'::text AND tasks.due_at < CURRENT_DATE) AS tasks_overdue FROM tasks WHERE tasks.startup_id = s.id) t ON true LEFT JOIN LATERAL ( SELECT count(*) AS contacts_total, count(*) FILTER (WHERE contacts.created_at > (now() - '7 days'::interval)) AS contacts_this_week FROM contacts WHERE contacts.startup_id = s.id) c ON true LEFT JOIN LATERAL ( SELECT count(*) AS deals_total, count(*) FILTER (WHERE deals.is_active = true) AS deals_active, count(*) FILTER (WHERE deals.stage = 'won'::text) AS deals_won, COALESCE(sum(deals.amount), 0::numeric) AS deals_value FROM deals WHERE deals.startup_id = s.id) d ON true LEFT JOIN LATERAL ( SELECT count(*) AS canvas_count, max( CASE WHEN lean_canvases.problem IS NOT NULL THEN 11 WHEN lean_canvases.customer_segments IS NOT NULL THEN 11 WHEN lean_canvases.unique_value_proposition IS NOT NULL THEN 11 WHEN lean_canvases.solution IS NOT NULL THEN 11 WHEN lean_canvases.channels IS NOT NULL THEN 11 WHEN lean_canvases.revenue_streams IS NOT NULL THEN 11 WHEN lean_canvases.cost_structure IS NOT NULL THEN 11 WHEN lean_canvases.key_metrics IS NOT NULL THEN 11 WHEN lean_canvases.unfair_advantage IS NOT NULL THEN 11 ELSE 0 END) AS canvas_completion FROM lean_canvases WHERE lean_canvases.startup_id = s.id AND lean_canvases.is_current = true) lc ON true LEFT JOIN LATERAL ( SELECT count(*) AS deck_count, COALESCE(max(pitch_decks.slide_count), 0) AS total_slides FROM pitch_decks WHERE pitch_decks.startup_id = s.id) pd ON true LEFT JOIN LATERAL ( SELECT COALESCE(vr.score::integer, 0) AS validation_score, true AS is_active FROM validator_reports vr WHERE vr.startup_id = s.id ORDER BY vr.created_at DESC LIMIT 1) v ON true LEFT JOIN LATERAL ( SELECT count(*) AS experiments_total, count(*) FILTER (WHERE ex.status = 'completed'::experiment_status) AS experiments_completed FROM experiments ex JOIN assumptions asm ON asm.id = ex.assumption_id WHERE asm.startup_id = s.id) e ON true LEFT JOIN LATERAL ( SELECT count(*) AS interviews_total, count(*) FILTER (WHERE interviews.conducted_at > (now() - '7 days'::interval)) AS interviews_this_week FROM interviews WHERE interviews.startup_id = s.id) i ON true LEFT JOIN LATERAL ( SELECT count(*) AS activities_total, count(*) FILTER (WHERE activities.created_at > (now() - '7 days'::interval)) AS activities_this_week FROM activities WHERE activities.startup_id = s.id) a ON true`);

export const eventsDirectory = pgView("events_directory", {	id: uuid(),
	name: text(),
	displayName: text("display_name"),
	description: text(),
	startDate: timestamp("start_date", { withTimezone: true }),
	endDate: timestamp("end_date", { withTimezone: true }),
	location: text(),
	displayLocation: text("display_location"),
	eventType: eventType("event_type"),
	status: eventStatus(),
	eventSource: text("event_source"),
	eventScope: eventScope("event_scope"),
	startupId: uuid("startup_id"),
	capacity: integer(),
	budget: numeric(),
	ticketPrice: numeric("ticket_price"),
	registrationUrl: text("registration_url"),
	isPublic: boolean("is_public"),
	slug: text(),
	coverImageUrl: text("cover_image_url"),
	organizerName: text("organizer_name"),
	organizerLogoUrl: text("organizer_logo_url"),
	tags: text().array().array("[][]"),
	industry: text(),
	targetAudience: text("target_audience").array().array("[][]"),
	relatedContactId: uuid("related_contact_id"),
	relatedDealId: uuid("related_deal_id"),
	virtualMeetingUrl: text("virtual_meeting_url"),
	startupRelevance: integer("startup_relevance"),
	ticketCostTier: text("ticket_cost_tier"),
	ticketCostMin: numeric("ticket_cost_min"),
	ticketCostMax: numeric("ticket_cost_max"),
	externalUrl: text("external_url"),
	categories: eventCategory().array().array("[][]"),
	topics: text().array().array("[][]"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
}).with({"securityInvoker":true}).as(sql`SELECT events.id, events.name, COALESCE(events.name, events.title) AS display_name, events.description, events.start_date, events.end_date, events.location, events.location AS display_location, events.event_type, events.status, 'hosted'::text AS event_source, events.event_scope, events.startup_id, events.capacity, events.budget, events.ticket_price, events.registration_url, events.is_public, events.slug, events.cover_image_url, events.organizer_name, events.organizer_logo_url, events.tags, events.industry, events.target_audience, events.related_contact_id, events.related_deal_id, events.virtual_meeting_url, NULL::integer AS startup_relevance, NULL::text AS ticket_cost_tier, NULL::numeric AS ticket_cost_min, NULL::numeric AS ticket_cost_max, NULL::text AS external_url, NULL::event_category[] AS categories, NULL::text[] AS topics, events.created_at, events.updated_at, events.published_at, events.cancelled_at FROM events WHERE events.event_scope = 'hosted'::event_scope UNION ALL SELECT industry_events.id, industry_events.name, COALESCE(industry_events.full_name, industry_events.name) AS display_name, industry_events.description, industry_events.event_date::timestamp with time zone AS start_date, industry_events.end_date::timestamp with time zone AS end_date, (industry_events.location_city || ', '::text) || COALESCE(industry_events.location_country, ''::text) AS location, (industry_events.location_city || ', '::text) || COALESCE(industry_events.location_country, ''::text) AS display_location, 'conference'::event_type AS event_type, CASE WHEN industry_events.event_date < CURRENT_DATE THEN 'completed'::event_status WHEN industry_events.event_date >= CURRENT_DATE THEN 'scheduled'::event_status ELSE 'scheduled'::event_status END AS status, 'industry'::text AS event_source, 'external'::event_scope AS event_scope, NULL::uuid AS startup_id, NULL::integer AS capacity, NULL::numeric AS budget, NULL::numeric AS ticket_price, industry_events.registration_url, true AS is_public, industry_events.slug, NULL::text AS cover_image_url, NULL::text AS organizer_name, NULL::text AS organizer_logo_url, industry_events.tags, NULL::text AS industry, industry_events.audience_types AS target_audience, NULL::uuid AS related_contact_id, NULL::uuid AS related_deal_id, NULL::text AS virtual_meeting_url, industry_events.startup_relevance, industry_events.ticket_cost_tier::text AS ticket_cost_tier, industry_events.ticket_cost_min, industry_events.ticket_cost_max, industry_events.website_url AS external_url, industry_events.categories, industry_events.topics, industry_events.created_at, industry_events.updated_at, NULL::timestamp with time zone AS published_at, NULL::timestamp with time zone AS cancelled_at FROM industry_events WHERE industry_events.event_date >= (CURRENT_DATE - '30 days'::interval) OR industry_events.event_date IS NULL`);

export const hostedEvents = pgView("hosted_events", {	id: uuid(),
	startupId: uuid("startup_id"),
	title: text(),
	name: text(),
	description: text(),
	eventType: eventType("event_type"),
	status: eventStatus(),
	startDate: timestamp("start_date", { withTimezone: true }),
	endDate: timestamp("end_date", { withTimezone: true }),
	timezone: text(),
	locationType: eventLocationType("location_type"),
	location: text(),
	capacity: integer(),
	budget: numeric({ precision: 10, scale: 2 }),
	ticketPrice: numeric("ticket_price", { precision: 10, scale: 2 }),
	healthScore: integer("health_score"),
	tasksTotal: integer("tasks_total"),
	tasksCompleted: integer("tasks_completed"),
	sponsorsTarget: integer("sponsors_target"),
	sponsorsConfirmed: integer("sponsors_confirmed"),
	registrationUrl: text("registration_url"),
	registrationDeadline: timestamp("registration_deadline", { withTimezone: true }),
	isPublic: boolean("is_public"),
	requiresApproval: boolean("requires_approval"),
	slug: text(),
	tags: text().array().array("[][]"),
	agenda: jsonb(),
	coverImageUrl: text("cover_image_url"),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
	organizerName: text("organizer_name"),
	organizerLogoUrl: text("organizer_logo_url"),
	industry: text(),
	targetAudience: text("target_audience").array().array("[][]"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
}).with({"securityInvoker":true}).as(sql`SELECT id, startup_id, title, name, description, event_type, status, start_date, end_date, timezone, location_type, location, capacity, budget, ticket_price, health_score, tasks_total, tasks_completed, sponsors_target, sponsors_confirmed, registration_url, registration_deadline, is_public, requires_approval, slug, tags, agenda, cover_image_url, published_at, cancelled_at, organizer_name, organizer_logo_url, industry, target_audience, created_at, updated_at FROM events WHERE event_scope = 'hosted'::event_scope`);

export const decryptedSecretsInVault = vault.view("decrypted_secrets", {	id: uuid(),
	name: text(),
	description: text(),
	secret: text(),
	decryptedSecret: text("decrypted_secret"),
	keyId: uuid("key_id"),
	nonce: customType({ dataType: () => 'bytea' })(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
}).as(sql`SELECT id, name, description, secret, convert_from(vault._crypto_aead_det_decrypt(message => decode(secret, 'base64'::text), additional => convert_to(id::text, 'utf8'::name), key_id => 0::bigint, context => '\x7067736f6469756d'::bytea, nonce => nonce), 'utf8'::name) AS decrypted_secret, key_id, nonce, created_at, updated_at FROM vault.secrets s`);