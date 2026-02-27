/**
 * useAIPanel — Persistent AI panel visibility hook
 *
 * Manages panel open/close state with:
 * - localStorage persistence
 * - Cmd/Ctrl+J keyboard shortcut
 * - Responsive auto-hide below 1280px
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'ai-panel-open';
const BREAKPOINT = 1280;

function getInitialOpen(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    // Default: open on desktop, closed on mobile
    return typeof window !== 'undefined' && window.innerWidth >= BREAKPOINT;
  } catch {
    return false;
  }
}

export interface UseAIPanelReturn {
  isPanelOpen: boolean;
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  /** True when viewport is below the responsive breakpoint */
  isBelowBreakpoint: boolean;
}

export function useAIPanel(): UseAIPanelReturn {
  const [isPanelOpen, setIsPanelOpen] = useState(getInitialOpen);
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < BREAKPOINT
  );
  // Track user's intent so we can restore on resize
  const userWantsOpenRef = useRef(isPanelOpen);

  // Persist to localStorage
  const persist = useCallback((open: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(open));
    } catch {
      // quota exceeded — ignore
    }
  }, []);

  const openPanel = useCallback(() => {
    userWantsOpenRef.current = true;
    setIsPanelOpen(true);
    persist(true);
  }, [persist]);

  const closePanel = useCallback(() => {
    userWantsOpenRef.current = false;
    setIsPanelOpen(false);
    persist(false);
  }, [persist]);

  const togglePanel = useCallback(() => {
    setIsPanelOpen((prev) => {
      const next = !prev;
      userWantsOpenRef.current = next;
      persist(next);
      return next;
    });
  }, [persist]);

  // Keyboard shortcut: Cmd/Ctrl+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        togglePanel();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel]);

  // Responsive breakpoint handling
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isAbove = e.matches;
      setIsBelowBreakpoint(!isAbove);

      if (!isAbove) {
        // Below breakpoint → hide panel (don't persist — it's an auto-hide)
        setIsPanelOpen(false);
      } else if (userWantsOpenRef.current) {
        // Back above breakpoint → restore if user had it open
        setIsPanelOpen(true);
      }
    };

    // Set initial
    handleChange(mql);

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return { isPanelOpen, togglePanel, openPanel, closePanel, isBelowBreakpoint };
}

export default useAIPanel;
