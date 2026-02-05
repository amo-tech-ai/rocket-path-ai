# Best Practices Implementation Plan

**Date:** 2026-01-31
**Status:** PLANNING
**Reference:** `/home/sk/startupai16L/.claude/docs/best-practices.md`

---

## Executive Summary

This plan audits our current Claude Code setup against official best practices and provides actionable improvements to maximize effectiveness, reduce context waste, and improve verification.

---

## Current State Audit

### What We're Doing Well

| Practice | Status | Evidence |
|----------|--------|----------|
| Concise CLAUDE.md | PASS | ~80 lines, focused content |
| Bash commands documented | PASS | `npm run dev/build/lint/test` |
| Import patterns | PASS | `@/` alias documented |
| Critical rules | PASS | 5 clear rules |
| Context management section | PASS | DO/DON'T lists |
| Skills exist | PASS | 15+ skills in `.claude/` |
| Ignore patterns | PASS | 11 patterns in settings.json |

### Gaps Identified

| Gap | Severity | Impact |
|-----|----------|--------|
| No verification criteria | HIGH | Claude can't self-check work |
| Empty permissions config | MEDIUM | Excessive permission prompts |
| No hooks | MEDIUM | No enforced behaviors |
| No custom subagents | LOW | Manual delegation required |
| No compaction instructions | MEDIUM | Context loss during compaction |
| No Plan Mode guidance | LOW | May skip planning phase |

---

## Implementation Plan

### Phase 1: Verification Enhancement (HIGH PRIORITY)

**Goal:** Give Claude ways to verify its work.

#### 1.1 Add Verification Section to CLAUDE.md

```markdown
## Verification

Always verify changes:
- **Code changes:** `npm run build && npm run lint`
- **Tests:** `npm run test -- --run <file>`
- **UI changes:** Take screenshot, compare to design
- **Edge functions:** `supabase functions serve` + test with curl
- **Database:** Check RLS policies after schema changes
```

#### 1.2 Create Verification Skill

Create `.claude/skills/verification/SKILL.md`:
```markdown
---
name: verification
description: Verification checklist for different change types
---
# Verification Checklist

## After Code Changes
1. Run `npm run build` - must pass
2. Run `npm run lint` - must pass
3. Run `npm run test -- --run` for affected tests

## After UI Changes
1. Take screenshot using Claude Chrome
2. Compare to design/mockup
3. Check responsive at 768px, 1024px, 1440px

## After Database Changes
1. Check RLS policies exist
2. Test with authenticated user
3. Test with unauthenticated user (should fail)

## After Edge Functions
1. Deploy with `supabase functions deploy <name>`
2. Test with curl including JWT
3. Check logs with `supabase functions logs`
```

---

### Phase 2: Permission Configuration (MEDIUM PRIORITY)

**Goal:** Reduce permission interruptions for safe commands.

#### 2.1 Update settings.json

```json
{
  "permissions": {
    "allow": [
      "npm run dev",
      "npm run build",
      "npm run lint",
      "npm run test*",
      "git status",
      "git diff*",
      "git log*",
      "git branch*",
      "supabase functions list",
      "supabase functions logs*",
      "supabase gen types typescript*"
    ],
    "deny": [
      "rm -rf*",
      "git push --force*",
      "git reset --hard*",
      "supabase db reset"
    ]
  },
  "ignorePatterns": [
    "pm/**",
    "tasks/prompts/**",
    "tasks/data/**",
    "tasks/testing/**",
    "knowledge/**",
    "docs/plans/**",
    "archive/**",
    "*.log",
    "*.jsonl",
    "node_modules/**",
    "dist/**",
    ".next/**",
    "screenshots/**",
    "figma/**",
    ".backup*/**"
  ]
}
```

---

### Phase 3: Hooks Implementation (MEDIUM PRIORITY)

**Goal:** Enforce behaviors deterministically.

#### 3.1 Post-Edit Lint Hook

Create `.claude/hooks/post-edit-lint.sh`:
```bash
#!/bin/bash
# Run lint after TypeScript file edits
if [[ "$CLAUDE_EDIT_FILE" == *.ts ]] || [[ "$CLAUDE_EDIT_FILE" == *.tsx ]]; then
  npm run lint --silent 2>/dev/null || echo "Lint issues detected"
fi
```

#### 3.2 Pre-Commit Verification Hook

Create `.claude/hooks/pre-commit.sh`:
```bash
#!/bin/bash
# Verify build passes before commits
npm run build --silent || {
  echo "BUILD FAILED - Fix errors before committing"
  exit 1
}
```

#### 3.3 Update settings.json hooks section

```json
{
  "hooks": {
    "postEdit": [".claude/hooks/post-edit-lint.sh"],
    "preCommit": [".claude/hooks/pre-commit.sh"]
  }
}
```

---

### Phase 4: Subagents Creation (LOW PRIORITY)

**Goal:** Delegate specialized tasks to preserve context.

#### 4.1 Security Reviewer Agent

Create `.claude/agents/security-reviewer.md`:
```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob
model: sonnet
---
You are a security engineer reviewing StartupAI code.

Check for:
- SQL injection (use Supabase RLS, not raw queries)
- XSS (sanitize user input in React)
- Auth bypass (verify JWT in edge functions)
- Exposed secrets (no hardcoded keys)
- CORS misconfigurations
- Missing RLS policies

Provide specific file:line references and fixes.
```

#### 4.2 Code Explorer Agent

Create `.claude/agents/code-explorer.md`:
```markdown
---
name: code-explorer
description: Explores codebase to answer questions
tools: Read, Grep, Glob, Bash
model: haiku
---
You explore the StartupAI codebase to answer questions.

Key areas:
- src/hooks/ - React hooks
- src/components/ - UI components
- src/pages/ - Route pages
- supabase/functions/ - Edge functions

Return concise summaries, not full file contents.
```

---

### Phase 5: CLAUDE.md Enhancements (MEDIUM PRIORITY)

**Goal:** Add missing best practices guidance.

#### 5.1 Proposed CLAUDE.md v3.0

```markdown
# CLAUDE.md

> **Updated:** 2026-01-31 | **Version:** 3.0 (Best Practices)

## Project Overview

StartupAI - AI-powered OS for startup founders.
React/TS SPA + Vite + Supabase (Auth, RLS, Edge Functions) + shadcn/ui.

## Commands

```bash
npm run dev          # Vite dev (port 8082)
npm run build        # Production build - RUN BEFORE COMMITS
npm run lint         # ESLint
npm run test         # Vitest
```

## Quick Reference

- **Path alias:** `@/` -> `./src/`
- **Env vars:** `import.meta.env.VITE_*` only
- **Auth:** Protected routes use `<ProtectedRoute>`
- **Supabase types:** @src/integrations/supabase/types.ts

## Verification (IMPORTANT)

Every change must be verified:
| Change Type | Verification Command |
|-------------|---------------------|
| Code | `npm run build && npm run lint` |
| Tests | `npm run test -- --run` |
| Schema | Check RLS in Supabase dashboard |
| Edge Function | `curl` test with JWT |

## Context Management

**Session hygiene:**
- `/clear` between unrelated tasks
- One task per session
- `/compact` with "preserve modified files list"

**Scoped exploration:**
- Use subagents for codebase exploration
- Read specific files, not entire directories
- Ask targeted questions

## Compaction Instructions

When compacting, ALWAYS preserve:
- List of modified files
- Test commands that were run
- Any error messages being debugged
- Current task objective
```

---

### Phase 6: Session Workflow Documentation

**Goal:** Document optimal session patterns.

#### 6.1 Create Session Workflow Skill

Create `.claude/skills/session-workflow/SKILL.md`:
```markdown
---
name: session-workflow
description: Optimal Claude Code session patterns
---
# Session Workflow

## Starting a Session
1. State the single task objective clearly
2. For complex tasks, use Plan Mode first
3. Reference specific files with @path/to/file

## During Implementation
1. Make changes incrementally
2. Verify after each significant change
3. Course-correct early if going off track

## Ending a Session
1. Run full verification: `npm run build && npm run lint`
2. Summarize what was done
3. Note any follow-up tasks
4. `/clear` before next unrelated task

## Context Signals
- "Context filling up" -> `/compact` or finish task
- "Multiple corrections" -> `/clear` and restate better
- "Exploring extensively" -> Use subagent instead
```

---

## Implementation Checklist

| Phase | Task | Priority | Status |
|-------|------|----------|--------|
| 1.1 | Add verification section to CLAUDE.md | HIGH | [ ] |
| 1.2 | Create verification skill | HIGH | [ ] |
| 2.1 | Configure permissions in settings.json | MEDIUM | [ ] |
| 3.1 | Create post-edit lint hook | MEDIUM | [ ] |
| 3.2 | Create pre-commit verification hook | MEDIUM | [ ] |
| 4.1 | Create security-reviewer agent | LOW | [ ] |
| 4.2 | Create code-explorer agent | LOW | [ ] |
| 5.1 | Update CLAUDE.md to v3.0 | MEDIUM | [ ] |
| 6.1 | Create session-workflow skill | LOW | [ ] |

---

## Expected Outcomes

After implementation:

1. **Reduced errors:** Claude verifies its own work
2. **Fewer interruptions:** Safe commands pre-approved
3. **Better context usage:** Subagents handle exploration
4. **Enforced quality:** Hooks guarantee verification
5. **Cleaner sessions:** Clear workflow guidance

---

## Metrics to Track

| Metric | Current | Target |
|--------|---------|--------|
| Permission prompts per session | ~10-15 | < 5 |
| Build failures caught post-change | Manual | Automatic |
| Context compactions per session | Variable | < 2 |
| Failed implementations (rework) | ~20% | < 10% |

---

## Next Steps

1. Review and approve this plan
2. Implement Phase 1 (HIGH priority) immediately
3. Schedule Phases 2-3 (MEDIUM) for next session
4. Phases 4-6 (LOW) can be done incrementally

---

**Plan Author:** Claude Opus 4.5
**Plan Status:** READY FOR REVIEW
