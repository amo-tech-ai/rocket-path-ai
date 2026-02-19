# StartupAI - Mermaid Diagrams

> **Source:** [prd.md](../prd.md)
> **Rules:** [.cursor/rules/mermaid.mdc](../.cursor/rules/mermaid.mdc)

---

## Diagram Index

| ID | File | Type | Purpose |
|----|------|------|---------|
| 01 | [01-system-architecture.md](01-system-architecture.md) | C4/Flowchart | End-to-end system flow |
| 02 | [02-ai-workflow.md](02-ai-workflow.md) | Flowchart | AI Propose → Approve → Execute |
| 03 | [03-user-journey.md](03-user-journey.md) | Journey/State | First day onboarding |
| 04 | [04-module-phases.md](04-module-phases.md) | Flowchart | 16 modules across 4 phases |
| 05 | [05-data-model.md](05-data-model.md) | ER Diagram | Core tables and relationships |
| 06 | [06-agent-architecture.md](06-agent-architecture.md) | Class/Flow | 10 agent types |

---

## Document Flow

```
PRD (prd.md) → Diagrams (mermaid/) → Tasks (tasks/)
```

---

## Verification Rules

1. **Start + End exist** — Every path reaches completion
2. **Ownership clear** — User / UI / AI / Backend / DB labeled
3. **AI never writes directly** — Always: AI → Suggest → Approve → Execute
4. **Failures shown** — At least one error path per diagram
5. **Box → Task** — Every node maps to implementation task
