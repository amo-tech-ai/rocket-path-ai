---
task_number: "08"
title: "Main Dashboard & Health Score"
category: "Dashboard"
subcategory: "Dashboard Home"
phase: 1
priority: "P0"
status: "Open"
percent_complete: 15
owner: "Frontend Developer"
---

# Lovable Prompt: Main Dashboard & Health Score

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/app/dashboard` - Main overview dashboard |
| **Features** | Health score, quick actions, recent activity, AI insights, progress widgets |
| **Agents** | Health Scorer (Gemini Pro), Insight Generator (Claude), Action Recommender (Gemini Flash) |
| **Use Cases** | Daily check-in, progress tracking, priority review, investor-ready status |
| **Duration** | Quick daily view (2-5 minutes) |
| **Outputs** | Health score, recommended actions, progress visualizations |

---

## Description

Build the main dashboard that serves as the founder's daily command center. It displays a real-time health score for the startup, surfaces AI-recommended actions, shows progress across all modules (canvas, pitch, tasks), and provides quick access to the most important next steps.

---

## Purpose & Goals

**Purpose:** Give founders a single view of "how am I doing?" and "what should I do next?" every time they log in.

**Goals:**
1. Display a real-time startup health score (0-100)
2. Show top 3 AI-recommended actions for today
3. Visualize progress across canvas, pitch deck, and tasks
4. Surface industry-specific warnings and opportunities
5. Provide quick access to all major features

**Outcomes:**
- Founders log in daily to check progress
- 80% of recommended actions are completed within 24 hours
- Health score increases by 5+ points per week for active users
- Clear path from "idea" to "investor-ready"

---

## Real World Examples

**Example 1: Maria - Morning Check-in**
> Maria logs in Monday morning. Her health score is 67/100. The dashboard shows: "Complete pitch deck (needed for fundraise)", "Add 2 more customer LOIs", "Schedule investor meeting with John from Sequoia."

**Example 2: James - Progress Tracking**
> James sees his Lean Canvas is 89% complete but his pitch deck is only 40%. The AI insight says: "Your canvas is strong—use it to complete your pitch deck. Try the Pitch Deck Generator."

**Example 3: Sarah - Warning Detection**
> Sarah's health score dropped from 72 to 65. The dashboard highlights: "Detected: No customer activity in 14 days. Consider scheduling user interviews." She clicks through to the Smart Interviewer.

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Health Score** | Large circular score (0-100) with trend arrow |
| **Score Breakdown** | Problem (8/10), Solution (7/10), Traction (5/10), Team (6/10) |
| **Stage Indicator** | "Pre-Seed Fundraising" badge |
| **Industry Badge** | "FinTech — Payments" |
| **Quick Links** | Canvas, Pitch, Tasks, CRM, Chat |
| **Profile Completeness** | "Your profile is 85% complete" |

### Main Panel: Work Area

| Section | Content |
|---------|---------|
| **Today's Focus** | Top 3 AI-recommended actions as cards with quick-start buttons |
| **Progress Overview** | Grid of module cards: Canvas (89%), Pitch (40%), Tasks (12/18), CRM (5 active) |
| **Recent Activity** | Timeline of last 7 days: tasks completed, canvas updates, AI runs |
| **Quick Actions** | "New Task", "Update Canvas", "Generate Pitch Slide" buttons |
| **Upcoming Deadlines** | Tasks and milestones due this week |

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **AI Insight of the Day** | Daily personalized insight based on activity |
| **Industry Benchmarks** | "Your MRR is 20% below Seed average" |
| **Warnings** | Red flags from playbook (e.g., "No traction data") |
| **Opportunities** | "Your competitor just raised—time to accelerate?" |
| **Investor Readiness** | "3 items needed before investor meeting" |
| **This Week's Wins** | Celebrate completed items |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `MainDashboard` | Container with 3-panel layout |
| `HealthScoreWidget` | Circular score with breakdown |
| `TodaysFocus` | Top 3 recommended actions |
| `ModuleProgress` | Grid of module completion cards |
| `RecentActivity` | Activity timeline |
| `QuickActions` | Action button row |
| `AIInsightPanel` | Right panel intelligence |
| `WarningBanner` | Critical alerts at top |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `health-scorer` | Dashboard load, data change | startup_profile, all module data | score, breakdown, trends |
| `action-recommender` | Dashboard load | score, gaps, stage | top_3_actions |
| `insight-generator` | Daily (cached) | startup_profile, activity | insight_text |
| `industry-expert-agent` | Dashboard load | industry_id | benchmarks, warnings |

### Data Flow

```
Dashboard Load → Parallel Fetches → Aggregation → Display
       ↓              ↓                ↓           ↓
  useEffect    startups, tasks,     health-scorer  Widgets
               canvases, pitches         ↓           ↓
                     ↓              action-rec    Cards
              Supabase queries          ↓           ↓
                                   Combined      Render
                                   response
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `startups` | `health_score`, `score_breakdown`, `last_activity_at` | Dashboard load (cached) |
| `profiles` | `industry_id`, `funding_stage`, `onboarding_completed` | Read only |
| `tasks` | `status`, `count` | Task progress widget |
| `lean_canvases` | `completeness_score` | Canvas progress widget |
| `pitch_decks` | `completeness_score` | Pitch progress widget |
| `contacts` | `active deals count` | CRM widget |
| `ai_runs` | Daily insight generation | Insight panel |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `calculate_health` | health-scorer | Gemini 3 Pro | benchmarks, investor_expectations |
| `recommend_actions` | action-recommender | Claude Sonnet | stage_checklists |
| `generate_insight` | insight-generator | Claude Sonnet | success_stories, failure_patterns |
| `detect_warnings` | industry-expert-agent | Gemini 3 Flash | warning_signs |

---

## AI Agent Behaviors

### Health Scorer

- **Trigger:** Dashboard load, any module update
- **Autonomy:** Background (automatic calculation)
- **Behavior:** Calculates overall score from weighted components
- **Output:** `{ score: 67, breakdown: { problem: 8, solution: 7, traction: 5, team: 6 }, trend: +3 }`

### Action Recommender

- **Trigger:** Dashboard load
- **Autonomy:** Suggest (shows actions, user chooses)
- **Behavior:** Prioritizes actions based on gaps and stage
- **Output:** `{ actions: [{ title, description, module, impact, effort }] }`

### Insight Generator

- **Trigger:** Daily (cached for 24h)
- **Autonomy:** Background (auto-generated)
- **Behavior:** Creates personalized insight from recent activity
- **Output:** `{ insight: string, source: string, action_link: string }`

---

## Health Score Components

| Component | Weight | Data Source | Scoring |
|-----------|--------|-------------|---------|
| **Problem Clarity** | 20% | Canvas → Problem box | 1-10 based on specificity |
| **Solution Definition** | 15% | Canvas → Solution box | 1-10 based on clarity |
| **Market Understanding** | 15% | Canvas + Market research | 1-10 based on data |
| **Traction Proof** | 25% | Tasks, CRM, metrics | 1-10 based on evidence |
| **Team Readiness** | 10% | Founder fit, team profile | 1-10 based on completeness |
| **Investor Readiness** | 15% | Pitch deck, documents | 1-10 based on completion |

---

## Recommended Actions Logic

| Condition | Recommended Action | Priority |
|-----------|-------------------|----------|
| Canvas < 50% complete | "Complete your Lean Canvas" | P0 |
| Pitch deck not started | "Start your pitch deck" | P0 |
| No traction data in 14 days | "Log recent wins and metrics" | P0 |
| Pre-fundraise, no LOIs | "Get 3 letters of intent" | P1 |
| CRM has stale deals | "Follow up with [contact]" | P1 |
| Health score dropped | "Address [specific gap]" | P1 |

---

## Acceptance Criteria

- [ ] Health score calculates in < 2 seconds on load
- [ ] Score breakdown shows 6 components with visual bars
- [ ] Today's Focus shows exactly 3 actions with module links
- [ ] Module progress cards link to respective features
- [ ] Recent activity shows last 7 days
- [ ] AI insight updates daily (not on every load)
- [ ] Warnings display as dismissible banners
- [ ] Quick actions open appropriate modals/pages
- [ ] Mobile responsive (stacked cards on mobile)
- [ ] Score changes animate smoothly

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `startups` table with health_score | ✅ Ready | Score stored in DB |
| `health-scorer` edge function | 🔄 Needed | Calculation logic |
| `action-recommender` edge function | 🔄 Needed | Priority logic |
| All module tables | ✅ Ready | For progress calculation |
| Caching layer | 📋 Future | Reduce recalculation |
