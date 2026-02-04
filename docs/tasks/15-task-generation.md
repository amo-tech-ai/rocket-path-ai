# 107 - Task Generation

> Auto-generate actionable tasks from Coach conversations

---

| Aspect | Details |
|--------|---------|
| **Screens** | Tasks page, Coach Panel (task suggestions) |
| **Features** | Auto-task extraction, prioritization, due dates |
| **Agents** | Coach (via ai-chat) |
| **Edge Functions** | /workflow-trigger, /ai-chat |
| **Use Cases** | Convert advice into action items |
| **Real-World** | "Coach suggests 'interview 5 customers' → Task created automatically" |

---

```yaml
---
task_id: 107-TSK
title: Task Generation
diagram_ref: D-10
phase: MVP
priority: P1
status: Not Started
skill: /feature-dev
ai_model: gemini-3-flash-preview
subagents: [frontend-designer, code-reviewer]
edge_function: workflow-trigger
schema_tables: [tasks, task_suggestions]
depends_on: [104-coach-sync]
---
```

---

## Description

Automatically extract actionable tasks from Coach conversations. When the Coach gives advice like "You should interview 5 customers this week", the system creates a task with appropriate priority, category, and suggested due date. Users can accept, modify, or dismiss suggested tasks.

## Rationale

**Problem:** Advice without action items leads to inaction.
**Solution:** AI extracts tasks from conversation, creates actionable items.
**Impact:** Founders convert coaching into measurable progress.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | have tasks auto-created | I don't forget advice |
| Founder | see suggested due dates | I can prioritize |
| Founder | modify suggested tasks | they fit my schedule |
| System | track task completion | I can measure progress |

## Real-World Example

> Coach: "Based on your validation score, I recommend you:
> 1. Interview 5 potential customers this week
> 2. Create a landing page to test demand
> 3. Research your top 3 competitors"
>
> System creates 3 task suggestions. Founder accepts all,
> modifies due date on #2, and starts working.

---

## Goals

1. **Primary:** Extract tasks from Coach messages
2. **Secondary:** Suggest priority and due dates
3. **Quality:** >80% task relevance (user accepts)

## Acceptance Criteria

- [ ] Tasks auto-extracted from Coach advice
- [ ] Task suggestions appear in Coach panel
- [ ] User can accept/modify/dismiss suggestions
- [ ] Accepted tasks appear on Tasks page
- [ ] Tasks have category, priority, due date
- [ ] Task completion updates Coach context
- [ ] Tasks linked to startup_id

---

## Schema

### Table: task_suggestions

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| startup_id | uuid | FK → startups |
| message_id | uuid | FK → chat_messages |
| title | text | NOT NULL |
| description | text | |
| category | text | CHECK IN ('validation', 'product', 'marketing', 'sales', 'fundraising') |
| priority | text | CHECK IN ('high', 'medium', 'low') |
| suggested_due | date | |
| status | text | CHECK IN ('pending', 'accepted', 'dismissed') |
| created_at | timestamptz | default now() |

### Table: tasks (extend existing)

| Column | Type | Constraints |
|--------|------|-------------|
| suggestion_id | uuid | FK → task_suggestions, nullable |
| source | text | CHECK IN ('manual', 'coach', 'system') |

---

## Task Extraction Prompt

```typescript
const TASK_EXTRACTION_PROMPT = `
Analyze this Coach message and extract actionable tasks.

Message: {message}

For each task, provide:
- title: Clear action item (start with verb)
- description: Brief context
- category: validation | product | marketing | sales | fundraising
- priority: high | medium | low
- suggested_days: Number of days to complete (1-30)

Return JSON array. Only extract clear, actionable items.
`;
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/xxx_task_suggestions.sql` | Create |
| Types | `src/types/tasks.ts` | Modify |
| Hook | `src/hooks/useTaskSuggestions.ts` | Create |
| Component | `src/components/coach/TaskSuggestions.tsx` | Create |
| Component | `src/components/tasks/TaskCard.tsx` | Modify |
| Edge Function | `supabase/functions/workflow-trigger/index.ts` | Modify |
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify (add extraction) |

---

## UI Component

```
┌─────────────────────────────────────┐
│ 💡 Suggested Tasks                  │
├─────────────────────────────────────┤
│ ☐ Interview 5 customers             │
│   📅 Due: Feb 11 | 🏷️ Validation   │
│   [Accept] [Edit] [Dismiss]         │
├─────────────────────────────────────┤
│ ☐ Create landing page               │
│   📅 Due: Feb 14 | 🏷️ Marketing    │
│   [Accept] [Edit] [Dismiss]         │
└─────────────────────────────────────┘
```

---

## Task Categories

| Category | Icon | Example Tasks |
|----------|------|---------------|
| Validation | 🔍 | Customer interviews, surveys |
| Product | 🛠️ | Build MVP, add features |
| Marketing | 📣 | Landing page, content, ads |
| Sales | 💰 | Outreach, demos, closing |
| Fundraising | 🚀 | Deck, investor meetings |

---

## Priority Rules

| Signal | Priority |
|--------|----------|
| "immediately", "urgent", "critical" | High |
| "this week", "soon", "should" | Medium |
| "eventually", "consider", "might" | Low |
| Validation tasks (no customers yet) | High |
| Optimization tasks | Low |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No actionable items in message | Don't show suggestions |
| Duplicate task suggested | Detect and skip |
| User dismisses all suggestions | Don't re-suggest same tasks |
| Task overdue | Show in red, allow reschedule |

---

## Verification

```bash
npm run lint
npm run typecheck
npm run build

# Manual testing
- Send Coach message with clear advice
- Verify task suggestions appear
- Accept a task, verify it shows on Tasks page
- Dismiss a task, verify it doesn't reappear
- Complete a task, verify Coach knows
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Task components | `src/components/tasks/` |
| AI extraction | `supabase/functions/ai-chat/` |
| Workflow triggers | `supabase/functions/workflow-trigger/` |
