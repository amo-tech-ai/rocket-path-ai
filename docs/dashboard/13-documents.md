# Prompt 13 — Documents Module

> **Phase:** Module | **Priority:** P1 | **Overall:** 40%
> **No code — screen specs, data sources, agent workflows only**
> **Reference:** `100-dashboard-system.md` Section 5

---

## Purpose

Knowledge hub for all startup documents. Store, organize, generate, and analyze documents with AI.

## Goals

- Centralize pitch decks, business plans, legal docs, meeting notes
- AI-generate documents from startup context
- Analyze document quality and completeness
- Organize with folders and tags

## Outcomes

Founders have a single source of truth for all written materials with AI helping draft and improve.

---

## Screen 13a: Document Library

```
┌─────────────────┬──────────────────────────────────────────────┬─────────────────┐
│  [LEFT NAV]     │                                              │  Documents AI   │
│                 │  Documents          [Upload] [AI Generate ▸] │                 │
│                 │                                              │  Total: 24      │
│                 │  🔍 Search documents...                      │  This Week: 3   │
│                 │  [All] [Pitch] [Legal] [Notes] [Plans]      │                 │
│                 │                                              │ ─────────────── │
│                 │  ┌──────────┐ ┌──────────┐ ┌──────────┐     │                 │
│                 │  │ 📄       │ │ 📄       │ │ 📄       │     │  AI Actions     │
│                 │  │ Seed     │ │ Terms of │ │ Meeting  │     │                 │
│                 │  │ Pitch    │ │ Service  │ │ Notes    │     │  [Generate   ▸] │
│                 │  │          │ │          │ │ Jan 25   │     │  [Analyze    ▸] │
│                 │  │ pitch_deck│ │ legal   │ │ notes    │     │  [Search     ▸] │
│                 │  │ 2d ago   │ │ 1w ago   │ │ Today    │     │                 │
│                 │  └──────────┘ └──────────┘ └──────────┘     │ ─────────────── │
│                 │                                              │                 │
│                 │  ┌─────────────────────────────────────────┐│  Suggestions    │
│                 │  │  📤 Drop files here to upload           ││                 │
│                 │  │     PDF, DOCX, PPTX (max 50MB)          ││  "Generate an   │
│                 │  └─────────────────────────────────────────┘│  executive      │
│                 │                                              │  summary for    │
│                 │  Showing 6 of 24                            │  your next VC   │
│                 │                                              │  meeting"       │
└─────────────────┴──────────────────────────────────────────────┴─────────────────┘
```

---

## Screen 13b: Document Detail

| Section | Content | Data Source |
|---------|---------|-------------|
| Header | Title, type badge, created/modified dates | `documents` row |
| Content View | Rendered content or file preview | `documents.content` or Storage URL |
| Edit Mode | Rich text editor for text documents | Inline editing |
| AI Analysis | Quality score, completeness, suggestions | `documents-agent` -> `analyze_document` |

---

## Screen 13c: AI Generate Dialog

| Section | Content | Data Source |
|---------|---------|-------------|
| Template Selection | Document type dropdown | Static list |
| Context Preview | Startup data that will inform generation | `startups` + `wizard_extractions` |
| Generate Button | Creates document from startup context | `documents-agent` -> `generate_document` |

### Document Templates

| Type | Description | Uses |
|------|-------------|------|
| Executive Summary | 1-page startup overview | Investor meetings |
| Business Plan | Full business plan | Fundraising |
| One-Pager | Quick pitch summary | Outreach |
| Meeting Notes | Structured meeting recap | Post-meeting |
| Investor Update | Monthly/quarterly update | Investor relations |

---

## Data Sources

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `documents` | Document storage | title, type, content, content_json, status, ai_generated |
| `file_uploads` | File metadata | filename, storage_path, url, ai_summary |

---

## Agent Workflows

| Workflow | Trigger | Edge Function | Action | Output |
|----------|---------|---------------|--------|--------|
| Document Generation | Click "Generate" | `documents-agent` | `generate_document` | Document content |
| Document Analysis | Click "Analyze" | `documents-agent` | `analyze_document` | Quality score |
| Semantic Search | User searches | `documents-agent` | `search_documents` | Ranked results |
| File Upload | Drop/select file | Direct Supabase | Storage + DB record | File URL |

---

## User Stories

- As a founder, I click "AI Generate" and select "Executive Summary" to get a 1-page summary
- As a founder, I upload a PDF pitch deck and AI analyzes it for completeness
- As a founder, I search "revenue model" and find relevant sections across all documents
- As a founder, I organize documents into folders (Fundraising, Legal, Product)

---

## Acceptance Criteria

- [ ] File upload supports drag-and-drop with progress indicator
- [ ] AI generation uses startup context from onboarding data
- [ ] Document analysis returns score (0-100) with improvement suggestions
- [ ] Search returns results ranked by relevance
- [ ] Documents display as cards in grid view with type badges

---

## Frontend Components

| Component | File | Status |
|-----------|------|--------|
| `Documents.tsx` | `src/pages/Documents.tsx` | ✅ Exists |
| `DocumentCard.tsx` | `src/components/documents/DocumentCard.tsx` | ✅ Exists |
| `DocumentDialog.tsx` | `src/components/documents/DocumentDialog.tsx` | ✅ Exists |
| `DocumentsAIPanel.tsx` | `src/components/documents/DocumentsAIPanel.tsx` | ✅ Exists |

---

## Missing Work

1. **File upload zone** — Drag-and-drop with Cloudinary/Supabase Storage
2. **AI Generate dialog** — Template selection + context preview
3. **Document analysis UI** — Show quality score and suggestions
4. **Semantic search** — Wire search to `documents-agent`

---

## Implementation Priority

| Step | Task | Effort | Impact |
|------|------|--------|--------|
| 1 | Build file upload with progress | 3h | High |
| 2 | Create AI Generate dialog | 2h | High |
| 3 | Wire generate to `documents-agent` | 1h | High |
| 4 | Add document analysis display | 2h | Medium |
| 5 | Implement semantic search | 2h | Medium |
