/**
 * V3 Diagram Components — Barrel export
 * Each diagram is a pure CSS/Tailwind visualization (no Recharts).
 * All components are React.memo wrapped and validate data before rendering.
 */

// Shared utilities
export { DiagramErrorBoundary } from './DiagramErrorBoundary';
export { DiagramFallbackTable } from './DiagramFallbackTable';

// Dimension-specific diagrams
export { PainChain } from './PainChain';
export { ICPFunnel } from './ICPFunnel';
export { TAMPyramid } from './TAMPyramid';
export { PositioningMatrix } from './PositioningMatrix';
export { RevenueEngine } from './RevenueEngine';
export { CapabilityStack } from './CapabilityStack';
export { ExecutionTimeline } from './ExecutionTimeline';
export { EvidenceFunnel } from './EvidenceFunnel';
export { RiskHeatGrid } from './RiskHeatGrid';
