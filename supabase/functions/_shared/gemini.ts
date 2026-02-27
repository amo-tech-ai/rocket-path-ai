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
  thinkingLevel?: 'none' | 'minimal' | 'low' | 'medium' | 'high';
  maxRetries?: number;
  responseJsonSchema?: Record<string, unknown>;
  timeoutMs?: number;
  maxOutputTokens?: number;
  /** Keep responseJsonSchema even when thinking is active.
   *  Default: false (schema is deleted to avoid conflicts with thinking mode).
   *  Set to true when structured output is critical and you accept the risk
   *  of thinking mode reducing schema adherence. */
  keepSchemaWithThinking?: boolean;
}

export interface GeminiCallResult {
  text: string;
  searchGrounding: boolean;
  citations: Array<{ url: string; title: string }>;
  urlContextMetadata?: Array<{ url: string; status: string }>;
  /** D-02: True when Gemini hit maxOutputTokens and output was truncated */
  truncated: boolean;
}

export async function callGemini(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  options: GeminiCallOptions = {}
): Promise<GeminiCallResult> {
  const { useSearch = false, useUrlContext = false, thinkingLevel, maxRetries = 2, responseJsonSchema, timeoutMs, maxOutputTokens, keepSchemaWithThinking = false } = options;
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
  // R-01 fix: Only delete schema when keepSchemaWithThinking is false (default).
  // Scoring agent sets keepSchemaWithThinking=true because its output structure is critical.
  if (thinkingLevel && thinkingLevel !== 'none') {
    generationConfig.thinkingConfig = { thinkingLevel };
    if (!keepSchemaWithThinking) {
      delete generationConfig.responseJsonSchema;
    }
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
      // P07: Timeouts are now retryable — Gemini cold starts and body streaming delays
      // are transient. Allow the retry loop to handle them instead of throwing immediately.
      const isTimeout = (fetchErr instanceof Error && fetchErr.message.includes('hard timeout'))
        || (fetchErr instanceof DOMException && (fetchErr.name === 'TimeoutError' || fetchErr.name === 'AbortError'));
      if (isTimeout) {
        console.warn(`[callGemini] Timeout on attempt ${attempt + 1}/${maxRetries + 1}: ${fetchErr instanceof Error ? fetchErr.message : 'AbortError'}`);
        lastError = new Error(`Gemini API hard timeout after ${timeoutMs}ms`);
        if (attempt < maxRetries) {
          continue; // Let the retry loop handle it
        }
        throw lastError;
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
      // D-02: Detect truncation — exposed to callers via result.truncated
      // deno-lint-ignore no-explicit-any
      const finishReason = (data as any).candidates?.[0]?.finishReason;
      const truncated = finishReason === 'MAX_TOKENS';
      if (truncated) {
        console.warn(`[callGemini] Response truncated (MAX_TOKENS). Output length: ${text.length} chars, maxOutputTokens: ${generationConfig.maxOutputTokens}`);
        // D-02: Retry once with 1.5x maxOutputTokens if within retry budget
        const currentMax = (generationConfig.maxOutputTokens as number) || 8192;
        const MAX_CEILING = 16384; // Gemini hard limit
        if (attempt < maxRetries && currentMax < MAX_CEILING) {
          const newMax = Math.min(Math.round(currentMax * 1.5), MAX_CEILING);
          console.warn(`[callGemini] Retrying with increased maxOutputTokens: ${currentMax} → ${newMax}`);
          generationConfig.maxOutputTokens = newMax;
          lastError = new Error(`MAX_TOKENS truncation at ${currentMax} tokens`);
          continue; // Let the retry loop handle it
        }
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

      return { text, searchGrounding, citations, urlContextMetadata: urlContextChunks.length > 0 ? urlContextChunks : undefined, truncated };
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
// Multi-turn Chat — for ai-chat and other conversational edge functions
// ============================================================================

export interface GeminiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiChatResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * Call Gemini with multi-turn chat history.
 * Unlike callGemini (JSON mode), this returns plain text for conversational use.
 */
export async function callGeminiChat(
  model: string,
  systemPrompt: string,
  messages: GeminiChatMessage[],
  options: Pick<GeminiCallOptions, 'timeoutMs' | 'maxOutputTokens' | 'maxRetries'> = {}
): Promise<GeminiChatResult> {
  const { timeoutMs = 30_000, maxOutputTokens = 2048, maxRetries = 2 } = options;
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 1.0,
      maxOutputTokens,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const RETRYABLE_CODES = [429, 500, 502, 503, 504];
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delayMs = 1000 * Math.pow(2, attempt - 1);
      await new Promise(r => setTimeout(r, delayMs));
    }

    const signal = AbortSignal.timeout(timeoutMs);

    type FetchResult = { ok: true; data: Record<string, unknown> } | { ok: false; status: number; errorText: string };

    const doFetch = async (): Promise<FetchResult> => {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify(body),
        signal,
      });
      if (response.ok) {
        const data = await response.json();
        return { ok: true, data };
      }
      return { ok: false, status: response.status, errorText: await response.text() };
    };

    let result: FetchResult;
    try {
      result = await Promise.race([
        doFetch(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Gemini chat hard timeout after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);
    } catch (err) {
      const isTimeout = (err instanceof Error && err.message.includes('hard timeout'))
        || (err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError'));
      if (isTimeout && attempt < maxRetries) {
        lastError = err instanceof Error ? err : new Error('Timeout');
        continue;
      }
      throw err;
    }

    if (result.ok) {
      // deno-lint-ignore no-explicit-any
      const data = result.data as any;
      const parts = data.candidates?.[0]?.content?.parts || [];
      // deno-lint-ignore no-explicit-any
      const outputPart = parts.filter((p: any) => !p.thought).pop();
      return {
        text: outputPart?.text || '',
        inputTokens: data.usageMetadata?.promptTokenCount || 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
      };
    }

    console.error(`[callGeminiChat] Error (attempt ${attempt + 1}):`, result.status, result.errorText);
    lastError = new Error(`Gemini API error: ${result.status}`);
    if (result.status === 429) {
      lastError = new Error('Rate limit exceeded. Please try again later.');
    }
    if (!RETRYABLE_CODES.includes(result.status)) throw lastError;
  }

  throw lastError || new Error('Gemini chat failed after retries');
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
