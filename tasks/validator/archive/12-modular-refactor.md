# 12 - Validator Pipeline Modular Refactor

## Status: Complete

## Summary

Refactored the 1,274-line `supabase/functions/validator-start/index.ts` monolith into 16 clean, modular files following the existing `lean-canvas-agent` pattern. Zero breaking changes.

## New Structure

```
supabase/functions/validator-start/
├── index.ts           # 121 lines: serve(), auth, session creation, fire-and-forget
├── deno.json          # Unchanged
├── types.ts           # 86 lines: All interfaces + SupabaseClient type
├── config.ts          # 32 lines: AGENTS, AGENT_TIMEOUTS, corsHeaders, AgentName
├── schemas.ts         # 207 lines: AGENT_SCHEMAS (7 JSON schemas)
├── gemini.ts          # 174 lines: callGemini(), extractJSON(), interfaces
├── db.ts              # 73 lines: updateRunStatus(), completeRun()
├── pipeline.ts        # 159 lines: runPipeline() orchestrator
└── agents/
    ├── index.ts       # 12 lines: Barrel re-export
    ├── extractor.ts   # 56 lines
    ├── research.ts    # 59 lines
    ├── competitors.ts # 75 lines
    ├── scoring.ts     # 79 lines
    ├── mvp.ts         # 80 lines
    ├── composer.ts    # 82 lines
    └── verifier.ts    # 88 lines
```

**16 files, 1,383 lines total** (vs 1,274 in monolith — growth from module headers and explicit imports)

## Import Dependency Graph

```
Leaf (no deps):  types.ts, config.ts, schemas.ts, gemini.ts
Layer 2:         db.ts -> types
Layer 3:         agents/*.ts -> types, config, schemas, gemini, db
                 (exception: verifier.ts -> types, db only)
Layer 4:         agents/index.ts -> barrel re-export all agents
Layer 5:         pipeline.ts -> types, agents/index
Layer 6:         index.ts -> config, pipeline
```

No circular dependencies. Clean DAG.

## Module Responsibilities

| Module | Exports | Responsibility |
|--------|---------|----------------|
| `types.ts` | 9 interfaces + SupabaseClient | All shared type definitions |
| `config.ts` | corsHeaders, AGENTS, AgentName, AGENT_TIMEOUTS | Constants and configuration |
| `schemas.ts` | AGENT_SCHEMAS | JSON schemas for Gemini responseJsonSchema (G1) |
| `gemini.ts` | callGemini(), extractJSON(), GeminiCallOptions, GeminiCallResult | Gemini API client with retries, timeouts, grounding |
| `db.ts` | updateRunStatus(), completeRun() | Database helpers for validator_runs |
| `pipeline.ts` | runPipeline() | Pipeline orchestrator with F3 safety net |
| `agents/*.ts` | runExtractor, runResearch, runCompetitors, runScoring, runMVP, runComposer, runVerifier | Individual agent implementations |

## Preserved Audit Fixes

All audit findings from the original monolith are preserved in their respective modules:

- **F1**: Safe JSON extraction (gemini.ts)
- **F2**: Per-agent timeouts via AbortController (gemini.ts + config.ts)
- **F3**: Catch-all safety net (pipeline.ts)
- **F4**: Parallel Research + Competitors (pipeline.ts)
- **F11**: Track failed agents (pipeline.ts)
- **F13**: Input sanitization (index.ts)
- **F15**: Include extracted profile in report (pipeline.ts)
- **F18-F21**: Gemini API alignment G1-G5 (gemini.ts)

## Why Self-Contained (Not Using _shared/)

- `_shared/ai-client.ts` uses API key in query param (G4 anti-pattern)
- `_shared/ai-client.ts` lacks retries, AbortController timeouts, responseJsonSchema, grounding citations
- `_shared/cors.ts` adds extra headers the validator doesn't use
- `_shared/auth.ts` does extra profile/org/startup lookups not needed here

## How to Extend

### Adding a new agent

1. Create `agents/new-agent.ts` following the pattern in `agents/extractor.ts`
2. Add the agent config to `AGENTS` in `config.ts`
3. Add the JSON schema to `AGENT_SCHEMAS` in `schemas.ts`
4. Add the timeout to `AGENT_TIMEOUTS` in `config.ts`
5. Add the agent type to `types.ts` if it produces a new output type
6. Export from `agents/index.ts`
7. Wire into `pipeline.ts` at the appropriate position

### Modifying the Gemini client

All Gemini API logic is in `gemini.ts`. Changes to retry logic, timeout handling, or response parsing are isolated to this file.

### Modifying the pipeline flow

The orchestration logic is in `pipeline.ts`. Agent ordering, parallelism, and report insertion are all here.

## Verification

- Deploy succeeded: `npx supabase functions deploy validator-start --no-verify-jwt`
- Bundler resolved all imports (script size: 948.8kB)
- Same behavior as monolith — zero breaking changes

## Sample Request/Response

**Request:**
```json
POST /functions/v1/validator-start
Authorization: Bearer <user-jwt>

{
  "input_text": "An AI-powered platform that helps startup founders validate their business ideas using market research, competitor analysis, and scoring algorithms.",
  "startup_id": "optional-uuid"
}
```

**Response (immediate):**
```json
{
  "success": true,
  "session_id": "uuid-of-session",
  "status": "running"
}
```

Pipeline runs in background via `EdgeRuntime.waitUntil`. Poll `validator-status` for progress.
