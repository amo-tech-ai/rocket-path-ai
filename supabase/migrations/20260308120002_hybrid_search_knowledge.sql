-- 015: Hybrid search (semantic + full-text) with RRF; same return shape as search_knowledge for drop-in use.

CREATE OR REPLACE FUNCTION public.hybrid_search_knowledge(
  query_embedding vector(1536),
  query_text text,
  match_threshold double precision DEFAULT 0.75,
  match_count integer DEFAULT 10,
  filter_category text DEFAULT NULL,
  filter_industry text DEFAULT NULL,
  rrf_k integer DEFAULT 50
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
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  fts_query tsquery;
BEGIN
  -- Build FTS query; empty or invalid becomes a query that matches nothing (so FTS branch returns 0 rows)
  BEGIN
    IF NULLIF(trim(query_text), '') IS NULL THEN
      fts_query := to_tsquery('english', '');
    ELSE
      fts_query := websearch_to_tsquery('english', trim(query_text));
    END IF;
  EXCEPTION WHEN OTHERS THEN
    fts_query := to_tsquery('english', '');
  END;

  RETURN QUERY
  WITH semantic_search AS (
    SELECT
      kc.id,
      ROW_NUMBER() OVER (ORDER BY kc.embedding <=> query_embedding) AS rn
    FROM knowledge_chunks kc
    WHERE
      kc.embedding IS NOT NULL
      AND 1 - (kc.embedding <=> query_embedding) > match_threshold
      AND (filter_category IS NULL OR kc.category = filter_category)
      AND (filter_industry IS NULL OR kc.industry = filter_industry)
    ORDER BY kc.embedding <=> query_embedding
    LIMIT least(greatest(match_count * 2, 20), 1000)
  ),
  fulltext_search AS (
    SELECT
      kc.id,
      ROW_NUMBER() OVER (
        ORDER BY ts_rank(kc.fts, fts_query) DESC NULLS LAST
      ) AS rn
    FROM knowledge_chunks kc
    WHERE
      NULLIF(trim(query_text), '') IS NOT NULL
      AND kc.fts @@ fts_query
      AND (filter_category IS NULL OR kc.category = filter_category)
      AND (filter_industry IS NULL OR kc.industry = filter_industry)
    ORDER BY ts_rank(kc.fts, fts_query) DESC NULLS LAST
    LIMIT least(greatest(match_count * 2, 20), 1000)
  ),
  rrf_scores AS (
    SELECT
      COALESCE(s.id, f.id) AS id,
      (COALESCE(1.0 / (rrf_k + s.rn), 0) + COALESCE(1.0 / (rrf_k + f.rn), 0)) AS score
    FROM semantic_search s
    FULL OUTER JOIN fulltext_search f ON s.id = f.id
  )
  SELECT
    kc.id,
    kc.content,
    kc.source,
    kc.source_type,
    kc.year,
    kc.confidence,
    kc.category,
    kc.industry,
    1 - (kc.embedding <=> query_embedding) AS similarity,
    kc.document_id,
    kd.title AS document_title,
    kc.section_title,
    kc.page_start,
    kc.page_end
  FROM rrf_scores r
  JOIN knowledge_chunks kc ON kc.id = r.id
  LEFT JOIN knowledge_documents kd ON kc.document_id = kd.id
  ORDER BY r.score DESC
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.hybrid_search_knowledge(vector(1536), text, double precision, integer, text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.hybrid_search_knowledge(vector(1536), text, double precision, integer, text, text, integer) TO service_role;

COMMENT ON FUNCTION public.hybrid_search_knowledge IS 'Hybrid semantic + full-text search with RRF; same return shape as search_knowledge (citation fields).';