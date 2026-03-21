---
task_number: LC-08
title: Canvas to Pitch Deck Integration
category: Backend
subcategory: AI Integration
phase: 3
priority: P2
status: Not Started
percent_complete: 0
owner: Full Stack Developer
dependencies: [LC-01, LC-02, LC-03, LC-04, LC-05]
ai_models: [gemini-3-pro-preview]
tools: [TypeScript, Supabase Edge Functions, Gemini API]
---

# 08 - Canvas to Pitch Deck Integration (Advanced)

> Extract lean canvas content into pitch deck slides automatically

## What This Does

The lean canvas contains the core building blocks of a pitch deck. This feature maps canvas boxes to pitch deck slides so founders can generate pitch content directly from their business model.

## Why It Matters

Founders often create a lean canvas then separately create a pitch deck, re-typing the same information. Connecting the two saves time and ensures consistency between the business model and investor presentation.

## Current State

- Lean canvas and pitch deck are separate features
- No data flow between them
- Pitch deck exists as a separate task/feature in the system
- Canvas data stored in `documents` table with `type='lean_canvas'`

## What Needs to Happen

### Canvas-to-Slide Mapping

| Canvas Box | Pitch Slide | How to Transform |
|-----------|------------|-----------------|
| Problem | Problem Slide | Expand items into narrative paragraphs |
| Solution | Solution Slide | Describe solution with key features |
| Unique Value Prop | Value Proposition Slide | Headline + supporting points |
| Customer Segments | Target Market Slide | Market size + segments |
| Revenue Streams | Business Model Slide | Revenue sources + pricing |
| Key Metrics | Traction Slide | Metrics as data points |
| Channels | Go-to-Market Slide | Channel strategy |
| Cost Structure | Financial Slide | Operating costs + burn |
| Unfair Advantage | Why Us Slide | Competitive moat |

### Generation Flow

1. From lean canvas page, click "Generate Pitch Deck"
2. AI takes canvas data and expands each box into slide content
3. Uses startup profile for additional context (team, traction, funding ask)
4. Produces structured slide content
5. Opens pitch deck editor with pre-filled slides

### AI Transformation

Each canvas box needs different AI treatment:
- Problem: Turn bullet points into a compelling narrative
- Solution: Add demo/product description context
- Metrics: Format as visual-ready data points
- Revenue: Structure as business model explanation

### Edge Function Action

Add `canvas_to_pitch` action:
- Input: `{ startup_id: string, canvas_data: LeanCanvasData }`
- Output: `{ pitchDeckId?: string, slides: SlideData[] }`
- Uses `gemini-3-pro-preview` for high-quality content generation
- **Verify:** Pitch deck feature API exists before implementing

**Return Type:**
```typescript
interface SlideData {
  title: string;
  content: string;
  speakerNotes?: string;
  slideType: string; // 'problem' | 'solution' | 'market' | etc.
}
```

## Files Involved

- `supabase/functions/lean-canvas-agent/index.ts` — add `canvas_to_pitch` action
- `src/components/leancanvas/CanvasAIPanel.tsx` — add "Generate Pitch Deck" button
- `src/hooks/useLeanCanvas.ts` — add pitch generation hook
- Integration with pitch deck feature (depends on pitch deck implementation)

## Depends On

- Tasks 01-05 (complete canvas with quality data)
- Pitch deck feature existing in the system

## Success Criteria

- Canvas data maps to appropriate pitch slides
- AI expands bullet points into presentation-quality content
- Generated pitch deck is editable and refineable
- Content stays consistent between canvas and pitch deck
- Pitch deck created or updated in `documents` table with `type='pitch_deck'`

## Error Handling

- If pitch deck feature missing: Show error, don't crash
- If AI generation fails: Return partial slides, log error
- If pitch deck creation fails: Return error, allow retry