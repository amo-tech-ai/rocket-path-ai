# StartupAI Task Template

> **System Rule:** PRD → Diagrams → Tasks → Roadmap → Milestones
> **Key Principle:** Tasks are generated ONLY from diagrams. Tasks inherit phase from their diagram.

---

## Task File Naming

**Format:** `XXX-name.md`

| Rule | Example |
|------|---------|
| Number first (3 digits) | `001-`, `002-`, `099-` |
| Short name (1-2 words) | `messaging`, `tools`, `errors` |
| Lowercase, hyphenated | `001-messaging.md`, `002-suggestions.md` |

**Examples:**
```
000-index.md       # Index file
001-messaging.md   # Message lifecycle tasks
002-suggestions.md # Suggestion approval tasks
003-tools.md       # Tool execution tasks
004-errors.md      # Error handling tasks
005-milestones.md  # Milestone definitions
```

---

## Task Frontmatter

```yaml
---
task_id: XXX-PREFIX
title: Task Title
diagram_ref: D-XX  # Required: Source diagram ID
behavior: "Specific behavior from diagram"
prd_ref: "Section X.Y"  # PRD section reference

phase: CORE | MVP | ADVANCED | PRODUCTION  # Inherited from diagram
priority: P0 | P1 | P2 | P3
status: Not Started | In Progress | Completed | Blocked
percent_complete: 0

category: Feature | Backend | Frontend | AI Agent | Full Stack | Infrastructure
subcategory: Onboarding | Canvas | Validation | Tasks | Dashboard | Pitch | CRM | Chat

# Skills (Required)
primary_skill: /feature-dev | /frontend-design | /gemini | /sdk-agent | /supabase | /edge-functions | /startup | /events | /claude-chrome | /doc-coauthoring
secondary_skills: []  # Optional array of additional skills
superpowers: []  # Optional: systematic-debugging, test-driven-development, verification-before-completion, brainstorming

# AI Configuration (Optional)
ai_model: gemini-3-flash-preview | gemini-3-pro-preview | gemini-3-pro-image-preview | veo-3.1-generate-preview | claude-sonnet-4-5 | claude-opus-4-5
extended_thinking: false  # Enable for complex reasoning tasks
thinking_budget: 10000  # Token budget for thinking (if enabled)
subagents: []  # Available: code-reviewer, test-runner, supabase-expert, startup-expert, frontend-designer, ai-agent-dev, debugger, security-auditor, doc-writer, performance-optimizer
hooks: []  # Optional: pre-tool-validation, post-tool-logging
mcp_servers: []  # Optional: filesystem, github, postgres

owner: unassigned
depends_on: XXX-PREFIX  # Optional (e.g., 001-ONB)
blocks: XXX-PREFIX  # Optional (e.g., 002-CNV)
---
```

---

## Task Template

```markdown
# XXX-PREFIX: Task Title

## Source

| Field | Value |
|-------|-------|
| **Diagram** | D-XX: Diagram Name |
| **Behavior** | "User can X" or "System does Y" |
| **PRD Section** | Section X.Y: Feature Name |
| **Phase** | CORE / MVP / ADVANCED / PRODUCTION |

## Context

**What exists:**
- Current state description
- What's already implemented

**What's missing:**
- Gap or behavior not yet implemented


add real world examples and user stories in prompts 
user journey

## Goal

> One sentence: What behavior will work after this task is complete?

## Implementation Steps

### 1. Step Title

Brief description (pseudocode preferred over full code).

### 2. Step Title

Brief description.

### 3. Step Title

Brief description.

## Files

| File | Action |
|------|--------|
| `src/path/file.tsx` | Create / Modify |

## Acceptance Criteria

From diagram behavior:
- [ ] User can [specific action]
- [ ] System [specific response]
- [ ] Data [persisted/validated correctly]

## Tech Stack

**AI Model:** (select one)
- `gemini-3-flash-preview` - Fast extraction, scoring
- `gemini-3-pro-preview` - Complex reasoning
- `gemini-3-pro-image-preview` - Image generation
- `veo-3.1-generate-preview` - Video generation
- `claude-haiku-4-5` - Fast, low-cost tasks
- `claude-sonnet-4-5` - Balanced quality + speed
- `claude-opus-4-5` - Highest quality, complex reasoning

**Extended Thinking:** (optional)
- `enabled: true` - For multi-step reasoning
- `budget_tokens: 10000` - Thinking token budget

**Subagents:** (optional, from `.claude/agents/`)
- `code-reviewer` - Security, quality, TypeScript review
- `test-runner` - Vitest execution, coverage
- `supabase-expert` - RLS, migrations, edge functions
- `startup-expert` - Lean Canvas, validation, fundraising
- `frontend-designer` - React, Tailwind, shadcn/ui
- `ai-agent-dev` - Gemini/Claude integration
- `debugger` - Root cause analysis
- `security-auditor` - OWASP, vulnerabilities
- `doc-writer` - API docs, guides
- `performance-optimizer` - React, DB optimization

**Edge Function:** `function-name`

## Effort

- **Time:** X-Y hours
- **Complexity:** Low | Medium | High
```

---

## Phase Definitions

| Phase | Question | Milestone |
|-------|----------|-----------|
| **CORE** | Can it work at all? | Basic flow works end-to-end |
| **MVP** | Does it solve the main problem? | Users achieve main goal reliably |
| **ADVANCED** | Does it help users do better? | System proactively assists |
| **PRODUCTION** | Can it be trusted at scale? | Stable under real-world usage |

---

## Task ID Format

**Format:** `XXX-PREFIX` (number first, then category prefix)

| Category | Prefix | Example ID | Example File |
|----------|--------|------------|--------------|
| Onboarding | ONB | `001-ONB` | `001-oauth.md` |
| Lean Canvas | CNV | `001-CNV` | `001-canvas.md` |
| Validation Lab | VAL | `001-VAL` | `001-validation.md` |
| AI Agents | AGT | `001-AGT` | `001-agents.md` |
| Tasks | TSK | `001-TSK` | `001-tasks.md` |
| Dashboard | DSH | `001-DSH` | `001-dashboard.md` |
| Pitch Deck | PTH | `001-PTH` | `001-pitch.md` |
| CRM/Investors | CRM | `001-CRM` | `001-crm.md` |
| Atlas Chat | CHT | `001-CHT` | `001-chat.md` |
| Metrics | MET | `001-MET` | `001-metrics.md` |
| Infrastructure | INF | `001-INF` | `001-infra.md` |

### Numbering by Phase

| Range | Phase | Example |
|-------|-------|---------|
| 001-099 | CORE | `001-messaging.md` |
| 100-199 | MVP | `101-tools.md` |
| 200-299 | ADVANCED | `201-analytics.md` |
| 300-399 | PRODUCTION | `301-monitoring.md` |

---

## Priority Guide

| Priority | Meaning | Phase |
|----------|---------|-------|
| **P0** | Blocking, must be done first | CORE |
| **P1** | Core MVP functionality | MVP |
| **P2** | Enhances user experience | ADVANCED |
| **P3** | Nice to have, polish | PRODUCTION |

---

## Skill Assignment Guide

### Available Skills

| Skill | Command | When to Use |
|-------|---------|-------------|
| Feature Development | `/feature-dev` | Multi-file features, architectural decisions |
| Frontend Design | `/frontend-design` | UI components, pages, dashboards |
| Gemini AI | `/gemini` | URL context, Google Search, structured output |
| Claude SDK Agent | `/sdk-agent` | Claude agents, multi-agent systems |
| Supabase | `/supabase` | Database, RLS, migrations |
| Edge Functions | `/edge-functions` | API endpoints, serverless |
| Startup Expertise | `/startup` | Startup features, health scores, playbooks |
| Events Management | `/events` | Speaker events, calendars |
| Claude Chrome | `/claude-chrome` | Browser testing, screenshots |
| Doc Co-Authoring | `/doc-coauthoring` | PRDs, specs, documentation |

### Superpowers (Quality Workflows)

| Superpower | When to Trigger |
|------------|-----------------|
| `systematic-debugging` | Encountering bugs, tracing errors |
| `test-driven-development` | Before implementing, RED-GREEN-REFACTOR |
| `verification-before-completion` | Before claiming done |
| `brainstorming` | Before creative work, design exploration |
| `code-reviewer` | After completing implementation steps |
| `writing-plans` | When you have specs, multi-step planning |

### Skill by Task Type

| Task Type | Primary Skill | Secondary Skills |
|-----------|---------------|------------------|
| New Feature (multi-file) | `/feature-dev` | `/frontend-design`, `/supabase` |
| New Dashboard/Page | `/frontend-design` | `/feature-dev`, `/supabase` |
| New API Endpoint | `/edge-functions` | `/supabase` |
| Database Schema Change | `/supabase` | `/feature-dev` |
| New AI Agent | `/sdk-agent` | `/feature-dev` |
| AI Feature Integration | `/gemini` or `/sdk-agent` | `/edge-functions` |
| Technical Spec/PRD | `/doc-coauthoring` | — |
| Browser Testing | `/claude-chrome` | — |
| Startup Feature | `/startup` | `/gemini`, `/supabase` |
| Canvas/Validation | `/startup` | `/supabase`, `/edge-functions` |
| Pitch Deck/Investor | `/startup` | `/doc-coauthoring`, `/gemini` |

### Skill by Screen

| Screen | Primary Skills | AI Model |
|--------|----------------|----------|
| Onboarding Wizard | `/frontend-design`, `/feature-dev` | Gemini Flash |
| Dashboard | `/frontend-design`, `/supabase` | Gemini Pro |
| Lean Canvas | `/startup`, `/supabase` | Gemini Flash |
| Validation Lab | `/startup`, `/edge-functions` | Gemini Pro |
| Pitch Deck | `/startup`, `/edge-functions` | Gemini Flash |
| CRM/Investors | `/feature-dev`, `/supabase` | Claude Sonnet |
| Atlas Chat | `/sdk-agent`, `/edge-functions` | Claude Sonnet |
| Tasks | `/feature-dev`, `/supabase` | Gemini Flash |

### Auto-Trigger Patterns

| Pattern in Task | Required Skill |
|-----------------|----------------|
| "feature", "implement", "build" | `/feature-dev` |
| "dashboard", "UI", "component", "page" | `/frontend-design` |
| "migration", "RLS", "database", "table" | `/supabase` |
| "edge function", "API endpoint" | `/edge-functions` |
| "Gemini", "URL context", "Google Search" | `/gemini` |
| "agent", "Claude SDK", "multi-agent" | `/sdk-agent` |
| "canvas", "validation", "startup", "pitch" | `/startup` |
| "event", "speaker", "calendar" | `/events` |
| "browser", "test app", "screenshot" | `/claude-chrome` |
| "PRD", "spec", "proposal", "RFC" | `/doc-coauthoring` |

---

## Diagram → Task Examples

### Example 1: From D-05 (Onboarding Flow)

**File:** `001-oauth.md`

```yaml
---
task_id: 001-ONB
title: Implement OAuth Authentication
diagram_ref: D-05
behavior: "User can sign up via Google or LinkedIn OAuth"
prd_ref: "Section 4.1: Progressive Onboarding Flow"
phase: CORE
priority: P0
primary_skill: /feature-dev
secondary_skills: [/supabase]
superpowers: [verification-before-completion]
---
```

### Example 2: From D-06 (Lean Canvas Flow)

**File:** `101-canvas.md`

```yaml
---
task_id: 101-CNV
title: Implement AI Content Suggestion for Canvas Blocks
diagram_ref: D-06
behavior: "AI suggests content when user opens block"
prd_ref: "Section 5.2: Canvas AI Features"
phase: MVP
priority: P1
primary_skill: /startup
secondary_skills: [/gemini, /edge-functions]
superpowers: [brainstorming]
---
```

### Example 3: From D-08 (AI Agent Architecture)

**File:** `102-agents.md`

```yaml
---
task_id: 102-AGT
title: Create Experiment Designer Agent
diagram_ref: D-08
behavior: "ExperimentDesigner generates full experiment spec from assumption"
prd_ref: "Section 9.2: Specialized Agents"
phase: MVP
priority: P1
primary_skill: /sdk-agent
secondary_skills: [/edge-functions, /startup]
superpowers: [test-driven-development]
---
```

### Example 4: From D-13 (Pitch Deck Generation)

**File:** `201-pitch.md`

```yaml
---
task_id: 201-PTH
title: Build Pitch Deck Generator
diagram_ref: D-13
behavior: "System generates 12-slide deck from validated canvas data"
prd_ref: "Section 10: Pitch Deck Builder"
phase: ADVANCED
priority: P2
primary_skill: /startup
secondary_skills: [/gemini, /doc-coauthoring]
superpowers: [brainstorming, code-reviewer]
---
```

---

## AI Model Selection

### Gemini Models

| Model | Use Case | Speed | Cost |
|-------|----------|-------|------|
| `gemini-3-flash-preview` | Fast extraction, scoring, chat | ⚡ Fast | $ Low |
| `gemini-3-pro-preview` | Complex analysis, deep reasoning | 🔄 Medium | $$ Medium |
| `gemini-3-pro-image-preview` | Image generation, visual assets | 🔄 Medium | $$ Medium |
| `veo-3.1-generate-preview` | Video generation, motion content | 🐢 Slow | $$$ High |

### Claude Models

| Model | Use Case | Speed | Cost |
|-------|----------|-------|------|
| `claude-haiku-4-5` | Simple tasks, high volume | ⚡ Fast | $ Low |
| `claude-sonnet-4-5` | Balanced quality + speed | 🔄 Medium | $$ Medium |
| `claude-opus-4-5` | Complex reasoning, high stakes | 🐢 Slow | $$$ High |

### When to Use Extended Thinking

| Task Type | Extended Thinking | Budget |
|-----------|-------------------|--------|
| Simple extraction | ❌ Not needed | - |
| Content generation | ❌ Not needed | - |
| Multi-step analysis | ✅ Enabled | 10,000 |
| Architecture decisions | ✅ Enabled | 15,000 |
| Complex debugging | ✅ Enabled | 20,000 |

### When to Use Subagents

| Scenario | Subagent | Why |
|----------|----------|-----|
| Code review needed | `code-reviewer` | Security, quality, TypeScript review |
| Tests must run | `test-runner` | Vitest execution, coverage analysis |
| Database changes | `supabase-expert` | RLS, migrations, edge functions |
| Startup guidance | `startup-expert` | Lean Canvas, validation, fundraising |
| UI development | `frontend-designer` | React, Tailwind, shadcn/ui |
| AI integration | `ai-agent-dev` | Gemini/Claude, prompts, edge functions |
| Bug investigation | `debugger` | Root cause analysis, console traces |
| Security audit | `security-auditor` | OWASP, RLS audit, vulnerabilities |
| Documentation | `doc-writer` | API docs, component docs, guides |
| Performance | `performance-optimizer` | React, DB, edge function optimization |

---

## Claude Agent SDK Reference

### Built-in Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| **Read** | Read any file in working directory | File content access |
| **Write** | Create new files | File creation |
| **Edit** | Precise edits to existing files | Code modifications |
| **Bash** | Run terminal commands, scripts, git | System operations |
| **Glob** | Find files by pattern (`**/*.ts`) | File discovery |
| **Grep** | Search file contents with regex | Content search |
| **WebSearch** | Search the web | Real-time information |
| **WebFetch** | Fetch and parse web pages | Web content |
| **AskUserQuestion** | Ask user clarifying questions | User input |
| **Task** | Invoke subagents | Parallel processing |
| **TodoWrite** | Track task progress | Todo management |

### Subagents

Subagents isolate context, run in parallel, and apply specialized instructions.

**Location:** `.claude/agents/*.md`

```yaml
# Agent definition format (.claude/agents/agent-name.md)
---
name: agent-name
description: When to use this agent
tools: Read, Edit, Bash, Grep, Glob
model: sonnet | haiku | opus
---

System prompt and instructions...
```

| Subagent | Model | Purpose | Tools |
|----------|-------|---------|-------|
| `code-reviewer` | Sonnet | Security, quality, TypeScript review | Read, Grep, Glob |
| `test-runner` | Sonnet | Vitest execution, coverage analysis | Bash, Read, Grep |
| `supabase-expert` | Sonnet | RLS, migrations, edge functions | Read, Edit, Bash, Grep, Glob |
| `startup-expert` | Sonnet | Lean Canvas, validation, fundraising | Read, Grep, Glob, WebSearch |
| `frontend-designer` | Sonnet | React, Tailwind, shadcn/ui | Read, Edit, Glob, Grep |
| `ai-agent-dev` | Sonnet | Gemini/Claude integration, prompts | Read, Edit, Bash, Grep, Glob |
| `debugger` | Sonnet | Root cause analysis, bug fixing | Read, Edit, Bash, Grep, Glob |
| `security-auditor` | Sonnet | OWASP, RLS audit, vulnerabilities | Read, Grep, Glob, Bash |
| `doc-writer` | Haiku | API docs, component docs, guides | Read, Write, Grep, Glob |
| `performance-optimizer` | Sonnet | React, DB, edge function optimization | Read, Edit, Bash, Grep, Glob |

### Invoking Subagents

```typescript
// Via Task tool in Claude Code
Task({
  subagent_type: "code-reviewer",
  prompt: "Review src/hooks/useAuth.ts for security issues"
})

// Parallel subagents
Task({ subagent_type: "code-reviewer", prompt: "..." })
Task({ subagent_type: "test-runner", prompt: "..." })
```

### Hooks

Intercept agent execution for validation, logging, or security.

| Hook Event | When Triggered | Use Case |
|------------|----------------|----------|
| `PreToolUse` | Before tool executes | Block dangerous ops, validate inputs |
| `PostToolUse` | After tool executes | Log actions, transform outputs |
| `Stop` | Agent completes | Cleanup, notifications |
| `SessionStart` | Session begins | Initialize state |
| `SessionEnd` | Session ends | Resource cleanup |
| `UserPromptSubmit` | User sends message | Input validation |

```typescript
// Example: Block .env file modifications
hooks: {
  PreToolUse: [{
    matcher: 'Write|Edit',
    hooks: [protectEnvFiles]
  }]
}
```

### MCP Servers

Extend Claude with custom tools via Model Context Protocol.

```json
// .mcp.json configuration
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem"],
      "env": { "ALLOWED_PATHS": "/path/to/project" }
    }
  }
}
```

| MCP Server | Purpose |
|------------|---------|
| `@modelcontextprotocol/server-filesystem` | File system access |
| `@modelcontextprotocol/server-github` | GitHub API |
| `@modelcontextprotocol/server-postgres` | PostgreSQL queries |
| Custom MCP | Domain-specific tools |

---

## Claude API Features Reference

| Feature | Description | When to Use |
|---------|-------------|-------------|
| **Extended Thinking** | Enhanced reasoning with visible thought process | Complex multi-step reasoning |
| **Prompt Caching** | Cache system prompts for cost savings | Repeated agent prompts |
| **Structured Output** | Guaranteed JSON schema compliance | API responses, data extraction |
| **Tool Use** | Function calling with type safety | Agent actions, integrations |
| **Streaming** | Real-time response streaming | Interactive UIs |

### Extended Thinking

```typescript
// Enable extended thinking for complex tasks
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 16000,
  thinking: {
    type: "enabled",
    budget_tokens: 10000  // Tokens for reasoning
  },
  messages: [...]
});
```

| Budget | Use Case |
|--------|----------|
| 5,000 tokens | Simple analysis |
| 10,000 tokens | Standard reasoning |
| 20,000+ tokens | Complex multi-step problems |

### Prompt Caching

```typescript
// Cache large system prompts
system: [
  { type: "text", text: "Base instructions..." },
  {
    type: "text",
    text: "<large context document>",
    cache_control: { type: "ephemeral" }  // Cache this block
  }
]
```

---

## Gemini Features Reference

| Feature | Use Case |
|---------|----------|
| Structured Output | TypeBox schemas, validation |
| Function Calling | Tool use in edge functions |
| URL Context | Website scraping |
| Google Search | Real-time grounding |

---

## Todo Tracking

The SDK automatically creates todos for complex multi-step tasks.

```typescript
// Todo lifecycle
1. Created as "pending"
2. Activated to "in_progress"
3. Completed when finished
4. Removed when all done

// Monitor todo progress
if (block.name === "TodoWrite") {
  const todos = block.input.todos;
  todos.forEach(todo => {
    console.log(`${todo.status}: ${todo.content}`);
  });
}
```

---

## Edge Function Pattern

```typescript
// Standard edge function call
const { data } = await supabase.functions.invoke('agent-name', {
  body: { action: 'action_name', startup_id, ...params }
});
```

---

## Task Workflow

```
1. Identify diagram behavior
2. Create task with diagram_ref
3. Set phase (inherited from diagram)
4. Define acceptance criteria from behavior
5. Implement
6. Verify against diagram behavior
7. Mark complete
```

---

## Validation Checklist

Before marking a task complete:

- [ ] Behavior from diagram works as specified
- [ ] PRD section requirements met
- [ ] Acceptance criteria passed
- [ ] No regressions in related behaviors
- [ ] Code follows project patterns

---

## Progress Roll-up

```
Tasks → Diagrams → Phase → Milestone

When all tasks for a diagram are complete:
  → Diagram is complete

When all diagrams for a phase are complete:
  → Phase milestone is achieved

Nothing moves to next phase until current phase is complete.
```

---

## Claude 4 Best Practices

### General Principles

| Principle | Description |
|-----------|-------------|
| **Be Explicit** | Claude 4.x responds to clear, explicit instructions |
| **Add Context** | Explain WHY instructions matter for better results |
| **Verify Examples** | Examples are followed precisely; ensure they're correct |
| **Default to Action** | Say "Change X" not "Can you suggest changes to X" |

### Prompting Patterns

**Less Effective:**
```
Create an analytics dashboard
```

**More Effective:**
```
Create an analytics dashboard. Include as many relevant features
and interactions as possible. Go beyond the basics to create a
fully-featured implementation.
```

### Tool Usage

Claude 4.x follows instructions precisely. Be explicit about action vs suggestion:

| Instruction | Claude's Response |
|-------------|-------------------|
| "Can you suggest changes?" | Provides suggestions only |
| "Change this function to..." | Makes the changes |
| "Make these edits..." | Implements the edits |

**Proactive Action Prompt:**
```xml
<default_to_action>
By default, implement changes rather than only suggesting them.
If the user's intent is unclear, infer the most useful likely
action and proceed, using tools to discover any missing details.
</default_to_action>
```

### Parallel Tool Calling

Claude 4.x excels at parallel execution. Encourage it:

```xml
<use_parallel_tool_calls>
If you intend to call multiple tools and there are no dependencies
between the tool calls, make all independent calls in parallel.
Prioritize calling tools simultaneously whenever actions can be
done in parallel rather than sequentially.
</use_parallel_tool_calls>
```

### Long-Horizon Tasks

For complex, multi-step tasks spanning multiple context windows:

1. **First Context Window**: Set up framework (tests, setup scripts)
2. **Use Structured State**: Keep `tests.json`, `progress.txt` files
3. **Create Setup Scripts**: `init.sh` to start servers, run tests
4. **Use Git**: Track state with commits, restore checkpoints
5. **Verify Incrementally**: Test components before moving on

**State Tracking Example:**
```json
// tests.json
{
  "tests": [
    {"id": 1, "name": "auth_flow", "status": "passing"},
    {"id": 2, "name": "user_mgmt", "status": "failing"}
  ],
  "passing": 150,
  "failing": 25
}
```

```text
// progress.txt
Session 3 progress:
- Fixed auth token validation
- Updated user model
- Next: investigate user_mgmt failures
```

### Code Exploration

Always read code before proposing changes:

```xml
<investigate_before_answering>
ALWAYS read and understand relevant files before proposing code edits.
Do not speculate about code you have not inspected. If the user
references a specific file, you MUST open and inspect it before
explaining or proposing fixes.
</investigate_before_answering>
```

### Avoid Over-Engineering

Keep solutions minimal and focused:

```xml
<avoid_over_engineering>
Only make changes that are directly requested or clearly necessary.
Keep solutions simple and focused. Don't add features, refactor code,
or make "improvements" beyond what was asked. Don't create helpers
or abstractions for one-time operations.
</avoid_over_engineering>
```

### Frontend Design

Avoid generic "AI slop" aesthetics:

| Avoid | Prefer |
|-------|--------|
| Inter, Roboto, Arial | Distinctive fonts |
| Purple gradients on white | Cohesive, bold color themes |
| Generic layouts | Context-specific designs |
| Cookie-cutter patterns | Creative, unexpected choices |

### Extended Thinking

Use interleaved thinking for complex tasks:

```
After receiving tool results, carefully reflect on their quality
and determine optimal next steps before proceeding. Use your
thinking to plan and iterate based on this new information.
```

### Subagent Orchestration

Claude 4.5 naturally delegates to subagents when beneficial:

- Ensure subagent tools are well-described
- Let Claude orchestrate naturally
- Add constraints only if needed

---

## Reference Documentation

| Topic | Source |
|-------|--------|
| Claude Agent SDK | `knowledge/claude-reference/agents/` |
| Built-in Tools | `knowledge/claude-reference/tools/` |
| **Subagents** | `.claude/agents/` |
| Subagent Guide | `startup-system/sub-agents.md` |
| Hooks | `agents/hooks.md` |
| MCP Servers | `agents/mcp.md` |
| Extended Thinking | `tools/05-extended-thinking.md` |
| Prompt Caching | `.claude/docs/prompt-caching-guide.md` |
| Context Editing | `knowledge/claude-reference/context-editing.md` |
| Tool Use | `tools/4-tools-overview.md` |

---

*Updated: 2026-02-03 | Task naming: XXX-name.md format | Includes Claude Agent SDK, Subagents, Hooks, MCP*
