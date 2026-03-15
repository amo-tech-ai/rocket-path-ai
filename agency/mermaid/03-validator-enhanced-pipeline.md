---
id: AGN-03
phase: CORE
type: sequence
title: Validator Enhanced Pipeline
prd_section: Enhanced Screens > Validator Report
roadmap_task: C-02, C-03, C-04
---

# AGN-03: Validator Enhanced Pipeline

How the scoring and composer agents are enriched with agency fragments during a validation run.

```mermaid
sequenceDiagram
    participant U as Founder
    participant FE as Frontend
    participant VS as validator-start
    participant AL as Agent Loader
    participant SC as Scoring Agent
    participant CO as Composer Agent
    participant GM as Gemini API
    participant DB as Database

    U->>FE: Click "Validate"
    FE->>VS: POST /validator-start

    Note over VS: Pipeline starts (7 agents)
    Note over VS: Extractor + Research + Competitors run first

    VS->>AL: loadFragment("validator-scoring-fragment")
    AL-->>VS: Fragment text (evidence tiers, bias rules, RICE)

    VS->>SC: Run with enriched prompt
    Note over SC: Base prompt + scoring fragment appended
    SC->>GM: Gemini call (thinking: high)
    GM-->>SC: Scores + evidence_tier + bias_flags + signal_strength

    VS->>AL: loadFragment("validator-composer-fragment")
    AL-->>VS: Fragment text (three-act, win themes, ICE)

    VS->>CO: Run with enriched prompt
    Note over CO: Base prompt + composer fragment appended
    CO->>GM: Gemini call (8192 tokens)
    GM-->>CO: Report with narrative_arc + win_themes + ice_channels

    VS->>DB: INSERT report (all fields optional)

    VS-->>FE: Broadcast progress events
    FE-->>U: Show enriched report

    Note over FE: New UI elements
    Note over FE: Evidence tier badges
    Note over FE: Bias flag banner
    Note over FE: ICE channel chips
    Note over FE: Three-act summary
```

## New Output Fields (all optional)

### From Scoring Agent (via scoring fragment)

| Field | Type | Example |
|-------|------|---------|
| `evidence_tier` | string | `"cited"`, `"founder_claim"`, `"ai_inferred"` |
| `bias_flags` | string[] | `["anchoring", "survivorship"]` |
| `signal_strength` | string | `"Level 3 – multiple data points"` |

### From Composer Agent (via composer fragment)

| Field | Type | Example |
|-------|------|---------|
| `narrative_arc` | object | `{setup, tension, resolution}` |
| `win_themes` | string[] | `["Speed-to-market", "Unit economics"]` |
| `ice_channels` | object[] | `[{channel, impact, confidence, ease, score}]` |

## Backward Compatibility

- All new fields are optional in the report JSONB
- Frontend checks `field?.length > 0` before rendering badges/banners
- Old reports render exactly as before
