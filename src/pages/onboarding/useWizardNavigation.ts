/**
 * Wizard Navigation Hook
 * Manages step transitions, validation, and navigation state
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WizardFormData, ReadinessScore } from '@/hooks/onboarding/types';
import { Question } from '@/components/onboarding/step3/Step3Interview';

interface UseWizardNavigationParams {
  currentStep: number;
  step1Valid: boolean;
  questions: Question[];
  answers: { question_id: string }[];
  currentQuestionIndex: number;
  readinessScore: ReadinessScore | null;
  formData: WizardFormData;
  sessionId: string | undefined;
  ensureSession: () => Promise<string>;
  flushSave: (data: WizardFormData) => Promise<void>;
  setCurrentStep: (step: number) => Promise<void>;
  handleCalculateReadiness: () => Promise<void>;
  loadQuestions: () => Promise<void>;
  handleCalculateScore: () => Promise<void>;
  handleGenerateSummary: () => Promise<void>;
}

export function useWizardNavigation({
  currentStep,
  step1Valid,
  questions,
  answers,
  currentQuestionIndex,
  readinessScore,
  formData,
  sessionId,
  ensureSession,
  flushSave,
  setCurrentStep,
  handleCalculateReadiness,
  loadQuestions,
  handleCalculateScore,
  handleGenerateSummary,
}: UseWizardNavigationParams) {
  const { toast } = useToast();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showStep1Validation, setShowStep1Validation] = useState(false);
  const [showAIProgress, setShowAIProgress] = useState(false);
  const [pendingStep2Transition, setPendingStep2Transition] = useState(false);

  const canProceed = useCallback((): boolean => {
    switch (currentStep) {
      case 1:
        return step1Valid;
      case 2:
        return true; // Don't require readiness score
      case 3:
        if (questions.length === 0) return false;
        return currentQuestionIndex >= questions.length || answers.length >= 3;
      case 4:
        return true;
      default:
        return false;
    }
  }, [currentStep, step1Valid, questions.length, currentQuestionIndex, answers.length]);

  const completedSteps = useCallback((): number[] => {
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
    return completed;
  }, [formData, readinessScore, answers.length]);

  const handleNext = useCallback(async () => {
    console.log('[Wizard] handleNext called:', { currentStep, step1Valid, sessionId, isNavigating });
    
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
        console.log('[Wizard] Ensuring session exists...');
        await ensureSession();
        
        console.log('[Wizard] Flushing form data...');
        await flushSave(formData);
        
        // Show AI progress animation
        setShowAIProgress(true);
        setPendingStep2Transition(true);
        setShowStep1Validation(false);
        
        // Run readiness calculation in background
        if (!readinessScore) {
          handleCalculateReadiness().catch(console.error);
        }
      } catch (error) {
        console.error('[Wizard] Navigation error:', error);
        setShowAIProgress(false);
        setPendingStep2Transition(false);
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
      
      await setCurrentStep(nextStep);
      setShowStep1Validation(false);
      
      // Run step-specific actions AFTER moving (non-blocking)
      if (currentStep === 2 && questions.length === 0) {
        loadQuestions().catch(console.error);
      }
      
      if (currentStep === 3) {
        handleCalculateScore().catch(console.error);
        handleGenerateSummary().catch(console.error);
      }
    }
  }, [
    currentStep, step1Valid, sessionId, isNavigating, formData, readinessScore,
    questions.length, ensureSession, flushSave, setCurrentStep, 
    handleCalculateReadiness, loadQuestions, handleCalculateScore, handleGenerateSummary, toast
  ]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  const handleStepChange = useCallback((step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  }, [currentStep, setCurrentStep]);

  const handleAIProgressComplete = useCallback(async () => {
    setShowAIProgress(false);
    setPendingStep2Transition(false);
    console.log('[Wizard] ✅ AI Progress complete, advancing to step: 2');
    await setCurrentStep(2);
  }, [setCurrentStep]);

  return {
    isNavigating,
    showStep1Validation,
    setShowStep1Validation,
    showAIProgress,
    pendingStep2Transition,
    canProceed,
    completedSteps,
    handleNext,
    handleBack,
    handleStepChange,
    handleAIProgressComplete,
  };
}
