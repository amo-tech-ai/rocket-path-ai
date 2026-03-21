---
task_id: DES-024
title: Sankey Diagram
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /scroll-storyteller
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 24 — Sankey Diagram

> **Category:** Flows & Relationships
> **When to use:** Volume/flow between stages. Width of flow = quantity. Best for 3-5 stages.
> **Flourish template:** Sankey diagram
> **Best for:** User journeys, revenue to cost flows, supply chain, conversion funnels, budget allocation paths

---

## Prompt A — Generate Sankey Diagram

```
Create a Sankey diagram showing flows between stages.

DATA: [e.g., "Website funnel: 10K visitors -> 3K signups -> 800 trials -> 200 paid -> 50 enterprise; also 7K visitors bounced, 2.2K signups churned, 600 trials abandoned"]
STORY: [e.g., "The biggest drop-off is signup-to-trial — 73% of signups never start a trial"]

Create:
1. Nodes (stages) arranged left-to-right
2. Flow width proportional to volume
3. Color strategy (pick one):
   a) Color flows by DESTINATION — shows where things end up
   b) Color flows by SOURCE — shows where things come from
   c) Single color with DROPOUT flows in red — highlights losses
4. Node labels: stage name + total volume
5. Flow labels (on hover): source -> destination + volume + percentage
6. Highlight the BIGGEST drop-off flow in red with annotation
7. Source citation

Data as CSV: Source, Target, Value
- Each row = one flow from a source node to a target node
- Flows must be additive (inputs to a node = sum of outputs)

RULES:
- Max 5 stages (source to sink)
- Max 15 total flows (or it becomes spaghetti)
- Flows go LEFT to RIGHT only (no circular flows)
- All volume must be accounted for (no disappearing quantities)
```

---

## Prompt B — Funnel-Style Sankey

```
Convert this conversion funnel into a Sankey:

FUNNEL: [e.g., "100% Awareness -> 60% Consideration -> 25% Trial -> 10% Purchase -> 4% Loyalty"]

Show both the flow-through AND the drop-off at each stage:
- Main flow: continuing through the funnel (green)
- Drop-off flow: exiting at each stage (red/gray)
- Label each drop-off with the reason if known
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too many flows (20+) | Spaghetti — group small flows into "Other" |
| Circular flows | Sankey is linear left-to-right; use chord diagram for circular |
| Volume doesn't add up | Inputs must equal outputs at each node |
| All flows same width | Defeats the purpose — width IS the data |
