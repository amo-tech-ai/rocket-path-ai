---
task_id: DES-050
title: "AI Image Generation: Hero & Editorial Visuals"
phase: MVP
priority: P2
status: Not Started
skill: /frontend-design
subagents: [frontend-designer]
depends_on: [DES-047]
---

# 50 — AI Image Generation: Hero & Editorial Visuals

> **Category:** AI Image Generation
> **When to use:** Hero section imagery, editorial illustrations, conceptual visuals for articles/reports
> **Tools:** Gemini 3 Pro Image, Leonardo AI, Midjourney, DALL-E
> **Best for:** Blog headers, report covers, landing page heroes, conceptual metaphor imagery

---

## Prompt A — Conceptual Metaphor Image

```
[STYLE] photography, [SUBJECT performing ACTION] in [ENVIRONMENT].

CONCEPT: A visual metaphor for [ABSTRACT IDEA — e.g., "startups navigating uncertainty" / "AI transforming business" / "data overload"]

STYLE: [pick one]
- Cinematic editorial (dark, dramatic lighting, 85mm lens)
- Clean corporate (bright, airy, natural light, 35mm)
- Abstract geometric (shapes, gradients, no people)
- Illustrated conceptual (flat illustration, vector style)

COMPOSITION:
- Subject placement: [rule of thirds / centered / off-center]
- Negative space: leave room for text overlay on [left / right / top / bottom]
- Depth: [shallow DOF with bokeh / deep focus / layered elements]
- Aspect ratio: [16:9 for web hero / 3:2 for blog / 1:1 for social]

LIGHTING:
- [Golden hour warm / Cool blue corporate / Dramatic side light / Soft diffused]
- Direction: [left / right / backlit / overhead]

COLOR MOOD:
- Dominant: [cool blues for trust / warm greens for growth / dark for premium]
- Accent: [one pop of brand color]

AVOID: cliche stock photo poses (handshakes, pointing at screens), generic office backgrounds, over-saturated colors, AI artifacts in hands/faces
```

---

## Prompt B — Abstract Data Art (No People)

```
Create an abstract visual representing [DATA CONCEPT — e.g., "exponential growth" / "network connections" / "market fragmentation"].

STYLE: abstract geometric, minimal, editorial

ELEMENTS:
- Geometric shapes: [circles, lines, nodes, grids, waves]
- Arranged to visually suggest [the concept]
- No text, no people, no realistic objects

COLOR:
- Background: [dark navy #0F172A / white / gradient]
- Shapes: brand palette [list colors]
- Glow/accent: one vibrant highlight color

TEXTURE:
- [Clean vector / subtle grain / glass morphism / wireframe]

COMPOSITION:
- [Centered radial / flowing left-to-right / scattered constellation / layered depth]
- Leave [25%] of the image as clean negative space for text overlay

ASPECT RATIO: [16:9 / 3:2 / 1:1]
```

---

## Prompt C — Report Cover Design

```
Create a cover image for a report titled "[REPORT TITLE]".

LAYOUT:
- Title: "[EXACT TITLE]" in bold sans-serif at top or center
- Subtitle: "[SUBTITLE]" below, lighter weight
- Brand mark: [position]
- Visual: abstract or conceptual image filling 60% of cover

STYLE:
- [Corporate premium / Tech-forward / Editorial minimal / Bold graphic]
- Color: [brand palette]
- Mood: [Authoritative / Innovative / Urgent / Calm]

ASPECT RATIO: [A4 portrait / US Letter / 16:9 landscape for digital]

AVOID: generic stock imagery, too many visual elements, hard-to-read text over busy images
```

---

## Prompt D — Consistent Series (Character Sheets / Style Lock)

```
I need to create [NUMBER] visuals in a consistent style for a series.

SERIES THEME: [e.g., "6 infographic headers for an AI adoption report"]

STYLE LOCK — use these EXACT specifications for every image:
- Background: [color/gradient]
- Illustration style: [flat vector / isometric / line art / photographic]
- Color palette: [list exact hex codes]
- Typography style: [sans-serif, weight, size]
- Layout grid: [describe consistent placement of elements]
- Aspect ratio: [consistent across all]

For Nano Banana / Leonardo: Generate 2-3 reference images showing the style from multiple angles. Use these as input references for all subsequent generations.

VARIATION per image:
- Only change: [the subject/icon/data point]
- Keep consistent: everything else (background, style, colors, layout)
```

---

## Nano Banana Pro Formula

```
[Realistic Style / Illustration Style / Abstract Style]
+ [Hero Subject description]
+ [Environment / Mood]
+ [Camera & Lens — e.g., "85mm f/1.4 shallow depth"]
+ [Lighting — e.g., "soft diffused studio light"]
+ [Material / Textures — e.g., "matte finish, subtle grain"]
+ [Constraints — e.g., "no text, no watermark, clean negative space on left"]
```
