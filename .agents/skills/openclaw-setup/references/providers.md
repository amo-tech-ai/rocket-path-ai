# OpenClaw Model Providers

> Source: https://docs.openclaw.ai/providers

## Provider Format

All models use `provider/model` format: `openai-codex/gpt-5.4`, `google/gemini-3-flash-preview`

## Setup by Provider

### OpenAI (Direct API Key)
```bash
openclaw onboard --openai-api-key "$OPENAI_API_KEY"
```
- Format: `openai/gpt-5.4`, `openai/gpt-5.4-mini`, `openai/gpt-5.4-pro`
- Usage-based billing
- WebSocket warm-up enabled by default (reduce latency)

### OpenAI (Codex OAuth)
```bash
openclaw onboard --auth-choice openai-codex
```
- Format: `openai-codex/gpt-5.4`, `openai-codex/gpt-5.3-codex-spark`
- ChatGPT Plus/Codex subscription
- Spark model is Codex-only (not available via API key)

### Google Gemini (API Key)
```bash
openclaw onboard --auth-choice google-api-key
```
- Format: `google/gemini-3-flash-preview`, `google/gemini-3.1-pro-preview`
- Set `GEMINI_API_KEY` or `GOOGLE_API_KEY`
- Built-in search grounding, image gen, audio, video understanding

### Anthropic
- Format: `anthropic/claude-opus-4-6`, `anthropic/claude-sonnet-4-6`
- Set `ANTHROPIC_API_KEY` env var

## Configuration

```json5
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openai-codex/gpt-5.4"
      }
    }
  }
}
```

## All Supported Providers (28+)

| Category | Providers |
|----------|-----------|
| **Major cloud** | Anthropic, OpenAI, Google (Gemini), Mistral, Groq, xAI |
| **Gateways** | Amazon Bedrock, Cloudflare AI Gateway, Vercel AI Gateway, LiteLLM |
| **Specialized** | Together AI, Perplexity, Ollama, vLLM, SGLang, Hugging Face, NVIDIA |
| **Regional** | Qianfan, Qwen, Moonshot (Kimi), GLM, MiniMax, Alibaba, Volcengine, Xiaomi |
| **Other** | OpenRouter, Venice AI, OpenCode, Kilocode, Z.AI, Deepgram (audio) |

## Key Configuration Options

| Setting | Purpose |
|---------|---------|
| `fastMode: true` | Low-latency defaults (low reasoning, priority tier) |
| `serviceTier: "priority"` | Faster responses (OpenAI) |
| `openaiWsWarmup: false` | Disable WebSocket warm-up |
| `responsesCompactThreshold` | Server-side context compaction threshold |

## Multiple Keys + Rotation

Configure multiple API keys per provider. On 429 rate limit, OpenClaw auto-rotates to next key. Useful for high-volume deployments.

## Daemon Considerations

For systemd/launchd services, ensure API keys are accessible to the daemon process:
- Use `~/.openclaw/.env` file
- Or set via `openclaw config set env.KEY "value"`
