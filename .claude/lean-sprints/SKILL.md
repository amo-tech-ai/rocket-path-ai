---
name: lean-sprints
description: Use this skill when implementing Lean Sprint planning - 2-week cycles, sprint goals, retrospectives, and 90-day macro-cycles. Triggers on "sprint", "2-week cycle", "retrospective", "sprint planning", "90-day cycle".
---

# Lean Sprints

## Overview

Implement the Lean Sprint system with 2-week execution cycles, focused goals, daily standups, and 90-day macro-cycles with pivot/persevere decisions.

## When to Use

- Building sprint planning UI
- Creating sprint goal generation
- Implementing retrospective workflows
- Designing 90-day macro-cycles
- Generating sprint tasks from experiments

## Sprint Cycle (2 Weeks)

```
WEEK 1: EXPOSE & DEFINE
├── Day 1-2: Expose Problems
│   └── Align on constraints, blockers
├── Day 3-4: Define Solutions
│   └── Individual strategy proposals
└── Day 5: Shortlist
    └── Rank by evidence, select focus

WEEK 2: TEST & DECIDE
├── Day 6-9: Test
│   └── Run experiments, collect data
└── Day 10: Decide
    └── Analyze, plan next sprint
```

## 90-Day Macro-Cycle

```
Sprint 1 (Week 1-2)
    ↓
Sprint 2 (Week 3-4)
    ↓
Sprint 3 (Week 5-6)
    ↓
Sprint 4 (Week 7-8)
    ↓
Sprint 5 (Week 9-10)
    ↓
RETROSPECTIVE (Week 11-12)
    ↓
PIVOT / PERSEVERE DECISION
```

## Sprint Goal Generation

```typescript
interface SprintGoal {
  hypothesis: string;      // What we believe
  experiment: string;      // How we test it
  success_criteria: string; // How we measure
  tasks: Task[];           // What to do
}

function generateSprintGoal(
  assumptions: Assumption[],
  stage: Stage
): SprintGoal {
  // Pick highest-risk assumption
  // Design minimum experiment
  // Generate 5-8 tasks
}
```

## Retrospective Template

```markdown
## Sprint X Retrospective

### What We Learned
- [Key insight 1]
- [Key insight 2]

### What Worked
- [Success 1]

### What Didn't Work
- [Challenge 1]

### Experiments Run
| Experiment | Result | Decision |
|------------|--------|----------|
| [Name] | [Pass/Fail] | [Next step] |

### Next Sprint Focus
- [Primary goal]
```

## Edge Function: `sprint-planner`

```typescript
// Actions
- 'generate_goal': Create sprint goal from assumptions
- 'create_tasks': Generate sprint tasks
- 'run_retro': Facilitate retrospective
- 'decide_pivot': Recommend pivot/persevere
```

## AI Model Selection

| Task | Model |
|------|-------|
| Goal generation | `gemini-3-flash-preview` |
| Task creation | `gemini-3-flash-preview` |
| Retrospective analysis | `gemini-3-pro-preview` |
| Pivot decision | `claude-sonnet-4-5-20250929` |

## References

- Strategy Section 6: Lean Sprints
- Master Prompt: LEAN_METHODOLOGY
- `/tasks/startup-system/startupai-strategy.md`
