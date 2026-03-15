---
task_id: 105-INF
title: Agency Gemini 3 Integration
phase: INFRASTRUCTURE
priority: P0
status: Not Started
estimated_effort: 1 day
skill: [ai/gemini, evidence-weighting, challenger-narrative]
subagents: [ai-agent-dev]
edge_function: validator-start, sprint-agent, pitch-deck-agent, lean-canvas-agent, ai-chat
depends_on: [104-INF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | Validator Report, Sprint Board, Pitch Deck Editor, Lean Canvas, AI Chat |
| **Features** | Structured JSON schemas for 6 agency-enhanced agents, search grounding, thinking mode, mode-specific response schemas |
| **Edge Functions** | `validator-start` (scoring + composer), `sprint-agent`, `pitch-deck-agent`, `lean-canvas-agent`, `ai-chat` |
| **Real-World** | "Every agency-enhanced agent now uses a precise responseJsonSchema so Gemini returns structured, typed output that the frontend can render without parsing guesswork" |

## Description

**The situation:** The agency enhancement layer (tasks 001-024) adds evidence-weighted scoring, three-act narratives, RICE/Kano prioritization, Challenger narratives, specificity coaching, and 4 specialized chat modes to existing edge functions. Each enhancement changes what the Gemini API needs to return -- new fields, nested objects, enum constraints, scoring rubrics. Today, the prompt fragments (`agency/prompts/*.md`) describe these requirements in natural language, but the actual `responseJsonSchema` definitions that guarantee Gemini returns valid structured output have not been specified. Without precise schemas, Gemini may omit fields, return wrong types, or produce output that `extractJSON` cannot reliably parse into the expected TypeScript interfaces.

**Why it matters:** Gemini 3 with `responseJsonSchema` + `responseMimeType: "application/json"` guarantees the output matches the schema exactly -- no parsing ambiguity, no missing fields, no type mismatches. Without a schema, every new agency field (evidence_tier, bias_flags, rice_score, kano_class, narrative_arc, win_themes, specificity_scores, pitch_scoring) becomes a best-effort extraction that works 80% of the time. The remaining 20% produces silent data loss or frontend rendering errors. This task defines the exact JSON schema for every agency-enhanced Gemini call, the model selection rationale, token budget, thinking mode, search grounding, and error handling strategy per agent.

**What already exists:**
- `supabase/functions/_shared/gemini.ts` -- `callGemini()` with `responseJsonSchema`, `thinkingLevel`, `useSearch`, `useUrlContext`, `maxOutputTokens`, `keepSchemaWithThinking`, `Promise.race` timeout, and 5-step `extractJSON` fallback
- `supabase/functions/validator-start/schemas.ts` -- Existing JSON schemas for extractor, research, competitors, scoring, MVP, and composer groups A-E
- `supabase/functions/validator-start/config.ts` -- Agent model assignments (`gemini-3-flash-preview` for all), timeouts, and composer group budgets
- `supabase/functions/sprint-agent/index.ts` -- Sprint task generation with system prompt and `callGemini`
- `supabase/functions/pitch-deck-agent/actions/*.ts` -- Per-action handlers for deck generation
- `supabase/functions/lean-canvas-agent/actions/coach.ts` -- Canvas coaching with RAG search
- `supabase/functions/ai-chat/index.ts` -- Chat handler with `callGeminiChat` (text mode) and `callGemini` (JSON mode for structured actions)
- `agency/lib/agent-loader.ts` -- `loadFragment()` and `loadChatMode()` utilities
- `agency/prompts/*.md` -- 5 prompt fragments describing agency enhancements in natural language
- `agency/chat-modes/*.md` -- 4 chat mode system prompts

**The build:** Define the complete `responseJsonSchema` for each agency-enhanced Gemini call. For each integration point, specify: the model, the schema (full JSON Schema draft), `responseMimeType`, `maxOutputTokens`, `thinkingLevel`, `useSearch`/`useUrlContext` flags, system prompt additions from agency fragments, token budget estimation, and error handling. This document serves as the single source of truth for implementers wiring agency schemas into edge functions.

**Example:** The scoring agent currently returns `scores_matrix` with 7 dimension scores. With the agency enhancement, the same call now returns each dimension annotated with `evidence_tier` ("cited" | "founder_stated" | "ai_inferred"), `evidence_sources` (array of source descriptions), `confidence` (0-1 float), and optional `bias_flags`. The responseJsonSchema guarantees Gemini returns all these fields with correct types. When the implementer reads this document, they copy the exact schema into `schemas.ts`, update `types.ts` to match, and the frontend can safely render evidence badges without null checks.

## Rationale
**Problem:** Agency enhancements add 30+ new structured fields across 6 agents, but no Gemini JSON schemas exist for these fields. Without schemas, output is unreliable.
**Solution:** Define precise `responseJsonSchema` for every agency-enhanced Gemini call, with model selection, token budgets, and error handling per agent.
**Impact:** Gemini guarantees valid structured output for all agency fields. Frontend can render new data without defensive parsing.

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Developer | copy exact JSON schemas from a reference document | I don't have to reverse-engineer schema definitions from prose fragments |
| Developer | know which model, timeout, and token budget to use per agent | I don't over-provision or under-budget API calls |
| Developer | understand the error handling strategy per integration | I know what to expect when Gemini truncates or omits fields |
| Founder | see structured evidence tiers, RICE scores, and narrative arcs in reports | the data is consistent and never partially missing |

## Goals
1. **Primary:** Every agency-enhanced Gemini call has a documented `responseJsonSchema`
2. **Quality:** Schemas are valid JSON Schema (type, properties, required, enum, minimum/maximum where applicable)
3. **Completeness:** Each integration specifies model, timeout, tokens, thinking, search, error handling

## Acceptance Criteria
- [ ] Scoring agent schema includes evidence tiers, bias flags, confidence, and signal strength per dimension
- [ ] Composer Group D schema includes narrative_arc (setup/conflict/resolution) and win_themes
- [ ] Composer Group C schema includes ice_channels array with impact/confidence/ease/score
- [ ] Sprint agent schema includes rice_score, kano_class, momentum_order, and quadrant per task
- [ ] Pitch deck agent schema includes win_theme, narrative_step, and persuasion_technique per slide
- [ ] AI Chat mode schemas defined for practice-pitch, growth-strategy, deal-review, and canvas-coach
- [ ] Lean canvas agent schema includes specificity_scores and evidence_gaps per box
- [ ] Each schema section documents model, maxOutputTokens, thinkingLevel, useSearch, useUrlContext
- [ ] Token budget estimates provided per integration
- [ ] Error handling strategy documented (extractJSON fallback, truncation retry, field optionality)

---

## Integration 1: Scoring Agent -- Evidence Tiers Schema

### Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `gemini-3-flash-preview` | Matches current config. Scoring uses thinking mode for quality. |
| **thinkingLevel** | `high` | Matches current config. Evidence assessment requires deep reasoning. |
| **keepSchemaWithThinking** | `true` | Scoring output structure is critical. Accept minor thinking/schema tension. |
| **maxOutputTokens** | `4096` | Scoring output is moderate size (~2K tokens typical). Leave headroom for 9 dimensions + bias flags. |
| **timeoutMs** | `30_000` | Matches current `AGENT_TIMEOUTS.scoring`. |
| **useSearch** | `false` | Scoring evaluates upstream data, does not search. |
| **useUrlContext** | `false` | No URLs to read. |
| **System prompt addition** | `loadFragment('validator-scoring-fragment')` appended to existing scoring prompt |
| **Token budget** | ~800 input (fragment) + ~2500 context (upstream agent data) + ~2000 output = ~5300 total |

### responseJsonSchema

```json
{
  "type": "object",
  "properties": {
    "scores_matrix": {
      "type": "object",
      "properties": {
        "overall_weighted": { "type": "integer", "minimum": 0, "maximum": 100 },
        "verdict": { "type": "string", "enum": ["go", "conditional_go", "no_go"] }
      },
      "required": ["overall_weighted", "verdict"]
    },
    "dimensions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "description": "Dimension name: problem, customer, market, competition, revenue, ai_strategy, execution, traction, risk" },
          "score": { "type": "integer", "minimum": 0, "maximum": 100 },
          "weight": { "type": "number", "description": "Dimension weight (sums to 1.0 across all dimensions)" },
          "evidence_tier": {
            "type": "string",
            "enum": ["cited", "founder_stated", "ai_inferred"],
            "description": "Primary evidence source for this dimension's score"
          },
          "evidence_sources": {
            "type": "array",
            "items": { "type": "string" },
            "description": "List of evidence sources (report names, URLs, founder statements)"
          },
          "confidence": {
            "type": "number",
            "minimum": 0,
            "maximum": 1,
            "description": "Confidence in this score (1.0 = cited sources, 0.8 = founder stated, 0.6 = AI inferred)"
          },
          "highlights": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Key positive findings for this dimension"
          },
          "concerns": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Key risk factors for this dimension"
          },
          "priority_actions": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "action": { "type": "string", "description": "Imperative, specific, under 15 words" },
                "rice_score": { "type": "number", "description": "RICE = (Reach x Impact x Confidence) / Effort" },
                "timeframe": { "type": "string", "enum": ["1 week", "2 weeks", "1 month", "3 months"] },
                "effort": { "type": "string", "enum": ["Low", "Medium", "High"] },
                "dimension": { "type": "string" }
              },
              "required": ["action", "timeframe", "effort", "dimension"]
            }
          }
        },
        "required": ["name", "score", "weight", "evidence_tier", "confidence"]
      }
    },
    "bias_flags": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["survivor_bias", "confirmation_bias", "anchoring", "recency", "availability", "optimism"]
          },
          "description": { "type": "string" },
          "affected_dimensions": {
            "type": "array",
            "items": { "type": "string" }
          }
        },
        "required": ["type", "description", "affected_dimensions"]
      }
    },
    "signal_strength": {
      "type": "string",
      "enum": ["level_1", "level_2", "level_3", "level_4", "level_5"],
      "description": "Overall evidence strength: level_1 (AI only) to level_5 (multiple cited sources)"
    }
  },
  "required": ["scores_matrix", "dimensions", "signal_strength"]
}
```

### Error Handling
- `bias_flags` is optional -- if Gemini omits it, treat as no biases detected (empty array in TypeScript)
- `evidence_sources` and `priority_actions` are optional per dimension -- render without them if absent
- If thinking mode causes schema non-adherence, `extractJSON` handles it via the 5-step fallback chain
- Truncation (MAX_TOKENS): `callGemini` auto-retries with 1.5x tokens (up to 16384 ceiling)

---

## Integration 2: Composer Agent -- Three-Act Narrative Schema

### Configuration — Group D (Executive Summary)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `gemini-3-flash-preview` | Matches current config. Narrative quality comes from prompt, not model size. |
| **thinkingLevel** | `none` | Group D is synthesis, not analysis. Thinking adds latency without quality gain. |
| **maxOutputTokens** | `2048` | Matches current Group D config. Narrative is ~180-220 words. |
| **timeoutMs** | `20_000` | Matches `COMPOSER_GROUP_TIMEOUTS.synthesis`. |
| **System prompt addition** | Three-Act Narrative section + Win Theme Integration section from `loadFragment('validator-composer-fragment')` |
| **Token budget** | ~600 input (fragment) + ~3000 context (Group A+B+C outputs) + ~1500 output = ~5100 total |

### responseJsonSchema — Group D

```json
{
  "type": "object",
  "properties": {
    "summary_verdict": { "type": "string", "description": "Full executive summary (180-220 words)" },
    "signal": { "type": "string", "enum": ["strong_go", "go", "conditional_go", "no_go", "strong_no_go"] },
    "next_steps": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "action": { "type": "string" },
          "timeframe": { "type": "string" },
          "effort": { "type": "string", "enum": ["Low", "Medium", "High"] }
        },
        "required": ["action", "timeframe"]
      }
    },
    "narrative_arc": {
      "type": "object",
      "properties": {
        "setup": { "type": "string", "description": "Act 1: Market context, structural opportunity, tension" },
        "conflict": { "type": "string", "description": "Act 2: What could go wrong, competitive threats, risks" },
        "resolution": { "type": "string", "description": "Act 3: Why this team wins anyway, quantified future" }
      },
      "required": ["setup", "conflict", "resolution"]
    },
    "win_themes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "2-3 recurring competitive advantages (buyer-specific, provable, differentiating)"
    }
  },
  "required": ["summary_verdict", "signal", "next_steps"]
}
```

### Configuration — Group C (Revenue, Channels, Technology)

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `gemini-3-flash-preview` | Fast extraction from upstream data. |
| **thinkingLevel** | `none` | Structured synthesis, not deep reasoning. |
| **maxOutputTokens** | `4096` | Group C covers 3 report sections. |
| **timeoutMs** | `35_000` | Matches `COMPOSER_GROUP_TIMEOUTS.parallel`. |
| **System prompt addition** | Growth Channel Recommendations section from `loadFragment('validator-composer-fragment')` |

### responseJsonSchema additions — Group C

Add to existing Group C schema:

```json
{
  "ice_channels": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "channel": { "type": "string", "description": "Specific channel name (e.g., 'LinkedIn thought leadership targeting Series B CTOs')" },
        "impact": { "type": "integer", "minimum": 1, "maximum": 10 },
        "confidence": { "type": "integer", "minimum": 1, "maximum": 10 },
        "ease": { "type": "integer", "minimum": 1, "maximum": 10 },
        "ice_score": { "type": "number", "description": "Impact x Confidence x Ease" },
        "time_to_first_result": { "type": "string", "description": "Estimated weeks to first measurable result" },
        "prerequisites": { "type": "string", "description": "What must exist before this channel works" }
      },
      "required": ["channel", "impact", "confidence", "ease", "ice_score"]
    },
    "description": "Top 3 growth channels ranked by ICE score"
  }
}
```

### Error Handling
- `narrative_arc` and `win_themes` are optional in the schema -- old reports without them render using the flat `summary_verdict` text
- `ice_channels` is optional -- if absent, the channels section renders as prose (current behavior)
- Group D compact context builder (already exists) prevents timeout from large Group A+B+C outputs

---

## Integration 3: Sprint Agent -- RICE + Kano Schema

### Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `gemini-3-flash-preview` | Task generation is a fast operation. Flash is sufficient. |
| **thinkingLevel** | `none` | RICE scoring is arithmetic, not deep reasoning. |
| **maxOutputTokens** | `8192` | 24 tasks with RICE/Kano metadata. Each task ~200 tokens. |
| **timeoutMs** | `30_000` | Current sprint-agent timeout. |
| **useSearch** | `false` | Tasks are generated from startup profile data, not web search. |
| **System prompt addition** | `loadFragment('sprint-agent-fragment')` appended to existing sprint system prompt |
| **Token budget** | ~900 input (fragment) + ~1500 context (startup profile) + ~5000 output (24 tasks) = ~7400 total |

### responseJsonSchema

```json
{
  "type": "object",
  "properties": {
    "sprint_name": { "type": "string" },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "description": { "type": "string" },
          "sprint": { "type": "string", "description": "Sprint name (Sprint 1-6)" },
          "priority": { "type": "string", "enum": ["critical", "high", "medium", "low"] },
          "success_criteria": { "type": "string" },
          "ai_tips": { "type": "string" },
          "rice_score": {
            "type": "number",
            "description": "RICE = (Reach x Impact x Confidence) / Effort"
          },
          "rice_breakdown": {
            "type": "object",
            "properties": {
              "reach": { "type": "integer", "minimum": 1, "maximum": 10 },
              "impact": { "type": "number", "enum": [0.25, 0.5, 1, 2, 3] },
              "confidence": { "type": "number", "enum": [0.5, 0.8, 1.0] },
              "effort": { "type": "integer", "minimum": 1, "maximum": 10 }
            },
            "required": ["reach", "impact", "confidence", "effort"]
          },
          "kano_class": {
            "type": "string",
            "enum": ["must_have", "performance", "delight"],
            "description": "Kano category: must_have (hygiene), performance (linear value), delight (wow factor)"
          },
          "quadrant": {
            "type": "string",
            "enum": ["quick_win", "big_bet", "fill_in", "time_sink"],
            "description": "RICE quadrant classification"
          },
          "momentum_order": {
            "type": "integer",
            "minimum": 1,
            "description": "Execution order within sprint (1 = first, quick wins lead)"
          },
          "story_points": {
            "type": "integer",
            "enum": [1, 2, 3, 5, 8, 13],
            "description": "Fibonacci story points (1=trivial, 13=epic)"
          }
        },
        "required": ["title", "description", "sprint", "priority"]
      }
    },
    "capacity_summary": {
      "type": "object",
      "properties": {
        "total_story_points": { "type": "integer" },
        "sprint_capacity": { "type": "integer", "description": "Max points per sprint (40 for solo founder)" },
        "buffer_percentage": { "type": "integer", "description": "Reserved capacity (20% default)" }
      }
    }
  },
  "required": ["tasks"]
}
```

### Error Handling
- RICE/Kano fields are optional in TypeScript types -- tasks without them render as before
- If `rice_score` is present but `rice_breakdown` is missing, display the score without the breakdown tooltip
- `momentum_order` defaults to array index if absent
- `capacity_summary` is informational -- no frontend dependency

---

## Integration 4: Pitch Deck Agent -- Challenger Narrative Schema

### Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `gemini-3.1-pro-preview` | Deck generation requires high-quality narrative output. Pro model for language quality. |
| **thinkingLevel** | `none` | Narrative composition, not analytical reasoning. |
| **maxOutputTokens** | `8192` | 10-12 slides with speaker notes, win themes, and persuasion metadata. |
| **timeoutMs** | `45_000` | Deck generation is a longer operation. Allow headroom for Pro model latency. |
| **useSearch** | `false` | Deck content comes from startup profile and validator data. |
| **System prompt addition** | `loadFragment('pitch-deck-fragment')` appended to deck generation action prompt |
| **Token budget** | ~800 input (fragment) + ~3000 context (profile + validator data) + ~6000 output (12 slides) = ~9800 total |

### responseJsonSchema (per slide, within slides array)

```json
{
  "type": "object",
  "properties": {
    "slides": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string", "description": "Claim-based title, not a label" },
          "content": { "type": "string", "description": "Slide body text (2-4 bullet points or paragraph)" },
          "speaker_notes": { "type": "string", "description": "What to say while presenting this slide" },
          "image_prompt": { "type": "string", "description": "Image generation prompt for slide visual" },
          "slide_type": {
            "type": "string",
            "enum": ["cover", "problem", "solution", "market", "traction", "business_model", "competition", "team", "financials", "ask", "appendix"]
          },
          "win_theme": {
            "type": "string",
            "description": "Which win theme this slide reinforces (empty string if none)"
          },
          "narrative_step": {
            "type": "string",
            "enum": ["warm_up", "reframe", "rational_drowning", "emotional_impact", "new_way"],
            "description": "Challenger Sale methodology step this slide serves"
          },
          "persuasion_technique": {
            "type": "string",
            "description": "Cognitive principle applied: loss_aversion, social_proof, authority, scarcity, progressive_disclosure, primacy, recency"
          }
        },
        "required": ["title", "content", "slide_type"]
      }
    },
    "win_themes": {
      "type": "array",
      "items": { "type": "string" },
      "description": "2-3 win themes for the entire deck (investor-thesis-specific, provable, differentiating)"
    },
    "narrative_structure": {
      "type": "object",
      "properties": {
        "opening_hook": { "type": "string", "description": "Non-obvious industry insight for slide 1-2" },
        "cost_of_status_quo": { "type": "string", "description": "Quantified annual cost of current approach" },
        "paradigm_shift": { "type": "string", "description": "The new way, presented before the product" },
        "closing_number": { "type": "string", "description": "Single biggest number in the deck (ARR, market, growth)" }
      }
    }
  },
  "required": ["slides"]
}
```

### Error Handling
- `win_theme`, `narrative_step`, and `persuasion_technique` are optional per slide -- old decks render unchanged
- `narrative_structure` is optional -- informational metadata for the editor sidebar
- Pro model has higher latency (~3-8s vs ~1-3s for Flash) -- timeout set at 45s with 2 retries

---

## Integration 5: AI Chat -- Mode-Specific Response Schemas

AI Chat uses `callGeminiChat` for conversational responses (text mode, no JSON schema) and `callGemini` for structured actions. The mode-specific schemas apply to structured evaluation actions within each mode, not to every chat message.

### 5a. Practice Pitch Mode -- Scoring Rubric

| Parameter | Value |
|-----------|-------|
| **Model** | `gemini-3-flash-preview` |
| **thinkingLevel** | `none` |
| **maxOutputTokens** | `2048` |
| **timeoutMs** | `30_000` |
| **System prompt** | `loadChatMode('practice-pitch')` replaces default system prompt |

**When to use JSON schema:** After the founder delivers a pitch and the AI needs to return a structured score. Triggered by the `score_pitch` action (not every message).

```json
{
  "type": "object",
  "properties": {
    "total_score": { "type": "integer", "minimum": 0, "maximum": 50 },
    "dimensions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "enum": ["clarity", "urgency", "differentiation", "the_ask", "confidence"] },
          "score": { "type": "integer", "minimum": 1, "maximum": 10 },
          "feedback": { "type": "string", "description": "Specific behavioral feedback referencing actual pitch language" }
        },
        "required": ["name", "score", "feedback"]
      }
    },
    "what_worked": { "type": "string", "description": "Specific phrase or moment that landed well" },
    "improvement": { "type": "string", "description": "One behavioral change with replacement language" },
    "hardest_questions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "3 hardest investor questions based on the pitch's weak spots"
    },
    "next_focus": { "type": "string", "description": "Single thing to practice before next round" }
  },
  "required": ["total_score", "dimensions", "what_worked", "improvement", "next_focus"]
}
```

### 5b. Growth Strategy Mode -- AARRR + ICE Channels

| Parameter | Value |
|-----------|-------|
| **Model** | `gemini-3-flash-preview` |
| **thinkingLevel** | `none` |
| **maxOutputTokens** | `4096` |
| **timeoutMs** | `30_000` |
| **System prompt** | `loadChatMode('growth-strategy')` replaces default system prompt |

**When to use JSON schema:** When the AI returns a structured growth plan. Triggered by the `analyze_growth` action.

```json
{
  "type": "object",
  "properties": {
    "current_stage": {
      "type": "string",
      "enum": ["pre_pmf", "pmf", "growth", "scale"],
      "description": "Startup's current growth stage"
    },
    "funnel_diagnosis": {
      "type": "object",
      "properties": {
        "bottleneck_stage": {
          "type": "string",
          "enum": ["acquisition", "activation", "retention", "revenue", "referral"]
        },
        "bottleneck_evidence": { "type": "string" },
        "metrics": {
          "type": "object",
          "properties": {
            "acquisition_cac": { "type": "number" },
            "activation_rate": { "type": "number" },
            "retention_d7": { "type": "number" },
            "retention_d30": { "type": "number" },
            "revenue_arpu": { "type": "number" },
            "referral_k_factor": { "type": "number" }
          }
        }
      },
      "required": ["bottleneck_stage", "bottleneck_evidence"]
    },
    "north_star_metric": {
      "type": "object",
      "properties": {
        "metric": { "type": "string" },
        "current_value": { "type": "string" },
        "target_value": { "type": "string" },
        "timeframe": { "type": "string" }
      },
      "required": ["metric"]
    },
    "ice_channels": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "channel": { "type": "string" },
          "impact": { "type": "integer", "minimum": 1, "maximum": 10 },
          "confidence": { "type": "integer", "minimum": 1, "maximum": 10 },
          "ease": { "type": "integer", "minimum": 1, "maximum": 10 },
          "ice_score": { "type": "number" },
          "experiment": {
            "type": "object",
            "properties": {
              "hypothesis": { "type": "string" },
              "baseline": { "type": "string" },
              "target": { "type": "string" },
              "timeline_weeks": { "type": "integer" },
              "cost_estimate": { "type": "string" },
              "success_criteria": { "type": "string" }
            },
            "required": ["hypothesis", "timeline_weeks", "success_criteria"]
          }
        },
        "required": ["channel", "impact", "confidence", "ease", "ice_score"]
      },
      "description": "Top 3 ICE-scored growth channels with experiment designs"
    },
    "unit_economics_check": {
      "type": "object",
      "properties": {
        "ltv_cac_ratio": { "type": "number" },
        "cac_payback_months": { "type": "number" },
        "monthly_churn": { "type": "number" },
        "healthy": { "type": "boolean" },
        "red_flags": { "type": "array", "items": { "type": "string" } }
      }
    }
  },
  "required": ["current_stage", "funnel_diagnosis", "ice_channels"]
}
```

### 5c. Deal Review Mode -- MEDDPICC Dimension Scores

| Parameter | Value |
|-----------|-------|
| **Model** | `gemini-3-flash-preview` |
| **thinkingLevel** | `none` |
| **maxOutputTokens** | `2048` |
| **timeoutMs** | `30_000` |
| **System prompt** | `loadChatMode('deal-review')` replaces default system prompt |

**When to use JSON schema:** When the AI scores a deal. Triggered by the `score_deal` action.

```json
{
  "type": "object",
  "properties": {
    "total_score": { "type": "integer", "minimum": 0, "maximum": 40 },
    "verdict": {
      "type": "string",
      "enum": ["strong", "battling", "at_risk", "unqualified"]
    },
    "dimensions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "enum": ["metrics", "economic_buyer", "decision_criteria", "decision_process", "paper_process", "identify_pain", "champion", "competition"]
          },
          "score": { "type": "integer", "minimum": 1, "maximum": 5 },
          "evidence": { "type": "string", "description": "Specific evidence from the deal supporting this score" },
          "next_step": { "type": "string", "description": "Recommended action to improve this element" },
          "owner": { "type": "string", "description": "Who should own this next step" },
          "deadline": { "type": "string", "description": "When this must be done" }
        },
        "required": ["name", "score", "evidence", "next_step"]
      }
    },
    "red_flags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Deal-killing red flags detected"
    },
    "recommended_action": {
      "type": "string",
      "description": "Primary recommendation: push to close / close gaps / intervene / qualify out"
    }
  },
  "required": ["total_score", "verdict", "dimensions", "recommended_action"]
}
```

### 5d. Canvas Coach Mode -- Specificity Feedback

| Parameter | Value |
|-----------|-------|
| **Model** | `gemini-3-flash-preview` |
| **thinkingLevel** | `none` |
| **maxOutputTokens** | `2048` |
| **timeoutMs** | `20_000` |
| **System prompt** | `loadChatMode('canvas-coach')` replaces default system prompt |

**When to use JSON schema:** When the AI evaluates canvas quality. Triggered by the `evaluate_canvas` action.

```json
{
  "type": "object",
  "properties": {
    "overall_quality": {
      "type": "string",
      "enum": ["weak", "developing", "solid", "strong"],
      "description": "Overall canvas quality assessment"
    },
    "boxes_evaluated": { "type": "integer", "minimum": 0, "maximum": 9 },
    "specificity_scores": {
      "type": "object",
      "properties": {
        "problem": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "customer_segments": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "unique_value_proposition": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "solution": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "channels": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "revenue_streams": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "cost_structure": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "key_metrics": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "unfair_advantage": { "type": "string", "enum": ["vague", "specific", "quantified"] }
      }
    },
    "evidence_gaps": {
      "type": "object",
      "properties": {
        "problem": { "type": "array", "items": { "type": "string" } },
        "customer_segments": { "type": "array", "items": { "type": "string" } },
        "unique_value_proposition": { "type": "array", "items": { "type": "string" } },
        "solution": { "type": "array", "items": { "type": "string" } },
        "channels": { "type": "array", "items": { "type": "string" } },
        "revenue_streams": { "type": "array", "items": { "type": "string" } },
        "cost_structure": { "type": "array", "items": { "type": "string" } },
        "key_metrics": { "type": "array", "items": { "type": "string" } },
        "unfair_advantage": { "type": "array", "items": { "type": "string" } }
      },
      "description": "Per-box list of missing evidence or specificity gaps"
    },
    "weakest_box": {
      "type": "string",
      "description": "The box that needs the most improvement"
    },
    "coaching_suggestion": {
      "type": "string",
      "description": "Specific improvement suggestion with replacement language for the weakest box"
    },
    "probing_questions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "2-3 questions to help the founder deepen the weakest box"
    }
  },
  "required": ["overall_quality", "specificity_scores", "weakest_box", "coaching_suggestion"]
}
```

---

## Integration 6: Lean Canvas Agent -- Feedback Synthesis Schema

### Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Model** | `gemini-3-flash-preview` | Coach feedback is a fast operation. RAG search adds latency, so keep model fast. |
| **thinkingLevel** | `none` | Feedback synthesis, not deep analysis. |
| **maxOutputTokens** | `2048` | 9-box evaluation + suggestions + citations. |
| **timeoutMs** | `20_000` | Current coach timeout (was 15s, bumped to 20s for RAG embedding overhead). |
| **useSearch** | `false` | RAG search is handled separately via `search_knowledge` RPC. |
| **System prompt addition** | Specificity evaluation rules injected by the coach action when agency fragment is loaded |
| **Token budget** | ~500 input (fragment) + ~1500 context (canvas data + RAG chunks) + ~1200 output = ~3200 total |

### responseJsonSchema

This schema extends the existing coach response. The `coach.ts` action currently returns `{ advice, citations }`. With the agency enhancement, it also returns specificity scores and evidence gaps.

```json
{
  "type": "object",
  "properties": {
    "advice": { "type": "string", "description": "Coaching advice for the current canvas state" },
    "citations": {
      "type": "array",
      "items": { "type": "string" },
      "description": "RAG knowledge chunk citations used in advice"
    },
    "specificity_scores": {
      "type": "object",
      "properties": {
        "problem": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "customer_segments": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "unique_value_proposition": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "solution": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "channels": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "revenue_streams": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "cost_structure": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "key_metrics": { "type": "string", "enum": ["vague", "specific", "quantified"] },
        "unfair_advantage": { "type": "string", "enum": ["vague", "specific", "quantified"] }
      }
    },
    "evidence_gaps": {
      "type": "object",
      "properties": {
        "problem": { "type": "array", "items": { "type": "string" } },
        "customer_segments": { "type": "array", "items": { "type": "string" } },
        "unique_value_proposition": { "type": "array", "items": { "type": "string" } },
        "solution": { "type": "array", "items": { "type": "string" } },
        "channels": { "type": "array", "items": { "type": "string" } },
        "revenue_streams": { "type": "array", "items": { "type": "string" } },
        "cost_structure": { "type": "array", "items": { "type": "string" } },
        "key_metrics": { "type": "array", "items": { "type": "string" } },
        "unfair_advantage": { "type": "array", "items": { "type": "string" } }
      }
    },
    "improvement_suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "box": { "type": "string" },
          "current_text": { "type": "string", "description": "What the founder wrote (quote)" },
          "suggested_replacement": { "type": "string", "description": "Specific replacement language" },
          "why": { "type": "string", "description": "Why this is better (evidence, specificity, measurability)" }
        },
        "required": ["box", "suggested_replacement", "why"]
      },
      "description": "1-3 improvement suggestions with replacement language"
    }
  },
  "required": ["advice"]
}
```

### Error Handling
- `specificity_scores`, `evidence_gaps`, and `improvement_suggestions` are optional -- existing coach behavior preserved if absent
- RAG search failure is already handled gracefully (coach continues without citations)
- If canvas data is empty (all boxes blank), return `specificity_scores` with all "vague" and skip suggestions

---

## Gemini Integration Rules Reference

These rules apply to all 6 integrations above. They are already implemented in `_shared/gemini.ts` but documented here for implementer awareness.

### G1: Guaranteed JSON Output
Every `callGemini` call uses `responseMimeType: "application/json"` (set automatically in `callGemini`). When `responseJsonSchema` is provided, Gemini constrains output to match the schema exactly. This is the primary quality guarantee for agency fields.

### G2: Temperature 1.0
All calls use `temperature: 1.0` (hardcoded in `callGemini`). Lower values cause Gemini 3 to enter repetition loops. Do not override.

### G3: Schema + Thinking Interaction
When `thinkingLevel` is active (scoring agent), Gemini may reduce schema adherence. The scoring agent sets `keepSchemaWithThinking: true` to preserve the schema. For all other agents (no thinking mode), this is not a concern.

### G4: API Key Header
`x-goog-api-key` header is set in `callGemini`. Never passed as query parameter.

### G5: extractJSON Fallback Chain
If `JSON.parse` fails on Gemini output (rare with `responseJsonSchema`, possible with thinking mode or truncation):
1. Direct `JSON.parse`
2. Strip markdown code fences
3. Extract balanced JSON object
4. Repair truncated JSON (close open structures)
5. Extract first JSON array

### G6: Truncation Auto-Retry
When Gemini hits `maxOutputTokens` (finishReason = `MAX_TOKENS`), `callGemini` automatically retries with 1.5x tokens, up to 16384 ceiling. This handles cases where agency fields increase output size beyond the original budget.

### G7: Model Selection Guide

| Agent | Model | Rationale |
|-------|-------|-----------|
| Scoring | `gemini-3-flash-preview` | Thinking mode compensates. Evidence assessment needs speed within pipeline budget. |
| Composer Groups A-D | `gemini-3-flash-preview` | Narrative quality from prompt engineering, not model size. Pipeline deadline constraint. |
| Composer Group E | `gemini-3-flash-preview` | 9 parallel calls -- Flash keeps total cost low. |
| Sprint | `gemini-3-flash-preview` | Task generation is formulaic. RICE scoring is arithmetic. |
| Pitch Deck | `gemini-3.1-pro-preview` | Narrative quality matters for investor-facing output. Not pipeline-constrained. |
| Lean Canvas Coach | `gemini-3-flash-preview` | Coach feedback is conversational. RAG adds latency; keep model fast. |
| AI Chat (all modes) | `gemini-3-flash-preview` | Conversational responses need low latency. Structured actions use Flash JSON mode. |

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Schema | `supabase/functions/validator-start/schemas.ts` | Modify -- add evidence_tier, bias_flags, confidence to scoring schema; narrative_arc, win_themes to Group D; ice_channels to Group C |
| Types | `supabase/functions/validator-start/types.ts` | Modify -- add optional agency fields to ScoringResult, ComposerGroupDResult, ComposerGroupCResult |
| Agent | `supabase/functions/validator-start/agents/scoring.ts` | Modify -- import loadFragment, append to system prompt |
| Agent | `supabase/functions/validator-start/agents/composer.ts` | Modify -- import loadFragment, append to Group A/C/D prompts |
| Edge Function | `supabase/functions/sprint-agent/index.ts` | Modify -- import loadFragment, update schema with RICE/Kano fields |
| Edge Function | `supabase/functions/pitch-deck-agent/actions/generate.ts` | Modify -- import loadFragment, update schema with Challenger fields |
| Edge Function | `supabase/functions/lean-canvas-agent/actions/coach.ts` | Modify -- add specificity evaluation to schema and response |
| Edge Function | `supabase/functions/ai-chat/index.ts` | Modify -- import loadChatMode, add mode routing, define structured action schemas |
| Frontend Types | `src/types/validation-report.ts` | Modify -- add optional agency fields to report interfaces |
| Frontend Types | `src/types/sprint-task.ts` | Modify -- add optional RICE/Kano fields |
| Frontend Types | `src/types/pitch-deck.ts` | Modify -- add optional Challenger fields |
| Reference | This document (`agency/prompts/105-agency-gemini-integration.md`) | Source of truth for all schemas |

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Fragment file missing at runtime | `loadFragment` returns empty string. Agent runs with base prompt. No agency fields in output. |
| Gemini ignores optional schema fields | TypeScript types mark all agency fields as optional. Frontend renders without them. |
| Gemini truncates output (MAX_TOKENS) | `callGemini` auto-retries with 1.5x tokens. extractJSON repairs partial JSON. |
| Thinking mode reduces schema adherence | Scoring agent uses `keepSchemaWithThinking: true`. Other agents do not use thinking. |
| Schema too complex for Gemini | Gemini 3 handles nested schemas well. If a specific schema fails, simplify by removing description fields and reducing nesting depth. |
| Chat mode not found | `loadChatMode` returns empty string. Chat uses default generic system prompt. |
| Existing reports/decks/tasks without agency fields | All agency fields are optional in TypeScript. UI renders existing data unchanged. |
| Sprint with > 24 tasks exceeding maxOutputTokens | 8192 tokens supports ~40 tasks. If exceeded, truncation auto-retry increases to 12288. |
| Pitch deck with Pro model timeout | 45s timeout with 2 retries. Total worst case: 135s. Frontend shows progress indicator. |
| Multiple chat modes in rapid succession | Each message carries `mode` field. No server-side mode state. Stateless per-request. |

## Real-World Examples

**Scenario 1 -- Evidence-aware scoring:** Jake validates his fintech payments startup. The scoring agent processes upstream data from Research (which cited a McKinsey digital payments report) and Competitors (which found 3 well-funded rivals via Google Search). The scoring schema guarantees each dimension includes `evidence_tier`. Market scores 88 (cited -- McKinsey data), Problem scores 71 (founder_stated -- Jake described the pain but cited no customer interviews), Team scores 65 (ai_inferred -- no team data provided). The report renders green/amber/grey evidence badges. Jake sees exactly where his validation is strong and where he needs more evidence. **Without the schema,** these tiers would be best-effort text parsing from a prose response, working maybe 80% of the time.

**Scenario 2 -- Sprint RICE prioritization:** Aisha generates a sprint plan after validation. The sprint agent returns 24 tasks, each with `rice_score`, `kano_class`, and `momentum_order`. Task "Set up Stripe integration" gets RICE 92, kano: must_have, momentum_order: 3. Task "Add dark mode toggle" gets RICE 12, kano: delight, momentum_order: 22. The Kanban board sorts by RICE within each sprint, and the Kano filter tabs let Aisha focus on must-haves first. **Without the schema,** RICE scores might come back as strings, missing fields, or inconsistent formats that break the sorting logic.

**Scenario 3 -- Chat mode structured scoring:** Marcus opens Practice Pitch mode and delivers his 60-second elevator pitch. He clicks "Score my pitch." The chat sends `{ action: 'score_pitch', message: '...' }`. The edge function uses `callGemini` with the pitch scoring schema, returning structured scores for clarity (7/10), urgency (5/10), differentiation (8/10), the_ask (4/10), confidence (6/10). The UI renders a radar chart and highlights "the_ask" as the weakest dimension with specific improvement language. **Without the schema,** the scoring would be embedded in prose text that needs regex extraction, failing whenever Gemini varies its formatting.

## Outcomes

| Before | After |
|--------|-------|
| Agency fields described in prose fragments but no Gemini schema guarantees | Every agency field has a `responseJsonSchema` definition that guarantees valid output |
| Frontend must defensively parse optional fields from unpredictable AI output | Frontend can trust schema-enforced types -- render directly without null gymnastics |
| No guidance on model selection, timeout, or token budget per agent | Each integration specifies exact model, timeout, maxOutputTokens, and token budget |
| Thinking mode + schema interaction undocumented | Scoring agent uses `keepSchemaWithThinking: true`; all others avoid the conflict |
| No error handling strategy for agency-specific failures | Truncation auto-retry, extractJSON fallback, and field optionality documented per agent |
| Chat modes return unstructured text for structured actions | 4 mode-specific JSON schemas enable structured rendering (scoring rubrics, MEDDPICC grids, ICE channels) |

---

## Checklists

### Production Ready

- [ ] `npm run build` passes
- [ ] `npm run test` passes (no regressions)
- [ ] No `console.log` in production code
- [ ] Loading, error, empty states handled
- [ ] All agency fields optional in TypeScript types (backward compat)
- [ ] Edge functions verify JWT
- [ ] No secrets in client code

### Regression (manual spot-check)

- [ ] Validator: Chat -> Progress -> Report renders (with and without agency fields)
- [ ] Lean Canvas: Coach chat returns structured feedback when agency fragment loaded
- [ ] Sprint Board: Tasks render with RICE badges when present, without them when absent
- [ ] Pitch Deck: Slides render with Challenger metadata when present, without when absent
- [ ] AI Chat: All 4 modes produce structured responses for their respective actions
- [ ] Existing reports/decks/canvases/sprints created before this change render correctly
