---
name: figjam-diagrams
description: Generate collaborative diagrams in FigJam using Mermaid.js via the Figma MCP. Use when user wants to create flowcharts, decision trees, Gantt charts, sequence diagrams, or state diagrams in FigJam. Triggers on "create a diagram", "make a flowchart", "generate a decision tree", "Gantt chart", "sequence diagram", "state diagram", "FigJam diagram", "visualize this process", "map this workflow", or any request to diagram architecture, processes, user flows, or project timelines. Requires Figma MCP server connection.
---

# FigJam Diagrams

Generate collaborative diagrams in FigJam using the `generate_diagram` MCP tool, which converts Mermaid.js syntax into editable FigJam boards.

## Supported Diagram Types

| Type | Mermaid Keyword | Best For |
|------|----------------|----------|
| Flowchart | `flowchart LR` or `graph LR` | Processes, user flows, system architecture |
| Decision Tree | `flowchart TD` | If/else logic, routing, triage workflows |
| Gantt Chart | `gantt` | Timelines, project plans, sprint roadmaps |
| Sequence Diagram | `sequenceDiagram` | API calls, auth flows, service interactions |
| State Diagram | `stateDiagram-v2` | State machines, lifecycle tracking, status flows |

**Not supported:** Class diagrams, timelines, Venn diagrams, ER diagrams, pie charts, mindmaps, or other Mermaid types. Also cannot move individual shapes, change fonts, or do fine layout adjustments after generation — users should open the FigJam file for those edits.

## Required Workflow

### Step 1: Identify Diagram Type

Match the user's request to the best diagram type:

- **Process / workflow / pipeline / how-it-works** → Flowchart (`flowchart LR`)
- **Conditional logic / if-then / routing / triage** → Decision Tree (`flowchart TD`)
- **Timeline / schedule / sprints / milestones** → Gantt Chart (`gantt`)
- **API call chain / request-response / auth flow** → Sequence Diagram (`sequenceDiagram`)
- **Status transitions / lifecycle / state machine** → State Diagram (`stateDiagram-v2`)

If ambiguous, default to flowchart — it's the most flexible.

### Step 2: Write Mermaid Syntax

Follow these rules strictly — the `generate_diagram` tool will reject invalid syntax:

**General rules (all diagram types):**
- Do NOT use emojis in the Mermaid code
- Do NOT use `\n` for newlines — use actual line breaks
- Keep diagrams simple unless the user asks for detail
- Only the 5 supported types are valid

**Flowchart / Decision Tree rules:**
- Use `LR` (left-to-right) by default; use `TD` for decision trees
- Put ALL shape text and edge text in double quotes:
  - Shapes: `A["Start"]`, `B["Process Data"]`
  - Edge text: `A -->|"Yes"| B` or `A --"Label"--> B`
- Color styling is allowed but use sparingly unless requested
- Full range of shapes available: `["rect"]`, `("rounded")`, `{"diamond"}`, `(["stadium"])`, `[["subroutine"]]`, `(("circle"))`, `>["flag"]`, `{{"hexagon"}}`

**Gantt Chart rules:**
- Do NOT use color styling in Gantt charts
- Format:
  ```
  gantt
    title Project Plan
    dateFormat YYYY-MM-DD
    section Phase 1
    Task A :a1, 2026-02-17, 7d
    Task B :after a1, 5d
  ```

**Sequence Diagram rules:**
- Do NOT use `note` statements (notes are not supported)
- Format:
  ```
  sequenceDiagram
    participant A as Client
    participant B as Server
    A->>B: Request
    B-->>A: Response
  ```

**State Diagram rules:**
- Use `stateDiagram-v2` (not `stateDiagram`)
- Do NOT use the word `end` in class names
- Format:
  ```
  stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: start
    Processing --> Done: complete
    Done --> [*]
  ```

### Step 3: Call generate_diagram

```
generate_diagram(
  name="Short descriptive title",
  mermaidSyntax="flowchart LR\n  A[\"Start\"] --> B[\"End\"]"
)
```

Parameters:
- `name` — Human-readable title (short but descriptive)
- `mermaidSyntax` — Valid Mermaid.js code following the rules above
- `userIntent` (optional) — Description of what the user wants

### Step 4: Share Result

The tool returns a FigJam link. Share it with the user and mention they can:
- Open it in FigJam to edit, rearrange, and style
- Share with collaborators
- Add sticky notes, stamps, and annotations

## Use Cases & Examples

For detailed examples for each diagram type and common startup/product use cases, see [references/examples.md](references/examples.md).

### Quick Examples

**User flow:**
```
flowchart LR
  A["Landing Page"] --> B["Sign Up"]
  B --> C["Onboarding Wizard"]
  C --> D["Dashboard"]
```

**API auth flow:**
```
sequenceDiagram
  participant U as User
  participant A as Auth Service
  participant D as Database
  U->>A: POST /login
  A->>D: Validate credentials
  D-->>A: User record
  A-->>U: JWT token
```

**Sprint plan:**
```
gantt
  title Sprint 12
  dateFormat YYYY-MM-DD
  section Backend
  API endpoints :a1, 2026-02-17, 5d
  Database migration :after a1, 3d
  section Frontend
  UI components :2026-02-17, 7d
  Integration :2026-02-24, 4d
```

## Tips

- **Start simple** — generate a minimal diagram first, then iterate
- **Use subgraphs** for complex flowcharts: `subgraph "Section Name"` groups related nodes
- **Color sparingly** — only in flowcharts, and only when it adds clarity
- **After generation**, tell users to open in FigJam for fine-tuning (moving nodes, adding sticky notes, changing colors)
