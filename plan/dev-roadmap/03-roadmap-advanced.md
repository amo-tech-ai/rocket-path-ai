# ADVANCED Phase Roadmap

> **Version:** 1.0 | **Updated:** 2026-02-02
> **Phase Question:** Does it help users do better?
> **Milestone:** System proactively assists users
> **Prerequisite:** MVP Phase complete

---

## Executive Summary

The ADVANCED phase transforms StartupAI from a reactive tool into a proactive AI assistant. This phase introduces intelligent task orchestration, automated pitch deck generation, PMF scoring, and investor CRM management—all powered by the validated data from earlier phases.

**Key Objectives:**
- Auto-generate prioritized tasks based on startup stage
- Create pitch decks from validated data
- Score product-market fit readiness
- Manage investor pipeline with AI assistance
- Enable proactive system notifications

---

## Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       ADVANCED PHASE                             │
├─────────────────────────────────────────────────────────────────┤
│  Week 13-14        │  Week 15-16                                │
│  ─────────         │  ─────────                                 │
│  D-12 Tasks        │  D-13 Pitch Deck                           │
│  D-14 PMF          │  D-15 Investor CRM                         │
│                    │  ADVANCED COMPLETE                         │
├─────────────────────────────────────────────────────────────────┤
│  Deliverable:      │  Deliverable:                              │
│  Proactive tasks   │  Investment readiness                      │
│  PMF scoring       │  Complete toolkit                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagrams in This Phase

| ID | Name | Type | Purpose | Skills |
|----|------|------|---------|--------|
| D-12 | Task Orchestration | Flowchart | Task generation & priority | lean-sprints, traction |
| D-13 | Pitch Deck Generation | Sequence | Deck builder flow | pitch-deck |
| D-14 | PMF Assessment | Flowchart | Product-market fit scoring | traction, startup-metrics |
| D-15 | Investor CRM Flow | Flowchart | Fundraising pipeline | fundraising |

---

## Behaviors to Implement

### B-11: Task Orchestration
```
System auto-generates prioritized tasks
├── Tasks based on startup stage
├── Priority calculated (RICE scoring)
├── Dependencies tracked
├── Progress visible
└── Smart suggestions on completion
```

**Acceptance Criteria:**
- [ ] Tasks generated on dashboard load
- [ ] Tasks match current startup stage
- [ ] Priority scores calculated
- [ ] Task completion triggers new suggestions
- [ ] Tasks link to relevant features

### B-12: Pitch Deck Generation
```
System creates pitch deck from validated data
├── 10+ slide deck structure
├── Content pulled from canvas/experiments
├── Slide-by-slide editing
├── Export to PDF/PPTX
└── Version history
```

**Acceptance Criteria:**
- [ ] Deck generated from startup data
- [ ] All standard slides present
- [ ] Each slide editable
- [ ] Export formats work
- [ ] Previous versions accessible

### B-13: PMF Assessment
```
System scores PMF readiness
├── 10-point PMF score calculated
├── Score based on experiments + metrics
├── Improvement recommendations
├── Benchmark comparisons
└── Score history tracked
```

**Acceptance Criteria:**
- [ ] PMF score displayed (0-10)
- [ ] Score components visible
- [ ] Recommendations actionable
- [ ] Industry benchmarks shown
- [ ] Historical scores graphed

### B-14: Investor CRM
```
System manages investor pipeline
├── Investor database searchable
├── Pipeline stages tracked
├── Meeting notes stored
├── Follow-up reminders
└── Intro request management
```

**Acceptance Criteria:**
- [ ] Investor search works
- [ ] Pipeline kanban view
- [ ] Notes per investor
- [ ] Reminders functional
- [ ] Warm intro tracking

---

## Now-Next-Later Breakdown

### NOW (Weeks 13-14) — Tasks & PMF

| Initiative | Owner | Status | Target |
|------------|-------|--------|--------|
| D-12: Build task orchestration engine | AI Team | ⬜ | Week 13 |
| D-14: Design PMF scoring algorithm | AI Team | ⬜ | Week 13 |
| Task generation edge function | Backend | ⬜ | Week 13 |
| Task UI with priorities | Frontend | ⬜ | Week 14 |
| PMF dashboard component | Frontend | ⬜ | Week 14 |
| PMF calculation edge function | Backend | ⬜ | Week 14 |

### NEXT (Weeks 15-16) — Pitch & CRM

| Initiative | Depends On | Est. Effort |
|------------|------------|-------------|
| D-13: Pitch deck generator | Canvas + PMF | 1.5 weeks |
| D-15: Investor CRM | Deck complete | 1 week |
| Slide editor component | Deck generator | 0.5 weeks |
| Pipeline management | CRM database | 0.5 weeks |

### LATER (Post Week 16)

| Theme | Strategic Value | Open Questions |
|-------|-----------------|----------------|
| Investor matching AI | Warm intro optimization | Which investors match stage? |
| Automated outreach | Time savings | Email templates? |
| Portfolio benchmarking | Competitive context | Data sources? |

---

## Dependencies Map

```
[MVP Complete] ──blocks──> [D-12 Task Orchestration]
[Canvas Data] ──provides──> [D-13 Pitch Deck]
[Experiment Data] ──provides──> [D-14 PMF Assessment]
[D-14 PMF Score] ──informs──> [D-15 Investor CRM]
[D-13 Pitch Deck] ──supports──> [D-15 Investor CRM]
[Investor Database] ──requires──> [External: Crunchbase/PitchBook]
```

---

## PMF Scoring Model

### Score Components (0-10 scale)

| Component | Weight | Data Source | Calculation |
|-----------|--------|-------------|-------------|
| Problem Clarity | 15% | Lean Canvas | UVP + Problem blocks complete |
| Solution Validation | 20% | Experiments | Experiments run + results |
| Customer Signals | 25% | Traction | Signups, usage, feedback |
| Revenue Model | 15% | Canvas | Revenue/cost blocks |
| Growth Potential | 15% | Experiments | Viral coeff, CAC payback |
| Team Readiness | 10% | Profile | Skills, commitment |

### PMF Score Interpretation

| Score | Level | Meaning | Action |
|-------|-------|---------|--------|
| 0-2 | Pre-Problem | Problem not validated | Run more discovery |
| 3-4 | Problem-Found | Problem clear, no solution | Build MVP |
| 5-6 | Solution-Testing | MVP exists, testing fit | Iterate on feedback |
| 7-8 | Early-PMF | Strong signals, some traction | Prepare for growth |
| 9-10 | PMF-Achieved | Clear PMF, ready to scale | Fundraise/scale |

---

## Task Generation Rules

### Stage-Based Task Templates

| Stage | Task Types | Priority Boost |
|-------|------------|----------------|
| Idea | Discovery, interviews | Problem tasks +2 |
| PSF | Experiments, landing pages | Validation tasks +2 |
| MVP | Build, test, iterate | Product tasks +2 |
| Traction | Growth, metrics, retention | Growth tasks +2 |
| Scale | Team, fundraise, operations | Scale tasks +2 |

### RICE Scoring for Tasks

```
Priority Score = (Reach × Impact × Confidence) / Effort

Reach: % of users this helps (0-100)
Impact: Effect magnitude (0.25, 0.5, 1, 2, 3)
Confidence: Certainty (0-100%)
Effort: Person-days (1-30)
```

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| PMF score gaming | Medium | 30% | Validate data sources |
| Deck quality inconsistent | High | 40% | Templates, AI review |
| Task overwhelm | Medium | 35% | Limit to top 5 daily |
| Investor data staleness | Medium | 50% | Regular refresh, user input |
| CRM adoption low | Medium | 40% | Integrate with email |

---

## Success Metrics

| Metric | Current | Target | Timeframe |
|--------|---------|--------|-----------|
| Tasks generated/user | 0 | 20+ | Week 16 |
| Task completion rate | 0% | 40% | Week 16 |
| Decks created | 0 | 1/user | Week 16 |
| PMF score calculated | 0% | 100% | Week 16 |
| Investors tracked/user | 0 | 15 | Week 16 |
| Pipeline stages used | 0 | 4 avg | Week 16 |

---

## Task Checklist

### Week 13: Task Engine
- [ ] Create D-12 Task Orchestration diagram
- [ ] Design task generation algorithm
- [ ] Build task database schema
- [ ] Create generate-tasks edge function
- [ ] Implement RICE scoring
- [ ] Create D-14 PMF Assessment diagram

### Week 14: PMF & Task UI
- [ ] Design PMF scoring algorithm
- [ ] Build PMF calculation edge function
- [ ] Create PMF dashboard component
- [ ] Build task list component
- [ ] Implement task completion flow
- [ ] Create task history view

### Week 15: Pitch Deck
- [ ] Create D-13 Pitch Deck Generation diagram
- [ ] Design deck template structure
- [ ] Build slide generation prompts
- [ ] Create deck editor component
- [ ] Implement PDF export
- [ ] Build version history

### Week 16: Investor CRM
- [ ] Create D-15 Investor CRM Flow diagram
- [ ] Design investor database schema
- [ ] Build investor search
- [ ] Create pipeline kanban board
- [ ] Implement meeting notes
- [ ] Add follow-up reminders
- [ ] ADVANCED phase complete

---

## Validation Criteria

**ADVANCED Phase is complete when:**
1. ✅ System auto-generates prioritized tasks without user trigger
2. ✅ User can generate a 10+ slide pitch deck from their data
3. ✅ PMF score is calculated and displayed with recommendations
4. ✅ User can track 10+ investors through pipeline stages
5. ✅ Proactive notifications appear for key actions
6. ✅ All features integrate with existing canvas/experiment data

---

## Pitch Deck Structure

| Slide | Content Source | AI Generation |
|-------|----------------|---------------|
| 1. Title | Company name, tagline | From canvas |
| 2. Problem | Problem block | Enhanced narrative |
| 3. Solution | Solution block | Value prop expansion |
| 4. Market | Industry playbook | Size calculations |
| 5. Product | Screenshots, features | Feature highlights |
| 6. Traction | Experiment results | Metrics visualization |
| 7. Business Model | Revenue/cost blocks | Unit economics |
| 8. Competition | Market analysis | Positioning matrix |
| 9. Team | Profile data | Bios + credibility |
| 10. Ask | Funding needs | Use of funds |

---

## Skills Used

| Skill | Purpose in ADVANCED |
|-------|---------------------|
| `lean-sprints` | Task prioritization |
| `traction` | PMF measurement |
| `startup-metrics` | KPI tracking |
| `pitch-deck` | Deck generation |
| `fundraising` | Investor CRM |
| `playbooks` | Industry context |
| `frontend-design` | Dashboard UIs |

---

*Generated by Claude Code — 2026-02-02*
