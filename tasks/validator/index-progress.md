# Validator System — Progress Tracker

> **Updated:** 2026-02-05 | **Scope:** Chat-to-Report Validation Pipeline
> **Focus:** User Input → Chat Q&A → Agent Pipeline → Progress Animation → 3-Panel Report

---

## System Architecture Overview

```
USER JOURNEY:
  /validate (chat) ──→ ValidatorChat ──→ Follow-up Q&A ──→ Generate
       ↓
  ValidatorProcessingAnimation (4-phase cosmetic)
       ↓
  validator-start edge function (7 agents, background)
       ↓
  /validator/run/:sessionId (real-time polling every 2s)
       ↓
  ExtractorAgent → ResearchAgent → CompetitorAgent → ScoringAgent → MVPAgent → ComposerAgent → VerifierAgent
       ↓
  /validator/report/:reportId (3-panel report + coach + trace drawer)
```

---

## 1. Core Chat-to-Report Flow

| # | Task | Description | Status | % | Confirmed | Missing/Failing | Next Action |
|---|------|-------------|--------|---|-----------|-----------------|-------------|
| 1 | Chat Entry Page | `ValidateIdea.tsx` — hero + embedded `ValidatorChat` | 🟢 Completed | 100% | Working, reads `sessionStorage` for pending ideas | — | None |
| 2 | Chat Input Component | `ValidatorChatInput.tsx` — suggestion chips, char count, dual buttons | 🟢 Completed | 100% | Send + Generate buttons, 500-char recommendation | — | None |
| 3 | Chat Message Bubbles | `ValidatorChatMessage.tsx` — user/assistant, markdown, typing indicator | 🟢 Completed | 100% | ReactMarkdown, animated dots | — | None |
| 4 | Chat Q&A Flow | `ValidatorChat.tsx` — welcome → 4 follow-ups → generate | 🟢 Completed | 95% | Asks: idea, customer, alternatives, differentiation, validation | Agent doesn't evaluate all 10 planned criteria (missing: channels, revenue model, industry, type, AI features) | Expand follow-up question set |
| 5 | Processing Animation | `ValidatorProcessingAnimation.tsx` — 4-phase overlay | 🟢 Completed | 100% | Analyzing → Researching → Scoring → Complete (1s each) | Cosmetic only (real work is backend) | None |
| 6 | Pipeline Hook | `useValidatorPipeline.ts` — calls `validator-start`, navigates | 🟢 Completed | 100% | Toast notifications, error handling, `isStarting` state | — | None |
| 7 | Progress Tracking Page | `ValidatorProgress.tsx` — polls `validator-status` every 2s | 🟢 Completed | 100% | 7-agent display, duration, citations, status badges | — | None |
| 8 | Auto-Navigation | Progress → Report redirect when `verified=true` | 🟢 Completed | 100% | 2-second delay before redirect | — | None |
| 9 | Report Page | `ValidatorReport.tsx` — score circle, verdict, trace drawer | 🟢 Completed | 85% | 7 sections displayed, trace drawer with agent details | Design calls for 14 sections (only 7 built) | Add remaining 7 sections |
| 10 | 3-Panel Layout | `ValidatorLayout.tsx` — main + coach + responsive | 🟢 Completed | 100% | Desktop side-by-side, tablet drawer, mobile toggle | — | None |

---

## 2. Edge Functions (Backend Pipeline)

| # | Task | Description | Status | % | Confirmed | Missing/Failing | Next Action |
|---|------|-------------|--------|---|-----------|-----------------|-------------|
| 11 | validator-start | 7-agent pipeline orchestrator (897 lines) | 🟢 Completed | 95% | Background via `EdgeRuntime.waitUntil()`, retry logic, graceful degradation | Vector DB not integrated, no caching | Integrate `knowledge_chunks` RAG |
| 12 | ExtractorAgent | Parse user text → structured `StartupProfile` | 🟢 Completed | 100% | Gemini Flash, JSON output | — | None |
| 13 | ResearchAgent | TAM/SAM/SOM with Google Search | 🟢 Completed | 100% | Gemini Pro + `googleSearch` tool, citations | — | None |
| 14 | CompetitorAgent | Direct/indirect competitors via Google Search | 🟢 Completed | 100% | Gemini Pro + `googleSearch`, threat levels | — | None |
| 15 | ScoringAgent | 7-dimension scoring (0-100), verdict | 🟢 Completed | 100% | GO/CAUTION/NO-GO thresholds (75/50) | — | None |
| 16 | MVPAgent | MVP scope + 3 phases + 7 next steps | 🟢 Completed | 100% | Gemini Flash, practical action items | — | None |
| 17 | ComposerAgent | Synthesize all outputs into final report | 🟢 Completed | 100% | Gemini Pro, 8 sections with citations | — | None |
| 18 | VerifierAgent | Check completeness, missing sections, citations | 🟢 Completed | 100% | Gemini Flash, verified flag, warnings | — | None |
| 19 | validator-status | GET polling endpoint for progress | 🟢 Completed | 100% | Returns steps array, progress %, report data | — | None |
| 20 | validator-regenerate | Retry failed agents | 🟡 In Progress | 30% | Exists but is a stub — restarts full pipeline | No selective agent re-run | Implement per-agent retry |

---

## 3. Database Schema

| # | Task | Description | Status | % | Confirmed | Missing/Failing | Next Action |
|---|------|-------------|--------|---|-----------|-----------------|-------------|
| 21 | validator_sessions | Track validation sessions (user_id, input, status) | 🟢 Completed | 100% | RLS policies, indexes | — | None |
| 22 | validator_runs | Agent execution logs (7 per session) | 🟢 Completed | 100% | Status tracking, output_json, citations, duration_ms | — | None |
| 23 | validation_reports | Final reports with scores and details | 🟢 Completed | 100% | Updated with session_id, verified, verification_json | — | None |
| 24 | knowledge_chunks | Vector DB for RAG (1536D, HNSW index) | 🟡 In Progress | 40% | Schema + search function + pgvector ready | No data seeded, not connected to pipeline | Seed data from research links, wire to agents |
| 25 | Old schema cleanup | `validation_runs` / `validation_verdicts` (legacy) | 🟡 In Progress | 50% | Old tables still exist alongside new ones | Confusing dual schemas | Deprecate or migrate |

---

## 4. Report Sections (Design vs Implementation)

| # | Section | Spec Source | Status | % | Confirmed | Missing/Failing | Next Action |
|---|---------|-------------|--------|---|-----------|-----------------|-------------|
| 26 | Executive Summary Card | 201-validate.md | 🟢 Completed | 100% | Score circle, verdict, summary text | — | None |
| 27 | Key Recommendations | 201-validate.md | 🟢 Completed | 90% | Shown in TradeoffsCard next steps column | Not a standalone card | Extract to dedicated card |
| 28 | Market Analysis Summary | 201-validate.md | 🟢 Completed | 80% | TAM/SAM/SOM shown, basic market data | Missing: CAGR, regions, growth chart | Add market depth |
| 29 | Validation Scorecard | 201-validate.md | 🟢 Completed | 100% | 7-dimension scores in EvidenceBlocks | — | None |
| 30 | Key Strengths & Concerns | 201-validate.md | 🟢 Completed | 100% | TradeoffsCard with 3 columns | — | None |
| 31 | Scores & Analysis Matrix | 201-validate.md | 🟡 In Progress | 60% | Market factors exist, execution factors partial | Missing: full matrix view with both factor groups | Build matrix component |
| 32 | Market & Competition | 201-validate.md, 111 | 🟡 In Progress | 50% | Competitors listed, threat levels shown | Missing: positioning matrix, SWOT, feature comparison | Build competitor deep-dive |
| 33 | Financials & Risks | 201-validate.md, 112 | 🟡 In Progress | 40% | Risk section exists, basic risk list | Missing: unit economics, revenue models, projections (Y1/3/5) | Build financials section |
| 34 | Technology Assessment | 201-validate.md | 🔴 Not Started | 0% | — | Not implemented | Design + build |
| 35 | Revenue Projections | 201-validate.md | 🔴 Not Started | 0% | — | No Y1/Y3/Y5 projections | Build projection model |
| 36 | Team Requirements | 201-validate.md | 🔴 Not Started | 0% | — | Not implemented | Design + build |
| 37 | Curated Resources | 201-validate.md | 🔴 Not Started | 0% | — | No resource links section | Wire research links |
| 38 | Key Questions to Answer | 201-validate.md | 🔴 Not Started | 0% | — | Not implemented | Design + build |

---

## 5. Coach & Interactive Features

| # | Task | Description | Status | % | Confirmed | Missing/Failing | Next Action |
|---|------|-------------|--------|---|-----------|-----------------|-------------|
| 39 | CoachSyncContext | Bidirectional sync (explain/highlight/scores) | 🟢 Completed | 100% | Auto-clear, debounce, connection status | — | None |
| 40 | Click-to-Explain | Main panel → Coach panel explanation | 🟢 Completed | 100% | VerdictCard, EvidenceBlocks, TradeoffsCard all wired | — | None |
| 41 | Live Score Updates | Coach → Main real-time score changes | 🟢 Completed | 100% | `liveScores` in EvidenceBlocks | — | None |
| 42 | Sprint Progress | Sprint tracker with milestones | 🟢 Completed | 100% | Progress bar, checkboxes, indicator dots | — | None |

---

## 6. Plan Mode & Agent Intelligence

| # | Task | Description | Status | % | Confirmed | Missing/Failing | Next Action |
|---|------|-------------|--------|---|-----------|-----------------|-------------|
| 43 | Plan Mode Philosophy | AI proposes → Human decides → System executes | 🟢 Completed | 100% | Documented in plan-mode.md | — | None |
| 44 | Safe Exploration | Read-only research, no tasks created until approved | 🟡 In Progress | 50% | Concept defined, not enforced in code | No "plan mode" UI toggle | Build plan mode state |
| 45 | Agent Input Evaluation | Evaluate: problem, solution, features, market, channels, revenue, industry, type, AI features | 🟡 In Progress | 60% | ExtractorAgent gets: idea, problem, customer, solution, differentiation | Missing: channels, revenue model, industry detection, startup type, AI features | Expand extraction prompt |
| 46 | Dynamic Follow-up Questions | Agent adapts questions based on what's missing | 🟡 In Progress | 60% | 4 hardcoded follow-ups work | Not truly adaptive — always asks same 4 questions | Make questions context-aware |
| 47 | Vector DB Search Trigger | Search knowledge_chunks for research reports | 🔴 Not Started | 0% | — | knowledge_chunks table exists but has no data and no pipeline connection | Seed data + wire RAG to ResearchAgent |
| 48 | Research Link Integration | Use curated links from `/research/links/` for grounding | 🔴 Not Started | 0% | 500+ curated URLs across 14 industries exist | Not connected to any agent | Build link → embedding pipeline |

---

## 7. Advanced Features (Post-MVP)

| # | Task | Description | Status | % | Confirmed | Missing/Failing | Next Action |
|---|------|-------------|--------|---|-----------|-----------------|-------------|
| 49 | Export PDF | Download validation report as PDF | 🟥 Blocked | 10% | Button exists (disabled) | No PDF generation logic | Choose: html2pdf, puppeteer, or edge function |
| 50 | Share Links | Unique URLs for sharing reports | 🔴 Not Started | 0% | Spec in 109-share-links.md | No implementation | Build `report_shares` table + share-link-creator function |
| 51 | Market Analysis Deep Dive | Full TAM/SAM/SOM, trends, segments, benchmarks | 🔴 Not Started | 0% | Spec in 110-market-analysis.md (4 tables, 1 edge function) | Depends on 106-validation | Build market-research-agent |
| 52 | Competitor Intelligence | Positioning matrix, SWOT, feature comparison | 🔴 Not Started | 0% | Spec in 111-competitor-intel.md (3 tables, 1 edge function) | Depends on 110-market-analysis | Build competitor-agent |
| 53 | Lean Validation Agent | Assumptions, experiments, interviews, segments | 🟢 Completed | 90% | `validation-agent` edge function with 5 actions, Claude + Gemini | Missing: UI for experiments/interviews | Build validation lab UI |
| 54 | Scenario Planning | Compare 3 ideas side-by-side | 🔴 Not Started | 0% | Mentioned in plan-mode.md | — | Design comparison view |
| 55 | Industry Playbooks | Pre-built validation templates by industry | 🔴 Not Started | 0% | Mentioned in plan-mode.md, links available | — | Build playbook system |

---

## 8. Research Assets (Available for Integration)

| # | Asset | Files | Links | Industries | Status | Next Action |
|---|-------|-------|-------|------------|--------|-------------|
| 56 | Industry Research Links | 14 files | 500+ URLs | 14 verticals | 🟢 Available | Seed into knowledge_chunks |
| 57 | Startup News Sites | 1 file | 20 top sites | Cross-industry | 🟢 Available | Use for trend monitoring |
| 58 | AI Research Reports | 2 files | 100+ reports | All industries | 🟢 Available | Embed PDFs into vector DB |
| 59 | Research Tool Comparison | 1 file | 7 tools compared | — | 🟢 Available | Inform agent tool selection |
| 60 | SaaS Validation Framework | 203-saas.md | — | SaaS/AI | 🟢 Available | Use as system prompt context |
| 61 | IdeaProof Competitor Analysis | 201-validate.md | — | — | 🟢 Available | Benchmark our report sections |
| 62 | FashionOS Case Study | 202-idea-market-research.md | — | Fashion | 🟢 Available | Use as example/test data |

---

## Summary Dashboard

### Overall Progress

| Category | Tasks | Done | In Progress | Not Started | Blocked | % Complete |
|----------|-------|------|-------------|-------------|---------|------------|
| Core Chat Flow | 10 | 10 | 0 | 0 | 0 | **97%** |
| Edge Functions | 10 | 9 | 1 | 0 | 0 | **93%** |
| Database Schema | 5 | 3 | 2 | 0 | 0 | **78%** |
| Report Sections | 13 | 5 | 3 | 5 | 0 | **52%** |
| Coach Features | 4 | 4 | 0 | 0 | 0 | **100%** |
| Plan Mode & Intelligence | 6 | 1 | 3 | 2 | 0 | **37%** |
| Advanced Features | 7 | 1 | 0 | 5 | 1 | **15%** |
| **TOTAL** | **55** | **33** | **9** | **12** | **1** | **68%** |

### Critical Path (Recommended Execution Order)

```
PHASE 1 — Report Completeness (HIGH PRIORITY)
  ├─ Task 31: Build Scores & Analysis Matrix component
  ├─ Task 32: Build competitor deep-dive (positioning matrix, SWOT)
  ├─ Task 33: Build financials section (unit economics, projections)
  ├─ Task 34: Build Technology Assessment section
  └─ Task 9: Wire remaining 7 sections into ValidatorReport.tsx

PHASE 2 — Agent Intelligence (HIGH PRIORITY)
  ├─ Task 45: Expand ExtractorAgent to evaluate all 10 criteria
  ├─ Task 46: Make follow-up questions adaptive (context-aware)
  └─ Task 20: Implement selective agent re-run in validator-regenerate

PHASE 3 — Knowledge Integration (MEDIUM PRIORITY)
  ├─ Task 48: Build embedding pipeline for research links (500+ URLs)
  ├─ Task 24: Seed knowledge_chunks with curated data
  └─ Task 47: Wire RAG search into ResearchAgent + CompetitorAgent

PHASE 4 — Polish & Share (LOWER PRIORITY)
  ├─ Task 49: Implement PDF export
  ├─ Task 50: Build share links feature
  ├─ Task 44: Build Plan Mode UI toggle
  └─ Task 25: Deprecate old validation schema
```

### Key Strengths
- End-to-end chat-to-report flow is **fully functional**
- 7-agent pipeline with **real-time progress tracking** works
- **Google Search grounding** provides live market/competitor data
- **Coach integration** with bidirectional sync is production-ready
- **Graceful degradation** — partial reports still display if agents fail
- **500+ curated research links** ready for RAG integration

### Key Risks
- Report only shows **7 of 14 planned sections** — users may find it incomplete vs competitors
- **Vector DB is empty** — knowledge_chunks schema exists but has no data
- **Follow-up questions are static** — not truly adaptive to user input gaps
- **No PDF export** — users can't download or share reports offline
- **Dual schema confusion** — old `validation_runs` coexists with new `validator_runs`
- **Plan Mode not implemented** — 8 of 10 features from spec are not built (PM1-PM10)
- **6 unsafe JSON.parse calls** — single malformed Gemini response crashes pipeline
- **No request timeouts** — slow API call can exceed 150s edge function limit

### Improvements Summary
- **26 improvements identified** (6 P0, 9 P1, 7 P2, 4 P3)
- **10 Plan Mode gaps** mapped (2 partial, 8 not started)
- **3 bugs fixed** during audit, **3 open issues** remaining
- **Estimated effort:** ~2 weeks for P0+P1, ~1 week for P2

---

## 9. Suggested Improvements & Enhancements

### P0 — Critical (Ship Blockers)

| # | Enhancement | Description | Impact | File(s) | Effort |
|---|-------------|-------------|:------:|---------|:------:|
| I1 | Parallelize Research + Competitors | Both agents depend only on `profile` — run via `Promise.allSettled()` | **Speed: 30-40% faster** | `validator-start/index.ts:237-255` | S |
| I2 | Safe JSON.parse in all agents | 6 unprotected `JSON.parse()` calls — single malformed response crashes pipeline | **Reliability** | `validator-start/index.ts:497,540,604,676,744,806` | S |
| I3 | Add request timeouts | No `AbortController` — slow Gemini call can exceed 150s edge function limit | **Reliability** | `validator-start/index.ts:330-394` | S |
| I4 | Complete missing 7 report sections | Only 7 of 14 sections rendered — data already exists in `details` JSON | **Completeness** | `ValidatorReport.tsx:318-430` | M |
| I5 | Fix EdgeRuntime.waitUntil fallback | Fire-and-forget fallback has no guarantees pipeline completes | **Reliability** | `validator-start/index.ts:184-192` | M |
| I6 | Fix 401 deploy mismatch | `verify_jwt` was `true` on deployed function, `false` in config | **FIXED** | `validator-start` deployment | Done |

### P1 — High Priority (Next Sprint)

| # | Enhancement | Description | Impact | File(s) | Effort |
|---|-------------|-------------|:------:|---------|:------:|
| I7 | Add streaming responses | Use Gemini `streamGenerateContent` SSE endpoint for real-time text in chat & composer | **UX** | `validator-start`, `ValidatorChat.tsx` | L |
| I8 | Retry failed agents | Button to re-run only failed steps (not full pipeline restart) | **Reliability** | `validator-regenerate/index.ts` (currently stub) | M |
| I9 | Agent caching (market research) | Cache TAM/SAM/SOM by industry (stable 6-12 months) — skip Research agent on cache hit | **Performance: 95% faster** | New `market_research_cache` table | M |
| I10 | Adaptive follow-up questions | Use Gemini Flash to analyze input gaps and ask targeted questions vs hardcoded 4 | **UX** | `ValidatorChat.tsx:35-40,117-149` | M |
| I11 | Follow-up suggestions | AI suggests next questions as clickable chips after each user message | **UX** | `ValidatorChat.tsx`, `ValidatorChatInput.tsx` | M |
| I12 | Progress persistence | Save chat state to DB — resume incomplete validations after page close | **UX** | `ValidatorChat.tsx`, new `chat_sessions` table | M |
| I13 | Fix polling race condition | Stale responses can overwrite newer data — add request ID tracking | **Reliability** | `ValidatorProgress.tsx:78-127` | S |
| I14 | ARIA labels + keyboard navigation | ScrollArea, typing indicator, progress page missing accessibility | **A11y** | `ValidatorChat.tsx:209,219`, `ValidatorProgress.tsx` | S |
| I15 | Session check before pipeline | Verify auth token is valid before calling edge function | **FIXED** | `useValidatorPipeline.ts:49` | Done |

### P2 — Medium Priority (Backlog)

| # | Enhancement | Description | Impact | File(s) | Effort |
|---|-------------|-------------|:------:|---------|:------:|
| I16 | Competitor data caching | Cache competitor lists by industry vertical (3-month TTL) | **Performance** | New table + `validator-start` | M |
| I17 | Validation history timeline | Track score changes over time per startup — chart score evolution | **Analytics** | New `validation_history` view, chart component | M |
| I18 | Competitive radar chart | Visual 2D positioning matrix (quality vs price quadrants) | **Visualization** | New `CompetitorRadar.tsx` component | M |
| I19 | Input sanitization for XSS | Add DOMPurify to report content rendering (defense in depth) | **Security** | `ValidatorReport.tsx:488-490` | S |
| I20 | Restrict CORS in production | Replace `*` with app domain for edge functions | **Security** | `validator-start/index.ts:10-13` | S |
| I21 | Memory optimization in pipeline | Clear intermediate agent results after composer completes | **Performance** | `validator-start/index.ts:220-227` | S |
| I22 | Color-independent status indicators | Add icons + text labels alongside color-coded scores (WCAG AA) | **A11y** | `ValidatorReport.tsx:138-148` | S |

### P3 — Nice-to-Have (Future)

| # | Enhancement | Description | Impact | File(s) | Effort |
|---|-------------|-------------|:------:|---------|:------:|
| I23 | Optimistic UI updates | Navigate to progress page immediately, handle errors after | **UX** | `useValidatorPipeline.ts:56-86` | S |
| I24 | Scenario comparison | Compare 3 ideas side-by-side with shared scoring | **Strategy** | New `ScenarioCompare.tsx` page | L |
| I25 | Industry playbooks | Pre-built validation templates by industry (SaaS, fintech, etc.) | **Strategy** | New playbook system + prompts | L |
| I26 | Decision logs | Track founder decisions over time with reasoning | **Strategy** | New `decision_logs` table | M |

**Effort key:** S = Small (1-2 hours), M = Medium (half day), L = Large (1-2 days)

---

## 10. Plan Mode Improvements

> Current state: Philosophy documented in `plan-mode.md` but **not implemented in code**.
> Plan Mode = AI as thinking partner, not a doer. "AI proposes, Humans decide, Systems execute."

### Current Plan Mode Flow (Spec)

```
1. Founder Describes Goal → messy ideas, partial context
2. AI Asks Clarifying Questions → no assumptions without confirmation
3. Research & Analysis (Read-Only) → TAM/SAM/SOM, competitors, risks
4. Validation Report (Explainable) → opportunity score, risk breakdown, "why this might fail"
5. Structured Startup Plan (Proposed) → goals, assumptions, milestones, dependencies
6. Founder Review & Approval → edit, reject, adjust, "what if" questions
   └── Only THEN → Execution Mode (tasks, docs, CRM)
```

### What's Missing (Code vs Spec)

| # | Plan Mode Feature | Spec Status | Code Status | Gap | Next Action |
|---|-------------------|-------------|-------------|-----|-------------|
| PM1 | Read-only exploration mode | Defined | 🔴 Not built | No "plan mode" state in UI — chat goes straight to Generate | Add mode toggle: Plan Mode vs Execute Mode |
| PM2 | Clarifying questions (no assumptions) | Defined | 🟡 Partial | Chat asks 4 hardcoded questions — doesn't verify understanding | Wire to I10 (adaptive questions) |
| PM3 | Research without execution | Defined | 🟡 Partial | Research happens inside pipeline (after Generate) — not during chat | Split: research during chat, execution after approval |
| PM4 | Explainable validation report | Defined | 🟢 Working | Report shows scores + trace drawer with citations | Add "why this might fail" section |
| PM5 | Structured editable plan | Defined | 🔴 Not built | No editable plan output — report is read-only | Build plan editor with inline editing |
| PM6 | Founder review & approval gate | Defined | 🔴 Not built | No approval step — report is final output | Add "Approve → Execute" button |
| PM7 | "What if" scenario questions | Defined | 🔴 Not built | No way to ask follow-up questions on completed report | Wire coach panel to handle "what if" queries |
| PM8 | Safe exploration (no side effects) | Defined | 🟡 Partial | Pipeline creates DB records immediately | Add draft/preview mode before committing |
| PM9 | Parallel agent execution post-approval | Defined | 🔴 Not built | No concept of "approved plan → spawn agents" | Design approval → execution handoff |
| PM10 | Living strategy artifact (versioned) | Defined | 🔴 Not built | Reports are snapshots, not versioned documents | Add version tracking + diff view |

### Plan Mode Implementation Strategy

```
PHASE 1 — Core Plan Mode (Wire existing pieces)
  ├─ PM1: Add Plan/Execute mode toggle to ValidatorLayout
  ├─ PM2: Wire adaptive questions (I10) into plan mode chat
  ├─ PM6: Add "Approve Plan" gate before pipeline runs
  └─ PM8: Use draft state — don't create validator_sessions until approved

PHASE 2 — Research During Chat
  ├─ PM3: Run lightweight research (Gemini Flash) during Q&A
  │       → Show industry stats, competitor names as chat context
  │       → No full pipeline yet — just context building
  └─ PM4: Add "Why this might fail" section to report

PHASE 3 — Editable Plans & Scenarios
  ├─ PM5: Build plan editor (inline edit assumptions, milestones)
  ├─ PM7: "What if" queries via coach panel
  └─ PM10: Version history with score diffs

PHASE 4 — Post-Approval Orchestration
  ├─ PM9: Approved plan → spawn parallel agents (GTM, fundraising, ops)
  ├─ PM10: Plans become living strategy docs
  └─ PM11: Decision log tracking
```

### Plan Mode Use Cases (from spec)

| Use Case | Plan Mode Behavior | Current Support |
|----------|-------------------|-----------------|
| **Idea Validation** | Explore 3 ideas safely, approve only 1 | 🟡 Can validate 1, no comparison |
| **Fundraising Planning** | Propose investor types, timing, narrative gaps | 🔴 Not connected to investor-agent |
| **Accelerator Intake** | 20 startups → standardized reports | 🟡 Works per-startup, no batch mode |
| **Pivot Decisions** | "What if we switch ICP?" → compare paths | 🔴 No scenario comparison |

### Plan Mode Core vs Advanced

| Feature | Core (MVP) | Advanced | Status |
|---------|-----------|----------|--------|
| Clarifying questions | Ask before assuming | Context-aware adaptive | 🟡 Hardcoded |
| Validation report | Score + risks + recommendations | Explainable with "why fail" | 🟢 Working |
| High-level roadmap | 3-phase MVP plan | Milestone dependencies | 🟡 Phases exist |
| Risk & assumptions | Listed in report | Prioritized + mitigation plans | 🟡 Listed only |
| Scenario planning | — | Compare 3 paths side-by-side | 🔴 Not started |
| Parallel comparisons | — | Run agents on multiple ideas | 🔴 Not started |
| Industry playbooks | — | Pre-built templates per vertical | 🔴 Not started |
| Decision logs | — | Track choices + reasoning over time | 🔴 Not started |

---

## 11. Bugs & Issues Fixed (Audit Log)

| Date | Issue | Root Cause | Fix | Status |
|------|-------|-----------|-----|--------|
| 2026-02-05 | 401 on `validator-start` | Deployed v6 had `verify_jwt: true` — gateway blocked before function ran | Redeployed v7 with `--no-verify-jwt` | **FIXED** |
| 2026-02-05 | No auth check in pipeline hook | `useValidatorPipeline` didn't verify session before API call | Added `getSession()` check with user error message | **FIXED** |
| 2026-02-05 | 504 timeout on v5 | Pipeline ran synchronously (no `EdgeRuntime.waitUntil`) | Fixed in v4+ with background processing | **FIXED** |
| — | Chat skips follow-ups on initialIdea | `useEffect` with `initialIdea` bypasses question flow | **Open** — needs routing through `handleSendMessage` | TODO |
| — | `canGenerate` too eager | True after 1 message (`userMessages.length >= 1`) | **Open** — should require 2+ messages or coverage check | TODO |
| — | Dual edge function paths | Chat uses `validator-start`, dashboard uses `industry-expert-agent` | **Open** — should unify to single pipeline | TODO |

---

## File Index

### Core Flow Files
| File | Purpose | Lines |
|------|---------|-------|
| `src/pages/ValidateIdea.tsx` | Chat entry page | ~120 |
| `src/components/validator/chat/ValidatorChat.tsx` | Chat Q&A logic | ~300 |
| `src/components/validator/chat/ValidatorChatInput.tsx` | Input + suggestions | ~150 |
| `src/components/validator/chat/ValidatorProcessingAnimation.tsx` | 4-phase animation | ~100 |
| `src/hooks/useValidatorPipeline.ts` | Pipeline hook | ~80 |
| `supabase/functions/validator-start/index.ts` | 7-agent pipeline | ~897 |
| `supabase/functions/validator-status/index.ts` | Progress polling | ~150 |
| `src/pages/ValidatorProgress.tsx` | Real-time tracker | ~250 |
| `src/pages/ValidatorReport.tsx` | Report viewer + trace | ~400 |
| `src/components/validator/ValidatorLayout.tsx` | 3-panel layout | ~200 |

### Supporting Files
| File | Purpose |
|------|---------|
| `src/contexts/CoachSyncContext.tsx` | Bidirectional sync |
| `src/components/validator/VerdictCard.tsx` | Score circle |
| `src/components/validator/EvidenceBlocks.tsx` | 8-dimension cards |
| `src/components/validator/TradeoffsCard.tsx` | Strengths/Concerns/Next |
| `src/hooks/useValidationReport.ts` | Dashboard report hook |
| `src/components/validation-report/ValidationReportViewer.tsx` | Full 14-section viewer |
| `src/components/validation-report/GenerationProgress.tsx` | 5-phase dashboard animation |

### Task Docs
| File | Purpose | Status |
|------|---------|--------|
| `tasks/prompts/validator/106-validation.md` | Core validation task (P0) | Not Started |
| `tasks/prompts/validator/106-1-prompt-validatorL.md` | Full design spec (6 agents, 5 tables, 6 functions) | Reference |
| `tasks/prompts/validator/109-share-links.md` | Share feature (P2) | Not Started |
| `tasks/prompts/validator/110-market-analysis.md` | Market deep-dive (P1) | Not Started |
| `tasks/prompts/validator/111-competitor-intel.md` | Competitor intel (P1) | Not Started |
| `tasks/prompts/validator/plan-mode.md` | Plan Mode philosophy | Strategy |
| `tasks/prompts/validator/201-validate.md` | IdeaProof competitor analysis | Reference |
| `tasks/prompts/validator/202-idea-market-research.md` | FashionOS case study | Example |
| `tasks/prompts/validator/203-saas.md` | SaaS validation framework | Framework |

### Research Links (Ready for RAG)
| File | Industry | Links | Score |
|------|----------|-------|-------|
| `research/links/07-industry-links-healthcare.md` | Healthcare | 10 | 94/100 |
| `research/links/06-industry-links-financial-services.md` | Financial Services | 10 | 91/100 |
| `research/links/09-industry-links-manufacturing.md` | Manufacturing | 10 | 88/100 |
| `research/links/15-industry-links-supply-chain-logistics.md` | Supply Chain | 10 | 86/100 |
| `research/links/02-industry-links-customer-support.md` | Customer Support | 10 | 85/100 |
| `research/links/100-research-list.md` | All (master list) | 289 | — |
