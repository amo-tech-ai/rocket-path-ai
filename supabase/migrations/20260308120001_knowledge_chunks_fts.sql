-- 014: Full-text search column and GIN index for hybrid search (015)
-- fts is generated from content so it stays in sync; English config for research docs.

ALTER TABLE public.knowledge_chunks
  ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

COMMENT ON COLUMN public.knowledge_chunks.fts IS 'Full-text search vector for hybrid search; generated from content';

CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_fts
  ON public.knowledge_chunks USING GIN (fts);
