# Edge Functions API Documentation - StartupAI

> **Generated:** 2026-02-02 | **Source:** MCP Supabase | **Total Functions:** 24

---

## Overview

| Metric | Value |
|--------|-------|
| Total Edge Functions | 24 |
| AI-Powered Agents | 12 |
| Utility Functions | 12 |
| JWT Required | 2 |
| Public Access | 22 |

---

## Quick Reference

| Function | Purpose | JWT | Actions |
|----------|---------|-----|---------|
| ai-chat | Multi-purpose AI chat | No | 5 |
| lean-canvas-agent | Business model canvas | No | 11 |
| investor-agent | Fundraising intelligence | No | 12 |
| crm-agent | Contact/deal management | No | 8 |
| task-agent | Task generation & planning | No | 6 |
| pitch-deck-agent | Pitch deck generation | No | 8+ |
| documents-agent | Document management | No | 6+ |
| event-agent | Event management | No | 6+ |
| onboarding-agent | Profile extraction | No | 3 |
| health | System health check | No | 1 |
| auth-check | Authentication test | Yes | 1 |
| workflow-trigger | Event automation | No | 5+ |

---

## ai-chat

**URL:** `POST /functions/v1/ai-chat`

**Description:** Multi-purpose AI chat supporting public website chat and authenticated startup assistance.

### Request Schema

```typescript
interface ChatRequest {
  message?: string;                    // Current user message
  messages?: Array<{                   // Chat history
    role: 'user' | 'assistant';
    content: string;
  }>;
  session_id?: string;                 // For message persistence
  room_id?: string;                    // For realtime broadcast
  mode?: 'public' | 'authenticated';   // Chat mode
  action?: 'chat' | 'prioritize_tasks' | 'generate_tasks' | 'extract_profile' | 'stage_guidance';
  context?: {
    screen?: string;                   // Current UI screen
    startup_id?: string;
    is_public?: boolean;
    data?: Record<string, unknown>;    // Additional context
  };
  stream?: boolean;                    // Enable streaming (not yet implemented)
}
```

### Actions

| Action | Model | Description |
|--------|-------|-------------|
| chat | gemini-3-flash-preview | General chat responses |
| prioritize_tasks | claude-sonnet-4-5 | Eisenhower matrix prioritization |
| generate_tasks | claude-haiku-4-5 | Generate onboarding tasks |
| extract_profile | gemini-3-flash-preview | Extract startup info from text |
| stage_guidance | gemini-3-flash-preview | Stage-specific recommendations |

### Response Schema

```typescript
interface ChatResponse {
  id: string;                          // Message UUID
  response: string;                    // AI response text
  message: string;                     // Alias for response
  suggested_actions: Array<{
    type: 'navigate' | 'auth';
    label: string;
    payload?: { route?: string; action?: string };
  }>;
  model: string;                       // Model used
  provider: 'gemini' | 'anthropic';
  mode: 'public' | 'authenticated';
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
}
```

### Error Codes

| Code | Meaning |
|------|---------|
| 400 | Message required |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## lean-canvas-agent

**URL:** `POST /functions/v1/lean-canvas-agent`

**Description:** AI-powered Lean Canvas operations including profile mapping, AI generation, validation, and version history.

### Request Schema

```typescript
interface LeanCanvasRequest {
  action: string;                      // Required action name
  startup_id?: string;                 // Startup UUID
  document_id?: string;                // Canvas document UUID
  version_id?: string;                 // Version to restore
  box_key?: string;                    // Canvas box key
  canvas_data?: Record<string, unknown>;
  gap_answers?: Record<string, string>;
  label?: string;                      // Version label
  industry?: string;
  stage?: string;
}
```

### Actions

| Action | Required Params | Description |
|--------|-----------------|-------------|
| map_profile | startup_id | Map startup profile to canvas boxes |
| check_profile_sync | startup_id, document_id | Check if profile changed since sync |
| prefill_canvas | startup_id | Generate all 9 boxes from profile |
| suggest_box | startup_id, box_key | Get AI suggestions for single box |
| validate_canvas | startup_id, canvas_data | Score and validate hypotheses |
| save_version | document_id | Save current canvas as version |
| load_versions | document_id | List all version history |
| restore_version | document_id, version_id | Restore a previous version |
| canvas_to_pitch | startup_id, canvas_data | Convert canvas to pitch slides |
| get_benchmarks | industry | Get industry benchmarks |
| suggest_pivots | startup_id, canvas_data | Suggest business model pivots |

### Response Examples

**map_profile response:**
```typescript
{
  canvas: LeanCanvasData;
  coverage: Record<BoxKey, 'HIGH' | 'MODERATE' | 'LOW'>;
  hasLowCoverage: boolean;
  lowCoverageBoxes: BoxKey[];
}
```

**validate_canvas response:**
```typescript
{
  overall_score: number;      // 0-100
  results: Array<{
    box: BoxKey;
    score: number;
    feedback: string;
    risk_level: 'critical' | 'moderate' | 'low';
    risk_reason: string;
    experiment: string;
  }>;
  top_risks: ValidationResult[];
}
```

### Canvas Box Keys

`problem` | `solution` | `uniqueValueProp` | `unfairAdvantage` | `customerSegments` | `keyMetrics` | `channels` | `costStructure` | `revenueStreams`

---

## investor-agent

**URL:** `POST /functions/v1/investor-agent`

**Description:** AI-powered investor relationship management, outreach generation, and fundraising intelligence.

### Request Schema

```typescript
interface InvestorRequest {
  action: string;
  startup_id: string;
  investor_id?: string;
  investor_ids?: string[];             // For compare_investors
  criteria?: {
    stage?: string;
    industry?: string;
    geography?: string;
    checkSize?: number;
  };
  outreach_type?: 'cold' | 'warm' | 'follow_up';
  engagement?: {
    type: 'email_sent' | 'email_opened' | 'meeting' | 'follow_up' | 'response';
    notes?: string;
    outcome?: string;
  };
  term_sheet_data?: {
    valuation: number;
    amount: number;
    investor_name: string;
    key_terms?: Record<string, unknown>;
  };
  linkedin_url?: string;
}
```

### Actions

| Action | Required Params | Description |
|--------|-----------------|-------------|
| discover_investors | startup_id | Find matching investor profiles |
| analyze_investor_fit | startup_id, investor_id | Score investor-startup fit |
| find_warm_paths | startup_id, investor_id | Identify intro paths |
| generate_outreach | startup_id, investor_id | Create personalized emails |
| track_engagement | investor_id, engagement | Log investor interactions |
| analyze_pipeline | startup_id | Analyze fundraising pipeline |
| score_deal | investor_id | Score deal probability |
| prepare_meeting | startup_id, investor_id | Generate meeting prep |
| enrich_investor | investor_id | Enrich profile data |
| compare_investors | investor_ids | Compare multiple investors |
| analyze_term_sheet | term_sheet_data | Analyze term sheet offer |
| generate_report | startup_id | Generate fundraising report |

### Response Examples

**analyze_investor_fit response:**
```typescript
{
  success: true;
  overall_score: number;
  breakdown: {
    thesis_alignment: { score: number; reasoning: string };
    stage_match: { score: number; reasoning: string };
    sector_fit: { score: number; reasoning: string };
    // ...
  };
  strengths: string[];
  concerns: string[];
  recommendation: 'Pursue' | 'Consider' | 'Deprioritize';
  next_steps: string[];
}
```

**generate_outreach response:**
```typescript
{
  success: true;
  outreach_type: string;
  subject_lines: string[];
  email_body: string;
  personalization_points: string[];
  call_to_action: string;
  follow_up_strategy: string;
  tips: string[];
}
```

---

## crm-agent

**URL:** `POST /functions/v1/crm-agent`

**Description:** CRM intelligence including contact enrichment, lead scoring, deal analysis, and email generation.

### Request Schema

```typescript
interface CRMRequest {
  action: string;
  startup_id?: string;
  contact_id?: string;
  deal_id?: string;
  linkedin_url?: string;
  name?: string;
  company?: string;
  email?: string;
  purpose?: string;                    // For generate_email
}
```

### Actions

| Action | Required Params | Description |
|--------|-----------------|-------------|
| enrich_contact | startup_id, (linkedin_url or name+company) | Enrich contact profile |
| score_lead | startup_id, contact_id | Score lead quality 0-100 |
| score_deal | startup_id, deal_id | Score deal probability |
| analyze_pipeline | startup_id | Analyze deal pipeline |
| generate_email | startup_id, contact_id | Generate personalized email |
| detect_duplicate | startup_id, name | Find duplicate contacts |
| summarize_communication | startup_id, contact_id | Summarize contact history |
| suggest_follow_ups | startup_id | Suggest contacts to follow up |

### Response Examples

**score_lead response:**
```typescript
{
  success: true;
  score: number;              // 0-100
  factors: string[];
}
```

**analyze_pipeline response:**
```typescript
{
  success: true;
  bottlenecks: string[];
  forecast: {
    monthly: number;
    quarterly: number;
  };
  stalling: Array<{
    id: string;
    name: string;
    days: number;
  }>;
}
```

**generate_email response:**
```typescript
{
  success: true;
  subject: string;
  body: string;
  tone: string;
}
```

---

## task-agent

**URL:** `POST /functions/v1/task-agent`

**Description:** AI task generation, prioritization, and productivity analysis.

### Request Schema

```typescript
interface TaskRequest {
  action: string;
  startup_id: string;
  project_id?: string;
  task_id?: string;
  task_ids?: string[];
  context?: string;
  count?: number;
  focus_area?: string;
  available_time?: number;         // minutes
  energy_level?: 'high' | 'medium' | 'low';
  days?: number;                   // For analyze_productivity
  available_hours?: number;        // For generate_daily_plan
  priorities?: string[];
}
```

### Actions

| Action | Required Params | Description |
|--------|-----------------|-------------|
| generate_tasks | startup_id | Generate AI tasks |
| prioritize_tasks | startup_id | Prioritize using impact/urgency |
| suggest_next | startup_id | Suggest tasks to work on |
| breakdown_task | startup_id, task_id | Break complex task into subtasks |
| analyze_productivity | startup_id | Analyze completion patterns |
| generate_daily_plan | startup_id | Create optimized daily plan |

### Response Examples

**generate_tasks response:**
```typescript
{
  success: true;
  tasks: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    estimated_hours: number;
    suggested_due_days: number;
  }>;
  reasoning: string;
  count: number;
}
```

**prioritize_tasks response:**
```typescript
{
  success: true;
  prioritized_tasks: Array<{
    task_id: string;
    new_priority: string;
    rank: number;
    reasoning: string;
    impact_score: number;
    urgency_score: number;
    effort_estimate: string;
  }>;
  focus_recommendation: string;
  defer_recommendation: string;
  updated_count: number;
}
```

**generate_daily_plan response:**
```typescript
{
  success: true;
  available_hours: number;
  plan: Array<{
    time_block: string;
    task: string;
    duration_minutes: number;
    focus_type: 'deep_work' | 'meetings' | 'admin';
    energy_required: string;
    tip: string;
  }>;
  breaks: string[];
  buffer_time: string;
  daily_goal: string;
  evening_prep: string;
}
```

---

## onboarding-agent

**URL:** `POST /functions/v1/onboarding-agent`

**Description:** Extract startup profile data from URLs, LinkedIn, and documents during onboarding wizard.

### Request Schema

```typescript
interface OnboardingRequest {
  action: 'extract_website' | 'extract_linkedin' | 'analyze_pitch_deck';
  url?: string;
  linkedin_url?: string;
  file_content?: string;
  startup_id?: string;
}
```

### Actions

| Action | Required Params | Description |
|--------|-----------------|-------------|
| extract_website | url | Scrape and analyze startup website |
| extract_linkedin | linkedin_url | Extract founder/company from LinkedIn |
| analyze_pitch_deck | file_content | Analyze uploaded pitch deck |

### Response Example

```typescript
{
  success: true;
  extracted: {
    company_name: string;
    tagline: string;
    description: string;
    industry: string;
    stage: string;
    target_market: string;
    business_model: string[];
    key_features: string[];
    team_size: number;
    funding_raised: number;
  };
  confidence_scores: Record<string, number>;
  suggestions: string[];
}
```

---

## All Edge Functions

| # | Slug | JWT | Version | Description |
|---|------|-----|---------|-------------|
| 1 | ai-chat | No | 63 | Multi-purpose AI chat |
| 2 | lean-canvas-agent | No | 35 | Business model canvas |
| 3 | investor-agent | No | 28 | Fundraising intelligence |
| 4 | crm-agent | No | 30 | Contact & deal management |
| 5 | task-agent | No | 27 | Task generation & planning |
| 6 | pitch-deck-agent | No | 49 | Pitch deck generation |
| 7 | documents-agent | No | 31 | Document management |
| 8 | event-agent | No | 27 | Event management |
| 9 | onboarding-agent | No | 109 | Profile extraction |
| 10 | dashboard-metrics | No | 24 | Dashboard data aggregation |
| 11 | stage-analyzer | No | 23 | Startup stage detection |
| 12 | insights-generator | No | 27 | AI insights generation |
| 13 | action-recommender | No | 8 | Action recommendations |
| 14 | health-scorer | No | 8 | Startup health scoring |
| 15 | workflow-trigger | No | 9 | Event-driven automation |
| 16 | industry-expert-agent | No | 10 | Industry-specific advice |
| 17 | prompt-pack | No | 5 | Prompt pack execution |
| 18 | health | No | 9 | System health check |
| 19 | auth-check | Yes | 9 | Authentication test |
| 20 | stripe-webhook | No | 9 | Stripe payment webhooks |
| 21 | generate-image | Yes | 10 | AI image generation |
| 22 | whatsapp-agent | Yes | 6 | WhatsApp integration |
| 23 | chatbot-agent | Yes | 1 | Chatbot integration |
| 24 | compute-daily-focus | No | 1 | Daily focus computation |

---

## Common Response Patterns

### Success Response

```typescript
{
  success: true;
  // ... action-specific data
}
```

### Error Response

```typescript
{
  error: string;           // Error type
  message: string;         // Human-readable message
  success?: false;
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing params) |
| 401 | Unauthorized |
| 429 | Rate limited |
| 500 | Server error |

---

## Authentication

All edge functions accept an optional `Authorization` header with a Supabase JWT:

```
Authorization: Bearer <jwt_token>
```

Functions marked with JWT=Yes **require** authentication. Others can work in both authenticated and anonymous modes.

---

## AI Models Used

| Provider | Model | Use Case |
|----------|-------|----------|
| Gemini | gemini-3-flash-preview | Fast tasks, extraction |
| Gemini | gemini-3-pro-preview | Deep analysis |
| Anthropic | claude-sonnet-4-5 | Complex reasoning |
| Anthropic | claude-haiku-4-5 | Fast task generation |

---

*Generated by Claude Code — 2026-02-02*
