# 101 - Startup Coach Database & State Machine

---

| Aspect | Details |
|--------|---------|
| **Screens** | None (backend only) |
| **Features** | State machine, full project memory, session tracking |
| **Agents** | - |
| **Edge Functions** | - |
| **Use Cases** | Track validation progress, persist experiments, remember conversations |
| **Real-World** | "Coach remembers where founder left off, even days later" |

---

```yaml
---
task_id: 101-VAL
title: Startup Coach Database & State Machine
diagram_ref: startup-coach-design
phase: MVP
priority: P0
status: Not Started
skill: /supabase
ai_model: -
subagents: [supabase-expert, code-reviewer]
edge_function: -
schema_tables: [validation_sessions, validation_assessments, validation_campaigns, validation_sprints, validation_experiments, validation_conversations]
depends_on: []
---
```

---

## Description

Create the database foundation for the Startup Coach validation system. This includes 6 tables that enable full project memory - tracking assessment scores, 90-day campaigns, sprint progress, experiments, and conversation history. The state machine tracks users through Assessment → Constraint → Campaign → Sprint → Review phases.

## Rationale

**Problem:** Current AI chat is stateless - founders re-explain context every session.
**Solution:** Database tables store complete validation journey with state machine tracking current phase.
**Impact:** Coach remembers everything, enabling continuous progress across sessions.

---

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Founder | pick up where I left off | I don't waste time re-explaining |
| Founder | see my assessment history | I can track improvement over time |
| Founder | track sprint experiments | I know what I've learned |

## Real-World Example

> Alex closes the app mid-assessment. Three days later, he opens it again.
> The coach says: "Welcome back! Last time we scored Clarity and Desirability.
> Ready to continue with Viability?" No re-explanation needed.

---

## Goals

1. **Primary:** Create 6 tables with proper relationships
2. **Secondary:** RLS policies enforce user data isolation
3. **Quality:** State machine types defined in TypeScript

## Acceptance Criteria

- [ ] `validation_sessions` table created with JSONB state column
- [ ] `validation_assessments` table tracks dimension scores over time
- [ ] `validation_campaigns` table stores 90-day campaign data
- [ ] `validation_sprints` table tracks PDCA progress
- [ ] `validation_experiments` table stores hypotheses and learnings
- [ ] `validation_conversations` table persists chat history
- [ ] All tables have proper foreign keys and constraints
- [ ] RLS policies restrict access to own startup data
- [ ] Indexes created for common query patterns
- [ ] TypeScript types generated

---

## Schema

### Table: validation_sessions

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| startup_id | uuid | FK → startups, NOT NULL |
| state | jsonb | NOT NULL, default '{"phase": "onboarding"}' |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

**Unique constraint:** (startup_id, is_active) WHERE is_active = true

### Table: validation_assessments

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| session_id | uuid | FK → validation_sessions, ON DELETE CASCADE |
| dimension | text | NOT NULL |
| score | integer | CHECK (score >= 0 AND score <= 10) |
| feedback | text | - |
| assessed_at | timestamptz | default now() |

### Table: validation_campaigns

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| session_id | uuid | FK → validation_sessions, ON DELETE CASCADE |
| constraint_type | text | NOT NULL |
| campaign_type | text | NOT NULL |
| goal | text | NOT NULL |
| start_date | date | - |
| end_date | date | - |
| status | text | default 'active' |

### Table: validation_sprints

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| campaign_id | uuid | FK → validation_campaigns, ON DELETE CASCADE |
| sprint_number | integer | NOT NULL |
| purpose | text | - |
| pdca_step | text | default 'plan' |
| outcomes | jsonb | - |
| started_at | timestamptz | - |
| completed_at | timestamptz | - |

### Table: validation_experiments

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| sprint_id | uuid | FK → validation_sprints, ON DELETE CASCADE |
| hypothesis | text | NOT NULL |
| method | text | - |
| success_criteria | text | - |
| result | text | - |
| learning | text | - |
| status | text | default 'planned' |

### Table: validation_conversations

| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, default gen_random_uuid() |
| session_id | uuid | FK → validation_sessions, ON DELETE CASCADE |
| role | text | NOT NULL |
| content | text | NOT NULL |
| phase | text | - |
| created_at | timestamptz | default now() |

### RLS Policies

| Table | Policy | Operation | Rule |
|-------|--------|-----------|------|
| validation_sessions | select_own | SELECT | startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()) |
| validation_sessions | manage_own | ALL | startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()) |
| validation_assessments | via_session | ALL | session_id IN (SELECT id FROM validation_sessions WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid())) |
| (similar for other tables) | | | |

### Indexes

```sql
CREATE INDEX idx_validation_sessions_startup ON validation_sessions(startup_id);
CREATE INDEX idx_validation_sessions_active ON validation_sessions(startup_id) WHERE is_active = true;
CREATE INDEX idx_validation_conversations_session ON validation_conversations(session_id);
CREATE INDEX idx_validation_conversations_created ON validation_conversations(created_at DESC);
CREATE INDEX idx_validation_sprints_campaign ON validation_sprints(campaign_id);
CREATE INDEX idx_validation_assessments_session ON validation_assessments(session_id);
```

---

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Migration | `supabase/migrations/20260204_coach_validation_tables.sql` | Create |
| Types | `src/types/validation.ts` | Create |
| Generated Types | `src/integrations/supabase/types.ts` | Regenerate |

---

## State Machine Types

```typescript
// src/types/validation.ts

export type ValidationPhase =
  | 'onboarding'
  | 'assessment'
  | 'constraint'
  | 'campaign_setup'
  | 'sprint_planning'
  | 'sprint_execution'
  | 'cycle_review';

export type Dimension =
  | 'clarity'
  | 'desirability'
  | 'viability'
  | 'feasibility'
  | 'defensibility'
  | 'timing'
  | 'mission';

export type Constraint =
  | 'acquisition'
  | 'monetization'
  | 'retention'
  | 'scalability';

export type PDCAStep = 'plan' | 'do' | 'check' | 'act';

export interface ValidationState {
  phase: ValidationPhase;
  assessmentScores?: Record<Dimension, number>;
  assessmentProgress?: number;
  constraint?: Constraint;
  campaignType?: string;
  goal90Day?: string;
  currentSprint?: number;
  pdcaStep?: PDCAStep;
  sprintResults?: SprintResult[];
  cycleDecisions?: CycleDecision[];
}

export interface SprintResult {
  sprintNumber: number;
  outcome: string;
  learnings: string[];
  decision: 'continue' | 'adjust' | 'pivot';
}

export interface CycleDecision {
  cycleNumber: number;
  decision: 'persevere' | 'pivot' | 'pause';
  reason: string;
  date: string;
}

export const STATE_TRANSITIONS: Record<ValidationPhase, ValidationPhase[]> = {
  onboarding: ['assessment'],
  assessment: ['constraint'],
  constraint: ['campaign_setup'],
  campaign_setup: ['sprint_planning'],
  sprint_planning: ['sprint_execution'],
  sprint_execution: ['sprint_planning', 'cycle_review'],
  cycle_review: ['assessment', 'campaign_setup']
};
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Multiple active sessions | Constraint ensures only one active per startup |
| Session with no assessments | Valid state during onboarding |
| Campaign without sprints | Valid when just created |
| Orphaned experiments | CASCADE delete cleans up |

---

## Security Checklist

- [ ] RLS enabled on all 6 tables
- [ ] Policies restrict to own startup data
- [ ] No direct table access without auth
- [ ] Cascade deletes prevent orphaned records

---

## Verification

```bash
# Apply migration
supabase db push

# Regenerate types
supabase gen types typescript --local > src/integrations/supabase/types.ts

# Verify tables exist
supabase db query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE 'validation_%'"

# Verify RLS enabled
supabase db query "SELECT tablename, rowsecurity FROM pg_tables WHERE tablename LIKE 'validation_%'"
```

---

## Codebase References

| Pattern | Reference |
|---------|-----------|
| Migration format | `supabase/migrations/` |
| RLS patterns | Existing `*_policies` in migrations |
| Type definitions | `src/types/` |

---

## Design Document

See: `/tasks/plan/2026-02-04-startup-coach-design.md`
