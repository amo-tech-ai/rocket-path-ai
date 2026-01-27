/**
 * Profile Mapping Actions
 * Maps startup profile fields to Lean Canvas boxes
 */

import type { 
  LeanCanvasData, 
  BoxKey, 
  CoverageLevel, 
  ProfileMappingResult,
  ProfileSyncResult,
  ProfileSyncChange 
} from "../types.ts";
import { EMPTY_CANVAS } from "../types.ts";
import { computeProfileHash } from "../ai-utils.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

/**
 * Map startup profile fields to canvas boxes
 */
export async function mapProfile(
  supabase: SupabaseClient,
  userId: string,
  startupId: string
): Promise<ProfileMappingResult> {
  console.log(`[mapProfile] Mapping profile for startup ${startupId}`);

  // Fetch startup profile
  const { data: startup, error } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  if (error || !startup) {
    console.error("[mapProfile] Failed to fetch startup:", error);
    return {
      canvas: EMPTY_CANVAS,
      coverage: createEmptyCoverage(),
      hasLowCoverage: true,
      lowCoverageBoxes: Object.keys(EMPTY_CANVAS) as BoxKey[],
    };
  }

  const canvas: LeanCanvasData = { ...EMPTY_CANVAS };
  const coverage: Record<BoxKey, CoverageLevel> = {} as Record<BoxKey, CoverageLevel>;
  const lowCoverageBoxes: BoxKey[] = [];

  // Map description → Problem + Solution
  if (startup.description && startup.description.length > 50) {
    const sentences = startup.description.split(/[.!?]+/).filter(Boolean);
    canvas.problem = { 
      items: sentences.slice(0, 2).map((s: string) => s.trim()).filter(Boolean),
      source: 'profile',
      confidence: 'HIGH'
    };
    canvas.solution = { 
      items: sentences.slice(2, 4).map((s: string) => s.trim()).filter(Boolean),
      source: 'profile',
      confidence: 'HIGH'
    };
    coverage.problem = sentences.length > 0 ? 'HIGH' : 'LOW';
    coverage.solution = sentences.length > 2 ? 'HIGH' : 'MODERATE';
  } else {
    coverage.problem = 'LOW';
    coverage.solution = 'LOW';
    lowCoverageBoxes.push('problem', 'solution');
  }

  // Map tagline → UVP
  if (startup.tagline) {
    canvas.uniqueValueProp = { 
      items: [startup.tagline],
      source: 'profile',
      confidence: 'HIGH'
    };
    coverage.uniqueValueProp = 'HIGH';
  } else {
    coverage.uniqueValueProp = 'LOW';
    lowCoverageBoxes.push('uniqueValueProp');
  }

  // Map industry + target_market → Customer Segments
  const segments: string[] = [];
  if (startup.industry) segments.push(`Industry: ${startup.industry}`);
  if (startup.target_market) segments.push(startup.target_market);
  
  if (segments.length > 0) {
    canvas.customerSegments = { 
      items: segments,
      source: 'profile',
      confidence: segments.length > 1 ? 'HIGH' : 'MEDIUM'
    };
    coverage.customerSegments = segments.length > 1 ? 'HIGH' : 'MODERATE';
  } else {
    coverage.customerSegments = 'LOW';
    lowCoverageBoxes.push('customerSegments');
  }

  // Map traction_data → Key Metrics
  if (startup.traction_data && typeof startup.traction_data === 'object') {
    const metrics: string[] = [];
    const td = startup.traction_data as Record<string, unknown>;
    if (td.users) metrics.push(`Users: ${td.users}`);
    if (td.revenue || td.mrr) metrics.push(`Revenue: ${td.revenue || td.mrr}`);
    if (td.growth) metrics.push(`Growth: ${td.growth}`);
    if (td.retention) metrics.push(`Retention: ${td.retention}`);
    
    if (metrics.length > 0) {
      canvas.keyMetrics = { 
        items: metrics,
        source: 'profile',
        confidence: metrics.length >= 2 ? 'HIGH' : 'MEDIUM'
      };
      coverage.keyMetrics = metrics.length >= 2 ? 'HIGH' : 'MODERATE';
    } else {
      coverage.keyMetrics = 'LOW';
      lowCoverageBoxes.push('keyMetrics');
    }
  } else {
    coverage.keyMetrics = 'LOW';
    lowCoverageBoxes.push('keyMetrics');
  }

  // Map business_model → Revenue Streams
  if (startup.business_model && Array.isArray(startup.business_model) && startup.business_model.length > 0) {
    canvas.revenueStreams = { 
      items: startup.business_model,
      source: 'profile',
      confidence: 'MEDIUM'
    };
    coverage.revenueStreams = 'MODERATE';
  } else {
    coverage.revenueStreams = 'LOW';
    lowCoverageBoxes.push('revenueStreams');
  }

  // Map competitors → Unfair Advantage (infer differentiation)
  if (startup.competitors && Array.isArray(startup.competitors) && startup.competitors.length > 0) {
    canvas.unfairAdvantage = { 
      items: [`Differentiation from: ${startup.competitors.join(', ')}`],
      source: 'profile',
      confidence: 'MEDIUM'
    };
    coverage.unfairAdvantage = 'MODERATE';
  } else {
    coverage.unfairAdvantage = 'LOW';
    lowCoverageBoxes.push('unfairAdvantage');
  }

  // Map marketing_channels or traction_data → Channels
  const channels: string[] = [];
  if (startup.marketing_channels && Array.isArray(startup.marketing_channels)) {
    channels.push(...startup.marketing_channels);
  }
  
  if (channels.length > 0) {
    canvas.channels = { 
      items: channels,
      source: 'profile',
      confidence: 'MEDIUM'
    };
    coverage.channels = 'MODERATE';
  } else {
    coverage.channels = 'LOW';
    lowCoverageBoxes.push('channels');
  }

  // Map stage → Cost Structure (infer burn rate)
  if (startup.stage) {
    const burnEstimate = getBurnEstimate(startup.stage);
    canvas.costStructure = { 
      items: [burnEstimate],
      source: 'profile',
      confidence: 'LOW'
    };
    coverage.costStructure = 'LOW';
  } else {
    coverage.costStructure = 'LOW';
  }
  lowCoverageBoxes.push('costStructure');

  return {
    canvas,
    coverage,
    hasLowCoverage: lowCoverageBoxes.length >= 3,
    lowCoverageBoxes,
  };
}

/**
 * Check if startup profile has changed since last canvas sync
 */
export async function checkProfileSync(
  supabase: SupabaseClient,
  userId: string,
  startupId: string,
  documentId: string
): Promise<ProfileSyncResult> {
  console.log(`[checkProfileSync] Checking sync for startup ${startupId}, doc ${documentId}`);

  // Fetch current profile
  const { data: startup } = await supabase
    .from("startups")
    .select("*")
    .eq("id", startupId)
    .single();

  // Fetch document metadata
  const { data: doc } = await supabase
    .from("documents")
    .select("metadata")
    .eq("id", documentId)
    .single();

  if (!startup) {
    return { hasChanges: false, changes: [], currentHash: "" };
  }

  const currentHash = computeProfileHash(startup);
  const storedHash = doc?.metadata?.profile_snapshot_hash;

  if (!storedHash || storedHash === currentHash) {
    return { hasChanges: false, changes: [], currentHash };
  }

  // Detect specific changes (simplified)
  const changes: ProfileSyncChange[] = [];
  
  // Compare key fields
  const storedProfile = doc?.metadata?.profile_snapshot || {};
  
  if (startup.target_market !== storedProfile.target_market) {
    changes.push({
      field: 'target_market',
      oldValue: storedProfile.target_market || '',
      newValue: startup.target_market || '',
      affectedBox: 'customerSegments',
    });
  }

  if (JSON.stringify(startup.traction_data) !== JSON.stringify(storedProfile.traction_data)) {
    changes.push({
      field: 'traction_data',
      oldValue: JSON.stringify(storedProfile.traction_data) || '',
      newValue: JSON.stringify(startup.traction_data) || '',
      affectedBox: 'keyMetrics',
    });
  }

  return {
    hasChanges: changes.length > 0,
    changes,
    currentHash,
  };
}

// Helper functions
function createEmptyCoverage(): Record<BoxKey, CoverageLevel> {
  return {
    problem: 'LOW',
    solution: 'LOW',
    uniqueValueProp: 'LOW',
    unfairAdvantage: 'LOW',
    customerSegments: 'LOW',
    keyMetrics: 'LOW',
    channels: 'LOW',
    costStructure: 'LOW',
    revenueStreams: 'LOW',
  };
}

function getBurnEstimate(stage: string): string {
  const estimates: Record<string, string> = {
    'idea': 'Bootstrap / minimal spend',
    'pre-seed': '$10-30K/month estimated',
    'seed': '$50-100K/month estimated',
    'series-a': '$200-500K/month estimated',
    'series-b': '$500K-1M/month estimated',
    'growth': '$1M+/month estimated',
  };
  return estimates[stage.toLowerCase()] || 'Cost structure TBD based on stage';
}
