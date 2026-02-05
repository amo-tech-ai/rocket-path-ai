---
description: Create task documentation for a new feature or task
---

# Dev Docs - Create Task Documentation

Create structured documentation for a new development task.

## Task: $ARGUMENTS

## Create Three Files

### 1. Plan Document (`tasks/[task-name]-plan.md`)
```markdown
# [Task Name] - Implementation Plan

## Goal
[What we're building and why]

## Approach
[High-level strategy]

## Files to Create/Modify
- [ ] file1.tsx - Description
- [ ] file2.ts - Description

## Technical Decisions
- Decision 1: [choice] because [reason]

## Open Questions
- [ ] Question 1
```

### 2. Context Document (`tasks/[task-name]-context.md`)
```markdown
# [Task Name] - Context

## Key Files
- `path/to/file.tsx` - Purpose
- `path/to/other.ts` - Purpose

## Patterns to Follow
- Pattern from existing code

## Constraints
- Must work with X
- Cannot break Y
```

### 3. Tasks Checklist (`tasks/[task-name]-tasks.md`)
```markdown
# [Task Name] - Tasks

## Phase 1: Setup
- [ ] Task 1
- [ ] Task 2

## Phase 2: Implementation
- [ ] Task 3
- [ ] Task 4

## Phase 3: Testing
- [ ] Task 5

## Phase 4: Cleanup
- [ ] Task 6
```

## Instructions

1. Ask clarifying questions about the task if needed
2. Create the `tasks/` directory if it doesn't exist
3. Generate all three documents based on the task description
4. Keep documents concise but complete
