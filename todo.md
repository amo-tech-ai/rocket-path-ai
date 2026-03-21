# StartupAI — Next Sessions

> **Updated:** 2026-03-20 | **Last session:** #50e (0.10.56, Mar 20)
> **Status:** 5,083 chunks | 19 playbooks in 5 EFs | RAG in 6 EFs | Lovable Gateway removed | 783/783 tests
> **New:** AI clients consolidated 3→1, scoring timeout fixed, canvas playbook, dead code removed

---

## Session 50 Arc (5 sub-sessions, Mar 19-20) — DONE

The biggest infrastructure upgrade since the validator pipeline. Audited 30 EFs, built RAG intelligence layer, fixed production bugs, consolidated AI clients.

| Session | What Shipped | Key Stats |
|:-------:|-------------|-----------|
| 50 | Edge function audit + Vector DB plan + Knowledge expansion | 3,973→4,858 chunks, 8 new industries |
| 50b | 19 playbooks + RAG in Composer + 5 bug fixes + ingest | +1,110 chunks, 19 playbooks seeded |
| 50c | RAG in Scoring + Playbooks in 4 EFs + deploy | 4 EFs wired, v79 deployed |
| 50d | Scoring timeout fix + Canvas playbook + dead code + rate limiting | 50→65s timeout, 521 lines deleted |
| 50e | **AI client consolidation 3→1** | Lovable Gateway removed, GenAI SDK removed |

**Cumulative:** 5,083 chunks | 19 playbooks in 5 EFs | RAG in 6 EFs | 6 bugs fixed | 521 lines dead code removed | 17 EF deploys | 37 prompts archived

---

## Suggested Next Steps

| Priority | What | Effort | Why Now |
|:--------:|------|:------:|---------|
| **1** | **Run test validation (V10)** | 15 min | You need to log in and validate an idea to confirm RAG citations appear |
| **2** | **Add startup access check to 5 EFs (V09)** | 1 hr | Security: any user can read any startup's AI data |
| **3** | **Fix `errors.ts` static CORS** | 30 min | Every error response sends wrong origin header |
| **4** | **Migrate ai-chat/coach off Lovable Gateway** | 2 hrs | Last Lovable reference in codebase |
| **5** | **E2E tests (Playwright)** | 3d | 783 unit tests, 0 browser tests — riskiest gap |
| **6** | **Ingest P2 PDFs via LlamaCloud** | 2 hrs | HubSpot, Hootsuite, WEF — ~1,150 more chunks |
| **7** | **PDF export cross-browser** | 1d | Only tested in Chrome |
| **8** | **CI/CD pipeline** | — | Automated deploy on merge |

> **What's different now vs Session 49:**
> - Reports cite real benchmarks from Deloitte, BCG, PwC (RAG + playbooks)
> - Every industry has calibrated scoring thresholds (19 playbooks)
> - All AI calls go through one tested client with retry + timeout (except coach)
> - 6 production bugs fixed (MEDDPICC saves, routes work, tables correct)
> - 521 lines of dead code removed

---

## Completed Sessions (39–50e)

| Session | What Shipped | Tests |
|:-------:|-------------|:-----:|
| 50e | AI client consolidation 3→1 (Lovable + SDK removed) | +0 |
| 50d | Scoring timeout fix + Canvas playbook + dead code cleanup | +0 |
| 50c | RAG in Scoring Agent + Playbooks in ai-chat, sprint-agent, investor-agent | +0 |
| 50b | 19 playbooks seeded + RAG in Composer + 5 bug fixes + 1,110 chunks ingested | +0 |
| 50 | Edge function audit (30 EFs) + Vector DB plan + Knowledge expansion | +0 |
| 49 | AI panel actions + Dashboard greeting + Research Google Search | +20 |
| 48 | Interview context → Composer + Research & Planning chat modes | +43 |
| 47 | Proactive AI panel on report page | +32 |
| 46 | Report readability + Pipeline reliability + VERIFIER_FRAGMENT | +0 |
| 45 | Skills audit + Expert prompt + Validator intelligence (3 fragments + 7 verifier rules) | +149 |
| 44 | Agency arc close: MEDDPICC + Canvas specificity + Chat persistence (12/12) | +25 |
| 43 | Sprint + Pitch + Investor fragments (5/5 complete) | +20 |
| 39 | Validator fragments (scoring + composer) + Chat modes (4) + Report badges (10/10) + Streaming chat | +125 |

---

## Full Progress Tracker (Verified 2026-03-20)

> 🟢 Complete | 🟡 In Progress | 🔴 Not Started | 🟥 Blocked

### Core Product Features

| Feature | Status | % | Confirmed | Missing/Failing | Next Action |
|---------|:------:|:-:|-----------|-----------------|-------------|
| Validator Pipeline (7 agents) | 🟢 | 98% | 76+ real runs, all agents deployed | E2E browser tests | Run manual validation test (V10) |
| Validator Report UI (V2/V3) | 🟢 | 97% | 10+ sections, 10 agency badges, dimension pages | Shareable link E2E test | Test incognito + expiry |
| Lean Canvas | 🟢 | 100% | Editor, coach, RAG, autosave, export | Playbook not wired | V07: Wire playbook (30 min) |
| AI Chat (6 modes) | 🟢 | 92% | Streaming, RAG, Google Search, playbooks | master-system-prompt.ts dead code | Delete superseded file |
| CRM & Contacts | 🟢 | 95% | CRUD, pipeline, AI enrichment, CSV import | Outreach sequences unclear | Verify wiring |
| Pitch Deck | 🟡 | 90% | Wizard, editor, image gen, export | Lovable Gateway dependency, PDF cross-browser | V08: Consolidate AI clients |
| Sprint Planning | 🟡 | 80% | Kanban, AI gen, playbook, import | PDCA editor missing | Build PDCA |
| Investor Pipeline | 🟢 | 90% | 12 actions, MEDDPICC fixed, playbook | — | — |
| Dashboard | 🟡 | 88% | Health score, metrics, risks, AI greeting | Command Centre redesign | Design new layout |
| Onboarding Wizard | 🟢 | 100% | 4 steps, URL enrichment, browser audit passed | — | — |
| Documents | 🟢 | 90% | CRUD, AI analysis, table fixes | Version diff UI, semantic search | Future |
| Events | 🟡 | 85% | Directory, wizard, AI panel | Attendee management UI | Future |
| Tasks | 🟢 | 90% | Kanban, AI suggestions, prioritization | — | — |

### AI & Intelligence Layer

| Feature | Status | % | Confirmed | Missing/Failing | Next Action |
|---------|:------:|:-:|-----------|-----------------|-------------|
| pgvector Knowledge Base | 🟢 | 97% | 5,083 chunks, HNSW, hybrid search | P2 PDFs not ingested | Ingest via LlamaCloud |
| Industry Playbooks (19) | 🟢 | 100% | All 19 seeded with benchmarks, risks, GTM | — | — |
| RAG in Validator (Research + Competitors) | 🟢 | 100% | Direct RPC, no 401 | — | — |
| RAG in Composer Group D | 🟢 | 100% | Citations injected | Needs manual test | V10: Run validation |
| RAG in Scoring Agent | 🟢 | 100% | 5 chunks + playbook benchmarks | Needs manual test | V10: Run validation |
| Playbooks in ai-chat | 🟢 | 100% | benchmarks + stage_checklists | — | — |
| Playbooks in sprint-agent | 🟢 | 100% | stage_checklists + gtm_patterns | — | — |
| Playbooks in investor-agent | 🟢 | 100% | investor_expectations + benchmarks | — | — |
| Playbooks in lean-canvas-agent | 🔴 | 0% | Not wired | Last core EF without playbook | V07 (30 min) |
| `_shared/rag-context.ts` helper | 🟢 | 100% | 190 lines, timeout + fallback | — | — |
| Agency Fragments (9) | 🟢 | 100% | All wired into target agents | — | — |
| Expert System Prompt | 🟢 | 100% | 200+ lines, 8 frameworks, 4 stage overlays | — | — |
| Gemini Embedding 2 switch | 🔴 | 0% | Not started | Wait for GA | Future |

### Edge Functions & Infrastructure

| Feature | Status | % | Confirmed | Missing/Failing | Next Action |
|---------|:------:|:-:|-----------|-----------------|-------------|
| 30 Edge Functions deployed | 🟢 | 100% | All ACTIVE in Supabase | — | — |
| `_shared/` layer (18 files) | 🟢 | 88% | gemini.ts, cors.ts, rate-limit.ts, rag-context.ts | errors.ts static CORS | Fix to dynamic |
| 3 AI clients → 1 consolidation | 🔴 | 0% | Not started | Lovable + SDK still active | V08 (4 hrs) |
| Startup access check (5 EFs) | 🔴 | 0% | Not started | Cross-tenant leakage possible | V09 (1 hr) |
| req.json() try/catch | 🟢 | 100% | Added to 6 functions | — | — |
| Bug fixes (5 from audit) | 🟢 | 100% | MEDDPICC, tables, routes all fixed | — | — |
| Rate limiting | 🟡 | 97% | All EFs except workflow-trigger | workflow-trigger missing | Add (15 min) |

### Database & Security

| Feature | Status | % | Confirmed | Missing/Failing | Next Action |
|---------|:------:|:-:|-----------|-----------------|-------------|
| 94 tables with RLS | 🟢 | 100% | All tables have RLS policies | — | — |
| 549 indexes | 🟢 | 100% | HNSW, GIN, btree, unique | — | — |
| JWT verification | 🟢 | 100% | All EFs verify | — | — |
| auth.uid() caching | 🟢 | 100% | `(SELECT auth.uid())` pattern | — | — |
| Soft delete (6 tables) | 🟢 | 100% | deleted_at + partial indexes | — | — |
| CI/CD pipeline | 🔴 | 0% | Not implemented | No automated deploy | Future |
| Load testing | 🔴 | 0% | Not done | No performance baseline | Future |

### Production Readiness

| Feature | Status | % | Confirmed | Missing/Failing | Next Action |
|---------|:------:|:-:|-----------|-----------------|-------------|
| TypeScript | 🟢 | 100% | 0 errors | — | — |
| Build | 🟢 | 100% | 7.07s, clean | — | — |
| Unit tests | 🟢 | 100% | 783/783 pass | — | — |
| E2E tests (Playwright) | 🔴 | 0% | 0 browser tests | Riskiest gap | PROD-07 (3 days) |
| Lint | 🟡 | 65% | 340 errors (down from 990) | 340 remaining | Continue cleanup |
| PDF export cross-browser | 🔴 | 0% | Chrome only | Safari/Firefox/mobile untested | Test before demo |
| GDPR data export | 🔴 | 0% | Not built | `data-export` EF needed | PROD-05 |
| Monitoring & alerting | 🔴 | 0% | No dashboards | No error tracking | Future |

### Remaining Task Prompts (26 active)

| Category | Prompts | Priority Items |
|----------|:-------:|----------------|
| vector/ | 4 | V07 (canvas playbook), V08 (consolidate clients), V09 (access check), V10 (manual test) |
| mvp/ | 6 | Canvas P0, knowledge P0, platform P0, dimension pages, report AI panel, lean canvas page |
| production/ | 6 | Security, performance, monitoring, mobile, GDPR, E2E tests |
| advanced/ | 4 | RAG planning agent, chat-driven canvas/dashboard, financial agent |
| core/ | 1 | Remove M1-M5 screens |
| post-mvp/ | 1 | Unlock report tabs |
| data/ | 1 | Enable password protection (pending manual) |

---

## Later

| Task | Source | Effort | What |
|------|--------|--------|------|
| Consolidate AI clients (3→1) | V08 | 4 hrs | Remove Lovable gateway + SDK client |
| Add startup access check (5 EFs) | V09 | 1 hr | Cross-tenant data leakage fix |
| Create `_shared/anthropic.ts` | Audit | 1 hr | Shared Claude client |
| Merge insights-generator + weekly-review | Audit | 2 hrs | Overlapping functions |
| Merge health-scorer + action-recommender | Audit | 2 hrs | Health feeds into actions |
| Ingest P2 PDFs via LlamaCloud | Vector plan | 2 hrs | ~1,150 new chunks |
| Switch to Gemini Embedding 2 | Vector plan | 3 hrs | When GA |
| Composer standalone EF | V5 | 3d | Removes cascade timeout |
| Validator orchestrator v3 | V6 | 5d | DAG dispatch + feature flags |
| Delete master-system-prompt.ts | Audit | 15 min | Dead code |
| Create experiment-agent | Audit | 2 hrs | Missing from disk |
| Edge function cleanup | PROD-08 | 1d | Remove orphaned remote functions |
| GDPR data export | PROD-05 | 2d | `data-export` EF |
| CI/CD pipeline | PROD | — | Automated deploy on merge |
