---
task_number: "04"
title: "Pitch Deck Generator"
category: "Pitch Deck"
subcategory: "Pitch Deck Wizard"
phase: 2
priority: "P1"
status: "Open"
percent_complete: 10
owner: "Frontend Developer"
---

# Lovable Prompt: Pitch Deck Generator

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/pitch` - Pitch deck builder |
| **Features** | 5-step wizard, AI slide generation, industry templates, critic review, export |
| **Agents** | Deck Writer (Claude Sonnet), Critic Agent (Claude Sonnet), Slide Refiner (Gemini Flash) |
| **Use Cases** | Investor pitch prep, demo day, fundraising, partnership presentations |
| **Duration** | 10-15 minutes (generation), 30 min (refinement) |
| **Outputs** | 10-12 slide deck, critique report, presenter notes |

---

## Description

Build a pitch deck generator that creates investor-ready slides using industry-specific templates, terminology, and benchmarks. The 5-step wizard guides founders through key information gathering, then AI generates slides with a built-in critic that reviews for investor appeal. Each slide can be refined individually.

---

## Purpose & Goals

**Purpose:** Help founders create pitch decks that speak the investor's language for their specific industry.

**Goals:**
1. Generate industry-specific slides (not generic startup templates)
2. Include benchmarks and metrics investors expect
3. Critic review catches weak slides before investors do
4. Export to multiple formats (web, PDF, PPTX)
5. Presenter notes help founders deliver confidently

**Outcomes:**
- Decks include industry-appropriate metrics and terminology
- Critic catches at least 3 improvement opportunities per deck
- Time to first complete deck < 15 minutes

---

## Real World Examples

**Example 1: FinTech Deck - Traction Slide**
> Alex generates his FinTech pitch deck. The Traction slide AI writes: "Transaction Volume: $2.3M processed (18% MoM growth). Fraud Rate: 0.02% vs. industry average 0.5%. Regulatory Status: MSB registration complete, pursuing MTL in 5 states." The critic notes: "Strong fraud metrics. Add CAC payback period—FinTech investors always ask."

**Example 2: Healthcare Deck - Solution Slide**
> Dr. Patel's Healthcare AI deck Solution slide reads: "FDA 510(k) cleared decision support tool. Reduces diagnostic time by 67%. Integrated with Epic, Cerner, MEDITECH. HIPAA compliant with BAA template ready." The critic approves: "Good regulatory and integration coverage. Consider adding clinical validation data from your pilot."

**Example 3: B2B SaaS Deck - Ask Slide**
> Jennifer's SaaS Ask slide shows: "Raising $3M Seed. Use of Funds: 50% Engineering (team of 5), 30% Sales (2 AEs), 20% Marketing. 18-month runway. Targeting 50 enterprise customers at $50K ACV = $2.5M ARR." The critic suggests: "Add expected CAC and payback. Enterprise investors will calculate unit economics from your numbers."

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Slide Navigator** | Thumbnail list of all slides |
| **Deck Score** | Overall investor-readiness score |
| **Critique Summary** | Issues found per slide (red/yellow dots) |
| **Template Selector** | Industry template options |
| **Export Options** | PDF, PPTX, Web link |
| **Presenter Mode** | Full-screen presentation |

### Main Panel: Work Area

| Mode | Main Content |
|------|--------------|
| **Wizard Mode (5 Steps)** | Information gathering: 1) Basics, 2) Problem/Solution, 3) Traction/Metrics, 4) Business Model, 5) Ask/Use of Funds |
| **Slide Editor** | Single slide view with content editor, layout options, image placeholders |
| **Full Deck View** | All slides in grid, drag to reorder |
| **Critique View** | Side-by-side: slide on left, critic feedback on right |

**Standard Deck Structure:**
```
1. Cover (Company, one-liner, logo)
2. Problem (Pain points, market gap)
3. Solution (How you solve it)
4. Product (Demo, screenshots, features)
5. Market (TAM, SAM, SOM)
6. Traction (Metrics, growth, milestones)
7. Business Model (Revenue, pricing)
8. Competition (Positioning, moat)
9. Team (Founders, advisors)
10. Financials (Projections, unit economics)
11. Ask (Funding, use of funds, milestones)
```

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **Critic Agent** | Real-time feedback on current slide |
| **Investor Lens** | "What investors will think when they see this" |
| **Industry Benchmarks** | "Good traction for {industry} at your stage" |
| **Slide Examples** | Successful deck examples for this slide type |
| **Terminology Check** | "Consider using '{term}' instead of '{weak_term}'" |
| **Presenter Notes** | Suggested talking points for current slide |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `PitchDeckWizard` | 5-step information gathering |
| `SlideEditor` | Individual slide content editing |
| `SlideNavigator` | Left panel thumbnail navigation |
| `CriticPanel` | Right panel AI critique |
| `DeckGrid` | All slides overview |
| `PresenterMode` | Full-screen presentation |
| `ExportModal` | PDF, PPTX, Web link options |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `pitch-deck-agent` | Wizard completion | wizard_data, industry | full deck JSON |
| `prompt-pack` | "Generate slide" | action=run, slide_type | slide content |
| `industry-expert-agent` | Slide review | action=pitch_feedback | critique |

### Data Flow

```
Wizard Input → Profile/Canvas Data → Deck Writer → Slide Generation
      ↓                ↓                  ↓              ↓
  User answers    Auto-populated     Industry pack   10-12 slides
      ↓                ↓                  ↓              ↓
  Problem, ask    Traction data     Terminology     Draft deck
      ↓                ↓                  ↓              ↓
  Critic review   Benchmark check   Refinement     Final deck
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `pitch_decks` | `template`, `industry_pack`, `wizard_data`, `critique` | Deck creation |
| `pitch_deck_slides` | `deck_id`, `slide_number`, `slide_type`, `title`, `content`, `notes`, `layout` | Per slide |
| `startups` | Read: `problem_statement`, `solution`, `traction`, `team` | Pre-fill wizard |
| `lean_canvases` | Read: all boxes | Pre-fill relevant slides |
| `ai_runs` | `action=pitch_*, feature_context=pitch_deck` | AI calls |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `generate_deck` | pitch-deck-agent | Claude Sonnet | investor_expectations, success_stories, slide_emphasis |
| `generate_slide` | prompt-pack | Claude Sonnet | Industry-specific for slide type |
| `critique_deck` | industry-expert-agent | Claude Sonnet | warning_signs, investor_questions |
| `refine_slide` | prompt-pack | Gemini Flash | terminology |
| `add_presenter_notes` | pitch-deck-agent | Gemini Flash | investor_questions |

---

## AI Agent Behaviors

### Deck Writer Agent
- **Trigger:** Wizard completion
- **Autonomy:** Act with approval (generates deck, user reviews)
- **Behavior:** Creates full deck from wizard inputs + profile + canvas data
- **Output:** `{ slides: [{ slide_number, slide_type, title, content, notes }], deck_score: number }`

### Critic Agent
- **Trigger:** Deck generation complete, or on-demand per slide
- **Autonomy:** Suggest (shows issues, user decides to fix)
- **Behavior:** Reviews deck as skeptical investor, identifies weak spots
- **Output:** `{ overall_score, slide_critiques: [{ slide_number, issues: [], suggestions: [] }] }`

### Slide Refiner Agent
- **Trigger:** "Improve this slide" button
- **Autonomy:** Act with approval (offers improved version, user accepts)
- **Behavior:** Rewrites slide content with industry terminology and better structure
- **Output:** `{ improved_content, changes_made: [] }`

---

## Slide Type Templates

| Slide Type | AI Focus | Industry Variance |
|------------|----------|-------------------|
| **Cover** | Memorable one-liner, logo placement | Industry-specific taglines |
| **Problem** | Specific pain, quantified cost | FinTech: regulatory burden; Healthcare: diagnostic delays |
| **Solution** | Clear how, not what | Demo-able, tangible |
| **Product** | Screenshots, architecture | Tech-appropriate depth |
| **Market** | TAM/SAM/SOM with sources | Industry-specific sources |
| **Traction** | Industry metrics | SaaS: ARR, NRR; Marketplace: GMV, take rate |
| **Business Model** | Pricing model fit | Usage, seat, transaction-based |
| **Competition** | Positioning, not feature matrix | Moat emphasis |
| **Team** | Relevant experience | Domain expertise highlighted |
| **Financials** | Unit economics | Industry-specific KPIs |
| **Ask** | Clear use of funds | Stage-appropriate milestones |

---

## Acceptance Criteria

- [ ] Wizard collects enough data to generate complete deck
- [ ] Generated slides use industry-specific terminology
- [ ] Critic identifies at least 3 improvement opportunities
- [ ] Slides can be edited individually without regenerating whole deck
- [ ] Drag-and-drop reordering works
- [ ] Export produces professional PDF and PPTX
- [ ] Presenter notes generated for each slide
- [ ] Industry benchmarks shown for traction metrics
- [ ] Mobile responsive (single slide view)
- [ ] Undo/redo works for edits

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `pitch_decks` table | ✅ Ready | Schema matches PRD |
| `pitch_deck_slides` table | ✅ Ready | Uses deck_id, slide_number |
| `pitch-deck-agent` edge function | ✅ Ready | Handles generation |
| `industry-expert-agent` | ✅ Ready | pitch_feedback action |
| Claude Sonnet API | ✅ Ready | For quality writing |
| PPTX export library | ⚠️ Needs selection | pptxgenjs or officegen |
| Slide layout system | ⚠️ Needs design | Template components |
