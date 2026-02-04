# Data Strategy

> Just the tables we need, nothing more

---

## Existing Tables (Keep)

| Category | Tables | Use |
|----------|--------|-----|
| **Core** | users, profiles, startups, projects | Identity |
| **Onboarding** | onboarding_sessions | Wizard data |
| **Canvas** | lean_canvases | 9-box canvas |
| **Chat** | messages, conversations | Chat history |
| **CRM** | contacts, deals | Pipeline |
| **Pitch** | pitch_decks, pitch_slides | Investor prep |

---

## New Tables (Coach)

| Table | Purpose |
|-------|---------|
| `validation_sessions` | Coach state machine |
| `validation_assessments` | 7-dimension scores |
| `validation_campaigns` | 90-day plans |
| `validation_sprints` | PDCA tracking |
| `validation_experiments` | Hypotheses + learnings |
| `validation_conversations` | Coach chat history |

**Total: 6 new tables**

---

## Key Schema

### validation_sessions
```sql
id              uuid PRIMARY KEY
startup_id      uuid → startups
state           jsonb  -- {phase, scores, constraint, sprint...}
is_active       boolean
```

### validation_assessments
```sql
id              uuid PRIMARY KEY
session_id      uuid → validation_sessions
dimension       text   -- clarity, desirability, etc.
score           int    -- 0-10
feedback        text
```

### validation_campaigns
```sql
id              uuid PRIMARY KEY
session_id      uuid → validation_sessions
constraint_type text   -- acquisition, monetization, etc.
campaign_type   text   -- mafia_offer, demo_sell_build
goal            text   -- "0 → 20 customers"
status          text   -- active, completed, paused
```

### validation_sprints
```sql
id              uuid PRIMARY KEY
campaign_id     uuid → validation_campaigns
sprint_number   int    -- 0-5
pdca_step       text   -- plan, do, check, act
outcomes        jsonb
```

---

## JSONB Strategy

| Use Table For | Use JSONB For |
|---------------|---------------|
| Things you query/filter | Nested results |
| Things with relationships | Schema that changes |
| Things you sort | Analysis outputs |

**Example:** `validation_sessions.state` is JSONB because:
- Read with parent (session)
- Structure may change
- No need to query individual fields

---

## Vector (Future)

| Collection | Purpose |
|------------|---------|
| `industry_knowledge` | Industry benchmarks, patterns |
| `playbook_chunks` | Playbook retrieval |
| `pitch_examples` | Pitch deck patterns |

**Not needed for MVP.** Add when coach needs RAG.

---

## RLS Pattern

```sql
-- All coach tables use same pattern
CREATE POLICY "own_startup_only" ON validation_sessions
FOR ALL USING (
  startup_id IN (
    SELECT id FROM startups WHERE user_id = auth.uid()
  )
);
```

---

## What We're NOT Building

| Old Plan | Why Skip |
|----------|----------|
| 31 validator tables | Overkill - 6 is enough |
| Separate idea/validation/market tables | Use JSONB in assessments |
| Complex agent state tables | One state column is enough |
| Experiment result tables | JSONB in experiments |

---

## Migration

```sql
-- One migration file
-- supabase/migrations/20260204_coach_tables.sql

CREATE TABLE validation_sessions (...);
CREATE TABLE validation_assessments (...);
CREATE TABLE validation_campaigns (...);
CREATE TABLE validation_sprints (...);
CREATE TABLE validation_experiments (...);
CREATE TABLE validation_conversations (...);

-- RLS policies
-- Indexes
```
