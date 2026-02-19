/**
 * Coach Action — Conversational AI coaching for the Lean Canvas sidebar.
 * Merged from canvas-coach edge function into lean-canvas-agent.
 * Uses callGeminiStructured from ai-utils.ts for SDK-based calls + cost tracking.
 */

import { callGeminiStructured, logAIRun } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

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
}

// ---------------------------------------------------------------------------
// Schema (G1: responseJsonSchema for guaranteed structured output)
// ---------------------------------------------------------------------------

const coachResponseSchema = {
  type: "OBJECT",
  required: ["reply", "weak_sections", "suggestions", "next_chips", "canvas_score", "reasoning"],
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
- reasoning: your internal analysis (not shown to user).`;

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

  const userPrompt = `${startupInfo}Current Canvas State:\n${canvasStr}\n${focusNote}\nConversation:\n${conversationText}`;

  console.log(`[coach] User ${userId} | ${cleanMessages.length} messages | focused: ${focused_box || 'none'}`);

  // Call Gemini via shared SDK wrapper with 15s hard timeout
  const COACH_TIMEOUT_MS = 15_000;
  const { data: parsed, response: aiResponse } = await Promise.race([
    callGeminiStructured<CanvasCoachResponse>(
      'gemini-3-flash-preview',
      SYSTEM_PROMPT,
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
  };
}
