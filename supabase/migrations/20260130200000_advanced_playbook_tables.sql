-- supabase/migrations/20260130200000_advanced_playbook_tables.sql
-- Description: Create playbook_runs and enhance lean_canvases, pitch_decks, and startups tables.

BEGIN;

-- =============================================================================
-- 1. Create playbook_runs table
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.playbook_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE,
    playbook_type TEXT NOT NULL, -- onboarding, validation, canvas, pitch, gtm, fundraise, roadmap, operations
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER,
    step_data JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for playbook_runs
ALTER TABLE public.playbook_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own startup playbook runs"
    ON public.playbook_runs
    FOR SELECT
    USING (
        startup_id IN (
            SELECT s.id FROM startups s
            JOIN organizations o ON s.org_id = o.id
            JOIN org_members om ON o.id = om.org_id
            WHERE om.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own startup playbook runs"
    ON public.playbook_runs
    FOR UPDATE
    USING (
        startup_id IN (
            SELECT s.id FROM startups s
            JOIN organizations o ON s.org_id = o.id
            JOIN org_members om ON o.id = om.org_id
            WHERE om.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own startup playbook runs"
    ON public.playbook_runs
    FOR INSERT
    WITH CHECK (
        startup_id IN (
            SELECT s.id FROM startups s
            JOIN organizations o ON s.org_id = o.id
            JOIN org_members om ON o.id = om.org_id
            WHERE om.user_id = auth.uid()
        )
    );

-- =============================================================================
-- 2. Enhance lean_canvases table
-- =============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_canvases' AND column_name = 'playbook_run_id') THEN
        ALTER TABLE public.lean_canvases ADD COLUMN playbook_run_id UUID REFERENCES public.playbook_runs(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lean_canvases' AND column_name = 'completeness_score') THEN
        ALTER TABLE public.lean_canvases ADD COLUMN completeness_score INTEGER DEFAULT 0;
    END IF;
END $$;

-- =============================================================================
-- 3. Enhance pitch_decks table
-- =============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pitch_decks' AND column_name = 'playbook_run_id') THEN
        ALTER TABLE public.pitch_decks ADD COLUMN playbook_run_id UUID REFERENCES public.playbook_runs(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pitch_decks' AND column_name = 'industry_pack') THEN
        ALTER TABLE public.pitch_decks ADD COLUMN industry_pack TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pitch_decks' AND column_name = 'wizard_data') THEN
        ALTER TABLE public.pitch_decks ADD COLUMN wizard_data JSONB DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pitch_decks' AND column_name = 'slides') THEN
        ALTER TABLE public.pitch_decks ADD COLUMN slides JSONB[] DEFAULT '{}'::jsonb[];
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pitch_decks' AND column_name = 'critique') THEN
        ALTER TABLE public.pitch_decks ADD COLUMN critique JSONB DEFAULT '{}'::jsonb;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pitch_decks' AND column_name = 'export_url') THEN
        ALTER TABLE public.pitch_decks ADD COLUMN export_url TEXT;
    END IF;
END $$;

-- =============================================================================
-- 4. Enhance startups table (Missing Field Mapping support)
-- =============================================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'why_now') THEN
        ALTER TABLE public.startups ADD COLUMN why_now TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'problem_one_liner') THEN
        ALTER TABLE public.startups ADD COLUMN problem_one_liner TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'one_liner') THEN
        ALTER TABLE public.startups ADD COLUMN one_liner TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'elevator_pitch') THEN
        ALTER TABLE public.startups ADD COLUMN elevator_pitch TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'tam_size') THEN
        ALTER TABLE public.startups ADD COLUMN tam_size NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'sam_size') THEN
        ALTER TABLE public.startups ADD COLUMN sam_size NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'som_size') THEN
        ALTER TABLE public.startups ADD COLUMN som_size NUMERIC;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'market_category') THEN
        ALTER TABLE public.startups ADD COLUMN market_category TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'startups' AND column_name = 'market_trends') THEN
        ALTER TABLE public.startups ADD COLUMN market_trends JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;

COMMIT;
