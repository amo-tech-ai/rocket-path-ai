---
task_id: DES-035
title: Data Formatting (AI Workflow)
phase: MVP
priority: P2
status: Not Started
skill: none
subagents: []
depends_on: [DES-034]
---

# 35 — Data Formatting (AI Workflow)

> **Purpose:** Use AI to restructure data into the exact format required by Flourish or other charting tools
> **Source:** Flourish "AI for Better Charts" — Step 5

---

## Prompt A — General Format Transformation

```
I need to transform this data for a [CHART TYPE] in Flourish.

CURRENT FORMAT:
[Paste your current data structure or describe it — e.g., "Rows = countries, Columns = years, Values = inflation rate"]

REQUIRED FORMAT for [chart type]:
- Rows represent: [WHAT — e.g., "one row per participant"]
- Columns represent: [WHAT — e.g., "one column per time period"]
- Values are: [WHAT — e.g., "cumulative absolute values"]

Transform the data and return as clean CSV.
If pivoting is needed, explain what you changed.
```

---

## Prompt B — Wide to Long Format

```
Convert my data from WIDE format to LONG format.

WIDE format (current):
| Country | 2020 | 2021 | 2022 | 2023 | 2024 |
|---------|------|------|------|------|------|
| US      | 1.2  | 4.7  | 8.0  | 4.1  | 2.9  |
| UK      | 0.9  | 2.6  | 9.1  | 6.7  | 3.2  |

LONG format (needed):
| Country | Year | Value |
|---------|------|-------|
| US      | 2020 | 1.2   |
| US      | 2021 | 4.7   |
| UK      | 2020 | 0.9   |
...

[Paste your actual data]
Return as CSV in long format.
```

---

## Prompt C — Long to Wide Format

```
Convert my data from LONG format to WIDE format (for Flourish line charts, bar chart races, etc.).

[Paste your long-format data]

WIDE format needed:
- Row 1: headers = Name, [time period 1], [time period 2], ...
- Each subsequent row: one entity with values per time period
- Missing values: leave cell blank (not zero)

Return as CSV.
```

---

## Prompt D — Grid/Small Multiples Format

```
Transform my dataset for a Flourish grid of charts (small multiples).

CURRENT: [Describe — e.g., "One row per country per year, with a Region column"]

NEEDED:
- Each year appears [N] times (once per region/group)
- Only show values for items belonging to each group (leave others blank)
- Keep all item columns

This creates the structure where each grid cell shows only its group's data.

[Paste data]
Return transformed CSV.
```

---

## Prompt E — Aggregate for Chart

```
My raw data has [NUMBER] rows — too granular for a chart.

Aggregate to:
- Group by: [e.g., "Region and Year"]
- Metric: [e.g., "Average inflation rate per group"]
- Also calculate: [e.g., "Count of countries per group, Min, Max"]
- Round to: [e.g., "1 decimal place"]

[Paste data]
Return aggregated CSV.
```
