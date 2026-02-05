# Context Management Audit & Best Practices

> **Audit Date:** 2025-01-25
> **Session Analyzed:** Task index refactoring session
> **Findings:** Multiple context bloat patterns identified

---

## TL;DR - Context Optimization Rules

```
1. CLEAR AT 60K    → Don't wait for compaction
2. SUBAGENTS       → Use "quick" mode, limit scope
3. BATCH WRITES    → Parallel when independent
4. TERSE RESPONSES → Agents return summaries, not reports
5. READ ONCE       → Don't re-read same files
```

---

## Session Analysis: Why Context Filled Fast

### Measured Impact (This Session)

| Action | Tokens Est. | Count | Total |
|--------|-------------|-------|-------|
| Explore agents (verbose) | ~8,000 | 5 | ~40,000 |
| Task file writes (3-10KB) | ~2,500 | 25 | ~62,500 |
| Task file reads | ~2,000 | 6 | ~12,000 |
| Index read/write cycles | ~3,000 | 4 | ~12,000 |
| Bash outputs | ~500 | 20 | ~10,000 |
| **TOTAL** | | | **~136,500** |

---

## Root Causes & Fixes

### 1. Verbose Subagent Responses (~40K wasted)

**Problem:** Explore agents returned 8,000+ character reports with:
- Full tables (50+ rows)
- Complete code snippets
- Redundant recommendations

**Fix - Use terse prompts:**
```markdown
# BAD
"Analyze the dashboards folder thoroughly"

# GOOD
"List files in /tasks/dashboards/. Return ONLY:
- filename | status | 1-line summary
Max 30 lines. No code snippets."
```

**Fix - Use "quick" thoroughness:**
```typescript
Task({
  subagent_type: "Explore",
  prompt: "...",
  // Add to prompt: "Be concise. Max 500 words."
})
```

### 2. Full Code in Task Files (~30K wasted)

**Problem:** Each task included 200-400 lines of TypeScript.

**Fix - Use pseudocode:**
```markdown
# BAD (in task file)
export function FileUploader() {
  const [uploading, setUploading] = useState(false);
  // ... 80 more lines
}

# GOOD (in task file)
## Implementation Steps
1. Create FileUploader with react-dropzone
2. Validate file type and size (50MB max)
3. Upload to Supabase Storage bucket
4. Return URL via onUpload callback

See: src/components/documents/FileUploader.tsx
```

### 3. Repeated File Reads (~12K wasted)

**Problem:** Read same index file 4 times.

**Fix - Read once pattern:**
```
1. Read file once at session start
2. Track changes as delta list
3. Write final version at end
4. Don't re-read to verify
```

### 4. Sequential Writes

**Problem:** 25 file writes done sequentially.

**Fix - Batch parallel writes:**
```
Group by folder, write 5 files per tool call block.
Independent writes = parallel execution.
```

---

## Context Budget Guidelines

### Token Allocation

| Category | Budget | Notes |
|----------|--------|-------|
| CLAUDE.md | <2,000 | Pointers only |
| Subagent results | <1,000 each | Force terse |
| Task file templates | <500 each | Pseudocode |
| Tool results | <500 each | Truncate if needed |
| Conversation history | ~50,000 | Primary work |
| **Safety buffer** | ~10,000 | For compaction |

### When to /clear

| Trigger | Action |
|---------|--------|
| 60K tokens used | /clear immediately |
| 30% context full | Consider clearing |
| Task complete | Clear before next task |
| Subagent bloat | Clear after analysis |
| Quality degrading | Emergency clear |

---

## Subagent Best Practices

### Explore Agent

```markdown
# Optimal prompt pattern
"Find [specific thing] in [specific path].
Return: filename, line number, 1-line description.
Max 20 results. No code blocks."
```

### Task Agent

```markdown
# Optimal prompt pattern
"Create [specific file] with [specific content].
Follow pattern from [reference file].
Return: file path only when complete."
```

### Bad Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| "Analyze thoroughly" | Verbose | "List key findings only" |
| "Research everything" | Unbounded | Specific file paths |
| No output limit | Bloat | "Max 500 words" |
| Asking for code | Huge | "Pseudocode only" |

---

## File Operation Patterns

### Reading Files

```markdown
# BAD: Read, modify, read again to verify
Read → Edit → Read → Edit → Read

# GOOD: Trust the tool
Read → Edit → Done

# EXCEPTION: Complex multi-step edits
Read → Plan all edits → Execute all → Verify once
```

### Writing Files

```markdown
# BAD: Sequential writes
Write file1 → Write file2 → Write file3

# GOOD: Parallel independent writes
[Write file1, file2, file3] in single tool block

# GOOD: Sequential dependent writes
Write config → Write component (uses config)
```

### Task Files

```markdown
# Optimal task file structure (~500 tokens)
---
task_number: X
title: Short Title
status: Not Started
---

## Goal
One sentence.

## Current State
- What exists: X
- What's missing: Y

## Implementation
1. Step one (pseudocode)
2. Step two (pseudocode)

## Files
- Create: path/file.tsx
- Modify: path/other.tsx

## Acceptance
- [ ] Criteria 1
- [ ] Criteria 2
```

---

## Session Patterns

### Starting a Session

```
1. /clear (fresh start)
2. Read CLAUDE.md (context loaded)
3. Read 1-2 key files for task
4. Plan before coding
5. Execute with minimal reads
```

### During Session

```
1. Track token usage mentally
2. At 60K: /clear + /catchup
3. Batch similar operations
4. Don't re-read files
5. Trust tool success responses
```

### Ending Session

```
1. Write progress to tasks/session-notes.md
2. Commit any changes
3. Note next steps in file
4. /clear for next session
```

---

## Anti-Patterns Checklist

| Anti-Pattern | Impact | Frequency |
|--------------|--------|-----------|
| Verbose subagent prompts | HIGH | Common |
| Full code in task specs | HIGH | Common |
| Re-reading same files | MEDIUM | Common |
| Sequential independent writes | MEDIUM | Common |
| Not clearing at 60K | HIGH | Occasional |
| Asking for "thorough" analysis | HIGH | Common |
| Including screenshots in context | HIGH | Occasional |
| Long error message chains | MEDIUM | Occasional |

---

## Recommended Workflow

### For Task Cleanup (like this session)

```
1. Read index once
2. Spawn ONE explore agent per folder with terse prompt
3. Batch create task files (5 per parallel call)
4. Archive old files in single batch
5. Update index once at end
6. /clear before next major task

Estimated savings: 50-70% context reduction
```

### For Feature Development

```
1. Read 2-3 key files max
2. Plan in conversation (no subagent)
3. Write code directly
4. Test manually
5. Commit
6. /clear

Skip: Explore agents, verbose planning docs
```

---

## Metrics to Track

| Metric | Target | Red Flag |
|--------|--------|----------|
| Tokens before /clear | <60K | >80K |
| Subagent result size | <1K | >3K |
| Files read per task | <5 | >10 |
| Index file reads | 1-2 | >3 |
| Task file size | <500 tokens | >2K |

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│         CONTEXT OPTIMIZATION            │
├─────────────────────────────────────────┤
│ CLEAR:   At 60K tokens, not 100K        │
│ AGENTS:  "Max 500 words, no code"       │
│ TASKS:   Pseudocode, not implementation │
│ READS:   Once per file per session      │
│ WRITES:  Batch parallel when possible   │
│ INDEX:   Read once, write once          │
└─────────────────────────────────────────┘
```

---

**Document Created:** 2025-01-25
**Based On:** Analysis of task refactoring session
