---
name: prompt-packs
description: Use this skill when building or executing AI prompt packs - multi-step prompt workflows, templated prompts, and structured AI outputs. Triggers on "prompt pack", "prompt template", "AI workflow", "structured prompts", "prompt steps".
---

# Prompt Packs

## Overview

Build and execute multi-step AI prompt workflows. Prompt packs are collections of templated prompts that guide founders through structured analysis, generation, and validation tasks with consistent, reproducible outputs.

## When to Use

- Building multi-step AI workflows
- Creating templated prompt libraries
- Implementing structured AI outputs
- Designing reusable prompt sequences
- Connecting prompts to playbooks

## Prompt Pack Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    PROMPT PACK SYSTEM                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   CONTEXT   │───▶│   ROUTER    │───▶│  PACK       │        │
│  │  Industry   │    │  Selects    │    │  Selected   │        │
│  │  Stage      │    │  Pack       │    │             │        │
│  └─────────────┘    └─────────────┘    └──────┬──────┘        │
│                                                │                │
│                                         ┌──────▼──────┐        │
│                                         │   STEPS     │        │
│                                         │ 1 → 2 → 3   │        │
│                                         └──────┬──────┘        │
│                                                │                │
│         ┌──────────────────────────────────────┤                │
│         ▼                                      ▼                │
│  ┌─────────────┐                        ┌─────────────┐        │
│  │   OUTPUT    │                        │   APPLY     │        │
│  │  Structured │                        │  to Target  │        │
│  │  JSON/Text  │                        │  (DB/UI)    │        │
│  └─────────────┘                        └─────────────┘        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

## Current Prompt Packs

| Pack | Slug | Category | Steps | Use Case |
|------|------|----------|-------|----------|
| Problem Validation Framework | `problem-validation` | validation | 3 | Onboarding, Validation |
| Idea Validation Sprint | `idea-validation` | validation | 2 | Validation |
| Perfect One-Liner Generator | `one-liner-generator` | pitch | 3 | Onboarding Step 4 |
| Investor Pitch Builder | `investor-pitch-builder` | pitch | 3 | Pitch Deck |
| AI Lean Canvas Generator | `lean-canvas-generator` | canvas | 3 | Lean Canvas |
| Customer Archetype Builder | `customer-archetype` | canvas | 3 | GTM, Canvas |
| Go-to-Market Strategy Builder | `gtm-strategy` | gtm | 3 | GTM |
| SaaS Pricing Strategy | `pricing-strategy` | pricing | 3 | Revenue Model |
| Competitor Deep Dive | `competitor-analysis` | market | 3 | Validation, GTM |
| Startup Idea Generator | `idea-generator` | ideation | 2 | Ideation |

**Total: 10 packs, 28 steps**

## Pack Structure

```typescript
interface PromptPack {
  id: string;
  title: string;
  slug: string;
  category: 'validation' | 'pitch' | 'canvas' | 'gtm' | 'pricing' | 'ideation' | 'market';
  industry_tags: string[];
  stage_tags: string[];
  version: number;
  is_active: boolean;
}

interface PromptPackStep {
  id: string;
  pack_id: string;
  step_order: number;
  purpose: string;
  prompt_template: string;
  input_schema: JSONSchema;
  output_schema: JSONSchema;
  model_preference: 'gemini-3-flash' | 'gemini-3-pro' | 'claude-sonnet';
  max_tokens: number;
  temperature: number;
}
```

## Prompts by Category

| Category | Prompts | Description |
|----------|---------|-------------|
| **Ideation** | Problem Snapshot, First Principles, Bad Ideas Blitz, Why Now | Idea generation and refinement |
| **Market** | Competitor List, Market Definition, Who Buys First | Market analysis |
| **Marketing** | Channel Focused, Launch Week Plan, One Channel | GTM planning |
| **Product** | Product Spec, Roadmap, Feature Scorecard | Product development |
| **Funding** | Capital Requirements, Investor Matrix, Milestones | Fundraising prep |
| **Revenue** | Pricing Design, Free vs Trial, One Number | Monetization |
| **Founder** | Founder-Market Fit, Skill Stack, Risk Appetite | Team assessment |
| **Pitch** | One Sentence Pitch, Elevator Pitch, Elephant Identifier | Pitch crafting |

## Pack-to-Playbook Routing

| Context | Module | Prompt Pack(s) |
|---------|--------|----------------|
| Onboarding Step 1 | ideation | `problem-validation` |
| Onboarding Step 2 | market | `problem-validation`, `competitor-analysis` |
| Onboarding Step 3 | founder-fit | `founder-fit` |
| Onboarding Step 4 | pitch | `one-liner-generator` |
| Validator Quick | validation | `idea-validation` |
| Validator Deep | validation | `idea-validation`, `competitor-analysis` |
| Lean Canvas | canvas | `lean-canvas-generator`, `customer-archetype` |
| Pitch Deck | pitch | `investor-pitch-builder`, industry-specific |
| GTM Planning | gtm | `gtm-strategy`, `customer-archetype` |
| Fundraising | funding | Funding prompts, `investor-pitch-builder` |

## Prompt Templates

### Problem Snapshot Template

```text
You are an expert startup advisor helping a founder clarify their problem statement.

INDUSTRY: {{industry}}
COMPANY DESCRIPTION: {{company_description}}

Transform this into a structured problem statement:

1. WHO: [Specific persona with job title, company size, or demographic]
2. STRUGGLE: [The specific pain they experience today]
3. WHY NOW: [Why this problem is urgent today, not 5 years ago]

Output as JSON:
{
  "who": "...",
  "struggle": "...",
  "why_now": "...",
  "confidence": 0-100
}
```

### Validation Scorecard Template

```text
You are an investor evaluating a startup idea.

INDUSTRY: {{industry}}
STAGE: {{stage}}
IDEA: {{idea_text}}
PROBLEM: {{problem_statement}}

Score this idea on:
1. Problem Clarity (0-20): Is the who/struggle/why-now clear?
2. Market Size (0-15): Is this a large, growing market?
3. Solution Fit (0-15): Does the solution match the problem?
4. Competition (0-15): Is there clear differentiation?
5. Team Fit (0-10): Does this team have an edge?
6. Traction (0-15): Is there evidence of demand?
7. Business Model (0-10): Is the revenue path clear?

Output as JSON with scores, total, and top 3 risks.
```

## Edge Function: `prompt-pack`

```typescript
// Actions
- 'search': Find packs by category, industry, stage
- 'get': Retrieve pack with all steps
- 'list': List all active packs
- 'run_step': Execute single step with inputs
- 'run_pack': Execute all steps sequentially
- 'apply': Save outputs to target (profile, canvas, etc.)
```

## Database Schema

```sql
CREATE TABLE prompt_packs (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  industry_tags TEXT[],
  stage_tags TEXT[],
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prompt_pack_steps (
  id UUID PRIMARY KEY,
  pack_id UUID REFERENCES prompt_packs(id),
  step_order INTEGER NOT NULL,
  purpose TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  input_schema JSONB,
  output_schema JSONB,
  model_preference TEXT DEFAULT 'gemini-3-flash',
  max_tokens INTEGER DEFAULT 2048,
  temperature NUMERIC DEFAULT 1.0
);

CREATE TABLE prompt_runs (
  id UUID PRIMARY KEY,
  startup_id UUID REFERENCES startups(id),
  user_id UUID REFERENCES auth.users(id),
  pack_id UUID REFERENCES prompt_packs(id),
  step_id UUID REFERENCES prompt_pack_steps(id),
  inputs_json JSONB,
  outputs_json JSONB,
  model_used TEXT,
  tokens INTEGER,
  cost_usd NUMERIC,
  latency_ms INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## AI Model Selection

| Task | Model |
|------|-------|
| Fast generation | `gemini-3-flash-preview` |
| Deep analysis | `gemini-3-pro-preview` |
| Nuanced writing | `claude-sonnet-4-5-20250929` |
| Critic/Review | `claude-sonnet-4-5-20250929` |

## References

- PRD Section 9: Prompt Pack System
- Strategy Section 8.2: Prompt Library
- `/startup-system/guides/50-mvp-prompts.md`
- `/startup-system/guides/53-validate-prompts.md`
