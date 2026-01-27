/**
 * Wizard Step 2: Market & Traction
 * Problem, solution, differentiator, metrics, funding stage
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type Step2Data } from '@/lib/pitchDeckSchema';
import { cn } from '@/lib/utils';

interface WizardStep2Props {
  initialData?: Partial<Step2Data>;
  onContinue: (data: Step2Data) => void;
  onBack: () => void;
  isSaving?: boolean;
}

export function WizardStep2({
  initialData,
  onContinue,
  onBack,
  isSaving = false,
}: WizardStep2Props) {
  const [formData, setFormData] = useState<Partial<Step2Data>>({
    problem: '',
    core_solution: '',
    differentiator: '',
    users: undefined,
    revenue: undefined,
    growth_rate: '',
    funding_stage: 'seed',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: keyof Step2Data, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.problem?.trim() || formData.problem.length < 10) {
      newErrors.problem = 'Describe the problem clearly (at least 10 characters)';
    }
    if (!formData.core_solution?.trim() || formData.core_solution.length < 10) {
      newErrors.core_solution = 'Describe your solution (at least 10 characters)';
    }
    if (!formData.differentiator?.trim() || formData.differentiator.length < 10) {
      newErrors.differentiator = 'What makes you different? (at least 10 characters)';
    }
    if (!formData.funding_stage) {
      newErrors.funding_stage = 'Please select a funding stage';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      onContinue(formData as Step2Data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Market & Traction
        </h2>
        <p className="text-muted-foreground mt-1">
          Show the problem and your progress
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Problem */}
        <div className="space-y-2">
          <Label htmlFor="problem">
            Problem <span className="text-destructive">*</span>
          </Label>
          <p className="text-xs text-muted-foreground">
            Describe the pain in one sentence. Avoid features.
          </p>
          <Textarea
            id="problem"
            value={formData.problem || ''}
            onChange={(e) => handleChange('problem', e.target.value)}
            placeholder="Fashion brands waste 40% of their time on manual planning..."
            rows={3}
            className={cn('resize-none', errors.problem && 'border-destructive')}
          />
          {errors.problem && (
            <p className="text-xs text-destructive">{errors.problem}</p>
          )}
        </div>

        {/* Core Solution */}
        <div className="space-y-2">
          <Label htmlFor="core_solution">
            Core Solution <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="core_solution"
            value={formData.core_solution || ''}
            onChange={(e) => handleChange('core_solution', e.target.value)}
            placeholder="An AI-powered operating system that automates planning, content creation, and collaboration..."
            rows={3}
            className={cn('resize-none', errors.core_solution && 'border-destructive')}
          />
          {errors.core_solution && (
            <p className="text-xs text-destructive">{errors.core_solution}</p>
          )}
        </div>

        {/* Differentiator */}
        <div className="space-y-2">
          <Label htmlFor="differentiator">
            Why it's different <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="differentiator"
            value={formData.differentiator || ''}
            onChange={(e) => handleChange('differentiator', e.target.value)}
            placeholder="Unlike generic project tools, we're built specifically for fashion workflows with AI that understands the industry..."
            rows={3}
            className={cn('resize-none', errors.differentiator && 'border-destructive')}
          />
          {errors.differentiator && (
            <p className="text-xs text-destructive">{errors.differentiator}</p>
          )}
        </div>

        {/* Traction Metrics (Optional) */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Traction Metrics
            <span className="text-muted-foreground ml-2">(optional)</span>
          </Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="users" className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                Users
              </Label>
              <Input
                id="users"
                type="number"
                value={formData.users || ''}
                onChange={(e) => handleChange('users', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Revenue (MRR)
              </Label>
              <Input
                id="revenue"
                type="number"
                value={formData.revenue || ''}
                onChange={(e) => handleChange('revenue', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="growth_rate" className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Growth (%)
              </Label>
              <Input
                id="growth_rate"
                value={formData.growth_rate || ''}
                onChange={(e) => handleChange('growth_rate', e.target.value)}
                placeholder="50"
              />
            </div>
          </div>
        </div>

        {/* Funding Stage */}
        <div className="space-y-3">
          <Label className="flex items-center gap-1">
            Funding Stage <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.funding_stage || 'seed'}
            onValueChange={(value: Step2Data['funding_stage']) => handleChange('funding_stage', value)}
            className="space-y-2"
          >
            {[
              { value: 'pre_seed', label: 'Pre-Seed' },
              { value: 'seed', label: 'Seed' },
              { value: 'series_a', label: 'Series A' },
            ].map((stage) => (
              <motion.div
                key={stage.value}
                whileHover={{ scale: 1.01 }}
                className={cn(
                  'flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer',
                  formData.funding_stage === stage.value
                    ? 'border-sage bg-sage/5'
                    : 'border-border hover:border-sage/50'
                )}
                onClick={() => handleChange('funding_stage', stage.value as Step2Data['funding_stage'])}
              >
                <RadioGroupItem value={stage.value} id={stage.value} />
                <Label htmlFor={stage.value} className="cursor-pointer flex-1">
                  {stage.label}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
          {errors.funding_stage && (
            <p className="text-xs text-destructive">{errors.funding_stage}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
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
