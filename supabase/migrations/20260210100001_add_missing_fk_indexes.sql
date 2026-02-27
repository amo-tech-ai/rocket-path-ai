-- S7: Add missing FK indexes on public schema tables
-- 15 foreign key columns without indexes — causes slow JOINs and CASCADE ops.
-- Reference: supabase-postgres-best-practices/schema-foreign-key-indexes.md
-- Verified: pg_constraint + pg_index query on 2026-02-10
-- Naming: idx_{table}_{column}
-- NOTE: Ghost tables (sponsors, event_venues, event_attendees, messages,
--       event_assets, startup_members) exist in prod only with no CREATE TABLE
--       migration. Indexes for those are skipped here.

-- =============================================
-- pitch_decks.last_edited_by — SKIPPED (column exists in prod only)
-- =============================================

-- =============================================
-- sponsors — SKIPPED (no CREATE TABLE migration)
-- =============================================

-- =============================================
-- event_venues — SKIPPED (no CREATE TABLE migration)
-- =============================================

-- =============================================
-- event_attendees — SKIPPED (no CREATE TABLE migration)
-- =============================================

-- =============================================
-- messages — SKIPPED (no CREATE TABLE migration; only chat_messages exists)
-- =============================================

-- =============================================
-- event_assets — SKIPPED (no CREATE TABLE migration)
-- =============================================

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
-- startup_members — SKIPPED (table does not exist; app uses org_members instead)
-- =============================================
