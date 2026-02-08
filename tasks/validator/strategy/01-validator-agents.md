# Validator Agent Architecture Strategy

> **Status:** PLAN ONLY | **Date:** 2026-02-08 | **Version:** 1.0

## 1. Current State: Monolith Pipeline

Today all 7 agents run inside a single Deno Deploy edge function (`validator-start`) with a hard 130s wall-clock budget. One slow agent (MVP at 15s timeout) can cascade-fail the entire pipeline.

```
validator-start/index.ts
  -> pipeline.ts (orchestrator)
     -> agents/extractor.ts    (6s)
     -> agents/research.ts     (22s)    Google Search + URL Context + RAG
     -> agents/competitors.ts  (31s)    Google Search (background promise)
     -> agents/scoring.ts      (11s)    Thinking: high
     -> agents/mvp.ts          (15s)    <-- TIMED OUT (Gemini 15s limit)
     -> agents/composer.ts     (55s budget)
     -> agents/verifier.ts     (pure JS, no AI)
```

**Problem:** Deno Deploy kills isolates at 150s. Our pipeline budget is 130s. If Research takes 40s (max) and Competitors finishes late, Composer gets squeezed below its 15s minimum and the session dies as "failed."

---

## 2. Target State: Separated Agent Edge Functions

Each agent becomes its own edge function. An **Orchestrator** dispatches them, writes status to the DB, and handles retries. The frontend polls `validator-status` as today.

### 2.1 Agent Inventory

| # | Agent | Edge Function | AI Model | Tools | Timeout | Inputs | Outputs |
|---|-------|--------------|----------|-------|---------|--------|---------|
| 0 | **Orchestrator** | `validator-orchestrate` | None (JS logic) | Supabase RPCs | 10s | session_id, input_text | Dispatches agents, writes status |
| 1 | **Extractor** | `validator-agent-extract` | gemini-3-flash | None | 15s | raw input text | `StartupProfile` |
| 2 | **Researcher** | `validator-agent-research` | gemini-3-flash | Google Search, URL Context, RAG | 50s | StartupProfile | `MarketResearch` |
| 3 | **Competitor Analyst** | `validator-agent-competitors` | gemini-3-flash | Google Search | 50s | StartupProfile | `CompetitorAnalysis` |
| 4 | **Scorer** | `validator-agent-score` | gemini-3-flash | Thinking: high | 20s | Profile + Market + Competitors | `ScoringResult` |
| 5 | **MVP Planner** | `validator-agent-mvp` | gemini-3-flash | None | 20s | Profile + Scoring | `MVPPlan` |
| 6 | **Composer** | `validator-agent-compose` | gemini-3-pro | Thinking: medium | 90s | All 5 agent outputs | `ValidatorReport` (15 sections) |
| 7 | **Verifier** | `validator-agent-verify` | None (JS logic) | None | 5s | Report + failed_agents | `VerificationResult` |

### 2.2 Why Separate?

| Benefit | Explanation |
|---------|-------------|
| **No cascade timeout** | Each agent gets its own 150s Deno Deploy isolate. MVP timing out doesn't kill Composer. |
| **Parallel execution** | Research + Competitors can run simultaneously (today only Competitors is parallel via background promise). |
| **Independent retries** | Failed agent retries without re-running all previous agents. |
| **Model flexibility** | Composer can use `gemini-3-pro` for better JSON, while Extractor stays on Flash. |
| **Observable** | Each function logs independently. Easier to debug "which agent is slow today." |
| **Cost control** | Scale and rate-limit agents independently. Research uses search credits; Extractor doesn't. |

---

## 3. Mapping to Universal Agent System (Section 7.1)

The PRD defines 10 universal agent roles. Here's how validator agents map:

| Universal Role | Validator Agent | Status | Purpose in Validator | System-Wide Use Cases |
|----------------|----------------|--------|---------------------|----------------------|
| **Orchestrator** | `validator-orchestrate` | NEW | Dispatches agents, manages DAG, handles retries, writes session status | Runs any multi-agent pipeline (validation, lean canvas, market research) |
| **Planner** | (embedded in Orchestrator) | FUTURE | Analyzes input quality, decides which agents to skip (e.g., skip Competitors if founder provided 5 competitors) | Sprint planning, task decomposition, roadmap generation |
| **Analyst** | **Scorer** + **Researcher** | EXISTS | Scorer finds risks/gaps; Researcher finds market data | Financial analysis, competitor monitoring, metric tracking |
| **Optimizer** | (not yet needed) | FUTURE | Tunes pipeline concurrency, model selection per input complexity | Build optimization, cost reduction, performance tuning |
| **Scorer** | **Scorer** | EXISTS | Computes dimension scores, market factors, execution factors, GO/CAUTION/NO-GO | Lean Canvas scoring, opportunity scoring, investor readiness |
| **Retriever (RAG)** | **Researcher** (embedded) | EXISTS | Searches `knowledge_chunks` vector DB for market data | Document search, playbook lookup, similar-startup matching |
| **Extractor** | **Extractor** | EXISTS | Structures raw founder input into `StartupProfile` | Profile import, pitch deck parsing, document extraction |
| **Content/Comms** | **Composer** | EXISTS | Writes the 15-section validation report | Email drafts, pitch deck content, investor updates |
| **Ops Automation** | (not yet needed) | FUTURE | Trigger follow-up reminders, schedule re-validation | Sprint reminders, metric check-ins, deadline alerts |
| **Controller** | **Verifier** | EXISTS | Approval gate -- checks all 15 sections present, citations exist, quality thresholds | PR review gate, deployment checklist, compliance validation |

### 3.1 Agents NOT in Universal System (Validator-Specific)

| Agent | Why It's Separate |
|-------|-------------------|
| **Competitor Analyst** | Specialized Google Search patterns, curated link matching, SWOT generation. Could be a sub-role of Analyst but warrants its own function due to timeout needs. |
| **MVP Planner** | Product strategy agent -- maps scoring risks to build phases. Could evolve into the universal **Planner** role. |

---

## 4. Execution DAG (Dependencies)

```
                    +-----------+
                    | Extractor |  (1)
                    +-----+-----+
                          |
                +---------+---------+
                |                   |
          +-----v-----+      +-----v-------+
          | Researcher |      | Competitors |  (2+3 parallel)
          +-----+-----+      +------+------+
                |                    |
                +--------+-----------+
                         |
                   +-----v-----+
                   |   Scorer   |  (4) needs Profile + Market + Competitors
                   +-----+-----+
                         |
                   +-----v-----+
                   | MVP Planner|  (5) needs Profile + Scoring
                   +-----+-----+
                         |
                   +-----v-----+
                   |  Composer  |  (6) needs ALL 5 outputs
                   +-----+-----+
                         |
                   +-----v-----+
                   |  Verifier  |  (7) checks final report
                   +-----------+
```

### 4.1 Critical Path Analysis

| Path | Agents | Estimated Time |
|------|--------|---------------|
| **Current critical path** | Extractor -> Research -> Scoring -> MVP -> Composer -> Verifier | 6 + 22 + 11 + 15 + 40 + 1 = **95s** |
| **With separation (parallel)** | Extractor -> (Research \|\| Competitors) -> Scorer -> MVP -> Composer -> Verifier | 6 + max(22,31) + 11 + 15 + 40 + 1 = **104s** |
| **With separation + parallel MVP** | Extractor -> (Research \|\| Competitors) -> (Scorer + MVP parallel) -> Composer -> Verifier | 6 + 31 + 15 + 40 + 1 = **93s** |
| **Aggressive parallel** | Extractor -> (Research \|\| Competitors \|\| MVP-lite) -> Scorer -> Composer -> Verifier | 6 + 31 + 11 + 40 + 1 = **89s** |

**Key insight:** Separating agents doesn't reduce total wall-clock much because DAG dependencies are sequential. The real win is **reliability** (no cascade failures) and **individual retries**.

---

## 5. Real-World Examples

### Example 1: Fashion Tech Startup (Today's Failed Run)

```
Input: "AI platform for independent fashion labels to manage production workflows"

Extractor (6.3s)   -> Profile: {industry: "fashiontech", customer: "production managers"}
Researcher (22.3s) -> Market: {tam: $8.8B, growth: 41%, sources: 3 citations}
Competitors (31.5s) -> 4 direct, 2 indirect, SWOT, 3 market gaps
Scorer (11.5s)     -> Score: 72 (CAUTION), 7 dimensions, 8 factors
MVP (FAILED)       -> Gemini timeout at 15s  <-- PIPELINE DIES HERE
Composer           -> Never ran
Verifier           -> Never ran
Result: "Validation Failed" at 57% complete
```

**With separated agents:** MVP failure would NOT cascade. Orchestrator would:
1. Mark MVP as failed, record error
2. Run Composer with `mvp: null` (it handles missing data gracefully today)
3. Run Verifier (adds warning: "MVP section missing")
4. Deliver partial report (score: 72, 13/15 sections, verified: false)
5. User sees report with "MVP section unavailable -- retry?" prompt

### Example 2: SaaS B2B Startup (Successful Run)

```
Extractor (5.4s)   -> Clean profile extraction
Researcher (22.7s) -> TAM/SAM/SOM with 5 citations
Competitors (15.7s) -> 5 competitors with source URLs  [parallel]
Scorer (13.2s)     -> Score: 78 (GO)
MVP (11.1s)        -> 3 phases, 7 next steps
Composer (35s)     -> Full 15-section report
Verifier (0.1s)    -> All sections present, verified: true
Result: Complete at 100%, GO verdict
```

**With separated agents:** Same result but each agent's logs isolated. If Researcher takes 45s, Composer still gets its full 90s budget.

---

## 6. Connection Map: How Agents Work Together

```
FOUNDER INPUT (natural language)
       |
       v
[0. ORCHESTRATOR] -- reads input, creates session, dispatches DAG
       |
       v
[1. EXTRACTOR] -- structures raw text --> StartupProfile
       |
       +------------------+-----------------+
       |                  |                 |
       v                  v                 |
[2. RESEARCHER]    [3. COMPETITORS]         |
   Market sizing      Competitor map        |
   TAM/SAM/SOM       SWOT analysis          |
   RAG search         Feature gaps          |
   Citations          Source URLs           |
       |                  |                 |
       +--------+---------+                 |
                |                           |
                v                           |
         [4. SCORER] <--- needs Market + Competitors
            Dimension scores                |
            Market factors                  |
            Execution factors               |
            GO / CAUTION / NO-GO            |
                |                           |
                v                           |
         [5. MVP PLANNER] <--- needs Scoring risks
            Build phases                    |
            Next steps                      |
            De-risk priorities              |
                |                           |
                v                           |
         [6. COMPOSER] <--- receives ALL 5 outputs
            15-section report
            Technology, Revenue, Team
            Financials, Key Questions
                |
                v
         [7. VERIFIER]
            Completeness check
            Citation validation
            Quality warnings
            verified: true/false
                |
                v
         DATABASE (validation_reports)
                |
                v
         FRONTEND (ValidatorReport page + ReportScorePanel)
```

---

## 7. Implementation Phases

### Phase 1: Decouple Orchestrator (Low Risk)

| Step | What | Files |
|------|------|-------|
| 1a | Create `validator-orchestrate` edge function | `supabase/functions/validator-orchestrate/index.ts` |
| 1b | Orchestrator calls `validator-start` as subroutine initially | Minimal change to `pipeline.ts` |
| 1c | Frontend still polls `validator-status` | No frontend changes |
| 1d | Add `output_json` column to `validator_runs` | Migration |

### Phase 2: Extract Agents to Individual Functions

| Step | Agent | Priority | Reason |
|------|-------|----------|--------|
| 2a | **MVP Planner** | HIGH | Currently timing out -- needs its own 150s isolate |
| 2b | **Composer** | HIGH | Biggest consumer, benefits from pro model + 90s budget |
| 2c | **Scorer** | HIGH | Thinking: high needs breathing room |
| 2d | **Extractor** | MEDIUM | Simplest, good first extraction to prove the pattern |
| 2e | **Researcher** | MEDIUM | Google Search + RAG, complex but stable |
| 2f | **Competitors** | MEDIUM | Already runs as background promise |
| 2g | **Verifier** | LOW | Pure JS, keep inline in Orchestrator |

### Phase 3: Inter-Agent Communication

| Pattern | Description | When to Use |
|---------|-------------|-------------|
| **DB Relay** | Agent writes result to `validator_runs.output_json`. Orchestrator reads and passes to next. | Default for all agents. Simple, auditable. |
| **Direct Invoke** | Orchestrator calls edge function and awaits response body. | When latency matters (Extractor -> Scorer). |
| **Event-Driven** | Publish to Supabase Realtime channel. Orchestrator listens. | Future: real-time progress without polling. |

### Phase 4: Advanced (Future)

| Feature | Description |
|---------|-------------|
| **Planner Agent** | Analyzes input quality, skips agents based on what founder already provided |
| **Retry with fallback model** | Flash fails -> retry with Pro. Orchestrator manages model escalation. |
| **Partial report delivery** | Show completed sections immediately as each agent finishes (streaming report) |
| **Agent marketplace** | Community agents (PatentSearch, Regulatory, ESG) plug into the DAG |

---

## 8. Database Schema Changes

```sql
-- Store intermediate agent results for relay between separated functions
ALTER TABLE validator_runs ADD COLUMN IF NOT EXISTS
  output_json JSONB DEFAULT NULL;

-- Orchestrator execution plan tracking
ALTER TABLE validator_sessions ADD COLUMN IF NOT EXISTS
  agent_dag JSONB DEFAULT NULL;
```

Example `agent_dag` value:
```json
{
  "agents": {
    "extractor":   {"status": "complete", "duration_ms": 6300},
    "researcher":  {"status": "complete", "duration_ms": 22300},
    "competitors": {"status": "complete", "duration_ms": 31500},
    "scorer":      {"status": "complete", "duration_ms": 11500},
    "mvp":         {"status": "failed",   "error": "Gemini timeout", "retries": 1},
    "composer":    {"status": "running",  "started_at": "2026-02-08T12:00:00Z"},
    "verifier":    {"status": "pending"}
  },
  "parallel_groups": [
    ["researcher", "competitors"],
    ["scorer"],
    ["mvp"],
    ["composer"],
    ["verifier"]
  ]
}
```

---

## 9. Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Communication pattern | DB Relay (`validator_runs.output_json`) | Already exists, auditable, no new infrastructure |
| Composer model | Upgrade to `gemini-3-pro` when separated | Pro handles 15-section JSON better; 90s budget makes it feasible |
| Verifier location | Keep inline in Orchestrator | Pure JS, <1ms, no benefit from separation |
| MVP dependency | Keep after Scorer (needs `scoring.red_flags`) | Could parallelize later using `profile.differentiation` instead |
| Retry strategy | 1 retry per agent, then mark failed and continue | Prevents infinite loops; Composer gets 0 retries (too expensive) |
| Frontend changes | None in Phase 1-2 | Existing `validator-status` polling works regardless of backend architecture |
