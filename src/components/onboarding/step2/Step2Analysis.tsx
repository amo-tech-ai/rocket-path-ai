import { Sparkles, Globe, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WizardFormData, ReadinessScore } from '@/hooks/useWizardSession';
import { StartupOverviewCard } from './StartupOverviewCard';
import { FounderIdentityCard } from './FounderIdentityCard';
import { WebsiteInsightsCard } from './WebsiteInsightsCard';
import { CompetitorIntelCard } from './CompetitorIntelCard';
import { DetectedSignalsCard } from './DetectedSignalsCard';
import { ResearchQueriesCard } from './ResearchQueriesCard';

interface Step2AnalysisProps {
  data: WizardFormData;
  extractions?: Record<string, unknown>;
  onUpdate: (updates: Partial<WizardFormData>) => void;
  readinessScore: ReadinessScore | null;
  onRecalculate: () => void;
  onEnhanceField: (fieldName: string) => Promise<void>;
  onEnhanceFounder: (founderId: string, linkedinUrl: string) => Promise<void>;
  onGenerateCompetitors: () => Promise<void>;
  isCalculating: boolean;
  isEnhancing: Record<string, boolean>;
  isEnrichingFounder: boolean;
  isGeneratingCompetitors: boolean;
}

export function Step2Analysis({
  data,
  extractions = {},
  onUpdate,
  readinessScore,
  onRecalculate,
  onEnhanceField,
  onEnhanceFounder,
  onGenerateCompetitors,
  isCalculating,
  isEnhancing,
  isEnrichingFounder,
  isGeneratingCompetitors,
}: Step2AnalysisProps) {
  // Merge form data with AI extractions for display
  // AI extractions provide key_features, target_audience, competitors if not in form_data
  const mergedData: WizardFormData = {
    ...data,
    key_features: data.key_features?.length ? data.key_features : (extractions.key_features as string[]) || [],
    target_customers: data.target_customers?.length ? data.target_customers : (extractions.target_audience ? [extractions.target_audience as string] : []),
    competitors: data.competitors?.length ? data.competitors : (Array.isArray(extractions.competitors) ? (extractions.competitors as Array<{name: string}>).map(c => typeof c === 'string' ? c : c.name) : []),
    tagline: data.tagline || (extractions.unique_value_proposition as string) || (extractions.tagline as string) || '',
  };

  const groundingActive = Boolean(data.website_url);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="outline" className="text-xs">STEP 2 OF 4</Badge>
        <h1 className="text-3xl font-display font-semibold tracking-tight">AI Analysis</h1>
        <p className="text-muted-foreground">
          Review what Gemini found from your links and inputs.
        </p>
        
        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-0 text-xs gap-1">
            <Sparkles className="h-3 w-3" />
            Gemini Grounded
          </Badge>
          {data.website_url && (
            <Badge variant="outline" className="text-xs gap-1 bg-accent/50 border-primary/20">
              <Globe className="h-3 w-3" />
              URL Context Active
            </Badge>
          )}
          {isCalculating && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Analyzing...
            </Badge>
          )}
        </div>
      </div>

      {/* Section 1: Startup Overview */}
      <StartupOverviewCard
        data={data}
        onUpdate={onUpdate}
        onEnhance={onEnhanceField}
        isEnhancing={isEnhancing}
        groundingStatus={groundingActive ? 'active' : 'inactive'}
      />

      {/* Section 2: Founder Identity & Experience */}
      <FounderIdentityCard
        data={data}
        onUpdate={onUpdate}
        onEnhanceFounder={onEnhanceFounder}
        isEnrichingFounder={isEnrichingFounder}
      />

      {/* Section 3: Website Context Insights */}
      <WebsiteInsightsCard
        data={mergedData}
        onUpdate={onUpdate}
        onEnhance={onEnhanceField}
        isEnhancing={isEnhancing}
      />

      {/* Section 4: Competitor & Market Intelligence */}
      <CompetitorIntelCard
        data={mergedData}
        onUpdate={onUpdate}
        onRescan={onGenerateCompetitors}
        isRescanning={isGeneratingCompetitors}
      />

      {/* Section 5: Detected Signals */}
      <DetectedSignalsCard data={mergedData} />

      {/* Section 6: Research Queries (Collapsible) */}
      <ResearchQueriesCard data={mergedData} />
    </div>
  );
}

export default Step2Analysis;
