# Sponsor Wizard Screen

**Route:** `/app/events/:id/sponsors/new`  
**Screen Type:** Wizard  
**Classification:** 2-Panel Wizard

---

## Description

AI-powered sponsor discovery and outreach wizard that finds sponsors using Gemini Search, scores matches, and generates personalized outreach emails via Claude.

---

## Purpose & Goals

**Purpose:** Find sponsors using AI-powered search grounding, score matches based on event fit, and generate personalized outreach emails automatically.

**Goals:**
- Reduce sponsor discovery time (AI-powered search)
- Match scoring based on event fit (industry, tier, location)
- One-click outreach email generation
- Track outreach status (sent, interested, confirmed)
- Integrate with CRM contacts

---

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         FIND SPONSORS                                 ✕      │
│──────────────────────────────────────────────────────────────────────────────│
│                                                                              │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────┐ │
│  │ SPONSOR SCOUT 🔍                       │  │ AI RECOMMENDATIONS         │ │
│  │                                        │  │                            │ │
│  │ Industry Focus                         │  │ Based on your event:       │ │
│  │ ┌──────────────────────────────────┐  │  │ "Demo Day for B2B SaaS"    │ │
│  │ │ ☑ SaaS  ☑ FinTech  ☐ HealthTech │  │  │                            │ │
│  │ └──────────────────────────────────┘  │  │ TOP MATCHES (Gemini Search)│ │
│  │                                        │  │ ┌────────────────────────┐ │ │
│  │ Sponsorship Tier                       │  │ │ 🏢 TechCorp Ventures   │ │ │
│  │ ○ Platinum ($5k+)  ● Gold ($2-5k)     │  │ │ Match: 94% │ SaaS focus │ │ │
│  │ ○ Silver ($500-2k) ○ In-kind          │  │ │ Budget: $2-5k typical  │ │ │
│  │                                        │  │ │ [View] [Draft Outreach]│ │ │
│  │ Location Preference                    │  │ └────────────────────────┘ │ │
│  │ ┌──────────────────────────────────┐  │  │ ┌────────────────────────┐ │ │
│  │ │ 📍 San Francisco Bay Area        │  │  │ │ 🏢 StartupBank         │ │ │
│  │ └──────────────────────────────────┘  │  │ │ Match: 89% │ FinTech   │ │ │
│  │                                        │  │ │ Budget: $1-3k typical  │ │ │
│  │ [🔍 Search Sponsors]                   │  │ │ [View] [Draft Outreach]│ │ │
│  │                                        │  │ └────────────────────────┘ │ │
│  │ ─────────────────────────────────────  │  │ ┌────────────────────────┐ │ │
│  │                                        │  │ │ 🏢 CloudScale Inc      │ │ │
│  │ SELECTED SPONSORS (2)                  │  │ │ Match: 85% │ Infra     │ │ │
│  │ ┌─────────────┐ ┌─────────────┐       │  │ │ Budget: $500-2k typical│ │ │
│  │ │ TechCorp ✓  │ │ StartupBank │       │  │ │ [View] [Draft Outreach]│ │ │
│  │ │ Outreach    │ │ ✓ Interested│       │  │ └────────────────────────┘ │ │
│  │ │ sent        │ │             │       │  │                            │ │
│  │ └─────────────┘ └─────────────┘       │  │ [Search more...]           │ │
│  │                                        │  │                            │ │
│  └────────────────────────────────────────┘  └────────────────────────────┘ │
│                                                                              │
│                    [Back]  [Generate All Outreach Emails]  [Done]            │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 3-Panel Layout Logic

**Left Panel (Flexible) = Work:**
- Sponsor Scout form: Industry focus, sponsorship tier, location preference
- [🔍 Search Sponsors] button
- Selected sponsors list (with status: outreach sent, interested, confirmed)

**Right Panel (320px) = Intelligence:**
- AI Recommendations: Top matches from Gemini Search
- Sponsor cards: Name, match score, budget range, [View] [Draft Outreach] buttons
- [Search more...] button

---

## Content & Data

**Supabase Tables:**
- `event_sponsors` — Selected sponsors (created when user adds sponsor)
- `contacts` — Sponsor contacts (if sponsor added as contact)
- `event_messages` — Outreach emails sent (if emails generated)
- `startup_events` — Event context (for match scoring)

**Sponsor Discovery:**
- Industry focus: Filter by industry (SaaS, FinTech, HealthTech, etc.)
- Sponsorship tier: Filter by budget range (Platinum $5k+, Gold $2-5k, Silver $500-2k, In-kind)
- Location preference: Filter by location (San Francisco Bay Area, etc.)

**Selected Sponsors:**
- Status tracking: outreach_sent, interested, confirmed
- Contact info: Name, email, company, tier, amount

---

## Features

- Industry/tier/location filters
- AI-powered sponsor discovery (Gemini Search)
- Match scoring based on event fit
- Sponsor cards with match score and budget range
- One-click outreach email generation
- Track outreach status (sent, interested, confirmed)
- Generate all outreach emails at once
- Add sponsors to CRM contacts

---

## AI Agents & Interactions

**Sponsor Scout Agent:**
- **Model:** `claude-sonnet-4-5` (orchestration) + `gemini-3-pro-preview` (search)
- **Purpose:** Find sponsors, score matches, draft outreach emails
- **Tools:** Gemini Search (web search grounding), Email templates
- **Interaction:** Search on button click, displays recommendations in right panel
- **Edge Functions:** `sponsor-search` (discovery), `sponsor-outreach` (email drafting)
- **Input:** `{ event_id, criteria: { industry, tier, location } }`
- **Reads from:** `startup_events` (for event context)
- **Returns:** `{ sponsors: [{ name, match_score, budget_range, website, email }] }`

**Agent Interaction Flow:**
1. User sets criteria (industry, tier, location)
2. User clicks [🔍 Search Sponsors]
3. Sponsor Scout Agent builds search query from criteria + event context
4. Gemini Search finds sponsors via web search grounding
5. Claude scores matches based on event fit (industry, tier, location, event type)
6. Displays top matches in right panel with match scores
7. User selects sponsors → Adds to selected list
8. User clicks [Generate All Outreach Emails] → Claude drafts personalized emails
9. Emails saved to `event_messages` table

---

## Modules

- **SponsorScoutForm** — Criteria form (industry, tier, location)
- **SponsorRecommendations** — Right panel AI recommendations
- **SponsorCard** — Individual sponsor card with match score
- **SelectedSponsors** — Selected sponsors list with status
- **OutreachGenerator** — Generate outreach emails component

---

## Workflows

**Sponsor Discovery:**
1. User sets criteria (industry focus, sponsorship tier, location)
2. User clicks [🔍 Search Sponsors]
3. Sponsor Scout Agent builds search query from criteria + event context
4. Gemini Search finds sponsors via web search grounding
5. Claude scores matches based on event fit
6. Display top matches in right panel with match scores
7. User clicks [View] to see sponsor details
8. User clicks [Draft Outreach] to generate email
9. User clicks sponsor card to add to selected list

**Outreach Generation:**
1. User selects multiple sponsors
2. User clicks [Generate All Outreach Emails]
3. Sponsor Scout Agent drafts personalized emails for each sponsor
4. Emails saved to `event_messages` table
5. Sponsors added to `event_sponsors` table with status "outreach_sent"
6. Emails ready to send via email API

**Add Sponsor:**
1. User clicks sponsor card in recommendations
2. Add sponsor to `event_sponsors` table
3. If contact info available, add to `contacts` table
4. Update selected sponsors list with status

---

## Automations

- **Match scoring:** Auto-score matches based on event fit
- **Email generation:** Auto-generate personalized emails based on sponsor profile
- **Status tracking:** Auto-update sponsor status on email sent/response

---

## Supabase

**Writes:**
- INSERT into `event_sponsors` — Add selected sponsors
- INSERT into `contacts` — Add sponsor contacts (if not exists)
- INSERT into `event_messages` — Save generated outreach emails

**Queries:**
- Event context: `SELECT * FROM startup_events WHERE id = $1` (for match scoring)

**RLS:**
- Filtered by `startup_in_org(startup_id)`

---

## Edge Functions

**`sponsor-search`:**
- **Model:** `gemini-3-pro-preview` (with search grounding + high thinking)
- **Tool:** Gemini Search (web search grounding)
- **Input:** `{ event_id, criteria: { industries: [], tier, location, budget_range } }`
- **Logic:**
  1. Build search query from criteria + event context
  2. Gemini Search finds sponsors via web search grounding
  3. Score matches based on event fit
- **Returns:** `{ sponsors: [{ name, match_score, budget_range, website, email, description, relevance_reasoning }] }`

**`sponsor-outreach`:**
- **Model:** `claude-sonnet-4-5`
- **Tool:** Email templates, Content generation
- **Input:** `{ event_id, sponsor_id }`
- **Logic:** Generate personalized outreach email based on sponsor profile + event details
- **Returns:** `{ email_subject: "", email_body: "", email_to: "" }`

---

## Claude SDK & Gemini 3

**Claude SDK:**
- `claude-sonnet-4-5` — Sponsor Scout Agent (orchestration, match scoring, email generation)

**Gemini 3 Tools:**
- `gemini-3-pro-preview` — Sponsor discovery (Google Search tool for web search grounding)

**Agent Workflows:**
1. Sponsor Scout Agent (Claude) → Builds search query → Gemini Search finds sponsors
2. Sponsor Scout Agent (Claude) → Scores matches → Displays recommendations
3. Sponsor Scout Agent (Claude) → Drafts emails → Generates personalized outreach

**Logic:**
- Claude for orchestration, match scoring, and email generation
- Gemini for web search grounding (finding sponsors)
- Sponsor Scout Agent coordinates both Claude and Gemini
- Match scoring based on industry, tier, location, event type fit
