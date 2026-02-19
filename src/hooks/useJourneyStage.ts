import { useMemo } from 'react';

export type JourneyStepId = 'idea' | 'validate' | 'canvas' | 'experiment' | 'plan' | 'launch';

export interface JourneyStep {
  id: JourneyStepId;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  path: string;
}

export interface JourneyStageResult {
  steps: JourneyStep[];
  currentStepIndex: number;
  currentStep: JourneyStep;
  percentComplete: number;
}

interface JourneyInput {
  hasStartup: boolean;
  validationScore: number | null;
  canvasProgress: number;
  experimentCount: number;
  sprintProgress: number;
  healthScore: number;
}

/**
 * Derives the 6-step founder journey from existing dashboard data.
 * Steps: Idea → Validate → Canvas → Experiment → Plan → Launch
 */
export function useJourneyStage(input: JourneyInput): JourneyStageResult {
  return useMemo(() => {
    const { hasStartup, validationScore, canvasProgress, experimentCount, sprintProgress, healthScore } = input;

    const stepDefs: { id: JourneyStepId; label: string; path: string; isDone: boolean }[] = [
      { id: 'idea', label: 'Idea', path: '/company-profile', isDone: hasStartup },
      { id: 'validate', label: 'Validate', path: '/validate', isDone: (validationScore ?? 0) > 0 },
      { id: 'canvas', label: 'Canvas', path: '/lean-canvas', isDone: canvasProgress >= 60 },
      { id: 'experiment', label: 'Experiment', path: '/experiments', isDone: experimentCount >= 1 },
      { id: 'plan', label: 'Plan', path: '/sprint-plan', isDone: sprintProgress >= 20 },
      { id: 'launch', label: 'Launch', path: '/dashboard', isDone: healthScore >= 80 },
    ];

    // Find the first incomplete step
    let currentIndex = stepDefs.findIndex((s) => !s.isDone);
    if (currentIndex === -1) currentIndex = stepDefs.length - 1; // all done

    const steps: JourneyStep[] = stepDefs.map((def, i) => ({
      id: def.id,
      label: def.label,
      path: def.path,
      status: i < currentIndex ? 'completed' : i === currentIndex ? 'current' : 'upcoming',
    }));

    const completedCount = steps.filter((s) => s.status === 'completed').length;
    const percentComplete = Math.round((completedCount / steps.length) * 100);

    return {
      steps,
      currentStepIndex: currentIndex,
      currentStep: steps[currentIndex],
      percentComplete,
    };
  }, [input]);
}
