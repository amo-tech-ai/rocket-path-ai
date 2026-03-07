-- K4: Knowledge chunks deduplication + noise cleanup
-- Migration: 20260308130000_k4_knowledge_chunks_dedupe
-- Removes duplicate chunks (same document_id + content) keeping oldest
-- Removes noise chunks (< 20 chars: "---", "Highlight:", headers)
-- Adds unique constraint + CHECK to prevent future duplicates

-- Step 1: Delete duplicate chunks (keep oldest per document_id + content)
delete from knowledge_chunks
where id in (
  select id from (
    select id,
      row_number() over (partition by document_id, content order by created_at asc, id asc) as rn
    from knowledge_chunks
  ) dupes
  where rn > 1
);

-- Step 2: Delete noise chunks (too short to be useful for RAG)
delete from knowledge_chunks
where length(trim(content)) < 20;

-- Step 3: Add unique constraint on (document_id, md5(content)) to prevent future duplicates
create unique index if not exists idx_knowledge_chunks_doc_content_hash
on knowledge_chunks (document_id, md5(content))
where document_id is not null;

-- Step 4: Add CHECK constraint for minimum content length
alter table knowledge_chunks
add constraint chk_knowledge_chunks_min_content
check (length(trim(content)) >= 20);
