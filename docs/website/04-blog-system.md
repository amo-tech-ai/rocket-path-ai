# Blog System Architecture

## Overview

Premium infographic-style blog system for StartupAI research reports.

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/blog` | `BlogIndex.tsx` | Blog listing with cards grid |
| `/blog/:slug` | `BlogPost.tsx` | Individual report pages |

## Report Pages (5 Initial)

| Slug | Title | Status |
|------|-------|--------|
| `ai-adoption-by-industry` | AI Adoption by Industry — 2025 | ✅ |
| `ai-jobs-future-of-work` | AI Jobs & Future of Work — 2024–2026 | ✅ |
| `ai-in-ecommerce` | AI in E-commerce | ✅ |
| `ai-startup-products` | AI Startup Products | ✅ |
| `ai-investment-hubs` | Leading AI Investment Hubs | ✅ |

## Component Library

### Layout Components
- `ReportHero` - Hero section with KPI cards
- `ReportSection` - Section wrapper with scroll animations
- `ReportFooter` - Sources & methodology

### Content Components
- `KpiCard` - Large stat display with count-up animation
- `InsightCard` - 2-column insight cards
- `DataTable` - Premium styled tables
- `PullQuote` - Editorial callout quotes
- `FlowDiagram` - Step-by-step visual flows
- `ComparisonGrid` - Side-by-side comparisons
- `SourceBadge` - Linked source citations

### Animation System
- Scroll-triggered fade + translate (8-12px)
- Count-up numbers (600-900ms)
- Respects `prefers-reduced-motion`

## Visual Identity

Following `/docs/style-guide.md`:
- Background: `#FAFAF8` (off-white)
- Primary accent: `#0D5F4E` (deep emerald)
- Headlines: Playfair Display (serif)
- Body: Inter (sans-serif)
- Generous spacing, thin borders

## File Structure

```
src/
├── pages/
│   ├── BlogIndex.tsx
│   └── BlogPost.tsx
├── components/
│   └── blog/
│       ├── ReportHero.tsx
│       ├── ReportSection.tsx
│       ├── KpiCard.tsx
│       ├── InsightCard.tsx
│       ├── DataTable.tsx
│       ├── PullQuote.tsx
│       ├── FlowDiagram.tsx
│       ├── SourceBadge.tsx
│       └── reports/
│           ├── AiAdoptionReport.tsx
│           ├── AiJobsReport.tsx
│           ├── AiEcommerceReport.tsx
│           ├── AiStartupProductsReport.tsx
│           └── AiInvestmentHubsReport.tsx
```

## SEO Implementation

- Dynamic `<title>` and `<meta>` per report
- Semantic HTML structure (article, section, header)
- JSON-LD structured data for articles
- Open Graph meta tags
