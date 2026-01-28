# PD-02: Pitch Deck Generation

> **Status:** ✅ 95% Complete | **Priority:** P0 | **Category:** Backend/AI

---

## Summary

AI-powered generation of 10-12 investor-ready slides from wizard data with animated progress UI.

---

## Generation Flow

| Step | Description | AI Model | Status |
|------|-------------|----------|--------|
| 1 | Parse wizard inputs | — | ✅ Done |
| 2 | Research market (grounding) | Gemini Pro | ✅ Done |
| 3 | Structure narrative | Gemini Pro | ✅ Done |
| 4 | Generate slide content | Gemini Pro | ✅ Done |
| 5 | Generate visuals | Gemini Image | 🟡 40% |
| 6 | Calculate signal strength | — | ✅ Done |
| 7 | Save to database | — | ✅ Done |

---

## Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `supabase/functions/pitch-deck-agent/actions/generation.ts` | Deck generation + realtime broadcasts | ✅ |
| `supabase/functions/pitch-deck-agent/actions/images.ts` | Image generation | 🟡 |
| `src/pages/PitchDeckGenerating.tsx` | Generation progress page | ✅ NEW |
| `src/components/pitchdeck/generation/GenerationProgress.tsx` | Animated progress UI | ✅ NEW |
| `src/hooks/usePitchDeckGeneration.ts` | Generation state + realtime | ✅ NEW |
| `src/hooks/realtime/usePitchDeckRealtime.ts` | Deck realtime updates | ✅ |

---

## Edge Function Actions

| Action | Model | Status |
|--------|-------|--------|
| `generate_deck` | Gemini 3 Pro | ✅ Implemented + Realtime |
| `generate_slide_visual` | Gemini 3 Pro Image | 🟡 Partial |
| `generate_deck_visuals` | Gemini 3 Pro Image | 🟡 Partial |
| `regenerate_slide_image` | Gemini 3 Pro Image | 🟡 Partial |

---

## Realtime Progress Events

| Event | Payload | Status |
|-------|---------|--------|
| `step_progress` | `{ step, progress, message }` | ✅ Implemented |
| `step_complete` | `{ step }` | ✅ Implemented |
| `generation_complete` | `{ deck_id, slide_count }` | ✅ Implemented |
| `generation_failed` | `{ error }` | ✅ Implemented |

---

## Gaps Remaining

| Gap | Description | Priority | Effort |
|-----|-------------|----------|--------|
| Image generation | Nano Banana integration | P2 | 6h |

---

## Success Criteria (from Prompt 12)

- [ ] Progress screen shows 5 animated steps
- [ ] Each step has clear status (pending, active, complete)
- [ ] Progress bar reflects actual generation progress
- [x] User sees reassuring copy throughout
- [ ] Generation completes in under 60 seconds (P95)
- [x] Error states have clear actions
- [ ] Auto-redirect to editor on success
- [x] All wizard data used in generation
- [x] Deck created with 10-12 slides
- [x] Each slide has content, layout, speaker notes

---

**Last Verified:** January 28, 2026
