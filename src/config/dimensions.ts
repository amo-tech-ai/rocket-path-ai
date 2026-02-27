/**
 * V3 Dimension Configuration
 * Single source of truth for all 9 startup evaluation dimensions.
 *
 * Scoring weights: 8 scored dimensions sum to 1.0.
 * Risk is a modifier — generates signals but doesn't contribute to composite score.
 *
 * Implementation rule: Composite score calculation MUST read weights from
 * DIMENSION_CONFIG only — never hardcode weight values in scoring logic.
 */

export const DIMENSION_CONFIG = {
  problem: {
    label: 'Problem Fit',
    color: '#F43F5E',
    weight: 0.15,
    diagramType: 'pain-chain',
    route: '/problem',
    act: 1,
    role: 'scored',
  },
  customer: {
    label: 'Target Customer',
    color: '#8B5CF6',
    weight: 0.10,
    diagramType: 'icp-funnel',
    route: '/customer',
    act: 1,
    role: 'scored',
  },
  market: {
    label: 'Market Opportunity',
    color: '#3B82F6',
    weight: 0.15,
    diagramType: 'tam-pyramid',
    route: '/market',
    act: 1,
    role: 'scored',
  },
  competition: {
    label: 'Competitive Edge',
    color: '#F97316',
    weight: 0.10,
    diagramType: '2x2-matrix',
    route: '/competition',
    act: 2,
    role: 'scored',
  },
  revenue: {
    label: 'Revenue Model',
    color: '#10B981',
    weight: 0.20,
    diagramType: 'revenue-engine',
    route: '/revenue',
    act: 2,
    role: 'scored',
  },
  'ai-strategy': {
    label: 'Tech & AI Advantage',
    color: '#06B6D4',
    weight: 0.10,
    diagramType: 'capability-stack',
    route: '/ai-strategy',
    act: 2,
    role: 'scored',
  },
  execution: {
    label: 'Founder Execution',
    color: '#EAB308',
    weight: 0.10,
    diagramType: 'execution-timeline',
    route: '/execution',
    act: 3,
    role: 'scored',
  },
  traction: {
    label: 'Traction & Evidence',
    color: '#14B8A6',
    weight: 0.10,
    diagramType: 'evidence-funnel',
    route: '/traction',
    act: 3,
    role: 'scored',
  },
  risk: {
    label: 'Startup Risk',
    color: '#EF4444',
    weight: 0,
    diagramType: 'risk-heat-grid',
    route: '/risk',
    act: 3,
    role: 'modifier',
  },
} as const satisfies Record<string, DimensionConfigEntry>;

/** Union of all 9 dimension IDs — derived from DIMENSION_CONFIG keys */
export type DimensionId = keyof typeof DIMENSION_CONFIG;

/** Union of all diagram types — derived from DIMENSION_CONFIG values */
export type DiagramType = (typeof DIMENSION_CONFIG)[DimensionId]['diagramType'];

/** Role of a dimension in scoring */
export type DimensionRole = 'scored' | 'modifier';

/** Shape of each entry in DIMENSION_CONFIG */
export interface DimensionConfigEntry {
  readonly label: string;
  readonly color: string;
  readonly weight: number;
  readonly diagramType: string;
  readonly route: string;
  readonly act: number;
  readonly role: DimensionRole;
}
