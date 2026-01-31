/**
 * Step 1 Handlers Hook
 * Manages enrichment operations for Context & Enrichment step
 */

import { useCallback } from 'react';
import { WizardFormData } from '@/hooks/onboarding/types';

interface UseStep1HandlersParams {
  sessionId: string | undefined;
  formData: WizardFormData;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  setExtractions: (fn: (prev: Record<string, unknown>) => Record<string, unknown>) => void;
  setUrlExtractionDone: (done: boolean) => void;
  setUrlExtractionError: (error: string | undefined) => void;
  enrichUrl: (params: { session_id: string; url: string }) => Promise<any>;
  enrichContext: (params: { session_id: string; description: string; target_market?: string }) => Promise<any>;
  enrichFounder: (params: { session_id: string; linkedin_url: string; name?: string }) => Promise<any>;
}

export function useStep1Handlers({
  sessionId,
  formData,
  updateFormData,
  setExtractions,
  setUrlExtractionDone,
  setUrlExtractionError,
  enrichUrl,
  enrichContext,
  enrichFounder,
}: UseStep1HandlersParams) {
  const handleEnrichUrl = useCallback(async () => {
    if (!sessionId || !formData.website_url) return;
    
    setUrlExtractionError(undefined);
    try {
      const result = await enrichUrl({
        session_id: sessionId,
        url: formData.website_url,
      });
      if (result.extractions) {
        setExtractions(prev => ({ ...prev, ...result.extractions }));
        setUrlExtractionDone(true);

        // Build all updates at once to batch the state update
        const updates: Partial<WizardFormData> = {};

        // Auto-fill company name
        if (result.extractions.company_name && !formData.company_name) {
          updates.company_name = result.extractions.company_name;
          updates.name = result.extractions.company_name;
        }

        // Auto-fill industry
        if (result.extractions.industry) {
          updates.industry = result.extractions.industry;
        }

        // Auto-fill description
        if (result.extractions.description && !formData.description) {
          updates.description = result.extractions.description;
        }

        // AUTO-FILL KEY FEATURES - Critical for Step 2 display
        if (result.extractions.key_features && Array.isArray(result.extractions.key_features)) {
          updates.key_features = result.extractions.key_features;
        }

        // AUTO-FILL TARGET AUDIENCE -> target_customers
        if (result.extractions.target_audience) {
          const audience = result.extractions.target_audience;
          updates.target_customers = Array.isArray(audience) ? audience : [audience];
        }

        // AUTO-FILL TAGLINE
        if (result.extractions.tagline || result.extractions.unique_value_proposition) {
          updates.tagline = result.extractions.tagline || result.extractions.unique_value_proposition;
        }

        // AUTO-FILL COMPETITORS
        if (result.extractions.competitors && Array.isArray(result.extractions.competitors)) {
          updates.competitors = result.extractions.competitors.map(
            (c: any) => typeof c === 'string' ? c : c.name
          );
        }

        // Apply all updates at once
        if (Object.keys(updates).length > 0) {
          console.log('[Step1Handlers] Auto-filling extracted fields:', Object.keys(updates));
          updateFormData(updates);
        }
      }
    } catch (error: any) {
      setUrlExtractionError(error?.message || 'Failed to extract data');
    }
  }, [sessionId, formData.website_url, formData.company_name, formData.description, enrichUrl, updateFormData, setExtractions, setUrlExtractionDone, setUrlExtractionError]);

  const handleEnrichContext = useCallback(async () => {
    if (!sessionId || !formData.description) return;
    
    try {
      const result = await enrichContext({
        session_id: sessionId,
        description: formData.description,
        target_market: formData.target_market,
      });
      if (result.extractions) {
        setExtractions(prev => ({ ...prev, ...result.extractions }));
      }
    } catch (error) {
      console.error('Context enrichment error:', error);
    }
  }, [sessionId, formData.description, formData.target_market, enrichContext, setExtractions]);

  const handleEnrichFounder = useCallback(async (founderId: string, linkedinUrl: string) => {
    if (!sessionId) return;
    
    try {
      const result = await enrichFounder({
        session_id: sessionId,
        linkedin_url: linkedinUrl,
      });
      if (result.success) {
        // Update founder with enriched data
        const founders = formData.founders || [];
        updateFormData({
          founders: founders.map(f => 
            f.id === founderId ? { ...f, enriched: true } : f
          ),
        });
      }
    } catch (error) {
      console.error('Founder enrichment error:', error);
    }
  }, [sessionId, formData.founders, enrichFounder, updateFormData]);

  return {
    handleEnrichUrl,
    handleEnrichContext,
    handleEnrichFounder,
  };
}
