/**
 * Coach Action — Conversational AI coaching for the Lean Canvas sidebar.
 * Merged from canvas-coach edge function into lean-canvas-agent.
 * Uses callGeminiStructured from ai-utils.ts for SDK-based calls + cost tracking.
 */

import { callGeminiStructured, logAIRun } from "../ai-utils.ts";
import { generateEmbedding } from "../../_shared/openai-embeddings.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

// ---------------------------------------------------------------------------
// RAG: Knowledge search for coaching context
// ---------------------------------------------------------------------------

interface KnowledgeChunk {
  content: string;
  source: string;
  source_type: string;
  category: string;
  industry: string | null;
  similarity: number;
  document_title: string | null;
}

/**
 * Search knowledge base for relevant industry data to enrich coaching.
 * Returns formatted citation string for injection into system prompt.
 * Graceful degradation: returns empty string on any failure.
 */
async function searchCoachingContext(
  supabase: SupabaseClient,
  query: string,
  industry?: string,
): Promise<{ context: string; sources: string[] }> {
  try {
    const { embedding } = await generateEmbedding(query);

    const { data: chunks, error } = await supabase.rpc('hybrid_search_knowledge', {
      query_embedding: `[${embedding.join(',')}]`,
      query_text: query,
      match_threshold: 0.5,
      match_count: 5,
      filter_category: null,
      filter_industry: industry?.toLowerCase() || null,
      rrf_k: 50,
    });

    if (error || !chunks?.length) {
      return { context: '', sources: [] };
    }

    const validChunks = (chunks as KnowledgeChunk[]).filter(c => c.similarity >= 0.6);
    if (validChunks.length === 0) return { context: '', sources: [] };

    // Format as numbered citations for the prompt
    const lines = validChunks.map((c, i) =>
      `[${i + 1}] ${c.content.slice(0, 400)}${c.content.length > 400 ? '...' : ''}\n    — ${c.source}${c.document_title ? ` (${c.document_title})` : ''} | ${c.category} | Relevance: ${(c.similarity * 100).toFixed(0)}%`
    );

    const sources = validChunks.map(c =>
      c.document_title || c.source
    );

    return {
      context: `\n\n## Relevant Industry Data\nUse these data points to back up your coaching advice. Reference them by number [1], [2], etc. when relevant — but only cite data that directly supports your point. Do not force-fit citations.\n\n${lines.join('\n\n')}`,
      sources: [...new Set(sources)],
    };
  } catch (e) {
    // Graceful degradation — coaching works without RAG
    console.warn('[coach] RAG search failed (continuing without):', e instanceof Error ? e.message : e);
    return { context: '', sources: [] };
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InputMessage {
  role: "user" | "assistant";
  content: string;
}

interface CoachSuggestion {
  box_key: string;
  item: string;
  reasoning: string;
}

interface CanvasCoachResponse {
  reply: string;
  weak_sections: string[];
  suggestions: CoachSuggestion[];
  next_chips: string[];
  canvas_score: number;
  reasoning: string;
  citations: string[];
  specificity_scores: Record<string, 'vague' | 'specific' | 'quantified'>;
  evidence_gaps: Record<string, string[]>;
}

// ---------------------------------------------------------------------------
// Schema (G1: responseJsonSchema for guaranteed structured output)
// ---------------------------------------------------------------------------

const coachResponseSchema = {
  type: "OBJECT",
  required: ["reply", "weak_sections", "suggestions", "next_chips", "canvas_score", "reasoning", "citations", "specificity_scores", "evidence_gaps"],
  properties: {
    reply: {
      type: "STRING",
      description: "Markdown coaching message to show the user. Warm, direct, one focus area.",
    },
    weak_sections: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Canvas box keys ordered by weakness (e.g. 'problem', 'uniqueValueProp').",
    },
    suggestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["box_key", "item", "reasoning"],
        properties: {
          box_key: {
            type: "STRING",
            description: "Canvas box key to add the item to (e.g. 'problem', 'solution').",
          },
          item: {
            type: "STRING",
            description: "Concrete item text the user can add to the canvas box.",
          },
          reasoning: {
            type: "STRING",
            description: "Brief explanation of why this item strengthens the canvas.",
          },
        },
      },
      description: "1-3 actionable suggestions with reasoning. Each can be added to a canvas box.",
    },
    next_chips: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "2-3 context-aware follow-up prompt chips for the user to click.",
    },
    canvas_score: {
      type: "INTEGER",
      description: "Overall canvas quality score from 0 to 100.",
    },
    reasoning: {
      type: "STRING",
      description: "Internal analysis of canvas state (not shown to user).",
    },
    citations: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "Source references cited in reply, e.g. 'Deloitte State of AI 2026'. Empty array if no data was referenced.",
    },
    specificity_scores: {
      type: "OBJECT",
      description: "REQUIRED. Per-box specificity rating. Key = box key (problem, solution, etc). Value = 'vague' (no numbers, generic), 'specific' (named segments, tools), or 'quantified' (dollar amounts, percentages, timeframes). Include all boxes that have content. Empty object if canvas is empty.",
    },
    evidence_gaps: {
      type: "OBJECT",
      description: "REQUIRED. Per-box evidence gaps. Key = box key. Value = array of 1-3 specific things missing (e.g. 'No quantified impact', 'No target segment defined'). Include all boxes with gaps. Empty object if no gaps.",
    },
  },
};

// ---------------------------------------------------------------------------
// System Prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a Lean Canvas coaching expert embedded in a startup planning tool. Your job is to help founders build a strong, coherent business model canvas.

## Canvas Boxes
The 9 boxes are: problem, solution, uniqueValueProp, unfairAdvantage, customerSegments, keyMetrics, channels, costStructure, revenueStreams.

## Analysis Rules
For each box, evaluate:
- **problem**: Are pains measurable and specific? Not vague complaints.
- **solution**: Does it directly address stated problems? Is it a feature list or a real solution?
- **uniqueValueProp**: Pass the "taxi test" — can you explain it in one sentence to a stranger?
- **unfairAdvantage**: Is it truly defensible (network effects, data, expertise, patents)? "Hard work" is not an advantage.
- **customerSegments**: Specific personas, not "everyone" or broad demographics.
- **keyMetrics**: Actionable metrics, not vanity metrics (followers, page views). Think activation, retention, revenue.
- **channels**: Realistic paths to reach customers, not wishful thinking.
- **costStructure**: Major cost categories with rough estimates or relative sizing.
- **revenueStreams**: Pricing model + willingness-to-pay evidence.

## Coaching Style
- Warm but direct — like a helpful mentor, not a critic.
- Focus on ONE area per response (the weakest or the one the user asked about).
- Reference actual items from their canvas. Quote them.
- Suggest 1-3 concrete improvements they can add.
- Ask clarifying questions to help them think deeper.
- Keep replies concise (2-4 short paragraphs max).
- Use markdown formatting sparingly (bold for emphasis, bullet lists for suggestions).

## Response Rules
- weak_sections: order box keys by weakness, most weak first. Empty boxes always rank highest.
- suggestions: 1-3 items with box_key matching a canvas box key exactly. Items should be specific and actionable.
- next_chips: 2-3 short follow-up prompts relevant to the conversation (max 6 words each).
- canvas_score: 0-100 based on completeness (40%), specificity (30%), coherence (30%).
- reasoning: your internal analysis (not shown to user).
- specificity_scores: For each box with content, rate as 'vague' (generic terms like "businesses", "users", no numbers), 'specific' (named segments, specific tools, concrete descriptions), or 'quantified' (dollar amounts, percentages, timeframes, measurable metrics). Empty boxes are excluded.
- evidence_gaps: For each box with gaps, list 1-3 specific things missing. Examples: "No quantified impact", "No named competitors", "No pricing data". Boxes with no gaps are excluded.`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeMessages(messages: unknown[]): InputMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-15)
    .filter((m): m is { role: string; content: string } =>
      typeof m === 'object' && m !== null &&
      typeof (m as Record<string, unknown>).role === 'string' &&
      typeof (m as Record<string, unknown>).content === 'string'
    )
    .map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content.replace(/<[^>]*>/g, '').slice(0, 1500),
    }));
}

function serializeCanvas(canvas: Record<string, { items?: string[] }>): string {
  const lines: string[] = [];
  for (const [key, box] of Object.entries(canvas)) {
    const items = box?.items || [];
    if (items.length > 0) {
      lines.push(`${key}: ${items.join('; ')}`);
    } else {
      lines.push(`${key}: (empty)`);
    }
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Coach Action Handler
// ---------------------------------------------------------------------------

interface CoachInput {
  messages?: unknown[];
  canvas_data: Record<string, { items?: string[] }>;
  startup_context?: {
    name?: string;
    industry?: string;
    stage?: string;
    description?: string;
  };
  focused_box?: string;
}

export async function coach(
  supabase: SupabaseClient,
  userId: string,
  input: CoachInput,
): Promise<{
  success: boolean;
  reply: string;
  weak_sections: string[];
  suggestions: CoachSuggestion[];
  next_chips: string[];
  canvas_score: number;
  citations: string[];
}> {
  const { messages, canvas_data, startup_context, focused_box } = input;

  if (!canvas_data || typeof canvas_data !== 'object') {
    throw new Error('Missing required field: canvas_data');
  }

  const cleanMessages = sanitizeMessages(messages || []);
  const canvasStr = serializeCanvas(canvas_data);

  // Build user prompt
  const startupInfo = startup_context
    ? `Startup: ${startup_context.name || 'Unknown'} | Industry: ${startup_context.industry || 'Unknown'} | Stage: ${startup_context.stage || 'Unknown'}\nDescription: ${startup_context.description || 'No description'}\n\n`
    : '';

  const focusNote = focused_box
    ? `\nThe user is currently focused on the "${focused_box}" box.\n`
    : '';

  const conversationText = cleanMessages.length > 0
    ? cleanMessages.map(m => `${m.role === 'user' ? 'Founder' : 'Coach'}: ${m.content}`).join('\n')
    : 'Founder: Hi, I need help with my canvas.';

  // K3: RAG — search knowledge base for relevant industry data
  // Build search query from latest user message + canvas context
  const latestUserMsg = cleanMessages.filter(m => m.role === 'user').pop()?.content || '';
  const ragQuery = [
    latestUserMsg,
    focused_box ? `lean canvas ${focused_box}` : '',
    startup_context?.industry || '',
    startup_context?.description?.slice(0, 100) || '',
  ].filter(Boolean).join(' ').slice(0, 500);

  // Service role client for vector search (bypasses RLS on knowledge_chunks)
  const serviceUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  let ragContext = '';
  let ragSources: string[] = [];

  if (serviceUrl && serviceKey && ragQuery.trim()) {
    const { createClient } = await import("npm:@supabase/supabase-js@2");
    const adminClient = createClient(serviceUrl, serviceKey);
    const ragResult = await searchCoachingContext(adminClient, ragQuery, startup_context?.industry);
    ragContext = ragResult.context;
    ragSources = ragResult.sources;
  }

  // V07: Load industry playbook for benchmark-calibrated coaching
  let playbookBlock = '';
  if (serviceUrl && serviceKey && startup_context?.industry) {
    try {
      const { createClient } = await import("npm:@supabase/supabase-js@2");
      const pbClient = createClient(serviceUrl, serviceKey);
      const { data: playbook } = await pbClient
        .from('industry_playbooks')
        .select('benchmarks, warning_signs, gtm_patterns, stage_checklists')
        .eq('industry_id', startup_context.industry.trim().toLowerCase())
        .eq('is_active', true)
        .maybeSingle();
      if (playbook?.benchmarks) {
        playbookBlock = `\n\n## INDUSTRY BENCHMARKS for ${startup_context.industry} [INDUSTRY BENCHMARK]\n${JSON.stringify(playbook.benchmarks, null, 2)}`;
        if (playbook.warning_signs) {
          playbookBlock += `\n\nWARNING SIGNS:\n${JSON.stringify(playbook.warning_signs)}`;
        }
        console.log(`[coach] Playbook loaded for ${startup_context.industry}`);
      }
    } catch (e) {
      console.warn('[coach] Playbook load failed (continuing):', e instanceof Error ? e.message : e);
    }
  }

  const systemPromptWithRAG = SYSTEM_PROMPT + ragContext + playbookBlock;

  const userPrompt = `${startupInfo}Current Canvas State:\n${canvasStr}\n${focusNote}\nConversation:\n${conversationText}`;

  console.log(`[coach] User ${userId} | ${cleanMessages.length} messages | focused: ${focused_box || 'none'} | RAG: ${ragSources.length} sources`);

  // Call Gemini via shared SDK wrapper with 20s hard timeout (added 5s for RAG embedding)
  const COACH_TIMEOUT_MS = 20_000;
  const { data: parsed, response: aiResponse } = await Promise.race([
    callGeminiStructured<CanvasCoachResponse>(
      'gemini-3-flash-preview',
      systemPromptWithRAG,
      userPrompt,
      coachResponseSchema,
    ),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Coach timed out after ${COACH_TIMEOUT_MS}ms`)), COACH_TIMEOUT_MS)
    ),
  ]);

  if (!parsed) {
    throw new Error('Failed to parse coaching response');
  }

  // Log AI run for cost tracking (after successful parse)
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  await logAIRun(supabase, userId, profile?.org_id || null, null, 'coach', aiResponse);

  return {
    success: true,
    reply: parsed.reply,
    weak_sections: parsed.weak_sections || [],
    suggestions: parsed.suggestions || [],
    next_chips: parsed.next_chips || [],
    canvas_score: parsed.canvas_score ?? 0,
    citations: parsed.citations?.length ? parsed.citations : ragSources,
  };
}
