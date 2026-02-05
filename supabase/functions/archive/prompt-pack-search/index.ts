/**
 * @deprecated Use prompt-pack with action "search", "get", or "list" instead.
 * POST /functions/v1/prompt-pack { "action": "search"|"get"|"list", ... }
 *
 * Prompt Pack Search Edge Function
 *
 * Search and retrieve prompt packs by category, industry, stage, and module.
 * Actions: search | get | list
 * @endpoint POST /functions/v1/prompt-pack-search
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders, getCorsHeaders } from '../_shared/cors.ts';

// =============================================================================
// Types
// =============================================================================

interface SearchRequest {
  action: 'search' | 'get' | 'list';
  // For search action
  module?: 'onboarding' | 'canvas' | 'pitch' | 'validation' | 'gtm' | 'pricing' | 'market' | 'ideation';
  industry?: string;
  stage?: string;
  goal?: string;
  startup_id?: string;
  limit?: number;
  // For get action
  pack_id?: string;
  slug?: string;
}

interface PromptPackWithSteps {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  stage_tags: string[];
  industry_tags: string[];
  version: number;
  is_active: boolean;
  source: string;
  metadata: Record<string, unknown>;
  prompt_pack_steps: Array<{
    id: string;
    step_order: number;
    purpose: string;
    prompt_template: string;
    output_schema: Record<string, unknown>;
    model_preference: string;
    max_tokens: number;
    temperature: number;
  }>;
}

// =============================================================================
// Module to Category Mapping
// =============================================================================

const MODULE_CATEGORY_MAP: Record<string, string[]> = {
  onboarding: ['validation', 'ideation', 'market'],
  canvas: ['canvas', 'pricing', 'gtm'],
  pitch: ['pitch'],
  validation: ['validation', 'market'],
  gtm: ['gtm', 'pricing'],
  pricing: ['pricing'],
  market: ['market'],
  ideation: ['ideation'],
};

// =============================================================================
// Handler Functions
// =============================================================================

async function handleSearch(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest
): Promise<Response> {
  const {
    module,
    industry,
    stage,
    startup_id,
    limit = 5,
  } = params;

  // Determine categories to search
  const categories = module ? MODULE_CATEGORY_MAP[module] || [module] : null;

  // Build query
  let query = supabase
    .from('prompt_packs')
    .select(`
      id,
      title,
      slug,
      description,
      category,
      stage_tags,
      industry_tags,
      version,
      is_active,
      source,
      metadata,
      prompt_pack_steps (
        id,
        step_order,
        purpose,
        prompt_template,
        output_schema,
        model_preference,
        max_tokens,
        temperature
      )
    `)
    .eq('is_active', true)
    .order('version', { ascending: false });

  // Apply category filter
  if (categories && categories.length > 0) {
    query = query.in('category', categories);
  }

  // Apply industry filter (contains array check)
  if (industry) {
    query = query.contains('industry_tags', [industry.toLowerCase()]);
  }

  // Apply stage filter (contains array check)
  if (stage) {
    query = query.contains('stage_tags', [stage.toLowerCase()]);
  }

  const { data: packs, error } = await query.limit(limit);

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Sort steps by order within each pack
  const packsWithSortedSteps = (packs as PromptPackWithSteps[] || []).map(pack => ({
    ...pack,
    prompt_pack_steps: (pack.prompt_pack_steps || [])
      .sort((a, b) => a.step_order - b.step_order),
    step_count: pack.prompt_pack_steps?.length || 0,
  }));

  // Get the best matching pack and its first step
  const bestPack = packsWithSortedSteps[0] || null;
  const firstStep = bestPack?.prompt_pack_steps?.[0] || null;

  // If startup_id provided, get context preview
  let startupContext = null;
  if (startup_id && bestPack) {
    const { data: startup } = await supabase
      .from('startups')
      .select('id, company_name, description, industry, stage, one_liner')
      .eq('id', startup_id)
      .single();

    startupContext = startup;
  }

  return new Response(
    JSON.stringify({
      success: true,
      pack: bestPack,
      next_step: firstStep,
      alternatives: packsWithSortedSteps.slice(1),
      context: startupContext,
      meta: {
        searched_categories: categories,
        filters: { module, industry, stage },
        total_found: packsWithSortedSteps.length,
      },
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGet(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest
): Promise<Response> {
  const { pack_id, slug } = params;

  if (!pack_id && !slug) {
    return new Response(
      JSON.stringify({ success: false, error: 'pack_id or slug required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let query = supabase
    .from('prompt_packs')
    .select(`
      id,
      title,
      slug,
      description,
      category,
      stage_tags,
      industry_tags,
      version,
      is_active,
      source,
      metadata,
      created_at,
      updated_at,
      prompt_pack_steps (
        id,
        step_order,
        purpose,
        prompt_template,
        input_schema,
        output_schema,
        model_preference,
        max_tokens,
        temperature
      )
    `);

  if (pack_id) {
    query = query.eq('id', pack_id);
  } else if (slug) {
    query = query.eq('slug', slug);
  }

  const { data: pack, error } = await query.single();

  if (error || !pack) {
    return new Response(
      JSON.stringify({ success: false, error: error?.message || 'Pack not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Sort steps by order
  const packWithSortedSteps = {
    ...pack,
    prompt_pack_steps: ((pack as PromptPackWithSteps).prompt_pack_steps || [])
      .sort((a, b) => a.step_order - b.step_order),
  };

  return new Response(
    JSON.stringify({
      success: true,
      pack: packWithSortedSteps,
      step_count: packWithSortedSteps.prompt_pack_steps.length,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleList(
  supabase: ReturnType<typeof createClient>,
  params: SearchRequest
): Promise<Response> {
  const { limit = 50 } = params;

  const { data: packs, error } = await supabase
    .from('prompt_packs')
    .select(`
      id,
      title,
      slug,
      description,
      category,
      stage_tags,
      industry_tags,
      version,
      is_active,
      source
    `)
    .eq('is_active', true)
    .order('category')
    .order('title')
    .limit(limit);

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Group by category
  const byCategory: Record<string, typeof packs> = {};
  for (const pack of packs || []) {
    if (!byCategory[pack.category]) {
      byCategory[pack.category] = [];
    }
    byCategory[pack.category].push(pack);
  }

  return new Response(
    JSON.stringify({
      success: true,
      packs: packs || [],
      by_category: byCategory,
      total: packs?.length || 0,
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// =============================================================================
// Main Handler
// =============================================================================

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const origin = req.headers.get('origin');
  const responseHeaders = getCorsHeaders(origin);

  try {
    // Parse request body
    const body = await req.json() as SearchRequest;
    const { action = 'search' } = body;

    // Create Supabase client with service role for read operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Route to handler
    switch (action) {
      case 'search':
        return await handleSearch(supabase, body);

      case 'get':
        return await handleGet(supabase, body);

      case 'list':
        return await handleList(supabase, body);

      default:
        return new Response(
          JSON.stringify({ success: false, error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Search error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { ...responseHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
