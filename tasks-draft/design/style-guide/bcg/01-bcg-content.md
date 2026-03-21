# BCG Deep Customer Engagement AI — Design Specification

> **Source:** [BCG X Product Library](https://www.bcg.com/x/product-library/deep-ai-powered-customer-management)  
> **Aesthetic:** Luxury · Premium · Sophisticated · Intelligent  
> **Design Approach:** Lo-fi → Hi-fi wireframes, visual hierarchy, responsive layout

---

## 1. Color Palette (Wireframe & Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRIMARY PALETTE — Luxury High-End UI                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ████ #0D0D12  Charcoal Black      — Headings, primary text                 │
│  ████ #1A1A2E  Deep Navy           — Hero backgrounds, cards               │
│  ████ #2D2D44  Slate               — Secondary surfaces                    │
│  ████ #0047AB  BCG Blue            — CTAs, links, accent (primary)          │
│  ████ #0066CC  Bright Blue         — Hover states, interactive             │
│  ████ #E8E8ED  Silver Mist         — Body text on dark                      │
│  ████ #F5F5F7  Off-White           — Light backgrounds, cards               │
│  ████ #FFFFFF  Pure White          — Clean surfaces, contrast               │
├─────────────────────────────────────────────────────────────────────────────┤
│  ACCENT PALETTE — Metrics & Highlights                                       │
│  ████ #00C853  Success Green       — Positive metrics (+40%, +8%)           │
│  ████ #FF6B35  Warm Coral          — Callouts, highlights                   │
│  ████ #9C27B0  Violet              — GenAI / innovation badges             │
│  ████ #FFC107  Gold                — Premium badges, icons                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  DIAGRAM / FLOWCHART COLORS                                                 │
│  Build   → #0047AB  Deploy  → #0066CC  Design  → #2D2D44                     │
│  Deliver → #00C853  Develop → #9C27B0                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Typography Scale

| Token        | Font (Serif/Display) | Size | Weight | Use                    |
|-------------|------------------------|------|--------|------------------------|
| Display-1   | Playfair Display      | 56px | 600    | Hero headline           |
| Display-2   | Playfair Display      | 40px | 500    | Section titles          |
| Heading-1   | Inter                 | 28px | 600    | Card titles             |
| Heading-2   | Inter                 | 20px | 500    | Subsections             |
| Body-L      | Inter                 | 18px | 400    | Lead paragraph          |
| Body-M      | Inter                 | 16px | 400    | Body copy               |
| Body-S      | Inter                 | 14px | 400    | Captions, metadata      |
| Caption     | Inter                 | 12px | 500    | Labels, badges          |

---

## 3. ASCII Wireframe — Full Page Layout

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║  HEADER (Sticky)                                                              ║
║  ┌────────┐  Our Services  Industries  Capabilities  BCG X  Insights  Join Us ║
║  │ BCG X  │  ─────────────────────────────────────────────────────────────  ║
║  └────────┘                                                                   ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  HERO SECTION — Full-width gradient (navy → charcoal)                         ║
║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║  │                                                                         │  ║
║  │   Boosting Customer Value with AI                  ┌─────────────────┐  │  ║
║  │   [Display-1, white]                               │                 │  │  ║
║  │                                                    │   Hero Image    │  │  ║
║  │   By enabling hyperpersonalized, end-to-end         │   (3:4 ratio)   │  │  ║
║  │   customer management—at scale—Deep Customer        │   [IMG]         │  │  ║
║  │   Engagement AI by BCG X allows companies to       │                 │  │  ║
║  │   extract up to 40% more lifetime value.            └─────────────────┘  │  ║
║  │                                                                         │  ║
║  │   [Share]  [Request Demo]                                               │  ║
║  │                                                                         │  ║
║  └─────────────────────────────────────────────────────────────────────────┘  ║
║                                                                               ║
║  METRICS STRIP — 6 stat cards, horizontal scroll on mobile                    ║
║  ┌────────┬────────┬────────┬────────┬────────┬────────┐                     ║
║  │  50%   │  20%   │  20%   │  10%   │  20%   │  40%   │                     ║
║  │  acq↑  │ upsell↑│ churn↓ │ price↑ │ adopt↑ │ bad ↓  │                     ║
║  └────────┴────────┴────────┴────────┴────────┴────────┘                     ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ABOUT SECTION — Two-column (60/40)                                          ║
║  ┌────────────────────────────────────┬─────────────────────────────────┐   ║
║  │  About Deep Customer Engagement AI  │  ┌─────────────────────────────┐  │   ║
║  │  [Heading-1]                        │  │   DEEP Architecture         │  │   ║
║  │                                    │  │   [Diagram / Infographic]   │  │   ║
║  │  Body copy: AI integration,        │  │   AI + Data + Platform      │  │   ║
║  │  real-time recommendations,        │  └─────────────────────────────┘  │   ║
║  │  modular approach...                │                                   │   ║
║  └────────────────────────────────────┴─────────────────────────────────┘   ║
║                                                                               ║
║  TRANSFORMATION SECTION — Full-width diagram                                  ║
║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║  │  How Deep Customer Engagement AI Enables Customer Transformation       │  ║
║  │  [Heading-2]                                                             │  ║
║  │  ┌───────────────────┬───────────────────┬───────────────────┐        │  ║
║  │  │ 1. Proprietary    │ 2. End-to-End    │ 3. Battle-Tested   │        │  ║
║  │  │    Asset Ecosystem │    Talent         │    Transformation  │        │  ║
║  │  │ • AI, data,       │ • CVM experts     │ • 2 mo impact      │        │  ║
║  │  │   platform        │ • Full-stack dev  │ • Embedded teams   │        │  ║
║  │  │ • Algorithms      │ • Data scientists │ • Upskilling        │        │  ║
║  │  └───────────────────┴───────────────────┴───────────────────┘        │  ║
║  └─────────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  APPROACH SECTION — Build-Deploy-Design-Deliver-Develop (5-pillar)             ║
║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║  │  The Deep Customer Engagement AI Approach                                │  ║
║  │                                                                         │  ║
║  │   ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐              │  ║
║  │   │Build│────▶│Deploy│────▶│Design│────▶│Deliver│────▶│Develop│           │  ║
║  │   └──┬──┘     └──┬──┘     └──┬──┘     └──┬──┘     └──┬──┘              │  ║
║  │      │           │           │           │           │                  │  ║
║  │      ▼           ▼           ▼           ▼           ▼                  │  ║
║  │   Automate    Tech-enable  Experiments  Analytics   Data infra           │  ║
║  │   recommend.  front-line  at scale    & NBA        & tools              │  ║
║  └─────────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  GENAI SECTION — Video + stats strip                                          ║
║  ┌─────────────────────────────────────────────────────────────────────────┐  ║
║  │  Reimagining Customer Service with GenAI                                │  ║
║  │  ┌──────────────────────────────────────────┬─────────────────────────┐ │  ║
║  │  │  [VIDEO]                                  │  • 70% cost-to-serve ↓  │ │  ║
║  │  │  GenAI accelerators                        │  • 20% serve-to-sell ↑   │ │  ║
║  │  │  16:9                                     │  • 80% roadmap activate  │ │  ║
║  │  └──────────────────────────────────────────┴─────────────────────────┘ │  ║
║  └─────────────────────────────────────────────────────────────────────────┘   ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  CASE STUDIES — Illustrated cards (2-column on desktop)                       ║
║  ┌────────────────────────────────┬───────────────────────────────────────┐ ║
║  │  ┌────────────────────────────┐ │  ┌────────────────────────────────────┐ │ ║
║  │  │ +8% gross margin           │ │  │ 40% conversion uplift                │ │ ║
║  │  │ Energy Retailer             │ │  │ Telecommunications Operator         │ │ ║
║  │  │ [IMG placeholder]           │ │  │ [IMG placeholder]                   │ │ ║
║  │  │ 360° views, churn predict   │ │  │ Cross-sell at scale, 400+ agents     │ │ ║
║  │  └────────────────────────────┘ │  └────────────────────────────────────┘ │ ║
║  └────────────────────────────────┴───────────────────────────────────────┘   ║
║                                                                               ║
║  VIDEO GALLERY — 3 cards (A1 Telekom, Caldic, Orange)                         ║
║  ┌─────────────────┬─────────────────┬─────────────────┐                     ║
║  │ [Video thumb]   │ [Video thumb]   │ [Video thumb]   │                     ║
║  │ A1 Telekom      │ Caldic          │ BCG X & Orange  │                     ║
║  └─────────────────┴─────────────────┴─────────────────┘                     ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  EXPERTS SECTION — Avatars + metadata                                          ║
║  Discuss AI-Powered Customer Management with Our Experts                       ║
║  ┌────┬────┬────┬────┬────┬────┬────┐                                         ║
║  │ 👤 │ 👤 │ 👤 │ 👤 │ 👤 │ 👤 │ 👤 │  7 expert cards                         ║
║  │ A  │ I  │ T  │ T  │ P  │ Y  │ J  │                                         ║
║  │Madr│Madr│Vien│Sing│Mex │Par │SV  │                                         ║
║  └────┴────┴────┴────┴────┴────┴────┘                                         ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  LEARN MORE — Article cards (responsive grid)                                  ║
║  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐         ║
║  │ Reimagin │ Turbocha │ Deploying│ Busting  │ $70B     │ CEOs     │         ║
║  │ GenAI    │ Financial│ AI Rev   │ Myths    │ Prize    │ CX Revol │         ║
║  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘         ║
║                                                                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  FOOTER — Related services + sitemap                                           ║
║  BCG X | Artificial Intelligence | Digital Maturity                           ║
║  Careers | Alumni | Offices | Subscribe | Contact                              ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Flowchart — Content & User Journey

### 4a. Mermaid Diagram (implementable)

```mermaid
flowchart TD
    subgraph Hero[" "]
        A[Landing / Hero<br/>Value prop + Request Demo]
    end
    A --> B[Metrics Strip<br/>6 KPIs]
    A --> C[About / Intro<br/>Product story]
    A --> D[Request Demo CTA]
    B --> E[Transformation<br/>3-pillar diagram]
    C --> E
    E --> F[Approach<br/>Build→Deploy→Design→Deliver→Develop]
    F --> G[GenAI Accelerators<br/>Video + stats]
    G --> H[Case Studies]
    G --> I[Video Gallery]
    G --> J[Experts 7 profiles]
    H --> K[Learn More<br/>6 article cards]
    I --> K
    J --> K
    K --> L[Related Services<br/>BCG X | AI | Digital]
    style A fill:#1A1A2E,color:#fff
    style E fill:#2D2D44,color:#E8E8ED
    style G fill:#9C27B0,color:#fff
    style K fill:#0047AB,color:#fff
```

### 4b. ASCII Flowchart

```
                                    ┌─────────────────────┐
                                    │   LANDING / HERO    │
                                    │   Value prop + CTA  │
                                    └──────────┬──────────┘
                                               │
              ┌────────────────────────────────┼────────────────────────────────┐
              │                                │                                │
              ▼                                ▼                                ▼
     ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
     │  METRICS STRIP  │            │  ABOUT / INTRO   │            │  REQUEST DEMO    │
     │  6 KPIs visual  │            │  Product story   │            │  [Primary CTA]   │
     └────────┬────────┘            └────────┬────────┘            └─────────────────┘
              │                              │
              └──────────────┬───────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │ TRANSFORMATION      │
                    │ 3 pillars diagram   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ APPROACH (5-step)    │
                    │ Build→Deploy→Design  │
                    │ →Deliver→Develop     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ GENAI ACCELERATORS   │
                    │ Video + stats        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                 ▼
     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
     │ CASE STUDIES│  │ VIDEO GALL. │  │ EXPERTS     │
     │ 2 illustrated│  │ 3 videos    │  │ 7 profiles  │
     └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                             ▼
                    ┌─────────────────────┐
                    │ LEARN MORE          │
                    │ 6 article cards      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ RELATED SERVICES    │
                    │ BCG X, AI, Digital  │
                    └─────────────────────┘
```

---

## 5. Visual Cards — Illustrated Style Spec

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ILLUSTRATED VISUAL CARD PATTERN                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  [Subtle gradient or icon + diagram]                                  │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  METRIC / HEADLINE (large, bold)                                 │ │  │
│  │  │  +8%  |  40%  |  50%                                             │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │  Subtitle / category label                                             │  │
│  │  Energy Retailer | Telecommunications Operator                         │  │
│  │  Body: 2-3 lines max, scannable                                        │  │
│  │  Optional: [Learn More →]                                              │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  DESIGN TOKENS:                                                              │
│  • Border-radius: 12px (cards), 8px (small cards)                           │
│  • Shadow: 0 4px 24px rgba(0,0,0,0.08) — default                            │
│  • Shadow hover: 0 8px 32px rgba(0,0,0,0.12)                                │
│  • Padding: 24px (desktop), 16px (mobile)                                   │
│  • Icon/illustration: 48×48 or 64×64, subtle gradient fill                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

| Breakpoint | Width   | Layout Changes                                            |
|------------|---------|-----------------------------------------------------------|
| Mobile     | 375px   | Single column, stacked cards, metrics scroll horizontal   |
| Tablet     | 768px   | 2-column where applicable, smaller hero image            |
| Desktop    | 1280px  | Full layout, 3-column article grid                        |
| Wide       | 1920px  | Max-width container ~1400px, centered                     |

---

## 7. Diagrams & Charts Placement

| Section       | Diagram Type        | Purpose                                      |
|---------------|---------------------|----------------------------------------------|
| Transformation| 3-column flowchart  | Proprietary assets, talent, transformation   |
| Approach      | 5-step horizontal   | Build→Deploy→Design→Deliver→Develop          |
| GenAI         | Bar/stats strip     | 70%, 20%, 80% metrics                       |
| Case Studies  | Illustrated cards  | Client logos + metrics                       |

---

## 8. Hi-Fi Design Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-charcoal: #0D0D12;
  --color-navy: #1A1A2E;
  --color-slate: #2D2D44;
  --color-bcg-blue: #0047AB;
  --color-bright-blue: #0066CC;
  --color-silver: #E8E8ED;
  --color-off-white: #F5F5F7;
  --color-success: #00C853;
  --color-coral: #FF6B35;
  --color-violet: #9C27B0;
  --color-gold: #FFC107;

  /* Typography */
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Spacing (4px base) */
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

---

## 9. Implementation Notes

- **Hero:** Gradient overlay on image, text left-aligned, CTA buttons prominent
- **Metrics:** Large numerals (56px+), short labels, color-coded (green=positive)
- **Cards:** Hover elevation, optional icon/illustration top-left
- **Experts:** Circular avatars 114×114, name + title + location
- **Videos:** 16:9 thumbnails, play icon overlay, duration badge

---

**Status:** Draft wireframe + design spec  
**Next:** Create hi-fi mockups or HTML/CSS prototype following these tokens
