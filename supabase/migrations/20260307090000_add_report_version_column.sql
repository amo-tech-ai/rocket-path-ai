-- Add report_version column to validator_reports
-- Root cause: pipeline.ts inserts report_version but the column didn't exist,
-- causing the INSERT to fail silently and leaving report_id as null.
ALTER TABLE validator_reports ADD COLUMN IF NOT EXISTS report_version text DEFAULT 'v2';
