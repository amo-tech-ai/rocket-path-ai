# PD-06: Slide Image Generation (Nano Banana)

> **Status:** ✅ 100% Complete | **Priority:** P2 | **Category:** Backend/AI

---

## Summary

AI-generated visuals for each slide type using Gemini 3 Pro Image via Lovable AI Gateway.

---

## Model

| Model | Gateway ID | Purpose |
|-------|------------|---------|
| Nano Banana Pro | `google/gemini-3-pro-image-preview` | Professional pitch deck visuals |

---

## Slide Visual Prompts (from Prompt 12.1)

| Slide Type | Visual | Status |
|------------|--------|--------|
| Title | Abstract brand graphic | ✅ |
| Problem | Pain point diagram | ✅ |
| Solution | "After" visualization | ✅ |
| Product | Process flow | ✅ |
| Market | TAM/SAM/SOM circles | ✅ |
| Traction | Growth chart | ✅ |
| Business Model | Revenue flow | ✅ |
| Competition | 2x2 positioning | ✅ |
| Team | Role icons | ✅ |
| Roadmap | Timeline | ✅ |
| Ask | Allocation pie/bars | ✅ |
| Contact | Clean closing visual | ✅ |

---

## Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `supabase/functions/pitch-deck-agent/ai-utils.ts` | Image generation | ✅ Complete |
| `supabase/functions/pitch-deck-agent/actions/images.ts` | Image actions | ✅ Complete |
| `src/components/pitchdeck/editor/SlideImageGenerator.tsx` | UI Component | ✅ Complete |
| `src/components/pitchdeck/editor/SlideVisualPreview.tsx` | Slide Preview | ✅ Complete |
| `docs/gemini/10-nano-banana-image-generation.md` | Official docs | ✅ Complete |
| `docs/gemini/11-nano-banana-implementation.md` | Implementation guide | ✅ Complete |

---

## Edge Function Actions

| Action | Purpose | Status |
|--------|---------|--------|
| `generate_slide_visual` | Single slide image | ✅ Complete |
| `generate_deck_visuals` | All slides batch | ✅ Complete |
| `regenerate_slide_image` | Re-generate on demand | ✅ Complete |

---

## Global Style Rules (from Prompt 12.1)

| Rule | Requirement |
|------|-------------|
| Background | Light, clean, minimal |
| Color Palette | Neutral + 1 accent color |
| Style | Flat, clean, professional |
| Avoid | Cartoonish, heavy textures, gradients |
| Aspect Ratio | 16:9 |
| Text | Maximum 3-4 words |

---

## Integration Points

| Location | Trigger | Status |
|----------|---------|--------|
| Deck generation | Auto-generate all visuals | ✅ |
| Editor | "Generate Image" button | ✅ |
| Editor | "Regenerate" option | ✅ |
| Editor | Custom prompt dialog | ✅ |

---

## Frontend Components

### SlideImageGenerator
- Quick generate button
- Customize dialog with style selector
- Custom prompt input
- Real-time generation status

### SlideVisualPreview
- Dynamic rendering based on slide type
- Built-in chart/diagram visualizations:
  - TAM/SAM/SOM concentric circles (Market)
  - Growth bar charts (Traction)
  - 2x2 positioning matrix (Competition)
  - Revenue flow diagrams (Business Model)
  - Allocation pie charts (Ask)
  - Team role composition (Team)

---

## Verification Checklist

- [x] Nano Banana docs added to `docs/gemini/`
- [x] AI utils implement Lovable AI Gateway calls
- [x] Image actions handle generation/regeneration
- [x] Editor UI has Generate/Customize buttons
- [x] Slide preview shows generated images
- [x] Built-in charts render for each slide type
- [x] Edge function deployed and working

---

**Last Verified:** January 28, 2026
