# Skill Integration Guide — Design & Motion Skills

> **Purpose:** Maps each prompt file (01-56) to the relevant skills from `.agents/skills/design/` and `.agents/skills/motion/`, and explains how to use them together.
>
> **Updated:** 2026-02-14

---

## Available Skills

### Design Skills (`.agents/skills/design/`)

| Skill | Invoke With | Purpose |
|-------|-------------|---------|
| **ui-ux-pro-max** | `/ui-ux-pro-max` | Design system generation, 50+ styles, chart recs, UX rules. Has CLI: `python3 .claude/skills/ui-ux-pro-max/scripts/search.py` |
| **color-palette** | `/color-palette` | Shade generation (11 steps), semantic tokens, WCAG contrast, dark mode |
| **accessibility** | `/accessibility` | WCAG 2.1 AA, keyboard nav, screen readers, ARIA, contrast |
| **frontend-design** | `/frontend-design` | Distinctive UI, bold aesthetics, typography pairing, motion patterns |
| **high-fidelity-prototyping** | `/high-fidelity-prototyping` | Detailed interactive prototypes, interaction states, handoff specs |
| **low-fidelity-prototyping** | `/low-fidelity-prototyping` | Rapid wireframes, concept validation, structure testing |

### Motion Skills (`.agents/skills/motion/`)

| Skill | Invoke With | Purpose |
|-------|-------------|---------|
| **motion** | `/motion` | Motion (Framer Motion) library: gestures, scroll, layout, SVG, spring physics. 15 known issues documented |
| **framer-motion** | `/framer-motion` | 12 Disney animation principles in Framer Motion |
| **framer-motion-animator** | `/framer-motion-animator` | Practical implementation: page transitions, stagger, drag, parallax |
| **motion-interaction-designer** | `/motion-interaction-designer` | UX-first animation strategy: purpose, timing, easing, motion design |
| **scroll-storyteller** | `/scroll-storyteller` | Immersive scroll narratives, SVG art, chapter structure, GSAP/CSS |

---

## How to Use Skills with Prompts

### Workflow

```
1. PICK a prompt file (01-56) based on what you need to create
2. CHECK the frontmatter `skill:` field for recommended skills
3. INVOKE the skill(s) before starting implementation
4. USE the prompt to generate the design specification
5. IMPLEMENT using the skill's patterns, templates, and anti-patterns
```

### Skill Invocation Order

For any design+animation task, invoke skills in this order:

1. **Strategy first:** `/motion-interaction-designer` (defines WHY to animate)
2. **Design system:** `/ui-ux-pro-max` or `/color-palette` (sets visual foundation)
3. **Implementation:** `/motion` or `/framer-motion-animator` (builds the animation)
4. **Quality check:** `/accessibility` (ensures WCAG compliance)

---

## Prompt-to-Skill Mapping

### Part 1 — Chart Types (01-30)

All chart prompts benefit from these skills:

| Skill | How It Helps Charts |
|-------|-------------------|
| `/ui-ux-pro-max` | `--domain chart` for chart type recs, `--domain color` for palettes |
| `/color-palette` | Generate chart-specific color scales (categorical, sequential, diverging) |
| `/accessibility` | Colorblind-safe palettes, ARIA labels for interactive charts, keyboard nav |
| `/frontend-design` | Typography pairing, layout composition for chart containers |

**Specific mappings:**

| Prompts | Primary Skill | Why |
|---------|---------------|-----|
| 01-06 (time series) | `/motion` | Line draw animation (`stroke-dasharray`), scroll-linked reveals |
| 03-04 (races) | `/framer-motion-animator` | Orchestrated sequences, staggered list animations |
| 07-11 (magnitude) | `/motion` | Bar growth animations (`whileInView`, spring physics) |
| 12-16 (parts of whole) | `/motion` | Donut fill (SVG stroke animation), treemap layout transitions |
| 17-18 (correlation) | `/motion` | Scatter plot dot entrance (`staggerChildren`), hover tooltips |
| 19-20 (ranking) | `/framer-motion-animator` | Reorder animations, bump chart path morphing |
| 21-23 (distribution) | `/motion` | Histogram bar growth, beeswarm spring physics |
| 24-26 (flows) | `/scroll-storyteller` | Sankey flow animation, network graph reveals |
| 27-28 (spatial) | `/motion` | Map region highlight animations, symbol scaling |
| 29-30 (deviation) | `/motion` | Gauge needle animation (spring), diverging bar growth |

### Part 2 — Data Workflow (31-36)

| Prompt | Primary Skill | Why |
|--------|---------------|-----|
| 31 (data discovery) | — | No implementation skill needed (AI-only workflow) |
| 32 (data analysis) | — | No implementation skill needed |
| 33 (data enrichment) | — | No implementation skill needed |
| 34 (chart selection) | `/ui-ux-pro-max` | `--domain chart` matches chart to data type |
| 35 (data formatting) | — | No implementation skill needed |
| 36 (design critique) | `/accessibility` | Accessibility audit checklist |

### Part 3 — Animation (37-42)

All animation prompts should invoke `/motion-interaction-designer` first (strategy), then the implementation skill.

| Prompt | Implementation Skill | Why |
|--------|---------------------|-----|
| 37 (hero entrance) | `/framer-motion-animator` | Staggered variants, fade+slide, counter animation |
| 38 (page transitions) | `/framer-motion-animator` | AnimatePresence, shared layout transitions |
| 39 (button interaction) | `/motion` | `whileHover`, `whileTap`, spring physics |
| 40 (loading animation) | `/motion` | Skeleton screens, progress bars, dot sequences |
| 41 (card hover) | `/motion` | `whileHover` scale/elevation, 3D tilt with `useMotionValue` |
| 42 (scroll-triggered) | `/scroll-storyteller` | `whileInView`, `useScroll`, parallax layers, sticky sections |

### Part 4 — SVG & Visual Design (43-48)

| Prompt | Primary Skill | Secondary Skill | Why |
|--------|---------------|-----------------|-----|
| 43 (SVG chart animation) | `/motion` | `/framer-motion` | SVG path animation, stroke-dasharray, spring physics |
| 44 (SVG icon animation) | `/motion` | `/framer-motion` | Path morphing, line drawing, icon state transitions |
| 45 (SVG decorative) | `/scroll-storyteller` | `/motion` | Organic SVG paths, gradient waves, floating elements |
| 46 (infographic layout) | `/ui-ux-pro-max` | `/frontend-design` | Layout grid, spacing tokens, responsive breakpoints |
| 47 (color palette) | `/color-palette` | `/accessibility` | Shade generation, WCAG contrast, colorblind audit |
| 48 (typography) | `/ui-ux-pro-max` | `/frontend-design` | Font pairing, type scale, `--domain typography` |

### Part 5 — AI Image Generation (49-52)

| Prompt | Primary Skill | Why |
|--------|---------------|-----|
| 49 (infographic images) | `/frontend-design` | Style direction, brand aesthetic |
| 50 (hero visuals) | `/frontend-design` | Visual identity, mood setting |
| 51 (chart visuals) | `/ui-ux-pro-max` | Chart-specific visual recommendations |
| 52 (image editing) | — | AI workflow only, no implementation skill |

### Part 6 — Design Workflow (53-56)

| Prompt | Primary Skill | Why |
|--------|---------------|-----|
| 53 (concept generation) | `/low-fidelity-prototyping` | Rapid concept exploration, wireframe-first |
| 54 (component spec) | `/high-fidelity-prototyping` | Interaction states, props, responsive behavior |
| 55 (microcopy) | — | Content workflow, no implementation skill |
| 56 (cross-functional) | `/high-fidelity-prototyping` | Engineering handoff specs, QA checklists |

---

## Skill Usage Tips

### ui-ux-pro-max CLI Commands for Charts

```bash
# Get chart recommendations for your data type
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "comparison ranking" --domain chart

# Get color palette for data viz
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "data visualization accessible" --domain color

# Get full design system for an infographic project
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "data visualization editorial minimal" --design-system -p "Startup Report"
```

### Motion Skill — Key Gotchas for Chart Animation

1. **AnimatePresence must stay mounted** — don't wrap in conditional
2. **Remove Tailwind `transition-*` classes** — they conflict with Motion
3. **Use `LazyMotion` + `m`** for chart-heavy pages (4.6 KB vs 34 KB)
4. **`whileInView` with `viewport={{ once: true }}`** — chart animations should play once
5. **`stroke-dasharray` trick** — calculate path length client-side only (`useEffect`)
6. **Spring physics** — use for gauge needles, counters, bouncy bar charts
7. **`prefers-reduced-motion`** — show final state immediately for accessibility

### color-palette Skill — Chart-Specific Usage

1. **Categorical palette** — Generate from brand hex, get 5-6 distinct colors
2. **Sequential palette** — Use 11-shade scale (50-950) for heatmaps/choropleths
3. **Diverging palette** — Map semantic tokens: positive (green), neutral, negative (red)
4. **Dark mode** — Invert palette, increase brightness, reduce saturation
5. **Contrast check** — All data colors 3:1+ against background, text 4.5:1+

---

## TASK-TEMPLATE Integration

Each prompt file includes a `skill:` field in its frontmatter that maps to the recommended skill(s). When using a prompt as a task:

```yaml
---
task_id: DES-037
title: Hero Section Entrance Animation
phase: MVP
priority: P2
status: Not Started
skill: /motion-interaction-designer, /framer-motion-animator
subagents: [frontend-designer, code-reviewer]
depends_on: [DES-047, DES-046]
---
```

The `skill:` field tells you which skills to invoke before implementation. The `depends_on:` field shows prerequisite design decisions (e.g., color palette must be set before animating charts).

---

## Dependency Graph

```
Color Palette (47)     Typography (48)     Layout (46)
       │                     │                  │
       └─────────┬───────────┘                  │
                 │                              │
         Design System Foundation               │
                 │                              │
       ┌─────────┴───────────┐                  │
       │                     │                  │
  Chart Prompts (01-30)  AI Images (49-52)      │
       │                                        │
       └─────────┬──────────────────────────────┘
                 │
         Animation Layer
                 │
       ┌─────────┼───────────┐
       │         │           │
  SVG Anim    UI Anim    Scroll Story
  (43-45)    (37-42)       (42)
```

**Build order:**
1. Foundation: 47 (color) → 48 (typography) → 46 (layout)
2. Charts: 34 (selection) → chart type prompt (01-30)
3. Animation: strategy → implementation → quality check
