/**
 * Pitch Deck Wizard Page
 * Main entry point for 4-step wizard
 */

import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePitchDeckWizard } from '@/hooks/usePitchDeckWizard';
import { 
  WizardLayout,
  WizardStep1,
  WizardStep2,
  WizardStep3,
  WizardStep4,
} from '@/components/pitchdeck/wizard';
import { Skeleton } from '@/components/ui/skeleton';

export default function PitchDeckWizard() {
  const { deckId: urlDeckId } = useParams<{ deckId?: string }>();
  const navigate = useNavigate();

  const {
    currentStep,
    wizardData,
    isLoading,
    isSaving,
    isGenerating,
    signalStrength,
    interviewQuestions,
    researchContext,
    deckId,
    startupId,
    nextStep,
    prevStep,
    goToStep,
    generateInterviewQuestions,
    generateDeck,
    getStep1Data,
    getStep2Data,
    getStep3Data,
  } = usePitchDeckWizard({ deckId: urlDeckId });

  // Generate interview questions when reaching step 3
  useEffect(() => {
    if (currentStep === 3 && interviewQuestions.length === 0) {
      generateInterviewQuestions();
    }
  }, [currentStep, interviewQuestions.length, generateInterviewQuestions]);

  // Calculate completed steps
  const completedSteps = useMemo(() => {
    const completed: number[] = [];
    if (wizardData.step1_startup_info?.company_name) completed.push(1);
    if (wizardData.step2_market_traction?.problem) completed.push(2);
    if (wizardData.step3_smart_interview?.questions_answered) completed.push(3);
    return completed;
  }, [wizardData]);

  // AI Panel content per step
  const aiContent = useMemo(() => {
    switch (currentStep) {
      case 1:
        return {
          title: 'AI Assistant',
          tips: [
            'Investors scan pitches in 2 seconds',
            'Be specific about your target customer',
          ],
          suggestions: wizardData.step1_startup_info?.industry ? [
            { 
              text: `Example: "AI SDRs that book qualified meetings for B2B sales teams"`,
            },
          ] : undefined,
        };
      case 2:
        return {
          title: 'AI Assistant',
          tips: [
            'Investors look for clear pain + proof',
            'Metrics strengthen your narrative',
          ],
          confidenceLevel: (wizardData.step2_market_traction?.users || wizardData.step2_market_traction?.revenue) 
            ? 'high' as const 
            : 'medium' as const,
          confidenceText: `Traction is ${
            (wizardData.step2_market_traction?.users || wizardData.step2_market_traction?.revenue)
              ? 'strong' 
              : 'developing'
          } for ${wizardData.step2_market_traction?.funding_stage || 'Pre-Seed'} stage`,
        };
      case 3:
        return {
          title: 'Smart Interview',
          tips: [
            'These questions fill gaps in your deck',
            'Skip any question you prefer not to answer',
          ],
        };
      case 4:
        return {
          title: 'AI Assistant',
          tips: [
            'Structure a 10-12 slide Seed deck',
            'Emphasize traction and clarity',
            'Keep slides concise and investor-focused',
          ],
          confidenceLevel: signalStrength >= 70 ? 'high' as const : signalStrength >= 50 ? 'medium' as const : 'low' as const,
          confidenceText: `Your deck will follow the proven order: Problem → Solution → Market → Traction → Team → Ask`,
        };
      default:
        return {};
    }
  }, [currentStep, wizardData, signalStrength]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="col-span-7">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="col-span-3">
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      onStepClick={goToStep}
      signalStrength={signalStrength}
      completedSteps={completedSteps}
      aiContent={aiContent}
    >
      {currentStep === 1 && (
        <WizardStep1
          initialData={getStep1Data()}
          onContinue={(data) => nextStep(data)}
          isSaving={isSaving}
          deckId={deckId}
          startupId={startupId}
        />
      )}

      {currentStep === 2 && (
        <WizardStep2
          initialData={getStep2Data()}
          step1Data={getStep1Data()}
          onContinue={(data) => nextStep(data)}
          onBack={prevStep}
          isSaving={isSaving}
        />
      )}

      {currentStep === 3 && (
        <WizardStep3
          initialData={getStep3Data()}
          questions={interviewQuestions}
          researchContext={researchContext}
          onContinue={(data) => nextStep(data)}
          onBack={prevStep}
          isLoadingQuestions={interviewQuestions.length === 0}
          isSaving={isSaving}
        />
      )}

      {currentStep === 4 && (
        <WizardStep4
          wizardData={wizardData}
          signalStrength={signalStrength}
          onGenerate={generateDeck}
          onBack={prevStep}
          onEditStep={goToStep}
          isGenerating={isGenerating}
        />
      )}
    </WizardLayout>
  );
}
