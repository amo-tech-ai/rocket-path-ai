---
task_id: DES-053
title: Concept Generation & Brainstorming
phase: MVP
priority: P2
status: Not Started
skill: /low-fidelity-prototyping
subagents: [frontend-designer]
depends_on: []
---

# 53 — Concept Generation & Brainstorming

> **Category:** Design Workflow
> **When to use:** Starting a new visual/infographic project — brainstorm concepts before building
> **Source:** Parallel HQ COSTAR framework, Chain-of-thought prompting
> **Best for:** Project kickoff, creative direction, exploring multiple approaches before committing

---

## Prompt A — COSTAR Concept Brief (Full Framework)

```
Use the COSTAR framework to generate design concepts:

CONTEXT: I am a [role] creating a [deliverable type] for [project/company].
OBJECTIVE: The goal is to [specific outcome — e.g., "convince investors that AI adoption is accelerating"].
STYLE: The visual style should be [BCG editorial / tech-forward / minimal / bold graphic / illustrated].
TONE: The tone should feel [authoritative / innovative / urgent / accessible / premium].
AUDIENCE: [Startup founders / investors / C-suite / developers / general public].
RESPONSE: Provide [5 distinct concepts], each with a name, 2-sentence description, primary visual element, and chart type.

For each concept:
1. CONCEPT NAME: (2-3 words)
2. HOOK: What makes the viewer stop and look? (one visual element)
3. DATA STORY: What data insight anchors the design?
4. PRIMARY CHART: Which chart type from the 9-category framework?
5. VISUAL ELEMENT: Hero image, icon, illustration, or abstract element?
6. COLOR MOOD: Warm/cool/neutral + 2-3 color suggestions

After listing all 5, recommend which ONE to pursue and why.
```

---

## Prompt B — Visual Direction Exploration

```
Generate 3 distinct visual directions for this infographic:

TOPIC: [e.g., "The State of AI Adoption in Enterprise 2026"]
DATA: [Key stats/data points available]
CHANNEL: [Where will it live — web / social / print / presentation]

DIRECTION A — Conservative/Corporate:
- Describe the visual approach, layout, chart types, color palette

DIRECTION B — Bold/Editorial:
- Describe the visual approach, layout, chart types, color palette

DIRECTION C — Data Art/Experimental:
- Describe the visual approach, layout, chart types, color palette

For each direction:
- Pros (what it does well)
- Cons (what it risks)
- Best audience match
- Reference touchpoint (name a brand/publication that does this style)

Recommend one direction with rationale.
```

---

## Prompt C — Step-by-Step Decomposition

```
I need to design [DELIVERABLE] about [TOPIC].

Break this into steps. Don't design anything yet — just plan:

STEP 1 — DATA AUDIT:
- What data do I have?
- What data am I missing?
- What's the most compelling stat?

STEP 2 — STORY ARC:
- What's the narrative structure? (problem → evidence → insight → action)
- What's the hook that grabs attention?
- What's the key takeaway?

STEP 3 — VISUAL INVENTORY:
- What chart types fit each data point?
- What non-chart visuals are needed? (icons, photos, illustrations)
- What text elements? (headlines, annotations, source lines)

STEP 4 — LAYOUT PLAN:
- How many sections/slides?
- What layout template per section?
- What's the visual flow (Z-pattern, scrolling narrative, grid)?

STEP 5 — STYLE LOCK:
- Color palette (3-5 colors)
- Typography (1-2 fonts, size hierarchy)
- Chart style (fill vs outline, rounded vs sharp, animated vs static)

Return each step with specific recommendations based on my topic.
```

---

## Prompt D — Mood Board Description

```
Describe a mood board for a [ADJECTIVE] [PRODUCT TYPE] about [TOPIC].

The mood should match these brand attributes: [LIST — e.g., "Innovative, Trustworthy, Data-Driven, Premium"]

Include:
1. COLOR PALETTE: 5 colors with hex codes and emotional associations
2. TYPOGRAPHY: 2 font suggestions with rationale
3. IMAGERY STYLE: What kinds of photos/illustrations (editorial, abstract, geometric, documentary)
4. TEXTURE & MATERIAL: Flat/matte/glossy, grain/noise, gradients, glass effects
5. REFERENCE BRANDS: 3 brands/publications whose visual style is similar to what we want
6. ANTI-REFERENCES: 2 brands/styles to explicitly AVOID and why

Format as a structured brief I can share with a design team or use as AI image generation context.
```
