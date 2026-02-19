/**
 * Coach Sync Context
 * Bidirectional sync between Validator Main and Coach panels
 */

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

export type HighlightableElement = 
  | 'verdict'
  | 'strength'
  | 'concern'
  | 'evidence'
  | 'sprint'
  | 'dimension';

interface HighlightedElement {
  type: HighlightableElement;
  id: string;
}

interface LiveScores {
  [dimension: string]: number;
}

interface CoachSyncContextValue {
  // Main → Coach (click to explain)
  explainElement: (elementType: HighlightableElement, elementId: string) => void;
  pendingExplain: { type: HighlightableElement; id: string } | null;
  clearPendingExplain: () => void;
  
  // Coach → Main (reference highlight)
  highlightedElement: HighlightedElement | null;
  setHighlight: (element: HighlightedElement | null) => void;
  clearHighlight: () => void;
  
  // Live score updates during assessment
  liveScores: LiveScores;
  updateScore: (dimension: string, score: number) => void;
  clearScores: () => void;
  
  // Connection state
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
}

const CoachSyncContext = createContext<CoachSyncContextValue | null>(null);

interface CoachSyncProviderProps {
  children: ReactNode;
}

export function CoachSyncProvider({ children }: CoachSyncProviderProps) {
  // Main → Coach: element that needs explanation
  const [pendingExplain, setPendingExplain] = useState<{ type: HighlightableElement; id: string } | null>(null);
  
  // Coach → Main: element to highlight
  const [highlightedElement, setHighlightedElement] = useState<HighlightedElement | null>(null);
  
  // Live scores for real-time updates
  const [liveScores, setLiveScores] = useState<LiveScores>({});
  
  // Connection state
  const [isConnected, setIsConnected] = useState(true);
  
  // Highlight timeout ref for auto-clear
  const highlightTimeoutRef = useRef<number | null>(null);
  
  // Debounced highlight to prevent rapid flashing
  const debouncedHighlight = useDebouncedCallback(
    (element: HighlightedElement | null) => {
      setHighlightedElement(element);
      
      // Auto-clear highlight after 3 seconds
      if (element && highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      if (element) {
        highlightTimeoutRef.current = window.setTimeout(() => {
          setHighlightedElement(null);
        }, 3000);
      }
    },
    150
  );
  
  // Main → Coach: request explanation for an element
  const explainElement = useCallback((type: HighlightableElement, id: string) => {
    setPendingExplain({ type, id });
  }, []);
  
  const clearPendingExplain = useCallback(() => {
    setPendingExplain(null);
  }, []);
  
  // Coach → Main: set highlight
  const setHighlight = useCallback((element: HighlightedElement | null) => {
    debouncedHighlight(element);
  }, [debouncedHighlight]);
  
  const clearHighlight = useCallback(() => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    setHighlightedElement(null);
  }, []);
  
  // Live score updates
  const updateScore = useCallback((dimension: string, score: number) => {
    setLiveScores(prev => ({
      ...prev,
      [dimension]: score,
    }));
  }, []);
  
  const clearScores = useCallback(() => {
    setLiveScores({});
  }, []);
  
  const setConnected = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);
  
  const value: CoachSyncContextValue = {
    explainElement,
    pendingExplain,
    clearPendingExplain,
    highlightedElement,
    setHighlight,
    clearHighlight,
    liveScores,
    updateScore,
    clearScores,
    isConnected,
    setConnected,
  };
  
  return (
    <CoachSyncContext.Provider value={value}>
      {children}
    </CoachSyncContext.Provider>
  );
}

export function useCoachSync(): CoachSyncContextValue {
  const context = useContext(CoachSyncContext);
  if (!context) {
    throw new Error('useCoachSync must be used within a CoachSyncProvider');
  }
  return context;
}

export default CoachSyncContext;
