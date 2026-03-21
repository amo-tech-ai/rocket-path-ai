# Prompt 08 — Plan Mode Implementation

> **Source:** Progress Tracker Section 10, Tasks PM1-PM10 | **Priority:** P1 | **Phase:** Deferred — Plan Mode
> **Prerequisite:** Pipeline Fixes (archived) — DONE. See `archive/11-pipeline-fixes.md`.
>
> ### Skills Required
> | Sub-prompt | Primary Skill | Secondary Skills |
> |:----------:|---------------|------------------|
> | 04A | `/frontend-design` | `/api-wiring` |
> | 04B | `/frontend-design` | — |
> | 04C | `/gemini`, `/edge-functions` | `/api-wiring` |
> | 04D | `/frontend-design` | — |
> | 04E | `/frontend-design`, `/gemini` | — |
> | 09 | `/gemini` | `/sdk-agent` |

### Progress Tracker

| # | Task | Status | % | Blocker / Note |
|---|------|:------:|--:|----------------|
| PM1 | Plan/Execute mode toggle | 🔴 Not Started | 0% | No mode state in UI — chat goes straight to Generate |
| PM2 | Clarifying questions (no assumptions) | 🟡 Partial | 40% | 4 hardcoded questions — doesn't verify understanding |
| PM3 | Research during chat (lightweight) | 🟡 Partial | 30% | Research only happens inside pipeline, not during Q&A |
| PM4 | Explainable validation report | 🟢 Complete | 100% | Scores + trace drawer with citations working |
| PM5 | Editable validation plan output | 🔴 Not Started | 0% | Report is read-only — no inline editing |
| PM6 | Founder review & approval gate | 🔴 Not Started | 0% | No pre-pipeline review step |
| PM7 | "What if" scenario questions | 🔴 Not Started | 0% | No follow-up exploration on completed report |
| PM8 | Safe exploration (draft mode) | 🟡 Partial | 30% | Pipeline creates DB records immediately |
| PM9 | Parallel agents post-approval | 🔴 Not Started | 0% | No approval → execution handoff |
| PM10 | Living strategy artifact (versioned) | 🔴 Not Started | 0% | Reports are snapshots, not versioned |
| **Overall** | **10 features** | | **20%** | **1 complete, 3 partial, 6 not started** |

---

## Context

Plan Mode is the philosophical core of StartupAI: "AI proposes, Humans decide, Systems execute." The concept is fully documented in `plan-mode.md` but only 2 of 10 features are partially implemented in the actual product. The gap between vision and reality is significant.

Plan Mode should mirror how experienced founders and VCs think — understand, pressure-test, plan, then execute. Not: generate, hope, fix later.

---

## Prompt 4A: Plan Mode vs Execute Mode Toggle

> **Tracker ref:** PM1 — Not built

### Current State

The validator chat goes directly from user input to "Click Generate" which triggers the full 7-agent pipeline. There is no intermediate "plan" step where the founder reviews, challenges, and approves before the system does heavy work.

### Why This Matters

**Real-world example — why founders need a plan before execution:**

Sarah is a first-time founder exploring three ideas:
1. AI tutoring for K-12 students
2. AI-powered recipe customization for dietary restrictions
3. AI sales coaching for B2B SDRs

In the current system, she has to run the full validation pipeline for each idea — 45 seconds per run, generating a 14-section report each time. She doesn't need a full report yet. She needs quick, lightweight research to narrow down to one idea worth deep-diving.

With Plan Mode:
- Sarah describes all three ideas in chat
- The system does lightweight research during the conversation (market size, top 3 competitors, one key risk for each)
- She reviews the quick comparison and picks the AI sales coaching idea
- She switches to "Execute Mode" and runs the full pipeline only for that one idea
- Result: She saved 90 seconds of pipeline time and got to a better decision faster

**Another example — experienced founder with strong opinions:**

Marcus has been in fintech for 10 years and is building a cross-border payments platform. He already knows the market, competitors, and regulatory landscape better than any AI model. What he wants from the validation tool is:
- To challenge his blind spots ("What haven't you considered?")
- To stress-test his assumptions ("Your TAM assumption of $800B includes corporate FX — are you really competing with banks?")
- To organize his thinking into a structured plan he can share with co-founders and investors

In Execute Mode, the system would generate a report that tells Marcus things he already knows. In Plan Mode, it would ask probing questions, surface risks he hadn't considered, and produce an editable plan he can refine.

### Design

**Two modes accessible from the validator chat:**

1. **Plan Mode** (default for new ideas)
   - Read-only exploration: research happens during the conversation, not after
   - No database records created until the founder approves
   - Output: A structured "Validation Plan" with assumptions, key questions, and recommended validation steps
   - The founder can edit any section before approving
   - Approve button transitions to Execute Mode

2. **Execute Mode** (activated after approval or manually toggled)
   - Full 7-agent pipeline runs
   - Database records created (session, runs, report)
   - Output: The complete 14-section validation report
   - This is the current system behavior

**Mode toggle behavior:**
- Visible in the header area of the validator chat
- Plan Mode shows a research icon, Execute Mode shows a rocket icon
- Switching from Execute back to Plan preserves the conversation context
- A subtle indicator shows which mode is active at all times

**What changes in Plan Mode chat:**
- Follow-up questions are more probing and challenging (not just data gathering)
- The system shows lightweight research results inline as the conversation progresses
- Instead of a "Generate" button, there's a "Create Plan" button
- The plan output is an editable document, not a read-only report

### Real-World Plan Mode Conversation Flow

Founder: "I want to build an AI-powered personal finance advisor for Gen Z"

Plan Mode AI response: "Interesting space. Let me pull some quick context.

**Quick snapshot:**
- Personal finance app market: $1.2B (2025), growing 12% CAGR
- Top players: Mint (Intuit), YNAB, Robinhood, Acorns
- Gen Z finance trend: 67% use mobile-first budgeting tools

**Initial read:** The market is crowded but Gen Z-specific positioning has potential. Big question: how is this different from the AI features Mint and YNAB are already adding?

Let me ask you a few things to sharpen the analysis..."

vs. Execute Mode AI response: "Got it! Click Generate to run the full validation analysis."

The Plan Mode response shows the AI is doing research and thinking — not just collecting input to process later.

### Acceptance Criteria

- Toggle between Plan and Execute mode is visible and easy to use
- Plan Mode does not create database records until explicitly approved
- Plan Mode shows inline research results during conversation
- Plan Mode produces an editable "Validation Plan" document
- Approve button in Plan Mode transitions to Execute Mode and triggers pipeline
- Mode state persists across page refreshes

---

## Prompt 4B: Founder Approval Gate

> **Tracker ref:** PM6, PM8 — Not built

### Current State

The validation pipeline fires immediately when the founder clicks "Generate." There is no review step where the founder can see what the system is about to analyze and confirm or adjust before heavy processing begins.

### Why This Matters

**Real-world example — why approval matters:**

David describes his startup: "A marketplace connecting local farmers with restaurants for direct produce sourcing."

The system extracts:
- Industry: Agriculture/Food service
- Type: Marketplace
- Revenue model: Commission per transaction (inferred)
- Target: Small restaurants (inferred)

But David actually wants to target **corporate cafeterias**, not restaurants. And his revenue model is **subscription for farmers** (guaranteed sales), not commission. If the pipeline runs with these wrong assumptions, the entire report is misaligned.

With an approval gate:
1. David sees: "Here's what I understood. Before I run the full analysis, please confirm:"
   - Industry: Agriculture/Food service
   - Target customer: Restaurants
   - Revenue model: Commission per transaction
   - Key competitors to research: FarmLogix, Harvie, Local Line
2. David corrects: "Target is corporate cafeterias, not restaurants. Revenue is subscription for farmers."
3. The system adjusts the profile before running the pipeline
4. The report is accurate from the start

**Another example — preventing wasted compute:**

Lisa describes an idea but realizes halfway through the conversation that it's too similar to something she saw on Product Hunt last week. Without an approval gate, she might click Generate out of curiosity, waste 45 seconds of pipeline time, and never look at the report.

With an approval gate, the system shows "Ready to analyze" with a clear summary. Lisa sees it, thinks "actually, this isn't worth a full analysis," and adjusts her idea or moves on. The system saved resources and Lisa saved time.

### Design

**Pre-pipeline review screen:**

After the chat Q&A is complete and before the pipeline runs, show the founder:

1. **Extracted Profile Summary** — What the system understood
   - Problem statement (1 sentence)
   - Target customer (specific)
   - Solution approach
   - Industry + startup type
   - Revenue model (if mentioned)
   - Competitive context

2. **What the Pipeline Will Analyze** — Setting expectations
   - Market sizing for [industry]
   - Competitors in [space]
   - Scoring across 7 dimensions
   - MVP roadmap recommendation
   - Technology feasibility assessment

3. **Editable Corrections** — Inline editing for any misunderstood fields
   - Click any field to correct
   - Add context the system might have missed
   - Remove fields that don't apply

4. **Action Buttons**
   - "Run Full Analysis" — Proceed with pipeline
   - "Edit Profile" — Go back to chat with corrections applied
   - "Save as Draft" — Store the profile without running the pipeline

**Real-world analogy:**
This is like a doctor reviewing your symptoms before ordering tests. They say "Based on what you've described, I want to check X, Y, and Z. Does that sound right?" before sending you to the lab. You want the chance to say "Actually, I forgot to mention this symptom" before expensive tests run.

### Acceptance Criteria

- Founder sees a summary of extracted data before pipeline runs
- Each field is editable inline
- Corrections update the startup profile before it's sent to agents
- "Save as Draft" stores the profile without triggering the pipeline
- Approval is recorded in the database (timestamp, what was approved)
- Pipeline only runs after explicit "Run Full Analysis" click

---

## Prompt 4C: Research During Chat (Lightweight)

> **Tracker ref:** PM3 — Partially built (research only happens inside pipeline, not during chat)

### Current State

Research only happens after the founder clicks "Generate" — inside the pipeline's ResearchAgent and CompetitorAgent. During the chat Q&A phase, the system collects input but shows no intelligence or research back to the founder.

### Why This Matters

**Real-world example — intelligent chat vs dumb form:**

Current experience (dumb form):
- Founder: "I'm building AI-powered contract analysis for law firms"
- AI: "Who specifically experiences this problem?"
- Founder: "Partners and associates at mid-size law firms"
- AI: "How are people currently solving this?"
- Founder: "Manual review, sometimes with Kira or Luminance"
- AI: "What makes your solution different?"
- ...just collecting answers like a survey form

Desired experience (intelligent chat):
- Founder: "I'm building AI-powered contract analysis for law firms"
- AI: "Legal tech is a fast-moving space — Kira Systems was recently acquired by Litera, and Harvey AI just raised $80M for LLM-based legal tools. Let me ask a few questions to understand how you'd position against them.

  Who are your target customers — BigLaw, mid-market, or solo practitioners? This affects everything from pricing to sales cycle."

- Founder: "Mid-market firms, 50-500 attorneys"
- AI: "Smart targeting. Mid-market firms are underserved — BigLaw uses Kira and Harvey, solos can't afford AI tools, but mid-market firms often have the pain without the budget for enterprise solutions. Average contract review for a 200-attorney firm takes 15-20 hours per deal.

  How are your target firms handling this today — and do you have any early conversations with them?"

The intelligent version shows the founder that the AI understands the domain, which builds trust and elicits better, more specific responses. The founder thinks "this tool gets my space" instead of "this is just a questionnaire."

### Design

**Lightweight research calls during chat:**

After the founder's first message, trigger a fast, focused lookup:
1. Identify the industry vertical
2. Query knowledge_chunks for 3-5 relevant facts (market size, top competitors, key trend)
3. Use Gemini Flash for speed (not Pro — this needs to be fast, under 3 seconds)
4. Weave findings naturally into the next AI response

**What to surface (and what not to):**

Surface during chat:
- Market size headline number ("$28B market by 2027")
- Top 2-3 competitor names with brief context
- One industry-specific insight or trend
- One smart question informed by the research

Do NOT surface during chat:
- Full TAM/SAM/SOM breakdown (save for report)
- Detailed competitor SWOT (save for report)
- Financial projections (save for report)
- Scoring (save for report)

The chat should tease intelligence, not dump it. Like a great advisor who drops one sharp observation that makes you think, not a consultant who reads you their entire slide deck.

**Real-world examples of lightweight research responses:**

Founder: "Building a platform for personal stylists to manage their clients digitally"
AI: "Fashion-tech is interesting — the personal styling market is about $5B and growing 8% annually, driven by platforms like Stitch Fix (public, $1.7B revenue) and Trunk Club (acquired by Nordstrom). Most independent stylists still use WhatsApp and spreadsheets.

What's your angle — are you building for the stylist as a SaaS tool, or for the client as a marketplace to find stylists?"

Founder: "Building a drone inspection service for commercial roofing"
AI: "Drone inspection is taking off in construction — the market hit $4.2B in 2025, and companies like DroneUp and Skydio are focusing on infrastructure. But commercial roofing is more niche, dominated by traditional inspectors charging $500-1,500 per roof.

Are you selling the drone hardware, the inspection software, or the full service (drone + report)? That changes the business model completely."

### Acceptance Criteria

- First follow-up question includes 2-3 relevant industry facts
- Research response appears within 3 seconds (Gemini Flash)
- Research is woven naturally into conversation, not presented as a data dump
- Chat feels intelligent and domain-aware, not like a generic questionnaire
- If no curated data exists for the industry, falls back to general startup context gracefully
- Research shown in chat does not duplicate what the full report will show (complementary, not redundant)

---

## Prompt 4D: Editable Validation Plan Output

> **Tracker ref:** PM5 — Not built

### Current State

The pipeline produces a read-only validation report. Founders can view it but cannot edit, challenge, or annotate any section. This contradicts the Plan Mode philosophy that founders should be able to "edit assumptions, reject sections, adjust scope."

### Why This Matters

**Real-world example — why editable plans matter:**

Jennifer validates her EdTech startup and the report says:
- TAM: $350B global education market
- Revenue model recommendation: B2B SaaS, $50/student/year
- Key risk: "Long enterprise sales cycles in education (6-12 months)"

Jennifer knows from her experience that:
- Her addressable market is actually K-12 supplemental education ($28B), not the full $350B
- She's planning a B2C freemium model, not B2B SaaS
- The real risk isn't sales cycles — it's parental approval requirements for student data

In the current system, she can't correct any of this. The report is frozen. She has to mentally track what's right and wrong, and the next time she revisits the report, she has to remember all her corrections.

With an editable plan:
- She clicks on the TAM number and edits it to $28B with a note: "Narrowed to K-12 supplemental"
- She changes the revenue model from B2B SaaS to B2C freemium
- She adds a custom risk: "COPPA compliance for under-13 users requires parental consent flow"
- She flags the sales cycle risk as "not applicable" for her B2C model
- Her co-founder can see all the edits and add their own perspectives

The plan becomes a living document that reflects the founder's actual knowledge, not just the AI's analysis.

### Design

**Editable elements in the validation plan:**

1. **Assumptions list** — Each assumption has an "agree/disagree/modify" toggle
   - Example assumption: "Target customers are willing to pay $50/month"
   - Founder can change to: "Validated at $30/month through 15 customer interviews"

2. **Market numbers** — Inline editing for TAM, SAM, SOM with notes
   - When edited, show both: "AI estimate: $350B" → "Founder estimate: $28B (K-12 supplemental only)"

3. **Competitor list** — Add, remove, or reclassify competitors
   - Add a competitor the AI missed
   - Change threat level from "medium" to "high" with reasoning
   - Mark a competitor as "not actually competitive" with explanation

4. **Risk items** — Reorder, add, remove, change severity
   - Add industry-specific risks the AI didn't know about
   - Dismiss risks that don't apply with a reason

5. **MVP roadmap** — Adjust phases, priorities, and timeline
   - Move features between phases
   - Add features the AI didn't suggest
   - Mark a suggested feature as "not building this" with reasoning

6. **Custom annotations** — Free-text notes on any section
   - "My advisor disagrees with this assessment because..."
   - "We already validated this with 50 customer interviews"
   - "This is our biggest unknown — need to test before investing"

**Version tracking:**
- Each edit creates a new version
- Diff view shows what changed between versions
- History shows who edited what and when (for team plans)

### Acceptance Criteria

- Every section of the validation plan has inline edit capability
- Edits preserve the original AI analysis alongside founder corrections
- Version history tracks all changes
- Editable plan can be exported or shared
- Changes can optionally trigger a re-score (if the founder edits a key assumption, the scoring could update)

---

## Prompt 4E: "What If" Scenario Questions

> **Tracker ref:** PM7 — Not built

### Current State

Once a report is generated, there is no way to ask follow-up "what if" questions. The coach panel exists for explaining sections but doesn't support hypothetical scenario exploration.

### Why This Matters

**Real-world example — why "what if" questions are essential:**

Tom gets his validation report for a food delivery startup targeting suburbs. Score: 65 (CAUTION). The report says competition from DoorDash and Uber Eats is the primary concern.

Tom's immediate questions:
- "What if I focus only on small towns with no DoorDash coverage? Does the score change?"
- "What if I partner with local restaurants as an exclusive delivery partner? How does that affect competition risk?"
- "What if I switch from commission-based to a subscription model for families? Does unit economics improve?"

Currently, Tom would have to start an entirely new validation with a modified description to explore each scenario. That's three more 45-second pipeline runs, and he loses the context of the original analysis.

With "what if" capability:
- Tom types "what if I focus only on towns without DoorDash?" in the coach panel
- The system quickly re-evaluates the competition dimension: "Score improves from 35 to 62 — significantly less competition in underserved towns, but TAM drops from $180B to $12B. Trade-off: bigger fish in a smaller pond."
- Tom types "what if I add subscription pricing for families?"
- System: "Unit economics improve — predictable revenue reduces churn risk, LTV increases from $180 to $420. But subscriber acquisition is harder than per-order conversion. Score change: +8 on Business Model, -3 on Growth."

Tom can explore 5 scenarios in 2 minutes instead of running 5 full pipelines.

### Design

**"What if" interaction model:**

1. Available on the completed report page, in the coach panel
2. Free-text input: "What if [scenario]?"
3. System identifies which scoring dimensions are affected
4. Provides a quick delta analysis (not a full re-run)
5. Shows: original score → adjusted score → reasoning

**Types of "what if" questions to support:**

- Market pivot: "What if I target [different customer segment]?"
- Model change: "What if I switch to [different revenue model]?"
- Competitive response: "What if [competitor] launches the same feature?"
- Geographic shift: "What if I launch in [different region] first?"
- Feature scope: "What if I remove [feature] from the MVP?"
- Pricing change: "What if I price at [different price point]?"

**Real-world "what if" example outputs:**

Question: "What if I target enterprise instead of SMB?"
Response:
- Market size: Larger deal sizes ($50K/year vs $500/month), but TAM by customer count drops 90%
- Competition: More intense — you'd face Salesforce, HubSpot with enterprise features. Score: -15
- Sales cycle: Extends from 2 weeks (SMB) to 3-6 months (enterprise). Burn rate implications.
- Revenue potential: Higher per-customer, but slower growth curve
- Net score change: Overall -5 (higher revenue potential offset by harder sales)

### Acceptance Criteria

- "What if" input is available on the report page
- System identifies affected dimensions automatically
- Response shows score deltas with reasoning
- Supports at least 5 types of scenario questions
- Response time under 10 seconds (lightweight re-evaluation, not full pipeline)
- Scenario history is saved so the founder can compare multiple what-if paths
