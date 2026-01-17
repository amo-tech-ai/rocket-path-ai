# Dashboard Right Panel Fix Prompts for Lovable

**Purpose:** Simple prompts to fix 3-panel system by adding right AI panels to missing screens

**Note:** These prompts are for Lovable AI to implement. Keep prompts simple, no code snippets.

## Quick Summary

**Problem:** 6 out of 8 dashboard screens are missing permanent right AI panels (only Dashboard and Lean Canvas have them)

**Solution:** Add right AI panels to Tasks, CRM, Projects, Documents, and Investors screens

**AI Infrastructure:**
- **Edge Function:** `supabase/functions/ai-chat/` (invoke with action parameter)
- **AI Models:** Gemini 2.5 Flash (fast) or Gemini 3 Pro Preview (advanced)
- **AI Tools:** Google Search (grounding), URL Context (web), File Search (RAG)
- **Pattern:** Follow Dashboard and Lean Canvas right panel implementations

**Priority:** Tasks & CRM (High) → Projects & Investors (Medium) → Documents (Lower)

---

## 1. Tasks Screen (`/tasks`)

### Prompt:
```
Add a permanent right AI panel to the Tasks screen that shows AI-powered task intelligence. 

The right panel should display:
- AI Task Coach: Real-time task analysis and suggestions based on current task list
- Productivity Insights: Weekly completion trends, peak productivity times, bottleneck identification
- Smart Recommendations: AI-generated task suggestions based on startup context, industry, and current priorities
- Task Prioritization: AI analysis of which tasks should be done first based on urgency, impact, and dependencies

AI Agents Used:
- Supabase Edge Function: `ai-chat` with action `generate_tasks` (same as existing AITaskSuggestions)
- Gemini AI Model: `gemini-2.5-flash` or `gemini-3-pro-preview` for task analysis
- Task analysis uses Gemini AI to analyze task patterns, priorities, and suggest optimizations
- Prioritization considers task status, due dates, project relationships, and business impact

Keep the existing TaskDetailPanel functionality when a task is clicked - it should appear alongside the AI panel, not replace it. Both panels should be visible when a task is selected.
```

---

## 2. CRM Screen (`/crm`)

### Prompt:
```
Add a permanent right AI panel to the CRM screen that shows AI-powered relationship intelligence.

The right panel should display:
- Contact Insights: AI analysis of contact engagement, relationship strength, last interaction patterns
- Deal Recommendations: AI suggestions for which deals to prioritize, next steps, and risk assessment
- Email Draft Suggestions: AI-generated email templates for follow-ups, introductions, and deal progression
- Relationship Intelligence: Warm introduction opportunities, mutual connections, conversation starters

AI Agents Used:
- Supabase Edge Function: `ai-chat` with action `generate_crm_insights` or `generate_email_draft`
- Gemini AI Model: `gemini-2.5-flash` for relationship analysis and email generation
- Contact insights use Gemini AI to analyze engagement patterns, relationship strength, and interaction history
- Email generation uses Gemini AI to create personalized, context-aware email templates
- Deal recommendations analyze pipeline stage, value, probability, and timeline using AI

Replace the ContactDetailSheet (Sheet overlay) with a ContactDetailPanel that appears in the right panel when a contact is selected. When no contact is selected, show the AI panel. When a contact is selected, show both the AI panel and contact details side by side in the right panel.
```

---

## 3. Projects Screen (`/projects`)

### Prompt:
```
Add a permanent right AI panel to the Projects screen that shows AI-powered project intelligence.

The right panel should display:
- Project Health Analysis: AI assessment of project status, risks, timeline accuracy, and resource allocation
- Risk Identification: AI detection of potential bottlenecks, delays, budget overruns, and team capacity issues
- Timeline Predictions: AI forecasting of project completion dates based on current progress and historical patterns
- Resource Optimization: AI suggestions for better task allocation, team balancing, and priority adjustments

AI Agents Used:
- Supabase Edge Function: `ai-chat` with action `analyze_project_health` or `predict_timeline`
- Gemini AI Model: `gemini-2.5-flash` for project analysis and risk assessment
- Project health analysis uses Gemini AI to analyze status, risks, timeline accuracy, and resource allocation
- Risk identification uses AI to detect bottlenecks, delays, budget overruns, and capacity issues
- Timeline prediction uses Gemini AI to forecast completion dates based on current progress and patterns

The panel should be visible on both the Projects list view and ProjectDetail page. When viewing a project detail, show project-specific AI insights. When on the list view, show portfolio-level insights.
```

---

## 4. Documents Screen (`/documents`)

### Prompt:
```
Add a permanent right AI panel to the Documents screen that shows AI-powered document intelligence.

The right panel should display:
- Document Summarization: AI-generated summaries of uploaded documents, key points, and action items
- Smart Search: AI-powered semantic search across documents, finding content by meaning not just keywords
- Document Generation Suggestions: AI recommendations for creating new documents (decks, proposals, reports) based on business needs
- Content Analysis: AI insights on document completeness, quality, investor-readiness, and improvement suggestions

AI Agents Used:
- Supabase Edge Function: `ai-chat` with action `analyze_document` or `generate_document_suggestions`
- Gemini AI Model: `gemini-2.5-flash` or `gemini-3-pro-preview` with File Search tool (RAG)
- File Search Store: Use Gemini File Search for document analysis and semantic search
- Document summarization uses Gemini AI with File Search to analyze uploaded documents
- Semantic search uses document embeddings via Gemini File Search for meaning-based queries
- Content generation suggestions analyze current documents and business context using AI

The panel should work with all document types: pitch decks, proposals, reports, contracts, and templates.
```

---

## 5. Investors Screen (`/investors`)

### Prompt:
```
Add a permanent right AI panel to the Investors screen that shows AI-powered investor intelligence.

The right panel should display:
- Investor Matching: AI recommendations for which investors are best fit based on stage, industry, portfolio, and deal size
- Portfolio Fit Analysis: AI analysis of investor's existing portfolio to identify synergy and strategic fit
- Introduction Suggestions: AI identification of warm introduction paths, mutual connections, and relationship opportunities
- Pitch Deck Optimization Tips: AI suggestions for tailoring pitch deck to specific investor preferences and investment thesis

AI Agents Used:
- Supabase Edge Function: `ai-chat` with action `match_investors` or `analyze_investor`
- Gemini AI Model: `gemini-2.5-flash` or `gemini-3-pro-preview` with grounding tools
- Google Search Tool: Use Gemini's Google Search grounding to research investor backgrounds and portfolios
- URL Context Tool: Use Gemini's URL Context to analyze investor websites, LinkedIn profiles, and portfolio pages
- Investor matching uses Gemini AI to analyze stage alignment, industry focus, check size, and investment thesis
- Portfolio fit analysis uses AI with URL Context to identify synergy and strategic fit

Replace the InvestorDetailSheet (Sheet overlay) with an InvestorDetailPanel that appears in the right panel when an investor is selected. When no investor is selected, show the AI panel. When an investor is selected, show both the AI panel and investor details side by side.
```

---

## Implementation Pattern Reference

### Good Examples to Follow:

**Dashboard Screen:**
- Right panel contains: AIStrategicReview, EventCard, DashboardCalendar
- Uses aiPanel prop in DashboardLayout component
- AI features are persistent and always visible

**Lean Canvas Screen:**
- Right panel contains: CanvasAIPanel with progress tracking and AI actions
- Uses CanvasAIPanel component with "Pre-fill from Profile" and "Validate Hypotheses" buttons
- AI features integrate with canvas data and startup profile

### Layout Pattern:

All screens should follow this structure:
- Left Panel: Navigation sidebar (already implemented via DashboardLayout)
- Main Panel: Content area (already implemented)
- Right Panel: AI intelligence panel (needs to be added to Tasks, CRM, Projects, Documents, Investors)

The right panel should:
- Be permanently visible (not conditional)
- Use width of 320-400px (380px standard)
- Have border-l styling to separate from main content
- Support both AI panel and detail panel when items are selected
- Use AI agents (Gemini AI) for intelligent features

---

## Priority Order

1. **Tasks Screen** - High priority (users actively manage tasks)
2. **CRM Screen** - High priority (critical for relationship management)
3. **Projects Screen** - Medium priority (important for project tracking)
4. **Investors Screen** - Medium priority (valuable for fundraising)
5. **Documents Screen** - Lower priority (can be added later)

---

## Testing Checklist

After implementing each right panel:
- [ ] Right panel is visible on page load
- [ ] AI features work correctly
- [ ] Detail panels appear alongside AI panel when items are selected
- [ ] Panel is responsive and works on mobile/tablet
- [ ] No console errors
- [ ] Panel matches Dashboard and Lean Canvas styling

---

**Note:** All AI features should use existing infrastructure:
- **Supabase Edge Function:** `ai-chat` (located in `supabase/functions/ai-chat/`)
- **Gemini AI Models:** `gemini-2.5-flash` (fast, cost-effective) or `gemini-3-pro-preview` (advanced reasoning)
- **Gemini Tools:** Google Search (grounding), URL Context (web analysis), File Search (RAG for documents)
- **Actions:** Pass action parameter to ai-chat function (e.g., `generate_tasks`, `analyze_project_health`)
- **Existing Components:** Follow patterns from AITaskSuggestions, CanvasAIPanel, AIStrategicReview
- **Hooks:** Use or create React Query hooks similar to `usePreFillCanvas`, `useValidateCanvas`