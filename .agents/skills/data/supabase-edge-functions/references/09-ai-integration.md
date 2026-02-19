# Edge Functions AI Integration Best Practices

**Document:** 09-ai-integration.md  
**Version:** 1.0  
**Date:** February 2026  
**Source:** [AI Models](https://supabase.com/docs/guides/functions/ai-models) + Gemini 3 Rules

---

## Overview

This guide covers best practices for integrating Gemini 3 API and other AI models in Edge Functions, including cost tracking, error handling, and performance optimization.

---

## Gemini 3 API Integration

### ✅ CORRECT: Basic Setup

```typescript
import { GoogleGenAI } from 'npm:@google/genai@^1.0.0'

const ai = new GoogleGenAI({ 
  apiKey: Deno.env.get('GEMINI_API_KEY')! 
})

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    thinkingLevel: 'high',  // 'high' or 'low', NOT 'medium'
    temperature: 1.0,  // Default, don't lower for Gemini 3
  }
})
```

### ✅ CORRECT: Structured Outputs

```typescript
import { Type } from 'npm:@google/genai@^1.0.0'

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
  },
  required: ['title', 'description']
}

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: schema,  // JavaScript SDK uses responseSchema
  }
})

const parsed = JSON.parse(response.text || '{}')
```

### ✅ CORRECT: Google Search Grounding

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: 'What are the latest fashion trends for 2025?',
  config: {
    tools: [{ googleSearch: {} }],  // Enable Google Search
  }
})

// Access citations
const metadata = response.candidates?.[0]?.groundingMetadata
const citations = metadata?.groundingChunks
```

### ✅ CORRECT: URL Context Tool

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: `Analyze these brand URLs:
- https://brand1.com
- https://brand2.com`,
  config: {
    tools: [{ urlContext: {} }],  // Enable URL Context
  }
})
```

---

## Cost Tracking

### ✅ CORRECT: Log to ai_runs Table

```typescript
const startTime = Date.now()

try {
  const response = await ai.models.generateContent({...})
  
  const duration = Date.now() - startTime
  
  // Calculate cost (example rates)
  const inputTokens = response.usageMetadata?.promptTokenCount || 0
  const outputTokens = response.usageMetadata?.candidatesTokenCount || 0
  const costUsd = (inputTokens * 0.00000125) + (outputTokens * 0.000005)  // Pro rates
  
  // Log to database
  await supabaseAdmin.from('ai_runs').insert({
    user_id: user.id,
    org_id: profile.org_id,
    agent_name: 'ProfileExtractor',
    action: 'wizard_extract_startup',
    model: 'gemini-3-pro-preview',
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    cost_usd: costUsd,
    duration_ms: duration,
    status: 'success',
  })
  
} catch (error) {
  // Log error
  await supabaseAdmin.from('ai_runs').insert({
    user_id: user.id,
    org_id: profile.org_id,
    agent_name: 'ProfileExtractor',
    action: 'wizard_extract_startup',
    model: 'gemini-3-pro-preview',
    status: 'error',
    error_message: error.message,
  })
}
```

---

## Error Handling

### ✅ CORRECT: AI API Error Handling

```typescript
try {
  const response = await ai.models.generateContent({...})
  
  if (!response.text) {
    throw new Error('Empty response from AI')
  }
  
  return response.text
  
} catch (error: any) {
  // Handle specific errors
  if (error.message?.includes('API key')) {
    return new Response(JSON.stringify({
      error: 'AI service configuration error'
    }), { status: 500 })
  }
  
  if (error.message?.includes('quota')) {
    return new Response(JSON.stringify({
      error: 'AI service quota exceeded'
    }), { status: 429 })
  }
  
  // Generic error
  console.error('AI generation error:', error)
  return new Response(JSON.stringify({
    error: 'Failed to generate content'
  }), { status: 500 })
}
```

---

## Performance Optimization

### ✅ CORRECT: Model Selection

```typescript
// ✅ CORRECT: Use Flash for fast tasks
const fastResponse = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',  // <2s latency
  contents: simplePrompt,
})

// ✅ CORRECT: Use Pro for complex reasoning
const complexResponse = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',  // 3-5s latency
  contents: complexPrompt,
  config: {
    thinkingLevel: 'high',
  }
})
```

### ✅ CORRECT: Timeout Handling

```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000)  // 30s timeout

try {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    signal: controller.signal,
  })
  clearTimeout(timeout)
  return response
} catch (error) {
  if (error.name === 'AbortError') {
    throw new Error('AI request timeout')
  }
  throw error
}
```

---

## Best Practices Summary

### ✅ DO

1. **Use correct model names** - `gemini-3-pro-preview`, `gemini-3-flash-preview`
2. **Track costs** - Log to `ai_runs` table
3. **Handle errors** - API failures, timeouts, quotas
4. **Use structured outputs** - For predictable responses
5. **Enable tools** - Google Search, URL Context when needed
6. **Set thinking level** - `'high'` or `'low'`, not `'medium'`
7. **Use default temperature** - 1.0 for Gemini 3
8. **Add timeouts** - Prevent hanging requests

### ❌ DON'T

1. **Don't use wrong model names** - Missing `-preview` suffix
2. **Don't skip cost tracking** - Track all AI calls
3. **Don't ignore errors** - Handle API failures
4. **Don't use 'medium' thinking** - Not supported
5. **Don't lower temperature** - Use default 1.0 for Gemini 3
6. **Don't expose API keys** - Use environment variables

---

## References

- **Official Docs:** [AI Models](https://supabase.com/docs/guides/functions/ai-models)
- **Gemini Rules:** [`../../.cursor/rules/gemeni/gemeni-3.mdc`](../../.cursor/rules/gemeni/gemeni-3.mdc)
- **Next:** [10-deployment.md](./10-deployment.md)

---

**Last Updated:** February 2026
