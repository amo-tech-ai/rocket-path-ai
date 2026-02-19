-- S7: Add missing FK indexes on public schema tables
-- 15 foreign key columns without indexes — causes slow JOINs and CASCADE ops.
-- Reference: supabase-postgres-best-practices/schema-foreign-key-indexes.md
-- Verified: pg_constraint + pg_index query on 2026-02-10
-- Naming: idx_{table}_{column}

-- =============================================
-- pitch_decks
-- =============================================
CREATE INDEX IF NOT EXISTS idx_pitch_decks_last_edited_by ON pitch_decks (last_edited_by);

-- =============================================
-- sponsors
-- =============================================
CREATE INDEX IF NOT EXISTS idx_sponsors_created_by ON sponsors (created_by);

-- =============================================
-- event_venues
-- =============================================
CREATE INDEX IF NOT EXISTS idx_event_venues_created_by ON event_venues (created_by);

-- =============================================
-- event_attendees
-- =============================================
CREATE INDEX IF NOT EXISTS idx_event_attendees_checked_in_by ON event_attendees (checked_in_by);

-- =============================================
-- messages (3 missing)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_messages_created_by ON messages (created_by);
CREATE INDEX IF NOT EXISTS idx_messages_escalated_to ON messages (escalated_to);
-- Note: messages.event_id column exists alongside startup_event_id
-- The FK references events(id) via event_id
CREATE INDEX IF NOT EXISTS idx_messages_event_id ON messages (event_id);

-- =============================================
-- event_assets (2 missing)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_event_assets_approved_by ON event_assets (approved_by);
CREATE INDEX IF NOT EXISTS idx_event_assets_created_by ON event_assets (created_by);

-- =============================================
-- document_versions
-- =============================================
CREATE INDEX IF NOT EXISTS idx_document_versions_created_by ON document_versions (created_by);

-- =============================================
-- experiment_results
-- =============================================
CREATE INDEX IF NOT EXISTS idx_experiment_results_recorded_by ON experiment_results (recorded_by);

-- =============================================
-- interviews
-- =============================================
CREATE INDEX IF NOT EXISTS idx_interviews_conducted_by ON interviews (conducted_by);

-- =============================================
-- interview_insights
-- =============================================
CREATE INDEX IF NOT EXISTS idx_interview_insights_validated_by ON interview_insights (validated_by);

-- =============================================
-- workflows
-- =============================================
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON workflows (created_by);

-- =============================================
-- startup_members
-- =============================================
CREATE INDEX IF NOT EXISTS idx_startup_members_invited_by ON startup_members (invited_by);

-- =============================================
-- Verification: should return 0 rows for public schema after migration
-- SELECT c.conrelid::regclass, a.attname
-- FROM pg_constraint c
-- JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
-- WHERE c.contype = 'f'
--   AND c.conrelid::regclass::text NOT LIKE 'validation_%'
--   AND c.conrelid::regclass::text NOT LIKE 'auth.%'
--   AND c.conrelid::regclass::text NOT LIKE 'storage.%'
--   AND NOT EXISTS (
--     SELECT 1 FROM pg_index i
--     WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
--   );
-- =============================================
