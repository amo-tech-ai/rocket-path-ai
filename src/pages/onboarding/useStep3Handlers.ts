/**
 * Step 3 Handlers Hook
 * Manages interview operations for Smart Interviewer step
 * Now includes AI coaching integration via industry-expert-agent
 */

import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WizardFormData, InterviewAnswer } from '@/hooks/onboarding/types';
import { Question } from '@/components/onboarding/step3/Step3Interview';
import { useCoachAnswer } from '@/hooks/useIndustryExpert';

interface UseStep3HandlersParams {
  sessionId: string | undefined;
  answers: InterviewAnswer[];
  signals: string[];
  currentQuestionIndex: number;
  industry?: string; // Industry for coaching context
  setAnswers: (answers: InterviewAnswer[]) => void;
  setSignals: (signals: string[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setQuestions: (questions: Question[]) => void;
  setAdvisor: (advisor: { name: string; title: string; intro: string } | null) => void;
  updateFormData: (updates: Partial<WizardFormData>) => void;
  getQuestions: (params: { session_id: string; answered_question_ids?: string[] }) => Promise<any>;
  processAnswer: (params: { session_id: string; question_id: string; answer_id: string; answer_text?: string }) => Promise<any>;
}

export function useStep3Handlers({
  sessionId,
  answers,
  signals,
  currentQuestionIndex,
  industry,
  setAnswers,
  setSignals,
  setCurrentQuestionIndex,
  setQuestions,
  setAdvisor,
  updateFormData,
  getQuestions,
  processAnswer,
}: UseStep3HandlersParams) {
  const { toast } = useToast();
  
  // Coaching state
  const [coachingFeedback, setCoachingFeedback] = useState<string | null>(null);
  const [isCoaching, setIsCoaching] = useState(false);
  
  // Coaching mutation from industry-expert-agent
  const coachAnswerMutation = useCoachAnswer();
  
  // Ref for stable answers access in loadQuestions
  const answersRef = useRef<InterviewAnswer[]>([]);
  answersRef.current = answers;

  const loadQuestions = useCallback(async () => {
    if (!sessionId) {
      console.warn('[Wizard] loadQuestions: No session ID');
      return;
    }
    
    const currentAnswers = answersRef.current;
    
    console.log('[Wizard] Loading questions for session:', sessionId);
    try {
      const result = await getQuestions({ 
        session_id: sessionId,
        answered_question_ids: currentAnswers.map(a => a.question_id),
      });
      console.log('[Wizard] Questions loaded:', result);
      
      // Map API questions to UI Question shape
      if (result.questions && Array.isArray(result.questions)) {
        const mappedQuestions: Question[] = result.questions.map((q: any) => ({
          id: q.id,
          text: q.text || q.question,
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
      toast({
        title: 'Failed to load questions',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [sessionId, getQuestions, setQuestions, setAdvisor, toast]);

  const handleAnswer = useCallback(async (
    questionId: string, 
    answerId: string, 
    answerText?: string,
    questionKey?: string // For coaching lookup
  ) => {
    if (!sessionId) {
      toast({
        title: 'Session expired',
        description: 'Please refresh the page to continue.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create answer object immediately (optimistic)
    const newAnswer: InterviewAnswer = {
      question_id: questionId,
      answer_id: answerId,
      answer_text: answerText,
      answered_at: new Date().toISOString(),
    };
    
    // Optimistic local state update
    const previousAnswers = [...answers];
    const newAnswers = [...answers, newAnswer];
    const newQuestionIndex = currentQuestionIndex + 1;
    
    setAnswers(newAnswers);
    setCurrentQuestionIndex(newQuestionIndex);
    
    // Clear previous coaching
    setCoachingFeedback(null);
    
    // Persist question progress immediately
    updateFormData({ 
      interview_answers: newAnswers,
      current_question_index: newQuestionIndex,
    });
    
    try {
      // Process answer with main agent
      const result = await processAnswer({
        session_id: sessionId,
        question_id: questionId,
        answer_id: answerId,
        answer_text: answerText,
      });
      
      // Merge signals from API response
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
      
      // Trigger coaching feedback in background (non-blocking)
      if (industry && questionKey && answerText) {
        setIsCoaching(true);
        coachAnswerMutation.mutateAsync({
          industry,
          questionKey,
          answer: answerText,
        }).then(coachResult => {
          if (coachResult.success && coachResult.coaching) {
            setCoachingFeedback(coachResult.coaching);
          }
        }).catch(err => {
          console.warn('[Wizard] Coaching failed (non-critical):', err);
        }).finally(() => {
          setIsCoaching(false);
        });
      }
    } catch (error) {
      // Rollback on failure
      console.error('Process answer error:', error);
      setAnswers(previousAnswers);
      setCurrentQuestionIndex(currentQuestionIndex);
      updateFormData({ 
        interview_answers: previousAnswers,
        current_question_index: currentQuestionIndex,
      });
      
      toast({
        title: 'Failed to save answer',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  }, [sessionId, answers, signals, currentQuestionIndex, industry, setAnswers, setSignals, setCurrentQuestionIndex, updateFormData, processAnswer, coachAnswerMutation, toast]);

  const handleSkipQuestion = useCallback(() => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setCoachingFeedback(null); // Clear coaching on skip
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  const dismissCoaching = useCallback(() => {
    setCoachingFeedback(null);
  }, []);

  return {
    loadQuestions,
    handleAnswer,
    handleSkipQuestion,
    // Coaching state
    coachingFeedback,
    isCoaching,
    dismissCoaching,
  };
}
