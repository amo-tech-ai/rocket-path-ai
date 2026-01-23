import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import WizardLayout from '@/components/onboarding/WizardLayout';
import WizardAIPanel from '@/components/onboarding/WizardAIPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useWizardSession, { WizardFormData, ReadinessScore, InvestorScore, AISummary, InterviewAnswer } from '@/hooks/useWizardSession';
import useOnboardingAgent from '@/hooks/useOnboardingAgent';
import { Step1ValidationErrors, validateStep1 } from '@/lib/step1Schema';

// Step components
import Step1Context from '@/components/onboarding/step1/Step1Context';
import Step2Analysis from '@/components/onboarding/step2/Step2Analysis';
import Step3Interview, { Question, AdvisorPersona } from '@/components/onboarding/step3/Step3Interview';
import Step4Review from '@/components/onboarding/step4/Step4Review';

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
    ensureSession,
    saveFormData,
    flushSave,
    setCurrentStep,
  } = useWizardSession();
  
  const [isNavigating, setIsNavigating] = useState(false);
  
  const {
    enrichUrl,
    enrichContext,
    enrichFounder,
    calculateReadiness,
    getQuestions,
    processAnswer,
    calculateScore,
    generateSummary,
    completeWizard,
    isEnrichingUrl,
    isEnrichingContext,
    isEnrichingFounder,
    isCalculatingReadiness,
    isGettingQuestions,
    isProcessingAnswer,
    isCalculatingScore,
    isGeneratingSummary,
    isCompletingWizard,
    isProcessing,
  } = useOnboardingAgent();

  const [formData, setFormData] = useState<WizardFormData>({});
  const [extractions, setExtractions] = useState<Record<string, unknown>>({});
  const [urlExtractionDone, setUrlExtractionDone] = useState(false);
  const [urlExtractionError, setUrlExtractionError] = useState<string | undefined>();
  
  // Step 2 state
  const [readinessScore, setReadinessScore] = useState<ReadinessScore | null>(null);
  const [isEnhancing, setIsEnhancing] = useState<Record<string, boolean>>({});
  
  // Step 3 state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [signals, setSignals] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [advisor, setAdvisor] = useState<AdvisorPersona | null>(null);
  
  // Step 4 state
  const [investorScore, setInvestorScore] = useState<InvestorScore | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  
  // Step 1 validation state
  const [step1Valid, setStep1Valid] = useState(false);
  const [step1Errors, setStep1Errors] = useState<Step1ValidationErrors>({});
  const [showStep1Validation, setShowStep1Validation] = useState(false);

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
      if (session.form_data.readiness_score) {
        setReadinessScore(session.form_data.readiness_score);
      }
      if (session.form_data.interview_answers) {
        setAnswers(session.form_data.interview_answers);
        setCurrentQuestionIndex(session.form_data.interview_answers.length);
      }
      if (session.form_data.signals) {
        setSignals(session.form_data.signals);
      }
      if (session.form_data.investor_score) {
        setInvestorScore(session.form_data.investor_score);
      }
      if (session.form_data.ai_summary) {
        setAiSummary(session.form_data.ai_summary);
      }
    }
    if (session?.ai_extractions) {
      setExtractions(session.ai_extractions);
      setUrlExtractionDone(Object.keys(session.ai_extractions).length > 0);
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
    if (formData.company_name || formData.website_url || formData.description) {
      completed.push(1);
    }
    if (readinessScore) {
      completed.push(2);
    }
    if (answers.length > 0) {
      completed.push(3);
    }
    if (investorScore) {
      completed.push(4);
    }
    return completed;
  };

  // Validation callback for Step 1 - memoized for stability
  const handleStep1ValidationChange = useCallback((isValid: boolean, errors: Step1ValidationErrors) => {
    console.log('[Wizard] Step 1 validation received:', { isValid, errorCount: Object.keys(errors).length, errors });
    setStep1Valid(isValid);
    setStep1Errors(errors);
  }, []);

  // Debug: Log step1Valid changes
  useEffect(() => {
    console.log('[Wizard] step1Valid state updated:', step1Valid, 'errorCount:', Object.keys(step1Errors).length);
  }, [step1Valid, step1Errors]);

  const canProceed = (): boolean => {
    const result = (() => {
      switch (currentStep) {
        case 1:
          return step1Valid;
        case 2:
          // Don't require readiness score - user can proceed without it
          return true;
        case 3:
          // FIX C: Require questions to be loaded before proceeding
          if (questions.length === 0) return false;
          return currentQuestionIndex >= questions.length || answers.length >= 3;
        case 4:
          return true;
        default:
          return false;
      }
    })();
    console.log('[Wizard] canProceed:', result, 'step:', currentStep, 'step1Valid:', step1Valid, 'questions:', questions.length);
    return result;
  };

  // Step 1 handlers
  const handleEnrichUrl = async () => {
    if (!session?.id || !formData.website_url) return;
    
    setUrlExtractionError(undefined);
    try {
      const result = await enrichUrl({
        session_id: session.id,
        url: formData.website_url,
      });
      if (result.extractions) {
        setExtractions(result.extractions);
        setUrlExtractionDone(true);
        // Auto-fill form fields
        if (result.extractions.company_name && !formData.company_name) {
          updateFormData({ 
            company_name: result.extractions.company_name,
            name: result.extractions.company_name,
          });
        }
        if (result.extractions.industry) {
          updateFormData({ industry: result.extractions.industry });
        }
        if (result.extractions.description && !formData.description) {
          updateFormData({ description: result.extractions.description });
        }
      }
    } catch (error: any) {
      setUrlExtractionError(error?.message || 'Failed to extract data');
    }
  };

  const handleEnrichContext = async () => {
    if (!session?.id || !formData.description) return;
    
    try {
      const result = await enrichContext({
        session_id: session.id,
        description: formData.description,
        target_market: formData.target_market,
      });
      if (result.extractions) {
        setExtractions(prev => ({ ...prev, ...result.extractions }));
      }
    } catch (error) {
      console.error('Context enrichment error:', error);
    }
  };

  const handleEnrichFounder = async (founderId: string, linkedinUrl: string) => {
    if (!session?.id) return;
    
    try {
      const result = await enrichFounder({
        session_id: session.id,
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
  };

  // Step 2 handlers
  const handleCalculateReadiness = async () => {
    if (!session?.id) return;
    
    try {
      const result = await calculateReadiness({ session_id: session.id });
      if (result.readiness_score) {
        setReadinessScore(result.readiness_score);
        updateFormData({ readiness_score: result.readiness_score });
      }
    } catch (error) {
      console.error('Readiness calculation error:', error);
    }
  };

  const handleEnhanceField = async (fieldName: string) => {
    setIsEnhancing(prev => ({ ...prev, [fieldName]: true }));
    // Placeholder for field enhancement
    setTimeout(() => {
      setIsEnhancing(prev => ({ ...prev, [fieldName]: false }));
    }, 1000);
  };

  // Step 3 handlers
  const loadQuestions = async () => {
    if (!session?.id) {
      console.warn('[Wizard] loadQuestions: No session ID');
      return;
    }
    
    console.log('[Wizard] Loading questions for session:', session.id);
    try {
      const result = await getQuestions({ 
        session_id: session.id,
        answered_question_ids: answers.map(a => a.question_id),
      });
      console.log('[Wizard] Questions loaded:', result);
      
      // FIX D: Map API questions to UI Question shape (in case of mismatch)
      if (result.questions && Array.isArray(result.questions)) {
        const mappedQuestions: Question[] = result.questions.map((q: any) => ({
          id: q.id,
          text: q.text || q.question, // Handle both shapes
          type: q.type || 'multiple_choice',
          topic: q.topic || q.category || 'general',
          why_matters: q.why_matters || 'Helps tailor the next steps to your situation.',
          options: (q.options ?? []).map((o: any) => ({
            id: o.id,
            text: o.text,
            emoji: o.emoji,
          })),
        }));
        setQuestions(mappedQuestions);
        console.log('[Wizard] Mapped questions:', mappedQuestions.length);
      }
      if (result.advisor) {
        setAdvisor(result.advisor);
      }
    } catch (error) {
      console.error('[Wizard] Get questions error:', error);
    }
  };
  
  // FIX A: Load questions when Step 3 starts (not when leaving Step 2)
  useEffect(() => {
    if (currentStep === 3 && session?.id && questions.length === 0 && !isGettingQuestions) {
      console.log('[Wizard] Step 3 mounted, loading questions...');
      loadQuestions().catch(console.error);
    }
  }, [currentStep, session?.id, questions.length, isGettingQuestions]);

  const handleAnswer = async (questionId: string, answerId: string, answerText?: string) => {
    if (!session?.id) return;
    
    try {
      const result = await processAnswer({
        session_id: session.id,
        question_id: questionId,
        answer_id: answerId,
        answer_text: answerText,
      });
      
      const newAnswer: InterviewAnswer = {
        question_id: questionId,
        answer_id: answerId,
        answer_text: answerText,
        timestamp: new Date().toISOString(),
      };
      
      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);
      updateFormData({ interview_answers: newAnswers });
      
      if (result.signals) {
        const newSignals = [...new Set([...signals, ...result.signals])];
        setSignals(newSignals);
        updateFormData({ signals: newSignals });
      }
      
      if (result.extracted_traction) {
        updateFormData({ extracted_traction: result.extracted_traction });
      }
      if (result.extracted_funding) {
        updateFormData({ extracted_funding: result.extracted_funding });
      }
    } catch (error) {
      console.error('Process answer error:', error);
    }
  };

  const handleSkipQuestion = () => {
    // Just move to next question without recording answer
  };

  const handleInterviewComplete = () => {
    setCurrentStep(4);
  };

  // Step 4 handlers
  const handleCalculateScore = async () => {
    if (!session?.id) return;
    
    try {
      const result = await calculateScore({ session_id: session.id });
      if (result.investor_score) {
        setInvestorScore(result.investor_score);
        updateFormData({ investor_score: result.investor_score });
      }
    } catch (error) {
      console.error('Calculate score error:', error);
    }
  };

  const handleGenerateSummary = async () => {
    if (!session?.id) return;
    
    try {
      const result = await generateSummary({ session_id: session.id });
      if (result.summary) {
        setAiSummary(result.summary);
        updateFormData({ ai_summary: result.summary });
      }
    } catch (error) {
      console.error('Generate summary error:', error);
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

  // Navigation handlers
  const handleNext = async () => {
    console.log('[Wizard] handleNext called:', { currentStep, step1Valid, sessionId: session?.id, isNavigating });
    
    // Prevent double-clicks
    if (isNavigating) {
      console.log('[Wizard] Navigation already in progress, ignoring');
      return;
    }
    
    // Validate Step 1 before proceeding
    if (currentStep === 1) {
      if (!step1Valid) {
        console.warn('[Wizard] Step 1 validation failed, blocking navigation');
        setShowStep1Validation(true);
        toast({
          title: 'Missing required fields',
          description: 'Please fill in all required fields before continuing.',
          variant: 'destructive',
        });
        return;
      }
      
      setIsNavigating(true);
      
      try {
        // CRITICAL: Ensure session exists before proceeding
        console.log('[Wizard] Ensuring session exists...');
        const sessionId = await ensureSession();
        console.log('[Wizard] Session confirmed:', sessionId);
        
        // Flush save form data before advancing (don't debounce)
        console.log('[Wizard] Flushing form data...');
        await flushSave(formData);
        
        // Move to next step
        const nextStep = 2;
        console.log('[Wizard] ✅ Advancing to step:', nextStep);
        await setCurrentStep(nextStep);
        setShowStep1Validation(false);
        
        // Run readiness calculation (async, don't await)
        if (!readinessScore) {
          handleCalculateReadiness().catch(console.error);
        }
      } catch (error) {
        console.error('[Wizard] Navigation error:', error);
        toast({
          title: 'Session error',
          description: 'Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsNavigating(false);
      }
      return;
    }

    // Steps 2, 3, 4 navigation
    if (currentStep < 4) {
      const sessionId = session?.id;
      if (!sessionId) {
        console.error('[Wizard] Cannot advance: no session ID');
        toast({
          title: 'Session error',
          description: 'Please refresh and try again.',
          variant: 'destructive',
        });
        return;
      }

      const nextStep = currentStep + 1;
      console.log('[Wizard] ✅ Advancing to step:', nextStep);
      
      // Move to next step immediately (optimistic)
      setCurrentStep(nextStep);
      setShowStep1Validation(false);
      
      // Run step-specific actions AFTER moving (non-blocking)
      if (currentStep === 2) {
        // Load questions when entering step 3 (async, don't await)
        if (questions.length === 0) {
          loadQuestions().catch(console.error);
        }
      }
      
      if (currentStep === 3) {
        // Calculate score when entering step 4 (async, don't await)
        if (!investorScore) {
          handleCalculateScore().catch(console.error);
          handleGenerateSummary().catch(console.error);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
          readinessScore={readinessScore}
          investorScore={investorScore}
          aiSummary={aiSummary}
          signals={signals}
          questionCount={questions.length > 0 ? { answered: answers.length, total: questions.length } : undefined}
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
                onEnrichUrl={handleEnrichUrl}
                onEnrichContext={handleEnrichContext}
                onEnrichFounder={handleEnrichFounder}
                isEnrichingUrl={isEnrichingUrl}
                isEnrichingContext={isEnrichingContext}
                isEnrichingFounder={isEnrichingFounder}
                urlExtractionDone={urlExtractionDone}
                urlExtractionError={urlExtractionError}
                showValidation={showStep1Validation}
                onValidationChange={handleStep1ValidationChange}
              />
            )}
            {currentStep === 2 && (
              <Step2Analysis
                data={formData}
                onUpdate={updateFormData}
                readinessScore={readinessScore}
                onRecalculate={handleCalculateReadiness}
                onEnhanceField={handleEnhanceField}
                onEnhanceFounder={handleEnrichFounder}
                isCalculating={isCalculatingReadiness}
                isEnhancing={isEnhancing}
                isEnrichingFounder={isEnrichingFounder}
              />
            )}
            {currentStep === 3 && (
              // FIX B: Gate rendering - don't show Step3Interview until questions are loaded
              questions.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading interview questions...</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadQuestions()}
                    disabled={isGettingQuestions}
                    className="mt-4"
                  >
                    {isGettingQuestions ? 'Loading...' : 'Retry'}
                  </Button>
                </div>
              ) : (
                <Step3Interview
                  sessionId={session?.id || ''}
                  questions={questions}
                  answers={answers}
                  signals={signals}
                  advisor={advisor}
                  onAnswer={handleAnswer}
                  onSkip={handleSkipQuestion}
                  onComplete={handleInterviewComplete}
                  isProcessing={isProcessingAnswer}
                  currentQuestionIndex={currentQuestionIndex}
                  onSetCurrentIndex={setCurrentQuestionIndex}
                />
              )
            )}
            {currentStep === 4 && (
              <Step4Review
                data={formData}
                onUpdate={updateFormData}
                investorScore={investorScore}
                aiSummary={aiSummary}
                onRecalculateScore={handleCalculateScore}
                onRegenerateSummary={handleGenerateSummary}
                onComplete={handleComplete}
                isCalculatingScore={isCalculatingScore}
                isGeneratingSummary={isGeneratingSummary}
                isCompleting={isCompletingWizard}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {/* Step 1: Optional Smart Autofill button */}
              {currentStep === 1 && formData.website_url && !urlExtractionDone && (
                <Button
                  variant="outline"
                  onClick={handleEnrichUrl}
                  disabled={isEnrichingUrl}
                >
                  {isEnrichingUrl ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Smart Autofill
                    </>
                  )}
                </Button>
              )}

              {/* Main Continue/Next button - ALWAYS CLICKABLE on Step 1 */}
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 ? isProcessing : (!canProceed() || isProcessing)}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}
