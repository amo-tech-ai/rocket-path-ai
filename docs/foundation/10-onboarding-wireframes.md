# Onboarding Wizard - 3-Panel Layout Wireframes

**Purpose:** Visual wireframes for onboarding wizard using 3-panel layout  
**Layout:** Left (Context) | Main (Work) | Right (Intelligence)  
**Status:** Production-ready  
**Current Lovable Build:** `/home/sk/startupai16L/` (source of truth)

**Repository Status:**
- **Lovable Build:** `/home/sk/startupai16L/` - Current production build
- **Component Location:** `src/components/onboarding/WizardAIPanel.tsx` (599 lines - complete implementation)
- **Layout Component:** `src/components/onboarding/WizardLayout.tsx`

---

## Core Layout Model

```
┌─────────────┬──────────────────────────────┬─────────────────┐
│             │                              │                 │
│   CONTEXT   │           WORK               │  INTELLIGENCE   │
│   (256px)   │          (flex)              │     (320px)     │
│             │                              │                 │
│ • Progress  │  • Forms                     │  • AI Agent     │
│ • Steps     │  • Content                   │  • Suggestions  │
│ • Navigation│  • Actions                   │  • Data         │
│             │  • Primary UI                │  • Workflows    │
└─────────────┴──────────────────────────────┴─────────────────┘
```

---

## Step 1: Context Collection

### Wireframe

```
┌─────────────┬──────────────────────────────┬─────────────────┐
│ CONTEXT     │ WORK                         │ INTELLIGENCE    │
│             │                              │                 │
│ [Logo]      │ Step 1: Context & Enrichment │ [Advisor Card]  │
│             │                              │                 │
│ Step 1 ●    │ Company Name: [________]    │ [Processing]    │
│ Step 2 ○    │                              │                 │
│ Step 3 ○    │ Website URL: [________] [Enrich]│              │
│ Step 4 ○    │                              │ [AI Detected]   │
│             │ Description: [___________]   │                 │
│ [Save Later]│                              │ • Company Name  │
│             │ Target Market: [Dropdown ▼]  │ • Tagline       │
│             │                              │ • Industry      │
│             │ Additional URLs:             │ • Features      │
│             │ • [url1] [×]                 │ • Competitors  │
│             │ • [url2] [×]                 │                 │
│             │ • [+ Add URL]                │ [Apply] buttons │
│             │                              │                 │
│             │ Founders:                    │ [Grounding]     │
│             │ ┌─────────────────────┐     │ URL Context ✓  │
│             │ │ Name: [________]     │     │ Google Search ✓ │
│             │ │ Role: [________]     │     │                 │
│             │ │ LinkedIn: [____]     │     │                 │
│             │ │ [Enrich from LinkedIn]│    │                 │
│             │ └─────────────────────┘     │                 │
│             │ [+ Add Founder]             │                 │
│             │                              │                 │
│             │ [← Back]        [Next →]    │                 │
└─────────────┴──────────────────────────────┴─────────────────┘
```

### Panel Breakdown

**Left (Context):**
- Logo + branding
- Step progress (1-4) with current step highlighted
- "Save Later" button
- Navigation between steps (clickable)

**Main (Work):**
- Form fields: Company name, website URL, description
- URL input with "Enrich" button
- Target market dropdown
- Additional URLs list (add/remove)
- Founders section (add multiple, enrich from LinkedIn)
- Navigation buttons (Back/Next)

**Right (Intelligence):**
- Advisor card (Luna - Context Specialist)
- Processing indicator (when AI is working)
- AI-detected fields panel (auto-filled data from URL enrichment)
- "Apply" buttons to accept AI suggestions
- Grounding sources indicator (URL Context, Google Search)
- **Error State:** If enrichment fails, show "Manual Entry" fallback button

---

## Step 2: AI Analysis

### Wireframe

```
┌─────────────┬──────────────────────────────┬─────────────────┐
│ CONTEXT     │ WORK                         │ INTELLIGENCE    │
│             │                              │                 │
│ [Logo]      │ Step 2: AI Analysis          │ [Advisor Card]  │
│             │                              │                 │
│ Step 1 ✓    │ ┌────────────────────────┐  │ [Processing]    │
│ Step 2 ●    │ │ Startup Overview       │  │                 │
│ Step 3 ○    │ │ • Value Proposition    │  │ [Readiness]     │
│ Step 4 ○    │ │ • Key Features         │  │ Score: 72/100  │
│             │ │ • Target Audience      │  │                 │
│ [Save Later]│ └────────────────────────┘  │ Categories:     │
│             │                              │ • Product: 75   │
│             │ ┌────────────────────────┐  │ • Market: 70    │
│             │ │ Founder Identity       │  │ • Team: 80      │
│             │ │ • Founder backgrounds  │  │ • Clarity: 65   │
│             │ │ • Team strength        │  │                 │
│             │ └────────────────────────┘  │ [Recalculate]   │
│             │                              │                 │
│             │ ┌────────────────────────┐  │ Recommendations:│
│             │ │ Competitor Intel       │  │ • Improve...    │
│             │ │ • Competitor 1         │  │ • Focus on...   │
│             │ │ • Competitor 2         │  │ • Consider...   │
│             │ │ [AI Re-scan]          │  │                 │
│             │ └────────────────────────┘  │                 │
│             │                              │                 │
│             │ ┌────────────────────────┐  │                 │
│             │ │ Detected Signals      │  │                 │
│             │ │ [B2B SaaS] [Revenue]  │  │                 │
│             │ └────────────────────────┘  │                 │
│             │                              │                 │
│             │ ┌────────────────────────┐  │                 │
│             │ │ Readiness Score        │  │                 │
│             │ │ 72/100 [Progress Bar]  │  │                 │
│             │ │ [Recalculate]          │  │                 │
│             │ └────────────────────────┘  │                 │
│             │                              │                 │
│             │ [← Back]        [Next →]    │                 │
└─────────────┴──────────────────────────────┴─────────────────┘
```

### Panel Breakdown

**Left (Context):**
- Step progress (Step 1 completed ✓, Step 2 active ●)
- "Save Later" button
- Navigation

**Mobile Note:** On screens < 1280px (xl breakpoint), the Right (Intelligence) panel is hidden. Consider adding a "Sparkles" icon toggle in the header to show AI panel as overlay (not currently implemented in startupai16L).

**Mobile Feedback (CRITICAL):**
- When AI enrichment completes (URL, context, founder), show toast notification: "AI enrichment complete - tap sparkle icon to view"
- If enrichment fails (403, 404, timeout), show error toast with "Manual Entry" button
- Toast notifications required for all AI actions when right panel is hidden

**Main (Work):**
- Analysis cards:
  - Startup Overview (value prop, features, audience)
  - Founder Identity (backgrounds, team strength)
  - Website Insights (extracted insights)
  - Competitor Intel (competitors array with "AI Re-scan")
  - Detected Signals (signal badges)
  - Research Queries (queries used)
  - Readiness Score (0-100 with "Recalculate" button)

**Right (Intelligence):**
- Advisor card (Atlas - Market Analyst)
- Processing indicator
- Readiness score breakdown (categories)
- Recommendations (actionable items)
- "Recalculate" button

---

## Step 3: Interview

### Wireframe

```
┌─────────────┬──────────────────────────────┬─────────────────┐
│ CONTEXT     │ WORK                         │ INTELLIGENCE    │
│             │                              │                 │
│ [Logo]      │ Step 3: Smart Interviewer     │ [Advisor Card]  │
│             │                              │                 │
│ Step 1 ✓    │ Question 2 of 5              │ [Processing]    │
│ Step 2 ✓    │ [Progress: ████░░░░░ 40%]   │                 │
│ Step 3 ●    │                              │ [Signals]       │
│ Step 4 ○    │ How many active users?       │ • Pre-revenue   │
│             │                              │ • Early traction│
│ [Save Later]│ ○ None yet                   │                 │
│             │ ● 1-100                      │ [Question Info] │
│             │ ○ 100-1000                   │ Topic: Traction │
│             │ ○ 1000+                      │                 │
│             │                              │ Why this matters│
│             │ [Why this matters:           │ User growth...  │
│             │  User growth signals...]      │                 │
│             │                              │                 │
│             │ [← Back] [Skip] [Continue →] │                 │
└─────────────┴──────────────────────────────┴─────────────────┘
```

### Panel Breakdown

**Left (Context):**
- Step progress (Steps 1-2 completed ✓, Step 3 active ●)
- "Save Later" button
- Navigation

**Main (Work):**
- Question display (current question text)
- Progress indicator ("X of 5 questions" with progress bar)
- Answer options (radio buttons for multiple_choice)
- "Why this matters" explanation
- Navigation buttons (Back, Skip, Continue)

**Right (Intelligence):**
- Advisor card (Sage - Strategy Advisor)
- Processing indicator (when processing answer)
- Detected signals (real-time updates as answers are processed)
- Question context (topic, why it matters)
- Interview guidance

---

## Step 4: Review & Completion

### Wireframe

```
┌─────────────┬──────────────────────────────┬─────────────────┐
│ CONTEXT     │ WORK                         │ INTELLIGENCE    │
│             │                              │                 │
│ [Logo]      │ Step 4: Review & Score       │ [Advisor Card]  │
│             │                              │                 │
│ Step 1 ✓    │ ┌────────────────────────┐  │ [Processing]    │
│ Step 2 ✓    │ │ Investor Score         │  │                 │
│ Step 3 ✓    │ │ 68/100 [Progress Bar]  │  │ [Investor Score]│
│ Step 4 ●    │ │                        │  │ 68/100          │
│             │ │ Team: 75  Traction: 60 │  │                 │
│ [Save Later]│ │ Market: 70 Product: 65 │  │ Breakdown:      │
│             │ │ Fundraising: 70        │  │ • Team: 75       │
│             │ │ [Recalculate]          │  │ • Traction: 60  │
│             │ └────────────────────────┘  │ • Market: 70     │
│             │                              │ • Product: 65    │
│             │ ┌────────────────────────┐  │ • Fundraising: 70│
│             │ │ AI Summary             │  │                 │
│             │ │ Executive Summary:     │  │ [Recommendations]│
│             │ │ Your startup shows...  │  │ • Improve...    │
│             │ │                        │  │ • Focus on...   │
│             │ │ Strengths:            │  │                 │
│             │ │ • Strong team         │  │                 │
│             │ │ • Clear value prop     │  │                 │
│             │ │                        │  │                 │
│             │ │ Improvements:          │  │                 │
│             │ │ • Increase traction   │  │                 │
│             │ │ [Regenerate]          │  │                 │
│             │ └────────────────────────┘  │                 │
│             │                              │                 │
│             │ ┌────────────────────────┐  │                 │
│             │ │ Traction & Funding     │  │                 │
│             │ │ MRR: Pre-revenue       │  │                 │
│             │ │ Users: 0-100           │  │                 │
│             │ │ Growth: Not set        │  │                 │
│             │ │ Fundraising: Planning   │  │                 │
│             │ │ Team Size: 2-3 co-founders│              │
│             │ │ PMF Stage: Early signals│  │                 │
│             │ └────────────────────────┘  │                 │
│             │                              │                 │
│             │ [← Back] [Complete Setup →] │                 │
└─────────────┴──────────────────────────────┴─────────────────┘
```

### Panel Breakdown

**Left (Context):**
- Step progress (Steps 1-3 completed ✓, Step 4 active ●)
- "Save Later" button
- Navigation

**Main (Work):**
- Investor Score Card (0-100 with category breakdown)
- AI Summary Card (executive summary, strengths, improvements)
- Traction & Funding Summary (MRR, Users, Growth, Fundraising from interview)
- Team Size Summary (from Q4: solo, 2-3 co-founders, 4-10 people, 10+ people)
- PMF Stage Summary (from Q5: searching, early signals, strong indicators, achieved)
- "Complete Setup" button

**Right (Intelligence):**
- Advisor card (Nova - Investor Relations)
- Processing indicator
- Investor score breakdown (categories with scores)
- Recommendations (actionable items to improve score)
- "Recalculate" button

---

## Layout Specifications

### Panel Dimensions

| Panel | Width | Purpose | Content |
|-------|-------|---------|---------|
| **Left (Context)** | 256px fixed | Navigation, progress | Step progress, logo, save later |
| **Main (Work)** | flex (remaining) | Primary content | Forms, cards, actions |
| **Right (Intelligence)** | 320px fixed | AI features | Advisor, AI suggestions, data |

### Responsive Behavior

**Desktop (≥1280px / xl breakpoint):**
- All 3 panels visible
- Left: 256px (`w-64`, `lg:flex` = 1024px+)
- Main: flex (remaining space)
- Right: 320px (`w-80`, `xl:block` = 1280px+)

**Tablet (1024px-1279px / lg breakpoint):**
- Left: 256px visible (`lg:flex`)
- Main: flex (remaining space)
- Right: Hidden (`xl:block` requires 1280px+)

**Mobile (<1024px):**
- Left: Hidden (`lg:flex` requires 1024px+)
- Mobile header shows logo + step indicator
- Main: Full width
- Right: Hidden (can be toggled with sparkle icon)

---

## Data Flow in 3-Panel Layout

```
┌─────────────┐
│   CONTEXT   │  ← Reads: current_step, completed_steps
│             │  → Updates: current_step (on click)
└─────────────┘
       │
       ↓
┌─────────────┐
│    WORK     │  ← Reads: form_data, session data
│             │  → Updates: form_data (on input)
│             │  → Triggers: AI actions (enrich, calculate)
│             │  → Error Handling: Manual fallback on AI failure
└─────────────┘
       │
       ↓
┌─────────────┐
│INTELLIGENCE │  ← Receives: AI results, extractions
│             │  → Displays: AI suggestions, scores
│             │  → User: Applies suggestions to Work panel
│             │  → Mobile: Toast notification when hidden
└─────────────┘

**Data Persistence (CRITICAL):**
- All dual saves (form_data + column-level) use atomic transactions
- If transaction fails, rollback all changes (no partial state)
- Signal arrays deduplicated before saving (max 20 unique signals)
```

---

## Verification Checklist

**Layout:**
- [ ] Left panel: 256px fixed width
- [ ] Main panel: flex (takes remaining space)
- [ ] Right panel: 320px fixed width
- [ ] All panels scroll independently
- [ ] Responsive behavior works (mobile/tablet/desktop)

**Step 1:**
- [ ] Form in Main panel
- [ ] AI suggestions in Right panel
- [ ] Progress in Left panel

**Step 2:**
- [ ] Analysis cards in Main panel
- [ ] Readiness score in Right panel
- [ ] Progress in Left panel

**Step 3:**
- [ ] Question in Main panel
- [ ] Signals in Right panel
- [ ] Progress in Left panel

**Step 4:**
- [ ] Review cards in Main panel
- [ ] Investor score in Right panel
- [ ] Progress in Left panel

---

*Wireframes created: 2026-01-25*  
*Layout: 3-panel (Context | Work | Intelligence)*  
*Status: Production-ready*

---

## Quick Reference

**Layout:** Left 256px | Main flex | Right 320px  
**Breakpoints:** Left visible ≥1024px, Right visible ≥1280px  
**Advisors:** Luna (Step 1), Atlas (Step 2), Sage (Step 3), Nova (Step 4)
