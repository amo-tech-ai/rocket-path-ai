---
name: corporate-image-style
description: Use when generating images that need professional, corporate, or editorial aesthetics with neutral natural colors — not neon, not sci-fi, not oversaturated. Triggers on "normal colors", "professional", "corporate style", "BCG style", "consulting look", "editorial photography", "too green", "too dark", "neutral palette", "natural colors", "Superside style", "clean modern imagery".
---

# Corporate Image Style

Generate images with neutral, natural, professional color palettes inspired by top-tier consulting and creative agency websites (BCG, Superside, McKinsey). This skill fixes the "too green / too dark / too neon" problem common with AI-generated tech imagery.

## The Problem

Default AI image prompts for tech/SaaS produce:
- Dark backgrounds with neon glowing elements
- Single-color dominance (mint green, electric blue)
- Sci-fi 3D renders that look artificial
- Oversaturated, unrealistic lighting

## The Solution: Corporate Color System

### Primary Palette (BCG-inspired)

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Deep base | Forest green | `#00291C` | Backgrounds, text overlays |
| Primary | Emerald | `#025645` | Accents, borders |
| Secondary | Sage | `#337B68` | Supporting elements |
| Warm accent | Gold | `#D9B95B` | CTAs, highlights, data viz |
| Warm accent alt | Amber | `#E6B437` | Charts, badges |

### Neutral Palette (Superside-inspired)

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Warm white | `#FAFAF8` | Page backgrounds |
| Surface | Light gray | `#F3F3F0` | Cards, sections |
| Border | Warm gray | `#E5E5E0` | Dividers, subtle lines |
| Text secondary | Medium gray | `#6B7280` | Captions, metadata |
| Text primary | Charcoal | `#1F2937` | Headlines, body text |
| Black | Near-black | `#111827` | High contrast elements |

### Avoid These Colors in Prompts

| Color | Why |
|-------|-----|
| Mint green `#4AEDC4` | Looks AI-generated, too neon |
| Electric blue `#3B82F6` | Cold, generic tech look |
| Hot magenta `#EC4899` | Too playful for corporate |
| Neon purple `#8B5CF6` | Sci-fi aesthetic |
| Pure black `#000000` | Too harsh, use charcoal instead |

## Prompt Templates

### Template 1: Editorial Hero (BCG style)

```
A professional editorial photograph of [subject], shot in a [setting].
Natural ambient lighting with soft warm tones. Color palette: warm whites,
charcoal grays, forest greens, and subtle gold accents. Clean composition
with generous negative space. Shot on a 35mm lens with shallow depth of
field. Magazine-quality, sophisticated, understated. No neon, no glowing
elements, no dark backgrounds.
```

### Template 2: Corporate Service Card

```
A clean, professional photograph representing [service concept].
The image uses a light neutral background (warm white or soft gray) with
[subject elements] arranged in a balanced editorial composition.
Natural studio lighting, warm color temperature (5500K). Colors are muted
and sophisticated: charcoal, warm gray, sage green, with a touch of gold.
Commercial photography aesthetic, not 3D render. No text in image.
```

### Template 3: Abstract Corporate Background

```
An elegant abstract composition for a corporate website background.
Soft gradients transitioning from warm white (#FAFAF8) to light sage
with subtle geometric elements in warm gray. Minimalist, clean, airy.
The mood is confident and professional — like the hero section of a
top-tier consulting firm's website. No dark backgrounds, no neon,
no sci-fi elements.
```

### Template 4: Business Concept Illustration

```
A sophisticated editorial illustration of [business concept].
Style: clean vector-inspired flat design with a warm neutral palette.
Colors: charcoal (#1F2937), sage (#337B68), warm gold (#D9B95B),
on a warm white (#FAFAF8) background. Minimal, professional,
reminiscent of McKinsey/BCG report graphics. Sharp lines,
no gradients or glow effects. No photorealism.
```

### Template 5: Lifestyle/Workspace (Superside style)

```
A warm, naturally-lit photograph of [workspace/scene].
Natural window light from the left, warm color temperature.
Oak or walnut surfaces, neutral textiles, touches of greenery.
Color palette: cream, warm gray, natural wood tones, muted sage.
Lifestyle brand photography feel — aspirational but authentic.
Shot on medium format with shallow depth of field, soft bokeh.
```

## Quick Reference: Prompt Modifiers

Add these to ANY prompt to shift toward corporate style:

**Color control:**
- "warm neutral palette: whites, grays, forest green, gold accents"
- "muted, sophisticated color palette — no neon or oversaturated colors"
- "color temperature 5500K, warm ambient lighting"

**Style control:**
- "editorial photography aesthetic, magazine-quality"
- "clean commercial photography, not 3D render"
- "professional, understated, confident"

**Anti-neon guard:**
- "No glowing elements, no neon colors, no dark backgrounds"
- "Natural lighting only — no rim lighting, no dramatic backlighting"
- "Light background, not dark. Warm, not cold."

## Usage with nanobanana-skill

```bash
# Corporate hero image
~/.nanobanana-venv/bin/python3 .agents/skills/nano-banana/nanobanana-skill/nanobanana.py \
  --prompt "A professional editorial photograph of a modern open office with teams collaborating around whiteboards. Natural ambient lighting with soft warm tones. Color palette: warm whites, charcoal grays, sage green, and subtle gold accents. Clean composition, 35mm lens, shallow depth of field. Magazine-quality, sophisticated. No neon, no glowing elements." \
  --size 1344x768 \
  --model gemini-3.1-flash-image-preview \
  --thinking-level high \
  --resolution 2K \
  --output "corporate-hero.png"

# Service card image
~/.nanobanana-venv/bin/python3 .agents/skills/nano-banana/nanobanana-skill/nanobanana.py \
  --prompt "A clean professional photograph representing AI-powered business transformation. Light neutral background with abstract data visualization elements in warm gray, sage green, and gold. Commercial photography aesthetic, warm studio lighting. No dark backgrounds, no neon." \
  --size 1184x864 \
  --model gemini-3.1-flash-image-preview \
  --thinking-level high \
  --resolution 2K \
  --output "service-ai-transform.png"
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Futuristic glowing mint-green nodes on dark background" | "Professional diagram elements in sage and gold on warm white" |
| "Photorealistic 3D render of a..." | "Editorial photograph of a..." or "Clean illustration of a..." |
| "Neon data streams flowing through..." | "Subtle data visualization lines in warm gray and forest green" |
| "Dark space with floating geometric shapes" | "Light, airy composition with geometric accents in muted tones" |
| Specifying only cool colors (blue, cyan, purple) | Always include warm tones (gold, amber, cream, sage) |
| "Cyberpunk / sci-fi / futuristic aesthetic" | "Modern, professional, editorial aesthetic" |
