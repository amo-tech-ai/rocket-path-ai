---
task_id: DES-032
title: Data Analysis (AI Workflow)
phase: MVP
priority: P2
status: Not Started
skill: none
subagents: []
depends_on: [DES-031]
---

# 32 — Data Analysis (AI Workflow)

> **Purpose:** Use AI to spot patterns, outliers, trends, and the "headline stat" hiding in your data
> **Source:** Flourish "AI for Better Charts" — Step 2, Galaxy AI prompts

---

## Prompt A — Full Dataset Analysis

```
Analyze this dataset with the following requirements:

[PASTE DATA or describe it]

**Statistical analysis:**
1. Calculate overall averages and medians
2. Identify statistical outliers (values >2 standard deviations from mean)
3. List the top 5 and bottom 5 items by [key metric]
4. Flag any significant changes (increases or decreases over [threshold]%)

**Pattern analysis:**
- Identify geographic or categorical trends
- Compare performance by [grouping variable]
- Note any clusters or natural breakpoints in the data

**Context:**
- Note any major real-world events that correlate with spikes or drops
- Identify the time period with the most dramatic change

**Output format:**
1. Executive summary (3 bullet points)
2. The single most compelling "headline stat" for a visualization
3. Detailed findings table
4. Suggested story angle for the chart
```

---

## Prompt B — Quick Pattern Scan

```
Here is my data: [PASTE or describe]

In 5 bullet points, tell me:
1. The single most surprising finding
2. The biggest trend over time
3. The most notable outlier and why
4. One comparison that would make a good chart
5. The "so what?" — why should my audience care?
```

---

## Prompt C — Compare Two Time Periods

```
Compare these two time periods in my data:

PERIOD A: [e.g., "2023 values"]
PERIOD B: [e.g., "2025 values"]

For each item, calculate:
1. Absolute change (B minus A)
2. Percentage change
3. Rank change (position in A vs position in B)

Flag the top 3 biggest improvers and top 3 biggest decliners.
Return as a table sorted by percentage change (descending).
```
