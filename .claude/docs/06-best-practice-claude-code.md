# Claude Code Best Practices — Opus 4.6 Edition

> **Updated:** 2026-02-09 | Based on Claude Opus 4.6 features & official Claude Code best practices

---

## 1. New Features in Claude Opus 4.6

### 1.1 Adaptive Thinking (GA)

Replaces manual `budget_tokens`. Claude dynamically decides when and how much to think.

```python
# OLD (deprecated on Opus 4.6)
thinking={"type": "enabled", "budget_tokens": 32000}
betas=["interleaved-thinking-2025-05-14"]

# NEW (recommended)
thinking={"type": "adaptive"}
output_config={"effort": "high"}  # low | medium | high | max
```

**Effort levels:**

| Level | Behavior | Use Case |
|-------|----------|----------|
| `max` | Always thinks, no depth limit (Opus 4.6 only) | Complex multi-step reasoning, research |
| `high` | Always thinks (default) | Most coding/analysis tasks |
| `medium` | Moderate thinking, may skip for simple queries | Balanced cost/quality |
| `low` | Minimal thinking, skips for simple tasks | Fast responses, simple lookups |

**Key points:**
- No beta header required — adaptive thinking and effort are GA
- Automatically enables interleaved thinking (between tool calls)
- Promptable: add system prompt guidance to tune thinking frequency
- Use `max_tokens` as hard limit on total output (thinking + response)

### 1.2 Fast Mode (Research Preview)

Same Opus 4.6 model, up to 2.5x faster output tokens/second at premium pricing.

```python
response = client.beta.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    speed="fast",
    betas=["fast-mode-2026-02-01"],
    messages=[...]
)
```

**When to use:**
- Latency-sensitive agentic workflows
- Code generation where speed matters more than cost
- Interactive coding sessions

**When NOT to use:**
- Batch processing (not supported with Batch API)
- Cost-sensitive workloads (6x standard pricing)
- When prompt caching is critical (fast/standard don't share cache)

**Pricing:** $30/$150 per MTok (6x standard). Stacks with caching and data residency multipliers.

**Fallback pattern** — fall back to standard speed on rate limit:
```python
try:
    return client.beta.messages.create(**params, max_retries=0)
except anthropic.RateLimitError:
    if params.get("speed") == "fast":
        del params["speed"]
        return client.beta.messages.create(**params)
    raise
```

### 1.3 Compaction API (Beta)

Server-side context summarization for effectively infinite conversations.

```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-6",
    max_tokens=4096,
    messages=messages,
    context_management={
        "edits": [{
            "type": "compact_20260112",
            "trigger": {"type": "input_tokens", "value": 150000}
        }]
    }
)
# Always append response content (includes compaction blocks)
messages.append({"role": "assistant", "content": response.content})
```

**Key points:**
- Triggers when input tokens exceed threshold (default 150K, min 50K)
- Returns `compaction` block that replaces prior messages
- Use `pause_after_compaction: true` to preserve recent messages
- Custom `instructions` completely replace default summarization prompt
- Track billing via `usage.iterations` array (top-level usage excludes compaction)
- Cache `compaction` blocks with `cache_control: {"type": "ephemeral"}`

**Token budget enforcement pattern:**
```python
TRIGGER = 100_000
BUDGET = 3_000_000
n_compactions = 0

# After each compaction:
if response.stop_reason == "compaction":
    n_compactions += 1
    if n_compactions * TRIGGER >= BUDGET:
        messages.append({"role": "user",
            "content": "Please wrap up and summarize final state."})
```

### 1.4 128K Output Tokens

Double the previous 64K limit. Requires streaming for large `max_tokens`:

```python
with client.messages.stream(
    model="claude-opus-4-6",
    max_tokens=128000,
    messages=[...]
) as stream:
    message = stream.get_final_message()
```

### 1.5 1M Context Window (Beta)

Available for Opus 4.6. 76% on MRCR v2 (8-needle 1M) vs 18.5% for Sonnet 4.5.

### 1.6 Data Residency

```python
response = client.messages.create(
    model="claude-opus-4-6",
    inference_geo="us",  # or "global" (default)
    messages=[...]
)
```
US-only inference: 1.1x pricing on Opus 4.6+.

---

## 2. Migration Checklist (from 4.5 to 4.6)

### Breaking Changes
- [ ] **Prefill removal**: Assistant message prefills return 400 error. Use structured outputs or `output_config.format`
- [ ] **Tool parameter quoting**: Verify JSON parsing uses standard parser (`JSON.parse()` / `json.loads()`)

### Recommended Changes
- [ ] Update model ID: `claude-opus-4-5` -> `claude-opus-4-6`
- [ ] Migrate `thinking: {type: "enabled", budget_tokens: N}` -> `thinking: {type: "adaptive"}`
- [ ] Use effort parameter: `output_config: {effort: "high"}`
- [ ] Remove beta headers: `effort-2025-11-24`, `fine-grained-tool-streaming-2025-05-14`, `interleaved-thinking-2025-05-14`
- [ ] Migrate `output_format` -> `output_config.format`
- [ ] Handle `refusal` and `model_context_window_exceeded` stop reasons
- [ ] Test in dev before production

### From 4.1 or earlier (additional)
- [ ] Use only `temperature` OR `top_p` (not both)
- [ ] Update tool versions: `text_editor_20250728`, `code_execution_20250825`
- [ ] Remove legacy beta headers: `token-efficient-tools-2025-02-19`, `output-128k-2025-02-19`
- [ ] Handle trailing newlines in tool string parameters

---

## 3. Claude Code Best Practices

### 3.1 The #1 Rule: Give Claude Verification

The single highest-leverage practice. Always provide a way for Claude to check its own work:

- **Tests**: Write failing tests first, then implement
- **Screenshots**: Paste UI mockups, let Claude compare results
- **Build/lint/type checks**: "Run the build after changes"
- **Expected outputs**: Provide example inputs/outputs
- **Root causes**: Share error messages, not just symptoms

### 3.2 Context Management (Most Critical Resource)

Context fills fast. Performance degrades as it fills. Manage aggressively:

| Action | When |
|--------|------|
| `/clear` | Between unrelated tasks |
| `/compact` | When context is getting large mid-task |
| `/compact Focus on X` | Preserve specific context during compaction |
| Subagents | For research/exploration that reads many files |
| `/rewind` | Undo failed approaches instead of accumulating corrections |

**Rules of thumb:**
- One task per session
- After 2 failed corrections, `/clear` and rewrite the prompt
- Use subagents for investigation to keep main context clean
- Track context usage with custom status line

### 3.3 Explore -> Plan -> Implement -> Commit

For non-trivial tasks, separate phases:

1. **Explore** (Plan Mode): Read files, understand patterns
2. **Plan** (Plan Mode): Create detailed implementation plan
3. **Implement** (Normal Mode): Code with verification
4. **Commit**: Descriptive message + PR

Skip planning for: typos, single-line fixes, clear-scope changes.

### 3.4 Write Effective Prompts

| Strategy | Bad | Good |
|----------|-----|------|
| Scope the task | "add tests for foo.py" | "write a test for foo.py covering the edge case where user is logged out. avoid mocks." |
| Point to sources | "why is this API weird?" | "look through ExecutionFactory's git history and summarize how its API evolved" |
| Reference patterns | "add a calendar widget" | "look at HotDogWidget.php for the pattern. follow it to implement a calendar widget" |
| Describe symptoms | "fix the login bug" | "login fails after session timeout. check src/auth/ token refresh. write a failing test first" |

**Rich content:**
- `@file.ts` to reference files directly
- Paste images/screenshots
- Pipe data: `cat error.log | claude`
- Give URLs (allowlist with `/permissions`)

### 3.5 CLAUDE.md Best Practices

Keep it concise. For each line ask: "Would removing this cause mistakes?"

**Include:**
- Bash commands Claude can't guess
- Code style rules that differ from defaults
- Test instructions and preferred runners
- Repo etiquette (branch naming, PR conventions)
- Architecture decisions specific to your project
- Common gotchas

**Exclude:**
- Anything Claude can figure out from reading code
- Standard language conventions
- Detailed API docs (link instead)
- Information that changes frequently
- Self-evident practices

Use `@path/to/import` for modular organization:
```markdown
See @README.md for project overview.
# Additional Instructions
- Git workflow: @docs/git-instructions.md
```

### 3.6 Parallel Sessions & Subagents

**Subagents** — delegate research to separate context:
```
Use subagents to investigate how our auth system handles token refresh
and whether we have existing OAuth utilities.
```

**Multiple sessions:**
- Writer/Reviewer pattern: one Claude writes, another reviews
- Test-first: one writes tests, another implements
- Fan-out: loop `claude -p` across files for migrations

**Headless mode** for CI/scripts:
```bash
claude -p "Analyze this log file" --output-format json
```

### 3.7 Skills, Hooks, and Plugins

| Feature | Use For | Example |
|---------|---------|---------|
| **Skills** (`.claude/skills/`) | Domain knowledge, reusable workflows | API conventions, fix-issue workflow |
| **Hooks** | Deterministic actions (must always happen) | Run eslint after every edit |
| **MCP servers** | External tool integrations | Notion, Figma, databases |
| **Plugins** | Bundled skills + hooks + MCP | Code intelligence, framework support |
| **Custom subagents** (`.claude/agents/`) | Specialized isolated tasks | Security reviewer, performance auditor |

### 3.8 Permissions & Safety

- `/permissions` to allowlist safe commands
- `/sandbox` for OS-level isolation
- `--dangerously-skip-permissions` only in containers without internet
- `--allowedTools` to scope batch operations

---

## 4. Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Kitchen sink session** | Mixing unrelated tasks pollutes context | `/clear` between tasks |
| **Correction spiral** | 3+ corrections = noise-filled context | `/clear`, rewrite prompt with learnings |
| **Bloated CLAUDE.md** | Important rules get lost | Prune ruthlessly, use skills for domain knowledge |
| **Trust without verify** | Plausible-looking code with hidden bugs | Always provide tests/verification |
| **Infinite exploration** | Unscoped investigation fills context | Use subagents, scope narrowly |
| **Skipping planning** | Solving the wrong problem | Plan Mode for multi-file changes |

---

## 5. StartupAI-Specific Guidelines

### Edge Functions (Deno Deploy)

Our edge functions use Gemini 3 via the Anthropic-hosted API. Key rules:

| Rule | Detail |
|------|--------|
| Adaptive thinking | Use for Claude API calls in edge functions when migrating to 4.6 |
| Gemini JSON | Always use `responseJsonSchema` + `responseMimeType` |
| Gemini temperature | Keep at 1.0 for Gemini 3 (lower causes looping) |
| API key | `x-goog-api-key` header, never query param |
| Timeouts | `Promise.race` with hard timeout (not `AbortSignal.timeout()`) |
| Background work | `EdgeRuntime.waitUntil()` with fire-and-forget fallback |
| Pipeline deadline | 300s (paid plan allows 400s) |

### Model Selection for AI Features

| Use Case | Model | Effort |
|----------|-------|--------|
| Quick extraction/parsing | `gemini-3-flash-preview` | N/A |
| Deep research/analysis | `gemini-3-pro-preview` | N/A |
| Fast interactive chat | `claude-haiku-4-5` | low/medium |
| Balanced quality/speed | `claude-sonnet-4-5` | medium/high |
| Complex reasoning/agents | `claude-opus-4-6` | high/max |
| Validator pipeline (7 agents) | `gemini-3-flash-preview` | N/A |

### Cost Optimization

1. **Effort levels**: Use `low` for simple tasks, `max` only for complex reasoning
2. **Fast mode**: Only for latency-critical interactive sessions (6x cost)
3. **Compaction**: Enable for long agentic pipelines to avoid context overflow
4. **Prompt caching**: Cache system prompts and tool definitions
5. **Batch API**: Use for non-time-sensitive bulk processing (50% discount)
6. **Subagents**: Haiku for exploration, Opus for implementation

---

## 6. Prompting Best Practices (Opus 4.6)

### 6.1 General Principles

**Be explicit, not vague.** Opus 4.6 follows instructions precisely. Describe exactly what you want:

| Less effective | More effective |
|----------------|----------------|
| "Create an analytics dashboard" | "Create an analytics dashboard. Include filtering, sorting, pagination, and export. Go beyond basics." |
| "NEVER use ellipses" | "Your response will be read aloud by TTS, so never use ellipses since TTS can't pronounce them." |
| "Can you suggest changes?" | "Make changes to improve this function's performance." |

**Add context/motivation.** Explain *why* — Claude generalizes from explanations better than bare rules.

**Be vigilant with examples.** Opus 4.6 pays close attention to examples. Make sure they align with desired behavior.

### 6.2 Thinking & Effort Tuning

Adaptive thinking is promptable. Steer frequency with system prompt guidance:

**Reduce excessive thinking:**
```
Extended thinking adds latency and should only be used when it will
meaningfully improve answer quality — typically for problems that
require multi-step reasoning. When in doubt, respond directly.
```

**Prevent decision-thrashing:**
```
When deciding how to approach a problem, choose an approach and commit
to it. Avoid revisiting decisions unless you encounter new information
that directly contradicts your reasoning.
```

**Guide interleaved thinking (between tool calls):**
```
After receiving tool results, carefully reflect on their quality and
determine optimal next steps before proceeding.
```

### 6.3 Tool Usage & Action Patterns

Opus 4.6 is more responsive to system prompts than older models. Dial back aggressive tool-triggering language.

| Old (overtriggers on 4.6) | New (right-sized) |
|---------------------------|-------------------|
| "CRITICAL: You MUST use this tool when..." | "Use this tool when..." |
| "If in doubt, use [tool]" | "Use [tool] when it would enhance your understanding" |

**Proactive action (default to doing, not suggesting):**
```xml
<default_to_action>
By default, implement changes rather than only suggesting them.
If the user's intent is unclear, infer the most useful likely action
and proceed, using tools to discover any missing details instead of guessing.
</default_to_action>
```

**Conservative action (suggest before doing):**
```xml
<do_not_act_before_instructions>
Do not jump into implementation unless clearly instructed. When ambiguous,
default to providing information and recommendations rather than taking action.
</do_not_act_before_instructions>
```

### 6.4 Parallel Tool Calling

Opus 4.6 excels at parallel execution. Boost to near-100% with:

```xml
<use_parallel_tool_calls>
If you intend to call multiple tools and there are no dependencies between
the calls, make all independent calls in parallel. Never use placeholders
or guess missing parameters. If calls depend on previous results, run
them sequentially.
</use_parallel_tool_calls>
```

### 6.5 Autonomy & Safety Balance

Without guidance, Opus 4.6 may take hard-to-reverse actions. Add guardrails:

```
Consider the reversibility and potential impact of your actions. Take local,
reversible actions freely (editing files, running tests). For destructive
or shared-state actions (deleting files, force-pushing, posting externally),
ask the user before proceeding.
```

### 6.6 Controlling Overthinking & Overengineering

Opus 4.6 does more upfront exploration than previous models. Dial back if needed:

```
Avoid over-engineering. Only make changes directly requested or clearly
necessary. Keep solutions simple and focused:
- Don't add features, refactor code, or make "improvements" beyond what was asked
- Don't add docstrings, comments, or type annotations to code you didn't change
- Don't add error handling for scenarios that can't happen
- Don't create helpers or abstractions for one-time operations
```

### 6.7 Output Format Control

Four techniques, from most to least effective:

1. **Tell Claude what TO do** (not what NOT to do):
   - Instead of: "Do not use markdown"
   - Try: "Your response should be composed of smoothly flowing prose paragraphs."

2. **Use XML format indicators:**
   ```
   Write the prose sections in <smoothly_flowing_prose_paragraphs> tags.
   ```

3. **Match prompt style to desired output.** Remove markdown from your prompt to reduce markdown in output.

4. **Explicit formatting instructions:**
   ```xml
   <avoid_excessive_markdown_and_bullet_points>
   Write in clear, flowing prose using complete paragraphs. Reserve markdown
   for inline code, code blocks, and simple headings. Avoid bold, italics,
   and bullet lists unless items are truly discrete.
   </avoid_excessive_markdown_and_bullet_points>
   ```

### 6.8 Preventing Hallucinations

```xml
<investigate_before_answering>
Never speculate about code you have not opened. If the user references a
specific file, you MUST read the file before answering. Investigate and
read relevant files BEFORE answering questions about the codebase. Never
make claims about code before investigating.
</investigate_before_answering>
```

### 6.9 Long-Horizon & Multi-Window Workflows

Opus 4.6 excels at state tracking across extended sessions. Key patterns:

**Context awareness prompt:**
```
Your context window will be automatically compacted as it approaches its
limit. Do not stop tasks early due to token budget concerns. Save progress
and state to memory before context refreshes. Be as persistent and
autonomous as possible — complete tasks fully.
```

**Multi-window workflow:**
1. First window: Set up framework (write tests, create setup scripts)
2. Subsequent windows: Iterate on todo-list
3. Use structured files (`tests.json`, `progress.txt`) for state
4. Use git for checkpoints and state tracking
5. Provide verification tools (Playwright, screenshots) for autonomous validation

**Starting a fresh context window:**
```
Call pwd; you can only read and write files in this directory.
Review progress.txt, tests.json, and the git logs.
Manually run a fundamental integration test before implementing new features.
```

### 6.10 Subagent Orchestration

Opus 4.6 proactively delegates to subagents. Control overuse:

```
Use subagents when tasks can run in parallel, require isolated context,
or involve independent workstreams. For simple tasks, sequential operations,
single-file edits, or tasks needing shared context across steps, work
directly rather than delegating.
```

### 6.11 Research & Information Gathering

```
Search for this information in a structured way. Develop competing
hypotheses. Track confidence levels in progress notes. Regularly
self-critique your approach. Update a hypothesis tree or research
notes file for transparency.
```

### 6.12 Prefill Migration (Breaking Change on 4.6)

Prefilling assistant messages returns 400 on Opus 4.6. Alternatives:

| Old Pattern | Migration |
|-------------|-----------|
| JSON/YAML format forcing | Use `output_config.format` with structured outputs |
| Skip preamble (`"Here is..."`) | System prompt: "Respond directly without preamble" |
| Avoid bad refusals | Claude 4.6 handles refusals better natively |
| Continue interrupted response | User message: "Your previous response ended with `[text]`. Continue." |
| Context hydration | Inject reminders in user turns or via tools |

### 6.13 Frontend Design Quality

Avoid generic "AI slop" aesthetics with explicit creative direction:

```xml
<frontend_aesthetics>
Make creative, distinctive frontends that surprise and delight.
Focus on:
- Typography: Choose beautiful, unique fonts. Avoid Arial, Inter, Roboto.
- Color: Commit to a cohesive aesthetic with dominant colors + sharp accents.
- Motion: Use animations for micro-interactions. CSS-only when possible.
- Backgrounds: Create atmosphere with gradients, patterns, contextual effects.
Vary between light/dark themes. Think outside the box with every generation.
</frontend_aesthetics>
```

### 6.14 Avoiding Hard-Coding & Test-Passing Hacks

```
Write a high-quality, general-purpose solution. Do not hard-code values
that only work for specific test inputs. Implement the actual logic that
solves the problem generally. If tests are incorrect, inform me rather
than working around them.
```

### 6.15 LaTeX Control

Opus 4.6 defaults to LaTeX for math. To override:
```
Format in plain text only. Do not use LaTeX, MathJax, or markup notation.
Write math with standard text characters (/ for division, * for multiplication,
^ for exponents).
```

---

## 7. Hooks System

Hooks are shell commands that run automatically in response to Claude Code events. They catch errors, enforce standards, and block dangerous operations **without manual intervention**.

### 7.1 Configuration

Hooks live in `.claude/settings.json` under the `hooks` key. Scripts live in `.claude/hooks/`.

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "regex_pattern",
        "hooks": [
          {
            "type": "command",
            "command": "path/to/script.sh",
            "async": false,
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

### 7.2 Available Events

| Event | When | Can Block? | Match On |
|-------|------|-----------|----------|
| `PreToolUse` | Before tool runs | Yes (exit 2) | Tool name (`Bash`, `Edit\|Write`) |
| `PostToolUse` | After tool succeeds | No | Tool name |
| `PostToolUseFailure` | After tool fails | No | Tool name |
| `SessionStart` | Session begins/resumes | No | `startup\|resume\|compact\|clear` |
| `SessionEnd` | Session ends | No | `clear\|logout\|other` |
| `UserPromptSubmit` | User sends message | Yes | (no matcher) |
| `Notification` | Alert fires | No | `permission_prompt\|idle_prompt` |
| `SubagentStart` / `SubagentStop` | Agent lifecycle | No / Yes | Agent type name |
| `Stop` | Claude finishes | Yes | (no matcher) |
| `PreCompact` | Before compaction | No | `manual\|auto` |

### 7.3 Our Hooks (StartupAI)

**4 hooks configured** in `.claude/settings.json`:

| Hook | Event | Script | Purpose |
|------|-------|--------|---------|
| **Lint on Save** | `PostToolUse` (Write\|Edit) | `.claude/hooks/lint-on-save.sh` | ESLint --fix on .ts/.tsx files in src/ and supabase/ |
| **Type Check** | `PostToolUse` (Write\|Edit) | `.claude/hooks/typecheck-async.sh` | Async `tsc --noEmit` — reports errors without blocking |
| **Command Guard** | `PreToolUse` (Bash) | `.claude/hooks/validate-commands.sh` | Blocks `git push --force`, `DROP TABLE`, `rm -rf /src`, `.env` writes |
| **Session Context** | `SessionStart` (compact\|resume) | `.claude/hooks/session-context.sh` | Re-injects project conventions after compaction |
| **Desktop Notify** | `Notification` | inline | `notify-send` when Claude needs attention |

### 7.4 Writing Custom Hooks

**Hook scripts receive JSON on stdin** with tool input details:

```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
```

**Exit codes:**
- `0` — success, proceed normally. JSON on stdout parsed for `systemMessage`
- `2` — **block the action**. Stderr fed back to Claude as feedback
- Other — non-blocking warning (visible in verbose mode)

**Environment variables:**
- `$CLAUDE_PROJECT_DIR` — project root
- `$CLAUDE_ENV_FILE` — persist env vars (SessionStart only)

### 7.5 Hook Patterns

**Pattern: Block edits to protected files**
```bash
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
PROTECTED=(".env" ".git" "package-lock.json" "supabase/config.toml")
for p in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$p"* ]]; then
    echo "Blocked: $p is protected" >&2
    exit 2
  fi
done
```

**Pattern: Auto-format on save (non-blocking)**
```json
{
  "matcher": "Write|Edit",
  "hooks": [{
    "type": "command",
    "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write",
    "async": true
  }]
}
```

**Pattern: Re-inject context after compaction**
```json
{
  "matcher": "compact",
  "hooks": [{
    "type": "command",
    "command": "echo 'Key conventions: @/ = ./src/, RLS on all tables, JWT required'"
  }]
}
```

---

## 8. Custom Agents

Custom agents are specialized subprocesses that run in isolated context. Define them in `.claude/agents/` as markdown files.

### 8.1 Agent Format

```markdown
---
name: agent-name
description: One-line purpose. Used to auto-select this agent.
tools: Read, Grep, Glob, Bash
model: opus
---

System prompt for the agent. Describe role, constraints, workflow.
```

**Available fields:**
- `name` — identifier (used in Task tool `subagent_type`)
- `description` — when to invoke this agent
- `tools` — which tools the agent can access
- `model` — `opus`, `sonnet`, or `haiku`

### 8.2 Our Agents (StartupAI — 10 agents)

| Agent | Model | Tools | Use When |
|-------|-------|-------|----------|
| `code-reviewer` | opus | Read, Grep, Glob, Bash | After writing code — reviews for quality, security, maintainability |
| `security-auditor` | opus | Read, Grep, Glob, Bash | Before deployments — OWASP top 10, RLS audit, secret scanning |
| `debugger` | opus | Read, Edit, Bash, Grep, Glob | Errors/failures — systematic root cause analysis |
| `test-runner` | opus | Bash, Read, Grep, Glob | After implementation — runs tests, analyzes coverage |
| `frontend-designer` | opus | Read, Edit, Write, Grep, Glob | UI work — React components, Tailwind, shadcn/ui |
| `supabase-expert` | opus | Read, Edit, Write, Bash, Grep, Glob | DB work — schema, RLS, migrations, edge functions |
| `ai-agent-dev` | opus | Read, Edit, Write, Bash, Grep, Glob | AI features — Gemini/Claude API, prompt engineering |
| `performance-optimizer` | opus | Read, Edit, Bash, Grep, Glob | Performance — React optimization, query tuning |
| `doc-writer` | opus | Read, Write, Grep, Glob | After features — API docs, technical specs |
| `startup-expert` | opus | Read, Edit, Write, Grep, Glob | Domain features — Lean Canvas, validation, metrics |

### 8.3 When to Use Agents vs Direct Work

| Scenario | Approach |
|----------|----------|
| Simple file edit | Direct (no agent) |
| Read 1-3 files | Direct with Read tool |
| Explore unknown code | `Explore` agent |
| Multi-file investigation | `general-purpose` agent |
| Code review after changes | `code-reviewer` agent |
| Security check before deploy | `security-auditor` agent |
| Debug a failing test | `debugger` agent |
| Multiple independent tasks | Parallel agents |

### 8.4 Writing Effective Agent Prompts

**Good agent prompt:**
```
Review the changes in src/components/validator/ for:
1. TypeScript type safety (no any types)
2. React hook rules compliance
3. Supabase RLS policy gaps
Focus on the ValidatorChat component refactor.
```

**Bad agent prompt:**
```
Review the code.
```

**Key principles:**
- Scope the review (which files, what to check)
- Provide context (what changed and why)
- Specify output format (critical/warning/suggestion)
- Reference patterns (point to existing code as examples)

### 8.5 Multi-Agent Patterns

**Writer/Reviewer:**
1. Main context writes implementation
2. `code-reviewer` agent reviews the changes
3. Main context fixes issues found

**Fan-out investigation:**
```
Launch 3 parallel agents:
- Agent 1: Search for all uses of `useAuth` in src/
- Agent 2: Check RLS policies on validator tables
- Agent 3: Verify edge function JWT patterns
```

**Pipeline validation:**
1. `test-runner` → runs test suite
2. `security-auditor` → checks for vulnerabilities
3. `performance-optimizer` → profiles slow paths

---

## 9. Task/Todo Tracking

Claude Code has a built-in task tracking system for managing complex, multi-step work. Tasks appear in the status line and help both you and Claude track progress.

### 9.1 When to Use Tasks

| Use Tasks | Don't Use Tasks |
|-----------|-----------------|
| 3+ step implementation | Single file edit |
| Multi-file refactoring | Quick bug fix |
| Feature with acceptance criteria | Simple question |
| Plan mode execution | Research/exploration |
| User provides a numbered list | Conversational task |

### 9.2 Task Lifecycle

```
Create (pending) → Start (in_progress) → Complete (completed)
                                        → Delete (if no longer needed)
```

**Commands:**
- `TaskCreate` — add a new task with subject, description, activeForm
- `TaskUpdate` — change status, add dependencies, update description
- `TaskList` — see all tasks and their status
- `TaskGet` — get full details of a specific task

### 9.3 Task Fields

```json
{
  "subject": "Implement section regeneration endpoint",
  "description": "Create validator-regenerate v2 that accepts section_number and chat_context...",
  "activeForm": "Implementing section regeneration"
}
```

- **subject** — imperative form ("Run tests", "Add RLS policy")
- **description** — detailed requirements, acceptance criteria, file paths
- **activeForm** — present continuous ("Running tests", "Adding RLS policy") — shown in spinner

### 9.4 Dependencies

Tasks can block each other:

```
TaskUpdate: { taskId: "2", addBlockedBy: ["1"] }
```

This means task 2 can't start until task 1 completes. Use for:
- Schema migration must run before frontend wiring
- Tests must pass before PR creation
- Build must succeed before deployment

### 9.5 Task Patterns

**Pattern: Feature implementation**
```
Task 1: Create database migration (schema changes)
Task 2: Update edge function (blocked by 1)
Task 3: Wire frontend component (blocked by 2)
Task 4: Write tests (blocked by 3)
Task 5: Code review (blocked by 4)
```

**Pattern: Bug fix**
```
Task 1: Reproduce the bug (write failing test)
Task 2: Identify root cause (blocked by 1)
Task 3: Implement fix (blocked by 2)
Task 4: Verify fix (run tests, blocked by 3)
```

**Pattern: Multi-agent parallel work**
```
Task 1: Frontend component (assigned to main context)
Task 2: Edge function (assigned to supabase-expert agent)
Task 3: Integration test (blocked by 1 and 2)
```

### 9.6 Best Practices

1. **Create tasks before starting** — plan the work, then execute
2. **Mark in_progress when starting** — shows progress in status line
3. **Mark completed when done** — only when fully verified, not partially done
4. **Work in ID order** — lower IDs often set up context for later tasks
5. **Add descriptions** — detailed enough for another agent to understand
6. **Use dependencies** — prevent starting work before prerequisites are met
7. **Don't over-track** — 3-7 tasks is ideal; more becomes noise

---

## 10. Founder User Stories & Journeys

These stories show how a startup founder uses Claude Code + hooks + agents + tasks to build features efficiently.

### 10.1 User Stories

| As a... | I want to... | So that... | Claude Code Feature |
|---------|--------------|------------|---------------------|
| Solo founder with no CTO | Claude to plan architecture before coding | I don't build the wrong thing and waste weeks | Plan Mode + `Explore` agent |
| Founder iterating on MVP | instant lint + type feedback after every edit | bugs are caught in seconds, not after deployment | Hooks (lint-on-save, typecheck-async) |
| Founder deploying to production | dangerous commands (force push, DROP TABLE) to be blocked | I can't accidentally destroy my database at 2am | Hooks (validate-commands) |
| Founder context-switching between features | Claude to remember project conventions after compaction | I don't re-explain "use RLS on every table" in every session | Hooks (session-context) + Memory |
| Founder reviewing AI-generated code | an automated security scan before I merge | I don't ship XSS or exposed API keys to users | `security-auditor` agent |
| Founder building a complex feature | a clear task list showing what's done and what's left | I see progress and don't lose track of 7-step implementations | Task/Todo tracking |
| Founder debugging a failing edge function | systematic root-cause analysis, not random guessing | I fix the actual problem in one session instead of three | `debugger` agent |
| Founder with 10 files to update | parallel agents handling independent changes simultaneously | a 30-minute job finishes in 5 minutes | Parallel subagents |
| Non-technical founder | Claude to explain what it changed and why | I understand my own codebase enough to make product decisions | `doc-writer` agent + code comments |
| Founder who lost context after a break | resume a named session with full history | I pick up exactly where I left off, no re-explaining | `/rename` + `claude --resume` |

### 10.2 Founder Journey: Building a New Feature

A typical journey for implementing a new feature (e.g., "Add section regeneration to the report"):

```
Phase 1: PLAN (10 min)
──────────────────────
Founder: "I want founders to regenerate weak report sections"
  → Claude enters Plan Mode
  → Explore agent reads existing report code, edge functions, DB schema
  → Claude presents plan: 5 tasks with dependencies
  → Founder approves

Phase 2: IMPLEMENT (30 min)
───────────────────────────
Task 1: Database migration (pending → in_progress → completed)
  → Claude writes migration SQL
  → Hook: validate-commands blocks if DROP TABLE detected
  → supabase-expert agent verifies RLS policies

Task 2: Edge function (blocked by 1 → in_progress → completed)
  → Claude writes validator-regenerate v2
  → Hook: lint-on-save auto-fixes formatting
  → Hook: typecheck-async catches type errors
  → ai-agent-dev agent verifies Gemini integration (G1-G4)

Task 3: Frontend component (blocked by 2 → in_progress → completed)
  → Claude builds React component with shadcn/ui
  → frontend-designer agent checks component patterns
  → Hook: lint-on-save ensures code style

Task 4: Tests (blocked by 3 → in_progress → completed)
  → test-runner agent writes and runs Vitest tests
  → 96/96 tests pass → task marked complete

Phase 3: REVIEW (5 min)
────────────────────────
  → code-reviewer agent scans all changed files
  → security-auditor agent checks for vulnerabilities
  → Claude creates PR with summary

Phase 4: SHIP
─────────────
  → Founder reviews PR, merges
  → Feature live
```

### 10.3 AI Agent Workflows

#### Workflow A: Code → Review → Fix Loop

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Main Claude  │────→│ code-reviewer │────→│  Main Claude  │
│  writes code  │     │  finds issues │     │  fixes issues │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                          │
       │              ┌──────────────┐            │
       └─────────────→│ test-runner  │←───────────┘
                      │  verifies    │
                      └──────────────┘
```

**When:** After any significant code change. The review catches issues before they compound.

#### Workflow B: Security Gate Before Deploy

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Code ready   │────→│ security-auditor  │────→│  Fix findings │
│  for deploy   │     │ • RLS audit       │     │  if any       │
└──────────────┘     │ • Secret scan     │     └───────┬──────┘
                      │ • OWASP checks    │             │
                      │ • Edge fn JWT     │     ┌───────▼──────┐
                      └──────────────────┘     │  Deploy safe  │
                                                └──────────────┘
```

**When:** Before any production deployment or PR merge.

#### Workflow C: Parallel Investigation

```
┌──────────┐
│  Founder  │──── "Why is the validator slow?"
└────┬─────┘
     │
     ├───→ Agent 1 (performance-optimizer): Profile edge function timing
     │
     ├───→ Agent 2 (supabase-expert): Check query plans + missing indexes
     │
     └───→ Agent 3 (debugger): Trace pipeline bottleneck in logs

     All 3 return findings → Main Claude synthesizes → Action plan
```

**When:** Investigating a complex problem with multiple possible causes.

#### Workflow D: Feature Development Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature Pipeline                          │
│                                                             │
│  Plan Mode ──→ TaskCreate ──→ Sequential Execution          │
│                                                             │
│  ┌─────────┐   ┌───────────┐   ┌──────────┐   ┌─────────┐│
│  │Migration│──→│Edge Fn    │──→│Frontend  │──→│Tests    ││
│  │(supabase│   │(ai-agent- │   │(frontend-│   │(test-   ││
│  │-expert) │   │dev)       │   │designer) │   │runner)  ││
│  └─────────┘   └───────────┘   └──────────┘   └─────────┘│
│       │              │              │              │        │
│       ▼              ▼              ▼              ▼        │
│  Hook: validate  Hook: lint    Hook: lint    Hook: verify  │
│  Hook: typecheck Hook: type    Hook: type                  │
│                                                             │
│  Final: code-reviewer + security-auditor ──→ PR            │
└─────────────────────────────────────────────────────────────┘
```

**When:** Any non-trivial feature (3+ files changed). This is the full pipeline.

#### Workflow E: Context Recovery After Compaction

```
Session runs long ──→ Context compacts
                          │
                          ▼
                 Hook: session-context.sh
                 Re-injects:
                 • Project conventions (@/ = ./src/)
                 • Current phase priorities
                 • Gemini rules (G1-G4)
                 • Key file locations
                          │
                          ▼
                 Claude continues with
                 full project awareness
```

**When:** Automatic — fires on every compaction or session resume.

### 10.4 Choosing the Right Agent

```
What are you doing?
     │
     ├── Writing new code ──→ Direct (main context)
     │     └── Need UI ──→ frontend-designer agent
     │     └── Need DB ──→ supabase-expert agent
     │     └── Need AI ──→ ai-agent-dev agent
     │
     ├── Reviewing code ──→ code-reviewer agent
     │
     ├── Finding a bug ──→ debugger agent
     │     └── Performance issue ──→ performance-optimizer agent
     │
     ├── Deploying ──→ security-auditor agent first
     │
     ├── Exploring codebase ──→ Explore agent (fast, read-only)
     │
     ├── Writing docs ──→ doc-writer agent
     │
     └── Domain question ──→ startup-expert agent
```

---

## 11. Quick Reference

### API Parameters (Opus 4.6)

```python
response = client.messages.create(
    model="claude-opus-4-6",           # Model ID
    max_tokens=16000,                   # Up to 128K (stream for large values)
    thinking={"type": "adaptive"},      # Adaptive thinking (recommended)
    output_config={
        "effort": "high",              # low | medium | high | max
        "format": {"type": "json_schema", "schema": {...}}  # Structured output
    },
    # inference_geo="us",              # Optional: US-only inference (1.1x)
    messages=[...]
)
```

### Fast Mode (Beta)
```python
response = client.beta.messages.create(
    model="claude-opus-4-6",
    speed="fast",
    betas=["fast-mode-2026-02-01"],
    messages=[...]
)
```

### Compaction (Beta)
```python
response = client.beta.messages.create(
    betas=["compact-2026-01-12"],
    model="claude-opus-4-6",
    context_management={"edits": [{"type": "compact_20260112"}]},
    messages=[...]
)
```

### Pricing Summary

| Model | Input | Output | Notes |
|-------|-------|--------|-------|
| Opus 4.6 (standard) | $5/MTok | $25/MTok | |
| Opus 4.6 (fast) | $30/MTok | $150/MTok | 2.5x speed |
| Opus 4.6 (>200K) | $10/MTok | $50/MTok | Extended context |
| Opus 4.6 (fast >200K) | $60/MTok | $225/MTok | |
| Sonnet 4.5 | $3/MTok | $15/MTok | |
| Haiku 4.5 | $1/MTok | $5/MTok | |

### Prompt Templates for CLAUDE.md / System Prompts

Copy-paste these into system prompts or CLAUDE.md as needed:

```xml
<!-- Proactive action -->
<default_to_action>
Implement changes rather than suggesting them. Infer intent and proceed.
</default_to_action>

<!-- Parallel tools -->
<use_parallel_tool_calls>
Make all independent tool calls in parallel. Never guess missing parameters.
</use_parallel_tool_calls>

<!-- Prevent hallucinations -->
<investigate_before_answering>
Never speculate about code you haven't read. Read files before answering.
</investigate_before_answering>

<!-- Minimize over-engineering -->
<minimal_changes>
Only make changes directly requested. Don't add abstractions, docs, or
error handling beyond what's needed for the current task.
</minimal_changes>

<!-- Safety guardrails -->
<confirm_destructive_actions>
For destructive or shared-state actions, ask before proceeding.
Take local, reversible actions freely.
</confirm_destructive_actions>
```

### Claude Code Session Commands

| Command | Purpose |
|---------|---------|
| `/clear` | Reset context between tasks |
| `/compact` | Manually compact context |
| `/rewind` | Restore to previous checkpoint |
| `/init` | Generate starter CLAUDE.md |
| `/permissions` | Manage tool permissions |
| `/sandbox` | Enable OS-level isolation |
| `/hooks` | Configure deterministic hooks |
| `/rename` | Name sessions for later resume |
| `Esc` | Stop mid-action |
| `Esc + Esc` | Open rewind menu |
| `claude --continue` | Resume last session |
| `claude --resume` | Choose from recent sessions |
| `claude -p "..."` | Headless mode |
