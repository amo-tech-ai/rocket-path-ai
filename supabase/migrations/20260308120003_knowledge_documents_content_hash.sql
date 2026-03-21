-- Add content_hash to knowledge_documents for ingest dedupe (used by knowledge-ingest).
-- Idempotent: ADD COLUMN IF NOT EXISTS.

ALTER TABLE public.knowledge_documents
  ADD COLUMN IF NOT EXISTS content_hash text;

COMMENT ON COLUMN public.knowledge_documents.content_hash IS 'SHA-256 of markdown content for dedupe; ingest skips when match exists.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_knowledge_documents_content_hash
  ON public.knowledge_documents(content_hash)
  WHERE content_hash IS NOT NULL;
