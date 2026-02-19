/**
 * Validator Pipeline Configuration
 * Agent definitions and timeouts.
 * CORS is handled by _shared/cors.ts (single source of truth).
 */

// Agent configurations
// P01: Added urlContext + thinking fields for Phase 1 upgrades
export const AGENTS = {
  extractor:   { name: 'ExtractorAgent',  model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
  research:    { name: 'ResearchAgent',   model: 'gemini-3-flash-preview', tools: ['googleSearch', 'urlContext'],  thinking: 'none' as const },
  competitors: { name: 'CompetitorAgent', model: 'gemini-3-flash-preview', tools: ['googleSearch'],               thinking: 'none' as const },
  scoring:     { name: 'ScoringAgent',    model: 'gemini-3-flash-preview', tools: [],                             thinking: 'high' as const },
  mvp:         { name: 'MVPAgent',        model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
  composer:    { name: 'ComposerAgent',   model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
  verifier:    { name: 'VerifierAgent',   model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
} as const;

export type AgentName = keyof typeof AGENTS;

// F2: Per-agent timeout budgets
// Critical path (Competitors decoupled to background):
//   Extractor(60s) + Research(40s) + Scoring(15s) + MVP(30s) + grace(5s) + Composer(~90s) + Verifier(5s) = ~245s
// Pipeline deadline is 300s (paid plan 400s). Composer budget is dynamically capped to remaining time minus 10s buffer.
// P04→P06: Composer maxOutputTokens restored to 8192 (P04 halved to 4096, but P06 reverted — 4096 caused truncation).
// Composer budget is dynamically capped in pipeline.ts (COMPOSER_MAX_BUDGET_MS = 90s).
// MVP increased from 15s to 30s — was timing out on cold starts. Typical ~11s, worst ~20s.
// P07: Extractor increased from 30s to 60s — 30s was hitting hard timeout on complex inputs with
// interview context (002-EFN refine mode). Gemini cold start + schema validation + body streaming = 30-50s.
export const AGENT_TIMEOUTS: Record<string, number> = {
  extractor: 60_000,    // Flash model, extraction (~6s typical, up to 50s with cold start + interview context + schema)
  research: 40_000,     // Flash model + Google Search + URL Context (parallel, bumped from 30s — URL Context is slow)
  competitors: 45_000,  // Runs as background promise now — longer timeout is safe
  scoring: 15_000,      // Flash model + thinking: high (~13s typical)
  mvp: 30_000,          // Flash model (~10s typical, up to 20s on cold starts)
  composer: 40_000,     // Base timeout (overridden by pipeline.ts dynamic budget, capped at 90s). maxOutputTokens: 8192 (set in composer.ts)
  verifier: 5_000,      // P03: Pure JS validation (no Gemini call), 5s safety net
};

// 021-CSP: Composer group timeouts
// Total worst case: 35s (parallel A+B+C) + 20s (sequential D) = 55s — within 90s Composer budget
export const COMPOSER_GROUP_TIMEOUTS = {
  parallel: 35_000,   // Per-group budget for A, B, C (run in parallel)
  synthesis: 20_000,  // Group D budget (runs after A+B+C)
};
