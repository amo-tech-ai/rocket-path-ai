# 11 — Statistical Infographic (Animated)

> **Best for**: KPI reports, survey results, market data, research findings, percentages
> **Animation**: Counter rollup, bar grow, donut fill, number ticker

---

## Prompt 11A — Animated KPI Dashboard

```
[PASTE GLOBAL STYLE SPEC]

Design an animated statistical dashboard infographic.
Title: [TITLE]
Aspect ratio: 16:9

ANIMATION SEQUENCE (triggered on scroll into view):
1. Background card fades in (0.3s)
2. Hero stat counter rolls up from 0 → final value (1.2s, ease-out)
3. Bar charts grow from left to right (0.8s each, staggered 150ms)
4. Donut ring fills clockwise (1s)
5. Callout text fades in last (0.3s, 200ms after charts complete)

COUNTER ANIMATION SPEC:
- Start: 0
- End: [FINAL VALUE]
- Duration: 1.2 seconds
- Easing: cubic-bezier(0.25, 0.1, 0.25, 1)
- Format: Add commas for thousands, % suffix if percentage
- Font: Cormorant Garamond 400, 56px during animation

BAR GROW SPEC:
- Width starts at 0, grows to final percentage
- Track (background): stone (#E6E2DC)
- Fill: accent color
- Duration: 0.8s per bar
- Stagger: 150ms between bars (top to bottom)

DONUT FILL SPEC:
- Starts at 12 o'clock position
- Fills clockwise
- Center number syncs with fill (counts up)
- Stroke width: 5px

FLOURISH: Use Line/Bar/Pie template → Story mode for slide-by-slide reveal
FIGMA: Use Essential Charts community file → Smart Animate between states
WEB: Intersection Observer + CSS custom properties for animation triggers
```

---

# 12 — Timeline Infographic (Interactive)

> **Best for**: Company milestones, product evolution, historical events, roadmaps, project phases
> **Animation**: Scroll-reveal, marker pop-in, progressive disclosure

---

## Prompt 12A — Horizontal Interactive Timeline

```
[PASTE GLOBAL STYLE SPEC]

Design an interactive timeline infographic.
Title: [TITLE — e.g., "StartupAI Product Roadmap"]
Orientation: Horizontal (desktop) / Vertical (mobile responsive)

TIMELINE STRUCTURE:
- Central horizontal line: 2px, stone (#D0CBC4)
- Event markers: circles (12px) on the line
- Alternating above/below layout for event cards
- Events spaced by time scale OR equidistant (choose one)

EVENT CARD (each milestone):
- Width: 240px
- White background, 1px border (#E6E2DC), 8px radius
- Image area (optional): 240×140px, top of card
- Date badge: accent green pill, 10px, uppercase
- Title: DM Sans 500, 14px
- Description: DM Sans 400, 12px, muted, max 2 lines
- Connector line: 1px dashed, from marker to card

ANIMATION SEQUENCE:
1. Central line draws from left to right (1.5s)
2. Markers pop in sequentially along the line (100ms stagger)
3. Cards fade + slide up/down from markers (200ms stagger)
4. Images lazy-load as cards appear

INTERACTIVE FEATURES:
- Click/tap card to expand with full description
- Hover: card lifts slightly (2px shadow increase)
- Mobile: swipe left/right to scroll timeline
- Optional: filter by category (pill buttons above)

RESPONSIVE:
- Desktop: horizontal, alternating above/below
- Tablet: horizontal, all below
- Mobile: vertical, all to the right of the line

FLOURISH: Use Timeline template → choose horizontal/vertical, time-scale/equidistant
FLOURISH URL: https://app.flourish.studio/templates#template-timeline
```

---

# 13 — Comparison / Split Infographic (Animated)

> **Best for**: Side-by-side contrast, before/after, want vs get, A vs B features
> **Animation**: Slide-in from sides, highlight toggle, gap bar grow

---

## Prompt 13A — Animated Split Screen

```
[PASTE GLOBAL STYLE SPEC]

Design an animated comparison infographic.
Title: [TITLE — e.g., "Manual vs AI-Powered GTM"]
Aspect ratio: 1:1 (square, social-optimized)

ANIMATION SEQUENCE:
1. Header fades in (0.3s)
2. Left column slides in from left (0.5s, ease-out)
3. Right column slides in from right (0.5s, ease-out, 200ms delay)
4. Comparison rows highlight sequentially (150ms stagger)
5. Bottom insight card fades in (0.3s)

LEFT COLUMN SLIDE-IN:
- Start: translateX(-100%)
- End: translateX(0)
- Duration: 0.5s
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

RIGHT COLUMN SLIDE-IN:
- Start: translateX(100%)
- End: translateX(0)
- Duration: 0.5s, 200ms delay
- Easing: same as left

ROW HIGHLIGHT:
- Each row starts at opacity 0.3
- Highlights to opacity 1.0 sequentially
- Left value + right value highlight together
- Green accent on "winner" value per row

GAP BAR VARIANT (for quantitative comparisons):
- Two horizontal bars per row (want vs get)
- "Want" bar: blue tint
- "Get" bar: rose tint
- Gap between bars IS the visual story
- Bars grow from center outward simultaneously
```

---

# 14 — Flowchart / Decision Tree (Interactive)

> **Best for**: Decision trees, logic paths, system architecture, root cause analysis
> **Animation**: Path highlight on hover, branch animation, node pulse

---

## Prompt 14A — Animated Decision Flowchart

```
[PASTE GLOBAL STYLE SPEC]

Design an animated decision flowchart.
Title: [TITLE — e.g., "Should Your Startup Use AI for GTM?"]
Aspect ratio: 16:9

ANIMATION SEQUENCE:
1. Start node fades in with pulse (0.5s)
2. First path draws (0.3s, stroke-dashoffset animation)
3. Next node fades in at path end (0.2s)
4. Repeat for each path + node
5. Total: ~3s for full flowchart reveal

PATH DRAWING ANIMATION:
- SVG stroke-dasharray = total path length
- stroke-dashoffset animates from full length → 0
- Duration: 0.3s per path segment
- Color: stone → accent green for "yes" path, muted rose for "no" path

NODE REVEAL:
- Scale: 0.8 → 1.0
- Opacity: 0 → 1
- Duration: 0.2s
- Easing: ease-out

INTERACTIVE (web version):
- Hover node: slight scale up (1.05×), shadow increase
- Click decision node: highlights the chosen path, dims alternatives
- Full path highlight: selected route glows accent green
- Reset button: returns to neutral state

FIGMA PROTOTYPE:
- Each decision = component variant
- Smart Animate between yes/no states
- Overlay for hover details
```

---

# 15 — Bar Chart Race (Animated)

> **Best for**: Rankings over time, competition, changing market share, cumulative growth
> **Animation**: Auto-play racing bars with labels

---

## Prompt 15A — Racing Bar Chart

```
[PASTE GLOBAL STYLE SPEC]

Design a racing bar chart for rankings over time.
Title: [TITLE — e.g., "Top AI Startup Categories by Funding 2020–2025"]

FLOURISH SETUP:
1. Template: Bar Chart Race → https://app.flourish.studio/templates#template-bar-chart-race
2. Data format: Rows = categories/entities, Columns = time periods
3. Values must be CUMULATIVE (not per-period)
4. Each column header = year or date

CUSTOMIZATION:
- Bar colors: mapped to StartupAI palette
- Label position: end of bar (right-aligned)
- Value format: "$XXB" or "XX%"
- Duration per keyframe: 800ms (smooth but readable)
- Counter: running total in corner
- Date label: large, top-right, updates with animation

EXPORT OPTIONS:
- Web embed: script embed (auto-plays, interactive)
- Video: screen record at 60fps for social media
- GIF: Flourish auto-loop story (lighter file size)
- Static: screenshot key frames for carousel

STYLING:
- Max 8–10 bars visible at once
- Sorted descending (biggest on top, always)
- Bars that exit bottom fade out smoothly
- New entries slide in from bottom
- Bar labels: DM Sans 500, 13px, white text on bar or dark text beside
```

---

# 16 — Geographic / Map Infographic (Interactive)

> **Best for**: Regional data, market expansion, location trends, demographic spread
> **Animation**: Choropleth transition, point pop-in, heatmap pulse

---

## Prompt 16A — Animated Choropleth Map

```
[PASTE GLOBAL STYLE SPEC]

Design an animated geographic infographic.
Title: [TITLE — e.g., "AI Startup Density by Region"]

FLOURISH SETUP:
1. Template: Projection Map → https://app.flourish.studio/templates#template-projection-map
2. Choose geography: World / US States / Europe / Custom
3. Data: Region column + Value column + optional Time column
4. Color scale: sequential (light cream → accent green) or diverging

ANIMATION OPTIONS:
- Time slider: regions re-color as timeline advances
- Filter: toggle between categories (button controls)
- Zoom: click region to zoom + show detail panel
- Points: animated markers appear/grow on map

COLOR SCALE:
- Low values: warm ivory (#FAF8F5)
- Medium: sage (#C5D4C0)
- High: accent green (#4A7C59)
- No data: light stone (#E6E2DC) with diagonal hatch

RESPONSIVE:
- Desktop: full map with side panel for details
- Mobile: map stacks above detail cards
```

---

# 17 — Hierarchical Infographic

> **Best for**: Org charts, ranking, pyramid, taxonomy, category structure
> **Animation**: Level-by-level reveal, expand/collapse, zoom

---

## Prompt 17A — Animated Hierarchy

```
[PASTE GLOBAL STYLE SPEC]

Design a hierarchical infographic.
Title: [TITLE — e.g., "AI Startup Tech Stack Hierarchy"]

STRUCTURE OPTIONS:
- Treemap: nested rectangles, area = value
- Sunburst: radial rings, drill-down
- Pyramid: triangular tiers, top = highest rank
- Org chart: tree layout, parent → children

ANIMATION:
- Treemap: rectangles grow from center outward (0.5s per level)
- Sunburst: rings expand from center (0.3s per ring)
- Pyramid: tiers build from bottom up (0.4s per tier)
- Org chart: nodes cascade down from root (150ms stagger per level)

INTERACTIVE:
- Click to drill down one level
- Breadcrumb trail shows path
- Smooth zoom transition (0.5s)

FLOURISH: Use Hierarchy template → Treemap or Sunburst starting points
```

---

# 18 — Interactive / Engagement Infographic

> **Best for**: Explorable data, user-controlled views, survey results, multi-variable analysis
> **Animation**: Filter transitions, hover states, click-to-reveal, scroll-trigger

---

## Prompt 18A — Scrollytelling Data Story

```
[PASTE GLOBAL STYLE SPEC]

Design a scrollytelling infographic article.
Title: [TITLE]

SCROLLYTELLING STRUCTURE:
- Full-width sections, one per scroll "step"
- Chart stays fixed (sticky), text scrolls beside it
- Each scroll step triggers a chart state change
- Minimum 5 steps, maximum 12

STEP ANIMATION TRIGGERS:
| Step | Scroll Position | Chart Action | Narration |
|------|----------------|--------------|-----------|
| 1 | 0–15% | Chart appears, empty | Intro question |
| 2 | 15–30% | First data series draws | First insight |
| 3 | 30–45% | Second series overlays | Comparison |
| 4 | 45–60% | Annotation highlights gap | Key finding |
| 5 | 60–75% | Filter changes view | New angle |
| 6 | 75–90% | Full picture revealed | Conclusion |
| 7 | 90–100% | CTA card fades in | Next step |

FLOURISH: Use Stories with autoplay disabled + scrollytelling mode (Publisher/Enterprise)
ALTERNATIVE: GSAP ScrollTrigger + Flourish embed state changes via API

ENGAGEMENT FEATURES:
- Estimated read time indicator (top)
- Progress bar (thin, top of viewport)
- "Skip to insights" jump link
- Share button per section (captures chart screenshot)
```

---

# 19 — List / Informational Infographic (Animated)

> **Best for**: Tips, quick facts, checklists, grouped items, summaries
> **Animation**: Item fade-in, icon pop, sequential reveal

---

## Prompt 19A — Animated List Cards

```
[PASTE GLOBAL STYLE SPEC]

Design an animated list/informational infographic.
Title: [TITLE — e.g., "7 AI Tools Every Founder Needs"]

CARD LAYOUT:
- Vertical stack of 5–8 cards
- Each card: full-width, 80px height, white bg, 1px border
- Left: icon (32×32, accent color)
- Center: title (DM Sans 500, 14px) + one-line description (12px, muted)
- Right: optional metric or badge

ANIMATION:
- Cards slide up + fade in sequentially
- Start: translateY(20px), opacity 0
- End: translateY(0), opacity 1
- Duration: 0.3s per card
- Stagger: 100ms between cards
- Icon pops slightly (scale 0.8 → 1.0) as card appears

INTERACTIVE:
- Hover: card background shifts to cream (#FAF8F5)
- Click: expands card to show full detail paragraph
- Collapse: smooth height transition (0.3s)

FLOURISH: Use Cards template → filterable card grid
FIGMA: Use card components with Smart Animate variants
```
