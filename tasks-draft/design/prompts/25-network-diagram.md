---
task_id: DES-025
title: Network Diagram
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /scroll-storyteller
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 25 — Network Diagram

> **Category:** Flows & Relationships
> **When to use:** Connections between entities. Not about flow volume — about who connects to whom.
> **Flourish template:** Network diagram
> **Best for:** Team collaboration, tool integrations, API dependencies, ecosystem mapping, social graphs

---

## Prompt A — Generate Network Diagram

```
Create a network diagram showing connections between entities.

DATA: [e.g., "20 SaaS tools and their integrations: Slack-Salesforce, Slack-Jira, Notion-Slack, etc."]
STORY: [e.g., "Slack and Salesforce are the most connected hubs in the modern SaaS stack"]

Create:
1. Nodes: entities
   - Size proportional to number of connections (degree centrality)
   - Color by category (max 5)
   - Label: visible for top 5 most-connected nodes, hidden for small ones
2. Edges: connections
   - Width proportional to strength/frequency (if applicable)
   - Color: light gray (#E5E7EB) for most, accent for key relationships
3. Layout: force-directed (automatic spacing) or circular by category
4. Interactive: hover node to highlight all its connections, dim the rest
5. Cluster annotation: label groups of tightly connected nodes

Data as TWO CSVs:
- Nodes: ID, Name, Category, Size_Value
- Edges: Source_ID, Target_ID, Weight (optional)
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Too many nodes (50+) without filtering | Add category filters or zoom levels |
| All nodes same size | Size by connections to show importance |
| No interactivity | Static network graphs are hard to read — add hover/filter |
| Using when flow volume matters | Use Sankey for volume; network is for connectivity structure |
