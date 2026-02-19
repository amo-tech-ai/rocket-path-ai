# Edge Functions AI Integration

## Gemini 3 API Setup

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
    temperature: 1.0,       // Default, don't lower
  }
})
```

## Model Selection

| Model | Latency | Use Case |
|-------|---------|----------|
| `gemini-3-flash-preview` | <2s | Fast tasks, simple queries |
| `gemini-3-pro-preview` | 3-5s | Complex reasoning, analysis |

```typescript
// Fast tasks
const fast = await ai.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: simplePrompt,
})

// Complex reasoning
const complex = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: complexPrompt,
  config: { thinkingLevel: 'high' }
})
```

## Structured Outputs

```typescript
import { Type } from 'npm:@google/genai@^1.0.0'

const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    priority: { type: Type.NUMBER },
  },
  required: ['title', 'description']
}

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  }
})

const parsed = JSON.parse(response.text || '{}')
```

## Google Search Grounding

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: 'What are the latest trends in AI for 2025?',
  config: {
    tools: [{ googleSearch: {} }],
  }
})

// Access citations
const metadata = response.candidates?.[0]?.groundingMetadata
const citations = metadata?.groundingChunks
```

## URL Context Tool

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: `Analyze this company website: https://example.com`,
  config: {
    tools: [{ urlContext: {} }],
  }
})
```

## Cost Tracking

### Log to ai_runs Table

```typescript
const startTime = Date.now()

try {
  const response = await ai.models.generateContent({...})

  const duration = Date.now() - startTime

  // Get token counts
  const inputTokens = response.usageMetadata?.promptTokenCount || 0
  const outputTokens = response.usageMetadata?.candidatesTokenCount || 0

  // Calculate cost (example rates)
  const costUsd = (inputTokens * 0.00000125) + (outputTokens * 0.000005)

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

  return response.text

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

  throw error
}
```

## Error Handling

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
    return Response.json({
      error: 'AI service configuration error'
    }, { status: 500 })
  }

  if (error.message?.includes('quota')) {
    return Response.json({
      error: 'AI service quota exceeded'
    }, { status: 429 })
  }

  console.error('AI error:', error)
  return Response.json({
    error: 'Failed to generate content'
  }, { status: 500 })
}
```

## Timeout Handling

```typescript
const controller = new AbortController()
const timeout = setTimeout(() => controller.abort(), 30000)

try {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    signal: controller.signal,
  })
  clearTimeout(timeout)
  return response
} catch (error) {
  clearTimeout(timeout)
  if (error.name === 'AbortError') {
    throw new Error('AI request timeout')
  }
  throw error
}
```

## AI Function Pattern

```typescript
// supabase/functions/ai-helper/index.ts

const actionHandlers: Record<string, Function> = {
  'wizard_extract_startup': handleExtractStartup,
  'analyze_risks': handleAnalyzeRisks,
  'generate_tasks': handleGenerateTasks,
}

Deno.serve(async (req: Request) => {
  // ... JWT verification ...

  const { action, payload } = await req.json()

  const handler = actionHandlers[action]
  if (!handler) {
    return badRequest(`Unknown action: ${action}`)
  }

  try {
    const result = await handler(supabase, user, profile, payload)
    return Response.json({ success: true, data: result })
  } catch (error) {
    // Error already logged in handler
    return Response.json({ error: error.message }, { status: 500 })
  }
})
```

## Best Practices

### DO

1. Use correct model names (`gemini-3-pro-preview`)
2. Track costs in `ai_runs` table
3. Handle errors and timeouts
4. Use structured outputs for predictable responses
5. Set `thinkingLevel: 'high'` or `'low'`
6. Use default temperature (1.0)

### DON'T

1. Don't use `'medium'` thinking level (not supported)
2. Don't skip cost tracking
3. Don't lower temperature (use default)
4. Don't expose API keys
5. Don't ignore empty responses
