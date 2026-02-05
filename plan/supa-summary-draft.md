# Supabase Table Summary

> **Updated:** 2026-02-03 | **Tables:** 79 (58 existing + 21 proposed)
> **Strategy:** Hybrid tables + JSONB for startup flexibility

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Tables for entities** | Core objects that need relationships |
| **JSONB for analysis** | Nested results read with parent |
| **Tables for queries** | Data filtered/sorted independently |
| **JSONB for flexibility** | Schema may change during pivots |

## Overview

| Category | Existing | Proposed | Total |
|----------|----------|----------|-------|
| Core | 6 | 0 | 6 |
| CRM | 5 | 0 | 5 |
| AI/Agents | 6 | 0 | 6 |
| Wizard | 3 | 0 | 3 |
| Documents | 3 | 0 | 3 |
| Chat | 4 | 0 | 4 |
| Investors/Pitch | 4 | 0 | 4 |
| Events | 7 | 0 | 7 |
| Lean Canvas | 1 | 0 | 1 |
| Validation | 3 | 0 | 3 |
| Playbooks | 3 | 0 | 3 |
| System | 13 | 0 | 13 |
| Validator | 0 | 8 | 8 |
| Lean Validation | 0 | 5 | 5 |
| Vector/RAG | 0 | 4 | 4 |
| Resources | 0 | 4 | 4 |
| **TOTAL** | **58** | **21** | **79** |

## Consolidation Summary

| Original Tables | Consolidated Into | JSONB Fields |
|-----------------|-------------------|--------------|
| ideas, idea_summaries, idea_recommendations, key_questions | **ideas** | summary, recommendations, questions |
| validation_scores, validation_signals, score_factors | **validation_scores** | signals, factors |
| market_analysis, market_segments, market_trends, market_benchmarks, target_regions, opportunities | **market_analysis** | segments, trends, benchmarks, regions, opportunities |
| competitors, competitor_products, competitor_strengths_weaknesses | **competitors** | products, swot |
| revenue_models, unit_economics, revenue_projections, pricing_strategies | **financial_models** | unit_economics, projections, pricing |
| roadmap_phases, roadmap_activities, team_requirements, team_roles, budget_breakdown | **roadmap** | activities, team, budget |
| risk_assessments, technology_assessment, gtm_channels | **risk_analysis** | tech_assessment, gtm_channels |
| assumptions, experiments, experiment_results | **assumptions** + **experiments** | results (in experiments) |
| customer_segments, customer_forces, jobs_to_be_done | **customer_segments** | forces, jtbd |
| interviews, interview_insights | **interviews** | insights |

---

## EXISTING TABLES (58)

### 1. Core Tables (6)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **profiles** | id, user_id, full_name, avatar_url, email, created_at | User profiles linked to auth |
| **organizations** | id, name, owner_id, slug, settings, created_at | Multi-tenant organizations |
| **org_members** | id, org_id, user_id, role, invited_at, joined_at | Organization membership |
| **user_roles** | id, user_id, role, permissions, granted_at | User role assignments |
| **projects** | id, org_id, name, description, status, settings | Project containers |
| **startups** | id, project_id, name, industry, stage, founding_date, location | Startup entity data |

### 2. CRM Tables (5)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **contacts** | id, startup_id, name, email, phone, company, role, stage | Contact management |
| **contact_tags** | id, contact_id, tag, color, created_at | Contact categorization |
| **deals** | id, contact_id, startup_id, value, stage, probability, close_date | Sales pipeline |
| **communications** | id, contact_id, type, subject, content, sent_at | Communication history |
| **messages** | id, sender_id, recipient_id, content, read_at, created_at | Internal messaging |

### 3. AI/Agent Tables (6)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **agent_configs** | id, name, type, model, system_prompt, tools, settings | Agent configurations |
| **ai_runs** | id, agent_id, startup_id, input, output, tokens, duration, status | AI execution logs |
| **action_executions** | id, run_id, action_type, input, output, status, error | Granular action tracking |
| **proposed_actions** | id, run_id, action_type, params, approved, executed_at | Human-in-loop actions |
| **context_injection_configs** | id, agent_id, source_type, query_template, max_tokens | RAG context settings |
| **prompt_template_registry** | id, name, template, variables, version, active | Prompt versioning |

### 4. Wizard Tables (3)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **wizard_sessions** | id, user_id, startup_id, current_step, data, completed_at | Wizard progress |
| **wizard_extractions** | id, session_id, step, raw_input, extracted_data, confidence | AI extraction results |
| **onboarding_questions** | id, step, question, field_mapping, validation, order | Dynamic question config |

### 5. Document Tables (3)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **documents** | id, startup_id, title, type, content, metadata, created_by | Document storage |
| **document_versions** | id, document_id, version, content, diff, created_by | Version history |
| **file_uploads** | id, document_id, filename, path, size, mime_type, storage_key | File attachments |

### 6. Chat Tables (4)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **chat_sessions** | id, user_id, startup_id, agent_type, title, status, created_at | Chat session containers |
| **chat_messages** | id, session_id, role, content, tokens, tool_calls, created_at | Message history |
| **chat_pending** | id, session_id, user_input, status, processed_at | Async message queue |
| **chat_facts** | id, session_id, entity_type, entity_id, fact, confidence, source_msg_id | Extracted facts for RAG |

### 7. Investor/Pitch Tables (4)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **investors** | id, name, firm, type, check_size_min, check_size_max, stages, sectors | Investor database |
| **pitch_decks** | id, startup_id, title, version, status, template_id, created_at | Pitch deck metadata |
| **pitch_deck_slides** | id, deck_id, slide_number, type, content, notes, layout | Slide content |
| **deck_templates** | id, name, description, slides_config, industry, style | Deck templates |

### 8. Event Tables (7)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **events** | id, org_id, name, type, start_date, end_date, location, status | Event management |
| **event_venues** | id, event_id, name, address, capacity, amenities | Venue details |
| **event_speakers** | id, event_id, contact_id, topic, bio, slot | Speaker management |
| **event_attendees** | id, event_id, contact_id, status, ticket_type, checked_in | Attendance tracking |
| **event_assets** | id, event_id, type, url, description | Event media/files |
| **sponsors** | id, event_id, name, tier, logo_url, amount | Sponsorship tracking |
| **industry_events** | id, industry, event_name, date, location, relevance_score | Industry calendar |

### 9. Lean Canvas Table (1)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **lean_canvases** | id, startup_id, problem, solution, uvp, unfair_advantage, customer_segments, channels, revenue_streams, cost_structure, key_metrics, version | 9-block business model |

### 10. Validation Tables (3)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **validation_runs** | id, startup_id, agent_id, status, started_at, completed_at | Validation executions |
| **validation_reports** | id, run_id, report_type, content, score, recommendations | Generated reports |
| **validation_verdicts** | id, run_id, verdict, confidence, flags, reasoning | Final verdicts |

### 11. Playbook Tables (3)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **industry_playbooks** | id, industry, name, description, stages, tactics, metrics | Industry playbooks |
| **playbook_runs** | id, playbook_id, startup_id, current_stage, progress, started_at | Playbook execution |
| **startup_event_tasks** | id, playbook_run_id, task, status, due_date, assigned_to | Playbook task tracking |

### 12. System Tables (13)

| Table | Key Fields | Purpose |
|-------|------------|---------|
| **notifications** | id, user_id, type, title, content, read_at, action_url | User notifications |
| **activities** | id, user_id, startup_id, action, entity_type, entity_id, metadata | Activity feed |
| **audit_log** | id, user_id, action, table_name, record_id, old_data, new_data | Audit trail |
| **integrations** | id, org_id, provider, credentials, settings, status | External integrations |
| **tasks** | id, startup_id, title, description, status, priority, due_date, assigned_to | Task management |
| **user_event_tracking** | id, user_id, event_type, metadata, created_at | Analytics events |
| **workflow_activity_log** | id, workflow_id, step, status, input, output, error | Workflow debugging |
| **feature_pack_routing** | id, feature_key, agent_id, prompt_pack_id, enabled | Feature routing |
| **prompt_packs** | id, name, description, category, prompts, version | Prompt libraries |
| **prompt_pack_steps** | id, pack_id, step_number, prompt, expected_output | Multi-step prompts |
| **prompt_pack_runs** | id, pack_id, startup_id, current_step, results, status | Prompt execution |
| **daily_focus_recommendations** | id, user_id, date, recommendations, priority_score | Daily AI recommendations |
| **competitor_profiles** | id, startup_id, name, url, description, strengths, weaknesses | Competitor tracking |

---

## PROPOSED TABLES (43)

### 13. Validator - Ideas Tables (6)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **ideas** | id, startup_id, title, description, hypothesis, stage, source, created_at | Central idea repository | P0 |
| **idea_summaries** | id, idea_id, executive_summary, key_insights, generated_at | AI-generated summaries | P1 |
| **idea_recommendations** | id, idea_id, type, recommendation, priority, reasoning, status | Actionable recommendations | P1 |
| **key_questions** | id, idea_id, category, question, importance, answered, answer | Critical questions to answer | P1 |
| **validation_scores** | id, idea_id, dimension, score, weight, factors, calculated_at | Multi-dimensional scoring | P0 |
| **validation_signals** | id, score_id, signal_type, value, source, sentiment, confidence | Supporting evidence | P0 |

### 14. Validator - Market Tables (8)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **market_analysis** | id, idea_id, tam, sam, som, growth_rate, methodology, sources | Market sizing | P0 |
| **market_segments** | id, analysis_id, segment_name, size, growth, characteristics, priority | Customer segments | P1 |
| **market_trends** | id, analysis_id, trend_name, impact, timeframe, evidence | Trend analysis | P1 |
| **market_benchmarks** | id, industry, metric_name, p25, p50, p75, p90, sample_size, source | Industry benchmarks | P1 |
| **target_regions** | id, idea_id, region, market_size, competition_level, regulatory, priority | Geographic targeting | P2 |
| **opportunities** | id, idea_id, type, description, size, timeframe, confidence | Market opportunities | P1 |
| **score_factors** | id, idea_id, factor_name, weight, value, calculation_method | Scoring methodology | P1 |
| **research_sources** | id, idea_id, source_type, url, title, credibility, extracted_data | Source tracking | P2 |

### 15. Validator - Competition Tables (3)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **competitors** | id, idea_id, name, url, description, funding, employees, positioning | Competitor profiles | P0 |
| **competitor_products** | id, competitor_id, product_name, features, pricing, target_market | Product comparison | P1 |
| **competitor_strengths_weaknesses** | id, competitor_id, type, description, impact, evidence | SWOT elements | P1 |

### 16. Validator - Financial Tables (4)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **revenue_models** | id, idea_id, model_type, description, pricing, assumptions | Revenue model options | P0 |
| **unit_economics** | id, idea_id, cac, ltv, payback_months, gross_margin, assumptions | Unit economics | P0 |
| **revenue_projections** | id, idea_id, year, revenue, costs, profit, growth_rate, scenario | Financial projections | P1 |
| **pricing_strategies** | id, idea_id, strategy_type, price_points, rationale, competitive_position | Pricing analysis | P1 |

### 17. Validator - Execution Tables (5)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **roadmap_phases** | id, idea_id, phase_number, name, duration_weeks, goals, budget, milestones | Execution phases | P0 |
| **roadmap_activities** | id, phase_id, activity, owner, dependencies, status, effort | Phase activities | P1 |
| **team_requirements** | id, idea_id, total_headcount, key_roles, hiring_timeline, budget | Team planning | P1 |
| **team_roles** | id, requirement_id, role_title, skills, salary_range, priority, timing | Individual roles | P2 |
| **budget_breakdown** | id, idea_id, category, amount, timeframe, assumptions | Budget allocation | P1 |

### 18. Validator - Risk Tables (5)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **risk_assessments** | id, idea_id, risk_type, description, probability, impact, mitigation | Risk identification | P0 |
| **curated_resources** | id, idea_id, resource_type, title, url, relevance, notes | Helpful resources | P2 |
| **strategic_partners** | id, idea_id, partner_type, name, value_proposition, status | Partnership opportunities | P2 |
| **technology_assessment** | id, idea_id, tech_area, current_state, required_state, gap, complexity | Tech evaluation | P1 |
| **gtm_channels** | id, idea_id, channel_type, effectiveness, cost, reach, priority | Go-to-market channels | P1 |

### 19. Validator - Resources Tables (4)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **curated_resources** | id, idea_id, resource_type, title, url, relevance, notes | Helpful resources | P2 |
| **strategic_partners** | id, idea_id, partner_type, name, value_proposition, status | Partnership opportunities | P2 |
| **technology_assessment** | id, idea_id, tech_area, current_state, required_state, gap, complexity | Tech evaluation | P1 |
| **gtm_channels** | id, idea_id, channel_type, effectiveness, cost, reach, priority | Go-to-market channels | P1 |

### 20. Lean Validation Tables (8)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **assumptions** | id, canvas_id, block, assumption, risk_level, status, validated_at | Lean assumptions | P0 |
| **experiments** | id, assumption_id, hypothesis, method, success_criteria, status | Validation experiments | P0 |
| **experiment_results** | id, experiment_id, outcome, data, learnings, pivot_recommended | Experiment outcomes | P0 |
| **customer_segments** | id, canvas_id, segment_name, size, characteristics, pain_points | Customer details | P1 |
| **customer_forces** | id, segment_id, force_type, description, strength | Push/pull forces | P2 |
| **jobs_to_be_done** | id, segment_id, job, importance, satisfaction, opportunity | JTBD framework | P1 |
| **interviews** | id, startup_id, interviewee, segment, date, notes, recording_url | Interview tracking | P1 |
| **interview_insights** | id, interview_id, insight_type, insight, evidence, actionable | Interview learnings | P1 |

### 21. Vector/RAG Tables (4)

| Table | Key Fields | Purpose | Priority |
|-------|------------|---------|----------|
| **knowledge_chunks** | id, source_type, source_id, content, embedding, metadata, chunk_index | RAG knowledge base | P0 |
| **deck_benchmarks** | id, industry, slide_type, best_practices, examples, embedding | Pitch deck intelligence | P1 |
| **investor_feedback** | id, pitch_id, investor_id, feedback, sentiment, embedding | Feedback patterns | P2 |
| **decision_outcomes** | id, decision_type, context, outcome, success, embedding, learnings | Decision intelligence | P2 |

---

## Implementation Priority

### Phase 1: Foundation (P0) - 12 tables

| Table | Category |
|-------|----------|
| ideas | Validator - Ideas |
| validation_scores | Validator - Ideas |
| validation_signals | Validator - Ideas |
| market_analysis | Validator - Market |
| competitors | Validator - Competition |
| revenue_models | Validator - Financial |
| unit_economics | Validator - Financial |
| roadmap_phases | Validator - Execution |
| risk_assessments | Validator - Risk |
| assumptions | Lean Validation |
| experiments | Lean Validation |
| knowledge_chunks | Vector/RAG |

### Phase 2: Core Features (P1) - 21 tables

| Table | Category |
|-------|----------|
| idea_summaries | Validator - Ideas |
| idea_recommendations | Validator - Ideas |
| key_questions | Validator - Ideas |
| market_segments | Validator - Market |
| market_trends | Validator - Market |
| market_benchmarks | Validator - Market |
| opportunities | Validator - Market |
| score_factors | Validator - Market |
| competitor_products | Validator - Competition |
| competitor_strengths_weaknesses | Validator - Competition |
| revenue_projections | Validator - Financial |
| pricing_strategies | Validator - Financial |
| roadmap_activities | Validator - Execution |
| team_requirements | Validator - Execution |
| budget_breakdown | Validator - Execution |
| technology_assessment | Validator - Risk |
| gtm_channels | Validator - Risk |
| customer_segments | Lean Validation |
| jobs_to_be_done | Lean Validation |
| interviews | Lean Validation |
| deck_benchmarks | Vector/RAG |

### Phase 3: Advanced (P2) - 10 tables

| Table | Category |
|-------|----------|
| target_regions | Validator - Market |
| research_sources | Validator - Market |
| team_roles | Validator - Execution |
| curated_resources | Validator - Resources |
| strategic_partners | Validator - Resources |
| customer_forces | Lean Validation |
| interview_insights | Lean Validation |
| experiment_results | Lean Validation |
| investor_feedback | Vector/RAG |
| decision_outcomes | Vector/RAG |

---

## Key Relationships

### Core Relationships

```
profiles → organizations (via org_members)
organizations → projects → startups
startups → lean_canvases
startups → ideas (proposed)
```

### Validation Flow

```
ideas → validation_scores → validation_signals
ideas → market_analysis → market_segments, market_trends
ideas → competitors → competitor_products
ideas → revenue_models, unit_economics
ideas → roadmap_phases → roadmap_activities
ideas → risk_assessments
```

### Lean Validation Flow

```
lean_canvases → assumptions → experiments → experiment_results
lean_canvases → customer_segments → customer_forces, jobs_to_be_done
startups → interviews → interview_insights
```

### Vector/RAG Flow

```
documents, chat_messages, lean_canvases → knowledge_chunks (embeddings)
pitch_decks → deck_benchmarks
investors → investor_feedback
validation_verdicts → decision_outcomes
```

---

## RLS Pattern

All tables follow the same RLS pattern for multi-tenancy:

| Policy Type | Rule |
|-------------|------|
| SELECT | user_id = auth.uid() OR org member with read access |
| INSERT | user_id = auth.uid() OR org member with write access |
| UPDATE | user_id = auth.uid() OR org member with write access |
| DELETE | user_id = auth.uid() OR org admin only |

### Organization-scoped Tables

Tables scoped through organization chain:
- `table → startup → project → organization → org_members → user`

### User-scoped Tables

Tables directly linked to user:
- `profiles`, `notifications`, `chat_sessions`, `user_event_tracking`

---

## Index Strategy

### Required Indexes

| Index Type | Tables |
|------------|--------|
| user_id | All user-scoped tables |
| startup_id | All startup-scoped tables |
| org_id | All org-scoped tables |
| created_at | All tables (for sorting) |
| status | tasks, deals, experiments, validation_runs |
| industry | market_benchmarks, industry_playbooks, competitors |

### Vector Indexes (pgvector)

| Table | Index Type |
|-------|------------|
| knowledge_chunks | ivfflat or hnsw on embedding |
| deck_benchmarks | ivfflat on embedding |
| investor_feedback | ivfflat on embedding |
| decision_outcomes | ivfflat on embedding |

---

## Migration Order

### Batch 1: Foundation
1. Enable pgvector extension
2. Create ideas table
3. Create validation_scores, validation_signals
4. Create market_analysis
5. Create competitors
6. Create revenue_models, unit_economics
7. Create roadmap_phases
8. Create risk_assessments
9. Create knowledge_chunks

### Batch 2: Lean Validation
10. Create assumptions
11. Create experiments
12. Create experiment_results
13. Create customer_segments
14. Create interviews

### Batch 3: Extended Analysis
15. Create market_segments, market_trends, market_benchmarks
16. Create competitor_products, competitor_strengths_weaknesses
17. Create revenue_projections, pricing_strategies
18. Create roadmap_activities, team_requirements, budget_breakdown

### Batch 4: Advanced Features
19. Create remaining P1 tables
20. Create P2 tables
21. Create vector tables with embeddings
22. Add all foreign key constraints
23. Create RLS policies
24. Add performance indexes
