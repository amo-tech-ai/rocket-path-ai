# Blog Pages — Interaction States

> **Date:** 2026-02-15
> **Scope:** All interactive elements on BlogIndex and BlogPost pages

---

## FeaturedCard

### States
| State | Visual |
|-------|--------|
| Default | `border-border`, no shadow, icon at 1x scale |
| Hover | `border-primary/30`, `shadow-xl`, icon `scale-110`, title `text-primary`, arrow `translate-x-1` |
| Focus | Browser focus ring on `<Link>` element |
| Active | Slight press feedback via browser default |

### Transitions
| Trigger | Property | Duration | Easing |
|---------|----------|----------|--------|
| hover-in/out | all (border, shadow) | 300ms | ease `transition-all` |
| hover-in/out | icon transform | 300ms | ease `transition-transform` |
| hover-in/out | title color | 150ms | ease `transition-colors` |
| hover-in/out | arrow translateX | 150ms | ease `transition-transform` |

### Accessibility
- **Element:** `<Link>` wrapping entire card
- **Focus:** Default browser focus ring (visible on keyboard nav)
- **Keyboard:** Enter/Space activates link
- **Screen reader:** Reads card as link with title text

---

## StoryCard

### States
| State | Visual |
|-------|--------|
| Default | `border-border`, no shadow, "Read report →" hidden (`opacity-0`) |
| Hover | `border-primary/30`, `shadow-lg`, icon `scale-110`, title `text-primary`, "Read report →" visible (`opacity-100`), arrow `translate-x-1` |
| Focus | Browser focus ring on `<Link>` element |
| Active | Browser default |

### Transitions
| Trigger | Property | Duration | Easing |
|---------|----------|----------|--------|
| hover-in/out | all (border, shadow) | 300ms | ease |
| hover-in/out | icon transform | 300ms | ease |
| hover-in/out | title color | 150ms | ease |
| hover-in/out | read link opacity | 150ms | ease |
| hover-in/out | arrow translateX | 150ms | ease |

### Accessibility
- **Element:** `<Link>` wrapping entire card
- **Focus:** Default browser focus ring
- **Keyboard:** Enter/Space activates link
- **Screen reader:** Reads as link with card title
- **Note:** "Read report →" text is always in DOM (opacity hidden, not display:none), accessible to screen readers

---

## Badge (Category)

### States
| State | Visual |
|-------|--------|
| Default | `variant="outline"`, `text-xs`, standard border |

### Notes
- Non-interactive inside cards (part of the `<Link>` wrapper)
- No independent hover/focus states

---

## Hero Badge ("Research Reports")

### States
| State | Visual |
|-------|--------|
| Default | `variant="secondary"`, sage-light bg, sage-foreground text, no border |

### Notes
- Static display element, not interactive

---

## DarkCTASection — Primary Button

### States
| State | Visual |
|-------|--------|
| Default | `bg-white text-[#1a1a1a]`, rounded-full, ArrowRight icon |
| Hover | `bg-white/90` |
| Focus | Focus ring (offset-2) |
| Active | Browser default press |

### Transitions
| Trigger | Property | Duration | Easing |
|---------|----------|----------|--------|
| hover-in/out | background-color | 150ms | ease |

---

## DarkCTASection — Secondary Button

### States
| State | Visual |
|-------|--------|
| Default | `border-white/20 text-white`, rounded-full, outline variant |
| Hover | `bg-white/10` |
| Focus | Focus ring (offset-2) |
| Active | Browser default press |

### Transitions
| Trigger | Property | Duration | Easing |
|---------|----------|----------|--------|
| hover-in/out | background-color | 150ms | ease |

---

## Scroll Animations (Framer Motion)

### Hero (Section A)
| Property | Value |
|----------|-------|
| Trigger | On mount (`animate`) |
| From | `opacity: 0, y: 16` |
| To | `opacity: 1, y: 0` |
| Duration | 600ms |

### Featured Card (Section B)
| Property | Value |
|----------|-------|
| Trigger | `whileInView` (viewport: once) |
| From | `opacity: 0, y: 20` |
| To | `opacity: 1, y: 0` |
| Duration | 600ms |

### Story Cards (Sections C & D)
| Property | Value |
|----------|-------|
| Trigger | `whileInView` (viewport: once) |
| From | `opacity: 0, y: 16` |
| To | `opacity: 1, y: 0` |
| Duration | 500ms |
| Stagger | `delay: index * 100ms` |

### CTA Section (Section E)
| Property | Value |
|----------|-------|
| Trigger | `whileInView` (viewport: once) |
| From | `opacity: 0, y: 20` |
| To | `opacity: 1, y: 0` |
| Duration | 600ms |

---

## BlogPost Loading States

### Suspense Spinner
| State | Visual |
|-------|--------|
| Loading | Centered spinner at `min-h-[60vh]`, `animate-spin rounded-full h-8 w-8 border-b-2 border-primary` |
| Loaded | Report component renders, spinner unmounts |

### ErrorBoundary
| State | Visual |
|-------|--------|
| Error | Centered card: AlertTriangle icon, "Something went wrong" heading, error details (dev only), 3 action buttons |

### ErrorBoundary Buttons
| Button | Action | Variant |
|--------|--------|---------|
| Try Again | Reset error state | outline |
| Reload Page | `window.location.reload()` | outline |
| Go to Dashboard | `window.location.href = '/dashboard'` | default (primary) |

---

## State Transition Diagram

```
Blog Index Page:
  ┌─────────┐  scroll   ┌──────────┐
  │ Above   │ ────────→ │ In View  │  (triggers whileInView animations)
  │ viewport│           │          │
  └─────────┘           └──────────┘

Card Interaction:
  ┌─────────┐  mouse    ┌─────────┐  click   ┌──────────┐
  │ Default │ ────────→ │  Hover  │ ───────→ │ Navigate │
  │         │ ←──────── │         │          │ to /blog │
  └─────────┘  leave    └─────────┘          │  /:slug  │
                                              └──────────┘

Blog Post Loading:
  ┌─────────┐  mount    ┌─────────┐  loaded  ┌──────────┐
  │ Initial │ ────────→ │ Spinner │ ───────→ │ Report   │
  │         │           │         │          │ Rendered │
  └─────────┘           └─────────┘          └──────────┘
                             │ error
                             ▼
                        ┌──────────┐
                        │ Error    │
                        │ Boundary │
                        └──────────┘
```
