# Prompt 15 — Projects Module

> **Phase:** Module | **Priority:** P1 | **Overall:** 25%
> **No code — screen specs, data sources, agent workflows only**
> **Reference:** `100-dashboard-system.md` Section 4

---

## Purpose

Strategic initiative tracker. Organize work into projects with AI-powered task generation and prioritization.

## Goals

- Track projects from ideation to completion
- Auto-generate tasks from project descriptions using AI
- Prioritize tasks based on impact and urgency
- Visualize progress with kanban boards

## Outcomes

Founders break down overwhelming goals into manageable, prioritized tasks.

---

## Screen 15a: Projects List

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Project Stats  │
│                 │  Projects                  [+ New Project]   │                 │
│                 │                                              │  Active: 5      │
│                 │  🔍 Search...  [Active] [Completed] [All]   │  Tasks: 24      │
│                 │                [Grid ▦] [List ≡]            │  Completed: 11  │
│                 │                                              │                 │
│                 │  ┌──────────────────┐ ┌──────────────────┐  │ ─────────────── │
│                 │  │  Launch MVP      │ │  Customer        │  │                 │
│                 │  │                  │ │  Discovery       │  │  AI Actions     │
│                 │  │  ▓▓▓▓▓▓▓░░░ 68% │ │                  │  │                 │
│                 │  │  8 tasks (5 done)│ │  ▓▓▓▓░░░░░░ 35% │  │  [Generate   ▸] │
│                 │  │  Due: Feb 15     │ │  6 tasks (2 done)│  │  [Prioritize ▸] │
│                 │  │  ● Active        │ │  Due: Mar 1      │  │                 │
│                 │  └──────────────────┘ │  ● Active        │  │ ─────────────── │
│                 │                       └──────────────────┘  │                 │
│                 │  ┌──────────────────┐ ┌──────────────────┐  │  Stage Guidance │
│                 │  │  Fundraising     │ │  Hiring Plan     │  │                 │
│                 │  │  Prep            │ │                  │  │  "Focus on MVP  │
│                 │  │  ▓▓▓▓▓░░░░░ 45% │ │  ▓▓░░░░░░░░ 15% │  │  launch before  │
│                 │  │  10 tasks (4)    │ │  4 tasks (0 done)│  │  expanding team"│
│                 │  └──────────────────┘ └──────────────────┘  │                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Screen 15b: Project Detail

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | Name, status, due date, description | `projects` row |
| Task List | Kanban or list view of tasks | `tasks` filtered by project_id |
| AI Generate | Button to auto-generate tasks | `ai-chat` -> `generate_tasks` |
| Progress | Visual progress bar | Calculated from task completion |

---

## Screen 15c: Tasks Board (Kanban)

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Task Intel     │
│                 │  Tasks                [AI Generate ▸] [+ New]│                 │
│                 │                                              │  Total: 24      │
│                 │  Pending (8)      In Progress (5)  Done (11) │  Due Today: 3   │
│                 │                                              │  Overdue: 1     │
│                 │  ┌──────────┐    ┌──────────┐    ┌────────┐ │                 │
│                 │  │Fix login │    │User test │    │Auth    │ │ ─────────────── │
│                 │  │bug       │    │round 1   │    │flow    │ │                 │
│                 │  │●High     │    │●High     │    │●High   │ │  AI Suggestions │
│                 │  │Launch MVP│    │Launch MVP│    │Done ✓  │ │                 │
│                 │  │Feb 10    │    │Feb 8     │    │        │ │  [Task recs]    │
│                 │  └──────────┘    └──────────┘    └────────┘ │                 │
│                 │                                              │                 │
│                 │  ← Drag tasks between columns                │                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Data Sources

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `projects` | Project tracking | name, description, status, progress, due_date |
| `tasks` | Task management | title, description, status, priority, project_id, due_at |

---

## Agent Workflows

| Workflow | Trigger | Edge Function | Action | Output |
|----------|---------|---------------|--------|--------|
| Task Generation | Click "AI Generate" | `ai-chat` | `generate_tasks` | 5-10 tasks |
| Task Prioritization | Click "Prioritize" | `ai-chat` | `prioritize_tasks` | Ranked list |
| Stage Guidance | Dashboard loads | `ai-chat` | `stage_guidance` | Recommendations |

**Note:** A dedicated `task-agent` edge function is planned for more advanced task AI.

---

## User Stories

- As a founder, I create a project and AI generates 8 tasks with priorities
- As a founder, I drag tasks between kanban columns and status updates automatically
- As a founder, I click "Prioritize" and AI reorders tasks by impact vs effort
- As a founder, I see a progress bar showing % of tasks completed

---

## Acceptance Criteria

- [ ] AI task generation creates 5-10 actionable tasks with title, description, priority
- [ ] Kanban board supports drag-and-drop between columns
- [ ] Task status updates persist immediately (optimistic UI)
- [ ] Project progress bar reflects actual task completion ratio
- [ ] Task detail sheet shows full description and allows inline editing

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `Projects.tsx` | `src/pages/Projects.tsx` | ✅ Exists |
| `ProjectCard.tsx` | `src/components/projects/ProjectCard.tsx` | ✅ Exists |
| `ProjectDetail.tsx` | `src/pages/ProjectDetail.tsx` | ✅ Exists |
| `Tasks.tsx` | `src/pages/Tasks.tsx` | ✅ Exists |
| `KanbanBoard.tsx` | `src/components/tasks/KanbanBoard.tsx` | ✅ Exists |
| `TaskCard.tsx` | `src/components/tasks/TaskCard.tsx` | ✅ Exists |
| `TaskDialog.tsx` | `src/components/tasks/TaskDialog.tsx` | ✅ Exists |
| `TasksAIPanel.tsx` | `src/components/tasks/TasksAIPanel.tsx` | ✅ Exists |

---

## Missing Work

1. **Task generation wiring** — Connect "AI Generate" to `ai-chat` edge function
2. **Prioritization UI** — Button + reorder animation
3. **Project progress calc** — Real-time progress from task status
4. **Task-agent edge function** — Dedicated agent for task intelligence

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Wire AI Generate to `generate_tasks` action | 2h | High |
| 2 | Add prioritization button | 1h | Medium |
| 3 | Calculate project progress from tasks | 1h | Medium |
| 4 | Create `task-agent` edge function | 4h | High (future) |
