/**
 * Load Knowledge Edge Function
 * Generates OpenAI embeddings for knowledge_chunks table entries
 *
 * Actions:
 * - generate_embeddings: Generate embeddings for chunks without them
 * - status: Check current embedding status
 * - test_search: Run a test query against search_knowledge
 * - ingest_from_llamacloud: Fetch parsed doc from LlamaCloud, chunk, embed, insert
 * - ingest_from_markdown: Chunk, embed, insert from raw markdown (no LlamaCloud)
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
const LLAMACLOUD_MARKDOWN_URL = "https://api.cloud.llamaindex.ai/api/v1/parsing/job";
const BATCH_SIZE = 20; // Process 20 chunks at a time
const CHUNK_MAX_CHARS = 600;
const CHUNK_OVERLAP_CHARS = 80;

interface LoadKnowledgeRequest {
  action: 'generate_embeddings' | 'status' | 'test_search' | 'ingest_from_llamacloud' | 'ingest_from_markdown';
  limit?: number;
  query?: string;
  filter_category?: string | null;
  filter_industry?: string | null;
  // ingest_from_llamacloud
  llama_parse_id?: string;
  // ingest_from_markdown (and optional overrides for ingest_from_llamacloud)
  markdown?: string;
  title?: string;
  source?: string;
  source_type?: string;
  year?: number;
  confidence?: string;
  category?: string;
  document_id?: string;
  industry?: string;
  sample_size?: number;
  source_url?: string;
  tags?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    // For ingest_from_llamacloud: fetch parsed docs from LlamaCloud API
    const llamaCloudKey = Deno.env.get('LLAMACLOUD_API_KEY');

    // Auth: verify JWT — only authenticated users can manage knowledge
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const authClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log(`[Load Knowledge] Authenticated user: ${user.id}`);

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role for admin operations (embeddings, inserts)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body: LoadKnowledgeRequest = await req.json();
    const { action, limit = 50, query, llama_parse_id, markdown, title, source, source_type, year, confidence, category, document_id, industry, sample_size, source_url, tags } = body;

    console.log(`[Load Knowledge] Action: ${action}`);

    // Status check
    if (action === 'status') {
      const { data: stats, error } = await supabase
        .from('knowledge_chunks')
        .select('id, embedding')
        .limit(1000);

      if (error) throw error;

      const total = stats?.length || 0;
      const withEmbeddings = stats?.filter(s => s.embedding !== null).length || 0;
      const pending = total - withEmbeddings;

      return new Response(
        JSON.stringify({
          total,
          withEmbeddings,
          pending,
          percentComplete: total > 0 ? Math.round((withEmbeddings / total) * 100) : 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Test search (also used by validator and other callers for RAG retrieval)
    if (action === 'test_search') {
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query is required for test_search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Optional filters from body (e.g. validator passes filter_industry from profile)
      const filter_category = body.filter_category?.trim() || null;
      const filter_industry = body.filter_industry?.trim() || null;

      // Generate embedding for query
      const embedding = await generateEmbedding(query, openaiKey);

      // Search using the function - use lower threshold for better recall
      const { data: results, error: searchError } = await supabase.rpc('search_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 10,
        filter_category,
        filter_industry,
      });

      if (searchError) throw searchError;

      return new Response(
        JSON.stringify({
          query,
          results: results || [],
          count: results?.length || 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ingest from LlamaCloud: fetch parsed markdown, chunk, embed, insert
    if (action === 'ingest_from_llamacloud') {
      if (!llama_parse_id?.trim()) {
        return new Response(
          JSON.stringify({ error: 'llama_parse_id is required for ingest_from_llamacloud' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (!llamaCloudKey) {
        return new Response(
          JSON.stringify({ error: 'LLAMACLOUD_API_KEY is not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const docTitle = (title?.trim() || 'Untitled').slice(0, 500);
      const docSourceType = source_type?.trim() || 'other';
      const docYear = year ?? new Date().getFullYear();
      const docConfidence = (confidence === 'high' || confidence === 'medium' || confidence === 'low') ? confidence : 'medium';
      const docCategory = category?.trim() || 'research';

      let markdown: string;
      try {
        const url = `${LLAMACLOUD_MARKDOWN_URL}/${encodeURIComponent(llama_parse_id.trim())}/result/markdown`;
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${llamaCloudKey}`,
          },
        });
        if (!res.ok) {
          const errText = await res.text();
          console.error('[Load Knowledge] LlamaCloud API error:', res.status, errText);
          return new Response(
            JSON.stringify({ error: `LlamaCloud API error: ${res.status}`, details: errText.slice(0, 200) }),
            { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const data = await res.json();
        markdown = typeof data.markdown === 'string' ? data.markdown : '';
      } catch (e) {
        console.error('[Load Knowledge] LlamaCloud fetch error:', e);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch from LlamaCloud', details: e instanceof Error ? e.message : 'Unknown' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!markdown?.trim()) {
        return new Response(
          JSON.stringify({ error: 'LlamaCloud returned empty markdown' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const chunks = chunkMarkdownByHeading(markdown);
      if (chunks.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No chunks produced from markdown' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let docId = document_id?.trim() || null;
      if (!docId) {
        const { data: inserted, error: insertDocError } = await supabase
          .from('knowledge_documents')
          .insert({
            title: docTitle,
            source_type: docSourceType,
            year: docYear,
            llama_parse_id: llama_parse_id.trim(),
          })
          .select('id')
          .single();
        if (insertDocError) {
          console.error('[Load Knowledge] knowledge_documents insert error:', insertDocError);
          return new Response(
            JSON.stringify({ error: 'Failed to create knowledge_document', details: insertDocError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        docId = inserted?.id ?? null;
      }

      let processed = 0;
      const errors: string[] = [];

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        try {
          const embeddings = await generateBatchEmbeddings(batch.map(c => c.content), openaiKey);
          for (let j = 0; j < batch.length; j++) {
            const chunk = batch[j];
            const embedding = embeddings[j];
            if (!embedding) continue;
            const { error: insertError } = await supabase.from('knowledge_chunks').insert({
              content: chunk.content,
              embedding: formatEmbeddingForStorage(embedding),
              source: docTitle,
              source_type: docSourceType,
              year: docYear,
              confidence: docConfidence,
              category: docCategory,
              document_id: docId,
              section_title: chunk.section_title || null,
              page_start: chunk.page_start ?? null,
              page_end: chunk.page_end ?? null,
            });
            if (insertError) {
              errors.push(`Chunk ${i + j}: ${insertError.message}`);
            } else {
              processed++;
            }
          }
        } catch (batchErr) {
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchErr instanceof Error ? batchErr.message : 'Unknown'}`);
        }
        if (i + BATCH_SIZE < chunks.length) {
          await new Promise(r => setTimeout(r, 500));
        }
      }

      return new Response(
        JSON.stringify({
          message: `Ingested ${processed} chunks from LlamaCloud`,
          document_id: docId,
          chunks_created: processed,
          chunks_total: chunks.length,
          errors: errors.length > 0 ? errors : undefined,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ingest from markdown (no LlamaCloud): chunk, embed, insert
    if (action === 'ingest_from_markdown') {
      const docTitle = (title?.trim() || 'Untitled').slice(0, 500);
      const docSource = (source?.trim() || docTitle).slice(0, 500);
      const rawMarkdown = typeof markdown === 'string' ? markdown : '';
      if (!rawMarkdown.trim()) {
        return new Response(
          JSON.stringify({ error: 'markdown is required for ingest_from_markdown' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const docSourceType = source_type?.trim() || 'research';
      const docYear = year ?? new Date().getFullYear();
      const docConfidence = (confidence === 'high' || confidence === 'medium' || confidence === 'low') ? confidence : 'medium';
      const docCategory = category?.trim() || 'research';
      const docIndustry = industry?.trim() || null;
      const docSampleSize = typeof sample_size === 'number' && sample_size >= 0 ? sample_size : null;
      const docSourceUrl = source_url?.trim() || null;
      const docTags = Array.isArray(tags) ? tags.filter((t): t is string => typeof t === 'string') : null;

      const chunks = chunkMarkdownByHeading(rawMarkdown);
      if (chunks.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No chunks produced from markdown' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      let docId = document_id?.trim() || null;
      if (!docId) {
        const { data: inserted, error: insertDocError } = await supabase
          .from('knowledge_documents')
          .insert({
            title: docTitle,
            source_type: docSourceType,
            year: docYear,
            llama_parse_id: null,
          })
          .select('id')
          .single();
        if (insertDocError) {
          console.error('[Load Knowledge] knowledge_documents insert error:', insertDocError);
          return new Response(
            JSON.stringify({ error: 'Failed to create knowledge_document', details: insertDocError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        docId = inserted?.id ?? null;
      }

      let processed = 0;
      const errors: string[] = [];

      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        try {
          const embeddings = await generateBatchEmbeddings(batch.map(c => c.content), openaiKey);
          for (let j = 0; j < batch.length; j++) {
            const chunk = batch[j];
            const embedding = embeddings[j];
            if (!embedding) continue;
            const { error: insertError } = await supabase.from('knowledge_chunks').insert({
              content: chunk.content,
              embedding: formatEmbeddingForStorage(embedding),
              source: docSource,
              source_type: docSourceType,
              year: docYear,
              confidence: docConfidence,
              category: docCategory,
              document_id: docId,
              section_title: chunk.section_title || null,
              page_start: chunk.page_start ?? null,
              page_end: chunk.page_end ?? null,
              ...(docIndustry && { industry: docIndustry }),
              ...(docSampleSize != null && { sample_size: docSampleSize }),
              ...(docSourceUrl && { source_url: docSourceUrl }),
              ...(docTags && docTags.length > 0 && { tags: docTags }),
            });
            if (insertError) {
              errors.push(`Chunk ${i + j}: ${insertError.message}`);
            } else {
              processed++;
            }
          }
        } catch (batchErr) {
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batchErr instanceof Error ? batchErr.message : 'Unknown'}`);
        }
        if (i + BATCH_SIZE < chunks.length) {
          await new Promise(r => setTimeout(r, 500));
        }
      }

      return new Response(
        JSON.stringify({
          message: `Ingested ${processed} chunks from markdown`,
          document_id: docId,
          chunks_created: processed,
          chunks_total: chunks.length,
          errors: errors.length > 0 ? errors : undefined,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate embeddings
    if (action === 'generate_embeddings') {
      // Get chunks without embeddings
      const { data: chunks, error: fetchError } = await supabase
        .from('knowledge_chunks')
        .select('id, content')
        .is('embedding', null)
        .limit(limit);

      if (fetchError) throw fetchError;

      if (!chunks || chunks.length === 0) {
        return new Response(
          JSON.stringify({ 
            message: 'No chunks pending embeddings',
            processed: 0,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`[Load Knowledge] Processing ${chunks.length} chunks`);

      let processed = 0;
      const errors: string[] = [];

      // Process in batches
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        console.log(`[Load Knowledge] Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`);

        try {
          // Generate embeddings for batch
          const embeddings = await generateBatchEmbeddings(
            batch.map(c => c.content),
            openaiKey
          );

          // Update each chunk with its embedding
          for (let j = 0; j < batch.length; j++) {
            const chunk = batch[j];
            const embedding = embeddings[j];

            if (embedding) {
              const { error: updateError } = await supabase
                .from('knowledge_chunks')
                .update({ 
                  embedding: formatEmbeddingForStorage(embedding),
                })
                .eq('id', chunk.id);

              if (updateError) {
                console.error(`[Load Knowledge] Update error for ${chunk.id}:`, updateError);
                errors.push(`${chunk.id}: ${updateError.message}`);
              } else {
                processed++;
              }
            }
          }
        } catch (batchError) {
          console.error(`[Load Knowledge] Batch error:`, batchError);
          errors.push(`Batch ${i / BATCH_SIZE + 1}: ${batchError instanceof Error ? batchError.message : 'Unknown error'}`);
        }

        // Rate limit protection - wait between batches
        if (i + BATCH_SIZE < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Get updated status
      const { data: statusData } = await supabase
        .from('knowledge_chunks')
        .select('id, embedding')
        .limit(1000);

      const total = statusData?.length || 0;
      const withEmbeddings = statusData?.filter(s => s.embedding !== null).length || 0;

      return new Response(
        JSON.stringify({
          message: `Processed ${processed} chunks`,
          processed,
          errors: errors.length > 0 ? errors : undefined,
          status: {
            total,
            withEmbeddings,
            pending: total - withEmbeddings,
            percentComplete: total > 0 ? Math.round((withEmbeddings / total) * 100) : 0,
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Load Knowledge] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * Generate embedding for single text
 */
async function generateEmbedding(text: string, apiKey: string): Promise<number[]> {
  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.replace(/\n/g, ' ').trim(),
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenAI] API error ${response.status}:`, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate embeddings for batch of texts
 */
async function generateBatchEmbeddings(texts: string[], apiKey: string): Promise<number[][]> {
  const cleanedTexts = texts.map(t => t.replace(/\n/g, ' ').trim());

  const response = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: cleanedTexts,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[OpenAI] Batch API error ${response.status}:`, errorText);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Sort by index to ensure correct order
  const sorted = data.data.sort((a: { index: number }, b: { index: number }) => a.index - b.index);
  return sorted.map((item: { embedding: number[] }) => item.embedding);
}

/**
 * Format embedding for pgvector storage
 */
function formatEmbeddingForStorage(embedding: number[]): string {
  return `[${embedding.join(',')}]`;
}

/** Chunk markdown by headings (## / ###), then by length with overlap. */
function chunkMarkdownByHeading(markdown: string): { content: string; section_title?: string; page_start?: number; page_end?: number }[] {
  const sections: { title: string; text: string }[] = [];
  const parts = markdown.split(/\n(#{2,3}\s)/).filter(Boolean);
  let currentTitle = 'Document';
  let currentText = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (/^#{2,3}\s/.test(part)) {
      if (currentText.trim()) {
        sections.push({ title: currentTitle, text: currentText.trim() });
      }
      currentTitle = part.replace(/^#{2,3}\s*/, '').trim() || currentTitle;
      currentText = '';
    } else {
      currentText += (currentText ? '\n' : '') + part;
    }
  }
  if (currentText.trim()) {
    sections.push({ title: currentTitle, text: currentText.trim() });
  }

  const chunks: { content: string; section_title?: string; page_start?: number; page_end?: number }[] = [];
  for (const { title, text } of sections) {
    if (text.length <= CHUNK_MAX_CHARS) {
      chunks.push({ content: text, section_title: title });
      continue;
    }
    let start = 0;
    while (start < text.length) {
      let end = Math.min(start + CHUNK_MAX_CHARS, text.length);
      if (end < text.length) {
        const lastSpace = text.lastIndexOf(' ', end);
        if (lastSpace > start) end = lastSpace;
      }
      const slice = text.slice(start, end).trim();
      if (slice) chunks.push({ content: slice, section_title: title });
      start = end - (end < text.length ? CHUNK_OVERLAP_CHARS : 0);
      if (start >= text.length) break;
    }
  }
  return chunks;
}
