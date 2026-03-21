# 20 — Chart Type Selector (Visual Vocabulary)

> **Based on**: Flourish "How to choose the right chart type" + FT Visual Vocabulary
> **Use this BEFORE designing any infographic** — pick the right chart first, then style it.
> **Reference**: https://flourish.studio/blog/choosing-the-right-visualisation/

---

## Prompt 20A — Chart Type Decision Engine

```
You are a senior data visualization strategist at a BCG-tier consultancy.

I have data about: [DESCRIBE YOUR DATA]
My audience is: [FOUNDERS / INVESTORS / OPERATORS / C-SUITE]
The story I want to tell is: [WHAT INSIGHT SHOULD THE READER WALK AWAY WITH?]

Using the 9-category framework below, recommend:
1. PRIMARY chart type (the one chart that tells the story best)
2. SECONDARY chart type (alternative if data doesn't fit primary)
3. AVOID chart type (common wrong choice for this data + why it fails)

For each recommendation, provide:
- Chart type name
- Why it fits this data
- What to put on each axis / segment
- Animation suggestion (if interactive)
- Flourish template to use

THE 9 CATEGORIES:

1. CHANGE OVER TIME → Line chart, area chart, fan chart, bar chart race
2. MAGNITUDE → Bar chart, lollipop, column chart, bullet graph
3. PARTS OF A WHOLE → Donut, pie, stacked bar, treemap, arc chart
4. CORRELATION → Scatter plot, bubble chart, parallel coordinates
5. RANKING → Horizontal bar (sorted), bar/line chart race, bump chart
6. DISTRIBUTION → Histogram, population pyramid, beeswarm, violin plot
7. FLOWS & RELATIONSHIPS → Sankey diagram, network chart, chord diagram
8. SPATIAL → Choropleth map, proportional symbol map, cartogram
9. DEVIATION → Diverging bar, surplus/deficit line, gauge

Return: A decision table with primary, secondary, and avoid options.
```

---

## Prompt 20B — StartupAI Article Section Mapper

```
You are mapping data to the StartupAI 6-section infographic article system.

For each section below, recommend the BEST chart type from the 9 categories.
Topic: [ARTICLE TOPIC]
Data available: [LIST YOUR DATA POINTS]

| Section | Story Goal | Category | Best Chart | Flourish Template | Why |
|---------|-----------|----------|------------|-------------------|-----|
| 1 — Hook | Shock with a number | Magnitude | [?] | [?] | [?] |
| 2 — Where it works | Rank by impact | Ranking | [?] | [?] | [?] |
| 3 — What to use (ROI) | Show top use cases | Magnitude / Ranking | [?] | [?] | [?] |
| 4 — Am I normal? | Peer benchmark | Distribution / Deviation | [?] | [?] | [?] |
| 5 — Why it fails | Show blockers | Ranking / Magnitude | [?] | [?] | [?] |
| 6 — What's next | Show momentum | Change over time | [?] | [?] | [?] |

RULES:
- Never use pie charts with more than 5 segments
- Always sort bars highest → lowest
- Use line charts ONLY when time is on the X axis
- Use scatter plots ONLY when showing correlation between 2 variables
- Use gauges ONLY for single-metric "where am I on a scale?" questions
- Use maps ONLY when geographic location IS the story
```

---

## THE 9 CATEGORIES — QUICK REFERENCE

### 1. Change Over Time

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Line chart** | Trend over months/years, 1–5 series | Line chart | Draw path left-to-right | Section 6 — momentum trends |
| **Line chart (projected)** | Actual + forecast with uncertainty band | Line chart (projected) | Solid draws, then dashed extends | Section 6 — forward projections |
| **Area chart (stacked)** | Composition changing over time | Area chart (stacked) | Layers fill from bottom up | Section 2 — category share shifts |
| **Fan chart** | Forecast with confidence intervals | Fan chart | Fan spreads outward | Section 6 — uncertainty ranges |
| **Bar chart race** | Rankings shifting over time periods | Bar Chart Race | Auto-play racing | Section 2 — market share over time |
| **Line chart race** | Cumulative progress / competition | Line Chart Race (Horserace) | Racing lines | Section 6 — growth trajectories |
| **Streamgraph** | Volume + composition over time | Streamgraph | Layers flow | Section 2 — category evolution |

**StartupAI rule**: Use line charts for "what happened over time." Use racing charts for "who's winning."

---

### 2. Magnitude

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Bar chart (horizontal)** | Compare 3–10 categories by size | Bar chart | Bars grow left-to-right | Section 2 — ranked categories |
| **Column chart** | Compare categories (fewer than 8) | Column chart | Columns grow upward | Section 3 — use case comparison |
| **Bullet graph** | Actual vs target for single metric | Bullet graph | Bar extends to actual, target line static | Section 4 — goal tracking |
| **Waterfall chart** | Show how components add/subtract to total | Waterfall chart | Segments cascade | Section 3 — ROI breakdown |

**StartupAI rule**: Horizontal bars are the default for magnitude. Always sort high → low. Never use 3D bars.

---

### 3. Parts of a Whole

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Donut chart** | 2–5 segments showing composition | Donut chart | Ring fills clockwise | Section 1 — market share breakdown |
| **Stacked bar** | Composition across multiple groups | Bar chart (stacked) | Segments grow together | Section 2 — composition by category |
| **Treemap** | Many categories with sub-categories | Hierarchy (treemap) | Rectangles grow from center | Section 3 — tool ecosystem map |
| **Arc chart** | Election-style seat distribution | N/A (custom) | Seats fill in sequence | N/A |

**StartupAI rule**: Use donut over pie (center space for label). Max 5 segments — group the rest as "Other."

---

### 4. Correlation

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Scatter plot** | Show relationship between 2 variables | Scatter | Points fade in, filter transitions | Section 4 — benchmarking (size vs growth) |
| **Bubble chart** | 3 variables (x, y, size) | Scatter (with size binding) | Bubbles grow from center | Section 2 — market landscape mapping |

**StartupAI rule**: Only use scatter when you're genuinely showing correlation. If you're just comparing categories, use bars.

---

### 5. Ranking

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Horizontal bar (sorted)** | Rank items highest → lowest | Bar chart | Bars grow sequentially | Section 2, 3, 5 — most article sections |
| **Bar chart race** | Rankings shifting over time | Bar Chart Race | Auto-play racing | Section 2 — market shifts |
| **Bump chart** | Rank changes for small number of items | Line bump chart | Lines redraw per period | Section 6 — position changes |
| **Lollipop chart** | Rankings with emphasis on the data point | Column + line variant | Dots pop in, lines draw | Section 3 — use case rankings |

**StartupAI rule**: Sorted horizontal bar = default for ranking. Bar chart race only if you have time-series ranking data.

---

### 6. Distribution

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Histogram** | Show frequency distribution of values | Histogram | Bars grow upward | Section 4 — where most startups fall |
| **Population pyramid** | Two-group age/size distribution | Population pyramid | Bars grow outward from center | Section 4 — early vs growth stage |
| **Beeswarm** | Individual data points in distribution | Scatter variant | Points float into position | Section 4 — per-startup comparison |

**StartupAI rule**: Use distribution charts for Section 4 "Am I Normal?" — show where MOST startups cluster, then let the reader find themselves.

---

### 7. Flows & Relationships

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Sankey diagram** | Volume flow between stages | Sankey | Paths draw left-to-right | N/A — use for funnel analysis articles |
| **Network diagram** | Connections between entities | Network diagram | Nodes + edges appear | N/A — use for ecosystem mapping |
| **Chord diagram** | Bi-directional flows between groups | Chord diagram | Arcs draw | N/A — use for tool integration mapping |

**StartupAI rule**: Flow charts are rare in the 6-section system. Use only for dedicated "how things connect" articles.

---

### 8. Spatial

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Choropleth map** | Values by region (color intensity) | Projection Map | Colors transition per time period | Geographic articles only |
| **Proportional symbol** | Totals by location (circle size) | Projection Map (with points) | Circles grow on map | Startup density maps |
| **Cartogram** | Distort geography by data values | N/A (custom) | Regions morph | N/A |
| **Tile grid map** | Equalized comparison across regions | Projection Map (tile map) | Tiles color-shift | Country comparison |

**StartupAI rule**: Use maps ONLY when "where" is the primary question. If you're just comparing regions by numbers, use horizontal bars instead.

---

### 9. Deviation

| Chart | When to Use | Flourish Template | Animation | StartupAI Use |
|-------|------------|-------------------|-----------|---------------|
| **Gauge** | Single metric on a scale | Gauge | Needle sweep | Section 4 — benchmark score |
| **Diverging bar** | Positive vs negative sentiment | Diverging bar chart | Bars grow from center | Section 4 — agree/disagree data |
| **Surplus/deficit line** | Above/below a reference line | Surplus/deficit area chart | Shading fills | Section 5 — performance gaps |

**StartupAI rule**: Gauges are for ONE metric. Diverging bars are for sentiment. Surplus lines are for above/below target.

---

## Prompt 20C — Anti-Pattern Checker

```
You are a data visualization quality reviewer.

Review the following chart choice and identify if it's an anti-pattern:

Chart type chosen: [CHART TYPE]
Data: [DESCRIBE THE DATA]
Story: [WHAT INSIGHT IS INTENDED]

CHECK AGAINST THESE COMMON MISTAKES:

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Pie chart with 8+ segments | Unreadable, angles hard to compare | Use horizontal bar chart |
| Unsorted bar chart | Reader can't see ranking | Sort highest → lowest |
| Line chart with no time axis | Lines imply continuity that doesn't exist | Use bar chart for categories |
| 3D chart of any kind | Distorts proportions, looks unprofessional | Use 2D — always |
| Dual Y-axis | Misleading — scales can be manipulated | Use two separate charts |
| Map when geography isn't the story | Forces reader to know geography | Use bar chart with labels |
| Truncated Y-axis (not starting at 0) | Exaggerates differences | Start at 0 or explicitly label break |
| Too many colors (8+) | Visual noise, impossible to distinguish | Max 5 colors + gray for "other" |
| Legend instead of direct labels | Forces eye to jump back and forth | Label directly on chart |
| No source citation | Reduces credibility to zero | Always: source name + year + n= |

Return: PASS or FAIL with specific fix recommendation.
```

---

## Prompt 20D — Flourish Template Picker

```
I need to create a visualization with Flourish.

My data: [DESCRIBE — e.g., "5 categories with percentages that sum to 100%"]
My story: [WHAT INSIGHT — e.g., "show which category dominates"]
My channel: [WHERE — e.g., "website embed with animation"]

Pick the BEST Flourish template from this list:

FLOURISH TEMPLATE CATEGORIES:
- Line, bar and pie charts (40+ variants)
- Gauge (single, grid, filterable)
- Bar Chart Race
- Line Chart Race (Horserace)
- Projection Map (100+ geographies)
- Timeline (horizontal, vertical)
- Scatter plot (filterable, time slider)
- Hierarchy (treemap, sunburst)
- Sankey diagram
- Network diagram
- Survey visualization
- Data Explorer
- Cards (filterable grid)
- Stories (multi-slide narrative)

Return:
1. Template name + direct link
2. Data format required (columns, rows)
3. Key settings to customize
4. Animation recommendation
5. Export format for my channel
```

---

## DECISION FLOWCHART (expanded)

```
WHAT IS YOUR PRIMARY QUESTION?
│
├─ "How much?" / "How many?" / "Which is biggest?"
│  └─ MAGNITUDE → Horizontal bar (sorted) or Column chart
│     └─ More than 8 items? → Group into top 5 + "Other"
│
├─ "What changed?" / "What's the trend?"
│  ├─ Continuous time series? → Line chart
│  ├─ Rankings shifting? → Bar chart race or Bump chart
│  ├─ Cumulative growth? → Line chart race
│  └─ Forecast with uncertainty? → Fan chart
│
├─ "What's the breakdown?" / "What % is each part?"
│  ├─ 2–5 segments? → Donut chart
│  ├─ 6+ segments? → Stacked bar or Treemap
│  └─ Changing composition over time? → Stacked area
│
├─ "Are these related?" / "Does X affect Y?"
│  └─ CORRELATION → Scatter plot
│     └─ 3rd variable? → Bubble chart (size = 3rd var)
│
├─ "Which ranks higher?" / "Who's winning?"
│  ├─ Single snapshot? → Horizontal bar (sorted high→low)
│  └─ Over time? → Bar chart race
│
├─ "Where do most fall?" / "Am I normal?"
│  ├─ Single distribution? → Histogram or Gauge
│  ├─ Two groups? → Population pyramid
│  └─ Individual points matter? → Beeswarm
│
├─ "How does it flow?" / "What connects to what?"
│  ├─ Volume through stages? → Sankey
│  └─ Network of connections? → Network diagram
│
├─ "Where?" / "Which region?"
│  ├─ Geographic IS the story? → Choropleth map
│  └─ Just comparing regions by number? → Horizontal bar (skip the map)
│
└─ "Above or below target?" / "Good or bad?"
   ├─ Single metric? → Gauge
   ├─ Agree/disagree? → Diverging bar
   └─ Above/below line? → Surplus/deficit area
```

---

## CHEAT SHEET (print this)

| I want to show... | Use this chart | Never use |
|-------------------|---------------|-----------|
| One big number | KPI tile or Gauge | Pie chart |
| Top 5 categories | Horizontal bar (sorted) | Unsorted column chart |
| Trend over time | Line chart | Bar chart (unless discrete periods) |
| Part of a whole | Donut (≤5 segments) | Pie chart with 8 segments |
| Comparison A vs B | Split comparison or Gap bar | Venn diagram |
| Ranking | Sorted horizontal bar | Radar chart |
| Distribution / "am I normal?" | Histogram or Gauge | Pie chart |
| Before → after | Comparison split | Side-by-side pie charts |
| Geographic data | Choropleth map | 3D globe |
| Process / steps | Flowchart | Numbered paragraph text |
| Root cause | Mini flowchart (3 nodes) | Bulleted list |
| Forecast | Fan chart or Line (projected) | Pie chart |
| Flow / journey | Sankey | Network diagram (unless connections) |
