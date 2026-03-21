# Plan: Slides 2, 3, and 5–7 (Scaling Gap, Executive Summary, Sector Deep Dives)

## Context

Building 5 slides for the AI Adoption video. Slides 1 (Hero) and 4 (Rankings) are done. The remaining gaps:
- Slide 2: "The Scaling Gap" (frames 240–540, 300f / 10s)
- Slide 3: "Executive Summary" (frames 540–840, 300f / 10s)
- Slides 5–7: "Sector Intelligence Deep Dives" (frames 1200–2040, 840f total)

All slides follow the established design system: warm cream bg (`#F4F1ED`), dark card (`#0F2418`), split layout, Georgia serif + system-ui sans, editorial reveal animations, no-bounce springs.

---

## Slide 2: ScalingGapSlide.tsx (300 frames)

### Scene 1: Intro Title Card (0–90)
- Centered: "THE SCALING GAP" label + "The Scaling Gap" (110px serif) + italic subtitle "Perception vs. Reality"
- Same pattern as HeroSlide/Rankings IntroScene
- Exit fade at frame 78–90

### Scene 2: Data (90–300)
Split layout — editorial text left, dark card right.

**Left Panel:**
- Label: `THE SCALING GAP · 2024–2025`
- Headline: "What Executives / *Say vs. Do*" (64px serif, italic accent)
- Accent line (spring, damping 200)
- Description: gap between perception and reality
- Callout: BCG quote italic

**Right Panel (dark card):**
- Card header: "PERCEPTION VS. REALITY"
- **Two GapBar comparisons** (the hero element):
  - Row 1: "Met expectations" 80% bar (blue) vs "No tangible returns" 74% bar (red/amber)
  - Row 2: "Increased usage" 92% bar (blue) vs "Bottom-line impact" 39% bar (red/amber)
  - Gap between bars highlighted with amber connector/label showing the delta
- **Divider**
- **10/20/70 Stacked Bar:**
  - Three segments: Algorithms 10% (gray `#6B7280`), Technology 20% (blue `#4B7BE5`), People & Process 70% (amber `#F5A623`, glow pulse)
  - Labels below each segment
  - "WHERE VALUE LIVES" callout on the 70% segment
- Bottom: BCG quote fade-in

**Animation Timeline (Scene 2, relative frames):**
| Frames | What |
|--------|------|
| 0–12 | Scene entry fade |
| 5–15 | Left panel label + title reveal |
| 15–80 | Two gap bars animate sequentially (each bar 24f, stagger 30f) |
| 80–90 | Gap bars complete, divider appears |
| 90–150 | Stacked bar segments grow sequentially (10% → 20% → 70%) |
| 140–160 | 70% segment glow pulse + "WHERE VALUE LIVES" label |
| 170–195 | BCG quote fades in |
| 195–210 | Hold |

**GapBar Component:**
- Two bars side by side (or stacked with "vs" separator)
- Left bar (blue, "Says"): grows to its value
- Right bar (amber/red, "Shows"): grows to its value
- Delta label appears between them showing the gap
- Count-up percentages

---

## Slide 3: ExecutiveSummarySlide.tsx (300 frames)

### Scene 1: Intro Title Card (0–90)
- Centered: "EXECUTIVE SUMMARY" label + "Four Key Insights" (110px serif) + italic subtitle
- Exit fade

### Scene 2: Data (90–300)
**Layout:** 2×2 grid of insight cards on warm cream background (no split layout — cards ARE the hero)

**4 Insight Cards:**
| # | Stat | Title | Detail | Color accent |
|---|------|-------|--------|------|
| 01 | 72% | Tipping Point Crossed | 65% Gen AI in 10 months | accent green |
| 02 | 74% | Can't Scale Past Pilots | No tangible financial returns | amber/red |
| 03 | 1.5× | Leaders Pulling Away | 1.6× shareholder returns | accent green |
| 04 | 31% | Manufacturing Upside | 4–8% adoption, 31% productivity | blue |

**Card Design:**
- Dark card background (`#0F2418`)
- Large stat number (72px, white, bold)
- Card title (20px, white, semibold)
- Detail line (14px, whiteMuted)
- Left accent bar (4px wide, card's color)
- Shadow depth matching Rankings card style

**Bottom:** Closing quote: *"The companies seeing 1.5× revenue growth aren't buying better tools — they're redesigning how work gets done."*

**Animation Timeline (Scene 2, relative frames):**
| Frames | What |
|--------|------|
| 0–12 | Scene entry fade |
| 5–15 | Section title "4 KEY INSIGHTS" fades in |
| 20–50 | Card 1 slides in from bottom-left (spring, damping 200) |
| 50–80 | Card 2 slides in |
| 80–110 | Card 3 slides in (green accent) |
| 110–140 | Card 4 slides in |
| 140–170 | Stat numbers count up across all cards |
| 170–195 | Quote fades in below cards |
| 195–210 | Hold |

---

## Slides 5–7: SectorDeepDiveSlide.tsx (280 frames each)

### Architecture
One **reusable component** with props, instantiated 3 times:

```tsx
interface SectorDeepDiveProps {
  slideIndex: number; // 0, 1, 2
  left: SectorData;
  right: SectorData;
  insight: string;
}

interface SectorData {
  name: string;
  adoption: number;
  color: string;
  bullets: string[];     // 3 "What AI Does" lines
  example: string;       // Real example (italic)
  metrics: { value: string; label: string }[]; // 3 impact metrics
}
```

### Layout (all 3 slides share)
```
┌──────────────────────────────────────────────┐
│  SECTOR INTELLIGENCE · DEEP DIVES            │
│  What AI Looks Like Inside Each Sector       │
│                                              │
│  ┌─────────────┐    ┌─────────────┐          │
│  │ 88%         │    │ 75%         │          │
│  │ Technology  │    │ Financial   │          │
│  │ · Writes    │    │ · Fraud     │          │
│  │ · Resolves  │    │ · Contract  │          │
│  │ · Runs      │    │ · Risk      │          │
│  │ "Atlassian" │    │ "Mastercard"│          │
│  │ 88% 39% 3× │    │ 75% 50% #2 │          │
│  └─────────────┘    └─────────────┘          │
│                                              │
│  "Adoption does not equal impact."           │
└──────────────────────────────────────────────┘
```

### Sector Card Design (dark card)
- Top: Large adoption % (80px, bold, white)
- Sector name (28px, semibold, white)
- Subtle divider
- "What AI Does" label (11px, muted uppercase)
- 3 bullet lines (16px, whiteMuted)
- Subtle divider
- Example line (15px, italic, whiteMuted)
- Subtle divider
- 3 impact metrics in a row (StatItem pattern: value large, label small)
- Left color accent bar (4px, sector color)
- Card shadow matching Rankings

### No IntroScene (maximize data time at 280f)
Instead: Section title at top fades in first, then cards animate.

### Animation Timeline (per slide, 280 frames)
| Frames | What |
|--------|------|
| 0–12 | Scene entry fade |
| 5–15 | Section title + subtitle fade in |
| 15–50 | Left sector card slides in from left (spring) |
| 40–75 | Right sector card slides in from right (spring) |
| 75–120 | Metric values count up in both cards |
| 120–140 | Bottom insight line fades in |
| 240–280 | Exit fade (last 1.3s) for transition to next |

### 3 Slide Instances

**Slide 5 (1200–1480): Tech vs Finance**
- Left: Technology & SaaS (88%, green `#3D9A5F`)
  - Bullets: Writes code, Resolves IT tickets, Runs predictive systems at scale
  - Example: "Atlassian auto-resolves 20% of Jira tickets before engineers see them."
  - Metrics: 88% regular use, 39% EBIT impact, 3× agent scaling
- Right: Financial Services (75%, teal `#2D8B7E`)
  - Bullets: Fraud detection in milliseconds, Contract analysis, Risk modeling
  - Example: "Mastercard prevented $20B in fraud using real-time AI scoring."
  - Metrics: 75% large firms, 50% faster resolution, #2 highest adopter
- Insight: *"Adoption does not equal impact. Manufacturing at 40% shows 31% productivity gains — outperforming many tech companies at 88%."*

**Slide 6 (1480–1760): Healthcare vs Retail**
- Left: Healthcare (55%, blue `#4B7BE5`)
  - Bullets: Diagnostic imaging, Clinical trial matching, Predictive patient risk
  - Example: "Mayo Clinic detects heart disease from ECG with 93% accuracy."
  - Metrics: 80%+ testing AI, 25% cost reduction, -90% maintenance time
- Right: Retail & E-commerce (50%, purple `#5B5BD6`)
  - Bullets: Personalization, Inventory prediction, AI-powered search
  - Example: "Amazon's recommendation engine drives 35% of total sales."
  - Metrics: +15% revenue, +15% conversion, 53% AI search
- Insight: *"Healthcare is where AI saves lives. Retail is where AI saves margins."*

**Slide 7 (1760–2040): Manufacturing vs Logistics**
- Left: Manufacturing (40%, amber `#F5A623`)
  - Bullets: Predictive maintenance, Digital twins, Quality inspection
  - Example: "European automaker saved €190M by predicting failures 3 weeks early."
  - Metrics: +31% productivity, €190M savings, 77% implementation
- Right: Logistics & Supply Chain (31%, cyan `#22B8C4`)
  - Bullets: Route optimization, Demand forecasting, Autonomous driving
  - Example: "UPS saves 100M miles annually using AI routing."
  - Metrics: -60% inspection time, -20–30% errors, 150K+ autonomous rides
- Insight: *"The biggest ROI isn't where adoption is highest — it's where workflows changed most."*

---

## Reusable Patterns (from existing slides)

All from `HeroSlide.tsx` and `IndustryRankingsSlide.tsx`:
- `T` tokens object (same bg/card/text colors)
- `SERIF` / `SANS` font stacks
- `CLAMP` extrapolation config
- `reveal(frame, delay, distance)` — fade-up animation
- `darken(hex, amount)` — gradient bar fills
- `spring({ damping: 200 })` — no-bounce editorial spring
- `Easing.out(Easing.cubic)` — bar growth easing
- `StatItem` component pattern (value + label)
- IntroScene pattern (label → title → italic subtitle → accent line → exit fade)
- Dark card with `boxShadow: '0 20px 60px rgba(0,0,0,0.25)...'`

Each new file will redeclare `T`, `SERIF`, `SANS`, `CLAMP`, `reveal()`, `darken()` locally (same pattern as Rankings — no shared module yet).

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `packages/remotion/src/compositions/AIAdoption/ScalingGapSlide.tsx` | **Create** |
| `packages/remotion/src/compositions/AIAdoption/ExecutiveSummarySlide.tsx` | **Create** |
| `packages/remotion/src/compositions/AIAdoption/SectorDeepDiveSlide.tsx` | **Create** — reusable component |
| `packages/remotion/src/compositions/AIAdoption/index.tsx` | **Edit** — wire all 5 new Sequences |
| `packages/remotion/src/Root.tsx` | **Edit** — add standalone Compositions for preview |

---

## Build Order

1. **ScalingGapSlide.tsx** → render still + MP4 → verify
2. **ExecutiveSummarySlide.tsx** → render still + MP4 → verify
3. **SectorDeepDiveSlide.tsx** → render 3 instances → verify each
4. Wire into index.tsx + Root.tsx
5. Render full AIAdoption video

## Verification

```bash
# Individual slides
npx remotion render src/index.ts AIAdoption-ScalingGap out/scaling-gap.mp4 --log=error
npx remotion render src/index.ts AIAdoption-ExecSummary out/exec-summary.mp4 --log=error
npx remotion render src/index.ts AIAdoption-DeepDive1 out/deep-dive-1.mp4 --log=error
npx remotion render src/index.ts AIAdoption-DeepDive2 out/deep-dive-2.mp4 --log=error
npx remotion render src/index.ts AIAdoption-DeepDive3 out/deep-dive-3.mp4 --log=error

# Full video
npx remotion render src/index.ts AIAdoption out/aiadoption-full.mp4 --log=error
```
