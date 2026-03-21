---
task_id: DES-017
title: Scatter Plot
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max, /color-palette, /motion
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047]
---

# 17 — Scatter Plot

> **Category:** Correlation
> **When to use:** Showing relationship between exactly 2 variables. ONLY use when genuinely showing correlation.
> **Flourish template:** Scatter plot (with filters, time slider)
> **Best for:** Revenue vs headcount, ad spend vs conversions, education vs income, price vs quality

---

## Prompt A — Generate Scatter Plot

```
Create a scatter plot showing the relationship between two variables.

DATA: [e.g., "50 startups: X = monthly ad spend ($), Y = monthly signups, Color = industry, each row is one company"]
STORY: [e.g., "Ad spend correlates with signups up to $50K, then shows diminishing returns"]

Create:
1. X-axis: [independent variable] with clear units and label
2. Y-axis: [dependent variable] with clear units and label
3. Each dot = one entity
4. Dot styling:
   - Size: consistent (6-8px) unless 3rd variable → use bubble chart instead
   - Color by category (max 5 categories + gray "Other")
   - Opacity: 70% to handle overlap
5. Trend line: linear regression with R-squared value displayed
6. Outlier annotations: label the 2-3 most notable outliers with their name
7. Quadrant labels (optional): if meaningful (e.g., "High spend, Low return" quadrants)
8. Source citation with sample size: "Source: [NAME] (n=[COUNT])"

Data as CSV: Name, X_Value, Y_Value, Category

RULES:
- NEVER connect dots with lines (that implies sequence — use line chart for time)
- Both axes should start at logical minimums (0 for counts, reasonable min for ranges)
- If no visible correlation exists, STATE THAT — don't force a narrative
- If you just want to compare categories by one value, use bar chart instead
```

---

## Prompt B — Scatter with Time Slider

```
Create a scatter plot that animates through time periods.

DATA: [e.g., "Countries: X = GDP per capita, Y = life expectancy, Color = continent, Time = year 1960-2025"]
STORY: [e.g., "Global life expectancy converged upward while income inequality widened"]

Add a time slider that:
1. Plays through years automatically (2 seconds per decade)
2. Shows year label prominently
3. Dots smoothly transition between positions
4. Trail lines (optional) show each entity's path over time
```

---

## Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Using scatter for categorical data | Use bar chart — scatter needs continuous X and Y |
| Connecting dots with lines | Scatter = no lines. Line chart = lines. |
| No trend line when correlation is the story | Always add regression line + R-squared |
| Too many dots (500+) with no grouping | Use hexbin or density plot instead |
