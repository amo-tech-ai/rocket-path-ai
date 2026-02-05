---
name: AI Agent Integration
description: Integrate Gemini AI agents (ProfileExtractor, ProfileEnhancer, ProfileValidator, RiskAnalyzer, TaskGenerator) into features with Structured Output, URL Context, and Thinking Mode. Use when adding AI functionality, implementing AI agents, or integrating Gemini AI.
version: 1.0.0
---

# AI Agent Integration

This skill teaches agents how to integrate Gemini AI agents into features using Structured Output, URL Context, Function Calling, and other advanced Gemini features.

## When to Use

- When integrating Gemini AI into features
- When implementing AI agents (ProfileExtractor, ProfileEnhancer, ProfileValidator, etc.)
- When using Structured Output for predictable AI responses
- When enriching data from URLs (websites, LinkedIn)
- When implementing function calling for agent actions
- When using Thinking Mode for complex reasoning

## Core Principles

### Gemini SDK Setup

**Import SDK:**
```typescript
import { GoogleGenAI } from "npm:@google/genai";
```

**Initialize Client:**
```typescript
const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY') });
```

**Always keep API keys server-side** — never expose to frontend.

### Model Selection

| Model | Best For | Speed | Cost |
|-------|----------|-------|------|
| `gemini-2.5-flash-preview` | Fast tasks, high throughput | Fast | Low |
| `gemini-2.5-pro` | Complex reasoning, planning | Moderate | Medium |
| `gemini-3-pro-preview` | Complex reasoning, Thinking Mode | Slower | Higher |

## Structured Output (JSON Schema)

### Basic Pattern

**Use Structured Output for predictable responses:**

```typescript
import { Type } from "npm:@google/genai";

const schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    industry: { type: Type.STRING },
    description: { type: Type.STRING },
  },
  required: ['name', 'industry'],
};

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash-preview',
  contents: prompt,
  config: {
    responseMimeType: "application/json",
    responseSchema: schema,
  },
});

const result = JSON.parse(response.text || "{}");
```

### Common Patterns

**Extract company data:**
```typescript
const extractSchema = {
  type: Type.OBJECT,
  properties: {
    companyName: { type: Type.STRING },
    tagline: { type: Type.STRING },
    industry: { type: Type.STRING },
    description: { type: Type.STRING },
  },
  required: ['companyName', 'industry'],
};
```

**Generate tasks:**
```typescript
const taskSchema = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
        },
      },
    },
  },
  required: ['tasks'],
};
```

## URL Context Tool

### Website/LinkedIn Enrichment

**Extract data from URLs:**

```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-preview",
  contents: [`Analyze ${url} and extract company information`],
  config: {
    tools: [{ urlContext: {} }],
  },
});

// Check which URLs were retrieved
const metadata = response.candidates?.[0]?.urlContextMetadata;
```

**Use for:**
- Company profile enrichment from website
- LinkedIn profile data extraction
- Brand visual identity analysis
- Market research from URLs

**Limit:** Up to 20 URLs per request

## Function Calling

### Basic Pattern

**Define function declaration:**

```typescript
import { Type } from "npm:@google/genai";

const functionDeclaration = {
  name: 'get_company_data',
  description: 'Gets company data from database',
  parameters: {
    type: Type.OBJECT,
    properties: {
      companyId: { type: Type.STRING },
    },
    required: ['companyId'],
  },
};
```

**Call with function:**

```typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash-preview',
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  config: {
    tools: [{ functionDeclarations: [functionDeclaration] }],
  },
});

// Check for function call
if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0];
  // Execute function
  const result = await executeFunction(functionCall.name, functionCall.args);
  // Send result back
}
```

## AI Agents in This Project

### ProfileExtractor Agent

**Purpose:** Extract company information from websites/LinkedIn URLs

**Model:** `gemini-2.5-flash-preview` or `gemini-3-pro-preview`  
**Features:** Structured Output, URL Context  
**Edge Function:** `ai-helper → wizard_extract_startup` or `enrich_company_profile`

**Use cases:**
- Company profile enrichment from website
- LinkedIn company profile sync
- Wizard data extraction

### ProfileEnhancer Agent

**Purpose:** Auto-improve profile copy (tagline, description, differentiator)

**Model:** `gemini-3-pro-preview`  
**Features:** Structured Output, Thinking Mode  
**Edge Function:** `ai-helper → auto_improve_profile`

**Use cases:**
- Improving company tagline
- Enhancing description clarity
- Refining differentiator statement

### ProfileValidator Agent

**Purpose:** Continuous quality audit, identify strengths/risks

**Model:** `gemini-2.5-flash-preview`  
**Features:** Structured Output  
**Edge Function:** `ai-helper → validate_profile`

**Use cases:**
- Profile completion tracking
- Data quality audits
- Strengths/risks identification

### RiskAnalyzer Agent

**Purpose:** Analyze business risks and opportunities

**Model:** `gemini-2.5-pro`  
**Features:** Structured Output  
**Edge Function:** `ai-helper → analyze_risks`

**Use cases:**
- Risk assessment in dashboard
- Business health scoring
- Opportunity identification

### TaskGenerator Agent

**Purpose:** Generate prioritized tasks based on startup profile

**Model:** `gemini-2.5-flash-preview`  
**Features:** Structured Output  
**Edge Function:** `ai-helper → wizard_generate_tasks`

**Use cases:**
- Onboarding task generation
- Task prioritization
- Action item creation

## Thinking Mode (Gemini 3)

### When to Use Thinking Mode

**Use for complex reasoning:**
- Profile enhancement (ProfileEnhancer)
- Strategic analysis
- Multi-step problem solving

**Configuration:**
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    thinkingLevel: 'high', // 'low' or 'high'
    // temperature: 1.0 (default, recommended)
  },
});
```

**⚠️ Important:**
- Keep temperature at default 1.0 for Gemini 3
- Don't use both `thinkingLevel` and `thinkingBudget`
- Thinking Mode adds latency but improves reasoning

## Error Handling

### Robust Error Handling

```typescript
try {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const responseText = response.text || "{}";
  if (!responseText || responseText.trim() === "") {
    throw new Error("Empty response from model");
  }

  const parsed = JSON.parse(responseText);

  // Validate required fields
  for (const field of schema.required || []) {
    if (!(field in parsed)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return parsed;
} catch (error: any) {
  console.error("AI generation error:", error);
  throw new Error(`Failed to generate AI response: ${error.message}`);
}
```

## Cost Tracking

### Log AI Calls

**Track usage in `ai_runs` table:**

```typescript
const usage = response.usageMetadata;

await supabase.from('ai_runs').insert({
  action: 'extract_startup',
  model: 'gemini-2.5-flash-preview',
  input_tokens: usage.promptTokenCount || 0,
  output_tokens: usage.candidatesTokenCount || 0,
  total_tokens: usage.totalTokenCount || 0,
  cost: calculateCost(usage),
  org_id: user.org_id,
  created_at: new Date().toISOString(),
});
```

## Best Practices

### ✅ DO

- Use Structured Output for predictable responses
- Specify model based on task complexity
- Use URL Context for website/LinkedIn enrichment
- Handle errors gracefully with try-catch
- Validate parsed responses
- Log AI calls for cost tracking
- Keep API keys server-side only
- Use appropriate model for task (fast vs complex)

### ❌ DON'T

- Don't expose API keys to frontend
- Don't skip error handling
- Don't forget to validate structured outputs
- Don't use expensive models for simple tasks
- Don't skip cost tracking
- Don't forget CORS handling in Edge Functions
- Don't use Thinking Mode for simple tasks (adds latency)

## Reference

- **Gemini Rules:** `.cursor/rules/gemeni/*.mdc` (comprehensive Gemini guides)
- **Structured Output:** `.cursor/rules/gemeni/structured-output.mdc`
- **URL Context:** `.cursor/rules/gemeni/url-context.mdc`
- **Function Calling:** `.cursor/rules/gemeni/function-calling.mdc`
- **Gemini 3:** `.cursor/rules/gemeni/gemeni-3.mdc`
- **Edge Functions:** `.cursor/rules/supabase/writing-supabase-edge-functions.mdc`

---

**Created:** 2025-01-16  
**Based on:** Gemini AI integration patterns  
**Version:** 1.0.0
