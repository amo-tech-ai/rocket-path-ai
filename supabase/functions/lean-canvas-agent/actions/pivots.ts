/**
 * Pivot Suggestions Actions
 * AI-powered business model pivot recommendations
 */

import type { LeanCanvasData, BoxKey, PivotSuggestion } from "../types.ts";
import { EMPTY_CANVAS } from "../types.ts";
import { callGemini, extractJSON, logAIRun } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface PivotResponse {
  shouldSuggestPivots: boolean;
  reason: string;
  pivots: PivotSuggestion[];
}

/**
 * Suggest pivots when validation scores are low
 */
export async function suggestPivots(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  canvasData: Record<string, unknown>
): Promise<PivotResponse> {
  console.log(`[suggestPivots] Analyzing pivot options for startup ${startupId}`);

  // Get user's org_id for logging
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id || null;

  // Fetch startup for context
  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage, description")
    .eq("id", startupId)
    .single();

  // Fetch industry pack for alternatives
  const { data: industryPack } = await supabase
    .from("industry_packs")
    .select("pivot_patterns, success_stories")
    .eq("industry_key", startup?.industry?.toLowerCase())
    .eq("is_active", true)
    .single();

  const systemPrompt = `You are a startup strategy advisor specializing in business model pivots.
Analyze the current Lean Canvas and suggest 2-3 concrete pivot options.

Each pivot should:
1. Address a specific weakness in the current model
2. Be realistic for the current stage
3. Leverage existing strengths
4. Include a complete modified canvas

${industryPack?.pivot_patterns ? `\nCommon pivot patterns in this industry: ${JSON.stringify(industryPack.pivot_patterns)}` : ''}`;

  const userPrompt = `Startup: ${startup?.name || 'Unknown'}
Industry: ${startup?.industry || 'Unknown'}
Stage: ${startup?.stage || 'Unknown'}
Description: ${startup?.description || 'Not provided'}

CURRENT LEAN CANVAS:
${JSON.stringify(canvasData, null, 2)}

Suggest 2-3 pivots. Return JSON:
{
  "shouldSuggestPivots": true,
  "reason": "Current model has weak customer segments and unproven channels",
  "pivots": [
    {
      "pivot_type": "customer",
      "name": "Enterprise Focus",
      "reasoning": "Your technology is better suited for enterprise buyers who have budget and urgent need.",
      "changed_boxes": {
        "customerSegments": { "from": ["Startups"], "to": ["Mid-market IT directors"] },
        "channels": { "from": ["Content marketing"], "to": ["Direct sales", "Partnerships"] },
        "revenueStreams": { "from": ["$29/mo"], "to": ["$500/mo enterprise plans"] }
      },
      "modified_canvas": {
        "problem": { "items": ["..."], "confidence": "HIGH" },
        // ... all 9 boxes with new values
      },
      "opportunity_score": 7
    }
  ]
}

Pivot types: customer, problem, channel, revenue, technology
Opportunity score: 1-10 based on likelihood of success`;

  const response = await callGemini(
    "gemini-3-pro-preview",
    systemPrompt,
    userPrompt,
    { jsonMode: true, maxTokens: 3000 }
  );

  // Log AI run for cost tracking
  await logAIRun(supabase, userId, orgId, startupId, "suggest_pivots", response);

  const parsed = extractJSON<PivotResponse>(response.text);

  if (parsed) {
    // Ensure each pivot has a complete canvas
    const pivots = (parsed.pivots || []).map(pivot => ({
      ...pivot,
      modified_canvas: ensureCompleteCanvas(pivot.modified_canvas, canvasData as Partial<LeanCanvasData>),
    }));

    return {
      shouldSuggestPivots: parsed.shouldSuggestPivots ?? pivots.length > 0,
      reason: parsed.reason || 'Consider these alternative directions',
      pivots,
    };
  }

  return {
    shouldSuggestPivots: false,
    reason: 'Could not generate pivot suggestions',
    pivots: [],
  };
}

function ensureCompleteCanvas(
  modified: LeanCanvasData | undefined,
  original: Partial<LeanCanvasData>
): LeanCanvasData {
  const canvas = { ...EMPTY_CANVAS };
  
  for (const key of Object.keys(canvas) as BoxKey[]) {
    if (modified?.[key]?.items?.length) {
      canvas[key] = modified[key];
    } else if ((original[key] as { items?: string[] })?.items?.length) {
      canvas[key] = original[key] as LeanCanvasData[BoxKey];
    }
  }
  
  return canvas;
}
