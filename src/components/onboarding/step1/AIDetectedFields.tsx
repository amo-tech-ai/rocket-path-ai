import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const INDUSTRIES = [
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
  industry: string[];  // Changed to array for multi-select
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">AI DETECTED (click to edit)</Label>
        {isFromAI && (
          <Badge variant="secondary" className="text-xs">From AI</Badge>
        )}
      </div>

      {/* Industry - Multi-select */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground flex items-center gap-1">
          Industry (select multiple)
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <Badge
              key={ind}
              variant={industryArray.includes(ind) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                industryArray.includes(ind) && 'bg-primary text-primary-foreground'
              )}
              onClick={() => toggleIndustry(ind)}
            >
              {ind}
              {industryArray.includes(ind) && ' ✓'}
            </Badge>
          ))}
        </div>
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
