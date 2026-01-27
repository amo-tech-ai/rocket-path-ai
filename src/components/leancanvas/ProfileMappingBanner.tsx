/**
 * Profile Mapping Banner
 * Shows coverage status and allows quick prefill from startup profile
 */

import { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { CoverageLevel, BoxKey } from '@/hooks/useLeanCanvasAgent';

interface ProfileMappingBannerProps {
  coverage: Record<BoxKey, CoverageLevel> | null;
  lowCoverageBoxes: BoxKey[];
  isLoading: boolean;
  onPrefill: () => void;
  onMapProfile: () => void;
}

const BOX_LABELS: Record<BoxKey, string> = {
  problem: 'Problem',
  solution: 'Solution',
  uniqueValueProp: 'Value Proposition',
  unfairAdvantage: 'Unfair Advantage',
  customerSegments: 'Customer Segments',
  keyMetrics: 'Key Metrics',
  channels: 'Channels',
  costStructure: 'Cost Structure',
  revenueStreams: 'Revenue Streams',
};

export function ProfileMappingBanner({
  coverage,
  lowCoverageBoxes,
  isLoading,
  onPrefill,
  onMapProfile,
}: ProfileMappingBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate overall coverage percentage
  const calculateCoveragePercent = () => {
    if (!coverage) return 0;
    const scores = Object.values(coverage).map(level => {
      switch (level) {
        case 'HIGH': return 100;
        case 'MODERATE': return 60;
        case 'LOW': return 20;
        default: return 0;
      }
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const coveragePercent = calculateCoveragePercent();
  const hasLowCoverage = lowCoverageBoxes.length > 0;

  return (
    <div className={cn(
      "rounded-lg border p-4 mb-6",
      hasLowCoverage 
        ? "border-amber-500/50 bg-amber-500/5" 
        : "border-green-500/50 bg-green-500/5"
    )}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasLowCoverage ? (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            <div>
              <h3 className="font-medium text-sm">
                {hasLowCoverage 
                  ? `${lowCoverageBoxes.length} sections need more data`
                  : 'Profile fully mapped'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Progress 
                  value={coveragePercent} 
                  className="h-1.5 w-24"
                />
                <span className="text-xs text-muted-foreground">
                  {coveragePercent}% coverage
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onMapProfile}
              disabled={isLoading}
            >
              <RefreshCw className={cn(
                "w-4 h-4 mr-2",
                isLoading && "animate-spin"
              )} />
              Refresh
            </Button>
            <Button 
              size="sm"
              onClick={onPrefill}
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Prefill
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-3 gap-3">
            {coverage && Object.entries(coverage).map(([key, level]) => (
              <div 
                key={key} 
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {BOX_LABELS[key as BoxKey] || key}
                </span>
                <CoverageBadge level={level} />
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function CoverageBadge({ level }: { level: CoverageLevel }) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "text-xs font-normal",
        level === 'HIGH' && "border-green-500 text-green-600 bg-green-500/10",
        level === 'MODERATE' && "border-amber-500 text-amber-600 bg-amber-500/10",
        level === 'LOW' && "border-red-500 text-red-600 bg-red-500/10"
      )}
    >
      {level}
    </Badge>
  );
}
