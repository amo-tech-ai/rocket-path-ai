# PD-06: Slide Image Generation (Nano Banana)

> **Status:** 🟡 40% Complete | **Priority:** P2 | **Category:** Backend/AI

---

## Summary

AI-generated visuals for each slide type using Gemini 3 Pro Image.

---

## Model

| Model | Purpose |
|-------|---------|
| `gemini-3-pro-image-preview` | All pitch deck visuals |

---

## Slide Visual Prompts (from Prompt 12.1)

| Slide Type | Visual | Status |
|------------|--------|--------|
| Title | Abstract brand graphic | 🔴 |
| Problem | Pain point diagram | 🔴 |
| Solution | "After" visualization | 🔴 |
| Product | Process flow | 🔴 |
| Market | TAM/SAM/SOM circles | 🔴 |
| Traction | Growth chart | 🔴 |
| Business Model | Revenue flow | 🔴 |
| Competition | 2x2 positioning | 🔴 |
| Team | Role icons | 🔴 |
| Roadmap | Timeline | 🔴 |
| Ask | Allocation pie/bars | 🔴 |
| Contact | Clean closing visual | 🔴 |

---

## Implementation Files

| File | Purpose | Status |
|------|---------|--------|
| `supabase/functions/pitch-deck-agent/actions/images.ts` | Image generation | 🟡 Partial |

---

## Edge Function Actions

| Action | Purpose | Status |
|--------|---------|--------|
| `generate_slide_visual` | Single slide image | 🟡 Stub |
| `generate_deck_visuals` | All slides batch | 🟡 Stub |
| `regenerate_slide_image` | Re-generate on demand | 🟡 Stub |

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
| Deck generation | Auto-generate all visuals | 🔴 |
| Editor | "Generate Image" button | 🔴 |
| Editor | "Regenerate" option | 🔴 |

---

## Gaps Identified

| Gap | Description | Priority | Effort |
|-----|-------------|----------|--------|
| Gemini Image API | Full implementation | P2 | 8h |
| Storage bucket | Image storage (Cloudinary/Supabase) | P2 | 2h |
| Slide image_url | Link generated images | P2 | 1h |
| Editor UI | Image preview + regenerate | P2 | 3h |

---

**Last Verified:** January 28, 2026
