# Prompt 12 — CRM Module

> **Phase:** Module | **Priority:** P0 | **Overall:** 44%
> **No code — screen specs, data sources, agent workflows only**
> **Reference:** `100-dashboard-system.md` Section 2

---

## Purpose

Relationship intelligence hub. Track contacts, manage deal pipeline, and use AI to enrich and score every relationship.

## Goals

- Centralize all startup relationships (customers, partners, investors, advisors)
- AI-enrich contacts from LinkedIn and company websites
- Score leads and deals automatically
- Generate personalized outreach emails

## Outcomes

Founders maintain a living network map with AI-scored priorities instead of scattered spreadsheets.

---

## Screen 12a: Contacts View

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  CRM Intel      │
│                 │  Contacts                    [+ Add Contact] │                 │
│                 │                                              │  Total: 47      │
│                 │  🔍 Search contacts...                       │  Deals: 12      │
│                 │  [All] [Customer] [Partner] [Investor] [Adv] │  Pipeline: $2.1M│
│                 │                                              │                 │
│                 │  ┌──────────┐ ┌──────────┐ ┌──────────┐     │ ─────────────── │
│                 │  │ 👤       │ │ 👤       │ │ 👤       │     │                 │
│                 │  │ Maria C. │ │ James L. │ │ Aisha K. │     │  AI Actions     │
│                 │  │ Sequoia  │ │ Stripe   │ │ a16z     │     │                 │
│                 │  │ Partner  │ │ Eng Lead │ │ VP       │     │  [Enrich     ▸] │
│                 │  │ ●82      │ │ ●61      │ │ ●91      │     │  [Score Lead ▸] │
│                 │  │ 3d ago   │ │ 1w ago   │ │ Today    │     │  [Analyze   ▸]  │
│                 │  └──────────┘ └──────────┘ └──────────┘     │  [Gen Email ▸]  │
│                 │                                              │                 │
│                 │  Showing 6 of 47  [1] [2] [3] →             │  Suggestions    │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

Score badges: ●green (70+) ●yellow (40-69) ●red (<40)

---

## Screen 12b: Deal Pipeline

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Pipeline Stats │
│                 │  Deal Pipeline              [+ New Deal]     │                 │
│                 │  Total: $2.1M  |  Weighted: $840K            │  Win Rate: 28%  │
│                 │                                              │  Avg Cycle: 34d │
│                 │  Lead     Qualified  Proposal  Negotiation   │  Forecast: $840K│
│                 │  $320K    $580K      $410K     $290K         │                 │
│                 │                                              │ ─────────────── │
│                 │  ┌──────┐ ┌──────┐  ┌──────┐  ┌──────┐     │                 │
│                 │  │Acme  │ │Beta  │  │Gamma │  │Delta │     │  AI Actions     │
│                 │  │$80K  │ │$200K │  │$150K │  │$190K │     │                 │
│                 │  │15%   │ │45%   │  │60%   │  │75%   │     │  [Score Deal ▸] │
│                 │  │12d   │ │8d    │  │21d   │  │5d    │     │  [Analyze    ▸] │
│                 │  └──────┘ └──────┘  └──────┘  └──────┘     │  [Forecast  ▸]  │
│                 │                                              │                 │
│                 │  ← Drag cards between columns                │                 │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Screen 12c: Contact Detail Sheet (Slide-over)

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | Avatar, name, company, role, score badge | `contacts` row |
| AI Actions | Enrich, Score, Generate Email buttons | `crm-agent` |
| Details | Email, phone, LinkedIn, location | `contacts` fields |
| AI Enrichment | Focus areas, recent activity, fund info | `contacts.enrichment_data` |
| Communications | Timeline of emails, calls, meetings | `communications` table |
| AI Suggestions | Follow-up recommendations | `crm-agent` analysis |

---

## Data Sources

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `contacts` | Contact records | name, email, company, type, score, enrichment_data |
| `deals` | Sales pipeline | title, amount, stage, probability, contact_id |
| `communications` | Interaction log | type, direction, content, occurred_at |

---

## Agent Workflows

| Workflow | Trigger | Edge Function | Action | Output |
|----------|---------|---------------|--------|--------|
| Contact Enrichment | Click "Enrich" | `crm-agent` | `enrich_contact` | Full profile |
| Lead Scoring | Contact created/updated | `crm-agent` | `score_lead` | Score 0-100 |
| Deal Scoring | Deal created/stage change | `crm-agent` | `score_deal` | Probability 0-100% |
| Pipeline Analysis | Click "Analyze" | `crm-agent` | `analyze_pipeline` | Bottlenecks, forecast |
| Email Generation | Click "Generate Email" | `crm-agent` | `generate_email` | Personalized draft |
| Duplicate Detection | Contact save | `crm-agent` | `detect_duplicate` | Match list |

---

## User Stories

- As a founder, I paste a LinkedIn URL and AI fills in the contact's details automatically
- As a founder, I see a lead score on every contact card so I know who to prioritize
- As a founder, I view my deal pipeline as a kanban board with win probability
- As a founder, I click "Generate Email" and get a personalized outreach draft

---

## Acceptance Criteria

- [ ] Contact enrichment completes in under 10 seconds
- [ ] Lead scores display as colored badges (green 70+, yellow 40-69, red <40)
- [ ] Deal pipeline supports drag-and-drop between stages
- [ ] Email generation includes personalization from contact + startup data
- [ ] Duplicate detection warns before creating matching contacts

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `CRM.tsx` | `src/pages/CRM.tsx` | ✅ Exists |
| `ContactCard.tsx` | `src/components/crm/ContactCard.tsx` | ✅ Exists |
| `ContactDialog.tsx` | `src/components/crm/ContactDialog.tsx` | ✅ Exists |
| `ContactDetailSheet.tsx` | `src/components/crm/ContactDetailSheet.tsx` | ✅ Exists |
| `DealPipeline.tsx` | `src/components/crm/DealPipeline.tsx` | ✅ Exists |
| `DealDialog.tsx` | `src/components/crm/DealDialog.tsx` | ✅ Exists |
| `CRMAIPanel.tsx` | `src/components/crm/CRMAIPanel.tsx` | ✅ Exists |

---

## Missing Work

1. **Wire AI actions** — Connect AI panel buttons to `crm-agent` edge function
2. **Enrichment display** — Show AI-extracted data in contact detail
3. **Lead score badges** — Add visual score indicators to contact cards
4. **Email generation UI** — Modal for generated email preview/edit

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Create `useCRMAgent` hook with AI mutations | 2h | High |
| 2 | Wire "Enrich" button to `enrich_contact` action | 1h | High |
| 3 | Add score badges to ContactCard | 1h | Medium |
| 4 | Build email generation modal | 2h | Medium |
| 5 | Add pipeline analysis button | 1h | Low |
