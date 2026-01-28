---
prompt_number: 06
title: My Documents Dashboard
category: Frontend
focus: Document control center for all startup materials
---

# Prompt 06 — My Documents Dashboard

> **Phase:** Next | **Priority:** P1
> **Route:** `/documents`
> **Backend:** See `tasks/dashboards/00-prompts/13-documents.md` for schema + edge function
> **Storage:** `documents` bucket (private, 50MB limit, RLS per-user)

---

## Screen Purpose

The "My Documents" dashboard is the **document control center** for founders. Single workspace to access, manage, and create all core startup documents:

- Pitch Decks
- Lean Canvas
- Startup Planning Docs
- Investor Materials
- Financial Documents
- Data Room Materials

**User understands:** "All my startup knowledge, organized and AI-powered."

---

## Visual Style

| Element | Style |
|---------|-------|
| Background | Light neutral (#FAFAFA) |
| Cards | White, subtle shadows |
| Typography | Clean, professional SaaS |
| AI Accent | Brand color on AI-generated actions |
| Feel | Organized, calm, founder-focused |

---

## Complete Startup Document Taxonomy

### 📊 Fundraising Documents

| Document | Purpose | AI-Generated | Pages/Slides |
|----------|---------|--------------|--------------|
| **Pitch Deck** | Investor presentation | ✅ | 10-15 slides |
| **Executive Summary** | Company overview for investors | ✅ | 1-2 pages |
| **One-Pager** | Single-page company snapshot | ✅ | 1 page |
| **Investor Memo** | Detailed investment thesis | ✅ | 3-5 pages |
| **Fundraising Narrative** | Story-driven pitch document | ✅ | 2-3 pages |
| **Investor Update** | Monthly/quarterly progress report | ✅ | 1-2 pages |

### 📋 Business Planning

| Document | Purpose | AI-Generated | Format |
|----------|---------|--------------|--------|
| **Lean Canvas** | One-page business model | ✅ | 9-box canvas |
| **Business Plan** | Comprehensive strategy document | ✅ | 15-30 pages |
| **Go-To-Market Strategy** | Launch and growth plan | ✅ | 5-10 pages |
| **Product Vision** | Product strategy and roadmap | ✅ | 3-5 pages |
| **Competitive Analysis** | Market landscape research | ✅ | 3-5 pages |
| **Market Research Notes** | Customer/market insights | Manual | Varies |

### 💰 Financial Documents

| Document | Purpose | AI-Assisted | Format |
|----------|---------|-------------|--------|
| **Financial Model** | Projections and assumptions | ✅ Template | Spreadsheet |
| **Financial Projections** | 3-5 year forecasts | ✅ | 2-3 pages |
| **Unit Economics** | CAC, LTV, margins | ✅ | 1-2 pages |
| **Cap Table** | Ownership breakdown | Manual | Spreadsheet |
| **Use of Funds** | Allocation plan | ✅ | 1 page |

### 👥 Operational Documents

| Document | Purpose | AI-Assisted | Format |
|----------|---------|-------------|--------|
| **Startup Overview** | Internal company summary | ✅ | 2-3 pages |
| **Product Spec (PRD)** | Feature requirements | ✅ | Varies |
| **Roadmap** | Development timeline | ✅ | Visual + text |
| **Team Org Chart** | Structure and roles | Manual | Visual |
| **Meeting Notes** | Discussion summaries | ✅ | 1 page |

### 📁 Data Room Documents (Due Diligence)

| Document | Purpose | Stage |
|----------|---------|-------|
| **Data Room Checklist** | Investor due diligence tracker | Seed+ |
| **Term Sheet** | Investment terms (received) | Seed+ |
| **SAFE/Convertible Note** | Funding instrument | Pre-Seed+ |
| **Articles of Incorporation** | Legal formation docs | All |
| **IP Assignment** | Founder IP transfer | All |
| **Employment Agreements** | Team contracts | All |
| **Customer Contracts** | Revenue proof | Seed+ |

---

## Stage-Specific Document Requirements

### Pre-Seed Stage

| Priority | Documents |
|----------|-----------|
| **Must Have** | Pitch Deck, Lean Canvas, Executive Summary |
| **Should Have** | One-Pager, Financial Projections (12mo) |
| **Nice to Have** | Product Vision, Competitive Analysis |

### Seed Stage

| Priority | Documents |
|----------|-----------|
| **Must Have** | Pitch Deck, Executive Summary, Financial Model (3yr), Lean Canvas |
| **Should Have** | Business Plan, Go-To-Market Strategy, Data Room Checklist |
| **Nice to Have** | Investor Update Template, Product Spec |

### Series A Stage

| Priority | Documents |
|----------|-----------|
| **Must Have** | Full Pitch Deck, Financial Model (5yr), Business Plan, Data Room |
| **Should Have** | Unit Economics, Competitive Analysis, Roadmap |
| **Nice to Have** | Board Deck Template, Customer Case Studies |

---

## 3-Panel Layout

### Left Panel (240px) — Navigation & Filters

**Navigation:**
- Home
- My Presentations
- **My Documents** (active)
- Templates
- Investor Tools
- Market Research
- Financials
- Settings

**Filters:**
- Category: All, Fundraising, Planning, Financial, Operational, Data Room
- Status: All, Draft, In Progress, Final, Archived
- AI Status: All, AI-Generated, Manual
- Last Updated: All Time, Last 7 Days, Last 30 Days

**Quick Stats:**
- Total documents count
- Documents by category (mini bar chart)
- Recently modified (last 3)

### Main Panel — My Documents

**Header:**
- Title: **"My Documents"**
- Subtitle: "All your startup documents, organized in one place"
- Search bar: "Search documents..."
- **Create Document** button (primary):
  - Dropdown:
    - Pitch Deck → `/pitch-deck/wizard`
    - Lean Canvas → `/lean-canvas`
    - Executive Summary → AI Generate modal
    - One-Pager → AI Generate modal
    - Investor Memo → AI Generate modal
    - Financial Model → Template + upload
    - Other Document → Upload dialog

---

## Document Categories (Top Cards)

Display 4 large category cards above the document grid:

### 1️⃣ Pitch Decks (Highlighted)

| Element | Content |
|---------|---------|
| Icon | 📊 Presentation |
| Title | Pitch Decks |
| Description | "Investor-ready presentations" |
| Count | "{n} decks" |
| Includes | Pre-Seed, Seed, Demo Day, Series A |
| CTA | "View Decks" / "Create with AI" |
| Style | Highlighted with accent border |

### 2️⃣ Lean Canvas

| Element | Content |
|---------|---------|
| Icon | 📋 Canvas |
| Title | Lean Canvas |
| Description | "One-page business model" |
| Count | "{n} versions" |
| Includes | Problem, Solution, UVP, Segments, Revenue |
| CTA | "Open Canvas" / "Generate with AI" |

### 3️⃣ Startup Documents

| Element | Content |
|---------|---------|
| Icon | 📁 Folder |
| Title | Startup Documents |
| Description | "Internal planning and strategy" |
| Count | "{n} documents" |
| Includes | Business Plan, GTM, Product Vision, Roadmap, Competitive Analysis |
| CTA | "View Docs" / "Create New" |

### 4️⃣ Investor Documents

| Element | Content |
|---------|---------|
| Icon | 💼 Briefcase |
| Title | Investor Documents |
| Description | "Fundraising materials" |
| Count | "{n} documents" |
| Includes | Executive Summary, One-Pager, Investor Memo, Data Room |
| CTA | "View Docs" / "Generate with AI" |

---

## Documents Grid

**Layout:** Card grid (3 columns desktop, 2 tablet, 1 mobile) or list view toggle

**Each Document Card:**

| Element | Description |
|---------|-------------|
| Icon | Document type icon |
| Title | Document title (truncated) |
| Type Badge | Pitch Deck / Lean Canvas / Executive Summary / etc. |
| Category Badge | Fundraising / Planning / Financial / Operational |
| Status | Draft (gray), In Progress (yellow), Final (green), Archived (muted) |
| AI Badge | "AI Generated" if `ai_generated = true` |
| File Indicator | 📎 if `file_path` exists |
| Last Edited | Timestamp |
| Hover Actions | Open, Duplicate, Share, Download, Archive |

**Sample Documents:**

| Title | Type | Category | Status | AI |
|-------|------|----------|--------|-----|
| "Seed Pitch Deck v3" | Pitch Deck | Fundraising | Final | ✅ |
| "Business Model Canvas" | Lean Canvas | Planning | Final | ✅ |
| "Q1 2026 Investor Update" | Investor Update | Fundraising | Draft | ✅ |
| "Go-To-Market Strategy" | GTM Strategy | Planning | In Progress | ✅ |
| "Financial Model FY26" | Financial Model | Financial | Final | ❌ |
| "Series A Data Room" | Data Room | Fundraising | Draft | ❌ |

---

## Empty State

**When no documents exist:**
- Illustration: Stacked document cards
- Title: "Start building your startup documents"
- Subtitle: "Create investor-ready materials with AI assistance"
- CTA: **"Create your first document"** (large, primary)
- Secondary: "Or upload existing documents"

**Smart suggestions (if startup data exists):**
- "Based on your stage (Seed), we recommend creating: Pitch Deck, Executive Summary, Financial Model"

---

### Right Panel (360px) — Documents AI Intelligence

**Section 1: Document Readiness**

Circular progress gauge showing document completeness for current stage:

| Stage | Required | Have | Missing |
|-------|----------|------|---------|
| Seed | 6 | 4 | Financial Model, Data Room Checklist |

**Section 2: AI Recommendations**

| Recommendation | Trigger | Action |
|----------------|---------|--------|
| "Create your Executive Summary" | No exec summary exists | Generate |
| "Update your Financial Model" | Model > 90 days old | Open |
| "Prepare Data Room" | Raising and no data room | Create checklist |
| "Your Pitch Deck needs updates" | Deck score < 60% | Improve |

**Section 3: Quick Actions**

| Action | Description |
|--------|-------------|
| Generate Document | Opens AI generate modal |
| Analyze All | Batch quality check on all docs |
| Export Data Room | Package all fundraising docs |
| Share Portfolio | Create shareable link |

**Section 4: Recent Activity**

- "Created Executive Summary — 2 hours ago"
- "Updated Pitch Deck v3 — yesterday"
- "AI improved Go-To-Market Strategy — 3 days ago"

---

## AI Generate Modal

**Steps:**

1. **Select Document Type**
   - Executive Summary
   - One-Pager
   - Investor Memo
   - Investor Update
   - Go-To-Market Strategy
   - Competitive Analysis
   - Product Vision

2. **Review Context**
   - Startup name, stage, industry
   - Traction metrics
   - Recent updates from `startups` table

3. **Additional Instructions** (optional)
   - Textarea for specific guidance
   - "Focus on..." / "Emphasize..." / "Include..."

4. **Generate**
   - Calls `documents-agent` → `generate_document`
   - Shows progress
   - Creates `documents` row
   - Opens Document Detail page

---

## Data Flow

### Load Dashboard

| Step | Query |
|------|-------|
| Fetch documents | `supabase.from('documents').select('*').eq('startup_id', id).order('updated_at', { descending: true })` |
| Fetch pitch decks | `supabase.from('pitch_decks').select('id, title, status, signal_strength').eq('startup_id', id)` |
| Fetch lean canvas | `supabase.from('documents').select('*').eq('startup_id', id).eq('type', 'lean_canvas').single()` |
| Group by category | Client-side grouping |

### Create Document

| Action | Mutation |
|--------|----------|
| AI Generate | `invoke('documents-agent', { action: 'generate_document', startup_id, template_type })` |
| Upload | `storage.upload()` → `documents.insert()` with `file_path`, `file_url` |
| Manual | `documents.insert()` with `content` |

---

## Database: Document Types Enum

Extend `documents.type` to include all document types:

```
pitch_deck, lean_canvas, executive_summary, one_pager, investor_memo,
investor_update, business_plan, gtm_strategy, product_vision, product_spec,
competitive_analysis, market_research, financial_model, financial_projections,
unit_economics, cap_table, use_of_funds, roadmap, team_org, meeting_notes,
data_room_checklist, term_sheet, safe_note, customer_contract, other
```

---

## Success Criteria

- [ ] 4 category cards display with correct counts
- [ ] Document grid shows all documents with type/category badges
- [ ] Filters work (category, status, AI status, date)
- [ ] Search finds documents by title
- [ ] Create dropdown navigates to correct flows
- [ ] AI generate modal creates documents
- [ ] Upload works with progress indicator
- [ ] Right panel shows document readiness for stage
- [ ] AI recommendations are contextual
- [ ] Empty state guides first-time users
- [ ] Responsive on all screen sizes

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/pages/Documents.tsx` | Dashboard page |
| `src/components/documents/CategoryCards.tsx` | Top category cards |
| `src/components/documents/DocumentGrid.tsx` | Document grid/list |
| `src/components/documents/AIGenerateModal.tsx` | AI generation modal |
| `src/components/documents/DocumentCard.tsx` | Individual document card |
| `src/hooks/useDocuments.ts` | Documents data hook |
| `supabase/functions/documents-agent/` | AI document operations |

---

**Reference:** `tasks/dashboards/00-prompts/13-documents.md` for backend schema and edge function actions
