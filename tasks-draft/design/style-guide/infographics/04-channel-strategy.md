# Infographic Channel Strategy — StartupAI Content Distribution

> One infographic article → 8 channel formats. Build once, distribute everywhere.

---

## THE CONTENT CASCADE

Every infographic article starts as ONE source and cascades into multiple channel-specific formats:

```
INFOGRAPHIC ARTICLE (source)
│
├─→ Website: Interactive Flourish embeds (full animation)
├─→ Blog: Static screenshots + Flourish embed links
├─→ LinkedIn: 10-slide static carousel (1080×1350px)
├─→ Twitter/X: 1–2 hero stat images + thread
├─→ Instagram: Carousel (1080×1350px) + Reel (1080×1920px)
├─→ YouTube: Animated infographic video (60–120s)
├─→ Email: Hero stat PNG + "see interactive version" link
├─→ Pitch deck: 1–2 key chart screenshots per slide
└─→ PDF report: High-res static exports (300dpi)
```

---

## CHANNEL SPECIFICATIONS

### 1. Website (Blog Article — Primary)

| Spec | Value |
|------|-------|
| Format | Interactive Flourish embeds in HTML |
| Animation | Full — counters, bar grow, gauge sweep, scroll-reveal |
| Embed method | Flourish script embed (responsive) |
| Infographic count | 6–10 per article (one per section) |
| Load strategy | Lazy-load — animate when scrolled into viewport |
| Engagement target | 62% higher dwell time vs text-only (Flourish data) |
| Fallback | Static PNG for users with JS disabled |

**Production workflow**:
1. Build each chart in Flourish → customize colors to StartupAI palette
2. Create Flourish Story for the full article (optional scrollytelling)
3. Generate script embed codes
4. Place embeds in blog CMS with `loading="lazy"`
5. Add source citations below each embed

---

### 2. LinkedIn Carousel

| Spec | Value |
|------|-------|
| Format | PDF or image carousel (10 slides max) |
| Dimensions | 1080×1350px per slide (4:5 ratio) |
| Animation | None — static images only |
| File type | PNG or PDF |
| Text | Large (min 24px), readable at mobile size |

**Slide structure** (10 slides from 6-section article):

| Slide | Content | Visual Source |
|-------|---------|-------------|
| 1 | Title + hook stat | KPI tile |
| 2 | "Here's what [N] startups found" | Source credibility card |
| 3 | Where AI helps most (top 3 bars) | Horizontal bar chart |
| 4 | #1 use case deep dive | Icon card |
| 5 | #2 use case deep dive | Icon card |
| 6 | "Am I normal?" benchmark | Scale or gauge |
| 7 | Why AI fails (top 3 blockers) | Blocker bars |
| 8 | Root cause pattern | Mini flowchart |
| 9 | What founders do next (momentum) | KPI + arrow |
| 10 | Your next step + CTA | Action checklist |

**Production workflow**:
1. Screenshot each Flourish chart at 2× resolution
2. Import to Figma using carousel template (1080×1350px frames)
3. Add slide numbers, StartupAI branding, source lines
4. Export as PNG set or single PDF
5. Post with 1-paragraph text + 3–5 hashtags

---

### 3. Twitter/X

| Spec | Value |
|------|-------|
| Format | 1–4 images OR animated GIF |
| Dimensions | 1200×675px (16:9) for single image, 1200×1200px for grid |
| Animation | GIF only (auto-loops, max 5MB) |
| Text | Thread format: hook tweet + 3–5 follow-up tweets |

**Thread structure**:
- Tweet 1: Hook stat image + "🧵 Thread: [Title]" (the hero KPI tile)
- Tweet 2: Where AI works (bar chart screenshot)
- Tweet 3: Why AI fails (blocker chart)
- Tweet 4: What to do next (checklist)
- Tweet 5: CTA — link to full interactive article

**Production workflow**:
1. Export hero stat as 1200×675px PNG from Figma
2. Optional: Screen-record Flourish gauge animation as GIF (< 5MB)
3. Write thread with each tweet matching one section
4. Schedule with image per tweet

---

### 4. Instagram

| Spec | Value |
|------|-------|
| Carousel | 1080×1350px slides (same as LinkedIn) |
| Reel | 1080×1920px vertical video (30–90 seconds) |
| Stories | 1080×1920px static or video (15s per story) |
| Animation | Reel = full animation; Carousel/Stories = static |

**Reel production** (for animated infographic video):
1. Screen-record Flourish visualizations (racing bars, gauge animations)
2. Edit in CapCut: transitions between sections, add captions
3. Structure: Hook (3s) → Key stat (5s) → Top chart (10s) → Insight (10s) → CTA (5s)
4. Add trending audio (optional, low volume)
5. Export 1080×1920px, < 90 seconds

---

### 5. YouTube (Animated Infographic Video)

| Spec | Value |
|------|-------|
| Format | Horizontal video (1920×1080px) |
| Duration | 60–180 seconds |
| Animation | Full — all chart animations, narration optional |
| Style | Screen recording of Flourish + After Effects polish |

**Video structure** (maps to 6-section article):

| Timestamp | Section | Visual |
|-----------|---------|--------|
| 0:00–0:10 | Hook | KPI tiles animate in (counter rollup) |
| 0:10–0:25 | Where it works | Bars grow sequentially |
| 0:25–0:45 | What to use | Icon cards fade in (2×2 grid) |
| 0:45–1:00 | Am I normal? | Gauge needle sweeps |
| 1:00–1:20 | Why it fails | Blocker bars + flowchart draws |
| 1:20–1:40 | What's next | Racing bar chart (momentum) |
| 1:40–1:50 | CTA | Checklist card + subscribe prompt |

**Production workflow**:
1. Build all charts in Flourish with animation
2. Screen-record each at 60fps (OBS or similar)
3. Import clips to After Effects or DaVinci Resolve
4. Add transitions (cross-dissolve, 0.5s between sections)
5. Add title cards for each section
6. Optional: voiceover narration
7. Export 1920×1080px, H.264, < 100MB

---

### 6. Email Newsletter

| Spec | Value |
|------|-------|
| Format | Static PNG hero image + HTML text |
| Image dimensions | 600×400px (email-safe) |
| Animation | None — email clients block JavaScript |
| CTA | "See the interactive version →" link to website |

**Email structure**:
1. Subject line: uses the hook stat (e.g., "72% of founders reduced CAC with AI")
2. Hero image: single KPI tile or gauge screenshot
3. 3-sentence summary of key finding
4. Button: "Explore the full interactive infographic →"
5. Footer: source citation

**Production workflow**:
1. Export hero stat from Flourish at 600×400px PNG
2. Write 3-sentence summary (no more)
3. Link to full website article
4. Test across email clients (Gmail, Outlook, Apple Mail)

---

### 7. Pitch Deck / Investor Update

| Spec | Value |
|------|-------|
| Format | Static screenshot embedded in slide |
| Dimensions | 1920×1080px (standard 16:9 slide) |
| Animation | Slide build only (PowerPoint/Keynote animations) |
| Charts per slide | 1 maximum — clean and focused |

**Production workflow**:
1. Screenshot key charts from Flourish at 2× resolution
2. Place one chart per slide with clean white background
3. Add annotation callout (what the investor should see)
4. Speaker notes: link to full Flourish interactive version
5. Build animation: chart appears first, annotation appears second

---

### 8. PDF Report

| Spec | Value |
|------|-------|
| Format | High-res static charts in PDF layout |
| Resolution | 300dpi minimum (SVG preferred) |
| Charts per page | 2–3 maximum for readability |
| Animation | None |

**Production workflow**:
1. Export Flourish charts as SVG or high-res PNG
2. Place in InDesign, Figma, or Word document
3. Add consistent headers, page numbers, source citations
4. Export as PDF/A for archival quality

---

## PRODUCTION EFFICIENCY: ONE ARTICLE → ALL CHANNELS

| Step | Action | Time | Output |
|------|--------|------|--------|
| 1 | Build 6 charts in Flourish | 2–3 hours | Interactive web embeds |
| 2 | Embed in blog article | 30 min | Website version (primary) |
| 3 | Screenshot all charts at 2× | 15 min | High-res PNGs |
| 4 | Import to Figma carousel template | 30 min | LinkedIn + Instagram carousel |
| 5 | Screen-record Flourish animations | 20 min | Raw video clips |
| 6 | Edit video (CapCut/DaVinci) | 45 min | YouTube + Instagram Reel |
| 7 | Export hero stat PNG for email | 5 min | Email newsletter image |
| 8 | Copy key chart to slide template | 10 min | Pitch deck slides |
| **Total** | | **4–5 hours** | **8 channel formats** |

---

## CONTENT CALENDAR TEMPLATE

| Week | Article Topic | Primary Channel | Secondary Channels | Infographic Types Used |
|------|-------------|----------------|-------------------|----------------------|
| 1 | [Topic] | Website + LinkedIn | Twitter, Email | Statistical, Gauge, Bar |
| 2 | [Topic] | Website + YouTube | Instagram Reel, Twitter | Race Chart, Timeline, Flowchart |
| 3 | [Topic] | Website + LinkedIn | Email, Pitch deck | Comparison, Gauge, List |
| 4 | [Topic] | Website + Instagram | LinkedIn, Twitter | Map, Statistical, Interactive |

**Cadence**: 1 infographic article per week → 4 articles/month → 32 channel assets/month

---

## KEY METRICS TO TRACK

| Channel | Primary Metric | Benchmark | Tool |
|---------|---------------|-----------|------|
| Website | Dwell time | 62% higher with dataviz | Google Analytics |
| Website | Scroll depth | 317% more scroll-through | Hotjar / GA4 |
| LinkedIn | Carousel saves + shares | 2× vs text-only posts | LinkedIn Analytics |
| Twitter | Thread read-through rate | 40%+ complete thread | Twitter Analytics |
| YouTube | Average % viewed | 50%+ for < 2min videos | YouTube Studio |
| Email | Click-through rate | 3–5% on "see interactive" CTA | Email platform |
| Instagram | Carousel swipe-through | 60%+ reach slide 5 | Instagram Insights |
