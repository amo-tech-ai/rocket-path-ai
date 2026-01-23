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
  industry: string;
  businessModel: string[];
  stage: string;
  onUpdate: (field: 'industry' | 'business_model' | 'stage', value: string | string[]) => void;
  isFromAI?: boolean;
}

export function AIDetectedFields({
  industry,
  businessModel,
  stage,
  onUpdate,
  isFromAI = false,
}: AIDetectedFieldsProps) {
  const toggleBusinessModel = (model: string) => {
    if (businessModel.includes(model)) {
      onUpdate('business_model', businessModel.filter(m => m !== model));
    } else {
      onUpdate('business_model', [...businessModel, model]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">AI DETECTED (click to edit)</Label>
        {isFromAI && (
          <Badge variant="secondary" className="text-xs">From AI</Badge>
        )}
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Industry</Label>
        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <Badge
              key={ind}
              variant={industry === ind ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                industry === ind && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onUpdate('industry', ind)}
            >
              {ind}
              {industry === ind && ' ✓'}
            </Badge>
          ))}
        </div>
      </div>

      {/* Business Model */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Business Model (select multiple)</Label>
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
      </div>

      {/* Stage */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Stage</Label>
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
      </div>
    </div>
  );
}

export default AIDetectedFields;
