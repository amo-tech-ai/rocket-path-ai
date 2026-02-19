/**
 * useFirstTaskCompletion Hook
 *
 * Handles first task completion celebration and dashboard unlock.
 * Triggers confetti and updates guided mode state.
 */

import { useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useFirstVisit } from './useFirstVisit';

interface UseFirstTaskCompletionOptions {
  /** Callback when dashboard is unlocked */
  onUnlock?: () => void;
}

interface UseFirstTaskCompletionResult {
  /** Whether first task has been completed */
  hasCompletedFirstTask: boolean;
  /** Manually trigger celebration (useful for testing) */
  triggerCelebration: () => void;
}

export function useFirstTaskCompletion(
  taskJustCompleted: boolean,
  options?: UseFirstTaskCompletionOptions
): UseFirstTaskCompletionResult {
  const { hasCompletedFirstTask, setFirstTaskCompleted } = useFirstVisit();
  const celebrationTriggered = useRef(false);

  const triggerCelebration = useCallback(() => {
    // Big confetti burst from center
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#ec4899'],
    });

    // Side bursts
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#10b981', '#6366f1'],
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#f59e0b', '#ec4899'],
    });

    // Mark first task as complete and exit guided mode
    setFirstTaskCompleted();

    // Call unlock callback
    options?.onUnlock?.();
  }, [setFirstTaskCompleted, options]);

  useEffect(() => {
    // Trigger celebration when:
    // 1. A task was just completed
    // 2. First task hasn't been completed yet
    // 3. We haven't already triggered celebration in this render cycle
    if (taskJustCompleted && !hasCompletedFirstTask && !celebrationTriggered.current) {
      celebrationTriggered.current = true;
      triggerCelebration();
    }

    // Reset ref when taskJustCompleted changes to false
    if (!taskJustCompleted) {
      celebrationTriggered.current = false;
    }
  }, [taskJustCompleted, hasCompletedFirstTask, triggerCelebration]);

  return {
    hasCompletedFirstTask,
    triggerCelebration,
  };
}

export default useFirstTaskCompletion;
