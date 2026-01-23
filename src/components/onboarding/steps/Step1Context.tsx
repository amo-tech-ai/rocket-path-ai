import { useState } from 'react';
import { Globe, Linkedin, Link2, Plus, Upload, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WizardFormData } from '@/hooks/useWizardSession';

const INDUSTRIES = [
  'Artificial Intelligence',
  'B2B SaaS',
  'Consumer Tech',
  'E-commerce',
  'EdTech',
  'FinTech',
  'HealthTech',
  'LegalTech',
  'Marketplace',
  'PropTech',
  'Other',
];

interface Step1ContextProps {
  data: WizardFormData;
  updateData: (updates: Partial<WizardFormData>) => void;
}

export function Step1Context({ data, updateData }: Step1ContextProps) {
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

  return (
    <div className="space-y-6">
      {/* Startup Name */}
      <div className="space-y-2">
        <Label htmlFor="company_name">Startup Name</Label>
        <Input
          id="company_name"
          placeholder="e.g. Acme Corp"
          value={data.company_name || ''}
          onChange={(e) => updateData({ company_name: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Startup Description</Label>
          <span className="text-xs text-muted-foreground">Used for AI grounding</span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe your product, mission, and vision in 2-5 sentences..."
          value={data.description || ''}
          onChange={(e) => updateData({ description: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {/* Target Market */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="target_market">Target Market</Label>
          <span className="text-xs text-muted-foreground">Helps refine audience & competitors</span>
        </div>
        <Textarea
          id="target_market"
          placeholder='Who are you building for? e.g. "Enterprise marketing teams in North America"...'
          value={data.target_market || ''}
          onChange={(e) => updateData({ target_market: e.target.value })}
          className="min-h-[80px]"
        />
      </div>

      {/* Digital Footprint Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Digital Footprint
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website_url"
                placeholder="https://..."
                value={data.website_url || ''}
                onChange={(e) => updateData({ website_url: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

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
        </div>

        {/* Additional URLs */}
        <div className="space-y-2">
          <Label htmlFor="additional_urls">Additional URLs</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="additional_urls"
                placeholder="Blog post, press release, documentation..."
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
      </div>

      {/* Search Terms */}
      <div className="space-y-2">
        <Label htmlFor="search_terms">Search Terms / Context Keywords</Label>
        <Textarea
          id="search_terms"
          placeholder="e.g. AI for law, competitor-name, compliance automation..."
          value={data.search_terms || ''}
          onChange={(e) => updateData({ search_terms: e.target.value })}
          className="min-h-[80px]"
        />
      </div>

      {/* Industry & Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Industry */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={data.industry || ''}
            onValueChange={(value) => updateData({ industry: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Founded */}
        <div className="space-y-2">
          <Label htmlFor="year_founded">Year Founded</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="year_founded"
              type="number"
              placeholder="YYYY"
              min={1900}
              max={new Date().getFullYear()}
              value={data.year_founded || ''}
              onChange={(e) => updateData({ year_founded: parseInt(e.target.value) || undefined })}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label>Cover Image</Label>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm font-medium">Upload Cover Image</p>
          <p className="text-xs text-muted-foreground mt-1">1200x600px recommended</p>
        </div>
      </div>
    </div>
  );
}

export default Step1Context;
