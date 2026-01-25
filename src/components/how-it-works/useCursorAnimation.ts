import { useState, useEffect, useCallback, useRef } from 'react';
import { sequences, generateCurvedPath, easeInOutCubic, type Point, type AnimationPhase } from './cursorSequences';

export interface CursorState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  isVisible: boolean;
}

interface UseCursorAnimationOptions {
  activeStep: number;
  isInView: boolean;
  prefersReducedMotion: boolean;
}

export function useCursorAnimation({ activeStep, isInView, prefersReducedMotion }: UseCursorAnimationOptions) {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: 100,
    y: 80,
    scale: 1,
    opacity: 0,
    isVisible: true,
  });
  
  const [uiState, setUIState] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAnimations = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  }, []);

  const wait = (ms: number): Promise<void> => 
    new Promise(resolve => {
      const timeout = setTimeout(resolve, ms);
      timeoutRefs.current.push(timeout);
    });

  const animateToPoint = useCallback((
    start: Point,
    end: Point,
    duration: number,
    onComplete: () => void
  ) => {
    const path = generateCurvedPath(start, end);
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const pointIndex = Math.floor(easedProgress * (path.length - 1));
      const point = path[pointIndex] || end;

      setCursorState(prev => ({
        ...prev,
        x: point.x,
        y: point.y,
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const runSequence = useCallback(async (sequence: AnimationPhase[]) => {
    if (prefersReducedMotion || !isInView || sequence.length === 0) return;

    // Fade in cursor
    setCursorState(prev => ({ ...prev, opacity: 1, x: 100, y: 80 }));
    await wait(200);

    let currentPos = { x: 100, y: 80 };

    for (const phase of sequence) {
      if (!isInView) break;

      // Set UI state if provided
      if (phase.uiState) {
        setUIState(phase.uiState);
      }

      switch (phase.action) {
        case 'move':
        case 'drag':
          await new Promise<void>(resolve => {
            animateToPoint(currentPos, phase.target, phase.duration, resolve);
          });
          currentPos = phase.target;
          break;

        case 'click':
          setCursorState(prev => ({ ...prev, scale: 0.9 }));
          await wait(100);
          setCursorState(prev => ({ ...prev, scale: 1 }));
          await wait(phase.duration - 100);
          break;

        case 'hover':
        case 'idle':
          await wait(phase.duration);
          break;
      }
    }

    // Fade out and reset
    setCursorState(prev => ({ ...prev, opacity: 0 }));
    setUIState(null);
    await wait(500);

    // Loop if still in view
    if (isInView && !prefersReducedMotion) {
      runSequence(sequence);
    }
  }, [animateToPoint, isInView, prefersReducedMotion]);

  // Run animation when step changes
  useEffect(() => {
    clearAnimations();
    
    if (prefersReducedMotion || !isInView) {
      setCursorState(prev => ({ ...prev, opacity: 0 }));
      setUIState(null);
      return;
    }

    const sequence = sequences[activeStep as keyof typeof sequences];
    if (sequence && sequence.length > 0) {
      runSequence(sequence);
    }

    return clearAnimations;
  }, [activeStep, isInView, prefersReducedMotion, clearAnimations, runSequence]);

  return { cursorState, uiState };
}
