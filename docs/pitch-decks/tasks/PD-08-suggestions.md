# PD-08: Step 2 AI Suggestion Engine

> **Status:** ✅ 100% Complete | **Priority:** P1 | **Category:** Frontend/Backend

---

## Summary

Context-aware AI Suggestion Engine for Step 2 (Market & Traction) that proposes investor-ready copy for Problem, Solution, and Differentiator fields with one-click apply.

---

## Core Principle

**AI proposes → Human approves → System writes**

Users maintain full control. AI suggestions are advisory, not auto-writing.

---

## Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `supabase/functions/pitch-deck-agent/actions/suggestions.ts` | AI suggestion generation | ✅ |
| `src/hooks/usePitchSuggestions.ts` | Suggestion state management | ✅ |
| `src/components/pitchdeck/wizard/step2/Step2AISuggestionsPanel.tsx` | Right panel UI | ✅ |
| `src/components/pitchdeck/wizard/WizardStep2.tsx` | Enhanced step with AI | ✅ |

---

## Edge Function Actions

| Action | Model | Status |
|--------|-------|--------|
| `pitch_suggestions` | Gemini 3 Flash | ✅ |
| `field_suggestion` | Gemini 3 Flash | ✅ |

---

## AI Prompt Specification

```
SYSTEM ROLE:
You are an investor-grade pitch assistant for StartupAI.

CONTEXT:
- Startup Profile (name, industry, target customer, stage)
- Lean Canvas (problem, solution, UVP, alternatives, unfair advantage)
- Traction & funding stage (users, MRR, growth, stage)

TASK:
Generate 3 variations for each field:
1. Problem (1 sentence, pain-focused, quantified)
2. Core Solution (1 sentence, outcome-focused)
3. Differentiation (1 sentence, clear competitive edge)

RULES:
- Tailor language to startup's industry and stage
- Avoid buzzwords and generic AI claims
- Prefer concrete outcomes over features
- Write as if for a Seed-stage investor deck
- Max 25 words per suggestion
- Include "reason" explaining investor appeal

OUTPUT FORMAT (STRICT JSON):
{
  "problem": [{ "id": "p1", "text": "...", "reason": "..." }],
  "core_solution": [{ "id": "s1", "text": "...", "reason": "..." }],
  "differentiation": [{ "id": "d1", "text": "...", "reason": "..." }]
}
```

---

## UI Behavior

### Panel Layout
- Right panel (320px) sticky to viewport
- Header: "AI Assistant" with refresh button
- Scrollable suggestion cards
- Tips section at top

### Suggestion Card
Each card shows:
- Main text (investor-ready copy)
- Reason (why this works for investors)
- `+Apply` button (visible on hover)

### Interaction Rules
- Click field → show field-specific suggestions
- Click `+Apply` → insert text into target field
- No auto-overwrite
- Undo = normal input edit

---

## Fallback Strategy

If AI API fails:
- Return industry-specific default suggestions
- Log error for monitoring
- Never block user flow

---

## Verification Checklist

- [x] Suggestions reflect startup's actual industry and stage
- [x] No AI writes without user action
- [x] Each suggestion is short, specific, investor-friendly
- [x] Works even if some data is missing
- [x] `+Apply` inserts text correctly
- [x] Panel responsive (hidden on mobile)
- [x] Loading state shows during generation
- [x] Refresh button triggers new suggestions

---

**Last Verified:** January 28, 2026
