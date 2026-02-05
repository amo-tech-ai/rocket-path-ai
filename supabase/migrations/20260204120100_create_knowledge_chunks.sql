-- =============================================================================
-- migration: 20260204120100_create_knowledge_chunks.sql
-- purpose: create knowledge_chunks table for RAG with pgvector
-- task_ref: 105-VDB
-- dependencies: pgvector extension (already enabled)
-- =============================================================================

-- =============================================================================
-- 1. verify pgvector extension is enabled
-- =============================================================================

create extension if not exists vector with schema extensions;

-- =============================================================================
-- 2. create source_type enum
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'knowledge_source_type') then
    create type public.knowledge_source_type as enum (
      'deloitte',
      'bcg',
      'pwc',
      'mckinsey',
      'cb_insights',
      'gartner',
      'forrester',
      'harvard_business_review',
      'mit_sloan',
      'yc_research',
      'a16z',
      'sequoia',
      'internal',
      'other'
    );
  end if;
end$$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'confidence_level') then
    create type public.confidence_level as enum (
      'high',
      'medium',
      'low'
    );
  end if;
end$$;

-- =============================================================================
-- 3. table: knowledge_chunks
-- =============================================================================

create table if not exists public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),

  -- content
  content text not null,
  embedding vector(768) not null,

  -- source metadata
  source text not null,
  source_type text not null,
  source_url text,
  year integer not null,
  sample_size integer,

  -- classification
  confidence text not null default 'medium' check (confidence in ('high', 'medium', 'low')),
  category text not null,
  subcategory text,
  tags text[] default '{}',

  -- context
  industry text,
  stage text,
  region text,

  -- usage tracking
  fetch_count integer not null default 0,
  last_fetched_at timestamptz,

  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add table comments
comment on table public.knowledge_chunks is 'RAG knowledge base - embedded statistics from Tier A sources for Coach answers with citations.';
comment on column public.knowledge_chunks.content is 'The statistic or fact text to be embedded and retrieved';
comment on column public.knowledge_chunks.embedding is 'Vector embedding from text-embedding-004 (768 dimensions)';
comment on column public.knowledge_chunks.source is 'Human-readable source name (e.g., "Deloitte State of AI 2026")';
comment on column public.knowledge_chunks.source_type is 'Tier A source category';
comment on column public.knowledge_chunks.sample_size is 'Sample size (n) for statistical credibility';
comment on column public.knowledge_chunks.confidence is 'Data reliability: high (n>1000), medium (n>100), low (n<100 or estimates)';

-- =============================================================================
-- 4. indexes
-- =============================================================================

-- HNSW index for fast approximate nearest neighbor search
-- m=16 controls the number of bi-directional links, higher = better recall, more memory
-- ef_construction=64 controls index build quality, higher = better quality, slower build
create index if not exists idx_knowledge_chunks_embedding
  on public.knowledge_chunks
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

-- category index for filtered searches
create index if not exists idx_knowledge_chunks_category
  on public.knowledge_chunks(category);

-- source type index
create index if not exists idx_knowledge_chunks_source_type
  on public.knowledge_chunks(source_type);

-- year index for recency filtering
create index if not exists idx_knowledge_chunks_year
  on public.knowledge_chunks(year desc);

-- tags GIN index for array contains queries
create index if not exists idx_knowledge_chunks_tags
  on public.knowledge_chunks using gin(tags);

-- composite index for common filtered vector search
create index if not exists idx_knowledge_chunks_category_year
  on public.knowledge_chunks(category, year desc);

-- industry filter
create index if not exists idx_knowledge_chunks_industry
  on public.knowledge_chunks(industry)
  where industry is not null;

-- =============================================================================
-- 5. triggers
-- =============================================================================

create trigger trigger_knowledge_chunks_updated_at
  before update on public.knowledge_chunks
  for each row
  execute function public.handle_updated_at();

-- =============================================================================
-- 6. row level security
-- =============================================================================

alter table public.knowledge_chunks enable row level security;

-- All authenticated users can read knowledge chunks
create policy "authenticated users can read knowledge"
  on public.knowledge_chunks for select to authenticated
  using (true);

-- Only service role can insert/update/delete (admin operation)
create policy "service role can manage knowledge"
  on public.knowledge_chunks for all to service_role
  using (true) with check (true);

-- =============================================================================
-- 7. semantic search function
-- =============================================================================

-- Main search function - returns relevant chunks with similarity score
create or replace function public.search_knowledge(
  query_embedding vector(768),
  match_threshold float default 0.75,
  match_count int default 5,
  filter_category text default null,
  filter_year_min int default null,
  filter_industry text default null
)
returns table (
  id uuid,
  content text,
  source text,
  source_type text,
  year integer,
  sample_size integer,
  confidence text,
  category text,
  tags text[],
  similarity float
)
language plpgsql
security invoker
set search_path = public
as $$
begin
  return query
  select
    kc.id,
    kc.content,
    kc.source,
    kc.source_type,
    kc.year,
    kc.sample_size,
    kc.confidence,
    kc.category,
    kc.tags,
    1 - (kc.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks kc
  where 1 - (kc.embedding <=> query_embedding) > match_threshold
    and (filter_category is null or kc.category = filter_category)
    and (filter_year_min is null or kc.year >= filter_year_min)
    and (filter_industry is null or kc.industry = filter_industry)
  order by kc.embedding <=> query_embedding
  limit match_count;
end;
$$;

comment on function public.search_knowledge is 'Semantic search over knowledge chunks - returns top matches above threshold with optional filters';

-- Increment fetch count after search
create or replace function public.increment_knowledge_fetch(chunk_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.knowledge_chunks
  set
    fetch_count = fetch_count + 1,
    last_fetched_at = now()
  where id = any(chunk_ids);
end;
$$;

-- Get knowledge stats
create or replace function public.get_knowledge_stats()
returns jsonb
language sql
security invoker
set search_path = public
as $$
  select jsonb_build_object(
    'total_chunks', (select count(*) from knowledge_chunks),
    'by_category', (select jsonb_object_agg(category, cnt) from (select category, count(*) as cnt from knowledge_chunks group by category) c),
    'by_source_type', (select jsonb_object_agg(source_type, cnt) from (select source_type, count(*) as cnt from knowledge_chunks group by source_type) s),
    'by_year', (select jsonb_object_agg(year::text, cnt) from (select year, count(*) as cnt from knowledge_chunks group by year) y)
  );
$$;

-- =============================================================================
-- end of migration
-- =============================================================================
