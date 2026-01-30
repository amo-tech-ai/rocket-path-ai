# Workflow Trigger System (Score-to-Task Automation)

> **Version:** 1.0 | **Date:** January 30, 2026  
> **Purpose:** Automate the creation of corrective tasks based on AI validation scores.  
> **Logic:** Score < 60 → Trigger specific action items for the founder.

---

## Summary Table

| Source Score | Metric / Category | Threshold | Triggered Action | Example Task |
|--------------|-------------------|-----------|------------------|--------------|
| `investor_score` | Team Strength | < 60 | Recruit Advisor | "Identify 3 industry mentors to fill GTM experience gap" |
| `readiness_score`| Market Fit | < 60 | Customer Interviews | "Run 10 interviews with Fintech compliance officers" |
| `investor_score` | Financials | < 70 | Model Review | "Update COGS to include fraud reserves (Industry avg 8%)" |
| `validation_report`| Overall | < 50 | Risk Mitigation | "Schedule strategy review: high risk of pre-regulatory failure" |

---

## Description

The Workflow Trigger System turns AI "judgement" into AI "assistance". When an agent evaluates a startup and finds a gap (a score below the threshold), it doesn't just display a number—it automatically generates a task in the founder's Kanban board to bridge that gap. This creates a closed-loop system where validation leads directly to execution.

---

## Rationale

**Why we need automated triggers:**
- **Actionable Insights** — Founders often don't know *how* to improve a low score; triggers give them the playbook.
- **Engagement** — Keeps the founder coming back to the platform to "clear" their risk-based tasks.
- **Expertise Scalability** — Captures the advice a human consultant would give (e.g., "Your score is low because of X, so do Y") and automates it.

---

## Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| TRIG-1 | Score < 60 creates a record in `tasks` table | DB query: Verify new task linked to `startup_id` |
| TRIG-2 | Task description is context-aware | View task: Must mention the specific sub-category that failed |
| TRIG-3 | Triggers occur after Postgres Function `handle_score_update()` | Trigger trace: Verify execution after `validation_reports` insert |
| TRIG-4 | Prevent duplicate task creation | Logic: Do not create task if an identical open task exists |
| TRIG-5 | Tasks are cross-linked to Playbook Runs | Task UI: Click task to see the AI report that triggered it |

---

## Implementation Workflow

### 1. Database Trigger (PL/pgSQL)
- Create a Postgres trigger on `validation_reports` and `investor_scores`.
- Logic: `IF NEW.score < 60 THEN notify 'trigger_task', json_build_object(...)`.

### 2. Edge Function Handler (`trigger-handler`)
- Listens for score events or is called directly by other agents.
- Queries `prompt_packs` with category: `mitigation-tasks`.
- Generates 1-3 specific, actionable tasks using `TEMPLATE_10_STAGE_CHECKLIST`.

### 3. Frontend Integration
- Display a "New Tasks Created" notification on the Dashboard or Validator screen when scores are low.
- Highlight the connection between the low score and the new task.

---

## Logic Matrix

| Condition | Prompt Category | Priority | Assignee |
|-----------|-----------------|----------|----------|
| Product Score < 50 | `product-tasks` | High | Founder |
| Market Score < 60 | `market-tasks` | Medium | Founder |
| Finance Score < 70 | `finance-tasks` | High | Admin/CFO |
| Team Score < 60 | `team-tasks` | Low | Founder |

---

## Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| `tasks` table | Data storage for actions | ✅ Exists |
| `validation_reports` | Score source | ✅ Exists |
| `TEMPLATE_10` | Task generation logic | ✅ Registered |
| `automation-agent` | Edge function to handle logic | 🟡 To be Created |
