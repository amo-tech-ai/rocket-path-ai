# Cursor Features Setup Guide

**Purpose:** Step-by-step guide to enable high-impact Cursor features  
**Target:** Optimize development workflow and increase productivity  
**Last Updated:** January 16, 2026

---

## 🚀 Quick Setup Checklist

### ✅ Automated (Already Done)
- [x] Worktree configuration (`.cursor/worktrees.json`)
- [x] Context7 MCP server configured
- [x] Supabase MCP server configured

### ⚙️ Manual Setup Required (5-15 minutes each)

---

## Priority 1: Enable Debug Mode (15 min setup)

**Impact:** 50-70% faster bug resolution  
**Status:** ❌ Not Enabled

### Steps:
1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "Debug Mode" or "Debugging"
3. Enable "Debug Mode" toggle
4. Restart Cursor if prompted

### Instrumentation (Optional but Recommended):
Add runtime logging to critical flows:

```typescript
// Example: Add to critical user flows
if (import.meta.env.DEV) {
  console.debug('[Debug Mode] User action:', action);
  console.debug('[Debug Mode] State:', state);
}
```

### When to Use:
- Production bug reproduction
- Complex state management issues
- Performance debugging
- User flow validation

**Expected Benefit:** Faster bug resolution, better error tracking

---

## Priority 2: Enable AI Code Reviews (5 min setup)

**Impact:** Catch bugs before commit, improve code quality  
**Status:** ❌ Not Enabled

### Steps:
1. Open Cursor Settings (`Cmd/Ctrl + ,`)
2. Search for "Code Review" or "AI Review"
3. Enable "AI Code Reviews" toggle
4. Configure review triggers (before commit, on save, etc.)

### Usage:
- Review changes in sidepanel before committing
- Fix issues suggested by AI
- Review before pushing to remote

### Best Practices:
- Review all changes before commit
- Address critical issues immediately
- Use for both new code and refactoring

**Expected Benefit:** 20-30% reduction in production bugs

---

## Priority 3: Use Plan Mode (30 min migration)

**Impact:** Better planning visualization, todo delegation  
**Status:** ⚠️ Partially Used (markdown files only)

### Steps:
1. Open Cursor
2. Create new Plan Mode document (`Cmd/Ctrl + Shift + P` → "Create Plan")
3. Or use Plan Mode from Command Palette

### Migration from Markdown:
1. Open existing plan files (`plan/progress-tracker.md`)
2. Copy todos and milestones
3. Paste into Plan Mode document
4. Use inline Mermaid diagrams for architecture

### Features to Use:
- **Todo Delegation:** Send selected todos to new agents
- **Mermaid Diagrams:** Inline architecture diagrams
- **Progress Tracking:** Visual progress indicators
- **Milestone Management:** Track sprint goals

### Example Workflow:
```
1. Create Plan Mode document for current sprint
2. Add todos from roadmap
3. Use Mermaid for architecture diagrams
4. Delegate todos to agents for execution
5. Track progress visually
```

**Expected Benefit:** Better planning, faster execution, clearer visualization

---

## Priority 4: Use Browser Layout (Immediate)

**Impact:** 30-40% faster UI development  
**Status:** ❌ Not Used

### Steps:
1. Open Cursor
2. Press `Cmd/Ctrl + Option/Alt + Tab` to cycle layouts
3. Select "Browser" layout
4. Navigate to `http://localhost:3000` (or your dev server)

### Features:
- **Component Tree:** Visual component hierarchy
- **Real-time CSS Editing:** Edit styles and see changes instantly
- **Element Selection:** Click elements to inspect
- **Style Editor:** Modify CSS properties directly

### When to Use:
- UI development and iteration
- CSS debugging and styling
- Component testing
- Design system implementation

### Workflow:
1. Switch to Browser layout
2. Navigate to local dev server
3. Use agent to generate CSS changes
4. See changes in real-time
5. Iterate quickly

**Expected Benefit:** Faster UI iteration, better visual feedback

---

## Priority 5: Learn CLI Features (10 min)

**Impact:** 15-20% faster workflows  
**Status:** ⚠️ Underutilized

### Available Commands:

#### Model Selection
```bash
# List available models
cursor agent models

# Use in chat
/models
```

#### Rule Management
```bash
# List active rules
/rules

# Enable/disable rules
/rules enable <rule-name>
/rules disable <rule-name>
```

#### MCP Management
```bash
# Enable MCP server
/mcp enable context7

# Disable MCP server
/mcp disable context7

# List active MCP servers
/mcp list
```

### Quick Reference:
- `/models` - Switch models in chat
- `/rules` - Manage rules interactively
- `/mcp` - Manage MCP servers
- `cursor agent models` - List all models

**Expected Benefit:** Faster model switching, better rule management

---

## Priority 6: Enable Multi-Agent Judging (5 min)

**Impact:** Better parallel agent results  
**Status:** ❌ Not Enabled

### Steps:
1. When running parallel agents (Best-of-N)
2. Enable "Automatic Judging" option
3. Review reasoning for selected solution
4. Learn which patterns work best

### When to Use:
- Running multiple models in parallel
- Comparing different approaches
- Need automatic best solution selection

### Benefits:
- Automatic best solution selection
- Reasoning transparency
- Pattern learning

**Expected Benefit:** Better parallel agent results, automatic optimization

---

## Additional Features

### Pinned Chats (Low Priority)
**Steps:**
1. Right-click on important chat
2. Select "Pin Chat"
3. Organize by feature/domain

**Use Cases:**
- Reference conversations
- Important agent chats
- Feature-specific discussions

### Shared Agent Transcripts (Medium Priority)
**Steps:**
1. Generate read-only transcript from agent conversation
2. Share in PR descriptions
3. Fork conversations for similar work

**Use Cases:**
- PR documentation
- Team knowledge sharing
- Reusable workflows

---

## Setup Timeline

### Week 1: Critical Features (30 min)
- [ ] Enable Debug Mode (15 min)
- [ ] Enable AI Code Reviews (5 min)
- [ ] Try Browser Layout (immediate)
- [ ] Learn CLI commands (10 min)

### Week 2: Planning & Organization (35 min)
- [ ] Migrate roadmap to Plan Mode (30 min)
- [ ] Enable Multi-Agent Judging (5 min)

### Week 3: Workflow Optimization
- [ ] Pin important chats (5 min)
- [ ] Generate agent transcripts (10 min)
- [ ] Create custom layouts (experimental)

---

## Verification Checklist

After setup, verify:
- [ ] Debug Mode enabled and working
- [ ] AI Code Reviews active
- [ ] Plan Mode document created
- [ ] Browser Layout accessible
- [ ] CLI commands working
- [ ] Multi-Agent Judging enabled
- [ ] MCP servers active (Context7, Supabase)

---

## Troubleshooting

### Debug Mode Not Working
- Check Cursor version (requires 2.3+)
- Restart Cursor after enabling
- Verify instrumentation code

### AI Code Reviews Not Showing
- Check settings toggle
- Verify Cursor version
- Restart Cursor

### Plan Mode Not Available
- Update to latest Cursor version
- Check Command Palette for "Create Plan"
- Verify feature is enabled in settings

### Browser Layout Not Loading
- Ensure dev server is running
- Check URL in browser layout
- Verify Cursor version supports feature

---

## Expected Overall Impact

After implementing all Priority 1-3 features:
- **50-70% faster debugging** (Debug Mode)
- **20-30% fewer bugs** (AI Code Reviews)
- **30-40% faster UI development** (Browser Layout)
- **15-20% faster workflows** (CLI Features)
- **Better planning** (Plan Mode)

**Total Estimated Time Savings:** 2-3 hours per week

---

**Next Steps:** Start with Priority 1-3 features (30 min total setup time)
