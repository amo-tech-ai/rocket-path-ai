# OpenClaw Installation Guide

> Source: https://docs.openclaw.ai/install

## Prerequisites

- **Node.js 24** (recommended) or 22.16+ LTS
- **OS:** macOS, Linux, Windows (WSL2)
- **pnpm:** Only if building from source

## Installation Methods

### 1. Automated installer (recommended)

**macOS/Linux/WSL2:**
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

Skip onboarding: append `--no-onboard` (bash) or `-NoOnboard` (PowerShell).

### 2. npm global install
```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

### 3. pnpm global install
```bash
pnpm add -g openclaw@latest
pnpm approve-builds -g
openclaw onboard --install-daemon
```

### 4. From source
```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install && pnpm ui:build && pnpm build
pnpm link --global
openclaw onboard --install-daemon
```

### 5. GitHub main branch (bleeding edge)
```bash
npm install -g github:openclaw/openclaw#main
```

## Post-Install Verification

```bash
openclaw --version         # Should show 2026.3.x
openclaw doctor            # Health checks
openclaw gateway status    # Daemon status
```

## Linux-Specific Setup

### Systemd user service
```bash
# Enable lingering (survives logout)
sudo loginctl enable-linger $(whoami)

# Service installed at:
# ~/.config/systemd/user/openclaw-gateway.service

# Enable and start
systemctl --user enable --now openclaw-gateway.service

# Check status
systemctl --user status openclaw-gateway.service

# View logs
journalctl --user -u openclaw-gateway.service -f
```

### System-level service (servers)
```bash
sudo systemctl enable --now openclaw-gateway.service
```

### PATH issues
If `openclaw` not found after install:
```bash
export PATH="$(npm prefix -g)/bin:$PATH"
# Add to ~/.bashrc or ~/.zshrc for persistence
```

## Onboarding Flow

`openclaw onboard --install-daemon` configures:
1. **Auth/provider** — API keys or OAuth tokens
2. **Workspace** — `~/.openclaw/workspace/` with AGENTS.md, SOUL.md, etc.
3. **Gateway** — port, bind, auth mode
4. **Channels** (optional) — WhatsApp, Telegram, Discord
5. **Daemon** (optional) — systemd/launchd background service

## Update

```bash
npm update -g openclaw@latest
openclaw gateway restart
```

## Specialized Deployments

Docker, Podman, Nix, Ansible, Bun, Kubernetes, and cloud platforms (AWS, GCP, Azure, Fly.io, Railway) have dedicated guides at https://docs.openclaw.ai/install.
