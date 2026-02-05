# Dynamic Context Discovery — Quick Reference

**Purpose:** Reduce context bloat by referencing files instead of loading them  
**Full Guide:** `.cursor/rules/dynamic-context-discovery.mdc`  
**Result:** ~47% token reduction

---

## ⚠️ Important: Files Still Load When Needed

**Key Point:** Dynamic context discovery doesn't prevent files from loading. It loads them **intelligently** when relevant.

**How It Works:**
1. Agent reads summary/index files (small, efficient)
2. Sees references to detailed files
3. **Loads specific files when task requires them**
4. Only loads what's needed, when needed

**Example:**
```
Task: "Implement user profile dashboard"
→ Reads: 08-chat-summary.md (project overview)
→ Sees: Reference to prompts/dashboard/27-user-profile.md
→ Loads: That specific prompt file (only what's needed)
→ Result: Full context for the task, but only relevant files
```

---

## 📋 What Should Always Be Loaded

**Essential Project Understanding (Keep Loaded):**
- `CLAUDE.md` — Project architecture & conventions (9.5K)
- `08-chat-summary.md` — Project status & current state (14K)
- `.cursor/rules/00-rules-index.mdc` — Rules navigation (small)

**Why:** These provide essential context that's needed for most tasks.

---

## 📚 What Should Be Referenced (Load On-Demand)

**Detailed Implementation Files (Reference, Load When Needed):**
- `prd.md` (1,862 lines) → Reference sections: `prd.md#authentication`
- `roadmap.md` (869 lines) → Reference milestones: `roadmap.md#q1-2026`
- `skills.md` (615 lines) → Reference specific skills: `skills.md#edge-functions`
- Individual prompts → Reference: `prompts/dashboard/27-user-profile.md`

**Why:** These are large and only needed for specific tasks.

---

## ✅ Best Practices

### 1. Keep Overview Docs Loaded
- Project summaries (chat-summary.md)
- Architecture guides (CLAUDE.md)
- Rule indexes (00-rules-index.mdc)

### 2. Reference Detailed Docs
```markdown
See `prd.md#authentication` for auth requirements
See `roadmap.md#q1-2026` for Q1 milestones
See `skills.md#edge-functions` for edge function patterns
```

### 3. Use Index Files for Large Directories
**Create:** `prompts/dashboard/INDEX.md`
```markdown
# Dashboard Prompts
- `27-user-profile.md` — User Profile
- `28-company-profile.md` — Company Profile
```

Agent reads index first, pulls specific files when needed.

---

## 🎯 Balance: Understanding vs Efficiency

| Type | Strategy | Example |
|------|----------|---------|
| **Project Overview** | Keep loaded | `08-chat-summary.md`, `CLAUDE.md` |
| **Architecture** | Keep loaded | `.cursor/rules/00-rules-index.mdc` |
| **Detailed Specs** | Reference | `prd.md#section`, `roadmap.md#milestone` |
| **Implementation** | Reference | `prompts/dashboard/27-user-profile.md` |
| **Large Docs** | Reference | `skills.md#skill-name` |

**Result:** Agent understands project structure, but only loads detailed files when needed.

---

## 📊 Impact

- **Essential docs loaded:** ~25K (project understanding preserved)
- **Detailed docs referenced:** ~3,500+ lines (loaded on-demand)
- **Total savings:** ~47% token reduction
- **Understanding:** Maintained (agent can still access all files)

---

**Full Details:** See `.cursor/rules/dynamic-context-discovery.mdc`  
**Reference:** [Cursor Blog: Dynamic Context Discovery](https://cursor.com/blog/dynamic-context-discovery)
