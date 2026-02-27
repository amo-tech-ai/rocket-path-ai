/**
 * V3 Report Types — Consulting-Grade 9-Dimension Report
 *
 * All types for the V3 report system. Every V3 component imports from this file.
 * The Composer pipeline (MVP-02) generates data matching these shapes.
 * Dimension pages (MVP-04, MVP-05) consume these as props.
 *
 * SYNC: When updating types here, also update supabase/functions/validator-start/types.ts
 */

import type { DimensionId, DiagramType } from '@/config/dimensions';
import type { ReportDetailsV2 } from './validation-report';

// Re-export for convenience — consumers can import everything from v3-report
export type { DimensionId, DiagramType } from '@/config/dimensions';

// ---------------------------------------------------------------------------
// Core Types
// ---------------------------------------------------------------------------

export interface SubScore {
  id: string;
  label: string;
  score: number;       // 0-100
  weight: number;      // 0-1, sub-score weights within a dimension
  color: string;       // hex color for visualisation
  description: string;
}

export interface PriorityAction {
  rank: number;
  action: string;
  timeframe: string;   // e.g. "Week 1", "Month 1"
  effort: string;      // e.g. "Low", "Medium", "High"
  impact: string;      // e.g. "High", "Critical"
}

export type Verdict = 'GO' | 'CAUTION' | 'NO-GO';

export interface RiskSignal {
  severity: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  mitigation: string;
}

// ---------------------------------------------------------------------------
// Per-Dimension Diagram Data Types
// ---------------------------------------------------------------------------

/** Pain Chain — causal flow from trigger to business cost (Problem Fit) */
export interface PainChainNode {
  id: string;
  label: string;
  type: 'trigger' | 'symptom' | 'consequence' | 'cost';
}

export interface PainChainEdge {
  from: string;
  to: string;
  label?: string;
}

export interface PainChainData {
  nodes: PainChainNode[];
  edges: PainChainEdge[];
}

/** ICP Funnel — narrowing customer tiers (Target Customer) */
export interface ICPTier {
  label: string;
  count: string;       // e.g. "~5M companies"
  criteria: string[];
}

export interface ICPFunnelData {
  tiers: ICPTier[];    // broadest → narrowest
}

/** TAM Pyramid — 3-tier market sizing (Market Opportunity) */
export interface TAMPyramidData {
  tam: { value: number; label: string; methodology?: string };
  sam: { value: number; label: string; methodology?: string };
  som: { value: number; label: string; methodology?: string };
  growthRate?: number;
  sources?: string[];
}

/** Positioning Matrix — 2x2 axis with plotted competitors (Competitive Edge) */
export interface MatrixPosition {
  name: string;
  x: number;           // 0-100
  y: number;           // 0-100
  isFounder: boolean;
}

export interface PositioningMatrixData {
  xAxis: string;
  yAxis: string;
  positions: MatrixPosition[];
}

/** Revenue Engine — pipeline flow stages (Revenue Model) */
export interface RevenueStage {
  label: string;
  value: string;
  conversionRate?: number;
}

export interface RevenueEngineData {
  stages: RevenueStage[];
  model: string;
  unitEconomics?: {
    cac: number;
    ltv: number;
    ltvCacRatio: number;
    paybackMonths: number;
  };
}

/** Capability Stack — layered tech capabilities (Tech & AI Advantage) */
export interface CapabilityLayer {
  name: string;
  description: string;
  maturity: 'nascent' | 'developing' | 'mature';
  components?: string[];
}

export interface CapabilityStackData {
  layers: CapabilityLayer[];
  automationLevel: 'assist' | 'copilot' | 'agent';
  dataStrategy: 'owned' | 'borrowed' | 'hybrid';
}

/** Execution Timeline — phased milestones (Founder Execution) */
export interface TimelinePhase {
  name: string;
  duration: string;
  milestones: string[];
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface ExecutionTimelineData {
  phases: TimelinePhase[];
  totalDuration?: string;
}

/** Evidence Funnel — validated vs assumed evidence tiers (Traction & Evidence) */
export interface EvidenceItem {
  claim: string;
  evidence: string;
  confidence: 'verified' | 'partial' | 'assumed';
}

export interface EvidenceTier {
  label: string;
  items: EvidenceItem[];
}

export interface EvidenceFunnelData {
  tiers: EvidenceTier[];
  overallConfidence: 'high' | 'medium' | 'low' | 'none';
}

/** Risk Heat Grid — 3x3 probability vs impact matrix (Startup Risk) */
export interface RiskGridItem {
  id: string;
  label: string;
  category: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  mitigation?: string;
}

export interface RiskHeatGridData {
  risks: RiskGridItem[];
  categories: string[];
}

// ---------------------------------------------------------------------------
// Diagram Data — Discriminated Union
// ---------------------------------------------------------------------------

export type DiagramData =
  | { type: 'pain-chain'; data: PainChainData }
  | { type: 'icp-funnel'; data: ICPFunnelData }
  | { type: 'tam-pyramid'; data: TAMPyramidData }
  | { type: '2x2-matrix'; data: PositioningMatrixData }
  | { type: 'revenue-engine'; data: RevenueEngineData }
  | { type: 'capability-stack'; data: CapabilityStackData }
  | { type: 'execution-timeline'; data: ExecutionTimelineData }
  | { type: 'evidence-funnel'; data: EvidenceFunnelData }
  | { type: 'risk-heat-grid'; data: RiskHeatGridData };

// ---------------------------------------------------------------------------
// Dimension Page Data
// ---------------------------------------------------------------------------

export interface DimensionPageData {
  dimensionId: DimensionId;
  title: string;
  headline: string;
  diagram: DiagramData;
  compositeScore: number;  // 0-100
  subScores: SubScore[];
  summary: string;
  actions: PriorityAction[];
  riskSignals: RiskSignal[];
}

// ---------------------------------------------------------------------------
// V3 Report Details — extends V2 with dimension pages
// ---------------------------------------------------------------------------

export interface V3ReportDetails extends ReportDetailsV2 {
  dimensions: Record<DimensionId, DimensionPageData>;
  overallScore: number;   // 0-100
  verdict: Verdict;
  narrativeArc: {
    act1: string;         // Setup: Problem, Customer, Market
    act2: string;         // Confrontation: Competition, Revenue, AI Strategy
    act3: string;         // Resolution: Execution, Traction, Risk
  };
  confidenceScore?: number; // 0-100, how much is verified vs AI-inferred
}
