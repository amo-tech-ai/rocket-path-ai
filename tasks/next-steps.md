# Next Steps — Active Work Only

> **Updated:** 2026-03-08 | **Version:** 38.0
> **Rule:** Only in-progress, incomplete, and failing items. Priority order.
> **DB (live):** 94 tables | 549 indexes | 94/94 RLS | 119 triggers | 117 migrations (incl. K4 chunks dedupe)
> **Validator:** E2E working. 76+ sessions. 39+ reports. V2/V3 report + multipage tabs + 10 BCG charts + 5 V3 components + 9 diagrams + Deep Dive tab + Strategy tab + dynamic suggestion chips + per-agent retry. Realtime RT-1–RT-8. 389/389 tests.
> **RAG:** 3,746 chunks | 74 documents | 19 playbooks | `search_knowledge` function active | K4 dedupe ✅
> **Build:** pass (7.86s) | **TypeScript:** 0 errors | **Lint:** 340 problems | No chunk warnings
> **Frontend:** 47 pages | 458 components | 113 hooks | 32 edge functions | 14 shared modules
> **Phases complete:** Phase 1 (9/9) ✅ | Phase 2 (7/7) ✅ | Phase 3 (2/4) | Phase 5 (PROD-06 ✅) | Overall ~80%
> **Overall system health:** 98% — Vercel production Ready

---

## Recently Completed (Sessions 22–31)

| Session | What Shipped |
|:-------:|-------------|
| 22 | Composer Group C fix, Competitor URL Context, Dynamic suggestion chips |
| 23 | Pipeline parallelization (300→140s), Agent runs tracking (V1-V3) |
| 24 | Selective agent retry (V4) — per-agent retry + cascade logic |
| 25 | Canvas Coach RAG (K3) — 4,251 knowledge chunks + citations |
| 26 | Strategy tab (POST-01) — Positioning, Build Focus, Fundability |
| 27 | Auth token race condition fix (getSession + 401 retry pattern) |
| 28 | Auth redirect fix, Chat phase state machine + request identity, ScoringAgent timeout 15→30s, Duplicate AI icon fix. 389/389 tests. Full E2E verified. |
| 29 | Supabase: CRM FK conditional (db reset/shadow safe), drop 17 redundant service_role RLS, split industry_questions FOR ALL (example), chat P0 idempotent. Verified per `.cursor/rules/supabase`. |
| 30 | pg-vector skills (15 issue fixes), Supabase live verification (90 migrations, 37 EFs, 56 tables) |
| 31 | PROD-06 Lint cleanup: 990→340 errors. Fixed 18 React hooks violations, case declarations, escape chars, require imports. 3 new production prompts. |
| 32 | R7 chunk split (593→391+201kB), K4 chunk dedupe (4,130→3,746), POST-03 health from validator scores. |

---

## 1. What's Next (Top 5)

> **Strategy:** Phase 1+2 complete. Now: Phase 3 features + RAG improvements.

| # | Task | Effort | Impact | Why Now |
|:-:|------|:------:|:------:|---------|
| 1 | **POST-02:** Sprint Board ← report priority actions | 2-3d | 🟢 High | Report says "fix your pricing" but actions just sit there — this makes them trackable |
| 2 | **K5:** Hybrid search function | 2-3d | 🟡 RAG | Only semantic search exists — adding keyword matching makes RAG much more accurate |
| 3 | **13A:** Report shared components (6 remaining) | 2d | 🟡 Polish | 4/10 built — some report sections look polished, others look rough |
| 4 | **A3:** Streaming AI Chat responses | 2d | 🟡 UX | Chat dumps full response at once — streaming makes it feel responsive |
| 5 | **22:** Interview context → Report pipeline | 2-3d | 🟢 High | Chat extracts rich data but Composer barely uses it — report feels disconnected from interview |
| 6 | **POST-04:** Research + Planning agent modes | 2-3d | 🟡 Feature | AI chat panel only answers questions — needs Research + Planning modes |

> **What these mean for the founder:**
> - **POST-02:** The validation report tells you "fix your pricing model" and "talk to 10 customers" — but today those suggestions just sit there. This creates a Kanban sprint board (To Do → In Progress → Done) and auto-imports those action items so you can track them.
> - **K5:** When you or the AI search the knowledge base, it currently only understands meaning (semantic search). Adding keyword matching too and combining both results makes search much more accurate — especially for specific terms like company names or industry jargon.
> - **POST-03:** Your main dashboard shows a "startup health" score, but it's disconnected from your actual validation results. This plugs in your real validation scores so the dashboard reflects reality.
> - **13A:** Reusable UI building blocks (section wrappers, insight cards, score badges) that make every report section look consistent. 6 of 10 are missing.
> - **A3:** Right now the AI chat shows a loading spinner then dumps the full response at once. This makes text stream in word-by-word (like ChatGPT) so you see the answer forming in real time.

---

## 2. Validator Pipeline Improvements

> V1-V4 complete ✅ (agent tracking, status API, frontend bars, selective retry). Remaining: architecture upgrades.

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| V5 | Composer split to standalone EF | 🔴 | 0 | 3d | Own Deno Deploy isolate — removes cascade timeout |
| V6 | `validator-orchestrate` v3 cutover | 🔴 | 0 | 5d | DAG dispatch, per-agent retry, feature flag toggle |

> **What these mean for the founder:**
> - **V5:** The report-writing agent (Composer) currently runs inside the same server process as other agents. If it takes too long, it crashes the whole pipeline. Moving it to its own server prevents this domino effect.
> - **V6:** The big upgrade: replaces the "run agents one after another" approach with a smarter system that runs independent agents simultaneously, retries failures automatically, and can be toggled on/off safely.

---

## 3. Knowledge & RAG

> K3 (Canvas Coach RAG) complete ✅. Remaining: dedupe + hybrid search.

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| K4 | Content hash dedupe | 🟢 Done | 100 | — | ✅ Unique index + CHECK constraint + 384 rows cleaned |
| K5 | Hybrid search function | 🔴 | 0 | 2-3d | Build `hybrid_search_knowledge` (keyword + semantic + RRF) |

> **What these mean for the founder:**
> - **K4:** If someone uploads the same document twice, we currently store duplicate chunks wasting space and cluttering search results. This adds a fingerprint check so identical content is stored only once.
> - **K5:** Think of it like Google: right now search only understands meaning ("companies like Uber" finds ride-sharing). This adds exact keyword matching too ("Uber" finds "Uber"), then intelligently combines both for much better results.

---

## 4. Phase 3: POST-MVP — Enhanced Features (15 days)

> POST-01 (Strategy tab) ✅, POST-03 (Health scores) ✅. 2 remaining features.

| ID | Feature | Status | Effort | Next Action |
|----|---------|:------:|:------:|-------------|
| POST-02 | Sprint Board ← report priority actions | 🔴 | 2-3d | Add `import_from_report` to `task-agent` |
| POST-03 | Dashboard health from validation scores | 🟢 Done | — | ✅ health-scorer reads scores_matrix, falls back to canvas |
| POST-04 | Research + Planning agent modes in AI Panel | 🔴 | 2-3d | Extend `ai-chat` with `research` + `planning` actions |

> **What these mean for the founder:**
> - **POST-02:** The validation report tells you "fix your pricing model" and "talk to 10 customers" — but today those suggestions just sit there. This creates a Kanban sprint board and auto-imports those action items so you can track them.
> - **POST-03:** Your main dashboard shows a "startup health" score, but it's disconnected from your actual validation results. This plugs in your real validation scores so the dashboard reflects reality.
> - **POST-04:** The AI chat panel currently only answers questions. This adds two new modes: "Research" (searches the web + knowledge base and cites sources) and "Planning" (helps create structured action plans and roadmaps with timelines).

---

## 5. Report V2 Design Polish

> The validation report renders all data correctly, but the visual design needs polish to match the wireframes — consistent components, interactive charts, and proper layout.

| # | Task | Status | Effort | Next Action |
|---|------|:------:|:------:|-------------|
| 13A | Shared components (SectionShell, InsightCard etc.) | 🟡 | 2d | 4/10 built, 6 missing per wireframe spec |
| 13C | Data viz polish (remaining) | 🟡 | 1d | Add citation popovers, hover states to existing viz |
| 13D | Strategy sections layout | 🟡 | 1d | Sections render — align layout to wireframe spec |

> **What these mean for the founder:**
> - **13A:** Reusable UI building blocks (section wrappers, insight cards, score badges, metric displays) that make every report section look consistent. 6 of 10 are missing — so some sections look polished while others look rough.
> - **13C:** The charts and graphs show the right data but feel static. This adds hover effects (highlight a bar to see details), citation popovers (click a data point to see where that number came from), and smooth transitions.
> - **13D:** The strategy sections (like Go-To-Market and Competitive Positioning) display correctly but the spacing, columns, and visual hierarchy don't match the design mockups. This aligns them to look professional.

---

## 6. Export & Sharing

> Founders need to share their validation results with co-founders, mentors, and investors — as PDFs or shareable links.

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| 3.1 | PDF export cross-browser testing | 🟡 | 80 | 1d | Test Safari, Firefox, mobile. Fix layout issues |
| 3.2 | Shareable report links E2E test | 🟡 | 90 | 0.5d | Generate link → incognito → verify report → test expiry/revoke |

> **What these mean for the founder:**
> - **3.1:** You can download your validation report as a PDF to send to investors — but it's only been tested in Chrome. This tests Safari, Firefox, and mobile browsers to find and fix issues like cut-off charts, broken page breaks, or missing fonts.
> - **3.2:** You can generate a shareable link so your mentor or investor can view the report without logging in. This tests the full flow: generate link → open in a private browser → verify the report loads correctly → confirm that expired and revoked links are properly blocked.

---

## 7. Agent Intelligence + UX

> Making the AI agents smarter (extract more data, use industry knowledge) and the user experience smoother (streaming text, history, crash recovery).

| # | Task | Status | % | Effort | Next Action |
|---|------|:------:|:-:|:------:|-------------|
| A1 | ExtractorAgent 10-criteria expansion | 🟡 | 50 | 2d | Add channels, revenue model, competitive moat fields |
| A3 | Streaming responses in AI Chat | 🟡 | 50 | 2d | SSE streaming in `ai-chat` edge function |
| A4 | Validation history timeline | 🔴 | 0 | 2d | Build timeline view showing all validation runs |
| A5 | Progress persistence (resume interrupted) | 🔴 | 0 | 3d | Save and resume pipeline state from `validator_agent_runs` |
| A6 | Expert Knowledge System wiring | 🟡 | 10 | 3d | 19 playbooks seeded; wire `getIndustryContext` into 5 agents |

> **What these mean for the founder:**
> - **A1:** The AI currently extracts ~6 data points from your chat (problem, customer, solution, etc.). This adds 4 more: marketing channels, revenue model, competitive moat, and pricing strategy — making your validation more thorough and your report richer.
> - **A3:** Right now the AI chat shows a loading spinner then dumps the full response at once. This makes text stream in word-by-word (like ChatGPT) so you see the answer forming in real time instead of staring at a spinner.
> - **A4:** If you validate your idea 3 times as it evolves, there's no way to see how your scores changed. This builds a visual timeline showing all past validation runs with score trends — so you can see if you're improving.
> - **A5:** If your browser crashes or you close the tab during the 5-minute validation pipeline, you lose everything and have to start over. This saves progress to the database so you can reopen the app and resume exactly where it left off.
> - **A6:** We've loaded 19 industry playbooks into the knowledge base (SaaS metrics, marketplace dynamics, fintech regulations, etc.) but the validation agents don't use them yet. This wires 5 agents to pull industry-specific benchmarks during analysis — so a fintech startup gets judged by fintech standards, not generic ones.

---

## 8. Sprint Plan

> A project management feature: after validation tells you what to work on, the Sprint Plan helps you organize and execute those tasks.

| # | Feature | Status | % | Effort | Next Action |
|---|---------|:------:|:-:|:------:|-------------|
| M6 | Sprint Plan completion | 🔴 | 35 | M | Kanban board + `sprint-agent` (EXISTS) + AI generation + reviews |

> **What this means for the founder:**
> - **M6:** A full Kanban board (To Do / In Progress / Done columns) where an AI agent auto-generates sprint tasks from your validation results, you drag cards between columns as you work, and you can review/approve AI suggestions before adding them to your board. Currently 35% built — the backend exists but the board UI and AI generation are incomplete.

---

## 9. Reliability & Hardening

> Behind-the-scenes improvements that prevent unexpected breakages and keep the app loading fast.

| # | Task | Severity | Status | Effort | Next Action |
|---|------|:--------:|:------:|:------:|-------------|
| R4 | Pin dependency versions in edge functions | LOW | 🔴 | 1d | Pin `npm:@supabase/supabase-js@2` versions in import maps |
| R7 | Chunk size warning (pdf 593kB) | LOW | 🟢 Done | — | ✅ Split to jspdf (391kB) + html2canvas (201kB) |

### 9.1 Database / Supabase migrations (Session 29)

| # | Task | Status | Next Action |
|---|------|:------:|-------------|
| DB-1 | CRM FK + chat P0 conditional migrations | 🟢 Done | — |
| DB-2 | Drop redundant service_role RLS (17 policies) | 🟢 Done | — |
| DB-3 | Split FOR ALL → SELECT/INSERT/UPDATE/DELETE (industry_questions example) | 🟢 Done | — |
| DB-4 | **Verify:** Full migration chain on fresh reset | 🟡 Partial | `supabase db reset` passes through 20260307100001; fails in `20260227110400_canvas_p0_cleanup` (view `assumption_evidence` depends on `interview_insights`) — fix that migration if full reset required |
| DB-5 | **Apply on remote:** Push new migrations so `db pull` is in sync | 🔴 | Run `supabase db push` (or mark 20260307100000, 20260307100001 applied) after deploy |
| DB-6 | **Over time:** Split remaining FOR ALL policies on user-facing tables | 🔴 | Use `20260307100001_split_industry_questions_rls.sql` as reference; follow `.cursor/rules/supabase/supabase-create-rls-policies.mdc` |

**Best practices (verified against `.cursor/rules/supabase`):** Conditional DDL via DO + `information_schema` (create-migration); no FOR ALL to service_role, granular SELECT/INSERT/UPDATE/DELETE (create-rls-policies); lowercase SQL, header comments (postgres-sql-style). See `supabase/migrations/VERIFICATION_CRM_RLS_2026.md`.

> **What these mean for the founder:**
> - **R4:** Our server functions import libraries like "any version 2.x of Supabase." If the library ships a breaking update tomorrow, our functions could silently break. Pinning to exact version numbers (like 2.47.3) means no surprise breakages — we update on our terms.
> - **R7:** The PDF export library bundles into one 593kB JavaScript file (the recommended max is 500kB). Large files slow down initial page load — especially on mobile or slow connections. Splitting it into smaller pieces means the browser only downloads what's needed, when it's needed.

---

## 10. Security

> Protecting founder data, meeting compliance requirements, and following security best practices.

| # | Issue | Severity | Status | Next Action |
|---|-------|:--------:|:------:|-------------|
| S3 | Leaked password protection | LOW | 🟡 | **Requires Pro Plan** — enable when upgraded |
| S5 | pgvector in public schema | LOW | 🟡 | Accept risk — not relocatable. Document decision |
| S8 | No GDPR data export | MEDIUM | 🔴 | Phase 5 — build `data-export` edge function |

> **What these mean for the founder:**
> - **S3:** Supabase can check if a founder's chosen password has appeared in known data breaches (like "Have I Been Pwned") and warn them to pick a stronger one. This requires upgrading to Supabase Pro Plan — once upgraded, it's a one-click enable.
> - **S5:** The AI vector search extension (pgvector) is installed in the main database area instead of a private one. It can't be moved after installation — this is a known Supabase limitation. We accept this and document why so future developers aren't confused.
> - **S8:** European privacy law (GDPR) gives users the right to download all their personal data. We don't have a "Download My Data" button yet. This builds a server function that packages everything — profile, startups, reports, chat history — into a downloadable file.

---

## 11. Architecture Audit P2 — Deferred (28 tasks)

> Lower-priority database and infrastructure improvements found during the full system audit. These will be addressed naturally as we build features in each area — not as standalone work.

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

## 12. Future Phases

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
NOW:          POST-02 — Sprint Board ← report priority actions
              K5 — Hybrid search function

NEXT:         POST-03/POST-04 — Dashboard health + AI Panel modes
              M6 — Sprint Plan completion (Kanban + AI generation)
              13A, 13C, 13D — Report V2 design polish

WEEK 8-10:    ADV-01 to ADV-04 — Differentiation features

WEEK 11-12:   PROD-01 to PROD-05 — Launch ready

PARALLEL:     R4, R7, 3.1, 3.2, A1, A3, K4
```

---

## Quick Reference

| Metric | Value | Target |
|--------|-------|--------|
| Build time | 6.2s | <10s |
| Tests | 389/389 | 100% |
| TypeScript | 0 errors | 0 |
| Lint | 340 problems (down from 990) | <100 |
| Largest chunk | 593kB (pdf) | <500kB |
| Security advisors | 1 WARN (needs Pro) | 0 |
| RLS coverage | 94/94 (100%) | 100% |
| Phase 1 | 9/9 ✅ | Done |
| Phase 2 | 7/7 ✅ | Done |
| Phase 3 | 1/4 (POST-01 ✅) | Next |
| Overall | ~78% | 100% |
