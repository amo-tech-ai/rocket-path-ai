---
task_id: DES-051
title: "AI Image Generation: Chart Visuals & Data Art"
phase: MVP
priority: P2
status: Not Started
skill: /ui-ux-pro-max
subagents: [frontend-designer]
depends_on: [DES-047]
---

# 51 — AI Image Generation: Chart Visuals & Data Art

> **Category:** AI Image Generation
> **When to use:** When you need a chart rendered as a polished image (not interactive), 3D data visualizations, or artistic data representations
> **Tools:** Gemini 3 Pro Image, Leonardo AI, Midjourney
> **Best for:** Social media chart graphics, report figures, artistic data representations, presentation visuals

---

## Prompt A — Polished Chart as Image

```
Generate a high-quality image of a [CHART TYPE] visualization.

DATA STORY: [e.g., "AI market growing from $5.7B to $52.1B over 6 years"]

CHART SPECIFICATIONS:
- Chart type: [bar / line / donut / stacked bar]
- Data points: [list the values to visualize]
- Labels: [axis labels, category names, values]
- Title: "[HEADLINE]"

RENDERING STYLE:
- Clean, editorial, print-quality
- Background: white or very light gray
- Colors: [brand palette hex codes]
- Typography: modern sans-serif, sharp rendering
- No anti-aliasing artifacts or blurry text

QUALITY:
- Resolution: high-res (min 2x for retina)
- No AI artifacts on text characters
- Numbers must be legible and correctly rendered
- Chart proportions must accurately represent the data

Note: For accurate data representation, prefer Flourish/D3/code-generated charts. Use AI image generation only when you need artistic style that tools can't produce.
```

---

## Prompt B — 3D Data Visualization

```
Create a 3D-rendered data visualization of [DATA].

STYLE: isometric / perspective / floating elements in space

ELEMENTS:
- [e.g., "Floating bar columns at different heights representing market segments"]
- Glass/translucent material for bars
- Soft shadows on a clean surface
- Labels floating near each element

LIGHTING: studio lighting, soft shadows, no harsh reflections
CAMERA: slightly above, 30-degree angle looking down
BACKGROUND: gradient from white to light gray
ASPECT RATIO: 16:9

This is for CONCEPTUAL/ARTISTIC use — not for accurate data reading.
Actual data charts should be built with Flourish or code.
```

---

## Prompt C — Data-Inspired Abstract Art

```
Create abstract art inspired by [DATA CONCEPT].

CONCEPT: [e.g., "Network effects — exponential connections between nodes" / "Market disruption — breaking grid patterns" / "Convergence — multiple streams merging into one"]

STYLE:
- [Generative art / particle systems / flowing lines / geometric fragmentation]
- Color: [brand palette]
- Mood: [energetic / calm / chaotic / structured]

This is NOT a chart — it's an artistic visual that EVOKES the feeling of the data story.
Use as: hero background, section divider, social media accent, report cover element.

AVOID: recognizable chart types (no actual bars or pie slices) — this should feel like art, not a graph.
```

---

## When to Use AI-Generated vs Code-Generated Charts

| Need | Use |
|------|-----|
| Accurate data representation | Code (Flourish, D3, React chart lib) |
| Interactive chart | Code |
| Artistic/editorial chart image | AI image generation |
| Social media one-off graphic | AI image generation |
| 3D conceptual visualization | AI image generation |
| Chart that will be updated with new data | Code |
| Chart embedded in a web app | Code |
| Print report figure | Either — AI for style, code for accuracy |
