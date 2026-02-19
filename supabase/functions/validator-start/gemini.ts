/**
 * Re-exports from _shared/gemini.ts — single source of truth.
 * All agents in ./agents/ import from here without changing their paths.
 */
export { callGemini, extractJSON } from "../_shared/gemini.ts";
export type { GeminiCallOptions, GeminiCallResult } from "../_shared/gemini.ts";
