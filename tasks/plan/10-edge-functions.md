# Edge Functions Inventory

> Complete inventory of 24 deployed Supabase edge functions

---

## Overview

| Category | Count | Purpose |
|----------|-------|---------|
| AI Agents | 10 | Core AI-powered features |
| Analytics | 5 | Scoring, metrics, insights |
| Automation | 2 | Triggers, workflows |
| Utilities | 4 | Auth, health, prompts, events |
| Channels | 1 | WhatsApp integration |
| Media | 1 | Image generation |

**Total: 24 functions deployed**

---

## AI Agent Functions (10)

### 1. ai-chat
**Purpose:** Main chat interface with AI
**Status:** ✅ Active (63 deployments)
**Model:** Gemini 3 Flash/Pro

| Action | Description |
|--------|-------------|
| `chat` | General conversation |
| `prioritize_tasks` | AI task prioritization |
| `generate_tasks` | Create tasks from context |
| `extract_profile` | Extract data from text |
| `stage_guidance` | Stage-specific advice |

---

### 2. onboarding-agent
**Purpose:** Extract data during onboarding
**Status:** ✅ Active (109 deployments - most used)
**Model:** Gemini 3 Flash

| Action | Description |
|--------|-------------|
| `extract_url` | Extract company info from URL |
| `extract_linkedin` | Extract profile from LinkedIn |
| `extract_text` | Parse unstructured text |

---

### 3. lean-canvas-agent
**Purpose:** Canvas generation and validation
**Status:** ✅ Active (35 deployments)
**Model:** Gemini 3 Pro

| Action | Description |
|--------|-------------|
| `mapProfile` | Map extracted data to canvas |
| `prefillCanvas` | Auto-fill canvas from profile |
| `validateCanvas` | Score and validate canvas |
| `suggestPivots` | Suggest pivot options |
| `extractAssumptions` | Find riskiest assumptions |
| `generateBenchmarks` | Industry comparisons |
| `conductResearch` | Market research |
| `generatePitch` | Create pitch content |
| + 8 more actions | Total: 16+ actions |

---

### 4. validation-agent
**Purpose:** Lean startup validation workflow
**Status:** ✅ Active
**Model:** Gemini 3 Pro / Claude

| Action | Description |
|--------|-------------|
| `extract_assumptions` | Find assumptions from canvas |
| `design_experiment` | Create validation experiment |
| `analyze_interview` | Process interview transcripts |
| `update_assumption` | Update status with evidence |
| `create_segment` | Define customer segment |
| `map_jtbd` | Jobs-to-be-done mapping |
| `identify_forces` | Customer forces analysis |

---

### 5. pitch-deck-agent
**Purpose:** Create and refine pitch decks
**Status:** ✅ Active (49 deployments)
**Model:** Claude Sonnet 4.5

| Action | Description |
|--------|-------------|
| `generateDeck` | Create full 12-slide deck |
| `updateSlide` | Edit individual slide |
| `analyzeSlide` | Get feedback on slide |
| `conductMarketResearch` | Market size, TAM/SAM/SOM |
| `generateCompAnalysis` | Competitor analysis |
| `craftNarrative` | Story arc development |
| + 11 more actions | Total: 17+ actions |

---

### 6. crm-agent
**Purpose:** CRM and investor management
**Status:** ✅ Active (30 deployments)
**Model:** Gemini 3 Flash

| Action | Description |
|--------|-------------|
| `enrich_contact` | Add data to contact |
| `score_lead` | Lead qualification |
| `generate_email` | Draft outreach |
| `segment_contacts` | Group contacts |
| `analyze_pipeline` | Pipeline insights |
| + 10 more actions | Total: 15 actions |

---

### 7. investor-agent
**Purpose:** Investor matching and analysis
**Status:** ✅ Active (28 deployments)
**Model:** Gemini 3 Flash/Pro

| Action | Description |
|--------|-------------|
| `match_investors` | Find relevant investors |
| `analyze_fit` | Score investor fit |
| `generate_intro` | Warm intro request |
| `research_fund` | Fund deep-dive |

---

### 8. documents-agent
**Purpose:** Document generation and analysis
**Status:** ✅ Active (31 deployments)
**Model:** Claude Sonnet 4.5

| Action | Description |
|--------|-------------|
| `generate_document` | Create new document |
| `analyze_document` | Extract insights |
| `improve_section` | Rewrite section |
| `compare_versions` | Diff analysis |

---

### 9. industry-expert-agent
**Purpose:** Industry-specific expertise
**Status:** ✅ Active (10 deployments)
**Model:** Gemini 3 Flash/Pro

| Action | Description |
|--------|-------------|
| `get_industry_context` | Load industry data |
| `get_questions` | Industry-specific questions |
| `coach_answer` | Expert response |
| `validate_canvas` | Industry validation |
| `pitch_feedback` | Industry-aware feedback |
| `get_benchmarks` | Industry metrics |
| `analyze_competitors` | Competitive analysis |
| `get_validation_history` | Past validations |

---

### 10. task-agent
**Purpose:** AI task management
**Status:** ✅ Active (27 deployments)
**Model:** Gemini 3 Flash

| Action | Description |
|--------|-------------|
| `generate_tasks` | Create tasks from context |
| `prioritize` | AI prioritization |
| `suggest_next` | Next action recommendation |

---

## Analytics Functions (5)

### 11. health-scorer
**Purpose:** Calculate startup health score
**Status:** ✅ Active (8 deployments)

| Dimension | Description |
|-----------|-------------|
| `problemClarity` | Problem definition quality |
| `solutionFit` | Solution-problem match |
| `marketUnderstanding` | Market knowledge depth |
| `tractionProof` | Evidence of traction |
| `teamReadiness` | Team capability |
| `investorReadiness` | Fundraising preparedness |

**Output:** Overall score (0-100) + dimension breakdown + warnings

---

### 12. stage-analyzer
**Purpose:** Determine startup stage
**Status:** ✅ Active (23 deployments)

| Stage | Score Range |
|-------|-------------|
| Ideation | 0-20 |
| Validation | 20-40 |
| MVP | 40-60 |
| Growth | 60-80 |
| Scale | 80-100 |

**Output:** Current stage, detected stage, transition readiness

---

### 13. insights-generator
**Purpose:** Generate insights from data
**Status:** ✅ Active (27 deployments)
**Model:** Gemini 3 Flash

| Insight Type | Description |
|--------------|-------------|
| `opportunity` | Growth opportunities |
| `risk` | Warning signals |
| `action` | Recommended actions |
| `milestone` | Progress markers |

---

### 14. action-recommender
**Purpose:** Recommend next actions
**Status:** ✅ Active (8 deployments)

| Module | Description |
|--------|-------------|
| `canvas` | Canvas improvements |
| `pitch` | Pitch refinements |
| `tasks` | Task priorities |
| `crm` | CRM actions |
| `profile` | Profile completion |
| `validation` | Validation steps |

**Output:** Today's focus, upcoming tasks, recent activity

---

### 15. dashboard-metrics
**Purpose:** Dashboard summary data
**Status:** ✅ Active (24 deployments)

| Metric | Description |
|--------|-------------|
| `decksCount` | Pitch decks |
| `investorsCount` | Tracked investors |
| `tasksCount` | Tasks |
| `eventsCount` | Events |
| `documentsCount` | Documents |
| `contactsCount` | CRM contacts |
| `dealsCount` | Active deals |
| `projectsCount` | Projects |

---

## Automation Functions (2)

### 16. workflow-trigger
**Purpose:** Score-to-task automation
**Status:** ✅ Active
**Rules:** 18 trigger rules

| Source | Rules |
|--------|-------|
| `health_score` | 8 rules (problem, solution, market, etc.) |
| `investor_score` | Investor readiness gaps |
| `validation_report` | Validation gaps |

**Logic:** When score < threshold → Auto-create corrective task

---

### 17. compute-daily-focus
**Purpose:** Calculate daily priorities
**Status:** ✅ Active (1 deployment)

| Signal | Weight |
|--------|--------|
| `health_gap` | 25% |
| `task_priority` | 25% |
| `stage_relevance` | 25% |
| `time_urgency` | 15% |
| `momentum` | 10% |

**Output:** Daily focus items ranked by score

---

## Utility Functions (4)

### 18. prompt-pack
**Purpose:** Prompt template management
**Status:** ✅ Active (5 deployments)

| Action | Description |
|--------|-------------|
| `search` | Find pack for module/industry |
| `run_step` | Execute single step |
| `run_pack` | Execute full pack |
| `apply` | Write outputs to tables |

---

### 19. event-agent
**Purpose:** Event discovery and management
**Status:** ✅ Active (27 deployments)
**Model:** Gemini 3 Flash

Manages events (conferences, pitch competitions, networking)

---

### 20. auth-check
**Purpose:** Authentication verification
**Status:** ✅ Deployed (9 deployments)
**Note:** Legacy, deployed only

---

### 21. health
**Purpose:** System health check
**Status:** ✅ Deployed (9 deployments)
**Note:** Legacy, deployed only

---

## Payment Functions (1)

### 22. stripe-webhook
**Purpose:** Handle Stripe payment events
**Status:** ✅ Deployed (9 deployments)
**Note:** Legacy, deployed only

---

## Channel Functions (1)

### 23. whatsapp-agent
**Purpose:** WhatsApp integration
**Status:** ✅ Deployed (6 deployments)
**Note:** Legacy, deployed only

---

## Media Functions (1)

### 24. generate-image
**Purpose:** AI image generation
**Status:** ✅ Deployed (10 deployments)
**Model:** Gemini 3 Pro Image
**Note:** Legacy, deployed only

---

## Model Usage Summary

| Model | Functions | Use Case |
|-------|-----------|----------|
| `gemini-3-flash-preview` | 8 | Fast operations |
| `gemini-3-pro-preview` | 4 | Deep analysis |
| `claude-sonnet-4-5` | 2 | Writing quality |
| `gemini-3-pro-image` | 1 | Image generation |

---

## Agent → Function Mapping

| Agent | Primary | Supporting |
|-------|---------|------------|
| **Coach** | `ai-chat` | `industry-expert-agent`, `health-scorer`, `workflow-trigger` |
| **Extractor** | `onboarding-agent` | - |
| **Generator** | `lean-canvas-agent` | `validation-agent`, `documents-agent` |
| **Pitch** | `pitch-deck-agent` | - |
| **CRM** | `crm-agent` | `investor-agent` |

---

## Enhancement Needs for Coach

| Function | Enhancement | Purpose |
|----------|-------------|---------|
| `ai-chat` | Add `coach_mode` action | State machine, phases |
| `lean-canvas-agent` | Add 7-dimension scoring | Validation Report |
| `health-scorer` | Align dimensions | Match coach 7 dimensions |
| `workflow-trigger` | Connect to sprints | Auto-tasks from coach |

---

## Deployment Stats (Top 10)

| Function | Deployments | Last Updated |
|----------|-------------|--------------|
| `onboarding-agent` | 109 | 4 days ago |
| `ai-chat` | 63 | 4 days ago |
| `pitch-deck-agent` | 49 | 4 days ago |
| `lean-canvas-agent` | 35 | 4 days ago |
| `documents-agent` | 31 | 4 days ago |
| `crm-agent` | 30 | 4 days ago |
| `investor-agent` | 28 | 4 days ago |
| `task-agent` | 27 | 4 days ago |
| `event-agent` | 27 | 4 days ago |
| `insights-generator` | 27 | 4 days ago |

---

## Local vs Deployed

| Local (20) | Deployed Only (4) |
|------------|-------------------|
| ai-chat | auth-check |
| onboarding-agent | health |
| lean-canvas-agent | stripe-webhook |
| validation-agent | whatsapp-agent |
| pitch-deck-agent | generate-image |
| crm-agent | chatbot-agent |
| investor-agent | |
| documents-agent | |
| industry-expert-agent | |
| task-agent | |
| health-scorer | |
| stage-analyzer | |
| insights-generator | |
| action-recommender | |
| dashboard-metrics | |
| workflow-trigger | |
| compute-daily-focus | |
| prompt-pack | |
| event-agent | |
| _shared (utilities) | |

---

## Do We Need More Agents?

| Proposed (in docs) | Reality | Action |
|--------------------|---------|--------|
| Vector/RAG Agent | `ai-chat` can do this | Add retrieval to `ai-chat` |
| Industry Expert Agent | Already exists! | Use `industry-expert-agent` |
| Pitch Reviewer Agent | Already exists! | Use `pitch-deck-agent` |
| Validation Expert Agent | Already exists! | Use `validation-agent` |
| Fundraising Advisor Agent | Already exists! | Use `crm-agent` + `investor-agent` |

**Answer: NO new agents needed.** Enhance existing ones.

---

## Simplified vs Over-Engineered

| Over-Engineered (docs/) | Simplified (plan/) |
|-------------------------|-------------------|
| 79 tables | 58 existing + 6 new |
| 5 vector agent roles | 1 retrieval enhancement |
| 4 knowledge libraries | 1 knowledge_chunks table |
| 31 validator tables | Use existing + JSONB |
| 8 screens | 3-panel layout |

**Stick with the plan/ folder approach.**

---

## Keep It Simple

- **20 functions locally** - well-organized, active development
- **4 legacy deployed** - auth-check, health, stripe-webhook, whatsapp-agent
- **Most AI work already exists** - just needs Coach mode enhancement
- **Clear model assignments** - Flash for speed, Pro for depth, Claude for writing
- **NO new agents needed** - existing 18+ functions cover all use cases
