/**
 * Wizard Step 4: Review & Generate
 * Summary, signal strength, and deck generation
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Edit2,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  type Step4Data, 
  type WizardData,
  DECK_TYPES,
  TONES,
  getIndustryLabel,
  getFundingStageLabel 
} from '@/lib/pitchDeckSchema';
import { cn } from '@/lib/utils';

interface WizardStep4Props {
  wizardData: WizardData;
  signalStrength: number;
  onGenerate: (data: Step4Data) => void;
  onBack: () => void;
  onEditStep: (step: number) => void;
  isGenerating?: boolean;
}

interface ChecklistItem {
  label: string;
  passed: boolean;
}

export function WizardStep4({
  wizardData,
  signalStrength,
  onGenerate,
  onBack,
  onEditStep,
  isGenerating = false,
}: WizardStep4Props) {
  const [deckType, setDeckType] = useState<Step4Data['deck_type']>('seed');
  const [tone, setTone] = useState<Step4Data['tone']>('clear');

  const step1 = wizardData.step1_startup_info;
  const step2 = wizardData.step2_market_traction;
  const step3 = wizardData.step3_smart_interview;

  // Calculate readiness checklist
  const checklist: ChecklistItem[] = [
    { label: 'Problem clearly stated', passed: !!step2?.problem && step2.problem.length >= 20 },
    { label: 'Solution defined', passed: !!step2?.core_solution && step2.core_solution.length >= 20 },
    { label: 'Market context included', passed: !!step1?.industry },
    { label: `Traction aligned with ${step2?.funding_stage || 'seed'} stage`, passed: !!(step2?.users || step2?.revenue) },
    { label: 'Interview questions answered', passed: (step3?.questions_answered || 0) >= 3 },
  ];

  const passedCount = checklist.filter(c => c.passed).length;

  // AI Deck Analysis
  const analysis = {
    story_clarity: signalStrength >= 60 ? 'Strong' : signalStrength >= 40 ? 'Adequate' : 'Needs work',
    problem_solution_fit: step2?.problem && step2?.core_solution ? 'Good for Seed' : 'Incomplete',
    traction_strength: step2?.users || step2?.revenue ? 'Good for Seed' : 'Limited',
    market_narrative: step1?.industry ? 'Adequate' : 'Incomplete',
  };

  // Potential gaps
  const gaps: string[] = [];
  if (!step2?.users && !step2?.revenue) gaps.push('Market size will be directional, not exact');
  if (!step3 || (step3.questions_answered || 0) < 3) gaps.push('Competitive landscape may be limited');
  if (!step2?.differentiator || step2.differentiator.length < 50) gaps.push('Unique value proposition could be stronger');

  // Confidence level
  const confidenceLevel = signalStrength >= 70 ? 'High' : signalStrength >= 50 ? 'Medium' : 'Low';
  const confidenceColor = signalStrength >= 70 ? 'text-emerald-500 bg-emerald-500/10' : 
                          signalStrength >= 50 ? 'text-sage bg-sage/10' : 
                          'text-amber-500 bg-amber-500/10';

  const handleGenerate = () => {
    const step4Data: Step4Data = {
      deck_type: deckType,
      tone,
      signal_strength: signalStrength,
    };
    onGenerate(step4Data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          Review & Generate
        </h2>
        <p className="text-muted-foreground mt-1">
          Check your deck details before generating
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Company</p>
            <p className="font-medium">{step1?.company_name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Deck Type</p>
            <p className="font-medium capitalize">{step2?.funding_stage?.replace('_', ' ') || 'Seed'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Industry</p>
            <p className="font-medium">{step1?.industry ? getIndustryLabel(step1.industry) : 'Not selected'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estimated Slides</p>
            <p className="font-medium">10-12 slides</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Slides will be ordered to match {getFundingStageLabel(step2?.funding_stage || 'seed')} investor expectations
        </p>
      </div>

      {/* AI Deck Analysis */}
      <div className="p-4 rounded-xl border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage" />
          <span className="font-medium">AI Deck Analysis</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Story clarity:</span>
            <span className="font-medium">{analysis.story_clarity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Problem-solution fit:</span>
            <span className="font-medium">{analysis.problem_solution_fit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Traction strength:</span>
            <span className="font-medium">{analysis.traction_strength}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Market narrative:</span>
            <span className="font-medium">{analysis.market_narrative}</span>
          </div>
        </div>
      </div>

      {/* What Investors Will See */}
      <div className="p-4 rounded-xl border border-border space-y-3">
        <span className="text-sm font-medium">What investors will see:</span>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-sage" />
            A clear problem in the first 2 slides
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-sage" />
            Evidence of early traction
          </li>
          <li className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-sage" />
            A focused {getFundingStageLabel(step2?.funding_stage || 'seed')}-stage narrative
          </li>
        </ul>
      </div>

      {/* Potential Gaps */}
      {gaps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium">Potential gaps</span>
          </div>
          <p className="text-xs text-muted-foreground">Areas that may need improvement</p>
          <ul className="space-y-1">
            {gaps.map((gap, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-amber-500">•</span>
                {gap}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onEditStep(3)}
            className="text-xs text-sage hover:underline"
          >
            Improve before generating
          </button>
        </motion.div>
      )}

      {/* Confidence Level */}
      <div className={cn('p-4 rounded-xl', confidenceColor)}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">
            AI Confidence Level: {confidenceLevel}
          </span>
        </div>
        <p className="text-xs mt-1 opacity-80">
          Based on comparable {getFundingStageLabel(step2?.funding_stage || 'seed')}-stage decks
        </p>
      </div>

      {/* Readiness Checklist */}
      <div className="space-y-3">
        <span className="text-sm font-medium">Readiness Checklist</span>
        <div className="space-y-2">
          {checklist.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-border"
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-sage" />
              ) : (
                <XCircle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={cn(
                'text-sm',
                item.passed ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Deck Type Selection */}
      <div className="space-y-3">
        <Label>Deck Type</Label>
        <RadioGroup
          value={deckType}
          onValueChange={(value: Step4Data['deck_type']) => setDeckType(value)}
          className="grid grid-cols-3 gap-3"
        >
          {DECK_TYPES.map((type) => (
            <div
              key={type.value}
              className={cn(
                'relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all',
                deckType === type.value
                  ? 'border-sage bg-sage/5'
                  : 'border-border hover:border-sage/50'
              )}
              onClick={() => setDeckType(type.value as Step4Data['deck_type'])}
            >
              <RadioGroupItem value={type.value} id={type.value} className="sr-only" />
              <span className="font-medium text-sm">{type.label}</span>
              <span className="text-xs text-muted-foreground mt-1">{type.description}</span>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Tone Selection */}
      <div className="space-y-3">
        <Label>Tone</Label>
        <RadioGroup
          value={tone}
          onValueChange={(value: Step4Data['tone']) => setTone(value)}
          className="grid grid-cols-3 gap-3"
        >
          {TONES.map((t) => (
            <div
              key={t.value}
              className={cn(
                'relative flex flex-col items-center justify-center p-4 rounded-xl border cursor-pointer transition-all',
                tone === t.value
                  ? 'border-sage bg-sage/5'
                  : 'border-border hover:border-sage/50'
              )}
              onClick={() => setTone(t.value as Step4Data['tone'])}
            >
              <RadioGroupItem value={t.value} id={t.value} className="sr-only" />
              <span className="font-medium text-sm">{t.label}</span>
              <span className="text-xs text-muted-foreground mt-1">{t.description}</span>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="gap-2 bg-sage hover:bg-sage/90 text-sage-foreground"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-sage-foreground border-t-transparent" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Investor Deck
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        You can edit everything after generation
      </p>
    </div>
  );
}
