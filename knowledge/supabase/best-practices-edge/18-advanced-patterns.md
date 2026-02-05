# Edge Functions Advanced Patterns

**Document:** 18-advanced-patterns.md
**Version:** 1.0
**Date:** January 15, 2026
**Status:** Production-Ready

---

## Overview

This guide covers advanced patterns for Supabase Edge Functions including multi-agent orchestration, RAG implementation, streaming responses, rate limiting, circuit breakers, and production-grade patterns.

---

## Table of Contents

1. [Multi-Agent Orchestration](#multi-agent-orchestration)
2. [RAG Implementation](#rag-implementation)
3. [Streaming Responses](#streaming-responses)
4. [Rate Limiting](#rate-limiting)
5. [Circuit Breaker Pattern](#circuit-breaker-pattern)
6. [Caching Strategies](#caching-strategies)
7. [Error Recovery](#error-recovery)
8. [Observability](#observability)

---

## Multi-Agent Orchestration

### Parallel Agent Execution

```typescript
// supabase/functions/ai-helper/orchestration/parallel.ts

interface ParallelAgentTask {
  agent: string
  action: string
  input: any
}

interface ParallelResult {
  results: Record<string, AgentResult>
  totalDurationMs: number
  totalCostUsd: number
}

export async function executeParallel(
  tasks: ParallelAgentTask[],
  context: AgentContext,
  supabase: SupabaseClient
): Promise<ParallelResult> {
  const startTime = Date.now()

  // Execute all agents in parallel
  const promises = tasks.map(async (task) => {
    const agent = createAgent(task.agent)
    const result = await agent.execute(task.input, context)
    return { taskId: `${task.agent}:${task.action}`, result }
  })

  const settled = await Promise.allSettled(promises)

  const results: Record<string, AgentResult> = {}
  let totalCostUsd = 0

  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      results[outcome.value.taskId] = outcome.value.result
      totalCostUsd += outcome.value.result.costUsd || 0
    } else {
      results[outcome.reason?.taskId || 'unknown'] = {
        success: false,
        error: outcome.reason?.message || 'Unknown error',
        tokensUsed: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: 0
      }
    }
  }

  return {
    results,
    totalDurationMs: Date.now() - startTime,
    totalCostUsd
  }
}

// Example: Dashboard load - run multiple analyses in parallel
export async function loadDashboardParallel(
  startupId: string,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<any> {
  const tasks: ParallelAgentTask[] = [
    {
      agent: 'RiskAnalyzer',
      action: 'dashboard_risk_summary',
      input: { startupId }
    },
    {
      agent: 'TaskGenerator',
      action: 'suggest_next_actions',
      input: { startupId, limit: 5 }
    },
    {
      agent: 'DealScorer',
      action: 'pipeline_summary',
      input: { startupId }
    }
  ]

  const { results } = await executeParallel(tasks, context, supabase)

  return {
    risks: results['RiskAnalyzer:dashboard_risk_summary']?.data,
    nextActions: results['TaskGenerator:suggest_next_actions']?.data,
    pipeline: results['DealScorer:pipeline_summary']?.data
  }
}
```

### Sequential Pipeline with Dependencies

```typescript
// supabase/functions/ai-helper/orchestration/pipeline.ts

interface PipelineStep {
  id: string
  agent: string
  action: string
  inputMapper: (previousResults: Record<string, any>, originalInput: any) => any
  outputKey: string
  continueOnError?: boolean
}

interface PipelineResult {
  success: boolean
  outputs: Record<string, any>
  errors: Record<string, string>
  totalDurationMs: number
  totalCostUsd: number
}

export async function executePipeline(
  steps: PipelineStep[],
  initialInput: any,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<PipelineResult> {
  const startTime = Date.now()
  const outputs: Record<string, any> = {}
  const errors: Record<string, string> = {}
  let totalCostUsd = 0

  for (const step of steps) {
    try {
      // Map input from previous results
      const input = step.inputMapper(outputs, initialInput)

      // Execute agent
      const agent = createAgent(step.agent)
      const result = await agent.execute(input, context)

      totalCostUsd += result.costUsd || 0

      if (!result.success) {
        errors[step.id] = result.error || 'Unknown error'
        if (!step.continueOnError) {
          break
        }
      } else {
        outputs[step.outputKey] = result.data
      }
    } catch (error: any) {
      errors[step.id] = error.message
      if (!step.continueOnError) {
        break
      }
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    outputs,
    errors,
    totalDurationMs: Date.now() - startTime,
    totalCostUsd
  }
}

// Example: Wizard completion pipeline
export const WIZARD_COMPLETION_PIPELINE: PipelineStep[] = [
  {
    id: 'extract',
    agent: 'ProfileExtractor',
    action: 'wizard_extract_startup',
    inputMapper: (_, input) => input.extractionData,
    outputKey: 'profile'
  },
  {
    id: 'analyze',
    agent: 'RiskAnalyzer',
    action: 'analyze_risks',
    inputMapper: (prev, _) => ({ startup: prev.profile }),
    outputKey: 'risks'
  },
  {
    id: 'generate',
    agent: 'TaskGenerator',
    action: 'wizard_generate_tasks',
    inputMapper: (prev, _) => ({
      startup: prev.profile,
      risks: prev.risks
    }),
    outputKey: 'tasks'
  }
]
```

### Agent Routing with Fallback

```typescript
// supabase/functions/ai-helper/orchestration/router.ts

interface RouteConfig {
  primary: string
  fallback?: string
  timeout?: number
  retries?: number
}

export async function routeWithFallback(
  config: RouteConfig,
  action: string,
  input: any,
  context: AgentContext
): Promise<AgentResult> {
  const { primary, fallback, timeout = 30000, retries = 1 } = config

  // Try primary agent
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const agent = createAgent(primary)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const result = await Promise.race([
        agent.execute(input, context),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => {
            reject(new Error('Timeout'))
          })
        })
      ])

      clearTimeout(timeoutId)

      if (result.success) {
        return result
      }

      // If error but not timeout, might try fallback
      if (attempt === retries && fallback) {
        break  // Go to fallback
      }
    } catch (error: any) {
      if (attempt === retries && fallback) {
        console.log(`Primary agent ${primary} failed, trying fallback`)
        break
      }
      if (attempt < retries) {
        // Exponential backoff
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000))
      }
    }
  }

  // Try fallback if configured
  if (fallback) {
    try {
      const fallbackAgent = createAgent(fallback)
      return await fallbackAgent.execute(input, context)
    } catch (error: any) {
      return {
        success: false,
        error: `Both primary (${primary}) and fallback (${fallback}) failed`,
        tokensUsed: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: 0
      }
    }
  }

  return {
    success: false,
    error: `Agent ${primary} failed after ${retries + 1} attempts`,
    tokensUsed: { input: 0, output: 0 },
    costUsd: 0,
    durationMs: 0
  }
}
```

---

## RAG Implementation

### Vector Search with pgvector

```typescript
// supabase/functions/ai-helper/rag/vector-search.ts

import { GoogleGenAI } from 'npm:@google/genai@^0.21.0'

interface SearchInput {
  query: string
  tables: Array<'industry_packs' | 'playbooks' | 'chat_facts'>
  limit?: number
  threshold?: number
  filters?: Record<string, any>
}

interface SearchResult {
  table: string
  id: string
  content: string
  similarity: number
  metadata?: Record<string, any>
}

export async function vectorSearch(
  input: SearchInput,
  supabase: SupabaseClient
): Promise<SearchResult[]> {
  const { query, tables, limit = 10, threshold = 0.7, filters } = input

  // Generate embedding for query
  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! })

  const embeddingResponse = await ai.models.embedContent({
    model: 'text-embedding-004',
    content: query
  })

  const queryEmbedding = embeddingResponse.embedding.values

  // Search each table
  const results: SearchResult[] = []

  for (const table of tables) {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_table: table,
      match_threshold: threshold,
      match_count: limit,
      filter_json: filters ? JSON.stringify(filters) : null
    })

    if (error) {
      console.error(`Vector search error for ${table}:`, error)
      continue
    }

    for (const row of data || []) {
      results.push({
        table,
        id: row.id,
        content: row.content,
        similarity: row.similarity,
        metadata: row.metadata
      })
    }
  }

  // Sort by similarity and limit
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
}
```

### SQL Function for Vector Search

```sql
-- Create the match_documents function
create or replace function match_documents(
  query_embedding vector(768),
  match_table text,
  match_threshold float default 0.7,
  match_count int default 10,
  filter_json jsonb default null
)
returns table (
  id uuid,
  content text,
  similarity float,
  metadata jsonb
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Route to appropriate table
  if match_table = 'industry_packs' then
    return query
    select
      ip.id,
      ip.description as content,
      1 - (ip.embedding <=> query_embedding) as similarity,
      jsonb_build_object(
        'industry', ip.industry,
        'display_name', ip.display_name
      ) as metadata
    from public.industry_packs ip
    where ip.is_active = true
      and 1 - (ip.embedding <=> query_embedding) > match_threshold
    order by ip.embedding <=> query_embedding
    limit match_count;

  elsif match_table = 'playbooks' then
    return query
    select
      p.id,
      p.title || ': ' || coalesce(p.description, '') as content,
      1 - (p.embedding <=> query_embedding) as similarity,
      jsonb_build_object(
        'type', p.type,
        'difficulty', p.difficulty
      ) as metadata
    from public.playbooks p
    where p.is_active = true
      and 1 - (p.embedding <=> query_embedding) > match_threshold
    order by p.embedding <=> query_embedding
    limit match_count;

  elsif match_table = 'chat_facts' then
    return query
    select
      cf.id,
      cf.content,
      1 - (cf.embedding <=> query_embedding) as similarity,
      jsonb_build_object(
        'fact_type', cf.fact_type,
        'confidence', cf.confidence
      ) as metadata
    from public.chat_facts cf
    where 1 - (cf.embedding <=> query_embedding) > match_threshold
      and (cf.expires_at is null or cf.expires_at > now())
    order by cf.embedding <=> query_embedding
    limit match_count;

  end if;
end;
$$;
```

### RAG-Enhanced Response Generation

```typescript
// supabase/functions/ai-helper/rag/enhanced-generation.ts

interface RagInput {
  query: string
  context: AgentContext
  includePlaybooks?: boolean
  includeIndustryPacks?: boolean
  includeChatFacts?: boolean
}

interface RagOutput {
  response: string
  sources: Array<{
    type: string
    id: string
    title: string
    relevance: number
  }>
}

export async function generateWithRag(
  input: RagInput,
  supabase: SupabaseClient
): Promise<RagOutput> {
  const tables: Array<'industry_packs' | 'playbooks' | 'chat_facts'> = []

  if (input.includePlaybooks !== false) tables.push('playbooks')
  if (input.includeIndustryPacks !== false) tables.push('industry_packs')
  if (input.includeChatFacts !== false) tables.push('chat_facts')

  // Retrieve relevant context
  const searchResults = await vectorSearch({
    query: input.query,
    tables,
    limit: 5,
    threshold: 0.6,
    filters: input.context.startupId
      ? { startup_id: input.context.startupId }
      : undefined
  }, supabase)

  // Build context for AI
  const contextText = searchResults
    .map((r, i) => `[${i + 1}] (${r.table}): ${r.content}`)
    .join('\n\n')

  // Generate response with context
  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! })

  const prompt = `Use the following context to answer the question. If the context doesn't contain relevant information, say so.

CONTEXT:
${contextText}

QUESTION: ${input.query}

Provide a helpful, accurate response. Reference the context sources by number [1], [2], etc. when using information from them.`

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      thinkingLevel: 'low',
      temperature: 1.0
    }
  })

  // Extract sources used
  const sources = searchResults.map(r => ({
    type: r.table,
    id: r.id,
    title: r.content.slice(0, 100),
    relevance: r.similarity
  }))

  return {
    response: response.text || '',
    sources
  }
}
```

---

## Streaming Responses

### Server-Sent Events (SSE) Streaming

```typescript
// supabase/functions/ai-helper/streaming/sse.ts

export async function streamResponse(
  prompt: string,
  context: AgentContext
): Promise<Response> {
  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! })

  // Create a transform stream for SSE
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  // Start streaming in background
  (async () => {
    try {
      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: prompt
      })

      for await (const chunk of stream) {
        const text = chunk.text || ''
        if (text) {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
        }
      }

      // Send completion signal
      await writer.write(encoder.encode('data: [DONE]\n\n'))
    } catch (error: any) {
      await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`))
    } finally {
      await writer.close()
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}
```

### Chunked JSON Streaming

```typescript
// supabase/functions/ai-helper/streaming/chunked.ts

export async function streamJsonChunks(
  items: AsyncIterable<any>
): Promise<Response> {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  (async () => {
    try {
      await writer.write(encoder.encode('[\n'))

      let first = true
      for await (const item of items) {
        if (!first) {
          await writer.write(encoder.encode(',\n'))
        }
        await writer.write(encoder.encode(JSON.stringify(item)))
        first = false
      }

      await writer.write(encoder.encode('\n]'))
    } finally {
      await writer.close()
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'application/json',
      'Transfer-Encoding': 'chunked'
    }
  })
}
```

---

## Rate Limiting

### Token Bucket Rate Limiter

```typescript
// supabase/functions/ai-helper/utils/rate-limiter.ts

interface RateLimitConfig {
  maxTokens: number
  refillRate: number  // tokens per second
  refillInterval: number  // ms
}

interface RateLimitState {
  tokens: number
  lastRefill: number
}

const rateLimitStore = new Map<string, RateLimitState>()

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  let state = rateLimitStore.get(key)

  if (!state) {
    state = { tokens: config.maxTokens, lastRefill: now }
    rateLimitStore.set(key, state)
  }

  // Refill tokens
  const timePassed = now - state.lastRefill
  const tokensToAdd = Math.floor(timePassed / config.refillInterval) * config.refillRate

  if (tokensToAdd > 0) {
    state.tokens = Math.min(config.maxTokens, state.tokens + tokensToAdd)
    state.lastRefill = now
  }

  // Check if allowed
  if (state.tokens >= 1) {
    state.tokens -= 1
    return { allowed: true }
  }

  // Calculate retry after
  const tokensNeeded = 1 - state.tokens
  const timeToRefill = Math.ceil(tokensNeeded / config.refillRate * config.refillInterval)

  return {
    allowed: false,
    retryAfter: Math.ceil(timeToRefill / 1000)
  }
}

// Rate limit configurations
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  ai_pro: {
    maxTokens: 10,
    refillRate: 1,
    refillInterval: 6000  // 10 requests per minute
  },
  ai_flash: {
    maxTokens: 60,
    refillRate: 1,
    refillInterval: 1000  // 60 requests per minute
  },
  general: {
    maxTokens: 100,
    refillRate: 10,
    refillInterval: 1000  // 100 requests per second burst
  }
}

// Middleware for rate limiting
export function rateLimitMiddleware(
  limitType: keyof typeof RATE_LIMITS
) {
  return async (req: Request, context: AgentContext): Promise<Response | null> => {
    const key = `${limitType}:${context.orgId}`
    const result = checkRateLimit(key, RATE_LIMITS[limitType])

    if (!result.allowed) {
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: result.retryAfter
      }), {
        status: 429,
        headers: {
          'Retry-After': String(result.retryAfter),
          'Content-Type': 'application/json'
        }
      })
    }

    return null  // Continue processing
  }
}
```

### Database-Backed Rate Limiting

```typescript
// supabase/functions/ai-helper/utils/db-rate-limiter.ts

export async function checkDbRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  supabase: SupabaseClient
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowMs).toISOString()

  // Count recent requests
  const { count } = await supabase
    .from('rate_limit_log')
    .select('id', { count: 'exact', head: true })
    .eq('key', key)
    .gte('created_at', windowStart)

  const current = count || 0
  const allowed = current < limit

  if (allowed) {
    // Log this request
    await supabase.from('rate_limit_log').insert({ key })
  }

  return {
    allowed,
    remaining: Math.max(0, limit - current - (allowed ? 1 : 0))
  }
}
```

---

## Circuit Breaker Pattern

### Circuit Breaker Implementation

```typescript
// supabase/functions/ai-helper/utils/circuit-breaker.ts

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

interface CircuitBreakerConfig {
  failureThreshold: number
  successThreshold: number
  timeout: number  // ms before trying half-open
}

interface CircuitBreakerState {
  state: CircuitState
  failures: number
  successes: number
  lastFailure: number
  lastStateChange: number
}

const circuitState = new Map<string, CircuitBreakerState>()

export class CircuitBreaker {
  private config: CircuitBreakerConfig
  private key: string

  constructor(key: string, config: Partial<CircuitBreakerConfig> = {}) {
    this.key = key
    this.config = {
      failureThreshold: config.failureThreshold || 5,
      successThreshold: config.successThreshold || 2,
      timeout: config.timeout || 30000
    }
  }

  private getState(): CircuitBreakerState {
    let state = circuitState.get(this.key)
    if (!state) {
      state = {
        state: 'CLOSED',
        failures: 0,
        successes: 0,
        lastFailure: 0,
        lastStateChange: Date.now()
      }
      circuitState.set(this.key, state)
    }
    return state
  }

  canExecute(): boolean {
    const state = this.getState()

    switch (state.state) {
      case 'CLOSED':
        return true

      case 'OPEN':
        // Check if timeout has passed
        if (Date.now() - state.lastStateChange >= this.config.timeout) {
          state.state = 'HALF_OPEN'
          state.lastStateChange = Date.now()
          state.successes = 0
          return true
        }
        return false

      case 'HALF_OPEN':
        return true
    }
  }

  recordSuccess(): void {
    const state = this.getState()

    if (state.state === 'HALF_OPEN') {
      state.successes++
      if (state.successes >= this.config.successThreshold) {
        state.state = 'CLOSED'
        state.failures = 0
        state.lastStateChange = Date.now()
      }
    } else if (state.state === 'CLOSED') {
      state.failures = 0
    }
  }

  recordFailure(): void {
    const state = this.getState()
    state.failures++
    state.lastFailure = Date.now()

    if (state.state === 'HALF_OPEN') {
      // Immediate trip back to open
      state.state = 'OPEN'
      state.lastStateChange = Date.now()
    } else if (state.state === 'CLOSED') {
      if (state.failures >= this.config.failureThreshold) {
        state.state = 'OPEN'
        state.lastStateChange = Date.now()
      }
    }
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (!this.canExecute()) {
      throw new Error(`Circuit breaker ${this.key} is OPEN`)
    }

    try {
      const result = await fn()
      this.recordSuccess()
      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }
}

// Usage with AI agents
export async function executeWithCircuitBreaker(
  agentName: string,
  fn: () => Promise<AgentResult>
): Promise<AgentResult> {
  const breaker = new CircuitBreaker(`agent:${agentName}`, {
    failureThreshold: 3,
    timeout: 60000
  })

  try {
    return await breaker.execute(fn)
  } catch (error: any) {
    if (error.message.includes('Circuit breaker')) {
      return {
        success: false,
        error: 'Service temporarily unavailable, please try again later',
        tokensUsed: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: 0
      }
    }
    throw error
  }
}
```

---

## Caching Strategies

### Multi-Level Cache

```typescript
// supabase/functions/ai-helper/utils/cache.ts

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// L1: In-memory cache (fastest, per-instance)
const memoryCache = new Map<string, CacheEntry<any>>()

// L2: Database cache (shared across instances)
async function getDbCache<T>(
  key: string,
  supabase: SupabaseClient
): Promise<T | null> {
  const { data } = await supabase
    .from('cache')
    .select('value, expires_at')
    .eq('key', key)
    .gt('expires_at', new Date().toISOString())
    .single()

  return data?.value || null
}

async function setDbCache(
  key: string,
  value: any,
  ttlSeconds: number,
  supabase: SupabaseClient
): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString()

  await supabase.from('cache').upsert({
    key,
    value,
    expires_at: expiresAt
  }, {
    onConflict: 'key'
  })
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    memoryTtl?: number
    dbTtl?: number
    supabase: SupabaseClient
  }
): Promise<T> {
  const { memoryTtl = 60, dbTtl = 300, supabase } = options

  // Check L1 memory cache
  const memEntry = memoryCache.get(key)
  if (memEntry && Date.now() - memEntry.timestamp < memEntry.ttl * 1000) {
    return memEntry.data
  }

  // Check L2 database cache
  const dbData = await getDbCache<T>(key, supabase)
  if (dbData !== null) {
    // Populate L1
    memoryCache.set(key, {
      data: dbData,
      timestamp: Date.now(),
      ttl: memoryTtl
    })
    return dbData
  }

  // Fetch fresh data
  const data = await fetcher()

  // Populate both caches
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: memoryTtl
  })
  await setDbCache(key, data, dbTtl, supabase)

  return data
}

// Cache invalidation
export async function invalidateCache(
  pattern: string,
  supabase: SupabaseClient
): Promise<void> {
  // Clear memory cache
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key)
    }
  }

  // Clear database cache
  await supabase
    .from('cache')
    .delete()
    .like('key', `%${pattern}%`)
}
```

### Semantic Cache for AI Responses

```typescript
// supabase/functions/ai-helper/utils/semantic-cache.ts

interface SemanticCacheEntry {
  query: string
  queryEmbedding: number[]
  response: any
  createdAt: string
}

export async function getSemanticCached(
  query: string,
  threshold: number = 0.95,
  supabase: SupabaseClient
): Promise<any | null> {
  // Generate embedding for query
  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! })

  const embeddingResponse = await ai.models.embedContent({
    model: 'text-embedding-004',
    content: query
  })

  const queryEmbedding = embeddingResponse.embedding.values

  // Search for similar cached queries
  const { data } = await supabase.rpc('match_semantic_cache', {
    query_embedding: queryEmbedding,
    match_threshold: threshold
  })

  if (data && data.length > 0) {
    return data[0].response
  }

  return null
}

export async function setSemanticCache(
  query: string,
  response: any,
  supabase: SupabaseClient
): Promise<void> {
  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! })

  const embeddingResponse = await ai.models.embedContent({
    model: 'text-embedding-004',
    content: query
  })

  await supabase.from('semantic_cache').insert({
    query,
    query_embedding: embeddingResponse.embedding.values,
    response,
    created_at: new Date().toISOString()
  })
}
```

---

## Error Recovery

### Retry with Exponential Backoff

```typescript
// supabase/functions/ai-helper/utils/retry.ts

interface RetryConfig {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
  retryableErrors?: string[]
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    retryableErrors = ['timeout', 'rate_limited', 'ECONNRESET', '503', '429']
  } = config

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Check if error is retryable
      const isRetryable = retryableErrors.some(e =>
        error.message?.toLowerCase().includes(e.toLowerCase()) ||
        error.code === e ||
        String(error.status) === e
      )

      if (!isRetryable || attempt === maxRetries) {
        throw error
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs
      )

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}
```

### Dead Letter Queue

```typescript
// supabase/functions/ai-helper/utils/dlq.ts

interface FailedOperation {
  operation: string
  payload: any
  error: string
  attempts: number
  lastAttempt: string
}

export async function sendToDeadLetterQueue(
  operation: string,
  payload: any,
  error: Error,
  supabase: SupabaseClient
): Promise<void> {
  await supabase.from('dead_letter_queue').insert({
    operation,
    payload,
    error_message: error.message,
    error_stack: error.stack,
    created_at: new Date().toISOString()
  })

  // Notify admins of DLQ entry
  // This could trigger an alert workflow
}

export async function processDeadLetterQueue(
  supabase: SupabaseClient
): Promise<{ processed: number; failed: number }> {
  const { data: items } = await supabase
    .from('dead_letter_queue')
    .select('*')
    .lt('retry_count', 3)
    .order('created_at', { ascending: true })
    .limit(10)

  let processed = 0
  let failed = 0

  for (const item of items || []) {
    try {
      // Retry the operation
      await retryOperation(item.operation, item.payload)

      // Remove from DLQ
      await supabase.from('dead_letter_queue').delete().eq('id', item.id)
      processed++
    } catch (error) {
      // Increment retry count
      await supabase
        .from('dead_letter_queue')
        .update({
          retry_count: item.retry_count + 1,
          last_error: (error as Error).message,
          last_retry_at: new Date().toISOString()
        })
        .eq('id', item.id)
      failed++
    }
  }

  return { processed, failed }
}
```

---

## Observability

### Structured Logging

```typescript
// supabase/functions/ai-helper/utils/logger.ts

interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  context?: Record<string, any>
  timestamp: string
  requestId?: string
  userId?: string
  orgId?: string
}

class Logger {
  private requestId?: string
  private userId?: string
  private orgId?: string

  constructor(context?: { requestId?: string; userId?: string; orgId?: string }) {
    this.requestId = context?.requestId
    this.userId = context?.userId
    this.orgId = context?.orgId
  }

  private log(level: LogEntry['level'], message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      userId: this.userId,
      orgId: this.orgId
    }

    // Structured JSON output
    console.log(JSON.stringify(entry))
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log('error', message, {
      ...context,
      error: error?.message,
      stack: error?.stack
    })
  }
}

export function createLogger(context?: {
  requestId?: string
  userId?: string
  orgId?: string
}): Logger {
  return new Logger(context)
}
```

### Metrics Collection

```typescript
// supabase/functions/ai-helper/utils/metrics.ts

interface Metric {
  name: string
  value: number
  tags: Record<string, string>
  timestamp: string
}

const metricsBuffer: Metric[] = []
const FLUSH_INTERVAL = 10000  // 10 seconds

export function recordMetric(
  name: string,
  value: number,
  tags: Record<string, string> = {}
): void {
  metricsBuffer.push({
    name,
    value,
    tags,
    timestamp: new Date().toISOString()
  })
}

export async function flushMetrics(supabase: SupabaseClient): Promise<void> {
  if (metricsBuffer.length === 0) return

  const toFlush = [...metricsBuffer]
  metricsBuffer.length = 0

  await supabase.from('metrics').insert(toFlush)
}

// Common metrics
export function recordAgentDuration(agent: string, durationMs: number): void {
  recordMetric('agent_duration_ms', durationMs, { agent })
}

export function recordAgentCost(agent: string, costUsd: number): void {
  recordMetric('agent_cost_usd', costUsd, { agent })
}

export function recordError(type: string, agent?: string): void {
  recordMetric('errors_total', 1, { type, agent: agent || 'unknown' })
}

export function recordCacheHit(cacheType: string): void {
  recordMetric('cache_hits_total', 1, { type: cacheType })
}

export function recordCacheMiss(cacheType: string): void {
  recordMetric('cache_misses_total', 1, { type: cacheType })
}
```

---

## Best Practices Summary

### Advanced Development Checklist

- [ ] Use parallel execution for independent agents
- [ ] Implement circuit breakers for external calls
- [ ] Add rate limiting per org/user
- [ ] Use multi-level caching
- [ ] Implement semantic cache for AI
- [ ] Add structured logging
- [ ] Collect metrics for observability
- [ ] Handle failures with DLQ
- [ ] Use retry with exponential backoff

### Performance Tips

1. **Parallel over sequential** - Run independent agents concurrently
2. **Cache aggressively** - Memory + DB + semantic cache
3. **Stream responses** - Use SSE for long-running AI calls
4. **Break circuits** - Prevent cascade failures
5. **Rate limit early** - Before expensive operations

---

## References

- [14-ai-agents.md](./14-ai-agents.md) - AI agent patterns
- [13-performance-optimization.md](./13-performance-optimization.md) - Performance guide

---

**Last Updated:** January 15, 2026
