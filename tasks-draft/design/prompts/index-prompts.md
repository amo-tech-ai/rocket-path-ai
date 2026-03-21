# Design & Chart Prompts — Complete Index

> **56 prompt files** | Charts, Animations, SVG, AI Image Gen, Design Workflow
>
> **Sources:** Flourish, BlackLabel DataViz, Galaxy AI, Ola Hungerford, Parallel HQ, Aura, SVGMaker, Leonardo AI (Nano Banana), BCG editorial standards
>
> **Updated:** 2026-02-14 | **Skills integrated:** design (6) + motion (5)

---

## How to Use

1. Pick the prompt category that fits your task
2. Check the `skill:` field in the prompt's frontmatter
3. Invoke the skill(s) **before** starting implementation
4. Fill in `[BRACKETS]` with your data/context
5. Use the prompt to generate the specification
6. Implement using the skill's patterns and templates
7. Iterate: refine with follow-up prompts

**Skill integration guide:** See `skill-integration-guide.md` for full mapping and usage tips.

## Prompting Rules (from all sources)

| Rule | What It Means |
|------|---------------|
| Set the scene (COSTAR: Context) | Tell AI what project you're working on, who the audience is |
| Be specific (COSTAR: Specificity) | Name the exact chart type, axis labels, color palette, pixel sizes |
| Show don't tell (COSTAR: Examples) | Attach reference images or describe a chart/animation you liked |
| Request format (COSTAR: Format) | Ask for CSV, code, SVG, Flourish-ready data, or React component |
| Break complex prompts into steps | Step 1: analyze data. Step 2: pick chart. Step 3: generate |
| Ask for pros/cons first | Before committing to a chart type, ask AI to compare options |
| Change one variable at a time | When iterating, adjust ONE thing per round to isolate what works |
| 30-80 words per prompt | Under 20 = vague. Over 100 = conflicting instructions |

---

## Skills Available

### Design Skills (`.agents/skills/design/`)

| Skill | Purpose |
|-------|---------|
| `/ui-ux-pro-max` | Design system generation, chart recs, UX rules. CLI: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py` |
| `/color-palette` | 11-shade generation, WCAG contrast, dark mode, semantic tokens |
| `/accessibility` | WCAG 2.1 AA, keyboard nav, screen readers, ARIA |
| `/frontend-design` | Distinctive UI, bold aesthetics, typography, motion patterns |
| `/high-fidelity-prototyping` | Interaction states, handoff specs, usability testing |
| `/low-fidelity-prototyping` | Rapid wireframes, concept validation |

### Motion Skills (`.agents/skills/motion/`)

| Skill | Purpose |
|-------|---------|
| `/motion` | Motion (Framer Motion) library: gestures, scroll, layout, SVG, spring. 15 known issues |
| `/framer-motion` | 12 Disney animation principles in Framer Motion |
| `/framer-motion-animator` | Page transitions, stagger, drag, parallax implementation |
| `/motion-interaction-designer` | UX-first animation strategy: purpose, timing, easing |
| `/scroll-storyteller` | Immersive scroll narratives, SVG art, chapter structure |

### Skill Invocation Order

1. **Strategy:** `/motion-interaction-designer` (defines WHY to animate)
2. **Design system:** `/ui-ux-pro-max` or `/color-palette` (sets visual foundation)
3. **Implementation:** `/motion` or `/framer-motion-animator` (builds the animation)
4. **Quality check:** `/accessibility` (ensures WCAG compliance)

---

## Part 1 — Chart Types (30 prompts)

### Change Over Time
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 01 | `01-line-chart.md` | Line Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 02 | `02-area-chart-stacked.md` | Stacked Area Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 03 | `03-bar-chart-race.md` | Bar Chart Race | `/ui-ux-pro-max`, `/color-palette`, `/framer-motion-animator` |
| 04 | `04-line-chart-race.md` | Line Chart Race (Horserace) | `/ui-ux-pro-max`, `/color-palette`, `/framer-motion-animator` |
| 05 | `05-fan-chart.md` | Fan Chart (Forecast) | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 06 | `06-streamgraph.md` | Streamgraph | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

### Magnitude
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 07 | `07-horizontal-bar.md` | Horizontal Bar Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 08 | `08-column-chart.md` | Column Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 09 | `09-lollipop-chart.md` | Lollipop Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 10 | `10-waterfall-chart.md` | Waterfall Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 11 | `11-bullet-chart.md` | Bullet Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

### Parts of a Whole
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 12 | `12-donut-chart.md` | Donut Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 13 | `13-stacked-bar.md` | Stacked Bar Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 14 | `14-treemap.md` | Treemap | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 15 | `15-sunburst.md` | Sunburst Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 16 | `16-packed-circles.md` | Packed Circles | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

### Correlation
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 17 | `17-scatter-plot.md` | Scatter Plot | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 18 | `18-bubble-chart.md` | Bubble Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

### Ranking
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 19 | `19-sorted-bar.md` | Sorted Horizontal Bar | `/ui-ux-pro-max`, `/color-palette`, `/framer-motion-animator` |
| 20 | `20-bump-chart.md` | Bump Chart | `/ui-ux-pro-max`, `/color-palette`, `/framer-motion-animator` |

### Distribution
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 21 | `21-histogram.md` | Histogram | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 22 | `22-population-pyramid.md` | Population Pyramid | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 23 | `23-beeswarm.md` | Beeswarm Plot | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

### Flows & Relationships
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 24 | `24-sankey-diagram.md` | Sankey Diagram | `/ui-ux-pro-max`, `/color-palette`, `/scroll-storyteller` |
| 25 | `25-network-diagram.md` | Network Diagram | `/ui-ux-pro-max`, `/color-palette`, `/scroll-storyteller` |
| 26 | `26-chord-diagram.md` | Chord Diagram | `/ui-ux-pro-max`, `/color-palette`, `/scroll-storyteller` |

### Spatial
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 27 | `27-choropleth-map.md` | Choropleth Map | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 28 | `28-symbol-map.md` | Proportional Symbol Map | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

### Deviation
| # | File | Chart Type | Skills |
|---|------|-----------|--------|
| 29 | `29-gauge-chart.md` | Gauge Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |
| 30 | `30-diverging-bar.md` | Diverging Bar Chart | `/ui-ux-pro-max`, `/color-palette`, `/motion` |

---

## Part 2 — Data Workflow (6 prompts)

| # | File | Purpose | Skills |
|---|------|---------|--------|
| 31 | `31-data-discovery.md` | Find trustworthy data sources | — |
| 32 | `32-data-analysis.md` | Spot patterns, outliers, headline stats | — |
| 33 | `33-data-enrichment.md` | Add columns, clean, fill gaps | — |
| 34 | `34-chart-selection.md` | Pick the right chart type | `/ui-ux-pro-max` |
| 35 | `35-data-formatting.md` | Restructure data for Flourish | — |
| 36 | `36-design-critique.md` | Polish, review, accessibility audit | `/accessibility` |

---

## Part 3 — Animation (6 prompts)

| # | File | Animation Type | Skills |
|---|------|---------------|--------|
| 37 | `37-hero-entrance-animation.md` | Hero section staggered entrance, parallax, counter | `/motion-interaction-designer`, `/framer-motion-animator` |
| 38 | `38-page-transitions.md` | Page transitions, slide decks, shared elements | `/motion-interaction-designer`, `/framer-motion-animator` |
| 39 | `39-button-interaction.md` | Button hover, click, loading, success/error states | `/motion-interaction-designer`, `/motion` |
| 40 | `40-loading-animation.md` | Dots, skeleton screens, progress bars, chart loading | `/motion-interaction-designer`, `/motion` |
| 41 | `41-card-hover-effects.md` | Card elevation, image zoom, 3D tilt | `/motion-interaction-designer`, `/motion` |
| 42 | `42-scroll-triggered-animation.md` | Scroll entrance, sticky sections, counters, parallax | `/motion-interaction-designer`, `/scroll-storyteller` |

---

## Part 4 — SVG & Visual Design (6 prompts)

| # | File | Topic | Skills |
|---|------|-------|--------|
| 43 | `43-svg-chart-animation.md` | SVG bar growth, line draw, donut fill, infographic bars | `/motion`, `/framer-motion` |
| 44 | `44-svg-icon-animation.md` | Self-drawing logos, feature icons, morphing icons | `/motion`, `/framer-motion` |
| 45 | `45-svg-decorative-animation.md` | Gradient waves, floating orbs, orbiting elements, dividers | `/scroll-storyteller`, `/motion` |
| 46 | `46-infographic-layout.md` | Full-page layouts, section templates, visual hierarchy | `/ui-ux-pro-max`, `/frontend-design` |
| 47 | `47-color-palette.md` | Chart palettes, colorblind audit, dark mode, brand mapping | `/color-palette`, `/accessibility` |
| 48 | `48-typography-data-viz.md` | Chart type system, number formatting, responsive scale | `/ui-ux-pro-max`, `/frontend-design` |

---

## Part 5 — AI Image Generation (4 prompts)

| # | File | Topic | Skills |
|---|------|-------|--------|
| 49 | `49-ai-image-infographic.md` | BCG-style infographic images, social graphics, Nano Banana formula | `/frontend-design` |
| 50 | `50-ai-image-hero-visual.md` | Conceptual metaphors, abstract data art, report covers, style lock | `/frontend-design` |
| 51 | `51-ai-image-chart-visual.md` | Chart-as-image, 3D data viz, data-inspired art | `/ui-ux-pro-max` |
| 52 | `52-ai-image-editing.md` | Element removal, style transfer, context adding, batch consistency | — |

---

## Part 6 — Design Workflow (4 prompts)

| # | File | Topic | Skills |
|---|------|-------|--------|
| 53 | `53-concept-generation.md` | COSTAR brainstorming, visual directions, mood boards, step decomposition | `/low-fidelity-prototyping` |
| 54 | `54-component-specification.md` | Chart component specs, section templates, design tokens | `/high-fidelity-prototyping`, `/frontend-design` |
| 55 | `55-microcopy-annotation.md` | Chart headlines, annotation callouts, source lines, social captions | — |
| 56 | `56-cross-functional-design.md` | Engineering handoff, stakeholder review, marketing copy, self-critique | `/high-fidelity-prototyping` |

---

## Quick Reference: Which Prompt for Which Task?

| I want to... | Start here | Invoke skills |
|--------------|-----------|---------------|
| Make a chart from data | 34 (chart selection) -> chart type prompt (01-30) | `/ui-ux-pro-max`, `/color-palette` |
| Find data for a chart | 31 (data discovery) -> 32 (analysis) -> 33 (enrichment) | — |
| Animate a chart | 43 (SVG chart animation) or 42 (scroll-triggered) | `/motion`, `/motion-interaction-designer` |
| Add motion to a landing page | 37 (hero entrance) -> 42 (scroll) -> 39 (buttons) | `/motion-interaction-designer`, `/framer-motion-animator` |
| Design an infographic | 53 (concept) -> 46 (layout) -> chart prompts -> 36 (critique) | `/ui-ux-pro-max`, `/frontend-design` |
| Generate an image | 49 (infographic image) or 50 (hero visual) | `/frontend-design` |
| Choose colors | 47 (color palette) | `/color-palette`, `/accessibility` |
| Write chart text | 55 (microcopy & annotations) | — |
| Get design feedback | 36 (critique) -> 56 (cross-functional) | `/accessibility` |
| Hand off to engineering | 54 (component spec) -> 56 (engineering handoff) | `/high-fidelity-prototyping` |
| Post to social media | 55 prompt D (social captions) -> 49 prompt B (social graphic) | `/frontend-design` |
| Build scroll narrative | 42 (scroll) -> 45 (SVG decorative) | `/scroll-storyteller` |

---

## Dependency Graph

```
Color Palette (47)     Typography (48)     Layout (46)
       |                     |                  |
       +--------+------------+                  |
                |                               |
        Design System Foundation                |
                |                               |
       +--------+-----------+                   |
       |                    |                   |
  Chart Prompts (01-30)  AI Images (49-52)      |
       |                                        |
       +--------+-------------------------------+
                |
         Animation Layer
                |
       +--------+-----------+
       |        |           |
  SVG Anim    UI Anim    Scroll Story
  (43-45)    (37-42)       (42)
```

**Build order:**
1. Foundation: 47 (color) -> 48 (typography) -> 46 (layout)
2. Charts: 34 (selection) -> chart type prompt (01-30)
3. Animation: strategy -> implementation -> quality check

---

## File Cross-References

| Document | Path | Purpose |
|----------|------|---------|
| Skill Integration Guide | `skill-integration-guide.md` | Full skill-to-prompt mapping, CLI commands, usage tips |
| TASK-TEMPLATE | `../../prompts/TASK-TEMPLATE.md` | Task frontmatter format and workflow |
| Chart Type Selector | `../style-guide/20-chart-type-selector.md` | Decision engine + Flourish template picker |
| Charts Image Index | `../charts/index-charts.md` | 39 reference images scored and classified |
| Chart Types & Prompts | `../charts/chart-types-and-prompts.md` | Combined chart type reference (condensed) |
| Style Guide | `../style-guide/README.md` | Overall design system |
| Design Index | `../index-design.md` | Full design folder progress tracker |
