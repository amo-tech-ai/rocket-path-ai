-- Update knowledge_chunks table for OpenAI text-embedding-3-small (1536 dimensions)
-- This migration updates the vector dimension from 768 (Gemini) to 1536 (OpenAI)

-- First, drop the existing index
DROP INDEX IF EXISTS knowledge_chunks_embedding_idx;

-- Make embedding nullable first (if not already), then set all to NULL
ALTER TABLE public.knowledge_chunks ALTER COLUMN embedding DROP NOT NULL;
UPDATE public.knowledge_chunks SET embedding = NULL;

-- Now drop and recreate with new dimension
ALTER TABLE public.knowledge_chunks DROP COLUMN embedding;
ALTER TABLE public.knowledge_chunks ADD COLUMN embedding vector(1536);

-- Recreate the HNSW index with the new dimension
CREATE INDEX knowledge_chunks_embedding_idx ON public.knowledge_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Drop the old search function(s) with different signatures
DROP FUNCTION IF EXISTS public.search_knowledge(vector, double precision, integer, text, integer, text);

-- Create updated search function for 1536 dimensions
CREATE OR REPLACE FUNCTION public.search_knowledge(
  query_embedding vector(1536),
  match_threshold double precision DEFAULT 0.75,
  match_count integer DEFAULT 5,
  filter_category text DEFAULT NULL,
  filter_industry text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  content text,
  source text,
  source_type text,
  year integer,
  confidence text,
  category text,
  industry text,
  similarity double precision
)
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    kc.id,
    kc.content,
    kc.source,
    kc.source_type,
    kc.year,
    kc.confidence,
    kc.category,
    kc.industry,
    1 - (kc.embedding <=> query_embedding) as similarity
  FROM knowledge_chunks kc
  WHERE 
    kc.embedding IS NOT NULL
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
    AND (filter_category IS NULL OR kc.category = filter_category)
    AND (filter_industry IS NULL OR kc.industry = filter_industry)
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.search_knowledge(vector(1536), double precision, integer, text, text) TO authenticated;

-- Add documentation
COMMENT ON FUNCTION public.search_knowledge IS 'Semantic search using OpenAI text-embedding-3-small (1536 dims)';