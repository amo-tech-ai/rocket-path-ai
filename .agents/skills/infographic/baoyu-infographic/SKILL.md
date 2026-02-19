---
name: baoyu-infographic
description: Generates professional infographics with 20 layout types and 17 visual styles. Analyzes content, recommends layout×style combinations, and generates publication-ready infographics. Use when user asks to create "infographic", "信息图", "visual summary", or "可视化".
---

# Infographic Generator

Two dimensions: **layout** (information structure) × **style** (visual aesthetics). Freely combine any layout with any style.

## Usage

```bash
/baoyu-infographic path/to/content.md
/baoyu-infographic path/to/content.md --layout hierarchical-layers --style technical-schematic
/baoyu-infographic path/to/content.md --aspect portrait --lang zh
/baoyu-infographic  # then paste content
```

## Options

| Option | Values |
|--------|--------|
| `--layout` | 20 options (see Layout Gallery), default: bento-grid |
| `--style` | 17 options (see Style Gallery), default: craft-handmade |
| `--aspect` | landscape (16:9), portrait (9:16), square (1:1) |
| `--lang` | en, zh, ja, etc. |

## Layout Gallery

| Layout | Best For |
|--------|----------|
| `linear-progression` | Timelines, processes, tutorials |
| `binary-comparison` | A vs B, before-after, pros-cons |
| `comparison-matrix` | Multi-factor comparisons |
| `hierarchical-layers` | Pyramids, priority levels |
| `tree-branching` | Categories, taxonomies |
| `hub-spoke` | Central concept with related items |
| `structural-breakdown` | Exploded views, cross-sections |
| `bento-grid` | Multiple topics, overview (default) |
| `iceberg` | Surface vs hidden aspects |
| `bridge` | Problem-solution |
| `funnel` | Conversion, filtering |
| `isometric-map` | Spatial relationships |
| `dashboard` | Metrics, KPIs |
| `periodic-table` | Categorized collections |
| `comic-strip` | Narratives, sequences |
| `story-mountain` | Plot structure, tension arcs |
| `jigsaw` | Interconnected parts |
| `venn-diagram` | Overlapping concepts |
| `winding-roadmap` | Journey, milestones |
| `circular-flow` | Cycles, recurring processes |

Full definitions: `references/layouts/<layout>.md`

## Style Gallery

| Style | Description |
|-------|-------------|
| `craft-handmade` | Hand-drawn, paper craft (default) |
| `claymation` | 3D clay figures, stop-motion |
| `kawaii` | Japanese cute, pastels |
| `storybook-watercolor` | Soft painted, whimsical |
| `chalkboard` | Chalk on black board |
| `cyberpunk-neon` | Neon glow, futuristic |
| `bold-graphic` | Comic style, halftone |
| `aged-academia` | Vintage science, sepia |
| `corporate-memphis` | Flat vector, vibrant |
| `technical-schematic` | Blueprint, engineering |
| `origami` | Folded paper, geometric |
| `pixel-art` | Retro 8-bit |
| `ui-wireframe` | Grayscale interface mockup |
| `subway-map` | Transit diagram |
| `ikea-manual` | Minimal line art |
| `knolling` | Organized flat-lay |
| `lego-brick` | Toy brick construction |

Full definitions: `references/styles/<style>.md`

## Recommended Combinations

| Content Type | Layout + Style |
|--------------|----------------|
| Timeline/History | `linear-progression` + `craft-handmade` |
| Step-by-step | `linear-progression` + `ikea-manual` |
| A vs B | `binary-comparison` + `corporate-memphis` |
| Hierarchy | `hierarchical-layers` + `craft-handmade` |
| Overlap | `venn-diagram` + `craft-handmade` |
| Conversion | `funnel` + `corporate-memphis` |
| Cycles | `circular-flow` + `craft-handmade` |
| Technical | `structural-breakdown` + `technical-schematic` |
| Metrics | `dashboard` + `corporate-memphis` |
| Educational | `bento-grid` + `chalkboard` |
| Journey | `winding-roadmap` + `storybook-watercolor` |
| Categories | `periodic-table` + `bold-graphic` |

Default: `bento-grid` + `craft-handmade`

## Output Structure

```
infographic/{topic-slug}/
├── source-{slug}.{ext}
├── analysis.md
├── structured-content.md
├── prompts/infographic.md
└── infographic.png
```

Slug: 2-4 words kebab-case from topic. Conflict: append `-YYYYMMDD-HHMMSS`.

## Core Principles

- Preserve all source data **verbatim**—no summarization or rephrasing
- Define learning objectives before structuring content
- Structure for visual communication (headlines, labels, visual elements)

## Workflow

### Step 1: Setup & Analyze

**1.1 Load Preferences (EXTEND.md)**

Use Bash to check EXTEND.md existence (priority order):

```bash
# Check project-level first
test -f .baoyu-skills/baoyu-infographic/EXTEND.md && echo "project"

# Then user-level (cross-platform: $HOME works on macOS/Linux/WSL)
test -f "$HOME/.baoyu-skills/baoyu-infographic/EXTEND.md" && echo "user"
```

┌────────────────────────────────────────────────────┬───────────────────┐
│                        Path                        │     Location      │
├────────────────────────────────────────────────────┼───────────────────┤
│ .baoyu-skills/baoyu-infographic/EXTEND.md          │ Project directory │
├────────────────────────────────────────────────────┼───────────────────┤
│ $HOME/.baoyu-skills/baoyu-infographic/EXTEND.md    │ User home         │
└────────────────────────────────────────────────────┴───────────────────┘

┌───────────┬───────────────────────────────────────────────────────────────────────────┐
│  Result   │                                  Action                                   │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Found     │ Read, parse, display summary                                              │
├───────────┼───────────────────────────────────────────────────────────────────────────┤
│ Not found │ Ask user with AskUserQuestion (see references/config/first-time-setup.md) │
└───────────┴───────────────────────────────────────────────────────────────────────────┘

**EXTEND.md Supports**: Preferred layout/style | Default aspect ratio | Custom style definitions | Language preference

Schema: `references/config/preferences-schema.md`

**1.2 Analyze Content → `analysis.md`**

1. Save source content (file path or paste → `source.md`)
   - **Backup rule**: If `source.md` exists, rename to `source-backup-YYYYMMDD-HHMMSS.md`
2. Analyze: topic, data type, complexity, tone, audience
3. Detect source language and user language
4. Extract design instructions from user input
5. Save analysis
   - **Backup rule**: If `analysis.md` exists, rename to `analysis-backup-YYYYMMDD-HHMMSS.md`

See `references/analysis-framework.md` for detailed format.

### Step 2: Generate Structured Content → `structured-content.md`

Transform content into infographic structure:
1. Title and learning objectives
2. Sections with: key concept, content (verbatim), visual element, text labels
3. Data points (all statistics/quotes copied exactly)
4. Design instructions from user

**Rules**: Markdown only. No new information. All data verbatim.

See `references/structured-content-template.md` for detailed format.

### Step 3: Recommend Combinations

Recommend 3-5 layout×style combinations based on:
- Data structure → matching layout
- Content tone → matching style
- Audience expectations
- User design instructions

### Step 4: Confirm Options

Use **single AskUserQuestion call** with multiple questions to confirm all options together:

| Question | When | Options |
|----------|------|---------|
| **Combination** | Always | 3+ layout×style combos with rationale |
| **Aspect** | Always | landscape (16:9), portrait (9:16), square (1:1) |
| **Language** | Only if source ≠ user language | Language for text content |

**Important**: Do NOT split into separate AskUserQuestion calls. Combine all applicable questions into one call.

### Step 5: Generate Prompt → `prompts/infographic.md`

**Backup rule**: If `prompts/infographic.md` exists, rename to `prompts/infographic-backup-YYYYMMDD-HHMMSS.md`

Combine:
1. Layout definition from `references/layouts/<layout>.md`
2. Style definition from `references/styles/<style>.md`
3. Base template from `references/base-prompt.md`
4. Structured content from Step 2
5. All text in confirmed language

### Step 6: Generate Image

1. Select available image generation skill (ask user if multiple)
2. **Check for existing file**: Before generating, check if `infographic.png` exists
   - If exists: Rename to `infographic-backup-YYYYMMDD-HHMMSS.png`
3. Call with prompt file and output path
4. On failure, auto-retry once

### Step 7: Output Summary

Report: topic, layout, style, aspect, language, output path, files created.

## References

- `references/analysis-framework.md` - Analysis methodology
- `references/structured-content-template.md` - Content format
- `references/base-prompt.md` - Prompt template
- `references/layouts/<layout>.md` - 20 layout definitions
- `references/styles/<style>.md` - 17 style definitions

## Extension Support

Custom configurations via EXTEND.md. See **Step 1.1** for paths and supported options.

---

## Alternative Renderer: AntV Infographic DSL

> Merged from `infographic-creator`. Use this when you need **interactive HTML/SVG output** instead of static PNG.

AntV Infographic is a code-based renderer that converts a custom DSL into interactive HTML infographics with SVG export. Use it when the user needs an HTML file, SVG output, or wants to iterate quickly without image generation.

`Infographic = Information Structure + Visual Expression`

Renderer: [AntV Infographic](https://infographic.antv.vision/)

### AntV Infographic Syntax

AntV Infographic syntax is a custom DSL used to describe infographic rendering configurations. It uses indentation to describe information, has strong robustness, and is convenient for AI streaming output and infographic rendering. It mainly contains the following information:

1. template: Use templates to express the text information structure.
2. data: Infographic data, including title, desc, data items, etc. Data items typically contain fields such as label, desc, icon, etc.
3. theme: Theme contains style configurations such as palette, font, etc.

For example:

```plain
infographic list-row-horizontal-icon-arrow
data
  title Title
  desc Description
  lists
    - label Label
      value 12.5
      desc Explanation
      icon document text
theme
  palette #3b82f6 #8b5cf6 #f97316
```

### AntV Syntax Specifications

- The first line must be `infographic <template-name>`, template selected from the AntV template list below.
- Use `data` / `theme` blocks, with two-space indentation within blocks.
- Key-value pairs use "key space value"; arrays use `-` as entry prefix.
- icon uses icon keywords (e.g., `star fill`).
- `data` should contain title/desc + template-specific main data field (not necessarily `items`).
- Main data field selection (use only one, avoid mixing):
  - `list-*` -> `lists`
  - `sequence-*` -> `sequences` (optional `order asc|desc`)
  - `compare-*` -> `compares` (supports `children` for grouped comparisons), can contain multiple comparison items
  - `hierarchy-structure` -> `items` (each item corresponds to an independent hierarchy, each level can contain sub-items, can be nested up to 3 levels)
  - `hierarchy-*` -> single `root` (tree structure, nested through `children`);
  - `relation-*` -> `nodes` + `relations`; simple relation diagrams can omit `nodes`, using arrow syntax in relations
  - `chart-*` -> `values` (numeric statistics, optional `category`)
  - Use `items` as fallback when uncertain
- `compare-binary-*` / `compare-hierarchy-left-right-*` binary templates: must have two root nodes, all comparison items hang under these two root nodes' children
- `hierarchy-*`: use single `root`, nested through `children` (do not repeat `root`)
- `theme` is used to customize themes (palette, font, etc.)
  For example: dark theme + custom color scheme
  ```plain
  infographic list-row-horizontal-icon-arrow
  theme dark
    palette
      - #61DDAA
      - #F6BD16
      - #F08BB4
  ```
- Use `theme.base.text.font-family` to specify font, such as handwriting style `851tegakizatsu`
- Use `theme.stylize` to select built-in styles and pass parameters
  Common styles:
  - `rough`: hand-drawn effect
  - `pattern`: pattern fill
  - `linear-gradient` / `radial-gradient`: linear/radial gradient

  For example: hand-drawn style (rough)

  ```plain
  infographic list-row-horizontal-icon-arrow
  theme
    stylize rough
    base
      text
        font-family 851tegakizatsu
  ```

- Do not output JSON, Markdown, or explanatory text

### AntV Data Syntax Examples

Data syntax examples by template category (use corresponding fields, avoid adding `items` simultaneously):

- `list-*` templates

```plain
infographic list-grid-badge-card
data
  title Feature List
  lists
    - label Fast
      icon flash fast
    - label Secure
      icon secure shield check
```

- `sequence-*` templates

```plain
infographic sequence-steps-simple
data
  sequences
    - label Step 1
    - label Step 2
    - label Step 3
  order asc
```

- `hierarchy-*` templates

```plain
infographic hierarchy-structure
data
  root
    label Company
    children
      - label Dept A
      - label Dept B
```

- `compare-*` templates

```plain
infographic compare-swot
data
  compares
    - label Strengths
      children
        - label Strong brand
        - label Loyal users
    - label Weaknesses
      children
        - label High cost
        - label Slow release
```

- `chart-*` templates

```plain
infographic chart-column-simple
data
  values
    - label Visits
      value 1280
    - label Conversion
      value 12.4
```

- `relation-*` templates

> Edge label syntax: A -label-> B or A -->|label| B

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  nodes
    - id A
      label Node A
    - id B
      label Node B
  relations
    A - approves -> B
    A -->|blocks| B
```

- Fallback `items` example

```plain
infographic list-row-horizontal-icon-arrow
data
  items
    - label Item A
      desc Description
      icon sun
    - label Item B
      desc Description
      icon moon
```

### AntV Available Templates

- chart-bar-plain-text
- chart-column-simple
- chart-line-plain-text
- chart-pie-compact-card
- chart-pie-donut-pill-badge
- chart-pie-donut-plain-text
- chart-pie-plain-text
- chart-wordcloud
- compare-binary-horizontal-badge-card-arrow
- compare-binary-horizontal-simple-fold
- compare-binary-horizontal-underline-text-vs
- compare-hierarchy-left-right-circle-node-pill-badge
- compare-quadrant-quarter-circular
- compare-quadrant-quarter-simple-card
- compare-swot
- hierarchy-mindmap-branch-gradient-capsule-item
- hierarchy-mindmap-level-gradient-compact-card
- hierarchy-structure
- hierarchy-tree-curved-line-rounded-rect-node
- hierarchy-tree-tech-style-badge-card
- hierarchy-tree-tech-style-capsule-item
- list-column-done-list
- list-column-simple-vertical-arrow
- list-column-vertical-icon-arrow
- list-grid-badge-card
- list-grid-candy-card-lite
- list-grid-ribbon-card
- list-row-horizontal-icon-arrow
- list-sector-plain-text
- list-zigzag-down-compact-card
- list-zigzag-down-simple
- list-zigzag-up-compact-card
- list-zigzag-up-simple
- relation-dagre-flow-tb-animated-badge-card
- relation-dagre-flow-tb-animated-simple-circle-node
- relation-dagre-flow-tb-badge-card
- relation-dagre-flow-tb-simple-circle-node
- sequence-ascending-stairs-3d-underline-text
- sequence-ascending-steps
- sequence-circular-simple
- sequence-color-snake-steps-horizontal-icon-line
- sequence-cylinders-3d-simple
- sequence-filter-mesh-simple
- sequence-funnel-simple
- sequence-horizontal-zigzag-underline-text
- sequence-mountain-underline-text
- sequence-pyramid-simple
- sequence-roadmap-vertical-plain-text
- sequence-roadmap-vertical-simple
- sequence-snake-steps-compact-card
- sequence-snake-steps-simple
- sequence-snake-steps-underline-text
- sequence-stairs-front-compact-card
- sequence-stairs-front-pill-badge
- sequence-timeline-rounded-rect-node
- sequence-timeline-simple
- sequence-zigzag-pucks-3d-simple
- sequence-zigzag-steps-underline-text

### AntV Template Selection Recommendations

- Strict sequence (process/steps/development trend) -> `sequence-*`
  - Timeline -> `sequence-timeline-*`
  - Staircase diagram -> `sequence-stairs-*`
  - Roadmap -> `sequence-roadmap-vertical-*`
  - Zigzag path -> `sequence-zigzag-*`
  - Circular progress -> `sequence-circular-simple`
  - Colorful snake steps -> `sequence-color-snake-steps-*`
  - Pyramid -> `sequence-pyramid-simple`
- Opinion listing -> `list-row-*` or `list-column-*`
- Binary comparison (pros/cons) -> `compare-binary-*`
- SWOT -> `compare-swot`
- Hierarchical structure (tree diagram) -> `hierarchy-tree-*`
- Data charts -> `chart-*`
- Quadrant analysis -> `compare-quadrant-*`
- Grid list (key points) -> `list-grid-*`
- Relationship display -> `relation-*`
- Word cloud -> `chart-wordcloud`
- Mind map -> `hierarchy-mindmap-*`

### AntV HTML Rendering

When you have the final AntV Infographic syntax, generate a complete HTML file:

```html
<div id="container"></div>
<script src="https://unpkg.com/@antv/infographic@latest/dist/infographic.min.js"></script>
<script>
 const infographic = new AntVInfographic.Infographic({
    container: '#container',
    width: '100%',
    height: '100%',
  });
  document.fonts?.ready.then(() => {
    infographic.render(`{syntax}`);
  }).catch((error) => {
    console.error('Error waiting for fonts to load:', error);
    infographic.render(`{syntax}`);
  });
</script>
```

1. Use the Write tool to generate the HTML file, named as `<title>-infographic.html`
2. Show the user the file path and prompt: "Open directly with a browser to view and save as SVG"
3. Output syntax and prompt: "Tell me if you need to adjust template/colors/content"

**Note:** The HTML file must include responsive container (width/height 100%) and SVG export via `infographic.toDataURL({ type: 'svg' })`.
