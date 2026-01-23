import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import WizardLayout from '@/components/onboarding/WizardLayout';
import WizardAIPanel from '@/components/onboarding/WizardAIPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useWizardSession, { WizardFormData } from '@/hooks/useWizardSession';
import useOnboardingAgent from '@/hooks/useOnboardingAgent';

// Step placeholder components (to be implemented in later prompts)
import Step1Context from '@/components/onboarding/steps/Step1Context';

const WIZARD_STEPS = [
  { number: 1, title: 'Context & Enrichment', description: 'Add your links and info' },
  { number: 2, title: 'AI Analysis', description: 'Review AI findings' },
  { number: 3, title: 'Smart Interviewer', description: 'Answer questions' },
  { number: 4, title: 'Review & Score', description: 'Finalize your profile' },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    session,
    isLoading,
    isSaving,
    isWizardComplete,
    saveFormData,
    setCurrentStep,
  } = useWizardSession();
  
  const {
    enrichUrl,
    enrichContext,
    completeWizard,
    isProcessing,
  } = useOnboardingAgent();

  const [formData, setFormData] = useState<WizardFormData>({});
  const [extractions, setExtractions] = useState<Record<string, unknown>>({});

  // Redirect if wizard is already complete
  useEffect(() => {
    if (isWizardComplete) {
      navigate('/dashboard', { replace: true });
    }
  }, [isWizardComplete, navigate]);

  // Sync form data from session
  useEffect(() => {
    if (session?.form_data) {
      setFormData(session.form_data);
    }
    if (session?.ai_extractions) {
      setExtractions(session.ai_extractions);
    }
  }, [session]);

  const currentStep = session?.current_step || 1;

  const updateFormData = (updates: Partial<WizardFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    saveFormData(newData);
  };

  const completedSteps = (): number[] => {
    const completed: number[] = [];
    // Step 1 is complete if we have company name or website
    if (formData.company_name || formData.website_url) {
      completed.push(1);
    }
    // Add more step completion logic as needed
    return completed;
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(formData.company_name?.trim() || formData.website_url?.trim());
      case 2:
        return true; // AI Analysis is read-only
      case 3:
        return true; // Smart Interviewer completion TBD
      case 4:
        return true; // Review is always ready
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      // Run AI enrichment when moving from step 1 to 2
      if (currentStep === 1 && session?.id) {
        try {
          if (formData.website_url) {
            const result = await enrichUrl({
              session_id: session.id,
              url: formData.website_url,
            });
            if (result.extractions) {
              setExtractions(result.extractions);
            }
          } else if (formData.description) {
            const result = await enrichContext({
              session_id: session.id,
              description: formData.description,
              target_market: formData.target_market,
            });
            if (result.extractions) {
              setExtractions(result.extractions);
            }
          }
        } catch (error) {
          console.error('Enrichment error:', error);
        }
      }
      
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!session?.id) return;

    try {
      const result = await completeWizard({ session_id: session.id });
      if (result.success) {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Complete wizard error:', error);
    }
  };

  const handleSaveLater = () => {
    toast({
      title: 'Progress saved',
      description: 'You can continue your setup anytime.',
    });
    navigate('/');
  };

  const handleStepChange = (step: number) => {
    // Only allow going to completed steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your setup...</p>
        </div>
      </div>
    );
  }

  return (
    <WizardLayout
      currentStep={currentStep}
      completedSteps={completedSteps()}
      steps={WIZARD_STEPS}
      onStepChange={handleStepChange}
      onSaveLater={handleSaveLater}
      isSaving={isSaving}
      aiPanel={
        <WizardAIPanel
          currentStep={currentStep}
          isProcessing={isProcessing}
          extractions={extractions as any}
        />
      }
    >
      {/* Header with horizontal step indicator */}
      <div className="border-b bg-card/30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-4 lg:gap-8">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => handleStepChange(step.number)}
                  disabled={step.number > currentStep}
                  className="flex flex-col items-center gap-1 disabled:opacity-50"
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-colors ${
                      step.number < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : step.number === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium hidden sm:block ${
                      step.number === currentStep
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title.split(' ')[0]}
                  </span>
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <div
                    className={`w-8 lg:w-16 h-0.5 mx-2 ${
                      step.number < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Step Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Step {currentStep} of {WIZARD_STEPS.length}
          </p>
          <h1 className="text-2xl lg:text-3xl font-display font-medium mb-2">
            {WIZARD_STEPS[currentStep - 1]?.title}
          </h1>
          <p className="text-muted-foreground">
            {currentStep === 1 && 'Add your links and Gemini 3 will build your profile.'}
            {currentStep === 2 && 'Review what AI discovered about your startup.'}
            {currentStep === 3 && 'Answer a few questions to refine your profile.'}
            {currentStep === 4 && 'Review your complete profile and score.'}
          </p>
        </div>

        {/* Step Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <Step1Context
                data={formData}
                updateData={updateFormData}
              />
            )}
            {currentStep === 2 && (
              <div className="ai-panel-card p-6">
                <p className="text-muted-foreground">AI Analysis step - coming in Prompt 02</p>
              </div>
            )}
            {currentStep === 3 && (
              <div className="ai-panel-card p-6">
                <p className="text-muted-foreground">Smart Interviewer step - coming in Prompt 03</p>
              </div>
            )}
            {currentStep === 4 && (
              <div className="ai-panel-card p-6">
                <p className="text-muted-foreground">Review & Score step - coming in Prompt 04</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : currentStep === 1 ? (
                <>
                  Run Smart Autofill
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isProcessing}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </WizardLayout>
  );
}
