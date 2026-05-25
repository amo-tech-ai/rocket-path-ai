---
name: openclaw-setup
description: >
  OpenClaw Gateway setup, configuration, and best practices.
  Use when installing OpenClaw, configuring channels (WhatsApp/Telegram/Discord),
  setting up providers (OpenAI/Google/Anthropic), creating skills, managing the
  gateway daemon, or troubleshooting OpenClaw issues.
  Triggers on: openclaw, gateway, whatsapp channel, telegram bot, openclaw skill,
  openclaw config, openclaw install, openclaw cron, openclaw security.
version: 1.0.0
metadata:
  filePattern:
    - "**/.openclaw/**"
    - "**/openclaw*"
    - "**/SKILL.md"
    - "**/AGENTS.md"
  bashPattern:
    - "openclaw"
---

# OpenClaw Setup & Best Practices

> **Docs:** https://docs.openclaw.ai
> **Repo:** https://github.com/openclaw/openclaw (329K stars, MIT)
> **Version:** 2026.3.x | **Runtime:** Node.js 24 (or 22.16+ LTS)

## Quick Reference

```bash
# Install
curl -fsSL https://openclaw.ai/install.sh | bash
# Or: npm install -g openclaw@latest && openclaw onboard --install-daemon

# Daily operations
openclaw gateway status          # Check health
openclaw gateway restart         # Apply config changes
openclaw skills list             # Show loaded skills
openclaw channels list           # Show connected channels
openclaw agent --message "..."   # Test agent locally
openclaw security audit --deep   # Security check
openclaw doctor                  # Health + fixes
openclaw logs --follow           # Tail gateway logs
```

## Architecture (Single Gateway)

```
Channels (WhatsApp/Telegram/Discord/...)
    |
    v
OpenClaw Gateway (single daemon, port 18789, loopback-only)
    |
    +-- Agent Runtime (loads AGENTS.md + skills)
    +-- Tool Execution (exec, browser, web_search, cron)
    +-- Model Provider (openai-codex/gpt-5.4, google/gemini, etc.)
    |
    v
External APIs (Supabase EFs, REST, any HTTP endpoint)
```

**Key facts:**
- One Gateway per host (single Baileys WhatsApp session)
- WebSocket + HTTP on same port (18789)
- JSON wire protocol: `{type:"req", id, method, params}`
- Side-effecting methods need idempotency keys
- Config at `~/.openclaw/openclaw.json` (chmod 600)
- State at `~/.openclaw/` (chmod 700)

## Installation

### Prerequisites
- Node.js 24 (recommended) or 22.16+ LTS
- macOS, Linux, or Windows (WSL2)

### Methods (pick one)

```bash
# 1. Automated installer (recommended)
curl -fsSL https://openclaw.ai/install.sh | bash

# 2. npm global
npm install -g openclaw@latest
openclaw onboard --install-daemon

# 3. From source
git clone https://github.com/openclaw/openclaw.git
cd openclaw && pnpm install && pnpm ui:build && pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

### Post-install verification
```bash
openclaw --version
openclaw doctor
openclaw gateway status
```

### Linux systemd (user service)
```bash
# Enable lingering so service survives logout
sudo loginctl enable-linger $(whoami)

# Service file at: ~/.config/systemd/user/openclaw-gateway.service
systemctl --user enable --now openclaw-gateway.service
systemctl --user status openclaw-gateway.service
```

## Configuration (`~/.openclaw/openclaw.json`)

### Essential settings
```json5
{
  "agents": {
    "defaults": {
      "model": { "primary": "openai-codex/gpt-5.4" },
      "workspace": "/home/USER/.openclaw/workspace"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": { "mode": "token", "token": "<long-random-token>" }
  },
  "session": { "dmScope": "per-channel-peer" },
  "tools": {
    "profile": "coding",
    "web": { "search": { "enabled": true, "provider": "gemini" } }
  }
}
```

### Environment variables
```bash
openclaw config set env.MY_KEY "value"     # Set env var
openclaw config get env                     # List all env vars
```

Env vars are available to skills and tools at runtime.

### Config reload modes
- `hot` — apply safe changes without restart
- `restart` — restart gateway for breaking changes
- `hybrid` (default) — auto-detect which is needed

## Providers (AI Models)

### Authentication methods

| Provider | Auth | Config Format | Setup Command |
|----------|------|---------------|---------------|
| **OpenAI (API key)** | API key | `openai/gpt-5.4` | `openclaw onboard --openai-api-key "$KEY"` |
| **OpenAI (Codex OAuth)** | OAuth | `openai-codex/gpt-5.4` | `openclaw onboard --auth-choice openai-codex` |
| **Google Gemini** | API key | `google/gemini-3-flash-preview` | `openclaw onboard --auth-choice google-api-key` |
| **Anthropic** | API key | `anthropic/claude-opus-4-6` | Set `ANTHROPIC_API_KEY` env var |

### Key model IDs

| Use Case | Provider Format |
|----------|----------------|
| Fast/cheap | `openai-codex/gpt-5.4` or `google/gemini-3-flash-preview` |
| Strong reasoning | `openai/gpt-5.4` or `anthropic/claude-opus-4-6` |
| Image understanding | `google/gemini-3.1-pro-preview` |
| Search grounding | `google/gemini-3-flash-preview` (built-in) |

### Multiple keys + rotation
Configure multiple API keys per provider. On 429 rate limit, OpenClaw auto-rotates to next key.

## Channels

### Fastest setup: Telegram
```bash
openclaw channels add telegram
# Paste your bot token from @BotFather
```

### WhatsApp (QR pairing)
```bash
openclaw channels add whatsapp
# Scan QR code with WhatsApp -> Linked Devices -> Link a Device
```

### Channel config
```json5
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "allowlist",       // pairing | allowlist | open | disabled
      "allowFrom": ["+1234567890"],   // E.164 phone numbers
      "selfChatMode": true,           // Chat with yourself
      "groupPolicy": "allowlist",
      "debounceMs": 0,
      "mediaMaxMb": 50
    },
    "telegram": {
      "enabled": true,
      "dmPolicy": "allowlist",
      "groups": { "*": { "requireMention": true } }
    }
  }
}
```

**DM policies:**
- `pairing` (default) — unknown senders get 1-hour pairing codes (max 3 pending)
- `allowlist` — only pre-approved senders (safest)
- `open` — anyone can DM (requires `"*"` in allowlist)
- `disabled` — ignore all DMs

**Group policy:** Always set `requireMention: true` to prevent always-on bot.

## Skills

### Directory precedence (highest first)
1. `<workspace>/skills/` — per-agent, workspace-specific
2. `~/.openclaw/skills/` — shared across all agents
3. Bundled skills — shipped with OpenClaw
4. `skills.load.extraDirs` — additional directories

### Creating a skill
```
~/.openclaw/workspace/skills/my-skill/
  SKILL.md
```

### SKILL.md format
```markdown
---
name: my_skill
description: One-line description shown to the agent.
version: 1.0.0
metadata: {"openclaw":{"requires":{"env":["MY_API_KEY"]}}}
---

# My Skill

Instructions for the agent. Use markdown with code blocks for tool calls.
The agent reads this file when the skill triggers.
```

### Required metadata fields
- `name` (snake_case)
- `description` (one-line, used for skill matching)

### Optional metadata
- `metadata.openclaw.requires.env` — required env vars (skill shows "missing" if not set)
- `metadata.openclaw.requires.bins` — required binaries on PATH
- `metadata.openclaw.requires.config` — required config keys
- `metadata.openclaw.os` — platform filter (darwin, linux, win32)

### Skill injection
Skills are injected as compact references in the system prompt. The agent uses the `read` tool to load the full SKILL.md when a skill triggers. Skills must be loaded in a **new session** — old sessions don't pick up new skills.

```bash
# After adding/modifying a skill:
openclaw gateway restart
# Then start a new session (old sessions have cached skill lists)
```

### Skills config
```json5
{
  "skills": {
    "load": {
      "extraDirs": ["~/my-skills"],  // Additional skill directories
      "watch": true,                  // Auto-reload on file change
      "watchDebounceMs": 250
    },
    "entries": {
      "my-skill": {
        "enabled": true,              // Toggle individual skills
        "env": { "API_KEY": "..." }   // Per-skill env vars
      }
    }
  }
}
```

## Tools

### Built-in tool groups

| Group | Tools | Use Case |
|-------|-------|----------|
| **fs** | read, write, edit, apply_patch | File operations |
| **runtime** | exec, process | Shell commands |
| **web** | web_search, web_fetch, browser | Web interaction |
| **sessions** | sessions_list, sessions_send, sessions_spawn | Multi-agent |
| **automation** | cron, gateway | Scheduling, config |
| **messaging** | message | Cross-channel messaging |
| **ui** | canvas, image, image_generate | Visual content |
| **nodes** | nodes | Device management |
| **memory** | memory_search, memory_get | Agent memory |

### Tool profiles (presets)
- `full` — everything enabled
- `coding` — fs + runtime + web (default for dev)
- `messaging` — messaging + web (safe for chat bots)
- `minimal` — read-only + web search

### Cron (scheduling)
```bash
# Add a recurring job
openclaw cron add \
  --name "daily-check" \
  --schedule "0 8 * * *" \
  --timezone "America/Toronto" \
  --session isolated \
  --message "Run daily health check" \
  --announce whatsapp

# One-shot
openclaw cron add --name "reminder" --at "2026-03-23T14:00:00Z" --message "Meeting in 5 min"

# List / remove
openclaw cron list
openclaw cron remove --name "daily-check"
```

Jobs persist at `~/.openclaw/cron/jobs.json`. Isolated sessions get dedicated context per run.

## Security Best Practices

### Hardened baseline
```json5
{
  "gateway": {
    "bind": "loopback",
    "auth": { "mode": "token", "token": "<long-random-secret>" }
  },
  "session": { "dmScope": "per-channel-peer" },
  "tools": {
    "profile": "messaging",
    "deny": ["group:automation", "group:runtime", "group:fs", "sessions_spawn"]
  },
  "channels": {
    "whatsapp": { "dmPolicy": "pairing", "groups": { "*": { "requireMention": true } } }
  }
}
```

### Security checklist
- [ ] `gateway.bind: "loopback"` (never expose unauthenticated on 0.0.0.0)
- [ ] Gateway auth token set (fail-closed — rejects connections without token)
- [ ] `~/.openclaw/openclaw.json` is chmod 600
- [ ] `~/.openclaw/` directory is chmod 700
- [ ] DM policy is `pairing` or `allowlist` (never `open` without good reason)
- [ ] Groups require @mention (`requireMention: true`)
- [ ] Dangerous tools denied: gateway, cron, sessions_spawn, exec
- [ ] Run `openclaw security audit --deep` regularly
- [ ] Use dedicated browser profile (not personal)
- [ ] Enable `logging.redactSensitive: "tools"` for log safety

### Security audit
```bash
openclaw security audit --deep    # Full check
openclaw security audit --fix     # Auto-fix what it can
openclaw security audit --json    # Machine-readable output
```

### Critical audit findings
| Check | Severity | Fix |
|-------|----------|-----|
| `fs.config.perms_world_readable` | Critical | `chmod 600 ~/.openclaw/openclaw.json` |
| `fs.state_dir.perms_world_writable` | Critical | `chmod 700 ~/.openclaw/` |
| `gateway.bind_no_auth` | Critical | Set auth token or bind to loopback |
| `security.exposure.open_groups_with_elevated` | Critical | Restrict groups + deny elevated tools |

## Workspace Files

| File | Purpose | Loaded |
|------|---------|--------|
| `AGENTS.md` | Behavioral rules, safety, response style | Every session |
| `SOUL.md` | Agent identity and personality | Every session |
| `USER.md` | Who the human is | Every session |
| `MEMORY.md` | Long-term curated memory | Main session only |
| `TOOLS.md` | Tool-specific notes (API keys, device names) | Every session |
| `HEARTBEAT.md` | Proactive check checklist | On heartbeat poll |
| `IDENTITY.md` | Agent identity metadata | Every session |
| `skills/` | Workspace-level skills (highest priority) | Every session |
| `memory/` | Daily notes (YYYY-MM-DD.md) | On demand |

### Bootstrap budget
- `bootstrapMaxChars`: 20,000 per file (default)
- `bootstrapTotalMaxChars`: 150,000 total (default)
- Files exceeding limits are truncated with warning

## Troubleshooting

```bash
openclaw doctor              # Health checks + quick fixes
openclaw gateway status      # Service status + probe
openclaw channels status     # Channel connection status
openclaw logs --follow       # Tail gateway logs
openclaw skills check        # Which skills are ready vs missing
```

### Common issues

| Problem | Fix |
|---------|-----|
| "Unknown model" error | Check `openclaw models list` — model may need auth setup |
| Skill not in system prompt | Clear sessions, restart gateway, use `--to self` for new session |
| WhatsApp "not linked" | Run `openclaw channels add whatsapp`, scan QR |
| 401 from external API | Token expired — refresh or re-authenticate |
| Gateway won't start | Check port conflict: `lsof -i :18789` |
| "Pass --to or --session-id" | Use `--to self` for local testing |

## References

- `references/install-guide.md` — Full installation instructions
- `references/architecture.md` — Gateway architecture deep dive
- `references/channels.md` — Channel configuration details
- `references/providers.md` — AI model provider setup
- `references/security.md` — Security hardening guide
- `references/tools-and-cron.md` — Tools, cron, and automation
- `references/skills-system.md` — Creating and managing skills

**Official docs:** https://docs.openclaw.ai
