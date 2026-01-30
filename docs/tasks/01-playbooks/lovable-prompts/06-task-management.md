---
task_number: "06"
title: "Task Management Dashboard"
category: "Features"
subcategory: "Task Management"
phase: 2
priority: "P1"
status: "Open"
percent_complete: 10
owner: "Frontend Developer"
---

# Lovable Prompt: Task Management Dashboard

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/app/tasks` - Task and priority management |
| **Features** | Kanban board, list view, AI prioritization, smart grouping, due dates |
| **Agents** | Task Generator (Gemini Pro), Prioritizer (Claude), Stage Advisor (Gemini Flash) |
| **Use Cases** | Daily work planning, weekly review, milestone tracking, investor prep |
| **Duration** | Ongoing usage |
| **Outputs** | Organized tasks, priorities, progress tracking |

---

## Description

Build a task management dashboard that combines Kanban boards with AI-powered prioritization. Tasks can be generated from AI suggestions, grouped by startup stage, and automatically prioritized based on current goals and deadlines. The system understands startup context and suggests what founders should focus on.

---

## Purpose & Goals

**Purpose:** Help founders focus on the right work by surfacing AI-recommended priorities based on their startup's current stage and goals.

**Goals:**
1. Display tasks in Kanban (Todo/In Progress/Done) and list views
2. AI-generate tasks from stage checklists and playbooks
3. Prioritize tasks based on startup health score and goals
4. Group tasks by category (Product, Fundraising, Sales, etc.)
5. Track time and progress toward milestones

**Outcomes:**
- Founders complete 3x more high-impact tasks
- 80% of generated tasks are marked useful
- Clear visibility into what matters this week
- Integration with canvas and pitch deck workflows

---

## Real World Examples

**Example 1: Maria - Pre-Fundraise Sprint**
> Maria's stage is "Pre-Seed Fundraising." The AI generates a prioritized list: "Complete pitch deck (P0)", "Get 3 LOIs (P0)", "Map regulatory requirements (P1)". She drags "Complete pitch deck" to In Progress.

**Example 2: James - Weekly Planning**
> James opens the dashboard Monday morning. The AI shows "Recommended This Week" based on his Healthcare industry playbook: "Hire clinical advisor", "Map FDA pathway", "Document HIPAA compliance plan."

**Example 3: Sarah - Milestone Tracking**
> Sarah sets a milestone: "Launch beta by March 15." The AI backfills the Kanban with required tasks, each with dependencies and time estimates. She sees she's 3 tasks behind schedule.

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Quick Filters** | All, My Tasks, High Priority, Overdue |
| **Categories** | Product, Sales, Fundraising, Operations, Marketing |
| **Stage Filter** | Pre-Seed, Seed, Series A tasks |
| **Tag Filter** | Custom tags (MVP, Investor, Tech Debt) |
| **Milestones** | List of milestones with progress bars |
| **AI Suggestions** | "3 recommended tasks this week" |

### Main Panel: Work Area

| View | Content |
|------|---------|
| **Kanban View** | Three columns: Todo, In Progress, Done. Drag-and-drop cards. |
| **List View** | Sortable table with columns: Task, Priority, Due, Category, Assignee |
| **Task Card** | Title, priority badge, due date, category icon, quick actions |
| **Task Detail Modal** | Full task view with description, subtasks, AI suggestions |
| **Bulk Actions** | Select multiple → Move to column, Change priority, Archive |

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **AI Prioritizer** | "Based on your stage, focus on..." |
| **Stage Checklist** | Progress through pre-raise checklist |
| **Time Insights** | "You've completed 8 tasks this week" |
| **Blocked Detection** | "2 tasks may be blocked by dependencies" |
| **Industry Guidance** | "FinTech founders typically do X before Y" |
| **Quick Generate** | "Generate tasks for [goal]" button |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `TaskDashboard` | Main container with view toggle |
| `KanbanBoard` | Three-column drag-and-drop board |
| `KanbanColumn` | Individual column with cards |
| `TaskCard` | Draggable task card |
| `TaskListView` | Sortable table view |
| `TaskDetailModal` | Full task editor |
| `FilterSidebar` | Left panel filters |
| `AIPrioritizerPanel` | Right panel intelligence |
| `MilestoneTracker` | Progress toward milestones |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `task-generator` | "Generate tasks" button | goal, stage, industry | task[] |
| `task-prioritizer` | Auto on load, manual refresh | tasks, stage, health_score | prioritized_tasks[] |
| `industry-expert-agent` | Task generation | industry_id | stage_checklists |
| `milestone-analyzer` | Milestone set | milestone, tasks | timeline, gaps |

### Data Flow

```
User Action → Frontend State → Supabase Realtime → Other Tabs
      ↓            ↓               ↓                  ↓
  Drag card    Optimistic      UPDATE tasks       Sync views
      ↓           UI              WHERE id           ↓
  DnD handler    update      → RLS filter       Realtime sub
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `tasks` | `id`, `title`, `description`, `status`, `priority`, `category`, `due_date`, `assignee_id` | All CRUD operations |
| `milestones` | `id`, `title`, `target_date`, `progress` | Milestone creation, progress updates |
| `task_dependencies` | `task_id`, `depends_on_id` | Dependency linking |
| `ai_runs` | `action=generate_tasks`, `output_text` | AI generation |
| `playbook_runs` | `playbook_type=task_planning` | Stage-based generation |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `generate_stage_tasks` | industry-expert-agent | Gemini 3 Pro | stage_checklists |
| `prioritize_tasks` | task-prioritizer | Claude Sonnet | investor_expectations |
| `suggest_next_task` | task-generator | Gemini 3 Flash | current_stage |
| `detect_blockers` | task-prioritizer | Gemini 3 Flash | dependencies |

---

## AI Agent Behaviors

### Task Generator

- **Trigger:** "Generate tasks" button or goal input
- **Autonomy:** Act with approval (generates, user accepts)
- **Behavior:** Creates tasks from stage checklists and playbooks
- **Output:** `{ tasks: [{ title, description, priority, category, estimated_hours }] }`

### Prioritizer

- **Trigger:** Dashboard load, manual refresh, new task added
- **Autonomy:** Background (updates priority scores)
- **Behavior:** Scores tasks based on stage, deadlines, dependencies
- **Output:** `{ prioritized: [{ task_id, score, reasoning }] }`

### Stage Advisor

- **Trigger:** Right panel on load
- **Autonomy:** Suggest (shows guidance, no action)
- **Behavior:** Shows stage-appropriate focus areas
- **Output:** `{ focus_areas: [], warnings: [], next_milestone: {} }`

---

## Task Statuses & Priorities

### Statuses

| Status | Column | Meaning |
|--------|--------|---------|
| `todo` | Todo | Not started |
| `in_progress` | In Progress | Currently working on |
| `done` | Done | Completed |
| `blocked` | Todo (with badge) | Waiting on dependency |
| `archived` | Hidden | No longer relevant |

### Priorities

| Priority | Badge | AI Criteria |
|----------|-------|-------------|
| `P0` | 🔴 Red | Critical for next milestone, blocks others |
| `P1` | 🟠 Orange | Important this week, high impact |
| `P2` | 🟡 Yellow | Should do soon, medium impact |
| `P3` | 🟢 Green | Nice to have, low urgency |

---

## Acceptance Criteria

- [ ] Kanban drag-and-drop updates task status in real-time
- [ ] List view supports sorting by all columns
- [ ] AI generates relevant tasks based on industry and stage
- [ ] Priorities auto-calculate and can be manually overridden
- [ ] Filters persist across sessions
- [ ] Milestones show progress percentage
- [ ] Blocked tasks show dependency chain
- [ ] Mobile responsive (stacked columns on mobile)
- [ ] Bulk actions work for 10+ selected tasks
- [ ] Supabase Realtime syncs across tabs

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `tasks` table | ✅ Ready | RLS policies in place |
| `milestones` table | 🔄 Needed | Add to schema |
| `task-generator` edge function | 🔄 Needed | To be created |
| `task-prioritizer` edge function | 🔄 Needed | To be created |
| Supabase Realtime | ✅ Ready | Channel subscriptions |
| Drag-and-drop library | ✅ Ready | @dnd-kit recommended |
