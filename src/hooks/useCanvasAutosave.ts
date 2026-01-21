import { useState, useEffect, useCallback, useRef } from 'react';

export type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

export interface AutosaveState {
  status: SaveState;
  lastSaved: Date | null;
  pendingChanges: boolean;
  errorMessage?: string;
}

interface UseCanvasAutosaveOptions {
  debounceMs?: number;
  onSave: () => Promise<void>;
  enabled?: boolean;
}

/**
 * Hook for debounced autosave with state machine
 * State flow: IDLE → PENDING → SAVING → SAVED
 *                ↑                      ↓
 *                ←────── (after 3s) ────←
 */
export function useCanvasAutosave({
  debounceMs = 2000,
  onSave,
  enabled = true,
}: UseCanvasAutosaveOptions) {
  const [state, setState] = useState<AutosaveState>({
    status: 'idle',
    lastSaved: null,
    pendingChanges: false,
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const savedTimer = useRef<NodeJS.Timeout | null>(null);

  // Mark as having pending changes
  const markDirty = useCallback(() => {
    if (!enabled) return;

    // Clear any existing timers
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    if (savedTimer.current) {
      clearTimeout(savedTimer.current);
    }

    setState(prev => ({
      ...prev,
      status: 'pending',
      pendingChanges: true,
    }));

    // Set debounce timer
    debounceTimer.current = setTimeout(async () => {
      setState(prev => ({ ...prev, status: 'saving' }));

      try {
        await onSave();
        setState({
          status: 'saved',
          lastSaved: new Date(),
          pendingChanges: false,
        });

        // Return to idle after 3 seconds
        savedTimer.current = setTimeout(() => {
          setState(prev => ({
            ...prev,
            status: prev.pendingChanges ? 'pending' : 'idle',
          }));
        }, 3000);
      } catch (err) {
        setState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Save failed',
        }));
      }
    }, debounceMs);
  }, [debounceMs, onSave, enabled]);

  // Force immediate save
  const saveNow = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setState(prev => ({ ...prev, status: 'saving' }));

    try {
      await onSave();
      setState({
        status: 'saved',
        lastSaved: new Date(),
        pendingChanges: false,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        status: 'error',
        errorMessage: err instanceof Error ? err.message : 'Save failed',
      }));
      throw err;
    }
  }, [onSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  return {
    ...state,
    markDirty,
    saveNow,
  };
}
