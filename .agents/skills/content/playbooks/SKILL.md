---
name: playbooks
description: Use this skill when building or executing startup playbooks - industry-specific workflows, stage-aware guidance, and automated founder journeys. Triggers on "playbook", "industry workflow", "stage-specific", "founder journey", "onboarding flow", "validation flow".
---

# Playbooks

## Overview

Build and execute industry-aware, stage-specific automated workflows that guide founders from idea to investor-ready. Playbooks combine prompt packs, AI agents, wizards, dashboards, and automations into structured founder journeys.

## When to Use

- Building onboarding workflows
- Creating industry-specific validation flows
- Implementing stage-aware guidance
- Designing automated task generation
- Building dashboard automation triggers

## Playbook Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                    STARTUPAI PLAYBOOK SYSTEM                        │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   FOUNDER   │───▶│  INDUSTRY   │───▶│   ROUTER    │            │
│  │   SELECTS   │    │  DETECTED   │    │  (Context)  │            │
│  │   INDUSTRY  │    │             │    │             │            │
│  └─────────────┘    └─────────────┘    └──────┬──────┘            │
│                                                │                    │
│         ┌──────────────────────────────────────┼───────────────┐   │
│         │                                      │               │   │
│         ▼                                      ▼               ▼   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   CORE      │    │  ADVANCED   │    │  INDUSTRY   │            │
│  │  PLAYBOOKS  │    │  PLAYBOOKS  │    │  PLAYBOOKS  │            │
│  │             │    │             │    │             │            │
│  │ • Onboarding│    │ • Fundraise │    │ • FinTech   │            │
│  │ • Validator │    │ • Scale     │    │ • Healthcare│            │
│  │ • Canvas    │    │ • Pivot     │    │ • SaaS      │            │
│  │ • Pitch     │    │ • Exit      │    │ • +10 more  │            │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘            │
│         │                  │                  │                    │
│         └──────────────────┼──────────────────┘                    │
│                            │                                       │
│                     ┌──────▼──────┐                                │
│                     │   PROMPT    │                                │
│                     │    PACKS    │                                │
│                     └──────┬──────┘                                │
│                            │                                       │
│         ┌──────────────────┼──────────────────┐                    │
│         ▼                  ▼                  ▼                    │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│  │   WIZARDS   │    │    AI       │    │ AUTOMATIONS │            │
│  │   (4-step)  │    │   AGENTS    │    │  (Triggers) │            │
│  └─────────────┘    └─────────────┘    └─────────────┘            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Playbook Categories

| Category | Description | Playbooks Included |
|----------|-------------|-------------------|
| **Core** | Essential startup fundamentals | Onboarding, Idea Validation, Lean Canvas, Pitch Deck |
| **Advanced** | Growth and scaling | GTM, Fundraising, Team Building, Operations |
| **Industry** | Vertical-specific guidance | 13 industries with tailored questions, metrics |
| **Stage** | Milestone-specific | Pre-Seed, Seed, Series A, Growth |

## Core Playbooks

### Onboarding Playbook

| Step | Screen | Agent | Outputs |
|------|--------|-------|---------|
| 1 | Industry Selection | Industry Expert | `industry`, `sub_category` |
| 2 | Problem Definition | Problem Sharpener | `who`, `struggle`, `why_now` |
| 3 | Team/Founder | Founder Analyst | `founder_market_fit`, `gaps` |
| 4 | One-Liner | Pitch Writer | `one_sentence_pitch` |

### Validation Playbook

| Validation Type | Duration | Agent | Outputs |
|-----------------|----------|-------|---------|
| **Quick Validate** | 2-3 min | Validator Agent | Score, top 3 risks, 3 tasks |
| **Deep Validate** | 10-15 min | Deep Analysis Agent | Full scorecard, market data |
| **Investor Lens** | 5-7 min | Investor Simulator | Red flags, elephant questions |

### Canvas Playbook

| Canvas Box | Source Data | Agent | Enhancement |
|------------|-------------|-------|-------------|
| **Problem** | Onboarding Step 2 | Problem Agent | Top 3 problems ranked |
| **Customer Segments** | Market research | ICP Builder | First buyer profile |
| **Unique Value Prop** | One-liner + problem | UVP Generator | A/B test variants |
| **Solution** | Product description | Solution Agent | Must-have features |
| **Channels** | Industry playbook | Channel Advisor | Top 3 channels ranked |

### Pitch Deck Playbook

| Step | Screen | Agent | Output |
|------|--------|-------|--------|
| 1 | Template Selection | Template Advisor | Template style + slide count |
| 2 | Smart Interview | Industry Expert | 8 industry questions answered |
| 3 | Content Generation | Deck Writer | All slides with bullets |
| 4 | Visual Enhancement | Visual Agent | Design suggestions |
| 5 | Review & Refine | Critic Agent | Elephant identifier, red flags |

## Industry-Specific Decks

| Industry | Slide Emphasis | Unique Slides |
|----------|---------------|---------------|
| **SaaS** | Traction, Retention | Net Revenue Retention |
| **FinTech** | Compliance, Trust | Regulatory Pathway |
| **Healthcare** | Clinical Evidence | FDA/CE Pathway |
| **Marketplace** | Liquidity, Take Rate | Supply/Demand Balance |

## Agent Routing

```typescript
const AGENT_ROUTING = {
  onboarding_step_1: {
    agent: 'industry_expert',
    pack: 'problem-validation',
    context: ['industry', 'company_description']
  },
  onboarding_step_2: {
    agent: 'problem_sharpener',
    pack: 'problem-validation',
    context: ['industry', 'step_1_data']
  },
  validator_quick: {
    agent: 'validator_agent',
    pack: 'idea-validation',
    context: ['idea_text', 'industry']
  },
  canvas_generate: {
    agent: 'canvas_builder',
    pack: 'lean-canvas-generator',
    context: ['profile', 'validation_data']
  },
  pitch_generate: {
    agent: 'deck_writer',
    pack: 'industry_pitch_pack',
    context: ['profile', 'canvas', 'interview_data']
  }
};
```

## Automation Triggers

| Trigger | Condition | Action | Playbook |
|---------|-----------|--------|----------|
| **Onboarding Complete** | Step 4 saved | Generate 5 validation tasks | Onboarding |
| **Validation Score < 60** | Quick validate done | Suggest pivot or refine | Validation |
| **Canvas Incomplete** | 3+ boxes empty after 7 days | Reminder + AI suggestions | Lean Canvas |
| **Pitch Deck Generated** | Deck created | Run critic agent | Pitch Deck |
| **Investor Added** | New investor in CRM | Research + personalize | Fundraising |

## Knowledge Injection

Each playbook injects industry-specific knowledge at runtime:

```typescript
interface IndustryKnowledge {
  industry_id: string;
  success_stories: { company: string; what_worked: string; metric_proof: string }[];
  failure_patterns: { pattern: string; why_it_fails: string; warning_signs: string[] }[];
  investor_expectations: { stage: string; must_have: string[]; deal_breakers: string[] }[];
  benchmarks: { metric: string; good_threshold: string; great_threshold: string }[];
  red_flags: { flag: string; why_it_kills: string }[];
  terminology: { term: string; definition: string }[];
}
```

## Context-Filtered Injection

| Feature | Knowledge Slice | Why This Slice |
|---------|-----------------|----------------|
| **Onboarding** | Failure patterns + Terminology | Guide early decisions |
| **Lean Canvas** | GTM patterns + Benchmark data | Validate business model |
| **Pitch Deck** | Investor expectations + Success stories + Red flags | Make deck investor-ready |
| **Validator** | Benchmark data + Red flags + Failure patterns | Score against standards |
| **Tasks/Planning** | GTM patterns + Failure patterns | Build actionable roadmap |

## Edge Function: `playbook-router`

```typescript
// Actions
- 'get_playbook': Retrieve playbook for context (industry, stage, feature)
- 'run_step': Execute single playbook step with agents
- 'inject_knowledge': Get filtered knowledge for context
- 'generate_tasks': Create tasks from playbook outputs
- 'track_progress': Update playbook completion status
```

## AI Model Selection

| Task | Model |
|------|-------|
| Industry questions | `gemini-3-flash-preview` |
| Problem sharpening | `claude-sonnet-4-5-20250929` |
| Validation scoring | `gemini-3-pro-preview` |
| Deck generation | `claude-sonnet-4-5-20250929` |
| Critic/Red flags | `claude-sonnet-4-5-20250929` |

## References

- PRD Section 3: Onboarding System
- PRD Section 4: Business Idea Validator
- Strategy Section 7: Industry Playbooks
- `/startup-system/guides/101-startup-playbooks.md`
