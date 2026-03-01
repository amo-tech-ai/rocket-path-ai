/**
 * ReportLeanCanvas — Read-only lean canvas grid within the V3 report
 *
 * Renders a 3×3 CSS grid of canvas blocks auto-populated from report data.
 * Each block shows title, content, source dimension badge, and confidence indicator.
 * Includes "Open in Canvas Editor" CTA button.
 *
 * MVP-07: AI Lean Canvas Report Page
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Sparkles, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DIMENSION_CONFIG, type DimensionId } from '@/config/dimensions';
import { useReportLeanCanvas, type CanvasBlockData, type CanvasConfidence } from '@/hooks/useReportLeanCanvas';
import { useGenerateCanvasFromReport, useLeanCanvas } from '@/hooks/useLeanCanvas';
import { useStartup } from '@/hooks/useDashboardData';
import { toast } from 'sonner';
import type { ReportDetailsV2 } from '@/types/validation-report';

// ---------------------------------------------------------------------------
// CanvasBlockCard — Individual block within the grid
// ---------------------------------------------------------------------------

const CONTENT_TRUNCATE_LENGTH = 180;

function CanvasBlockCard({ block }: { block: CanvasBlockData }) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = block.content.length > CONTENT_TRUNCATE_LENGTH;
  const displayContent = expanded || !needsTruncation
    ? block.content
    : block.content.slice(0, CONTENT_TRUNCATE_LENGTH) + '...';

  const dimConfig = block.sourceDimension ? DIMENSION_CONFIG[block.sourceDimension] : null;
  const secondaryConfig = block.secondaryDimension ? DIMENSION_CONFIG[block.secondaryDimension] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: block.number * 0.04 }}
      className={cn(
        'rounded-xl border p-4 flex flex-col gap-3 min-h-[180px]',
        block.confidence === 'low' && !block.content
          ? 'bg-muted/30 border-dashed border-border/60'
          : 'bg-card border-border shadow-sm',
      )}
    >
      {/* Header: number + title */}
      <div className="flex items-start gap-2">
        <span className="flex-shrink-0 w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
          {block.number}
        </span>
        <h3 className="text-sm font-semibold leading-tight">{block.title}</h3>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {block.content ? (
          <>
            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
              {displayContent}
            </p>
            {needsTruncation && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Show more <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="flex items-start gap-2 text-xs text-muted-foreground/70 italic">
            <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>{getPlaceholder(block.sourceDimension)}</span>
          </div>
        )}
      </div>

      {/* Footer: source badges + confidence */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/50">
        {dimConfig && (
          <Badge
            variant="outline"
            className={cn(
              'text-[9px] h-4 px-1.5 font-medium',
              block.confidence === 'high'
                ? 'border-solid'
                : 'border-dashed',
            )}
            style={{
              borderColor: dimConfig.color,
              color: dimConfig.color,
              backgroundColor: `${dimConfig.color}08`,
            }}
          >
            {dimConfig.label}
          </Badge>
        )}
        {secondaryConfig && (
          <Badge
            variant="outline"
            className="text-[9px] h-4 px-1.5 font-medium border-dashed"
            style={{
              borderColor: secondaryConfig.color,
              color: secondaryConfig.color,
              backgroundColor: `${secondaryConfig.color}08`,
            }}
          >
            {secondaryConfig.label}
          </Badge>
        )}
        {block.confidence === 'medium' && block.content && (
          <span className="text-[9px] text-muted-foreground/60 ml-auto">Inferred</span>
        )}
        {block.confidence === 'low' && block.content && (
          <span className="text-[9px] text-amber-500/80 ml-auto flex items-center gap-0.5">
            <AlertTriangle className="w-2.5 h-2.5" />
            Needs review
          </span>
        )}
      </div>
    </motion.div>
  );
}

function getPlaceholder(sourceDimension: DimensionId | null): string {
  if (!sourceDimension) return 'Not enough data to populate this block';
  const config = DIMENSION_CONFIG[sourceDimension];
  return `Complete the ${config.label} dimension to populate this block`;
}

// ---------------------------------------------------------------------------
// ReportLeanCanvas — Main component
// ---------------------------------------------------------------------------

interface ReportLeanCanvasProps {
  details: ReportDetailsV2;
  reportId: string;
}

export function ReportLeanCanvas({ details, reportId }: ReportLeanCanvasProps) {
  const navigate = useNavigate();
  const { hasData, hasV3Dimensions, blocks } = useReportLeanCanvas(details);
  const { data: startup } = useStartup();
  const startupId = startup?.id;
  const { data: existingCanvas } = useLeanCanvas(startupId);
  const generateCanvas = useGenerateCanvasFromReport();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpenInEditor = useCallback(async () => {
    // If a canvas already exists, navigate directly
    if (existingCanvas) {
      navigate('/lean-canvas');
      return;
    }

    // Otherwise generate from report first, then navigate
    if (!startupId) {
      toast.error('No startup profile found');
      return;
    }

    setIsGenerating(true);
    try {
      await generateCanvas.mutateAsync({ reportId, startupId });
      toast.success('Lean Canvas generated from report');
      navigate('/lean-canvas');
    } catch (e) {
      console.error('Canvas generation error:', e);
      toast.error(e instanceof Error ? e.message : 'Failed to generate canvas');
    } finally {
      setIsGenerating(false);
    }
  }, [existingCanvas, startupId, reportId, generateCanvas, navigate]);

  // No data at all — V2 report without structured data
  if (!hasData) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-sm mb-2">Lean Canvas Not Available</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
          {hasV3Dimensions
            ? 'The report data is incomplete. Re-validate your startup to populate the lean canvas.'
            : 'Lean canvas generation requires a V3 report with dimension data. Re-validate your startup to get the full 9-dimension analysis.'}
        </p>
        {startupId && (
          <Button variant="outline" size="sm" onClick={() => navigate('/validator')}>
            Re-validate Startup
          </Button>
        )}
      </div>
    );
  }

  // Split blocks into rows matching lean canvas layout:
  // Row 1: blocks 1-5 (top row)
  // Row 2: blocks 6-7 (middle — Key Metrics & Channels equivalent)
  // Row 3: blocks 8-9 (bottom — Cost Structure & Revenue Streams equivalent)
  // But per task spec, it's a 3×3 grid (9 blocks):
  const row1 = blocks.slice(0, 3); // Core Problem, Customer Segments, Value Proposition
  const row2 = blocks.slice(3, 6); // AI Solution, Unique Advantage, Revenue Model
  const row3 = blocks.slice(6, 9); // Cost Structure, Key Metrics, Distribution & GTM

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Lean Canvas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-generated from your validation report — {blocks.filter(b => b.content).length} of 9 blocks populated
          </p>
        </div>
        {!hasV3Dimensions && (
          <Badge variant="secondary" className="text-[10px]">
            Based on V2 data
          </Badge>
        )}
      </div>

      {/* 3×3 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {row1.map(block => (
          <CanvasBlockCard key={block.number} block={block} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {row2.map(block => (
          <CanvasBlockCard key={block.number} block={block} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {row3.map(block => (
          <CanvasBlockCard key={block.number} block={block} />
        ))}
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center pt-2">
        <Button
          onClick={handleOpenInEditor}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="w-4 h-4 animate-pulse" />
              Generating Canvas...
            </>
          ) : existingCanvas ? (
            <>
              <ExternalLink className="w-4 h-4" />
              Open in Canvas Editor
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate & Open in Editor
            </>
          )}
        </Button>
      </div>

      {/* Confidence legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60 pt-2">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border border-primary/40 bg-primary/10" />
          High confidence
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full border border-dashed border-muted-foreground/40" />
          Inferred
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-2.5 h-2.5 text-amber-500/60" />
          Needs review
        </span>
      </div>
    </div>
  );
}
