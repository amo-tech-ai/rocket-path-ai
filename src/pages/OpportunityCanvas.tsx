import DashboardLayout from "@/components/layout/DashboardLayout";
import { Lightbulb, Loader2, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpportunityCanvas, useGenerateOpportunityCanvas } from "@/hooks/useOpportunityCanvas";
import { useStartup } from "@/hooks/useDashboardData";
import { ScoreCard } from "@/components/opportunity/ScoreCard";
import { RecommendationBadge } from "@/components/opportunity/RecommendationBadge";
import { useToast } from "@/hooks/use-toast";

const SEVERITY_COLORS: Record<string, string> = {
  high: "bg-red-50 border-red-200",
  medium: "bg-amber-50 border-amber-200",
  low: "bg-slate-50 border-slate-200",
};

const IMPACT_COLORS: Record<string, string> = {
  high: "bg-green-50 border-green-200",
  medium: "bg-blue-50 border-blue-200",
  low: "bg-slate-50 border-slate-200",
};

const OpportunityCanvasPage = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: canvas, isLoading: canvasLoading } = useOpportunityCanvas(startup?.id);
  const generateCanvas = useGenerateOpportunityCanvas();
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!startup?.id) return;
    try {
      await generateCanvas.mutateAsync(startup.id);
      toast({ title: "Opportunity analyzed" });
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const isLoading = startupLoading || canvasLoading;

  // Empty state
  if (!isLoading && !canvas) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Opportunity Canvas</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Analyze your startup's opportunity across 5 key dimensions to get an AI-powered recommendation.
          </p>
          <Button onClick={handleAnalyze} disabled={generateCanvas.isPending}>
            {generateCanvas.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing (~20s)...</>
            ) : (
              'Analyze Opportunity'
            )}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
          <Skeleton className="h-32" />
        </div>
      </DashboardLayout>
    );
  }

  const barriers = Array.isArray(canvas?.adoption_barriers) ? canvas.adoption_barriers : [];
  const enablers = Array.isArray(canvas?.enablers) ? canvas.enablers : [];

  const dimensions = [
    { label: 'Market Readiness', score: canvas?.market_readiness ?? 0 },
    { label: 'Tech Feasibility', score: canvas?.technical_feasibility ?? 0 },
    { label: 'Competitive Edge', score: canvas?.competitive_advantage ?? 0 },
    { label: 'Execution', score: canvas?.execution_capability ?? 0 },
    { label: 'Timing', score: canvas?.timing_score ?? 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Opportunity Canvas</h1>
          <Button
            variant="outline"
            onClick={handleAnalyze}
            disabled={generateCanvas.isPending}
          >
            {generateCanvas.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Re-analyzing...</>
            ) : (
              'Re-analyze'
            )}
          </Button>
        </div>

        {/* Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {dimensions.map((d) => (
            <ScoreCard key={d.label} label={d.label} score={d.score} />
          ))}
        </div>

        {/* Recommendation */}
        {canvas?.recommendation && (
          <RecommendationBadge
            recommendation={canvas.recommendation}
            reasoning={canvas.reasoning}
            opportunityScore={canvas.opportunity_score}
          />
        )}

        {/* Barriers */}
        {barriers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-4 w-4 text-red-500" />
              <h2 className="text-lg font-semibold">Adoption Barriers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {barriers.map((b: any, i: number) => (
                <Card key={i} className={SEVERITY_COLORS[b.severity] || SEVERITY_COLORS.medium}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{b.title}</p>
                      <Badge variant="outline" className="text-xs">{b.severity}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enablers */}
        {enablers.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-green-500" />
              <h2 className="text-lg font-semibold">Enablers</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enablers.map((e: any, i: number) => (
                <Card key={i} className={IMPACT_COLORS[e.impact] || IMPACT_COLORS.medium}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{e.title}</p>
                      <Badge variant="outline" className="text-xs">{e.impact}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{e.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Fit */}
        {canvas?.strategic_fit && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Strategic Fit</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{canvas.strategic_fit}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OpportunityCanvasPage;
