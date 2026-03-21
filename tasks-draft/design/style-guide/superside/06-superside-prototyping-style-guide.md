# Superside-Style Prototyping & ASCII Wireframe Guide

> **Source:** [Superside.com](https://www.superside.com/) (scraped via [Firecrawl MCP](https://docs.firecrawl.dev/mcp-server))  
> **Design skills:** `.agents/skills/design/low-fidelity-prototyping` · `.agents/skills/design/high-fidelity-prototyping`  
> **Use:** SaaS landing pages, creative-service product pages, B2B marketing sites

---

## 1. Lo-Fi vs Hi-Fi Workflow (from Design Skills)

```
Need to validate a concept?
├── Layout/structure?      → Paper sketch or ASCII wireframe (lo-fi)
├── User flow?             → Clickable wireframe prototype (lo-fi)
├── Content hierarchy?     → Grayscale wireframe (lo-fi)
└── Visual design ready?   → Hi-fi with design tokens (hi-fi)

Ready for hi-fi?
├── Lo-fi validated?       → YES: Proceed
├── Design system exists?  → Apply components
├── Testing interactions?  → Build interactive prototype
└── Developer handoff?     → Annotate specs
```

**References:**
- Lo-fi: `.agents/skills/design/low-fidelity-prototyping/SKILL.md`
- Hi-fi: `.agents/skills/design/high-fidelity-prototyping/SKILL.md`
- Wireframe patterns: `.agents/skills/design/low-fidelity-prototyping/references/wireframe-patterns.md`

---

## 2. Superside Homepage — ASCII Wireframe (Lo-Fi)

**Source:** [Superside.com](https://www.superside.com/) · Creative-services SaaS landing

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER (sticky)                                                                                   │
│ Services ▼  Our work  Why us ▼  Resources ▼  Pricing  Enterprise    [Book a demo]  Sign in         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HERO SECTION                                                                                      │
│                                                                                                   │
│   Your creative team's creative team™                                                              │
│   [Display headline — italic emphasis on key phrase]                                              │
│                                                                                                   │
│   Scale your in-house creative team with top global talent powered by                              │
│   industry-leading AI workflows, delivering anything you can imagine fast and affordably.       │
│                                                                                                   │
│   [Book a demo]                                                                                   │
│                                                                                                   │
│   [Video / motion background]                                                                     │
│                                                                                                   │
│   Trusted by 500+ of the world's top brands                                                        │
│   [Logo strip: 8 logos]                                                                           │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ VALUE PROPS SECTION — "A new era of creative work"                                               │
│                                                                                                   │
│   The support your creative team has been asking for                                               │
│   Superside is your dedicated, on-call creative team...                                            │
│                                                                                                   │
│   [Book a demo]                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 3-PILLAR SECTION — "made to flex"                                                                 │
│                                                                                                   │
│   ┌─────────────────┬─────────────────┬─────────────────┐                                         │
│   │ [IMG]           │ [IMG]           │ [IMG]           │                                         │
│   │ Top global      │ Ultra-fast      │ Flexible        │                                         │
│   │ creative talent │ turnaround      │ subscription    │                                         │
│   │ (12 hours)      │ (12 hours)      │ model           │                                         │
│   └─────────────────┴─────────────────┴─────────────────┘                                         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ STATS STRIP — "SUCCESS IN NUMBERS"                                                                │
│                                                                                                   │
│   ┌──────────┬──────────┬──────────┬──────────┐                                                   │
│   │ 500+     │ 70k+     │ 94%      │ 6 months │                                                   │
│   │ Projects │ Brands   │ 3yr ROI  │ Payback  │                                                   │
│   │ delivered│          │ (Forrester)           │                                                   │
│   └──────────┴──────────┴──────────┴──────────┘                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TESTIMONIALS CAROUSEL — "success story"                                                            │
│                                                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐  │
│   │ [Photo]  "Quote excerpt..." — Name, Title, Company                                          │  │
│   │          ┌────────┬────────┬────────┐                                                       │  │
│   │          │ 4x     │ 60%    │ 60+   │  ← Metric badges                                       │  │
│   │          │ cap↑   │ TTM↓   │ brands│                                                       │  │
│   │          └────────┴────────┴────────┘                                                       │  │
│   │          [Case study link]                                                                   │  │
│   └─────────────────────────────────────────────────────────────────────────────────────────────┘  │
│   [←] [• • • • • • •] [→]                                                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SERVICE GRID — "Every type of creative work you'll ever need"                                     │
│                                                                                                   │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                                     │
│   │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │ │ [IMG]   │                                     │
│   │ Ad      │ │ Website │ │ Social  │ │ Email   │ │ Motion  │  ... (16+ service cards)             │
│   │ Creative│ │ Design  │ │ Media   │ │ Design  │ │ Design  │                                     │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘                                     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ COMPARISON SECTION — "Superside vs. traditional alternatives"                                    │
│                                                                                                   │
│   Hiring or traditional outsourcing? Neither.                                                      │
│                                                                                                   │
│   [Table: Speed | Flexibility | Quality | Scalability | Cost-effectiveness]                        │
│   Superside     ✓    ✓         ✓        ✓             ✓                                          │
│   In-house      —    —         ✓        —             —                                          │
│   Agencies      —    —         ✓        ✓             —                                          │
│   Freelancers   —    ✓         —        —             ✓                                          │
│   Self-service  ✓    ✓         —        ✓             ✓                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FEATURES — "Tech enabled and made to work for you"                                                │
│                                                                                                   │
│   ┌────────────────┬────────────────┬────────────────┬────────────────┐                         │
│   │ [IMG]          │ [IMG]          │ [IMG]          │ [IMG]          │                         │
│   │ Brief→Review   │ Integrations    │ Brand assets    │ Reference      │                         │
│   │ Sign off       │ Asana/Jira     │ Organize        │ Best brands    │                         │
│   └────────────────┴────────────────┴────────────────┴────────────────┘                         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ CTA SECTION — "World-class talent with no borders"                                                 │
│   [Book a demo]                                                                                   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                                            │
│ Services | Our work | Pricing | Trust center | Careers | Forrester TEI Report                       │
│ © 2026 Superside  |  Privacy  |  Terms  |  Status  |  DMCA                                         │
│ [Event CTA] A practical guide to using AI in creative work — Save your spot                       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Superside Design Patterns (Extracted)

| Pattern | Use | Lo-Fi Element | Hi-Fi Component |
|---------|-----|---------------|-----------------|
| **Hero + CTA** | Above-fold value prop | Headline + subtext + [Button] | Display type, gradient/video bg, primary CTA |
| **Logo strip** | Social proof | "[Logo] × 8" | Trusted-by row with grayscale logos |
| **3-pillar value props** | Features/benefits | 3 boxes with [IMG] + title + copy | Icon/image + H4 + body; equal columns |
| **Stats strip** | Quantified outcomes | 4 numbers + labels | Large numbers, muted labels, optional link |
| **Testimonial carousel** | Customer quotes | [Photo] + quote + metrics | Card + avatar + quote + metric badges |
| **Service grid** | Product/service catalog | Card grid 4–5 col | Image + title + sub-items; hover states |
| **Comparison table** | vs. alternatives | Rows × columns | Checkmarks, dashes; highlight "us" row |
| **Demo CTA** | Lead capture | [Book a demo] | Primary button; modal or /book-demo |

---

## 4. Typography & Emphasis (Superside-Inspired)

| Element | Style | Example |
|---------|-------|---------|
| **Headline** | Bold; italic for 1–2 key words | "Your _creative team's_ creative team™" |
| **Subhead** | Lighter; supporting value prop | "Scale your in-house creative team..." |
| **Section label** | Uppercase, small cap; muted | "SUCCESS IN NUMBERS" |
| **Stat value** | Large, bold | "500+" |
| **Stat label** | Small, muted | "Projects delivered" |
| **Quote** | Serif or larger body; emphasis via bold | "**Thanks to Superside**, we've elevated..." |

---

## 5. Wireframe Annotation Conventions

From `.agents/skills/design/low-fidelity-prototyping/references/wireframe-patterns.md`:

| Symbol | Meaning |
|--------|---------|
| `[Action]` | Clickable button or link |
| `[Input...]` | Text input |
| `[IMG]` or `[Image]` | Image placeholder |
| `▼` | Dropdown |
| `←` `→` | Nav direction |
| `...` | Truncated content |

---

## 6. Hi-Fi Design Tokens (StartupAI Reuse)

When moving from lo-fi to hi-fi (per `.agents/skills/design/high-fidelity-prototyping`):

```css
/* Superside-inspired tokens */
:root {
  /* Colors — B2B creative SaaS */
  --color-primary: #1a1a2e;
  --color-accent: #6366f1;        /* or brand accent */
  --color-surface: #ffffff;
  --color-muted: #f8f9fa;
  --color-border: #e2e8f0;
  --color-text: #1a1a2e;
  --color-text-muted: #64748b;

  /* Typography */
  --font-display: 'Inter', sans-serif;  /* or serif for headlines */
  --font-body: 'Inter', sans-serif;

  /* Spacing (4px base) */
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

---

## 7. Page-Type Wireframes (from wireframe-patterns)

### Sidebar + Content (Dashboard)
```
┌──────┬─────────────────────────┐
│ Nav  │  Header / Breadcrumb    │
│      ├─────────────────────────┤
│ Link │  Content Area           │
│ Link │  ┌─────┐ ┌─────┐       │
│ Link │  │Card │ │Card │       │
│      │  └─────┘ └─────┘       │
└──────┴─────────────────────────┘
```

### Three-Panel (Context | Work | Intelligence)
```
┌────────┬──────────────┬────────┐
│Context │  Work Area   │ Intel  │
│Filters │  Main content│ AI     │
│Nav     │  + actions   │ Panel  │
└────────┴──────────────┴────────┘
```

### Card Grid (Portfolio / Services)
```
┌─────────────────────────────────┐
│ Title           [Filter] [View] │
├─────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │[Image]│ │[Image]│ │[Image]│  │
│ │ Title │ │ Title │ │ Title │  │
│ │ Meta  │ │ Meta  │ │ Meta  │  │
│ └───────┘ └───────┘ └───────┘  │
└─────────────────────────────────┘
```

---

## 8. Checklist: Lo-Fi → Hi-Fi

- [ ] ASCII wireframe for page layout
- [ ] Section hierarchy (H1 → H2 → H3)
- [ ] CTA placement (hero + inline + footer)
- [ ] Stats/social proof blocks
- [ ] Annotations for interactive elements
- [ ] Map to design-system components
- [ ] Define interaction states (hover, focus, loading)
- [ ] Responsive breakpoints (mobile stack, desktop grid)

---

## 9. References

| Resource | Path |
|----------|------|
| Low-fidelity prototyping | `.agents/skills/design/low-fidelity-prototyping/SKILL.md` |
| High-fidelity prototyping | `.agents/skills/design/high-fidelity-prototyping/SKILL.md` |
| Wireframe patterns | `.agents/skills/design/low-fidelity-prototyping/references/wireframe-patterns.md` |
| Superside (source) | [superside.com](https://www.superside.com/) |
| Firecrawl MCP | [docs.firecrawl.dev/mcp-server](https://docs.firecrawl.dev/mcp-server) |

---

**Path:** `tasks/style-guide/06-superside-prototyping-style-guide.md`  
**Updated:** 2026-02-12
