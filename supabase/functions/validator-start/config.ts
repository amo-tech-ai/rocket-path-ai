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
//   Extractor(10s) + Research(40s) + Scoring(15s) + MVP(30s) + grace(5s) + Composer(~35s) + Verifier(5s) = ~140s
// Pipeline deadline is 115s. Composer budget is dynamically capped to remaining time minus 10s buffer.
// P04: Composer maxOutputTokens halved (8192→4096), now typically completes in 20-30s.
// MVP increased from 15s to 30s — was timing out on cold starts. Typical ~11s, worst ~20s.
export const AGENT_TIMEOUTS: Record<string, number> = {
  extractor: 10_000,    // Flash model, simple extraction (~6s typical)
  research: 40_000,     // Flash model + Google Search + URL Context (parallel, bumped from 30s — URL Context is slow)
  competitors: 45_000,  // Runs as background promise now — longer timeout is safe
  scoring: 15_000,      // Flash model + thinking: high (~13s typical)
  mvp: 30_000,          // Flash model (~10s typical, up to 20s on cold starts)
  composer: 40_000,     // P04: Reduced from 55s — maxOutputTokens halved (4096), prompt streamlined
  verifier: 5_000,      // P03: Pure JS validation (no Gemini call), 5s safety net
};
