# idea-validator Edge Function

Single edge function for the StartupAI validator module. Action-based routing for optimal cold-start performance.

## Actions

| Action | Required body | Description |
|--------|----------------|-------------|
| `quick` | `idea_text` | 60s validation, 6-dim score, verdict |
| `deep` | `idea_text` | 20-section report |
| `competitor_finder` | `idea_text` | Competitor discovery (Gemini) |
| `market_sizer` | `idea_text` | TAM/SAM/SOM |
| `framework_analyzer` | `idea_text` | SWOT / PESTEL / Porter's / JTBD |
| `critic` | `idea_text` | Risk assessment (Claude/Gemini) |
| `generate_ideas` | `background` | Idea generation (Gemini) |

## AI Models

| Action | Primary Model | Fallback |
|--------|---------------|----------|
| `quick`, `deep`, `competitor_finder`, `market_sizer`, `framework_analyzer`, `generate_ideas` | `gemini-2.0-flash` | Heuristic scoring |
| `critic` | `claude-sonnet-4` | `gemini-2.0-flash` |

## Database Persistence

All actions persist results to appropriate tables:
- `validation_reports` - quick, deep
- `validation_scores` - quick, deep
- `competitor_profiles` - competitor_finder
- `market_sizes` - market_sizer
- `framework_analyses` - framework_analyzer
- `critic_reviews` - critic
- `generated_ideas` - generate_ideas

## Env (Supabase secrets)

| Variable | Required For | Description |
|----------|--------------|-------------|
| `GEMINI_API_KEY` | All actions | Gemini 2.0 Flash API key |
| `ANTHROPIC_API_KEY` | `critic` | Claude API key (optional, falls back to Gemini) |
| `SUPABASE_URL` | All | Auto-set by Supabase |
| `SUPABASE_ANON_KEY` | All | Auto-set by Supabase |

## Local test (with Supabase CLI)

```bash
# From repo root
supabase functions serve idea-validator --env-file .env.local

# OPTIONS
curl -i -X OPTIONS http://localhost:54321/functions/v1/idea-validator

# POST (requires valid JWT in Authorization: Bearer <token>)
curl -i -X POST http://localhost:54321/functions/v1/idea-validator \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"action":"quick","idea_text":"B2B SaaS for idea validation"}'
```

## Deploy

```bash
supabase functions deploy idea-validator
```

## Request/Response Examples

### Quick Validation

```bash
curl -X POST $URL \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "quick",
    "idea_text": "AI-powered startup idea validator that provides instant feedback"
  }'
```

Response:
```json
{
  "score": 68,
  "verdict": "conditional",
  "scorecard": {
    "problem": 72,
    "market": 65,
    "competition": 58,
    "solution": 75,
    "business": 62,
    "execution": 55
  },
  "strengths": ["Clear problem", "Growing market", "Technical feasibility"],
  "concerns": ["Competitive landscape", "Customer acquisition", "Unit economics"],
  "report_id": "uuid-here"
}
```

### Critic Analysis

```bash
curl -X POST $URL \
  -H "Authorization: Bearer $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "critic",
    "idea_text": "AI-powered startup idea validator"
  }'
```

Response:
```json
{
  "risks": [
    {
      "title": "Market saturation",
      "severity": "medium",
      "description": "Crowded space with existing solutions",
      "mitigation": "Focus on unique differentiation"
    }
  ],
  "challenges": ["Prove unit economics", "Build defensible moat"],
  "risk_penalty": 3.5,
  "assumptions": [...],
  "investor_questions": [...]
}
```

## Verification checklist

- [x] OPTIONS returns 204 with CORS headers
- [x] POST without JWT → 401
- [x] POST with invalid action → 400
- [x] POST quick with idea_text → 200, body has score, verdict, scorecard, strengths, concerns
- [x] POST deep with idea_text → 200, body has report_id, sections, scorecard, executive_summary
- [x] POST generate_ideas with background → 200, body has ideas array
- [x] All handlers have AI integration with Gemini/Claude
- [x] All handlers persist to database
- [x] Fallback scoring when AI unavailable

## Verification Script

```bash
# Set environment variables
export IDEA_VALIDATOR_URL=https://xxx.supabase.co/functions/v1/idea-validator
export JWT=eyJ...

# Run verification
./verify.sh
```
