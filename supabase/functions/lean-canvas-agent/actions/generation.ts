/**
 * AI Generation Actions
 * Prefill canvas and suggest box content using Gemini
 */

import type { LeanCanvasData, BoxKey } from "../types.ts";
import { EMPTY_CANVAS, CANVAS_BOX_CONFIG } from "../types.ts";
import { callGemini, extractJSON, logAIRun } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

interface PrefillResponse {
  canvas: LeanCanvasData;
  confidence: Record<BoxKey, 'HIGH' | 'MEDIUM' | 'LOW'>;
  summary: string;
}

/**
 * Generate canvas content from profile + gap answers
 */
export async function prefillCanvas(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  gapAnswers?: Record<string, string>
): Promise<PrefillResponse> {
  console.log(`[prefillCanvas] Generating canvas for startup ${startupId}`);

  // Get user's org_id for logging
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id || null;

  // Fetch startup profile
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  // Fetch industry pack if available
  const { data: industryPack } = await supabase
    .from("industry_packs")
    .select("*")
    .eq("industry_key", startup?.industry?.toLowerCase())
    .eq("is_active", true)
    .single();

  const systemPrompt = `You are a Lean Canvas expert helping startup founders create clear, concise business model canvases.
${industryPack ? `\n\nIndustry context (${industryPack.name}):\n- Terminology: ${JSON.stringify(industryPack.terminology)}\n- Benchmarks: ${JSON.stringify(industryPack.benchmarks)}\n- Persona: ${industryPack.advisor_persona}` : ''}

Generate content for ALL 9 Lean Canvas boxes based on the startup profile and any additional answers provided.

CRITICAL RULES:
- Each box should have 2-4 specific, actionable items
- Problem and Solution should be tightly connected
- UVP must be a single compelling sentence
- Unfair Advantage should be genuinely defensible (not just "great team")
- Key Metrics should include measurable KPIs
- Be specific to THIS startup, not generic statements`;

  const profileContext = `
STARTUP PROFILE:
- Name: ${startup?.name || 'Unknown'}
- Industry: ${startup?.industry || 'Unknown'}
- Stage: ${startup?.stage || 'Unknown'}
- Description: ${startup?.description || 'Not provided'}
- Tagline: ${startup?.tagline || 'Not provided'}
- Target Market: ${startup?.target_market || 'Not provided'}
- Business Model: ${JSON.stringify(startup?.business_model || [])}
- Traction: ${JSON.stringify(startup?.traction_data || {})}
- Competitors: ${JSON.stringify(startup?.competitors || [])}`;

  const gapContext = gapAnswers && Object.keys(gapAnswers).length > 0 
    ? `\n\nADDITIONAL ANSWERS FROM FOUNDER:\n${Object.entries(gapAnswers).map(([key, value]) => `- ${key}: ${value}`).join('\n')}`
    : '';

  const userPrompt = `${profileContext}${gapContext}

Generate a complete Lean Canvas. Return JSON in this exact format:
{
  "problem": { "items": ["item1", "item2", "item3"], "confidence": "HIGH" },
  "solution": { "items": ["item1", "item2", "item3"], "confidence": "HIGH" },
  "uniqueValueProp": { "items": ["single compelling sentence"], "confidence": "HIGH" },
  "unfairAdvantage": { "items": ["item1", "item2"], "confidence": "MEDIUM" },
  "customerSegments": { "items": ["segment1", "segment2"], "confidence": "HIGH" },
  "keyMetrics": { "items": ["metric1", "metric2", "metric3"], "confidence": "MEDIUM" },
  "channels": { "items": ["channel1", "channel2"], "confidence": "MEDIUM" },
  "costStructure": { "items": ["cost1", "cost2"], "confidence": "LOW" },
  "revenueStreams": { "items": ["stream1", "stream2"], "confidence": "MEDIUM" }
}

Confidence levels:
- HIGH: Based on explicit profile data or founder answers
- MEDIUM: Inferred from context
- LOW: AI-estimated with minimal data`;

  const response = await callGemini(
    "gemini-3-flash-preview",
    systemPrompt,
    userPrompt,
    { jsonMode: true, maxTokens: 2000 }
  );

  // Log AI run for cost tracking
  await logAIRun(supabase, userId, orgId, startupId, "prefill_canvas", response);

  const parsed = extractJSON<Record<string, { items: string[]; confidence: string }>>(response.text);

  if (parsed) {
    const canvas: LeanCanvasData = { ...EMPTY_CANVAS };
    const confidence: Record<BoxKey, 'HIGH' | 'MEDIUM' | 'LOW'> = {} as Record<BoxKey, 'HIGH' | 'MEDIUM' | 'LOW'>;

    for (const box of CANVAS_BOX_CONFIG) {
      const boxData = parsed[box.key];
      if (boxData && Array.isArray(boxData.items)) {
        canvas[box.key] = {
          items: boxData.items.slice(0, 5),
          source: 'ai',
          confidence: (boxData.confidence as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM',
        };
        confidence[box.key] = (boxData.confidence as 'HIGH' | 'MEDIUM' | 'LOW') || 'MEDIUM';
      } else {
        confidence[box.key] = 'LOW';
      }
    }

    return {
      canvas,
      confidence,
      summary: `Generated 9 boxes from profile${gapAnswers ? ' + founder answers' : ''}`,
    };
  }

  // Fallback
  return {
    canvas: EMPTY_CANVAS,
    confidence: Object.fromEntries(CANVAS_BOX_CONFIG.map(b => [b.key, 'LOW'])) as Record<BoxKey, 'HIGH' | 'MEDIUM' | 'LOW'>,
    summary: 'Could not generate canvas. Please try again.',
  };
}

/**
 * Generate suggestions for a specific box
 */
export async function suggestBox(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  boxKey: string,
  canvasData?: Record<string, unknown>
): Promise<{ suggestions: string[]; reasoning: string }> {
  console.log(`[suggestBox] Generating suggestions for ${boxKey}`);

  // Get user's org_id for logging
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", userId)
    .single();

  const orgId = profile?.org_id || null;

  // Fetch startup profile
  const { data: startup } = await supabase
    .from("startups")
    .select("name, industry, stage, description, tagline, target_market")
    .eq("id", startupId)
    .single();

  // Fetch industry pack
  const { data: industryPack } = await supabase
    .from("industry_packs")
    .select("terminology, benchmarks, advisor_persona")
    .eq("industry_key", startup?.industry?.toLowerCase())
    .eq("is_active", true)
    .single();

  const boxConfig = CANVAS_BOX_CONFIG.find(b => b.key === boxKey);
  const boxTitle = boxConfig?.title || boxKey;

  const systemPrompt = `You are a Lean Canvas expert providing suggestions for the "${boxTitle}" box.
${industryPack?.advisor_persona ? `\nAdvisor persona: ${industryPack.advisor_persona}` : ''}

Generate 3-4 specific, actionable suggestions that fit this startup's context.`;

  const userPrompt = `Startup: ${startup?.name || 'Unknown'}
Industry: ${startup?.industry || 'Unknown'}
Stage: ${startup?.stage || 'Unknown'}
Description: ${startup?.description || 'Not provided'}

Current canvas state:
${JSON.stringify(canvasData || {}, null, 2)}

Suggest 3-4 items for the "${boxTitle}" box. Return JSON:
{
  "suggestions": ["item1", "item2", "item3"],
  "reasoning": "Brief explanation of why these fit"
}`;

  const response = await callGemini(
    "gemini-3-flash-preview",
    systemPrompt,
    userPrompt,
    { jsonMode: true, maxTokens: 1000 }
  );

  // Log AI run for cost tracking
  await logAIRun(supabase, userId, orgId, startupId, "suggest_box", response);

  const parsed = extractJSON<{ suggestions: string[]; reasoning: string }>(response.text);

  if (parsed && Array.isArray(parsed.suggestions)) {
    return {
      suggestions: parsed.suggestions.slice(0, 4),
      reasoning: parsed.reasoning || 'AI-generated suggestions based on your profile',
    };
  }

  return {
    suggestions: [],
    reasoning: 'Could not generate suggestions. Please try again.',
  };
}
