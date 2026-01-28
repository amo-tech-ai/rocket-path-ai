# Edge Functions Reference

> **Last Updated:** 2026-01-28  
> **Status:** All functions deployed and operational

---

## Overview

All edge functions require JWT authentication via the `Authorization` header. Functions use Gemini 3 Flash/Pro for AI operations.

---

## Functions Table

| Function | Actions | Status | Model | Purpose |
|----------|---------|--------|-------|---------|
| `ai-chat` | chat, prioritize, guide | ✅ Live | Gemini 2.0 Flash | General AI chat and startup guidance |
| `onboarding-agent` | 11 actions | ✅ Live | Gemini 2.0 Flash | Founder wizard and profile setup |
| `task-agent` | generate_tasks, prioritize_tasks, suggest_next, breakdown_task, analyze_productivity, generate_daily_plan | ✅ Live | Gemini 2.0 Flash | Task management and productivity |
| `crm-agent` | enrich_contact, score_lead, score_deal, analyze_pipeline, generate_email, detect_duplicate, summarize_communication, suggest_follow_ups | ✅ Live | Gemini 2.0 Flash | CRM operations and lead scoring |
| `investor-agent` | discover_investors, analyze_fit, find_warm_paths, generate_outreach, track_engagement, analyze_pipeline, prepare_meeting, generate_report | ✅ Live | Gemini 2.0 Flash | Fundraising pipeline and investor relations |
| `documents-agent` | generate_document, analyze_document, improve_section, search_documents, summarize_document, compare_versions | ✅ Live | Gemini 2.0 Flash | Document generation and analysis |
| `insights-generator` | generate_daily_insights, generate_quick_insights, get_stage_recommendations, generate_weekly_summary | ✅ Live | Gemini 2.0 Flash | Dashboard AI insights |
| `lean-canvas-agent` | map_profile, prefill_canvas, suggest_box, validate_canvas, save_version, canvas_to_pitch, get_benchmarks, suggest_pivots | ✅ Live | Gemini 2.0 Flash | Lean Canvas AI operations |
| `pitch-deck-agent` | generate_deck, improve_slide, suggest_flow, analyze_deck | ✅ Live | Gemini 2.0 Flash | Pitch deck generation and optimization |
| `event-agent` | discover_events, analyze_event, research_speakers, generate_prep, track_attendance | ✅ Live | Gemini 2.0 Flash | Event discovery and preparation |

---

## Function Details

### 1. ai-chat

**Endpoint:** `POST /functions/v1/ai-chat`

**Actions:**
- `chat` - General startup Q&A
- `prioritize` - AI task prioritization
- `guide` - Stage-specific guidance

**Request:**
```json
{
  "action": "chat",
  "message": "How should I approach investor outreach?",
  "tab": "general",
  "session_id": "uuid"
}
```

---

### 2. onboarding-agent

**Endpoint:** `POST /functions/v1/onboarding-agent`

**Actions:**
| Action | Description |
|--------|-------------|
| `create_session` | Start new wizard session |
| `get_session` | Retrieve session state |
| `process_answer` | Process step responses |
| `generate_summary` | Create startup summary |
| `calculate_score` | Investor readiness score |
| `complete_wizard` | Finalize and create startup |
| `extract_linkedin` | Extract founder data |
| `suggest_completion` | Auto-complete suggestions |
| `validate_step` | Step validation |

---

### 3. task-agent

**Endpoint:** `POST /functions/v1/task-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `generate_tasks` | startup_id, project_id?, context?, count?, focus_area? | tasks[], reasoning |
| `prioritize_tasks` | startup_id, task_ids? | prioritized_tasks[], recommendations |
| `suggest_next` | startup_id, available_time?, energy_level?, focus_area? | suggestions[], batch_suggestion |
| `breakdown_task` | startup_id, task_id | subtasks[], complexity, approach |
| `analyze_productivity` | startup_id, days? | health_score, strengths[], recommendations[] |
| `generate_daily_plan` | startup_id | morning[], afternoon[], evening[] |

---

### 4. crm-agent

**Endpoint:** `POST /functions/v1/crm-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `enrich_contact` | startup_id, linkedin_url?, name?, company? | enriched contact data |
| `score_lead` | startup_id, contact_id | score (0-100), factors[] |
| `score_deal` | startup_id, deal_id | probability, insights[], risks[] |
| `analyze_pipeline` | startup_id | bottlenecks[], forecast, stalling[] |
| `generate_email` | startup_id, contact_id, purpose? | subject, body, tone |
| `detect_duplicate` | startup_id, name, email?, company? | duplicates[] with confidence |

---

### 5. investor-agent

**Endpoint:** `POST /functions/v1/investor-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `discover_investors` | startup_id, criteria? | investors[], search_strategy |
| `analyze_fit` | startup_id, investor_id | overall_score, breakdown, strengths[], concerns[] |
| `find_warm_paths` | startup_id, investor_id | warm_paths[], cold_approach_tips |
| `generate_outreach` | startup_id, investor_id, type | subject_lines[], email_body, tips[] |
| `track_engagement` | investor_id, engagement | status update, engagement logged |
| `analyze_pipeline` | startup_id | health_score, bottlenecks[], forecast |
| `prepare_meeting` | startup_id, investor_id | talking_points, questions[], prep_notes |
| `generate_report` | startup_id, period? | weekly summary, metrics |

---

### 6. documents-agent

**Endpoint:** `POST /functions/v1/documents-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `generate_document` | startup_id, template_type, instructions? | document_id, content, content_json |
| `analyze_document` | startup_id, document_id | score, completeness, suggestions[] |
| `improve_section` | startup_id, document_id, section, instructions | improved_text |
| `summarize_document` | startup_id, document_id | summary, key_points[] |
| `compare_versions` | document_id, version_a, version_b | diff, changes_summary |

**Template Types:** `executive_summary`, `business_plan`, `one_pager`, `investor_update`, `meeting_notes`

---

### 7. insights-generator

**Endpoint:** `POST /functions/v1/insights-generator`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `generate_daily_insights` | startup_id | insights[], summary, focus_area, quick_wins[] |
| `generate_quick_insights` | startup_id | insights[] (cached-friendly) |
| `get_stage_recommendations` | startup_id | milestones[], priorities[], fundraising_readiness |
| `generate_weekly_summary` | startup_id | week_score, highlights[], next_week_priorities[] |

---

### 8. lean-canvas-agent

**Endpoint:** `POST /functions/v1/lean-canvas-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `map_profile` | startup_id | coverage per box, suggestions |
| `prefill_canvas` | startup_id | prefilled canvas data |
| `suggest_box` | startup_id, box_name, current_items? | suggestions[] with reasoning |
| `validate_canvas` | startup_id, canvas_data | validation results, warnings |
| `save_version` | startup_id, version_name, canvas_data | version saved |
| `canvas_to_pitch` | startup_id, canvas_data | pitch narrative |
| `get_benchmarks` | startup_id, industry? | industry benchmarks |
| `suggest_pivots` | startup_id, canvas_data | pivot suggestions |

---

### 9. pitch-deck-agent

**Endpoint:** `POST /functions/v1/pitch-deck-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `generate_deck` | startup_id, template? | deck with slides |
| `improve_slide` | deck_id, slide_id, instructions | improved content |
| `suggest_flow` | deck_id | flow recommendations |
| `analyze_deck` | deck_id | score, feedback, suggestions |

---

### 10. event-agent

**Endpoint:** `POST /functions/v1/event-agent`

**Actions:**
| Action | Parameters | Returns |
|--------|------------|---------|
| `discover_events` | startup_id, criteria? | events[], recommendations |
| `analyze_event` | startup_id, event_id | fit_score, value_analysis, networking_tips |
| `research_speakers` | event_id | speakers[], connection_opportunities |
| `generate_prep` | startup_id, event_id | prep_checklist, talking_points, goals |
| `track_attendance` | startup_id, event_id, status | attendance logged |

---

## Authentication

All functions require a valid JWT in the Authorization header:

```typescript
const { data } = await supabase.functions.invoke('task-agent', {
  body: { action: 'generate_tasks', startup_id: 'uuid' }
});
```

The Supabase client automatically includes the auth token.

---

## Error Handling

All functions return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common errors:
- `401` - Missing or invalid authorization
- `400` - Invalid request body or missing parameters
- `500` - Internal error (check function logs)

---

## Frontend Hooks

| Hook | Function | Location |
|------|----------|----------|
| `useAIChat` | ai-chat | `src/hooks/useAIChat.ts` |
| `useOnboardingAgent` | onboarding-agent | `src/hooks/useOnboardingAgent.ts` |
| `useTaskAgent` | task-agent | `src/hooks/useTaskAgent.ts` |
| `useCRMAgent` | crm-agent | `src/hooks/useCRMAgent.ts` |
| `useInvestorAgent` | investor-agent | `src/hooks/useInvestorAgent.ts` |
| `useDocumentsAgent` | documents-agent | `src/hooks/useDocumentsAgent.ts` |
| `useInsights` | insights-generator | `src/hooks/useInsights.ts` |
| `useLeanCanvasAgent` | lean-canvas-agent | `src/hooks/useLeanCanvasAgent.ts` |
| `usePitchDeckAgent` | pitch-deck-agent | `src/hooks/usePitchDeckAgent.ts` |
| `useEventAgent` | event-agent | `src/hooks/useEventAgent.ts` |

---

## Configuration

All functions are configured in `supabase/config.toml`:

```toml
[functions.function-name]
verify_jwt = false  # JWT validated in code
```

Required secrets (set in Supabase dashboard):
- `GEMINI_API_KEY` - Google Gemini API key
- `ANTHROPIC_API_KEY` - Anthropic API key (optional)
