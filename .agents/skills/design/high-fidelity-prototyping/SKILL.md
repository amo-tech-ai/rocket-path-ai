---
name: high-fidelity-prototyping
description: Guide high-fidelity prototyping workflows for production-ready UI/UX design. Use when the user needs to create detailed interactive prototypes, pixel-perfect mockups, design-system-integrated screens, or pre-development specifications. Covers visual design, interaction states, design handoff, and usability validation.
metadata:
  tags: prototyping, hifi, design, interaction, mockup, design-system
  source: Figma Resource Library
---

# High-Fidelity Prototyping

Detailed, interactive representations that closely mirror the final product in appearance, content, and behavior. Hi-fi prototypes validate visual design, interaction patterns, and edge cases before development.

## When to Use

Use high-fidelity prototyping when:
- Core concepts are validated through lo-fi testing
- Stakeholder buy-in requires realistic visualization
- Testing complex micro-interactions or animations
- Preparing specifications for developer handoff
- Validating design-system component usage in context
- Conducting usability testing that requires realistic fidelity

## Workflow Decision Tree

```
Ready to go hi-fi?
├── Lo-fi flow validated? → YES: Proceed to hi-fi
│   └── NO: Go back to lo-fi prototyping
├── Design system exists? → Apply existing components
│   └── NO: Define visual foundations first (color, type, spacing)
├── Testing interactions? → Build interactive prototype
├── Need stakeholder sign-off? → Create polished static mockups
└── Developer handoff? → Annotate specs + interactive reference
```

## Hi-Fi Prototype Layers

### 1. Visual Foundation
Establish the design language before building screens:

- **Color system**: Primary, secondary, neutral, semantic (error, success, warning)
- **Typography scale**: Display, heading, body, caption with defined sizes and weights
- **Spacing system**: Consistent scale (4px base: 4, 8, 12, 16, 24, 32, 48, 64)
- **Elevation**: Shadow/border hierarchy for depth
- **Border radius**: Consistent rounding tokens

### 2. Component Library
Map wireframe elements to production components:

| Wireframe Element | Hi-Fi Component | States Required |
|---|---|---|
| Box with label | Card | default, hover, loading, empty |
| Rectangle button | Button | default, hover, active, disabled, loading |
| Text line | Input | empty, filled, focused, error, disabled |
| Dropdown indicator | Select/Combobox | closed, open, selected, error |
| X-box image | Image with loading | loading, loaded, error, placeholder |

### 3. Interaction States
Every interactive element needs these states documented:

```
Default → Hover → Active/Pressed → Focused
                                  → Disabled
                                  → Loading
                                  → Error
                                  → Success
```

### 4. Content Strategy
- Use real or realistic content (never Lorem Ipsum in hi-fi)
- Test with edge cases: very long names, empty states, single items, hundreds of items
- Include error messages, empty states, and loading states as screens

## Building Hi-Fi Prototypes in Code

### Design Token Setup
```css
:root {
  /* Color tokens */
  --color-primary: #1a1a2e;
  --color-accent: #e94560;
  --color-surface: #ffffff;
  --color-muted: #f8f9fa;
  --color-border: #e2e8f0;
  --color-text: #1a1a2e;
  --color-text-muted: #64748b;

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 400ms ease;
}
```

### Component Pattern with States
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

function PrototypeButton({ variant, size, loading, disabled, children, onClick }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variants[variant],
        sizes[size],
        (loading || disabled) && 'opacity-50 pointer-events-none'
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
```

### Screen Documentation Pattern
```tsx
/**
 * Screen: Event Detail
 * Flow: Dashboard > Events > Event Detail
 * States: loading, populated, empty-sections, error
 * Breakpoints: mobile (375), tablet (768), desktop (1280)
 * Interactions:
 *   - Tab navigation between sections
 *   - Inline editing of event details
 *   - Image gallery with lightbox
 *   - Guest list filtering and search
 */
```

## Testing with Hi-Fi Prototypes

### What Hi-Fi Testing Reveals
- Visual design effectiveness and brand alignment
- Micro-interaction clarity and delight
- Content readability and scannability
- Component usability in realistic context
- Responsive behavior across breakpoints
- Accessibility issues (color contrast, focus states, screen reader flow)

### Testing Checklist
1. **Task completion**: Can users complete key tasks without help?
2. **Visual hierarchy**: Do users notice the right things first?
3. **Error recovery**: Can users recover from mistakes?
4. **Edge cases**: How do screens handle empty, overflow, or error states?
5. **Consistency**: Do similar patterns behave the same way?
6. **Performance perception**: Do loading states feel appropriate?

### Usability Metrics to Track
- Task success rate
- Time on task
- Error rate per task
- System Usability Scale (SUS) score
- First-click accuracy

## Design Handoff Specifications

When the prototype is validated, document for developers:

### Per-Screen Spec
- Layout grid and spacing measurements
- Component variants used and their props
- Responsive breakpoint behavior
- Animation/transition specifications (duration, easing, trigger)
- Data dependencies and API mapping

### Per-Component Spec
- All visual states with screenshots
- Interaction behavior description
- Accessibility requirements (ARIA roles, keyboard nav)
- Content constraints (min/max length, required fields)

## Fidelity Progression Summary

| Aspect | Lo-Fi | Hi-Fi |
|---|---|---|
| Visual detail | Grayscale, rough | Full color, polished |
| Content | Labels, short text | Real/realistic content |
| Interactions | Click-through only | Micro-interactions, animations |
| States | Happy path | All states (error, loading, empty) |
| Responsiveness | Single breakpoint | All target breakpoints |
| Testing focus | Structure, flow | Usability, visual, interaction |
| Iteration speed | Minutes | Hours |
| Best for | Exploration | Validation, handoff |

## References

### references/
- `interaction-states.md` - Complete guide to documenting interaction states
- `handoff-checklist.md` - Developer handoff specification checklist
- `testing-metrics.md` - Usability metrics and measurement guide

### Resources
- Remove placeholder files in `scripts/` and `assets/` if not needed
