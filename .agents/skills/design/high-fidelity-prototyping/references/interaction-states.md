# Interaction States Documentation Guide

## Core State Categories

### Input States
| State | Visual Indicator | When |
|-------|-----------------|------|
| Empty | Placeholder text, muted border | No value entered |
| Focused | Ring/highlight, elevated border | User clicks or tabs in |
| Filled | Dark text, standard border | Value present, not focused |
| Disabled | Reduced opacity, no cursor | Not available for input |
| Read-only | Standard text, no border change | Viewable but not editable |
| Error | Red border, error message below | Validation failed |
| Success | Green indicator (optional) | Validation passed |
| Loading | Spinner or skeleton in field | Async validation in progress |

### Button States
| State | Visual Indicator | When |
|-------|-----------------|------|
| Default | Standard appearance | Idle |
| Hover | Slight color shift, cursor pointer | Mouse over |
| Active/Pressed | Darker shade, slight scale down | Mouse down |
| Focused | Focus ring visible | Keyboard navigation |
| Disabled | Reduced opacity, no pointer | Action not available |
| Loading | Spinner replaces or joins label | Async action in progress |

### Card/Container States
| State | Visual Indicator | When |
|-------|-----------------|------|
| Default | Standard elevation/border | Idle |
| Hover | Elevated shadow, subtle transform | Mouse over (if clickable) |
| Selected | Accent border, check indicator | User has selected |
| Loading | Skeleton placeholder | Data fetching |
| Empty | Illustration + message + CTA | No data to display |
| Error | Error message + retry action | Data fetch failed |

## State Transition Documentation

Document transitions between states:

```
[trigger] : [from state] → [to state] (duration, easing)

Examples:
click     : default → loading (instant)
API response : loading → filled (150ms ease-out)
blur + invalid : focused → error (150ms ease)
hover     : default → hover (100ms ease)
mouse-leave : hover → default (150ms ease)
```

## Empty State Design

Every data-driven screen needs an empty state:

```
┌─────────────────────────────────┐
│                                 │
│        [Illustration]           │
│                                 │
│     No [items] yet              │
│     [Brief helpful message      │
│      explaining what goes here] │
│                                 │
│     [Primary CTA Button]        │
│                                 │
└─────────────────────────────────┘
```

Required elements:
- Visual (icon or illustration)
- Title describing the empty state
- Description with guidance
- Action to resolve (if applicable)

## Error State Design

```
┌─────────────────────────────────┐
│                                 │
│        [Error Icon]             │
│                                 │
│     Something went wrong        │
│     [Specific, helpful message] │
│                                 │
│     [Try Again]  [Go Back]      │
│                                 │
└─────────────────────────────────┘
```

Required elements:
- Clear indication something failed
- What went wrong (user-friendly language)
- How to recover (retry, go back, contact support)

## Documenting States per Component

Template for each component:

```markdown
## [Component Name]

### States
- Default: [description]
- Hover: [description]
- Active: [description]
- Disabled: [description]
- [Additional states]: [description]

### Transitions
- hover-in: 100ms ease
- hover-out: 150ms ease
- active: instant
- focus: instant with ring

### Accessibility
- Focus visible: [ring style]
- ARIA role: [role]
- Keyboard: [interactions]
- Screen reader: [announcement]
```
