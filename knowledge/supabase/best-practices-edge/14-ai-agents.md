# Edge Functions AI Agents Best Practices

**Document:** 14-ai-agents.md
**Version:** 1.0
**Date:** January 15, 2026
**Status:** Production-Ready

---

## Overview

This guide covers comprehensive patterns for building AI agents in Supabase Edge Functions. Covers Gemini 3 agents, Claude SDK integration, multi-agent orchestration, and the AI governance pattern (Propose → Approve → Execute).

---

## Table of Contents

1. [Agent Architecture](#agent-architecture)
2. [Gemini 3 Agents](#gemini-3-agents)
3. [Claude SDK Agents](#claude-sdk-agents)
4. [Agent Registry Pattern](#agent-registry-pattern)
5. [Multi-Agent Orchestration](#multi-agent-orchestration)
6. [AI Governance Pattern](#ai-governance-pattern)
7. [Agent Configuration](#agent-configuration)
8. [Cost Management](#cost-management)

---

## Agent Architecture

### Core Agent Structure

```typescript
// supabase/functions/ai-helper/agents/base-agent.ts

export interface AgentConfig {
  name: string
  displayName: string
  model: string
  fallbackModel: string
  maxInputTokens: number
  maxOutputTokens: number
  thinkingLevel: 'high' | 'low' | 'none'
  temperature: number
  enabledTools: string[]
  maxCostPerRun: number
}

export interface AgentContext {
  userId: string
  orgId: string
  startupId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

export interface AgentResult<T = any> {
  success: boolean
  data?: T
  reasoning?: string
  confidence?: number
  tokensUsed: {
    input: number
    output: number
    thinking?: number
  }
  costUsd: number
  durationMs: number
  error?: string
}

export abstract class BaseAgent<TInput, TOutput> {
  protected config: AgentConfig
  protected ai: GoogleGenAI

  constructor(config: AgentConfig) {
    this.config = config
    this.ai = new GoogleGenAI({
      apiKey: Deno.env.get('GEMINI_API_KEY')!
    })
  }

  abstract execute(input: TInput, context: AgentContext): Promise<AgentResult<TOutput>>

  protected async logRun(
    context: AgentContext,
    action: string,
    result: AgentResult,
    supabase: SupabaseClient
  ): Promise<void> {
    await supabase.from('ai_runs').insert({
      user_id: context.userId,
      org_id: context.orgId,
      startup_id: context.startupId,
      agent_name: this.config.name,
      action,
      model: this.config.model,
      input_tokens: result.tokensUsed.input,
      output_tokens: result.tokensUsed.output,
      thinking_tokens: result.tokensUsed.thinking,
      cost_usd: result.costUsd,
      duration_ms: result.durationMs,
      status: result.success ? 'success' : 'error',
      error_message: result.error,
    })
  }
}
```

### Agent File Structure

```
supabase/functions/ai-helper/
├── index.ts                    # Main entry point
├── router.ts                   # Action routing
├── agents/
│   ├── base-agent.ts          # Abstract base class
│   ├── registry.ts            # Agent registry
│   ├── profile-extractor.ts   # ProfileExtractor agent
│   ├── risk-analyzer.ts       # RiskAnalyzer agent
│   ├── task-generator.ts      # TaskGenerator agent
│   ├── deal-scorer.ts         # DealScorer agent
│   ├── contact-enricher.ts    # ContactEnricher agent
│   └── content-generator.ts   # ContentGenerator agent
├── tools/
│   ├── google-search.ts       # Google Search tool
│   ├── url-context.ts         # URL Context tool
│   ├── code-execution.ts      # Code Execution tool
│   └── deep-research.ts       # Deep Research tool
├── schemas/
│   ├── startup-schema.ts      # Startup extraction schema
│   ├── risk-schema.ts         # Risk analysis schema
│   └── task-schema.ts         # Task generation schema
└── utils/
    ├── cost-calculator.ts     # Cost calculation
    ├── rate-limiter.ts        # Rate limiting
    └── error-handler.ts       # Error handling
```

---

## Gemini 3 Agents

### ProfileExtractor Agent

```typescript
// supabase/functions/ai-helper/agents/profile-extractor.ts

import { GoogleGenAI, Type } from 'npm:@google/genai@^0.21.0'
import { BaseAgent, AgentConfig, AgentContext, AgentResult } from './base-agent.ts'

interface ExtractInput {
  url?: string
  linkedinUrl?: string
  pitchDeckText?: string
  manualData?: Record<string, any>
}

interface StartupProfile {
  name: string
  tagline?: string
  description?: string
  industry: string
  stage: string
  businessModel?: string
  targetMarket?: string
  teamSize?: number
  founded?: string
  location?: string
  website?: string
  linkedinUrl?: string
  fundingStage?: string
  lastFundingAmount?: number
  signals: string[]
}

const startupSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    tagline: { type: Type.STRING },
    description: { type: Type.STRING },
    industry: { type: Type.STRING },
    stage: { type: Type.STRING, enum: ['idea', 'mvp', 'growth', 'scale'] },
    businessModel: { type: Type.STRING },
    targetMarket: { type: Type.STRING },
    teamSize: { type: Type.NUMBER },
    founded: { type: Type.STRING },
    location: { type: Type.STRING },
    website: { type: Type.STRING },
    linkedinUrl: { type: Type.STRING },
    fundingStage: { type: Type.STRING },
    lastFundingAmount: { type: Type.NUMBER },
    signals: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['name', 'industry', 'stage', 'signals']
}

export class ProfileExtractorAgent extends BaseAgent<ExtractInput, StartupProfile> {
  static readonly CONFIG: AgentConfig = {
    name: 'ProfileExtractor',
    displayName: 'Profile Extractor',
    model: 'gemini-3-pro-preview',
    fallbackModel: 'gemini-3-flash-preview',
    maxInputTokens: 8000,
    maxOutputTokens: 2000,
    thinkingLevel: 'high',
    temperature: 1.0,
    enabledTools: ['urlContext'],
    maxCostPerRun: 0.05,
  }

  constructor() {
    super(ProfileExtractorAgent.CONFIG)
  }

  async execute(
    input: ExtractInput,
    context: AgentContext
  ): Promise<AgentResult<StartupProfile>> {
    const startTime = Date.now()

    try {
      // Build prompt
      const prompt = this.buildPrompt(input)

      // Configure tools
      const tools = input.url || input.linkedinUrl
        ? [{ urlContext: {} }]
        : undefined

      // Make API call
      const response = await this.ai.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          thinkingLevel: this.config.thinkingLevel as 'high' | 'low',
          temperature: this.config.temperature,
          responseMimeType: 'application/json',
          responseSchema: startupSchema,
          tools,
        }
      })

      // Parse response
      const profile = JSON.parse(response.text || '{}') as StartupProfile

      // Calculate metrics
      const inputTokens = response.usageMetadata?.promptTokenCount || 0
      const outputTokens = response.usageMetadata?.candidatesTokenCount || 0
      const thinkingTokens = response.usageMetadata?.thinkingTokenCount || 0
      const costUsd = this.calculateCost(inputTokens, outputTokens, thinkingTokens)

      return {
        success: true,
        data: profile,
        reasoning: 'Extracted startup profile from provided sources',
        confidence: 0.85,
        tokensUsed: {
          input: inputTokens,
          output: outputTokens,
          thinking: thinkingTokens,
        },
        costUsd,
        durationMs: Date.now() - startTime,
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        tokensUsed: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: Date.now() - startTime,
      }
    }
  }

  private buildPrompt(input: ExtractInput): string {
    let prompt = `Extract startup profile information from the following sources:\n\n`

    if (input.url) {
      prompt += `Website URL: ${input.url}\n`
    }
    if (input.linkedinUrl) {
      prompt += `LinkedIn URL: ${input.linkedinUrl}\n`
    }
    if (input.pitchDeckText) {
      prompt += `\nPitch Deck Content:\n${input.pitchDeckText}\n`
    }
    if (input.manualData) {
      prompt += `\nUser-Provided Data:\n${JSON.stringify(input.manualData, null, 2)}\n`
    }

    prompt += `\nExtract and return a comprehensive startup profile. Include any signals detected (e.g., 'product_led_growth', 'enterprise_focus', 'b2b_saas').`

    return prompt
  }

  private calculateCost(input: number, output: number, thinking: number): number {
    // Gemini 3 Pro pricing (example rates)
    const inputCost = input * 0.00000125
    const outputCost = output * 0.000005
    const thinkingCost = thinking * 0.00000125  // Thinking tokens at input rate
    return inputCost + outputCost + thinkingCost
  }
}
```

### RiskAnalyzer Agent

```typescript
// supabase/functions/ai-helper/agents/risk-analyzer.ts

interface RiskInput {
  startup: StartupData
  tractionData?: TractionData
  existingTasks?: Task[]
}

interface RiskOutput {
  risks: Array<{
    category: 'market' | 'product' | 'team' | 'financial' | 'operational'
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    description: string
    impact: string
    mitigation: string
  }>
  overallHealth: 'healthy' | 'warning' | 'critical'
  summary: string
}

const riskSchema = {
  type: Type.OBJECT,
  properties: {
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['market', 'product', 'team', 'financial', 'operational'] },
          severity: { type: Type.STRING, enum: ['low', 'medium', 'high', 'critical'] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impact: { type: Type.STRING },
          mitigation: { type: Type.STRING },
        },
        required: ['category', 'severity', 'title', 'description', 'mitigation']
      }
    },
    overallHealth: { type: Type.STRING, enum: ['healthy', 'warning', 'critical'] },
    summary: { type: Type.STRING },
  },
  required: ['risks', 'overallHealth', 'summary']
}

export class RiskAnalyzerAgent extends BaseAgent<RiskInput, RiskOutput> {
  static readonly CONFIG: AgentConfig = {
    name: 'RiskAnalyzer',
    displayName: 'Risk Analyzer',
    model: 'gemini-3-pro-preview',
    fallbackModel: 'gemini-3-flash-preview',
    maxInputTokens: 12000,
    maxOutputTokens: 3000,
    thinkingLevel: 'high',
    temperature: 1.0,
    enabledTools: ['googleSearch'],
    maxCostPerRun: 0.10,
  }

  async execute(input: RiskInput, context: AgentContext): Promise<AgentResult<RiskOutput>> {
    const startTime = Date.now()

    try {
      const prompt = this.buildRiskPrompt(input)

      const response = await this.ai.models.generateContent({
        model: this.config.model,
        contents: prompt,
        config: {
          thinkingLevel: 'high',
          responseMimeType: 'application/json',
          responseSchema: riskSchema,
          tools: [{ googleSearch: {} }],  // Research market conditions
        }
      })

      const risks = JSON.parse(response.text || '{}') as RiskOutput

      const inputTokens = response.usageMetadata?.promptTokenCount || 0
      const outputTokens = response.usageMetadata?.candidatesTokenCount || 0

      return {
        success: true,
        data: risks,
        reasoning: `Analyzed ${risks.risks.length} potential risks across 5 categories`,
        confidence: 0.80,
        tokensUsed: { input: inputTokens, output: outputTokens },
        costUsd: this.calculateCost(inputTokens, outputTokens),
        durationMs: Date.now() - startTime,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        tokensUsed: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: Date.now() - startTime,
      }
    }
  }

  private buildRiskPrompt(input: RiskInput): string {
    return `Analyze the following startup for potential risks:

STARTUP PROFILE:
${JSON.stringify(input.startup, null, 2)}

${input.tractionData ? `TRACTION DATA:\n${JSON.stringify(input.tractionData, null, 2)}` : ''}

${input.existingTasks?.length ? `EXISTING TASKS (${input.existingTasks.length} tasks):
${input.existingTasks.slice(0, 10).map(t => `- ${t.title} (${t.status})`).join('\n')}` : ''}

Analyze risks in these categories:
1. Market - Competition, market size, timing
2. Product - Product-market fit, differentiation
3. Team - Skills gaps, capacity, experience
4. Financial - Runway, unit economics, funding
5. Operational - Execution, scalability, dependencies

For each risk:
- Assess severity (low, medium, high, critical)
- Explain the impact
- Suggest specific mitigation strategies

Use Google Search to research current market conditions in the ${input.startup.industry} industry.`
  }

  private calculateCost(input: number, output: number): number {
    return (input * 0.00000125) + (output * 0.000005)
  }
}
```

### TaskGenerator Agent (Fast - Uses Flash)

```typescript
// supabase/functions/ai-helper/agents/task-generator.ts

export class TaskGeneratorAgent extends BaseAgent<TaskInput, TaskOutput> {
  static readonly CONFIG: AgentConfig = {
    name: 'TaskGenerator',
    displayName: 'Task Generator',
    model: 'gemini-3-flash-preview',  // Fast model for quick task generation
    fallbackModel: 'gemini-3-flash-preview',
    maxInputTokens: 4000,
    maxOutputTokens: 2000,
    thinkingLevel: 'low',  // Low thinking for speed
    temperature: 1.0,
    enabledTools: [],
    maxCostPerRun: 0.01,
  }

  async execute(input: TaskInput, context: AgentContext): Promise<AgentResult<TaskOutput>> {
    const startTime = Date.now()

    const response = await this.ai.models.generateContent({
      model: this.config.model,
      contents: this.buildTaskPrompt(input),
      config: {
        thinkingLevel: 'low',
        responseMimeType: 'application/json',
        responseSchema: taskSchema,
      }
    })

    const tasks = JSON.parse(response.text || '{"tasks": []}') as TaskOutput

    return {
      success: true,
      data: tasks,
      tokensUsed: {
        input: response.usageMetadata?.promptTokenCount || 0,
        output: response.usageMetadata?.candidatesTokenCount || 0,
      },
      costUsd: this.calculateFlashCost(
        response.usageMetadata?.promptTokenCount || 0,
        response.usageMetadata?.candidatesTokenCount || 0
      ),
      durationMs: Date.now() - startTime,
    }
  }

  private calculateFlashCost(input: number, output: number): number {
    // Flash is ~10x cheaper than Pro
    return (input * 0.000000125) + (output * 0.0000005)
  }
}
```

---

## Claude SDK Agents

### Claude SDK Integration (Phase 4)

```typescript
// supabase/functions/ai-helper/agents/claude-orchestrator.ts

import Anthropic from 'npm:@anthropic-ai/sdk@^0.30.0'

interface ClaudeAgentConfig {
  name: string
  model: 'claude-sonnet-4-5' | 'claude-haiku-4-5' | 'claude-opus-4-5'
  maxTokens: number
  tools?: Anthropic.Tool[]
  systemPrompt?: string
}

export class ClaudeOrchestrator {
  private client: Anthropic
  private config: ClaudeAgentConfig

  constructor(config: ClaudeAgentConfig) {
    this.client = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY')!
    })
    this.config = config
  }

  async orchestrate<T>(
    prompt: string,
    context: AgentContext
  ): Promise<AgentResult<T>> {
    const startTime = Date.now()

    try {
      const response = await this.client.messages.create({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        system: this.config.systemPrompt,
        tools: this.config.tools,
        messages: [{ role: 'user', content: prompt }]
      })

      // Handle tool use
      if (response.stop_reason === 'tool_use') {
        return await this.handleToolUse(response, context)
      }

      // Extract text response
      const textBlock = response.content.find(c => c.type === 'text')
      const result = textBlock?.type === 'text' ? JSON.parse(textBlock.text) : null

      return {
        success: true,
        data: result,
        tokensUsed: {
          input: response.usage.input_tokens,
          output: response.usage.output_tokens,
        },
        costUsd: this.calculateClaudeCost(response.usage),
        durationMs: Date.now() - startTime,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        tokensUsed: { input: 0, output: 0 },
        costUsd: 0,
        durationMs: Date.now() - startTime,
      }
    }
  }

  private async handleToolUse(
    response: Anthropic.Message,
    context: AgentContext
  ): Promise<AgentResult<any>> {
    const toolUse = response.content.find(c => c.type === 'tool_use')

    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('No tool use found')
    }

    // Execute the tool (delegate to Gemini agents)
    const toolResult = await this.executeTool(toolUse.name, toolUse.input, context)

    // Continue conversation with tool result
    const continuation = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      messages: [
        { role: 'user', content: 'Execute the workflow' },
        { role: 'assistant', content: response.content },
        {
          role: 'user',
          content: [{
            type: 'tool_result',
            tool_use_id: toolUse.id,
            content: JSON.stringify(toolResult)
          }]
        }
      ]
    })

    // Process continuation...
    return this.processResponse(continuation, Date.now())
  }

  private async executeTool(
    toolName: string,
    input: any,
    context: AgentContext
  ): Promise<any> {
    // Delegate to Gemini agents based on tool name
    switch (toolName) {
      case 'analyze_risks':
        const riskAgent = new RiskAnalyzerAgent()
        return await riskAgent.execute(input, context)
      case 'generate_tasks':
        const taskAgent = new TaskGeneratorAgent()
        return await taskAgent.execute(input, context)
      case 'extract_profile':
        const profileAgent = new ProfileExtractorAgent()
        return await profileAgent.execute(input, context)
      default:
        throw new Error(`Unknown tool: ${toolName}`)
    }
  }

  private calculateClaudeCost(usage: { input_tokens: number; output_tokens: number }): number {
    // Claude Sonnet 4.5 pricing (example)
    const inputCost = usage.input_tokens * 0.000003
    const outputCost = usage.output_tokens * 0.000015
    return inputCost + outputCost
  }
}
```

### Claude Tool Definitions

```typescript
// supabase/functions/ai-helper/tools/claude-tools.ts

import Anthropic from 'npm:@anthropic-ai/sdk@^0.30.0'

export const CLAUDE_TOOLS: Anthropic.Tool[] = [
  {
    name: 'analyze_risks',
    description: 'Analyze a startup for potential risks across market, product, team, financial, and operational categories',
    input_schema: {
      type: 'object',
      properties: {
        startup: {
          type: 'object',
          description: 'Startup data to analyze'
        },
        tractionData: {
          type: 'object',
          description: 'Optional traction metrics'
        }
      },
      required: ['startup']
    }
  },
  {
    name: 'generate_tasks',
    description: 'Generate actionable tasks for a startup based on their current state and goals',
    input_schema: {
      type: 'object',
      properties: {
        startup: {
          type: 'object',
          description: 'Startup profile'
        },
        risks: {
          type: 'array',
          description: 'Identified risks to address'
        },
        goals: {
          type: 'array',
          description: 'Current goals'
        }
      },
      required: ['startup']
    }
  },
  {
    name: 'extract_profile',
    description: 'Extract startup profile from URLs, LinkedIn, or documents',
    input_schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        linkedinUrl: { type: 'string' },
        pitchDeckText: { type: 'string' }
      }
    }
  },
  {
    name: 'search_web',
    description: 'Search the web for market research, competitor analysis, or industry trends',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        intent: {
          type: 'string',
          enum: ['market_research', 'competitor_analysis', 'industry_trends', 'general']
        }
      },
      required: ['query']
    }
  },
  {
    name: 'propose_action',
    description: 'Propose an action for user approval before execution',
    input_schema: {
      type: 'object',
      properties: {
        actionType: {
          type: 'string',
          enum: ['create', 'update', 'delete', 'send', 'external']
        },
        targetTable: { type: 'string' },
        payload: { type: 'object' },
        reasoning: { type: 'string' }
      },
      required: ['actionType', 'targetTable', 'payload', 'reasoning']
    }
  }
]
```

---

## Agent Registry Pattern

### Centralized Agent Registry

```typescript
// supabase/functions/ai-helper/agents/registry.ts

import { ProfileExtractorAgent } from './profile-extractor.ts'
import { RiskAnalyzerAgent } from './risk-analyzer.ts'
import { TaskGeneratorAgent } from './task-generator.ts'
import { DealScorerAgent } from './deal-scorer.ts'
import { ContactEnricherAgent } from './contact-enricher.ts'
import { ContentGeneratorAgent } from './content-generator.ts'
import { BaseAgent, AgentConfig } from './base-agent.ts'

type AgentConstructor = new () => BaseAgent<any, any>

interface AgentEntry {
  constructor: AgentConstructor
  config: AgentConfig
  actions: string[]
}

export const AGENT_REGISTRY: Record<string, AgentEntry> = {
  ProfileExtractor: {
    constructor: ProfileExtractorAgent,
    config: ProfileExtractorAgent.CONFIG,
    actions: ['wizard_extract_startup', 'extract_profile', 'enrich_startup']
  },
  RiskAnalyzer: {
    constructor: RiskAnalyzerAgent,
    config: RiskAnalyzerAgent.CONFIG,
    actions: ['analyze_risks', 'dashboard_risk_summary', 'health_check']
  },
  TaskGenerator: {
    constructor: TaskGeneratorAgent,
    config: TaskGeneratorAgent.CONFIG,
    actions: ['wizard_generate_tasks', 'generate_tasks', 'suggest_next_actions']
  },
  DealScorer: {
    constructor: DealScorerAgent,
    config: DealScorerAgent.CONFIG,
    actions: ['score_deal', 'analyze_pipeline', 'deal_insights']
  },
  ContactEnricher: {
    constructor: ContactEnricherAgent,
    config: ContactEnricherAgent.CONFIG,
    actions: ['enrich_contact', 'find_contact_info', 'linkedin_lookup']
  },
  ContentGenerator: {
    constructor: ContentGeneratorAgent,
    config: ContentGeneratorAgent.CONFIG,
    actions: ['generate_content', 'create_document', 'generate_image']
  }
}

export function getAgentForAction(action: string): AgentEntry | undefined {
  for (const [name, entry] of Object.entries(AGENT_REGISTRY)) {
    if (entry.actions.includes(action)) {
      return entry
    }
  }
  return undefined
}

export function createAgent(name: string): BaseAgent<any, any> {
  const entry = AGENT_REGISTRY[name]
  if (!entry) {
    throw new Error(`Unknown agent: ${name}`)
  }
  return new entry.constructor()
}
```

### Action Router

```typescript
// supabase/functions/ai-helper/router.ts

import { getAgentForAction, createAgent } from './agents/registry.ts'
import { AgentContext, AgentResult } from './agents/base-agent.ts'

interface ActionRequest {
  action: string
  payload: any
  context: AgentContext
}

export async function routeAction(request: ActionRequest): Promise<AgentResult> {
  const entry = getAgentForAction(request.action)

  if (!entry) {
    return {
      success: false,
      error: `Unknown action: ${request.action}`,
      tokensUsed: { input: 0, output: 0 },
      costUsd: 0,
      durationMs: 0,
    }
  }

  const agent = new entry.constructor()

  // Check cost limits before execution
  if (await shouldBlockForCost(request.context, entry.config)) {
    return {
      success: false,
      error: 'Daily AI cost limit exceeded',
      tokensUsed: { input: 0, output: 0 },
      costUsd: 0,
      durationMs: 0,
    }
  }

  // Execute agent
  const result = await agent.execute(request.payload, request.context)

  return result
}

async function shouldBlockForCost(
  context: AgentContext,
  config: AgentConfig
): Promise<boolean> {
  // Check organization's daily budget
  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('settings')
    .eq('id', context.orgId)
    .single()

  const dailyBudget = org?.settings?.ai_daily_budget || 10.0

  // Get today's spending
  const today = new Date().toISOString().split('T')[0]
  const { data: runs } = await supabaseAdmin
    .from('ai_runs')
    .select('cost_usd')
    .eq('org_id', context.orgId)
    .gte('created_at', today)

  const todaySpent = runs?.reduce((sum, r) => sum + (r.cost_usd || 0), 0) || 0

  // Block if would exceed budget
  return (todaySpent + config.maxCostPerRun) > dailyBudget
}
```

---

## Multi-Agent Orchestration

### Workflow Orchestration Pattern

```typescript
// supabase/functions/ai-helper/orchestration/workflow-orchestrator.ts

interface WorkflowStep {
  agent: string
  action: string
  input: any
  dependsOn?: string[]  // Step IDs this depends on
  outputMapping?: Record<string, string>  // Map output fields to next step
}

interface Workflow {
  id: string
  name: string
  steps: Record<string, WorkflowStep>
  startStep: string
}

export class WorkflowOrchestrator {
  private results: Record<string, AgentResult> = {}

  async execute(workflow: Workflow, context: AgentContext): Promise<Record<string, AgentResult>> {
    const executed = new Set<string>()
    const queue = [workflow.startStep]

    while (queue.length > 0) {
      const stepId = queue.shift()!

      if (executed.has(stepId)) continue

      const step = workflow.steps[stepId]

      // Check dependencies
      if (step.dependsOn?.some(dep => !executed.has(dep))) {
        queue.push(stepId)  // Re-queue
        continue
      }

      // Build input with mapped outputs from dependencies
      const input = this.buildStepInput(step, workflow)

      // Execute step
      const result = await routeAction({
        action: step.action,
        payload: input,
        context
      })

      this.results[stepId] = result
      executed.add(stepId)

      // Queue next steps
      for (const [nextId, nextStep] of Object.entries(workflow.steps)) {
        if (nextStep.dependsOn?.includes(stepId) && !executed.has(nextId)) {
          queue.push(nextId)
        }
      }
    }

    return this.results
  }

  private buildStepInput(step: WorkflowStep, workflow: Workflow): any {
    const input = { ...step.input }

    // Map outputs from dependencies
    if (step.dependsOn && step.outputMapping) {
      for (const dep of step.dependsOn) {
        const depResult = this.results[dep]
        if (depResult?.success && depResult.data) {
          for (const [fromKey, toKey] of Object.entries(step.outputMapping)) {
            input[toKey] = depResult.data[fromKey]
          }
        }
      }
    }

    return input
  }
}

// Example: Wizard Completion Workflow
export const WIZARD_COMPLETION_WORKFLOW: Workflow = {
  id: 'wizard_completion',
  name: 'Wizard Completion Workflow',
  startStep: 'extract_profile',
  steps: {
    extract_profile: {
      agent: 'ProfileExtractor',
      action: 'wizard_extract_startup',
      input: {},  // Filled from request
    },
    analyze_risks: {
      agent: 'RiskAnalyzer',
      action: 'analyze_risks',
      input: {},
      dependsOn: ['extract_profile'],
      outputMapping: { startup: 'startup' }
    },
    generate_tasks: {
      agent: 'TaskGenerator',
      action: 'wizard_generate_tasks',
      input: {},
      dependsOn: ['extract_profile', 'analyze_risks'],
      outputMapping: {
        startup: 'startup',
        risks: 'risks'
      }
    }
  }
}
```

---

## AI Governance Pattern

### Propose → Approve → Execute

```typescript
// supabase/functions/ai-helper/governance/propose-action.ts

interface ProposedActionInput {
  agentName: string
  actionType: 'create' | 'update' | 'delete' | 'send' | 'external' | 'bulk'
  targetTable: string
  targetId?: string
  payload: any
  reasoning: string
  confidence: number
}

export async function proposeAction(
  input: ProposedActionInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<{ proposedActionId: string }> {
  // Get current state for undo capability
  let beforeState = null
  if (input.targetId && input.actionType !== 'create') {
    const { data } = await supabase
      .from(input.targetTable)
      .select('*')
      .eq('id', input.targetId)
      .single()
    beforeState = data
  }

  // Create proposed action
  const { data: proposed, error } = await supabase
    .from('proposed_actions')
    .insert({
      user_id: context.userId,
      org_id: context.orgId,
      startup_id: context.startupId,
      agent_name: input.agentName,
      action_type: input.actionType,
      target_table: input.targetTable,
      target_id: input.targetId,
      payload: input.payload,
      before_state: beforeState,
      reasoning: input.reasoning,
      confidence: input.confidence,
      status: 'pending',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()  // 7 days
    })
    .select('id')
    .single()

  if (error) throw error

  return { proposedActionId: proposed.id }
}

// Execute approved action
export async function executeApprovedAction(
  actionId: string,
  approvedBy: string,
  supabase: SupabaseClient
): Promise<AgentResult> {
  const startTime = Date.now()

  // Get the proposed action
  const { data: action, error: fetchError } = await supabase
    .from('proposed_actions')
    .select('*')
    .eq('id', actionId)
    .eq('status', 'pending')
    .single()

  if (fetchError || !action) {
    throw new Error('Action not found or already processed')
  }

  // Update status to executing
  await supabase
    .from('proposed_actions')
    .update({
      status: 'executing',
      approved_by: approvedBy,
      approved_at: new Date().toISOString()
    })
    .eq('id', actionId)

  try {
    // Execute the action
    let result: any
    switch (action.action_type) {
      case 'create':
        const { data: created } = await supabase
          .from(action.target_table)
          .insert(action.payload)
          .select()
          .single()
        result = created
        break

      case 'update':
        const { data: updated } = await supabase
          .from(action.target_table)
          .update(action.payload)
          .eq('id', action.target_id)
          .select()
          .single()
        result = updated
        break

      case 'delete':
        await supabase
          .from(action.target_table)
          .delete()
          .eq('id', action.target_id)
        result = { deleted: true }
        break
    }

    // Update proposed action as completed
    await supabase
      .from('proposed_actions')
      .update({
        status: 'completed',
        after_state: result
      })
      .eq('id', actionId)

    // Log execution
    await supabase.from('action_executions').insert({
      action_id: actionId,
      status: 'success',
      executed_at: new Date().toISOString(),
      result,
      undo_state: action.before_state,
      duration_ms: Date.now() - startTime
    })

    // Audit log
    await supabase.from('audit_log').insert({
      org_id: action.org_id,
      startup_id: action.startup_id,
      user_id: approvedBy,
      actor_type: 'ai_agent',
      actor_id: action.agent_name,
      action: action.action_type,
      table_name: action.target_table,
      record_id: action.target_id || result?.id,
      old_data: action.before_state,
      new_data: result,
      proposed_action_id: actionId
    })

    return {
      success: true,
      data: result,
      tokensUsed: { input: 0, output: 0 },
      costUsd: 0,
      durationMs: Date.now() - startTime
    }

  } catch (error: any) {
    // Mark as failed
    await supabase
      .from('proposed_actions')
      .update({ status: 'failed' })
      .eq('id', actionId)

    await supabase.from('action_executions').insert({
      action_id: actionId,
      status: 'failed',
      error_message: error.message,
      duration_ms: Date.now() - startTime
    })

    return {
      success: false,
      error: error.message,
      tokensUsed: { input: 0, output: 0 },
      costUsd: 0,
      durationMs: Date.now() - startTime
    }
  }
}

// Rollback an executed action
export async function rollbackAction(
  executionId: string,
  rolledBackBy: string,
  supabase: SupabaseClient
): Promise<boolean> {
  const { data: execution } = await supabase
    .from('action_executions')
    .select('*, proposed_actions(*)')
    .eq('id', executionId)
    .single()

  if (!execution?.undo_state) {
    throw new Error('No undo state available')
  }

  const action = execution.proposed_actions

  // Restore previous state
  if (action.action_type === 'create') {
    // Delete the created record
    await supabase
      .from(action.target_table)
      .delete()
      .eq('id', execution.result?.id)
  } else if (action.action_type === 'update') {
    // Restore previous values
    await supabase
      .from(action.target_table)
      .update(execution.undo_state)
      .eq('id', action.target_id)
  } else if (action.action_type === 'delete') {
    // Re-insert the deleted record
    await supabase
      .from(action.target_table)
      .insert(execution.undo_state)
  }

  // Update execution record
  await supabase
    .from('action_executions')
    .update({
      status: 'rolled_back',
      rolled_back_at: new Date().toISOString(),
      rolled_back_by: rolledBackBy
    })
    .eq('id', executionId)

  return true
}
```

---

## Agent Configuration

### Per-Organization Configuration

```typescript
// supabase/functions/ai-helper/config/agent-config.ts

export async function getAgentConfig(
  agentName: string,
  orgId: string,
  supabase: SupabaseClient
): Promise<AgentConfig> {
  // Try org-specific config first
  const { data: orgConfig } = await supabase
    .from('agent_configs')
    .select('*')
    .eq('org_id', orgId)
    .eq('agent_name', agentName)
    .eq('is_active', true)
    .single()

  if (orgConfig) {
    return {
      name: orgConfig.agent_name,
      displayName: orgConfig.display_name,
      model: orgConfig.model,
      fallbackModel: orgConfig.fallback_model,
      maxInputTokens: orgConfig.max_input_tokens,
      maxOutputTokens: orgConfig.max_output_tokens,
      thinkingLevel: orgConfig.thinking_level,
      temperature: parseFloat(orgConfig.temperature),
      enabledTools: orgConfig.enabled_tools,
      maxCostPerRun: parseFloat(orgConfig.max_cost_per_run),
    }
  }

  // Fall back to default config from registry
  const entry = AGENT_REGISTRY[agentName]
  if (!entry) {
    throw new Error(`Unknown agent: ${agentName}`)
  }

  return entry.config
}
```

---

## Cost Management

### Cost Tracking Utilities

```typescript
// supabase/functions/ai-helper/utils/cost-calculator.ts

interface ModelPricing {
  inputPer1k: number
  outputPer1k: number
  thinkingPer1k?: number
}

const MODEL_PRICING: Record<string, ModelPricing> = {
  'gemini-3-pro-preview': {
    inputPer1k: 0.00125,
    outputPer1k: 0.005,
    thinkingPer1k: 0.00125,
  },
  'gemini-3-flash-preview': {
    inputPer1k: 0.000125,
    outputPer1k: 0.0005,
  },
  'gemini-3-pro-image-preview': {
    inputPer1k: 0.00125,
    outputPer1k: 0.005,
  },
  'claude-sonnet-4-5': {
    inputPer1k: 0.003,
    outputPer1k: 0.015,
  },
  'claude-haiku-4-5': {
    inputPer1k: 0.00025,
    outputPer1k: 0.00125,
  },
  'claude-opus-4-5': {
    inputPer1k: 0.015,
    outputPer1k: 0.075,
  },
}

export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  thinkingTokens?: number
): number {
  const pricing = MODEL_PRICING[model]
  if (!pricing) {
    console.warn(`Unknown model pricing: ${model}`)
    return 0
  }

  const inputCost = (inputTokens / 1000) * pricing.inputPer1k
  const outputCost = (outputTokens / 1000) * pricing.outputPer1k
  const thinkingCost = thinkingTokens && pricing.thinkingPer1k
    ? (thinkingTokens / 1000) * pricing.thinkingPer1k
    : 0

  return inputCost + outputCost + thinkingCost
}

// Daily cost aggregation
export async function getDailyCost(
  orgId: string,
  supabase: SupabaseClient
): Promise<{ total: number; byAgent: Record<string, number> }> {
  const today = new Date().toISOString().split('T')[0]

  const { data: runs } = await supabase
    .from('ai_runs')
    .select('agent_name, cost_usd')
    .eq('org_id', orgId)
    .gte('created_at', today)

  const byAgent: Record<string, number> = {}
  let total = 0

  for (const run of runs || []) {
    const cost = run.cost_usd || 0
    total += cost
    byAgent[run.agent_name] = (byAgent[run.agent_name] || 0) + cost
  }

  return { total, byAgent }
}
```

---

## Best Practices Summary

### Agent Development Checklist

- [ ] Extend BaseAgent class
- [ ] Define static CONFIG with model, limits, tools
- [ ] Implement execute() method with proper error handling
- [ ] Use structured outputs (responseSchema)
- [ ] Log all runs to ai_runs table
- [ ] Calculate and track costs
- [ ] Handle timeouts (30s default)
- [ ] Support fallback model
- [ ] Register in AGENT_REGISTRY

### Model Selection Guide

| Use Case | Model | Why |
|----------|-------|-----|
| Fast UI tasks | `gemini-3-flash-preview` | <2s latency, 10x cheaper |
| Complex reasoning | `gemini-3-pro-preview` | Better quality, thinking mode |
| Image generation | `gemini-3-pro-image-preview` | Native image capabilities |
| Deep research | Deep Research Agent | Autonomous, thorough |
| Orchestration | `claude-sonnet-4-5` | Tool use, planning |
| Simple routing | `claude-haiku-4-5` | Fast, cheap |

### Cost Control

1. **Set per-agent limits** in agent_configs
2. **Track daily spending** per organization
3. **Use Flash** for simple tasks
4. **Cache** repetitive requests
5. **Batch** similar operations

---

## References

- [09-ai-integration.md](./09-ai-integration.md) - Basic AI integration
- [Gemini 3 Rules](../../.cursor/rules/gemeni/gemeni-3.mdc)
- [Claude SDK Docs](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/sdk-overview)

---

**Last Updated:** January 15, 2026
