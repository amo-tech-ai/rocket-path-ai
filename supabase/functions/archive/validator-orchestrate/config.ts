/**
 * Agent configuration: URLs and timeouts
 * Adjust URLs based on your deployment (local vs production)
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const FUNCTIONS_BASE = `${SUPABASE_URL}/functions/v1`;

export const AGENT_CONFIG = {
  extract: {
    url: `${FUNCTIONS_BASE}/validator-agent-extract`,
    timeout: 30000, // 30s
  },
  research: {
    url: `${FUNCTIONS_BASE}/validator-agent-research`,
    timeout: 90000, // 90s
  },
  competitors: {
    url: `${FUNCTIONS_BASE}/validator-agent-competitors`,
    timeout: 90000, // 90s
  },
  score: {
    url: `${FUNCTIONS_BASE}/validator-agent-score`,
    timeout: 30000, // 30s
  },
  mvp: {
    url: `${FUNCTIONS_BASE}/validator-agent-mvp`,
    timeout: 30000, // 30s
  },
  compose: {
    url: `${FUNCTIONS_BASE}/validator-agent-compose`,
    timeout: 120000, // 120s
  },
} as const;

// Pipeline overall deadline: 300s (5 minutes)
export const PIPELINE_DEADLINE = 300000;
