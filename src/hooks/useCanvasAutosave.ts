import { useState, useEffect, useRef, useCallback } from 'react';
import { useSaveLeanCanvas, LeanCanvasData } from '@/hooks/useLeanCanvas';

export type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface AutosaveOptions {
  debounceMs?: number;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function useCanvasAutosave(
  startupId: string | undefined,
  existingId: string | undefined,
  canvasData: LeanCanvasData,
  options: AutosaveOptions = {}
) {
  const { debounceMs = 2000, onSaveSuccess, onSaveError } = options;
  
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  
  const saveCanvas = useSaveLeanCanvas();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Serialize canvas data for comparison
  const serializeData = useCallback((data: LeanCanvasData): string => {
    return JSON.stringify(data);
  }, []);

  // Perform the actual save
  const performSave = useCallback(async () => {
    if (!startupId) return;

    setSaveState('saving');
    setErrorMessage(undefined);

    try {
      await saveCanvas.mutateAsync({
        startupId,
        canvasData,
        existingId,
      });

      setSaveState('saved');
      setLastSaved(new Date());
      retryCount.current = 0;
      lastDataRef.current = serializeData(canvasData);
      onSaveSuccess?.();
    } catch (error) {
      console.error('Autosave error:', error);
      
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        setSaveState('pending');
        // Exponential backoff retry
        setTimeout(performSave, 1000 * Math.pow(2, retryCount.current));
      } else {
        setSaveState('error');
        const errMsg = error instanceof Error ? error.message : 'Save failed';
        setErrorMessage(errMsg);
        onSaveError?.(error instanceof Error ? error : new Error(errMsg));
      }
    }
  }, [startupId, canvasData, existingId, saveCanvas, serializeData, onSaveSuccess, onSaveError]);

  // Trigger autosave when data changes
  useEffect(() => {
    if (!startupId) return;

    const currentData = serializeData(canvasData);
    
    // Skip if data hasn't changed
    if (currentData === lastDataRef.current) return;

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set pending state
    setSaveState('pending');

    // Schedule save after debounce period
    debounceTimer.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [canvasData, startupId, debounceMs, serializeData, performSave]);

  // Initialize lastDataRef on mount
  useEffect(() => {
    lastDataRef.current = serializeData(canvasData);
  }, []);

  // Manual save trigger
  const saveNow = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    performSave();
  }, [performSave]);

  // Reset error state
  const resetError = useCallback(() => {
    setSaveState('idle');
    setErrorMessage(undefined);
    retryCount.current = 0;
  }, []);

  return {
    saveState,
    lastSaved,
    errorMessage,
    isSaving: saveState === 'saving',
    hasPendingChanges: saveState === 'pending',
    hasError: saveState === 'error',
    saveNow,
    resetError,
  };
}
