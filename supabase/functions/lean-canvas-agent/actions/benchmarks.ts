/**
 * Industry Benchmarks Actions
 * Fetch and display industry-specific benchmarks
 */

import type { BoxKey, BenchmarkData } from "../types.ts";
import { callGemini, extractJSON } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Get benchmarks for specific industry and stage
 */
export async function getBenchmarks(
  supabase: SupabaseClient,
  industry: string,
  stage: string
): Promise<{ benchmarks: BenchmarkData[]; source: 'pack' | 'ai' }> {
  console.log(`[getBenchmarks] Fetching benchmarks for ${industry}, ${stage}`);

  // Try to get from industry pack first
  const { data: pack } = await supabase
    .from("industry_packs")
    .select("benchmarks, name")
    .eq("industry_key", industry.toLowerCase())
    .eq("is_active", true)
    .single();

  if (pack?.benchmarks) {
    const benchmarks = parseBenchmarks(pack.benchmarks, stage, pack.name);
    if (benchmarks.length > 0) {
      return { benchmarks, source: 'pack' };
    }
  }

  // Fallback to AI generation
  const aiResult = await generateBenchmarks(industry, stage);
  return { benchmarks: aiResult, source: 'ai' };
}

function parseBenchmarks(
  packBenchmarks: Record<string, unknown>,
  stage: string,
  packName: string
): BenchmarkData[] {
  const benchmarks: BenchmarkData[] = [];

  // Key Metrics benchmarks
  if (packBenchmarks.churn) {
    benchmarks.push({
      box: 'keyMetrics',
      benchmark: 'Monthly Churn Rate',
      value: String(packBenchmarks.churn),
      context: `${packName} industry average`,
      source: `${packName} Industry Pack`,
    });
  }

  if (packBenchmarks.growth_rate) {
    benchmarks.push({
      box: 'keyMetrics',
      benchmark: 'Monthly Growth Rate',
      value: String(packBenchmarks.growth_rate),
      context: `Target for ${stage} stage`,
      source: `${packName} Industry Pack`,
    });
  }

  // Cost Structure benchmarks
  const burnRate = packBenchmarks.burn_rate as Record<string, unknown> | undefined;
  if (burnRate && burnRate[stage]) {
    benchmarks.push({
      box: 'costStructure',
      benchmark: 'Monthly Burn Rate',
      value: String(burnRate[stage]),
      context: `Typical for ${stage} stage companies`,
      source: `${packName} Industry Pack`,
    });
  }

  // Revenue benchmarks
  if (packBenchmarks.pricing_models) {
    benchmarks.push({
      box: 'revenueStreams',
      benchmark: 'Common Pricing Models',
      value: Array.isArray(packBenchmarks.pricing_models) 
        ? packBenchmarks.pricing_models.join(', ')
        : String(packBenchmarks.pricing_models),
      context: `Most successful in ${packName}`,
      source: `${packName} Industry Pack`,
    });
  }

  // Market benchmarks
  if (packBenchmarks.market_size) {
    benchmarks.push({
      box: 'customerSegments',
      benchmark: 'Market Size',
      value: String(packBenchmarks.market_size),
      context: `Total Addressable Market for ${packName}`,
      source: `${packName} Industry Pack`,
    });
  }

  // Channel benchmarks
  if (packBenchmarks.top_channels) {
    benchmarks.push({
      box: 'channels',
      benchmark: 'Top Acquisition Channels',
      value: Array.isArray(packBenchmarks.top_channels)
        ? packBenchmarks.top_channels.join(', ')
        : String(packBenchmarks.top_channels),
      context: `Most effective for ${packName}`,
      source: `${packName} Industry Pack`,
    });
  }

  return benchmarks;
}

async function generateBenchmarks(
  industry: string,
  stage: string
): Promise<BenchmarkData[]> {
  const systemPrompt = `You are a startup benchmarking expert. Provide realistic industry benchmarks for startups.`;

  const userPrompt = `Generate benchmarks for a ${stage} stage ${industry} startup.

Return JSON:
{
  "benchmarks": [
    {
      "box": "keyMetrics",
      "benchmark": "Monthly Churn",
      "value": "5-7%",
      "context": "Industry average for B2B SaaS",
      "source": "OpenView Partners 2025"
    }
  ]
}

Include benchmarks for: keyMetrics, costStructure, revenueStreams, customerSegments, channels.
Use realistic values with credible sources.`;

  const response = await callGemini(
    "gemini-3-flash-preview",
    systemPrompt,
    userPrompt,
    { jsonMode: true, maxTokens: 1500 }
  );
  const parsed = extractJSON<{ benchmarks: BenchmarkData[] }>(response.text);

  return parsed?.benchmarks || [];
}
