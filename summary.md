# StartupAI — Product Summary

**Last updated:** 2026-03-21 | **Build:** PASS | **Tests:** 783/783 | **TypeScript:** 0 errors | **Deploy:** Production

---

## Current State — Where We Are Right Now

StartupAI is **~93% complete**. The core product works end-to-end: a founder types an idea, 7 AI agents validate it, and they get a professional report in 2 minutes. All major features are built and deployed.

### What's Working

- **Validator Pipeline** — 7 AI agents, 76+ validation runs, reports scoring 62-78/100
- **AI Chat** — 6 modes (general, research, planning, pitch practice, growth, deal review) with streaming
- **Knowledge Base** — 5,083 industry data chunks + 19 playbooks powering all AI responses
- **Lean Canvas** — Auto-generates from report, AI coaching with RAG citations
- **CRM + Investor Pipeline** — Contact tracking, deal scoring (MEDDPICC /40), 12 AI actions
- **Pitch Deck** — AI-generated investor decks with image generation and PDF export
- **Dashboard** — Health score, risks, daily priorities with proactive AI greeting
- **Onboarding** — 4-step wizard with URL extraction and AI enrichment
- **783 tests passing**, 0 TypeScript errors, all 32 edge functions deployed

### What's NOT Done Yet (Gaps Before Launch)

| # | Gap | Risk Level | Effort | Plain English |
|---|-----|:----------:|:------:|---------------|
| 1 | **No browser tests** | HIGH | 3 days | We test individual pieces but never test the full user journey in a real browser. If something breaks between sign-in and report, we won't know until a user hits it. |
| 2 | **Security: cross-tenant data** | HIGH | 1 hour | 5 edge functions don't check if the user owns the startup they're asking about. Any logged-in user could potentially read another user's AI data. |
| 3 | **PDF only works in Chrome** | MEDIUM | 1 day | Report export hasn't been tested in Safari, Firefox, or mobile browsers. Could break in a demo. |
| 4 | **No error monitoring** | MEDIUM | — | If something breaks in production, nobody gets alerted. We find out when users complain. |
| 5 | **No CI/CD pipeline** | MEDIUM | — | Every deploy is manual. No automated checks on merge. |
| 6 | **340 lint warnings** | LOW | — | Code quality warnings. None cause runtime bugs, but signal technical debt. |
| 7 | **GDPR data export** | LOW | 2 days | No way for users to download or delete their data. Required before EU launch. |

### Next Steps (Recommended Order)

| Step | What To Do | Time | Why This Order |
|:----:|-----------|:----:|----------------|
| **1** | Run a manual validation test | 15 min | Confirm the RAG + playbook upgrades from last week actually show up in reports. Quick smoke test. |
| **2** | Fix startup access check (5 EFs) | 1 hr | Close the security hole where users can read other users' data. Small fix, high impact. |
| **3** | Fix `errors.ts` static CORS | 30 min | Error responses send the wrong domain header. Quick fix. |
| **4** | Set up Playwright E2E tests | 3 days | Add browser-level tests for the 5 critical user journeys. This is the biggest gap before any public demo. |
| **5** | Test PDF export cross-browser | 1 day | Try Safari, Firefox, mobile. Fix layout issues before showing to anyone. |
| **6** | Set up error monitoring | 1-2 days | Add Sentry or similar so you know when things break before users tell you. |

---

## What We're Building

StartupAI is an **AI-powered operating system for startup founders**. A founder types their startup idea, and within 2 minutes, 7 AI agents research the market, score the idea, and deliver a clear GO or NO-GO report. From there, the platform auto-generates a lean canvas, pitch deck, CRM, and sprint board — all from one conversation.

### What Shipped Recently (Sessions 47-50e)

| Feature | What It Does | Why It Matters |
|---------|-------------|----------------|
| **AI client consolidation (3→1)** | All AI calls now go through one shared Gemini client with retry + timeout | Removed Lovable Gateway and Google SDK dependencies — simpler, more reliable |
| **RAG in 6 edge functions** | Reports and chat now cite real benchmarks from Deloitte, BCG, PwC | AI answers backed by actual industry data, not just guesses |
| **19 industry playbooks** | SaaS, fintech, healthcare, etc. — each with benchmarks, risks, investor expectations | Every industry gets calibrated scoring thresholds |
| **Proactive AI panel** | Report page: AI greets with score + strengths + actions. Dashboard: health + risks + focus | AI panel was idle — now it's the main tool for next steps |
| **Interview → Report pipeline** | Your interview answers flow into all 4 report writing groups | Report reflects what the founder actually said |
| **Research + Planning chat modes** | Research: web search + citations. Planning: RICE-scored action plans | Chat actively researches and plans, not just answers questions |
| **5 production bug fixes** | MEDDPICC saves, correct routes, correct table names | Data was silently not saving in several places |

### What's After the Next Steps

| Phase | What | When |
|-------|------|------|
| **Polish** | Report hover states, citation popovers, data viz consistency | After E2E tests |
| **Sharing** | Shareable report links with expiry + PDF cross-browser | Before any public demo |
| **Advanced** | Financial agent, chat-driven canvas editing, RAG planning agent | After launch |
| **Production** | Mobile polish, GDPR compliance, performance optimization | Before scaling |

---

## How It Works (User Flow)

```
Homepage → Type idea → Sign up (Google/LinkedIn)
  → AI asks 8-14 follow-up questions (problem, customer, revenue, competitors...)
  → 7 AI agents research your market (60-120 seconds)
  → 14-section report with GO/CAUTION/NO-GO verdict (score 0-100)
  → AI panel greets you: "Your report is ready! Score: 72/100 — GO"
  → Quick actions: Generate Canvas, Create Pitch Deck, Plan Sprint
  → Dashboard shows health score, risks, daily priorities
```

**One sentence:** Idea to validated strategy in 30 minutes, not 30 days.

---

## Codebase Stats

| Metric | Count |
|--------|-------|
| Pages | 47 |
| Components | 460+ |
| Hooks | 115 |
| Edge Functions | 32 (deployed) |
| Database Tables | 94 |
| Tests | 783 (48 files) |
| Chat Modes | 7 (General, Research, Planning, Practice Pitch, Growth, Deal Review, Canvas Coach) |
| Validator Runs | 76+ sessions, 39+ reports |
| Knowledge Chunks | 5,083 (19 industry playbooks) |
| Agency Fragments | 9 (wired into 5 validator agents + 3 edge functions) |
| AI Clients | 1 (consolidated from 3 — Lovable Gateway + Google SDK removed) |

---

## Features — What Each One Does

### 1. Validator Pipeline (95%) — The Core Product

7 AI agents validate your startup idea end-to-end.

| Agent | Job | Time |
|-------|-----|------|
| Extractor | Pulls structured data from your pitch text + interview answers | ~10s |
| Research | Market sizing with Google Search + RAG knowledge base | ~30s |
| Competitors | Finds and analyzes competitors with web search | ~25s |
| Scoring | Scores across 7 dimensions (problem, market, team, etc.) | ~50s |
| MVP | Creates practical build plan from weak spots | ~15s |
| Composer | Writes 14-section report using founder's interview data | ~90s |
| Verifier | Checks report completeness + cross-section consistency | <1s |

**Output:** 14-section report with score (0-100), GO/CAUTION/NO-GO verdict, risk heatmap, competitor matrix, revenue projections, and next steps timeline.

**Interview data now flows to all 4 Composer groups (Task 22):**
- Group A (Problem & Customer): founder's problem, customer, solution, differentiation
- Group B (Market & Risk): competitors, industry, business model, risk awareness + discovered entities
- Group C (Execution & Economics): revenue model, execution plan, AI strategy
- Group D (Executive Summary): investor readiness, risk awareness, calibrated language

### 2. Onboarding Wizard (100%)

4-step guided setup: URL extraction → AI analysis → Smart interview → Readiness score.

### 3. Lean Canvas (100%)

Interactive 9-box canvas with AI coaching, RAG-backed suggestions, specificity checker, auto-prefill from report.

### 4. CRM & Investor Pipeline (95%)

Contact management, deal pipeline, MEDDPICC scoring (/40), 12-action investor agent, CSV import.

### 5. Pitch Deck (95%)

AI generates investor decks with Challenger Narrative framework, image generation, PDF/PPTX export.

### 6. Dashboard (85%)

Health score, journey stepper, top risks, daily focus. **Now with proactive AI greeting.**

### 7. AI Chat (85%) — 6 Modes

| Mode | What It Does |
|------|-------------|
| **General** | Context-aware startup advisor with expert knowledge |
| **Research** | Web search + RAG + numbered citations (NEW) |
| **Planning** | RICE-scored action plans with kill criteria (NEW) |
| **Practice Pitch** | AI plays investor, scores your pitch 5 dimensions |
| **Growth Strategy** | AARRR funnel analysis, ICE-scored experiments |
| **Deal Review** | MEDDPICC pipeline inspection, red flag detection |
| **Canvas Coach** | Box-by-box quality coaching with evidence gaps |

### 8. Tasks & Sprint Planning (90% / 60%)

Kanban board, AI-generated tasks, report → sprint import, RICE prioritization.

### 9. Proactive AI Panel (NEW)

| Page | What the AI Panel Shows |
|------|------------------------|
| **Report overview** | Score + verdict + strengths + weak areas + 5 quick actions |
| **Report dimension** | Dimension-specific: explain score, how to improve, benchmarks |
| **Dashboard** | Health score + trend + top risks + daily focus |
| **Other pages** | General quick actions: startup status, prioritize tasks, next steps |

Quick actions with `route` field navigate directly (Canvas, Pitch Deck, Sprint) instead of sending chat.

### 10-12. Documents (90%), Events (85%), Streaming/Realtime (complete)

Document AI, event management, token-by-token streaming, presence, live updates.

---

## Architecture

```
Browser (React 18 + Vite 5 + TypeScript + Tailwind + shadcn/ui)
  → Supabase Client (auth, queries, realtime)
  → 32 Edge Functions (Deno)
    → _shared/gemini.ts (single AI client with retry + timeout + JSON fallback)
    → Gemini 3 (fast: extraction, chat, validation, research w/ Google Search)
    → Claude 4.6 (reasoning: CRM, investors, strategy)
    → OpenAI Embeddings (RAG vector search)
  → PostgreSQL (94 tables, RLS on all)
  → pgvector (5,083 chunks, HNSW index, hybrid search)
  → 19 Industry Playbooks (benchmarks, risks, GTM, investor expectations)
  → Supabase Realtime (streaming, presence, typing indicators)
```

**Key rule:** AI proposes → Human approves → System executes. AI never writes to DB without user confirmation.

---

## Test Health

```
48 test files | 783 tests | 0 failures
TypeScript: 0 errors | Build: ~7s | Lint: 340 warnings
```

Last 5 validator E2E runs: Restaurant (72), InboxPilot (68), Travel AI (62), ipix (78), FashionOS (78)

**Gap:** All 783 tests are unit/integration tests. Zero browser-level (Playwright) tests exist. This means we verify individual functions work, but never verify the full user journey (sign in → validate → see report → generate canvas) works in a real browser.

---

## Recent Session History (39-50e)

| Session | What Shipped | Tests |
|:-------:|-------------|:-----:|
| 39 | Agency fragments (scoring + composer) + 4 chat modes + 6 report badges + streaming chat | +125 |
| 43 | Sprint + Pitch + Investor fragments (5/5 complete) | +20 |
| 44 | MEDDPICC scorecard + Canvas specificity + Chat persistence (agency 12/12) | +25 |
| 45 | Skills audit + Expert prompt + Validator intelligence (3 fragments + 7 verifier rules) | +149 |
| 46 | Report readability overhaul + Pipeline reliability (ScoringAgent timeout fix) | — |
| 47 | Proactive AI panel on report page (greeting + quick actions) | +32 |
| 48 | Interview context → all 4 Composer groups + Research & Planning chat modes | +43 |
| 49 | AI panel action navigation + Dashboard greeting + Google Search grounding | +20 |
| 50 | Edge function audit (30 EFs) + Vector DB intelligence plan + Knowledge expansion (3,973→4,858 chunks) | — |
| 50b | 19 playbooks seeded + RAG in Composer + 5 production bug fixes + 1,110 chunks ingested | — |
| 50c | RAG in Scoring Agent + Playbooks in ai-chat, sprint-agent, investor-agent, lean-canvas-agent | — |
| 50d | Scoring timeout fix (50→65s) + Canvas playbook + Dead code cleanup (521 lines) + Rate limiting | — |
| 50e | **AI client consolidation 3→1** — Lovable Gateway removed, Google GenAI SDK removed | — |

---

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm test             # Run all 783 tests
```

**Auth:** Google OAuth, LinkedIn OIDC
**Edge function deploy:** `npx supabase functions deploy <name> --project-ref yvyesmiczbjqwbqtlidy --no-verify-jwt`
