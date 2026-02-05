---
name: pitch-deck
description: Use this skill when building pitch deck features - slide generation, industry-specific templates, investor psychology, deck review/critique, and presentation export. Triggers on "pitch deck", "investor presentation", "slide deck", "pitch slides", "deck review", "investor pitch".
---

# Pitch Deck

## Overview

Generate and refine investor-ready pitch decks with industry-specific templates, AI-powered content generation, investor psychology insights, and automated critique for identifying red flags and "elephant in the room" questions.

## When to Use

- Generating pitch deck slides
- Building industry-specific deck templates
- Implementing deck review/critique features
- Creating smart interview wizards for deck content
- Designing deck export functionality

## Deck Generation Workflow

```
STEP 1: TEMPLATE SELECTION
├── Industry-specific template
├── Stage-appropriate emphasis
└── Slide count recommendation

STEP 2: SMART INTERVIEW
├── 8-10 industry questions
├── Pre-filled from profile/canvas
└── AI suggestions for each answer

STEP 3: CONTENT GENERATION
├── All slides with bullets
├── Data visualization suggestions
└── Speaker notes

STEP 4: VISUAL ENHANCEMENT
├── Layout recommendations
├── Chart/graph suggestions
└── Image recommendations

STEP 5: REVIEW & REFINE
├── Critic agent analysis
├── Elephant questions identified
├── Red flags highlighted
└── Improvement suggestions
```

## Slide Structure

| # | Slide | Time | Content Focus |
|---|-------|------|---------------|
| 1 | Cover | 30s | Company name, one-liner, logo |
| 2 | Problem | 1m | Pain point with data, who/struggle/why-now |
| 3 | Solution | 1m | How you solve it, before/after |
| 4 | Market | 1m | TAM/SAM/SOM with bottom-up |
| 5 | Product | 2m | Demo, screenshots, key features |
| 6 | Business Model | 1m | How you make money, pricing |
| 7 | Traction | 1m | Growth metrics, logos, quotes |
| 8 | Competition | 1m | Positioning matrix (honest!) |
| 9 | Team | 1m | Founder-market fit, achievements |
| 10 | Financials | 1m | 18-month projection, key metrics |
| 11 | Ask | 30s | Amount, use of funds breakdown |
| 12 | Appendix | - | Detailed data, backup slides |

## Industry-Specific Emphasis

| Industry | Slide Emphasis | Unique Slides | Investor Psychology |
|----------|---------------|---------------|---------------------|
| **SaaS** | Traction, Retention | Net Revenue Retention | NRR >120% signals PMF |
| **FinTech** | Compliance, Trust | Regulatory Pathway | Regulatory moat matters |
| **Healthcare** | Clinical Evidence | FDA/CE Pathway | Clinical validation required |
| **Marketplace** | Liquidity, Take Rate | Supply/Demand Balance | Network effects proof |
| **AI/ML** | Data Moat, Accuracy | Technical Architecture | Defensibility beyond model |
| **eCommerce** | Unit Economics, CAC | Customer Acquisition | Before/after merchant data |

## Slide Templates

### Problem Slide Template

```typescript
interface ProblemSlide {
  headline: string;        // "X million [personas] lose $Y annually to [problem]"
  data_point: {
    stat: string;          // "$500B lost annually"
    source: string;        // "Gartner 2025"
  };
  who: string;             // "Mid-market finance teams"
  struggle: string;        // "Spend 20+ hours/week on manual reconciliation"
  why_now: string;         // "Remote work made collaboration 3x harder"
  visual: string;          // "Pain cycle diagram" | "Cost breakdown chart"
}
```

### Traction Slide Template

```typescript
interface TractionSlide {
  headline: string;        // "10x growth in 12 months"
  primary_metric: {
    value: string;         // "$500K ARR"
    growth: string;        // "10x in 12 months"
  };
  secondary_metrics: {
    name: string;          // "Customers"
    value: string;         // "50+"
  }[];
  logos: string[];         // Customer logos (4-6)
  quote: {
    text: string;
    attribution: string;
  };
  chart: 'hockey_stick' | 'bar_growth' | 'cohort';
}
```

### Team Slide Template

```typescript
interface TeamSlide {
  founders: {
    name: string;
    role: string;
    achievement: string;   // "Built X at Y" > "VP at Z"
    photo_url: string;
  }[];
  key_hires: string[];     // "Hiring: CTO (ex-Google), Head of Sales"
  advisors: string[];      // Notable advisors
  founder_market_fit: string; // Why this team for this problem
}
```

## Critic Agent

```typescript
interface DeckCritique {
  overall_score: number;   // 0-100
  strengths: string[];
  weaknesses: string[];
  red_flags: RedFlag[];
  elephant_questions: string[];
  improvement_suggestions: {
    slide: number;
    current: string;
    suggested: string;
    reasoning: string;
  }[];
}

interface RedFlag {
  slide: number;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
}

// Common red flags
const RED_FLAGS = [
  { pattern: /no competitors/i, issue: "Claiming no competitors", severity: 'high' },
  { pattern: /viral/i, issue: "Relying on 'going viral'", severity: 'medium' },
  { pattern: /AI-powered/i, issue: "Generic AI buzzwords", severity: 'medium' },
  { pattern: /disrupt/i, issue: "Overused startup jargon", severity: 'low' }
];

// Elephant questions by industry
const ELEPHANT_QUESTIONS = {
  fintech: ["How do you handle regulatory compliance?", "What's your licensing status?"],
  healthcare: ["What's your FDA pathway?", "Do you have clinical evidence?"],
  marketplace: ["How do you solve chicken-and-egg?", "What's your take rate?"],
  saas: ["What's your net revenue retention?", "Why will enterprise buy from you?"]
};
```

## Smart Interview Questions

```typescript
const DECK_INTERVIEW = {
  problem: [
    "What specific problem do you solve?",
    "Who experiences this problem most acutely?",
    "How do they solve it today?",
    "What's the cost of the problem (time, money, pain)?"
  ],
  solution: [
    "How does your solution work?",
    "What's the 'before and after' for users?",
    "What's the core technology/innovation?"
  ],
  traction: [
    "What's your current revenue/users?",
    "What's your growth rate?",
    "Who are your notable customers?",
    "What's your best customer quote?"
  ],
  ask: [
    "How much are you raising?",
    "What will you use the funds for?",
    "What milestones will this achieve?",
    "What's your next funding timeline?"
  ]
};
```

## Universal Deck Rules

| Rule | Application |
|------|-------------|
| **Problem = numbers** | Cost, time, risk — never just qualitative |
| **Solution = before/after** | Transformation, not feature list |
| **Traction = graph-ready** | Numbers with timeframes |
| **Competition = honest** | Never "no competitors" |
| **Team = achievements** | "Built X at Y" > "VP of Engineering" |
| **Ask = specific** | "$2M seed: 50% product, 30% GTM, 20% ops" |

## Edge Function: `pitch-deck-agent`

```typescript
// Actions
- 'select_template': Choose template based on industry/stage
- 'interview': Run smart interview for content
- 'generate': Create all slides from answers
- 'critique': Run critic agent analysis
- 'suggest_visuals': Recommend charts/images
- 'export': Generate PDF/PPTX/Google Slides
```

## AI Model Selection

| Task | Model |
|------|-------|
| Template selection | `gemini-3-flash-preview` |
| Interview questions | `gemini-3-flash-preview` |
| Slide generation | `claude-sonnet-4-5-20250929` |
| Critique/Red flags | `claude-sonnet-4-5-20250929` |
| Visual suggestions | `gemini-3-pro-preview` |

## References

- PRD Section 10: Pitch Deck System
- Strategy Section 8: Investor Materials
- Diagram D-12: Pitch Deck Flow
- `/startup-system/guides/09-pitch-prompts.md`
