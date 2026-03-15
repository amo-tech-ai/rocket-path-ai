---
task_id: 008-PDC
title: Pitch Deck Challenger + Persuasion
phase: MVP
priority: P1
status: Not Started
estimated_effort: 1 day
skill: [proposal-strategist, gemeni]
subagents: [code-reviewer, frontend-designer]
edge_function: pitch-deck-agent
schema_tables: [pitch_decks]
depends_on: [001-ALR]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Pitch Deck Editor (slide editor, slide list) |
| **Features** | Win theme labels, Challenger 5-step narrative, persuasion technique badges |
| **Edge Functions** | `pitch-deck-agent` (per-action system prompts) |
| **Real-World** | "Each slide now shows which Challenger step it represents and what persuasion technique it uses" |

## Description

**The situation:** The pitch-deck-agent generates investor slides from startup data. Each slide has a title, content, speaker notes, and optional image. But slides aren't mapped to any narrative framework — they're generated as a flat sequence. Founders don't know which slides serve which persuasion purpose.

**Why it matters:** The Challenger Sale methodology (Warm-up → Reframe → Rational Drowning → Emotional Impact → New Way → Your Solution) is used by top sales teams. Mapping slides to this framework helps founders understand the narrative arc. Persuasion technique labels (social proof, scarcity, authority) help founders present more effectively.

**What already exists:**
- `supabase/functions/pitch-deck-agent/index.ts` — Action router for deck generation
- `supabase/functions/pitch-deck-agent/actions/*.ts` — Per-action handlers with system prompts
- `agency/prompts/pitch-deck-fragment.md` — Win themes, Challenger 5-step, persuasion architecture
- `src/pages/PitchDeckEditor.tsx` — Slide editor

**The build:**
- Import `loadFragment('pitch-deck-fragment')` in pitch-deck-agent
- Append to deck generation system prompt
- Add optional fields per slide: `win_theme` (string), `narrative_step` (warm_up | reframe | rational_drowning | emotional_impact | new_way), `persuasion_technique` (string)
- Frontend: Win theme label above each slide in editor
- Frontend: Narrative step indicator badge on slide thumbnail
- Frontend: Persuasion technique tooltip on slide
- Deploy `pitch-deck-agent`

**Example:** Sarah's deck has 10 slides. Slide 1 "The Content Crisis" maps to "Rational Drowning" (show the pain) with persuasion technique "Loss aversion". Slide 4 "Why ContentAI" maps to "New Way" with "Authority + Social proof". The editor sidebar shows the narrative arc as a vertical stepper.

## Rationale
**Problem:** Slides are a flat sequence with no persuasion framework.
**Solution:** Fragment injects Challenger methodology. Each slide gets a narrative role.
**Impact:** Founders understand the persuasion purpose of each slide.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | see which Challenger step each slide serves | I understand my pitch's narrative arc |
| Founder | see win themes per slide | I know my key selling points |
| Founder | see persuasion techniques | I present each slide more effectively |

## Goals
1. **Primary:** Each generated slide includes narrative step and win theme
2. **Quality:** Existing decks without metadata render unchanged

## Acceptance Criteria
- [ ] `loadFragment('pitch-deck-fragment')` loaded in pitch-deck-agent
- [ ] Generated slides include optional `win_theme`, `narrative_step`, `persuasion_technique`
- [ ] Win theme label shown above slide in editor
- [ ] Narrative step badge on slide thumbnail
- [ ] Persuasion technique shown as tooltip
- [ ] Old decks without new fields render normally
- [ ] `pitch-deck-agent` deployed

| Layer | File | Action |
|-------|------|--------|
| Edge Function | `supabase/functions/pitch-deck-agent/index.ts` | Modify — import loadFragment |
| Actions | `supabase/functions/pitch-deck-agent/actions/*.ts` | Modify — append fragment to prompts |
| Page | `src/pages/PitchDeckEditor.tsx` | Modify — add labels, badges, tooltips |

## Real-World Examples

**Scenario 1 — Full narrative mapping:** Marcus generates a 12-slide deck. The editor sidebar shows: Slides 1-2 = Warm-up, Slides 3-4 = Reframe, Slides 5-6 = Rational Drowning, Slides 7-8 = Emotional Impact, Slides 9-10 = New Way, Slides 11-12 = Your Solution. **With the narrative stepper,** Marcus sees he has too many Warm-up slides and too few Emotional Impact slides.

**Scenario 2 — Existing deck:** Priya opens a deck created before this enhancement. No narrative metadata exists. **With field existence checks,** the editor renders exactly as before — no empty labels, no errors.

## Outcomes

| Before | After |
|--------|-------|
| Slides are a flat numbered list | Each slide mapped to Challenger narrative step |
| No indication of slide purpose | Win theme labels show key selling point per slide |
| No persuasion guidance | Technique badges help founders present effectively |
| No narrative arc visualization | Sidebar stepper shows the 5-step flow |
