/**
 * AI Detected Fields Component
 * Displays industry, business model, and stage fields
 * Uses universal industry categories with AI detection highlighting
 */

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { UNIVERSAL_INDUSTRIES, type IndustryOption } from '@/constants/industries';

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
  aiDetectedIndustries?: string[];
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
  aiDetectedIndustries = [],
  errors,
  touched,
}: AIDetectedFieldsProps) {
  const [otherText, setOtherText] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);

  const industryArray = Array.isArray(industry) ? industry : (industry ? [industry] : []);

  // Toggle industry selection
  const toggleIndustry = (id: string) => {
    if (industryArray.includes(id)) {
      onUpdate('industry', industryArray.filter(i => i !== id));
    } else {
      onUpdate('industry', [...industryArray, id]);
    }
  };

  // Handle "Other" selection
  const handleOtherToggle = () => {
    if (showOtherInput) {
      // Remove 'other' from selection
      setShowOtherInput(false);
      setOtherText('');
      onUpdate('industry', industryArray.filter(i => !i.startsWith('other:')));
    } else {
      setShowOtherInput(true);
    }
  };

  // Handle "Other" text input
  const handleOtherTextChange = (value: string) => {
    setOtherText(value);
    // Remove any existing 'other:' entries and add the new one
    const filtered = industryArray.filter(i => !i.startsWith('other:'));
    if (value.trim()) {
      onUpdate('industry', [...filtered, `other:${value.trim()}`]);
    } else {
      onUpdate('industry', filtered);
    }
  };

  const toggleBusinessModel = (model: string) => {
    if (businessModel.includes(model)) {
      onUpdate('business_model', businessModel.filter(m => m !== model));
    } else {
      onUpdate('business_model', [...businessModel, model]);
    }
  };

  const showIndustryError = touched?.industry && errors?.industry;
  const showBusinessModelError = touched?.business_model && errors?.business_model;
  const showStageError = touched?.stage && errors?.stage;

  // Check if industry is AI-detected
  const isAIDetected = (id: string) => aiDetectedIndustries.includes(id);

  return (
    <div className="space-y-5">
      {/* Industry - Multi-select with universal categories */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          Industry
          <span className="text-destructive">*</span>
          {isFromAI && (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-normal">
              <Sparkles className="w-3 h-3 text-primary" />
              AI detected
            </span>
          )}
        </Label>
        <p className="text-xs text-muted-foreground">
          Select all that apply. AI-highlighted options are based on your description.
        </p>
        <div className="flex flex-wrap gap-2">
          {UNIVERSAL_INDUSTRIES.map((ind) => {
            const isSelected = industryArray.includes(ind.id);
            const isDetected = isAIDetected(ind.id);
            
            return (
              <Badge
                key={ind.id}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all text-sm py-1.5 px-3',
                  isSelected && 'bg-primary text-primary-foreground',
                  !isSelected && isDetected && 'border-primary/50 bg-primary/5 text-primary',
                  !isSelected && !isDetected && 'hover:bg-muted'
                )}
                onClick={() => toggleIndustry(ind.id)}
              >
                <span className="mr-1.5">{ind.icon}</span>
                {ind.label}
                {isSelected && ' ✓'}
                {!isSelected && isDetected && (
                  <Sparkles className="w-3 h-3 ml-1.5 text-primary" />
                )}
              </Badge>
            );
          })}
          
          {/* Other option */}
          <Badge
            variant={showOtherInput ? 'default' : 'outline'}
            className={cn(
              'cursor-pointer transition-all text-sm py-1.5 px-3',
              showOtherInput && 'bg-primary text-primary-foreground',
              !showOtherInput && 'hover:bg-muted'
            )}
            onClick={handleOtherToggle}
          >
            ✨ Other
            {showOtherInput && ' ✓'}
          </Badge>
        </div>

        {/* Other text input */}
        {showOtherInput && (
          <Input
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            placeholder="Describe your industry..."
            className="mt-2"
          />
        )}

        {showIndustryError && (
          <p className="text-xs text-destructive">{errors?.industry}</p>
        )}
      </div>

      {/* Business Model - Multi-select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-1">
          Business Model
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_MODELS.map((model) => (
            <Badge
              key={model}
              variant={businessModel.includes(model) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all text-sm py-1.5 px-3',
                businessModel.includes(model) && 'bg-primary text-primary-foreground',
                !businessModel.includes(model) && 'hover:bg-muted'
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
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-1">
          Stage
          <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <Badge
              key={s}
              variant={stage === s ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all text-sm py-1.5 px-3',
                stage === s && 'bg-primary text-primary-foreground',
                stage !== s && 'hover:bg-muted'
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
