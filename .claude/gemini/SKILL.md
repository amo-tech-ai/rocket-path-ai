---
name: gemini
description: Use when integrating Gemini AI models in Supabase Edge Functions or Deno. Covers Gemini 3 models (Pro, Flash, Pro-Image), thinking levels, URL Context, Google Search grounding, structured output, and thought signatures. Use for AI enrichment, data extraction, analysis tasks, and image generation.
---

# Gemini AI Integration

Build AI features using Google's Gemini 3 models with URL Context, Google Search grounding, structured outputs, and thinking levels.

## Quick Reference

| Model | Use Case | Context | Pricing |
|-------|----------|---------|---------|
| `gemini-3-pro-preview` | Complex reasoning, analysis | 1M / 64k | $2-4 / $12-18 |
| `gemini-3-flash-preview` | Fast responses, extraction, chat | 1M / 64k | $0.50 / $3 |
| `gemini-3-pro-image-preview` | Image generation (4K) | 65k / 32k | $2 / $0.134 |

## Thinking Levels

Control reasoning depth with `thinkingLevel` (Gemini 3):

| Level | Use Case | Latency |
|-------|----------|---------|
| `minimal` | Simple chat (Flash only) | Lowest |
| `low` | Simple instruction following | Low |
| `medium` | Balanced tasks (Flash only) | Medium |
| `high` | Complex analysis, scoring | Higher |

```typescript
// Deno Edge Function example
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: prompt,
  config: {
    thinkingConfig: {
      thinkingLevel: "high"  // For complex analysis
    }
  }
});
```

**Best Practice:** Use `high` for scoring, readiness calculations, and complex analysis. Use `low` or `minimal` for simple extraction and chat.

## Built-in Tools

### 1. URL Context

Extract data from web URLs directly:

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `Extract company info from ${url}`,
  config: {
    tools: [{ urlContext: {} }]
  }
});
```

**Limitations:**
- Up to 20 URLs per request
- Max 34MB per URL
- Cannot access: paywalled content, YouTube, Google Workspace, localhost
- Supported: HTML, JSON, PDF, images (PNG, JPEG)

**Metadata access:**
```typescript
const metadata = response.candidates[0].urlContextMetadata;
// Check retrieval status for each URL
```

### 2. Google Search Grounding

Connect to real-time web information:

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "Who won the 2024 Euro championship?",
  config: {
    tools: [{ googleSearch: {} }]
  }
});

// Access grounding metadata
const { webSearchQueries, groundingChunks, groundingSupports } =
  response.candidates[0].groundingMetadata;
```

**Combine Tools:**
```typescript
config: {
  tools: [
    { urlContext: {} },
    { googleSearch: {} }
  ]
}
```

## Structured Output

Force JSON responses matching a schema:

```typescript
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const schema = z.object({
  company_name: z.string(),
  industry: z.array(z.string()),
  description: z.string(),
  founded_year: z.number().optional()
});

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `Extract company info from: ${url}`,
  config: {
    tools: [{ urlContext: {} }],
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(schema)
  }
});

const data = schema.parse(JSON.parse(response.text));
```

**Supported types:** `string`, `number`, `integer`, `boolean`, `object`, `array`, `null`

## Complete Edge Function Pattern

```typescript
import { GoogleGenAI } from "npm:@google/genai@^0.21.0";

const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY") });

// Enrichment with URL Context + Google Search + Structured Output
async function enrichUrl(url: string) {
  const schema = z.object({
    company_name: z.string(),
    description: z.string(),
    industry: z.array(z.string()),
    competitors: z.array(z.object({
      name: z.string(),
      differentiator: z.string()
    }))
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this company: ${url}. Find competitors.`,
    config: {
      tools: [
        { urlContext: {} },
        { googleSearch: {} }
      ],
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(schema),
      thinkingConfig: {
        thinkingLevel: "medium"
      }
    }
  });

  return schema.parse(JSON.parse(response.text));
}

// Analysis with high thinking
async function calculateReadiness(data: object) {
  const schema = z.object({
    overall_score: z.number().min(0).max(100),
    category_scores: z.object({
      product: z.number(),
      market: z.number(),
      team: z.number(),
      clarity: z.number()
    }),
    recommendations: z.array(z.string())
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Calculate investor readiness score: ${JSON.stringify(data)}`,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(schema),
      thinkingConfig: {
        thinkingLevel: "high"  // Deep reasoning for scoring
      }
    }
  });

  return schema.parse(JSON.parse(response.text));
}
```

## Thought Signatures (Multi-turn)

For function calling workflows, preserve thought context:

```typescript
// Model response includes thoughtSignature
const response1 = await ai.models.generateContent({...});
const signature = response1.candidates[0].content.parts[0].thoughtSignature;

// Return signature in next request
const response2 = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [
    { role: "user", parts: [{ text: "Initial prompt" }] },
    {
      role: "model",
      parts: [{
        functionCall: {...},
        thoughtSignature: signature  // REQUIRED for function calling
      }]
    },
    { role: "user", parts: [{ functionResponse: {...} }] }
  ]
});
```

**Rules:**
- Required for function calling (400 error without it)
- SDKs handle this automatically
- For migration: use `"thoughtSignature": "context_engineering_is_the_way_to_go"`

## Image Generation

```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-pro-image-preview",
  contents: "Generate a logo for a tech startup",
  config: {
    tools: [{ googleSearch: {} }],  // Optional: ground in real data
    imageConfig: {
      aspectRatio: "16:9",
      imageSize: "4K"
    }
  }
});

// Extract image
const imagePart = response.candidates[0].content.parts
  .find(p => p.inlineData);
const imageData = imagePart.inlineData.data;  // base64
```

## Temperature

**Always use default temperature (1.0) for Gemini 3.** Lower values may cause looping or degraded performance.

## Token Counting

```typescript
const { thoughtsTokenCount, candidatesTokenCount, totalTokenCount } =
  response.usageMetadata;

// For URL Context
const { toolUsePromptTokenCount } = response.usageMetadata;
```

## Common Patterns

### Extraction with Fallback
```typescript
try {
  // Try URL Context first
  const result = await enrichWithUrlContext(url);
} catch (error) {
  // Fallback to Google Search
  const result = await enrichWithGoogleSearch(companyName);
}
```

### Founder Lookup (Google Search Only)
```typescript
// DON'T use URL Context for LinkedIn (private profiles)
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: `Find info about founder: "${name}" at "${company}"`,
  config: {
    tools: [{ googleSearch: {} }],  // Not urlContext!
    responseMimeType: "application/json",
    responseJsonSchema: founderSchema
  }
});
```

## Resources

- [references/gemini-3.md](references/gemini-3.md) - Full Gemini 3 documentation
- [references/thinking.md](references/thinking.md) - Thinking levels guide
- [references/url-context.md](references/url-context.md) - URL Context tool
- [references/google-search.md](references/google-search.md) - Google Search grounding
- [references/structured-output.md](references/structured-output.md) - JSON schema output

## Checklist

When implementing Gemini AI:

- [ ] Use `npm:@google/genai@^0.21.0` (not esm.sh)
- [ ] Set `GEMINI_API_KEY` via `Deno.env.get()`
- [ ] Choose appropriate thinking level for task complexity
- [ ] Use structured output for type-safe responses
- [ ] Handle URL Context failures with Google Search fallback
- [ ] Don't use URL Context for private pages (LinkedIn)
- [ ] Keep temperature at default 1.0
- [ ] Return thought signatures for function calling
