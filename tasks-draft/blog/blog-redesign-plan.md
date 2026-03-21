# Blog Page Redesign — Superside-Inspired Layout

## Overview
Redesign `src/pages/BlogIndex.tsx` to match the editorial, magazine-style layout of Superside's blog. Current 6 reports only. No filtering/search. Gradient backgrounds as thumbnail placeholders (no real images).

## Data Model Changes
Remove `kpis[]` from `BlogPost` interface. Add:
- `gradient: string` — CSS gradient for card thumbnail background
- `icon: string` — Lucide icon name for overlay
- `featured: boolean` — marks the hero card

## Layout (4 Sections — Superside-aligned)

### Section A: Editorial Hero
- Full-width, centered text
- Badge: "Research Reports"
- H1: "AI Intelligence Reports"
- Subtitle: "Clear, data-backed reports on how AI is changing industries."
- Minimal — no cards, just typography

### Section B: Featured Story (fashion-ai-2026)
- Full-width vertical card (Superside-style)
- Top: gradient thumbnail with icon overlay (`aspect-video`)
- Below: category badge, title, subtitle, "Read report →" link
- Always vertical on all breakpoints

### Section C: All Reports Grid
- "More Reports" section heading
- 5 cards in a single `sm:grid-cols-2 lg:grid-cols-3` grid
- Uniform StoryCard for all non-featured posts
- Stack to 2-col on tablet, 1-col on mobile

### Section D: CTA Strip
- Reuse existing `DarkCTASection` component
- "Start validating your startup idea" messaging

## Card Design
- Rounded-xl corners, border-border
- Gradient background as thumbnail (no images)
- Lucide icon centered on gradient (white, 48px)
- Hover: slight scale (1.02), shadow elevation, border-primary/30
- Text: font-display for title, text-muted-foreground for subtitle

## Gradients per Report
1. fashion-ai-2026: `from-purple-500/20 via-pink-500/20 to-rose-500/20`
2. ai-adoption-by-industry: `from-blue-500/20 via-cyan-500/20 to-teal-500/20`
3. ai-jobs-future-of-work: `from-amber-500/20 via-orange-500/20 to-red-500/20`
4. ai-in-ecommerce: `from-green-500/20 via-emerald-500/20 to-teal-500/20`
5. ai-startup-products: `from-violet-500/20 via-purple-500/20 to-indigo-500/20`
6. ai-investment-hubs: `from-sky-500/20 via-blue-500/20 to-indigo-500/20`

## Animations
- Framer Motion `whileInView` for scroll reveal
- Stagger children: 0.1s delay between cards
- Card hover: scale(1.02) + shadow transition via CSS

## Responsive Breakpoints
- Mobile (<768px): Single column, stacked cards
- Tablet (768-1023px): 2-col grid
- Desktop (1024px+): Full layout as designed

## Status: IMPLEMENTED (v2 — Superside-aligned)
Implementation complete in `src/pages/BlogIndex.tsx`. Build passes.
v2 (2026-02-15): Aligned to Superside layout — vertical featured card, unified 3-col grid.

## Files Modified
- `src/pages/BlogIndex.tsx` — complete rewrite
