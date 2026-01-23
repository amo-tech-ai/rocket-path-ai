import React, { useState, useEffect, useMemo } from 'react';
import { Linkedin, Link2, Plus, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WizardFormData, Founder } from '@/hooks/useWizardSession';
import { validateStep1, getMissingFields, Step1ValidationErrors } from '@/lib/step1Schema';
import DescriptionInput from './DescriptionInput';
import URLInput from './URLInput';
import AIDetectedFields from './AIDetectedFields';
import FounderCards from './FounderCard';
import TargetMarketInput from './TargetMarketInput';

interface Step1ContextProps {
  data: WizardFormData;
  updateData: (updates: Partial<WizardFormData>) => void;
  onEnrichUrl?: () => void;
  onEnrichContext?: () => void;
  onEnrichFounder?: (id: string, linkedinUrl: string) => void;
  isEnrichingUrl?: boolean;
  isEnrichingContext?: boolean;
  isEnrichingFounder?: boolean;
  urlExtractionDone?: boolean;
  urlExtractionError?: string;
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean, errors: Step1ValidationErrors) => void;
}

export function Step1Context({
  data,
  updateData,
  onEnrichUrl,
  onEnrichContext,
  onEnrichFounder,
  isEnrichingUrl = false,
  isEnrichingContext = false,
  isEnrichingFounder = false,
  urlExtractionDone = false,
  urlExtractionError,
  showValidation = false,
  onValidationChange,
}: Step1ContextProps) {
  const [additionalUrl, setAdditionalUrl] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation
  const validation = useMemo(() => {
    const industryArray = Array.isArray(data.industry) 
      ? data.industry 
      : (data.industry ? [data.industry] : []);
    
    const validationData = {
      company_name: data.name || data.company_name || '',
      description: data.description || '',
      target_market: data.target_market || '',
      stage: data.stage || '',
      business_model: data.business_model || [],
      industry: industryArray,
      website_url: data.website_url || '',
      linkedin_url: data.linkedin_url || '',
    };
    
    console.log('[Step1Context] Validating:', validationData);
    const result = validateStep1(validationData);
    console.log('[Step1Context] Validation result:', result);
    return result;
  }, [data]);

  // Notify parent of validation changes - use ref + stable string comparison
  const onValidationChangeRef = React.useRef(onValidationChange);
  onValidationChangeRef.current = onValidationChange;
  
  // Stringify errors for stable dependency comparison (prevents infinite loops)
  const errorsString = JSON.stringify(validation.errors);

  useEffect(() => {
    const parsedErrors = JSON.parse(errorsString) as Record<string, string>;
    console.log('[Step1Context] Notifying parent of validation:', validation.isValid, parsedErrors);
    onValidationChangeRef.current?.(validation.isValid, parsedErrors);
  }, [validation.isValid, errorsString]);

  const missingFields = getMissingFields(validation.errors);
  const showErrors = showValidation || Object.keys(touched).length > 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAddUrl = () => {
    if (additionalUrl.trim()) {
      const urls = data.additional_urls || [];
      updateData({ additional_urls: [...urls, additionalUrl.trim()] });
      setAdditionalUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    const urls = data.additional_urls || [];
    updateData({ additional_urls: urls.filter((_, i) => i !== index) });
  };

  const handleAddFounder = (founder: Founder) => {
    const founders = data.founders || [];
    updateData({ founders: [...founders, founder] });
  };

  const handleUpdateFounder = (id: string, updates: Partial<Founder>) => {
    const founders = data.founders || [];
    updateData({
      founders: founders.map(f => f.id === id ? { ...f, ...updates } : f),
    });
  };

  const handleRemoveFounder = (id: string) => {
    const founders = data.founders || [];
    updateData({ founders: founders.filter(f => f.id !== id) });
  };

  const handleEnrichFounderLinkedIn = (id: string, linkedinUrl: string) => {
    if (onEnrichFounder) {
      onEnrichFounder(id, linkedinUrl);
    }
  };

  const handleFieldUpdate = (
    field: 'industry' | 'business_model' | 'stage',
    value: string | string[]
  ) => {
    updateData({ [field]: value });
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="space-y-8">
      {/* Validation Summary */}
      {showErrors && !validation.isValid && missingFields.length > 0 && (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <span className="font-medium">Missing required fields: </span>
            {missingFields.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-1">
          Company Name
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g. ACME Corp"
          value={data.name || data.company_name || ''}
          onChange={(e) => updateData({ name: e.target.value, company_name: e.target.value })}
          onBlur={() => handleBlur('company_name')}
          className={showErrors && validation.errors.company_name ? 'border-destructive' : ''}
        />
        {showErrors && touched.company_name && validation.errors.company_name && (
          <p className="text-xs text-destructive">{validation.errors.company_name}</p>
        )}
      </div>

      {/* Description */}
      <DescriptionInput
        value={data.description || ''}
        onChange={(value) => {
          updateData({ description: value });
          setTouched((prev) => ({ ...prev, description: true }));
        }}
        onEnrich={onEnrichContext}
        isEnriching={isEnrichingContext}
        error={showErrors && touched.description ? validation.errors.description : undefined}
      />

      {/* Target Market - NEW REQUIRED FIELD */}
      <TargetMarketInput
        value={data.target_market || ''}
        onChange={(value) => {
          updateData({ target_market: value });
          setTouched((prev) => ({ ...prev, target_market: true }));
        }}
        error={validation.errors.target_market}
        touched={showErrors || touched.target_market}
      />

      {/* Website URL */}
      <URLInput
        value={data.website_url || ''}
        onChange={(value) => {
          updateData({ website_url: value });
          setTouched((prev) => ({ ...prev, website_url: true }));
        }}
        onExtract={onEnrichUrl}
        isExtracting={isEnrichingUrl}
        extractionDone={urlExtractionDone}
        extractionError={urlExtractionError}
      />

      {/* LinkedIn URL */}
      <div className="space-y-2">
        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="linkedin_url"
            placeholder="https://linkedin.com/company/..."
            value={data.linkedin_url || ''}
            onChange={(e) => updateData({ linkedin_url: e.target.value })}
            onBlur={() => handleBlur('linkedin_url')}
            className="pl-10"
          />
        </div>
      </div>

      {/* Additional URLs */}
      <div className="space-y-2">
        <Label>Additional URLs (optional)</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Blog, press release, docs..."
              value={additionalUrl}
              onChange={(e) => setAdditionalUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleAddUrl} disabled={!additionalUrl.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {data.additional_urls && data.additional_urls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.additional_urls.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm"
              >
                <span className="truncate max-w-[200px]">{url}</span>
                <button
                  onClick={() => handleRemoveUrl(index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-6" />

      {/* AI Detected Fields */}
      <AIDetectedFields
        industry={Array.isArray(data.industry) ? data.industry : (data.industry ? [data.industry] : [])}
        businessModel={data.business_model || []}
        stage={data.stage || ''}
        onUpdate={handleFieldUpdate}
        isFromAI={urlExtractionDone || isEnrichingContext}
        errors={{
          industry: validation.errors.industry,
          business_model: validation.errors.business_model,
          stage: validation.errors.stage,
        }}
        touched={{
          industry: showErrors || touched.industry,
          business_model: showErrors || touched.business_model,
          stage: showErrors || touched.stage,
        }}
      />

      <div className="border-t border-border pt-6" />

      {/* Founding Team */}
      <FounderCards
        founders={data.founders || []}
        onAdd={handleAddFounder}
        onUpdate={handleUpdateFounder}
        onRemove={handleRemoveFounder}
        onEnrichLinkedIn={handleEnrichFounderLinkedIn}
        isEnriching={isEnrichingFounder}
      />
    </div>
  );
}

export default Step1Context;
