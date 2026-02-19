import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useMarketResearch, useGenerateMarketResearch } from "@/hooks/useMarketResearch";
import { useStartup } from "@/hooks/useDashboardData";
import { MarketSizingCards } from "@/components/market/MarketSizingCards";
import { TrendList } from "@/components/market/TrendList";
import { CompetitorGrid } from "@/components/market/CompetitorGrid";
import { useToast } from "@/hooks/use-toast";

const MarketResearchPage = () => {
  const { data: startup, isLoading: startupLoading } = useStartup();
  const { data: research, isLoading: researchLoading } = useMarketResearch(startup?.id);
  const generateResearch = useGenerateMarketResearch();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!startup?.id) return;
    try {
      await generateResearch.mutateAsync(startup.id);
      toast({ title: "Market research generated" });
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const isLoading = startupLoading || researchLoading;

  // Empty state
  if (!isLoading && !research) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Market Research</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Generate AI-powered market research for your startup including TAM/SAM/SOM, trends, and competitive landscape.
          </p>
          <Button onClick={handleGenerate} disabled={generateResearch.isPending}>
            {generateResearch.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating (~20s)...</>
            ) : (
              'Generate Research'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </DashboardLayout>
    );
  }

  const trends = Array.isArray(research?.trends) ? research.trends : [];
  const leaders = Array.isArray(research?.market_leaders) ? research.market_leaders : [];
  const emerging = Array.isArray(research?.emerging_players) ? research.emerging_players : [];
  const sources = Array.isArray(research?.sources) ? research.sources : [];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Market Research</h1>
          <Button
            variant="outline"
            onClick={handleGenerate}
            disabled={generateResearch.isPending}
          >
            {generateResearch.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Regenerating...</>
            ) : (
              'Regenerate'
            )}
          </Button>
        </div>

        {/* Market Sizing */}
        {research && (
          <MarketSizingCards
            tam={{ value: research.tam_value, source: research.tam_source }}
            sam={{ value: research.sam_value, source: research.sam_source }}
            som={{ value: research.som_value, source: research.som_source }}
            methodology={research.methodology}
          />
        )}

        {/* Trends */}
        <TrendList trends={trends as any} />

        {/* Competitive Landscape */}
        <CompetitorGrid leaders={leaders as any} emerging={emerging as any} />

        {/* Sources */}
        {sources.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="h-4 w-4" />
              Sources ({sources.length})
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-1 text-sm text-muted-foreground">
                {sources.map((s: any, i: number) => (
                  <li key={i}>{s.title || s.url || String(s)}</li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketResearchPage;
