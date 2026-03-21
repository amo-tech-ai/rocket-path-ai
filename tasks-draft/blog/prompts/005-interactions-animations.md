---
task_id: 005-BLOG-IA
title: Blog Page — Interactions & Animations
phase: CORE
priority: P1
status: Not Started
estimated_effort: 1 day
skill: /framer-motion-animator, /high-fidelity-prototyping
subagents: []
depends_on: [004-BLOG-HF]
---

| Aspect | Details |
|--------|---------|
| **Screens** | BlogIndex (`/blog`) |
| **Features** | Scroll reveals, hover states, stagger animations, card transitions |
| **Reference** | `tasks/blog/infographics-style.md` Section 8, `tasks/blog/03-hifi-spec.md` |
| **Real-World** | "Define every hover state and animation timing before coding" |

## Description

Define all interaction states and animation specifications for the blog index page. Every interactive element needs documented states (default, hover, focus, active). Every entrance animation needs trigger, duration, easing, and delay. Follow the animation patterns established in the infographics style guide.

## Rationale

**Problem:** Unspecified animations lead to inconsistent timing, jarring transitions, or over-animation.
**Solution:** Use `/framer-motion-animator` patterns with exact timing from the style guide.
**Impact:** Animations feel intentional and consistent with the report pages.

## User Stories

| As a... | I want to... | So that... |
|---------|--------------|------------|
| Visitor | See smooth scroll reveals as I browse | The page feels alive but not distracting |
| User | See clear hover feedback on cards | I know what's clickable |

## Goals

1. **Primary:** Complete state table for every interactive element
2. **Quality:** Animation timings match the style guide (500ms FadeIn, 0.1s stagger)

## Acceptance Criteria

- [ ] FeaturedCard state table: default, hover, focus, active
- [ ] StoryCard state table: default, hover, focus, active
- [ ] DarkCTASection button states: default, hover, focus, active
- [ ] Hero Badge state documented (static, no interaction)
- [ ] Scroll animation spec per section (trigger, from/to values, duration, delay)
- [ ] Stagger spec for card groups (delay pattern)
- [ ] Card hover transition spec (property, duration, easing)
- [ ] `prefers-reduced-motion` fallback defined
- [ ] State transition diagram (ASCII flow)

## Skill Usage

### `/framer-motion-animator` — Use for animation patterns

Apply these patterns from the skill:

1. **Scroll reveal (whileInView):**
   ```
   initial={{ opacity: 0, y: 16 }}
   whileInView={{ opacity: 1, y: 0 }}
   viewport={{ once: true }}
   transition={{ duration: 0.5, ease: "easeOut" }}
   ```

2. **Stagger children (variants):**
   ```
   container: { transition: { staggerChildren: 0.1 } }
   child: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
   ```

3. **Card hover (whileHover):**
   Use CSS transitions (not Framer Motion) for hover — `transition-all duration-300`.
   Framer Motion for scroll entrance only.

4. **Reduced motion:**
   ```
   const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   ```

### `/high-fidelity-prototyping` — Use for state table format

Follow the skill's interaction state format:

| State | Visual |
|-------|--------|
| Default | `border-border`, no shadow |
| Hover | `border-primary/30`, `shadow-xl`, icon `scale-110` |
| Focus | Browser focus ring |
| Active | Browser default press |

### Reference — Style guide animation timings

From `tasks/blog/infographics-style.md` Section 8:

| Element | Duration | Easing | Delay |
|---------|----------|--------|-------|
| Hero text | 600ms | default | 0 (on mount) |
| Featured card | 600ms | default | 0 (on scroll) |
| Story cards | 500ms | ease | index * 100ms stagger |
| CTA section | 600ms | default | 0 (on scroll) |
| Card hover | 150-300ms | ease | 0 |

## Output

Save interaction spec to `tasks/blog/04-interaction-states.md`.

## Wiring Plan

| Layer | File | Action |
|-------|------|--------|
| Doc | `tasks/blog/04-interaction-states.md` | Create |

---

## Workflow

```
1. Invoke /framer-motion-animator skill
2. Read infographics-style.md Section 8 (animation specs)
3. Read hi-fi spec for component visual states
4. Define state tables for each interactive element
5. Define scroll animation specs per section
6. Define stagger patterns for card groups
7. Document reduced motion fallback
8. Draw state transition diagram
9. Save to tasks/blog/04-interaction-states.md
```
