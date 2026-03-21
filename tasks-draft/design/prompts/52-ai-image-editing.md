---
task_id: DES-052
title: AI Image Editing & Refinement
phase: MVP
priority: P2
status: Not Started
skill: none
subagents: []
depends_on: []
---

# 52 — AI Image Editing & Refinement

> **Category:** AI Image Generation — Editing
> **When to use:** Modifying existing images — removing elements, changing colors, adding context, style transfer
> **Tools:** Gemini 3 Pro Image, Leonardo AI (Nano Banana), Photoshop AI, Canva Magic Edit
> **Best for:** Cleaning up reference images, adapting stock photos, brand-aligning visuals, removing distractions

---

## Prompt A — Element Removal (Semantic Masking)

```
Using this image, remove the [SPECIFIC ELEMENT — e.g., "watermark in bottom right" / "person in background" / "text overlay"].

Keep everything else in the image exactly the same, preserving the original:
- Style and aesthetic
- Lighting and shadows
- Color palette
- Composition and framing
- All other elements not mentioned

Fill the removed area with [context-appropriate background / continuation of existing pattern].
```

---

## Prompt B — Style Transfer

```
Take this image and re-render it in [TARGET STYLE]:

CURRENT IMAGE: [Describe or attach — e.g., "a screenshot of a basic bar chart"]

TARGET STYLE: [e.g., "BCG editorial infographic style with deep green palette, clean sans-serif typography, white background, subtle shadow on chart elements"]

PRESERVE:
- The data and proportions (don't change what the chart shows)
- The general layout and composition

CHANGE:
- Color palette to: [list hex codes]
- Typography to: [clean sans-serif]
- Background to: [white / dark / gradient]
- Add: [annotations / callouts / source line]
- Remove: [gridlines / chart junk / decorative elements]
```

---

## Prompt C — Add Context to Chart Image

```
I have a chart image. Add these contextual elements around it:

CHART: [Describe or attach the chart image]

ADD:
1. Title above chart: "[HEADLINE TEXT]" in [style]
2. Annotation pointing to [specific data point]: "[CALLOUT TEXT]"
3. Source line below: "Source: [NAME], [YEAR]"
4. Brand mark: [position]
5. Background: extend to [dimensions] with [color/gradient]

KEEP the original chart exactly as is — add elements AROUND it, not on top of it.
```

---

## Prompt D — Batch Consistency Fix

```
I have [NUMBER] images that should look consistent but don't.

ISSUES:
- Different color temperatures / white balances
- Inconsistent cropping / aspect ratios
- Mixed styles (some photo, some illustration)
- Different background colors

STANDARDIZE to:
- Color temperature: [warm / neutral / cool]
- Aspect ratio: [16:9 / 1:1 / 4:3]
- Background: [solid color / consistent gradient]
- Style: [all photo / all illustration / all flat design]
- Color overlay: [brand tint at X% opacity if needed]

Process each image individually, maintaining its unique content while making the series visually cohesive.
```

---

## Editing Best Practices (from Nano Banana Guide)

| Practice | Details |
|----------|---------|
| Be specific about what to keep | "preserve original lighting" prevents unwanted changes |
| Edit one thing at a time | Multi-edit prompts often conflict — do sequential passes |
| Name the target precisely | "the red car in the foreground" not "the thing on the left" |
| State constraints explicitly | "do not change the background" prevents surprises |
| Use reference images | Attach style references for style transfer |
| Verify after edit | Check that unchanged areas truly stayed unchanged |
