---
task_id: DES-056
title: Cross-Functional Design Prompts
phase: MVP
priority: P2
status: Not Started
skill: /high-fidelity-prototyping
subagents: [frontend-designer, code-reviewer]
depends_on: []
---

# 56 — Cross-Functional Design Prompts

> **Category:** Design Workflow — Collaboration
> **When to use:** Getting design feedback, translating between design/engineering/marketing, project management
> **Source:** Parallel HQ role-based prompting, collaborative workflows
> **Best for:** Design reviews, handoff specs, stakeholder communication, quality control

---

## Prompt A — Engineering Handoff Specification

```
Act as a frontend engineer. Review this design specification and create an implementation checklist.

DESIGN: [Describe the infographic/chart component — layout, animations, data, styling]

Create:
1. COMPONENT BREAKDOWN: List every React component needed with props interface
2. DATA REQUIREMENTS: What API/data shape does each component expect?
3. ANIMATION SPECS: Exact CSS properties, durations, easings, triggers
4. RESPONSIVE BREAKPOINTS: What changes at each breakpoint?
5. EDGE CASES: What happens with 0 data points? 100? Missing values? Long text?
6. ACCESSIBILITY: ARIA labels, keyboard nav, screen reader behavior
7. PERFORMANCE CONCERNS: Any heavy animations, large SVGs, or expensive calculations?
8. DEPENDENCIES: What libraries are needed? (framer-motion, d3, recharts, etc.)

Format as a numbered implementation checklist with estimated complexity per item.
```

---

## Prompt B — Stakeholder Design Review

```
Act as a [ROLE: marketing director / product manager / CEO / investor].

Review this infographic design from your perspective:

DESIGN: [Describe what was created]
GOAL: [What this deliverable should achieve]

Provide feedback on:
1. Does the headline clearly communicate the key insight?
2. Can you understand the data story in under 10 seconds?
3. Does the visual style match our brand positioning?
4. Is there anything confusing, misleading, or unclear?
5. Would you share this with your [clients / board / team / social network]?
6. What's the ONE thing you'd change to make it more effective?

Rate on a 1-5 scale:
- Clarity: [1-5]
- Visual appeal: [1-5]
- Data accuracy: [1-5]
- Brand alignment: [1-5]
- Shareability: [1-5]
```

---

## Prompt C — Marketing Copy from Design

```
Act as a marketing copywriter.

I've created an infographic about [TOPIC] with these key findings:
- [Finding 1]
- [Finding 2]
- [Finding 3]

Write:
1. Blog post intro (3 paragraphs) that sets up the infographic
2. 3 social media posts (LinkedIn, Twitter, Instagram) promoting it
3. Email subject line + 2-sentence preview text for newsletter
4. 1-sentence meta description for SEO (max 160 characters)

TONE: [Thought-leader / Analytical / Urgent / Conversational]
BRAND VOICE: [Describe — e.g., "Data-driven, confident, accessible, never hype"]
```

---

## Prompt D — Self-Critique (Quality Control)

```
You just created [DESCRIBE WHAT YOU MADE].

Now act as a critical design reviewer and rate your own output:

CHECKLIST:
1. [ ] Does the title tell the story (not describe the chart)?
2. [ ] Is there ONE clear focal point per section?
3. [ ] Are all bars sorted (if applicable)?
4. [ ] Do colors serve a purpose (not just decoration)?
5. [ ] Is there a source citation with year and sample size?
6. [ ] Would this work on mobile (responsive)?
7. [ ] Is it accessible (colorblind-safe, sufficient contrast, ARIA)?
8. [ ] Does it pass the 5-second test? (Can someone get the main point in 5 seconds?)
9. [ ] Is there any chart junk to remove? (gridlines, borders, 3D, shadows)
10. [ ] Would a senior BCG partner sign off on this quality?

Score: [X/10]

For each item that FAILS, provide a specific fix.

IMPORTANT: Be brutally honest. Performative self-praise is useless. If it's mediocre, say so and say why.
```

---

## Prompt E — Prompt Version Tracking

```
I'm maintaining a library of design prompts for my team.

For this prompt I just used:

PROMPT TEXT: [paste the prompt]
CONTEXT: [what project I used it for]
RESULT QUALITY: [1-5, with description of what worked and what didn't]

Suggest:
1. What to change to improve the result
2. What to add that I missed
3. What to remove that didn't help
4. A refined V2 of the prompt incorporating improvements

Track as:
| Version | Date | Change | Result Quality |
|---------|------|--------|---------------|
| v1 | [date] | Original | [1-5] |
| v2 | [date] | [what changed] | [1-5] |
```
