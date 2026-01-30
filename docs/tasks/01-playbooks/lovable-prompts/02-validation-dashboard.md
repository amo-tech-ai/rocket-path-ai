---
task_number: "02"
title: "Validation Dashboard"
category: "Dashboard"
subcategory: "Validation"
phase: 1
priority: "P0"
status: "Open"
percent_complete: 15
owner: "Frontend Developer"
---

# Lovable Prompt: Validation Dashboard

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/validator` - Idea validation hub |
| **Features** | Quick validate, deep validate, investor lens, risk radar, opportunity scanner |
| **Agents** | Validator Agent (Gemini Pro), Risk Analyzer (Claude), Opportunity Scout (Gemini) |
| **Use Cases** | Pre-pitch preparation, pivot decisions, investor meeting prep, competitive assessment |
| **Duration** | Quick: 3 min, Deep: 15 min, Investor: 10 min |
| **Outputs** | Validation score, risk register, opportunity list, actionable tasks |

---

## Description

Build a validation dashboard that helps founders stress-test their startup idea before pitching to investors. Three validation modes (Quick, Deep, Investor Lens) provide different depths of analysis. Results display as an interactive score card with drill-down into specific areas.

---

## Purpose & Goals

**Purpose:** Help founders identify weaknesses in their startup thesis before investors do.

**Goals:**
1. Provide instant validation score (0-100) with breakdown
2. Identify top 3 risks with mitigation strategies
3. Surface opportunities the founder may have missed
4. Generate actionable tasks to improve weak areas
5. Use industry benchmarks for scoring (not generic criteria)

**Outcomes:**
- Founders know their weak spots before investor meetings
- Tasks automatically created for areas scoring below 60
- Validation report shareable with advisors/co-founders

---

## Real World Examples

**Example 1: Quick Validate - FinTech Startup**
> Carlos runs Quick Validate on his payment processing idea. In 3 minutes, he gets a score of 72/100. The breakdown shows "Regulatory Compliance: 45" as the weak spot. The AI explains: "FinTech investors expect a clear licensing roadmap. You haven't mentioned MTL or state licensing." A task is auto-generated: "Research money transmitter license requirements in target states."

**Example 2: Deep Validate - Healthcare Founder**
> Priya runs Deep Validate on her clinical decision support tool. The 15-minute analysis covers market size, competitive landscape, regulatory pathway, and unit economics. Her "FDA Strategy" score is 82, but "Reimbursement Model" scores 38. The AI suggests: "Consider partnering with a billing company to handle CPT codes. Most healthtech failures happen at reimbursement, not FDA."

**Example 3: Investor Lens - B2B SaaS**
> Mike prepares for a Series A pitch by running Investor Lens mode. The AI role-plays as a skeptical VC and asks tough questions: "Your NRR is 95%, but best-in-class B2B SaaS shows 120%+. What's causing churn and how will you fix it?" Mike can practice answers and see how they'd rate.

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Validation Mode Selector** | Quick / Deep / Investor Lens tabs |
| **Industry Badge** | Selected industry from profile |
| **Historical Scores** | Previous validation scores with dates |
| **Improvement Trend** | Score change over time graph |
| **Report Links** | Previous validation reports |

### Main Panel: Work Area

| Mode | Main Content |
|------|--------------|
| **Quick Validate** | Score circle (0-100), 5 category breakdown bars, top 3 risks list, "Improve This" button per category |
| **Deep Validate** | Full assessment form (10 areas), progressive disclosure (expand/collapse), inline AI suggestions per field |
| **Investor Lens** | Mock Q&A interface, investor question on left, answer textarea on right, "Rate My Answer" button, follow-up questions |

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **Risk Radar** | Visual radar chart of risk categories |
| **Industry Benchmark** | "Your score vs. average {industry} startup" |
| **Competitor Alerts** | Known competitors in your space |
| **Opportunity Cards** | AI-detected opportunities (pivot, new market, partnership) |
| **Task Queue** | Auto-generated tasks from low scores |
| **Expert Tips** | Industry-specific advice based on weak areas |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `ValidationDashboard` | Parent container, mode switching |
| `ScoreCircle` | Animated score display (0-100) |
| `CategoryBreakdown` | Bar chart of 5-10 validation categories |
| `RiskRadar` | D3/Recharts radar visualization |
| `InvestorQA` | Mock investor Q&A interface |
| `TaskQueue` | Auto-generated improvement tasks |
| `ValidationHistory` | Previous scores timeline |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `prompt-pack` | "Validate" button | action=run, pack_slug=idea-validation | scores, risks, tasks |
| `industry-expert-agent` | Scoring | action=validate_canvas | benchmark comparison |
| `ai-chat` | Investor Lens Q&A | messages, industry_context | investor-style responses |

### Data Flow

```
Startup Profile → Validator Agent → Industry Benchmarks → Score Calculation
        ↓                ↓                   ↓                    ↓
   Profile data     Risk analysis     Good/Great thresholds   Category scores
        ↓                ↓                   ↓                    ↓
   Current state     Risk register    "You're at 72, great is 85"  Final score
        ↓                ↓                   ↓                    ↓
   Task generation   Mitigation       Improvement suggestions   Dashboard update
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `validation_reports` | `validation_type`, `score`, `scores_breakdown`, `risks`, `opportunities`, `tasks_generated` | Validation complete |
| `startups` | `metadata.validation_score`, `metadata.last_validated` | Score update |
| `tasks` | `title`, `description`, `source=validation`, `priority` | Task generation |
| `ai_runs` | `action=validate`, `industry_context_used`, `outputs_json` | Every validation |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `quick_validate` | prompt-pack | Gemini 3 Flash | benchmarks, warning_signs |
| `deep_validate` | prompt-pack | Gemini 3 Pro | All 10 categories |
| `investor_lens` | ai-chat | Claude Sonnet | investor_expectations, investor_questions |
| `get_benchmarks` | industry-expert-agent | - | benchmarks only |
| `generate_tasks` | prompt-pack | Claude Sonnet | failure_patterns, stage_checklists |

---

## AI Agent Behaviors

### Validator Agent
- **Trigger:** "Validate" button in any mode
- **Autonomy:** Autonomous (runs analysis, returns results)
- **Behavior:** Analyzes startup data against industry benchmarks, identifies gaps
- **Output:** `{ score: number, breakdown: {}, risks: [], opportunities: [] }`

### Risk Analyzer
- **Trigger:** Score below 60 in any category
- **Autonomy:** Suggest (shows risks, user acknowledges)
- **Behavior:** Deep-dives into weak areas, proposes mitigation strategies
- **Output:** `{ risks: [{ title, severity, mitigation, effort }] }`

### Opportunity Scout
- **Trigger:** Deep validate completion
- **Autonomy:** Suggest (shows opportunities, user explores)
- **Behavior:** Identifies adjacent markets, partnership opportunities, pivot options
- **Output:** `{ opportunities: [{ type, description, potential, next_steps }] }`

---

## Validation Categories

| Category | Weight | Good | Great | Industry-Specific |
|----------|--------|------|-------|-------------------|
| Problem Clarity | 15% | 60+ | 80+ | Healthcare: "Clinical need defined" |
| Market Size | 10% | 60+ | 80+ | SaaS: "SAM > $500M" |
| Solution Fit | 15% | 60+ | 80+ | FinTech: "Regulatory compliant" |
| Competitive Moat | 10% | 60+ | 80+ | AI: "Proprietary data" |
| Team Fit | 15% | 60+ | 80+ | Enterprise: "Sales experience" |
| Traction | 15% | 60+ | 80+ | Marketplace: "Supply-side growth" |
| Unit Economics | 10% | 60+ | 80+ | B2C: "CAC < $50" |
| Funding Fit | 10% | 60+ | 80+ | Stage-dependent |

---

## Acceptance Criteria

- [ ] Quick validate returns score in <5 seconds
- [ ] Deep validate covers all 10 categories with industry-specific questions
- [ ] Investor Lens asks at least 5 relevant questions per session
- [ ] Low scores (<60) auto-generate tasks
- [ ] Scores compare against industry benchmarks (not generic)
- [ ] Historical scores visible in timeline
- [ ] Reports exportable as PDF
- [ ] Mobile responsive with collapsible panels
- [ ] Risk radar updates in real-time as user edits

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `validation_reports` table | 🟢 Ready | Result storage |
| `prompt-pack` edge function | ✅ Ready | idea-validation pack exists |
| `industry-expert-agent` | ✅ Ready | Returns benchmarks |
| Gemini 3 Pro API | ✅ Ready | For deep analysis |
| Claude Sonnet API | ✅ Ready | For investor simulation |
| D3/Recharts | ✅ Available | For radar visualization |
