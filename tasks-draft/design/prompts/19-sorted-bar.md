---
task_id: DES-019
title: Sorted Horizontal Bar (Ranking)
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 19 — Sorted Horizontal Bar (Ranking)

> **Category:** Ranking
> **When to use:** The DEFAULT chart for rankings. Identical to horizontal bar (#07) but the SORT ORDER is the entire point.
> **Flourish template:** Bar chart (horizontal)
> **Best for:** Top 10 lists, feature rankings, competitive positioning, survey results

---

## Prompt A — Generate Ranking Chart

```
Create a sorted horizontal bar chart that tells a RANKING story.

DATA: [e.g., "Top 10 AI use cases by enterprise adoption rate: Customer Service 67%, Content Creation 58%, Data Analysis 55%, Code Generation 48%, etc."]
STORY: [e.g., "Customer-facing AI use cases lead adoption while internal operations lag behind"]

Create:
1. Bars sorted STRICTLY highest to lowest (this is non-negotiable)
2. Rank numbers (#1, #2, #3...) visible left of category labels
3. Color strategy (pick one):
   a) ALL bars same color — the sort tells the ranking story
   b) Top 3 in accent color (#0B6E4F), rest in gray (#D1D5DB) — emphasizes leaders
   c) Gradient from dark (top) to light (bottom) — shows the decay curve
4. Value labels at bar end
5. Optional: reference line for average or benchmark
6. Gap annotation: if there's a notable gap between items (e.g., #1 is 20pts ahead of #2), call it out

Data as CSV: Rank, Category, Value

Headline: Name the WINNER and the SURPRISE
- Good: "Customer service AI leads — but code generation is closing fast at #4"
- Bad: "Top 10 AI use cases ranked by adoption"
```

---

## Prompt B — Top N with "Rest" Summary

```
I have [TOTAL NUMBER] items but want to show only the top [N] with a summary of the rest.

DATA: [Paste all data]

Create:
1. Show top [N] items as individual bars (sorted)
2. Add a final bar: "All others (average)" in gray
3. Show count in the gray bar: "(remaining [X] items)"
4. This gives context without visual overload
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Alphabetical or random order | ALWAYS sort by value — the sort IS the ranking |
| No visual emphasis on top items | Highlight top 3 or use gradient |
| Bar chart race when you only have 1 time period | Use static sorted bar — race needs time series |
