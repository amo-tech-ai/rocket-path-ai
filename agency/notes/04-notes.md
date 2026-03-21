
● You're right — two completely different things:

  - .agents/skills/ = helps us developers write code faster
  - Edge function prompts = what founders actually experience when they use the app

  The question is: how do we take knowledge from skills.sh and put it into the production AI agents that founders interact with?

  Where Knowledge Lives Today (What Founders Actually See)

  The founder-facing AI knowledge is in exactly 3 places:

  ┌─────────────────────────────────────────────────┬────────────────────────────────────────┬────────────────────────────────────────┐
  │                    Location                     │              What's There              │           Founders See It As           │
 
  │ supabase/functions/_shared/agency-fragments.ts  │ 5 prompt fragments (scoring, composer, │ Better validation reports, smarter     │
  │                                                 │  sprint, investor, pitch deck)         │ deal scoring, RICE-scored tasks        │
  ├─────────────────────────────────────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
  │ supabase/functions/_shared/agency-chat-modes.ts │ 4 coaching mode prompts (pitch,        │ AI chat that coaches like a consultant │
  │                                                 │ growth, deal, canvas)                  │                                        │
  ├─────────────────────────────────────────────────┼────────────────────────────────────────┼────────────────────────────────────────┤
  │ supabase/functions/*/prompt.ts                  │ Per-agent system prompts               │ How each agent thinks and responds     │
  └─────────────────────────────────────────────────┴────────────────────────────────────────┴────────────────────────────────────────┘

  That's it. Everything else in .agents/skills/ is invisible to founders.

  What Skills.sh Knowledge Would Actually Change

  Here's what happens if we take knowledge from those skills and inject it into the edge functions:

  Validator Pipeline (7 agents)

  Research Agent (validator-start/agents/research.ts)

  Today's prompt tells it to find market size and trends. It does a basic Google search.

  With startup-business-analyst-market-opportunity knowledge injected:
  - Three-method TAM validation (bottom-up buyer count, top-down industry reports, value-theory willingness-to-pay)
  - Source quality hierarchy (government stats > analyst reports > news articles > founder claims)
  - Stage-appropriate sizing (pre-seed founders don't need TAM — they need serviceable obtainable market with a path to first 100
  customers)

  Scoring Agent (validator-start/agents/scoring.ts)

  Today has evidence tiers and bias detection (from agency integration). Good but generic.

  With startup-validator + startup-metrics-framework knowledge:
  - Stage-specific scoring benchmarks (a pre-revenue idea should NOT be scored on traction the same way as a startup with 500 users)
  - Validation ladder: Problem validated? → Solution validated? → Market validated? → Business model validated? Each level has specific
  evidence requirements
  - Red flag patterns by industry (e.g., marketplace = chicken-and-egg, SaaS = churn > 5% monthly, hardware = manufacturing risk)

  Composer Agent (validator-start/agents/composer.ts)

  Today writes 14-section reports with Three-Act narrative and win themes.

  With startup-financial-modeling + startup-business-models knowledge:
  - Revenue section gets actual unit economics math (LTV = ARPU x Gross Margin / Churn, CAC payback period, contribution margin)
  - Business model pattern recognition ("You're describing a marketplace — here's how marketplace unit economics work differently from
  SaaS")
  - Financial projections with assumptions table (not just "you could make $2M" but "at $49/mo, 30% monthly growth, 8% churn, 18-month
  payback = $2.1M ARR by month 24")

  MVP Agent (validator-start/agents/mvp.ts)

  Today creates practical build plans. With lean-startup + validating-startup-ideas knowledge:
  - Build-Measure-Learn loops instead of generic task lists
  - Experiment types matched to risk: highest-risk assumption gets tested first
  - Specific validation methods per stage (landing page test, concierge MVP, Wizard of Oz, smoke test) with when to use each

  AI Chat Coaching Modes (4 modes in ai-chat/index.ts)

  Practice Pitch mode — today scores 5 dimensions

  With startup-fundraising + startup-sales-execution knowledge:
  - Investor-type-specific coaching (angel pitch is different from Series A pitch)
  - Common objection bank by stage ("You have no traction" → how to answer pre-revenue vs. post-revenue)
  - Ask structure: how to frame the amount, use of funds, and milestones

  Growth Strategy mode — today finds AARRR funnel leaks

  With startup-growth-playbooks + startup-go-to-market knowledge:
  - Full channel playbooks (not just "try content marketing" but "here's the content-led growth playbook: pillar content → distribution →
  lead magnets → email nurture → conversion")
  - Stage-appropriate channels (pre-PMF = do things that don't scale, post-PMF = paid acquisition, scale = partnerships)
  - Experiment templates with real benchmarks ("landing page test: 500 visitors, 3% conversion = validated")

  Deal Review mode — today does MEDDPICC /40

  With startup-fundraising knowledge:
  - Term sheet analysis (what's standard vs. what's a red flag in a SAFE, convertible note, priced round)
  - Fundraising timeline planning (when to start, how many meetings to plan, expected conversion rate)
  - Investor-founder fit assessment (not just deal qualification but "does this investor actually help your specific type of company?")

  Canvas Coach mode — today checks specificity per box

  With lean-startup + startup-business-models knowledge:
  - Business model pattern matching ("Your canvas looks like a two-sided marketplace — here's what that means for your Key Partners and
  Revenue Streams boxes")
  - Pivot signals: when the canvas data suggests the model won't work and what to change
  - Competitive positioning frameworks baked into the coaching

  Sprint Agent (sprint-agent/index.ts)

  Today generates RICE-scored tasks with Kano classification.

  With startup-go-to-market + startup-customer-success + startup-metrics-framework knowledge:
  - Stage-aware task generation (pre-PMF tasks are fundamentally different from growth-stage tasks)
  - Metric-driven milestones ("This sprint's success metric: 10 discovery calls completed, 3 expressed willingness to pay")
  - Post-launch tasks (retention, onboarding optimization, NPS tracking) that currently don't exist

  Investor Agent (investor-agent/index.ts)

  Today does MEDDPICC, outreach timing, cold emails.

  With startup-fundraising + startup-sales-execution knowledge:
  - Fundraising readiness checklist (deck, data room, cap table, financial model) before outreach starts
  - Investor research template (thesis match, portfolio overlap, check size, stage preference)
  - Follow-up cadence by deal stage (not just "reach out this week" but a structured 6-touch sequence)

  How to Actually Do This

  The pattern is already proven — agency fragments work. The process for each skill:

  1. Read the skill from skills.sh (SKILL.md + references)
  2. Extract the frameworks, tables, methodologies (not the Claude Code instructions)
  3. Condense into a prompt fragment (500-1500 words of domain knowledge)
  4. Add as a new const export in _shared/agency-fragments.ts
  5. Import in the target edge function's prompt
  6. All new output fields are optional (backward compatible)
  7. Deploy the edge function

  Recommended Order (What Founders Would Notice Most)

  ┌──────────┬───────────────────────────────────────┬───────────────────────┬────────────────────────────────────────────────────────┐
  │ Priority │             Skill Source              │     Target Agent      │                     Founder Impact                     │
  ├──────────┼───────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
  │ 1        │ startup-financial-modeling            │ Composer + Pitch Deck │ Reports go from "you could make money" to showing      │
  │          │                                       │                       │ actual unit economics math                             │
  ├──────────┼───────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
  │ 2        │ lean-startup +                        │ MVP Agent + Canvas    │ Plans go from task lists to Build-Measure-Learn        │
  │          │ validating-startup-ideas              │ Coach                 │ experiments with pass/fail criteria                    │
  ├──────────┼───────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
  │ 3        │ startup-metrics-framework             │ Scoring Agent +       │ Scores benchmarked against real stage-appropriate      │
  │          │                                       │ Dashboard             │ metrics, not arbitrary rubrics                         │
  ├──────────┼───────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
  │ 4        │ startup-fundraising                   │ Investor Agent +      │ Fundraising guidance goes from "track your deals" to   │
  │          │                                       │ Practice Pitch        │ full raise strategy                                    │
  ├──────────┼───────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
  │ 5        │ startup-growth-playbooks +            │ Growth Strategy mode  │ Channel recommendations become full playbooks with     │
  │          │ startup-go-to-market                  │ + Composer            │ step-by-step execution                                 │
  ├──────────┼───────────────────────────────────────┼───────────────────────┼────────────────────────────────────────────────────────┤
  │ 6        │ startup-business-models               │ Canvas Coach +        │ AI recognizes business model patterns and coaches      │
  │          │                                       │ Composer              │ accordingly                                            │
  └──────────┴───────────────────────────────────────┴───────────────────────┴────────────────────────────────────────────────────────┘

  The infrastructure is ready — _shared/agency-fragments.ts pattern, chat modes in _shared/agency-chat-modes.ts, RAG pipeline for deeper
  knowledge. It's a matter of extracting the right knowledge from these skills and injecting it into the right edge function prompts.

  Want me to start with #1 (financial modeling → Composer + Pitch Deck)?