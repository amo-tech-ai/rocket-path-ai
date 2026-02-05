# AI Agent Expertise: Industry Playbook Enhancement

**Date:** 2026-01-29
**Status:** Approved
**Author:** Claude + User collaboration

---

## Summary

Enhance StartupAI's AI agents to be true startup experts per industry through **Static Knowledge Injection**. Each industry playbook is enriched with 10 knowledge categories that get injected into prompts at runtime based on `selected_industry` and feature context.

**Result:** Every AI interaction (onboarding, lean canvas, pitch deck, tasks, chatbot) delivers advice that sounds like a seasoned startup advisor with deep industry expertise.

---

## Goals

1. AI gives industry-specific advice, not generic startup templates
2. Founders get real-world guidance: specific numbers, timeframes, decision frameworks
3. AI proactively warns about failure patterns and red flags
4. AI knows what investors expect per stage and industry
5. One playbook source feeds all features with context-appropriate slices

---

## Architecture

### Knowledge Flow

```
┌─────────────────────────────────────────────────────────────┐
│              ENRICHED INDUSTRY PLAYBOOKS                     │
│         (13 industries × 10 knowledge categories)            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              getIndustryContext(industry, feature, stage)    │
│                    Context-Filtered Injection                │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Onboarding  │  │  Lean Canvas │  │  Pitch Deck  │
│              │  │              │  │              │
│ • Failure    │  │ • GTM        │  │ • Investor   │
│   patterns   │  │   patterns   │  │   expect.    │
│ • Terminology│  │ • Benchmarks │  │ • Success    │
│              │  │              │  │   stories    │
└──────────────┘  └──────────────┘  │ • Failure    │
                                    │   patterns   │
        ┌─────────────────┐         └──────────────┘
        ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Tasks/Plan   │  │   Chatbot    │
│              │  │              │
│ • GTM        │  │ • ALL 10     │
│   patterns   │  │   categories │
│ • Failure    │  │              │
│   patterns   │  │ Full expert  │
└──────────────┘  └──────────────┘
```

### Context-Filtered Injection Map

| Feature | Injected Categories | Rationale |
|---------|---------------------|-----------|
| **Onboarding** | failure_patterns, terminology | Guide early decisions, speak industry language |
| **Lean Canvas** | gtm_patterns, benchmarks | Validate business model with real data |
| **Pitch Deck** | investor_expectations, success_stories, failure_patterns | Investor-ready, avoid red flags |
| **Tasks/Planning** | gtm_patterns, failure_patterns | Actionable roadmap, avoid mistakes |
| **Chatbot** | All 10 categories | Full expert mode for any question |

---

## 10 Knowledge Categories

### 1. Investor Expectations by Stage
What pre-seed/seed/Series A investors look for in this industry. Specific metrics, milestones, deal-breakers.

### 2. Failure Patterns
Common mistakes founders make. Pattern, why it's fatal, early warning signs, how to avoid.

### 3. Success Stories
Anonymized archetypes of what worked. Pattern, key moves, outcome signal.

### 4. Benchmarks
Industry-specific KPIs with good/great thresholds and sources.

### 5. Terminology
Phrases to use, phrases to avoid, investor vocabulary.

### 6. GTM Patterns
Go-to-market strategies that work in this vertical with timelines and channels.

### 7. Decision Frameworks
Clear "if X, then Y" logic for common strategic decisions.

### 8. Investor Questions
Exact questions investors ask, with good/bad answer examples.

### 9. Warning Signs
Specific signals with triggers and actions. Severity levels.

### 10. Stage Checklists
Concrete tasks before each raise with time and cost estimates.

---

## Industries (13)

1. AI SaaS / B2B
2. FinTech
3. Healthcare
4. Retail & eCommerce
5. Cybersecurity
6. Logistics & Supply Chain
7. Education
8. Legal / Professional Services
9. Financial Services
10. Sales & Marketing AI
11. CRM & Social Media AI
12. Events Management
13. eCommerce (Pure-Play)

---

## Implementation

### Files Created

| File | Purpose |
|------|---------|
| `tasks/00-plan/prompts/10-enriched-playbooks-schema.md` | TypeScript schema definition |
| `tasks/00-plan/prompts/11-context-injection-map.md` | Feature → knowledge mapping |
| `tasks/00-plan/industry/playbooks/*.md` | 13 enriched playbook files |

### Edge Function Changes

| Function | Change |
|----------|--------|
| `onboarding-agent` | Add `getIndustryContext(industry, 'onboarding')` |
| `lean-canvas-agent` | Add `getIndustryContext(industry, 'lean_canvas')` |
| `pitch-deck-agent` | Add `getIndustryContext(industry, 'pitch_deck', stage)` |
| `ai-chat` | Add `getIndustryContext(industry, 'chatbot')` |
| `prompt-pack` | Inject context based on pack category |

### New Helper Function

```typescript
function getIndustryContext(
  industry_id: string,
  feature: 'onboarding' | 'lean_canvas' | 'pitch_deck' | 'tasks' | 'chatbot',
  stage?: 'pre_seed' | 'seed' | 'series_a'
): string
```

---

## Success Criteria

- [ ] All 13 industry playbooks enriched with 10 knowledge categories
- [ ] `getIndustryContext()` helper implemented and tested
- [ ] All 5 edge functions updated to inject context
- [ ] AI outputs demonstrate industry-specific expertise (not generic)
- [ ] Founders report advice feels "like talking to an expert"

---

## References

- PRD: `tasks/00-plan/03-prd-industry-promptpacks.md`
- Industry Strategy: `tasks/00-plan/draft/industry/02-industry-strategy.md`
- Prompt Pack Strategy: `tasks/00-plan/prompt-library/100-prompt-pack-strategy.md`
