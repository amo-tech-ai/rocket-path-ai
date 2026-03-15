# Agency Mermaid Diagrams — Index

> **Created:** 2026-03-12
> **Source:** `agency/prd-agency.md`, `agency/roadmap-agency.md`
> **Method:** system.md (PRD → Diagrams → Tasks → Roadmap → Milestones)

---

## Diagram Registry

| ID | File | Type | Phase | Diagram Subject |
|----|------|------|-------|-----------------|
| AGN-01 | `01-agent-loader-runtime.md` | Flowchart | CORE | Agent loader reads fragments/modes, caches, injects into EF prompts |
| AGN-02 | `02-fragment-wiring-map.md` | Flowchart | CORE | 5 fragments + 4 chat modes → 6 edge functions mapping |
| AGN-03 | `03-validator-enhanced-pipeline.md` | Sequence | CORE | Scoring + Composer agents enriched with agency fragments |
| AGN-04 | `04-chat-mode-flow.md` | Sequence | MVP | User selects mode → loader → system prompt → AI response |
| AGN-05 | `05-screen-enhancement-map.md` | Flowchart | MVP | 6 screens × agency frameworks × new UI components |
| AGN-06 | `06-investor-meddpicc-flow.md` | Flowchart | MVP | MEDDPICC scoring → deal verdict → signal timing → email |
| AGN-07 | `07-behavioral-nudge-system.md` | Flowchart | POST-MVP | Trigger conditions → nudge types → user actions |
| AGN-08 | `08-phase-dependency-graph.md` | Flowchart | ALL | 22 tasks across 5 phases with dependency arrows |
| AGN-09 | `09-phase-gantt.md` | Gantt | ALL | 5-phase timeline (15 days) with milestones |
| AGN-10 | `10-agency-erd.md` | ERD | INFRA | Agency schema: sprint_tasks RICE, investors MEDDPICC, nudges, chat sessions |

---

## Phase Distribution

| Phase | Diagrams | IDs |
|-------|----------|-----|
| CORE | 3 | AGN-01, AGN-02, AGN-03 |
| MVP | 3 | AGN-04, AGN-05, AGN-06 |
| POST-MVP | 1 | AGN-07 |
| ALL (cross-phase) | 2 | AGN-08, AGN-09 |
| INFRASTRUCTURE | 1 | AGN-10 |

---

## Milestone Rules (from system.md)

| Phase | Milestone | Validated By |
|-------|-----------|-------------|
| CORE | Agent loader works, validator reports enriched | Run pipeline → see evidence tiers + bias flags |
| MVP | All 6 screens enhanced, 4 chat modes live | Each screen shows agency-specific UI elements |
| POST-MVP | Sessions saved, nudges active, panels rich | Chat history persists, nudge banners render |
| ADVANCED | Quality tracked, caching proven | ai_runs shows fragment data, cold-start < 100ms |
| PRODUCTION | 38+ tests pass, staged deploy complete | All EFs deployed, no 500s in logs |

---

## References

| Doc | Path |
|-----|------|
| PRD | `agency/prd-agency.md` |
| Roadmap | `agency/roadmap-agency.md` |
| Wireframes | `agency/wireframes/00-index.md` |
| System method | `system.md` |
