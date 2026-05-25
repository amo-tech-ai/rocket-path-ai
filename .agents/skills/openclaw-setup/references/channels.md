# OpenClaw Channels Configuration

> Source: https://docs.openclaw.ai/channels

## Supported Channels (23+)

### Built-in
| Channel | Setup | Notes |
|---------|-------|-------|
| **WhatsApp** | QR code pairing | One session per host (Baileys) |
| **Telegram** | Bot token from @BotFather | Fastest setup |
| **Discord** | Bot token | Supports reactions |
| **iMessage** | BlueBubbles bridge (macOS) | macOS only |
| **Slack** | Bot/app token | Supports threads |
| **Signal** | Signal CLI | Encrypted |
| **IRC** | Server config | Lightweight |
| **Google Chat** | Service account | Enterprise |
| **WebChat** | Built-in (port 18789) | No setup needed |

### Plugin channels
Microsoft Teams, Matrix, Mattermost, LINE, Feishu/Lark, Nostr, Nextcloud Talk, Twitch, Zalo, Synology Chat, Tlon

## Channel Commands

```bash
openclaw channels list              # Show all channels
openclaw channels add whatsapp      # Add WhatsApp (QR)
openclaw channels add telegram      # Add Telegram (token)
openclaw channels status --probe    # Health check all channels
```

## Configuration

### WhatsApp
```json5
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "dmPolicy": "allowlist",
      "selfChatMode": true,
      "allowFrom": ["+14168003103"],
      "groupPolicy": "allowlist",
      "debounceMs": 0,
      "mediaMaxMb": 50
    }
  }
}
```

### Telegram
```json5
{
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "allowlist",
      "groups": { "*": { "requireMention": true } }
    }
  }
}
```

## DM Policies

| Policy | Behavior | Use Case |
|--------|----------|----------|
| `pairing` (default) | Unknown senders get 1-hour pairing codes (max 3 pending) | Moderate security |
| `allowlist` | Only pre-approved senders | Best security |
| `open` | Anyone can DM (requires `"*"` in allowlist) | Public bots |
| `disabled` | Ignore all inbound DMs | Outbound-only |

## Group Policies

- Always set `requireMention: true` (prevents always-on bot)
- Use per-group allowlists for fine control
- Replying to a bot message does NOT bypass sender allowlists

## Media Support

- Text: universal across all channels
- Images/video/audio: varies by platform
- WhatsApp: up to 50MB media (`mediaMaxMb`)
- Voice note transcription supported (requires Whisper)

## Best Practices

1. Start with `allowlist` policy (safest)
2. Set `requireMention: true` for all groups
3. Use `selfChatMode: true` on WhatsApp for testing
4. Telegram is fastest to set up (simple bot token)
5. WhatsApp needs QR re-pairing if session drops
6. One WhatsApp session per host (Gateway limitation)
