# BCG Article Style Guide — Three Ways GenAI Will Transform Customer Experience

> **Source:** [BCG Publications](https://www.bcg.com/publications/2024/three-ways-genai-will-transform-customer-experience)  
> **Article:** February 21, 2024 · 8 min read  
> **Use:** Replicate BCG article UX/UX for StartupAI reports, thought leadership, infographics

---

## 1. Page Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HEADER (BCG Global)                                                          │
│ Our Services | Industries | Capabilities | BCG X | Insights | Join Us         │
│ Skip to Main · Log in · Saved Content                                        │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ HERO / TITLE BLOCK                                                            │
│ ┌─────────────────────────────────────────────────────────────────────────┐  │
│ │  [Hero image 2743×1440 → 1200×630 OG]                                   │  │
│ │  Three Ways GenAI Will Transform Customer Experience                    │  │
│ │  [Display headline]                                                     │  │
│ │  By [Author 1], [Author 2], [Author 3]…  |  February 21, 2024  8 MIN   │  │
│ └─────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ KEY TAKEAWAYS (callout box)                                                   │
│ • Bullet 1: Strategic framing                                                 │
│ • Bullet 2: Risk / diffusion warning                                          │
│ • Bullet 3: 3 focus areas                                                     │
│ • Bullet 4: Prerequisites                                                      │
│ • Bullet 5: Value promise                                                     │
│ [Save] [Share] [Download] [Subscribe]                                         │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ BODY — Structured sections                                                    │
│ H2: Redefine the Economics of Experience with These Three Use Cases           │
│   H3: Process Reinvention                                                     │
│   [Exhibit 1] GenAI can elevate the customer experience in three ways          │
│   [Exhibit 2] GenAI is transforming customer journeys                         │
│   [Exhibit 3] GenAI drastically reshapes marketing operations                 │
│   H3: Customer Self-Assist                                                    │
│   [Exhibit 4] Leaders are transforming chat into conversational commerce      │
│   H3: Employee Assist                                                         │
│                                                                               │
│ H2: Walk Before You Run with GenAI                                            │
│   MIDAS paradigm (5 bullets)                                                  │
│   [Callout] Know When to Apply AI Versus Generative AI                         │
│                                                                               │
│ H2: How to Start the GenAI Conversation                                       │
│   3 action bullets                                                            │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│ FOOTER                                                                        │
│ [Subscribe CTA] Stay ahead with BCG insights on marketing and sales           │
│ [Authors block] — 5 authors, photos, titles, locations                        │
│ About BCG | Careers | Contact                                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Typography Scale

| Token | Use | BCG Style | Suggested Implementation |
|-------|-----|-----------|---------------------------|
| **Display** | Hero headline | Serif or strong sans; ~40–48px desktop | `font-display text-4xl md:text-5xl font-semibold` |
| **Lead** | Intro paragraph | 18–20px; slightly lighter weight | `text-lg md:text-xl text-muted-foreground` |
| **H2** | Section titles | Bold, 24–28px; ample margin below | `text-2xl md:text-3xl font-bold mt-12 mb-6` |
| **H3** | Subsection titles | Semibold, 20–22px | `text-xl font-semibold mt-10 mb-4` |
| **Body** | Main copy | 16–18px; 1.6–1.7 line-height | `text-base md:text-lg leading-relaxed` |
| **Caption** | Exhibit labels | 12–14px; muted | `text-sm text-muted-foreground` |
| **Metadata** | Author, date, read time | 14px; muted | `text-sm text-muted-foreground` |

**Font pairing (BCG-like):**
- Headlines: Serif (e.g. Georgia, Playfair Display) or strong sans (Inter 600)
- Body: Sans-serif (Inter, Source Sans Pro)
- Maintain consulting-grade legibility; avoid playful or decorative fonts

---

## 3. Headings Hierarchy

```
H1 (page title)
  └─ Single line, max ~60–70 chars for readability

H2 (major section)
  └─ 3–5 words; frames the narrative
  └─ Examples: "Redefine the Economics of Experience with These Three Use Cases"
  └─ Spacing: 48–64px above, 24–32px below

H3 (use case / sub-theme)
  └─ 2–4 words; concrete
  └─ Examples: "Process Reinvention", "Customer Self-Assist", "Employee Assist"
  └─ Spacing: 32–40px above, 16–24px below

H4 (optional)
  └─ For list headers, paradigm points (MIDAS)
```

---

## 4. Exhibit / Diagram Patterns

### 4.1 Exhibit Block Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Exhibit N: [Short descriptive title]                             │
│ [Image / diagram / infographic]                                  │
│ Optional caption or source                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Article exhibits:**
- **Exhibit 1:** Three-pillar diagram — Process Reinvention, Customer Self-Assist, Employee Assist
- **Exhibit 2:** Customer journey transformation (before/after or flow)
- **Exhibit 3:** Marketing ops reshaped by GenAI (persona → content → A/B)
- **Exhibit 4:** Chat → Conversational commerce (ChatUX architecture)
- **Callout:** “Know When to Apply AI Versus Generative AI” — 2-column comparison table

### 4.2 Diagram Conventions

| Element | Use |
|---------|-----|
| **Pillars / columns** | 3-column layout for frameworks (e.g. three use cases) |
| **Flow arrows** | Left-to-right for process; top-to-bottom for hierarchy |
| **Tables** | AI vs GenAI comparison; Decision vs Creative tasks |
| **Icons** | Minimal; BCG uses abstract shapes, not cartoon icons |
| **Color** | Primary blue accent; neutral grays for structure |

### 4.3 Infographic Color Palette (BCG-inspired)

```
Primary:   #0047AB (BCG Blue)   — CTAs, links, diagram accents
Secondary: #2D2D44 (Slate)      — Diagram shapes, secondary blocks
Text:      #1A1A2E (Navy)       — Headings
Body:      #4A4A6A (Muted)      — Body text
Bg:        #F5F5F7 (Off-White)  — Page background
Success:   #00C853               — Positive metrics
```

---

## 5. Key Takeaways Callout

**Layout:**
- Full-width or contained box; light background (`bg-muted/50` or `#F8F9FA`)
- Bullet list (5–7 bullets); concise, scannable
- Action row: Save | Share | Download | Subscribe

**Content pattern:**
1. Strategic framing (“use GenAI as an instrument, not a hammer”)
2. Risk or diffusion warning
3. Recommended focus (3 areas)
4. Prerequisites or foundations
5. Value promise

**Tailwind approximation:**
```html
<aside class="rounded-xl border border-border bg-muted/30 p-6 md:p-8 my-8">
  <h3 class="text-lg font-semibold mb-4">Key Takeaways</h3>
  <ul class="space-y-2 text-base">
    <li>• …</li>
  </ul>
  <div class="flex gap-4 mt-6 text-sm">
    <button>Save</button><button>Share</button><button>Download</button>
  </div>
</aside>
```

---

## 6. Author Block

- 5 authors (this article)
- Photo (circular or square) + name + title + location
- Layout: horizontal row on desktop; wrap on mobile
- Muted text for title/location

---

## 7. UX Patterns (BCG Article)

| Pattern | BCG Implementation |
|---------|---------------------|
| **Skip to Main** | Accessibility; jumps to #Page-content |
| **Read time** | "8 MIN read" in metadata |
| **Save / Share** | Top-right of hero; persist preferences |
| **Subscribe CTA** | Inline and footer; topic-specific |
| **Exhibit numbering** | "Exhibit 1", "Exhibit 2" — sequential |
| **Internal links** | "See Exhibit 3"; "Know When to Apply…" |
| **Mobile** | Single column; images scale; touch-friendly CTAs |

---

## 8. Content Structure Template (StartupAI Reuse)

Use this structure for thought-leadership or report-style articles:

```
1. Hero
   - Headline (H1)
   - Byline (authors, date, read time)
   - Optional hero image

2. Key Takeaways (5–7 bullets)
   - Save / Share / Download

3. Introduction (1–2 paragraphs)
   - Problem + approach

4. Main content (3–5 H2 sections)
   - Each H2: 1–3 H3s
   - Each section: 1–2 exhibits/diagrams
   - Case study or stat callouts inline

5. Foundation / Prerequisites (if applicable)
   - Paradigm or framework (e.g. MIDAS)
   - Bullet list + optional diagram

6. Call-to-action section
   - "How to Start" or "Next Steps"
   - 3–5 action bullets

7. Authors
   - Photo, name, title, location

8. Subscribe / Related
   - Newsletter, related articles
```

---

## 9. Diagram Types (from BCG Article)

| Type | Example | Use Case |
|------|---------|----------|
| **Three-pillar** | Exhibit 1 — Process Reinvention, Self-Assist, Employee Assist | Frameworks, strategic options |
| **Journey / flow** | Exhibit 2 — GenAI transforming customer journeys | Before/after, process flows |
| **Operational** | Exhibit 3 — Marketing ops (persona, content, A/B) | How systems change |
| **Architecture** | Exhibit 4 — ChatUX (data integration, feedback loops) | System design |
| **Comparison table** | AI vs GenAI — Decision vs Creative | When to use which tool |

---

## 10. Checklist for StartupAI Report Pages

- [ ] H1 matches article/report title
- [ ] Key Takeaways callout with 5–7 bullets
- [ ] H2 sections frame narrative; H3s are concrete
- [ ] Exhibits numbered and captioned
- [ ] At least one comparison or framework diagram
- [ ] Author/attribution block
- [ ] Subscribe or CTA in footer
- [ ] Responsive: single column on mobile
- [ ] Typography: consulting-grade (serif/sans pairing)
- [ ] Color: primary accent, neutral grays

---

**Reference:** [Three Ways GenAI Will Transform Customer Experience](https://www.bcg.com/publications/2024/three-ways-genai-will-transform-customer-experience)  
**Scraped via:** Firecrawl MCP  
**Path:** `tasks/design/05-bcg-genai-cx-style-guide.md`
