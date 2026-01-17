# Improved Main Dashboard — Plan, Wireframe & AI Prompts

**Purpose:** Enhanced main dashboard design with detailed wireframe, AI agent prompts, and implementation plan
**Focus:** Command center for growth and fundraising with intelligent AI assistance
**Status:** Improved Design Specification
**Last Updated:** January 17, 2026

---

## Quick Reference

| Section | Purpose | AI Agent | Data Source |
|---------|---------|----------|-------------|
| **Header** | Greeting, search, notifications | None | User profile, current date |
| **Quick Actions** | Fast navigation to key features | None | Static navigation |
| **Summary Metrics** | KPI overview (Decks, Investors, Tasks, Events) | None | Aggregated counts |
| **Startup Health** | Profile completeness & health score | ProfileValidator | startups table |
| **Deck Activity** | Pitch deck engagement trends | None | pitch_decks table |
| **Insights Tab** | AI-generated recommendations | RiskAnalyzer | Analysis results |
| **Tasks Tab** | Priority tasks for today | TaskGenerator | tasks table |
| **Activity Tab** | Recent actions timeline | None | activities table |
| **AI Strategic Review** | Opportunities & risks | RiskAnalyzer | Multiple sources |
| **Events & Calendar** | Upcoming events | None | events table |

---

## Improved Wireframe

### Full Dashboard Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                              MAIN DASHBOARD                                           │
├────────────────┬─────────────────────────────────────────────────┬───────────────────┤
│                │                                                 │                   │
│   LEFT PANEL   │              MAIN PANEL                         │   RIGHT PANEL     │
│    (240px)     │              (Flexible)                         │    (320px)        │
│                │                                                 │                   │
│  ┌──────────┐  │  ┌─────────────────────────────────────────┐   │  ┌─────────────┐  │
│  │ Logo     │  │  │ HEADER                                  │   │  │ AI STRATEGIC│  │
│  └──────────┘  │  │ ┌───────────────────┬─────────────────┐ │   │  │ REVIEW      │  │
│                │  │ │ SUNDAY, JAN 17    │ 🔍 Search...    │ │   │  │             │  │
│  Navigation:   │  │ │ Good morning,     │ 🔔 ⚙️           │ │   │  │ ┌─────────┐ │  │
│  ┌──────────┐  │  │ │ Founder           │                 │ │   │  │ │💡Opport-│ │  │
│  │🏠Dashboard│  │  │ └───────────────────┴─────────────────┘ │   │  │ │unity    │ │  │
│  │📊Pitch   │  │  └─────────────────────────────────────────┘   │  │ │Detected │ │  │
│  │  Decks   │  │                                                 │  │ └─────────┘ │  │
│  │📁Docs    │  │  ┌─────────────────────────────────────────┐   │  │ ┌─────────┐ │  │
│  │👥Investors│  │  │ QUICK ACTIONS (5 cards)                 │   │  │ │📈High   │ │  │
│  │📋Tasks   │  │  │ ┌────┐┌────┐┌────┐┌────┐┌────┐         │   │  │ │Engage-  │ │  │
│  │📂Data    │  │  │ │ ✨ ││ 📁 ││ 👥 ││ 🎬 ││ 📂 │         │   │  │ │ment     │ │  │
│  │  Room    │  │  │ │New ││Inv.││Find││Crea││Data│         │   │  │ └─────────┘ │  │
│  │📈Strategy│  │  │ │Deck││Docs││Cap.││Vid.││Room│         │   │  │             │  │
│  │📅Events  │  │  │ └────┘└────┘└────┘└────┘└────┘         │   │  │[Generate    │  │
│  └──────────┘  │  └─────────────────────────────────────────┘   │  │ Full Report]│  │
│                │                                                 │  └─────────────┘  │
│  ┌──────────┐  │  ┌─────────────────────────────────────────┐   │                   │
│  │ Progress │  │  │ SUMMARY METRICS (4 cards)               │   │  ┌─────────────┐  │
│  │ ████░░░  │  │  │ ┌────────┐┌────────┐┌────────┐┌───────┐│   │  │ UPCOMING    │  │
│  │   68%    │  │  │ │ 12     ││ 8      ││ 28     ││ 3     ││   │  │ EVENT       │  │
│  └──────────┘  │  │ │ Decks  ││Investors││ Tasks  ││Events ││   │  │ ┌─────────┐ │  │
│                │  │ │ +2 ↑   ││ +1 ↑   ││        ││       ││   │  │ │🎵 Music │ │  │
│  ┌──────────┐  │  │ └────────┘└────────┘└────────┘└───────┘│   │  │ │ Festival│ │  │
│  │ Settings │  │  └─────────────────────────────────────────┘   │  │ │ APR 20  │ │  │
│  └──────────┘  │                                                 │  │ └─────────┘ │  │
│                │  ┌──────────────────────┬──────────────────┐   │  │[View Details]│  │
│                │  │ STARTUP HEALTH       │ DECK ACTIVITY    │   │  └─────────────┘  │
│                │  │ ┌──────────────┐     │                  │   │                   │
│                │  │ │              │     │  📊              │   │  ┌─────────────┐  │
│                │  │ │    75%       │     │  ┌──┐            │   │  │ CALENDAR    │  │
│                │  │ │   SCORE      │     │  │  │ ┌──┐       │   │  │ January 2026│  │
│                │  │ │   ○○○○○      │     │  │  │ │  │┌──┐   │   │  │ ◄    ►     │  │
│                │  │ └──────────────┘     │  └──┘ └──┘└──┘   │   │  │ S M T W T F S│  │
│                │  │                      │  May Jun Jul Aug │   │  │     1 2 3 4 │  │
│                │  │ Brand Story: 80/100  │                  │   │  │ 5 6 7 8 9...│  │
│                │  │ ████████░░           │  ● Drafts        │   │  │        [17] │  │
│                │  │                      │  ● Visuals       │   │  │             │  │
│                │  │ Traction: 40/100     │                  │   │  │ ┌─────────┐ │  │
│                │  │ ████░░░░░░           │                  │   │  │ │10:00 AM │ │  │
│                │  │                      │                  │   │  │ │Team Sync│ │  │
│                │  │ ┌──────────────────┐ │                  │   │  │ └─────────┘ │  │
│                │  │ │✨ AI TIP: Add    │ │                  │   │  └─────────────┘  │
│                │  │ │'Monthly Active   │ │                  │   │                   │
│                │  │ │Users' to boost   │ │                  │   │                   │
│                │  │ │Traction score    │ │                  │   │                   │
│                │  │ └──────────────────┘ │                  │   │                   │
│                │  └──────────────────────┴──────────────────┘   │                   │
│                │                                                 │                   │
│                │  ┌─────────────────────────────────────────┐   │                   │
│                │  │ [Insights (3)] [Tasks (2)] [Activity (5)]│   │                   │
│                │  ├─────────────────────────────────────────┤   │                   │
│                │  │ ┌─────────────────────────────────────┐ │   │                   │
│                │  │ │ ✨ AI SUGGESTION                    │ │   │                   │
│                │  │ │ Update Your Traction Slide          │ │   │                   │
│                │  │ │ AI suggests adding your latest...   │ │   │                   │
│                │  │ └─────────────────────────────────────┘ │   │                   │
│                │  │ ┌─────────────────────────────────────┐ │   │                   │
│                │  │ │ 🎁 NEW PERK AVAILABLE               │ │   │                   │
│                │  │ │ 90% off HubSpot for Startups        │ │   │                   │
│                │  │ │ A new high-value perk has been...   │ │   │                   │
│                │  │ └─────────────────────────────────────┘ │   │                   │
│                │  │ ┌─────────────────────────────────────┐ │   │                   │
│                │  │ │ 📅 UPCOMING EVENT                   │ │   │                   │
│                │  │ │ Founder Networking Night            │ │   │                   │
│                │  │ │ Join our virtual networking...      │ │   │                   │
│                │  │ └─────────────────────────────────────┘ │   │                   │
│                │  └─────────────────────────────────────────┘   │                   │
│                │                                                 │                   │
└────────────────┴─────────────────────────────────────────────────┴───────────────────┘
```

---

## Section-by-Section Breakdown

### 1. Header Section

```
┌─────────────────────────────────────────────────────────────────┐
│  SUNDAY, JANUARY 17                    🔍 Search your startup...│
│  Good morning, Founder.                       🔔(3)    ⚙️      │
│  Your command center for growth and fundraising.                │
└─────────────────────────────────────────────────────────────────┘
```

**Content:**
- Current date (uppercase, formatted)
- Time-based greeting (morning/afternoon/evening)
- User's first name from profile
- Tagline for context
- Global search bar with autocomplete
- Notification bell with unread count
- Settings gear icon

**Data Sources:**
- Date: `new Date()` formatted
- Greeting: Time-based logic
- User name: `auth.user.name`
- Notifications: `notifications` table count

---

### 2. Quick Actions Row

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│    ✨    │ │    📁    │ │    👥    │ │    🎬    │ │    📂    │
│ New Deck │ │ Investor │ │  Find    │ │  Create  │ │   Data   │
│          │ │   Docs   │ │ Capital  │ │  Video   │ │   Room   │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Cards:**
| Card | Icon | Action | Navigation |
|------|------|--------|------------|
| New Deck | ✨ Sparkle | Create new pitch deck | `/pitch-decks/new` |
| Investor Docs | 📁 Briefcase | Access investor documents | `/documents?filter=investor` |
| Find Capital | 👥 People | Browse investor directory | `/investors` |
| Create Video | 🎬 Video | Generate pitch video | `/video-generator` |
| Data Room | 📂 Folder | Manage data room | `/data-room` |

**Design:**
- Equal-width cards (20% each)
- White background, subtle shadow
- Hover: lift + shadow increase
- Icon size: 24px
- Card height: 100px

---

### 3. Summary Metrics Row

```
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│      12        │ │       8        │ │      28        │ │       3        │
│    Decks       │ │   Investors    │ │     Tasks      │ │    Events      │
│    +2 ↑        │ │    +1 ↑        │ │                │ │                │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

**Metrics:**
| Metric | Data Source | Change Indicator | Click Action |
|--------|-------------|------------------|--------------|
| Decks | `COUNT(pitch_decks)` | vs. last week | Go to `/pitch-decks` |
| Investors | `COUNT(contacts WHERE type='investor')` | vs. last week | Go to `/investors` |
| Tasks | `COUNT(tasks WHERE status!='completed')` | None | Go to `/tasks` |
| Events | `COUNT(events WHERE start_date > NOW())` | None | Go to `/events` |

**Design:**
- Large number (32px, bold)
- Label below (14px, muted)
- Change indicator (green = positive, red = negative)
- Hover: show tooltip with breakdown
- Click: navigate to detail page

---

### 4. Startup Health Section

```
┌─────────────────────────────────────────┐
│  Startup Health            View Report → │
├─────────────────────────────────────────┤
│         ╭───────────────╮               │
│        ╱                 ╲              │
│       │       75%        │              │
│       │      SCORE       │              │
│        ╲                 ╱              │
│         ╰───────────────╯               │
│                                         │
│  Brand Story                    80/100  │
│  ████████████████░░░░                   │
│                                         │
│  Traction                       40/100  │
│  ████████░░░░░░░░░░░░                   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✨ AI TIP                       │   │
│  │ Add 'Monthly Active Users' to   │   │
│  │ boost your Traction score by 15 │   │
│  │ points.                         │   │
│  │                    [Add Now →]  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Components:**
1. **Circular Progress Ring**
   - Overall health score (0-100)
   - Animated on load
   - Color: sage gradient

2. **Progress Bars**
   - Brand Story score (0-100)
   - Traction score (0-100)
   - Shows completion percentage

3. **AI Tip Card**
   - Generated by ProfileValidator agent
   - Specific, actionable suggestion
   - "Add Now" button triggers action

**AI Prompt for Health Tips:**
```
Analyze the startup profile and identify the single most impactful improvement the founder can make to increase their profile score.

INPUT:
- Profile completion by section
- Missing fields
- Current scores (brand_story_score, traction_score)

OUTPUT (JSON):
{
  "tip": "Add 'Monthly Active Users' metric",
  "impact": "Boost Traction score by 15 points",
  "action": "Navigate to profile traction section",
  "priority": "high"
}
```

---

### 5. Deck Activity Chart

```
┌─────────────────────────────────────────┐
│  Deck Activity      ● Drafts ● Visuals  │
├─────────────────────────────────────────┤
│                                         │
│    10 ┤                                 │
│       │           ┌───┐                 │
│     8 ┤           │   │                 │
│       │     ┌───┐ │   │                 │
│     6 ┤     │   │ │   │ ┌───┐           │
│       │     │   │ │   │ │   │           │
│     4 ┤ ┌───┤   │ │   │ │   │           │
│       │ │   │   │ │   │ │   │           │
│     2 ┤ │   │   │ │   │ │   │           │
│       │ │   │   │ │   │ │   │           │
│     0 └─┴───┴───┴─┴───┴─┴───┴───────────│
│         May   Jun   Jul   Aug           │
└─────────────────────────────────────────┘
```

**Data:**
- Monthly aggregation of pitch deck activity
- Two series: Drafts created, Visuals added
- Last 4 months of data

**Interactivity:**
- Hover: Show exact values
- Click bar: Filter to that month
- Empty state: "Create your first deck to see activity"

---

### 6. Insights/Tasks/Activity Tabs

```
┌─────────────────────────────────────────────────────────────────┐
│  [Insights (3)]    [Tasks (2)]    [Activity (5)]                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  INSIGHTS TAB (Active):                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ✨ AI SUGGESTION                                        │   │
│  │ Update Your Traction Slide                              │   │
│  │ AI suggests adding your latest user growth metrics      │   │
│  │ to improve credibility with investors.                  │   │
│  │                                           [View →]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🎁 NEW PERK AVAILABLE                                   │   │
│  │ 90% off HubSpot for Startups                            │   │
│  │ A new high-value perk has been added to the portal.     │   │
│  │                                           [Claim →]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  TASKS TAB:                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☐ Complete investor deck                    🔴 URGENT   │   │
│  │   Due: Today • Project: Series A Raise                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ☐ Review financial projections              🟡 HIGH     │   │
│  │   Due: Tomorrow • Project: Series A Raise               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ACTIVITY TAB:                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🔵 You updated the Problem slide           2 hours ago  │   │
│  │ 🟢 AI generated 3 new tasks                4 hours ago  │   │
│  │ 🔵 Investor John Smith viewed deck         Yesterday    │   │
│  │ 🔵 You completed "Update financials"       Yesterday    │   │
│  │ 🟢 New perk available: HubSpot             2 days ago   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Tab Content:**

| Tab | Content | Badge Count | Data Source |
|-----|---------|-------------|-------------|
| Insights | AI suggestions, perks, events | Unread count | `ai_runs`, external API |
| Tasks | Priority tasks for today | Pending count | `tasks WHERE priority IN ('urgent','high')` |
| Activity | Recent actions timeline | New count | `activities ORDER BY created_at DESC LIMIT 5` |

---

### 7. Right Panel: AI Strategic Review

```
┌─────────────────────────────────────┐
│  ✨ AI Strategic Review             │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 💡 Opportunity Detected     │   │
│  │                             │   │
│  │ 25% growth in 'AI Tools'    │   │
│  │ interest. Update your       │   │
│  │ Market slide data.          │   │
│  │                  [Update →] │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📈 High Engagement          │   │
│  │                             │   │
│  │ Your 'Solution' slide has   │   │
│  │ 40% higher retention than   │   │
│  │ average. Add a CTA.         │   │
│  │                  [Edit →]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Risk Alert               │   │
│  │                             │   │
│  │ 3 tasks overdue. Your       │   │
│  │ fundraising timeline may    │   │
│  │ be at risk.                 │   │
│  │                  [View →]   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    [Generate Full Report]   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**AI Prompt for Strategic Review:**
```
Analyze the startup's current state and generate strategic insights.

INPUT:
- Startup profile data
- Pitch deck analytics (views, engagement per slide)
- Task completion rates
- Pipeline status (deals, investors)
- Market trends (from Google Search grounding)

OUTPUT (JSON):
{
  "insights": [
    {
      "type": "opportunity",
      "title": "Opportunity Detected",
      "description": "25% growth in 'AI Tools' interest...",
      "action": "Update Market slide",
      "priority": "high"
    },
    {
      "type": "engagement",
      "title": "High Engagement",
      "description": "Your 'Solution' slide has 40% higher...",
      "action": "Add CTA to slide",
      "priority": "medium"
    },
    {
      "type": "risk",
      "title": "Risk Alert",
      "description": "3 tasks overdue...",
      "action": "Review tasks",
      "priority": "urgent"
    }
  ],
  "overall_status": "on_track",
  "confidence": 0.85
}
```

---

### 8. Right Panel: Events & Calendar

```
┌─────────────────────────────────────┐
│  UPCOMING EVENT                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 🏷️ NETWORKING               │   │
│  │ ┌───────────────────────┐   │   │
│  │ │                       │   │   │
│  │ │   [Event Image]       │   │   │
│  │ │                       │   │   │
│  │ │               APR 20  │   │   │
│  │ └───────────────────────┘   │   │
│  │                             │   │
│  │ Rhythm & Beats Festival     │   │
│  │ 📍 Sunset Park, LA, CA      │   │
│  │                             │   │
│  │     [View Details]          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  January 2026           ◄    ►      │
├─────────────────────────────────────┤
│  Su  Mo  Tu  We  Th  Fr  Sa         │
│                   1   2   3   4     │
│   5   6   7   8   9  10  11         │
│  12  13  14  15  16 [17] 18         │
│  19  20• 21  22  23  24  25         │
│  26  27  28  29  30  31             │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 10:00 AM                    │   │
│  │ Team Sync                   │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Calendar Features:**
- Current month view
- Today highlighted with circle
- Event indicators (dots) on dates
- Navigation arrows for prev/next month
- Upcoming event below calendar
- Click date to filter activities

---

## AI Agent Prompts

### 1. RiskAnalyzer Prompt (Dashboard Load)

```
SYSTEM:
You are RiskAnalyzer, an AI agent that identifies risks, opportunities,
and strategic insights for startup founders.

INPUT:
{
  "startup": {
    "name": "{{startup_name}}",
    "industry": "{{industry}}",
    "stage": "{{funding_stage}}",
    "mrr": {{mrr}},
    "users": {{user_count}},
    "team_size": {{team_size}}
  },
  "deck_analytics": {
    "total_views": {{total_views}},
    "avg_time_per_slide": {{avg_time}},
    "drop_off_slide": "{{drop_off_slide}}",
    "best_performing_slide": "{{best_slide}}"
  },
  "tasks": {
    "total": {{total_tasks}},
    "completed": {{completed_tasks}},
    "overdue": {{overdue_tasks}}
  },
  "pipeline": {
    "total_deals": {{total_deals}},
    "pipeline_value": {{pipeline_value}},
    "avg_deal_score": {{avg_score}}
  }
}

INSTRUCTIONS:
1. Analyze the startup's current state
2. Identify 2-3 strategic insights (opportunities, risks, recommendations)
3. Prioritize by urgency and impact
4. Provide specific, actionable suggestions
5. Include confidence level for each insight

OUTPUT FORMAT:
{
  "insights": [
    {
      "type": "opportunity|risk|recommendation",
      "title": "Short title (max 5 words)",
      "description": "Explanation (max 100 chars)",
      "action": "Specific action to take",
      "action_url": "/path/to/relevant/page",
      "priority": "urgent|high|medium|low",
      "confidence": 0.0-1.0
    }
  ],
  "overall_health": "healthy|at_risk|needs_attention",
  "summary": "One sentence summary"
}
```

### 2. ProfileValidator Prompt (Health Score)

```
SYSTEM:
You are ProfileValidator, an AI agent that validates startup profile
completeness and provides actionable tips for improvement.

INPUT:
{
  "profile_sections": {
    "overview": {
      "fields": ["name", "tagline", "description", "website", "logo"],
      "completed": ["name", "tagline", "description"],
      "missing": ["website", "logo"]
    },
    "business": {
      "fields": ["industry", "model", "segments", "differentiator"],
      "completed": ["industry", "model"],
      "missing": ["segments", "differentiator"]
    },
    "traction": {
      "fields": ["mrr", "users", "growth_rate", "milestones"],
      "completed": ["mrr"],
      "missing": ["users", "growth_rate", "milestones"]
    },
    "team": {
      "fields": ["founders", "team_size", "key_hires"],
      "completed": ["founders", "team_size"],
      "missing": ["key_hires"]
    },
    "fundraising": {
      "fields": ["stage", "goal", "use_of_funds", "timeline"],
      "completed": ["stage", "goal"],
      "missing": ["use_of_funds", "timeline"]
    }
  },
  "current_scores": {
    "brand_story": {{brand_story_score}},
    "traction": {{traction_score}},
    "overall": {{overall_score}}
  }
}

INSTRUCTIONS:
1. Calculate completion percentage per section
2. Identify the single highest-impact missing field
3. Estimate score improvement if field is added
4. Provide specific, actionable tip

OUTPUT FORMAT:
{
  "scores": {
    "overall": 75,
    "brand_story": 80,
    "traction": 40
  },
  "completion_by_section": {
    "overview": 60,
    "business": 50,
    "traction": 25,
    "team": 67,
    "fundraising": 50
  },
  "tip": {
    "field": "users",
    "section": "traction",
    "message": "Add 'Monthly Active Users' to boost your Traction score",
    "impact_points": 15,
    "action_url": "/company-profile#traction"
  }
}
```

### 3. TaskGenerator Prompt (Next Best Action)

```
SYSTEM:
You are TaskGenerator, an AI agent that identifies and suggests
the most important next action for the founder.

INPUT:
{
  "startup_context": {
    "stage": "{{funding_stage}}",
    "is_raising": {{is_raising}},
    "days_since_last_deck_update": {{days}},
    "profile_completion": {{completion_pct}}
  },
  "current_tasks": [
    {
      "title": "{{task_title}}",
      "priority": "{{priority}}",
      "status": "{{status}}",
      "due_date": "{{due_date}}"
    }
  ],
  "recent_activity": [
    {
      "type": "{{activity_type}}",
      "description": "{{description}}",
      "timestamp": "{{timestamp}}"
    }
  ],
  "deck_analytics": {
    "last_view": "{{last_view_date}}",
    "total_views_this_week": {{views}}
  }
}

INSTRUCTIONS:
1. Analyze current state and pending tasks
2. Identify the single most impactful next action
3. Consider urgency, impact, and effort
4. Provide clear, specific action

OUTPUT FORMAT:
{
  "next_best_action": {
    "title": "Update your pitch deck financials",
    "reason": "Your deck was last updated 14 days ago and investors viewed it 5 times this week",
    "impact": "high",
    "effort": "medium",
    "action_url": "/pitch-decks/{{deck_id}}/edit",
    "estimated_time": "30 minutes"
  },
  "alternative_actions": [
    {
      "title": "Complete overdue tasks",
      "reason": "3 tasks are overdue"
    }
  ]
}
```

---

## Implementation Checklist

### Phase 1: Core Structure

- [ ] Header component with date, greeting, search
- [ ] Quick Actions row (5 cards)
- [ ] Summary Metrics row (4 cards)
- [ ] Left panel navigation updates
- [ ] Basic responsive layout

### Phase 2: Health & Analytics

- [ ] Startup Health circular progress
- [ ] Progress bars for sub-scores
- [ ] AI Tip card with ProfileValidator
- [ ] Deck Activity chart
- [ ] Chart interactivity (hover, click)

### Phase 3: Insights System

- [ ] Tabbed interface (Insights/Tasks/Activity)
- [ ] Insight cards with badges
- [ ] Task list with checkboxes
- [ ] Activity timeline
- [ ] Real-time badge counts

### Phase 4: Right Panel Intelligence

- [ ] AI Strategic Review section
- [ ] RiskAnalyzer integration
- [ ] Event card with image
- [ ] Calendar widget
- [ ] "Generate Full Report" action

### Phase 5: Polish

- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Mobile responsive
- [ ] Animations and transitions
- [ ] Performance optimization

---

## Data Hooks Required

| Hook | Purpose | Returns |
|------|---------|---------|
| `useDashboardMetrics()` | Summary metric counts | `{ decks, investors, tasks, events, changes }` |
| `useStartupHealth()` | Health scores and tips | `{ overall, brandStory, traction, tip }` |
| `useDeckActivity()` | Chart data | `{ monthlyData: [...] }` |
| `useInsights()` | AI-generated insights | `{ insights: [...], loading }` |
| `usePriorityTasks()` | Top priority tasks | `{ tasks: [...] }` |
| `useRecentActivity()` | Activity timeline | `{ activities: [...] }` |
| `useStrategicReview()` | Right panel AI insights | `{ insights, overallHealth }` |
| `useUpcomingEvents()` | Events and calendar | `{ events, calendar }` |

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Dashboard load time | < 1.5s | Performance monitoring |
| AI insight generation | < 3s | Edge function timing |
| User engagement | > 5 min avg session | Analytics |
| Task completion rate | > 30% from dashboard | Task tracking |
| Quick action clicks | > 3 per session | Click tracking |
| Return visits | > 60% daily active | User analytics |

---

**Created:** January 17, 2026
**Based on:** 30-main-dash.md with improvements
**Status:** Improved Design with AI Prompts
**Next:** Component implementation
