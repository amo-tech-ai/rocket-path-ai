# Auto-Claude System PRD

> **Product Requirements Document**
> Version: 2.8.x
> Last Updated: 2026-01-23

---

## Executive Summary

Auto-Claude is a multi-agent autonomous coding framework that builds software through coordinated AI agent sessions. Built on the Claude Agent SDK, it orchestrates specialized agents in isolated git worktrees to plan, implement, and validate features with human oversight at key checkpoints.

**Core Value Proposition**: Transform natural language feature requests into working code through AI agents, while maintaining human control over approvals, merges, and deployment.

---

## 1. Purpose, Goals & Outcomes

### Purpose

AI-assisted software planning, execution, and review using autonomous Claude agents with mandatory human approval gates.

### Goals

| Goal | Description |
|------|-------------|
| **Automated Planning** | Convert feature requests into structured specs with implementation plans |
| **Autonomous Execution** | Build features through coordinated agent sessions |
| **Self-Validating QA** | AI agents validate their own work against acceptance criteria |
| **Human Oversight** | Maintain approval checkpoints at spec review, QA escalation, and merge |
| **Cross-Session Learning** | Accumulate insights and patterns via Graphiti memory |

### Outcomes

| Outcome | Metric |
|---------|--------|
| Faster Feature Delivery | Spec → Working Code in hours, not days |
| Reduced Manual Review | QA agents pre-validate before human review |
| Improved Code Quality | Automated acceptance criteria verification |
| Institutional Knowledge | Cross-session memory captures patterns and gotchas |

---

## 2. System Architecture

### 2.1 Core Design Principle

```
┌─────────────────────────────────────────────────────────────────┐
│                        HARD RULE                                │
│                                                                 │
│              AI → Propose    Human → Approve    System → Execute│
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Three-Panel Architecture

| Panel | Function | Components |
|-------|----------|------------|
| **Left (Context)** | Project state, repo structure, tasks, history | Project selector, file tree, memory browser |
| **Main (Work)** | Kanban boards, task execution, file edits, reviews | Task cards, terminal grid, diff viewer |
| **Right (Intelligence)** | AI insights, risk analysis, suggestions | Chat interface, recommendations, logs |

### 2.3 Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Electron + React + TypeScript + Zustand |
| **Backend** | Python 3.12+ with async agents |
| **AI Integration** | Claude Agent SDK (NOT raw Anthropic API) |
| **Memory** | Graphiti (semantic graph) + JSON fallback |
| **Isolation** | Git worktrees for workspace separation |
| **Security** | OS sandbox + filesystem permissions + command allowlist |

### 2.4 Data Flow

```
User (Electron Frontend)
        │
        ▼
┌───────────────────┐      ┌─────────────────────┐
│   IPC Bridge      │ ───► │   Python Backend    │
│   (ipcMain)       │      │   (AgentManager)    │
└───────────────────┘      └─────────────────────┘
                                    │
                                    ▼
                           ┌─────────────────────┐
                           │   Claude Agent SDK  │
                           │   (create_client)   │
                           └─────────────────────┘
                                    │
                                    ▼
                           ┌─────────────────────┐
                           │   Agent Sessions    │
                           │   (Planner, Coder,  │
                           │    QA, Spec Agents) │
                           └─────────────────────┘
```

---

## 3. Agent Roles

### 3.1 Authoritative Agent Set

| Agent | Role | Model | Phase |
|-------|------|-------|-------|
| **Orchestrator** | Coordinates multi-step workflows | - | All |
| **Planner** | Creates implementation plan with subtasks | Sonnet 4.5 | Planning |
| **Coder** | Implements individual subtasks | Sonnet 4.5 | Implementation |
| **QA Reviewer** | Validates acceptance criteria | Opus 4.5 | Validation |
| **QA Fixer** | Fixes issues found by reviewer | Opus 4.5 | Validation |
| **Spec Gatherer** | Collects user requirements | Sonnet 4.5 | Spec Creation |
| **Spec Researcher** | Validates external integrations | Sonnet 4.5 | Spec Creation |
| **Spec Writer** | Creates spec.md document | Sonnet 4.5 | Spec Creation |
| **Spec Critic** | Self-critique using extended thinking | Sonnet 4.5 | Spec Creation |
| **Recovery Manager** | Handles stuck/failed subtasks | Sonnet 4.5 | Error Handling |

### 3.2 Agent Tool Provisioning

```python
AGENT_CONFIGS = {
    "spec_gatherer": {
        "tools": BASE_READ_TOOLS + WEB_TOOLS,
        "mcp_servers": [],
    },
    "coder": {
        "tools": BASE_READ + BASE_WRITE + WEB_TOOLS,
        "mcp_servers": ["context7", "auto-claude", "linear"],
    },
    "qa_reviewer": {
        "tools": BASE_READ + WEB_TOOLS + ["Bash"],
        "mcp_servers": ["electron", "puppeteer"],
    },
}
```

---

## 4. Core Workflows

### 4.1 Spec Creation Pipeline

Dynamic complexity-based phases:

| Complexity | Phases | Duration |
|------------|--------|----------|
| **SIMPLE** | Discovery → Quick Spec → Validate | 3 phases |
| **STANDARD** | Discovery → Requirements → Context → Spec → Plan → Validate | 6-7 phases |
| **COMPLEX** | + Research + Self-Critique phases | 8 phases |

**Output Structure:**
```
.auto-claude/specs/001-feature/
├── spec.md                    # Feature specification
├── implementation_plan.json   # Subtasks & phases
├── requirements.json          # Structured requirements
├── context.json               # Discovered codebase context
├── review_state.json          # Approval tracking
└── graphiti/                  # Memory graph data
```

### 4.2 Implementation Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION FLOW                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Load implementation_plan.json                                │
│         │                                                        │
│         ▼                                                        │
│  2. For each pending subtask:                                    │
│     ┌─────────────────────────────────────────┐                  │
│     │ a. Get Graphiti context                 │                  │
│     │ b. Create SDK client with project tools │                  │
│     │ c. Run agent session                    │                  │
│     │ d. Update subtask status                │                  │
│     │ e. Commit changes                       │                  │
│     │ f. Save to memory                       │                  │
│     └─────────────────────────────────────────┘                  │
│         │                                                        │
│         ▼                                                        │
│  3. All subtasks complete → Enter QA Loop                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 QA Validation Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                     QA VALIDATION LOOP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  QA Reviewer Session                                            │
│         │                                                       │
│         ├──► [APPROVED] ──► Return Success                      │
│         │                                                       │
│         └──► [REJECTED] ──► Issue List                          │
│                    │                                            │
│                    ▼                                            │
│              QA Fixer Session                                   │
│                    │                                            │
│                    ▼                                            │
│              Re-run QA Reviewer                                 │
│                    │                                            │
│                    ├──► [Max 50 iterations] ──► Escalate Human  │
│                    │                                            │
│                    └──► [Loop]                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**QA Capabilities:**
- File inspection (Read, Glob, Grep, Bash)
- E2E testing via Electron MCP (screenshots, UI interaction)
- Web testing via Puppeteer MCP
- Acceptance criteria validation

### 4.4 Kanban Task Lifecycle

```
┌──────────┐    ┌─────────────┐    ┌───────────┐    ┌──────────────┐    ┌──────┐
│ backlog  │───►│ in_progress │───►│ ai_review │───►│ human_review │───►│ done │
└──────────┘    └─────────────┘    └───────────┘    └──────────────┘    └──────┘
     │                │                  │                  │
     │                ▼                  ▼                  │
     │           ┌────────┐         ┌────────┐              │
     │           │ error  │         │pr_created│             │
     │           └────────┘         └────────┘              │
     │                                                      │
     └──────────────────────────────────────────────────────┘
                        (User can move cards)
```

---

## 5. Safety & Approval Mechanisms

### 5.1 Three-Layer Security

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **OS Sandbox** | Bash command isolation | Prevent system-level damage |
| **Filesystem** | Operations restricted to project dir | Prevent data leakage |
| **Command Allowlist** | Dynamic from project analysis | Allow only relevant tools |

### 5.2 Human Approval Checkpoints

| Checkpoint | When | Action Required |
|------------|------|-----------------|
| **Spec Review** | After spec creation | User reviews spec.md, approves or requests changes |
| **QA Escalation** | After 50 QA iterations | Human intervention for stuck issues |
| **Worktree Review** | Before merge | User tests in isolated workspace |
| **Merge Approval** | After QA passes | User explicitly merges to main |
| **Push Control** | All branches | User decides when to push to remote |

### 5.3 Change Detection

```python
@dataclass
class ReviewState:
    approved: bool
    approved_by: str            # 'user', 'auto', or username
    approved_at: str            # ISO timestamp
    spec_hash: str              # MD5 of spec + plan (change detection)
```

If spec changes after approval → user must re-approve.

---

## 6. Workspace Isolation

### 6.1 Git Worktree Strategy

```
project/
├── .auto-claude/
│   ├── specs/
│   │   ├── 001-feature/
│   │   └── 002-bugfix/
│   ├── .worktrees/
│   │   ├── 001-feature-worktree/     ← Isolated build
│   │   └── 002-bugfix-worktree/
│   └── security-profile.json
└── [original project files]
```

### 6.2 Branch Model

```
main (user's original branch)
└── auto-claude/001-feature (spec branch in worktree)
```

**Key Principles:**
- ONE branch per spec
- NO automatic pushes to remote
- User reviews in isolated worktree
- User controls merge timing

---

## 7. Memory System

### 7.1 Graphiti Integration

| Component | Purpose |
|-----------|---------|
| `GraphitiMemory` | Main class for memory operations |
| `LadybugDB` | Embedded graph database (no Docker) |
| Semantic Search | Find relevant past context |
| Session Insights | Auto-extract patterns and gotchas |

### 7.2 Multi-Provider Support

**LLM Providers:** OpenAI, Anthropic, Azure, Ollama, Google AI
**Embedding Providers:** OpenAI, Voyage AI, Azure, Ollama, Google AI

### 7.3 Memory Flow

```
Before Subtask:
  └── Retrieve: past insights, gotchas, patterns

During Subtask:
  └── Agent works with enriched context

After Subtask:
  └── Save: discoveries, patterns, lessons learned
```

---

## 8. Feature Matrix

| Feature | Screen | Agents Used | Priority | Score |
|---------|--------|-------------|----------|-------|
| **Repo Analysis** | Insights | Analyst, Retriever | Core | 90/100 |
| **Task Planning** | Kanban | Planner | Core | 88/100 |
| **Autonomous Execution** | Kanban | Orchestrator, Coder | Advanced | 85/100 |
| **Code Review** | Insights | Analyst, Scorer | Core | 92/100 |
| **Risk Detection** | Insights | Analyst, Scorer | Advanced | 87/100 |
| **Optimization** | Ideation | Optimizer | Advanced | 84/100 |
| **Documentation** | Content | Content/Comms | Core | 91/100 |
| **Approval Gates** | All | Controller | Core | 95/100 |
| **E2E Testing** | QA | QA Reviewer | Advanced | 86/100 |
| **Memory/Learning** | All | Memory Manager | Advanced | 83/100 |

**Overall System Score: 89/100**

---

## 9. API Reference

### 9.1 CLI Commands

```bash
# Spec Creation
python spec_runner.py --interactive
python spec_runner.py --task "Add user authentication"
python spec_runner.py --task "Fix button" --complexity simple

# Build Execution
python run.py --spec 001
python run.py --spec 001 --verbose

# Workspace Management
python run.py --spec 001 --review    # Open worktree
python run.py --spec 001 --merge     # Merge to main
python run.py --spec 001 --discard   # Discard build

# QA
python run.py --spec 001 --qa
python run.py --spec 001 --qa-status

# Listing
python run.py --list
```

### 9.2 IPC Channels

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `initialize-project` | Renderer → Main | Load project |
| `run-task` | Renderer → Main | Start spec execution |
| `stop-task` | Renderer → Main | Cancel running task |
| `task-updated` | Main → Renderer | Notify status change |
| `get-build-progress` | Renderer → Main | Get current progress |

### 9.3 SDK Client Creation

```python
from core.client import create_client

client = create_client(
    project_dir=project_dir,
    spec_dir=spec_dir,
    model="claude-sonnet-4-5-20250929",
    agent_type="coder",
    max_thinking_tokens=None  # or 5000/10000/16000
)
```

---

## 10. Roadmap

### Now (Core Stability)

- [x] Stable Kanban with drag-drop
- [x] Reliable spec creation pipeline
- [x] Clear approval gates
- [x] Git worktree isolation
- [x] Basic Graphiti memory

### Next (Advanced Features)

- [ ] Deeper RAG over commit history
- [ ] Smarter QA scoring heuristics
- [ ] CI/CD automation hooks
- [ ] Enhanced E2E testing coverage
- [ ] Multi-file refactoring support

### Later (Production Scale)

- [ ] Multi-repo orchestration
- [ ] Policy-based execution limits
- [ ] Audit & compliance reports
- [ ] Team collaboration features
- [ ] Cloud deployment option

---

## 11. Evaluation Criteria

### Strengths

| Strength | Evidence |
|----------|----------|
| **Safety-First Design** | Three-layer security + human approval gates |
| **Modular Architecture** | Clean separation of agents, tools, memory |
| **Self-Validating** | QA loop catches issues before human review |
| **Cross-Session Learning** | Graphiti memory accumulates insights |
| **Isolated Execution** | Git worktrees prevent production impact |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| QA Loop Stalls | Agent gets stuck fixing same issue | Max 50 iterations + recurring issue detection |
| Memory Bloat | Graphiti grows too large | Pruning strategies + relevance scoring |
| Model Hallucination | Agent writes incorrect code | Acceptance criteria validation + human review |
| Cost Overrun | Too many API calls | Token budgets + thinking limits |

### Improvement Opportunities

1. **Streaming Progress**: Real-time subtask updates to UI
2. **Diff Preview**: Show changes before commit
3. **Rollback Support**: Undo individual subtasks
4. **Parallel Subtasks**: Execute independent subtasks concurrently
5. **Custom Agents**: User-defined agent types

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **Spec** | Feature specification with requirements and implementation plan |
| **Subtask** | Atomic unit of work within an implementation plan |
| **Worktree** | Isolated git workspace for a single spec |
| **QA Loop** | Reviewer → Fixer cycle until approval or escalation |
| **Graphiti** | LLM-powered knowledge graph for cross-session memory |
| **SDK Client** | Configured Claude Agent SDK instance with tools and security |

---

## Appendix A: File Structure

```
autonomous-coding/
├── apps/
│   ├── backend/
│   │   ├── core/              # Client, auth, security, platform
│   │   ├── agents/            # Agent implementations
│   │   ├── spec_agents/       # Spec creation agents
│   │   ├── integrations/      # Graphiti, Linear, GitHub
│   │   ├── prompts/           # Agent system prompts
│   │   ├── implementation_plan/ # Plan data model
│   │   ├── qa/                # QA loop and tools
│   │   └── security/          # Command validation
│   └── frontend/
│       ├── src/main/          # Electron main process
│       ├── src/renderer/      # React components
│       ├── src/preload/       # IPC bridge
│       └── src/shared/        # Types, constants, i18n
├── docs/                      # Documentation
├── tests/                     # Test suite
└── scripts/                   # Build utilities
```

---

## Appendix B: Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Graphiti Memory
GRAPHITI_ENABLED=true
OPENAI_API_KEY=...           # For embeddings

# Optional MCP
ELECTRON_MCP_ENABLED=true
ELECTRON_DEBUG_PORT=9222
LINEAR_API_KEY=...
GITHUB_TOKEN=...
```

---

*Document generated from codebase analysis. For implementation details, see source code.*
