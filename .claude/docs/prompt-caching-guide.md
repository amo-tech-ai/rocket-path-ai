# Context & Prompt Caching Guide for StartupAI Development

> Best practices for optimizing Claude Code sessions and API calls

## Overview

Two complementary strategies for managing context:

| Strategy | Where | Purpose |
|----------|-------|---------|
| **Prompt Caching** | API | Cache stable prompts (90% cheaper reads) |
| **Context Editing** | API | Auto-clear old content when context grows |
| **Compaction** | SDK | Summarize conversation history |
| `/compact` | Claude Code | Manual context summarization |

---

## How Prompt Caching Works

Prompt caching stores frequently-used prompt prefixes, reducing costs and latency:

| Metric | Without Cache | With Cache |
|--------|--------------|------------|
| Input cost | 100% | 10% (cached) |
| Latency | Full | Reduced |
| Cache write | - | +25% first time |

**Requirements:**
- Sonnet: 1,024+ tokens minimum
- Opus/Haiku 4.5: 4,096+ tokens minimum
- Cache TTL: 5 minutes default

## StartupAI Cache Strategy

### 1. Cached Content (Stable)

These files are optimized for caching - rarely change:

| File | Tokens | Purpose |
|------|--------|---------|
| `CLAUDE.md` | ~1,500 | Project config |
| `.claude/CACHED-CONTEXT.md` | ~2,500 | Stable patterns |
| Agent prompts | ~500 each | Subagent instructions |

### 2. Dynamic Content (Not Cached)

Changes per session - should come AFTER cached content:

- User queries
- File contents being edited
- Chat history
- Current task context

## Session Optimization

### Starting a Session

```
1. Claude Code loads CLAUDE.md (cached)
2. Skill/agent prompts loaded if invoked (cached)
3. Your query + file reads (dynamic)
```

### Best Practices

**DO:**
```
- Start with clear task description
- Reference files by path (Claude reads efficiently)
- Use /compact when context gets long
- One focused task per session
- Use subagents for specialized work (isolated context)
```

**DON'T:**
```
- Paste large code blocks (reference files instead)
- Read entire directories without filtering
- Mix unrelated tasks in one session
- Keep old context when switching tasks
```

## Subagent Cache Efficiency

Subagents run in isolated contexts = fresh cache opportunity:

```typescript
// Each subagent gets its own cached prefix:
code-reviewer → code-reviewer.md prompt (cached)
test-runner   → test-runner.md prompt (cached)
supabase-expert → supabase-expert.md prompt (cached)
```

**Use subagents when:**
- Task requires specialized knowledge
- Want to isolate context
- Parallel tasks (multiple subagents)

## Practical Tips

### 1. Reference Files, Don't Paste

```
❌ "Here's the code: [500 lines pasted]"
✅ "Review src/hooks/useAuth.ts"
```

### 2. Scope Reads Explicitly

```
❌ "Read all files in src/components"
✅ "Read src/components/dashboard/ProjectCard.tsx"
```

### 3. Use Skills for Common Tasks

```
❌ "Create a Supabase edge function that..."
✅ "/edge-functions create user-stats"
```

Skills have optimized prompts that cache well.

### 4. Compact When Needed

When session gets long (>50 turns):
```
/compact
```

This summarizes context, freeing cache space.

### 5. Start Fresh for New Tasks

```
❌ Continue old session for unrelated task
✅ New session → fresh cache, clean context
```

## Measuring Cache Efficiency

**Signs of good cache usage:**
- Fast responses to similar queries
- Lower token counts in session
- Subagents complete quickly

**Signs of cache misses:**
- Slow responses to first queries
- High token usage
- Repetitive context loading

## File Organization for Caching

### Stable Content (Top Priority)

Keep these files stable and well-structured:

```
CLAUDE.md                     # Project config (cached first)
.claude/CACHED-CONTEXT.md     # Patterns reference (cached)
.claude/agents/*.md           # Agent prompts (cached per use)
.claude/*/SKILL.md            # Skill prompts (cached per use)
```

### Dynamic Content (Update Freely)

These change often - no cache impact:

```
src/**/*                      # Application code
supabase/**/*                 # Database/functions
startup-system/**/*           # Documentation
```

## Session Workflow

### Standard Development Session

```
1. Start session
2. State task clearly: "Add filtering to ProjectList"
3. Claude reads relevant files (reads are efficient)
4. Make changes incrementally
5. Test with subagent: code-reviewer, test-runner
6. /compact if session gets long
7. New session for next task
```

### Complex Feature Session

```
1. Start session
2. Use /feature-dev skill for guided flow
3. Skill loads cached prompts + subagents
4. Subagents run in isolated contexts (parallel caching)
5. Main context stays clean
```

## Cost Optimization

| Strategy | Savings |
|----------|---------|
| Use cached CLAUDE.md | ~90% on system prompt |
| Subagents for specialized work | Isolated, reusable prompts |
| /compact for long sessions | Prevents context overflow |
| Skills for common patterns | Pre-optimized prompts |
| Reference files, don't paste | Smaller dynamic context |

## Summary

1. **Stable content first** → CLAUDE.md, CACHED-CONTEXT.md
2. **Use subagents** → Isolated contexts, specialized prompts
3. **Reference files** → Don't paste code
4. **Scope reads** → Be specific
5. **Use skills** → Pre-optimized prompts
6. **Compact when long** → Free cache space
7. **New session per task** → Clean context

---

## Context Editing (API Level)

For edge functions that call Claude API, use server-side context management.

### Tool Result Clearing

Automatically clears old tool results when context exceeds threshold:

```typescript
// In edge function
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'anthropic-beta': 'context-management-2025-06-27'  // Required
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: [{
      type: 'text',
      text: systemPrompt,
      cache_control: { type: 'ephemeral' }  // Cache system prompt
    }],
    messages,
    context_management: {
      edits: [
        {
          type: 'clear_tool_uses_20250919',
          trigger: { type: 'input_tokens', value: 50000 },
          keep: { type: 'tool_uses', value: 5 },
          clear_at_least: { type: 'input_tokens', value: 5000 }
        }
      ]
    }
  }),
});
```

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `trigger` | 100k tokens | When to start clearing |
| `keep` | 3 tool uses | Recent tool results to preserve |
| `clear_at_least` | None | Minimum tokens to clear |
| `exclude_tools` | None | Tools to never clear |

### Thinking Block Clearing

For extended thinking conversations:

```typescript
context_management: {
  edits: [
    {
      type: 'clear_thinking_20251015',
      keep: { type: 'thinking_turns', value: 2 }  // Keep last 2 turns
    },
    {
      type: 'clear_tool_uses_20250919',
      trigger: { type: 'input_tokens', value: 50000 }
    }
  ]
}
```

**Note:** `clear_thinking_20251015` must come first in the edits array.

### Memory Tool Integration

Combine context editing with memory for long-running agents:

```typescript
tools: [
  { type: 'memory_20250818', name: 'memory' },
  // Other tools...
],
context_management: {
  edits: [{ type: 'clear_tool_uses_20250919' }]
}
```

Claude will automatically save important context to memory before tool results are cleared.

---

## SDK Compaction

For TypeScript/Python SDK with `tool_runner`:

```typescript
const runner = client.beta.messages.toolRunner({
  model: 'claude-sonnet-4-5',
  max_tokens: 4096,
  tools: [...],
  messages: [...],
  compactionControl: {
    enabled: true,
    contextTokenThreshold: 100000,
    model: 'claude-haiku-4-5'  // Use faster model for summaries
  }
});
```

**When compaction triggers:**
1. SDK detects tokens > threshold
2. Claude generates structured summary
3. Full history replaced with summary
4. Conversation continues from summary

---

## Implementation Checklist

### Claude Code Development
- [ ] Use `/compact` when sessions get long
- [ ] One task per session
- [ ] Subagents for specialized work
- [ ] Reference files, don't paste

### Edge Functions (ai-chat, onboarding-agent)
- [ ] Add `anthropic-beta: context-management-2025-06-27` header
- [ ] Add `cache_control` to system prompts
- [ ] Configure `context_management.edits` for tool clearing
- [ ] Consider memory tool for long-running agents

### SDK Applications
- [ ] Enable `compactionControl` in tool_runner
- [ ] Set appropriate `contextTokenThreshold`
- [ ] Use faster model for summaries (haiku)

---

*Updated: 2026-02-02*
