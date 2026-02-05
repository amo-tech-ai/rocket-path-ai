# Founder Roadmap System — Plan Overview

> **Version:** 1.0 | **Created:** 2026-02-02 | **Status:** Design Complete

---

## Summary

The Founder Roadmap is a **Stage Progress Tracker** that guides startup founders through the startup lifecycle with:

1. **Visual Journey Map** — Horizontal timeline showing 5 phases with current position
2. **Stage-Scoped Now-Next-Later** — Contextual planning tied to current phase
3. **Stage Coach Agent** — AI-powered personalized guidance
4. **Evidence-Based Gates** — Progress requires proof, not self-declaration

---

## Design Decisions

| Question | Decision | Rationale |
|----------|----------|-----------|
| Primary use case | Stage Progress Tracker | Aligns with existing Lean System validation philosophy |
| Interaction model | Visual Journey Map | Provides orientation + motivation across lifecycle |
| Planning integration | Stage-Scoped Now-Next-Later | Keeps founders focused on current phase |
| AI role | Single Stage Coach Agent | Consistent guidance without agent handoff complexity |
| Stage structure | 5 Phases with 10 Sub-Stages | Balances simplicity (funding alignment) with detail (validation gates) |

---

## 5-Phase Structure

| # | Phase | Funding | Sub-Stages | Key Question |
|---|-------|---------|------------|--------------|
| 1 | **IDEA** | Pre-seed | Idea & Vision, Market Discovery | Is this worth pursuing? |
| 2 | **SEED** | Seed | Strategy & Readiness, Problem-Solution Fit | Does the problem exist? |
| 3 | **EARLY** | Series A | MVP Build, Go-To-Market | Can we sell it? |
| 4 | **GROWTH** | Series B | Traction, Scale | Is it growing? |
| 5 | **MATURITY** | Series C+ | Fundraising, Expansion | What's next? |

---

## Key Features

### Visual Journey Map
- Horizontal timeline showing all 5 phases
- Current phase highlighted with glow/pulse
- Click to expand phase details
- Locked phases show requirements to unlock

### Stage-Scoped Planning
- **NOW**: Tasks for current sub-stage
- **NEXT**: Gate requirements for next phase
- **LATER**: Preview of future phase tasks

### Stage Coach Agent
- Personalized coaching messages
- Celebrates milestones
- Warns about stalls and skipped validation
- Explains "why" behind guidance

### Evidence-Based Gates
- 80% readiness required for gate review
- AI validates evidence quality
- Blockers explicitly stated
- Never advances without proof

---

## Related Documents

| Document | Path | Purpose |
|----------|------|---------|
| Full Wireframe | `05-roadmap-wireframe.md` | Complete screen design with data model |
| Lean System Plan | `01-lean-system-plan.md` | Overall Lean OS architecture |
| Traction Roadmap Design | `../design/03-traction-roadmap.md` | Complementary metrics screen |

---

## Implementation Priority

1. **P0 — Core Journey**
   - Visual journey map component
   - Phase/sub-stage data model
   - Milestone tracking

2. **P1 — Planning**
   - Now-Next-Later board
   - Gate progress display
   - Cross-screen milestone sync

3. **P2 — Intelligence**
   - Stage Coach Agent
   - Stage Detector Agent
   - Gate Validator Agent

---

## Next Steps

1. Create Figma designs from wireframe
2. Define database migrations
3. Build frontend components
4. Implement Stage Coach edge function
5. Integration testing with other Lean System screens

---

*See `05-roadmap-wireframe.md` for complete wireframe specification.*
