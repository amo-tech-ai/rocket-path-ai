# OpenClaw Architecture

> Source: https://docs.openclaw.ai/concepts/architecture

## Core Design

Single long-lived **Gateway daemon** that manages all messaging surfaces. One Gateway per host.

```
Channels (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, WebChat, 22+)
    |
    v
Gateway (port 18789, loopback, WebSocket + HTTP)
    |
    +-- Agent Runtime
    |     +-- System Prompt (AGENTS.md + SOUL.md + USER.md + skills)
    |     +-- Model Provider (openai-codex, google, anthropic, etc.)
    |     +-- Tool Execution (exec, browser, web_search, cron, etc.)
    |
    +-- Session Manager
    |     +-- Main session (direct DMs, shared context)
    |     +-- Isolated sessions (groups, cron, per-channel-peer)
    |
    +-- Channel Bridge
          +-- WhatsApp (Baileys)
          +-- Telegram (Bot API)
          +-- Discord (Bot)
          +-- ... 20+ more
```

## Connection Types

Three client types connect via WebSocket:

1. **Control-plane clients** — macOS app, CLI, web UI, automations
2. **Nodes** — macOS/iOS/Android devices (role: node, expose camera/canvas/screen/location)
3. **WebChat** — Static UI consuming Gateway WS API

## Wire Protocol

JSON-based WebSocket protocol:
- First frame must be `connect`
- Requests: `{type:"req", id, method, params}` -> `{type:"res", id, ok, payload|error}`
- Events: `{type:"event", event, payload, seq?, stateVersion?}`
- Side-effecting methods (send, agent) require idempotency keys

## Trust Model

**Personal assistant model** — one trusted operator per gateway.

- NOT multi-tenant hostile isolation
- For adversarial-user separation, run distinct gateways with separate OS users
- `session.dmScope: "per-channel-peer"` isolates conversation context per sender
- This is messaging-context separation, not security isolation

## Device Pairing

- All WS clients include device identity on connect
- New devices require approval (Gateway issues device tokens)
- Local connections (loopback/same tailnet) can auto-approve
- All connects sign a challenge nonce
- Non-local connections ALWAYS require explicit approval

## Config Reload

- `hybrid` mode (default) — applies hot-safe changes, restarts when necessary
- `hot` — only safe changes, no restart
- `restart` — always restart
- `off` — manual restart only

## Canvas & UI

Gateway HTTP server provides:
- `/__openclaw__/canvas/` — agent-editable HTML/CSS/JS
- `/__openclaw__/a2ui/` — A2UI host interface
- Both on same port (18789)

## Remote Access

- Tailscale/VPN (preferred)
- SSH tunneling: `ssh -N -L 18789:127.0.0.1:18789 user@host`
- Same auth mechanisms apply across tunnels
