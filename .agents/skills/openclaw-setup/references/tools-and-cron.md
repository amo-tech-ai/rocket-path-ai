# OpenClaw Tools & Cron

> Source: https://docs.openclaw.ai/tools

## Built-in Tools

### File Operations
| Tool | Purpose |
|------|---------|
| `read` | Read file contents |
| `write` | Write/create files |
| `edit` | Edit existing files (diff-based) |
| `apply_patch` | Multi-hunk file patches |

### Execution
| Tool | Purpose |
|------|---------|
| `exec` | Run shell commands (foreground) |
| `process` | Manage background processes |

### Web
| Tool | Purpose |
|------|---------|
| `web_search` | Search the web (Brave, Perplexity, Gemini, Grok, Kimi, Firecrawl) |
| `web_fetch` | Fetch and parse web pages |
| `browser` | Control Chromium (navigate, click, screenshot, fill forms) |

### Communication
| Tool | Purpose |
|------|---------|
| `message` | Send messages to any connected channel |

### Sessions & Agents
| Tool | Purpose |
|------|---------|
| `sessions_list` | List active sessions |
| `sessions_history` | View session history |
| `sessions_send` | Send message to another session |
| `sessions_spawn` | Create sub-agent session |
| `sessions_yield` | Yield control to another session |
| `subagents` | Sub-agent management |
| `session_status` | Current session info |

### Memory
| Tool | Purpose |
|------|---------|
| `memory_search` | Search agent memory |
| `memory_get` | Retrieve specific memory |

### UI & Media
| Tool | Purpose |
|------|---------|
| `canvas` | Agent-editable HTML/CSS/JS presentations |
| `image` | Analyze images |
| `image_generate` | Generate images |
| `nodes` | Discover and target paired devices |

### Automation
| Tool | Purpose |
|------|---------|
| `cron` | Schedule recurring/one-shot jobs |
| `gateway` | Manage gateway config |

## Tool Profiles (Presets)

| Profile | Includes | Use Case |
|---------|----------|----------|
| `full` | Everything | Development |
| `coding` | fs + runtime + web | Default for dev work |
| `messaging` | messaging + web | Safe for chat bots |
| `minimal` | read-only + web search | Maximum restriction |

### Tool groups
- `runtime` — exec, process
- `fs` — read, write, edit, apply_patch
- `sessions` — sessions_*, subagents
- `memory` — memory_search, memory_get
- `web` — web_search, web_fetch, browser
- `ui` — canvas, image, image_generate
- `automation` — cron, gateway
- `messaging` — message
- `nodes` — nodes

## Tool Configuration

```json5
{
  "tools": {
    "profile": "coding",
    "allow": ["web_search", "web_fetch", "read", "exec"],
    "deny": ["gateway", "sessions_spawn"],
    "exec": { "security": "ask", "ask": "always" },
    "web": { "search": { "enabled": true, "provider": "gemini" } }
  }
}
```

## Cron System

Built-in scheduler running inside the Gateway (not inside the model).

### Add recurring job
```bash
openclaw cron add \
  --name "daily-briefing" \
  --schedule "0 8 * * *" \
  --timezone "America/Toronto" \
  --session isolated \
  --message "Generate daily startup briefing and send to WhatsApp" \
  --announce whatsapp
```

### Add one-shot job
```bash
openclaw cron add \
  --name "reminder" \
  --at "2026-03-23T14:00:00Z" \
  --message "Meeting with investor in 5 minutes"
```

### Add recurring interval
```bash
openclaw cron add \
  --name "token-refresh" \
  --every 2700000 \
  --message "Refresh Supabase JWT token"
```

### Manage jobs
```bash
openclaw cron list                    # List all jobs
openclaw cron remove --name "job"     # Remove by name
```

### Cron features
- **5-field cron expressions** with timezone (`0 8 * * * America/New_York`)
- **One-shot** (`--at` with ISO 8601 timestamp)
- **Recurring interval** (`--every` with milliseconds)
- **Isolated sessions** (dedicated context per cron run)
- **Announce delivery** to specific channels (WhatsApp, Telegram, Slack)
- **Error handling:** transient errors retried with exponential backoff, permanent errors disable immediately
- **Storage:** jobs persist at `~/.openclaw/cron/jobs.json`

### Best practices
- Use isolated sessions for cron (prevents main session pollution)
- Announce to specific channel for proactive messaging
- Use cron for exact timing, heartbeats for batched periodic checks
- Keep cron messages concise (< 200 words for WhatsApp)

## Web Search Providers

| Provider | Setup |
|----------|-------|
| Gemini | Built-in (default), uses Google API key |
| Brave | `BRAVE_SEARCH_API_KEY` env var |
| Perplexity | Perplexity API key |
| Grok | xAI API key |
| Kimi | Moonshot API key |
| Firecrawl | Firecrawl API key |

15-minute cache on search results.
