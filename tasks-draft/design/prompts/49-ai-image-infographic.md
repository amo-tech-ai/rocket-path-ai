---
task_id: DES-049
title: "AI Image Generation: Infographic Style"
phase: MVP
priority: P2
status: Not Started
skill: /frontend-design
subagents: [frontend-designer]
depends_on: [DES-047]
---

# 49 — AI Image Generation: Infographic Style

> **Category:** AI Image Generation
> **When to use:** Generating infographic-style images, data visualizations as images, editorial graphics
> **Tools:** Gemini 3 Pro Image, Leonardo AI (Nano Banana), DALL-E, Midjourney
> **Best for:** Hero graphics, social media infographics, presentation visuals, editorial illustrations

---

## Prompt A — BCG-Style Editorial Infographic

```
[SUBJECT] in [SETTING], infographic editorial style, BCG consulting aesthetic.

CONTENT:
- Main headline: "[HEADLINE TEXT]" in bold sans-serif (max 8 words)
- Key stat: "[NUMBER]" displayed prominently at 3x the body text size
- Supporting data: [2-3 additional data points with labels]
- Source line at bottom: "Source: [NAME], [YEAR]"

STYLE:
- Clean, minimal, corporate-editorial
- Color palette: deep green (#0B6E4F), white, light gray, one accent
- Typography: modern sans-serif (like Inter or Helvetica Neue)
- Layout: asymmetric grid, generous whitespace
- No decorative flourishes — every element serves a data purpose

COMPOSITION:
- Aspect ratio: [16:9 for web / 1:1 for social / 9:16 for stories]
- Visual hierarchy: stat number is the focal point, headline second, details third
- Chart embedded: [bar chart / donut / line chart] showing [data]

AVOID: clip art, stock photo cliches, 3D effects, gradients, busy backgrounds, decorative borders
```

---

## Prompt B — Data-Driven Social Media Graphic

```
Create a social media infographic for [PLATFORM: LinkedIn / Twitter / Instagram].

CONTENT:
- Headline: "[HOOK — e.g., '95% of CEOs say AI is their top priority']"
- Supporting stat: "[SECOND DATA POINT]"
- Visual: [chart type] showing [data]
- Call to action: "[CTA TEXT]"
- Brand mark: [Logo placement]

DIMENSIONS: [1200x627 LinkedIn / 1080x1080 Instagram / 1200x675 Twitter]

STYLE:
- Professional but scroll-stopping
- High contrast text on solid color block
- One chart or visual taking 60% of the space
- Text is large enough to read on mobile (min 24px equivalent)
- Brand color as dominant background or accent

LAYOUT:
- Top third: headline (biggest text)
- Middle: chart or stat visual
- Bottom: source + CTA

RULES:
- Text must be readable at thumbnail size
- No more than 30 words total
- One color accent — not a rainbow
```

---

## Prompt C — Infographic Slide (Presentation)

```
Create a presentation slide with an embedded data visualization.

SLIDE PURPOSE: [e.g., "Show market growth trajectory with key milestones"]

CONTENT:
- Slide title: "[MAX 8 WORDS]" top-left, 24px bold
- Chart area: [chart type] taking 65% of slide
- Key insight callout: 1 sentence with highlight, positioned near the relevant data point
- Source: bottom-left, 10px gray

SLIDE LAYOUT:
- Title + subtitle: top 15% of slide
- Chart: center-right 65% area
- Callout/annotation: left or overlay on chart
- Source: bottom strip

STYLE:
- Slide background: white or very light gray
- Chart uses [BRAND COLORS]
- One accent color for the key insight callout
- Minimal — no bullet points, no paragraphs

PRESENTATION RULES:
- Readable from 15 feet away (conference room)
- One idea per slide — if you need two charts, use two slides
- Title tells the takeaway, not the topic
```

---

## Prompt D — Nano Banana / Gemini Infographic

```
PROMPT STRUCTURE (optimized for Nano Banana Pro / Gemini 3 Pro Image):

[STYLE]: BCG editorial infographic, clean data visualization, premium consulting report aesthetic
[SUBJECT]: [The data story — e.g., "AI market growth from $5.7B to $52.1B, 2024-2030"]
[COMPOSITION]: Asymmetric grid layout, stat number as hero element, bar chart below
[TYPOGRAPHY]: Bold sans-serif headline, large stat number with unit label
[COLOR]: Deep emerald green (#0B6E4F), white text, light gray background
[LIGHTING]: Flat, even lighting — no dramatic shadows (editorial print style)
[CONSTRAINTS]: No 3D effects, no stock photography, no decorative borders, text must be readable

Text to render: "[EXACT TEXT]" — use double quotes for literal text rendering
Keep text phrases short (3-5 words per text element) for best rendering accuracy.

ASPECT RATIO: 16:9
```

---

## Image Generation Tips (from Nano Banana Guide)

| Tip | Details |
|-----|---------|
| Prompt length | 30-80 words optimal. Under 20 = vague, over 100 = conflicting |
| Style consistency | Save a template prompt, change only subject details |
| Text rendering | Use double quotes for literal text. Keep phrases short (3-5 words) |
| Conflicting styles | Don't mix "photorealistic" + "illustration" — pick one |
| Iterate one variable | Change only ONE element per iteration to find what works |
| Material keywords | "Premium printed report", "editorial layout", "consulting deck" improve quality |
| Negative prompts | Add: "no blurry, no watermark, no clip art, no 3D effects" |
