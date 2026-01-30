---
task_number: "07"
title: "CRM & Contacts Dashboard"
category: "CRM"
subcategory: "CRM Contacts"
phase: 2
priority: "P1"
status: "Open"
percent_complete: 10
owner: "Frontend Developer"
---

# Lovable Prompt: CRM & Contacts Dashboard

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/app/contacts` and `/app/deals` - CRM pipeline management |
| **Features** | Contact list, deal pipeline, enrichment, activity tracking, investor matching |
| **Agents** | Contact Enricher (Gemini Pro), Deal Advisor (Claude), Investor Matcher (Gemini Flash) |
| **Use Cases** | Investor tracking, customer pipeline, partnership management |
| **Duration** | Ongoing usage |
| **Outputs** | Enriched contacts, deal stages, activity logs, outreach suggestions |

---

## Description

Build a lightweight CRM designed for startup founders, focused on investor relationships, customer pipeline, and partnership tracking. AI enriches contacts with public data, suggests next actions, and matches potential investors based on thesis fit.

---

## Purpose & Goals

**Purpose:** Give founders a simple way to track all important relationships without the complexity of enterprise CRMs.

**Goals:**
1. Manage contacts (investors, customers, partners, advisors)
2. Track deals through a Kanban pipeline
3. AI-enrich contacts with LinkedIn, Crunchbase data
4. Suggest next best action for each relationship
5. Match compatible investors based on startup profile

**Outcomes:**
- 100% of investor conversations tracked
- AI suggests 3 relevant investors per week
- Next action visible for every active deal
- Integration with email for activity logging

---

## Real World Examples

**Example 1: Maria - Investor Tracking**
> Maria adds "John Smith, Sequoia" as a contact. AI enriches with his investment thesis (FinTech, Seed-Series A), recent investments, and LinkedIn profile. It flags him as a "Strong Match" for her payment startup.

**Example 2: James - Deal Pipeline**
> James tracks his fundraise in the pipeline: Intro → Meeting → Due Diligence → Term Sheet → Closed. He drags "HealthTech Ventures" from Meeting to DD. AI suggests: "Prepare clinical validation data for DD."

**Example 3: Sarah - Customer Pipeline**
> Sarah tracks enterprise prospects. When a deal stalls in "Pilot" for 30+ days, AI suggests: "Send value realization email with ROI calculator" based on B2B SaaS playbook.

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Quick Filters** | All, Investors, Customers, Partners, Advisors |
| **Pipeline View** | Switch to deal pipeline |
| **Tags** | Filter by tags (Warm Intro, Cold, Hot Lead) |
| **Recent Activity** | Last 5 touchpoints |
| **AI Matches** | "3 investors match your profile" |
| **Import** | CSV import, LinkedIn sync |

### Main Panel: Work Area

| View | Content |
|------|---------|
| **Contact List** | Searchable table with name, type, company, last touch, status |
| **Contact Detail** | Full profile with enrichment, notes, activity timeline |
| **Deal Pipeline** | Kanban: Intro → Meeting → DD → Term Sheet → Closed/Lost |
| **Deal Card** | Contact name, amount, probability, next action, days in stage |
| **Activity Timeline** | Emails, meetings, notes in chronological order |
| **Quick Add** | Floating button for new contact/deal |

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **AI Enrichment** | Auto-filled profile from public data |
| **Thesis Fit Score** | "87% match: invests in FinTech Seed" |
| **Next Best Action** | "Send follow-up email this week" |
| **Relationship Insights** | "Last contact 14 days ago—re-engage" |
| **Similar Contacts** | "3 others at Sequoia in your network" |
| **Outreach Templates** | "Generate intro email" button |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `CRMDashboard` | Main container with view toggle |
| `ContactList` | Searchable, filterable table |
| `ContactDetail` | Full contact profile |
| `DealPipeline` | Kanban board for deals |
| `DealCard` | Draggable deal card |
| `ActivityTimeline` | Chronological activity log |
| `EnrichmentPanel` | Right panel AI data |
| `InvestorMatcher` | AI-suggested investors |
| `OutreachGenerator` | Email template generator |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `contact-enricher` | Contact add | name, email, company | enriched_profile |
| `investor-matcher` | Dashboard load | startup_profile, industry | matched_investors[] |
| `deal-advisor` | Deal stage change | deal, stage, history | next_action, suggestions |
| `outreach-generator` | Generate button | contact, context | email_template |

### Data Flow

```
Contact Add → Enrichment Request → AI Processing → Profile Update
      ↓              ↓                  ↓              ↓
  Form submit    contact-enricher    Gemini Pro    UPDATE contacts
      ↓              ↓                  ↓              ↓
  Optimistic     LinkedIn/CB API    Merge data    Realtime sync
  skeleton card
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `contacts` | `id`, `name`, `email`, `company`, `type`, `tags`, `enrichment_data`, `thesis_fit_score` | CRUD operations |
| `deals` | `id`, `contact_id`, `stage`, `amount`, `probability`, `expected_close`, `notes` | Pipeline updates |
| `activities` | `id`, `contact_id`, `type`, `content`, `created_at` | Activity logging |
| `ai_runs` | `action=enrich_contact`, `action=match_investors` | AI operations |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `enrich_contact` | contact-enricher | Gemini 3 Pro | None (external APIs) |
| `match_investors` | investor-matcher | Gemini 3 Flash | investor_expectations |
| `suggest_action` | deal-advisor | Claude Sonnet | fundraising_process |
| `generate_outreach` | outreach-generator | Claude Sonnet | terminology |

---

## AI Agent Behaviors

### Contact Enricher

- **Trigger:** New contact added with email or LinkedIn URL
- **Autonomy:** Background (runs automatically)
- **Behavior:** Fetches public data, merges into profile
- **Output:** `{ enriched: { title, company, bio, social_links, investment_thesis } }`

### Investor Matcher

- **Trigger:** Dashboard load, profile update
- **Autonomy:** Suggest (shows matches, user adds)
- **Behavior:** Compares startup profile to investor thesis
- **Output:** `{ matches: [{ name, firm, fit_score, reasoning, recent_investments }] }`

### Deal Advisor

- **Trigger:** Deal stage change, stale deal detection
- **Autonomy:** Suggest (shows advice, user acts)
- **Behavior:** Recommends next action based on stage and history
- **Output:** `{ next_action: string, templates: [], warnings: [] }`

---

## Deal Pipeline Stages

| Stage | Description | Typical Duration | Exit Criteria |
|-------|-------------|------------------|---------------|
| `intro` | Initial outreach or warm intro | 1-2 weeks | Meeting scheduled |
| `meeting` | First meeting completed | 1-2 weeks | Interest confirmed |
| `dd` | Due diligence process | 2-4 weeks | DD complete |
| `term_sheet` | Terms being negotiated | 1-2 weeks | Terms agreed |
| `closed_won` | Deal closed | - | Money in bank |
| `closed_lost` | Deal lost | - | Rejection or pass |

---

## Contact Types & Icons

| Type | Icon | Use Case |
|------|------|----------|
| `investor` | 💰 | VCs, angels, family offices |
| `customer` | 👤 | Current and potential customers |
| `partner` | 🤝 | Strategic partners, integrations |
| `advisor` | 🎓 | Advisors, mentors, board members |
| `press` | 📰 | Journalists, media contacts |
| `other` | 📋 | General contacts |

---

## Acceptance Criteria

- [ ] Contact list supports search, filter, sort
- [ ] AI enrichment runs within 30 seconds of adding contact
- [ ] Deal pipeline drag-and-drop updates stage
- [ ] Investor matcher shows 3+ relevant matches
- [ ] Activity timeline logs all touchpoints
- [ ] Next best action appears for each deal
- [ ] Email template generation uses startup context
- [ ] CSV import handles 100+ contacts
- [ ] Mobile responsive (list view on mobile)
- [ ] Supabase Realtime syncs across tabs

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `contacts` table | ✅ Ready | RLS policies in place |
| `deals` table | ✅ Ready | Pipeline stages defined |
| `activities` table | ✅ Ready | Activity logging |
| `contact-enricher` edge function | 🔄 Needed | To be created |
| `investor-matcher` edge function | 🔄 Needed | To be created |
| External enrichment API | 📋 Future | LinkedIn/Crunchbase |
