/**
 * AI Utilities for Lean Canvas Agent
 * V08: Consolidated to use _shared/gemini.ts (single Gemini client).
 * Removed Google GenAI SDK dependency. Kept logAIRun + computeProfileHash (not Gemini).
 */

import { callGemini as sharedCallGemini, extractJSON as sharedExtractJSON } from "../_shared/gemini.ts";

// Re-export shared functions under same names for backward compatibility
export { sharedExtractJSON as extractJSON };

// =============================================================================
// Types (kept for backward compatibility with action files)
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
  'gemini-3.1-pro-preview': { input: 0.00125, output: 0.005 },
  'default': { input: 0.001, output: 0.002 },
};

// =============================================================================
// callGemini — Wraps _shared/gemini.ts callGemini with AIResponse interface
// =============================================================================

interface CallGeminiOptions {
  responseJsonSchema?: Record<string, unknown>;
  maxOutputTokens?: number;
  timeoutMs?: number;
}

/**
 * Call Gemini via _shared/gemini.ts REST client.
 * Returns AIResponse for backward compatibility with logAIRun.
 */
export async function callGemini(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  options?: CallGeminiOptions,
): Promise<AIResponse> {
  const start = Date.now();

  const result = await sharedCallGemini(model, systemPrompt, userPrompt, {
    responseJsonSchema: options?.responseJsonSchema,
    maxOutputTokens: options?.maxOutputTokens,
    timeoutMs: options?.timeoutMs ?? 30_000,
  });

  return {
    text: result.text,
    inputTokens: result.inputTokens ?? 0,
    outputTokens: result.outputTokens ?? 0,
    model,
    latencyMs: Date.now() - start,
  };
}

// =============================================================================
// callGeminiStructured — Wraps callGemini with schema + typed parse
// =============================================================================

/**
 * Call Gemini with JSON schema enforcement.
 * Returns { data: T | null, response: AIResponse }.
 */
export async function callGeminiStructured<T>(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  // deno-lint-ignore no-explicit-any
  schema: any,
): Promise<{ data: T | null; response: AIResponse }> {
  // Convert SDK-style schema (Type.OBJECT) to REST-style ("object") if needed
  const restSchema = convertSchema(schema);

  const response = await callGemini(model, systemPrompt, userPrompt, {
    responseJsonSchema: restSchema,
    timeoutMs: 30_000,
  });

  let data: T | null = null;
  try {
    if (response.text) {
      data = JSON.parse(response.text) as T;
    }
  } catch {
    // Fallback to extractJSON if direct parse fails
    data = sharedExtractJSON<T>(response.text);
  }

  return { data, response };
}

/**
 * Convert SDK-style schema types to REST-style.
 * SDK uses "OBJECT", "STRING", "ARRAY", "INTEGER", "NUMBER", "BOOLEAN"
 * REST uses "object", "string", "array", "integer", "number", "boolean"
 */
// deno-lint-ignore no-explicit-any
function convertSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;

  const typeMap: Record<string, string> = {
    'OBJECT': 'object', 'STRING': 'string', 'ARRAY': 'array',
    'INTEGER': 'integer', 'NUMBER': 'number', 'BOOLEAN': 'boolean',
  };

  // deno-lint-ignore no-explicit-any
  const converted: any = { ...schema };
  if (converted.type && typeMap[converted.type]) {
    converted.type = typeMap[converted.type];
  }
  if (converted.properties) {
    // deno-lint-ignore no-explicit-any
    const newProps: any = {};
    for (const [key, val] of Object.entries(converted.properties)) {
      newProps[key] = convertSchema(val);
    }
    converted.properties = newProps;
  }
  if (converted.items) {
    converted.items = convertSchema(converted.items);
  }
  return converted;
}

// =============================================================================
// Cost Calculation
// =============================================================================

export function calculateCost(response: AIResponse): number {
  const rates = MODEL_PRICING[response.model] || MODEL_PRICING['default'];
  const inputCost = (response.inputTokens / 1000) * rates.input;
  const outputCost = (response.outputTokens / 1000) * rates.output;
  return Number((inputCost + outputCost).toFixed(6));
}

// =============================================================================
// AI Run Logging
// =============================================================================

export async function logAIRun(
  // deno-lint-ignore no-explicit-any
  supabase: any,
  userId: string,
  orgId: string | null,
  startupId: string | null,
  action: string,
  response: AIResponse,
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

export function computeProfileHash(profile: Record<string, unknown>): string {
  const relevantFields = [
    'description', 'tagline', 'industry', 'target_market',
    'traction_data', 'business_model', 'competitors', 'stage',
  ];
  const values = relevantFields.map(field => {
    const value = profile[field];
    if (Array.isArray(value)) return value.join(',');
    if (typeof value === 'object' && value !== null) return JSON.stringify(value);
    return String(value || '');
  });
  return btoa(values.join('|')).slice(0, 32);
}
