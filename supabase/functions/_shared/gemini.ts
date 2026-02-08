/**
 * Shared Gemini API Client
 * Single source of truth for all edge functions calling Gemini.
 * F18-F21: Gemini API alignment (G1-G5 from docs comparison)
 * P01: Extended with URL Context + Thinking
 * F1: Safe JSON extraction with multiple fallback strategies.
 */

export interface GeminiCallOptions {
  useSearch?: boolean;
  useUrlContext?: boolean;
  thinkingLevel?: 'none' | 'low' | 'high';
  maxRetries?: number;
  responseJsonSchema?: Record<string, unknown>;
  timeoutMs?: number;
  maxOutputTokens?: number;
}

export interface GeminiCallResult {
  text: string;
  searchGrounding: boolean;
  citations: Array<{ url: string; title: string }>;
  urlContextMetadata?: Array<{ url: string; status: string }>;
}

export async function callGemini(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  options: GeminiCallOptions = {}
): Promise<GeminiCallResult> {
  const { useSearch = false, useUrlContext = false, thinkingLevel, maxRetries = 2, responseJsonSchema, timeoutMs, maxOutputTokens } = options;
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  // G2: Temperature 1.0 — Gemini 3 docs warn against lower values
  const generationConfig: Record<string, unknown> = {
    temperature: 1.0,
    maxOutputTokens: maxOutputTokens || 8192,
    responseMimeType: 'application/json',
  };

  // G1+G3: responseJsonSchema guarantees valid JSON matching the schema
  if (responseJsonSchema) {
    generationConfig.responseJsonSchema = responseJsonSchema;
  }

  // Thinking config — Gemini 3 uses thinkingLevel (string), not legacy thinkingBudget.
  // Thinking mode is incompatible with JSON schema enforcement.
  if (thinkingLevel && thinkingLevel !== 'none') {
    generationConfig.thinkingConfig = { thinkingLevel };
    delete generationConfig.responseJsonSchema;
  }

  // Build tools array dynamically
  const tools: Record<string, unknown>[] = [];
  if (useSearch) tools.push({ googleSearch: {} });
  if (useUrlContext) tools.push({ urlContext: {} });

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig,
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  if (tools.length > 0) {
    body.tools = tools;
  }

  // G4: API key in x-goog-api-key header, NOT query param
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const RETRYABLE_CODES = [429, 500, 502, 503, 504];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delayMs = 1000 * Math.pow(2, attempt - 1);
      console.log(`[callGemini] Retry ${attempt}/${maxRetries} after ${delayMs}ms`);
      await new Promise(r => setTimeout(r, delayMs));
    }

    // AbortSignal.timeout() for fetch-level abort + Promise.race hard timeout
    // as backup. AbortSignal may not abort response.json() body reads on Deno Deploy
    // when Gemini streams the response body over 30-60s.
    const signal = timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined;

    type FetchResult = { ok: true; data: Record<string, unknown> } | { ok: false; status: number; errorText: string };

    const doFetch = async (): Promise<FetchResult> => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify(body),
        signal,
      });
      if (response.ok) {
        const data = await response.json();
        return { ok: true, data };
      }
      const errorText = await response.text();
      return { ok: false, status: response.status, errorText };
    };

    let result: FetchResult;
    try {
      if (timeoutMs) {
        // Promise.race: hard timeout backup — guarantees callGemini returns within timeoutMs
        result = await Promise.race([
          doFetch(),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Gemini API hard timeout after ${timeoutMs}ms`)), timeoutMs)
          ),
        ]);
      } else {
        result = await doFetch();
      }
    } catch (fetchErr) {
      if (fetchErr instanceof Error && fetchErr.message.includes('hard timeout')) {
        throw fetchErr;
      }
      if (fetchErr instanceof DOMException && (fetchErr.name === 'TimeoutError' || fetchErr.name === 'AbortError')) {
        throw new Error(`Gemini API timed out after ${timeoutMs}ms`);
      }
      throw fetchErr;
    }

    if (result.ok) {
      const data = result.data;

      // With thinking mode, parts[0] is the thinking text (thought: true).
      // We need the LAST non-thinking part which contains the actual output.
      // deno-lint-ignore no-explicit-any
      const parts = (data as any).candidates?.[0]?.content?.parts || [];
      // deno-lint-ignore no-explicit-any
      const outputPart = parts.filter((p: any) => !p.thought).pop();
      const text = outputPart?.text || '';
      // Log truncation warning — helps debug maxOutputTokens issues
      // deno-lint-ignore no-explicit-any
      const finishReason = (data as any).candidates?.[0]?.finishReason;
      if (finishReason === 'MAX_TOKENS') {
        console.warn(`[callGemini] Response truncated (MAX_TOKENS). Output length: ${text.length} chars`);
      }
      // deno-lint-ignore no-explicit-any
      const searchGrounding = (data as any).candidates?.[0]?.groundingMetadata?.webSearchQueries?.length > 0;

      // G5: Extract grounding citations from groundingChunks
      // deno-lint-ignore no-explicit-any
      const groundingChunks = (data as any).candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      // deno-lint-ignore no-explicit-any
      const citations = groundingChunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          url: c.web?.uri || '',
          title: c.web?.title || '',
        }));

      // URL Context metadata from candidates[0].url_context_metadata
      // deno-lint-ignore no-explicit-any
      const urlContextMeta = (data as any).candidates?.[0]?.url_context_metadata?.url_metadata || [];
      // deno-lint-ignore no-explicit-any
      const urlContextChunks = urlContextMeta.map((m: any) => ({
        url: m.retrieved_url || '',
        status: m.url_retrieval_status === 'URL_RETRIEVAL_STATUS_SUCCESS' ? 'fetched' : m.url_retrieval_status || 'unknown',
      }));

      return { text, searchGrounding, citations, urlContextMetadata: urlContextChunks.length > 0 ? urlContextChunks : undefined };
    }

    // Error response
    console.error(`[callGemini] Error (attempt ${attempt + 1}):`, result.status, result.errorText);
    lastError = new Error(`Gemini API error: ${result.status}`);

    if (!RETRYABLE_CODES.includes(result.status)) {
      throw lastError;
    }
  }

  throw lastError || new Error('Gemini API failed after retries');
}

// ============================================================================
// Safe JSON Extraction — multiple fallback strategies
// ============================================================================

export function extractJSON<T>(text: string | undefined): T | null {
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    // Strip markdown code fences
    try {
      const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (fenceMatch?.[1]) {
        return JSON.parse(fenceMatch[1].trim()) as T;
      }
    } catch { /* continue */ }

    // Extract balanced JSON object
    try {
      const start = text.indexOf('{');
      if (start !== -1) {
        let depth = 0;
        for (let i = start; i < text.length; i++) {
          if (text[i] === '{') depth++;
          else if (text[i] === '}') {
            depth--;
            if (depth === 0) {
              return JSON.parse(text.substring(start, i + 1)) as T;
            }
          }
        }
      }
    } catch { /* continue */ }

    // Repair truncated JSON — LLM output hit token limit, braces don't balance.
    // Salvage partial content by closing open structures.
    try {
      const jsonStart = text.indexOf('{');
      if (jsonStart !== -1) {
        let json = text.substring(jsonStart);
        // Check if we're inside an unclosed string
        let inStr = false, esc = false;
        for (let i = 0; i < json.length; i++) {
          if (esc) { esc = false; continue; }
          if (json[i] === '\\' && inStr) { esc = true; continue; }
          if (json[i] === '"') inStr = !inStr;
        }
        if (inStr) {
          // Strip unclosed string
          json = json.substring(0, json.lastIndexOf('"'));
        }
        // Strip trailing partial property: , "key": <incomplete>
        json = json.replace(/,\s*"[^"]*"\s*:\s*("[^"]*)?$/s, '');
        json = json.replace(/,\s*$/s, '');
        // Close all open structures in correct nesting order
        const stack: string[] = [];
        inStr = false; esc = false;
        for (let i = 0; i < json.length; i++) {
          if (esc) { esc = false; continue; }
          if (json[i] === '\\' && inStr) { esc = true; continue; }
          if (json[i] === '"') { inStr = !inStr; continue; }
          if (inStr) continue;
          if (json[i] === '{') stack.push('}');
          else if (json[i] === '[') stack.push(']');
          else if ((json[i] === '}' || json[i] === ']') && stack.length > 0) stack.pop();
        }
        if (stack.length > 0) {
          json += stack.reverse().join('');
          console.warn(`[extractJSON] Repaired truncated JSON: closed ${stack.length} open structures`);
          return JSON.parse(json) as T;
        }
      }
    } catch { /* repair failed */ }

    // Extract first JSON array
    try {
      const arrMatch = text.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        return JSON.parse(arrMatch[0]) as T;
      }
    } catch { /* all strategies failed */ }

    console.error('[extractJSON] All parse strategies failed. Raw text length:', text.length);
    return null;
  }
}
