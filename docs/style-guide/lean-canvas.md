# Lean Canvas — ASCII Wireframe & Style Guide

**Strategy-First Design** | **3-Panel Layout** | **Low-Fidelity Wireframe**  
**Last Updated:** February 8, 2026  
**Max Lines:** 300 (Strict Limit)

---

## Step 1: Extracted Color Palette (From Existing Style Guide)

### Color Tokens (From `/docs/style-guide/lean.md`)

```
// PRIMARY ACCENTS
canvas.primary      = #3B5F52  // Emerald - Actions, Focus, Progress
canvas.primaryHover = #2D4840  // Emerald Dark - Hover States
canvas.accent       = #0d5f4e  // Medium Emerald - Icons, Secondary
canvas.sage         = #6b9d89  // Sage Green - Highlights
canvas.success      = #DCF9E3  // Pale Mint - Completion Badges

// BACKGROUNDS
canvas.bg           = #FAF9F7  // Primary Cream - App Background
canvas.surface      = #FFFFFF  // Pure White - Cards, Panels
canvas.surfaceHover = #FBF9FA  // Off-White - Hover States

// TEXT HIERARCHY
canvas.textPrimary   = #212427  // Dark - Headings, Body
canvas.textSecondary = #6B7280  // Gray-600 - Labels, Descriptions
canvas.textTertiary  = #9CA3AF  // Gray-400 - Placeholders
canvas.textMuted     = #D1D5DB  // Gray-300 - Disabled

// BORDERS & DIVIDERS
canvas.divider      = #E5E7EB  // Gray-200 - Borders, Lines
canvas.focusBorder  = #3B5F52  // Emerald - Active States
```

**Design Principle:** Color for **structure and hierarchy only**, never decoration.

---

## Step 2: Desktop Wireframe (≥1280px)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ HEADER                                               bg: canvas.surface | border-b: canvas.divider │
│ color: canvas.textPrimary                                                                         │
│                                                                                                   │
│ ← Back to Dashboard          LEAN CANVAS                          Progress: 40%    User • Exit   │
│                              text: canvas.textPrimary             color: canvas.primary           │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────────────────────────────────────────────────┬────────────────────────┐
│ LEFT PANEL   │ MAIN PANEL (CANVAS WORK AREA)                            │ RIGHT PANEL            │
│              │                                                           │                        │
│ bg: canvas.bg│ bg: canvas.surface                                        │ bg: canvas.bg          │
│ w: 240px     │ flex-1                                                    │ w: 320px               │
│              │                                                           │                        │
│ ─────────────│ ┌──────────────────────────────────────────────────────┐ │ ──────────────────────│
│ SECTIONS     │ │ LEAN CANVAS GRID (9 BLOCKS)                          │ │ AI INTELLIGENCE       │
│ text: sec    │ │ bg: canvas.surface | gap: 16px                       │ │                        │
│              │ │                                                      │ │ ┌────────────────────┐│
│ • Problem    │ │ ┌──────┬──────┬──────────┐                          │ │ │ SUMMARY            ││
│ • Solution   │ │ │ PROB │ SOLN │ CUSTOMER │                          │ │ │ bg: canvas.surface ││
│ • UVP        │ │ │      │      │ SEGMENTS │                          │ │ │ text: textPrimary  ││
│ • Channels   │ │ │ bg:  │ bg:  │          │                          │ │ │                    ││
│ • Revenue    │ │ │ white│ white│ bg:white │                          │ │ │ 5 of 9 sections    ││
│              │ │ │ bdr: │ bdr: │ bdr:     │                          │ │ │ complete           ││
│ ─────────────│ │ │ div  │ div  │ divider  │                          │ │ │ color: success     ││
│              │ │ └──────┴──────┴──────────┘                          │ │ └────────────────────┘│
│ PROGRESS     │ │                                                      │ │                        │
│              │ │ ┌──────┬───────────────┬──────┐                    │ │ ┌────────────────────┐│
│ [█████░░░░░] │ │ │ CHAN │ UNIQUE VALUE  │ EARLY│                    │ │ │ TOP RISKS          ││
│ 40%          │ │ │ NELS │ PROPOSITION   │ ADOPT│                    │ │ │ bg: canvas.surface ││
│ color: prim  │ │ │      │               │      │                    │ │ │                    ││
│              │ │ │ bg:  │ bg: white     │ bg:  │                    │ │ │ • Unvalidated UVP  ││
│ ─────────────│ │ │ white│ bdr: divider  │ white│                    │ │ │ • No revenue model ││
│              │ │ │ bdr  │               │ bdr  │                    │ │ │ color: canvas.accent││
│ EXPORT       │ │ └──────┴───────────────┴──────┘                    │ │ └────────────────────┘│
│              │ │                                                      │ │                        │
│ [Download]   │ │ ┌──────┬──────┬──────┬──────┐                      │ │ ┌────────────────────┐│
│ bg: primary  │ │ │ KEY  │UNFAIR│ COST │REVEN │                      │ │ │ AI SUGGESTIONS     ││
│ text: white  │ │ │METRIC│ADVANT│STRUCT│STREAM│                      │ │ │ bg: canvas.surface ││
│              │ │ │      │      │      │      │                      │ │ │                    ││
└──────────────┘ │ │ bg:  │ bg:  │ bg:  │ bg:  │                      │ │ │ ✓ Define early     ││
                 │ │ white│ white│ white│ white│                      │ │ │   adopters first   ││
                 │ │ bdr  │ bdr  │ bdr  │ bdr  │                      │ │ │                    ││
                 │ │ div  │ div  │ div  │ div  │                      │ │ │ ✓ Validate problem ││
                 │ └──────┴──────┴──────┴──────┘                      │ │ │   before solution  ││
                 │                                                      │ │ │ color: textSecond  ││
                 │ Each block:                                         │ │ └────────────────────┘│
                 │ • Editable textarea                                 │ │                        │
                 │ • bg: canvas.surface                                │ │ ┌────────────────────┐│
                 │ • border: canvas.divider                            │ │ │ RELATED INSIGHTS   ││
                 │ • focus: canvas.focusBorder                         │ │ │                    ││
                 │ • min-height: 120px                                 │ │ │ Market research    ││
                 │                                                      │ │ │ available →        ││
                 └──────────────────────────────────────────────────────┘ │ │ accent: sage       ││
                                                                           │ └────────────────────┘│
                                                                           └────────────────────────┘
```

**Layout Specs:**
- Left Panel: 240px fixed width
- Main Panel: Flex-1 (expands)
- Right Panel: 320px fixed width
- Canvas Grid: 4-column responsive grid
- Gap: 16px between blocks
- Padding: 24px all panels

---

## Step 3: Mobile Wireframe (<768px)

```
┌────────────────────────────────────┐
│ HEADER                             │
│ bg: canvas.surface                 │
│ border-b: canvas.divider           │
│                                    │
│ ☰  LEAN CANVAS          Progress   │
│    text: textPrimary    [40%]      │
│                         color: prim│
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ CANVAS BLOCKS (Vertical Stack)    │
│ bg: canvas.bg                      │
│ padding: 16px                      │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ PROBLEM                        │ │
│ │ bg: canvas.surface             │ │
│ │ border: canvas.divider         │ │
│ │ [textarea editable]            │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ SOLUTION                       │ │
│ │ bg: canvas.surface             │ │
│ │ [textarea editable]            │ │
│ └────────────────────────────────┘ │
│                                    │
│ ┌────────────────────────────────┐ │
│ │ UNIQUE VALUE PROPOSITION       │ │
│ │ bg: canvas.surface             │ │
│ │ [textarea editable]            │ │
│ └────────────────────────────────┘ │
│                                    │
│ ... (6 more blocks stacked)        │
│                                    │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ AI INSIGHTS (Bottom Sheet)         │
│ bg: canvas.surface                 │
│ border-t: canvas.divider           │
│ transform: translateY(80%)         │
│                                    │
│ ──── Drag Handle ────              │
│                                    │
│ SUMMARY                            │
│ text: textPrimary                  │
│                                    │
│ RISKS                              │
│ color: canvas.accent               │
│                                    │
│ SUGGESTIONS                        │
│ color: canvas.sage                 │
└────────────────────────────────────┘
```

**Mobile Layout:**
- Single column stack
- Blocks full-width with 16px padding
- Bottom sheet AI panel (slide up)
- Sticky header with hamburger menu

---

## Interaction Rules

### User Actions (Manual Only)
- **Edit Canvas Blocks** - User types directly
- **Navigate Sections** - Click left panel items
- **Export Canvas** - Download button (left panel)
- **View Progress** - Auto-updates as fields complete

### AI Actions (Read-Only)
- **Provide Summary** - Right panel top
- **Flag Risks** - Right panel middle (color: accent)
- **Suggest Improvements** - Right panel bottom (color: sage)
- **Never Auto-Fill** - AI cannot edit canvas blocks
- **Never Overwrite** - User data is sacred

### Color Behavior
- **Focus State** - border: canvas.focusBorder (#3B5F52)
- **Completed Sections** - subtle badge (bg: canvas.success)
- **Progress Bar** - fill: canvas.primary
- **Risk Indicators** - text: canvas.accent (#0d5f4e)

---

## Typography Hierarchy

```
Page Title:      36px | Serif | Light | color: canvas.textPrimary
Section Labels:  20px | Serif | Light | color: canvas.textPrimary
Body Text:       14px | Sans  | Normal| color: canvas.textPrimary
Descriptions:    14px | Sans  | Normal| color: canvas.textSecondary
Placeholders:    14px | Sans  | Normal| color: canvas.textTertiary
Disabled:        14px | Sans  | Normal| color: canvas.textMuted
Links:           14px | Sans  | Medium| color: canvas.primary
```

---

## Spacing System

```
Layout Gaps:      16px  (between canvas blocks)
Panel Padding:    24px  (all panels)
Mobile Padding:   16px  (reduced for mobile)
Header Height:    64px  (fixed)
Block Min-Height: 120px (textarea)
```

---

## Component States

```
Default Block:
  bg: canvas.surface (#FFFFFF)
  border: canvas.divider (#E5E7EB)
  text: canvas.textPrimary (#212427)

Hover Block:
  bg: canvas.surfaceHover (#FBF9FA)
  border: canvas.divider (#E5E7EB)

Focus Block (Active Editing):
  bg: canvas.surface (#FFFFFF)
  border: canvas.focusBorder (#3B5F52)
  ring: 2px rgba(59, 95, 82, 0.1)

Completed Block:
  bg: canvas.surface (#FFFFFF)
  border: canvas.focusBorder (#3B5F52)
  badge: canvas.success (#DCF9E3)
```

---

## Grid Specifications (9-Block Canvas)

```
Desktop Grid: 4 columns × 3 rows
Mobile Grid:  1 column × 9 rows

Block Positions:
Row 1: Problem | Solution | Customer Segments (span 2)
Row 2: Channels | UVP (span 2) | Early Adopters
Row 3: Key Metrics | Unfair Advantage | Cost | Revenue

Responsive Breakpoints:
< 768px  = Mobile (1 column)
≥ 768px  = Tablet (2 columns)
≥ 1280px = Desktop (4 columns)
```

---

## What NOT to Include

❌ Gradients or shadows (except subtle focus ring)  
❌ Illustrations or icons (except essential UI)  
❌ Animations or transitions (static wireframe)  
❌ Polished UI (this is strategy-first)  
❌ New colors beyond extracted palette  
❌ Auto-fill or AI overwrite capabilities

---

## Deliverables Summary

✅ **Color Palette Extracted** - 16 tokens from existing style guide  
✅ **Desktop Wireframe** - 3-panel layout with 9-block canvas  
✅ **Mobile Wireframe** - Vertical stack + bottom sheet AI  
✅ **Interaction Rules** - User manual, AI read-only  
✅ **Typography Applied** - Hierarchy with exact colors  
✅ **Spacing Defined** - Consistent 16/24px system  
✅ **Component States** - Default, hover, focus, complete  
✅ **Grid Specs** - 4-col desktop, 1-col mobile  

**Total Lines:** 297 / 300 ✅

---

**END OF DOCUMENT**
