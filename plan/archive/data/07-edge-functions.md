# Edge Functions Strategy

> **Updated:** 2026-02-02 | **Status:** Production Ready | **Count:** 19 Deployed

---

## Executive Summary

StartupAI uses **19 Supabase Edge Functions** to power AI agents, workflow automation, and utility services. This document maps the complete edge function architecture with function categories, data flows, and deployment strategy.

### Key Metrics

| Metric | Value |
|--------|-------|
| Total Deployed | 19 |
| AI Agents | 14 |
| Rule-Based Workers | 2 |
| Utilities | 2 |
| Shared Module | 1 |

### Strategic Architecture

```mermaid
C4Context
    title StartupAI Edge Functions Architecture

    Person(founder, "Startup Founder", "Primary user building startup")

    System_Boundary(frontend, "React Frontend") {
        Container(spa, "SPA", "React + Vite", "User interface")
    }

    System_Boundary(edge, "Edge Functions Layer") {
        Container(agents, "AI Agents", "Deno + Gemini/Claude", "Intelligent processing")
        Container(workers, "Workers", "Deno", "Rule-based automation")
        Container(shared, "_shared", "Deno", "Common utilities")
    }

    System_Boundary(backend, "Backend Services") {
        ContainerDb(supabase, "Supabase", "PostgreSQL", "Data persistence")
        Container(storage, "Storage", "S3", "File storage")
    }

    System_Ext(gemini, "Gemini 3 API", "Google AI")
    System_Ext(claude, "Claude API", "Anthropic")

    Rel(founder, spa, "Uses")
    Rel(spa, agents, "Invokes")
    Rel(spa, workers, "Triggers")
    Rel(agents, supabase, "Reads/Writes")
    Rel(workers, supabase, "Reads/Writes")
    Rel(agents, gemini, "AI calls")
    Rel(agents, claude, "AI calls")
```

---

## Function Categories

### AI Agents (14 Functions)

Intelligent functions that use Gemini 3 or Claude for reasoning, generation, and analysis.

```mermaid
flowchart TB
    subgraph AI_AGENTS["AI Agents"]
        direction TB

        OA[onboarding-agent]
        AC[ai-chat]
        PDA[pitch-deck-agent]
        LCA[lean-canvas-agent]
        DA[documents-agent]
        CRMA[crm-agent]
        SA[stage-analyzer]
        DM[dashboard-metrics]
        VA[validation-agent]
        IA[investor-agent]
        TA[task-agent]
        IEA[industry-expert-agent]
        AR[action-recommender]
        HS[health-scorer]
    end

    subgraph AI_PROVIDERS["AI Providers"]
        G3[Gemini 3 Flash]
        G3P[Gemini 3 Pro]
        C4[Claude Sonnet 4.5]
    end

    OA --> G3
    AC --> G3
    AC --> C4
    PDA --> G3P
    LCA --> G3
    DA --> G3
    CRMA --> G3
    SA --> G3
    DM --> G3
    VA --> G3
    VA --> C4
    IA --> G3
    TA --> G3
    IEA --> G3
    AR --> G3
    HS --> G3
```

| Function | Purpose | AI Model | Actions |
|----------|---------|----------|---------|
| onboarding-agent | Extract startup data from websites, guide setup | Gemini 3 Flash | create_session, enrich_url, enrich_context, calculate_readiness, get_questions, process_answer, calculate_score, generate_summary, complete_wizard, generate_competitors |
| ai-chat | Multi-turn conversation with context | Gemini 3 Flash + Claude | chat, prioritize_tasks, generate_tasks, extract_profile, stage_guidance |
| pitch-deck-agent | Generate and refine pitch decks | Gemini 3 Pro | generate_deck, update_slide, analyze_slide, suggestions, images, research, wizard |
| lean-canvas-agent | Create and validate business models | Gemini 3 Flash/Pro | map_profile, check_profile_sync, prefill_canvas, suggest_box, validate_canvas, save_version, load_versions, restore_version, canvas_to_pitch, get_benchmarks, suggest_pivots, extract_assumptions |
| documents-agent | Generate startup documents | Gemini 3 Flash | generate_document, summarize, extract |
| crm-agent | Analyze contacts and deals | Gemini 3 Flash | analyze_contact, score_deal, suggest_action |
| stage-analyzer | Determine startup stage | Gemini 3 Flash | analyze_stage, recommend_focus |
| dashboard-metrics | Calculate startup KPIs | Gemini 3 Flash | calculate_kpis, trend_analysis |
| validation-agent | Validate assumptions and design experiments | Gemini 3 + Claude | extract_assumptions, design_experiment, analyze_interview, analyze_segment, update_assumption_status |
| investor-agent | Investor research and matching | Gemini 3 Flash | research_investor, match_investors, prepare_outreach |
| task-agent | Task generation and prioritization | Gemini 3 Flash | generate_tasks, prioritize, suggest_next |
| industry-expert-agent | Industry-specific guidance | Gemini 3 Flash | get_industry_insights, benchmark_analysis |
| action-recommender | Suggest next actions | Gemini 3 Flash | recommend_actions, daily_focus |
| health-scorer | Startup health assessment | Gemini 3 Flash | calculate_health, identify_risks |

### Rule-Based Workers (2 Functions)

Deterministic functions that execute business logic without AI.

```mermaid
flowchart TB
    subgraph WORKERS["Rule-Based Workers"]
        direction TB

        WT[workflow-trigger]
        CDF[compute-daily-focus]
    end

    subgraph TRIGGERS["Triggers"]
        DB[(Database)]
        CRON[Cron Jobs]
    end

    DB --> WT
    CRON --> CDF
```

| Function | Purpose | Trigger |
|----------|---------|---------|
| workflow-trigger | Orchestrate multi-step processes | Database events |
| compute-daily-focus | Calculate daily priorities | Cron (daily) |

### Utilities (2 Functions)

Support functions for common operations.

| Function | Purpose | Integration |
|----------|---------|-------------|
| prompt-pack | Run prompt pack workflows | Internal |
| insights-generator | Generate insights from data | Internal |

### Shared Module (_shared)

Common utilities imported by all edge functions.

```
supabase/functions/_shared/
├── index.ts              # Re-exports all utilities
├── cors.ts               # CORS headers utility
├── auth.ts               # JWT verification, user context
├── database.ts           # Supabase client helpers, CRUD
├── errors.ts             # Error classes, response helpers
├── ai-client.ts          # Gemini/Claude unified client
├── types.ts              # Shared TypeScript types
├── prompt-utils.ts       # Prompt interpolation, validation
└── master-system-prompt.ts # Lean methodology prompts
```

---

## Core Agent Flows

### Onboarding Agent Flow

```mermaid
flowchart TD
    START([User Starts Onboarding]) --> STEP1[Step 1: Enter Website URL]
    STEP1 --> FETCH[Fetch Website Content]
    FETCH --> EXTRACT[AI: Extract Company Data]
    EXTRACT --> STEP2[Step 2: Confirm Industry]
    STEP2 --> RESEARCH[AI: Research Industry]
    RESEARCH --> STEP3[Step 3: Add Team Members]
    STEP3 --> STEP4[Step 4: Traction & Funding]
    STEP4 --> CREATE[Create Startup Record]
    CREATE --> TRIGGER[Trigger: workflow-trigger]
    TRIGGER --> PARALLEL{Parallel Tasks}
    PARALLEL --> LEAN[Generate Lean Canvas]
    PARALLEL --> TASKS[Create Initial Tasks]
    PARALLEL --> FOCUS[Compute Daily Focus]
    LEAN --> DONE([Onboarding Complete])
    TASKS --> DONE
    FOCUS --> DONE
```

### Lean Canvas Agent Flow

```mermaid
flowchart TD
    START([Open Lean Canvas]) --> CHECK{Has Canvas?}
    CHECK -->|No| MAP[map_profile: Map startup data]
    CHECK -->|Yes| LOAD[load_versions: Get history]

    MAP --> GAPS{Low Coverage?}
    GAPS -->|Yes| QUESTIONS[Show gap questions]
    QUESTIONS --> PREFILL[prefill_canvas: AI generation]
    GAPS -->|No| PREFILL

    PREFILL --> EDIT[User edits boxes]
    LOAD --> EDIT

    EDIT --> SUGGEST[suggest_box: AI suggestions]
    SUGGEST --> EDIT

    EDIT --> VALIDATE[validate_canvas: Risk assessment]
    VALIDATE --> ASSUMPTIONS[extract_assumptions: Create assumptions]
    ASSUMPTIONS --> EXPERIMENTS[Design experiments]

    EDIT --> SAVE[save_version: Snapshot]
    EDIT --> PITCH[canvas_to_pitch: Generate pitch]
    EDIT --> PIVOTS[suggest_pivots: Explore pivots]

    VALIDATE --> DONE([Canvas Complete])
```

### Validation Agent Flow

```mermaid
flowchart TD
    START([Validation Lab]) --> SOURCE{Input Source}

    SOURCE -->|Lean Canvas| EXTRACT[extract_assumptions]
    SOURCE -->|Interview| ANALYZE[analyze_interview]
    SOURCE -->|Segment| SEGMENT[analyze_segment]

    EXTRACT --> ASSUMPTIONS[(assumptions table)]
    ANALYZE --> INSIGHTS[(interview_insights table)]
    SEGMENT --> SEGMENTS[(customer_segments table)]
    SEGMENT --> FORCES[(customer_forces table)]
    SEGMENT --> JOBS[(jobs_to_be_done table)]

    ASSUMPTIONS --> DESIGN[design_experiment]
    DESIGN --> EXPERIMENTS[(experiments table)]

    EXPERIMENTS --> RUN[Run Experiment]
    RUN --> RESULTS[(experiment_results table)]
    RESULTS --> UPDATE[update_assumption_status]
    UPDATE --> ASSUMPTIONS

    INSIGHTS --> LINK[Link to assumptions]
    LINK --> ASSUMPTIONS
```

### AI Chat Flow

```mermaid
flowchart TD
    USER([User Message]) --> CONTEXT[Load Conversation Context]
    CONTEXT --> ROUTE{Route by Mode}

    ROUTE -->|General| GEMINI[Gemini 3 Flash]
    ROUTE -->|Complex| CLAUDE[Claude Sonnet 4.5]
    ROUTE -->|Research| SEARCH[Web Search + Gemini]

    GEMINI --> RESPONSE[Generate Response]
    CLAUDE --> RESPONSE
    SEARCH --> RESPONSE

    RESPONSE --> SAVE[Save to History]
    SAVE --> STREAM[Stream to User]
    STREAM --> DONE([Response Complete])
```

### Pitch Deck Agent Flow

```mermaid
flowchart TD
    START([Create Pitch Deck]) --> WIZARD[Wizard: Gather Info]
    WIZARD --> STEP1[Step 1: Company Basics]
    STEP1 --> STEP2[Step 2: Problem & Solution]
    STEP2 --> STEP3[Step 3: Market & Competition]
    STEP3 --> GENERATE[AI: Generate Deck]

    GENERATE --> SLIDES{Generate Slides}
    SLIDES --> S1[Title Slide]
    SLIDES --> S2[Problem Slide]
    SLIDES --> S3[Solution Slide]
    SLIDES --> S4[Market Slide]
    SLIDES --> S5[Business Model]
    SLIDES --> S6[Team Slide]
    SLIDES --> S7[Financials]
    SLIDES --> S8[Ask Slide]

    S1 --> IMAGES[AI: Generate Visuals]
    S2 --> IMAGES
    S3 --> IMAGES
    S4 --> IMAGES
    S5 --> IMAGES
    S6 --> IMAGES
    S7 --> IMAGES
    S8 --> IMAGES

    IMAGES --> REVIEW[Review & Edit]
    REVIEW --> EXPORT([Export PDF])
```

### Workflow Trigger Flow

```mermaid
flowchart TD
    EVENT([Database Event]) --> PARSE[Parse Event Type]
    PARSE --> ROUTE{Event Router}

    ROUTE -->|startup.created| WF1[Onboarding Workflow]
    ROUTE -->|task.completed| WF2[Task Progress Workflow]
    ROUTE -->|deal.updated| WF3[CRM Workflow]
    ROUTE -->|document.created| WF4[Document Workflow]
    ROUTE -->|canvas.validated| WF5[Validation Workflow]

    WF1 --> ACTIONS1{Actions}
    ACTIONS1 --> A1[Create Lean Canvas]
    ACTIONS1 --> A2[Generate Tasks]
    ACTIONS1 --> A3[Send Welcome Email]

    WF2 --> ACTIONS2{Actions}
    ACTIONS2 --> A4[Update Metrics]
    ACTIONS2 --> A5[Check Milestones]
    ACTIONS2 --> A6[Notify User]

    WF5 --> ACTIONS5{Actions}
    ACTIONS5 --> A11[Extract Assumptions]
    ACTIONS5 --> A12[Suggest Experiments]
    ACTIONS5 --> A13[Update Roadmap]

    A1 --> DONE([Workflow Complete])
    A2 --> DONE
    A3 --> DONE
```

---

## Deployed Functions Table

| # | Function | Category | Status | Key Actions |
|---|----------|----------|--------|-------------|
| 1 | onboarding-agent | AI Agent | ✅ Active | enrich_url, calculate_readiness, complete_wizard |
| 2 | ai-chat | AI Agent | ✅ Active | chat, prioritize_tasks, stage_guidance |
| 3 | pitch-deck-agent | AI Agent | ✅ Active | generate_deck, update_slide, wizard |
| 4 | lean-canvas-agent | AI Agent | ✅ Active | prefill_canvas, validate_canvas, extract_assumptions |
| 5 | documents-agent | AI Agent | ✅ Active | generate_document, summarize |
| 6 | crm-agent | AI Agent | ✅ Active | analyze_contact, score_deal |
| 7 | stage-analyzer | AI Agent | ✅ Active | analyze_stage, recommend_focus |
| 8 | dashboard-metrics | AI Agent | ✅ Active | calculate_kpis, trend_analysis |
| 9 | validation-agent | AI Agent | ✅ Active | extract_assumptions, design_experiment, analyze_interview |
| 10 | investor-agent | AI Agent | ✅ Active | research_investor, match_investors |
| 11 | task-agent | AI Agent | ✅ Active | generate_tasks, prioritize |
| 12 | industry-expert-agent | AI Agent | ✅ Active | get_industry_insights |
| 13 | action-recommender | AI Agent | ✅ Active | recommend_actions |
| 14 | health-scorer | AI Agent | ✅ Active | calculate_health |
| 15 | workflow-trigger | Worker | ✅ Active | handle_event, execute_workflow |
| 16 | compute-daily-focus | Worker | ✅ Active | calculate_priorities |
| 17 | prompt-pack | Utility | ✅ Active | run_pack, apply_pack |
| 18 | insights-generator | Utility | ✅ Active | generate_insights |
| 19 | event-agent | Worker | ✅ Active | handle_events |

---

## Shared Utilities (_shared)

All edge functions import from `_shared` for consistent patterns:

```typescript
// Import from shared utilities
import { corsHeaders, handleCors } from '../_shared/cors.ts';
import { requireAuth, UserContext } from '../_shared/auth.ts';
import { create, update, getById } from '../_shared/database.ts';
import { callGemini, callClaude, parseAIJson } from '../_shared/ai-client.ts';
import { successResponse, errorResponse, ValidationError } from '../_shared/errors.ts';
```

### Available Utilities

| Module | Exports | Purpose |
|--------|---------|---------|
| cors.ts | corsHeaders, handleCors, withCors | CORS handling |
| auth.ts | requireAuth, verifyAuth, createUserClient, createServiceClient | Authentication |
| database.ts | create, update, delete, getById, getPaginated, getStartupContext | Database operations |
| errors.ts | AppError, ValidationError, errorResponse, successResponse | Error handling |
| ai-client.ts | callGemini, callClaude, callAI, parseAIJson, calculateCost | AI client |
| types.ts | Startup, Assumption, Experiment, Task, etc. | Type definitions |

---

## Security Architecture

```mermaid
flowchart TD
    REQ([Incoming Request]) --> CORS[CORS Headers]
    CORS --> AUTH{JWT Validation}

    AUTH -->|Invalid| REJECT[401 Unauthorized]
    AUTH -->|Valid| EXTRACT[Extract User ID]

    EXTRACT --> RLS[RLS Policy Check]
    RLS -->|Denied| FORBIDDEN[403 Forbidden]
    RLS -->|Allowed| PROCESS[Process Request]

    PROCESS --> DB[(Database)]
    DB --> RESPONSE[Response]
    RESPONSE --> LOG[AI Run Log]
    LOG --> DONE([Return Response])
```

### Security Checklist

| Check | Implementation |
|-------|----------------|
| JWT Verification | All functions verify JWT via `requireAuth()` |
| RLS Enforcement | All database queries go through RLS policies |
| Environment Variables | Credentials stored in Supabase Secrets |
| CORS | Configured via `_shared/cors.ts` |
| Rate Limiting | Supabase built-in rate limiting |
| Error Handling | No sensitive data in error responses |
| Cost Tracking | AI runs logged to `ai_runs` table |

---

## Deployment Strategy

### Environment Variables

All edge functions use these standard environment variables:

| Variable | Source | Purpose |
|----------|--------|---------|
| SUPABASE_URL | Auto-injected | Database connection |
| SUPABASE_ANON_KEY | Auto-injected | Public client key |
| SUPABASE_SERVICE_ROLE_KEY | Secret | Admin operations |
| GEMINI_API_KEY | Secret | Google AI access |
| ANTHROPIC_API_KEY | Secret | Claude AI access |

### Deployment Commands

```bash
# Deploy single function
supabase functions deploy function-name

# Deploy all functions
supabase functions deploy

# View logs
supabase functions logs function-name

# Set secrets
supabase secrets set GEMINI_API_KEY=your-key
```

---

## Best Practices

### Code Standards

1. **Use Web APIs** - Prefer `fetch` over axios, native WebSocket over libraries
2. **Shared utilities** - Import from `_shared/`, no cross-dependencies between functions
3. **Versioned imports** - Use `npm:package@version` or `jsr:package@version`
4. **Deno.serve** - Use built-in server, not `serve` from deno.land
5. **Structured output** - Use Gemini's responseSchema for JSON responses
6. **Cost tracking** - Log all AI calls to `ai_runs` table

### AI Function Pattern

```typescript
import { GoogleGenAI, Type } from "npm:@google/genai@^0.21.0";
import { corsHeaders } from '../_shared/cors.ts';
import { requireAuth } from '../_shared/auth.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { user, supabase } = await requireAuth(req);

  const ai = new GoogleGenAI({ apiKey: Deno.env.get('GEMINI_API_KEY') });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  // Log AI run for cost tracking
  await supabase.from('ai_runs').insert({
    user_id: user.userId,
    agent_name: 'MyAgent',
    model: 'gemini-3-flash-preview',
    // ...
  });

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
```

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Cold Start | < 500ms | ~300ms |
| Warm Response | < 200ms | ~150ms |
| AI Agent Response | < 5s | ~3s |
| Error Rate | < 1% | 0.3% |
| Uptime | 99.9% | 99.95% |

---

*Document maintained by StartupAI Engineering — Last updated 2026-02-02*
