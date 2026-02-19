---
name: low-fidelity-prototyping
description: Guide low-fidelity prototyping workflows for UI/UX design. Use when the user needs to create wireframes, paper prototypes, rough mockups, or early-stage design explorations. Covers sketch-to-wireframe workflows, rapid iteration, user testing with lo-fi artifacts, and transitioning from lo-fi to hi-fi.
metadata:
  tags: prototyping, wireframe, ux, design, lofi, sketching
  source: Figma Resource Library
---

# Low-Fidelity Prototyping

Rapid, rough representations of interfaces that prioritize concept validation over visual polish. Lo-fi prototypes test structure, flow, and core interactions before committing to detailed design.

## When to Use

Use low-fidelity prototyping when:
- Exploring multiple concepts early in the design process
- Validating information architecture and page structure
- Testing user flows and navigation patterns
- Communicating ideas to stakeholders quickly
- Iterating rapidly without design-system constraints
- Budget or timeline is tight and speed matters most

## Workflow Decision Tree

```
Need to validate a concept?
├── Is it about layout/structure? → Paper sketch or whiteboard wireframe
├── Is it about user flow? → Clickable wireframe prototype
├── Is it about content hierarchy? → Grayscale wireframe
└── Is it about interaction patterns? → Basic interactive prototype
```

## Types of Lo-Fi Prototypes

### 1. Paper Prototypes
Hand-drawn sketches on paper or index cards. Best for:
- Initial brainstorming sessions
- Testing with 3-5 users in hallway tests
- Exploring wildly different layouts fast

**Process:**
1. Sketch each screen on a separate card/sheet
2. Use thick markers for main elements (keeps detail low)
3. Label key interactive areas
4. Walk users through the flow, swapping cards as they "navigate"

### 2. Wireframes (Static)
Low-detail digital layouts showing element placement without visual design.

**Key principles:**
- Use grayscale only (black, white, grays)
- Represent images with X-boxed placeholders
- Use real content labels, avoid Lorem Ipsum where possible
- Show hierarchy through size and position, not color
- Include annotations for behavior ("dropdown opens on click")

### 3. Clickable Wireframes
Wireframes connected with basic navigation links to simulate flow.

**Best for:**
- Validating multi-step processes (checkout, onboarding)
- Testing navigation between sections
- Remote usability testing when paper isn't practical

## Building Lo-Fi Prototypes in Code

When building wireframe-level prototypes in React/HTML:

```css
/* Wireframe utility styles */
.wireframe-box {
  border: 2px solid #999;
  background: #f5f5f5;
  padding: 1rem;
  margin: 0.5rem 0;
}
.wireframe-image {
  background: #ddd;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 0.875rem;
}
.wireframe-text {
  background: #e0e0e0;
  height: 0.75rem;
  border-radius: 2px;
  margin: 0.25rem 0;
}
.wireframe-button {
  border: 2px solid #333;
  padding: 0.5rem 1rem;
  background: white;
  cursor: pointer;
  font-weight: bold;
}
```

```tsx
// Wireframe component pattern
function WireframeScreen({ title, children }) {
  return (
    <div className="wireframe-box max-w-md mx-auto">
      <div className="text-sm font-bold text-gray-500 mb-2">{title}</div>
      {children}
    </div>
  );
}

function ImagePlaceholder({ label = "Image" }) {
  return (
    <div className="wireframe-image">
      <span>[{label}]</span>
    </div>
  );
}
```

## Testing with Lo-Fi Prototypes

### Moderated Testing Script
1. **Set context**: "This is an early concept. We're testing the idea, not the design."
2. **Task-based**: Give users specific tasks, not tours
3. **Think aloud**: Ask users to verbalize their expectations
4. **Capture**: Note where users hesitate, get confused, or expect something different
5. **Iterate**: Make changes between sessions (paper makes this instant)

### What Lo-Fi Testing Reveals
- Whether the mental model matches the user's expectations
- Navigation and flow problems
- Missing steps or screens
- Content priority issues
- Terminology confusion

### What Lo-Fi Testing Does NOT Reveal
- Visual design appeal
- Micro-interaction quality
- Performance perception
- Brand alignment
- Accessibility details

## Transitioning to High-Fidelity

When lo-fi concepts are validated:
1. Document decisions made during lo-fi testing
2. Identify which flows/screens are stable enough for hi-fi
3. Map wireframe elements to design system components
4. Prioritize hi-fi work on critical paths first
5. Keep lo-fi for exploratory branches

## References

### references/
- `wireframe-patterns.md` - Common wireframe layout patterns and conventions
- `testing-checklist.md` - Checklist for running lo-fi usability tests

### Resources
- Remove placeholder files in `scripts/` and `assets/` if not needed
