---
task_id: DES-036
title: Design Critique (AI Workflow)
phase: MVP
priority: P2
status: Not Started
skill: /accessibility
subagents: [code-reviewer]
depends_on: []
---

# 36 — Design Critique (AI Workflow)

> **Purpose:** Use AI as a chart critic to identify improvements in readability, accuracy, and storytelling
> **Source:** Flourish "AI for Better Charts" — Step 6, BlackLabel styling tips

---

## Prompt A — General Chart Review

```
Review this chart specification (or screenshot) and suggest improvements.

CHART TYPE: [e.g., "Grouped column chart"]
DATA: [Describe what it shows]
CURRENT DESIGN: [Describe colors, labels, layout, or paste a screenshot]
TOOL: [Flourish / React / D3 / Matplotlib / etc.]

Check against this 10-point checklist:

1. RIGHT CHART TYPE? Is this the best choice for this data and story?
2. SORTED? Are bars/items sorted meaningfully (not random or alphabetical)?
3. Y-AXIS AT ZERO? Does the axis start at 0 (or is it truncated misleadingly)?
4. DIRECT LABELS? Are values labeled directly on the chart (not just in a legend)?
5. HEADLINE TELLS STORY? Does the title tell the INSIGHT, not just describe the chart?
6. MAX 5 COLORS? Are colors limited and meaningful (not decorative)?
7. ACCESSIBLE? Would this work for colorblind viewers? (No red/green only differentiator)
8. SOURCE CITED? Is there a source line with name, year, and sample size?
9. NO CHART JUNK? Are gridlines, borders, shadows, 3D effects removed?
10. READABLE AT SIZE? Will text be legible at the display size (min 12px axis labels)?

Return:
- PASS or FAIL for each item
- Specific fix recommendation for each FAIL
- Overall score: [X/10]
- Top 3 priority fixes
```

---

## Prompt B — Quick Polish (5-Minute Fixes)

```
Analyze my chart and give me 5 specific, actionable improvements I can do in under 5 minutes each.

CHART: [Describe or paste screenshot]
TOOL: [Flourish / code / etc.]

Focus on:
- Changes that use native tool features (no custom code)
- Things that dramatically improve readability
- Helping viewers focus on the key insight, not get lost in noise

For each improvement, tell me exactly what to change and where.
```

---

## Prompt C — Accessibility Review

```
Review my chart for accessibility:

CHART: [Describe]
COLORS USED: [List hex codes]

Check:
1. Color contrast ratio (WCAG AA minimum 4.5:1 for text)
2. Colorblind safety — would red/green confusion hide the story?
3. Screen reader compatibility — are there alt-text descriptions?
4. Font size hierarchy — title > labels > captions, all above 10px minimum
5. Pattern alternatives — could you add texture/patterns in addition to color?

Recommend a colorblind-safe palette if current one fails.
```

---

## Prompt D — Before/After Refinement

```
I'm going to improve my chart step by step. Guide me through each change.

CURRENT STATE: [Describe the chart as it is now]

Step 1: [Ask AI to suggest one change]
[Apply it, describe result]
Step 2: [Ask AI for the next change]
[Apply, describe]
...continue until polished.

This iterative approach (from BlackLabel) gets better results than one big prompt.
```

---

## Styling Reference (from BlackLabel)

### Typography
- Title: 18-24px bold, sans-serif (Inter, Roboto, Helvetica)
- Axis labels: 12-14px regular
- Captions/notes: 10-12px (never below 10px)
- Use one font family only

### Color
- Use color to emphasize meaning, not decorate
- High contrast: navy + white, dark gray + light blue
- Never rely on red/green alone (colorblind issue)
- Max 5 distinct colors + gray for "Other"

### Spacing
- 8-12px minimum between text and chart elements
- 40-50% whitespace between bars
- Consistent grid alignment for all elements
- Padding around titles and legends

### Visual Hierarchy
- Size, color, or placement to highlight key takeaway
- De-emphasize less important data with lighter shades
- Label data directly — minimize legend dependence
- Remove gridlines, ticks, and labels that don't add value
