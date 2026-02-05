# Auto-Claude Prompt Format Guide

This guide defines the standard structure for Auto-Claude agent prompts. All prompts are Markdown (`.md`) files located in `apps/backend/prompts/`.

## Overview

Auto-Claude agents use structured prompts that guide autonomous behavior. Each prompt defines:
- **Role & Responsibility** - What the agent does
- **Contract** - Inputs and outputs
- **Phases/Steps** - Sequential workflow
- **Verification** - Quality gates
- **Critical Rules** - Non-negotiable requirements

---

## Standard Template Structure

```markdown
## YOUR ROLE - [AGENT_NAME]

You are the **[Agent Name]** in the Auto-Build framework. Your job is to [brief description].

**Key Principle**: [One sentence guiding the agent's behavior]

---

## WHY [CONTEXT] MATTERS

[Explain the importance of this agent's role - helps the agent understand priority]

---

## YOUR CONTRACT

**Inputs** (read these files):
- `input_file.json` - [description]
- `context.json` - [description]

**Output**: `output_file.ext` - [description]

**MANDATORY**: You MUST create `output_file.ext` with ALL required sections.

**DO NOT** interact with the user. [or] **DO** ask clarifying questions.

---

## PHASE 0: LOAD CONTEXT (MANDATORY)

\`\`\`bash
# 1. Read input files
cat input_file.json

# 2. Check project structure
ls -la

# 3. Read specific configs
cat package.json 2>/dev/null || echo "Not found"
\`\`\`

---

## PHASE 1: [PHASE NAME]

### 1.1: [Sub-step]

[Instructions for this sub-step]

\`\`\`bash
# Example commands
find . -name "*.ts" | head -20
\`\`\`

### 1.2: [Sub-step]

[Instructions continue...]

---

## PHASE N: CREATE [OUTPUT] (MANDATORY)

**CRITICAL: You MUST use the Write tool to create this file.**

[Schema or template for the output file]

---

## VERIFICATION

Before completing:
1. Is valid JSON/Markdown?
2. Are required fields present?
3. Do all tests pass?

---

## CRITICAL RULES

1. **[Rule Name]**: [Description]
2. **[Rule Name]**: [Description]
3. **Write to Output Directory**: Use the path provided in context

---

## BEGIN

Run Phase 0 (Load Context) now.
```

---

## Key Components Explained

### 1. Role Definition

Always start with a clear role statement:

```markdown
## YOUR ROLE - PLANNER AGENT (Session 1 of Many)

You are the **first agent** in an autonomous development process. Your job is to create a subtask-based implementation plan.

**Key Principle**: Subtasks, not tests. Implementation order matters.
```

**Guidelines:**
- Use `## YOUR ROLE - [NAME]` as the opening header
- Include session context if applicable (e.g., "Session 1 of Many")
- State the key principle in one sentence
- Bold important terms

### 2. Context Section (WHY)

Explain why this agent's role matters:

```markdown
## WHY SUBTASKS, NOT TESTS?

Tests verify outcomes. Subtasks define implementation steps.

For a multi-service feature like "Add user analytics":
- **Tests** would ask: "Does the dashboard show data?" (But HOW?)
- **Subtasks** say: "First build the API, then the worker, then the dashboard."
```

**Guidelines:**
- Use concrete examples
- Contrast wrong approaches with correct ones
- Help the agent prioritize

### 3. Contract Section

Define explicit inputs and outputs:

```markdown
## YOUR CONTRACT

**Inputs** (read these files):
- `project_index.json` - Project structure
- `requirements.json` - User requirements
- `context.json` - Relevant files discovered

**Output**: `spec.md` - Complete specification document

**MANDATORY**: You MUST create `spec.md` with ALL required sections.
```

**Guidelines:**
- List all input files explicitly
- Specify the output file name
- Mark mandatory outputs clearly

### 4. Phases/Steps

Use numbered phases for sequential workflows:

```markdown
## PHASE 0: LOAD CONTEXT (MANDATORY)

Always start by reading context files.

## PHASE 1: ANALYZE

Process and understand the context.

## PHASE 2: IMPLEMENT

Create the required outputs.

## PHASE 3: VERIFY

Validate the work before completion.
```

For multi-step workflows within phases, use sub-numbers:

```markdown
## STEP 5: READ SUBTASK CONTEXT

### 5.1: Read Files to Modify

\`\`\`bash
cat [path/to/file]
\`\`\`

### 5.2: Read Pattern Files

\`\`\`bash
cat [path/to/pattern/file]
\`\`\`

### 5.3: Look Up External Documentation (Use Context7)

[Instructions for using MCP tools]
```

### 5. Environment Awareness

For agents working in restricted filesystems:

```markdown
## CRITICAL: ENVIRONMENT AWARENESS

**Your filesystem is RESTRICTED to your working directory.**

**RULES:**
1. ALWAYS use relative paths starting with `./`
2. NEVER use absolute paths (like `/Users/...`)
3. NEVER assume paths exist - check with `ls` first
```

### 6. Bash Command Blocks

Provide explicit commands agents should run:

```markdown
\`\`\`bash
# 1. See your working directory
pwd && ls -la

# 2. Find spec files
find . -name "implementation_plan.json" -type f 2>/dev/null | head -5

# 3. Read the plan
cat ./path/to/implementation_plan.json
\`\`\`
```

**Guidelines:**
- Include comments explaining each command
- Use error handling (`2>/dev/null`, `|| echo "Not found"`)
- Show expected outputs where helpful

---

## New Sections (2024+)

### Session Memory System

For agents that need cross-session context:

```markdown
## STEP 1: GET YOUR BEARINGS (MANDATORY)

\`\`\`bash
# 11. READ SESSION MEMORY (CRITICAL - Learn from past sessions)
echo "=== SESSION MEMORY ==="

# Read codebase map (what files do what)
if [ -f "$SPEC_DIR/memory/codebase_map.json" ]; then
  echo "Codebase Map:"
  cat "$SPEC_DIR/memory/codebase_map.json"
else
  echo "No codebase map yet (first session)"
fi

# Read patterns to follow
if [ -f "$SPEC_DIR/memory/patterns.md" ]; then
  echo -e "\nCode Patterns to Follow:"
  cat "$SPEC_DIR/memory/patterns.md"
fi

# Read gotchas to avoid
if [ -f "$SPEC_DIR/memory/gotchas.md" ]; then
  echo -e "\nGotchas to Avoid:"
  cat "$SPEC_DIR/memory/gotchas.md"
fi

echo "=== END SESSION MEMORY ==="
\`\`\`
```

**Memory Files:**
| File | Purpose |
|------|---------|
| `memory/codebase_map.json` | Maps file paths to descriptions |
| `memory/patterns.md` | Successful patterns to follow |
| `memory/gotchas.md` | Pitfalls to avoid |
| `memory/session_insights/` | Per-session learnings |

### Writing Session Insights

At the end of sessions, agents should document learnings:

```markdown
## STEP 12: WRITE SESSION INSIGHTS (OPTIONAL)

\`\`\`python
import json
from pathlib import Path
from datetime import datetime, timezone

insights = {
    "session_number": 1,
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "subtasks_completed": ["subtask-1", "subtask-2"],
    "discoveries": {
        "files_understood": {
            "path/to/file.py": "Handles authentication logic"
        },
        "patterns_found": [
            "All async functions use asyncio"
        ],
        "gotchas_encountered": [
            "Database connections must be closed explicitly"
        ]
    },
    "what_worked": ["Starting with unit tests"],
    "what_failed": ["Tried inline validation - use middleware"],
    "recommendations_for_next_session": ["Focus on integration tests"]
}

# Save to memory/session_insights/session_001.json
\`\`\`
```

### MCP Tools Integration (Context7)

For agents that need external documentation:

```markdown
### 5.4: Look Up External Library Documentation (Use Context7)

**If your subtask involves external libraries or APIs**, use Context7 to get accurate documentation BEFORE implementing.

#### When to Use Context7

Use Context7 when:
- Implementing API integrations (Stripe, Auth0, AWS, etc.)
- Using new libraries not yet in the codebase
- Unsure about correct function signatures or patterns

#### How to Use Context7

**Step 1: Find the library in Context7**
\`\`\`
Tool: mcp__context7__resolve-library-id
Input: { "libraryName": "[library name]" }
\`\`\`

**Step 2: Get relevant documentation**
\`\`\`
Tool: mcp__context7__get-library-docs
Input: {
  "context7CompatibleLibraryID": "[library-id]",
  "topic": "[specific feature]",
  "mode": "code"
}
\`\`\`

**This prevents:**
- Using deprecated APIs
- Wrong function signatures
- Missing required configuration
```

### Self-Critique Checklist

Quality gates before marking work complete:

```markdown
## STEP 6.5: RUN SELF-CRITIQUE (MANDATORY)

**CRITICAL:** Before marking a subtask complete, you MUST run through the self-critique checklist.

### Critique Checklist

#### 1. Code Quality Check

**Pattern Adherence:**
- [ ] Follows patterns from reference files exactly
- [ ] Variable naming matches codebase conventions
- [ ] Imports organized correctly
- [ ] Code style consistent with existing files

**Error Handling:**
- [ ] Try-catch blocks where operations can fail
- [ ] Meaningful error messages
- [ ] Edge cases considered

**Code Cleanliness:**
- [ ] No console.log/print statements for debugging
- [ ] No commented-out code blocks
- [ ] No hardcoded values that should be configurable

#### 2. Implementation Completeness

- [ ] All `files_to_modify` were actually modified
- [ ] All `files_to_create` were actually created
- [ ] Subtask requirements fully met

#### 3. Final Verdict

**PROCEED:** [YES/NO]

Only YES if all critical checklist items pass.
```

### Pre-Implementation Checklist (Predictive Bug Prevention)

```markdown
## STEP 5.5: GENERATE & REVIEW PRE-IMPLEMENTATION CHECKLIST

**CRITICAL**: Before writing any code, generate a predictive bug prevention checklist.

The checklist will show:
- **Predicted Issues**: Common bugs based on work type
- **Known Gotchas**: Project-specific pitfalls from memory
- **Patterns to Follow**: Successful patterns from previous sessions
- **Files to Reference**: Example files to study

### Document Your Review

\`\`\`
## Pre-Implementation Checklist Review

**Subtask:** [subtask-id]

**Predicted Issues Reviewed:**
- [Issue 1]: Understood - will prevent by [action]
- [Issue 2]: Understood - will prevent by [action]

**Ready to implement:** YES
\`\`\`
```

### Path Confusion Prevention (Monorepos)

Critical for agents working in monorepos:

```markdown
## CRITICAL: PATH CONFUSION PREVENTION

**THE #1 BUG IN MONOREPOS: Doubled paths after `cd` commands**

### The Problem

After running `cd ./apps/frontend`, if you use `apps/frontend/src/file.ts`,
you create **doubled paths**: `apps/frontend/apps/frontend/src/file.ts`.

### The Solution: ALWAYS CHECK YOUR CWD

\`\`\`bash
# Step 1: Where am I?
pwd

# Step 2: Use paths RELATIVE TO CURRENT DIRECTORY
# If pwd shows: /project/apps/frontend
# Use: git add src/file.ts
# NOT: git add apps/frontend/src/file.ts
\`\`\`

### Mandatory Pre-Command Check

**Before EVERY git add, git commit, or file operation:**

\`\`\`bash
pwd                    # Where am I?
ls -la [target-path]   # Does this path exist?
git add [verified-path] # Only then run the command
\`\`\`
```

---

## Verification Strategies

### By Risk Level

Include verification strategy based on task complexity:

```markdown
## PHASE 3.5: DEFINE VERIFICATION STRATEGY

| Risk Level | Test Requirements | Security | Staging |
|------------|-------------------|----------|---------|
| **trivial** | Skip validation (docs only) | No | No |
| **low** | Unit tests only | No | No |
| **medium** | Unit + Integration | No | No |
| **high** | Unit + Integration + E2E | Yes | Maybe |
| **critical** | Full suite + Manual review | Yes | Yes |
```

### Verification Types

| Type | When to Use | Format |
|------|-------------|--------|
| `command` | CLI verification | `{"type": "command", "command": "...", "expected": "..."}` |
| `api` | REST endpoint testing | `{"type": "api", "method": "GET", "url": "...", "expected_status": 200}` |
| `browser` | UI rendering checks | `{"type": "browser", "url": "...", "checks": [...]}` |
| `e2e` | Full flow verification | `{"type": "e2e", "steps": [...]}` |
| `manual` | Requires human judgment | `{"type": "manual", "instructions": "..."}` |

---

## Workflow-Specific Patterns

### FEATURE Workflow

```markdown
## WORKFLOW-SPECIFIC GUIDANCE

### For FEATURE Workflow

Work through services in dependency order:
1. Backend APIs first (testable with curl)
2. Workers second (depend on backend)
3. Frontend last (depends on APIs)
4. Integration to wire everything
```

### INVESTIGATION Workflow

```markdown
### For INVESTIGATION Workflow

**Reproduce Phase**: Create reliable repro steps, add logging
**Investigate Phase**: Your OUTPUT is knowledge - document root cause
**Fix Phase**: BLOCKED until investigate phase outputs root cause
**Harden Phase**: Add tests, monitoring
```

### REFACTOR Workflow

```markdown
### For REFACTOR Workflow

**Add New Phase**: Build new system, old keeps working
**Migrate Phase**: Move consumers to new
**Remove Old Phase**: Delete deprecated code
**Cleanup Phase**: Polish
```

---

## Real Examples from Production Prompts

### Example 1: Planner Agent Opening

```markdown
## YOUR ROLE - PLANNER AGENT (Session 1 of Many)

You are the **first agent** in an autonomous development process. Your job is to create a subtask-based implementation plan that defines what to build, in what order, and how to verify each step.

**Key Principle**: Subtasks, not tests. Implementation order matters. Each subtask is a unit of work scoped to one service.

---

## WHY SUBTASKS, NOT TESTS?

Tests verify outcomes. Subtasks define implementation steps.

For a multi-service feature like "Add user analytics with real-time dashboard":
- **Tests** would ask: "Does the dashboard show real-time data?" (But HOW do you get there?)
- **Subtasks** say: "First build the backend events API, then the Celery aggregation worker, then the WebSocket service, then the dashboard component."

Subtasks respect dependencies. The frontend can't show data the backend doesn't produce.
```

### Example 2: QA Agent Context7 Validation

```markdown
## PHASE 6: CODE REVIEW

### 6.0: Third-Party API/Library Validation (Use Context7)

**CRITICAL**: If the implementation uses third-party libraries or APIs, validate usage against official documentation.

#### How to Validate with Context7

**Step 1: Identify libraries used**
\`\`\`bash
grep -rh "^import\\|^from\\|require(" [modified-files] | sort -u
\`\`\`

**Step 2: Look up each library**
\`\`\`
Tool: mcp__context7__resolve-library-id
Input: { "libraryName": "[library name]" }
\`\`\`

**Step 3: Verify API usage**
Check for:
- ✓ Correct function signatures
- ✓ Proper initialization patterns
- ✓ Required configuration
- ✓ Deprecated methods avoided
```

### Example 3: Coder Agent Git Operations

```markdown
## STEP 9: COMMIT YOUR PROGRESS

### Path Verification (MANDATORY FIRST STEP)

**BEFORE running ANY git commands:**

\`\`\`bash
# Step 1: Where am I?
pwd

# Step 2: Verify paths exist
ls -la [path-to-files]

# Step 3: Then commit
git add . ':!.auto-claude'
git commit -m "auto-claude: Complete [subtask-id] - [description]

- Files modified: [list]
- Verification: [type] - passed"
\`\`\`

**CRITICAL**: The `:!.auto-claude` pathspec ensures spec files are NEVER committed.

### DO NOT Push to Remote

All work stays local until the user reviews and approves.
```

---

## Best Practices

### 1. Be Explicit About Commands

```markdown
# BAD - Vague
Analyze the code structure.

# GOOD - Specific
\`\`\`bash
find . -name "*.ts" -type f | head -50
grep -r "class.*Component" --include="*.tsx" . | head -20
\`\`\`
```

### 2. Include Error Recovery

```markdown
## ERROR RECOVERY

If spec.md is invalid:

\`\`\`bash
# Check what sections exist
grep -E "^##" spec.md

# Append missing sections
cat >> spec.md << 'EOF'
## [Missing Section]
[Content]
EOF
\`\`\`
```

### 3. Use Tables for Structure

```markdown
## Files to Modify

| File | Service | What to Change |
|------|---------|---------------|
| `src/api/routes.py` | backend | Add new endpoint |
| `src/components/Dashboard.tsx` | frontend | Create component |
```

### 4. Mark Critical Sections Clearly

```markdown
**CRITICAL**: You MUST create this file. The orchestrator WILL FAIL if you don't.

**MANDATORY**: Read ALL context files before proceeding.

**DO NOT**: Push to remote without user approval.
```

### 5. Include Checkpoints

```markdown
---

**CHECKPOINT** - Before proceeding to PHASE 5, verify:
1. ✅ Created implementation_plan.json
2. ✅ Used the Write tool (not just described it)
3. ✅ Added verification_strategy section

If NOT complete, STOP and do it now!

---
```

### 6. Provide JSON Schemas

```markdown
You MUST create `output.json` with this EXACT structure:

\`\`\`json
{
  "feature": "Short descriptive name",
  "workflow_type": "feature|refactor|investigation",
  "phases": [
    {
      "id": "phase-1",
      "name": "Phase Name",
      "subtasks": []
    }
  ]
}
\`\`\`
```

### 7. End with Clear Next Steps

```markdown
## BEGIN

1. First, complete PHASE 0 (Load Context)
2. Then read/create context files in PHASE 1
3. Create implementation_plan.json
4. Create init.sh and build-progress.txt
5. **STOP** - The coder agent handles implementation

Run Phase 0 now.
```

---

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Vague instructions | Agent doesn't know what to do | Provide exact commands |
| Missing validation | No quality control | Add verification phase |
| No error handling | Agent gets stuck | Include recovery steps |
| Absolute paths | Breaks in different environments | Use relative paths |
| No context loading | Agent lacks information | Always start with PHASE 0 |
| No completion signal | Orchestrator can't detect finish | End with clear signal |
| Scope creep language | Agent does too much | Use "DO NOT" boundaries |

---

## Template Files

Production prompt templates are in:
- `apps/backend/prompts/` - All agent prompts
- `apps/backend/prompts/github/` - GitHub-specific prompts
- `apps/backend/prompts/mcp_tools/` - Tool-specific validation prompts

Use these as references when creating new prompts.
