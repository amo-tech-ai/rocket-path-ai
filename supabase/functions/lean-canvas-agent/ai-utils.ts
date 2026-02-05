/**
 * AI Utilities for Lean Canvas Agent
 * Uses direct Gemini API via npm:@google/genai
 */

import { GoogleGenAI, Type } from "npm:@google/genai@^0.21.0";

// =============================================================================
// Types
// =============================================================================

export interface AIResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  latencyMs: number;
}

// Model pricing per 1K tokens
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gemini-3-flash-preview': { input: 0.0001, output: 0.0004 },
  'gemini-3-pro-preview': { input: 0.00125, output: 0.005 },
  'default': { input: 0.001, output: 0.002 },
};

// =============================================================================
// Gemini Client
// =============================================================================

/**
 * Call Gemini API directly with structured output support
 */
export async function callGemini(
  model: 'gemini-3-flash-preview' | 'gemini-3-pro-preview',
  systemPrompt: string,
  userPrompt: string,
  options?: {
    jsonMode?: boolean;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<AIResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const startTime = Date.now();

  const ai = new GoogleGenAI({ apiKey });

  const config: Record<string, unknown> = {
    maxOutputTokens: options?.maxTokens || 2048,
    temperature: options?.temperature ?? 1.0, // Gemini 3 requires 1.0
  };

  if (options?.jsonMode) {
    config.responseMimeType = 'application/json';
  }

  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    systemInstruction: systemPrompt,
    config,
  });

  const latencyMs = Date.now() - startTime;

  // Extract usage metadata
  const usage = response.usageMetadata || {};

  return {
    text: response.text || '',
    inputTokens: usage.promptTokenCount || 0,
    outputTokens: usage.candidatesTokenCount || 0,
    model,
    latencyMs,
  };
}

/**
 * Call Gemini with structured JSON schema output
 */
export async function callGeminiStructured<T>(
  model: 'gemini-3-flash-preview' | 'gemini-3-pro-preview',
  systemPrompt: string,
  userPrompt: string,
  schema: Record<string, unknown>
): Promise<{ data: T | null; response: AIResponse }> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const startTime = Date.now();

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    systemInstruction: systemPrompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 1.0,
      maxOutputTokens: 2048,
    },
  });

  const latencyMs = Date.now() - startTime;
  const usage = response.usageMetadata || {};

  const aiResponse: AIResponse = {
    text: response.text || '',
    inputTokens: usage.promptTokenCount || 0,
    outputTokens: usage.candidatesTokenCount || 0,
    model,
    latencyMs,
  };

  // Parse the JSON response
  let data: T | null = null;
  try {
    if (response.text) {
      data = JSON.parse(response.text) as T;
    }
  } catch {
    console.error('[callGeminiStructured] Failed to parse JSON response');
  }

  return { data, response: aiResponse };
}

// =============================================================================
// JSON Extraction (Fallback)
// =============================================================================

/**
 * Extract JSON from AI response text (fallback for non-structured output)
 */
export function extractJSON<T>(text: string | undefined): T | null {
  if (!text) return null;

  try {
    // Try to find JSON in the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonStr.trim());
    }
    return null;
  } catch {
    console.error('[extractJSON] Failed to parse JSON from response');
    return null;
  }
}

// =============================================================================
// Cost Calculation
// =============================================================================

/**
 * Calculate cost for an AI call
 */
export function calculateCost(response: AIResponse): number {
  const rates = MODEL_PRICING[response.model] || MODEL_PRICING['default'];
  const inputCost = (response.inputTokens / 1000) * rates.input;
  const outputCost = (response.outputTokens / 1000) * rates.output;
  return Number((inputCost + outputCost).toFixed(6));
}

// =============================================================================
// AI Run Logging
// =============================================================================

/**
 * Log AI run for cost tracking and analytics
 */
export async function logAIRun(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  orgId: string | null,
  startupId: string | null,
  action: string,
  response: AIResponse
): Promise<void> {
  try {
    await supabase.from('ai_runs').insert({
      user_id: userId,
      org_id: orgId,
      startup_id: startupId,
      agent_name: 'LeanCanvasAgent',
      action,
      model: response.model,
      provider: 'gemini',
      input_tokens: response.inputTokens,
      output_tokens: response.outputTokens,
      cost_usd: calculateCost(response),
      duration_ms: response.latencyMs,
      status: 'completed',
    });
  } catch (e) {
    console.error('[logAIRun] Failed to log AI run:', e);
  }
}

// =============================================================================
// Profile Hash (for sync detection)
// =============================================================================

/**
 * Compute a simple hash for profile comparison
 */
export function computeProfileHash(profile: Record<string, unknown>): string {
  const relevantFields = [
    'description', 'tagline', 'industry', 'target_market',
    'traction_data', 'business_model', 'competitors', 'stage'
  ];

  const values = relevantFields.map(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.join(',');
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return String(value || '');
  });

  // Simple hash using string concatenation
  return btoa(values.join('|')).slice(0, 32);
}
