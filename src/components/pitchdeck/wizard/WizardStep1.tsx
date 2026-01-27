/**
 * Wizard Step 1: Enhanced Startup Info
 * Company description, industry research, AI-assisted problem input, Lean Canvas
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Building2, Globe, Lock, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { INDUSTRIES, FUNDING_STAGES, type Step1Data, type LeanCanvasData as LeanCanvasSchemaData } from '@/lib/pitchDeckSchema';
import { cn } from '@/lib/utils';
import { useStep1AI } from '@/hooks/useStep1AI';
import {
  CompanyDescriptionInput,
  ProblemInput,
  AISuggestionsPanel,
  LeanCanvasSection,
  type AISuggestion,
  type LeanCanvasData,
  type CanvasFieldSuggestion,
} from './step1';

interface WizardStep1Props {
  initialData?: Partial<Step1Data>;
  isLocked?: boolean;
  onContinue: (data: Step1Data) => void;
  isSaving?: boolean;
  deckId?: string | null;
  startupId?: string | null;
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

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content?: string;
}

export function WizardStep1({
  initialData,
  isLocked = false,
  onContinue,
  isSaving = false,
  deckId,
  startupId,
}: WizardStep1Props) {
  const [formData, setFormData] = useState<Partial<Step1Data>>({
    company_name: '',
    website_url: '',
    company_description: '',
    tagline: '',
    industry: '',
    sub_category: '',
    stage: 'seed',
    problem: '',
    lean_canvas: {},
    ...initialData,
  });

  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(
    initialData?.uploaded_file 
      ? {
          name: initialData.uploaded_file.name || '',
          type: initialData.uploaded_file.type || '',
          size: initialData.uploaded_file.size || 0,
          content: initialData.uploaded_file.content,
        }
      : null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeAIField, setActiveAIField] = useState<'industry' | 'problem' | 'canvas' | null>(null);

  // AI Hook
  const {
    isResearchingIndustry,
    industryInsights,
    researchIndustry,
    problemSuggestions,
    isLoadingProblemSuggestions,
    generateProblemSuggestions,
    canvasSuggestions,
    loadingCanvasField,
    generateCanvasSuggestions,
  } = useStep1AI({ deckId, startupId });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
      if (initialData.uploaded_file?.name) {
        setUploadedFile({
          name: initialData.uploaded_file.name,
          type: initialData.uploaded_file.type || '',
          size: initialData.uploaded_file.size || 0,
          content: initialData.uploaded_file.content,
        });
      }
    }
  }, [initialData]);

  // Trigger industry research when industry changes
  useEffect(() => {
    if (formData.industry && formData.industry !== 'other') {
      researchIndustry(formData.industry, formData.sub_category);
      setActiveAIField('industry');
    }
  }, [formData.industry, formData.sub_category, researchIndustry]);

  const handleChange = useCallback((field: keyof Step1Data, value: string | object) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleIndustryChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, industry: value, sub_category: '' }));
    if (errors.industry) {
      setErrors(prev => ({ ...prev, industry: '' }));
    }
  }, [errors.industry]);

  const handleFileUpload = useCallback((file: UploadedFile) => {
    setUploadedFile(file);
    setFormData(prev => ({ ...prev, uploaded_file: file }));
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setFormData(prev => ({ ...prev, uploaded_file: undefined }));
  }, []);

  const handleAnalyzeDescription = useCallback(() => {
    if (formData.industry && formData.company_description) {
      generateProblemSuggestions(
        formData.industry,
        formData.company_description,
        formData.sub_category
      );
      setActiveAIField('problem');
    }
  }, [formData.industry, formData.company_description, formData.sub_category, generateProblemSuggestions]);

  const handleRequestProblemSuggestions = useCallback(() => {
    if (formData.industry) {
      generateProblemSuggestions(
        formData.industry,
        formData.company_description || '',
        formData.sub_category
      );
      setActiveAIField('problem');
    }
  }, [formData.industry, formData.company_description, formData.sub_category, generateProblemSuggestions]);

  const handleAddProblemSuggestion = useCallback((suggestion: AISuggestion) => {
    const currentProblem = formData.problem || '';
    const separator = currentProblem.trim() ? '\n\n' : '';
    handleChange('problem', currentProblem + separator + suggestion.text);
  }, [formData.problem, handleChange]);

  // Lean Canvas handlers
  const handleCanvasChange = useCallback((field: keyof LeanCanvasData, value: string) => {
    setFormData(prev => ({
      ...prev,
      lean_canvas: {
        ...(prev.lean_canvas || {}),
        [field]: value,
      },
    }));
  }, []);

  const handleRequestCanvasSuggestions = useCallback((field: keyof LeanCanvasData) => {
    if (formData.industry && formData.company_description) {
      generateCanvasSuggestions(field, formData.industry, formData.company_description);
      setActiveAIField('canvas');
    }
  }, [formData.industry, formData.company_description, generateCanvasSuggestions]);

  const handleAddCanvasSuggestion = useCallback((field: keyof LeanCanvasData, suggestion: CanvasFieldSuggestion) => {
    const currentValue = (formData.lean_canvas as LeanCanvasData)?.[field] || '';
    const separator = currentValue.trim() ? '\n' : '';
    handleCanvasChange(field, currentValue + separator + suggestion.title);
  }, [formData.lean_canvas, handleCanvasChange]);

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
      // Store industry insights in the form data
      const dataToSave: Step1Data = {
        ...formData,
        industry_insights: industryInsights ? (industryInsights as unknown as Record<string, unknown>) : undefined,
      } as Step1Data;
      onContinue(dataToSave);
    }
  };

  const subCategories = formData.industry ? SUB_CATEGORIES[formData.industry] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Startup Foundation
        </h2>
        <p className="text-muted-foreground mt-1">
          Tell us about your company — AI will help you articulate your story
        </p>
      </div>

      {/* Smart Interview Mode Indicator */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-sage/10 border border-sage/20">
        <Sparkles className="w-4 h-4 text-sage" />
        <span className="text-sm text-foreground">
          <strong>Smart Interview Mode</strong> — AI analyzes your inputs and suggests improvements
        </span>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company_name" className="flex items-center gap-2">
            Company Name
            <span className="text-destructive">*</span>
            {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
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
          <Label htmlFor="website_url">Website URL</Label>
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

        {/* Company Description (replaces One-Line Pitch) */}
        <CompanyDescriptionInput
          value={formData.company_description || ''}
          onChange={(value) => handleChange('company_description', value)}
          onFileUpload={handleFileUpload}
          uploadedFile={uploadedFile}
          onRemoveFile={handleRemoveFile}
          onAnalyze={handleAnalyzeDescription}
          isAnalyzing={isLoadingProblemSuggestions}
        />

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
          {isResearchingIndustry && (
            <p className="text-xs text-sage flex items-center gap-1">
              <span className="animate-spin rounded-full h-3 w-3 border border-sage border-t-transparent" />
              AI is researching your industry...
            </p>
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

        {/* Funding Stage */}
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

        {/* Problem Field (Enhanced) */}
        <div className="pt-4 border-t border-border">
          <ProblemInput
            value={formData.problem || ''}
            onChange={(value) => handleChange('problem', value)}
            onRequestSuggestions={handleRequestProblemSuggestions}
            isLoadingSuggestions={isLoadingProblemSuggestions}
            error={errors.problem}
          />
        </div>

        {/* Lean Canvas Section */}
        <div className="pt-4 border-t border-border">
          <LeanCanvasSection
            data={(formData.lean_canvas || {}) as LeanCanvasData}
            onChange={handleCanvasChange}
            onRequestSuggestions={handleRequestCanvasSuggestions}
            fieldSuggestions={canvasSuggestions}
            loadingField={loadingCanvasField}
            onAddSuggestion={handleAddCanvasSuggestion}
          />
        </div>
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
