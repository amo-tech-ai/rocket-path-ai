-- PITCH-P0-FIX: Drop orphan playbook_run_id FK and column from pitch_decks
-- Column has 0 non-null values. No code references. Prevents Domain 10 migration failure.

alter table public.pitch_decks
    drop constraint if exists pitch_decks_playbook_run_id_fkey;

alter table public.pitch_decks
    drop column if exists playbook_run_id;
