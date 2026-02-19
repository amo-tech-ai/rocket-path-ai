-- =============================================================================
-- migration: 20260206100000_knowledge_documents_llamacloud.sql
-- purpose: add knowledge_documents and citation columns for LlamaCloud ingestion
-- plan_ref: tasks/plan/04-llamacloud-supabase-ingestion.md
-- =============================================================================

-- =============================================================================
-- 1. table: knowledge_documents (one row per parsed PDF)
-- =============================================================================

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text,
  year integer,
  llama_parse_id text,
  created_at timestamptz not null default now()
);

comment on table public.knowledge_documents is 'One row per ingested document (e.g. PDF parsed via LlamaCloud).';
comment on column public.knowledge_documents.llama_parse_id is 'LlamaCloud Parse job ID (e.g. pjb-xxxx).';

alter table public.knowledge_documents enable row level security;

create policy "authenticated can read knowledge_documents"
  on public.knowledge_documents for select to authenticated
  using (true);

create policy "service_role can manage knowledge_documents"
  on public.knowledge_documents for all to service_role
  using (true) with check (true);

-- =============================================================================
-- 2. add citation columns to knowledge_chunks (nullable for existing rows)
-- =============================================================================

alter table public.knowledge_chunks
  add column if not exists document_id uuid references public.knowledge_documents(id) on delete set null,
  add column if not exists page_start integer,
  add column if not exists page_end integer,
  add column if not exists section_title text;

comment on column public.knowledge_chunks.document_id is 'Link to knowledge_documents for citation.';
comment on column public.knowledge_chunks.page_start is 'Start page number for citation.';
comment on column public.knowledge_chunks.page_end is 'End page number for citation.';
comment on column public.knowledge_chunks.section_title is 'Section or heading for citation.';

create index if not exists idx_knowledge_chunks_document_id
  on public.knowledge_chunks(document_id)
  where document_id is not null;
