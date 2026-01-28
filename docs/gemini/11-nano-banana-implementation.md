---
prompt_number: 10
title: Nano Banana Image Generation
category: AI
focus: Gemini Image Generation via Lovable AI Gateway
---

# Prompt 10: Nano Banana Image Generation

> **Model:** Nano Banana Pro (`google/gemini-3-pro-image-preview`)  
> **Purpose:** Generate professional pitch deck visuals  
> **Gateway:** Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`)

---

## Overview

Nano Banana is the name for Gemini's native image generation model series, available through the Lovable AI Gateway:

| Model | Gateway ID | Purpose |
|-------|------------|---------|
| Nano Banana | `google/gemini-2.5-flash-image` | Fast, high-volume images |
| Nano Banana Pro | `google/gemini-3-pro-image-preview` | Professional assets with advanced reasoning |

---

## Lovable AI Gateway Integration

### Basic Image Generation

```typescript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-3-pro-image-preview",
    messages: [
      { role: "user", content: "Generate a professional title slide visual for a fintech startup" }
    ],
    modalities: ["image", "text"],
  }),
});

const data = await response.json();
const images = data.choices?.[0]?.message?.images;

if (images && images.length > 0) {
  const imageUrl = images[0]?.image_url?.url; // data:image/png;base64,...
}
```

---

## Response Format

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "I've generated a professional slide visual for you.",
        "images": [
          {
            "type": "image_url",
            "image_url": {
              "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
            }
          }
        ]
      }
    }
  ]
}
```

---

## Pitch Deck Visual Prompts

### Global Style Rules

| Rule | Description |
|------|-------------|
| Background | Light, clean, minimal |
| Color Palette | Neutral + 1 accent color |
| Style | Flat, clean, professional |
| Avoid | Cartoonish illustrations, heavy textures |
| Aspect Ratio | 16:9 (pitch slide standard) |
| Text | Maximum 3-4 words |

### Slide-Specific Prompts

```typescript
const slidePrompts: Record<string, string> = {
  title: "Abstract geometric pattern with depth and dimension, representing innovation and growth",
  problem: "Visual metaphor showing a challenge or obstacle, dramatic lighting, conceptual business illustration",
  solution: "Bright, optimistic visual showing breakthrough or clarity, light emerging from complexity",
  market: "Global network visualization, interconnected nodes representing market opportunity",
  traction: "Upward trending graph visualization with momentum, growth trajectory illustration",
  team: "Abstract representation of collaboration and expertise, professional team concept",
  competition: "Strategic positioning visualization, comparative landscape abstract",
  business_model: "Value flow diagram concept, monetization visual metaphor",
  ask: "Investment opportunity visualization, partnership and funding concept art",
};
```

---

## Implementation in Edge Function

```typescript
// supabase/functions/pitch-deck-agent/ai-utils.ts

export async function generateSlideImage(
  prompt: string,
  slideType: string,
  brandColors?: { primary?: string; secondary?: string }
): Promise<ImageGenerationResult> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  const styleGuide = `
Style: Professional, clean, modern pitch deck aesthetic
Aspect ratio: 16:9
Colors: ${brandColors?.primary || "#1E3A5F"} primary, ${brandColors?.secondary || "#4A90D9"} accent
No text overlays - just visual elements
High contrast, suitable for presentations`;

  const fullPrompt = `${slidePrompts[slideType] || slidePrompts.title}. ${styleGuide}. ${prompt}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-pro-image-preview",
      messages: [{ role: "user", content: fullPrompt }],
      modalities: ["image", "text"],
    }),
  });

  const data = await response.json();
  const images = data.choices?.[0]?.message?.images;
  
  if (images?.[0]?.image_url?.url) {
    const base64Match = images[0].image_url.url.match(/base64,(.+)/);
    if (base64Match) {
      return { success: true, imageBase64: base64Match[1] };
    }
  }

  return { success: false, error: "No image generated" };
}
```

---

## Batch Generation

For generating images for all slides in a deck:

```typescript
export async function generateDeckImages(
  slides: Array<{ slide_type: string; title: string }>,
  companyContext: string,
  brandColors?: { primary?: string; secondary?: string }
): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  
  // Priority slides for image generation
  const prioritySlides = ["title", "problem", "solution", "market", "traction"];
  
  for (const slide of slides) {
    if (prioritySlides.includes(slide.slide_type)) {
      const result = await generateSlideImage(
        `${companyContext} - ${slide.title}`,
        slide.slide_type,
        brandColors
      );
      
      if (result.success && result.imageBase64) {
        imageMap.set(slide.slide_type, `data:image/png;base64,${result.imageBase64}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return imageMap;
}
```

---

## Edge Function Actions

| Action | Purpose | Status |
|--------|---------|--------|
| `generate_slide_image` | Single slide visual | ✅ Implemented |
| `generate_deck_images` | All slides batch | ✅ Implemented |
| `regenerate_slide_image` | Re-generate on demand | ✅ Implemented |

---

## Storage Strategy

Currently using base64 data URLs for simplicity. For production at scale, consider:

1. Store base64 in Supabase Storage bucket
2. Return public URL
3. Update slide's `image_url` field with permanent URL

---

## Error Handling

| Error | Handling |
|-------|----------|
| API key missing | Return error, log warning |
| Generation fails | Retry with simplified prompt |
| Content policy | Fall back to abstract geometric |
| Timeout | Use cached template visual |

---

## Model Capabilities (Gemini 3 Pro Image)

- **High-resolution output:** 1K, 2K, 4K visuals
- **Advanced text rendering:** Legible, stylized text for infographics
- **Google Search grounding:** Generate imagery based on real-time data
- **Thinking mode:** Advanced reasoning for complex prompts
- **Up to 14 reference images:** Character/object consistency

---

**Reference:** See [Nano Banana Official Docs](./10-nano-banana-image-generation.md)  
**Previous:** Prompt 09 (Onboarding Agent Grounding)  
**Next:** Prompt 11 (Pitch Deck Wizard)
