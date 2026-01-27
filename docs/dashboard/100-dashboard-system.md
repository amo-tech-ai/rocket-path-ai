# StartupAI Dashboard System Plan

> **Date:** 2026-01-27 | **Version:** 1.0 | **Status:** Active
> **Design Reference:** `tasks/dashboards/prompts-design/04-dash-design.md`

---

## Summary

| Area | Screens | Agents | Edge Functions | Key Tables |
|------|---------|--------|----------------|------------|
| Main Dashboard | 1 Command Center | AI Strategic Review | `ai-chat` | startups, tasks, deals, projects |
| CRM | 3 (Contacts, Pipeline, Detail) | Contact Enrichment, Deal Scoring, Pipeline Analysis | `crm-agent` (15 actions) | contacts, deals, communications |
| Investors | 3 (Discovery, Pipeline, Detail) | Investor Match, Fit Analysis, Outreach | `investor-agent` (12 actions) | investors, startups |
| Projects | 3 (List, Detail, Board) | Task Generation, Prioritization | `ai-chat` | projects, tasks |
| Documents | 3 (Library, Detail, Generator) | Doc Analysis, AI Generate | `documents-agent` (6 actions) | documents, file_uploads |
| Lean Canvas | 2 (Canvas Editor, AI Panel) | Prefill, Suggest, Validate | `lean-canvas-agent` (5 actions) | documents (type=lean_canvas) |
| Pitch Deck | 3 (Wizard, Editor, Preview) | Deck Generation, Slide Refinement | `pitch-deck-agent` (14 actions) | pitch_decks, pitch_deck_slides |
| Events | 3 (Directory, Detail, Wizard) | Event Plan, Sponsor Match | `event-agent` (8 actions) | events, event_attendees, sponsors |
| AI Chat | 2 (Chat, History) | Industry Advisor, Service Router | `chatbot-agent` (22 actions) | chat_sessions, chat_messages |
| Settings | 4 tabs (Profile, Appearance, Notifications, Account) | None | None | profiles, organizations |
| Onboarding | 4-step wizard | URL Enrich, Founder Enrich, Scoring | `onboarding-agent` (12 actions) | wizard_sessions, wizard_extractions |

---

## Design System

### 3-Panel Layout

```
Left = Context          Main = Work              Right = Intelligence
(Navigation)            (Primary workspace)      (AI advisor panel)
w-64, fixed             flex-1, max-w-1200       w-80, collapsible
```

| Panel | Purpose | Behavior |
|-------|---------|----------|
| **Left** | Navigation sidebar with 11 items, progress indicator, settings | Fixed on desktop. Slides in/out on mobile via hamburger |
| **Main** | Page content. Grids, lists, kanban boards, forms, editors | Always visible. Scrollable. Responsive columns |
| **Right** | Contextual AI. Stats, suggestions, chat, insights | Visible on XL+ screens. Collapses to drawer on smaller |

### Visual Identity

| Element | Value |
|---------|-------|
| Tone | Quiet luxury SaaS (Stripe meets Linear) |
| Primary accent | Deep Emerald / Sage green (`bg-sage`, `bg-sage-light`) |
| Secondary accent | Warm orange (`bg-warm`) for highlights only |
| Neutrals | Stone, Sand, Off-White surfaces |
| Typography | Editorial serif headings, clean sans-serif body (Playfair Display + Inter) |
| Spacing | Generous white space, no cramped layouts |
| Borders | Minimal, prefer spacing over dividers |
| Charts | Maximum 2 per screen, muted color palette |
| AI presence | Calm nudges, never urgent or shouting |

### Design Rules

1. One primary action per screen section
2. Summary first, details on demand (progressive disclosure)
3. White space over borders
4. AI as calm advisor, not urgent chatbot
5. Human approval gates on significant AI actions
6. Status uses subtle color coding, not traffic lights

---

## Screens

### 1. Main Dashboard (Command Center)

**Purpose:** Founder's daily starting point. At-a-glance health of the startup with AI-powered strategic guidance.

**Goals:**
- Show real-time startup health and progress
- Surface actionable AI insights
- Enable quick navigation to any module

**Outcomes:** Founders spend less than 30 seconds understanding their startup's status each morning.

| Section | Content | Data Source |
|---------|---------|-------------|
| Greeting bar | "Good morning, [Name]" + global search | `profiles` table |
| Quick Actions | 4 CTAs: Create Pitch, Start Project, Add Contact, View Events | Static links |
| Summary Metrics | 4 KPI cards: Decks, Investors, Tasks, Events | Aggregated counts from multiple tables |
| Startup Health | Score gauge (0-100) with Brand Story, Traction, Team breakdowns | `startups.readiness_score` + wizard data |
| Deck Activity | Recent pitch deck edits and views | `pitch_decks` + `pitch_deck_slides` |
| Insights Tabs | Traction / Team / Market tabs with AI analysis | `ai-chat` edge function (stage_guidance action) |
| Stage Guidance | Current startup stage with next-step recommendations | `startups.stage` + AI |

**Right Panel (AI Intelligence):**
- AI Strategic Review (daily insights)
- Upcoming Events card
- Dashboard Calendar widget

**User Stories:**
- As a founder, I open my dashboard and immediately see my startup health score so I know if something needs attention
- As a founder, I see AI-generated insights about my traction metrics so I can prioritize my day
- As a founder, I click a quick action to jump straight into creating a pitch deck without navigating menus

**Acceptance Criteria:**
- Dashboard loads in under 2 seconds with cached data
- KPI cards show real counts from database (not hardcoded)
- AI insights refresh daily with a manual refresh button
- Stage guidance updates automatically when startup data changes
- Quick actions navigate to correct pages

**Real-World Example:** Sarah opens StartupAI at 9am. Dashboard shows her readiness score dropped from 72 to 68 because she hasn't updated traction data in 2 weeks. The AI insight panel suggests updating her traction to improve investor readiness. She clicks the insight and lands on her company profile traction section.

---

### 2. CRM Module

**Purpose:** Relationship intelligence hub. Track contacts, manage deal pipeline, and use AI to enrich and score every relationship.

**Goals:**
- Centralize all startup relationships (customers, partners, investors, advisors)
- AI-enrich contacts from LinkedIn and company websites
- Score leads and deals automatically
- Generate personalized outreach emails

**Outcomes:** Founders maintain a living network map with AI-scored priorities instead of scattered spreadsheets.

#### Screen 2a: Contacts View

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "Contacts" title + "Add Contact" button | Static |
| Filters | Search bar, type filter (customer, partner, investor, advisor) | Local state |
| Contact Grid | Cards with name, company, role, score badge, last contact date | `contacts` table |
| Contact Detail Sheet | Full profile, enrichment data, communication history, AI suggestions | `contacts` + `communications` |

#### Screen 2b: Deal Pipeline

| Section | Content | Data Source |
|---------|---------|-------------|
| Pipeline Kanban | Columns: Lead, Qualified, Proposal, Negotiation, Won, Lost | `deals` table grouped by stage |
| Deal Cards | Company name, value, probability %, days in stage | `deals` fields |
| Pipeline Summary | Total pipeline value, weighted forecast, conversion rates | Aggregated from `deals` |

#### Screen 2c: CRM AI Panel (Right Sidebar)

| Section | Content | Data Source |
|---------|---------|-------------|
| Stats | Total contacts, deals count, pipeline value | Aggregated |
| AI Actions | Enrich Contact, Score Lead, Analyze Pipeline, Generate Email | `crm-agent` edge function |
| Suggestions | "3 contacts haven't been reached in 30 days" | AI analysis |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Contact Enrichment | User clicks "Enrich" on contact | Extract LinkedIn + company data | `crm-agent` -> `enrich_contact` |
| Lead Scoring | Contact created or updated | Score 0-100 based on fit + engagement | `crm-agent` -> `score_lead` |
| Deal Scoring | Deal created or stage changes | Win probability 0-100% | `crm-agent` -> `score_deal` |
| Pipeline Analysis | User clicks "Analyze Pipeline" | Identify bottlenecks, forecast revenue | `crm-agent` -> `analyze_pipeline` |
| Email Generation | User clicks "Generate Email" on contact | Draft personalized outreach | `crm-agent` -> `generate_email` |
| Duplicate Detection | Contact save | Check for existing similar contacts | `crm-agent` -> `detect_duplicate` |

**User Stories:**
- As a founder, I paste a LinkedIn URL and AI fills in the contact's name, role, company, and bio automatically
- As a founder, I see a lead score (0-100) on every contact card so I know who to prioritize
- As a founder, I view my deal pipeline as a kanban board and see win probability on each deal
- As a founder, I click "Generate Email" and get a personalized outreach draft based on the contact's profile and my startup context

**Acceptance Criteria:**
- Contact enrichment completes in under 10 seconds
- Lead scores display as colored badges (green 70+, yellow 40-69, red below 40)
- Deal pipeline supports drag-and-drop between stages
- Email generation includes personalization from both contact and startup data
- Duplicate detection warns before creating a contact with matching name + company

**Real-World Example:** Alex adds investor "Maria Chen" with just her LinkedIn URL. The AI enriches the contact: Partner at Sequoia, focuses on B2B SaaS, wrote about AI startups last month. Lead score: 82. Alex clicks "Generate Email" and gets a draft referencing Maria's recent article and Alex's startup metrics.

---

### 3. Investors Module

**Purpose:** Fundraising command center. Discover, match, track, and engage investors with AI-powered fit scoring.

**Goals:**
- Discover investors matching the startup's stage, sector, and geography
- Score investor fit (0-100) based on thesis alignment
- Track pipeline from discovery to term sheet
- Generate personalized outreach with warm intro paths

**Outcomes:** Founders run a structured fundraising process instead of random LinkedIn cold outreach.

#### Screen 3a: Investor Discovery

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "Investors" + "Discover Investors" button | Static |
| Filters | Search, stage preference, sector, geography | Local state |
| Investor Grid | Cards: name, firm, focus areas, fit score badge | `investors` table |
| Investor Detail Sheet | Full profile, thesis summary, portfolio, warm paths, engagement history | `investors` + AI |

#### Screen 3b: Investor Pipeline

| Section | Content | Data Source |
|---------|---------|-------------|
| Pipeline View | Columns: Researching, Reached Out, Meeting, Due Diligence, Term Sheet, Closed | `investors` grouped by status |
| Fundraising Progress | Target amount, committed, pipeline total | Aggregated |

#### Screen 3c: Investors AI Panel (Right Sidebar)

| Section | Content | Data Source |
|---------|---------|-------------|
| Stats | Total investors, avg fit score, pipeline count | Aggregated |
| AI Actions | Discover, Match, Enrich, Generate Outreach | `investor-agent` edge function |
| Warm Paths | Mutual connections with selected investor | `investor-agent` -> `find_warm_paths` |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Investor Discovery | User clicks "Discover" | Search for investors matching startup profile | `investor-agent` -> `discover_investors` |
| Fit Scoring | Investor added to pipeline | Analyze thesis alignment, stage fit, sector overlap | `investor-agent` -> `analyze_investor_fit` |
| Warm Intro Paths | User views investor detail | Find mutual connections via LinkedIn | `investor-agent` -> `find_warm_paths` |
| Outreach Generation | User clicks "Generate Outreach" | Draft email referencing fit analysis | `investor-agent` -> `generate_outreach` |
| Status Tracking | User moves investor in pipeline | Log stage transition, update engagement | `investor-agent` -> `track_investor_engagement` |

**User Stories:**
- As a founder raising a seed round, I click "Discover Investors" and get a ranked list of VCs that match my sector with fit scores
- As a founder, I see warm intro paths showing mutual LinkedIn connections for each investor
- As a founder, I track my fundraising pipeline visually and see total committed vs target
- As a founder, I generate a personalized cold email that references the investor's thesis and my traction

**Acceptance Criteria:**
- Discovery returns investors sorted by fit score (highest first)
- Fit score breakdown shows: thesis alignment, stage match, sector overlap, geography
- Pipeline supports drag-and-drop between stages
- Fundraising progress bar updates in real-time as investors move to "Closed"
- Outreach email references at least 2 specific data points about the investor

**Real-World Example:** Priya is raising $2M seed for her AI healthcare startup. She clicks "Discover Investors" and gets 15 matched investors. Top result: a16z Bio Fund - Fit: 91. She sees 1 mutual connection through her YC batchmate. She generates outreach referencing a16z's recent healthcare AI investment and her 40% month-over-month growth.

---

### 4. Projects Module

**Purpose:** Strategic initiative tracker. Organize work into projects with AI-powered task generation and prioritization.

**Goals:**
- Track projects from ideation to completion
- Auto-generate tasks from project descriptions using AI
- Prioritize tasks based on impact and urgency
- Visualize progress with kanban boards

**Outcomes:** Founders break down overwhelming goals into manageable, prioritized tasks.

#### Screen 4a: Projects List

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "Projects" + "New Project" button | Static |
| Filters | Search, status (active, completed, archived), view toggle (grid/list) | Local state |
| Project Grid | Cards: name, description, progress bar, task count, due date | `projects` table |

#### Screen 4b: Project Detail

| Section | Content | Data Source |
|---------|---------|-------------|
| Project Header | Name, status, dates, description | `projects` row |
| Task List | Kanban or list of tasks under this project | `tasks` filtered by project_id |
| AI Generate | Button to auto-generate tasks from project description | `ai-chat` -> `generate_tasks` |

#### Screen 4c: Tasks Board

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "Tasks" + "AI Generate" + "New Task" buttons | Static |
| AI Suggestions | Collapsible panel with AI-suggested tasks | `ai-chat` -> `generate_tasks` |
| Kanban Board | 3 columns: Pending, In Progress, Completed | `tasks` grouped by status |
| Task Cards | Title, priority badge, project name, due date | `tasks` fields |
| Task Detail Sheet | Full description, subtasks, comments, history | `tasks` row |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Task Generation | User clicks "AI Generate" | Create tasks from project description | `ai-chat` -> `generate_tasks` |
| Task Prioritization | User clicks "Prioritize" | Rank tasks by impact and urgency | `ai-chat` -> `prioritize_tasks` |
| Stage Guidance | Dashboard loads | Recommend next steps for current stage | `ai-chat` -> `stage_guidance` |

**User Stories:**
- As a founder, I create a project called "Launch MVP" and AI generates 8 tasks with priorities
- As a founder, I drag tasks between kanban columns and status updates automatically
- As a founder, I click "Prioritize" and AI reorders my tasks based on impact vs effort
- As a founder, I see a progress bar on each project showing % of tasks completed

**Acceptance Criteria:**
- AI task generation creates 5-10 actionable tasks with title, description, priority
- Kanban board supports drag-and-drop between columns
- Task status updates persist immediately (optimistic UI)
- Project progress bar reflects actual task completion ratio
- Task detail sheet shows full description and allows editing inline

**Real-World Example:** Tom creates "Customer Discovery Sprint." He clicks "AI Generate" and gets 6 tasks: Define segments, Create interview script, Schedule 10 calls, Conduct interviews, Synthesize findings, Update value proposition. Each has priority labels and Tom drags them into his weekly plan.

---

### 5. Documents Module

**Purpose:** Knowledge hub for all startup documents. Store, organize, generate, and analyze documents with AI.

**Goals:**
- Centralize pitch decks, business plans, legal docs, meeting notes
- AI-generate documents from startup context
- Analyze document quality and completeness
- Organize with folders and tags

**Outcomes:** Founders have a single source of truth for all written materials with AI helping draft and improve.

#### Screen 5a: Document Library

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "Documents" + "Upload" + "AI Generate" buttons | Static |
| Filters | Search, type filter (pitch_deck, business_plan, legal, notes), sort | Local state |
| Document Grid | Cards: title, type badge, last modified, preview thumbnail | `documents` table |
| Upload Zone | Drag-and-drop area for file upload (PDF, DOCX, PPTX, 50MB max) | Supabase Storage |

#### Screen 5b: Document Detail

| Section | Content | Data Source |
|---------|---------|-------------|
| Document Header | Title, type, created/modified dates, author | `documents` row |
| Content View | Rendered content or file preview | `documents.content` or Storage URL |
| Edit Mode | Rich text editor for text-based documents | Inline editing |
| AI Analysis | Quality score, completeness check, suggestions | `documents-agent` -> `analyze_document` |

#### Screen 5c: AI Generate Dialog

| Section | Content | Data Source |
|---------|---------|-------------|
| Template Selection | Document type: Executive Summary, Business Plan, One-Pager, Meeting Notes | Static list |
| Context Preview | Shows startup data that will inform generation | `startups` + `wizard_extractions` |
| Generate Button | Creates document from startup context | `documents-agent` -> `generate_document` |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Document Generation | User selects type and clicks "Generate" | Create document from startup context | `documents-agent` -> `generate_document` |
| Document Analysis | User clicks "Analyze" on a document | Score quality, check completeness | `documents-agent` -> `analyze_document` |
| Semantic Search | User searches documents | Find relevant docs by meaning | `documents-agent` -> `search_documents` |
| File Upload | User drops file in upload zone | Store in Supabase Storage, create record | Direct Supabase Storage + DB |

**User Stories:**
- As a founder, I click "AI Generate" and select "Executive Summary" and get a 1-page summary based on my onboarding data
- As a founder, I upload a PDF pitch deck and AI analyzes it for completeness and investor readiness
- As a founder, I search "revenue model" and find relevant sections across all my documents
- As a founder, I organize documents into folders (Fundraising, Legal, Product, Marketing)

**Acceptance Criteria:**
- File upload supports drag-and-drop with progress indicator
- AI generation uses startup context from wizard_extractions and startups tables
- Document analysis returns score (0-100) with specific improvement suggestions
- Search returns results ranked by relevance with highlighted matching sections
- Documents display as cards in grid view with type badges

**Real-World Example:** Before a VC meeting, Jess clicks "AI Generate" and selects "One-Pager." The system pulls her startup's problem statement, solution, traction ($8K MRR, 120 users), and team and generates a clean one-page summary. She reviews, tweaks the numbers, saves, and shares.

---

### 6. Lean Canvas Module

**Purpose:** Structured business model thinking. Interactive 9-box canvas with AI suggestions and validation.

**Goals:**
- Guide founders through lean canvas creation
- AI pre-fill from onboarding data
- Validate each box for completeness and coherence
- Auto-save changes

**Outcomes:** Founders articulate their business model clearly with AI coaching on weak areas.

#### Screen 6a: Canvas Editor

| Section | Content | Data Source |
|---------|---------|-------------|
| Canvas Grid | 9 editable boxes in standard lean canvas layout | `documents` (type=lean_canvas) |
| Box Editor | Click to expand box, type content, see AI suggestions | Inline editing |
| Autosave | Indicator showing save status (Saved / Saving...) | `useCanvasAutosave` hook |
| AI Prefill | Button to auto-populate boxes from startup data | `lean-canvas-agent` -> `prefill_canvas` |

**9-Box Layout:**

| Row | Left | Center | Right |
|-----|------|--------|-------|
| Top | Problem | Solution | Unique Value Prop |
| Middle | Key Metrics | Unfair Advantage | Channels |
| Bottom | Cost Structure | Revenue Streams | Customer Segments |

#### Screen 6b: Canvas AI Panel (Right Sidebar)

| Section | Content | Data Source |
|---------|---------|-------------|
| Validation Score | Overall canvas completeness (0-100%) | `lean-canvas-agent` -> `validate_canvas` |
| Box Suggestions | AI suggestions for the currently selected box | `lean-canvas-agent` -> `suggest_box` |
| Weak Areas | Boxes that need more detail or are inconsistent | AI validation result |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Canvas Prefill | User clicks "AI Prefill" | Populate boxes from startup data | `lean-canvas-agent` -> `prefill_canvas` |
| Box Suggestion | User selects a canvas box | Generate suggestions for that box | `lean-canvas-agent` -> `suggest_box` |
| Canvas Validation | User clicks "Validate" | Check completeness and coherence | `lean-canvas-agent` -> `validate_canvas` |

**User Stories:**
- As a founder, I click "AI Prefill" and my lean canvas boxes populate from my onboarding data
- As a founder, I click on "Revenue Streams" and the AI panel shows me 3 revenue model suggestions
- As a founder, I see a validation score that tells me which boxes need more detail

**Acceptance Criteria:**
- Canvas auto-saves within 2 seconds of typing (debounced)
- AI prefill uses data from wizard_extractions and startups tables
- Validation highlights weak boxes with orange outline
- Box suggestions appear in right panel within 3 seconds of selection
- Canvas renders correctly at all screen sizes (responsive grid)

**Real-World Example:** Kai starts a lean canvas. The AI prefills from his SaaS onboarding data: Problem = "Small businesses waste 10 hours/week on invoicing." He clicks "Revenue Streams" and the AI suggests subscription tiers, transaction fees, or premium API access. He picks subscription, types his pricing, and validation score goes from 45% to 62%.

---

### 7. Pitch Deck Module

**Purpose:** AI-powered pitch deck creation studio. Generate, refine, and present investor-ready decks.

**Goals:**
- Generate complete pitch decks from startup data
- Refine individual slides with AI coaching
- Score each slide for investor readiness
- Export for presentations

**Outcomes:** Founders create professional pitch decks in minutes instead of weeks.

#### Screen 7a: Deck Wizard

| Section | Content | Data Source |
|---------|---------|-------------|
| Template Selection | Choose from deck templates (Minimal, Bold, Corporate) | `deck_templates` table |
| Context Review | Preview startup data that will inform generation | `startups` + `wizard_extractions` |
| URL Research | Optional: paste competitor/market URLs for research | `pitch-deck-agent` -> `extract_url_context` |
| Generate | Create full deck from template + context | `pitch-deck-agent` -> `generate_deck` |

#### Screen 7b: Deck Editor

| Section | Content | Data Source |
|---------|---------|-------------|
| Slide Navigator | Thumbnail strip of all slides | `pitch_deck_slides` ordered by position |
| Slide Editor | Active slide content editor | `pitch_deck_slides` row |
| AI Refine | "Improve This Slide" button per slide | `pitch-deck-agent` -> `refine_slide` |
| Slide Score | Quality score badge per slide (0-100) | `pitch-deck-agent` -> `score_slide` |

#### Screen 7c: Deck Preview

| Section | Content | Data Source |
|---------|---------|-------------|
| Presentation Mode | Full-screen slide-by-slide view | `pitch_deck_slides` rendered |
| Signal Strength | Overall deck readiness indicator | `pitch-deck-agent` -> `update_signal_strength` |
| Export | Download as PDF or PPTX | `pitch-deck-agent` -> `export_deck` |
| Version History | Previous versions with restore | `pitch-deck-agent` -> version actions |

**Standard Slide Types (13):**

| # | Slide | Content |
|---|-------|---------|
| 1 | Title | Company name, tagline, logo |
| 2 | Problem | Pain point with data |
| 3 | Solution | Product/service description |
| 4 | Product | Demo/screenshots |
| 5 | Market | TAM/SAM/SOM with sources |
| 6 | Business Model | Revenue streams, pricing |
| 7 | Traction | Metrics, growth charts |
| 8 | Competition | Competitive landscape |
| 9 | Team | Founders, key hires |
| 10 | Financials | Projections, unit economics |
| 11 | Ask | Funding amount, use of funds |
| 12 | Contact | Contact info, links |
| 13 | Custom | User-defined content |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Deck Generation | User completes wizard | Create all slides from startup data + template | `pitch-deck-agent` -> `generate_deck` |
| Slide Refinement | User clicks "Improve" on a slide | Enhance content, add data points | `pitch-deck-agent` -> `refine_slide` |
| Slide Scoring | Auto after generation | Score each slide for investor readiness | `pitch-deck-agent` -> `score_slide` |
| Market Research | User provides competitor URL | Extract market data from URLs | `pitch-deck-agent` -> `research_market` |
| Version Snapshot | User clicks "Save Version" | Create restorable snapshot | `pitch-deck-agent` -> `create_version_snapshot` |

**User Stories:**
- As a founder, I select a template, review my data, and generate a 12-slide pitch deck in under 2 minutes
- As a founder, I click "Improve" on my traction slide and AI adds my latest metrics
- As a founder, I see a score on each slide and focus on improving the lowest-scored ones
- As a founder, I export my deck as PDF before an investor meeting

**Acceptance Criteria:**
- Deck generation completes in under 30 seconds
- Each slide has an editable content area and an AI score badge
- Slide refinement preserves user edits and enhances around them
- Version history allows restoring any previous snapshot
- Export produces clean PDF with consistent formatting

**Real-World Example:** Dana has a VC pitch tomorrow. She selects "Minimal" template, generates a 12-slide deck. The "Traction" slide scores 45 (only MRR data). She clicks "Improve" and AI adds user growth rate, retention, and benchmarks. Score jumps to 78. She exports as PDF.

---

### 8. Events Module

**Purpose:** Event discovery and management. Find, plan, and track industry events.

**Goals:**
- Browse public events directory (conferences, meetups, demo days)
- Plan custom events with AI-generated marketing and logistics
- Match with sponsors and venues
- Track attendees and follow-ups

**Outcomes:** Founders discover relevant events and manage their own with AI-assisted planning.

#### Screen 8a: Public Events Directory

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "Events" + search + filters | Static |
| Filters | Date range, category, location, price range | Local state |
| Event Grid | Cards: name, date, location, category, image | `industry_events` table |
| Event Detail | Full page: description, schedule, speakers, register link | `industry_events` row |

#### Screen 8b: My Events (Dashboard)

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | "My Events" + "Create Event" button | Static |
| Event List | Cards with status (draft, planning, live, completed) | `events` table |
| Event Wizard | Multi-step creation: Details, Marketing, Sponsors, Venue | `event-agent` edge function |

#### Screen 8c: Event Detail (Internal)

| Section | Content | Data Source |
|---------|---------|-------------|
| Event Header | Name, date, status, venue | `events` row |
| Attendees | List with RSVP status | `event_attendees` |
| Tasks | Event-specific tasks | `startup_event_tasks` |
| Sponsors | Matched and confirmed sponsors | `sponsors` |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Event Plan | User starts wizard | Create event plan from description | `event-agent` -> `generate_plan` |
| Marketing | User requests marketing | Generate social posts, email invites | `event-agent` -> `generate_marketing` |
| Sponsor Match | User clicks "Find Sponsors" | Search for matching sponsors | `event-agent` -> `search_sponsors` |
| Venue Search | User clicks "Find Venues" | Search for matching venues | `event-agent` -> `search_venues` |
| Sponsor Outreach | User selects a sponsor | Generate outreach message | `event-agent` -> `outreach_sponsors` |

**User Stories:**
- As a founder, I browse upcoming AI conferences in my city and RSVP directly
- As a founder, I create a demo day event and AI generates a marketing plan with social posts and email templates
- As a founder, I click "Find Sponsors" and get a list of companies matching my event's theme

**Acceptance Criteria:**
- Public events directory loads paginated results with filtering
- Event wizard saves progress between steps
- Marketing generation produces copy for at least 3 channels
- Sponsor matching considers industry alignment, budget, and past sponsorships
- Event detail page shows all related data (attendees, tasks, sponsors)

**Real-World Example:** Mika organizes a "Startup Demo Day" in Toronto. She enters details and AI generates a 4-week marketing timeline, email templates, and social posts. She clicks "Find Sponsors" and gets 5 local tech companies ranked by relevance.

---

### 9. AI Chat Module

**Purpose:** Industry-aware AI advisor. Context-rich conversations with memory and service routing.

**Goals:**
- Answer startup questions using industry knowledge packs
- Remember conversation context across sessions
- Route to specific dashboard features when relevant
- Provide benchmarks and competitive intelligence

**Outcomes:** Founders have a knowledgeable co-pilot that understands their industry, stage, and history.

#### Screen 9a: Chat Interface

| Section | Content | Data Source |
|---------|---------|-------------|
| Chat Area | Message thread with user and AI messages | `chat_messages` table |
| Input Bar | Text input + send button | Static |
| Context Indicator | Current industry pack and persona | `chatbot-agent` -> `detect_industry` |
| Quick Actions | Suggested prompts based on context | AI-generated |

#### Screen 9b: Chat History

| Section | Content | Data Source |
|---------|---------|-------------|
| Session List | Previous conversations with summaries | `chat_sessions` table |
| Search | Find past conversations by topic | `chatbot-agent` -> `rag_search` |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| Industry Detection | First message | Detect startup's industry for persona | `chatbot-agent` -> `detect_industry` |
| Chat Response | User sends message | Generate contextual response with RAG | `chatbot-agent` -> `chat_message` |
| Benchmarks | User asks about metrics | Fetch industry benchmarks | `chatbot-agent` -> `get_benchmarks` |
| Service Routing | AI detects actionable request | Route to dashboard feature | `chatbot-agent` -> `route_to_dashboard` |
| Save | Session ends | Persist conversation and extract facts | `chatbot-agent` -> `save_conversation` |

**User Stories:**
- As a founder, I ask "How does my MRR compare to other seed-stage SaaS companies?" and get industry benchmarks
- As a founder, I say "Help me improve my pitch deck" and AI routes me to the editor with suggestions
- As a founder, I return to a previous conversation and the AI remembers our pricing strategy discussion

**Acceptance Criteria:**
- Chat responses include industry-specific context when relevant
- Conversation history persists across sessions with searchable summaries
- Service routing provides clickable links to relevant features
- Benchmarks cite data sources and date ranges
- Chat loads previous context within 2 seconds

**Real-World Example:** Carlos asks about CAC for his industry. The AI detects EdTech SaaS and responds with specific CAC ranges, notes his current CAC is healthy, and suggests 3 strategies specific to EdTech distribution.

---

### 10. Settings Module

**Purpose:** User and application configuration.

**Goals:**
- Profile management (avatar, name, timezone)
- Dark/light theme toggle
- Notification preferences
- Account management (password, deletion)

**Outcomes:** Founders customize their experience and manage their account securely.

#### 4 Tabs

| Tab | Content | Data Source |
|-----|---------|-------------|
| **Profile** | Avatar upload (Cloudinary), display name, email (read-only), timezone, bio | `profiles` table |
| **Appearance** | Theme toggle (light/dark/system), font size, density | Local storage + `profiles.preferences` |
| **Notifications** | Email toggles: weekly digest, AI insights, event reminders | `profiles.notification_preferences` |
| **Account** | Change password, linked accounts (Google, LinkedIn), delete account | Supabase Auth |

**User Stories:**
- As a founder, I upload a profile photo and it displays across the app
- As a founder, I switch to dark mode and the entire app respects my preference
- As a founder, I turn off weekly digest emails but keep event reminders on
- As a founder, I can delete my account with confirmation

**Acceptance Criteria:**
- Avatar upload previews before saving, crops to square, max 5MB
- Theme toggle applies immediately without page reload
- Notification preferences persist to database
- Account deletion requires typing "DELETE" to confirm
- Settings page loads current values on mount

---

### 11. Onboarding Wizard

**Purpose:** 4-step guided setup for new founders. Extract startup data using AI for all subsequent features.

**Goals:**
- Collect startup context through a guided flow
- AI-enrich data from website URLs and LinkedIn profiles
- Score startup readiness for investors
- Create the startup entity that powers all other modules

**Outcomes:** New founders go from sign-up to a fully populated dashboard in under 10 minutes.

#### 4 Steps

| Step | Screen | Purpose | Agent Actions |
|------|--------|---------|---------------|
| 1. Context | Company URL, description, target market, founder LinkedIn | Collect raw startup data | `enrich_url`, `enrich_context`, `enrich_founder` |
| 2. Analysis | Readiness score display with breakdown | Show AI assessment | `calculate_readiness` |
| 3. Interview | 5-topic Q&A (Business Model, Market, Traction, Team, Funding) | Deep-dive into key areas | `get_questions`, `process_answer` |
| 4. Review | Investor score, AI summary, company details, complete | Final review and startup creation | `calculate_score`, `generate_summary`, `complete_wizard` |

**Agent Workflows:**

| Workflow | Trigger | Agent Action | Edge Function Action |
|----------|---------|-------------|---------------------|
| URL Enrichment | User enters company URL | Extract company data via Gemini + URL Context | `onboarding-agent` -> `enrich_url` |
| Context Enrichment | User enters description + market | Analyze market and competitive landscape | `onboarding-agent` -> `enrich_context` |
| Founder Enrichment | User enters LinkedIn URL | Extract founder background | `onboarding-agent` -> `enrich_founder` |
| Readiness Scoring | Step 2 loads | Calculate investor readiness (0-100) | `onboarding-agent` -> `calculate_readiness` |
| Interview | Step 3 loads | Dynamic questions based on context | `onboarding-agent` -> `get_questions`, `process_answer` |
| Final Scoring | Step 4 loads | Comprehensive investor score + summary | `onboarding-agent` -> `calculate_score`, `generate_summary` |
| Completion | User clicks "Complete" | Create org, startup, all linked records | `onboarding-agent` -> `complete_wizard` |

**User Stories:**
- As a new founder, I paste my company URL and AI extracts my startup's name, description, team, and traction
- As a new founder, I see my investor readiness score and understand which areas need improvement
- As a new founder, I answer 5-8 interview questions and AI builds a comprehensive profile
- As a new founder, I click "Complete" and immediately land on a populated dashboard

**Acceptance Criteria:**
- URL enrichment completes in under 15 seconds with progress indicator
- Readiness score displays as an animated gauge with category breakdown
- Interview questions adapt based on previously collected data
- Wizard saves progress automatically (resume on refresh)
- "Complete" creates all records atomically
- Dashboard populates immediately after completion

**Real-World Example:** Nadia signs up via Google OAuth, pastes her company URL. AI extracts company data and team info. Readiness score: 58. Interview reveals she hasn't defined pricing. She completes the wizard and her dashboard shows 58% readiness with a suggestion to define pricing tiers.

---

## Frontend-Backend Wiring Plan

### Current Wiring Status

| Module | Frontend Hook | Edge Function | Wired? |
|--------|--------------|---------------|--------|
| Onboarding | `useOnboardingAgent` (5 hooks) | `onboarding-agent` | Yes |
| Lean Canvas | `useLeanCanvas` | `lean-canvas-agent` | Yes |
| Pitch Deck | `usePitchDeckAgent` | `pitch-deck-agent` | Yes |
| AI Chat | `useAIChat` | `ai-chat` | Yes |
| CRM | `useCRM` | `crm-agent` | CRUD only (AI not wired) |
| Investors | `useInvestors` | `investor-agent` | CRUD only (AI not wired) |
| Documents | `useDocuments` | `documents-agent` | CRUD only (AI not wired) |
| Events | `useEvents` | `event-agent` | CRUD only (AI not wired) |
| Chatbot | (none) | `chatbot-agent` | Not wired |

### Wiring Needed

For each unwired module, the pattern is:
1. Keep existing CRUD hooks (direct Supabase queries for reads and simple writes)
2. Add AI mutation hooks calling `supabase.functions.invoke('agent-name', { body: { action, ...params } })`
3. Wire AI mutations to buttons in the AI panel and action menus

| Hook | New AI Mutations | Edge Function Actions |
|------|-----------------|---------------------|
| `useCRM` | `useEnrichContact`, `useScoreLead`, `useAnalyzePipeline`, `useGenerateEmail` | `crm-agent` -> enrich_contact, score_lead, analyze_pipeline, generate_email |
| `useInvestors` | `useDiscoverInvestors`, `useScoreInvestorFit`, `useGenerateOutreach` | `investor-agent` -> discover_investors, analyze_investor_fit, generate_outreach |
| `useDocuments` | `useGenerateDocument`, `useAnalyzeDocument`, `useSearchDocuments` | `documents-agent` -> generate_document, analyze_document, search_documents |
| `useEvents` | `useGenerateEventPlan`, `useGenerateMarketing`, `useSearchSponsors` | `event-agent` -> generate_plan, generate_marketing, search_sponsors |
| `useChatbot` (new) | `useSendMessage`, `useLoadConversation`, `useGetBenchmarks` | `chatbot-agent` -> chat_message, load_conversation, get_benchmarks |

---

## Supabase Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User accounts | id, email, full_name, avatar_url, org_id, preferences |
| `organizations` | Multi-tenant orgs | id, name, slug, plan |
| `startups` | Startup entities | id, org_id, name, description, stage, readiness_score, industry |
| `wizard_sessions` | Onboarding state | id, user_id, status, current_step, form_data, extracted_data |
| `wizard_extractions` | AI-extracted data | id, session_id, extraction_type, data |

### Feature Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `projects` | Project tracking | id, startup_id, name, status, description, due_date |
| `tasks` | Task management | id, project_id, startup_id, title, status, priority |
| `contacts` | CRM contacts | id, startup_id, name, email, company, role, score, type |
| `deals` | Sales pipeline | id, startup_id, contact_id, title, value, stage, probability |
| `investors` | Investor pipeline | id, startup_id, name, firm, status, fit_score |
| `documents` | All documents | id, startup_id, title, type, content, status |
| `pitch_decks` | Deck metadata | id, startup_id, template_id, name, signal_strength |
| `pitch_deck_slides` | Individual slides | id, deck_id, type, position, content, score |
| `events` | User events | id, startup_id, name, date, status |
| `industry_events` | Public directory | id, name, date, location, category, url |

### AI Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `chat_sessions` | Conversations | id, user_id, startup_id, industry, persona |
| `chat_messages` | Messages | id, session_id, role, content |
| `chat_facts` | RAG knowledge | id, session_id, fact, embedding |
| `ai_runs` | Action logging | id, user_id, agent_name, action, model, tokens, cost |
| `agent_configs` | Agent settings | id, agent_name, model, daily_budget |

---

## Edge Functions (14 Deployed)

| # | Function | Actions | AI Provider | Key Feature |
|---|----------|---------|-------------|-------------|
| 1 | `ai-chat` | 5 | Gemini 3 + Claude | Multi-model routing |
| 2 | `onboarding-agent` | 12 | Gemini 2.0 Flash | 4-step wizard enrichment |
| 3 | `lean-canvas-agent` | 5 | Gemini 2.5 Flash | Canvas prefill + validation |
| 4 | `pitch-deck-agent` | 14 | Gemini | Deck generation + versioning |
| 5 | `crm-agent` | 15 | Gemini | Contact enrichment + scoring |
| 6 | `investor-agent` | 12 | Gemini | Discovery + matching |
| 7 | `documents-agent` | 6 | Gemini | AI generation + analysis |
| 8 | `event-agent` | 8 | Gemini | Planning + sponsor matching |
| 9 | `chatbot-agent` | 22 | Gemini | Industry RAG + services |
| 10 | `whatsapp-agent` | 6 | None | WhatsApp Business API |
| 11 | `generate-image` | 4 | Gemini | Image generation |
| 12 | `health` | 1 | None | Health check (public) |
| 13 | `auth-check` | 1 | None | Auth diagnostics |
| 14 | `stripe-webhook` | 7 | None | Payment processing |

---

## Dependencies

### Gemini 3 Features Used

| Feature | Used By | Purpose |
|---------|---------|---------|
| URL Context | `onboarding-agent`, `pitch-deck-agent` | Extract data from websites without scraping |
| Google Search Grounding | `onboarding-agent`, `crm-agent`, `investor-agent` | Real-time market and company data |
| Structured Output | All agents | JSON schema responses for reliable parsing |
| Thinking Mode | `chatbot-agent` | Complex reasoning for strategic advice |
| Function Calling | `chatbot-agent` | Service routing and tool execution |

### Claude SDK Features Used

| Feature | Used By | Purpose |
|---------|---------|---------|
| Claude Sonnet 4.5 | `ai-chat` -> prioritize_tasks | Task ranking by impact and urgency |
| Claude Haiku 4.5 | `ai-chat` -> generate_tasks | Fast task generation from descriptions |
| Claude Opus 4.5 | `ai-chat` -> complex_analysis | Deep strategic analysis |

### Supabase Features Used

| Feature | Purpose |
|---------|---------|
| PostgreSQL + RLS | Data storage with row-level security |
| Edge Functions (Deno) | Serverless AI agent runtime |
| Auth (OAuth) | Google + LinkedIn sign-in |
| Storage | File uploads (documents, images) |
| Real-time (planned) | Live dashboard updates |

---

## Implementation Priority

| Phase | Modules | What It Unlocks |
|-------|---------|-----------------|
| **Phase 1** | Wire CRM, Investors, Documents, Events, Chatbot hooks to edge functions | AI features across all modules |
| **Phase 2** | Documents module (Library, Upload, AI Generate) | Complete content management |
| **Phase 3** | Settings module (Profile, Appearance, Notifications, Account) | User customization |
| **Phase 4** | Project Detail page, Dashboard metrics aggregator | Deeper project and analytics views |
| **Phase 5** | Real-time subscriptions, Analytics dashboard | Live data and charts |
| **Future** | GTM Strategy, Discovery, Strategy modules | Requires product design first |
