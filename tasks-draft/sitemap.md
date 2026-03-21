# StartupAI — Sitemap & Screen Inventory

> **Updated:** 2026-02-08 | **Version:** 1.0
> **Source:** `src/App.tsx` routes, `src/pages/`, `src/components/layout/DashboardLayout.tsx`
> **Total:** 41 pages | 35 protected | 6 public | 3 wizards | 4 validator screens

---

## Quick Stats

| Metric | Count |
|--------|:-----:|
| Total pages (.tsx) | 41 |
| Protected routes | 35 |
| Public routes | 6 (+auth) |
| Dashboards | 8 |
| Canvases | 3 |
| Wizards (multi-step) | 3 |
| Chat interfaces | 2 |
| Reports/Viewers | 2 |
| Progress screens | 3 |
| Forms | 4 |
| Lists | 7 |
| Detail views | 4 |

---

## 1. Public Routes (No Auth)

| Route | Page Component | Type | Purpose |
|-------|---------------|------|---------|
| `/` | Index | Landing | Homepage / marketing |
| `/how-it-works` | HowItWorks | Info | Product explainer |
| `/features` | Features | Info | Feature showcase |
| `/blog` | BlogIndex | List | Blog index |
| `/blog/:slug` | BlogPost | Detail | Individual blog post |
| `/events` | PublicEventsDirectory | List | Public event directory |
| `/events/:eventId` | PublicEventDetail | Detail | Public event detail |
| `/login` | Login | Auth | OAuth login (Google, LinkedIn) |
| `/auth/callback` | AuthCallback | Auth | OAuth redirect handler |

---

## 2. Validator Screens (4 screens, 1 user journey)

### Validator User Journey

```
/validator (Dashboard)
    ├── "Validate with Chat" ──→ /validate (Chat)
    │                                │
    │                                ▼ (chat complete)
    │                           /validator/run/:sessionId (Progress)
    │                                │
    │                                ▼ (pipeline done)
    │                           /validator/report/:reportId (Report)
    │
    ├── "Quick Validate" ──────→ /validator/run/:sessionId (Progress)
    │                                │
    │                                ▼
    │                           /validator/report/:reportId (Report)
    │
    └── "Deep Validate" ───────→ /validator/run/:sessionId (Progress)
                                     │
                                     ▼
                                /validator/report/:reportId (Report)
```

### Validator Route Table

| # | Route | Page Component | Type | Purpose |
|---|-------|---------------|------|---------|
| V-1 | `/validator` | Validator | Dashboard | Mode selector (Quick ~30s / Deep ~60s / Investor Lens ~45s), validation history, industry benchmark sidebar, score + verdict card |
| V-2 | `/validate` | ValidateIdea | Chat (3-panel) | Left: ExtractionPanel (field coverage). Center: ValidatorChat (AI coach conversation, suggestion chips). Right: ContextPanel (validation readiness %) |
| V-3 | `/validator/run/:sessionId` | ValidatorProgress | Progress | Real-time pipeline status — 7 AI agent steps with live status indicators |
| V-4 | `/validator/report/:reportId` | ValidatorReport | Report | 14-section report: Overview tab (summary cards, score, verdict) + Full Report tab (section nav sidebar, paginated sections, PDF export, regenerate) |

### Validator Components

| Component | Location | Used In |
|-----------|----------|---------|
| ValidatorChat | `src/components/validator/chat/ValidatorChat.tsx` | V-2 |
| ValidatorChatInput | `src/components/validator/chat/ValidatorChatInput.tsx` | V-2 |
| ContextPanel | `src/components/validator/chat/ContextPanel.tsx` | V-2 |
| ExtractionPanel | `src/components/validator/chat/ExtractionPanel.tsx` | V-2 |
| ReportSection | `src/components/validator/ReportSection.tsx` | V-4 |
| ScoreCircle | `src/components/validator/ScoreCircle.tsx` | V-1, V-4 |

### Validator Screenshots

| # | File | Screen |
|---|------|--------|
| 1 | `StartupAI-…02_40_AM.png` | V-1: Validation Dashboard (mode selector, score 0, NO_GO verdict) |
| 2 | `1-…02_41_AM.png` | V-2: Idea Validator Chat (3-panel, 50% readiness) |
| 3 | `2-…02_40_AM.png` | V-4: Report Overview (score, summary, market size, dimensions) |
| 4 | `3-…02_41_AM.png` | V-4: Full Report (section nav, generating state) |
| 5 | `4-…02_41_AM.png` | V-4: Full Report complete (all 14 sections scrolled) |

> **Missing screenshot:** V-3 ValidatorProgress (pipeline progress screen)

---

## 3. Wizards (Multi-Step Flows)

### 3a. Onboarding Wizard (4 steps)

| Route | Page Component | Steps |
|-------|---------------|-------|
| `/onboarding` | OnboardingWizard | 4 steps |
| `/onboarding/complete` | OnboardingComplete | Success screen |

| Step | Name | What |
|------|------|------|
| 1 | Context & Enrichment | Links, basic info input |
| 2 | AI Analysis | Gemini insights review |
| 3 | Smart Interviewer | Dynamic Q&A (industry-specific) |
| 4 | Review & Score | Profile finalization |

Features: interview persistence, resume capability, auto-save, AI analysis panel.

### 3b. Pitch Deck Wizard (4 steps)

| Route | Page Component | Type |
|-------|---------------|------|
| `/app/pitch-decks` | PitchDecksDashboard | Dashboard/List |
| `/app/pitch-deck/new` | PitchDeckWizard | Wizard |
| `/app/pitch-deck/:deckId` | PitchDeckWizard | Wizard (edit) |
| `/app/pitch-deck/:deckId/edit` | PitchDeckEditor | Editor |
| `/app/pitch-deck/:deckId/generating` | PitchDeckGenerating | Progress |

| Step | Name | What |
|------|------|------|
| 1 | Deck Basics & Content | Title, audience, style |
| 2 | Interview Questions | AI-generated questions |
| 3 | Interview Answers | Founder responses |
| 4 | Generation & Review | AI generates slides |

### 3c. Event Wizard

| Route | Page Component | Type |
|-------|---------------|------|
| `/app/events` | Events | List |
| `/app/events/:id` | EventDetail | Detail |
| `/app/events/new` | EventWizard | Wizard |

---

## 4. Canvases (Strategic Editors)

| Route | Page Component | Type | AI Agent | Features |
|-------|---------------|------|----------|----------|
| `/lean-canvas` | LeanCanvas | Canvas Editor | `lean-canvas-agent` + `canvas-coach` | 6 questions, chips, coach chat sidebar, suggestion cards, score badge |
| `/opportunity-canvas` | OpportunityCanvas | Canvas Editor | `opportunity-canvas` | 5-dimension scoring (0-100), radial SVG, pursue/explore/defer/reject badges, barriers/enablers |
| `/market-research` | MarketResearch | Research Dashboard | `market-research` | TAM/SAM/SOM cards, TrendList, CompetitorGrid, sources |

---

## 5. Dashboards

| Route | Page Component | Purpose | Key Components |
|-------|---------------|---------|----------------|
| `/dashboard` | Dashboard | Main hub | WelcomeBanner, TodaysFocusCard, Day1PlanCard, GuidedOverlay, strategy progress |
| `/validator` | Validator | Validation hub | 3 modes, score circle, verdict, history, benchmark |
| `/projects` | Projects | Project portfolio | Project list, detail view |
| `/crm` | CRM | Contact management | Contact list, deal pipeline |
| `/analytics` | Analytics | AARRR metrics | Basic analytics (partial) |
| `/investors` | Investors | Investor CRM | Investor list, matching |
| `/experiments` | Experiments | Growth experiments | ExperimentCard, CreateDialog, AI generate, filters |
| `/app/pitch-decks` | PitchDecksDashboard | Pitch deck list | Deck list, new deck CTA |

---

## 6. Forms & Profiles

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `/user-profile` | UserProfile | User account settings |
| `/company-profile` | CompanyProfile | Startup profile (URL import, completeness score, AI suggestions) |
| `/settings` | Settings | App settings |
| `/login` | Login | OAuth login |

---

## 7. Lists & Detail Views

| Route | Page Component | Type |
|-------|---------------|------|
| `/tasks` | Tasks | Task list |
| `/documents` | Documents | Document list |
| `/app/events` | Events | Event list |
| `/app/events/:id` | EventDetail | Event detail |
| `/projects/:projectId` | ProjectDetail | Project detail |
| `/blog` | BlogIndex | Blog list |
| `/blog/:slug` | BlogPost | Blog post |

---

## 8. Chat & AI

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `/ai-chat` | AIChat | Global AI assistant |
| `/validate` | ValidateIdea | Validator chat (3-panel) |

Global: Floating AI assistant button on all dashboard pages.

---

## 9. Other Screens

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `/diagrams` | Diagrams | Mermaid diagram viewer |
| `/sprint-plan` | SprintPlan | 90-day PDCA plan (campaign selector, sprint cards, timeline) |
| `*` | NotFound | 404 page |

---

## Sidebar Navigation Structure

```
MAIN NAV
├── Dashboard                    /dashboard
├── Onboarding                   /onboarding
├── Pitch Decks                  /app/pitch-decks
├── Projects                     /projects
├── Tasks                        /tasks
├── Events                       /app/events
├── CRM                          /crm
├── Documents                    /documents
├── Lean Canvas                  /lean-canvas
├── Market Research              /market-research
├── Investors                    /investors
├── Analytics                    /analytics
├── Experiments                  /experiments
├── 90-Day Plan                  /sprint-plan
├── Opportunity                  /opportunity-canvas
└── Diagrams                     /diagrams

PROFILE
├── User Profile                 /user-profile
└── Company Profile              /company-profile

BOTTOM
├── Settings                     /settings
└── Strategy Progress            68% bar
```

---

## Screen Type Summary

| Type | Count | Screens |
|------|:-----:|---------|
| **Dashboards** | 8 | Dashboard, Validator, Projects, CRM, Analytics, Investors, Experiments, PitchDecks |
| **Canvases** | 3 | LeanCanvas, OpportunityCanvas, MarketResearch |
| **Wizards** | 3 | Onboarding (4-step), PitchDeck (4-step), Events |
| **Validator flow** | 4 | Dashboard, Chat, Progress, Report |
| **Chat** | 2 | AIChat, ValidateIdea |
| **Reports** | 2 | ValidatorReport, PitchDeckEditor |
| **Progress** | 3 | ValidatorProgress, PitchDeckGenerating, OnboardingComplete |
| **Forms** | 4 | UserProfile, CompanyProfile, Settings, Login |
| **Lists** | 7 | Tasks, Documents, Events, Projects, Blog, Investors, Experiments |
| **Detail** | 4 | ProjectDetail, EventDetail, PublicEventDetail, BlogPost |
| **Public/Info** | 3 | Index, HowItWorks, Features |
| **Auth/404** | 3 | AuthCallback, Login, NotFound |

---

## Screenshots Inventory

| # | File | Screen | Validator? |
|---|------|--------|:----------:|
| 1 | `StartupAI-…02_40_AM.png` | Validation Dashboard (V-1) | Yes |
| 2 | `1-…02_41_AM.png` | Idea Validator Chat (V-2) | Yes |
| 3 | `2-…02_40_AM.png` | Validation Report Overview (V-4) | Yes |
| 4 | `3-…02_41_AM.png` | Validation Report Full (V-4, generating) | Yes |
| 5 | `4-…02_41_AM.png` | Validation Report Complete (V-4, all 14 sections) | Yes |

**Missing:** V-3 ValidatorProgress (pipeline progress screen)

---

*41 pages. 4 validator screens. 3 wizards. 3 canvases. 8 dashboards. Ship what matters.*
