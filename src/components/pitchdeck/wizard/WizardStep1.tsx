/**
 * Wizard Step 1: Startup Info
 * Company name, website, pitch, industry, stage
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Sparkles, Lock } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { INDUSTRIES, FUNDING_STAGES, type Step1Data } from '@/lib/pitchDeckSchema';
import { cn } from '@/lib/utils';

interface WizardStep1Props {
  initialData?: Partial<Step1Data>;
  isLocked?: boolean;
  onContinue: (data: Step1Data) => void;
  isSaving?: boolean;
}

const SUB_CATEGORIES: Record<string, string[]> = {
  ai_saas: ['B2B SaaS', 'AI Infrastructure', 'Vertical AI', 'AI Agents', 'MLOps'],
  fintech: ['Payments', 'Banking', 'Insurance', 'Wealth Management', 'Crypto'],
  healthcare: ['Digital Health', 'Biotech', 'MedTech', 'Mental Health', 'Telemedicine'],
  edtech: ['K-12', 'Higher Ed', 'Corporate Training', 'Tutoring', 'Skills Platform'],
  ecommerce: ['D2C', 'B2B Marketplace', 'Retail Tech', 'Fashion', 'Food & Beverage'],
  marketplace: ['Services', 'Products', 'B2B', 'Gig Economy', 'Local'],
  enterprise: ['Security', 'DevTools', 'Productivity', 'HR Tech', 'Data'],
  consumer: ['Social', 'Gaming', 'Entertainment', 'Lifestyle', 'Travel'],
  climate: ['Clean Energy', 'Carbon', 'Mobility', 'Agriculture', 'Circular Economy'],
  proptech: ['Residential', 'Commercial', 'Construction', 'Property Management', 'Mortgage'],
  logistics: ['Freight', 'Last Mile', 'Warehouse', 'Fleet', 'Supply Chain'],
  media: ['Streaming', 'News', 'Creator Economy', 'Advertising', 'Publishing'],
  other: ['Other'],
};

export function WizardStep1({
  initialData,
  isLocked = false,
  onContinue,
  isSaving = false,
}: WizardStep1Props) {
  const [formData, setFormData] = useState<Partial<Step1Data>>({
    company_name: '',
    website_url: '',
    tagline: '',
    industry: '',
    sub_category: '',
    stage: 'seed',
    ...initialData,
  });

  const [charCount, setCharCount] = useState(formData.tagline?.length || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      setCharCount(initialData.tagline?.length || 0);
    }
  }, [initialData]);

  const handleChange = (field: keyof Step1Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'tagline') {
      setCharCount(value.length);
    }
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value, sub_category: '' }));
    if (errors.industry) {
      setErrors(prev => ({ ...prev, industry: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.company_name?.trim()) {
      newErrors.company_name = 'Company name is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }
    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
      newErrors.website_url = 'Please enter a valid URL (https://...)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue(formData as Step1Data);
    }
  };

  const subCategories = formData.industry ? SUB_CATEGORIES[formData.industry] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Startup Information
        </h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your company
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company_name" className="flex items-center gap-2">
            Company Name
            <span className="text-destructive">*</span>
            {isLocked && (
              <Lock className="w-3 h-3 text-muted-foreground" />
            )}
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="company_name"
              value={formData.company_name || ''}
              onChange={(e) => handleChange('company_name', e.target.value)}
              placeholder="e.g., Acme AI"
              disabled={isLocked}
              className={cn('pl-10', errors.company_name && 'border-destructive')}
            />
          </div>
          {errors.company_name && (
            <p className="text-xs text-destructive">{errors.company_name}</p>
          )}
        </div>

        {/* Website URL */}
        <div className="space-y-2">
          <Label htmlFor="website_url" className="flex items-center gap-2">
            Website URL
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="website_url"
              type="url"
              value={formData.website_url || ''}
              onChange={(e) => handleChange('website_url', e.target.value)}
              placeholder="https://acmeai.com"
              className={cn('pl-10', errors.website_url && 'border-destructive')}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            We'll auto-fill details from your website
          </p>
          {errors.website_url && (
            <p className="text-xs text-destructive">{errors.website_url}</p>
          )}
        </div>

        {/* One-Line Pitch */}
        <div className="space-y-2">
          <Label htmlFor="tagline" className="flex items-center gap-2">
            One-line Pitch
            <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Who it's for + what problem you solve + why it's better
          </p>
          <Textarea
            id="tagline"
            value={formData.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="FashionOS is an AI-powered operating system for fashion brands and events that turns complex planning, content creation..."
            maxLength={120}
            rows={3}
            className={cn(
              'resize-none',
              charCount > 100 && 'border-sage focus-visible:ring-sage'
            )}
          />
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">
              Keep it concise and specific
            </p>
            <p className={cn(
              'text-xs',
              charCount > 100 ? 'text-sage' : 'text-muted-foreground'
            )}>
              {charCount}/120
            </p>
          </div>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Industry
            <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.industry || ''} onValueChange={handleIndustryChange}>
            <SelectTrigger className={cn(errors.industry && 'border-destructive')}>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-xs text-destructive">{errors.industry}</p>
          )}
        </div>

        {/* Sub-category */}
        {subCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <Label className="flex items-center gap-2">
              Sub-category
              <span className="text-muted-foreground">(optional)</span>
              <Badge variant="outline" className="ml-2 gap-1 text-xs">
                <Sparkles className="w-3 h-3" />
                AI Enhance
              </Badge>
            </Label>
            <Select
              value={formData.sub_category || ''}
              onValueChange={(value) => handleChange('sub_category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {subCategories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase().replace(/\s+/g, '_')}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Be specific: investors scan this in 2 seconds
            </p>
          </motion.div>
        )}

        {/* Stage */}
        <div className="space-y-2">
          <Label>Funding Stage</Label>
          <Select
            value={formData.stage || 'seed'}
            onValueChange={(value: Step1Data['stage']) => handleChange('stage', value || 'seed')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {FUNDING_STAGES.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label} ({stage.slides} slides)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* AI-Generated Investor Summary */}
        {formData.industry && formData.tagline && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-muted/50 border border-border"
          >
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Investor Summary
            </p>
            <p className="text-sm text-foreground">
              {INDUSTRIES.find(i => i.value === formData.industry)?.label}
              {formData.sub_category && ` (${formData.sub_category.replace(/_/g, ' ')})`}
              {' company: '}
              {formData.tagline}
            </p>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={handleContinue} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <span aria-hidden>→</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
