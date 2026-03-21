---
paths:
  - "**/*gemini*"
  - "supabase/functions/_shared/gemini*"
  - "supabase/functions/*/agents/**"
---

# Gemini API Rules

- Models: `gemini-3-flash-preview` (fast), `gemini-3.1-pro-preview` (deep), `gemini-3.1-flash-lite-preview` (cheap)
- Always use `responseJsonSchema` + `responseMimeType: "application/json"` for structured output
- Temperature: 1.0 for Gemini 3 (lower causes looping)
- API key goes in `x-goog-api-key` header, never as query parameter
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- System instruction goes in `systemInstruction.parts[0].text`, not in contents array
- Use `safetySettings` to set all categories to `BLOCK_NONE` for structured extraction tasks
- Wrap response parsing in try/catch — Gemini sometimes returns malformed JSON despite schema
- For search grounding: add `tools: [{ googleSearch: {} }]` to the request
