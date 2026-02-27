-- 013: Add citation fields to search_knowledge return for "Source: X, p.Y" UX
-- JOIN knowledge_documents to get document title; include document_id, section_title, page_start, page_end

DROP FUNCTION IF EXISTS public.search_knowledge(vector(1536), double precision, integer, text, text);

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
  similarity double precision,
  document_id uuid,
  document_title text,
  section_title text,
  page_start integer,
  page_end integer
)
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, extensions
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
    1 - (kc.embedding <=> query_embedding) as similarity,
    kc.document_id,
    kd.title as document_title,
    kc.section_title,
    kc.page_start,
    kc.page_end
  FROM knowledge_chunks kc
  LEFT JOIN knowledge_documents kd ON kc.document_id = kd.id
  WHERE
    kc.embedding IS NOT NULL
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
    AND (filter_category IS NULL OR kc.category = filter_category)
    AND (filter_industry IS NULL OR kc.industry = filter_industry)
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$;

GRANT EXECUTE ON FUNCTION public.search_knowledge(vector(1536), double precision, integer, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_knowledge(vector(1536), double precision, integer, text, text) TO service_role;

COMMENT ON FUNCTION public.search_knowledge IS 'Semantic search with citation fields: document_id, document_title, section_title, page_start, page_end for Source: X p.Y';
