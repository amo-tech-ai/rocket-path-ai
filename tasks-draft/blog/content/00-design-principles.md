# Blog Report Design Principles

> Reference: HubSpot AI in GTM Reports (Pt 1-3)
> Goal: Infographics that are intelligent, interesting, and applicable. Not wordy articles.

---

## The HubSpot Pattern (Copy This)

Every section follows a 5-beat rhythm:

```
1. BIG STAT          → "78%" in huge type, 1 line of context
2. WHY IT MATTERS    → 2-3 sentences max. Plain language.
3. REAL PROOF        → Company name + specific result
4. EXPERT VOICE      → Attributed quote (name, title, company)
5. SO WHAT           → 1 bulleted takeaway the reader can act on
```

This repeats across every section. Never break the pattern.

---

## Visual Rules

### Stats Are Visual, Not Text
- **Big number** (48px+) with 1-line label underneath
- Group 3-4 stats in a horizontal KPI strip
- Never bury a stat inside a paragraph

```
BAD:  "According to research, 78% of organizations now use AI,
       which is up from 55% the previous year."

GOOD: ┌──────────┐  ┌──────────┐  ┌──────────┐
      │   78%    │  │   280×   │  │  $250B+  │
      │ use AI   │  │ cost drop│  │ invested │
      └──────────┘  └──────────┘  └──────────┘
```

### Company Spotlights Are Cards, Not Paragraphs
```
┌─────────────────────────────────────┐
│  🏢 Avis Budget Group               │
│  WhatsApp AI Assistant              │
│                                     │
│  70%  queries handled by AI         │
│  39%  cost reduction in 1 year      │
│                                     │
│  "Meet customers where they are —   │
│   don't make them download an app." │
└─────────────────────────────────────┘
```

### Comparisons Are Side-by-Side, Not Tables
```
┌─────────────┐     ┌─────────────┐
│  AI Leaders │     │  Laggards   │
│             │     │             │
│  1.5× rev  │     │  1.0×       │
│  1.6× stock│     │  1.0×       │
│  1.4× ROIC │     │  1.0×       │
│             │     │             │
│  Redesign   │     │  Bolt-on    │
│  workflows  │     │  AI tools   │
└─────────────┘     └─────────────┘
```

### Process Flows Are Horizontal Steps
```
Discovery ──→ Comparison ──→ Purchase ──→ Loyalty
  54% AI       AI compares    1-tap        AI reorders
  search       50 stores      checkout     automatically
```

### Quotes Break Up Content (Full-Width Cards)
```
┌─────────────────────────────────────────────┐
│  "If startups aren't using AI tools or      │
│   agents, we're less inclined to invest."   │
│                                             │
│   — Adina Tecklu, Khosla Ventures           │
└─────────────────────────────────────────────┘
```

---

## Content Density Rules

| Element | Max Length |
|---------|-----------|
| Section intro | 2-3 sentences |
| Stat context | 1 line under the number |
| Company example | 3-4 lines (card format) |
| Expert quote | 1-2 sentences |
| Takeaway | 1 bullet point |
| Between-section narrative | 1 short paragraph (3-4 lines) |

**If you're writing more than 4 sentences in a row without a visual break, you're being too wordy.**

---

## Self-Identification (HubSpot's Best Trick)

Break data by audience segment so readers find themselves:

```
┌─────────────┬──────────┬──────────┬──────────┐
│             │ Seed     │ Series A │ Series B+│
├─────────────┼──────────┼──────────┼──────────┤
│ Using AI    │ 68%      │ 82%      │ 91%      │
│ AI budget   │ 5-10%    │ 10-15%   │ 20%+     │
│ Top use     │ Content  │ Sales    │ Ops      │
└─────────────┴──────────┴──────────┴──────────┘
```

Do this by industry, company size, role, or region. Readers engage when they see "that's me."

---

## Color & Typography

- **Big stats:** Primary color (brand teal/green), 48-72px
- **Section headers:** Display serif, 32-40px
- **Body text:** Sans-serif, 16-18px, max 65 characters per line
- **Cards:** Subtle border, rounded corners, light background tint
- **Quote cards:** Dark background, light text, full-width
- **Accent color:** Used sparingly for the most important stat per section

---

## What NOT to Do

- No walls of text (max 4 sentences before a visual)
- No stats buried in paragraphs (always pull them out)
- No unnamed examples ("a major retailer" → "Avis")
- No abstract frameworks without company proof ("workflow ownership" → "Cursor built a new editor, not a plugin — $9B")
- No section without at least one visual element (stat card, quote, company card, or comparison)
- No jargon without a plain English translation on first use

---

## Section Template

```tsx
{/* ── Section: [Title] ── */}

{/* 1. KPI Strip — 3-4 big numbers */}
<StatStrip>
  <Stat value="78%" label="use AI" />
  <Stat value="4%" label="see real value" />
  <Stat value="280×" label="cost drop" />
</StatStrip>

{/* 2. Context — 2-3 sentences max */}
<p>Most companies are experimenting with AI. Very few have
figured out how to make money from it. The gap is growing.</p>

{/* 3. Company Card */}
<CompanyCard
  name="Avis Budget Group"
  what="WhatsApp AI assistant"
  stat1={{ value: "70%", label: "queries handled" }}
  stat2={{ value: "39%", label: "cost reduction" }}
/>

{/* 4. Expert Quote */}
<PullQuote
  quote="Scale is hard. AI will change that."
  author="CEO Name"
  company="Company"
/>

{/* 5. Takeaway */}
<Takeaway>
  Top-performing companies redesign workflows before
  adding AI. The tool matters less than the process.
</Takeaway>
```

---

## Apply to Our 4 Reports

| Report | Current Problem | Fix |
|--------|----------------|-----|
| AI Adoption | Good data, too many paragraphs | Convert every insight into stat-card + company-card + takeaway format |
| AI Jobs | Great personas, wordy explanations | Keep personas but shorten to card format. Add salary/role cards. |
| AI E-commerce | Zero visuals, consulting-speak | Add 5 company cards, vendor comparison strip, Gen Z behavior flow |
| AI Startup Products | All frameworks, no companies | Replace every framework section with a funded-company card grid |
