# Next Steps — Active Work Only

> **Updated:** 2026-03-18 | **Version:** 47.0
> **Implementation plan (sequential + verification):** [NEXT-STEPS-IMPLEMENTATION-PLAN.md](./NEXT-STEPS-IMPLEMENTATION-PLAN.md)
> **Rule:** Only in-progress, incomplete, and failing items. Priority order.
> **DB (live):** 94 tables | 549 indexes | 94/94 RLS | 119 triggers | 118 migrations
> **Validator:** E2E working. 76+ sessions. 39+ reports. V2/V3 report + multipage tabs + 10 BCG charts + 5 V3 components + 9 diagrams + Deep Dive tab + Strategy tab + dynamic suggestion chips + per-agent retry + sprint import + 10/10 agency badges + streaming chat + proactive AI panel. Realtime RT-AUDIT 10/10. Agency fragments 5/5. Chat modes 4/4.
> **RAG:** 3,748 chunks | 76 documents | 19 playbooks | `hybrid_search_knowledge` active everywhere | K4-K7 all ✅
> **Build:** pass (6.43s) | **TypeScript:** 0 errors | **Lint:** 340 problems | No chunk warnings
> **Tests:** 720/720
> **Frontend:** 47 pages | 458 components | 115 hooks | 32 edge functions | 14 shared modules
> **Phases complete:** Phase 1 (9/9) ✅ | Phase 2 (7/7) ✅ | Phase 3 (3/4) | Phase 5 (PROD-06 ✅) | RAG (K4-K7 ✅) | RT-AUDIT ✅ | Agency (12/12 ✅) | Overall ~93%
> **Overall system health:** 98% — Vercel production Ready

---

## Recently Completed (Sessions 22–47)

| Session | What Shipped |
|:-------:|-------------|
| 22 | Composer Group C fix, Competitor URL Context, Dynamic suggestion chips |
| 23 | Pipeline parallelization (300→140s), Agent runs tracking (V1-V3) |
| 24 | Selective agent retry (V4) — per-agent retry + cascade logic |
| 25 | Canvas Coach RAG (K3) — 4,251 knowledge chunks + citations |
| 26 | Strategy tab (POST-01) — Positioning, Build Focus, Fundability |
| 27 | Auth token race condition fix (getSession + 401 retry pattern) |
| 28 | Auth redirect fix, Chat phase state machine, ScoringAgent timeout 15→30s, Duplicate AI icon fix |
| 29 | Supabase: CRM FK conditional, drop 17 redundant service_role RLS, split FOR ALL |
| 30 | pg-vector skills (15 fixes), Supabase live verification (90 migrations, 37 EFs) |
| 31 | PROD-06 Lint cleanup: 990→340. 18 React hooks fixed. 3 new production prompts |
| 32 | R7 chunk split (593→391+201kB), K4 dedupe (4,130→3,746), POST-03 health scores |
| 33 | E2E audit: 8 fixes (C1-C3, H1-H3, M1-M2). knowledge-search 401, realtime warn |
| 34 | K6 validator direct RPC (no 401), K5 hybrid search in chat UI, citation fields |
| 35 | K6 deployed+verified: 5/5 proof tests, 10-consumer audit |
| 36 | K7: ai-chat hybrid search (rag.ts + search action), deployed 967KB |
| 37 | RT-AUDIT: 10-item Realtime overhaul (A1-A3, B1-B3, C1-C3 + shared broadcast). 3 EFs deployed |
| 38 | POST-02: Sprint Board ← report import. useSprintImport, source_action_id dedup |
| 39 | Agency fragments: Scoring + Composer wired (validator-start v70). Chat modes: 4 prompts wired (ai-chat v87). +64 tests |
| 40 | Report badges: ICEChannelChip + NarrativeArcSummary + all 6 badges wired (10/10). +21 tests |
| 41 | Streaming AI Chat: callGeminiChatStream SSE, backend+frontend wired (ai-chat v88). +20 tests |
| 42 | Agency fragments: Sprint + Pitch + Investor (5/5 complete). sprint v6, pitch v67, investor v45. +20 tests |
| 44 | Agency arc close: MEDDPICC schema+scorecard (007/008), Canvas specificity (011), Chat persistence (012). Agency 12/12 ✅. +25 tests |
| 45 | Skills audit + Expert prompt + Validator intelligence (3 fragments + 7 verifier rules). +149 tests |
| 46 | Report readability overhaul + Pipeline reliability (ScoringAgent 30→50s). VERIFIER_FRAGMENT |
| 47 | Proactive AI panel on report page — greeting + report-aware quick actions. +32 tests |

---

## 1. What's Next (Top 7)

> **Strategy:** Phase 1+2 complete. Agency 12/12 ✅. Proactive AI panel shipped. Now: feature quality (interview→report, research modes) + AI panel actions + testing + polish.

| # | Task | Effort | Impact | Why Now |
|:-:|------|:------:|:------:|---------|
| 1 | **22:** Interview context → Report pipeline | 2-3d | 🟢 High | Chat extracts rich data but Composer barely uses it |
| 2 | **POST-04:** Research + Planning agent modes | 2-3d | 🟢 High | Last Phase 3 item — gets Phase 3 to 4/4 ✅ |
| 3 | **AI panel action execution** | 1-2d | 🟢 High | Quick actions send prompts but should trigger navigation/mutations (e.g. "Generate Canvas" → actually generate) |
| 4 | **Dashboard proactive context** | 1d | 🟡 Medium | Same pattern as report: dashboard AI greets with health score + risks + daily focus |
| 5 | **PROD-07:** E2E tests (Playwright) | 3d | 🟢 High | 720 unit tests but 0 integration tests — risky for production |
| 6 | **13C/13D:** Data viz + Strategy layout polish | 2d | 🟡 Polish | Report sections look inconsistent |
| 7 | **3.1/3.2:** PDF export + Shareable links testing | 1.5d | 🟡 Polish | Test cross-browser before any public demo |

> **What these mean for the founder:**
> - **22:** You spend 10 minutes answering interview questions, but the final report barely references what you said. This threads your interview answers directly into the Composer so the report reflects your actual situation.
> - **POST-04:** The AI chat only answers questions. Research mode searches the web + knowledge base with citations. Planning mode creates structured action plans with timelines.
> - **AI panel actions:** When you click "Generate Lean Canvas" in the AI panel, it should navigate you to the canvas page and trigger generation — not just send a chat message.
> - **Dashboard proactive:** Like the report greeting, the dashboard AI should greet you with your health score, top risks, and daily priorities.
> - **PROD-07:** We have 720 unit tests but no browser-level tests that verify the full user journey (sign in → validate → report → canvas). Playwright gives us confidence nothing breaks end-to-end.
> - **13C/13D:** Some report sections look polished, others rough. Data viz polish adds hover states, citation popovers, and smooth transitions.
> - **3.1/3.2:** PDF export works in Chrome but hasn't been tested in Safari/Firefox/mobile. Shareable links need incognito verification + expiry testing.

---

## 2. Validator Pipeline Improvements

> V1-V4 complete ✅ (agent tracking, status API, frontend bars, selective retry). Agency fragments 5/5 ✅. Remaining: architecture upgrades.

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| V5 | Composer split to standalone EF | 🔴 | 0 | 3d | Own Deno Deploy isolate — removes cascade timeout |
| V6 | `validator-orchestrate` v3 cutover | 🔴 | 0 | 5d | DAG dispatch, per-agent retry, feature flag toggle |

> **What these mean for the founder:**
> - **V5:** The report-writing agent (Composer) currently runs inside the same server process as other agents. If it takes too long, it crashes the whole pipeline. Moving it to its own server prevents this domino effect.
> - **V6:** The big upgrade: replaces the "run agents one after another" approach with a smarter system that runs independent agents simultaneously, retries failures automatically, and can be toggled on/off safely.

---

## 3. Knowledge & RAG — ✅ Complete

> All K3-K7 tasks complete. No remaining work.

| # | Task | Status |
|---|------|:------:|
| K3 | Canvas Coach RAG | 🟢 Done ✅ |
| K4 | Content hash dedupe | 🟢 Done ✅ |
| K5 | Hybrid search function | 🟢 Done ✅ |
| K6 | Validator RAG direct RPC | 🟢 Done ✅ |
| K7 | ai-chat hybrid search | 🟢 Done ✅ |

---

## 4. Phase 3: POST-MVP — Enhanced Features

> POST-01 ✅, POST-02 ✅, POST-03 ✅. 1 remaining feature.

| ID | Feature | Status | Effort | Next Action |
|----|---------|:------:|:------:|-------------|
| POST-01 | Strategy tab | 🟢 Done | — | ✅ |
| POST-02 | Sprint Board ← report priority actions | 🟢 Done | — | ✅ |
| POST-03 | Dashboard health from validation scores | 🟢 Done | — | ✅ |
| POST-04 | Research + Planning agent modes in AI Panel | 🔴 | 2-3d | Extend `ai-chat` with `research` + `planning` actions |

---

## 5. Report V2 Design Polish

> Agency badges 10/10 complete ✅. Streaming chat ✅. Remaining: interactive polish.

| # | Task | Status | Effort | Next Action |
|---|------|:------:|:------:|-------------|
| 13A | Shared components + agency badges | 🟢 Done | — | ✅ 10/10 built (session 40) |
| 13C | Data viz polish (remaining) | 🟡 | 1d | Add citation popovers, hover states to existing viz |
| 13D | Strategy sections layout | 🟡 | 1d | Sections render — align layout to wireframe spec |

---

## 6. Export & Sharing

> Founders need to share their validation results with co-founders, mentors, and investors — as PDFs or shareable links.

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| 3.1 | PDF export cross-browser testing | 🟡 | 80 | 1d | Test Safari, Firefox, mobile. Fix layout issues |
| 3.2 | Shareable report links E2E test | 🟡 | 90 | 0.5d | Generate link → incognito → verify report → test expiry/revoke |

---

## 7. Agent Intelligence + UX

> A3 (Streaming) ✅. Remaining: extraction expansion, history, crash recovery, expert knowledge.

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| A1 | ExtractorAgent 10-criteria expansion | 🟡 | 50 | 2d | Add channels, revenue model, competitive moat fields |
| A3 | Streaming responses in AI Chat | 🟢 Done | 100 | — | ✅ SSE via Realtime, token_chunk + message_complete (session 41) |
| A4 | Validation history timeline | 🔴 | 0 | 2d | Build timeline view showing all validation runs |
| A5 | Progress persistence (resume interrupted) | 🔴 | 0 | 3d | Save and resume pipeline state from `validator_agent_runs` |
| A6 | Expert Knowledge System wiring | 🟡 | 10 | 3d | 19 playbooks seeded; wire `getIndustryContext` into 5 agents |

---

## 8. Agency Archive Tasks — ✅ Complete (12/12)

> All agency tasks complete. Prompt fragments 5/5. Chat modes 4/4. Report badges 10/10. MEDDPICC, specificity, persistence all done.

| # | Task | Source | Status |
|---|------|--------|:------:|
| 001-005 | Fragments + chat modes | agency | 🟢 Done ✅ |
| 007 | Investor MEDDPICC schema | agency | 🟢 Done ✅ (session 44) |
| 008 | Investor MEDDPICC wiring | agency | 🟢 Done ✅ (session 44) |
| 009 | Sprint fragment | agency | 🟢 Done ✅ |
| 010 | Pitch fragment | agency | 🟢 Done ✅ |
| 011 | Lean Canvas specificity | agency | 🟢 Done ✅ (session 44) |
| 012 | Chat session persistence | agency | 🟢 Done ✅ (session 44) |
| 039 | Investor fragment | agency | 🟢 Done ✅ |

---

## 9. Sprint Plan

> POST-02 wired report→sprint import. Remaining: full Kanban UI + AI generation.

| # | Feature | Status | % | Effort | Next Action |
|---|---------|:------:|:-:|:------:|-------------|
| M6 | Sprint Plan completion | 🔴 | 35 | M | Kanban board + `sprint-agent` (EXISTS) + AI generation + reviews |

---

## 10. Reliability & Hardening

| # | Task | Severity | Status | Effort | Next Action |
|---|------|:--------:|:------:|:------:|-------------|
| R4 | Pin dependency versions in edge functions | LOW | 🔴 | 1d | Pin `npm:@supabase/supabase-js@2` versions in import maps |
| R7 | Chunk size warning (pdf 593kB) | LOW | 🟢 Done | — | ✅ Split to jspdf (391kB) + html2canvas (201kB) |

### 10.1 Database / Supabase migrations

| # | Task | Status | Next Action |
|---|------|:------:|-------------|
| DB-1 | CRM FK + chat P0 conditional migrations | 🟢 Done | — |
| DB-2 | Drop redundant service_role RLS (17 policies) | 🟢 Done | — |
| DB-3 | Split FOR ALL → SELECT/INSERT/UPDATE/DELETE | 🟢 Done | — |
| DB-4 | Full migration chain on fresh reset | 🟡 Partial | `canvas_p0_cleanup` view dependency — fix if full reset required |
| DB-5 | Apply on remote: push new migrations | 🔴 | Run `supabase db push` after deploy |
| DB-6 | Split remaining FOR ALL policies | 🔴 | Use existing examples as reference |

---

## 11. Security

| # | Issue | Severity | Status | Next Action |
|---|-------|:--------:|:------:|-------------|
| S3 | Leaked password protection | LOW | 🟡 | **Requires Pro Plan** — enable when upgraded |
| S5 | pgvector in public schema | LOW | 🟡 | Accept risk — not relocatable. Document decision |
| S8 | No GDPR data export | MEDIUM | 🔴 | Phase 5 — build `data-export` edge function |

---

## 12. Architecture Audit P2 — Deferred (28 tasks)

> Lower-priority improvements addressed naturally as we build features in each area.

| Domain | Key P2 Items |
|--------|-------------|
| Auth | `last_active_at`, org-level settings |
| Core | Industry index, read replica |
| Validator | Data retention policy, V3 pipeline tracking |
| CRM | Agent consolidation, soft-delete, FTS on contacts |
| Canvas | Recreate customer discovery tables from scratch |
| Pitch | Cloudinary image storage, export tracking |
| Tasks | `sprint_id` FK, sprint board index, activity retention |
| Chat | `updated_at` on ai_runs, data retention, partitioning |
| Knowledge | Chunk growth monitoring, embedding upgrades, expires_at |
| Platform | Function consolidation, automation documentation |

---

## 13. Future Phases

### Phase 4: ADVANCED — Differentiation (15 days)

| ID | Feature | Status | Next Action |
|----|---------|:------:|-------------|
| ADV-01 | RAG planning agent (hybrid search + citations) | 🔴 | Planning mode in `ai-chat` calls `knowledge_search` |
| ADV-02 | Chat-driven canvas editing (diff preview) | 🔴 | Build diff preview UI, wire to `lean-canvas-agent` |
| ADV-03 | Chat-driven dashboard modifications | 🔴 | Migration `add_dashboard_prefs`, update `Dashboard.tsx` |
| ADV-04 | Financial agent (projections, scenarios) | 🔴 | New `financial-agent` edge function + `financial_models` table |

### Phase 5: PRODUCTION — Launch Ready (21 days)

| ID | Feature | Status | Next Action |
|----|---------|:------:|-------------|
| PROD-01 | Security hardening (leaked passwords — needs Pro Plan) | 🟡 | Upgrade plan, then enable |
| PROD-02 | Performance (lazy-load, React Query, indexes) | 🔴 | `React.lazy` for V3 pages, manualChunks split |
| PROD-03 | Monitoring (pipeline duration, cost dashboard) | 🔴 | Build Gemini cost tracking + error dashboard |
| PROD-04 | Mobile polish (AI Panel bottom sheet, responsive) | 🔴 | Rail hidden <1024px, AI Panel hidden <1280px |
| PROD-05 | GDPR compliance (data export, account deletion) | 🔴 | Build `data-export` EF, cascade deletion flow |
| PROD-06 | Lint cleanup (hooks bugs + TypeScript) | 🟢 ✅ | Done — 990→340, 18 hooks fixed, 30 files |
| PROD-07 | E2E tests (Playwright) | 🔴 | Set up Playwright + 5 critical flow suites |
| PROD-08 | Edge function cleanup | 🔴 | Remove 6 orphaned remote functions |

---

## Implementation Order

```
DONE (Session 44): ✅ Agency 12/12 complete (007/008/011/012)

NOW (Session 45):
              22 — Interview context → Report pipeline
              POST-04 — Research + Planning agent modes (Phase 3 → 4/4 ✅)

NEXT (Session 46):
              PROD-07 — E2E tests (Playwright setup + 5 critical flows)

POLISH:       13C, 13D — Data viz + Strategy layout
              3.1, 3.2 — PDF export + Shareable links
              A1 — ExtractorAgent expansion

LATER:        A4, A5, A6, M6 — Agent intelligence + Sprint board
              V5, V6 — Validator architecture upgrades

PHASE 4:      ADV-01 to ADV-04 — Differentiation features

PHASE 5:      PROD-01 to PROD-08 — Launch ready
```

---

## Quick Reference

| Metric | Value | Target |
|--------|-------|--------|
| Build time | 6.36s | <10s |
| Tests | 539/539 | 100% |
| TypeScript | 0 errors | 0 |
| Lint | 350 problems (down from 990) | <100 |
| Largest chunk | 391kB (jspdf) | <500kB ✅ |
| Security advisors | 1 WARN (needs Pro) | 0 |
| RLS coverage | 94/94 (100%) | 100% |
| Phase 1 | 9/9 ✅ | Done |
| Phase 2 | 7/7 ✅ | Done |
| Phase 3 | 3/4 (POST-01, POST-02, POST-03 ✅) | Next: POST-04 |
| RAG | K4-K7 ✅ | Done |
| Agency | 12/12 ✅ | Done |
| Overall | ~90% | 100% |
