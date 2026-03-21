# Superside Web Design — Wireframe & Hi-Fi Prototypes

> **Source:** [Superside Web Design Services](https://www.superside.com/web-design-services)  
> **Sections:** What We Offer · Our Process  
> **Design skills:** [low-fidelity-prototyping](.agents/skills/design/low-fidelity-prototyping) · [high-fidelity-prototyping](.agents/skills/design/high-fidelity-prototyping)

---

# Part A: What We Offer

## A1. Lo-Fi Wireframe (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SECTION LABEL: what we offer                                                                      │
│ ## Creative web design, ready to _scale and convert_                                              │
│                                                                                                   │
│ Whether you're optimizing an existing site or launching something entirely new, we give you         │
│ everything you need to ship confidently, iterate quickly, and drive measurable business results.  │
│                                                                                                   │
│ 2×3 GRID — 6 SERVICE CARDS                                                                        │
│ ┌─────────────────────────────┬─────────────────────────────┬─────────────────────────────┐       │
│ │ [IMG] Website mockup +      │ [IMG] Webflow screens      │ [IMG] Phone + LP screen    │       │
│ │ mechanical element          │ "Made in Webflow"           │ Corebit health practice    │       │
│ │                             │                             │                             │       │
│ │ Website design              │ Webflow development         │ Landing pages              │       │
│ │ UX research, wireframes,    │ Certified partner,          │ Funnel-stage, mobile first,│       │
│ │ responsive, hi-fi UI        │ flexible, CMS               │ product launches, paid     │       │
│ │                             │                             │ media, SEO [Learn more]    │       │
│ └─────────────────────────────┴─────────────────────────────┴─────────────────────────────┘       │
│ ┌─────────────────────────────┬─────────────────────────────┬─────────────────────────────┐       │
│ │ [IMG] UI mockups, sidebar   │ [IMG] Analytics/dashboard   │ [IMG] "Outstanding copy"   │       │
│ │ "Label one", "CTA Here"     │ graphs, "Meet your AI"       │ copy overlay on nature     │       │
│ │                             │                             │                             │       │
│ │ Design systems and UI kits  │ UX/UI audits                │ Copy & motion support      │       │
│ │ Atomic design, reusable     │ Conversion leaks, usability │ Headlines, hierarchy,      │       │
│ │ component libraries         │ gaps, expert recs           │ microcopy, animation       │       │
│ └─────────────────────────────┴─────────────────────────────┴─────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## A2. Hi-Fi Color Palette (Section-Specific)

| Card | Background | Use |
|------|------------|-----|
| **1. Website design** | `#d4c4a8` warm brown/beige | Card surface |
| **2. Webflow development** | `linear-gradient(135deg, #e8d5e8 0%, #d4e4f0 50%, #c8e0e8 100%)` pastel pink/purple/blue | Card surface |
| **3. Landing pages** | `#1e4d5c` dark teal | Card surface |
| **4. Design systems** | `#0e6249` deep green | Card surface |
| **5. UX/UI audits** | `#c8e6c9` pale green | Card surface |
| **6. Copy & motion** | `linear-gradient(180deg, #b3e5fc 0%, #c8e6c9 100%)` sky blue → green | Card surface |

### Shared Tokens
| Token | Value | Use |
|-------|-------|-----|
| Section BG | `#F8F8F4` | Page background (off-white) |
| Card text (dark) | `#1a1a2e` | Titles on light cards |
| Card text (light) | `#ffffff` | Titles on dark cards (3, 4) |
| Body text | `#64748b` | Descriptions |
| CTA accent | `#6366f1` | "Learn more" link |
| Border radius | `12px` | Card corners |

---

## A3. Hi-Fi Layout Spec

### Grid
- **Desktop:** 3 columns, 32px gap
- **Tablet (768px):** 2 columns, 24px gap
- **Mobile:** 1 column, 24px gap
- **Card aspect:** Min height ~320px, content area + image area (image ~50–55% of card)

### Card Structure (each)
```
┌─────────────────────────────────────┐
│ [Visual area — 50–55% of card]      │
│  Image/mockup with card BG as base   │
├─────────────────────────────────────┤
│ [Content area]                       │
│ Title (Heading-2, 18–20px)          │
│ Description (Body-M, 16px, 2–3 lines)│
│ [Learn more] (optional, card 3)    │
└─────────────────────────────────────┘
```

### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Section label | 12px | 500 | #64748b, uppercase |
| Section headline | 36–40px | 600 | #1a1a2e, italic on "_scale and convert_" |
| Intro paragraph | 18px | 400 | #64748b, max-width 720px, center |
| Card title | 18–20px | 600 | #1a1a2e (light) / #fff (dark) |
| Card description | 16px | 400 | #64748b (light) / rgba(255,255,255,0.9) (dark) |
| Learn more | 14px | 500 | #6366f1 |

---

## A4. Hi-Fi Component Spec (React/HTML)

```tsx
// ServiceCard component
interface ServiceCardProps {
  title: string;
  description: string;
  visual: ReactNode; // or image src
  background: string; // CSS color/gradient
  learnMoreHref?: string; // optional, for Landing pages
  variant: 'light' | 'dark'; // text color
}
```

### Card Content (Real Copy)

| # | Title | Description |
|---|-------|-------------|
| 1 | Website design | Website UX research, wireframes, responsive design, and high-fidelity UI, tailored to your goals. |
| 2 | Webflow development | Certified Webflow partner offering flexible, scalable builds with CMS integration. |
| 3 | Landing pages | Funnel-stage pages that launch fast—fully optimized, mobile first, and on brand. Ideal for product launches, paid media, lifecycle marketing, and SEO. **+ Learn more link** |
| 4 | Design systems and UI kits | Reusable component libraries built following the Atomic design methodology to scale with consistency. |
| 5 | UX/UI audits | Deep research into conversion leaks and usability gaps, plus expert recs to boost performance. |
| 6 | Copy & motion support | Full-stack creative including headlines, content hierarchy, microcopy, and animation. |

---

## A5. Interaction States (Hi-Fi)

| State | Visual |
|-------|--------|
| Default | Card at full opacity, no shadow |
| Hover | `box-shadow: 0 8px 24px rgba(0,0,0,0.1)`; slight scale `transform: translateY(-2px)` optional |
| Focus | Focus ring on card (keyboard nav) |

### "Learn more" link (Landing pages card)
- Default: `color: #6366f1`, underline on hover
- Hover: `color: #4f46e5`

---

## A6. CSS Variables (Copy-Paste Ready)

```css
:root {
  /* What We Offer section — Web Design */
  --web-section-bg: #F8F8F4;
  --web-card-1-bg: #d4c4a8;
  --web-card-2-bg: linear-gradient(135deg, #e8d5e8 0%, #d4e4f0 50%, #c8e0e8 100%);
  --web-card-3-bg: #1e4d5c;
  --web-card-4-bg: #0e6249;
  --web-card-5-bg: #c8e6c9;
  --web-card-6-bg: linear-gradient(180deg, #b3e5fc 0%, #c8e6c9 100%);
  --web-card-radius: 12px;
  --web-card-gap: 32px;
}
```

---

## A7. Responsive Breakpoints

| Breakpoint | Columns | Gap | Card min-height |
|------------|---------|-----|-----------------|
| ≥1024px | 3 | 32px | 340px |
| 768–1023px | 2 | 24px | 320px |
| <768px | 1 | 24px | 300px |

---

# Part B: Our Process

## B1. Lo-Fi Wireframe (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ SECTION LABEL: Our process                                                                       │
│ ## Website workflows, _minus the friction_                                                        │
│   (sans-serif bold)     (italic serif-like)                                                       │
│                                                                                                   │
│ No more handoffs, holdups, or creative guesswork. Just a proven system for scalable,              │
│ brand-aligned web design.                                                                         │
│                                                                                                   │
│ [Book a demo]  ← lime green CTA                                                                   │
│                                                                                                   │
│ 6-STEP TIMELINE (vertical, right side)                                                           │
│   ●─── 1  Discovery and onboarding                                                                │
│   │       Together, we align on your brand, tech stack, audience, and site goals.                 │
│   ●─── 2  Team assignment                                                                         │
│   │       Get your own plug-in creative team: strategists, designers, developers, writers,        │
│   │       animators.                                                                               │
│   ●─── 3  UX and UI design                                                                        │
│   │       Structured process from wireframes to polished UI, always built for outcomes.           │
│   ●─── 4  Development                                                                             │
│   │       Built in Webflow with CMS, SEO, and speed in mind—modular or fully custom.             │
│   ●─── 5  QA and launch                                                                           │
│   │       We test and fine-tune across breakpoints, devices, and integrations.                     │
│   ●─── 6  Continuous optimization                                                                │
│           Post-launch audits, CRO improvements, and design updates as you grow.                   │
│                                                                                                   │
│ Layout: 2 columns — Left: intro + CTA  |  Right: timeline                                         │
│ BG: dark green                                                                                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## B2. Hi-Fi Color Palette (Section-Specific)

| Token | Value | Use |
|-------|-------|-----|
| Section BG | `#0e6249` | Deep dark green (full section) |
| Pre-heading | `#ffffff` | "OUR PROCESS" uppercase |
| Headline | `#ffffff` | "Website workflows," + "_minus the friction_" (italic) |
| Body text | `#ffffff` / `rgba(255,255,255,0.9)` | Description |
| CTA button BG | `#a8e063` | Lime green |
| CTA button text | `#0e6249` | Dark green (matches section BG) |
| Timeline line | `#ffffff` / `rgba(255,255,255,0.5)` | Vertical connector |
| Step circle | `#ffffff` border, `#ffffff` fill | White circle |
| Step number | `#1a1a2e` | Black inside circle |
| Step title | `#ffffff` | Medium-bold |
| Step description | `rgba(255,255,255,0.85)` | Light gray/white |

---

## B3. Hi-Fi Layout Spec

### Two-Column Grid
- **Desktop:** 50/50 or 45/55 (content left, timeline right)
- **Gap:** 48–64px between columns
- **Section padding:** 80–96px vertical, 48px horizontal

### Timeline Structure
```
[Circle: 32px diam, white border 2px, black number]
    |
[Vertical line: 2px, connects all circles]
    |
[Step content: title + description, left-aligned to circle]
```

- **Circle:** 32px diameter, white fill, white border, black number (1–6)
- **Line:** 2px, `rgba(255,255,255,0.5)`, runs through center of circles
- **Step spacing:** 32–40px between steps

### Typography
| Element | Size | Weight | Font | Color |
|---------|------|--------|------|-------|
| Section label | 12px | 500 | Sans-serif | #ffffff, uppercase |
| Headline part 1 | 36–40px | 700 | Sans-serif | #ffffff |
| Headline part 2 | 36–40px | 400 | Serif/italic | #ffffff |
| Description | 18px | 400 | Sans-serif | rgba(255,255,255,0.9) |
| CTA button | 16px | 600 | Sans-serif | #0e6249 |
| Step title | 18px | 600 | Sans-serif | #ffffff |
| Step description | 16px | 400 | Sans-serif | rgba(255,255,255,0.85) |

---

## B4. Hi-Fi Component Spec (React/HTML)

```tsx
// ProcessTimeline component
interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

interface ProcessSectionProps {
  label: string;
  headlinePart1: string;
  headlinePart2: string; // italicized
  description: string;
  ctaLabel: string;
  ctaHref: string;
  steps: ProcessStep[];
}
```

### Step Content (Real Copy)

| # | Title | Description |
|---|-------|-------------|
| 1 | Discovery and onboarding | Together, we align on your brand, tech stack, audience, and site goals. |
| 2 | Team assignment | Get your own plug-in creative team: strategists, designers, developers, writers, and animators. |
| 3 | UX and UI design | Structured process from wireframes to polished UI, always built for outcomes. |
| 4 | Development | Built in Webflow with CMS, SEO, and speed in mind—modular or fully custom. |
| 5 | QA and launch | We test and fine-tune across breakpoints, devices, and integrations. |
| 6 | Continuous optimization | Post-launch audits, CRO improvements, and design updates as you grow. |

---

## B5. Interaction States (Hi-Fi)

| Element | Default | Hover |
|---------|---------|-------|
| CTA button | BG #a8e063, text #0e6249 | Darker lime #94c752, scale 1.02 |
| Timeline step | — | Optional: subtle highlight on step (opacity/background) |

---

## B6. CSS Variables (Copy-Paste Ready)

```css
:root {
  /* Our Process section — Web Design */
  --process-section-bg: #0e6249;
  --process-cta-bg: #a8e063;
  --process-cta-text: #0e6249;
  --process-timeline-line: rgba(255, 255, 255, 0.5);
  --process-step-circle: #ffffff;
  --process-step-number: #1a1a2e;
}
```

---

## B7. Responsive

| Breakpoint | Layout |
|------------|--------|
| ≥1024px | 2 columns side-by-side |
| 768–1023px | Stacked: intro + CTA first, timeline below |
| <768px | Single column, timeline full-width |

---

# References

| Resource | Path |
|----------|------|
| Base style | `07-superside-ai-creative-prototypes.md` |
| Lo-fi skill | `.agents/skills/design/low-fidelity-prototyping/SKILL.md` |
| Hi-fi skill | `.agents/skills/design/high-fidelity-prototyping/SKILL.md` |
| Source | [superside.com/web-design-services](https://www.superside.com/web-design-services) |

---

**Path:** `tasks/style-guide/11-superside-web-design-what-we-offer.md`  
**Updated:** 2026-02-12
