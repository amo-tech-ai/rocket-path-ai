/**
 * Interview Mutations
 * Handles Smart Interview questions and answer processing
 */

import { useMutation } from '@tanstack/react-query';
import { invokeAgent } from './invokeAgent';
import type {
  GetQuestionsParams,
  ProcessAnswerParams,
  QuestionsResult,
  ProcessAnswerResult,
} from './types';

export function useInterview() {
  // Get interview questions
  const getQuestionsMutation = useMutation({
    mutationFn: (params: GetQuestionsParams): Promise<QuestionsResult> =>
      invokeAgent<QuestionsResult>({
        action: 'get_questions',
        session_id: params.session_id,
        answered_question_ids: params.answered_question_ids || [],
      }),
    onError: (error) => {
      console.error('Get questions failed:', error);
    },
  });

  // Process answer
  const processAnswerMutation = useMutation({
    mutationFn: (params: ProcessAnswerParams): Promise<ProcessAnswerResult> =>
      invokeAgent<ProcessAnswerResult>({
        action: 'process_answer',
        session_id: params.session_id,
        question_id: params.question_id,
        answer_id: params.answer_id,
        answer_text: params.answer_text,
      }),
    onError: (error) => {
      console.error('Process answer failed:', error);
    },
  });

  return {
    getQuestions: getQuestionsMutation.mutateAsync,
    processAnswer: processAnswerMutation.mutateAsync,
    isGettingQuestions: getQuestionsMutation.isPending,
    isProcessingAnswer: processAnswerMutation.isPending,
  };
}
