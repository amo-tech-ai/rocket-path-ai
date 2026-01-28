/**
 * OnboardingWizard Page
 * 
 * 4-step wizard for founder onboarding:
 * 1. Context & Enrichment - Add links and basic info
 * 2. AI Analysis - Review Gemini-extracted insights
 * 3. Smart Interviewer - Answer dynamic questions
 * 4. Review & Score - Finalize profile and get investor score
 * 
 * Refactored to use modular hooks for each step.
 * @see src/pages/onboarding/ for step handlers and navigation
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import WizardLayout from '@/components/onboarding/WizardLayout';
import WizardAIPanel from '@/components/onboarding/WizardAIPanel';
import OnboardingIntro, { hasSeenIntro } from '@/components/onboarding/OnboardingIntro';
import AIProgressTransition from '@/components/onboarding/AIProgressTransition';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import useWizardSession from '@/hooks/useWizardSession';
import useOnboardingAgent from '@/hooks/useOnboardingAgent';
import { Step1ValidationErrors, validateStep1 } from '@/lib/step1Schema';
import type { WizardFormData, ReadinessScore, InvestorScore, AISummary, InterviewAnswer } from '@/hooks/onboarding/types';

// Step components
import Step1Context from '@/components/onboarding/step1/Step1Context';
import Step2Analysis from '@/components/onboarding/step2/Step2Analysis';
import Step3Interview, { Question, AdvisorPersona } from '@/components/onboarding/step3/Step3Interview';
import Step4Review from '@/components/onboarding/step4/Step4Review';

// Modular utilities
import { WIZARD_STEPS, STEP_DESCRIPTIONS } from './onboarding/constants';
import { useStep1Handlers } from './onboarding/useStep1Handlers';
import { useStep3Handlers } from './onboarding/useStep3Handlers';
import { useStep4Handlers } from './onboarding/useStep4Handlers';
import { useWizardNavigation } from './onboarding/useWizardNavigation';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Session management
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
  
  // AI Agent operations
  const {
    enrichUrl,
    enrichContext,
    enrichFounder,
    generateCompetitors,
    calculateReadiness,
    getQuestions,
    processAnswer,
    calculateScore,
    generateSummary,
    completeWizard,
    isEnrichingUrl,
    isEnrichingContext,
    isEnrichingFounder,
    isGeneratingCompetitors,
    isCalculatingReadiness,
    isGettingQuestions,
    isProcessingAnswer,
    isCalculatingScore,
    isGeneratingSummary,
    isCompletingWizard,
    isProcessing,
  } = useOnboardingAgent();

  // =========================================================================
  // State Management
  // =========================================================================
  
  // Form data
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
  
  // Step 1 validation
  const [step1Valid, setStep1Valid] = useState(false);
  const [step1Errors, setStep1Errors] = useState<Step1ValidationErrors>({});
  
  // Intro state
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro());

  const currentStep = session?.current_step || 1;

  // =========================================================================
  // Callbacks
  // =========================================================================
  
  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    saveFormData(newData);
  }, [formData, saveFormData]);

  const handleStep1ValidationChange = useCallback((isValid: boolean, errors: Step1ValidationErrors) => {
    console.log('[Wizard] Step 1 validation received:', { isValid, errorCount: Object.keys(errors).length });
    setStep1Valid(isValid);
    setStep1Errors(errors);
  }, []);

  const handleCalculateReadiness = useCallback(async () => {
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
  }, [session?.id, calculateReadiness, updateFormData]);

  const handleEnhanceField = useCallback(async (fieldName: string) => {
    if (!session?.id) return;
    
    setIsEnhancing(prev => ({ ...prev, [fieldName]: true }));
    try {
      // For now just simulate enhancement for non-competitor fields
      // Could add enrich_context calls here for specific fields
      await new Promise(resolve => setTimeout(resolve, 800));
    } finally {
      setIsEnhancing(prev => ({ ...prev, [fieldName]: false }));
    }
  }, [session?.id]);

  // Generate competitors with AI Re-scan
  const handleGenerateCompetitors = useCallback(async () => {
    if (!session?.id) return;
    
    try {
      const result = await generateCompetitors({ session_id: session.id });
      if (result.success && result.competitors) {
        // Update form data with new competitors (extract names)
        const competitorNames = result.competitors.map(c => c.name);
        updateFormData({ competitors: competitorNames });
        
        // Update extractions with full competitor data
        setExtractions(prev => ({
          ...prev,
          competitors: result.competitors,
          market_trends: result.market_trends,
        }));
      }
    } catch (error) {
      console.error('Generate competitors error:', error);
    }
  }, [session?.id, generateCompetitors, updateFormData]);

  // =========================================================================
  // Step Handlers (Modular Hooks)
  // =========================================================================
  
  const step1Handlers = useStep1Handlers({
    sessionId: session?.id,
    formData,
    updateFormData,
    setExtractions: (fn) => setExtractions(prev => fn(prev)),
    setUrlExtractionDone,
    setUrlExtractionError,
    enrichUrl,
    enrichContext,
    enrichFounder,
  });

  // Extract industry from form data for coaching context
  const selectedIndustry = Array.isArray(formData.industry) 
    ? formData.industry[0] 
    : formData.industry;

  const step3Handlers = useStep3Handlers({
    sessionId: session?.id,
    answers,
    signals,
    currentQuestionIndex,
    industry: selectedIndustry, // Pass industry for coaching
    setAnswers,
    setSignals,
    setCurrentQuestionIndex,
    setQuestions,
    setAdvisor,
    updateFormData,
    getQuestions,
    processAnswer,
  });

  const step4Handlers = useStep4Handlers({
    sessionId: session?.id,
    setInvestorScore,
    setAiSummary,
    updateFormData,
    calculateScore,
    generateSummary,
    completeWizard,
    navigate,
  });

  const navigation = useWizardNavigation({
    currentStep,
    step1Valid,
    questions,
    answers,
    currentQuestionIndex,
    readinessScore,
    formData,
    sessionId: session?.id,
    ensureSession,
    flushSave,
    setCurrentStep,
    handleCalculateReadiness,
    loadQuestions: step3Handlers.loadQuestions,
    handleCalculateScore: step4Handlers.handleCalculateScore,
    handleGenerateSummary: step4Handlers.handleGenerateSummary,
  });

  // =========================================================================
  // Effects
  // =========================================================================
  
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
      }
      if (session.form_data.current_question_index !== undefined) {
        setCurrentQuestionIndex(session.form_data.current_question_index);
      } else if (session.form_data.interview_answers) {
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

  // Load questions when Step 3 starts
  useEffect(() => {
    if (currentStep === 3 && session?.id && questions.length === 0 && !isGettingQuestions) {
      console.log('[Wizard] Step 3 mounted, loading questions...');
      step3Handlers.loadQuestions().catch(console.error);
    }
  }, [currentStep, session?.id, questions.length, isGettingQuestions, step3Handlers.loadQuestions]);

  // Auto-load score and summary when entering Step 4
  useEffect(() => {
    if (currentStep === 4 && session?.id) {
      console.log('[Wizard] Step 4 mounted, loading score and summary...');
      if (!investorScore && !isCalculatingScore) {
        step4Handlers.handleCalculateScore().catch(console.error);
      }
      if (!aiSummary && !isGeneratingSummary) {
        step4Handlers.handleGenerateSummary().catch(console.error);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, session?.id]);

  // =========================================================================
  // Render Helpers
  // =========================================================================
  
  const handleSaveLater = () => {
    toast({
      title: 'Progress saved',
      description: 'You can continue your setup anytime.',
    });
    navigate('/');
  };

  const handleInterviewComplete = async () => {
    await flushSave(formData);
    setCurrentStep(4);
  };

  // =========================================================================
  // Loading & Transition States
  // =========================================================================
  
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

  // Show intro on first visit (Step 1 only)
  if (showIntro && currentStep === 1) {
    return (
      <OnboardingIntro
        onComplete={() => setShowIntro(false)}
        onSkip={() => setShowIntro(false)}
      />
    );
  }

  // Show AI progress transition (Step 1 → Step 2)
  if (navigation.showAIProgress && navigation.pendingStep2Transition) {
    return (
      <AIProgressTransition
        onComplete={navigation.handleAIProgressComplete}
        isAnalysisReady={!!readinessScore}
      />
    );
  }

  // =========================================================================
  // Main Render
  // =========================================================================
  
  return (
    <WizardLayout
      currentStep={currentStep}
      completedSteps={navigation.completedSteps()}
      steps={WIZARD_STEPS as any}
      onStepChange={navigation.handleStepChange}
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
      <div className="border-b bg-card/30 sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-8">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  onClick={() => navigation.handleStepChange(step.number)}
                  disabled={step.number > currentStep}
                  className="flex flex-col items-center gap-1 disabled:opacity-50 touch-manipulation"
                >
                  <div
                    className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-semibold transition-colors ${
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
                    className={`text-[9px] sm:text-[10px] uppercase tracking-wider font-medium hidden xs:block ${
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
                    className={`w-6 sm:w-8 lg:w-16 h-0.5 mx-1 sm:mx-2 ${
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Step Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Step {currentStep} of {WIZARD_STEPS.length}
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-medium mb-2">
            {WIZARD_STEPS[currentStep - 1]?.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {STEP_DESCRIPTIONS[currentStep as keyof typeof STEP_DESCRIPTIONS]}
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
                onEnrichUrl={step1Handlers.handleEnrichUrl}
                onEnrichContext={step1Handlers.handleEnrichContext}
                onEnrichFounder={step1Handlers.handleEnrichFounder}
                isEnrichingUrl={isEnrichingUrl}
                isEnrichingContext={isEnrichingContext}
                isEnrichingFounder={isEnrichingFounder}
                urlExtractionDone={urlExtractionDone}
                urlExtractionError={urlExtractionError}
                showValidation={navigation.showStep1Validation}
                onValidationChange={handleStep1ValidationChange}
              />
            )}
            {currentStep === 2 && (
              <Step2Analysis
                data={formData}
                extractions={extractions}
                onUpdate={updateFormData}
                readinessScore={readinessScore}
                onRecalculate={handleCalculateReadiness}
                onEnhanceField={handleEnhanceField}
                onEnhanceFounder={step1Handlers.handleEnrichFounder}
                onGenerateCompetitors={handleGenerateCompetitors}
                isCalculating={isCalculatingReadiness}
                isEnhancing={isEnhancing}
                isEnrichingFounder={isEnrichingFounder}
                isGeneratingCompetitors={isGeneratingCompetitors}
              />
            )}
            {currentStep === 3 && (
              questions.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Loading interview questions...</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => step3Handlers.loadQuestions()}
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
                  onAnswer={step3Handlers.handleAnswer}
                  onSkip={step3Handlers.handleSkipQuestion}
                  onComplete={handleInterviewComplete}
                  isProcessing={isProcessingAnswer}
                  currentQuestionIndex={currentQuestionIndex}
                  onSetCurrentIndex={setCurrentQuestionIndex}
                  coachingFeedback={step3Handlers.coachingFeedback}
                  isCoaching={step3Handlers.isCoaching}
                  onDismissCoaching={step3Handlers.dismissCoaching}
                />
              )
            )}
            {currentStep === 4 && (
              <Step4Review
                data={formData}
                onUpdate={updateFormData}
                investorScore={investorScore}
                aiSummary={aiSummary}
                onRecalculateScore={step4Handlers.handleCalculateScore}
                onRegenerateSummary={step4Handlers.handleGenerateSummary}
                onComplete={step4Handlers.handleComplete}
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
              onClick={navigation.handleBack}
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
                  onClick={step1Handlers.handleEnrichUrl}
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

              {/* Main Continue/Next button */}
              <Button
                onClick={navigation.handleNext}
                disabled={currentStep === 1 ? isProcessing : (!navigation.canProceed() || isProcessing)}
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
