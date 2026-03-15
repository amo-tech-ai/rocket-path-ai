---
task_id: AGN-03
title: Pitch Deck Editor — Agency Enhancement
phase: P2
priority: P1
status: Draft
agents: [proposal-strategist, sales-coach]
fragments: [agency/prompts/pitch-deck-fragment.md]
edge_functions: [pitch-deck-agent]
existing_components: [PitchDeckEditor, SlideEditor, SlidePreview, ExportModal]
schema_tables: [pitch_decks, startups, validator_reports]
---

# Implementation Prompt

> Enhance the Pitch Deck Editor (`src/pages/PitchDeckEditor.tsx`) with agency framework features. Inject
> `pitch-deck-fragment.md` into the `pitch-deck-agent` edge function via `loadFragment()`. Add three UI
> elements: (1) win theme badges per slide showing which recurring strength the slide reinforces, (2)
> Challenger narrative indicator showing the 5-step story arc position (insight→cost→new way→reveal→CTA),
> (3) persuasion architecture overlay showing which cognitive bias each slide exploits. Update AI generation
> to produce slides following Challenger Sale methodology with loss-framed urgency and quantified outcomes.

---

## User Journey

```
Founder arrives from Validator Report ("Generate Deck")
  OR opens Pitch Deck Editor directly
     │
     ▼
[Deck Editor loads] ─── Existing slides shown in left rail
     │
     ▼
[Generate Deck] ─── Click "Generate with AI" in toolbar
     │                 ├── pitch-deck-agent generates 10-12 slides
     │                 ├── Each slide tagged with WIN THEME it reinforces
     │                 ├── Slides follow CHALLENGER 5-step arc
     │                 ├── Persuasion architecture applied per slide
     │                 └── Loss-framed urgency in problem/cost slides
     ▼
[Slide Editor] ─── Edit individual slides
     │               ├── Win theme badge in top-right corner
     │               ├── Narrative position indicator (Act 1-5)
     │               ├── Persuasion tag shows cognitive bias used
     │               └── AI suggests improvements per slide
     ▼
[Deck Review] ─── Full deck narrative check
     │              ├── Story arc completeness (all 5 acts present?)
     │              ├── Win theme coverage (each theme hit 2-3x?)
     │              ├── Persuasion balance (not over-relying on one bias)
     │              └── Missing slides flagged
     ▼
[Export] ─── PDF / PPTX / Shareable Link
               ├── Speaker notes include persuasion rationale
               └── Win themes listed in appendix slide
```

---

## ASCII Wireframe — Desktop (3-Panel)

```
+--------------------------------------------------------------------------+
| [=] StartupAI                                         [?] [Bell] [AV]    |
+--------------------------------------------------------------------------+
|     |                                                  |                  |
| NAV | PITCH DECK EDITOR              [Generate] [PDF]  | AI PANEL        |
| RAIL|                                                  |                  |
|     | SLIDE RAIL        SLIDE CANVAS                   | ┌──────────────┐ |
|     | ┌───────────┐    ┌──────────────────────────┐   | │ Win Themes   │ |
|     | │ 1. Title  │    │                          │   | │              │ |
|     | │ [Insight] │    │   DentAI                  │   | │ ┌──────────┐ │ |
|     | │ ♦ Primacy │    │   Predictive Scheduling   │   | │ │ "AI cuts │ │ |
|     | └───────────┘    │   for Dental Clinics      │   | │ │ no-shows │ │ |
|     | ┌───────────┐    │                          │   | │ │ by 40%"  │ │ |
|     | │ 2. Problem│    │   ┌──────────────────┐   │   | │ └──────────┘ │ |
|     | │ [Cost]    │    │   │ Win Theme:       │   │   | │ ┌──────────┐ │ |
|     | │ ♦ Loss    │    │   │ ♦ AI cuts no-    │   │   | │ │ "First   │ │ |
|     | └───────────┘    │   │   shows by 40%   │   │   | │ │ dental-  │ │ |
|     | ┌───────────┐    │   └──────────────────┘   │   | │ │ vertical │ │ |
|     | │ 3. Stakes │    │                          │   | │ │ AI"      │ │ |
|     | │ [Cost]    │    │   Narrative: [1/5 Insight]│   | │ └──────────┘ │ |
|     | │ ♦ Loss    │    │   Persuasion: [Primacy]  │   | │              │ |
|     | └───────────┘    │                          │   | │ ────────────  │ |
|     | ┌───────────┐    └──────────────────────────┘   | │              │ |
|     | │ 4. NewWay │                                    | │ NARRATIVE    │ |
|     | │ [New Way] │    ──── STORY ARC INDICATOR ────  | │ ARC CHECK    │ |
|     | │ ♦ Anchor  │    │                            │  | │              │ |
|     | └───────────┘    │ ①Insight ②Cost ③NewWay     │  | │ ✓ Insight    │ |
|     | ┌───────────┐    │    ④Reveal  ⑤CTA           │  | │ ✓ Cost       │ |
|     | │ 5. Proof  │    │                            │  | │ ✓ New Way    │ |
|     | │ [Reveal]  │    │ [●][●][○][○][○]            │  | │ ✗ Reveal     │ |
|     | │ ♦ Social  │    │  ▲ You are here            │  | │ ✗ CTA        │ |
|     | └───────────┘    │                            │  | │              │ |
|     | ┌───────────┐    └────────────────────────────┘  | │ PERSUASION   │ |
|     | │ 6. Trxn   │                                    | │ BALANCE      │ |
|     | │ [Reveal]  │                                    | │              │ |
|     | │ ♦ Proof   │                                    | │ Primacy:  2  │ |
|     | └───────────┘                                    | │ Loss:     2  │ |
|     | ┌───────────┐                                    | │ Anchor:   1  │ |
|     | │ 7. Team   │                                    | │ Social:   2  │ |
|     | │ [Reveal]  │                                    | │ Recency:  1  │ |
|     | │ ♦ Authority│                                   | │              │ |
|     | └───────────┘                                    | │ ⚠ Missing:   │ |
|     | ┌───────────┐                                    | │ Scarcity     │ |
|     | │ 8. Ask    │                                    | │              │ |
|     | │ [CTA]     │                                    | │ ┌──────────┐ │ |
|     | │ ♦ Recency │                                    | │ │ Improve  │ │ |
|     | └───────────┘                                    | │ │ this     │ │ |
|     |                                                  | │ │ slide    │ │ |
|     |                                                  | │ └──────────┘ │ |
|     |                                                  | └──────────────┘ |
+--------------------------------------------------------------------------+
```

---

## ASCII Wireframe — Mobile (< 768px)

```
+----------------------------------+
| [=] StartupAI        [?] [Bell]  |
+----------------------------------+
|                                  |
| PITCH DECK EDITOR    [AI] [PDF]  |
|                                  |
| [◁] Slide 1 of 8  [▷]          |
|                                  |
| ┌────────────────────────────┐  |
| │                            │  |
| │   DentAI                   │  |
| │   Predictive Scheduling    │  |
| │   for Dental Clinics       │  |
| │                            │  |
| │   ♦ AI cuts no-shows 40%  │  |
| │                            │  |
| │ [Insight]  [Primacy]       │  |
| └────────────────────────────┘  |
|                                  |
| STORY ARC                        |
| [●][●][○][○][○] 2/5             |
|                                  |
| ┌────────────────────────────┐  |
| │ [AI] Improve this slide    │  |
| └────────────────────────────┘  |
+----------------------------------+
```

---

## Content & Data

### Slide Card (ENHANCED)

| Field | Source | Example |
|-------|--------|---------|
| `title` | `pitch_decks.deck_json.slides[i].title` | "The $32B Problem" |
| `win_theme` | `pitch_decks.deck_json.slides[i].win_theme` (NEW) | `"ai_reduces_noshows"` |
| `narrative_position` | `pitch_decks.deck_json.slides[i].narrative_position` (NEW) | `"insight"` / `"cost"` / `"new_way"` / `"reveal"` / `"cta"` |
| `persuasion_type` | `pitch_decks.deck_json.slides[i].persuasion_type` (NEW) | `"primacy"` / `"loss_aversion"` / `"anchoring"` / `"social_proof"` / `"recency"` / `"scarcity"` / `"authority"` |
| `speaker_notes` | `pitch_decks.deck_json.slides[i].speaker_notes` | Notes with persuasion rationale |

### Challenger Narrative Arc (5 Steps)

| Step | Slide Type | Purpose | Tone |
|------|-----------|---------|------|
| 1. Insight | Title / Problem | Reframe the world | "Here's what you're missing" |
| 2. Cost | Stakes / Impact | Quantify inaction cost | "$2.3M/year in waste" |
| 3. New Way | Solution / Demo | Present new approach | "There's a better way" |
| 4. Reveal | Proof / Traction | Prove it works | "Here's the evidence" |
| 5. CTA | Ask / Timeline | Drive action | "Join us now" |

### Win Theme Architecture

| Field | Source | Example |
|-------|--------|---------|
| `win_themes` | `validator_reports.details.win_themes[]` | `["AI reduces no-shows by 40%", "First dental-vertical AI"]` |
| Theme per slide | Computed from slide content | Each slide reinforces 0-1 themes |
| Coverage target | Computed | Each theme should appear 2-3 times |

### Persuasion Architecture

| Bias | Where Used | Deck Position | Effect |
|------|-----------|---------------|--------|
| Primacy | Slide 1 (Title) | Opening | First impression anchors perception |
| Loss aversion | Slides 2-3 (Problem/Stakes) | Early | Fear of loss > desire for gain |
| Anchoring | Slide 4 (Solution) | Middle | Set reference point for value |
| Social proof | Slides 5-6 (Traction/Testimonials) | Middle-late | Others validate the claim |
| Authority | Slide 7 (Team) | Late | Expert credibility |
| Scarcity | Slide 7-8 (Timeline/Ask) | Late | Limited window to act |
| Recency | Slide 8 (Ask/CTA) | Closing | Last thing remembered |

---

## Agency Features — Before / After

| Feature | Before (current) | After (with agency) |
|---------|-------------------|---------------------|
| Slide generation | Generic slides from profile data | Challenger 5-step narrative arc |
| Slide content | Feature-focused | Win-theme-reinforced with loss framing |
| Narrative structure | No story arc | Insight→Cost→New Way→Reveal→CTA tracked |
| Persuasion | No awareness of cognitive bias | Each slide tagged with persuasion type |
| Speaker notes | Basic talking points | Include persuasion rationale + delivery cues |
| Deck review | No quality check | Arc completeness, theme coverage, bias balance |
| Win themes | Not present | 2-3 recurring strengths from validator report |

---

## Agent & Fragment Wiring

```
pitch-deck-agent/index.ts
  │
  └── INJECT: loadFragment('pitch-deck-fragment')
        ├── Win Theme Architecture: Extract 2-3 from validator report
        │     └── Map themes to slides (each theme hit 2-3x)
        ├── Challenger Narrative: 5-step arc
        │     └── insight → cost → new_way → reveal → cta
        ├── Persuasion Architecture: 7 cognitive biases
        │     └── primacy, loss_aversion, anchoring, social_proof,
        │         authority, scarcity, recency
        ├── Loss Framing: Cost of inaction > benefit of action
        └── OUTPUT: slides[].win_theme, .narrative_position,
                    .persuasion_type, .speaker_notes
```

---

## Workflows

| Trigger | AI Action | UI Update |
|---------|-----------|-----------|
| Click "Generate with AI" | `pitch-deck-agent` generates 10-12 Challenger slides | Slide rail populates with narrative/persuasion tags |
| Select a slide | Show slide metadata | Win theme badge, arc position, persuasion tag visible |
| Click "Improve this slide" | AI suggests stronger copy + better bias alignment | Suggestion appears in AI panel |
| Click arc indicator | Highlight slides in that arc position | Slide rail filters/highlights matching slides |
| Complete deck | AI checks arc completeness + theme coverage | Warnings if missing arc steps or unbalanced persuasion |
| Export to PDF | Speaker notes include persuasion cues | PDF generated with notes |
| Click win theme badge | Filter to slides using that theme | Slide rail highlights matching slides |
