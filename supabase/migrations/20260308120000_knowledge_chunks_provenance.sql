-- 013: Provenance columns for knowledge_chunks (source_path, chunk_kind, chunk_index)
-- Nullable for existing rows; new ingest sets values. Enables traceability and re-ingest by file.

ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS source_path text,
  ADD COLUMN IF NOT EXISTS chunk_kind text,
  ADD COLUMN IF NOT EXISTS chunk_index integer;

COMMENT ON COLUMN public.knowledge_chunks.source_path IS 'Relative path to source file (e.g. research/AI/topics/02-agentic-ai-report.md)';
COMMENT ON COLUMN public.knowledge_chunks.chunk_kind IS 'text | table; set by chunker when 014 table extraction is used';
COMMENT ON COLUMN public.knowledge_chunks.chunk_index IS '0-based index of chunk within the document';

-- Optional: constrain chunk_kind to known values (default to text for backfill)
ALTER TABLE public.knowledge_chunks
  DROP CONSTRAINT IF EXISTS knowledge_chunks_chunk_kind_check;
ALTER TABLE public.knowledge_chunks
  ADD CONSTRAINT knowledge_chunks_chunk_kind_check
  CHECK (chunk_kind IS NULL OR chunk_kind IN ('text', 'table'));
