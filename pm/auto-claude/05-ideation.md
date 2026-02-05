# Ideation Feature Guide

## Executive Summary

Ideation is Auto Claude's AI-powered feature discovery engine. It analyzes your entire codebase and generates actionable improvement ideas across six categories: Code, UI/UX, Documentation, Security, Performance, and Code Quality. Ideas stream in real-time as AI agents work in parallel, and any idea can be converted into a buildable task with one click.

---

## How It Works (High-Level)

| Step | What Happens | Who Does It |
|------|-------------|-------------|
| 1. User clicks Generate | Frontend sends request to Electron main process | User via UI |
| 2. Auth check | Fresh OAuth token is read from system credential store | Main process |
| 3. Python process spawns | Agent queue launches the ideation runner with project config | Electron main |
| 4. Project analysis | AI indexes project structure, files, and patterns | Python backend |
| 5. Parallel generation | Six AI agents run simultaneously, one per idea type | Claude Agent SDK |
| 6. Real-time streaming | Ideas appear in the UI as each agent completes | IPC event system |
| 7. Results saved | All ideas persist to project storage for future use | File system |

---

## Architecture

```mermaid
flowchart TB
    subgraph Frontend ["Frontend (React + Electron)"]
        UI["Ideation UI Panel"]
        Store["Zustand State Store"]
        IPC["IPC Event Bridge"]
    end

    subgraph Main ["Electron Main Process"]
        Handlers["Generation Handlers"]
        Queue["Agent Queue"]
        Auth["Token Manager"]
    end

    subgraph Backend ["Python Backend"]
        Runner["Ideation Orchestrator"]
        Analyzer["Project Analyzer"]
        Agents["AI Generation Agents"]
    end

    UI -->|"Generate Request"| IPC
    IPC -->|"IPC Channel"| Handlers
    Handlers -->|"Start Generation"| Queue
    Queue -->|"Fresh Token"| Auth
    Queue -->|"Spawn Process"| Runner
    Runner -->|"Phase 1"| Analyzer
    Runner -->|"Phase 2"| Agents
    Agents -->|"Stream Events"| Queue
    Queue -->|"Progress Updates"| IPC
    IPC -->|"State Updates"| Store
    Store -->|"Re-render"| UI
```

---

## The Six Idea Types

| Type | Icon | What AI Analyzes | Example Output |
|------|------|-----------------|----------------|
| Code Improvements | Zap (green) | Refactoring opportunities, DRY violations, design patterns | "Extract reusable useTableFilters hook for all list views" |
| UI/UX Improvements | Palette (blue) | User experience gaps, accessibility issues, visual design | "Add aria-labels to icon-only buttons across layout" |
| Documentation Gaps | Book (amber) | Missing docs, outdated guides, undocumented APIs | "Add API endpoint documentation for auth routes" |
| Security Hardening | Shield (red) | Vulnerabilities, OWASP top 10, auth weaknesses | "Add rate limiting to public API endpoints" |
| Performance Optimization | Gauge (purple) | Slow queries, bundle size, rendering bottlenecks | "Lazy load heavy dashboard components" |
| Code Quality | Terminal (cyan) | Best practices, test coverage, type safety | "Add unit tests for critical business logic" |

---

## Generation Pipeline

```mermaid
sequenceDiagram
    participant User
    participant UI as Ideation UI
    participant Main as Electron Main
    participant Python as Python Backend
    participant AI as Claude AI Agents

    User->>UI: Click "Generate Ideas"
    UI->>Main: Send generation request
    Main->>Main: Validate auth token
    Main->>Python: Spawn ideation runner

    rect rgb(240, 248, 255)
        Note over Python: Phase 1 - Project Analysis
        Python->>Python: Index project structure
        Python->>Python: Gather context and graph hints
    end

    rect rgb(240, 255, 240)
        Note over Python,AI: Phase 2 - Parallel AI Generation
        Python->>AI: Code Improvements Agent
        Python->>AI: UI/UX Agent
        Python->>AI: Documentation Agent
        Python->>AI: Security Agent
        Python->>AI: Performance Agent
        Python->>AI: Code Quality Agent
    end

    loop As each agent completes
        AI-->>Python: Ideas for type
        Python-->>Main: Stream event
        Main-->>UI: Progress update
        UI-->>User: Ideas appear in real-time
    end

    rect rgb(255, 248, 240)
        Note over Python: Phase 3 - Finalize
        Python->>Python: Merge and save all ideas
    end

    Python-->>Main: Generation complete
    Main-->>UI: Final status
    UI-->>User: All ideas displayed
```

---

## 3-Panel Layout

```mermaid
graph LR
    subgraph Left ["Left Panel - Context"]
        Nav["Project Navigation"]
        Projects["Project Tabs"]
        Sidebar["Sidebar Menu Items"]
    end

    subgraph Center ["Main Panel - Work"]
        Header["Ideation Header<br/>Total count + type breakdown"]
        Filters["Filter Tabs<br/>All | Code | UI/UX | Docs | Security | Performance"]
        Cards["Idea Cards Grid<br/>Title, description, category, effort"]
    end

    subgraph Right ["Right Panel - Intelligence"]
        Detail["Idea Detail View"]
        Meta["Type-Specific Metadata<br/>Affected files, effort, approach"]
        Actions["Actions<br/>Convert to Task | Dismiss | Archive"]
    end

    Left --- Center --- Right
```

### Panel Responsibilities

| Panel | Role | Contains |
|-------|------|----------|
| Left (Context) | Navigation and project switching | Sidebar with all project sections, project tabs at top |
| Main (Work) | Browse and manage ideas | Header with counts, filter tabs, scrollable idea card grid |
| Right (Intelligence) | Deep dive into selected idea | Full metadata, rationale, affected files, action buttons |

---

## Idea Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: AI generates idea
    Draft --> Selected: User selects for review
    Draft --> Dismissed: User dismisses
    Draft --> Converted: User converts to task
    Selected --> Converted: User converts to task
    Selected --> Dismissed: User dismisses
    Dismissed --> Draft: User restores
    Converted --> [*]: Idea becomes buildable spec
    Dismissed --> [*]: Archived/deleted
```

| Status | Meaning | What Happens Next |
|--------|---------|-------------------|
| Draft | Freshly generated by AI | User reviews and decides |
| Selected | Marked for consideration | User converts or dismisses |
| Converted | Turned into a task | Spec directory created, ready to build |
| Dismissed | Hidden from main view | Can be restored or permanently deleted |

---

## Idea-to-Task Conversion

When a user clicks "Convert to Task" on an idea:

```mermaid
flowchart LR
    A["Idea in Ideation"] -->|"Convert"| B["Create Spec Directory"]
    B --> C["Generate task.md"]
    B --> D["Generate implementation_plan.json"]
    C --> E["Task appears in Kanban Board"]
    D --> E
    E --> F["Ready for AI Build"]
```

| What Gets Created | Content |
|-------------------|---------|
| Spec directory | `.auto-claude/specs/{number}-{idea-title}/` |
| Task document | Title, description, rationale, acceptance criteria |
| Implementation plan | Subtasks derived from idea metadata |
| Task metadata | Category, effort, affected files, approach |

---

## AI Agent Architecture

Each idea type has a dedicated AI agent with a specialized prompt:

```mermaid
flowchart TB
    Orchestrator["Ideation Orchestrator"]

    Orchestrator --> A1["Code Improvements Agent"]
    Orchestrator --> A2["UI/UX Agent"]
    Orchestrator --> A3["Documentation Agent"]
    Orchestrator --> A4["Security Agent"]
    Orchestrator --> A5["Performance Agent"]
    Orchestrator --> A6["Code Quality Agent"]

    A1 --> Out["Merged Output<br/>ideation.json"]
    A2 --> Out
    A3 --> Out
    A4 --> Out
    A5 --> Out
    A6 --> Out
```

### Agent Configuration

| Setting | Options | Default |
|---------|---------|---------|
| Model | Sonnet, Opus, Haiku | Sonnet |
| Thinking Level | None, Low, Medium, High | None |
| Max Ideas Per Type | 1-20 | 5 |
| Enabled Types | Any combination of 6 types | All enabled |
| Include Roadmap Context | Yes/No | No |
| Include Kanban Context | Yes/No | No |

---

## Real-Time Progress Tracking

During generation, the UI shows progress through distinct phases:

| Phase | Progress | What's Happening |
|-------|----------|-----------------|
| Idle | 0% | Waiting to start |
| Analyzing | 10% | Reading project structure |
| Discovering | 20% | Gathering context and patterns |
| Generating | 30-90% | AI agents producing ideas (progress scales with completed types) |
| Finalizing | 90% | Merging and validating results |
| Complete | 100% | All ideas ready |

Each idea type also has its own status indicator (pending, generating, completed) so users can see which categories are done.

---

## Data Storage

All ideation data persists per-project:

| File | Location | Content |
|------|----------|---------|
| Ideation session | `.auto-claude/ideation/ideation.json` | All ideas, config, project context, timestamps |
| Converted tasks | `.auto-claude/specs/{n}-{name}/` | Task docs and implementation plans |

Ideas survive app restarts and are loaded automatically when revisiting the Ideation page.

---

## User Actions Summary

| Action | Effect |
|--------|--------|
| Generate | Run AI analysis and create new ideas |
| Refresh | Regenerate with fresh analysis (keeps or replaces existing) |
| Stop | Halt generation mid-process |
| Filter by type | Show only Code, UI/UX, Docs, Security, or Performance ideas |
| Select ideas | Multi-select for bulk operations |
| Convert to task | Create buildable spec from idea |
| Dismiss | Hide idea from main view |
| Delete | Permanently remove idea |
| Show dismissed | Toggle visibility of dismissed ideas |
