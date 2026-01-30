---
task_number: "03"
title: "Lean Canvas Builder"
category: "Lean Canvas"
subcategory: "Lean Canvas Editor"
phase: 2
priority: "P1"
status: "Open"
percent_complete: 10
owner: "Frontend Developer"
---

# Lovable Prompt: Lean Canvas Builder

## Summary Table

| Aspect | Details |
|--------|---------|
| **Screen** | `/canvas` - Lean Canvas builder |
| **Features** | 9-box canvas editor, AI fill suggestions, box-by-box guidance, export, version history |
| **Agents** | Canvas Builder (Gemini Pro), Box Advisor (Gemini Flash), Completeness Scorer (Claude) |
| **Use Cases** | Business model design, investor prep, team alignment, pivot planning |
| **Duration** | 15-20 minutes (full canvas), 5 min per box |
| **Outputs** | Complete lean canvas, completeness score, improvement suggestions |

---

## Description

Build an interactive Lean Canvas editor with AI-powered assistance for each of the 9 boxes. The canvas pre-fills from onboarding data, suggests content based on industry best practices, and scores completeness. Each box has contextual AI help that understands the industry and suggests specific, actionable content.

---

## Purpose & Goals

**Purpose:** Help founders translate their startup idea into a structured business model canvas that investors and teams can quickly understand.

**Goals:**
1. Pre-fill boxes from existing profile/onboarding data
2. Provide industry-specific suggestions for each box
3. Score completeness and quality (not just "filled vs. empty")
4. Enable iterative refinement with version history
5. Export canvas for sharing with advisors/investors

**Outcomes:**
- 80%+ of users complete all 9 boxes
- Canvas reflects industry-appropriate language and metrics
- Data syncs to pitch deck slides automatically

---

## Real World Examples

**Example 1: FinTech Canvas - Channels Box**
> Lisa works on her payment startup canvas. When she reaches "Channels," the AI suggests: "For B2B FinTech, effective channels include: (1) Bank partnerships and integrations, (2) Compliance conferences like Money20/20, (3) Referrals from existing finance clients. Your competitors use these channels: [Stripe, Plaid]." This beats the generic "social media, SEO, partnerships" suggestion.

**Example 2: Healthcare Canvas - Cost Structure**
> Dr. Chen fills out his healthcare AI canvas. The Cost Structure box AI says: "Healthcare AI typically has these cost buckets: (1) Clinical validation studies ($200K-$500K), (2) HIPAA compliance infrastructure ($50K-$100K), (3) Medical advisory board ($20K-$50K/year). Investors expect you to know these numbers." This prepares him for investor questions.

**Example 3: Marketplace Canvas - Unique Value Proposition**
> Emma builds a canvas for her freelancer marketplace. The UVP box AI suggests: "Marketplaces need a clear answer to 'Why won't users just go to Upwork?' Consider: (1) Vertical focus (designers only), (2) Guarantee (money back if unhappy), (3) Speed (48-hour delivery). Your UVP should be 1 sentence that answers the 'Why you?' question."

---

## 3-Panel Layout

### Left Panel: Context

| Element | Content |
|---------|---------|
| **Canvas Overview** | Mini-map of 9 boxes with fill status |
| **Completeness Score** | Percentage with quality indicators |
| **Box Navigator** | Quick jump to any box |
| **Version History** | Previous saves with timestamps |
| **Industry Badge** | Selected industry affecting suggestions |
| **Export Button** | PDF, PNG, share link |

### Main Panel: Work Area

| Mode | Main Content |
|------|--------------|
| **Full Canvas View** | 3x3 grid of all boxes, click to expand |
| **Single Box View** | Expanded editor with larger textarea, AI suggestions below |
| **Comparison View** | Side-by-side with competitor canvas (if available) |
| **Print View** | Clean layout for export |

**9 Boxes Layout:**
```
┌─────────────────┬─────────────────┬─────────────────┐
│    PROBLEM      │   SOLUTION      │   UNIQUE VALUE  │
│   (Top 3)       │   (Top 3)       │   PROPOSITION   │
├─────────────────┼─────────────────┼─────────────────┤
│  UNFAIR         │   CHANNELS      │   CUSTOMER      │
│  ADVANTAGE      │                 │   SEGMENTS      │
├─────────────────┼─────────────────┼─────────────────┤
│ KEY METRICS     │ COST STRUCTURE  │ REVENUE STREAMS │
└─────────────────┴─────────────────┴─────────────────┘
```

### Right Panel: Intelligence

| Element | Behavior |
|---------|----------|
| **Box Advisor** | Context-aware suggestions for current box |
| **Industry Benchmarks** | "Typical {industry} startups list these metrics..." |
| **Examples** | Real startup examples for current box |
| **Quality Score** | How well-written this box is (specificity, clarity) |
| **Cross-Box Consistency** | "Your problem doesn't match your solution" alerts |
| **Competitor Insights** | What competitors say in this box |

---

## Frontend/Backend Wiring

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `LeanCanvasEditor` | Parent container, view mode switching |
| `CanvasGrid` | 3x3 responsive grid layout |
| `CanvasBox` | Individual box with textarea and AI button |
| `BoxAdvisor` | Right panel AI suggestions |
| `CompletenessScore` | Visual score indicator |
| `VersionHistory` | Sidebar with previous saves |
| `CanvasExport` | Export modal (PDF, PNG, link) |

### Backend Edge Functions

| Function | Trigger | Input | Output |
|----------|---------|-------|--------|
| `lean-canvas-agent` | "Help me fill this" button | box_name, current_content, industry | suggestions |
| `industry-expert-agent` | Box focus | action=get_benchmarks, industry | benchmarks for this box |
| `prompt-pack` | "Generate canvas" | action=run, pack_slug=lean-canvas | full canvas draft |

### Data Flow

```
Profile Data → Canvas Pre-fill → User Edits → AI Enhancement
      ↓              ↓               ↓              ↓
 problem_statement  Problem box    User types    Better version
 target_customer    Segments box   Manually      Industry-specific
      ↓              ↓               ↓              ↓
 Auto-populate    First draft    Live save     Quality score
```

---

## Supabase Schema Mapping

| Table | Fields Used | When Updated |
|-------|-------------|--------------|
| `lean_canvases` | `problem[]`, `customer_segments[]`, `unique_value_proposition`, `solution[]`, `channels[]`, `revenue_streams[]`, `cost_structure[]`, `key_metrics[]`, `unfair_advantage`, `completeness_score` | Every save |
| `startups` | Read: `problem_statement`, `target_customer` | Pre-fill |
| `ai_runs` | `action=canvas_*, industry_context_used`, `feature_context=lean_canvas` | AI calls |

---

## Edge Function Mapping

| Action | Function | Model | Knowledge Slice |
|--------|----------|-------|-----------------|
| `suggest_box` | lean-canvas-agent | Gemini 3 Flash | gtm_patterns, benchmarks |
| `generate_canvas` | prompt-pack | Gemini 3 Pro | Full playbook |
| `validate_canvas` | industry-expert-agent | Gemini 3 Flash | benchmarks, warning_signs |
| `score_completeness` | lean-canvas-agent | Claude Sonnet | investor_expectations |
| `get_examples` | industry-expert-agent | - | success_stories |

---

## AI Agent Behaviors

### Canvas Builder Agent
- **Trigger:** "Generate Full Canvas" button
- **Autonomy:** Act with approval (generates draft, user edits)
- **Behavior:** Creates complete 9-box canvas from profile data
- **Output:** `{ boxes: { problem: [], solution: [], ... }, completeness: number }`

### Box Advisor Agent
- **Trigger:** User focuses on a box
- **Autonomy:** Suggest (shows hints, user types)
- **Behavior:** Provides industry-specific suggestions for current box
- **Output:** `{ suggestions: [], examples: [], tips: [] }`

### Completeness Scorer
- **Trigger:** Auto-save (debounced)
- **Autonomy:** Autonomous (calculates score silently)
- **Behavior:** Scores quality, not just presence, of content
- **Output:** `{ score: number, feedback: { box: string, issue: string }[] }`

---

## Box-Specific AI Context

| Box | AI Focus | Industry Examples |
|-----|----------|-------------------|
| **Problem** | Specificity, pain intensity | "FinTech: Compliance costs $X/year" |
| **Solution** | How it solves problem | "SaaS: Automates manual process" |
| **UVP** | 1 sentence, clear differentiation | "Healthcare: First FDA-cleared AI for X" |
| **Unfair Advantage** | Defensibility, moat | "Data: Proprietary dataset of 10M records" |
| **Channels** | Industry-appropriate distribution | "Enterprise: Direct sales + system integrators" |
| **Segments** | Specific customer definition | "B2B: CFOs at companies with $10M-$100M revenue" |
| **Metrics** | Industry KPIs | "Marketplace: GMV, take rate, liquidity" |
| **Cost** | Realistic breakdown | "AI: GPU costs, data acquisition, compliance" |
| **Revenue** | Pricing model fit | "SaaS: Usage-based for variable workloads" |

---

## Acceptance Criteria

- [ ] Canvas pre-fills from profile/onboarding data
- [ ] AI suggestions are industry-specific (not generic)
- [ ] Completeness score updates on every edit
- [ ] Box focus triggers relevant AI suggestions
- [ ] Version history allows restore to previous save
- [ ] Export works as PDF, PNG, and shareable link
- [ ] Cross-box consistency checking (problem ↔ solution match)
- [ ] Mobile responsive (stack boxes vertically)
- [ ] Keyboard navigation between boxes (Tab, Shift+Tab)
- [ ] Auto-save every 30 seconds

---

## Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `lean_canvases` table | ✅ Ready | Schema matches PRD |
| `lean-canvas-agent` edge function | ✅ Ready | Handles suggestions |
| `industry-expert-agent` | ✅ Ready | Returns benchmarks |
| Gemini 3 Pro API | ✅ Ready | For canvas generation |
| PDF export library | ⚠️ Needs selection | jsPDF or html2pdf |
| Version history UI | ⚠️ Needs design | Timeline component |
