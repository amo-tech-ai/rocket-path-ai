# Cursor CLI Quick Reference

**Purpose:** Quick reference for Cursor CLI commands and shortcuts  
**Last Updated:** January 16, 2026

---

## 🎯 Most Used Commands

### Model Selection
```bash
# List all available models
cursor agent models

# In chat (slash command)
/models
```

### Rule Management
```bash
# In chat - list active rules
/rules

# In chat - enable rule
/rules enable <rule-name>

# In chat - disable rule
/rules disable <rule-name>
```

### MCP Server Management
```bash
# In chat - enable MCP server
/mcp enable <server-name>

# In chat - disable MCP server
/mcp disable <server-name>

# In chat - list active servers
/mcp list
```

---

## ⌨️ Keyboard Shortcuts

### Layout Switching
- `Cmd/Ctrl + Option/Alt + Tab` - Cycle through layouts
  - Agent layout
  - Editor layout
  - Browser layout
  - Zen layout

### Chat Commands
- `/models` - Switch models
- `/rules` - Manage rules
- `/mcp` - Manage MCP servers
- `/clear` - Clear chat history

### General
- `Cmd/Ctrl + ,` - Open Settings
- `Cmd/Ctrl + Shift + P` - Command Palette
- `Cmd/Ctrl + K` - Quick Actions

---

## 🔧 Advanced Usage

### Model Selection Strategy

**For Different Tasks:**
- **Code Generation:** `gemini-2.5-flash` (fast, cost-effective)
- **Complex Reasoning:** `gemini-3-pro-preview` (deep thinking)
- **Code Review:** `claude-3.5-sonnet` (thorough analysis)
- **Quick Fixes:** `gemini-2.5-flash` (fast iteration)

### Rule Management Best Practices

**Enable Rules by Context:**
- Development: Enable all rules
- Debugging: Enable debug-specific rules
- Testing: Enable test rules
- Documentation: Enable doc rules

**Disable When:**
- Rules conflict with task
- Need different behavior
- Testing new approaches

### MCP Server Usage

**Current Active Servers:**
- `supabase` - Database operations
- `context7` - Library documentation

**When to Enable/Disable:**
- Enable when needed for specific tasks
- Disable to reduce token usage
- Use `/mcp list` to see active servers

---

## 📋 Command Examples

### Switch Model in Chat
```
User: /models
Cursor: [Shows list of available models]
User: Select gemini-3-pro-preview
```

### Enable Rule
```
User: /rules enable browser-testing
Cursor: Browser testing rule enabled
```

### Disable MCP Server
```
User: /mcp disable context7
Cursor: Context7 MCP server disabled
```

### List Active Rules
```
User: /rules
Cursor: [Shows all active rules with status]
```

---

## 🎓 Learning Path

### Beginner (Week 1)
1. Learn `/models` command
2. Try different layouts (`Cmd/Ctrl + Option/Alt + Tab`)
3. Use `/rules` to see active rules

### Intermediate (Week 2)
1. Enable/disable rules based on task
2. Manage MCP servers
3. Use keyboard shortcuts regularly

### Advanced (Week 3+)
1. Create custom rule combinations
2. Optimize model selection per task
3. Automate workflows with CLI

---

## 💡 Pro Tips

1. **Model Switching:** Use `/models` frequently to optimize for task type
2. **Rule Management:** Disable unnecessary rules to reduce context
3. **MCP Servers:** Enable only when needed to save tokens
4. **Layouts:** Use Browser layout for UI work, Zen for focused coding
5. **Shortcuts:** Memorize `Cmd/Ctrl + Option/Alt + Tab` for quick layout switching

---

## 🐛 Troubleshooting

### Commands Not Working
- Check Cursor version (requires 2.3+)
- Restart Cursor
- Verify feature is enabled in settings

### Model Not Available
- Check API key configuration
- Verify model name spelling
- Check model availability in your region

### Rules Not Applying
- Verify rule file exists in `.cursor/rules/`
- Check rule syntax
- Restart Cursor after adding rules

---

**Quick Access:** Keep this file open in Cursor for quick reference
