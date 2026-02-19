/**
 * Lean Canvas Types
 */

export interface LeanCanvasBox {
  items: string[];
  validation?: 'valid' | 'warning' | 'error';
  validationMessage?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  source?: 'profile' | 'ai' | 'manual' | 'gap_answers';
}

export interface LeanCanvasData {
  problem: LeanCanvasBox;
  solution: LeanCanvasBox;
  uniqueValueProp: LeanCanvasBox;
  unfairAdvantage: LeanCanvasBox;
  customerSegments: LeanCanvasBox;
  keyMetrics: LeanCanvasBox;
  channels: LeanCanvasBox;
  costStructure: LeanCanvasBox;
  revenueStreams: LeanCanvasBox;
}

export type BoxKey = keyof LeanCanvasData;

export type CoverageLevel = 'HIGH' | 'MODERATE' | 'LOW';

export interface ProfileMappingResult {
  canvas: LeanCanvasData;
  coverage: Record<BoxKey, CoverageLevel>;
  hasLowCoverage: boolean;
  lowCoverageBoxes: BoxKey[];
}

export interface ValidationResult {
  box: BoxKey;
  score: number;
  feedback: string;
  risk_level: 'critical' | 'moderate' | 'low';
  risk_reason: string;
  experiment: string;
}

export interface ValidationResponse {
  overall_score: number;
  results: ValidationResult[];
  top_risks: ValidationResult[];
}

export interface ProfileSyncChange {
  field: string;
  oldValue: string;
  newValue: string;
  affectedBox: BoxKey;
}

export interface ProfileSyncResult {
  hasChanges: boolean;
  changes: ProfileSyncChange[];
  currentHash: string;
}

export interface PivotSuggestion {
  pivot_type: 'customer' | 'problem' | 'channel' | 'revenue' | 'technology';
  name: string;
  reasoning: string;
  changed_boxes: Record<BoxKey, { from: string[]; to: string[] }>;
  modified_canvas: LeanCanvasData;
  opportunity_score: number;
}

export interface BenchmarkData {
  box: BoxKey;
  benchmark: string;
  value: string;
  yourPosition?: 'above' | 'below' | 'within';
  context: string;
  source: string;
}

export interface PitchSlide {
  slideNumber: number;
  slideType: string;
  title: string;
  content: string[];
  sourceBox: BoxKey;
}

export const EMPTY_CANVAS: LeanCanvasData = {
  problem: { items: [] },
  solution: { items: [] },
  uniqueValueProp: { items: [] },
  unfairAdvantage: { items: [] },
  customerSegments: { items: [] },
  keyMetrics: { items: [] },
  channels: { items: [] },
  costStructure: { items: [] },
  revenueStreams: { items: [] },
};

export const CANVAS_BOX_CONFIG = [
  { key: 'problem' as BoxKey, title: 'Problem', profileFields: ['description'] },
  { key: 'solution' as BoxKey, title: 'Solution', profileFields: ['description'] },
  { key: 'uniqueValueProp' as BoxKey, title: 'Unique Value Proposition', profileFields: ['tagline'] },
  { key: 'unfairAdvantage' as BoxKey, title: 'Unfair Advantage', profileFields: ['competitors'] },
  { key: 'customerSegments' as BoxKey, title: 'Customer Segments', profileFields: ['industry', 'target_market'] },
  { key: 'keyMetrics' as BoxKey, title: 'Key Metrics', profileFields: ['traction_data'] },
  { key: 'channels' as BoxKey, title: 'Channels', profileFields: ['marketing_channels', 'traction_data'] },
  { key: 'costStructure' as BoxKey, title: 'Cost Structure', profileFields: ['stage'] },
  { key: 'revenueStreams' as BoxKey, title: 'Revenue Streams', profileFields: ['business_model'] },
];
