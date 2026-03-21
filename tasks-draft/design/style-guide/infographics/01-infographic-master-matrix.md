# Infographic Types — Master Matrix

> Complete planning reference: what to use, when, how to animate, where to publish, and which tools to use.

---

## MASTER MATRIX

| # | Type | Best Use Case | Complexity | Animation Options | Best Channel | Flourish Template | Figma Resource | StartupAI Section Match | Score /10 |
|---|------|---------------|------------|-------------------|-------------|-------------------|----------------|------------------------|-----------|
| 1 | **Statistical** | KPI reports, survey results, market data, percentages | Moderate | Counter rollup, bar grow, donut fill, number ticker | Website embed, blog, pitch deck | Line/Bar/Pie, Gauge | Essential Charts (200+ charts), Data Viz Kit | Section 1 (Hook) — KPI tiles | 9/10 |
| 2 | **Gauge / Speedometer** | Single metric tracking, scores, forecasts, probability, goal progress | Moderate | Needle sweep, jitter effect, segment highlight, animated counter | Dashboard, election/sports, internal KPI | Gauge template (free) | Animated Donut Chart, Circular Loops | Section 4 (Benchmark) — "am I normal?" | 9/10 |
| 3 | **Comparison / Split** | Side-by-side product/feature/idea contrast, before/after, want vs get | Easy | Slide-in from sides, highlight toggle, gap bar grow | Blog, social carousel, pitch deck | Bar (grouped), Survey | Comparison Split template | Section 4 (Benchmark) — split comparison | 8/10 |
| 4 | **Timeline** | Company milestones, product evolution, historical events, roadmaps | Moderate | Scroll-reveal, marker pop-in, progressive disclosure, auto-play | Website, annual report, investor update | Timeline template (responsive) | Custom timeline components | Section 6 (What's Next) — forward momentum | 8/10 |
| 5 | **Process / How-to** | Step-by-step guides, workflows, onboarding, recipes | Moderate | Step-by-step reveal, sequential highlight, numbered pop-in | Blog, documentation, training | Cards template, Story mode | Flowchart components | Section 2 (Where It Works) — sequence | 8/10 |
| 6 | **Flowchart / Decision** | Decision trees, logic paths, branching workflows, system architecture | Advanced | Path highlight on hover, branch animation, node pulse | Website (interactive), documentation | N/A (build custom) | Flowchart Maker resources | Section 5 (Why It Fails) — root cause flow | 9/10 |
| 7 | **Hierarchical** | Org charts, ranking, pyramid structures, taxonomy | Moderate | Level-by-level reveal, expand/collapse, zoom transitions | Internal comms, org docs, education | Hierarchy/Treemap | Org chart templates | N/A — use for team/org content | 6/10 |
| 8 | **Interactive** | Engagement-driven content, explorable data, user-controlled views | Advanced | Filter transitions, hover states, click-to-reveal, scroll-trigger | Website (embedded), reports, presentations | Survey, Data Explorer, Scatter (filterable) | Interactive component variants | All sections (web version) | 10/10 |
| 9 | **Bar Chart Race** | Rankings over time, competition, changing market share | Moderate | Auto-play racing bars, speed control, pause/play | Social media (video), blog embed, presentation | Bar Chart Race template | N/A (use Flourish export) | Section 2 — shifting rankings over time | 7/10 |
| 10 | **Line Chart Race** | Trends over time, momentum, cumulative progress | Moderate | Racing lines, time slider, trail effect | Blog, financial reports, investor updates | Line Chart Race (Horserace) | N/A (use Flourish export) | Section 1 or 6 — trend momentum | 7/10 |
| 11 | **Geographic / Map** | Regional data, location-based trends, market expansion, demographic | Moderate | Choropleth transition, point pop-in, heatmap pulse, zoom | Website, market reports, expansion plans | Projection Map (100+ country maps) | Map UI components | N/A — use for geographic startup data | 7/10 |
| 12 | **List / Informational** | Tips, summaries, quick facts, checklists, grouped items | Easy | Item fade-in, icon pop, sequential reveal | Social media, email, internal comms | Cards template | List/card UI kits | Section 6 — action checklist | 6/10 |
| 13 | **Anatomical / Parts** | Breaking down a product, system, or concept into components | Moderate | Part highlight, explode view, hover-reveal labels | Product pages, documentation, education | N/A (build custom with annotations) | Illustration Diagram components | N/A — use for platform feature breakdowns | 7/10 |

---

## ANIMATION TYPE REFERENCE

| Animation Type | What It Does | Best For | Tool | Difficulty |
|----------------|-------------|----------|------|------------|
| **Counter rollup** | Numbers count up from 0 to final value | KPI tiles, hero stats | Flourish (built-in), CSS/JS, Figma Smart Animate | Easy |
| **Bar grow** | Bars extend from 0 to full width/height | Statistical, ranking, blocker charts | Flourish (built-in), CSS transitions, Lottie | Easy |
| **Donut/ring fill** | Ring fills clockwise from 0% to value | Progress, completion, part-to-whole | Flourish Gauge, Figma Animated Donut Chart | Moderate |
| **Needle sweep** | Gauge needle sweeps to position (like speedometer) | Gauge, KPI, probability, forecast | Flourish Gauge template | Moderate |
| **Slide-in** | Elements slide from off-screen into position | Comparison (left vs right), split screen | CSS/JS, Figma Smart Animate, After Effects | Easy |
| **Scroll-reveal** | Content appears as user scrolls down | Long-form articles, timelines, storytelling | Flourish Stories, Scrollytelling, GSAP | Advanced |
| **Step-by-step reveal** | Sections appear one at a time, sequentially | Process, how-to, onboarding flows | Flourish Stories (slide-by-slide) | Moderate |
| **Path highlight** | Flowchart path lights up on hover/click | Decision trees, system architecture | Custom JS/CSS, Figma interactive prototypes | Advanced |
| **Racing bars/lines** | Bars or lines race across time, auto-playing | Rankings, competition, trends over time | Flourish Bar/Line Chart Race | Easy |
| **Filter transition** | Chart smoothly animates between filter states | Multi-variable exploration, dashboards | Flourish filter + time slider | Moderate |
| **Map transition** | Choropleth colors shift, points appear/disappear | Geographic data over time | Flourish Projection Map + time slider | Moderate |
| **Jitter effect** | Elements vibrate to show uncertainty/range | Probability, confidence intervals, elections | Custom JS, Flourish Gauge (uncertainty mode) | Advanced |
| **Auto-play loop** | Visualization cycles through states automatically | Social media embeds, GIF replacements | Flourish Stories (autoplay + loop) | Easy |
| **Hover-reveal** | Hidden details appear on mouse hover | Interactive dashboards, detail-on-demand | Flourish popups, Figma interactive components | Moderate |
| **Explode view** | Component parts spread outward from center | Anatomical, product breakdown, system diagrams | After Effects, Lottie, custom Three.js | Advanced |

---

## STYLE ENHANCEMENT GUIDE

| Enhancement | What It Does | When to Use | Implementation |
|------------|-------------|-------------|----------------|
| **Descriptive titles** | Replace "Chart 1" with insight statement | Every single chart — no exceptions | Write the conclusion as the title: "72% of founders reduced CAC" not "CAC data" |
| **Sort bars high→low** | Rank data visually | Any bar chart showing categories | Flourish auto-sort, or pre-sort data |
| **Annotations** | Callout text pointing to key data points | When one data point tells the story | Flourish annotations (story mode), Figma text overlays |
| **Highlight + gray** | Accent one series, mute the rest | When comparing one item to many | Flourish line highlighting, custom color per series |
| **Shade between lines** | Fill the gap between two trend lines | Showing divergence, growing/shrinking gaps | Flourish "shade between" setting |
| **Custom popups** | Replace default tooltip with contextual text | Interactive web embeds | Flourish custom popup templates |
| **Axis highlights** | Color band behind specific ranges on axis | Showing targets, safe zones, thresholds | Flourish axis highlight settings |
| **Line labels** | Label lines directly (no legend needed) | Any multi-line chart | Flourish line label settings — removes legend clutter |
| **Micro-captions** | One-line context below each bar/card | Every visual in the article system | Manual: italic, muted, max 8 words |

---

## CHANNEL × FORMAT MATRIX

| Channel | Best Format | Animation? | Embed Method | Max Visuals | Notes |
|---------|-------------|------------|-------------|-------------|-------|
| **Website (blog)** | Interactive HTML embed | Yes — full animation | Flourish script embed (responsive) | 6–10 per article | Best for engagement; 62% higher dwell time with dataviz |
| **Website (landing page)** | Scroll-triggered animation | Yes — scroll-reveal | GSAP, Flourish scrollytelling, Lottie | 3–5 sections | Keep focused; too many = slow load |
| **LinkedIn carousel** | Static image slides (PNG/PDF) | No (static only) | Export from Flourish or Figma, 1080×1350px | 10 slides max | Each slide = 1 visual from article |
| **Twitter/X** | Single image or GIF | GIF only (auto-loop) | Flourish GIF export or screen capture | 1–4 images | Big number + one chart = highest engagement |
| **Instagram** | Carousel or Reel | Reel = video; carousel = static | Export frames, use CapCut for video | 10 slides or 90s video | Vertical (1080×1350 carousel, 1080×1920 reel) |
| **YouTube / video** | Animated infographic video | Full animation | After Effects + Lottie, or screen-record Flourish | Unlimited | Racing bars + gauge animations = highest retention |
| **Pitch deck** | Embedded or screenshot | Click-to-play (Flourish link) | Paste screenshot + add Flourish link in notes | 1–2 per slide | Investors prefer clean static charts over animation |
| **Email newsletter** | Static image + link | No (email blocks JS) | PNG export, link to interactive version | 1–3 images | Use hero stat image + "see interactive version" CTA |
| **Internal dashboard** | Live-data interactive | Yes — auto-refresh | Flourish live CSV or API, iFrame embed | 6–12 gauges/charts | Flourish Gauge grid perfect for KPI dashboards |
| **PDF report** | High-res static export | No | Flourish PNG/SVG export at 2× resolution | 4–6 per page | Export at 300dpi minimum |
| **Presentation (Keynote/PPT)** | Static + build animations | Slide builds only | Screenshot + slide animation for reveal | 1 chart per slide | Reveal chart, then add annotation on next click |

---

## FLOURISH TEMPLATE QUICK REFERENCE

| Template Category | Key Templates | Free? | Best Animation | StartupAI Use |
|-------------------|--------------|-------|----------------|---------------|
| **Line, Bar, Pie** | Line chart, Bar chart, Column chart, Donut, Pie, Streamgraph, Population pyramid, Waterfall | Yes | Bar grow, filter transitions, time slider | Statistical sections, KPI comparisons |
| **Gauge** | Single gauge, Grid of gauges, Filterable gauge | Yes (free) | Needle sweep, animated counter, segment color | Benchmark sections, KPI dashboards, forecasts |
| **Bar Chart Race** | Standard bar race | Yes | Auto-play racing, speed control | Rankings over time, market share shifts |
| **Line Chart Race** | Horserace template | Yes | Racing lines, ranked progression | Trend visualization, momentum stories |
| **Projection Map** | World, 100+ countries, tile grids, hex maps | Yes | Choropleth transitions, point maps, spikes | Geographic data, market expansion |
| **Timeline** | Horizontal, vertical, time-scaled, equidistant | Yes | Scroll-through, marker pop-in, images | Company milestones, product roadmaps |
| **Cards** | Card grid, filterable cards | Yes | Filter transitions, image display | Feature showcases, tool comparisons |
| **Hierarchy** | Treemap, sunburst | Yes | Drill-down, zoom transitions | Category breakdowns, market segments |
| **Survey** | Survey response visualization | Yes | View transitions, grouped → individual | Survey data exploration |
| **Data Explorer** | Multi-variable explorer | Yes | Smooth axis transitions | Research data, multi-dimensional analysis |
| **Scatter** | Scatter plot, filterable, time slider | Yes | Time animation, filter transitions | Correlation data, market positioning |
| **Stories** | Multi-slide narrative | Yes | Auto-play, loop, scrollytelling (paid) | Full infographic articles as interactive stories |

---

## FIGMA RESOURCE LIBRARY

| Resource | Type | URL | What's Included | Cost |
|----------|------|-----|----------------|------|
| **Essential Charts & Infographics** | Community file | figma.com/community/file/1279748307594328785 | 200+ custom charts, infographics, UI cards | Free |
| **Charts & Infographics UI Kit** | Community file | figma.com/community/file/1204665783973698091 | Full chart kit for dashboards | Free |
| **Colorful Chart Pack** | Community file | figma.com/community/file/1451874411283668506 | Charts, graphs, maps, 3D viz, timelines, tables | Free |
| **Data Visualization Graphs Kit** | Community file | figma.com/community/file/1199721318228257277 | 40 charts, 50+ styles, AutoLayout, dark/light mode | Free |
| **Animated Donut Chart** | Community file | figma.com/community/file/1004521728592709351 | Animated donut with synced counter | Free |
| **Pie Animation Tutorial** | Community file | figma.com/community/file/1194278158541974054 | Nested components, interactive loading animation | Free |
| **Pie Chart Animation** | Community file | figma.com/community/file/1230297608408271673 | Custom pie chart animation in Figma | Free |
| **Interactive Pie & Donut** | Community file | figma.com/community/file/1491413441833328838 | Boolean variables, hover/click interactions | Free |
| **Circular Animated Loops** | Community file | figma.com/community/file/952268988104014093 | Circular loading effects, remixable for donut/pie | Free |
| **Chart Generator Pro** | Plugin | figma.com/community/plugin/1532401506940256037 | Pie, donut, funnel, column chart generator | Free |
| **How to Make Charts** | Tutorial file | figma.com/community/file/1443631716733230423 | Pie, donut, bar, column chart creation guide | Free |
| **Infographic Templates Hub** | Community page | figma.com/community/data-templates/infographics | Curated infographic template collection | Free |
| **Setproduct Charts UI Kit** | Premium kit | setproduct.com/templates/charts | 150+ charts, all viewports, dark mode, components | Paid |

---

## DECISION FLOWCHART: WHICH TYPE TO USE?

```
START: What's your primary data?
│
├─ Numbers / percentages / stats?
│  ├─ Single key metric? → GAUGE
│  ├─ Multiple KPIs? → STATISTICAL (KPI tiles)
│  ├─ Rankings? → HORIZONTAL BAR (ranked)
│  └─ Part of whole? → DONUT / PIE
│
├─ Comparison between items?
│  ├─ 2 items (A vs B)? → SPLIT COMPARISON
│  ├─ 3+ items ranked? → BAR CHART (horizontal)
│  └─ Gap between want/get? → GAP BAR
│
├─ Change over time?
│  ├─ Ranking shifts? → BAR CHART RACE
│  ├─ Trend lines? → LINE CHART RACE
│  ├─ Events/milestones? → TIMELINE
│  └─ Geographic shifts? → MAP (time slider)
│
├─ Process or steps?
│  ├─ Linear steps? → PROCESS / HOW-TO
│  ├─ Branching decisions? → FLOWCHART
│  └─ Hierarchy/structure? → HIERARCHICAL
│
├─ Location-based data?
│  └─ → GEOGRAPHIC MAP
│
└─ Engagement / exploration?
   ├─ User-controlled filters? → INTERACTIVE
   ├─ Scrollable narrative? → SCROLLYTELLING
   └─ Social sharing? → CAROUSEL (static)
```
