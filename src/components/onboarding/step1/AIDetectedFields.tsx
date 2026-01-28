/**
 * AI Detected Fields Component
 * Displays industry, business model, and stage fields
 * Now uses dynamic industry packs from database
 */

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useIndustryPacks } from '@/hooks/useIndustryPacks';

// Fallback industries if API fails
const FALLBACK_INDUSTRIES = [
  'SaaS', 'Marketplace', 'E-commerce', 'Fintech',
  'Healthcare', 'EdTech', 'AI/ML', 'Consumer', 'Other'
];

const BUSINESS_MODELS = [
  'B2B', 'B2C', 'B2B2C', 'Marketplace', 'Platform', 'Services'
];

const STAGES = [
  'Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B+'
];

interface AIDetectedFieldsProps {
  industry: string[];
  businessModel: string[];
  stage: string;
  onUpdate: (field: 'industry' | 'business_model' | 'stage', value: string | string[]) => void;
  isFromAI?: boolean;
  errors?: {
    industry?: string;
    business_model?: string;
    stage?: string;
  };
  touched?: {
    industry?: boolean;
    business_model?: boolean;
    stage?: boolean;
  };
}

export function AIDetectedFields({
  industry,
  businessModel,
  stage,
  onUpdate,
  isFromAI = false,
  errors,
  touched,
}: AIDetectedFieldsProps) {
  // Fetch dynamic industry packs from database
  const { data: industryPacks, isLoading: isLoadingPacks } = useIndustryPacks();
  
  // Build industries list from packs or use fallback
  const industries = industryPacks && industryPacks.length > 0
    ? industryPacks.map(pack => pack.display_name)
    : FALLBACK_INDUSTRIES;

  // Industry is now multi-select
  const toggleIndustry = (ind: string) => {
    const currentIndustries = Array.isArray(industry) ? industry : (industry ? [industry] : []);
    if (currentIndustries.includes(ind)) {
      onUpdate('industry', currentIndustries.filter(i => i !== ind));
    } else {
      onUpdate('industry', [...currentIndustries, ind]);
    }
  };

  const toggleBusinessModel = (model: string) => {
    if (businessModel.includes(model)) {
      onUpdate('business_model', businessModel.filter(m => m !== model));
    } else {
      onUpdate('business_model', [...businessModel, model]);
    }
  };

  const industryArray = Array.isArray(industry) ? industry : (industry ? [industry] : []);
  const showIndustryError = touched?.industry && errors?.industry;
  const showBusinessModelError = touched?.business_model && errors?.business_model;
  const showStageError = touched?.stage && errors?.stage;

  // Get icon for industry (from pack data)
  const getIndustryIcon = (industryName: string): string => {
    if (!industryPacks) return '';
    const pack = industryPacks.find(p => p.display_name === industryName);
    return pack?.icon || '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">AI DETECTED (click to edit)</Label>
        {isFromAI && (
          <Badge variant="secondary" className="text-xs">From AI</Badge>
        )}
      </div>

      {/* Industry - Multi-select with dynamic packs */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          Industry (select multiple)
          <span className="text-destructive">*</span>
        </Label>
        {isLoadingPacks ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => {
              const icon = getIndustryIcon(ind);
              return (
                <Badge
                  key={ind}
                  variant={industryArray.includes(ind) ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-colors',
                    industryArray.includes(ind) && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => toggleIndustry(ind)}
                >
                  {icon && <span className="mr-1">{icon}</span>}
                  {ind}
                  {industryArray.includes(ind) && ' ✓'}
                </Badge>
              );
            })}
          </div>
        )}
        {showIndustryError && (
          <p className="text-xs text-destructive">{errors?.industry}</p>
        )}
      </div>

      {/* Business Model - Multi-select */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          Business Model (select multiple)
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_MODELS.map((model) => (
            <Badge
              key={model}
              variant={businessModel.includes(model) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                businessModel.includes(model) && 'bg-primary text-primary-foreground'
              )}
              onClick={() => toggleBusinessModel(model)}
            >
              {model}
              {businessModel.includes(model) && ' ✓'}
            </Badge>
          ))}
        </div>
        {showBusinessModelError && (
          <p className="text-xs text-destructive">{errors?.business_model}</p>
        )}
      </div>

      {/* Stage - Single select */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          Stage
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <Badge
              key={s}
              variant={stage === s ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                stage === s && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onUpdate('stage', s)}
            >
              {s}
              {stage === s && ' ✓'}
            </Badge>
          ))}
        </div>
        {showStageError && (
          <p className="text-xs text-destructive">{errors?.stage}</p>
        )}
      </div>
    </div>
  );
}

export default AIDetectedFields;
