# Task Prompts — Index

> **Source:** PRD v9.0, `tasks/next-steps.md`, `tasks/wireframes/`
> **Updated:** 2026-03-07
> **Version:** 3.1 — Added PROD-06/07/08 (lint cleanup, E2E tests, edge function cleanup)

---

## Folders

| Folder | Files | Numbers | Purpose |
|--------|:-----:|:-------:|---------|
| `core/` | 4 | 01-04 | Phase 1 CORE — Fix E2E flow (9 days) |
| `mvp/` | 7 | 05-11 | Phase 2 MVP — V3 consulting report (24 days) |
| `post-mvp/` | 4 | 12-15 | Phase 3 POST-MVP — Enhanced features (15 days) |
| `advanced/` | 4 | 16-19 | Phase 4 ADVANCED — Differentiation (15 days) |
| `production/` | 8 | 20-27 | Phase 5 PRODUCTION — Launch ready (18 days) |
| `data-prompts/` | 10 | 01-10 | Infrastructure (migrations, RLS, cron, storage) — all done |
| (root) | 4 | — | This index, `whats-next.md`, `edge-function-audit.md`, `progress-tracker.md` |

**Related:** Wireframes live at `tasks/wireframes/` (sibling folder, not inside prompts/).

---

## 5-Phase Delivery Plan (27 tasks, ~81 days)

### Phase 1: CORE — Fix E2E Flow (9 days)

| # | Task ID | File | Title | Priority | Effort | Depends On |
|---|---------|------|-------|----------|--------|------------|
| 01 | CORE-01 | `core/01-fix-coachpanel.md` | Fix CoachPanel Migration | P0 | 3 days | — |
| 02 | CORE-02 | `core/02-persistent-ai-panel.md` | Persistent AI Right Panel (360px) | P0 | 3 days | 01 |
| 03 | CORE-03 | `core/03-auto-generate-lean-canvas.md` | Auto-Generate Lean Canvas from Report | P1 | 2 days | — |
| 04 | CORE-04 | `core/04-home-validate-flow-polish.md` | Home → Validate Flow Polish | P1 | 1 day | — |

### Phase 2: MVP — V3 Consulting Report (24 days)

| # | Task ID | File | Title | Priority | Effort | Depends On |
|---|---------|------|-------|----------|--------|------------|
| 05 | MVP-01 | `mvp/05-v3-types-foundation.md` | V3 Types Foundation | P0 | 2 days | — |
| 06 | MVP-02 | `mvp/06-composer-group-e.md` | Composer Group E Pipeline Expansion | P0 | 5 days | 05 |
| 07 | MVP-03 | `mvp/07-chat-12-topics.md` | Chat Interview 8→12 Topics | P1 | 3 days | — |
| 08 | MVP-04 | `mvp/08-dimension-page-components.md` | DimensionPage Shared Components (5 New) | P0 | 5 days | 05 |
| 09 | MVP-05 | `mvp/09-nine-dimension-pages.md` | 9 Dimension Detail Pages with Diagrams | P0 | 5 days | 08, 06 |
| 10 | MVP-06 | `mvp/10-report-ai-panel.md` | Report AI Panel (Section-Aware) | P1 | 3 days | 02, 09 |
| 11 | MVP-07 | `mvp/11-ai-lean-canvas-page.md` | AI Lean Canvas Report Page (9-Block Grid) | P1 | 3 days | 09, 03 |

### Phase 3: POST-MVP — Enhanced Features (16 days)

| # | Task ID | File | Title | Priority | Effort | Depends On |
|---|---------|------|-------|----------|--------|------------|
| 12 | POST-01 | `post-mvp/12-unlock-report-tabs.md` | Unlock 4 Report Tabs | P1 | 5 days | 09 |
| 13 | POST-02 | `post-mvp/13-sprint-board-import.md` | Sprint Board ← Report Import | P1 | 3 days | 09 |
| 14 | POST-03 | `post-mvp/14-dashboard-health-scores.md` | Dashboard Health from Validation Scores | P1 | 3 days | 06 |
| 15 | POST-04 | `post-mvp/15-research-planning-agent-modes.md` | Research + Planning Agent Modes | P2 | 5 days | 02 |

### Phase 4: ADVANCED — Differentiation (18 days)

| # | Task ID | File | Title | Priority | Effort | Depends On |
|---|---------|------|-------|----------|--------|------------|
| 16 | ADV-01 | `advanced/16-rag-planning-agent.md` | RAG Planning Agent | P1 | 5 days | 15 |
| 17 | ADV-02 | `advanced/17-chat-driven-canvas.md` | Chat-Driven Canvas Editing | P1 | 5 days | 02, 03 |
| 18 | ADV-03 | `advanced/18-chat-driven-dashboard.md` | Chat-Driven Dashboard | P2 | 3 days | 02, 14 |
| 19 | ADV-04 | `advanced/19-financial-agent.md` | Financial Agent | P2 | 5 days | 14 |

### Phase 5: PRODUCTION — Launch Ready (21 days)

| # | Task ID | File | Title | Priority | Effort | Depends On |
|---|---------|------|-------|----------|--------|------------|
| 20 | PROD-01 | `production/20-security-hardening.md` | Security Hardening | P0 | 3 days | 06 |
| 21 | PROD-02 | `production/21-performance.md` | Performance Optimization | P1 | 3 days | 09 |
| 22 | PROD-03 | `production/22-monitoring.md` | Monitoring & Cost Dashboard | P1 | 3 days | 06 |
| 23 | PROD-04 | `production/23-mobile-polish.md` | Mobile Polish | P2 | 3 days | 02, 09 |
| 24 | PROD-05 | `production/24-gdpr-compliance.md` | GDPR Compliance | P0 | 3 days | 20 |
| 25 | PROD-06 | `production/25-lint-cleanup.md` | Lint Cleanup (Hooks Bugs + TypeScript) | P1 | 2 days | — |
| 26 | PROD-07 | `production/26-e2e-tests.md` | E2E Tests (Playwright) | P1 | 3 days | 20 |
| 27 | PROD-08 | `production/27-edge-function-cleanup.md` | Edge Function Cleanup | P2 | 1 day | 20 |

### Dependency Chain

```
01 → 02 → 10, 15 → 16
          → 17, 18, 23

03 → 11, 17

05 → 06 → 09 → 10, 11, 12, 13, 21, 23
   → 08 → 09

06 → 14 → 18, 19
   → 20 → 24, 26, 27
   → 22

25 (independent — can start anytime)
07 (independent)
04 (independent)
```

---

## Data Prompts (`data-prompts/`)

| # | Prompt | What | Status |
|---|--------|------|:------:|
| 01 | `01-create-missing-tables.md` | Create startup_health_scores, financial_models, dashboard_metrics_cache | Done |
| 02 | `02-deploy-missing-edge-functions.md` | Deploy weekly-review and share-meta | Done |
| 03 | `03-add-broadcast-triggers.md` | 4 tables + 2 realtime publications | Done |
| 04 | `04-create-storage-buckets.md` | avatars, startup-assets, pitch-exports | Done |
| 05 | `05-add-cron-jobs.md` | 3 missing pg_cron scheduled jobs | Done |
| 06 | `06-cleanup-rls-policies.md` | Drop 21 redundant FOR ALL policies | Done |
| 07 | `07-fix-rls-performance.md` | STABLE helpers for current_setting | Done |
| 08 | `08-enable-jwt-verification.md` | Re-enable verify_jwt on 29 edge functions | Done |
| 09 | `09-seed-agent-configs.md` | Insert default agent configs for all orgs | Done |
| 10 | `10-enable-password-protection.md` | Enable leaked password check (dashboard toggle) | Manual |

---

## EF Audit Findings

| # | What | Severity | Status |
|---|------|:--------:|:------:|
| A1 | Add edge-runtime import to ~8 remaining functions | Medium | Pending |
| A2 | Add rate limiting to 6 AI-heavy functions | High | Pending |
| A3 | Fix rate-limit.ts memory leak (periodic cleanup) | High | Pending |
| A4 | Fix ai-chat public mode rate limit (IP/session-based) | High | Pending |
| A5 | Enforce Gemini temperature 1.0 floor in ai-client.ts | Medium | Pending |

---

## Total Files

```
Core prompts:             4 files (core/01-04)
MVP prompts:              7 files (mvp/05-11)
Post-MVP prompts:         4 files (post-mvp/12-15)
Advanced prompts:         4 files (advanced/16-19)
Production prompts:       8 files (production/20-27)
Data prompts:            10 files (data-prompts/01-10)
Root files:               4 files (index, whats-next, ef-audit, progress)
                         ─────────
Total:                   41 files
```
