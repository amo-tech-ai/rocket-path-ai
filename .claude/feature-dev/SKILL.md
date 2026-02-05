---
name: feature-dev
description: Guided feature development with codebase understanding and architecture focus. Use when building new features that touch multiple files, require architectural decisions, or need thorough planning. Triggers on /feature-dev command or requests like "build a new feature", "implement [feature]", "add [functionality]".
---

# Feature Development Workflow

A systematic 7-phase approach to building features. Instead of jumping into code, this workflow guides you through understanding the codebase, clarifying requirements, designing architecture, and ensuring quality.

## The 7 Phases

### Phase 1: Discovery
Understand what needs to be built:
- Clarify feature request if unclear
- Identify constraints and requirements
- Confirm understanding with user

### Phase 2: Codebase Exploration
Launch code-explorer agents to understand:
- Similar features and patterns
- Architecture and abstractions
- Related implementations

### Phase 3: Clarifying Questions
Fill in gaps and resolve ambiguities:
- Edge cases
- Error handling
- Integration points
- Performance needs

### Phase 4: Architecture Design
Design implementation approaches:
- Launch code-architect agents
- Compare trade-offs
- Recommend best approach
- Get user approval

### Phase 5: Implementation
Build the feature:
- Read all relevant files
- Follow chosen architecture
- Match codebase conventions
- Track progress with todos

### Phase 6: Quality Review
Ensure code quality:
- Launch code-reviewer agents
- Identify bugs and issues
- Check conventions
- Address findings

### Phase 7: Summary
Document what was accomplished:
- What was built
- Key decisions
- Files modified
- Next steps

## Agents

See agent definitions in the agents/ directory:
- [agents/code-explorer.md](agents/code-explorer.md) - Traces execution paths and maps architecture
- [agents/code-architect.md](agents/code-architect.md) - Designs implementation blueprints
- [agents/code-reviewer.md](agents/code-reviewer.md) - Reviews for bugs and quality

## When to Use

**Use for:**
- New features touching multiple files
- Features requiring architectural decisions
- Complex integrations with existing code
- Unclear requirements

**Don't use for:**
- Single-line bug fixes
- Trivial changes
- Urgent hotfixes

## Detailed References

- [references/workflow-patterns.md](references/workflow-patterns.md) - Workflow best practices
- [references/architecture-decisions.md](references/architecture-decisions.md) - ADR patterns
