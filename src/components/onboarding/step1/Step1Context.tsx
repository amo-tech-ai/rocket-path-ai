import React, { useState, useEffect, useMemo } from 'react';
import { WizardFormData, Founder } from '@/hooks/useWizardSession';
import { validateStep1, getMissingFields, Step1ValidationErrors } from '@/lib/step1Schema';

// Sub-components
import ValidationSummary from './ValidationSummary';
import CompanyNameInput from './CompanyNameInput';
import DescriptionInput from './DescriptionInput';
import TargetMarketInput from './TargetMarketInput';
import URLInput from './URLInput';
import LinkedInInput from './LinkedInInput';
import AdditionalURLsInput from './AdditionalURLsInput';
import AIDetectedFields from './AIDetectedFields';
import FounderCards from './FounderCard';

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation - use company_name as single source of truth
  const validation = useMemo(() => {
    const industryArray = Array.isArray(data.industry) 
      ? data.industry 
      : (data.industry ? [data.industry] : []);
    
    const validationData = {
      company_name: data.company_name || '',
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
  }, [data.company_name, data.description, data.target_market, data.stage, data.business_model, data.industry, data.website_url, data.linkedin_url]);

  // Notify parent of validation changes
  useEffect(() => {
    console.log('[Step1Context] Notifying parent of validation:', validation.isValid, validation.errors);
    onValidationChange?.(validation.isValid, validation.errors);
  }, [validation.isValid, validation.errors, onValidationChange]);

  const missingFields = getMissingFields(validation.errors);
  const showErrors = showValidation || Object.keys(touched).length > 0;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleAddUrl = (url: string) => {
    const urls = data.additional_urls || [];
    updateData({ additional_urls: [...urls, url] });
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
      <ValidationSummary 
        missingFields={missingFields}
        showErrors={showErrors}
        isValid={validation.isValid}
      />

      {/* Company Name */}
      <CompanyNameInput
        value={data.company_name || ''}
        onChange={(value) => updateData({ company_name: value })}
        onBlur={() => handleBlur('company_name')}
        error={validation.errors.company_name}
        showError={showErrors}
        touched={touched.company_name || false}
      />

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

      {/* Target Market */}
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
      <LinkedInInput
        value={data.linkedin_url || ''}
        onChange={(value) => updateData({ linkedin_url: value })}
        onBlur={() => handleBlur('linkedin_url')}
      />

      {/* Additional URLs */}
      <AdditionalURLsInput
        urls={data.additional_urls || []}
        onAdd={handleAddUrl}
        onRemove={handleRemoveUrl}
      />

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
