/**
 * Canvas Coach Edge Function
 * Conversational AI coach for the Lean Canvas sidebar.
 * Takes messages + canvas data + startup context, returns coaching reply
 * with weak sections, suggestions, follow-up chips, and canvas score.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { canvasCoachResponseSchema, type CanvasCoachResponse } from "./schema.ts";

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || 'http://localhost:8080,http://localhost:8081,http://localhost:8082').split(',');

function getCorsHeaders(req?: Request): Record<string, string> {
  const origin = req?.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// ---------------------------------------------------------------------------
// Gemini helper
// ---------------------------------------------------------------------------
async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  responseJsonSchema: Record<string, unknown>,
  timeoutMs = 12_000,
): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const body = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 1.0, // G2: Gemini 3 needs 1.0
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseJsonSchema, // G1: guaranteed structured output
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY, // G4: header, not query param
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(`Gemini API timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
  clearTimeout(timer);

  if (!response.ok) {
    const errText = await response.text();
    console.error('[canvas-coach] Gemini error:', response.status, errText);
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function extractJSON<T>(text: string | undefined): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    try {
      const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenceMatch?.[1]) return JSON.parse(fenceMatch[1].trim()) as T;
    } catch { /* continue */ }
    try {
      const start = text.indexOf('{');
      if (start !== -1) {
        let depth = 0;
        for (let i = start; i < text.length; i++) {
          if (text[i] === '{') depth++;
          else if (text[i] === '}') {
            depth--;
            if (depth === 0) return JSON.parse(text.substring(start, i + 1)) as T;
          }
        }
      }
    } catch { /* continue */ }
    console.error('[extractJSON] All parse strategies failed');
    return null;
  }
}

// ---------------------------------------------------------------------------
// System prompt
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
- reasoning: your internal analysis (not shown to user).`;

// ---------------------------------------------------------------------------
// Input sanitization
// ---------------------------------------------------------------------------
interface InputMessage {
  role: "user" | "assistant";
  content: string;
}

function sanitizeMessages(messages: unknown[]): InputMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-15) // max 15 messages
    .filter((m): m is { role: string; content: string } =>
      typeof m === 'object' && m !== null &&
      typeof (m as any).role === 'string' &&
      typeof (m as any).content === 'string'
    )
    .map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.content.replace(/<[^>]*>/g, '').slice(0, 1500), // strip HTML, limit length
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
// Main handler
// ---------------------------------------------------------------------------
Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    // Auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing env vars');

    const authHeader = req.headers.get('Authorization');
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: authHeader ? { Authorization: authHeader } : {} },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Parse input
    const { messages, canvas_data, startup_context, focused_box } = await req.json();

    if (!canvas_data || typeof canvas_data !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Missing required field: canvas_data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
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

    const userPrompt = `${startupInfo}Current Canvas State:\n${canvasStr}\n${focusNote}\nConversation:\n${conversationText}`;

    console.log(`[canvas-coach] User ${user.id} | ${cleanMessages.length} messages | focused: ${focused_box || 'none'}`);

    // Call Gemini
    const raw = await callGemini(SYSTEM_PROMPT, userPrompt, canvasCoachResponseSchema, 12_000);
    const parsed = extractJSON<CanvasCoachResponse>(raw);

    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Failed to parse coaching response' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        reply: parsed.reply,
        weak_sections: parsed.weak_sections,
        suggestions: parsed.suggestions,
        next_chips: parsed.next_chips,
        canvas_score: parsed.canvas_score,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[canvas-coach] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
