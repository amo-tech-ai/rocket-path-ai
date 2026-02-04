/**
 * Load Knowledge Edge Function
 * Generates OpenAI embeddings for knowledge_chunks table entries
 * 
 * Actions:
 * - generate_embeddings: Generate embeddings for chunks without them
 * - status: Check current embedding status
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};

const OPENAI_EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
const BATCH_SIZE = 20; // Process 20 chunks at a time

interface LoadKnowledgeRequest {
  action: 'generate_embeddings' | 'status' | 'test_search';
  limit?: number;
  query?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body: LoadKnowledgeRequest = await req.json();
    const { action, limit = 50, query } = body;

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

    // Test search
    if (action === 'test_search') {
      if (!query) {
        return new Response(
          JSON.stringify({ error: 'Query is required for test_search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate embedding for query
      const embedding = await generateEmbedding(query, openaiKey);

      // Search using the function - use lower threshold for better recall
      const { data: results, error: searchError } = await supabase.rpc('search_knowledge', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: 5,
        filter_category: null,
        filter_industry: null,
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
      let errors: string[] = [];

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
