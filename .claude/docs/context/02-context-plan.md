# Context Engineering Best Practices for Claude Code

**Date:** 2026-01-31
**Source:** [Anthropic Engineering - Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
**Status:** ACTIONABLE GUIDE

---

## The Core Constraint

> "Claude's context window fills up fast, and performance degrades as it fills."

Context is THE constraint. Everything else flows from it.

**Key insight:** A 200K token window stuffed with noise performs worse than a 50K window with focused, relevant information. Signal-to-noise ratio matters more than total capacity.

---

## The Science: Why Context Degrades

### Transformer Architecture Reality
- Every token attends to every other token (n² relationships)
- As context grows, attention gets "stretched thinner"
- Models trained on shorter sequences have fewer specialized parameters for long-range dependencies
- Position encoding interpolation allows longer sequences but with degradation

### Context Rot Research
- Performance degrades **gradually**, not catastrophically
- Recall accuracy drops as token count increases
- Models lose track of earlier instructions
- Hallucinations increase when context is polluted with failed attempts

---

## Core Principles

### 1. Minimize Tokens, Maximize Signal

> "Find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."

This means ruthless curation, not brevity for brevity's sake.

**DO:**
- Include only information that prevents mistakes
- Use specific file paths over vague descriptions
- Provide canonical examples over exhaustive rule lists

**DON'T:**
- Dump entire files when you need one function
- Keep failed attempts in context
- Include historical context that doesn't affect current work

### 2. Right Altitude for Instructions

| Level | Problem | Example |
|-------|---------|---------|
| Too specific | Brittle, breaks easily | "Always use `useState` for form fields" |
| Too vague | Assumes false shared context | "Write clean code" |
| Optimal | Specific enough to guide, flexible enough to adapt | "Use React hooks for state; prefer controlled components for forms" |

### 3. Just-In-Time Context Retrieval

**Instead of:** Pre-loading all potentially relevant data
**Do this:** Maintain lightweight identifiers, load dynamically

```
Bad:  "Here's our entire auth system: [5000 lines]"
Good: "Auth system is in src/hooks/useAuth.ts - read it when needed"
```

Benefits:
- Storage efficiency
- Progressive disclosure (discover context incrementally)
- Self-managed focus on relevant subsets

---

## The Optimal Workflow

```
┌─────────────────────────────────────────────────────────┐
│  1. EXPLORE (Plan Mode)                                 │
│     - Point Claude at relevant code                     │
│     - Ask it to understand architecture                 │
│     - Let it read without acting                        │
│     Context cost: LOW (targeted reads)                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  2. PLAN (Plan Mode)                                    │
│     - Propose approach based on exploration             │
│     - Poke holes, ask about edge cases                  │
│     - Iterate on plan (cheap to fix here)              │
│     Context cost: LOW (conversation only)               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  3. IMPLEMENT (Normal Mode)                             │
│     - Execute the agreed plan                           │
│     - Make changes incrementally                        │
│     - Verify after each significant change              │
│     Context cost: MEDIUM (code + tool outputs)          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  4. COMMIT                                              │
│     - Generate meaningful commit message                │
│     - /clear before next unrelated task                 │
│     Context cost: RESET                                 │
└─────────────────────────────────────────────────────────┘
```

**Key insight:** Planning is cheap, implementation is expensive. Every minute in Plan Mode saves multiple minutes debugging.

---

## Context Management Techniques

### Technique 1: Aggressive Context Hygiene

| Signal | Action |
|--------|--------|
| Switching to unrelated task | `/clear` |
| Session getting long | `/compact` |
| Multiple failed corrections | `/clear` + restate fresh |
| Exploring extensively | Use subagent instead |

### Technique 2: Compaction Strategy

When running `/compact`, specify what to preserve:

```
/compact Focus on: 1) modified files list, 2) current task objective,
3) test commands run, 4) any error messages being debugged
```

**Tuning:** Maximize recall first, then improve precision by eliminating superfluous content.

### Technique 3: Subagent Delegation

Subagents run in **separate context windows** and return condensed summaries (1,000-2,000 tokens).

**Use subagents for:**
- Codebase exploration
- Security reviews
- Research tasks
- Parallel investigation

**Example:**
```
"Use a subagent to investigate how our auth system handles token refresh"
```

The subagent explores, reads files, and reports back without polluting your main context.

### Technique 4: Structured Note-Taking

For long-horizon tasks, maintain persistent notes outside the context window:

```markdown
# Task: Implement OAuth Flow

## Progress
- [x] Explored existing auth (src/hooks/useAuth.ts)
- [x] Planned approach (Google + LinkedIn)
- [ ] Implement Google OAuth
- [ ] Implement LinkedIn OAuth

## Key Decisions
- Using Supabase OAuth, not custom
- Storing tokens in httpOnly cookies

## Blockers
- Need GOOGLE_CLIENT_ID env var
```

Notes get reloaded when resuming, enabling tracking across complex tasks.

---

## CLAUDE.md Best Practices

### The Filter Test

> "For each line, ask: Would removing this cause Claude to make mistakes? If not, cut it."

### What Belongs

```markdown
# CLAUDE.md (Optimal: 20-50 lines)

## Commands
npm run dev          # Dev server (port 8082)
npm run build        # MUST pass before commits
npm run test         # Vitest

## Architecture (only non-obvious parts)
- @/ alias maps to ./src/
- Edge functions use Deno, not Node
- RLS enforces data isolation

## Conventions (only if Claude would guess wrong)
- Named exports, not default exports
- Protected routes use <ProtectedRoute>
```

### What Doesn't Belong

| Don't Include | Why |
|---------------|-----|
| What the app does | Claude can infer from code |
| History of decisions | Doesn't affect current work |
| Aspirational standards | Only include enforced rules |
| Standard language conventions | Claude already knows |
| File-by-file descriptions | Claude can explore |

### Nested CLAUDE.md Files

Use subdirectory CLAUDE.md for area-specific context:
- `src/api/CLAUDE.md` - API conventions
- `supabase/functions/CLAUDE.md` - Edge function patterns

---

## Tool Design for Context Efficiency

### Principles

1. **Self-contained tools**: Clear in purpose, no overlapping functionality
2. **Descriptive parameters**: Unambiguous input names
3. **Token-efficient returns**: Summarized outputs, not raw dumps
4. **Progressive navigation**: Encourage incremental discovery

### Bad Tool Design
```
get_all_files() -> returns entire directory tree (10,000 tokens)
```

### Good Tool Design
```
list_directory(path, depth=1) -> returns immediate children (100 tokens)
read_file(path, lines="1-50") -> returns specific section (200 tokens)
```

---

## Five Failure Patterns to Avoid

### 1. Kitchen Sink Session
**Symptom:** Context from Task A pollutes work on Task B
**Fix:** `/clear` between unrelated tasks

### 2. Correction Spiral
**Symptom:** Multiple failed attempts clog context
**Fix:** After 2 failed corrections, `/clear` and restate fresh

### 3. Over-Specified CLAUDE.md
**Symptom:** Important rules lost in 500+ lines of instructions
**Fix:** Cut to 20-50 lines of mistake-preventing info only

### 4. Trust-Then-Verify Gap
**Symptom:** Discover wrong direction 18 minutes into 20-minute task
**Fix:** Check in frequently, use Plan Mode, verify incrementally

### 5. Infinite Exploration
**Symptom:** Claude reads 200 files trying to be thorough
**Fix:** Be specific about what to read, use subagents for exploration

---

## Verification as Context Leverage

> "Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do."

### Verification Stack

| Change Type | Verification | Command |
|-------------|--------------|---------|
| Code | Build + Lint | `npm run build && npm run lint` |
| Logic | Tests | `npm run test -- --run <file>` |
| Types | Type check | `tsc --noEmit` |
| UI | Screenshot | Claude Chrome extension |
| API | Expected output | Provide input/output pairs |
| Database | RLS check | Test authenticated + unauthenticated |

Verification tightens the feedback loop from "you notice mistakes" to "Claude notices mistakes."

---

## Context Metrics to Track

| Metric | Warning Sign | Action |
|--------|--------------|--------|
| Compactions per session | > 2 | Break into smaller tasks |
| Corrections before success | > 2 | `/clear` and restate |
| Files read per task | > 10 | Use subagents |
| Session length | > 1 hour | Consider fresh session |
| CLAUDE.md size | > 100 lines | Prune aggressively |

---

## Implementation Checklist for StartupAI

### Immediate Actions

- [ ] **Prune CLAUDE.md** - Apply the filter test, target 30-50 lines
- [ ] **Add verification section** - Build/lint/test commands
- [ ] **Configure compaction instructions** - What to preserve

### Session Habits

- [ ] **Start in Plan Mode** for non-trivial tasks
- [ ] **`/clear` between tasks** - Make this automatic
- [ ] **Use subagents for exploration** - Preserve main context
- [ ] **Verify incrementally** - Don't wait until the end

### Structural Improvements

- [ ] **Create exploration subagent** - Haiku model, read-only
- [ ] **Add verification hooks** - Auto-lint after edits
- [ ] **Document compaction preferences** - In CLAUDE.md

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────┐
│  CONTEXT ENGINEERING QUICK REFERENCE                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  BEFORE STARTING                                       │
│  □ Clear previous context: /clear                      │
│  □ State single task objective                         │
│  □ Use Plan Mode for complex tasks                     │
│                                                        │
│  DURING WORK                                           │
│  □ Read specific files, not directories                │
│  □ Verify after each significant change                │
│  □ Use subagents for exploration                       │
│  □ Course-correct at first sign of drift               │
│                                                        │
│  CONTEXT GETTING FULL?                                 │
│  □ /compact with preservation instructions             │
│  □ Or finish current task and /clear                   │
│                                                        │
│  AFTER COMPLETION                                      │
│  □ Final verification: npm run build && npm run lint   │
│  □ /clear before next unrelated task                   │
│                                                        │
│  RED FLAGS                                             │
│  ⚠ Multiple failed corrections → /clear + restate     │
│  ⚠ Reading many files → Use subagent instead          │
│  ⚠ Pivoting to new task → /clear first                │
│  ⚠ Context auto-compacting → Finish task soon         │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **Context is THE constraint** - Everything flows from managing it well
2. **Signal > Tokens** - Ruthlessly curate for relevance
3. **Plan Mode first** - Cheap exploration, expensive implementation
4. **Subagents for exploration** - Preserve main context
5. **Verify incrementally** - Catch mistakes early
6. **`/clear` aggressively** - Fresh context beats polluted context
7. **CLAUDE.md stays lean** - Only mistake-preventing info

---

**Document Author:** Claude Opus 4.5
**Source:** Anthropic Engineering Blog + Claude Code Best Practices
**Status:** ACTIONABLE - Apply these practices immediately
