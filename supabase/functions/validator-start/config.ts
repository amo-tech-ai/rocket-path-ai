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
  competitors: { name: 'CompetitorAgent', model: 'gemini-3-flash-preview', tools: ['googleSearch', 'urlContext?'], thinking: 'none' as const },
  scoring:     { name: 'ScoringAgent',    model: 'gemini-3-flash-preview', tools: [],                             thinking: 'high' as const },
  mvp:         { name: 'MVPAgent',        model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
  composer:    { name: 'ComposerAgent',   model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
  verifier:    { name: 'VerifierAgent',   model: 'gemini-3-flash-preview', tools: [],                             thinking: 'none' as const },
} as const;

export type AgentName = keyof typeof AGENTS;

// F2: Per-agent timeout budgets
// Critical path (Research + Competitors + Scoring run in PARALLEL after Extractor):
//   Extractor(60s) + max(Research(40s), Competitors(55s), Scoring(30s)) + MVP(30s) + grace(5s) + Composer(~50s) + Verifier(5s) = ~205s
// Pipeline deadline is 140s (free plan 150s). Change to 300s when upgrading to Pro plan (400s wall-clock).
// Composer budget is dynamically capped to remaining time minus 10s buffer.
// P04→P06: Composer maxOutputTokens restored to 8192 (P04 halved to 4096, but P06 reverted — 4096 caused truncation).
// Composer budget is dynamically capped in pipeline.ts (COMPOSER_MAX_BUDGET_MS = 90s).
// MVP increased from 15s to 30s — was timing out on cold starts. Typical ~11s, worst ~20s.
// P07: Extractor increased from 30s to 60s — 30s was hitting hard timeout on complex inputs with
// interview context (002-EFN refine mode). Gemini cold start + schema validation + body streaming = 30-50s.
// Pro plan critical path: Extractor(60s) → parallel(Research(60s) + Competitors(55s) + Scoring(50s)) → MVP(30s) → Composer(90s) → Verifier(5s)
// Total worst case: 60 + 60 + 30 + 90 + 5 = 245s (within 300s budget). Upgraded to Pro 2026-03-18.
// Scoring increased 30→50s: thinking: 'high' adds 13-25s overhead + cold start can push to 40s+ (was causing ~40% timeout rate)
export const AGENT_TIMEOUTS: Record<string, number> = {
  extractor: 60_000,    // Flash model (~6-11s typical, up to 50s with cold start + interview context)
  research: 60_000,     // Flash + Google Search + URL Context + RAG + RESEARCH_FRAGMENT. Search grounding 30-50s
  competitors: 55_000,  // Background promise. ~15-20s search-only, ~30-40s with URL Context
  scoring: 65_000,      // Flash + thinking: high (~40s) + RAG/playbook overhead (~5-10s). Was 50s — timeout after RAG added in 50c.
  mvp: 30_000,          // Flash model (~10s typical, up to 20s on cold starts)
  composer: 40_000,     // Base timeout (overridden by pipeline.ts dynamic budget, capped at 90s)
  verifier: 5_000,      // Pure JS validation (no Gemini call)
};

// 021-CSP: Composer group timeouts
// Total worst case: 35s (parallel A+B+C) + 20s (sequential D) + 35s (Group E) = 90s — within 90s Composer budget
// Phase 3 (Group E) uses remaining time after D, capped at groupE. Skipped if < 20s remain.
export const COMPOSER_GROUP_TIMEOUTS = {
  parallel: 35_000,   // Per-group budget for A, B, C (run in parallel)
  synthesis: 20_000,  // Group D budget (runs after A+B+C)
  groupE: 35_000,     // Group E budget (9 parallel dimension calls, runs after D)
};
