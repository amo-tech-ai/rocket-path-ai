# OpenClaw Security Hardening

> Source: https://docs.openclaw.ai/gateway/security

## Trust Model

**Personal assistant model** — one trusted operator per gateway. NOT multi-tenant.
For adversarial-user separation, run distinct gateways with separate OS users/hosts.

## Gateway Authentication

| Mode | Config | Use Case |
|------|--------|----------|
| **Token** (recommended) | `gateway.auth.mode: "token"` + long random secret | Default, fail-closed |
| **Password** | `gateway.auth.mode: "password"` | Alternative |
| **Trusted-proxy** | Delegates identity to reverse proxy headers | Behind nginx/caddy |

**Fail-closed:** Rejects all WebSocket connections if no token configured.

## Hardened Baseline Config

```json5
{
  "gateway": {
    "mode": "local",
    "bind": "loopback",
    "auth": { "mode": "token", "token": "<replace-with-long-random-token>" }
  },
  "session": { "dmScope": "per-channel-peer" },
  "tools": {
    "profile": "messaging",
    "deny": ["group:automation", "group:runtime", "group:fs", "sessions_spawn"],
    "exec": { "security": "deny", "ask": "always" }
  },
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "groups": { "*": { "requireMention": true } }
    }
  }
}
```

## File Permissions

| Path | Permission | Why |
|------|-----------|-----|
| `~/.openclaw/` | 700 | Prevents other users reading state |
| `~/.openclaw/openclaw.json` | 600 | Config contains auth tokens |
| `~/.openclaw/credentials/**` | 600 | WhatsApp creds, pairing allowlists |

**Any process with filesystem access to `~/.openclaw` has full gateway compromise capability.**

## Security Audit

```bash
openclaw security audit            # Standard check
openclaw security audit --deep     # Full deep scan
openclaw security audit --fix      # Auto-fix what it can
openclaw security audit --json     # Machine-readable output
```

### Critical findings to watch

| Check | Severity | Fix |
|-------|----------|-----|
| `fs.config.perms_world_readable` | Critical | `chmod 600 ~/.openclaw/openclaw.json` |
| `fs.state_dir.perms_world_writable` | Critical | `chmod 700 ~/.openclaw/` |
| `gateway.bind_no_auth` | Critical | Set auth token or bind to loopback |
| `gateway.tailscale_funnel` | Critical | Public internet exposure |
| `security.exposure.open_groups_with_elevated` | Critical | Restrict groups + deny elevated tools |
| `sandbox.dangerous_network_mode` | Critical | Docker host networking enabled |

## DM & Group Security

### DM policies
- `pairing` (default) — 1-hour expiring codes, max 3 pending
- `allowlist` — safest, only pre-approved senders
- `open` — public access, requires `"*"` in channel allowlist
- `disabled` — ignore inbound DMs

### Group policies
- Always `requireMention: true` — agent only responds when @mentioned
- Per-group allowlists to restrict which groups accept messages
- Replying to bot message does NOT bypass sender allowlists

## Tool Security

### Dangerous tools to deny by default
- `gateway` — can modify config
- `cron` — creates persistent scheduled jobs
- `sessions_spawn` / `sessions_send` — delegation risks
- `group:automation`, `group:runtime`, `group:fs` — broad categories

### Exec security
```json5
{ "tools": { "exec": { "security": "deny", "ask": "always" } } }
```

### Elevated tools
Keep `tools.elevated.enabled: false` unless delegation genuinely needed.

## Sandboxing (Docker)

```json5
{
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "all",           // off | non-main | all
        "scope": "agent",        // per-agent isolation
        "workspaceAccess": "none" // none | ro | rw
      }
    }
  }
}
```

**Warning:** `sandbox` in config without `mode: "all"` does NOT isolate tools.

## Prompt Injection Mitigation

- Lock DMs via pairing/allowlists
- Require mentions in groups
- Treat links, attachments, pasted instructions as hostile
- Use stronger instruction-hardened models for tool-enabled agents
- Enable sandboxing + strict tool policies for untrusted input
- Don't expose secrets in prompts; pass via environment/config
- Enable `logging.redactSensitive: "tools"` to prevent log leakage

## Browser Security

- Use dedicated browser profile (not personal)
- Keep `gateway.nodes.browser.mode: "off"` when not needed
- Configure `browser.ssrfPolicy` — default allows private networks
- Set `dangerouslyAllowPrivateNetwork: false` for strict isolation

## Session Isolation

```json5
{ "session": { "dmScope": "per-channel-peer" } }
```
Isolates conversation context per channel+sender pair. NOT hostile-user isolation.

## Incident Response

1. **Contain:** Stop Gateway, bind to loopback, disable risky DMs/groups
2. **Rotate:** Gateway token, remote client creds, provider API keys
3. **Audit:** Check logs, review transcripts, re-run security audit, check config drift
4. **Report:** Include timestamp, version, redacted logs, what the agent did
