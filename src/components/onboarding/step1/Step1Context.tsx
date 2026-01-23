import { useState } from 'react';
import { Linkedin, Link2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { WizardFormData, Founder } from '@/hooks/useWizardSession';
import DescriptionInput from './DescriptionInput';
import URLInput from './URLInput';
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
}: Step1ContextProps) {
  const [additionalUrl, setAdditionalUrl] = useState('');

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
  };

  return (
    <div className="space-y-8">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          placeholder="e.g. ACME Corp"
          value={data.name || data.company_name || ''}
          onChange={(e) => updateData({ name: e.target.value, company_name: e.target.value })}
        />
      </div>

      {/* Description */}
      <DescriptionInput
        value={data.description || ''}
        onChange={(value) => updateData({ description: value })}
        onEnrich={onEnrichContext}
        isEnriching={isEnrichingContext}
      />

      {/* Website URL */}
      <URLInput
        value={data.website_url || ''}
        onChange={(value) => updateData({ website_url: value })}
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
        industry={data.industry || ''}
        businessModel={data.business_model || []}
        stage={data.stage || ''}
        onUpdate={handleFieldUpdate}
        isFromAI={urlExtractionDone || isEnrichingContext}
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
