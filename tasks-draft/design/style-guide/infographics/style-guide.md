# AI Agents Infographic — Visual Style Guide

**Project:** StartupAI Research Visual Intelligence  
**Page:** What Are AI Agents?  
**Version:** 1.0  
**Last Updated:** February 2026

---

## 1. Design Philosophy

**Core Principles:**

- **Premium & Intelligent:** BCG/McKinsey-inspired aesthetic with consulting-grade polish
- **Calm & Sophisticated:** Generous negative space, restrained animations, architectural layouts
- **Scroll-Driven Storytelling:** Progressive disclosure through scroll-triggered reveals
- **Diagram-First Thinking:** Visual diagrams, flow charts, and process maps replace decorative imagery
- **Trust Through Structure:** Clear hierarchy, systematic organization, professional execution

**Visual Language:**

The design system signals intelligence, strategy, and trust through:
- Serif typography for authority (Georgia for headlines, numbers, quotes)
- Muted earth tones (beige, sage green) for calm sophistication
- Structured diagrams and flowcharts for clarity
- Minimal ornamentation with purposeful visual elements

---

## 2. Color System

### Primary Palette

**Emerald Green (Brand Primary)**
- #0D5F4E — Primary actions, headings, emphasis
- #0E3E1B — Darker variant for hero cards and backgrounds
- #162D26 — Deep green for dark section cards

**Sage Green (Supporting)**
- #6B9D89 — Secondary actions, icons, borders
- #8FB894 — Light accents, highlights, italics
- #2A5245 — Muted text on dark backgrounds

### Background Palette

**Dark Modes**
- #0A211F — Primary dark background
- #0E1A17 — Section transition dark
- #1E3D33 — Card backgrounds on dark

**Light Modes**
- #FAF9F7 — Primary light background (cream)
- #F5F3EF — Secondary light background (warm beige)
- #EEF3E4 — Tertiary light background (sage tint)
- #F7F9F2 — Pale green section background

### Text Palette

**On Dark Backgrounds**
- #FAF9F7 — Primary text (high contrast)
- #D4E6D0 — Secondary text (medium contrast)
- #7C7D79 — Tertiary text (low contrast)

**On Light Backgrounds**
- #191918 — Primary text (near-black)
- #1E3D33 — Secondary text (deep green)
- #7C7D79 — Tertiary text (gray)

### Accent Colors

**Supporting Palette**
- #C9A54A — Gold (analytics, special metrics)
- #5B8FD4 — Blue (safety, security features)
- #E8765A — Coral (warnings, risks)

### Border & Divider Colors

- #D4E6D0 — Light borders (on light backgrounds)
- #1E3D33 — Dark borders (on dark backgrounds)
- #6B9D89 with 20-30% opacity — Subtle accent borders

### State Colors

**Success:** #0D5F4E  
**Warning:** #C9A54A  
**Error:** #E8765A  
**Info:** #5B8FD4

---

## 3. Typography Scale

### Font Families

**Serif (Georgia)**
- Headlines, display numbers, quotes, section titles
- Conveys authority, intelligence, timelessness

**Sans-Serif (System Stack)**
- Body text, labels, captions, UI elements
- Optimized for readability and clarity

### Type Scale

**Display (Headlines)**
- Hero: 52-96px — clamp(52px, 10vw, 96px)
- Section: 28-52px — clamp(28px, 4.5vw, 52px)
- Subsection: 20-38px — clamp(20px, 3.5vw, 38px)

**Body Text**
- Large: 15-16px
- Regular: 13-14px
- Small: 11-12px
- Micro: 9-10px

**Labels (Uppercase)**
- Large: 10-11px
- Regular: 8-9px
- Small: 7-8px

**Numbers (Serif Display)**
- Metrics: 28-64px
- Stats: 22-50px
- Inline: 14-18px

### Font Weights

- Light: 300 — Large headlines, display numbers
- Normal: 400 — Body text, descriptions
- Medium: 500 — Subheadings, card titles
- Semibold: 600 — Labels, emphasis
- Bold: 700 — Rare (CTAs only)

### Letter Spacing

**Headlines:** -3px to -0.5px (tight, modern)  
**Labels:** +1.5px to +6px (uppercase tracking)  
**Body:** Default (0px)

### Line Height

**Headlines:** 0.95 to 1.2 (compact)  
**Body:** 1.7 to 1.95 (generous readability)  
**Labels:** 1.4 (compact but legible)

---

## 4. Spacing & Grid System

### Base Unit: 4px

**Spacing Scale**
- 4px (1 unit)
- 8px (2 units)
- 12px (3 units)
- 16px (4 units)
- 20px (5 units)
- 24px (6 units)
- 32px (8 units)
- 40px (10 units)
- 48px (12 units)
- 56px (14 units)
- 64px (16 units)
- 80px (20 units)
- 128px (32 units)

### Layout Rhythm

**Section Padding**
- Vertical: 128px (py-32)
- Creates clear visual breaks between content blocks

**Container Width**
- Max-width: 1200px
- Horizontal padding: 56px (px-14)
- Centered with auto margins

**Card Internal Padding**
- Small cards: 32px
- Medium cards: 40px
- Large cards: 48px
- Hero cards: 64-80px

**Grid Gaps**
- Tight: 16px (gap-4)
- Regular: 20px (gap-5)
- Loose: 24px (gap-6)

### Grid System

**Column Layouts**
- 2-column: 1fr 1fr or ratio variants (1.2fr 1fr)
- 3-column: Equal or weighted (1.2fr 1fr 1fr)
- 4-column: Equal width for specialist grids

**Responsive Behavior**
- Mobile: Stack to single column
- Tablet (md): 768px breakpoint activates grid
- Desktop: Full grid layouts at 1024px+

---

## 5. Component System

### Card System

**Border Radius**
- Small: 18-20px
- Medium: 22-24px
- Large: 28px

**Shadows**
- Subtle: 0 8px 30px rgba(13, 95, 78, 0.04)
- Medium: 0 8px 40px rgba(13, 95, 78, 0.1)
- Elevated: 0 12px 50px rgba(13, 95, 78, 0.15)

**Border Widths**
- Standard: 1px
- Emphasis: 2px
- Accent bar: 1-3px (left edge)

**Elevation Levels**
- Flat: No shadow, border only
- Lifted: Subtle shadow + border
- Floating: Medium shadow + border + hover lift

### Button System

**Primary CTA**
- Shape: Fully rounded (rounded-full)
- Padding: 24px horizontal, 16px vertical
- Text: 12px uppercase, tracked (+1.5px)
- Background: Solid emerald (#6B9D89)
- Hover: Lighter sage (#8FB894) + gap increase

**Secondary Button**
- Border: 1-2px solid
- Background: Transparent
- Same padding and text treatment

### Badge System

**Style**
- Shape: Fully rounded pill (rounded-full)
- Padding: 12px horizontal, 6px vertical
- Text: 9px uppercase, tracked (+2px)
- Background: Color with 10-20% opacity
- Border: Optional 1px with 30% opacity

**Types**
- Status badges: Small circles (8-12px diameter)
- Label badges: Pill-shaped with text
- Metric badges: Larger with number + label

### Progress Indicators

**Linear Progress Bars**
- Height: 1-3px
- Background: Primary color at 10% opacity
- Fill: Solid primary color
- Border radius: Fully rounded
- Animation: Smooth width transition (1.2-1.4s)

**Circular Progress**
- Not used in this system (linear preferred)

### Icon System

**Style**
- Library: Lucide React (stroke-based)
- Stroke width: 1.5-2px
- Sizes: 16px, 20px, 24px, 28px

**Container Treatment**
- Background: Rounded square (12-16px radius) or circle
- Padding: 8-12px inside container
- Background opacity: 10-20% of accent color
- Hover: Scale 1.1x

**Usage**
- Decorative: Larger (24-28px)
- Functional: Medium (20px)
- Inline: Small (16px)

---

## 6. Data Visualization Standards

### Number Display

**Large Metrics**
- Font: Georgia serif
- Size: 28-64px
- Weight: Light (300)
- Color: Accent colors per category
- Letter spacing: -1.5px to -2px

**Supporting Labels**
- Size: 8-10px
- Style: Uppercase, tracked (+2px)
- Color: Gray (#7C7D79)
- Position: Below metric

### Progress Visualization

**Horizontal Bars**
- Height: 1px (subtle), 3px (standard), 4px (prominent)
- Full width of container
- Rounded ends (fully rounded)
- Background: 10% opacity of fill color
- Animated on scroll reveal

**Tower/Pyramid Visualization**
- Progressive width reduction (100% → 40%)
- Left-aligned with accent bar
- Numbered indicators (circles or badges)
- Stacked with consistent gap (16-20px)

### Flow Diagrams

**Node Style**
- Shape: Rounded squares (16-20px radius)
- Size: 48-64px
- Border: 2px solid accent
- Background: Gradient or solid with glow
- Icon: Centered, 24-28px

**Connectors**
- Style: Arrows or solid lines
- Width: 1.5-2px
- Color: Muted accent (30-50% opacity)
- Animation: Path drawing on scroll

**Hierarchy Flow**
- Top-down vertical layout
- Branching: Radial lines from center point
- Labels: Below nodes, 10-12px

### Comparison Tables

**Structure**
- Grid layout with clear column headers
- Alternating row backgrounds (subtle)
- Icon indicators: Check/X in circles (40px diameter)
- Border separators: 1px with low opacity

**Visual Indicators**
- Success: Green circle + check icon
- Failure: Red circle + X icon
- Neutral: Gray circle or dash

---

## 7. Motion & Interaction Guidelines

### Animation Timing

**Fast Interactions (Hover, Click)**
- Duration: 300-400ms
- Easing: ease-in-out

**Content Reveals (Scroll)**
- Duration: 600-800ms
- Easing: Cubic bezier [0.16, 1, 0.3, 1] (smooth out)

**Staggered Reveals**
- Delay increment: 100-150ms between items
- Maximum stagger: 5-6 items before reset

### Animation Types

**Fade In**
- Opacity: 0 → 1
- Often paired with Y-translation

**Slide Up**
- Y-offset: +30px to +50px → 0
- Combined with fade in

**Scale**
- Initial: 0.8-0.9
- Final: 1.0
- Used for icons, badges, nodes

**Hover Lifts**
- Translate Y: 0 → -4px to -8px
- Often paired with shadow increase
- Duration: 300-400ms

### Scroll Animations

**Trigger Point**
- Amount in view: 0.15-0.2 (15-20% visible)
- Once: true (don't repeat on scroll up)

**Parallax Effects**
- Hero elements: Subtle movement (0.5-0.8x scroll speed)
- Background elements only
- Opacity fades on scroll (1 → 0)

### Interaction States

**Hover**
- Cards: Lift -4px, shadow increase
- Buttons: Background color shift, gap increase
- Icons: Scale 1.1x, color shift

**Active/Pressed**
- Scale: 0.98x
- Shadow: Reduced
- Duration: 150ms

**Focus**
- Outline: 2px solid primary color
- Offset: 2px
- Visible on keyboard navigation only

---

## 8. Responsive Design Rules

### Breakpoints

**Mobile:** < 768px  
**Tablet (md):** 768px - 1024px  
**Desktop:** > 1024px

### Typography Responsiveness

**Use clamp() for Fluid Scaling**
- Example: clamp(28px, 4.5vw, 52px)
- Min: Mobile size
- Preferred: Viewport-based
- Max: Desktop size

**Hierarchy Adjustments**
- Mobile: Reduce scale ratio (1.5x vs 2x on desktop)
- Maintain clear hierarchy, compress range

### Layout Adaptations

**Grid Stacking**
- Mobile: All grids become single column
- Tablet: 2-column for most grids
- Desktop: 3-4 column layouts activated

**Spacing Reduction**
- Section padding: 128px → 80px → 64px
- Container padding: 56px → 40px → 24px
- Card padding: 48px → 40px → 32px

**Component Scaling**
- Icons: 28px → 24px → 20px
- Buttons: Padding reduction by 20-30%
- Cards: Maintain radius proportionally

### Content Priority

**Mobile Strategy**
- Stack diagrams vertically
- Simplify flow visualizations (reduce branches)
- Collapse secondary information
- Prioritize key metrics and headlines

**Touch Targets**
- Minimum: 44px x 44px
- Spacing: 8px minimum between interactive elements

---

## Visual Wireframes

### Section Structure Pattern

```
┌─────────────────────────────────────────────────┐
│  [Number]  Section Title                       │
│            Subtitle (italic)                    │
│            Description text (2-3 lines)         │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │   Card 1     │  │   Card 2     │           │
│  │   Content    │  │   Content    │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
│  Source: IBM · Link                            │
└─────────────────────────────────────────────────┘
```

### Card Anatomy

```
┌─────────────────────────────────┐
│ [Icon]  [Metric]                │
│         Label                   │
│                                 │
│ Title (serif, 16-20px)         │
│                                 │
│ Description text (11-13px)     │
│ 1.7-1.9 line height            │
│                                 │
│ ┌─────────────────────────┐    │
│ │ Example box             │    │
│ │ (accent background)     │    │
│ └─────────────────────────┘    │
│                                 │
│ [Progress bar]                 │
└─────────────────────────────────┘
```

### Flow Diagram Pattern

```
        ┌───────────┐
        │  Human    │ ← Top level
        └─────┬─────┘
              │
              ↓
        ┌───────────┐
        │Orchestrator│ ← Manager
        └─────┬─────┘
              │
      ┌───┬───┼───┬───┐
      ↓   ↓   ↓   ↓   ↓
    [A] [B] [C] [D]    ← Specialists
```

### Tower Visualization

```
Level 5 ████████████████████ 100% width
Level 4 ███████████████ 85% width
Level 3 █████████████ 70% width
Level 2 ██████████ 55% width
Level 1 ███████ 40% width

[Number] [Title & Description]
```

---

## Implementation Notes

### Development Priorities

1. **Color variables:** Define as CSS custom properties or design tokens
2. **Typography scale:** Use rem units with base 16px
3. **Spacing system:** Implement as utility classes (4px increments)
4. **Component library:** Build reusable card, badge, button components
5. **Animation library:** Create reusable motion variants for scroll reveals

### Design Token Structure

Organize tokens by category:
- Color (semantic naming: primary, success, etc.)
- Typography (scale, weight, family)
- Spacing (base unit multiples)
- Radius (small, medium, large)
- Shadow (elevation levels)
- Motion (duration, easing)

### Accessibility Requirements

- **Color contrast:** Minimum 4.5:1 for body text, 3:1 for large text
- **Focus indicators:** Always visible for keyboard navigation
- **Motion reduction:** Respect prefers-reduced-motion
- **Touch targets:** 44px minimum on mobile
- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3)

---

**End of Style Guide**

For questions or clarifications, contact the design system team.
