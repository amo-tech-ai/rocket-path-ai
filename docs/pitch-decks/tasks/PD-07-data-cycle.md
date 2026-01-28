# PD-07: Pitch Deck Data Cycle

> **Status:** ✅ 90% Complete | **Priority:** P1 | **Category:** Architecture

---

## Summary

Zero-duplication data flow from Onboarding → Lean Canvas → Pitch Deck.

---

## Data Sources

| Source | Data Used | Status |
|--------|-----------|--------|
| Onboarding Wizard | Company, industry, stage, description | ✅ |
| Lean Canvas | Problem, solution, UVP, segments | ✅ |
| Market & Traction | Users, MRR, growth rate | ✅ |
| Industry Pack | Benchmarks, language | ✅ |

---

## User Journey (from Prompt 14)

```
[Onboarding] → [Lean Canvas] → [Pitch Deck] → [Editor]
   (4 steps)     (9 boxes)      (Generate)    (Refine)
```

---

## Data Flow

| Step | Source Table | Target |
|------|--------------|--------|
| 1 | `startups` | Context builder |
| 2 | `wizard_sessions` | Interview answers |
| 3 | `documents` (lean_canvas) | Canvas boxes |
| 4 | AI aggregation | Slide content |
| 5 | `pitch_decks` | Deck storage |
| 6 | `pitch_deck_slides` | Slides storage |

---

## Lean Canvas → Slide Mapping

| Canvas Box | Slide Type | Status |
|------------|------------|--------|
| Problem | Problem slide | ✅ |
| Solution | Solution slide | ✅ |
| UVP | Title/differentiation | ✅ |
| Customer Segments | Market slide | ✅ |
| Revenue Streams | Business Model | ✅ |
| Cost Structure | Financials context | ✅ |
| Key Metrics | Traction slide | ✅ |
| Unfair Advantage | Competition slide | ✅ |
| Channels | Go-To-Market | 🟡 Optional |

---

## Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `supabase/functions/pitch-deck-agent/actions/generation.ts` | Data aggregation | ✅ |
| `supabase/functions/lean-canvas-agent/actions/pitch.ts` | Canvas→pitch mapping | ✅ |

---

## Verification Checklist

- [x] Onboarding data flows to pitch deck
- [x] Lean Canvas boxes map to slides
- [x] Interview answers populate traction
- [x] No duplicate data entry required
- [ ] Traceability shown in editor (source link)
- [ ] Resync from Canvas button

---

**Last Verified:** January 28, 2026
