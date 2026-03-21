---
task_id: DES-033
title: Data Enrichment (AI Workflow)
phase: MVP
priority: P2
status: Not Started
skill: none
subagents: []
depends_on: [DES-032]
---

# 33 — Data Enrichment (AI Workflow)

> **Purpose:** Use AI to add columns, fill gaps, remove noise, and restructure data
> **Source:** Flourish "AI for Better Charts" — Step 3

---

## Prompt A — Add Categorical Column

```
I have a dataset with these columns: [LIST COLUMNS]

Add a new column called "[COLUMN NAME]" that categorizes each row based on [CRITERIA].

Rules:
- [e.g., "Group countries by geographic region: North America, Europe, Asia-Pacific, etc."]
- [e.g., "Classify companies by size: Small (<50 employees), Medium (50-500), Large (500+)"]
- Handle edge cases: [specify any ambiguous items]

Return the enriched dataset as CSV.
```

---

## Prompt B — Clean and Transform

```
Transform my dataset to CSV with these changes:

KEEP: [List columns to keep — e.g., "Year, Country, Country Code (2-letter), Value"]
ADD: [New columns — e.g., "Region column (geographic region for each country)"]
DROP: [What to remove — e.g., "All other columns, incomplete rows, aggregate entries like 'OECD Average'"]
FILTER: [Date range, minimum values, etc. — e.g., "2000-2024 only"]
SORT BY: [e.g., "Region -> Country -> Year"]

Return clean CSV ready for charting.
```

---

## Prompt C — Calculate Derived Metrics

```
My dataset has: [LIST COLUMNS]

Add these calculated columns:
1. "[NAME]" = [formula — e.g., "Year-over-year percentage change"]
2. "[NAME]" = [formula — e.g., "Percentile rank within category"]
3. "[NAME]" = [formula — e.g., "Rolling 3-period average"]

Handle edge cases:
- First row (no prior period): leave blank or mark "N/A"
- Division by zero: mark as "N/A"
- Negative values: [keep as-is / take absolute value / flag]

Return enriched CSV.
```

---

## Prompt D — Fill Missing Data

```
My dataset has missing values in these columns: [LIST]

For each missing value, choose the best approach:
1. If the pattern is linear over time → interpolate
2. If there's a categorical average available → use group mean
3. If the gap is too large to fill reliably → mark as "Insufficient data"

Show me which values you filled and what method you used.
```
