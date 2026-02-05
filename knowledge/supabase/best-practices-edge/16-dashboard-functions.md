# Edge Functions Dashboard Patterns

**Document:** 16-dashboard-functions.md
**Version:** 1.0
**Date:** January 15, 2026
**Status:** Production-Ready

---

## Overview

This guide covers best practices for implementing dashboard-related Edge Functions. Covers real-time insights, AI-powered analysis, KPI calculations, and the 3-panel interface data flows.

---

## Table of Contents

1. [Dashboard Architecture](#dashboard-architecture)
2. [KPI Calculations](#kpi-calculations)
3. [AI Insights Generation](#ai-insights-generation)
4. [Real-time Updates](#real-time-updates)
5. [Risk Analysis](#risk-analysis)
6. [Priority Queue](#priority-queue)
7. [Quick Actions](#quick-actions)

---

## Dashboard Architecture

### 3-Panel Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DASHBOARD LAYOUT                               │
├──────────────┬─────────────────────────────┬───────────────────────────┤
│   LEFT PANEL │        MAIN PANEL           │       RIGHT PANEL         │
│  (Context)   │         (Work)              │     (Intelligence)        │
├──────────────┼─────────────────────────────┼───────────────────────────┤
│ Navigation   │ KPI Bar                     │ AI Coach                  │
│ Quick Stats  │ - MRR, Users, Churn         │ - Current Focus           │
│ Filters      │ - Growth metrics            │ - Suggestions             │
│              │                             │                           │
│ Startup      │ Priorities Card             │ Risk Alerts               │
│ Selector     │ - Today's tasks             │ - Critical items          │
│              │ - Upcoming deadlines        │ - Warnings                │
│ AI Status    │                             │                           │
│              │ Projects Health             │ Next Best Actions         │
│              │ - Active projects           │ - AI recommendations      │
│              │ - Health indicators         │ - Proposed actions        │
└──────────────┴─────────────────────────────┴───────────────────────────┘

Data Sources:
- LEFT:  startups, profiles, organizations
- MAIN:  tasks, projects, deals, startups.traction_data
- RIGHT: ai_runs, proposed_actions, chat_facts
```

### Dashboard Actions

| Action | Purpose | Frequency | Caching |
|--------|---------|-----------|---------|
| `dashboard_load` | Initial dashboard data | On mount | 5 min |
| `dashboard_kpis` | Calculate KPI metrics | On refresh | 1 min |
| `dashboard_risks` | AI risk analysis | On mount | 15 min |
| `dashboard_priorities` | Task prioritization | On refresh | 1 min |
| `dashboard_insights` | AI-generated insights | On mount | 30 min |
| `dashboard_actions` | Pending AI actions | Real-time | None |

---

## KPI Calculations

### KPI Aggregation Function

```typescript
// supabase/functions/ai-helper/dashboard/calculate-kpis.ts

interface KpiInput {
  startupId: string
  timeRange?: 'day' | 'week' | 'month' | 'quarter'
}

interface KpiOutput {
  mrr: number
  mrrChange: number
  mrrChangePercent: number
  users: number
  usersChange: number
  churnRate: number
  churnChange: number
  pipelineValue: number
  activeTasks: number
  completedTasksThisWeek: number
  projectHealth: 'healthy' | 'warning' | 'critical'
  aiCostToday: number
}

export async function calculateKpis(
  input: KpiInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<KpiOutput> {
  const { startupId, timeRange = 'month' } = input

  // Get startup with traction data
  const { data: startup } = await supabase
    .from('startups')
    .select('traction_data')
    .eq('id', startupId)
    .single()

  const traction = startup?.traction_data || {}

  // Get previous period for comparison
  const { data: previousSnapshot } = await supabase
    .from('benchmark_snapshots')
    .select('metrics')
    .eq('startup_id', startupId)
    .order('snapshot_date', { ascending: false })
    .limit(2)

  const currentMetrics = previousSnapshot?.[0]?.metrics || traction
  const previousMetrics = previousSnapshot?.[1]?.metrics || {}

  // Calculate MRR change
  const mrr = currentMetrics.mrr || 0
  const previousMrr = previousMetrics.mrr || mrr
  const mrrChange = mrr - previousMrr
  const mrrChangePercent = previousMrr > 0 ? (mrrChange / previousMrr) * 100 : 0

  // Calculate users change
  const users = currentMetrics.users || 0
  const previousUsers = previousMetrics.users || users
  const usersChange = users - previousUsers

  // Calculate churn
  const churnRate = currentMetrics.churn_rate || 0
  const previousChurn = previousMetrics.churn_rate || churnRate
  const churnChange = churnRate - previousChurn

  // Get pipeline value from deals
  const { data: deals } = await supabase
    .from('deals')
    .select('value')
    .eq('startup_id', startupId)
    .eq('is_active', true)

  const pipelineValue = deals?.reduce((sum, d) => sum + (d.value || 0), 0) || 0

  // Get task counts
  const { count: activeTasks } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('startup_id', startupId)
    .not('status', 'in', '("completed","cancelled")')

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { count: completedThisWeek } = await supabase
    .from('tasks')
    .select('id', { count: 'exact', head: true })
    .eq('startup_id', startupId)
    .eq('status', 'completed')
    .gte('updated_at', weekAgo.toISOString())

  // Calculate project health
  const { data: projects } = await supabase
    .from('projects')
    .select('health')
    .eq('startup_id', startupId)
    .eq('status', 'active')

  const healthCounts = { healthy: 0, warning: 0, critical: 0 }
  for (const p of projects || []) {
    if (p.health) healthCounts[p.health as keyof typeof healthCounts]++
  }

  let projectHealth: 'healthy' | 'warning' | 'critical' = 'healthy'
  if (healthCounts.critical > 0) projectHealth = 'critical'
  else if (healthCounts.warning > healthCounts.healthy) projectHealth = 'warning'

  // Get today's AI cost
  const today = new Date().toISOString().split('T')[0]
  const { data: aiRuns } = await supabase
    .from('ai_runs')
    .select('cost_usd')
    .eq('org_id', context.orgId)
    .gte('created_at', today)

  const aiCostToday = aiRuns?.reduce((sum, r) => sum + (r.cost_usd || 0), 0) || 0

  return {
    mrr,
    mrrChange,
    mrrChangePercent,
    users,
    usersChange,
    churnRate,
    churnChange,
    pipelineValue,
    activeTasks: activeTasks || 0,
    completedTasksThisWeek: completedThisWeek || 0,
    projectHealth,
    aiCostToday
  }
}
```

### Cached KPI Endpoint

```typescript
// supabase/functions/ai-helper/dashboard/cached-kpis.ts

const KPI_CACHE = new Map<string, { data: KpiOutput; timestamp: number }>()
const CACHE_TTL = 60 * 1000  // 1 minute

export async function getCachedKpis(
  input: KpiInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<KpiOutput> {
  const cacheKey = `${input.startupId}:${input.timeRange || 'month'}`
  const cached = KPI_CACHE.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }

  const data = await calculateKpis(input, context, supabase)

  KPI_CACHE.set(cacheKey, { data, timestamp: Date.now() })

  return data
}
```

---

## AI Insights Generation

### Dashboard Insights Action

```typescript
// supabase/functions/ai-helper/dashboard/generate-insights.ts

import { GoogleGenAI, Type } from 'npm:@google/genai@^0.21.0'

interface InsightsInput {
  startupId: string
  kpis: KpiOutput
  includeRecommendations?: boolean
}

interface Insight {
  type: 'positive' | 'negative' | 'neutral' | 'action'
  category: 'growth' | 'risk' | 'opportunity' | 'task'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

interface InsightsOutput {
  insights: Insight[]
  summary: string
  focusArea: string
}

const insightSchema = {
  type: Type.OBJECT,
  properties: {
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['positive', 'negative', 'neutral', 'action'] },
          category: { type: Type.STRING, enum: ['growth', 'risk', 'opportunity', 'task'] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
        },
        required: ['type', 'category', 'title', 'description', 'priority']
      }
    },
    summary: { type: Type.STRING },
    focusArea: { type: Type.STRING }
  },
  required: ['insights', 'summary', 'focusArea']
}

export async function generateInsights(
  input: InsightsInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<InsightsOutput> {
  // Get startup profile
  const { data: startup } = await supabase
    .from('startups')
    .select('name, industry, stage, signals')
    .eq('id', input.startupId)
    .single()

  // Get recent tasks
  const { data: recentTasks } = await supabase
    .from('tasks')
    .select('title, status, priority, due_at')
    .eq('startup_id', input.startupId)
    .order('due_at', { ascending: true })
    .limit(10)

  // Get active deals
  const { data: activeDeals } = await supabase
    .from('deals')
    .select('name, stage, value, expected_close')
    .eq('startup_id', input.startupId)
    .eq('is_active', true)
    .limit(5)

  // Get chat facts (user preferences, goals)
  const { data: facts } = await supabase
    .from('chat_facts')
    .select('fact_type, content')
    .eq('startup_id', input.startupId)
    .in('fact_type', ['goal', 'preference', 'constraint'])
    .limit(10)

  // Build AI prompt
  const prompt = `Analyze this startup's current state and generate actionable insights:

STARTUP: ${startup?.name}
INDUSTRY: ${startup?.industry}
STAGE: ${startup?.stage}
SIGNALS: ${startup?.signals?.join(', ') || 'None'}

KPIs:
- MRR: $${input.kpis.mrr.toLocaleString()} (${input.kpis.mrrChangePercent > 0 ? '+' : ''}${input.kpis.mrrChangePercent.toFixed(1)}%)
- Users: ${input.kpis.users.toLocaleString()} (${input.kpis.usersChange > 0 ? '+' : ''}${input.kpis.usersChange})
- Churn: ${input.kpis.churnRate.toFixed(1)}%
- Pipeline: $${input.kpis.pipelineValue.toLocaleString()}
- Active Tasks: ${input.kpis.activeTasks}
- Completed This Week: ${input.kpis.completedTasksThisWeek}
- Project Health: ${input.kpis.projectHealth}

UPCOMING TASKS:
${recentTasks?.map(t => `- ${t.title} (${t.priority}, due: ${t.due_at || 'no date'})`).join('\n') || 'None'}

ACTIVE DEALS:
${activeDeals?.map(d => `- ${d.name}: $${d.value?.toLocaleString()} (${d.stage})`).join('\n') || 'None'}

USER GOALS:
${facts?.filter(f => f.fact_type === 'goal').map(f => `- ${f.content}`).join('\n') || 'None specified'}

Generate 3-5 actionable insights. Focus on:
1. Growth opportunities based on metrics
2. Risk areas that need attention
3. Quick wins they can act on today
4. Patterns in their data

Be specific and actionable. Reference actual data points.`

  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY')! })

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',  // Fast for dashboard
    contents: prompt,
    config: {
      thinkingLevel: 'low',
      responseMimeType: 'application/json',
      responseSchema: insightSchema,
    }
  })

  const result = JSON.parse(response.text || '{}') as InsightsOutput

  // Log AI run
  await supabase.from('ai_runs').insert({
    user_id: context.userId,
    org_id: context.orgId,
    startup_id: input.startupId,
    agent_name: 'InsightsGenerator',
    action: 'dashboard_insights',
    model: 'gemini-3-flash-preview',
    input_tokens: response.usageMetadata?.promptTokenCount || 0,
    output_tokens: response.usageMetadata?.candidatesTokenCount || 0,
    cost_usd: calculateFlashCost(
      response.usageMetadata?.promptTokenCount || 0,
      response.usageMetadata?.candidatesTokenCount || 0
    ),
    status: 'success'
  })

  return result
}

function calculateFlashCost(input: number, output: number): number {
  return (input * 0.000000125) + (output * 0.0000005)
}
```

---

## Real-time Updates

### Supabase Realtime Integration

```typescript
// supabase/functions/ai-helper/dashboard/realtime-setup.ts

interface RealtimeChannels {
  tasks: string
  deals: string
  notifications: string
  proposedActions: string
}

export function getDashboardChannels(
  startupId: string,
  userId: string
): RealtimeChannels {
  return {
    tasks: `startup:${startupId}:tasks`,
    deals: `startup:${startupId}:deals`,
    notifications: `user:${userId}:notifications`,
    proposedActions: `user:${userId}:proposed_actions`
  }
}

// Client-side subscription pattern (for documentation)
export const REALTIME_SUBSCRIPTION_EXAMPLE = `
// In React component
import { supabase } from '@/integrations/supabase/client'

useEffect(() => {
  const channels = getDashboardChannels(startupId, userId)

  // Subscribe to task changes
  const taskChannel = supabase
    .channel(channels.tasks, { config: { private: true } })
    .on('broadcast', { event: 'task_updated' }, (payload) => {
      // Update local state
      setTasks(prev => prev.map(t =>
        t.id === payload.taskId ? { ...t, ...payload.changes } : t
      ))
    })
    .on('broadcast', { event: 'task_created' }, (payload) => {
      setTasks(prev => [...prev, payload.task])
    })
    .subscribe()

  // Subscribe to proposed actions
  const actionChannel = supabase
    .channel(channels.proposedActions, { config: { private: true } })
    .on('broadcast', { event: 'action_proposed' }, (payload) => {
      setProposedActions(prev => [...prev, payload.action])
    })
    .subscribe()

  return () => {
    supabase.removeChannel(taskChannel)
    supabase.removeChannel(actionChannel)
  }
}, [startupId, userId])
`
```

### Broadcast Updates from Edge Functions

```typescript
// supabase/functions/ai-helper/dashboard/broadcast-update.ts

export async function broadcastDashboardUpdate(
  startupId: string,
  userId: string,
  event: string,
  payload: any,
  supabase: SupabaseClient
): Promise<void> {
  const channelName = event.startsWith('action')
    ? `user:${userId}:proposed_actions`
    : `startup:${startupId}:${event.split('_')[0]}s`

  await supabase
    .channel(channelName)
    .send({
      type: 'broadcast',
      event,
      payload
    })
}

// Usage in task creation
export async function createTaskWithBroadcast(
  task: TaskData,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<Task> {
  const { data: created } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()

  // Broadcast to dashboard
  await broadcastDashboardUpdate(
    task.startup_id,
    context.userId,
    'task_created',
    { task: created },
    supabase
  )

  return created
}
```

---

## Risk Analysis

### Dashboard Risk Summary

```typescript
// supabase/functions/ai-helper/dashboard/risk-summary.ts

interface RiskSummaryInput {
  startupId: string
}

interface RiskSummaryOutput {
  overallRisk: 'low' | 'medium' | 'high' | 'critical'
  riskCount: {
    critical: number
    high: number
    medium: number
    low: number
  }
  topRisks: Array<{
    category: string
    title: string
    severity: string
    mitigation: string
  }>
  lastAnalyzed: string
}

export async function getRiskSummary(
  input: RiskSummaryInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<RiskSummaryOutput> {
  // Check for cached analysis (< 15 min old)
  const { data: recentRun } = await supabase
    .from('ai_runs')
    .select('response_metadata, created_at')
    .eq('startup_id', input.startupId)
    .eq('agent_name', 'RiskAnalyzer')
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000)

  if (recentRun && new Date(recentRun.created_at) > fifteenMinAgo) {
    // Use cached result
    return {
      ...recentRun.response_metadata,
      lastAnalyzed: recentRun.created_at
    }
  }

  // Run fresh analysis
  const { data: startup } = await supabase
    .from('startups')
    .select('*')
    .eq('id', input.startupId)
    .single()

  const { data: tasks } = await supabase
    .from('tasks')
    .select('title, status, priority, due_at')
    .eq('startup_id', input.startupId)
    .limit(50)

  const agent = new RiskAnalyzerAgent()
  const result = await agent.execute({
    startup,
    tractionData: startup?.traction_data,
    existingTasks: tasks
  }, context)

  if (!result.success) {
    throw new Error(result.error || 'Risk analysis failed')
  }

  // Count risks by severity
  const riskCount = { critical: 0, high: 0, medium: 0, low: 0 }
  for (const risk of result.data?.risks || []) {
    riskCount[risk.severity as keyof typeof riskCount]++
  }

  // Determine overall risk
  let overallRisk: 'low' | 'medium' | 'high' | 'critical' = 'low'
  if (riskCount.critical > 0) overallRisk = 'critical'
  else if (riskCount.high > 1) overallRisk = 'high'
  else if (riskCount.high > 0 || riskCount.medium > 2) overallRisk = 'medium'

  const summary: RiskSummaryOutput = {
    overallRisk,
    riskCount,
    topRisks: result.data?.risks
      ?.sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
        return severityOrder[a.severity] - severityOrder[b.severity]
      })
      .slice(0, 3)
      .map(r => ({
        category: r.category,
        title: r.title,
        severity: r.severity,
        mitigation: r.mitigation
      })) || [],
    lastAnalyzed: new Date().toISOString()
  }

  // Cache in ai_runs metadata
  await supabase
    .from('ai_runs')
    .update({
      response_metadata: summary
    })
    .eq('startup_id', input.startupId)
    .eq('agent_name', 'RiskAnalyzer')
    .order('created_at', { ascending: false })
    .limit(1)

  return summary
}
```

---

## Priority Queue

### Smart Task Prioritization

```typescript
// supabase/functions/ai-helper/dashboard/prioritize-tasks.ts

interface PriorityInput {
  startupId: string
  limit?: number
}

interface PrioritizedTask {
  id: string
  title: string
  priority: string
  dueAt: string | null
  urgencyScore: number
  importanceScore: number
  combinedScore: number
  reasoning: string
}

interface PriorityOutput {
  prioritizedTasks: PrioritizedTask[]
  suggestedFocus: string
}

export async function prioritizeTasks(
  input: PriorityInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<PriorityOutput> {
  const { startupId, limit = 10 } = input

  // Get all active tasks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('startup_id', startupId)
    .not('status', 'in', '("completed","cancelled")')
    .order('due_at', { ascending: true, nullsFirst: false })

  if (!tasks?.length) {
    return {
      prioritizedTasks: [],
      suggestedFocus: 'No active tasks'
    }
  }

  // Get user goals from chat facts
  const { data: goals } = await supabase
    .from('chat_facts')
    .select('content')
    .eq('startup_id', startupId)
    .eq('fact_type', 'goal')

  // Calculate scores
  const now = new Date()
  const scoredTasks: PrioritizedTask[] = tasks.map(task => {
    // Urgency score (based on due date)
    let urgencyScore = 50  // Default
    if (task.due_at) {
      const dueDate = new Date(task.due_at)
      const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

      if (daysUntilDue < 0) urgencyScore = 100  // Overdue
      else if (daysUntilDue < 1) urgencyScore = 90  // Due today
      else if (daysUntilDue < 3) urgencyScore = 75  // Due soon
      else if (daysUntilDue < 7) urgencyScore = 60  // This week
      else urgencyScore = 40  // Later
    }

    // Importance score (based on priority)
    const importanceMap = { urgent: 100, high: 80, medium: 50, low: 20 }
    const importanceScore = importanceMap[task.priority as keyof typeof importanceMap] || 50

    // Combined score (Eisenhower matrix style)
    const combinedScore = (urgencyScore * 0.6) + (importanceScore * 0.4)

    // Generate reasoning
    let reasoning = ''
    if (urgencyScore >= 90) reasoning = 'Urgent: due very soon'
    else if (importanceScore >= 80) reasoning = 'High importance task'
    else if (combinedScore >= 70) reasoning = 'Priority based on timing and importance'
    else reasoning = 'Standard priority'

    return {
      id: task.id,
      title: task.title,
      priority: task.priority,
      dueAt: task.due_at,
      urgencyScore,
      importanceScore,
      combinedScore,
      reasoning
    }
  })

  // Sort by combined score
  scoredTasks.sort((a, b) => b.combinedScore - a.combinedScore)

  // Determine suggested focus
  const topTask = scoredTasks[0]
  let suggestedFocus = 'Focus on high-impact tasks'
  if (topTask?.urgencyScore >= 90) {
    suggestedFocus = `Urgent: Complete "${topTask.title}" first`
  } else if (topTask?.importanceScore >= 80) {
    suggestedFocus = `Important: Prioritize "${topTask.title}"`
  }

  return {
    prioritizedTasks: scoredTasks.slice(0, limit),
    suggestedFocus
  }
}
```

---

## Quick Actions

### Pending Actions Summary

```typescript
// supabase/functions/ai-helper/dashboard/pending-actions.ts

interface PendingActionsInput {
  userId: string
  limit?: number
}

interface PendingActionSummary {
  id: string
  agentName: string
  actionType: string
  targetTable: string
  summary: string
  reasoning: string
  confidence: number
  expiresAt: string
}

interface PendingActionsOutput {
  actions: PendingActionSummary[]
  totalPending: number
  expiringToday: number
}

export async function getPendingActions(
  input: PendingActionsInput,
  supabase: SupabaseClient
): Promise<PendingActionsOutput> {
  const { userId, limit = 10 } = input

  // Get pending actions
  const { data: actions, count } = await supabase
    .from('proposed_actions')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(limit)

  // Count expiring today
  const endOfToday = new Date()
  endOfToday.setHours(23, 59, 59, 999)

  const { count: expiringCount } = await supabase
    .from('proposed_actions')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'pending')
    .lte('expires_at', endOfToday.toISOString())

  // Format actions for display
  const formattedActions: PendingActionSummary[] = (actions || []).map(a => ({
    id: a.id,
    agentName: a.agent_name,
    actionType: a.action_type,
    targetTable: a.target_table,
    summary: generateActionSummary(a),
    reasoning: a.reasoning || 'No reasoning provided',
    confidence: a.confidence || 0,
    expiresAt: a.expires_at
  }))

  return {
    actions: formattedActions,
    totalPending: count || 0,
    expiringToday: expiringCount || 0
  }
}

function generateActionSummary(action: any): string {
  const { action_type, target_table, payload } = action

  switch (action_type) {
    case 'create':
      if (target_table === 'tasks') {
        return `Create task: "${payload.title}"`
      }
      if (target_table === 'deals') {
        return `Create deal: "${payload.name}"`
      }
      return `Create new ${target_table.slice(0, -1)}`

    case 'update':
      if (target_table === 'tasks') {
        return `Update task: ${Object.keys(payload).join(', ')}`
      }
      return `Update ${target_table.slice(0, -1)}`

    case 'delete':
      return `Delete ${target_table.slice(0, -1)}`

    case 'send':
      return `Send ${payload.type || 'notification'}`

    default:
      return `${action_type} on ${target_table}`
  }
}
```

### Quick Action Execution

```typescript
// supabase/functions/ai-helper/dashboard/execute-quick-action.ts

interface QuickActionInput {
  actionId: string
  approve: boolean
  rejectionReason?: string
}

interface QuickActionOutput {
  success: boolean
  result?: any
  message: string
}

export async function executeQuickAction(
  input: QuickActionInput,
  context: AgentContext,
  supabase: SupabaseClient
): Promise<QuickActionOutput> {
  const { actionId, approve, rejectionReason } = input

  if (!approve) {
    // Reject the action
    await supabase
      .from('proposed_actions')
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason || 'User rejected'
      })
      .eq('id', actionId)
      .eq('user_id', context.userId)

    return {
      success: true,
      message: 'Action rejected'
    }
  }

  // Execute the approved action
  const result = await executeApprovedAction(
    actionId,
    context.userId,
    supabase
  )

  if (!result.success) {
    return {
      success: false,
      message: result.error || 'Execution failed'
    }
  }

  // Broadcast update
  await broadcastDashboardUpdate(
    context.startupId || '',
    context.userId,
    'action_executed',
    { actionId, result: result.data },
    supabase
  )

  return {
    success: true,
    result: result.data,
    message: 'Action executed successfully'
  }
}
```

---

## Best Practices Summary

### Dashboard Development Checklist

- [ ] Cache KPIs with appropriate TTL
- [ ] Use Flash model for quick insights
- [ ] Implement real-time subscriptions
- [ ] Cache risk analysis (15 min TTL)
- [ ] Calculate task priority scores
- [ ] Show pending actions count
- [ ] Support quick approve/reject
- [ ] Broadcast updates on changes

### Performance Tips

1. **Parallel data loading** - Load KPIs, risks, tasks in parallel
2. **Smart caching** - KPIs (1 min), Insights (30 min), Risks (15 min)
3. **Use Flash model** - For dashboard insights (speed > depth)
4. **Incremental updates** - Use realtime for changes
5. **Lazy load AI** - Risk analysis only when panel opens

---

## References

- [14-ai-agents.md](./14-ai-agents.md) - AI agent patterns
- [06-database-connections.md](./06-database-connections.md) - Database patterns

---

**Last Updated:** January 15, 2026
