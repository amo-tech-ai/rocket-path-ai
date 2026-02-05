-- =============================================================================
-- Migration: Drop industry and prompt pack tables (clean slate)
-- Purpose: Remove tables so next migration can create them from scratch
-- Order: Drop PARENT tables first with CASCADE to avoid deadlock (one lock at a time)
-- =============================================================================

-- Functions (no table locks that can deadlock)
drop function if exists public.get_industry_questions(text, text, text);
drop function if exists public.get_industry_ai_context(text);

-- Validation: parent first, then any dependents CASCADE may not have removed
drop table if exists public.validation_reports cascade;
drop table if exists public.validation_scores cascade;
drop table if exists public.validation_conditions cascade;
drop table if exists public.validation_metadata cascade;
drop table if exists public.framework_analyses cascade;
drop table if exists public.generated_ideas cascade;
drop table if exists public.market_sizes cascade;
drop table if exists public.benchmark_snapshots cascade;
drop table if exists public.critic_reviews cascade;

-- Automation chains: parent first, then dependents
drop table if exists public.automation_chains cascade;
drop table if exists public.chain_executions cascade;
drop table if exists public.automation_events cascade;
drop table if exists public.automation_rules cascade;

-- Automation triggers/executions (depend on prompt_packs and playbooks)
drop table if exists public.automation_executions cascade;
drop table if exists public.automation_triggers cascade;

-- Playbooks tree: parent first
drop table if exists public.startup_playbooks cascade;
drop table if exists public.playbooks cascade;
drop table if exists public.playbook_steps cascade;

-- Prompt pack dependents then parent (one at a time to reduce lock contention)
drop table if exists public.pack_dependencies cascade;
drop table if exists public.startup_memory cascade;
drop table if exists public.prompt_runs cascade;
drop table if exists public.prompt_pack_steps cascade;
drop table if exists public.prompt_packs cascade;

-- Industry
drop table if exists public.industry_questions cascade;
drop table if exists public.industry_packs cascade;
