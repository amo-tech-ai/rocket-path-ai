/**
 * DimensionSection — Renders a single V3 dimension within the report.
 * Maps dimensionId → diagram component, wraps in DiagramErrorBoundary.
 * Used by ReportV2Layout when activeSection is a dimension ID.
 */
import { memo } from 'react';
import { DimensionPage } from '@/components/validator/v3/DimensionPage';
import { DiagramErrorBoundary } from '@/components/validator/v3/diagrams/DiagramErrorBoundary';
import {
  PainChain,
  ICPFunnel,
  TAMPyramid,
  PositioningMatrix,
  RevenueEngine,
  CapabilityStack,
  ExecutionTimeline,
  EvidenceFunnel,
  RiskHeatGrid,
} from '@/components/validator/v3/diagrams';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import type { DiagramData } from '@/types/v3-report';

// Map diagram type → React component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DIAGRAM_MAP: Record<string, React.ComponentType<{ data: any; color?: string }>> = {
  'pain-chain': PainChain,
  'icp-funnel': ICPFunnel,
  'tam-pyramid': TAMPyramid,
  '2x2-matrix': PositioningMatrix,
  'revenue-engine': RevenueEngine,
  'capability-stack': CapabilityStack,
  'execution-timeline': ExecutionTimeline,
  'evidence-funnel': EvidenceFunnel,
  'risk-heat-grid': RiskHeatGrid,
};

interface DimensionSectionProps {
  dimensionId: DimensionId;
  reportId: string;
}

export const DimensionSection = memo(function DimensionSection({
  dimensionId,
  reportId,
}: DimensionSectionProps) {
  const config = DIMENSION_CONFIG[dimensionId];

  return (
    <DimensionPage dimensionId={dimensionId} reportId={reportId}>
      {({ diagram, dimensionId: dimId }) => {
        const diagramData = diagram as DiagramData;
        const DiagramComp = DIAGRAM_MAP[diagramData.type];
        if (!DiagramComp) return null;
        return (
          <DiagramErrorBoundary dimensionId={dimId} data={diagramData.data}>
            <DiagramComp data={diagramData.data} color={config.color} />
          </DiagramErrorBoundary>
        );
      }}
    </DimensionPage>
  );
});
