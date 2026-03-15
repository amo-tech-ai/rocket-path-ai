---
task_id: AGN-02
title: Sprint Board — Agency Enhancement
phase: P2
priority: P1
status: Draft
agents: [sprint-prioritizer]
fragments: [agency/prompts/sprint-agent-fragment.md]
edge_functions: [sprint-agent]
existing_components: [SprintPlan, KanbanBoard, PlannerPanel]
schema_tables: [sprint_tasks, sprint_campaigns, startups]
---

# Implementation Prompt

> Enhance the Sprint Board (`src/pages/SprintPlan.tsx`) with agency framework features. Inject
> `sprint-agent-fragment.md` into the `sprint-agent` edge function via `loadFragment()`. Add three UI
> elements: (1) RICE score badge on each task card, (2) Kano category tag (Must-Have/Performance/Delighter)
> with color coding, (3) momentum sequencing indicator showing sprint flow pattern. Update `KanbanBoard.tsx`
> cards and `PlannerPanel.tsx` stats. Schema: add `rice_score`, `kano_category`, `quadrant` to sprint_tasks.

---

## User Journey

```
Founder arrives from Validator Report ("Start Next Sprint")
  OR opens Sprint Board directly
     │
     ▼
[Sprint Board loads] ─── Existing tasks shown in Kanban
     │
     ▼
[Generate Plan] ─── Click "Generate Plan" in Planner Panel
     │                 ├── sprint-agent generates 24 tasks (4 per sprint × 6 sprints)
     │                 ├── Each task RICE-scored: (Reach × Impact × Confidence) / Effort
     │                 ├── Each task Kano-tagged: Must-Have / Performance / Delighter
     │                 └── Tasks sequenced: Quick Win first, hard middle, deliverable end
     ▼
[Kanban Board] ─── Tasks in 4 columns with enhanced cards
     │               ├── Card shows: title + RICE badge + Kano tag + sprint name
     │               ├── Sorted within column by RICE score descending
     │               └── Drag-and-drop between columns preserved
     ▼
[Sprint Filter] ─── Filter by sprint name in Planner Panel
     │                ├── Sprint 1: All Must-Haves + top Quick Wins
     │                ├── Sprint 2: Big Bets + Performance tasks
     │                └── Sprint 3+: Performance + Delighters
     ▼
[Progress] ─── Capacity bar shows utilization vs buffer
                  ├── Solo founder: 40 pts max, 20% buffer
                  └── Warning if over 80% capacity
```

---

## ASCII Wireframe — Desktop (3-Panel)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | SPRINT BOARD                    [Kanban] [List]  | PLANNER PANEL    |
| RAIL|                                                  |                  |
|     | Sprint: [All ▾] [1] [2] [3] [4] [5] [6]        | ┌──────────────┐ |
|     |                                                  | │  AI Sprint   │ |
|     | ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ | │  Planner     │ |
|     | │BACKLOG  │ │TO DO    │ │DOING    │ │DONE     │ | │              │ |
|     | │         │ │         │ │         │ │         │ | │ [Generate    │ |
|     | │┌───────┐│ │┌───────┐│ │┌───────┐│ │┌───────┐│ | │  Plan]       │ |
|     | ││ Task  ││ ││ Task  ││ ││ Task  ││ ││ Task  ││ | │              │ |
|     | ││ title ││ ││ title ││ ││ title ││ ││ title ││ | │ ────────────  │ |
|     | ││       ││ ││       ││ ││       ││ ││       ││ | │              │ |
|     | ││RICE   ││ ││RICE   ││ ││RICE   ││ ││RICE   ││ | │ CAPACITY     │ |
|     | ││ 12.0  ││ ││  9.6  ││ ││  8.0  ││ ││  6.4  ││ | │ ████████░░░  │ |
|     | ││       ││ ││       ││ ││       ││ ││       ││ | │ 32/40 pts    │ |
|     | ││[Must] ││ ││[Perf] ││ ││[Must] ││ ││[Perf] ││ | │ (80% used)   │ |
|     | ││Sprint1││ ││Sprint2││ ││Sprint1││ ││Sprint1││ | │              │ |
|     | │└───────┘│ │└───────┘│ │└───────┘│ │└───────┘│ | │ SPRINT STATS │ |
|     | │         │ │         │ │         │ │         │ | │ Must-Haves: 6│ |
|     | │┌───────┐│ │┌───────┐│ │         │ │         │ | │ Performance:4│ |
|     | ││ Task  ││ ││ Task  ││ │         │ │         │ | │ Delighters: 2│ |
|     | ││ title ││ ││ title ││ │         │ │         │ | │              │ |
|     | ││RICE   ││ ││RICE   ││ │         │ │         │ | │ Quick Wins: 3│ |
|     | ││  5.2  ││ ││  4.8  ││ │         │ │         │ | │ Big Bets:  2 │ |
|     | ││       ││ ││       ││ │         │ │         │ | │ Fill-Ins:  4 │ |
|     | ││[Dlght]││ ││[Must] ││ │         │ │         │ | │ Time Sinks:1 │ |
|     | ││Sprint3││ ││Sprint1││ │         │ │         │ | │              │ |
|     | │└───────┘│ │└───────┘│ │         │ │         │ | │ ────────────  │ |
|     | └─────────┘ └─────────┘ └─────────┘ └─────────┘ | │              │ |
|     |                                                  | │ MOMENTUM     │ |
|     | ┌──── MOMENTUM SEQUENCE (Sprint 1) ───────────┐ | │ Sprint 1:    │ |
|     | │                                              │ | │ ✓ Quick Win  │ |
|     | │ Day 1-2      Day 3-8        Day 9-14        │ | │ → Hard task  │ |
|     | │ ┌────────┐  ┌──────────┐  ┌──────────────┐  │ | │ → Deliverable│ |
|     | │ │QuickWin│→ │ Big Bet  │→ │ Deliverable  │  │ | │              │ |
|     | │ │ 2 pts  │  │ 5 pts   │  │ 3 pts        │  │ | │ Sprint 2:    │ |
|     | │ └────────┘  └──────────┘  └──────────────┘  │ | │ ✓ Quick Win  │ |
|     | │                                              │ | │ → Big Bet    │ |
|     | │ "Start with a win, tackle hard stuff mid-   │ | │ → Deliverable│ |
|     | │  sprint, end with something you can show."   │ | │              │ |
|     | └──────────────────────────────────────────────┘ | └──────────────┘ |
|     |                                                  |                  |
+--------------------------------------------------------------------------+
```

---

## ASCII Wireframe — Mobile (< 768px)

```
+----------------------------------+
| [=] StartupAI        [?] [Bell]  |
+----------------------------------+
|                                  |
| SPRINT BOARD          [+] [AI]   |
|                                  |
| [All] [S1] [S2] [S3] ──── tabs  |
|                                  |
| [Backlog▾] ─── column selector   |
|                                  |
| ┌────────────────────────────┐  |
| │ Interview 5 clinic managers │  |
| │ RICE: 12.0  [Must-Have]    │  |
| │ Sprint 1   [Low effort]    │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ Run landing page test       │  |
| │ RICE: 9.6   [Performance]  │  |
| │ Sprint 2   [Med effort]    │  |
| └────────────────────────────┘  |
|                                  |
| ┌────────────────────────────┐  |
| │ Define AI moat vs comp      │  |
| │ RICE: 8.0   [Must-Have]    │  |
| │ Sprint 1   [Low effort]    │  |
| └────────────────────────────┘  |
|                                  |
| CAPACITY: ████████░░ 32/40 pts  |
|                                  |
| [Generate Plan]                  |
|                                  |
| ┌────────────────────────────┐  |
| │ [AI] Sprint coaching        │  |
| └────────────────────────────┘  |
+----------------------------------+
```

---

## Content & Data

### Task Card (ENHANCED)

| Field | Source | Example |
|-------|--------|---------|
| `title` | `sprint_tasks.title` | "Interview 5 clinic managers" |
| `rice_score` | `sprint_tasks.rice_score` (NEW) | `12.0` |
| `kano_category` | `sprint_tasks.kano_category` (NEW) | `"must_have"` / `"performance"` / `"delighter"` |
| `quadrant` | `sprint_tasks.quadrant` (NEW) | `"quick_win"` / `"big_bet"` / `"fill_in"` / `"time_sink"` |
| `sprint_name` | `sprint_tasks.sprint_name` | "Sprint 1" |
| `story_points` | `sprint_tasks.story_points` (NEW) | `3` |
| `effort` | `sprint_tasks.priority` mapped | "Low" / "Medium" / "High" |

### Kano Category Colors

| Category | Color | Badge | Sprint Rule |
|----------|-------|-------|-------------|
| Must-Have | Red/Rose | `bg-rose-100 text-rose-700` | Sprint 1 always |
| Performance | Blue | `bg-blue-100 text-blue-700` | Sprint 2-3 |
| Delighter | Purple | `bg-purple-100 text-purple-700` | Sprint 3+ unless low effort |

### RICE Quadrant Colors

| Quadrant | Criteria | Color | Action |
|----------|----------|-------|--------|
| Quick Win | RICE ≥ 5, Effort ≤ 3 | Green | Sprint 1 priority |
| Big Bet | RICE ≥ 5, Effort > 3 | Amber | Break into subtasks |
| Fill-In | RICE < 5, Effort ≤ 3 | Gray | Slack time |
| Time Sink | RICE < 5, Effort > 3 | Red strikethrough | Skip unless requested |

### Capacity Planning

| Team Size | Max Points / 2-Week Sprint | Buffer |
|-----------|---------------------------|--------|
| Solo founder | 40 | 20% (8 reserved) |
| Team of 2-3 | 80 | 20% (16 reserved) |
| Team of 4-6 | 150 | 25% (37 reserved) |

### Story Points

| Points | Meaning | Effort |
|--------|---------|--------|
| 1 | Trivial (< 2 hours) | Low |
| 2 | Small (half day) | Low |
| 3 | Medium (1 day) | Medium |
| 5 | Large (2-3 days) | Medium |
| 8 | Very large (1 week) | High |
| 13 | Epic — break down | High |

---

## Agency Features — Before / After

| Feature | Before (current) | After (with agency) |
|---------|-------------------|---------------------|
| Task cards | Title + priority + sprint badge | Title + RICE score + Kano tag + quadrant badge |
| Task ordering | Manual drag | Auto-sorted by RICE within columns |
| Sprint allocation | Random across 6 sprints | Must-Haves→S1, Big Bets→S2, Delighters→S3+ |
| Sprint pacing | No guidance | Momentum bar: Quick Win → Hard → Deliverable |
| Capacity | No tracking | Points bar with utilization % and buffer |
| Planner Panel | Generate button + filter | Stats (Kano/quadrant counts) + capacity + momentum |

---

## Agent & Fragment Wiring

```
sprint-agent/index.ts
  │
  └── INJECT: loadFragment('sprint-agent-fragment')
        ├── RICE scoring formula: (Reach × Impact × Confidence) / Effort
        ├── Kano classification: Must-Have / Performance / Delighter
        ├── Quadrant assignment: Quick Win / Big Bet / Fill-In / Time Sink
        ├── Momentum sequencing: Quick Win first, hard middle, deliverable end
        ├── Capacity planning: 40 pts solo, 80 pts team, 20% buffer
        └── OUTPUT: sprint_tasks[].rice_score, .kano_category, .quadrant, .story_points
```

---

## Workflows

| Trigger | AI Action | UI Update |
|---------|-----------|-----------|
| Click "Generate Plan" | `sprint-agent` generates 24 RICE+Kano tasks | Kanban populates with enhanced cards |
| Import from Report | `useSprintImport` maps priority_actions | Tasks created with RICE scores preserved |
| Filter by sprint | Client-side filter | Shows only tasks for selected sprint |
| Drag task to Done | Update status | Capacity bar adjusts, stats update |
| Over 80% capacity | Warning computed | Amber capacity bar + "Consider deferring" |
| Click momentum bar | Expand sprint timeline | Day-by-day task sequence visualization |
| Click Kano tag | Filter to that category | Shows all tasks of same Kano type |
