/**
 * AI Client Utilities
 * Provides unified interface for Gemini and Claude AI calls
 */

import { AIError, RateLimitError } from './errors.ts';

// =============================================================================
// Types
// =============================================================================

export interface AIResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  provider: 'gemini' | 'anthropic';
  latencyMs: number;
}

export interface AIOptions {
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  jsonMode?: boolean;
  tools?: unknown[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// =============================================================================
// Model Configuration
// =============================================================================

export const MODELS = {
  // Gemini models (fast, multimodal)
  GEMINI_FLASH: 'gemini-3-flash-preview',
  GEMINI_PRO: 'gemini-3-pro-preview',
  GEMINI_IMAGE: 'gemini-3-pro-image-preview',

  // Claude models (reasoning)
  CLAUDE_HAIKU: 'claude-haiku-4-5-20251001',
  CLAUDE_SONNET: 'claude-sonnet-4-5-20250929',
  CLAUDE_OPUS: 'claude-opus-4-5-20251101',
} as const;

// Model pricing per 1K tokens (as of Feb 2026)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gemini-3-flash-preview': { input: 0.0001, output: 0.0004 },
  'gemini-3-pro-preview': { input: 0.00125, output: 0.005 },
  'gemini-3-pro-image-preview': { input: 0.00125, output: 0.005 },
  'claude-haiku-4-5-20251001': { input: 0.001, output: 0.005 },
  'claude-sonnet-4-5-20250929': { input: 0.003, output: 0.015 },
  'claude-opus-4-5-20251101': { input: 0.015, output: 0.075 },
  'default': { input: 0.001, output: 0.002 },
};

// =============================================================================
// Gemini Client
// =============================================================================

/**
 * Call Gemini API
 */
export async function callGemini(
  prompt: string,
  options: AIOptions = {}
): Promise<AIResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new AIError('GEMINI_API_KEY not configured', 'gemini');
  }

  const model = options.temperature === 0 ? MODELS.GEMINI_PRO : MODELS.GEMINI_FLASH;
  const startTime = Date.now();

  const contents = [];

  // Add system instruction if provided
  const systemInstruction = options.systemPrompt
    ? { parts: [{ text: options.systemPrompt }] }
    : undefined;

  contents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 1.0, // Gemini 3 requires 1.0
      maxOutputTokens: options.maxTokens || 2048,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = systemInstruction;
  }

  if (options.jsonMode) {
    (body.generationConfig as Record<string, unknown>).responseMimeType = 'application/json';
  }

  if (options.tools) {
    body.tools = options.tools;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);

    if (response.status === 429) {
      throw new RateLimitError();
    }
    throw new AIError(`Gemini API error: ${response.status}`, 'gemini', model, errorText);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    model,
    provider: 'gemini',
    latencyMs,
  };
}

/**
 * Call Gemini with chat history
 */
export async function callGeminiChat(
  messages: ChatMessage[],
  options: AIOptions = {}
): Promise<AIResponse> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    throw new AIError('GEMINI_API_KEY not configured', 'gemini');
  }

  const model = MODELS.GEMINI_FLASH;
  const startTime = Date.now();

  // Convert messages to Gemini format
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Extract system message
  const systemMessage = messages.find(m => m.role === 'system');
  const systemInstruction = systemMessage || options.systemPrompt
    ? { parts: [{ text: systemMessage?.content || options.systemPrompt }] }
    : undefined;

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: options.temperature ?? 1.0,
      maxOutputTokens: options.maxTokens || 2048,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = systemInstruction;
  }

  if (options.jsonMode) {
    (body.generationConfig as Record<string, unknown>).responseMimeType = 'application/json';
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    if (response.status === 429) throw new RateLimitError();
    throw new AIError(`Gemini API error: ${response.status}`, 'gemini', model);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    inputTokens: data.usageMetadata?.promptTokenCount || 0,
    outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
    model,
    provider: 'gemini',
    latencyMs,
  };
}

// =============================================================================
// Claude Client
// =============================================================================

/**
 * Call Claude API
 */
export async function callClaude(
  prompt: string,
  options: AIOptions = {}
): Promise<AIResponse> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new AIError('ANTHROPIC_API_KEY not configured', 'anthropic');
  }

  const model = MODELS.CLAUDE_SONNET;
  const startTime = Date.now();

  const messages = [{ role: 'user', content: prompt }];

  const body: Record<string, unknown> = {
    model,
    max_tokens: options.maxTokens || 2048,
    messages,
  };

  if (options.systemPrompt) {
    body.system = [{
      type: 'text',
      text: options.systemPrompt,
      cache_control: { type: 'ephemeral' },
    }];
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'context-management-2025-06-27',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error:', response.status, errorText);

    if (response.status === 429) {
      throw new RateLimitError();
    }
    throw new AIError(`Anthropic API error: ${response.status}`, 'anthropic', model, errorText);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    text: data.content?.[0]?.text || '',
    inputTokens: data.usage?.input_tokens || 0,
    outputTokens: data.usage?.output_tokens || 0,
    model,
    provider: 'anthropic',
    latencyMs,
  };
}

/**
 * Call Claude with chat history
 */
export async function callClaudeChat(
  messages: ChatMessage[],
  options: AIOptions = {}
): Promise<AIResponse> {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    throw new AIError('ANTHROPIC_API_KEY not configured', 'anthropic');
  }

  const model = MODELS.CLAUDE_SONNET;
  const startTime = Date.now();

  // Extract system message
  const systemMessage = messages.find(m => m.role === 'system');

  // Convert messages (excluding system)
  const chatMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

  const body: Record<string, unknown> = {
    model,
    max_tokens: options.maxTokens || 2048,
    messages: chatMessages,
  };

  const systemPrompt = systemMessage?.content || options.systemPrompt;
  if (systemPrompt) {
    body.system = [{
      type: 'text',
      text: systemPrompt,
      cache_control: { type: 'ephemeral' },
    }];
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'context-management-2025-06-27',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 429) throw new RateLimitError();
    throw new AIError(`Anthropic API error: ${response.status}`, 'anthropic', model);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startTime;

  return {
    text: data.content?.[0]?.text || '',
    inputTokens: data.usage?.input_tokens || 0,
    outputTokens: data.usage?.output_tokens || 0,
    model,
    provider: 'anthropic',
    latencyMs,
  };
}

// =============================================================================
// Unified API
// =============================================================================

export type AIProvider = 'gemini' | 'anthropic' | 'auto';

/**
 * Call AI with automatic provider selection
 * - Use Gemini for fast extraction and grounding
 * - Use Claude for complex reasoning
 */
export async function callAI(
  prompt: string,
  options: AIOptions & { provider?: AIProvider } = {}
): Promise<AIResponse> {
  const provider = options.provider || 'gemini';

  if (provider === 'anthropic') {
    return callClaude(prompt, options);
  }

  return callGemini(prompt, options);
}

/**
 * Parse JSON from AI response with fallback
 */
export function parseAIJson<T>(response: AIResponse): T | null {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : response.text.trim();
    return JSON.parse(jsonStr);
  } catch {
    console.error('Failed to parse AI response as JSON:', response.text.slice(0, 200));
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
