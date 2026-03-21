# Chart Types & Prompts — Complete Reference

> **30 chart types** | AI prompts for each | Based on Flourish, FT Visual Vocabulary, BCG editorial standards
>
> **Sources:** [Animated Charts](https://flourish.studio/blog/animated-charts/) | [Choosing the Right Visualisation](https://flourish.studio/blog/choosing-the-right-visualisation/) | [Bar Chart Race](https://flourish.studio/visualisations/bar-chart-race/) | [Hierarchy Diagrams](https://flourish.studio/blog/hierarchy-diagrams-sunburst-packed-circle/) | [Bar Charts](https://flourish.studio/visualisations/bar-charts/) | [AI for Better Charts](https://flourish.studio/blog/ai-for-better-charts/)

---

## How to Use This Document

1. **Find your story type** in the 9-Category Quick Picker below
2. **Pick a chart** from the detailed section
3. **Copy the prompt** and fill in `[BRACKETS]`
4. **Use with** Gemini, Claude, ChatGPT, or Flourish AI

### AI Prompt Formula (from Flourish)

> "The secret to getting better answers from AI tools is to ask better questions."

Every prompt in this document follows the **CSEF formula:**
- **C**ontext — who you are, what the project is
- **S**pecificity — exact chart type, exact output format
- **E**xamples — reference images, style, tone
- **F**ormat — how you want the answer structured

---

## 9-Category Quick Picker

| # | Question You're Asking | Category | Go-To Chart | Page Section |
|---|----------------------|----------|-------------|--------------|
| 1 | "What changed over time?" | Change Over Time | Line chart, Bar chart race | [Section 1](#1-change-over-time) |
| 2 | "How much? Which is biggest?" | Magnitude | Horizontal bar, Column chart | [Section 2](#2-magnitude) |
| 3 | "What's the breakdown?" | Parts of a Whole | Donut, Stacked bar, Treemap | [Section 3](#3-parts-of-a-whole) |
| 4 | "Are these related?" | Correlation | Scatter plot, Bubble chart | [Section 4](#4-correlation) |
| 5 | "Who ranks highest?" | Ranking | Sorted bar, Bar chart race | [Section 5](#5-ranking) |
| 6 | "Where do most fall?" | Distribution | Histogram, Beeswarm | [Section 6](#6-distribution) |
| 7 | "How does it flow?" | Flows & Relationships | Sankey, Network diagram | [Section 7](#7-flows--relationships) |
| 8 | "Where geographically?" | Spatial | Choropleth, Symbol map | [Section 8](#8-spatial) |
| 9 | "Above or below target?" | Deviation | Gauge, Diverging bar | [Section 9](#9-deviation) |

---

## 1. Change Over Time

### 1A. Line Chart

**When to use:** Continuous trends over months/years with 1-5 series. The X-axis MUST be time.

**Real-world examples:** Stock price history, monthly revenue trends, user growth, AI adoption rates 2020-2026.

**Flourish template:** Line chart (standard, projected, small multiples)

**Animation:** Slow-reveal draw from left to right. Add annotations at key inflection points.

```
PROMPT — Line Chart

You are a senior data visualization designer creating a BCG-editorial-quality line chart.

DATA: [Paste your data or describe it — e.g., "Monthly active users for 3 products, Jan 2023 to Dec 2025"]
STORY: [What insight should the reader walk away with? — e.g., "Product A overtook Product B in Q3 2024"]
AUDIENCE: [Founders / Investors / C-suite / General public]

Create:
1. A clean line chart specification with:
   - X-axis: time periods with appropriate intervals
   - Y-axis: values with clear units, starting at 0
   - Max 5 lines, each with a distinct color from this palette: #0B6E4F, #14B8A6, #6366F1, #F59E0B, #9CA3AF
   - Direct labels on lines (no legend box)
   - One annotation callout at the key inflection point
   - Source citation at bottom-left: "Source: [NAME], [YEAR] (n=[SAMPLE SIZE])"

2. The data formatted as a CSV table ready for Flourish:
   - Column 1: Date/period labels
   - Columns 2-N: One column per series

3. A 1-sentence headline that tells the story (not describes the chart)
   Good: "AI adoption doubled in 18 months, outpacing cloud's early trajectory"
   Bad: "AI adoption rates from 2023 to 2025"

Style: Minimal grid, no chart junk, BCG green (#0B6E4F) as primary accent.
```

---

### 1B. Area Chart (Stacked)

**When to use:** Composition that changes over time. Shows both individual series AND the total. Best for 2-5 categories.

**Real-world examples:** Market share shifts over time, revenue by product line, energy mix by source.

**Flourish template:** Area chart (stacked)

```
PROMPT — Stacked Area Chart

You are creating a stacked area chart showing how composition changes over time.

DATA: [Describe — e.g., "AI market revenue by segment: ML, NLP, Computer Vision, Deep Learning, 2024-2030"]
STORY: [e.g., "Deep Learning is growing fastest and will dominate by 2030"]
TOTAL MATTERS: [Yes/No — does the reader need to see the overall total growing?]

Create:
1. Chart specification:
   - X-axis: time periods
   - Y-axis: values (stacked)
   - Order layers largest-on-bottom for stability
   - Color palette: darkest for largest segment, lightest for smallest
   - Label each area directly (no legend box)

2. Data as CSV: Column 1 = dates, Columns 2-N = one per category

3. Headline that emphasizes the SHIFT, not the structure
   Good: "NLP's share tripled while ML plateaued"
   Bad: "AI market breakdown by technology"
```

---

### 1C. Bar Chart Race

**When to use:** Rankings shifting over sequential time periods. Makes trends entertaining and shareable. Data MUST be cumulative or absolute per time period.

**Real-world examples:** Top countries by GDP over decades, most popular programming languages by year, startup funding by city.

**Flourish template:** Bar Chart Race

**Data format:** Each row = one participant, each column = one time period.

```
PROMPT — Bar Chart Race

You are creating an animated bar chart race for social media / presentation use.

DATA: [Describe — e.g., "Top 10 countries by AI investment, yearly from 2018 to 2026"]
PARTICIPANTS: [What are the bars? — e.g., "Countries: US, China, UK, Germany, India, etc."]
TIME PERIODS: [e.g., "Annual, 2018 to 2026"]
STORY: [e.g., "China is closing the gap with the US while India emerges as a dark horse"]

Create:
1. Data table formatted for Flourish Bar Chart Race:
   - Row 1: Headers — "Name", "Category", "Image URL", "2018", "2019", "2020", ...
   - Each subsequent row: one participant with values per time period
   - Values should be CUMULATIVE or ABSOLUTE (not deltas)

2. Configuration recommendations:
   - Number of bars visible: [8-12 recommended]
   - Duration per period: [300-600ms]
   - Color coding: by category/region
   - Captions: key moments to annotate (e.g., "COVID impact" at 2020)

3. A punchy title (max 8 words) that creates curiosity
   Good: "The Global AI Race: Who's Winning?"
   Bad: "AI Investment by Country 2018-2026"
```

---

### 1D. Line Chart Race (Horserace)

**When to use:** Cumulative progress over time where the RANKING is the story, not just the values. Unlike bar chart race, this shows continuous trajectory.

**Real-world examples:** Debt ceiling history, cumulative COVID cases by country, startup runway burn comparison.

**Flourish template:** Line Chart Race (Horserace)

```
PROMPT — Line Chart Race

Create a line chart race (horserace) visualization.

DATA: [e.g., "Cumulative venture funding for 5 AI startups, monthly from Series A to present"]
STORY: [e.g., "Company X raised slower but more consistently, overtaking rivals by month 18"]

Produce:
1. Data formatted as: Row 1 = headers (Name, Month 1, Month 2, ...), subsequent rows = participants
2. Recommended race settings: duration, label positions, finish-line annotations
3. Headline emphasizing the OVERTAKE moment, not the final state
```

---

### 1E. Fan Chart

**When to use:** Forecasts with uncertainty/confidence intervals. Shows a central projection plus widening bands of probability.

**Real-world examples:** GDP forecast, startup revenue projections, market size estimates with confidence ranges.

```
PROMPT — Fan Chart

Create a fan chart showing a forecast with uncertainty bands.

DATA: [e.g., "Quarterly revenue forecast for next 8 quarters, with 50%/80%/95% confidence intervals"]
STORY: [e.g., "Base case is strong but downside risk widens significantly after Q4"]

Produce:
1. Central line (most likely projection)
2. 3 confidence bands: 50% (darkest), 80% (medium), 95% (lightest)
3. Clear label: "Actual" for historical, "Projected" for forecast
4. Vertical dashed line at the actual→forecast boundary
5. Data as CSV with columns: Date, Actual, Forecast, Low_95, Low_80, Low_50, High_50, High_80, High_95
```

---

### 1F. Streamgraph

**When to use:** Volume AND composition changing over time. More organic/flowing than stacked area. Best for 5-15 categories.

**Real-world examples:** Music genre popularity over decades, programming language usage, content type distribution.

```
PROMPT — Streamgraph

Create a streamgraph specification for showing volume and composition shifts over time.

DATA: [e.g., "Monthly content output by type: blogs, videos, podcasts, infographics, 2022-2026"]
STORY: [e.g., "Video content exploded while blog output plateaued"]

Produce:
1. Data as CSV (same format as stacked area)
2. Color palette with distinct but harmonious colors per category
3. Recommended ordering: largest in center for visual stability
4. Interactive tooltip spec: show category name + value + % of total on hover
```

---

## 2. Magnitude

### 2A. Horizontal Bar Chart

**When to use:** Comparing 3-15 categories by size. ALWAYS sort highest to lowest. Horizontal bars give room for long labels.

**Real-world examples:** AI adoption by industry, survey response rankings, feature importance scores.

**Flourish template:** Bar chart (horizontal)

```
PROMPT — Horizontal Bar Chart

You are creating a clean, BCG-editorial horizontal bar chart.

DATA: [e.g., "AI adoption rate by industry: Healthcare 78%, Finance 72%, Retail 65%, Manufacturing 58%, Education 45%"]
STORY: [e.g., "Healthcare leads AI adoption but education is lagging far behind"]

Create:
1. Chart specification:
   - Bars sorted HIGHEST to LOWEST (mandatory)
   - Single color for all bars (BCG green #0B6E4F) OR highlight top/bottom bar in accent color
   - Value labels at the END of each bar (not inside)
   - Category labels LEFT-aligned
   - No gridlines — the value labels make them redundant
   - Source citation bottom-left

2. Data as a 2-column CSV: Category, Value

3. Headline that tells the STORY, not describes the data
   Good: "Healthcare leads — but education risks falling behind on AI"
   Bad: "AI adoption rates by industry"

RULES:
- NEVER leave bars unsorted
- Max 12 bars — group the rest as "Other"
- No 3D effects
- No chart border or box
```

---

### 2B. Column Chart

**When to use:** Comparing categories when there are fewer than 8 items OR when you want to emphasize height/growth visually.

**Real-world examples:** Revenue by quarter, headcount by department, funding by round.

**Flourish template:** Column chart

```
PROMPT — Column Chart

Create a clean column chart specification.

DATA: [e.g., "Funding raised by round: Seed $2M, Series A $8M, Series B $25M, Series C $60M"]
STORY: [e.g., "Each round nearly tripled the previous — classic power-law fundraising"]

Produce:
1. Vertical columns, max 8 bars
2. Y-axis starting at 0 (mandatory — never truncate)
3. Value labels ABOVE each column
4. Subtle gridlines on Y-axis only
5. Growth rate annotation between columns if showing progression
```

---

### 2C. Lollipop Chart

**When to use:** Same as bar chart but with more visual emphasis on individual data points. Looks cleaner with many items.

**Real-world examples:** Feature ratings, city livability scores, individual KPI performance.

```
PROMPT — Lollipop Chart

Create a lollipop chart where each item is a dot on a thin line.

DATA: [e.g., "NPS scores by product feature: Onboarding 82, Dashboard 75, Reports 71, API 68, Mobile 54"]
STORY: [e.g., "Onboarding stands out as the clear strength; mobile needs investment"]

Produce:
1. Horizontal thin lines with circular dots at the value end
2. Sorted highest to lowest
3. Dot color: solid for top 3, gray for the rest
4. Value label next to each dot
```

---

### 2D. Waterfall Chart

**When to use:** Showing how sequential additions and subtractions lead to a final total. Each bar segment is a step.

**Real-world examples:** Revenue bridge (gross to net), profit breakdown, budget allocation impact.

**Flourish template:** Waterfall chart

```
PROMPT — Waterfall Chart

Create a waterfall chart showing how components add up (or subtract) to a final total.

DATA: [e.g., "Revenue $100M → Cost of Goods -$35M → Operating Expenses -$25M → Tax -$8M → Net Profit $32M"]
STORY: [e.g., "Operating expenses are the biggest drag — nearly as much as COGS"]

Produce:
1. Starting bar (total/gross) in neutral gray
2. Positive additions in GREEN (#0B6E4F)
3. Negative subtractions in RED (#EF4444)
4. Final total bar in DARK (#1E293B)
5. Connecting lines between bars showing cumulative level
6. Value labels on each segment showing the delta amount
7. Data as CSV: Step Name, Value, Type (start/increase/decrease/total)
```

---

## 3. Parts of a Whole

### 3A. Donut Chart

**When to use:** 2-5 segments showing composition. Always use donut over pie — the center space can hold a label or total.

**Real-world examples:** Market share, survey response split, budget allocation, device usage breakdown.

**Flourish template:** Donut chart

```
PROMPT — Donut Chart

Create a donut chart specification. Max 5 segments.

DATA: [e.g., "AI budget allocation: Model Training 40%, Data Prep 25%, Infrastructure 20%, Talent 10%, Other 5%"]
STORY: [e.g., "Training costs dominate — but data prep is a hidden 25%"]

Produce:
1. Segments ordered LARGEST to smallest (clockwise from 12 o'clock)
2. Max 5 segments — merge the rest into "Other" in gray
3. Center label: total value or key metric (e.g., "$2.4M Total")
4. Direct labels on each segment: Category + percentage
5. Color: primary segment in BCG green, secondary in teal, rest in graduating grays
6. NO legend box — direct labels only

RULES:
- Never use a pie chart — always donut
- Never use for more than 5 segments
- Never use for time series data
- Never use when segments are nearly equal (use bar chart instead)
```

---

### 3B. Stacked Bar Chart

**When to use:** Composition across multiple groups. Shows both the individual segments AND the group total.

**Real-world examples:** Revenue by product line per region, employee composition by department, survey responses across segments.

**Flourish template:** Bar chart (stacked)

```
PROMPT — Stacked Bar Chart

Create a stacked bar chart showing composition across groups.

DATA: [e.g., "AI workforce by role across 4 companies: Engineers, Researchers, Product, Operations"]
STORY: [e.g., "Company A is engineering-heavy while Company D has the most balanced team"]

Produce:
1. Each bar = one group, segments = categories within
2. Consistent color per category across all bars
3. Segment labels inside bars (if wide enough) or tooltip spec
4. Total label at the end of each bar
5. Data as CSV: Group, Category1, Category2, Category3, ...
6. Order segments consistently: largest category on bottom
```

---

### 3C. Treemap

**When to use:** Many categories (6+) with sub-categories. Great for showing hierarchical part-of-whole relationships where rectangles are sized proportionally.

**Real-world examples:** Market cap by sector and company, file storage usage, content library by topic.

**Flourish template:** Hierarchy (treemap)

**Data structure:** One column per hierarchy level + a size column.

```
PROMPT — Treemap

Create a treemap specification for hierarchical data.

DATA: [e.g., "AI tool market by category (Chatbots, Code Assistants, Image Gen, etc.) and sub-category (specific tools)"]
STORY: [e.g., "Chatbots dominate the market but code assistants are the fastest-growing niche"]

Produce:
1. Data with hierarchy columns: Level 1 (category), Level 2 (sub-category), Size (value)
2. Color by Level 1 category
3. Label rules: Level 1 always visible, Level 2 only when rectangle is large enough
4. Interactive: click to zoom into a category
5. Tooltip: full name + value + percentage of total
```

---

### 3D. Sunburst Chart

**When to use:** Same as treemap but in circular format. Better for showing parent-child relationships and drilling down levels. More visually striking for presentations.

**Real-world examples:** Organization structure, content taxonomy, budget hierarchy.

**Flourish template:** Hierarchy (sunburst)

```
PROMPT — Sunburst Chart

Create a sunburst chart for hierarchical data.

DATA: [e.g., "Company org chart: Division → Department → Team with headcount"]
STORY: [e.g., "Engineering is 45% of the company, with ML alone being 20%"]

Produce:
1. Inner ring = top-level categories
2. Outer rings = sub-categories
3. Size by value column
4. Click-to-zoom interaction spec
5. Data as CSV: Level1, Level2, Level3, Value
```

---

### 3E. Packed Circles

**When to use:** Hierarchical data where you want to emphasize relative sizes using nested circles. More organic feel than treemap.

**Real-world examples:** Startup ecosystem by category, research paper clusters, investment portfolio.

**Flourish template:** Hierarchy (packed circles)

```
PROMPT — Packed Circles

Create a packed circles (circular treemap) visualization.

DATA: [e.g., "VC investments by sector → subsector → company, sized by funding amount"]
STORY: [e.g., "AI/ML dominates VC, but within it, enterprise SaaS companies get 3x more than consumer AI"]

Produce:
1. Outer circles = categories, inner circles = items
2. Size proportional to value
3. Color by top-level category
4. Label only circles above a minimum size threshold
5. Data as CSV: Category, Subcategory, Name, Value
```

---

## 4. Correlation

### 4A. Scatter Plot

**When to use:** Showing relationship between exactly 2 variables. ONLY use when you're genuinely showing correlation, not just comparing categories.

**Real-world examples:** Revenue vs employee count, ad spend vs conversions, education level vs income.

**Flourish template:** Scatter plot (with filters, time slider)

```
PROMPT — Scatter Plot

Create a scatter plot showing the relationship between two variables.

DATA: [e.g., "50 startups: X = monthly ad spend ($), Y = monthly signups, Color = industry"]
STORY: [e.g., "Ad spend correlates with signups up to $50K, then shows diminishing returns"]

Produce:
1. X-axis: [independent variable] with clear units
2. Y-axis: [dependent variable] with clear units
3. Trend line: linear regression with R-squared value
4. Color by category (max 5 categories + gray "Other")
5. Outlier annotations: label the 2-3 most notable outliers
6. Source citation with sample size (n=)
7. Data as CSV: Name, X_Value, Y_Value, Category

RULES:
- Never connect dots with lines (that's a line chart)
- Always show both axes starting at logical minimums
- If no visible correlation exists, say so — don't force a narrative
```

---

### 4B. Bubble Chart

**When to use:** Like scatter but with a 3rd variable mapped to circle SIZE. Shows x, y, and magnitude simultaneously.

**Real-world examples:** Countries: GDP per capita (x) vs life expectancy (y) vs population (size). Companies: revenue (x) vs growth rate (y) vs market cap (size).

**Flourish template:** Scatter (with size binding)

```
PROMPT — Bubble Chart

Create a bubble chart showing 3 variables simultaneously.

DATA: [e.g., "30 countries: X = CO2 per capita, Y = GDP per capita, Size = population, Color = income group"]
STORY: [e.g., "High-income countries emit the most per capita — emissions are a function of affluence"]

Produce:
1. X-axis: [variable 1]
2. Y-axis: [variable 2]
3. Bubble size: [variable 3] with size legend
4. Bubble color: [category] — max 4 colors
5. Label the 5-8 largest or most notable bubbles directly
6. Use logarithmic scale if data spans multiple orders of magnitude
7. Data as CSV: Name, X, Y, Size, Category
```

---

## 5. Ranking

### 5A. Sorted Horizontal Bar

**When to use:** The DEFAULT chart for showing rankings. Always sorted highest to lowest. Simple, clear, effective.

(Same prompt as 2A — Horizontal Bar Chart. The sort order IS what makes it a ranking chart.)

---

### 5B. Bump Chart

**When to use:** Rank changes for a small number of items (5-10) across a small number of time periods (4-8). Shows who overtook whom.

**Real-world examples:** Brand rankings over quarters, app store position changes, league standings.

```
PROMPT — Bump Chart

Create a bump chart showing rank changes over time.

DATA: [e.g., "Top 8 AI companies by market cap, ranked quarterly Q1 2024 to Q4 2025"]
STORY: [e.g., "NVIDIA went from #5 to #1 while Meta quietly climbed from #7 to #3"]

Produce:
1. Y-axis: Rank (1 at top, inverted)
2. X-axis: Time periods
3. Lines connecting each entity's rank across periods
4. Color: highlight the 2-3 biggest movers, gray for the rest
5. Direct labels at start and end of each line
6. Data as CSV: Name, Period1_Rank, Period2_Rank, ...
```

---

## 6. Distribution

### 6A. Histogram

**When to use:** Showing frequency distribution — how many items fall into each value range. The X-axis is a continuous variable divided into bins.

**Real-world examples:** Startup valuations, employee salary ranges, response time distributions.

```
PROMPT — Histogram

Create a histogram showing the distribution of a continuous variable.

DATA: [e.g., "200 startup valuations ranging from $1M to $500M"]
STORY: [e.g., "Most startups cluster in the $5M-$20M range — only 8% exceed $100M"]

Produce:
1. X-axis: value bins (auto-calculate or specify bin width)
2. Y-axis: count or percentage of items in each bin
3. Highlight the peak bin with accent color
4. Add a median line with annotation
5. Optional: overlay a normal distribution curve if useful
6. Data as CSV: Value (raw data — Flourish will bin it)
```

---

### 6B. Population Pyramid

**When to use:** Comparing two distributions side by side (typically male/female, but works for any two-group comparison).

**Real-world examples:** Employee age distribution by gender, customer segments, early-stage vs growth-stage startups.

```
PROMPT — Population Pyramid

Create a population pyramid comparing two groups across a shared scale.

DATA: [e.g., "Employees by age band: Male vs Female counts for age 20-25, 25-30, 30-35, etc."]
STORY: [e.g., "The company has a young male-heavy engineering team and a more balanced senior leadership"]

Produce:
1. Horizontal bars extending LEFT for Group A, RIGHT for Group B
2. Y-axis (center): categories/bins
3. Symmetric X-axes on both sides
4. Color: distinct colors per group
5. Data as CSV: Category, Group_A_Value, Group_B_Value
```

---

### 6C. Beeswarm Plot

**When to use:** Showing individual data points within a distribution. Each dot is a real entity, giving more detail than a histogram.

**Real-world examples:** Individual startup funding amounts, employee performance scores, city quality-of-life ratings.

```
PROMPT — Beeswarm Plot

Create a beeswarm plot showing individual data points in a distribution.

DATA: [e.g., "150 companies: each with an AI maturity score (1-100), colored by industry"]
STORY: [e.g., "Tech companies cluster around 70-85, while manufacturing spreads widely from 20-60"]

Produce:
1. X-axis: the measured value
2. Dots jittered vertically to avoid overlap
3. Color by category (max 5)
4. Median line per category with label
5. Interactive: hover to see individual entity name + value
```

---

## 7. Flows & Relationships

### 7A. Sankey Diagram

**When to use:** Showing volume/flow between stages or categories. Width of the flow represents quantity. Best for 3-5 stages.

**Real-world examples:** User journey (visit > signup > trial > paid > churned), revenue sources to cost categories, supply chain flows.

**Flourish template:** Sankey diagram

```
PROMPT — Sankey Diagram

Create a Sankey diagram showing flows between stages.

DATA: [e.g., "Website visitor journey: 10K visitors → 3K signups → 800 trials → 200 paid → 50 enterprise"]
STORY: [e.g., "The biggest drop-off is signup to trial — 73% of signups never start a trial"]

Produce:
1. Nodes (stages) on the left flowing to nodes on the right
2. Flow width proportional to volume
3. Color flows by destination category OR by source
4. Label each node with name + total volume
5. Highlight the biggest drop-off flow in red
6. Data as CSV: Source, Target, Value

RULES:
- Max 5 stages (source to sink)
- Max 15 flows total (or it becomes unreadable)
- Flows should go left-to-right (no circular flows)
```

---

### 7B. Network Diagram

**When to use:** Showing connections between entities. Not about flow volume — about who connects to whom.

**Real-world examples:** Team collaboration maps, tool integration ecosystems, API dependency graphs.

**Flourish template:** Network diagram

```
PROMPT — Network Diagram

Create a network diagram showing connections between entities.

DATA: [e.g., "20 SaaS tools and their integrations with each other"]
STORY: [e.g., "Slack and Salesforce are the most connected hubs in the modern SaaS stack"]

Produce:
1. Nodes: entities (sized by number of connections)
2. Edges: connections between them (weighted by strength if applicable)
3. Color nodes by category
4. Label the top 5 most-connected nodes
5. Data as two CSVs:
   - Nodes: ID, Name, Category, Size
   - Edges: Source_ID, Target_ID, Weight
```

---

### 7C. Chord Diagram

**When to use:** Bi-directional flows between groups. Shows both direction and volume of connections in a circular layout.

**Real-world examples:** Trade flows between countries, data exchange between departments, user migration between platforms.

```
PROMPT — Chord Diagram

Create a chord diagram showing bi-directional flows.

DATA: [e.g., "Employee transfers between 6 departments over the past year"]
STORY: [e.g., "Engineering exports the most talent — mostly to Product and Data Science"]

Produce:
1. Arcs around the circle = groups
2. Chords connecting arcs = flows (width = volume)
3. Color by source group
4. Interactive: hover on arc to see all flows from that group
5. Data as a matrix: rows = sources, columns = destinations, cells = volume
```

---

## 8. Spatial

### 8A. Choropleth Map

**When to use:** Geographic data where the value varies by region. Color intensity represents the data value. ONLY use when geography IS the story.

**Real-world examples:** AI adoption by country, election results by state, GDP per capita by region.

**Flourish template:** Projection Map

```
PROMPT — Choropleth Map

Create a choropleth map specification.

DATA: [e.g., "AI readiness index by country, 0-100 scale, for 50 countries"]
STORY: [e.g., "North America and Northern Europe lead, but Southeast Asia is the surprise emerging region"]

Produce:
1. Geographic boundary: [World / US States / Europe / etc.]
2. Color scale: sequential (light to dark) for single metric, diverging for above/below average
3. Legend with 5 color bins (not continuous gradient)
4. Tooltip: country name + exact value + rank
5. Data as CSV: Region_Name (or ISO code), Value

RULE: If you're just comparing 5-10 regions by a number, use a horizontal bar chart instead. Maps are ONLY for when spatial patterns matter.
```

---

### 8B. Proportional Symbol Map

**When to use:** Showing absolute values at specific locations. Circle size = data value. Better than choropleth for point data.

**Real-world examples:** Startup density by city, earthquake magnitudes, store locations with revenue.

```
PROMPT — Proportional Symbol Map

Create a proportional symbol map with circles sized by value.

DATA: [e.g., "Number of AI startups in 30 cities worldwide"]
STORY: [e.g., "San Francisco and Beijing dominate, but London and Bangalore are closing the gap"]

Produce:
1. Base map with minimal styling (no distracting terrain)
2. Circles at each location, area proportional to value
3. Color by category if applicable (e.g., continent)
4. Label the top 5 cities directly on map
5. Data as CSV: City, Latitude, Longitude, Value, Category
```

---

## 9. Deviation

### 9A. Gauge Chart

**When to use:** A SINGLE metric on a scale. Like a speedometer — shows where you stand relative to a target or range.

**Real-world examples:** NPS score, fundraiser progress, performance rating, completion percentage.

```
PROMPT — Gauge Chart

Create a gauge chart for a single KPI.

DATA: [e.g., "Current NPS score: 72 out of 100"]
STORY: [e.g., "We're in the 'good' range but 8 points below our target of 80"]

Produce:
1. Semi-circle gauge with color zones:
   - Red zone: 0-40 (poor)
   - Yellow zone: 40-70 (average)
   - Green zone: 70-100 (excellent)
2. Needle/marker at the current value
3. Target marker (dashed line) at goal value
4. Large center number showing current value
5. Label: metric name + current value + target

RULE: Never use multiple gauges when you could use a bar chart. Gauges are for ONE number.
```

---

### 9B. Diverging Bar Chart

**When to use:** Positive vs negative values splitting in opposite directions from a center axis. Best for sentiment, agree/disagree, or above/below average.

**Real-world examples:** Survey sentiment (Strongly Agree to Strongly Disagree), profit/loss by product, performance vs benchmark.

**Flourish template:** Diverging bar chart

```
PROMPT — Diverging Bar Chart

Create a diverging bar chart showing positive/negative values from a center axis.

DATA: [e.g., "Employee satisfaction survey: 10 questions, responses from Strongly Disagree to Strongly Agree"]
STORY: [e.g., "Compensation and work-life balance are the biggest pain points; mission and team score well"]

Produce:
1. Center axis at zero (or neutral midpoint)
2. Positive values extend RIGHT in green
3. Negative values extend LEFT in red/orange
4. Categories sorted by NET score (most positive at top)
5. Segment labels: show percentage in each segment
6. Data as CSV: Category, Strongly_Disagree, Disagree, Neutral, Agree, Strongly_Agree
```

---

### 9C. Surplus/Deficit Line

**When to use:** Showing values above or below a reference/baseline over time. The shading between the line and the baseline tells the story.

**Real-world examples:** Revenue vs budget, temperature vs historical average, actual vs forecast.

```
PROMPT — Surplus/Deficit Chart

Create a surplus/deficit filled line chart.

DATA: [e.g., "Monthly revenue vs budget, Jan-Dec 2025"]
STORY: [e.g., "Q1 was under budget, but Q3-Q4 exceeded targets by 15%+"]

Produce:
1. X-axis: time
2. Reference line: baseline/target (dashed, gray)
3. Actual line: solid
4. Fill ABOVE baseline in green (surplus)
5. Fill BELOW baseline in red (deficit)
6. Annotate key crossover points
7. Data as CSV: Date, Actual, Target
```

---

## 10. Hierarchy & Structure (Bonus)

### 10A. Radial Tree

**When to use:** Hierarchical data displayed in a circular layout radiating from a central root node. Compact and visually striking.

**Real-world examples:** Org chart, taxonomy, file directory structure, decision tree.

**Flourish template:** Hierarchy (radial tree)

```
PROMPT — Radial Tree

Create a radial tree (dendrogram) showing hierarchical relationships.

DATA: [e.g., "AI tool taxonomy: Category → Subcategory → Tool Name"]
STORY: [e.g., "The AI tool landscape has 6 major branches, with 'Code Assistants' being the deepest"]

Produce:
1. Root node at center
2. Branches radiating outward by level
3. Node size by importance or a data value
4. Color by top-level category
5. Interactive: click to expand/collapse branches
6. Data as CSV: Parent, Child, Value (optional)
```

---

### 10B. Drill-Down Bar Chart

**When to use:** Stacked bars created from row-level data, functioning like a pivot table. Best when total group values matter more than proportions.

```
PROMPT — Drill-Down Bar

Create a drill-down bar chart where clicking a segment reveals its breakdown.

DATA: [e.g., "Sales by region → by product → by rep, with revenue values"]
STORY: [e.g., "APAC is the smallest region but has the highest per-rep revenue"]

Produce:
1. Top-level bars: one per primary group
2. Click interaction: bar splits into sub-segments
3. Breadcrumb navigation: Region > Product > Rep
4. Data as CSV with hierarchy columns: Level1, Level2, Level3, Value
```

---

## AI Workflow Prompts (from Flourish)

These 6 prompts use AI to improve your chart-making process end-to-end.

### W1. Data Discovery

```
I'm creating a data visualization about [TOPIC] for [AUDIENCE].

I need publicly accessible datasets that include:
- [Variable 1]
- [Variable 2]
- Covering [TIME PERIOD] and [GEOGRAPHY]

Recommend 3-5 trustworthy data sources with:
1. Source name and URL
2. Data format (CSV, API, PDF)
3. Update frequency
4. Sample size / coverage
5. Any licensing restrictions
```

### W2. Pattern Recognition

```
Here is my dataset: [PASTE DATA OR DESCRIBE IT]

Analyze it and identify:
1. The 3 most interesting patterns or trends
2. Any outliers that deserve annotation
3. Historical context that explains any anomalies
4. The single most compelling "headline stat" for a visualization
```

### W3. Data Enrichment

```
I have a dataset with these columns: [LIST COLUMNS]

I need to add:
1. A "Category" column that groups items into [3-5 categories based on CRITERIA]
2. A "Percentile" column showing where each item ranks
3. A "Change" column calculating [year-over-year / month-over-month] delta

Return the enriched dataset as a CSV.
```

### W4. Chart Type Selection

```
My data: [DESCRIBE DATA]
My story: [WHAT INSIGHT]
My audience: [WHO]
My channel: [Website embed / Presentation / Social media / Print]

Using the 9-category framework (Change Over Time, Magnitude, Parts of a Whole, Correlation, Ranking, Distribution, Flows, Spatial, Deviation):

1. Recommend the PRIMARY chart type with rationale
2. Suggest a SECONDARY alternative
3. Name one ANTI-PATTERN to avoid and why
4. Specify the Flourish template to use
5. Describe the ideal animation/interaction
```

### W5. Data Formatting

```
I need to transform this data for a [CHART TYPE] in Flourish.

Current format:
[PASTE CURRENT DATA STRUCTURE]

Required format:
- Rows represent: [WHAT]
- Columns represent: [WHAT]
- Values are: [WHAT]

Pivot/restructure the data and return as a clean CSV.
```

### W6. Design Critique

```
Review this chart specification and suggest improvements:

Chart type: [TYPE]
Data: [DESCRIBE]
Current design: [DESCRIBE COLORS, LABELS, LAYOUT]

Check for:
1. Is this the right chart type for this data?
2. Are axes properly labeled and scaled (starting at 0)?
3. Are colors accessible (colorblind-safe)?
4. Are labels direct (not relying on a legend)?
5. Is there a clear headline that tells the story (not describes the chart)?
6. Is the source cited with year and sample size?
7. Is there any chart junk to remove (gridlines, borders, 3D, shadows)?

Return: PASS or specific fixes for each issue.
```

---

## Anti-Pattern Quick Reference

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Pie chart with 6+ segments | Angles impossible to compare | Horizontal bar chart |
| Unsorted bar chart | Reader can't find the ranking | Sort highest to lowest |
| Line chart without time axis | Implies continuity that doesn't exist | Use bar chart |
| 3D chart (any kind) | Distorts proportions | Use 2D — always |
| Dual Y-axis | Scales can be manipulated to lie | Two separate charts |
| Map when geography isn't the point | Forces reader to know geography | Use bar chart with labels |
| Y-axis not starting at 0 | Exaggerates small differences | Start at 0 or label the break |
| 8+ colors | Visual noise, impossible to distinguish | Max 5 colors + gray "Other" |
| Legend box instead of direct labels | Forces eyes to jump back and forth | Label directly on chart |
| No source citation | Destroys credibility | Always: source name, year, n= |

---

## File Cross-References

| Document | Path | Purpose |
|----------|------|---------|
| Chart Type Selector | `../style-guide/20-chart-type-selector.md` | Decision engine + Flourish template picker |
| Charts Image Index | `index-charts.md` | 39 reference images scored and classified |
| Style Guide | `../style-guide/README.md` | Overall design system (70% charts, 20% captions, 10% text) |
