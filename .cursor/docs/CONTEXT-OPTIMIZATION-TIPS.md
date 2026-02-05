# Context Optimization Tips

**Problem:** Context fills up quickly despite dynamic context discovery  
**Solution:** Apply these patterns consistently

---

## ✅ Immediate Improvements

### 1. Condensed Dynamic Context Doc
- **Before:** 225 lines
- **After:** 81 lines (64% reduction)
- **Change:** References `.cursor/rules/dynamic-context-discovery.mdc` instead of duplicating content

### 2. Large Files to Reference (Not Load)

| File | Lines | Strategy |
|------|-------|----------|
| `prd.md` | 1,862 | Reference sections: `prd.md#section-name` |
| `roadmap.md` | 869 | Reference milestones: `roadmap.md#milestone-name` |
| `skills.md` | 615 | Reference specific skills: `skills.md#skill-name` |

**Pattern:**
```markdown
See `prd.md#authentication` for auth requirements
See `roadmap.md#q1-2026` for Q1 milestones
See `skills.md#edge-functions` for edge function patterns
```

### 3. Summary Files Pattern

**Current:** `08-chat-summary.md` (340 lines)  
**Better:** Reference conversations, summarize key points

**Format:**
```markdown
## Recent Conversations
- Session 1: `conversations/2026-01-21-feature-x.md` (feature implementation)
- Session 2: `conversations/2026-01-21-bug-fix.md` (bug resolution)

Key outcomes:
- Feature X implemented
- Bug Y fixed
```

### 4. Index Files for Large Directories

**Create:** `prompts/dashboard/INDEX.md`
```markdown
# Dashboard Prompts Index
- `27-user-profile.md` — User Profile dashboard
- `28-company-profile.md` — Company Profile dashboard
```

Agent reads index first, pulls specific files when needed.

---

## 🎯 Quick Wins

1. **Reference rule files** instead of duplicating content
2. **Use section anchors** for large docs (`file.md#section`)
3. **Create index files** for directories with 10+ files
4. **Summarize conversations** instead of pasting full logs
5. **Reference specific skills** instead of loading entire `skills.md`

---

## 📊 Impact

- **Dynamic context doc:** 64% reduction (225 → 81 lines)
- **Potential savings:** ~70% if all patterns applied
- **Result:** Faster responses, better focus, lower token usage

---

**Reference:** `.cursor/rules/dynamic-context-discovery.mdc`
