---
task_id: DES-055
title: "Microcopy, Annotations & Chart Storytelling"
phase: MVP
priority: P2
status: Not Started
skill: none
subagents: []
depends_on: []
---

# 55 — Microcopy, Annotations & Chart Storytelling

> **Category:** Design Workflow — Content
> **When to use:** Writing chart titles, annotations, callouts, source lines, CTA text, social media captions
> **Source:** Parallel HQ scenario-based prompting, Flourish storytelling techniques
> **Best for:** Chart headlines, data callouts, infographic text, social captions, presentation speaker notes

---

## Prompt A — Chart Headline Generator

```
Write 5 chart headline options for this visualization.

CHART TYPE: [e.g., "horizontal bar chart"]
DATA: [e.g., "AI adoption rates: Healthcare 78%, Finance 72%, Retail 65%, Manufacturing 58%, Education 45%"]
AUDIENCE: [e.g., "Startup founders"]

Rules for good chart headlines:
1. Tell the INSIGHT, not describe the chart
2. Max 12 words
3. Include a specific number if compelling
4. Use active voice
5. Create a reaction (surprise, concern, motivation)

BAD: "AI adoption rates by industry"
GOOD: "Healthcare leads AI — but education risks getting left behind"

Provide 5 options:
1. Neutral/factual tone
2. Urgent/alarming tone
3. Optimistic/opportunity tone
4. Provocative/contrarian tone
5. Action-oriented tone

Recommend the best one for [AUDIENCE] with rationale.
```

---

## Prompt B — Annotation Callout Writer

```
Write annotations for key data points in my chart.

CHART: [Describe]
KEY DATA POINTS to annotate:
1. [Data point 1 — e.g., "COVID dip in Q2 2020"]
2. [Data point 2 — e.g., "Sharp recovery in Q4 2020"]
3. [Data point 3 — e.g., "All-time high in Q3 2025"]

For each annotation:
1. Callout text (max 15 words)
2. Position: where it should appear relative to the data point
3. Visual treatment: text + thin line pointing to data, or text inside a rounded rect
4. Context: what real-world event explains this data point

RULES:
- Max 3 annotations per chart (more = clutter)
- Annotations explain the WHY, not the WHAT (the data shows the what)
- Use present tense for current state, past tense for events
```

---

## Prompt C — Source Line Formatter

```
Format source citations for these data visualizations.

SOURCES:
1. [Organization name, publication name, year, sample size/scope]
2. [Organization name, publication name, year, sample size/scope]
3. [etc.]

Format each as:
"Source: [Organization], [Year] (n=[sample size])"

If multiple sources for one chart:
"Sources: [Org1] ([Year1]); [Org2] ([Year2])"

RULES:
- Always include sample size (n=) when available
- Year of data collection, not publication year if different
- If data is illustrative/estimated: "Source: [Org] estimates, [Year]"
- If data is from your own analysis: "Source: StartupAI analysis of [underlying data], [Year]"
- Font: 10-12px, gray (#6B7280), left-aligned below chart
```

---

## Prompt D — Social Media Caption for Chart

```
Write a social media caption for this chart I'm posting.

PLATFORM: [LinkedIn / Twitter / Instagram]
CHART SHOWS: [Describe the key insight]
AUDIENCE: [Who follows me]
TONE: [Professional / Thought-leader / Casual / Contrarian]

STRUCTURE:
- Hook (first line — must stop the scroll): a surprising stat or provocative question
- Context (2-3 sentences): why this matters
- Insight (1 sentence): what the chart reveals that isn't obvious
- CTA: [Ask a question / Invite discussion / Link to report]
- Hashtags: 3-5 relevant

CHARACTER LIMIT: [LinkedIn: 3000 / Twitter: 280 / Instagram: 2200]

Example structure for LinkedIn:
"[SURPRISING STAT OR QUESTION]

[2-3 sentences of context]

[What most people miss about this data]

What do you think? [QUESTION FOR ENGAGEMENT]

#tag1 #tag2 #tag3"
```

---

## Prompt E — Infographic Section Microcopy

```
Write all the text elements for an infographic section.

SECTION PURPOSE: [e.g., "Show the top 5 AI use cases by ROI"]
CHART TYPE: [e.g., "Horizontal bar chart"]
DATA: [List the data points]

Write:
1. Section heading: (max 8 words, tells the story)
2. Subheading: (max 15 words, provides context/timeframe)
3. 1-2 annotations: (max 15 words each, pointing to key data points)
4. Caption/insight: (1 sentence explaining the "so what?")
5. Source line: (formatted citation)

TONE: [BCG editorial — authoritative, precise, concise]

RULES:
- No filler words (very, really, quite, significantly)
- Numbers > words (say "3x" not "three times greater")
- Active voice only
- Every word must earn its place
```
