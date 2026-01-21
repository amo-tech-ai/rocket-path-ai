# 38. AI-Powered Stage Guidance System

## Overview

Intelligent system that identifies the user's startup stage (ideation, validation, traction, scaling) and provides stage-specific guidance, templates, and milestone recommendations.

## Stage Definitions

| Stage | DB Value | Key Focus | Milestones to Advance |
|-------|----------|-----------|----------------------|
| **Ideation** | `idea` | Problem validation, early customer discovery | Complete Lean Canvas, 20+ customer interviews, MVP concept defined |
| **Validation** | `pre_seed` | Product-market fit signals, MVP testing | Landing page with signups, first paying customers, core metrics defined |
| **Traction** | `seed` | Growth, repeatable acquisition channels | MRR >$10K, <5% monthly churn, 3 acquisition channels identified |
| **Scaling** | `series_a` | Team growth, market expansion | MRR >$100K, team >10, Series A readiness score >80% |

## AI Agent Configuration

### StageDetector Agent

```
SYSTEM PROMPT:
You are StageDetector, an AI agent that assesses startup maturity and provides stage-appropriate guidance.

INPUT:
- Startup profile (industry, description, team_size, is_raising, raise_amount)
- Traction data (MRR, users, customers, growth rate)
- Lean Canvas completion status
- Task completion history
- Profile strength score

INSTRUCTIONS:
1. Analyze all inputs to determine current stage
2. Identify gaps preventing stage advancement
3. Generate stage-specific recommendations
4. Provide encouragement and clear next steps

OUTPUT (JSON):
{
  "current_stage": "idea|pre_seed|seed|series_a",
  "stage_confidence": 0.85,
  "stage_label": "Ideation",
  "progress_to_next": 45,
  "milestones": [
    { "id": "m1", "title": "Complete Lean Canvas", "status": "completed", "weight": 20 },
    { "id": "m2", "title": "20+ Customer Interviews", "status": "in_progress", "progress": 12, "target": 20 },
    { "id": "m3", "title": "Define MVP Scope", "status": "pending", "weight": 25 }
  ],
  "recommendations": [
    { "priority": "high", "action": "Schedule 8 more customer interviews this week", "category": "discovery" },
    { "priority": "medium", "action": "Document problem hypotheses in Lean Canvas", "category": "strategy" }
  ],
  "next_stage": "Validation",
  "next_stage_criteria": [
    "Complete problem validation interviews",
    "Document learnings in Lean Canvas",
    "Define measurable success metrics"
  ]
}
```

## Stage-Specific Content

### Ideation Stage
- **Templates**: Customer Interview Script, Problem Statement Canvas, Competitor Analysis
- **Recommended Actions**: Customer discovery calls, problem validation, market research
- **Key Metrics**: Interviews completed, problems validated, hypotheses tested
- **Resources**: "The Mom Test" summary, Jobs-to-be-Done framework

### Validation Stage  
- **Templates**: MVP Requirements Doc, Landing Page Copy, Pricing Strategy
- **Recommended Actions**: Build MVP, launch landing page, get first signups
- **Key Metrics**: Signups, activation rate, early revenue
- **Resources**: MVP prioritization frameworks, landing page best practices

### Traction Stage
- **Templates**: Growth Model, Channel Experiment Log, Hiring Plan
- **Recommended Actions**: Optimize acquisition channels, reduce churn, hire key roles
- **Key Metrics**: MRR, CAC, LTV, churn rate, NPS
- **Resources**: Growth frameworks, fundraising preparation

### Scaling Stage
- **Templates**: Series A Deck, Board Deck, OKR Framework
- **Recommended Actions**: Prepare fundraise materials, expand team, enter new markets
- **Key Metrics**: ARR, burn multiple, runway, team growth
- **Resources**: Investor targeting, term sheet negotiation

## UI Components

### StageGuidanceCard
- Current stage indicator with visual progress ring
- Milestones checklist with completion status
- "View All Milestones" expansion
- Next stage preview with criteria

### StageProgressBanner
- Compact header showing stage + progress percentage
- Celebration animation on stage advancement
- Quick access to stage-specific resources

### MilestoneTracker
- Kanban-style milestone board
- Drag-and-drop milestone completion
- AI-generated milestone suggestions
- Progress analytics over time

## Data Flow

1. User loads Dashboard → fetch startup data
2. Call `stage-guidance` edge function with startup context
3. AI analyzes data and returns stage assessment
4. UI renders stage card with milestones
5. User completes milestones → update progress
6. Stage advancement triggers celebration + new guidance

## User Stories Implementation

| Story | Implementation |
|-------|---------------|
| Know what to focus on | Stage-specific recommendations in AI panel |
| See milestones for stage | MilestoneTracker component with checklist |
| Updated guidance on progression | Real-time stage detection + celebration modal |
| Stage transitions trigger congratulations | Confetti animation + modal with new guidance |
| Resources filtered by stage | Template library with stage filters |

## Acceptance Criteria Checklist

- [ ] System detects or allows manual selection of startup stage
- [ ] Dashboard shows stage-specific milestones and recommended actions  
- [ ] AI recommendations adapt based on stage progression
- [ ] Stage transitions trigger congratulations and updated guidance
- [ ] Resources and templates are filtered by relevance to current stage
- [ ] Progress tracking shows advancement toward next stage
