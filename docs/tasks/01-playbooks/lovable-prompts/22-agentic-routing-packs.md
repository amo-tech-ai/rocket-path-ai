---
task_number: "22"
title: "Agentic Routing & Multi-Step Pack Execution"
category: "AI"
subcategory: "Agent Strategy"
phase: 3
priority: "P1"
status: "Open"
percent_complete: 0
owner: "Full Stack"
---

# Prompt 22: Agentic Routing & Multi-Step Pack Execution

## 📋 Summary Table

| Feature | Intelligent Prompt Pack Selection |
| :--- | :--- |
| **System** | `feature_pack_routing` & `prompt-pack` Agent |
| **Agents** | `prompt-pack-agent` / `industry-expert-agent` |
| **Use Case** | User clicks "Improve Problem Statement"; Agent routes to the "Problem-Refinement-Pack" based on the industry-specific context. |
| **Outcome** | Dynamic, non-linear workflows that adapt to the user's startup stage and industry. |

## 📖 Description

This system implements the core of the "Agentic Playbook". It uses a routing table (`feature_pack_routing`) to map feature intents to multi-step AI workflows (packs). It handles the sequential execution of these steps, passing context from Step 1 to Step 2, and finally applying the results back to the database.

## 🧠 Rationale

Hard-coding prompts into the UI is brittle. By moving the logic to a Routing + Packs system, we can update the "AI strategy" for an entire industry (e.g., changing how we validate Fintech ideas) without touching any frontend code. This "agentic" approach allows the platform to act as a true advisor.

## 👤 User Stories

- **Marco (Healthtech Founder)**: Clicks "Run Deep Validation". The system looks up the `validator` feature context, sees Marco is in `healthcare`, and selects the "Healthtech-Compliance-Validation" pack instead of the generic one.
- **Jen (E-commerce Founder)**: Clicks "GTM Strategy". The system runs a 3-step pack: Step 1: Competitor Analysis, Step 2: Channel Selection, Step 3: Budget Allocation. Jen sees the progress bar move as each agentic step completes.

## ✅ Acceptance Criteria

1.  **Routing logic**: `prompt-pack` agent must query `feature_pack_routing` to find the `default_pack_slug`.
2.  **Stateful Execution**: Context must be persisted between steps in the `prompt_pack_runs` table.
3.  **UI Integration**: Frontend must use the `usePromptPack` hook to trigger actions like `run_pack` and `apply`.
4.  **Forensic Alignment**: All table names (`prompt_packs`, `prompt_pack_steps`) must match the 2026-01-29 baseline.
5.  **Industry Injection**: Every step in the pack must correctly receive the context-filtered industry data from the `industry_playbooks`.

## 🛠 Features & Logic

### 1. The Multi-Step Engine
- **Search**: Find the pack.
- **Run**: Loop through steps.
- **Apply**: Map JSON outputs to database schema (Task 3.15).

### 2. Context Passing
- Step 1 Output -> Step 2 Input.
- Example: "Target Audience" (Step 1) -> "Ad Copy Generation" (Step 2).

## 🏗 Frontend-Backend Wiring

- **Component**: `PackExecutionDrawer.tsx` (Visible progress through steps).
- **Hook**:
  ```typescript
  const { runPack, isExecuting } = usePromptPack();
  await runPack({ module: 'validator', industry: 'fintech' });
  ```

## 🗄 Supabase Schema & Edge Functions

- **Table**: `prompt_packs`, `prompt_pack_steps`, `feature_pack_routing`.
- **Table**: `prompt_pack_runs` (State storage).
- **Edge Function**: `prompt-pack` (Core executor).

## 🔗 Dependencies

- `feature_pack_routing` table populated with feature-to-pack maps.
- `industry-expert-agent` for providing the "Expert Context" used in step prompts.

## 📝 References

- **PRD**: Section 3.13 / 3.14 (Agentic Routing)
- **Audit**: `tasks/testing/04-playbook-audit.md` (Forensic fixes)
