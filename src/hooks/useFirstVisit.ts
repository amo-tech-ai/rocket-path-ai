/**
 * useFirstVisit Hook
 *
 * Manages guided dashboard mode state for first-time visitors.
 * Separate from WelcomeBanner's useFirstVisitAfterOnboarding - this controls
 * the guided mode with Day1Plan and locked sections.
 */

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, GUIDED_MODE_STATES } from '@/lib/onboardingConstants';

interface FirstVisitState {
  /** Whether user is in guided mode (first visit pending) */
  isGuidedMode: boolean;
  /** Whether first task has been completed */
  hasCompletedFirstTask: boolean;
  /** Mark first task as completed and exit guided mode */
  setFirstTaskCompleted: () => void;
  /** Dismiss guided mode without completing a task */
  dismissGuidedMode: () => void;
}

export function useFirstVisit(startupId?: string): FirstVisitState {
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [hasCompletedFirstTask, setHasCompletedFirstTask] = useState(false);

  // Check localStorage on mount and when startupId changes
  useEffect(() => {
    const dashboardState = localStorage.getItem(STORAGE_KEYS.FIRST_DASHBOARD);
    const taskState = localStorage.getItem(STORAGE_KEYS.FIRST_TASK_COMPLETED);

    // User is in guided mode if state is 'pending' (not completed)
    setIsGuidedMode(dashboardState === GUIDED_MODE_STATES.PENDING);
    setHasCompletedFirstTask(taskState === 'true');
  }, [startupId]);

  const setFirstTaskCompleted = useCallback(() => {
    // Mark task as completed
    localStorage.setItem(STORAGE_KEYS.FIRST_TASK_COMPLETED, 'true');
    setHasCompletedFirstTask(true);

    // Exit guided mode
    localStorage.setItem(STORAGE_KEYS.FIRST_DASHBOARD, GUIDED_MODE_STATES.COMPLETED);
    setIsGuidedMode(false);
  }, []);

  const dismissGuidedMode = useCallback(() => {
    // Exit guided mode without completing task
    localStorage.setItem(STORAGE_KEYS.FIRST_DASHBOARD, GUIDED_MODE_STATES.COMPLETED);
    setIsGuidedMode(false);
  }, []);

  return {
    isGuidedMode,
    hasCompletedFirstTask,
    setFirstTaskCompleted,
    dismissGuidedMode,
  };
}

export default useFirstVisit;
