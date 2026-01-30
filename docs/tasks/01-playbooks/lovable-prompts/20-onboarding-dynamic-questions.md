---
task_number: "20"
title: "Dynamic Question Rendering & Onboarding Flow"
category: "Feature"
subcategory: "Onboarding"
phase: 3
priority: "P1"
status: "Open"
percent_complete: 0
owner: "Full Stack"
---

# Prompt 20: Dynamic Question Rendering & Onboarding Flow

## 📋 Summary Table

| Feature | Dynamic Industry Questions |
| :--- | :--- |
| **Screens** | Onboarding Wizard (Step 2 - Details) |
| **Agents** | `industry-expert-agent` (Action: `get_questions`) |
| **Use Case** | Founder selects "Fintech" and gets asked about "Regulatory Compliance" instead of generic growth questions. |
| **Logic** | Fetch questions via JSONB extraction from `industry_playbooks`; render conditionally based on user confidence. |

## 📖 Description

This system implements the "Expert-Led Onboarding" experience. Instead of a static list of startup questions, the application fetches industry-specific questions from the `industry_playbooks` table using the `industry-expert-agent`. It handles the rendering of these questions in the UI and the mapping of answers back to the startup profile or canvas.

## 🧠 Rationale

Generic onboarding leads to generic startup data. By asking industry-specific questions (e.g., asking a Biotech founder about "FDA Phase Timeline"), we capture high-signal data that feeds better AI validation and pitch generation later.

## 👤 User Stories

- **Alex (Fintech Founder)**: Alex selects "Fintech" in Step 1. In Step 2, he is asked "How are you handling KYC/AML?". He feels the platform "gets" his business because it knows the specific risks of his industry.
- **Sarah (SaaS Founder)**: Sarah is asked about "LTV/CAC expectations" for her industry. The platform provides benchmarks next to the question so she can compare her current assumptions.

## ✅ Acceptance Criteria

1.  **Agent Integration**: Frontend must call `industry-expert-agent` with `action: 'get_questions'`.
2.  **Schema Alignment**: Questions must be extracted from the `investor_questions` JSONB column in `industry_playbooks`.
3.  **UI Rendering**: Questions must match the "3-Panel Layout" — Context (Benchmarking) on the left, Question in the middle, AI Coaching on the right.
4.  **State Management**: Answers must be saved to `playbook_runs` (state) and eventually applied to `startups` or `lean_canvases`.
5.  **Forensic Fixes**: Use the correct `industry_playbooks` table name and `get_industry_questions` RPC.

## 🛠 Features & Logic

### 1. The Onboarding Flow
- **Step 1**: Industry Selection -> Sets `startup.industry_id`.
- **Step 2**: Fetch Questions -> Calls Agent.
- **Step 3**: Conditional Logic -> Only show Top 3 "High Priority" questions for speed.

### 2. Rendering Engine
- Map JSONB question objects to Form components.
- Support `text`, `select`, and `multi-select` answer types.
- Provide "Why this matters" tooltips from the playbook data.

## 🏗 Frontend-Backend Wiring

- **Hook**: `useOnboardingQuestions(industryId)`
- **Agent Call**:
  ```typescript
  const response = await invokeAgent({
    action: 'get_questions',
    industry: industryId,
    context: 'onboarding'
  });
  ```
- **DB Write**: Write answers to `playbook_runs.current_state` to enable "Resume Onboarding" functionality.

## 🗄 Supabase Schema & Edge Functions

- **Table**: `industry_playbooks` (Source of questions)
- **Table**: `playbook_runs` (Storage for transient onboarding state)
- **RPC**: `get_industry_questions(p_industry, p_context)`
- **Edge Function**: `industry-expert-agent` (Handler for `get_questions`)

## 🔗 Dependencies

- `industry_playbooks` table populated with 19 industries.
- `industry-expert-agent` deployed with visibility into playbook JSONB.

## 📝 References

- **PRD**: Section 2.2 (Industry Expert Agent)
- **Audit**: `tasks/testing/04-playbook-audit.md` (Forensic fixes for naming)
