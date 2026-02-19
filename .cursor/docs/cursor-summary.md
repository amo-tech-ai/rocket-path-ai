# Cursor Features - Quick Summary

**Last Updated:** January 21, 2026  
**Based on:** Official Cursor Documentation

---

## ⚠️ Important: Three Different "Debug" Features

**Don't confuse these three different features:**

1. **IDE Debugger** ("Select debugger" menu)
   - Standard IDE debugger for running code (Node.js, Python, etc.)
   - Triggered by `F5` or Run/Debug button
   - **NOT** what you need for Cursor features

2. **Debug Mode** (AI Workflow)
   - Cursor's AI bug-fixing workflow
   - Activated via mode selector in chat UI (bottom left of chat input)
   - **This is what the guides below describe**

3. **Bugbot** (PR Reviews)
   - Automatic PR review tool for GitHub/GitLab
   - Configured at [cursor.com/dashboard](https://cursor.com/dashboard?tab=bugbot)
   - **Separate feature** - see [Bugbot docs](https://cursor.com/docs/bugbot)

**If you see "Select debugger" menu:** Close it (press `Escape`) - that's the IDE debugger, not Debug Mode.

---

## ✅ What We Did (Programmatically)

### 1. Added Debug Logging ✅
**Files Modified:**
- `src/hooks/useEvents.ts`
- `src/hooks/useCRM.ts`
- `src/hooks/useAIChat.ts`

**What It Does:**
- Logs actions to browser console when `import.meta.env.DEV` is true
- Format: `[Debug Mode] hookName - Action: {...}`
- Always-on debug logs (separate from Debug Mode workflow)

**How to Use:**
1. Open browser console (`F12` or `Cmd+Option+I`)
2. Navigate to app → Trigger actions
3. See logs: `[Debug Mode] useEvents - Fetching events: {...}`

---

### 2. Optimized Gemini Rules ✅
**What Changed:**
- Set individual rule files to `alwaysApply: false`
- Kept index file (`00-gemini-index.mdc`) with `alwaysApply: true`

**Result:**
- ~60-70% context reduction
- Rules load on-demand (not all at once)

**No action needed** - Works automatically

---

## ⚙️ What You Need to Do (Manually)

### 1. Use Debug Mode (Workflow)

**What It Is:** Bug-fixing workflow mode (not a settings toggle)

**How to Activate (Windows PC):**
- **Method 1 (Easiest):** 
  - **Location:** Bottom left of chat input box (AI pane on right side)
  - **Action:** Click on current mode label (e.g., "Agent" or "Ask")
  - **Result:** Dropdown opens → Select **"Debug"**
- **Method 2:** Command Palette (`Ctrl + Shift + P`) → Type "Debug Mode" → Select
- **Method 3:** If `Ctrl + .` zooms instead, use Method 1 (visual dropdown is most reliable)

**Mac Users:**
- `Cmd + .` (period) OR mode dropdown

**How It Works:**
1. Activate Debug Mode (use mode dropdown if shortcut doesn't work)
2. Describe bug in chat
3. Agent adds logging → You reproduce bug
4. Agent analyzes logs → Proposes fix
5. Agent removes instrumentation after fix

**Reference:** https://cursor.com/blog/debug-mode

---

### 2. Code Reviews (Automatic)

**What It Is:** Automatic diff view when Agent makes changes

**How It Works:**
- Agent generates code → Diff view appears automatically
- Color-coded changes (green = add, red = delete)
- Review controls: Accept/reject at line, file, or all level

**No setup needed** - Works automatically

**Optional:** Configure Bugbot for PR reviews (per repository)

---

### 3. Browser Layout (UI Development)

**How to Activate (Windows PC):**
- **Method 1:** Press `Ctrl+Alt+Tab` → Select "Browser" layout
- **Method 2:** Command Palette (`Ctrl + Shift + P`) → Type "Browser Layout" → Select
- **Method 3:** View menu → Layouts → Browser

**Mac Users:**
- `Cmd+Option+Tab` → Select "Browser"

**Features:**
- Component tree (left sidebar)
- CSS editor (right sidebar)
- Real-time style changes
- Element inspection

**Use For:** UI development, CSS debugging, responsive design

**Note:** If `Ctrl+Alt+Tab` switches Windows apps instead, use Method 2 (Command Palette)

---

### 4. Pin Important Chats

**How to Do:**
- Right-click chat → Select "Pin Chat"
- Pinned chats appear at top of sidebar

**Use For:** Quick access to architecture decisions, debugging sessions

---

## 📊 Quick Reference

| Feature | Type | How to Use |
|---------|------|------------|
| **Debug Logging** | ✅ Programmatic | Already added - check browser console |
| **Debug Mode** | ⚙️ Manual | **Windows:** Click mode label (bottom left of chat input) OR `Ctrl+Shift+P` → "Debug Mode"<br>**Mac:** `Cmd + .` OR click mode label (bottom left of chat input) |
| **Code Reviews** | ✅ Automatic | Happens when Agent makes changes |
| **Browser Layout** | ⚙️ Manual | **Windows:** `Ctrl+Alt+Tab` OR `Ctrl+Shift+P` → "Browser Layout"<br>**Mac:** `Cmd+Option+Tab` |
| **Pinned Chats** | ⚙️ Manual | Right-click → Pin |

---

## 🎯 Quick Start (5 minutes)

1. **Test Debug Logging:**
   - Open app → Browser console (`F12`)
   - Navigate to Events/CRM → See logs

2. **Try Debug Mode (Windows):**
   - **Easiest:** 
     - **Location:** Bottom left of chat input box (AI pane on right side)
     - **Action:** Click on current mode label (e.g., "Agent" or "Ask")
     - **Result:** Dropdown opens → Select "Debug"
   - **Alternative:** `Ctrl+Shift+P` → Type "Debug Mode" → Select
   - Describe a bug → Follow workflow

3. **Try Browser Layout (Windows):**
   - Press `Ctrl+Alt+Tab` → Select "Browser"
   - **OR:** `Ctrl+Shift+P` → Type "Browser Layout" → Select
   - Edit CSS → See instant changes

4. **Pin a Chat:**
   - Right-click important chat → Pin

---

## 📚 Documentation

- **Full Guide:** `.cursor/docs/IMPLEMENTATION-GUIDE.md`
- **Corrections:** `.cursor/docs/CORRECTED-FEATURES-GUIDE.md`
- **Roadmap:** `.cursor/docs/CURSOR-FEATURES-ROADMAP.md`
- **Official Docs:** https://docs.cursor.com

---

## ⚠️ Common Mistakes & Windows-Specific Issues

**❌ DON'T:**
- Look for Debug Mode in Settings → Beta (it's not there)
- Look for AI Code Reviews toggle (doesn't exist - it's automatic)
- Use `Ctrl + .` if it zooms instead (Windows zoom conflict)

**✅ DO (Windows PC):**
- **Debug Mode:** 
  - **Location:** Bottom left of chat input box (AI pane on right side)
  - **Action:** Click on current mode label (e.g., "Agent" or "Ask") → Select "Debug"
  - **OR:** `Ctrl+Shift+P` → "Debug Mode"
- **Browser Layout:** `Ctrl+Alt+Tab` OR `Ctrl+Shift+P` → "Browser Layout"
- Code reviews happen automatically (no setup needed)

**If Shortcuts Don't Work:**
- Use **Command Palette** (`Ctrl+Shift+P`) - works reliably on Windows
- Use **visual dropdowns** - click mode selector at bottom left of chat input box
- Check Cursor has focus (click in Cursor window first)

---

---

## 🪟 Windows PC Users

### 📍 Exact Location: Mode Selector

**Where to Find It:**
- **Location:** Bottom left of chat input box (AI pane on right side)
- **What You'll See:** Current mode label (e.g., "Agent", "Ask", "Debug")
- **How to Use:** Click the mode label → Dropdown opens → Select "Debug"

**Visual Guide:**
```
┌─────────────────────────────────────┐
│  AI Chat Pane (Right Side)          │
│                                     │
│  [Chat messages...]                 │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Type your message...         │   │
│  └─────────────────────────────┘   │
│  [Agent ▼]  ← Click here!          │ ← Bottom left
│  (Model selector below)            │
└─────────────────────────────────────┘
```

**If `Ctrl + .` zooms instead:**
- ✅ **Use mode dropdown** (bottom left of chat input box - click mode label)
- ✅ **OR:** `Ctrl+Shift+P` → Type "Debug Mode"

**If `Ctrl+Alt+Tab` switches Windows apps:**
- ✅ **Use:** `Ctrl+Shift+P` → Type "Browser Layout"

**See:** `.cursor/docs/WINDOWS-SHORTCUTS.md` for Windows-specific guide

---

**Status:** Code changes complete ✅ | Features ready to use ⚙️
