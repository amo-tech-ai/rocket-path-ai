-- =============================================================================
-- Migration: 20260204100650_create_document_versions.sql
-- Description: Backfill CREATE TABLE for document_versions (exists in
--              production but had no CREATE TABLE migration).
--              Stores version snapshots of documents for history, restore,
--              and safety nets before AI operations.
-- Affected Tables: document_versions
-- Dependencies: documents, auth.users
-- Note: Uses IF NOT EXISTS since the table already exists in production.
--       The idx_document_versions_created_by index is added by a later
--       migration (20260210100001_add_missing_fk_indexes.sql).
-- =============================================================================

-- =============================================================================
-- 1. TABLE: document_versions
-- =============================================================================

create table if not exists public.document_versions (
  id uuid primary key default gen_random_uuid(),

  -- relationships
  document_id uuid not null references public.documents(id) on delete cascade,
  created_by uuid references auth.users(id),

  -- version data
  version_number integer not null default 1,
  content_json jsonb not null,
  metadata jsonb default '{}'::jsonb,
  label text,

  -- timestamps
  created_at timestamptz default now()
);

-- =============================================================================
-- 2. INDEXES
-- =============================================================================

-- FK index for document_id lookups and cascading deletes
create index if not exists idx_document_versions_document_id
  on public.document_versions(document_id);

-- =============================================================================
-- 3. ROW LEVEL SECURITY
-- =============================================================================

alter table public.document_versions enable row level security;

-- Access via documents -> startups -> org ownership (startup_in_org helper)

do $$ begin
  create policy "Users view document versions in org"
    on public.document_versions for select
    to authenticated
    using (
      document_id in (
        select d.id from public.documents d
        where startup_in_org(d.startup_id)
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users insert document versions in org"
    on public.document_versions for insert
    to authenticated
    with check (
      document_id in (
        select d.id from public.documents d
        where startup_in_org(d.startup_id)
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users update document versions in org"
    on public.document_versions for update
    to authenticated
    using (
      document_id in (
        select d.id from public.documents d
        where startup_in_org(d.startup_id)
      )
    )
    with check (
      document_id in (
        select d.id from public.documents d
        where startup_in_org(d.startup_id)
      )
    );
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Users delete document versions in org"
    on public.document_versions for delete
    to authenticated
    using (
      document_id in (
        select d.id from public.documents d
        where startup_in_org(d.startup_id)
      )
    );
exception when duplicate_object then null;
end $$;

-- =============================================================================
-- 4. COMMENTS
-- =============================================================================

comment on table public.document_versions is
  'Version history snapshots for documents (lean canvas, pitch decks) — restore, diff, safety nets before AI ops';

comment on column public.document_versions.version_number is
  'Auto-incrementing version counter per document (default 1, incremented by trigger)';

comment on column public.document_versions.content_json is
  'Full document content snapshot as JSONB';

comment on column public.document_versions.metadata is
  'Version metadata (author, change reason, etc.)';

comment on column public.document_versions.label is
  'Optional human-readable label (e.g., "Before AI edit", "v2 — added competitors")';
