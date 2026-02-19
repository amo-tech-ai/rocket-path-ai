# Wireframe Layout Patterns

Common layout patterns for low-fidelity wireframes, organized by page type.

## Dashboard Layouts

### Sidebar + Content
```
┌──────┬─────────────────────────┐
│ Nav  │  Header / Breadcrumb    │
│      ├─────────────────────────┤
│ Link │  Content Area           │
│ Link │                         │
│ Link │  ┌─────┐ ┌─────┐       │
│      │  │Card │ │Card │       │
│      │  └─────┘ └─────┘       │
└──────┴─────────────────────────┘
```

### Three-Panel (Context | Work | Intelligence)
```
┌────────┬──────────────┬────────┐
│Context │  Work Area   │ Intel  │
│        │              │        │
│ Filters│  Main content│ AI     │
│ Nav    │  + actions   │ Assist │
│ Tree   │              │ Panel  │
└────────┴──────────────┴────────┘
```

## List/Table Layouts

### Filterable List
```
┌─────────────────────────────────┐
│ [Search........] [Filter ▼] [+] │
├─────────────────────────────────┤
│ □ Item Name        Status  Date │
│ □ Item Name        Status  Date │
│ □ Item Name        Status  Date │
├─────────────────────────────────┤
│ ← 1 2 3 ... 10 →               │
└─────────────────────────────────┘
```

### Card Grid
```
┌─────────────────────────────────┐
│ Title           [Filter] [View] │
├─────────────────────────────────┤
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │[Image]│ │[Image]│ │[Image]│  │
│ │ Title │ │ Title │ │ Title │  │
│ │ Meta  │ │ Meta  │ │ Meta  │  │
│ └───────┘ └───────┘ └───────┘  │
└─────────────────────────────────┘
```

## Form Layouts

### Single-Column Form
```
┌─────────────────────────────────┐
│ Form Title                      │
│ Step 1 of 3                     │
├─────────────────────────────────┤
│ Label                           │
│ [Input field.................]  │
│                                 │
│ Label                           │
│ [Input field.................]  │
│                                 │
│ Label                           │
│ [Textarea.....................]  │
│ [............................]  │
│                                 │
│         [Cancel] [Next Step →]  │
└─────────────────────────────────┘
```

## Detail/Profile Layouts

### Header + Tabs + Content
```
┌─────────────────────────────────┐
│ ← Back to List                  │
├─────────────────────────────────┤
│ [Image]  Title                  │
│          Subtitle / metadata    │
│          [Action] [Action]      │
├─────────────────────────────────┤
│ [Tab 1] [Tab 2] [Tab 3]        │
├─────────────────────────────────┤
│ Tab content area                │
│                                 │
└─────────────────────────────────┘
```

## Annotation Conventions

Use consistent annotation markers in wireframes:
- `[Action]` - Clickable button or link
- `[Input...]` - Text input field
- `[Image]` - Image placeholder
- `▼` - Dropdown/expandable
- `□` - Checkbox
- `○` - Radio button
- `←` `→` - Navigation direction
- `...` - Truncated/expandable content
- `[×]` - Close/dismiss
